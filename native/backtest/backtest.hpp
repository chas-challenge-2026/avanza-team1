#ifndef BACKTEST_HPP
#define BACKTEST_HPP

#include <cstdlib>

/**
 * @file backtest.hpp
 * @brief Public interface for the native portfolio backtesting library.
 * 
 * Defines the result structure and exported functions used to execute portfolio backtests 
 * and release allocated result memory.
 */

/* Checks compiler on different OS systems so not to cause bad errors */
#if defined(_WIN32) || defined(_WIN64)
    #define EXPORT __declspec(dllexport)
#else
    #define EXPORT __attribute__((visibility("default")))
#endif

/**
 * @brief Contains the performance and risk metrics returned by a backtest.
 * 
 * The portfolio is normalized before its performance metrics are calculated.
 * Results are reported in SEK, regardless of the input currency.
 */
typedef struct
{
    double total_return;
    double annualized_return;
    double max_drawdown;
    double sharpe_ratio;
    char *currency;
} BacktestLibrary;

#ifdef __cplusplus
extern "C" 
{
#endif

    /**
     * @brief Releases a backtest result and its dynamically allocated memory.
     * 
     * Frees the currency string and the result structure itself.
     * 
     * @param result Pointer to the result returned by run_backtest().
     * 
     * @note Passing nullptr is safe.
     */
    EXPORT void free_backtest_result(BacktestLibrary *result);

    /**
     * @brief Executes a portfolio backtest using historical price data.
     * 
     * @details Builds an equally weighted, normalized portfolio from the supplied instrument prices, 
     * converts the data to SEK when necessary, and calculates the portfolio's return and risk metrics.
     * 
     * @param prices Pointer to historical price data. Each instruments price series must be stored consecutively, with @p days values per instrument.
     * @param instruments Number of instruments in the portfolio.
     * @param days Number of trading days per instrument.
     * @param currency Currency code of the supplied price data.
     * 
     * @return Pointer to the allocated BacktestLibrary result on success. 
     * @return nullptr on failure with validation, conversion, allocation or metric calculations.
     * 
     * @note At least three trading days are required.
     * @note All prices must be finite and greater than zero.
     * @note At least one instrument is required.
     * 
     * @note The returned result is converted to SEK.
     * 
     * @note The caller is responsible for releasing the returned result using free_backtest_result().
     */
    EXPORT BacktestLibrary *run_backtest(const double *prices, int instruments, int days, const char *currency);

#ifdef __cplusplus
}
#endif

#endif