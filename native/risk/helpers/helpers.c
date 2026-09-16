#include "../risk.h"

#include <math.h>
#include <stdbool.h>
#include <stdlib.h>

/* Helper to calculate the average return. */
double calculate_average_return(const double prices[], size_t size)
{
    double sum = 0.0;
    for (size_t i = 1; i < size; i++)
    {
        /*  Simple daily return. */
        double daily_return = (prices[i] - prices[i - 1]) / prices[i - 1];
        sum += daily_return;
    }

    return sum / (size - 1);
}

/**
 * @brief Calculates simple returns from a price series.
 *
 * @param prices Price array in chronological order.
 * @param size Number of prices.
 * @param returns Output array containing size - 1 returns.
 * 
 * @return RISK_SUCCESS on success, otherwise RISK_INVALID_INPUT.
 */
RiskStatus calculate_returns(const double prices[], size_t size, double returns[])
{
    if (prices == NULL || returns == NULL || size < 2)
    {
        return RISK_INVALID_INPUT;
    }

    for (size_t i = 1; i < size; i++)
    {
        returns[i - 1] = (prices[i] - prices[i - 1]) / prices[i - 1];
    }

    return RISK_SUCCESS;
}

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