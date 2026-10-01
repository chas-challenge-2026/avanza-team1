#include "helpers.h"

#include <math.h>

/* Validates that all prices are positive and finite. */
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

/* WIP: Calculates simple returns from a price series. Unused as of now, but could be useful with the backtest engine in the future. */
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

/* Calculates return statistics for mean and variance based on the Welford algorithm. Gives better numerical stability, but not effective for rolling functions. */
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

void rolling_statistics_add(RollingStatistics *stats, double value)
{
    stats->sum += value;
    stats->sum_squared += value * value;
    stats->count++;
}

void rolling_statistics_remove(RollingStatistics *stats, double value)
{
    stats->sum -= value;
    stats->sum_squared -= value * value;
    stats->count--;
}

double rolling_statistics_mean(const RollingStatistics *stats)
{
    return stats->sum / (double)stats->count;
}

double rolling_statistics_variance(const RollingStatistics *stats)
{
    double variance = (stats->sum_squared - (stats->sum * stats->sum) / (double)stats->count) / (double)(stats->count - 1);

    return variance > 0.0 ? variance : 0.0;
}