#include "backtest.hpp"
#include "../fx/fx.hpp"
extern "C" {
    #include "../risk/risk.h"
}
#include <cstdlib>
#include <cstring>
#include <cmath>
#include <vector>

//--------------------------- Cut off here (from libraries). Makes readability nicer, you can choose whether you keep it ;)

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

    double risk_free_rate = 0.03;

    BacktestLibrary *result = static_cast<BacktestLibrary*>(malloc(sizeof(BacktestLibrary)));
    if (result == nullptr)
    {
        return nullptr;
    }
    result->currency = nullptr;

    // Copies currency to heap so that JNA can read the string securely - Svartakatten
#if defined(_WIN32)
    result->currency = _strdup(currency);
#else
    result->currency = strdup(currency);
#endif

    size_t size = static_cast<size_t>(days) * static_cast<size_t>(instruments);

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

    double years = static_cast<double>(days - 1) / 252.0;
    double growth_factor = working_prices[size - 1] / working_prices[0];

    result->total_return = growth_factor - 1.0;
    result->annualized_return = std::pow(growth_factor, 1.0 / years) - 1.0;

    RiskStatus status = calculate_max_drawdown(working_prices.data(), size, &result->max_drawdown);
    if (status != RISK_SUCCESS)
    {
        free_backtest_result(result);
        return nullptr;
    }

    status = calculate_sharpe(working_prices.data(), size, risk_free_rate, &result->sharpe_ratio);
    if (status != RISK_SUCCESS)
    {
        free_backtest_result(result);
        return nullptr;
    }

    return result;
}