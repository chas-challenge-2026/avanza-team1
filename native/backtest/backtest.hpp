#pragma once

#include <cstdlib>

/* Checks compiler on different OS systems so not to cause bad errors */
/* Microsoft Visual Studio or MinGW (Windows) */
#if defined(_MSC_VER) || defined(__MINGW32__)
    #define EXPORT __declspec(dllexport)

/* GCC or Clang (Linux, macOS, BSD, etc.) */
#elif defined(__GNUC__) || defined(__clang__)
    #define EXPORT __attribute__((visibility("default")))

/* Fallback for unknown compilers */
#else
    #define EXPORT
    #pragma warning Unknown dynamic link export semantics.
#endif

typedef struct
{
    double total_return;
    double annualized_return;
    double max_drawdown;
    double sharpe_ratio;
} NativeBridgeModule;

extern "C" 
{
    EXPORT NativeBridgeModule *run_backtest(const double *prices, int instruments, int days, const char *strategy);
    
    EXPORT void free_backtest_result(NativeBridgeModule *result);
}