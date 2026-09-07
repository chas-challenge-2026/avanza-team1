/*  Test suite for the risk-engine functions in risk.c. Not a formal unit test framework - each check() call is one assertion,
    with a plain PASS/FAIL line printed for it.
    Run with:
        gcc -Wall -Wextra -Werror -o test_risk risk.c test/test_risk.c -lm 
        ./test_risk
    Exits with a non-zero status if any check fails, so this can be wired into a Makefile "make test" target or CI later.
    
    Tests are grouped by which function they exercise, not numbered by position - that way inserting, removing, or splitting
    a test never requires renumbering anything else. Each check()'s test_name string is the identifier that shows up in PASS/FAIL output,
    so it should be descriptive enough to identify the test on its own*/

#include <stdio.h>
#include <math.h>

#include "../risk.h"

static int tests_run = 0;
static int tests_failed = 0;

/*  True if a and b are within 'tolerance' of each other. Needed because double arithmetic almost never produces exact equality
    after a chain of operations (subtraction, division, sqrt, etc.), so 'actual == expected' would fail spuriously even for correct code. */
static int approx_equal(double a, double b, double tolerance)
{
    return fabs(a - b) <= tolerance;
}

/*  Runs one assertion: compares actual vs. expected within tolerance,
    prints a PASS/FAIL line, and updates the running totals used for the final summary and exit code. */
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
    double prices[] = {100.00, 101.50, 99.80, 102.30, 104.10, 
                        103.00, 105.75, 101.20, 102.00, 103.50};
    int size = sizeof(prices) / sizeof(prices[0]);

    double too_few[] = {100.00, 101.00};
    double three_prices[] = {100.00, 101.00, 102.00};
    double flat_prices[] = {100.00, 100.00, 100.00, 100.00, 100.00};
    double rising_prices[] = {100.00, 101.00, 102.00, 103.00, 104.00, 105.00};

    /*  --- calculate_annual_volatility & calculate_sharpe ---
        Grouped together since every price series here is fed to both:
        they share the same input validity rules (needs 3+ prices) and
        the same underlying daily-return calculation. */

    /*  Known-value regression test. Expected figures were computed independently in Python (not by running this code and
        copying its output), so this actually catches a bug if the formulas ever change, 
        rather than just re-confirming whatever the code currently does. */
    double vol = calculate_annual_volatility(prices, size);
    check("annual volatility on known price series", vol, 0.365810, 0.0001);

    double sharpe = calculate_sharpe(prices, size, SAVINGS_INTEREST_RATE);
    check("sharpe on known price series", sharpe, 2.7217, 0.001);

    /*  Fewer prices than three should return 0.0 cleanly, not crash or read out of bounds. */
    check("volatility with < 3 prices returns 0", calculate_annual_volatility(too_few, 2), 0.0, 0.0);
    check("sharpe with < 3 prices returns 0", calculate_sharpe(too_few, 2, SAVINGS_INTEREST_RATE), 0.0, 0.0);

    /*  Exactly three prices is the minimum valid input (as opposed to the too-few case above).
        With only two returns, sample variance divides by (2-1)=1, so volatility can be tiny and Sharpe can swing to an extreme value
        - this documents that instability is expected at the boundary, not a bug. */
    check("volatility with exactly three prices", calculate_annual_volatility(three_prices, 3), 0.001111, 1e-6);
    check("sharpe with exactly three prices", calculate_sharpe(three_prices, 3, SAVINGS_INTEREST_RATE), 2229.6214, 1e-4);

    /*  Flat prices produce every daily return as exactly 0%, so volatility should be exactly 0 - and calculate_sharpe should
        hit its volatility == 0.0 guard and return 0.0 instead of dividing by zero. */
    check("volatility on flat prices is 0", calculate_annual_volatility(flat_prices, 5), 0.0, 1e-12);
    check("sharpe on flat prices avoids divide-by-zero", calculate_sharpe(flat_prices, 5, SAVINGS_INTEREST_RATE), 0.0, 0.0);

    /*  Steadily rising prices should give low volatility (little day-to day noise)
        and a positive Sharpe ratio (consistent gains above the risk-free rate).
        These are range/sign checks rather than exact values, since "low" and "positive" are what actually matters here,
        not a specific number. */
    double rising_vol = calculate_annual_volatility(rising_prices, 6);
    double rising_sharpe = calculate_sharpe(rising_prices, 6, SAVINGS_INTEREST_RATE);
    
    tests_run += 2;
    if (rising_vol >= 0.0 && rising_vol < 0.16)
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

    /*  --- calculate_max_drawdown --- */

    /*  Known-value regression test, same approach as the volatility one above - expected value computed independently. */
    check("max drawdown on known price series", calculate_max_drawdown(prices, size), 0.043026, 0.0001);

    /*  Fewer than two prices should return 0.0 cleanly - a single price has nothing to compare against. */
    double single_price[] = {100.00};
    check("max drawdown with < 2 prices returns 0", calculate_max_drawdown(single_price, 1), 0.0, 0.0);

    /*  Exactly two prices is the minimum valid input: one peak, one later price to measure the drop against. */
    double two_prices[] = {100.00, 90.00};
    check("max drawdown with exactly two prices", calculate_max_drawdown(two_prices, 2), 0.10, 1e-9);

    /*  Strictly rising prices should never draw down, since the running peak updates every single day,
    and price never falls below it. */
    check("max drawdown on rising prices is 0", calculate_max_drawdown(rising_prices, 6), 0.0, 1e-12);

    /*  Strictly falling prices should draw down from the first price (which is the only peak that's ever set)
    all the way to the last price */
    double falling_prices[] = {105.00, 104.00, 102.00, 100.00, 98.0};
    double expected_falling_dd = (105.00 - 98.00) / 105.00;
    check("max drawdown on falling prices matches first-to-last drop", calculate_max_drawdown(falling_prices, 5), expected_falling_dd, 1e-9);

    /*  Flat prices should never draw down, since price never falls below the running peak*/
    check("max drawdown on flat prices is 0", calculate_max_drawdown(flat_prices, 5), 0.0, 1e-12);

    /*  A drop that happens before a new all-time high is reached. This checks two things at once:
        that the drop is correctly measuread against the original peak (not against the higher price that hasn't happened yet),
        and that reaching a new high afterward doesn't erase or reduce the drawdown that was already recorded. */
    double drop_before_peak[] = {100.00, 80.00, 120.00};
    check("max drawdown ignores a low point that occurred before the peak", calculate_max_drawdown(drop_before_peak, 3), 0.2, 1e-9);

    /*  Peak, dip, recovery to a new higher peak, then a second, deeper dip.
        This is the case simpler tests above don't cover: does the function correctly move the running peak forward to the new high,
        and report the larger of the two drawdowns rather than getting anchored to the first peak it ever saw? */
    double double_dip[] = {100.0, 90.00, 110.00, 88.00, 95.00};
    check("max drawdown correctly tracks a new peak and a deeper second drop", calculate_max_drawdown(double_dip, 5), 0.2, 1e-9);

    printf("\r\n%d/%d tests passed\r\n", tests_run - tests_failed, tests_run);

    return tests_failed == 0 ? 0 : 1;    
}