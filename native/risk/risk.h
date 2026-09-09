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
    RISK_SUCCESS,
    RISK_INVALID_INPUT
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
 * @brief Calculate the annualized Sharpe Ratio.
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
 * @return RISK_INVALID_INPUT if the input is invalid, 
 * risk_free_rate is not finite or is <= -1.0, or volatility is zero.
 * 
 * On RISK_INVALID_INPUT, result is set to 0.0 when possible.
 */
RiskStatus calculate_sharpe(const double prices[], size_t size, double risk_free_rate, double *result);

/**
 * @brief Calculates the maximum drawdown
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
 * @param lambda Decay factor in the range (0, 1). Higher values give more weight to older observations.
 * @param result Output annualized EWMA volatility as a decimal fraction.
 * 
 * @return RISK_SUCCESS on success.
 * @return RISK_INVALID_INPUT if the input is invalid or lambda is invalid.
 * 
 * On RISK_INVALID_INPUT, result is set to 0.0 when possible.
*/
RiskStatus calculate_ewma_volatility(const double prices[], size_t size, double lambda, double *result);


#endif