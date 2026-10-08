#include "backtest.hpp"
#include "../risk/risk.h"

#include <cmath>
#include <cstdlib>
#include <vector>

void free_backtest_result(BacktestLibrary *result)
{
    free(result);
}

BacktestLibrary *run_backtest(const double *prices, int instruments, int days)
{
    if (prices == nullptr || days < 3 || instruments < 1)
    {
        return nullptr;
    }

    double risk_free_rate = 0.03;

    BacktestLibrary *result = static_cast<BacktestLibrary*>(malloc(sizeof(BacktestLibrary)));
    if (result == nullptr)
    {
        if (prices == nullptr || days < 3 || instruments < 1)
        {
            return nullptr;
        }

        double risk_free_rate = 0.03;

        size_t size = static_cast<size_t>(days) * static_cast<size_t>(instruments);
        double years = static_cast<double>(days - 1) / 252.0;
        double growth_factor = prices[size - 1] / prices[0];

        result->total_return = growth_factor - 1.0;
        result->annualized_return = std::pow(growth_factor, 1.0 / years) - 1.0;

        RiskStatus status = calculate_max_drawdown(prices, size, &result->max_drawdown);
        if (status != RISK_SUCCESS)
        {
            free_backtest_result(result);
            return nullptr;
        }

        status = calculate_sharpe(prices, size, risk_free_rate, &result->sharpe_ratio);
        if (status != RISK_SUCCESS)
        {
            free_backtest_result(result);
            return nullptr;
        }

        return result;
    }
}