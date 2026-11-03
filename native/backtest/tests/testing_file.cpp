#include "../backtest.hpp"
#include "../../logger/logger.hpp"

#include <cmath>
#include <cstring>
#include <sstream>
#include <limits>
#include <string>

#define LOG_FILE "testfile.log"

/**
 * Run with:
 *      g++ -Wall -Werror -Wextra -o testing ../risk/risk.c ../risk/helpers/helpers.c tests/testing_file.cpp backtest.cpp ../logger/logger.cpp ../fx/fx.cpp -lm -lcurl -ljansson
 */

namespace
{
    int tests_run = 0;
    int tests_failed = 0;

    void check(bool condition, const char *test_name)
    {
        tests_run++;

        std::string message = condition ? "[PASS] " : "[FAIL] ";
        message += test_name;

        if (condition)
        {
            log(LOG_INFO, LOG_FILE, message);
        }
        else 
        {
            tests_failed++;
            log(LOG_ERR, LOG_FILE, message);
        }
    }

    bool approx_equal(double actual, double expected, double tolerance = 1e-9)
    {
        return std::isfinite(actual) && std::isfinite(expected) && std::fabs(actual - expected) <= tolerance;
    }

    /**
     * Validate all returned metrics and the output currency.
     * The backtest API is expected to return SEK.
     */
    bool valid_result(const BacktestLibrary *result)
    {
        return result != nullptr && std::isfinite(result->total_return) && std::isfinite(result->annualized_return) && std::isfinite(result->max_drawdown) && std::isfinite(result->sharpe_ratio) && result->currency != nullptr && std::strcmp(result->currency, "SEK") == 0;
    }

    void test_invalid_arguments()
    {
        log(LOG_INFO, LOG_FILE, "\n\n=== Testing invalid arguments ===");
        
        const double prices[] = {100.0, 101.0, 102.0};

        check(run_backtest(nullptr, 1, 3, "SEK") == nullptr, "Null price pointer");
        check(run_backtest(prices, 1, 3, nullptr) == nullptr, "Null currency pointer");
        
        // Will also write an ERROR-line in the FX-log file.
        check(run_backtest(prices, 1, 3, "") == nullptr, "Empty currency string");
        check(run_backtest(prices, 0, 3, "SEK") == nullptr, "Zero instruments");
        check(run_backtest(prices, -1, 3, "SEK") == nullptr, "Negative instrument count");
        check(run_backtest(prices, 1, 0, "SEK") == nullptr, "Zero days");
        check(run_backtest(prices, 1, 1, "SEK") == nullptr, "One day");
        check(run_backtest(prices, 1, 2, "SEK") == nullptr, "Two days");
        check(run_backtest(prices, -1, -1, "SEK") == nullptr, "Multiple invalid arguments");

        BacktestLibrary *result = run_backtest(prices, 1, 3, "SEK");

        check(valid_result(result), "Minimum accepted number of days produdces a valid result");

        free_backtest_result(result);
    }

    void test_invalid_prices()
    {
        log(LOG_INFO, LOG_FILE, "\n\n=== Testing invalid price data ===");

        const double nan = std::numeric_limits<double>::quiet_NaN();
        const double inf = std::numeric_limits<double>::infinity();

        struct InvalidCase
        {
            const char *name;
            double prices[3];
        };

        const InvalidCase cases[] =
        {
            {"Zero initial price", {0.0, 100.0, 101.0}},
            {"Negative initial price", {-1.0, 100.0, 101.0}},
            {"Zero middle price", {100.0, 0.0, 101.0}},
            {"Negative middle price", {100.0, -1.0, 101.0}},
            {"Zero final price", {100.0, 101.0, 0.0}},
            {"Negative final price", {100.0, 101.0, -1.0}},

            {"NaN initial price", {nan, 100.0, 101.0}},
            {"NaN middle price", {100.0, nan, 101.0}},
            {"NaN final price", {100.0, 101.0, nan}},
            
            {"Infinite initial price", {inf, 100.0, 101.0}},
            {"Infinite middle price", {100.0, inf, 101.0}},
            {"Infinite final price", {100.0, 101.0, inf}},
            
            {"Negative inifinity initial price", {-inf, 100.0, 101.0}},
            {"Negative inifinity middle price", {100.0, -inf, 101.0}},
            {"Negative inifinity final price", {100.0, 101.0, -inf}},
        };

        for (const InvalidCase &test : cases)
        {
            BacktestLibrary *result = run_backtest(test.prices, 1, 3, "SEK");

            check(result == nullptr, test.name);

            free_backtest_result(result);
        }

        const double invalid_second_instrument[] = {100.0, 101.0, 102.0, 200.0, nan, 204.0};

        BacktestLibrary *result = run_backtest(invalid_second_instrument, 2, 3, "SEK");

        check(result == nullptr, "NaN in second instrument");

        free_backtest_result(result);
    }

