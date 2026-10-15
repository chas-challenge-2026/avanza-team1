/**
 * @file test_risk.c
 * @brief Tests for the risk calculation functions.
 * 
 * Tests cover valid inputs, invalid inputs and important edge cases.
 * The program returns a non-zero exit code if any test fails.
 */

#include <stdio.h>
#include <math.h>

#include "../risk.h"

static size_t tests_run = 0;
static size_t tests_failed = 0;

/* Compare floating-point values within an acceptable tolerance. */
static int approx_equal(double a, double b, double tolerance)
{
    return fabs(a - b) <= tolerance;
}

/**
 * @brief Check a successful risk calculation against an expected value
 * 
 * Records the test result and prints a PASS/FAIL message.
 */
static void check(const char *test_name, RiskStatus status, double actual, double expected, double tolerance)
{
    tests_run++;
    if (status == RISK_SUCCESS && approx_equal(actual, expected, tolerance))
    {
        printf("[PASS] %s (got %.6f)\r\n", test_name, actual);
    }
    else if (status != RISK_SUCCESS)
    {
        tests_failed++;
        printf("[FAIL] %s -> calculation returned an error\r\n", test_name);
    }
    else
    {
        tests_failed++;
        printf("[FAIL] %s -> expected %.6f but got %.6f\r\n", test_name, expected, actual);
    }
}

/**
 * @brief Check that a risk calculation rejects invalid input.
 */
static void check_invalid(const char *test_name, RiskStatus status)
{
    tests_run++;
    if (status == RISK_INVALID_INPUT)
    {
        printf("[PASS] %s\r\n", test_name);
    }
    else
    {
        tests_failed++;
        printf("[FAIL] %s -> expected RISK_INVALID_INPUT but got %d\r\n", test_name, status);
    }
}

/**
 * @brief Check that a risk calculation returns insufficient data.
 */
static void check_insufficient_data(const char *test_name, RiskStatus status)
{
    tests_run++;
    if (status == RISK_INSUFFICIENT_DATA)
    {
        printf("[PASS] %s\r\n", test_name);
    }
    else 
    {
        tests_failed++;
        printf("[FAIL] %s -> expected RISK_INSUFFICIENT_DATA\r\n", test_name);
    }
}

static void check_zero_volatility(const char *test_name, RiskStatus status)
{
    tests_run++;
    if (status == RISK_ZERO_VOLATILITY)
    {
        printf("[PASS] %s\r\n", test_name);
    }
    else 
    {
        tests_failed++;
        printf("[FAIL] %s -> expected RISK_ZERO_VOLATILITY\r\n", test_name);
    }
}

