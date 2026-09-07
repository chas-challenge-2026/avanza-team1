# Native Module (C/C++)

## What it provides
* 

### Risk Assessment Engine
* It calculates basic risk metrics (volatility, Sharpe ratio, and max drawdown) from a historical series of daily closing prices. All functions treat prices[0] as the earliest price and prices[size - 1] as the most recent. None of them modify the input array.
* Calculates the annual volatility of the price series: the standard deviation of daily returns, scaled up to a yearly figure. Higher value mean the price swings around more from day to day.
* Calculates the annualized Sharpe Ratio: How much excess return the price series earned per unit of volatility, above a risk-free baseline. Higher is better; a Sharpe ratio above 1 is generally considered good, above 2 is very good.
* Calculates the maximum drawdown: the single largest peak-to-trough decline anywhere in the price series. This measures the worst loss an investor holding from a high point would have experienced, which is a different kind of risk than day-to-day volatility.

### FX-Pipeline
* Uses Sveriges Riksbank's exchange rate API to get the current exchange rate between Swedish kronor (SEK) and any other currency.
* Uses libcurl and Jansson to call the API and process the received JSON data.
* For now it will only be able to handle conversions between SEK and another currency, but later on we might support comparing any two currencies.

### Backtest-Engine
* 

## Definitions set by the team

### Coding standard
* 

### Documentation
* Doxygen?

## Testing
* 

## Collaborators
- [Henrik Westerlund](https://github.com/Henrik-Westerlund)
- [Pär Lundh](https://github.com/lundhpargmailcom)
