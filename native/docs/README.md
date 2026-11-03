# Native Module (C/C++)

## Table of contents
- [Native Module (C/C++)](#native-module-cc)
  - [Table of contents](#table-of-contents)
  - [About](#about)
  - [Tech stack](#tech-stack)
  - [Compilation](#compilation)
  - [Architecture](#architecture)
  - [Project structure](#project-structure)
  - [Modules](#modules)
    - [Risk Assessment Engine](#risk-assessment-engine)
    - [FX-Pipeline](#fx-pipeline)
    - [Backtest-Engine](#backtest-engine)
    - [Logger](#logger)
  - [Documentation](#documentation)
  - [Testing](#testing)
    - [Test-examples:](#test-examples)
  - [Known Issues/Limitations](#known-issueslimitations)
  - [Docs (Written in Swedish)](#docs-written-in-swedish)
  - [Collaborators](#collaborators)
  - [Resources](#resources)

## About
* The Native part of the project, handles Risk Assessment, Currency-convertion and Backtesting on portfolio data. A part of Avanza Team 1s project.

## Tech stack
* libcurl
* Jansson
* CMake
* GCC

## Compilation
```bash
# Requires cmake, g++, libjansson-dev
cd native/backtest
cmake -B build -DCMAKE_BUILD_TYPE=Release
cmake --build build
# Generates: libbacktest.so (Linux) / backtest.dll (Windows)
```
## Architecture
* Risk Assessment Engine - Calculates basic risk metrics (Volatility, Sharpe ratio, and Max drawdown) from a historical series of daily closing prices.
* FX-Pipeline - Converts a stocks currency to SEK, can be used separately and also with the backtesting.
* Backtest Engine - Simulates investment allocation using historical data and risk metrics using the Risk Assessment Engine.
* Logger - Can be used by the other modules to write event logs to the console, a file, or both.

## Project structure
```bash
└── native/
     ├── backtest/
     |    ├── tests/
     |    |    └── tests.cpp
     |    ├── backtest.cpp
     |    ├── backtest.hpp
     |    ├── CMakeLists.txt
     ├── docs/
     |    ├── v1-info/
     |    |    └── README.md ← Start-infon för Native modulen (v1).
     |    ├── BESLUT.md
     |    ├── BIDRAG.md
     |    └── README.md
     ├── fx/
     |    ├── test/
     |    |    └── test_fx.cpp
     |    ├── fx.cpp
     |    └── fx.hpp
     ├── logger/
     |    ├── test/
     |    |    └── test_logger.cpp
     |    ├── logger.cpp
     |    ├── logger.hpp
     ├── risk/
     |    ├── helpers/
     |    |    └── helpers.c
     |    |    └── helpers.h
     |    └── tests/
     |    |    └── test_risk.c
     |    ├── risk.c
     |    ├── risk.h
     └── .gitignore
```

## Modules
### Risk Assessment Engine
* It calculates basic risk metrics (Volatility, Sharpe ratio, and Max drawdown) from a historical series of daily closing prices. All functions treat prices[0] as the earliest price and prices[size - 1] as the most recent. None of them modify the input array.
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

### Logger
* Can be used by other modules to log events to the console, a file, or both.
* Automatically timestamps the logged event.
* User can choose between tagging each event as INFO, WARNING, or ERROR.
* User determines file name.
* A new directory "logs" will be created in root. Currently no way to choose a different location.

## Documentation
* Doxygen-styled comments.
* Making use of @brief, @detail, @params, @return and @note to separate the different sections of comments.
* Mainly commenting in our .h and .hpp files, but also where some parts need further explanation.

## Testing
* Risk Assessment Engine has extensive tests that run on expected values made through demo-runs of the functions. It also checks boundary issues and edge cases to make sure that it provides the correct information.
* FX Conversion Module has extensive tests that run on expected values made through demo-runs of the functions. It also checks boundary issues and edge cases to make sure that it provides the correct information.
* Backtest Module has extensive tests that run on expected values made through demo-runs of the functions. It also checks boundary issues and edge cases to make sure that it provides the correct information.

### Test-examples:
* Risk-module example of tests that have been run:
```bash
[PASS] sharpe with exactly three prices (got 2229.621440)
[PASS] volatility on flat prices is 0 (got 0.000000)
[PASS] sharpe on flat prices avoids divide-by-zero
[PASS] rising prices produce low volatility (0.002413)
[PASS] rising prices produce a positive sharpe ratio (1011.616981)
[PASS] max drawdown on known price series (got 0.043026)
[PASS] max drawdown with fewer than 2 prices returns insufficient data
[PASS] max drawdown with exactly two prices (got 0.100000)
[PASS] max drawdown on rising prices is 0 (got 0.000000)
[PASS] max drawdown on falling prices matches first-to-last drop (got 0.066667)

10/10 tests passed
```

* Backtesting with increasing instruments over different periods of time:
```bash
[2026-11-02 13:18:13] INFO: Backtest completed successfully with 50 instrument(s) converted from SEK over a 1 year span.
Total Return: 9.4660%
Annualized return: 9.5055%
Max Drawdown: 21.7673%
Sharpe Ratio: 0.3815

[2026-11-02 13:19:18] INFO: Backtest completed successfully with 200 instrument(s) converted from SEK over a 1 year span.
Total Return: 9.4660%
Annualized return: 9.5055%
Max Drawdown: 21.7673%
Sharpe Ratio: 0.3815

[2026-11-02 13:19:51] INFO: Backtest completed successfully with 400 instrument(s) converted from SEK over a 1 year span.
Total Return: 9.4660%
Annualized return: 9.5055%
Max Drawdown: 21.7673%
Sharpe Ratio: 0.3815

[2026-11-02 13:22:46] INFO: Backtest completed successfully with 500 instrument(s) converted from SEK over a 1 year span.
Total Return: 9.4660%
Annualized return: 9.5055%
Max Drawdown: 21.7673%
Sharpe Ratio: 0.3815

[2026-11-02 13:26:15] INFO: Backtest completed successfully with 500 instrument(s) converted from SEK over a 5 year span.
Total Return: 9.4660%
Annualized return: 1.8268%
Max Drawdown: 35.0484%
Sharpe Ratio: 0.0752
```

* Main test-file of the Backtest-module example which gets exported into a log-file:
```bash
=== Testing extreme price values ===
[2026-11-03 10:38:30] INFO: [PASS] Extreme prices changes that cause overflow are rejected
[2026-11-03 10:38:30] INFO: 

=== Testing memory management ===
[2026-11-03 10:38:30] INFO: [PASS] Freeing nullptr does not crash
[2026-11-03 10:38:30] INFO: [PASS] Result allocation succeeds
[2026-11-03 10:38:30] INFO: [PASS] Allocated result can be freed
[2026-11-03 10:38:30] INFO: 
===== TEST SUMMARY =====
Tests run:    4
Tests passed: 4
Tests failed: 0
========================
```

* FX-test examples:
```bash
[PASS] Riksbank API, SEK to EUR GET request
[PASS] Parse JSON string
[PASS] Interval JSON parsing
[PASS] Interval FX

Tests passed: 4/4
```

## Known Issues/Limitations
* We decided against using BLAS and SIMD for the risk module because we didn't have the time to fully implement it after getting the module to work properly.
* Strategies are not fully implemented, we only have one standard strategy as of now as the program simulates BUY & HOLD (inital purchase and then sticks to the investment over time). This is because of a time-restraint issue. We prioritized getting the backtest-function operational before exploring extensive functionality, which took longer than anticipated.
* We didn't have time to implement caching of the fx-data, so this is currently a risk of exhausting the Riksbank-API when making extensive calls.

## Docs (Written in Swedish)
* BIDRAG(Contributions): https://github.com/chas-challenge-2026/avanza-team1/blob/develop/native/docs/BIDRAG.md
* BESLUT(Decisions): https://github.com/chas-challenge-2026/avanza-team1/blob/develop/native/docs/BESLUT.md

## Collaborators
* [Henrik Westerlund](https://github.com/Henrik-Westerlund)
* [Pär Lundh](https://github.com/lundhpargmailcom)

## Resources
* [Jansson](https://github.com/akheron/jansson)
* [libcurl](https://curl.se/libcurl/)