int main(void)
{
    double prices[] = {100.00, 101.50, 99.80, 102.30, 104.10, 
                        103.00, 105.75, 101.20, 102.00, 103.50};
    size_t size = sizeof(prices) / sizeof(prices[0]);

    double too_few[] = {100.00, 101.00};
    double three_prices[] = {100.00, 101.00, 102.00};
    double flat_prices[] = {100.00, 100.00, 100.00, 100.00, 100.00};
    double rising_prices[] = {100.00, 101.00, 102.00, 103.00, 104.00, 105.00};
    double result = 0.0;
    double rising_vol = 0.0;
    double rising_sharpe = 0.0;
    RiskStatus status;

    /* --- Annual volatility and Sharpe Ratio --- */

    /* Regression test using independently calculated expected values. */
    status = calculate_annual_volatility(prices, size, &result);
    check("annual volatility on known price series", status, result, 0.365810, 0.0001);

    status = calculate_sharpe(prices, size, DEFAULT_RISK_FREE_RATE, &result);
    check("Sharpe ratio on known price series", status, result, 2.7217, 0.001);

    /* Fewer than three prices should be rejected. */
    status = calculate_annual_volatility(too_few, 2, &result);
    check_insufficient_data("volatility with fewer than 3 prices returns insufficient data", status);
    status = calculate_sharpe(too_few, 2, DEFAULT_RISK_FREE_RATE, &result);
    check_insufficient_data("sharpe with fewer than 3 prices returns insufficient data", status);

    /* Three prices is the minimum input for volatility and Sharpe calculations. */
    status = calculate_annual_volatility(three_prices, 3, &result);
    check("volatility with exactly three prices", status, result, 0.001111, 1e-6);
    status = calculate_sharpe(three_prices, 3, DEFAULT_RISK_FREE_RATE, &result);
    check("sharpe with exactly three prices", status, result, 2229.6214, 1e-4);

    /* Flat prices should produce zero volatility and reject Sharpe calculations. */
    status = calculate_annual_volatility(flat_prices, 5, &result);
    check("volatility on flat prices is 0", status, result, 0.0, 1e-12);
    status = calculate_sharpe(flat_prices, 5, DEFAULT_RISK_FREE_RATE, &result);
    check_zero_volatility("sharpe on flat prices avoids divide-by-zero", status);

    /* Rising prices should produce positive volatility and a positive Sharpe Ratio. */
    RiskStatus rising_vol_status = calculate_annual_volatility(rising_prices, 6, &rising_vol);
    RiskStatus rising_sharpe_status = calculate_sharpe(rising_prices, 6, DEFAULT_RISK_FREE_RATE, &rising_sharpe);
    
    tests_run += 2;
    if (rising_vol_status == RISK_SUCCESS && rising_vol > 0.0)
    {
        printf("[PASS] rising prices produce low volatility (%.6f)\r\n", rising_vol);
    }
    else
    {
        tests_failed++;
        printf("[FAIL] rising prices volatility was not positive (%.6f)\r\n", rising_vol);
    }

    if (rising_sharpe_status == RISK_SUCCESS && rising_sharpe > 0.0)
    {
        printf("[PASS] rising prices produce a positive sharpe ratio (%.6f)\r\n", rising_sharpe);
    }
    else
    {
        tests_failed++;
        printf("[FAIL] rising prices Sharpe ratio was not positive (%.6f)\r\n", rising_sharpe);
    }

    /* --- Maximum drawdown --- */

    /* Regression test using an independently calculated expected value. */
    status = calculate_max_drawdown(prices, size, &result);
    check("max drawdown on known price series", status, result, 0.043026, 0.0001);

    /* Fewer than two prices should be rejected. */
    double single_price[] = {100.00};
    status = calculate_max_drawdown(single_price, 1, &result);
    check_insufficient_data("max drawdown with fewer than 2 prices returns insufficient data", status);

    /* Two prices is the minimum valid input for drawdown. */
    double two_prices[] = {100.00, 90.00};
    status = calculate_max_drawdown(two_prices, 2, &result);
    check("max drawdown with exactly two prices", status, result, 0.10, 1e-9);

    /* Rising prices should produce a valid drawdown of 0.0. */
    status = calculate_max_drawdown(rising_prices, 6, &result);
    check("max drawdown on rising prices is 0", status, result, 0.0, 1e-12);

    /* Falling prices should measure drawdown from the initial peak to the final price. */
    double falling_prices[] = {105.00, 104.00, 102.00, 100.00, 98.0};
    double expected_falling_dd = (105.00 - 98.00) / 105.00;
    status = calculate_max_drawdown(falling_prices, 5, &result);
    check("max drawdown on falling prices matches first-to-last drop", status, result, expected_falling_dd, 1e-9);

    /* Flat prices should produce a valid drawdown of 0.0. */
    status = calculate_max_drawdown(flat_prices, 5, &result);
    check("max drawdown on flat prices is 0", status, result, 0.0, 1e-12);

    /* A previous drawdown should remain valid after a later new peak. */
    double drop_before_peak[] = {100.00, 80.00, 120.00};
    status = calculate_max_drawdown(drop_before_peak, 3, &result);
    check("max drawdown preserves a drawdown before a later peak", status, result, 0.2, 1e-9);

    /* Verify that drawdown uses the latest peak and keeps the largest decline. */
    double double_dip[] = {100.0, 90.00, 110.00, 88.00, 95.00};
    status = calculate_max_drawdown(double_dip, 5, &result);
    check("max drawdown correctly tracks a new peak and a deeper second drop", status, result, 0.2, 1e-9);

    /* --- EWMA Volatility --- */

    /* Regression test using an independently calculated expected value. */
    status = calculate_ewma_volatility(prices, size, DEFAULT_EWMA_LAMBDA, &result);
    check("ewma volatility on known price series", status, result, 0.294032, 0.0001);

    /* Fewer than two prices should be rejected. */
    status = calculate_ewma_volatility(single_price, 1, DEFAULT_EWMA_LAMBDA, &result);
    check_insufficient_data("ewma volatility with fewer than 2 prices returns insufficient data", status);

    /* Lambda must be strictly between 0 and 1. */
    status = calculate_ewma_volatility(prices, size, 0.0, &result);
    check_invalid("ewma volatility with lambda <= 0 returns invalid", status);
    status = calculate_ewma_volatility(prices, size, 1.0, &result);
    check_invalid("ewma volatility with lambda >=1 returns invalid", status);

    /* Flat prices should produce a valid EWMA volatility of 0.0. */
    status = calculate_ewma_volatility(flat_prices, 5, DEFAULT_EWMA_LAMBDA, &result);
    check("ewma volatility on flat prices is 0", status, result, 0.0, 1e-12);

    /* --- Regular risk functions on individual price windows --- */

    /*
     * Test the regular functions directly on overlapping windows.
     * This verifies that each function handles a selected period.
     * It does not test a separate rolling implementation.
     */
    double window_prices[] = {100.00, 101.00, 102.00, 100.00, 103.00, 104.00};
    size_t window_size = 3;
    size_t window_price_count = sizeof(window_prices) / sizeof(window_prices[0]);
    size_t window_count = window_price_count - window_size + 1;

    for (size_t i = 0; i < window_count; i++)
    {
        double window_volatility = 0.0;
        double window_sharpe = 0.0;
        double window_drawdown = 0.0;

        char test_name[100];

        status = calculate_annual_volatility(&window_prices[i], window_size, &window_volatility);

        snprintf(test_name, sizeof(test_name), "volatility on price window %zu", i + 1);

        tests_run++;

        if (status == RISK_SUCCESS && isfinite(window_volatility))
        {
            printf("[PASS] %s\r\n", test_name);
        }
        else
        {
            tests_failed++;
            printf("[FAIL] %s -> calculation failed or returned non-finite value\r\n", test_name);
        }

        status = calculate_sharpe(&window_prices[i], window_size, DEFAULT_RISK_FREE_RATE, &window_sharpe);
        snprintf(test_name, sizeof(test_name), "Sharpe ratio on price window %zu", i + 1);

        tests_run++;

        if (status == RISK_SUCCESS && isfinite(window_sharpe))
        {
            printf("[PASS] %s\r\n", test_name);
        }
        else
        {
            tests_failed++;
            printf("[FAIL] %s -> calculations failed or returned non-finite value\r\n", test_name);
        }

        status = calculate_max_drawdown(&window_prices[i], window_size, &window_drawdown);
        snprintf(test_name, sizeof(test_name), "max drawdown on price window %zu: %.4f%%", i + 1, window_drawdown * 100);

        tests_run++;

        if (status == RISK_SUCCESS && isfinite(window_drawdown))
        {
            printf("[PASS] %s\r\n", test_name);
        }
        else
        {
            tests_failed++;
            printf("[FAIL] %s -> calculations failed or returned non-finite value\r\n", test_name);
        }
    }
    
    /* --- NULL prices --- */
    check_invalid("annual volatility with NULL prices returns invalid", calculate_annual_volatility(NULL, size, &result));
    check_invalid("sharpe with NULL prices returns invalid", calculate_sharpe(NULL, size, DEFAULT_RISK_FREE_RATE, &result));
    check_invalid("max drawdown with NULL prices returns invalid", calculate_max_drawdown(NULL, size, &result));
    check_invalid("ewma volatility with NULL prices returns invalid", calculate_ewma_volatility(NULL, size, DEFAULT_EWMA_LAMBDA, &result));
    
    /* --- Size == 0 --- */
    check_invalid("annual volatility with zero prices returns invalid", calculate_annual_volatility(prices, 0, &result));
    check_invalid("sharpe with zero prices returns invalid", calculate_sharpe(prices, 0, DEFAULT_RISK_FREE_RATE, &result));
    check_invalid("max drawdown with zero prices returns invalid", calculate_max_drawdown(prices, 0, &result));
    check_invalid("ewma volatility with zero prices returns invalid", calculate_ewma_volatility(prices, 0, DEFAULT_EWMA_LAMBDA, &result));

    /* --- NULL result pointer --- */
    check_invalid("annual volatility with NULL result returns invalid", calculate_annual_volatility(prices, size, NULL));
    check_invalid("sharpe with NULL result returns invalid", calculate_sharpe(prices, size, DEFAULT_RISK_FREE_RATE, NULL));
    check_invalid("max drawdown with NULL result returns invalid", calculate_max_drawdown(prices, size, NULL));
    check_invalid("ewma volatility with NULL result returns invalid", calculate_ewma_volatility(prices, size, DEFAULT_EWMA_LAMBDA, NULL));

    printf("\r\n%zu/%zu tests passed\r\n", tests_run - tests_failed, tests_run);

    return tests_failed == 0 ? 0 : 1;
}