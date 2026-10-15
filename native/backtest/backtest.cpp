#include "backtest.hpp"
#include "../risk/risk.h"
#include "../logger/logger.hpp"

#include <cmath>
#include <cstdlib>
#include <string>
#include <vector>

/* TODO:
   * Document these files with doxygen.
   * Create tests for this module.
   *  
*/

/* Helper to convert the status from the risk functions and converting them into statuses related to the Backtesting functions. */
static BacktestStatus convert_to_backtest_status(RiskStatus status)
{
    switch (status)
    {
        case RISK_SUCCESS:              return BACKTEST_SUCCESS;
        case RISK_INVALID_INPUT:        return BACKTEST_INVALID_INPUT;
        case RISK_INSUFFICIENT_DATA:    return BACKTEST_INSUFFICIENT_DATA;
        case RISK_ZERO_VOLATILITY:      return BACKTEST_ZERO_VOLATILITY;
    }

    return BACKTEST_INVALID_INPUT;
}

/* Helper to build an equally weighted, normalized portfolio from the input price data. */
static BacktestStatus build_portfolio(const double *prices, int instruments, int days, double *portfolio)
{
    /* TODO: Needs to add weights regarding the instruments to fully simulate "strategies". Right now they are all measured equally. */
    if (prices == nullptr || portfolio == nullptr || instruments < 1)
    {
        return BACKTEST_INVALID_INPUT;
    }

    if (days < 3)
    {
        return BACKTEST_INSUFFICIENT_DATA;
    }

    for (int day = 0; day < days; day++)
    {
        double portfolio_value = 0.0;

        for (int instrument = 0; instrument < instruments; instrument++)
        {
            const size_t index = static_cast<size_t>(instrument) * static_cast<size_t>(days) + static_cast<size_t>(day);
            
            const double price = prices[index];
            const double initial_price = prices[instrument * days];

            if (!std::isfinite(price) || !std::isfinite(initial_price) || price <= 0.0 || initial_price <= 0.0)
            {
                return BACKTEST_INVALID_INPUT;
            }

            portfolio_value += price / initial_price;
        }

        portfolio[day] = portfolio_value / static_cast<double>(instruments);

        if (!std::isfinite(portfolio[day]) || portfolio[day] <= 0.0)
        {
            return BACKTEST_INVALID_INPUT;
        }
    }

    return BACKTEST_SUCCESS;
}

void free_backtest_result(BacktestLibrary *result)
{
    if (result != nullptr)
    {
        free(result);
    }
}

BacktestLibrary *run_backtest(const double *prices, int instruments, int days, const char *currency)
{
    (void)currency;

    BacktestLibrary *result = static_cast<BacktestLibrary*>(malloc(sizeof(BacktestLibrary)));
    if (result == nullptr)
    {
        return nullptr;
    }

    result->status = BACKTEST_INVALID_INPUT;
    result->total_return = 0.0;
    result->annualized_return = 0.0;
    result->max_drawdown = 0.0;
    result->sharpe_ratio = 0.0;

    if (prices == nullptr || instruments < 1)
    {
        return result;
    }

    if (days < 3)
    {
        result->status = BACKTEST_INSUFFICIENT_DATA;
        return result;
    }

    const double risk_free_rate = DEFAULT_RISK_FREE_RATE;

    std::vector<double> portfolio(static_cast<size_t>(days));

    BacktestStatus status = build_portfolio(prices, instruments, days, portfolio.data());

    if (status != BACKTEST_SUCCESS)
    {
        result->status = status;
        return result;
    }

    double growth_factor = portfolio[days - 1] / portfolio[0];
    double years = static_cast<double>(days - 1) / ANNUAL_TRADING_DAYS;

    result->total_return = growth_factor - 1.0;
    result->annualized_return = std::pow(growth_factor, 1.0 / years) - 1.0;

    RiskStatus risk_status = calculate_max_drawdown(portfolio.data(), days, &result->max_drawdown);
    if (risk_status != RISK_SUCCESS)
    {
        result->status = convert_to_backtest_status(risk_status);
        return result;
    }

    risk_status = calculate_sharpe(portfolio.data(), days, risk_free_rate, &result->sharpe_ratio);
    if (risk_status != RISK_SUCCESS)
    {
        result->status = convert_to_backtest_status(risk_status);
        return result;
    }

    result->status = BACKTEST_SUCCESS;

    return result;
}