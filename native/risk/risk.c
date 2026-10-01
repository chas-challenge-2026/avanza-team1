#include "risk.h"
#include "helpers/helpers.h"

#include <math.h>


RiskStatus calculate_annual_volatility(const double prices[], size_t size, double *result)
{
    if (result == NULL || !valid_price_series(prices, size))
    {
        return RISK_INVALID_INPUT;
    }
    
    if (size < 3)
    {
        return RISK_INSUFFICIENT_DATA;
    }

    *result = 0.0;

    double mean, variance;
    
    RiskStatus status = calculate_return_statistics(prices, size, &mean, &variance);
    if (status != RISK_SUCCESS)
    {
        return status;
    }

    *result = sqrt(variance) * sqrt(ANNUAL_TRADING_DAYS);

    return RISK_SUCCESS;
}

RiskStatus calculate_sharpe(const double prices[], size_t size, double risk_free_rate, double *result)
{
    if (result == NULL || !valid_price_series(prices, size))
    {
        return RISK_INVALID_INPUT;
    }
    
    if (size < 3)
    {
        return RISK_INSUFFICIENT_DATA;
    }
    
    if (!isfinite(risk_free_rate) || risk_free_rate <= -1.0)
    {
        return RISK_INVALID_INPUT;
    }

    *result = 0.0;

    double mean, variance;

    RiskStatus status = calculate_return_statistics(prices, size, &mean, &variance);
    if (status != RISK_SUCCESS)
    {
        return status;
    }

    double daily_volatility = sqrt(variance);
    if (daily_volatility < 1e-12)
    {
        return RISK_ZERO_VOLATILITY;
    }

    /* Convert annual risk-free rate to an equivalent daily rate. */
    double daily_risk_free_rate = pow(1.0 + risk_free_rate, 1.0 / ANNUAL_TRADING_DAYS) - 1.0;

    /* Calculate excess return per unit of daily risk. */
    double daily_sharpe = (mean - daily_risk_free_rate) / daily_volatility;

    /* Annualize the Sharpe ratio. */
    *result = daily_sharpe * sqrt(ANNUAL_TRADING_DAYS);

    return RISK_SUCCESS;
}

RiskStatus calculate_max_drawdown(const double prices[], size_t size, double *result)
{
    if (result == NULL || !valid_price_series(prices, size))
    {
        return RISK_INVALID_INPUT;
    }

    if (size < 2)
    {
        return RISK_INSUFFICIENT_DATA;
    }

    *result = 0.0;

    /* Track the highest price seen so far. */
    double peak = prices[0];
    double max_drawdown = 0.0;

    for (size_t i = 1; i < size; i++)
    {
        if (prices[i] > peak)
        {
            /* Drawdown is measured from the running peak. */
            peak = prices[i];
        }

        double drawdown = (peak - prices[i]) / peak;
        if (drawdown > max_drawdown)
        {
            max_drawdown = drawdown;
        }
    }

    *result = max_drawdown;

    return RISK_SUCCESS;
}

RiskStatus calculate_ewma_volatility(const double prices[], size_t size, double lambda, double *result)
{
    if (result == NULL || !valid_price_series(prices, size))
    {
        return RISK_INVALID_INPUT;
    }

    if (size < 2)
    {
        return RISK_INSUFFICIENT_DATA;
    }
    
    if (!isfinite(lambda) || lambda <= 0.0 || lambda >= 1.0)
    {
        return RISK_INVALID_INPUT;
    }
    
    *result = 0.0;

    double first_return = (prices[1] - prices[0]) / prices[0];
    double variance = first_return * first_return;

    for (size_t i = 2; i < size; i++)
    {
        double daily_return = (prices[i] - prices[i - 1]) / prices[i - 1];

        /* Give recent returns more influence through exponential weighting. */
        variance = lambda * variance + (1.0 - lambda) * (daily_return * daily_return);
    }

    /* Annualize the EWMA volatility. */
    double daily_ewma_volatility = sqrt(variance);
    *result = daily_ewma_volatility * sqrt(ANNUAL_TRADING_DAYS);

    return RISK_SUCCESS;
}


