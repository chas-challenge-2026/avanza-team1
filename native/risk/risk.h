#ifndef RISK_H
#define RISK_H

#include <stddef.h>

/**
 * @file risk.h
 * @brief Functions for calculating historical portfolio risk metrics.
 * 
 * Price arrays are expected to contain historical prices in chronological order,
 * with the oldest price first. Functions do not modify the input array.
 */

/**  Number of trading days assumed in annual calculations. */
#define ANNUAL_TRADING_DAYS     252.0

/** 
 * Default annual risk-free rate used by the default Sharpe ratio calculation.
 * 
 * This is a configurable assumption and does not represent a guaranteed market rate. 
 */
#define DEFAULT_RISK_FREE_RATE   0.03

/**
 * @brief Status returned by risk calculation functions.
 */
typedef enum
{
    RISK_SUCCESS = 0,
    RISK_INVALID_INPUT,
    RISK_INSUFFICIENT_DATA,
    RISK_ZERO_VOLATILITY,
} RiskStatus;

/**
 * @brief Calculate annualized historical volatility.
 * 
 * Uses the sample standard deviation of daily returns and annualizes it
 * using the square-root-of-time rule.
 * 
 * @param prices Historical closing prices, oldest first.
 * @param size Number of prices. Must be at least 3.
 * @param result Output value as a decimal fraction (e.g. 0.35 == 35%).
 * 
 * @return RISK_SUCCESS on success.
 * @return RISK_INVALID_INPUT if the input is invalid or result is NULL.
 * 
 * On RISK_INVALID_INPUT, result is set to 0.0 when possible.
 */
RiskStatus calculate_annual_volatility(const double prices[], size_t size, double *result);

/**
 * @brief Calculate the annualized Sharpe ratio.
 * 
 * Compares the average return against the risk-free rate and adjusts
 * the result for the volatility of the returns.
 * 
 * @param prices Historical closing prices, oldest first.
 * @param size Number of prices. Must be at least 3.
 * @param risk_free_rate Annual risk-free rate, e.g. DEFAULT_RISK_FREE_RATE
 * @param result Output Sharpe ratio.
 * 
 * @return RISK_SUCCESS on success.
 * @return RISK_INVALID_INPUT if the input is invalid, result is NULL, 
 * risk_free_rate is not finite or risk_free_rate is <= -1.0.
 * @return RISK_ZERO_VOLATILITY if the return volatility is zero. 
 * 
 * On RISK_INVALID_INPUT, result is set to 0.0 when possible.
 */
RiskStatus calculate_sharpe(const double prices[], size_t size, double risk_free_rate, double *result);

/**
 * @brief Calculate the maximum drawdown.
 * 
 * Finds the largest peak-to-trough decline in the price series.
 * 
 * @param prices Historical closing prices, oldest first.
 * @param size Number of prices. Must be at least 2.
 * @param result Output drawdown as a positive decimal fraction (e.g. 0.05 == 5%).
 * 
 * @return RISK_SUCCESS on success.
 * @return RISK_INVALID_INPUT if the input is invalid or result is NULL.
 * 
 * A valid result of 0.0 means that no drawdown occurred.
 * On RISK_INVALID_INPUT, result is set to 0.0 when possible.
 */
RiskStatus calculate_max_drawdown(const double prices[], size_t size, double *result);

/**
 * @brief Calculate annualized EWMA volatility.
 * 
 * Applies exponentially decreasing weights to squared daily returns,
 * giving more influence to recent observations.
 * 
 * @param prices Historical closing prices, oldest first.
 * @param size Number of prices. Must be at least 2.
 * @param lambda EWMA decay factor in the range (0, 1). Higher values give more weight to older observations.
 * @param result Output annualized EWMA volatility as a decimal fraction.
 * 
 * @return RISK_SUCCESS on success.
 * @return RISK_INVALID_INPUT if the input is invalid or lambda is invalid.
 * 
 * On RISK_INVALID_INPUT, result is set to 0.0 when possible.
*/
RiskStatus calculate_ewma_volatility(const double prices[], size_t size, double lambda, double *result);

