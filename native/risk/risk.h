#ifndef RISK_H
#define RISK_H

/* A work in progress risk-engine that now only calculates volatility based on set numbers. */

/* Calculates the daily volatility value */
double calculate_volatility(const double prices[], int number);

/* Calculates the sharpe value */
void calculate_sharpe();

/* Calculates the max drawdown value */
void calculate_max_drawdown();

#endif