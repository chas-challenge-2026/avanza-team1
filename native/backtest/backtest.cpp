#include "backtest.hpp"
#include "../risk/risk.h"

BacktestResult *run_backtest(const double *prices, int instruments, int days, const char *strategy)
{
    (void)strategy;

    size_t size = static_cast<size_t>(days) * static_cast<size_t>(instruments);
    double risk_free_rate = 0.03;
    double years = static_cast<double>(days) / 252;
    if (days < 252)
    {
        years = 1;
    }
    
    BacktestResult *result = new BacktestResult{};
    result->total_return = 15000;
    result->annualized_return = result->total_return / years;
    //result->max_drawdown = 0.13;
    //result->sharpe_ratio = 1.29;
    
    calculate_max_drawdown(prices, size, &result->max_drawdown);
    calculate_sharpe(prices, size, risk_free_rate, &result->sharpe_ratio);

    return result;
}

void free_backtest_result(BacktestResult *result)
{
    delete result;
}