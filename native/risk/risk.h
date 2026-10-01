#ifndef RISK_H
#define RISK_H

#include <stddef.h>

#ifdef __cplusplus
extern "C" {
#endif // __cplusplus

/**
 * @file risk.h
 * @brief Functions for calculating historical portfolio risk metrics.
 * 
 * Price arrays are expected to contain historical prices in chronological order,
 * with the oldest price first. Functions do not modify the input array.
 */

/** Number of trading days assumed in annual calculations. */
#define ANNUAL_TRADING_DAYS     252.0

/** 
 * Default annual risk-free rate used by the Sharpe ratio calculation.
 * 
 * This is a configurable assumption and does not represent a guaranteed market rate, can be changed later if so needed.
 */
#define DEFAULT_RISK_FREE_RATE  0.03

/** Default EWMA decay factor. */
#define DEFAULT_EWMA_LAMBDA     0.94

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
 * @param result Output annualized volatility as a decimal fraction (e.g. 0.35 == 35%).
 * 
 * @return RISK_SUCCESS on success.
 * @return RISK_INVALID_INPUT if prices, size or result is invalid.
 * @return RISK_INSUFFICIENT_DATA if fewer than 3 prices are provided.
 * 
 * @note The output value is valid only when RISK_SUCCESS is returned.
 */
RiskStatus calculate_annual_volatility(const double prices[], size_t size, double *result);

/**
 * @brief Calculate the annualized Sharpe ratio.
 * 
 * Calculates the mean daily return relative to the daily equivalent of
 * the specified annual risk-free rate, then scales the result to an annualized Sharpe ratio.
 * 
 * @param prices Historical closing prices, oldest first.
 * @param size Number of prices. Must be at least 3.
 * @param risk_free_rate Annual risk-free rate, e.g. DEFAULT_RISK_FREE_RATE
 * @param result Output annualized Sharpe ratio.
 * 
 * @return RISK_SUCCESS on success.
 * @return RISK_INVALID_INPUT if prices, size, result or risk_free_rate is invalid.
 * @return RISK_INSUFFICIENT_DATA if fewer than 3 prices are provided.
 * @return RISK_ZERO_VOLATILITY if the return volatility is effectively zero. 
 * 
 * @note The output value is valid only when RISK_SUCCESS is returned.
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
 * @return RISK_INVALID_INPUT if price, size or result is invalid.
 * @return RISK_INSUFFICIENT_DATA if fewer than 2 prices are provided.
 * 
 * @note A successful result of 0.0 means that no drawdown occurred.
 * @note The output value is valid only when RISK_SUCCESS is returned.
 */
RiskStatus calculate_max_drawdown(const double prices[], size_t size, double *result);

/**
 * @brief Calculate annualized EWMA (Exponentially Weighted Moving Average) volatility.
 * 
 * Applies exponentially decreasing weights to squared daily returns,
 * giving more influence to recent observations. 
 * The variance estimate assumes a zero mean return.
 * 
 * @param prices Historical closing prices, oldest first.
 * @param size Number of prices. Must be at least 2.
 * @param lambda EWMA decay factor in the range (0, 1). Higher values give more weight to older observations.
 * @param result Output annualized EWMA volatility as a decimal fraction.
 * 
 * @return RISK_SUCCESS on success.
 * @return RISK_INVALID_INPUT if prices, size, result or lambda is invalid.
 * @return RISK_INSUFFICIENT_DATA if fewer than 2 prices are provided.
 * 
 * @note The output value is valid only when RISK_SUCCESS is returned.
*/
RiskStatus calculate_ewma_volatility(const double prices[], size_t size, double lambda, double *result);

/**
 * @brief Calculate rolling annualized historical volatility.
 * 
 * Calculates annualized historical volatility for every consecutive window of the specified size.
 * Each window contains @p window prices and therefore @p window - 1 daily returns.
 * 
 * The first result corresponds to prices[0 ... window - 1].
 * The next result corresponds to prices[1 ... window].
 * 
 * The caller must provide an output array containing at least (size - window + 1) elements.
 * 
 * @param prices Historical closing prices, oldest first.
 * @param size Number of prices.
 * @param window Number of prices included in each calculation. Must be at least 3 and no greater than @p size.
 * @param results Output array containing rolling annualized volatility values.
 * 
 * @return RISK_SUCCESS on success.
 * @return RISK_INVALID_INPUT if prices, size or result is invalid.
 * @return RISK_INSUFFICIENT_DATA if window is less than 3 or greater than size.
 * 
 * @note The output array is valid only when RISK_SUCCESS is returned.
 */
RiskStatus calculate_rolling_volatility(const double prices[], size_t size, size_t window, double results[]);

/**
 * @brief Calculate rolling annualized Sharpe ratio.
 * 
 * Calculates an annualized Sharpe ratio for every consecutive window of the specified size.
 * Each window contains @p window prices and therefore @p window - 1 daily returns.
 * 
 * The first result corresponds to prices[0 ... window - 1].
 * The next result corresponds to prices[1 ... window].
 * 
 * The caller must provide an output array containing at least (size - window + 1) elements.
 * 
 * @param prices Historical closing prices, oldest first.
 * @param size Number of prices.
 * @param window Number of prices included in each calculation. Must be at least 3 and no greater than @p size.
 * @param risk_free_rate Annual risk-free rate, e.g. DEFAULT_RISK_FREE_RATE.
 * @param results Output array containing rolling annualized Sharpe ratio values.
 * 
 * @return RISK_SUCCESS on success.
 * @return RISK_INVALID_INPUT if prices, size, result or risk_free_rate is invalid.
 * @return RISK_INSUFFICIENT_DATA if window is less than 3 or greater than size.
 * @return RISK_ZERO_VOLATILITY if a window has effectively zero return volatility.
 * 
 * @note The output array is valid only when RISK_SUCCESS is returned.
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
 * @param window Number of prices included in each calculation. Must be at least 2 and no greater than @p size.
 * @param results Output array containing rolling maximum drawdown values as positive decimal fractions.
 * 
 * @return RISK_SUCCESS on success.
 * @return RISK_INVALID_INPUT if prices, size or results is invalid.
 * @return RISK_INSUFFICIENT_DATA if window is less than 2 or greater than size.
 * 
 * @note A successful result of 0.0 means that no drawdown occurred within that window.
 * @note The output array is valid only when RISK_SUCCESS is returned.
 */
RiskStatus calculate_rolling_max_drawdown(const double prices[], size_t size, size_t window, double results[]);

#ifdef __cplusplus
}
#endif // __cplusplus

#endif