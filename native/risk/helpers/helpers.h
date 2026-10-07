#ifndef HELPERS_H
#define HELPERS_H

#include "../risk.h"

#include <stdbool.h>

/**
 * @brief Running statistics used for rolling calculations.
 * 
 * @details Stores the sum and sum of squares of the current observations so that values can be added to and removed from a rolling window efficiently.
 */
typedef struct
{
    double sum;
    double sum_squared;
    size_t count;
} RollingStatistics;

/**
 * @brief Validate a price series.
 * 
 * @details Checks that the price array is non-null, non-empty and contains only finite positive values.
 * @details Minimum series length required by specific calculations are checked by those calculations separately.
 * 
 * @param prices Price array to validate.
 * @param size Number of prices.
 * 
 * @return true if all prices are valid, otherwise false.
 */
bool valid_price_series(const double prices[], size_t size);

/**
 * @brief Calculate simple returns from a price series.
 * 
 * @details Calculates the simple return between each pair of consecutive prices.
 * @details The output contains one fewer value than the input price series.
 *
 * @param prices Price array in chronological order.
 * @param size Number of prices. Must be at least 2.
 * @param returns Output array that must have space for size - 1 values.
 * 
 * @return RISK_SUCCESS on success.
 * @return RISK_INVALID_INPUT if prices or returns is invalid.
 * @return RISK_INSUFFICIENT_DATA if fewer than 2 prices are provided.
 */
RiskStatus calculate_returns(const double prices[], size_t size, double returns[]);

/**
 * @brief Calculate the mean and sample variance of daily returns.
 * 
 * @details Calculates simple daily returns directly from the price series and uses Welford's online algorithm to calculate their mean and sample variance.
 * @details Welford's algorithm provides improved numerical stability compared with directly calculating variance from sums.
 * 
 * @param prices Price array in chronological order.
 * @param size Number of prices. Must be at least 3.
 * @param mean Output mean daily return.
 * @param variance Output sample variance of daily returns.
 * 
 * @return RISK_SUCCESS on success.
 * @return RISK_INVALID_INPUT if prices, mean or variance is invalid.
 * @return RISK_INSUFFICIENT_DATA if fewer than 3 prices are provided.
 */
RiskStatus calculate_return_statistics(const double prices[], size_t size, double *mean, double *variance);

/**
 * @brief Add an observation to rolling statistics.
 * 
 * @param stats Rolling statistics to update.
 * @param value Value to add.
 */
void rolling_statistics_add(RollingStatistics *stats, double value);

/**
 * @brief Remove an observation from rolling statistics.
 * 
 * @param stats Rolling statistics to update.
 * @param value Value to remove.
 */
void rolling_statistics_remove(RollingStatistics *stats, double value);

/**
 * @brief Calculate the mean of the current observations.
 * 
 * @param stats Rolling statistics containing the observations.
 * 
 * @return Mean of the stored observations.
 */
double rolling_statistics_mean(const RollingStatistics *stats);

/**
 * @brief Calculate the sample variance of the current observations.
 * 
 * @details Uses the running sum and sum squares of the observations.
 * @details Negative results caused by floating-point rounding are clamped to zero.
 * 
 * @param stats Rolling statistics containing the observations.
 * 
 * @return Sample variance of the stored observations.
 */
double rolling_statistics_variance(const RollingStatistics *stats);

#endif
