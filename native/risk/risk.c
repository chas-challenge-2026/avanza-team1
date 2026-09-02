#include "risk.h"

#include <stdio.h>
#include <math.h>

/* Helper function because this calculation is made in more than one other function, to minimize the amount of repeated code */
static double calculate_average_return(const double prices[], int size)
{
    double sum = 0.0;
    for (int i = 1; i < size; i++)
    {
        double daily_return = (prices[i] - prices[i - 1]) / prices[i - 1];
        sum += daily_return;
    }

    return sum / (size - 1);
}

/* Calculates the daily volatility */
double calculate_volatility(const double prices[], int size)
{
    /* Requires three historical prices of the stock, 
    otherwise we can't correctly calculate a value for volatility. 
    If we don't get that, we return a zero value. */
    if (size < 3)
    {
        return 0.0;        
    } 

    double average_return = calculate_average_return(prices, size);
    double squared_sum = 0.0;    
    for (int i = 1; i < size; i++)
    {
        double daily_return = (prices[i] - prices[i - 1]) / prices[i - 1];
        double difference = daily_return - average_return;
        squared_sum += difference * difference;
    }
    
    int return_count = size - 1;
    double variance = squared_sum / (return_count - 1);

    return sqrt(variance);
}

/* Calculates the annual sharpe value, based on calculated volatility and a set risk free rate of a savings account */
double calculate_sharpe(const double prices[], int size, double risk_free_rate)
{
    double average_return = calculate_average_return(prices, size);
    double volatility = calculate_volatility(prices, size);
    if (volatility == 0.0)
    {
        return 0.0;
    }

    double daily_risk_free_rate = pow(1.0 + risk_free_rate, 1.0 / ANNUAL_TRADING_DAYS) - 1.0;
    double daily_sharpe = (average_return - daily_risk_free_rate) / volatility;
    double annualized_sharpe = daily_sharpe * sqrt(ANNUAL_TRADING_DAYS);

    return annualized_sharpe;
}

/* Will continue with this function when the other two functions are working. */
void calculate_max_drawdown()
{
    /* printf("Max Drawdown-values will be added here...\r\n"); */    
}