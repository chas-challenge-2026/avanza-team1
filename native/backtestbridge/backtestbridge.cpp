#include <cstdlib>

/* Checks compiler on different OS systems so not to cause bad errors */
/* Microsoft Visual Studio or MinGW (Windows) */
#if defined(_MSC_VER) || defined(__MINGW32__)
    #define EXPORT __declspec(dllexport)

/* GCC or Clang (Linux, macOS, BSD, etc.)
#elif defined(__GNUC__) || defined(__clang__)
    #define EXPORT __attribute__((visibility("default")))

/* Fallback for unknown compilers */
#else
    #define EXPORT
    #pragma warning Unknown dynamic link export semantics.
#endif

/* Struct */
typedef struct {
    double total_return;
    double annualized_return;
    double max_drawdown;
    double sharpe_ratio;
} NativeBridgeModule;

/* Extern based C class that is required for standard ABI type creation to disable name mangling */
extern "C" {

    /* Applies the EXPORT macro to make the function visible to JNA */
    EXPORT NativeBridgeModule* run_backtest(
            const double* prices,
            int instruments,
            int days,
            const char* strategy
    ) {
        /* Example Allocation: for the struct on the heap */
        NativeBridgeModule* result = (NativeBridgeModule*)malloc(sizeof(NativeBridgeModule));

        /* Execute backtest logic using your existing C++ engine here. */
        /* For demonstration, assigning dummy values: */
        if (result != nullptr) {
            result->total_return = 1.15;
            result->annualized_return = 0.08;
            result->max_drawdown = -0.12;
            result->sharpe_ratio = 1.5;
        }

        return result; /* Returns the pointer to Java */
    }

    /* Exported function to free the pointer and prevent memory leaks */
    EXPORT void free_backtest_result(NativeBridgeModule* result) {
        if (result != nullptr) {
            free(result);
        }
    }
}