#ifndef RISK_H
#define RISK_H

/*  A work in progress (WIP) risk-engine:
    It calculates basic risk metrics (volatility, Sharpe ratio, and max drawdown)
    from a historical series of daily closing prices. 
    All functions treat prices[0] as the earliest price and prices[size - 1] as the most recent.
    None of them modify the input array. */

/*  Amount of days the trading is open per year, used to annualize daily figures */
#define ANNUAL_TRADING_DAYS     252.0

/*  Assumed annual risk-free rate (like a standard savings account),
    used as the "safe" return when computing Sharpe ratio. */
#define SAVINGS_INTEREST_RATE   0.03


/*  Calculates the annual volatility of the price series:
    the standard deviation of daily returns, scaled up to a yearly figure.
    Higher value mean the price swings around more from day to day.

    prices  - array of historical closing prices, oldest first
    size    - number of prices in the array: must be at least 3, since volatility
              needs at least 2 daily returns to have any spread to measure.
          
    Returns the annualized volatility as a fraction (e.g. 0.35 == 35%).
    Returns 0.0 if fewer than 3 prices are given. */
double calculate_annual_volatility(const double prices[], int size);

/*  Calculates the annualized Sharpe Ratio:
    How much excess return the price series earned per unit of volatility, above a risk-free baseline.
    Higher is better; a Sharpe ratio above 1 is generally considered good, above 2 is very good.

    prices          - array of historical closing prices, oldest first
    size            - number of prices in the array: must be at least 3 (see calculated_annual_volatility)
    risk_free_rate  - the annual "safe" rate to compare against, e.g. SAVINGS_INTEREST_RATE

    Returns 0.0 if fewer than 3 prices are given, or if volatility is exactly 0.0 (flat prices), to avoid dividing by zero. */
double calculate_sharpe(const double prices[], int size, double risk_free_rate);

/*  Calculates the maximum drawdown:
    the single largest peak-to-trough decline anywhere in the price series. This measures the worst loss
    an investor holding from a high point would have experienced, which is a different kind of risk than day-to-day volatility.

    prices  - array of historical closing prices, oldest first
    size    - number of prices in the array: must be at least 2, since a drawdown needs a peak and a later,
            lower price to compare it to
            
    Returns the max drawdown as a positive fraction (e.g. 0.05 == a 5% drop from peak).
    Returns 0.0 if fewer than 2 prices are given, or if prices never fall below a prior high. */
double calculate_max_drawdown(const double prices[], int size);



#endif