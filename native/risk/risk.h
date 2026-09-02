#ifndef RISK_H
#define RISK_H

/* A work in progress risk-engine 
that now only calculates volatility based on set numbers. */

/* Amount of days the trading is open per year */
#define ANNUAL_TRADING_DAYS     252.0

/* Set a standard rate of 3% on a savings account */
#define SAVINGS_INTEREST_RATE   0.03


/* Calculates the daily volatility value */
double calculate_volatility(const double prices[], int number);

/* Calculates the sharpe value */
double calculate_sharpe(const double prices[], int size, double risk_free_rate);

/* Calculates the max drawdown value */
void calculate_max_drawdown();

#endif