    void test_basic_returns()
    {
        log(LOG_INFO, LOG_FILE, "\n\n=== Testing basic return calculations ===");

        const double rising[] = {100.0, 101.0, 102.0};

        BacktestLibrary *result = run_backtest(rising, 1, 3, "SEK");

        check(valid_result(result), "Rising prices produce valid finite metrics");

        if (valid_result(result))
        {
            const double expected_return = 102.0 / 100.0 - 1.0;
            const double years = 2.0 / 252.0;
            const double expected_annualized = std::pow(102.0 / 100.0, 1.0 / years) - 1.0;

            check(approx_equal(result->total_return, expected_return), "Total return for ricing prices");
            check(approx_equal(result->annualized_return, expected_annualized), "Annualized return for rising prices");
            check(approx_equal(result->max_drawdown, 0.0), "No drawdown in steadily rising prices");
            check(result->max_drawdown >= 0.0 && result->max_drawdown <= 1.0, "Drawdown is within expected bounds");
        }

        free_backtest_result(result);

        const double falling[] = {100.0, 90.0, 80.0};

        result = run_backtest(falling, 1, 3, "SEK");

        check(valid_result(result), "Falling prices produce valid finite metrics");

        if (valid_result(result))
        {
            check(approx_equal(result->total_return, -0.20), "Total return for falling prices");
            check(result->max_drawdown > 0.0, "Falling prices produce positive drawdown");
            check(result->max_drawdown <= 1.0, "Drawdown does not exceed 100 percent");
        }

        free_backtest_result(result);
    }

    void test_flat_prices()
    {
        log(LOG_INFO, LOG_FILE, "\n\n=== Testing flat prices and zero volatility ===");

        const double flat[] = {100.0, 100.0, 100.0, 100.0};

        BacktestLibrary *result = run_backtest(flat, 1, 4, "SEK");

        check(valid_result(result), "Constant prices produce a valid result");

        if (valid_result(result))
        {
            check(approx_equal(result->total_return, 0.0), "Constant prices have zero total return");
            check(approx_equal(result->annualized_return, 0.0), "Constant prices have zero annualized return");
            check(approx_equal(result->max_drawdown, 0.0), "Constant prices have zero drawdown");
            check(approx_equal(result->sharpe_ratio, 0.0), "Undefined zero-volatility Sharpe uses zero");
        }

        free_backtest_result(result);
    }

    void test_portfolio_normalization()
    {
        log(LOG_INFO, LOG_FILE, "\n\n=== Testing portfolio normalization ===");
        
        // Both instruments have the exact same relative return.
        const double prices[] = {100.0, 110.0, 120.0, 200.0, 220.0, 240.0};

        BacktestLibrary *result = run_backtest(prices, 2, 3, "SEK");

        check(valid_result(result), "Two-instrument portfolio produces valid metrics");

        if (valid_result(result))
        {
            check(approx_equal(result->total_return, 0.20), "Equal relative returns give 20 percent portfolio return");
            check(approx_equal(result->max_drawdown, 0.0), "Increasing normalized portfolio has zero drawdown");
        }

        free_backtest_result(result);

        // Instrument 1: 100 -> 200 (100% return)
        // Instrument 2: 1000 -> 1100 (10% return)
        // Equal-weight portfolio return = 55%.
        const double different_returns[] = {100.0, 150.0, 200.0, 1000.0, 1050.0, 1100.0};

        result = run_backtest(different_returns, 2, 3, "SEK");

        check(valid_result(result), "Different starting prices produce valid metrics");

        if (valid_result(result))
        {
            check(approx_equal(result->total_return, 0.55), "Portfolio weights are equal after normalization");
        }

        free_backtest_result(result);
    }

