#include "backtest.hpp"
#include "../fx/fx.hpp"
extern "C" 
{
    #include "../risk/risk.h"
}
#include <cmath>
#include <cstdlib>
#include <cstring>
#include <vector>

//=============================================

/**
 * Helper to build an equally weighted, normalized portfolio from the input price data.
 */
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
        if(result->currency != nullptr)
        {
            free(result->currency);
        }
        free(result);
    }
}

BacktestLibrary *run_backtest(const double *prices, int instruments, int days, const char *currency)
{
    if (prices == nullptr || currency == nullptr || currency[0] == '\0' || days < 3 || instruments < 1)
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

    // Prevents overflow when calculating the total number of price values.
    if (instrument_count > static_cast<size_t>(-1) / day_count)
    {
        free_backtest_result(result);
        return nullptr;
    }

    const size_t size = instrument_count * day_count;

    std::vector<double> working_prices(prices, prices + size);
    // Convert each instruments price series individually to SEK if a foreign currency is identified.
    if (std::strcmp(currency, "SEK") != 0)
    {
        for (int instrument = 0; instrument < instruments; instrument++)
        {
            if (fx_convert_series(working_prices.data(), instruments, instrument, days, currency) != FX_OK)
            {
                free_backtest_result(result);
                return nullptr;
            }
        }
    }

    const char *output_currency = "SEK";
    const size_t currency_length = strlen(output_currency) + 1;
    result->currency = static_cast<char*>(malloc(currency_length));
    if (result->currency == nullptr)
    {
        free_backtest_result(result);
        return nullptr;
    }

    std::memcpy(result->currency, output_currency, currency_length);
    
    // Build an equally weighted portfolio with each instrument normalized to its initial price.
    // This prevents differences in share prices from affecting the instruments portfolio weight.
    std::vector<double> portfolio(day_count);
    if (!build_portfolio(working_prices.data(), instruments, days, portfolio.data()))
    {
        free_backtest_result(result);
        return nullptr;
    }

    const double years = static_cast<double>(days - 1) / ANNUAL_TRADING_DAYS;
    const double growth_factor = portfolio.back() / portfolio.front();
    result->total_return = growth_factor - 1.0;
    result->annualized_return = std::pow(growth_factor, 1.0 / years) - 1.0;
    if (!std::isfinite(result->total_return) || !std::isfinite(result->annualized_return))
    {
        free_backtest_result(result);
        return nullptr;
    }
    
    RiskStatus status = calculate_max_drawdown(portfolio.data(), day_count, &result->max_drawdown);
    if (status != RISK_SUCCESS)
    {
        free_backtest_result(result);
        return nullptr;
    }

    // A zero-volatility portfolio has no defined Sharpe ratio.
    status = calculate_sharpe(portfolio.data(), day_count, risk_free_rate, &result->sharpe_ratio);
    if (status != RISK_SUCCESS)
    {
        if (status == RISK_ZERO_VOLATILITY)
        {
            result->sharpe_ratio = 0.0;
        }
        else
        {
            free_backtest_result(result);
            return nullptr;
        }
    }

    return result;
}