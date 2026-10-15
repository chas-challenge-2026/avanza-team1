#include "helpers.h"

#include <math.h>


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

    /* Calculate daily returns and update the mean and variance using Welford's online algorithm for improved numerical stability. */
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