    void test_drawdown_edge_cases()
    {
        log(LOG_INFO, LOG_FILE, "\n\n=== Testing drawdown edge cases ===");

        const double drawdown[] = {100.0, 200.0, 100.0};

        BacktestLibrary *result = run_backtest(drawdown, 1, 3, "SEK");

        check(valid_result(result), "Peak-to-trough prices produce valid metrics");

        if (valid_result(result))
        {
            check(approx_equal(result->max_drawdown, 0.50), "Peak-to-trough drawdown is 50 percent");
        }

        free_backtest_result(result);

        const double recovery[] = {100.0, 80.0, 100.0, 120.0};

        result = run_backtest(recovery, 1, 4, "SEK");

        check(valid_result(result), "Recovered prices produce valid metrics");

        if (valid_result(result))
        {
            check(approx_equal(result->max_drawdown, 0.20), "Recovery does not erase historcal maximum drawdown");
        }

        free_backtest_result(result);

        const double repeated_decline[] = {100.0, 80.0, 90.0, 60.0};

        result = run_backtest(repeated_decline, 1, 4, "SEK");

        check(valid_result(result), "Repeated declines produce valid metrics");

        if (valid_result(result))
        {
            check(approx_equal(result->max_drawdown, 0.40), "Maximum drawdown uses the historical peak");
        }

        free_backtest_result(result);
    }

    void test_multiple_instruments()
    {
        log(LOG_INFO, LOG_FILE, "\n\n=== Testing multiple instruments ===");

        const double one_instrument[] = {100.0, 101.0, 103.0};
        const double two_identical_instruments[] = {100.0, 101.0, 103.0, 500.0, 505.0, 515.0};

        BacktestLibrary *single = run_backtest(one_instrument, 1, 3, "SEK");
        BacktestLibrary *multiple = run_backtest(two_identical_instruments, 2, 3, "SEK");

        check(valid_result(single), "Single instrument result is valid");
        check(valid_result(multiple), "Multiple instrument result is valid");

        if (valid_result(single) && valid_result(multiple))
        {
            check(approx_equal(single->total_return, multiple->total_return), "Identical relative performance preserves total return");
            check(approx_equal(single->max_drawdown, multiple->max_drawdown), "Identical relative performance preserves drawdown");
            check(approx_equal(single->sharpe_ratio, multiple->sharpe_ratio), "Identical relative performance preserves Sharpe ratio");
        }

        free_backtest_result(single);
        free_backtest_result(multiple);
    }

    void test_extreme_prices()
    {
        log(LOG_INFO, LOG_FILE, "\n\n=== Testing extreme price values ===");

        const double extreme_prices[] = {1e-308, 1e308, 1e-308};

        BacktestLibrary *result = run_backtest(extreme_prices, 1, 3, "SEK");

        check(result == nullptr, "Extreme prices changes that cause overflow are rejected");

        free_backtest_result(result);
    }

    void test_free_function()
    {
        log(LOG_INFO, LOG_FILE, "\n\n=== Testing memory management ===");

        free_backtest_result(nullptr);

        check(true, "Freeing nullptr does not crash");

        const double prices[] = {100.0, 101.0, 102.0};

        BacktestLibrary *result = run_backtest(prices, 1, 3, "SEK");

        check(valid_result(result), "Result allocation succeeds");

        free_backtest_result(result);

        check(true, "Allocated result can be freed");
    }
}

int main()
{
    std::ostringstream summary;

    log(LOG_INFO, LOG_FILE, "========================================");
    log(LOG_INFO, LOG_FILE, "    Backtest module edge-case tests");
    log(LOG_INFO, LOG_FILE, "========================================");

    test_invalid_arguments();
    test_invalid_prices();
    test_basic_returns();
    test_flat_prices();
    test_portfolio_normalization();
    test_drawdown_edge_cases();
    test_multiple_instruments();
    test_extreme_prices();
    test_free_function();

    summary << "\n===== TEST SUMMARY =====\n";
    summary << "Tests run:    " << tests_run << "\n";
    summary << "Tests passed: " << tests_run - tests_failed << "\n";
    summary << "Tests failed: " << tests_failed;
    summary << "\n========================";
    log(LOG_INFO, LOG_FILE, summary.str());

    return tests_failed == 0 ? 0 : 1;
}