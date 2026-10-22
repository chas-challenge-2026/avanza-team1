#include "backtest.hpp"
#include "../risk/risk.h"

#include <cmath>
#include <cstdlib>
#include <vector>

/* Helper to build an equally weighted, normalized portfolio from the input price data. */
static bool build_portfolio(const double *prices, int instruments, int days, double *portfolio)
{
    /* TODO: Needs to add weights regarding the instruments to fully simulate "strategies". Right now they are all measured equally. */
    if (prices == nullptr || portfolio == nullptr || instruments < 1)
    {
        return false;
    }

    if (days < 3)
    {
        return false;
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
                return false;
            }

            portfolio_value += price / initial_price;
        }

        portfolio[day] = portfolio_value / static_cast<double>(instruments);

        if (!std::isfinite(portfolio[day]) || portfolio[day] <= 0.0)
        {
            return false;
        }
    }

    return true;
}

void free_backtest_result(BacktestLibrary *result)
{
    if (result != nullptr)
    {
        free(result);
    }
}

BacktestLibrary *run_backtest(const double *prices, int instruments, int days)
{
    BacktestLibrary *result = static_cast<BacktestLibrary*>(malloc(sizeof(BacktestLibrary)));
    if (result == nullptr)
    {
        return nullptr;
    }

    result->total_return = 0.0;
    result->annualized_return = 0.0;
    result->max_drawdown = 0.0;
    result->sharpe_ratio = 0.0;

    if (prices == nullptr || days < 3 || instruments < 1)
    {
        return result;
    }

    const double risk_free_rate = DEFAULT_RISK_FREE_RATE;

    std::vector<double> portfolio(static_cast<size_t>(days));

    build_portfolio(prices, instruments, days, portfolio.data());

    double growth_factor = portfolio[days - 1] / portfolio[0];
    double years = static_cast<double>(days - 1) / ANNUAL_TRADING_DAYS;

    result->total_return = growth_factor - 1.0;
    result->annualized_return = std::pow(growth_factor, 1.0 / years) - 1.0;

    RiskStatus status = calculate_max_drawdown(portfolio.data(), days, &result->max_drawdown);
    if (status != RISK_SUCCESS)
    {
        free_backtest_result(result);
        return result;
    }

    status = calculate_sharpe(portfolio.data(), days, risk_free_rate, &result->sharpe_ratio);
    if (status != RISK_SUCCESS)
    {
        free_backtest_result(result);
        return result;
    }

    return result;
}