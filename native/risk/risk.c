#include "risk.h"

#include <stdio.h>
#include <math.h>

/* Calculates the daily volatility */
double calculate_volatility(const double prices[], int size)
{
    /* Requires three historical prices of the stock, 
    otherwise we can't correctly calculate a value for volatility. 
    If we don't get that, we return a zero value. */
    if (size < 3) return 0.0;

    double sum = 0.0;
    for (int i = 1; i < size; i++)
    {
        double daily_return = (prices[i] - prices[i - 1]) / prices[i - 1];
        sum += daily_return;
        /* This printf is only here for debug purposes and will be removed later. 
        Shows the daily return values so that we can easily spot if something is wrong. */
        printf("Daily return for day[%d]: %.2f%%\r\n", i, daily_return);
    }

    int return_count = size - 1;
    double average_return = sum / return_count;
    double squared_sum = 0.0;
    for (int i = 1; i < size; i++)
    {
        double daily_return = (prices[i] - prices[i - 1]) / prices[i - 1];
        double difference = daily_return - average_return;
        squared_sum += difference * difference;
    }
    
    double variance = squared_sum / return_count;

    return sqrt(variance);
}

/* Will continue with this function when the other one is working. */
void calculate_sharpe()
{
    printf("The Sharpe-value needs to be inserted...\r\n");    
}

/* Will continue with this function when the other two functions are working. */
void calculate_max_drawdown()
{
    printf("Max Drawdown-values will be added here...\r\n");    
}