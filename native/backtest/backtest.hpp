#pragma once

#include <cstddef>

typedef struct
{
    double total_return;
    double annualized_return;
    double max_drawdown;
    double sharpe_ratio;
} BacktestResult;

extern "C" 
{
    BacktestResult *run_backtest(const double *prices, int instruments, int days, const char *strategy);
    
    void free_backtest_result(BacktestResult *result);
}