RiskStatus calculate_rolling_volatility(const double prices[], size_t size, size_t window, double results[])
{
    if (results == NULL || !valid_price_series(prices, size))
    {
        return RISK_INVALID_INPUT;
    }

    /* Historical volatility requires at least three prices: two daily returns are needed to calculate sample volatility. */
    if (window < 3 || window > size)
    {
        return RISK_INSUFFICIENT_DATA;
    }
    
    size_t result_count = size - window + 1;

    RollingStatistics stats = {.sum = 0.0, .sum_squared = 0.0, .count = 0};

    for (size_t i = 1; i < window; i++)
    {
        double daily_return = (prices[i] - prices[i - 1]) / prices[i - 1];
        rolling_statistics_add(&stats, daily_return);
    }

    double variance = rolling_statistics_variance(&stats);

    results[0] = sqrt(variance) * sqrt(ANNUAL_TRADING_DAYS);

    for (size_t i = 1; i < result_count; i++)
    {
        double removed_return = (prices[i] - prices[i - 1]) / prices[i - 1];
        double added_return = (prices[i + window - 1] - prices[i + window - 2]) / prices[i + window - 2];

        rolling_statistics_remove(&stats, removed_return);
        rolling_statistics_add(&stats, added_return);

        variance = rolling_statistics_variance(&stats);

        results[i] = sqrt(variance) * sqrt(ANNUAL_TRADING_DAYS);
    }

    return RISK_SUCCESS;
}

RiskStatus calculate_rolling_sharpe(const double prices[], size_t size, size_t window, double risk_free_rate, double results[])
{
    if (results == NULL || !valid_price_series(prices, size))
    {
        return RISK_INVALID_INPUT;
    }
    
    if (window < 3 || window > size)
    {
        return RISK_INSUFFICIENT_DATA;
    }

    if (!isfinite(risk_free_rate) || risk_free_rate <= -1.0)
    {
        return RISK_INVALID_INPUT;
    }
    
    size_t result_count = size - window + 1;
    double daily_risk_free_rate = pow(1.0 + risk_free_rate, 1.0 / ANNUAL_TRADING_DAYS) - 1.0;

    RollingStatistics stats = {.sum = 0.0, .sum_squared = 0.0, .count = 0};

    for (size_t i = 1; i < window; i++)
    {
        double daily_return = (prices[i] - prices[i - 1]) / prices[i - 1];
        rolling_statistics_add(&stats, daily_return);
    }

    double mean = rolling_statistics_mean(&stats);
    double variance = rolling_statistics_variance(&stats);
    double volatility = sqrt(variance);
    if (volatility < 1e-12)
    {
        return RISK_ZERO_VOLATILITY;
    }

    double daily_sharpe = (mean - daily_risk_free_rate) / volatility;

    results[0] = daily_sharpe * sqrt(ANNUAL_TRADING_DAYS);

    for (size_t i = 1; i < result_count; i++)
    {
        double removed_return = (prices[i] - prices[i - 1]) / prices[i - 1];
        double added_return = (prices[i + window - 1] - prices[i + window - 2]) / prices[i + window - 2];
                
        rolling_statistics_remove(&stats, removed_return);
        rolling_statistics_add(&stats, added_return);
        
        mean = rolling_statistics_mean(&stats);
        variance = rolling_statistics_variance(&stats);
        volatility = sqrt(variance);
        if (volatility < 1e-12)
        {
            return RISK_ZERO_VOLATILITY;
        }
        
        daily_sharpe = (mean - daily_risk_free_rate) / volatility;

        results[i] = daily_sharpe * sqrt(ANNUAL_TRADING_DAYS);
    }

    return RISK_SUCCESS;
}

RiskStatus calculate_rolling_max_drawdown(const double prices[], size_t size, size_t window, double results[])
{
    if (results == NULL || !valid_price_series(prices, size))
    {
        return RISK_INVALID_INPUT;
    }
    
    if (window < 2 || window > size)
    {
        return RISK_INSUFFICIENT_DATA;
    }

    size_t result_count = size - window + 1;
    for (size_t i = 0; i < result_count; i++)
    {
        RiskStatus status = calculate_max_drawdown(&prices[i], window, &results[i]);
        if (status != RISK_SUCCESS)
        {
            return status;
        }
    }

    return RISK_SUCCESS;
}

// RiskStatus calculate_rolling_ewma_volatility(const double prices[], size_t size, size_t window, double lambda, double results[])
// {
//     if (results == NULL || !valid_price_series(prices, size))
//     {
//         return RISK_INVALID_INPUT;
//     }
    
//     if (window < 2 || window > size)
//     {
//         return RISK_INSUFFICIENT_DATA;
//     }
    
//     if (!isfinite(lambda) || lambda <= 0.0 || lambda >= 1.0)
//     {
//         return RISK_INVALID_INPUT;
//     }

//     results[0] = 0.0;

//     size_t result_count = size - window + 1;
//     for (size_t i = 0; i < result_count; i++)
//     {
//         RiskStatus status = calculate_ewma_volatility(&prices[i], window, lambda, &results[i]);
//         if (status != RISK_SUCCESS)
//         {
//             return status;
//         }
//     }

//     return RISK_SUCCESS;
// }