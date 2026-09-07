#include "risk.h"

#include <math.h>

/*  Helper: average of the simple daily returns in the price series. 
    Used by both calculate_daily_volatility (as the center point returns are compared against)
    and calculate_sharpe (as the return figure Sharpe measures against the risk-free rate).
    Kept as a single function so the definition of "daily return" only lives in one place. */
static double calculate_average_return(const double prices[], int size)
{
    double sum = 0.0;
    for (int i = 1; i < size; i++)
    {
        /*  Simple daily return: how much the price moved from yesterday to today, as a fraction of yesterday's price. */
        double daily_return = (prices[i] - prices[i - 1]) / prices[i - 1];
        sum += daily_return;
    }

    /*  size - 1 because there are (size - 1) day-over-day returns for 'size' prices e.g. 10 prices produce 9 returns. */
    return sum / (size - 1);
}

/*  Private helper: daily (unannualized) volatility. 
    Both calculate_annual_volatility and calculate_sharpe need this exact number,
    so it lives here once instead of being derived twice: once directly via sqrt(variance),
    and once indirectly by undoing an annualization. That way, if the variance formula ever changes,
    there's only one place to update it. */
static double calculate_daily_volatility(const double prices[], int size)
{
    /*  Volatility needs at least two daily returns (three prices) to have any spread to measure.
        With fewer, there's no meaningful answer, so return 0.0 rather than dividing by zero below. */
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
    /*  Sample variance (divide by N - 1, not N): this is a sample of returns,
        not the full population of all possible returns, so Bessel's correction is applied here
        to avoid underestimating the true variance. This matches the convention used by common finance tools (e.g. Excel's STDEV, pandas' .std()). */
    double variance = squared_sum / (return_count - 1);

    return sqrt(variance);
}

/*  Calculates the annualized volatility. See risk.h for the full contract (arguments, return value, edge cases). */
double calculate_annual_volatility(const double prices[], int size)
{
    double daily_volatility = calculate_daily_volatility(prices, size);

    /*  Volatility scales with the SQUARE ROOT of time, not time itself,
        because variance (not standard deviation) is what adds up linearly across independent days.
        Standard deviation is sqrt(variance), so scaling from daily to annual means multiplying
        by sqrt(number of trading days), not by the number of trading days directly. */
    return daily_volatility * sqrt(ANNUAL_TRADING_DAYS);
}

/*  Calculates the annualized Sharpe ratio. See risk.h for the full contract (arguments, return value, edge cases). */
double calculate_sharpe(const double prices[], int size, double risk_free_rate)
{
    if (size < 3)
    {
        return 0.0;
    }

    double average_return = calculate_average_return(prices, size);
    double daily_volatility = calculate_daily_volatility(prices, size);
    if (daily_volatility == 0.0)
    {
        /*  Flat prices: there's no risk being taken on, so a risk-adjusted return ratio isn't meaningful. 
            Returning 0.0 here also avoids a division by zero just below. */
        return 0.0;
    }

    /*  Convert the annual risk-free rate into an equivalent daily COMPOUNDING rate, rather than just dividing by 252,
        so it's measured on the same basis as the daily returns it's compared against below. */
    double daily_risk_free_rate = pow(1.0 + risk_free_rate, 1.0 / ANNUAL_TRADING_DAYS) - 1.0;

    /*  Excess return (return above the risk-free baseline) per unit of daily risk taken on. */
    double daily_sharpe = (average_return - daily_risk_free_rate) / daily_volatility;

    /*  Sharpe scales with sqrt(time): It's a ratio of return (which scales linearly with time) to 
        volatility (which scales with sqrt(time)), so the combined ratio scales with sqrt(time). */
    double annualized_sharpe = daily_sharpe * sqrt(ANNUAL_TRADING_DAYS);

    return annualized_sharpe;
}

/*  Calculates the maximum drawdown. See risk.h for the full contract (arguments, return value, edge cases). */
double calculate_max_drawdown(const double prices[], int size)
{
    if (size < 2)
    {
        return 0.0;
    }

    /*  Running peak: the highest price seen so far while walking forward through the series.
        Drawdown is always measured against this, not against the all-time-final peak, since a loss that happened before a later high
        shouldn't be reported as if it started from that later high. */
    double peak = prices[0];
    double max_drawdown = 0.0;

    for (int i = 1; i < size; i++)
    {
        if (prices[i] > peak)
        {
            /*  New all-time high: nothing to draw down from yet, so the peak resets here.
                The drawdown computed just below for this same day will be exactly 0, which can never exceed max_drawdown,
                so it's safe to fall through rather than skip the computation with an else branch. */
            peak = prices[i];
        }

        double drawdown = (peak - prices[i]) / peak;
        if (drawdown > max_drawdown)
        {
            max_drawdown = drawdown;
        }
    }

    return max_drawdown;
}