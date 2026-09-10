#include "risk.h"

#include <math.h>
#include <stdbool.h>

/* Helper to calculate the average return. */
static double calculate_average_return(const double prices[], size_t size)
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

/* Validates that all prices are positive and finite. */
static bool valid_price_series(const double prices[], size_t size)
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

/*  Calculate sample standard deviation of daily returns. */
static double calculate_daily_volatility(const double prices[], size_t size)
{
    if (size < 3)
    {
        return 0.0;
    }

    double average_return = calculate_average_return(prices, size);
    double squared_sum = 0.0;
    for (size_t i = 1; i < size; i++)
    {
        double daily_return = (prices[i] - prices[i - 1]) / prices[i - 1];
        double difference = daily_return - average_return;
        squared_sum += difference * difference;
    }
    
    size_t return_count = size - 1;
    /*  Use sample variance (N - 1) for the observed return sample. */
    double variance = squared_sum / (return_count - 1);

    return sqrt(variance);
}

RiskStatus calculate_annual_volatility(const double prices[], size_t size, double *result)
{
    if (result == NULL)
    {
        return RISK_INVALID_INPUT;
    }

    *result = 0.0;

    if (!valid_price_series(prices, size))
    {
        return RISK_INVALID_INPUT;
    }

    if (size < 3)
    {
        return RISK_INVALID_INPUT;
    }

    double daily_volatility = calculate_daily_volatility(prices, size);

    /*  Annualize daily volatility. */        
    *result = daily_volatility * sqrt(ANNUAL_TRADING_DAYS);

    return RISK_SUCCESS;
}

/*  Calculates the annualized Sharpe ratio. See risk.h for the full contract (arguments, return value, edge cases). */
RiskStatus calculate_sharpe(const double prices[], size_t size, double risk_free_rate, double *result)
{
    if (result == NULL)
    {
        return RISK_INVALID_INPUT;
    }

    *result = 0.0;

    if (!valid_price_series(prices, size))
    {
        return RISK_INVALID_INPUT;
    }
    
    if (size < 3)
    {
        return RISK_INVALID_INPUT;
    }

    if (!isfinite(risk_free_rate) || risk_free_rate <= -1.0)
    {
        return RISK_INVALID_INPUT;
    }

    double average_return = calculate_average_return(prices, size);
    double daily_volatility = calculate_daily_volatility(prices, size);
    if (daily_volatility == 0.0)
    {
        return RISK_ZERO_VOLATILITY;
    }

    /*  Convert annual risk-free rate to an equivalent daily rate. */
    double daily_risk_free_rate = pow(1.0 + risk_free_rate, 1.0 / ANNUAL_TRADING_DAYS) - 1.0;

    /*  Calculate excess return per unit of daily risk. */
    double daily_sharpe = (average_return - daily_risk_free_rate) / daily_volatility;

    /*  Annualize the Sharpe ratio. */
    *result = daily_sharpe * sqrt(ANNUAL_TRADING_DAYS);

    return RISK_SUCCESS;
}

RiskStatus calculate_max_drawdown(const double prices[], size_t size, double *result)
{
    if (result == NULL)
    {
        return RISK_INVALID_INPUT;
    }

    *result = 0.0;

    if (!valid_price_series(prices, size))
    {
        return RISK_INVALID_INPUT;
    }
    
    if (size < 2)
    {
        return RISK_INVALID_INPUT;
    }

    /*  Track the highest price seen so far. */
    double peak = prices[0];
    double max_drawdown = 0.0;

    for (size_t i = 1; i < size; i++)
    {
        if (prices[i] > peak)
        {
            /*  Drawdown is measured from the running peak. */
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
    if (result == NULL)
    {
        return RISK_INVALID_INPUT;
    }

    if (!valid_price_series(prices, size))
    {
        return RISK_INVALID_INPUT;
    }

    if (size < 2)
    {
        return RISK_INVALID_INPUT;
    }

    if (!isfinite(lambda) || lambda <= 0.0 || lambda >= 1.0)
    {
        return RISK_INVALID_INPUT;
    }

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

/* Testing to see if these functions will suffice with making the values fit the specified time period instead of the entire series. */
RiskStatus calculate_rolling_volatility(const double prices[], size_t size, size_t window, double results[])
{
    if (results == NULL)
    {
        return RISK_INVALID_INPUT;
    }

    if (!valid_price_series(prices, size))
    {
        return RISK_INVALID_INPUT;
    }

    /* Historical volatility requires at least three prices: two daily returns are needed to calculate sample volatility. */
    if (window < 3 || window > size)
    {
        return RISK_INSUFFICIENT_DATA;
    }

    size_t result_count = size - window + 1;
    for (size_t i = 0; i < result_count; i++)
    {
        RiskStatus status = calculate_annual_volatility(&prices[i], window, &results[i]);
        if (status != RISK_SUCCESS)
        {
            return status;
        }
    }

    return RISK_SUCCESS;
}

RiskStatus calculate_rolling_sharpe(const double prices[], size_t size, size_t window, double risk_free_rate, double results[])
{
    if (results == NULL)
    {
        return RISK_INVALID_INPUT;
    }

    if (!valid_price_series(prices, size))
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
    for (size_t i = 0; i < result_count; i++)
    {
        RiskStatus status = calculate_sharpe(&prices[i], window, risk_free_rate, &results[i]);
        if (status != RISK_SUCCESS)
        {
            return status;
        }
    }

    return RISK_SUCCESS;
}

RiskStatus calculate_rolling_max_drawdown(const double prices[], size_t size, size_t window, double results[])
{
    if (results == NULL)
    {
        return RISK_INVALID_INPUT;
    }

    if (!valid_price_series(prices, size))
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

RiskStatus calculate_rolling_ewma_volatility(const double prices[], size_t size, size_t window, double lambda, double results[])
{
    if (results == NULL)
    {
        return RISK_INVALID_INPUT;
    }

    if (!valid_price_series(prices, size))
    {
        return RISK_INVALID_INPUT;
    }

    if (window < 2 || window > size)
    {
        return RISK_INSUFFICIENT_DATA;
    }

    if (!isfinite(lambda) || lambda <= 0.0 || lambda >= 1.0)
    {
        return RISK_INVALID_INPUT;
    }

    size_t result_count = size - window + 1;
    for (size_t i = 0; i < result_count; i++)
    {
        RiskStatus status = calculate_ewma_volatility(&prices[i], window, lambda, &results[i]);
        if (status != RISK_SUCCESS)
        {
            return status;
        }
    }

    return RISK_SUCCESS;
}