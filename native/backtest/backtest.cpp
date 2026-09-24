#include "backtest.hpp"
#include "../risk/risk.h"

#include <cmath>
#include <cstring>
#include <iostream>

BacktestResult *run_backtest(const double *prices, int instruments, int days, const char *strategy)
{
    (void)strategy;    

    if (prices == nullptr || days < 2 || instruments < 1)
    {
        return nullptr;
    }

    size_t size = static_cast<size_t>(days) * static_cast<size_t>(instruments);
    double risk_free_rate = 0.03;
    double growth = prices[size - 1] / prices[0];
    double years = static_cast<double>(days) / 252.0;
    
    BacktestResult *result = static_cast<BacktestResult*>(malloc(sizeof(BacktestResult)));
    if (result != nullptr)
    {
        result->total_return = growth - 1.0;
        
        if (years < 1)
        {
            result->annualized_return = 0.0; // TODO: Needs to be fixed so that it matches the output set by Java and Frontend.
        }
        else
        {
            result->annualized_return = pow(growth, 1.0 / years) - 1.0;
        }

        RiskStatus status = calculate_max_drawdown(prices, size, &result->max_drawdown);
        if (status != RISK_SUCCESS)
        {
            free(result);
            return nullptr;
        }

        status = calculate_sharpe(prices, size, risk_free_rate, &result->sharpe_ratio);
        if (status != RISK_SUCCESS)
        {
            free(result);
            return nullptr;
        }
    }

    return result;
}

void free_backtest_result(BacktestResult *result)
{
    if (result != nullptr)
    {
        free(result);
    }
}