/**
 * @brief Calculate rolling annualized historical volatility.
 * 
 * Calculates historical volatility for every consecutive window of the specified size.
 * 
 * For each position, the function passes one window of prices to calculate_annual_volatility().
 * 
 * The first result corresponds to prices[0 ... window - 1].
 * The next result corresponds to prices[1 ... window].
 * 
 * The caller must provide an output array containing at least (size - window + 1) elements.
 * 
 * @param prices Historical closing prices, oldest first.
 * @param size Number of prices.
 * @param window Number of prices included in each calculation.
 * @param results Output array containing rolling volatility values.
 * 
 * @return RISK_SUCCESS on success.
 * @return RISK_INVALID_INPUT if an input is invalid.
 * @return RISK_INSUFFICIENT_DATA if window is too large or too small.
 */
RiskStatus calculate_rolling_volatility(const double prices[], size_t size, size_t window, double results[]);

/**
 * @brief Calculate rolling annualized Sharpe ratio.
 * 
 * Calculates the annualized Sharpe ratio for every consecutive window of the specified size.
 * 
 * For each position, the function passes one window of prices to calculate_sharpe().
 * 
 * The first result corresponds to prices[0 ... window - 1].
 * The next result corresponds to prices[1 ... window].
 * 
 * The caller must provide an output array containing at least (size - window + 1) elements.
 * 
 * @param prices Historical closing prices, oldest first.
 * @param size Number of prices.
 * @param window Number of prices included in each calculation.
 * @param risk_free_rate Annual risk-free rate, e.g. DEFAULT_RISK_FREE_RATE.
 * @param results Output array containing rolling Sharpe ratio values.
 * 
 * @return RISK_SUCCESS on success.
 * @return RISK_INVALID_INPUT if an input is invalid.
 * @return RISK_INSUFFICIENT_DATA if window is too large or too small.
 * @return RISK_ZERO_VOLATILITY if a window has zero return volatility.
 */
RiskStatus calculate_rolling_sharpe(const double prices[], size_t size, size_t window, double risk_free_rate, double results[]);

/**
 * @brief Calculate rolling maximum drawdown.
 * 
 * Calculates the maximum drawdown for every consecutive window of the specified size.
 * 
 * For each position, the function passes one window of prices to calculate_max_drawdown().
 * 
 * The first result corresponds to prices[0 ... window - 1].
 * The next result corresponds to prices[1 ... window].
 * 
 * The caller must provide an output array containing at least (size - window + 1) elements.
 * 
 * @param prices Historical closing prices, oldest first.
 * @param size Number of prices.
 * @param window Number of prices included in each calculation.
 * @param results Output array containing rolling maximum drawdown values.
 * 
 * @return RISK_SUCCESS on success.
 * @return RISK_INVALID_INPUT if an input is invalid.
 * @return RISK_INSUFFICIENT_DATA if window is too large or too small.
 */
RiskStatus calculate_rolling_max_drawdown(const double prices[], size_t size, size_t window, double results[]);

/**
 * @brief Calculate rolling annualized EWMA volatility.
 * 
 * Calculates annualized EWMA volatility for every consecutive window of the specified size.
 * 
 * For each position, the function passes one window of prices to calculate_ewma_volatility().
 * 
 * The first result corresponds to prices[0 ... window - 1].
 * The next result corresponds to prices[1 ... window].
 * 
 * The caller must provide an output array containing at least (size - window + 1) elements.
 * 
 * @param prices Historical closing prices, oldest first.
 * @param size Number of prices.
 * @param window Number of prices included in each calculation.
 * @param lambda EWMA decay factor in the range (0, 1).
 * @param results Output array containing rolling EWMA volatility values.
 * 
 * @return RISK_SUCCESS on success.
 * @return RISK_INVALID_INPUT if an input is invalid.
 * @return RISK_INSUFFICIENT_DATA if window is too large or too small.
 */
RiskStatus calculate_rolling_ewma_volatility(const double prices[], size_t size, size_t window, double lambda, double results[]);


#endif