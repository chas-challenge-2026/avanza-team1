#include "helpers.h"

#include <math.h>

/**
 * @brief Validate a price series.
 * 
 * A valid price series must be non-NULL, contain at least one price,
 * and consist entirely of finite, positive values.
 */
bool valid_price_series(const double prices[], size_t size)
{
    if (prices == NULL || size == 0)
    {
        return false;
    }

    for (size_t i = 0; i < size; i++)
    {
        if (!isfinite(prices[i]) || prices[i] <= 0.0)
        {
            return false;
        }
    }

    return true;
}


RiskStatus calculate_returns(const double prices[], size_t size, double returns[])
{
    if (returns == NULL || !valid_price_series(prices, size))
    {
        return RISK_INVALID_INPUT;
    }

    if (size < 2)
    {
        return RISK_INSUFFICIENT_DATA;
    }

    for (size_t i = 1; i < size; i++)
    {
        returns[i - 1] = (prices[i] - prices[i - 1]) / prices[i - 1];
    }

    return RISK_SUCCESS;
}


RiskStatus calculate_return_statistics(const double prices[], size_t size, double *mean, double *variance)
{
    if (mean == NULL || variance == NULL || !valid_price_series(prices, size))
    {
        return RISK_INVALID_INPUT;
    }

    if (size < 3)
    {
        return RISK_INSUFFICIENT_DATA;
    }

    double average = 0.0;
    double sum_squared_deviation = 0.0;
    size_t return_count = 0;

    for (size_t i = 1; i < size; i++)
    {
        double daily_return = (prices[i] - prices[i - 1]) / prices[i - 1];

        return_count++;

        double delta = daily_return - average;
        average += delta / (double)return_count;

        double delta_after_mean = daily_return - average;
        sum_squared_deviation += delta * delta_after_mean;
    }

    *mean = average;
    *variance = sum_squared_deviation / (double)(return_count - 1);

    return RISK_SUCCESS;
}

/**
 * @brief Add a return value to rolling statistics.
 * 
 * Updates the running sum, sum of squares and observation count.
 */
void rolling_statistics_add(RollingStatistics *stats, double value)
{
    stats->sum += value;
    stats->sum_squared += value * value;
    stats->count++;
}

/**
 * @brief Remove a return value from rolling statistics.
 * 
 * Updates the running sum, sum of squares and observation count.
 */
void rolling_statistics_remove(RollingStatistics *stats, double value)
{
    stats->sum -= value;
    stats->sum_squared -= value * value;
    stats->count--;
}

/**
 * @brief Calculate the mean of the current rolling statistics.
 */
double rolling_statistics_mean(const RollingStatistics *stats)
{
    return stats->sum / (double)stats->count;
}

/**
 * @brief Calculate the sample variance of the current rolling statistics.
 * 
 * Returns zero when numerical rounding produces a small negative variance.
 */
double rolling_statistics_variance(const RollingStatistics *stats)
{
    double variance = (stats->sum_squared - (stats->sum * stats->sum) / (double)stats->count) / (double)(stats->count - 1);

    return variance > 0.0 ? variance : 0.0;
}