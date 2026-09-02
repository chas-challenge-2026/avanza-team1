#include <stdio.h>
#include <math.h>

#include "../risk.h"

static int tests_run = 0;
static int tests_failed = 0;

static int approx_equal(double a, double b, double tolerance)
{
    return fabs(a - b) <= tolerance;
}

static void check(const char *test_name, double actual, double expected, double tolerance)
{
    tests_run++;
    if (approx_equal(actual, expected, tolerance))
    {
        printf("[PASS] %s (got %.6f)\r\n", test_name, actual);
    }
    else
    {
        tests_failed++;
        printf("[FAIL] %s -> expected %.6f but got %.6f\r\n", test_name, expected, actual);
    }
}


int main()
{
    /* TEST 1: Known values, cross-checked */
    double prices[] = {100.00, 101.50, 99.80, 102.30, 104.10, 
                        103.00, 105.75, 101.20, 102.00, 103.50};
    int size = sizeof(prices) / sizeof(prices[0]);

    double vol = calculate_volatility(prices, size);
    check("volatility on known price series", vol, 0.023044, 0.0001);

    double sharpe = calculate_sharpe(prices, size, SAVINGS_INTEREST_RATE);
    check("sharpe on known price series", sharpe, 2.7217, 0.001);

    /* TEST 2: Fewer prices than three should return zero, not crash */
    double too_few[] = {100.00, 101.00};
    check("volatility with < 3 prices returns 0", calculate_volatility(too_few, 2), 0.0, 0.0);
    check("sharpe with < 3 prices returns 0", calculate_sharpe(too_few, 2, SAVINGS_INTEREST_RATE), 0.0, 0.0);

    /* TEST 3: Flat/constant prices should give zero volatility */
    double flat_prices[] = {100.00, 100.00, 100.00, 100.00, 100.00};
    check("volatility on flat prices is 0", calculate_volatility(flat_prices, 5), 0.0, 1e-12);
    check("sharpe on flat prices avoids divide-by-zero", calculate_sharpe(flat_prices, 5, SAVINGS_INTEREST_RATE), 0.0, 0.0);

    /* TEST 4: Steadily rising prices should give low volatility and positive sharpe */
    double rising_prices[] = {100.00, 101.00, 102.00, 103.00, 104.00, 105.00};
    double rising_vol = calculate_volatility(rising_prices, 6);
    double rising_sharpe = calculate_sharpe(rising_prices, 6, SAVINGS_INTEREST_RATE);
    
    tests_run += 2;
    if (rising_vol >= 0.0 && rising_vol < 0.01)
    {
        printf("[PASS] rising prices produce low volatility (%.6f)\r\n", rising_vol);
    }
    else
    {
        tests_failed++;
        printf("[FAIL] rising prices volatility out of expected range (%.6f)\r\n", rising_vol);
    }

    if (rising_sharpe > 0.0)
    {
        printf("[PASS] rising prices produce a positive sharpe ratio (%.6f)\r\n", rising_sharpe);
    }
    else
    {
        tests_failed++;
        printf("[FAIL] rising prices sharpe did not equal the expected positive, got %.6f\r\n", rising_sharpe);
    }

    printf("\r\n%d/%d tests passed\r\n", tests_run - tests_failed, tests_run);

    return tests_failed == 0 ? 0 : 1;    
}