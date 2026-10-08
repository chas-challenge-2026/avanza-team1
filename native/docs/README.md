# Native Module (C/C++)

## What it provides
* Risk Assessment Engine
* FX-Pipeline
* Backtest Engine

### Risk Assessment Engine
* It calculates basic risk metrics (volatility, Sharpe ratio, and max drawdown) from a historical series of daily closing prices. All functions treat prices[0] as the earliest price and prices[size - 1] as the most recent. None of them modify the input array.
* Calculates the annual volatility of the price series: the standard deviation of daily returns, scaled up to a yearly figure. A higher volatility means larger day to day price differences.
* Calculates the annualized Sharpe Ratio: How much excess return the price series earned per unit of volatility, above a risk-free baseline. Higher is better; a Sharpe ratio above 1 is generally considered good, above 2 is very good.
* Calculates the maximum drawdown: the single largest peak-to-trough decline anywhere in the price series. This measures the worst loss an investor holding from a high point would have experienced, which is a different kind of risk than day-to-day volatility.
* Supports rolling risk analysis, calculating volatility and Sharpe ratio over consecutive historical windows to show how risk changes over time.

### FX-Pipeline
* Uses Sveriges Riksbank's exchange rate API.
* Can get the current exchange rate between Swedish kronor (SEK) and any other currency.
* Can take a double array with daily stock prices and convert the correct sequence of indices from another currency to SEK.
* Uses libcurl and Jansson to call the API and process the received JSON data.

### Backtest-Engine
* Takes prices, instruments and days from Java and uses them to calculate risk values and backtesting as a simulation based on user preference, using historical data.
* Produces risk metrics such as total return, annualized return, max drawdown and Sharpe ratio.
* Works together with the Risk Assessment Engine by performing risk calculations in the simulated portfolio.
* Integrates with the Java application using a JNA bridge.


## Definitions set by the team

### Documentation
* Doxygen-styled comments.
* Making use of @brief, @detail, @params, @return and @note to separate the different sections of comments.
* Mainly commenting in our .h and .hpp files, but also where some parts need further explanation.

## Testing
* Risk Assessment Engine has extensive tests that run on expected values made through demo-runs of the functions. It also checks boundary issues and edge cases to make sure that it provides the correct information. Still a Work in progress.
* FX Conversion Module has extensive tests that run on expected values made through demo-runs of the functions. It also checks boundary issues and edge cases to make sure that it provides the correct information. Still a Work in progress.
* Backtest currently does not have any testing, will be added later.

## Collaborators
- [Henrik Westerlund](https://github.com/Henrik-Westerlund)
- [Pär Lundh](https://github.com/lundhpargmailcom)
