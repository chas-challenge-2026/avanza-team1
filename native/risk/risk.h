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
 * @details Provides functions for calculating historical volatility, annualized Sharpe ratios, maximum drawdown and EWMA (Exponentially Weighted Moving Average) volatility.
 * Price arrays are expected to contain historical prices in chronological order, with the oldest price first. Functions do not modify the input array.
 * Annualized metrics assume 252 annual trading days per year.
 */

/** Number of trading days assumed in annual calculations. */
#define ANNUAL_TRADING_DAYS     252.0

/**
 * Default annual risk-free rate used by the Sharpe ratio calculation.
 * This is a configurable assumption and does not represent a guaranteed market rate, can be changed later if so needed.
 */
#define DEFAULT_RISK_FREE_RATE  0.03

/**
 * @brief Default EWMA decay factor.
 * @details A value of 0.94 gives relatively high weight to previous variance estimates.
 * Lower values increase the influence of recent returns, while higher values produce slower decay of older observations. */
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
 * @details Uses the sample standard deviation of daily returns and annualizes it using the square-root-of-time rule.
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
 * @details Calculates the mean daily return relative to the daily equivalent of the specified annual risk-free rate, then scales the result to an annualized Sharpe ratio.
 * 
 * @param prices Historical closing prices, oldest first.
 * @param size Number of prices. Must be at least 3.
 * @param risk_free_rate Annual risk-free rate, e.g. DEFAULT_RISK_FREE_RATE
 * @param result Output annualized Sharpe ratio.
 * 
 * @return RISK_SUCCESS on success.
 * @return RISK_INVALID_INPUT if prices, size, result or risk_free_rate is invalid.
 * @return RISK_INSUFFICIENT_DATA if fewer than 3 prices are provided.
 * @return RISK_ZERO_VOLATILITY if the return volatility is below 1e-12. 
 * 
 * @note The output value is valid only when RISK_SUCCESS is returned.
 */
RiskStatus calculate_sharpe(const double prices[], size_t size, double risk_free_rate, double *result);

/**
 * @brief Calculate the maximum drawdown.
 * 
 * @details Finds the largest peak-to-trough decline in the price series.
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
 * @details Estimates variance using exponentially weighted squared daily returns, assuming a zero mean return. 
 * The variance estimate is initialized using the square of the first observed daily return
 * and updated recursively for each subsequent return.
 * 
 * @param prices Historical closing prices, oldest first.
 * @param size Number of prices. Must be at least 2.
 * @param lambda EWMA decay factor strictly in the range (0, 1). Higher values give more weight to older observations.
 * @param result Output annualized EWMA volatility as a decimal fraction.
 * 
 * @return RISK_SUCCESS on success.
 * @return RISK_INVALID_INPUT if prices, size, result or lambda is invalid.
 * @return RISK_INSUFFICIENT_DATA if fewer than 2 prices are provided.
 * 
 * @note The output value is valid only when RISK_SUCCESS is returned.
*/
RiskStatus calculate_ewma_volatility(const double prices[], size_t size, double lambda, double *result);

#ifdef __cplusplus
}
#endif // __cplusplus

#endif
