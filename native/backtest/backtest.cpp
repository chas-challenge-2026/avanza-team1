#include "backtest.hpp"
#include "../fx/fx.hpp"
extern "C" {
    #include "../risk/risk.h"
}
#include <cstdlib>
#include <cstring>
#include <cmath>
#include <vector>

static bool build_portfolio(const double *prices, int instruments, int days, double *portfolio)
{
    /* TODO: Needs to add weights regarding the instruments to fully simulate "strategies". Right now they are all measured equally. */
    if (prices == nullptr || portfolio == nullptr || instruments < 1 || days < 3)
    {
        return false;
    }

    for (int instrument = 0; instrument < instruments; instrument++)
    {
        const size_t offset = static_cast<size_t>(instrument) * days;
        const double initial_price = prices[offset];

        if (!std::isfinite(initial_price) || initial_price <= 0.0)
        {
            return false;
        }

        for (int day = 0; day < days; day++)
        {
            const double price = prices[offset + static_cast<size_t>(day)];

            if (!std::isfinite(price) || price <= 0.0)
            {
                return false;
            }
        }
    }

    for (int day = 0; day < days; day++)
    {
        double portfolio_value = 0.0;

        for (int instrument = 0; instrument < instruments; instrument++)
        {
            const size_t offset = static_cast<size_t>(instrument) * static_cast<size_t>(days);

            const double price = prices[offset + static_cast<size_t>(day)];
            const double initial_price = prices[offset];

            portfolio_value += price / initial_price;
        }

        portfolio[static_cast<size_t>(day)] = portfolio_value / static_cast<double>(instruments);

        if (!std::isfinite(portfolio[static_cast<size_t>(day)]) || portfolio[static_cast<size_t>(day)] <= 0.0)
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
        if (result->currency != nullptr)
        {
            free(result->currency);
        }
        free(result);
    }
}

BacktestLibrary *run_backtest(const double *prices, int instruments, int days, const char *currency)
{
    if (prices == nullptr || currency == nullptr || days < 3 || instruments < 1)
    {
        return nullptr;
    }

    const double risk_free_rate = DEFAULT_RISK_FREE_RATE;

    BacktestLibrary *result = static_cast<BacktestLibrary*>(malloc(sizeof(BacktestLibrary)));
    if (result == nullptr)
    {
        return nullptr;
    }
    result->currency = nullptr;

    const size_t instrument_count = static_cast<size_t>(instruments);
    const size_t day_count = static_cast<size_t>(days);

    if (instrument_count > static_cast<size_t>(-1) / day_count)
    {
        free_backtest_result(result);
        return nullptr;
    }

    size_t size = instrument_count * day_count;

    std::vector<double> working_prices(prices, prices + size);
    if (std::strcmp(currency, "SEK") != 0)
    {
        for (int inst = 0; inst < instruments; ++inst)
        {
            if (fx_convert_series(working_prices.data(), instruments, inst, days, currency) != FX_OK)
            {
                free_backtest_result(result);
                return nullptr;
            }
        }
    }

    const char *output_currency = "SEK";

    size_t curr_len = std::strlen(output_currency) + 1;
    result->currency = static_cast<char*>(malloc(curr_len));
    if (result->currency == nullptr)
        {
            free_backtest_result(result);
            return nullptr;
        }
    std::memcpy(result->currency, output_currency, curr_len);

    // Build normalized, equally weighted portfolio
    std::vector<double> portfolio(static_cast<size_t>(days));

    if (!build_portfolio(working_prices.data(), instruments, days, portfolio.data()))
    {
        free_backtest_result(result);
        return nullptr;
    }

    // Calculate portfolio performance
    double years = static_cast<double>(days - 1) / ANNUAL_TRADING_DAYS;
    double growth_factor = portfolio.back() / portfolio.front();

    result->total_return = growth_factor - 1.0;
    result->annualized_return = std::pow(growth_factor, 1.0 / years) - 1.0;

    // Calculate portfolio risk metrics
    RiskStatus status = calculate_max_drawdown(portfolio.data(), static_cast<size_t>(days), &result->max_drawdown);

    if (status != RISK_SUCCESS)
    {
        free_backtest_result(result);
        return nullptr;
    }

    status = calculate_sharpe(
        portfolio.data(),
        static_cast<size_t>(days),
        risk_free_rate,
        &result->sharpe_ratio
    );

    if (status != RISK_SUCCESS)
    {
        free_backtest_result(result);
        return nullptr;
    }

    return result;
}
