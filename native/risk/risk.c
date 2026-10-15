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

    /* Initialize the EWMA variance using the first available return. */
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