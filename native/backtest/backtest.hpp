#pragma once

#include <cstdlib>

#ifndef BACKTEST_HPP
#define BACKTEST_HPP

/* Checks compiler on different OS systems so not to cause bad errors */
#if defined(_WIN32) || defined(_WIN64)
    #define EXPORT __declspec(dllexport)
#else
    #define EXPORT __attribute__((visibility("default")))
#endif

typedef struct
{
    double total_return;
    double annualized_return;
    double max_drawdown;
    double sharpe_ratio;
    char *currency;
} BacktestLibrary;

#ifdef __cplusplus
extern "C" 
{
#endif

    EXPORT void free_backtest_result(BacktestLibrary *result);

    EXPORT BacktestLibrary *run_backtest(const double *prices, int instruments, int days, const char *currency);

#ifdef __cplusplus
}
#endif

#endif