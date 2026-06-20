# native/ — v2 C/C++-moduler

Denna katalog innehåller stub-struktur för v2:s prestandakritiska nativmoduler.
Modulerna anropas från Java via JNA (Java Native Access).

## Planerade moduler

### backtest/ — Backtestmotor
- **Språk:** C++17
- **Syfte:** Simulering av investeringsstrategier mot 5 år historisk data (upp till 500 instrument)
- **JNA-brygga:** `se.comerit.avanza.native.BacktestBridge`
- **Anledning till native:** JVM-GC orsakar oförutsägbara pauser vid stora tidsserieoperationer

```c
// Planerat API
typedef struct {
    double total_return;
    double annualized_return;
    double max_drawdown;
    double sharpe_ratio;
} BacktestResult;

BacktestResult* run_backtest(
    const double* prices,  // pris-tidsserie, len=days*instruments
    int instruments,
    int days,
    const char* strategy   // "BUY_HOLD", "REBALANCE_MONTHLY", etc.
);
```

### risk/ — Rullande riskmått
- **Språk:** C med BLAS-optimering
- **Syfte:** Beräknar volatilitet, Sharpe-kvot och max drawdown över stora tidsserier
- **Anledning till native:** Vektoriserade SIMD-operationer för 10x–50x snabbare beräkning än pure Java

### fx/ — FX-pipeline
- **Språk:** C++
- **Syfte:** Historisk FX-lookup mot ECB-data + realtidshämtning
- **Anledning till native:** Låg latens, undviker JVM-overhead för nätverks-I/O i hot path

## Bygg

```bash
# Kräver cmake, g++, libjansson-dev
cd native/backtest
cmake -B build -DCMAKE_BUILD_TYPE=Release
cmake --build build
# Genererar: libbacktest.so (Linux) / backtest.dll (Windows)
```

## Integration med Java (JNA-exempel)

```java
public interface BacktestLibrary extends Library {
    BacktestLibrary INSTANCE = Native.load("backtest", BacktestLibrary.class);
    BacktestResult.ByValue run_backtest(
        double[] prices, int instruments, int days, String strategy
    );
}
```

## Status

Modulerna är planerade för v2. v1 beräknar allt i Java inline i controller-metoder
med hårdkodade värden — se `docs/known-bugs.md`.
