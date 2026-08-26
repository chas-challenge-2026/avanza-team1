# Native Contract — Portfolio Drift Module

**Version:** 1.0  
**Date:** 2026-08-26  
**Status:** Draft for team approval  
**Consumers:** C/C++ team, Java `DriftCalculator`  
**Based on:** `02-prd.md`, `03-architecture.md`, `04-api-contract.md`  
**School note:** The module must be buildable, testable, and explainable even if the live demo uses the Java fallback.

---

## 1. Purpose

One native library computes **allocation drift** from three numbers. It does not touch HTTP, SQL, JSON, or files.

Working name: **portfoliodrift**  
Artefact: `libportfoliodrift.so` (Linux) / `portfoliodrift.dll` (Windows) / `libportfoliodrift.dylib` (macOS)

This is the only native module in MVP. School ideas for backtest and FX pipelines stay in the parking lot.

---

## 2. Why native exists here

Not because drift maths is heavy. Because the course requires a C/C++ slice that is:

- compiled with a real toolchain
- unit-tested without Spring
- describable in a demo (“input → output → why we trust it”)
- optionally loaded from Java via JNA

If load fails, Java runs the **same fixtures** and sets `computedBy: "JAVA_FALLBACK"`.

---

## 3. Problem the function solves

Given:

- live equity weight in percent (0–100)
- target equity weight in percent (0–100)
- threshold in percentage points (MVP: 5)

Return:

- absolute drift in percentage points
- whether the threshold is exceeded (`drift >= threshold`)
- a status code so callers can distinguish bad input from “on track”

Fund percent is implied: `100 − equity` for both live and target. The library does not take fund percent. That keeps the ABI small and consistent with PRD drift = `abs(liveEquity − targetEquity)`.

---

## 4. C ABI

Language: C11 or C++17 with `extern "C"` exported symbols. Prefer a `.c` / `.h` core so JNA mapping stays obvious.

Header sketch (`native/drift/include/portfolio_drift.h`):

```c
#ifndef PORTFOLIO_DRIFT_H
#define PORTFOLIO_DRIFT_H

#ifdef __cplusplus
extern "C" {
#endif

enum PdStatus {
    PD_OK = 0,
    PD_ERR_NULL = 1,
    PD_ERR_NAN = 2,
    PD_ERR_RANGE = 3
};

enum PdTrack {
    PD_ON_TRACK = 0,
    PD_DRIFTED = 1
};

typedef struct PdResult {
    int status;          /* PdStatus */
    int track;           /* PdTrack; only meaningful if status == PD_OK */
    double drift_pp;     /* absolute difference; 0.0 if status != PD_OK */
    double threshold_pp; /* echo of input threshold */
    int exceeded;        /* 1 if drift_pp >= threshold_pp and status == PD_OK */
} PdResult;

/* Returns PD_OK and fills *out on valid input.
   live_equity_pct and target_equity_pct must be finite and in [0, 100].
   threshold_pp must be finite and >= 0.
   out must be non-null. */
int pd_compute_drift(
    double live_equity_pct,
    double target_equity_pct,
    double threshold_pp,
    PdResult *out
);

const char *pd_version(void);

#ifdef __cplusplus
}
#endif

#endif
```

Rules:

| Input                       | Reject with    |
| --------------------------- | -------------- |
| `out == NULL`               | `PD_ERR_NULL`  |
| NaN or Inf in any double    | `PD_ERR_NAN`   |
| equity % outside `[0, 100]` | `PD_ERR_RANGE` |
| `threshold_pp < 0`          | `PD_ERR_RANGE` |

On any error: `track = PD_ON_TRACK`, `drift_pp = 0`, `exceeded = 0`, `threshold_pp` copied if finite else `0`.

On success:

```
drift_pp   = fabs(live_equity_pct - target_equity_pct)
exceeded   = drift_pp >= threshold_pp   /* equality counts */
track      = exceeded ? PD_DRIFTED : PD_ON_TRACK
```

Do not round before comparison. Tests use values with at most two decimals.

`pd_version()` returns a static string such as `"1.0.0"`.

---

## 5. Fixtures (law for native _and_ Java fallback)

These must produce identical results in C tests and Java unit tests.

| ID  | live   | target | threshold | status | drift_pp | exceeded | track    |
| --- | ------ | ------ | --------- | ------ | -------- | -------- | -------- |
| F1  | 60.00  | 60.00  | 5.00      | OK     | 0.00     | 0        | ON_TRACK |
| F2  | 62.00  | 60.00  | 5.00      | OK     | 2.00     | 0        | ON_TRACK |
| F3  | 64.99  | 60.00  | 5.00      | OK     | 4.99     | 0        | ON_TRACK |
| F4  | 65.00  | 60.00  | 5.00      | OK     | 5.00     | 1        | DRIFTED  |
| F5  | 72.43  | 60.00  | 5.00      | OK     | 12.43    | 1        | DRIFTED  |
| F6  | 55.00  | 60.00  | 5.00      | OK     | 5.00     | 1        | DRIFTED  |
| F7  | 40.00  | 60.00  | 5.00      | OK     | 20.00    | 1        | DRIFTED  |
| F8  | 0.00   | 0.00   | 5.00      | OK     | 0.00     | 0        | ON_TRACK |
| F9  | 100.00 | 0.00   | 5.00      | OK     | 100.00   | 1        | DRIFTED  |
| F10 | 60.00  | 60.00  | 0.00      | OK     | 0.00     | 1        | DRIFTED  |
| E1  | -0.01  | 60.00  | 5.00      | RANGE  | 0        | 0        | —        |
| E2  | 100.01 | 60.00  | 5.00      | RANGE  | 0        | 0        | —        |
| E3  | 60.00  | 60.00  | -1.00     | RANGE  | 0        | 0        | —        |
| E4  | NaN    | 60.00  | 5.00      | NAN    | 0        | 0        | —        |

F10 documents the `>=` rule: zero threshold means any call with OK input is `exceeded`. Production config still uses 5.00.

Tolerance in tests: `fabs(actual - expected) < 1e-9` for `drift_pp`.

---

## 6. What the library must not do

- Read environment variables for the threshold (caller passes it)
- Classify tickers
- Convert FX
- Allocate a result on the heap that the caller must free (fill the struct the caller provides)
- Print to stdout in the happy path
- Depend on JVM headers

---

## 7. Build

Suggested tree:

```
native/
  README.md                 updated by C++ team
  drift/
    CMakeLists.txt
    include/portfolio_drift.h
    src/portfolio_drift.c
    tests/test_portfolio_drift.c
```

Build (Linux / WSL / macOS):

```bash
cd native/drift
cmake -B build -DCMAKE_BUILD_TYPE=Release
cmake --build build
ctest --test-dir build --output-on-failure
```

Windows: same with Visual Studio generator or MinGW; document the exact commands in `native/README.md`.

CMake must produce a **shared** library. Static-only is not enough for JNA.

Do not require BLAS. `fabs` from `math.h` is enough.

---

## 8. Tests

Minimum: one C test file that asserts every fixture in section 5, including a NULL `out` pointer → `PD_ERR_NULL`.

Test runner: CTest, or a tiny `main` + CMake `add_test`. No Spring. No Docker required for native unit tests.

Java fallback tests copy the same table. If a fixture is changed, change it here first.

---

## 9. Java bridge (owned by Java, specified here)

Interface sketch (do not treat as finished code):

```text
pd_compute_drift(double live, double target, double threshold, PdResult out) -> int
pd_version() -> String
```

`PdResult` fields map 1:1 to the C struct. Use JNA `Structure` with the same order: `status`, `track`, `drift_pp`, `threshold_pp`, `exceeded`.

Load name: `portfoliodrift` (`native.library-name`).

Behaviour:

```
if native.enabled && library loads && pd_compute_drift == PD_OK:
    map track / exceeded / drift_pp
    computedBy = NATIVE
else:
    run Java fallback
    computedBy = JAVA_FALLBACK
```

If native returns `PD_ERR_*` on values the service already validated, treat as a bug: log, fall back, do not fail the HTTP request.

The API layer still decides `NO_TARGET` and `NO_BASIS`. Native is only called when both live and target equity percents exist.

---

## 10. Mapping to API `drift` object

| API field          | Native / fallback                                                                       |
| ------------------ | --------------------------------------------------------------------------------------- |
| `driftPercent`     | `drift_pp`                                                                              |
| `thresholdPercent` | `threshold_pp` (must be 5.00 in MVP)                                                    |
| `exceeded`         | `exceeded == 1`                                                                         |
| `status`           | `DRIFTED` if exceeded else `ON_TRACK` (only when the API already passed valid percents) |
| `indicator`        | `warn` / `ok`                                                                           |
| `computedBy`       | `NATIVE` or `JAVA_FALLBACK`                                                             |

---

## 11. Documentation the C++ pair must keep current

In `native/README.md` (replace the school stub over time):

1. What the function computes, in one paragraph
2. Build commands for the OS you actually use
3. How to run tests
4. Fixture table pointer (this file)
5. How Java loads it, or “not wired yet — fallback on”
6. Known limits (percent inputs only, no time series)

A short `native/drift/EXPLAIN.md` is useful for the oral exam: why `>=`, why OTHER is not in the ABI, why fallback exists.

---

## 12. Individual visibility

Suggested split (adjust in `08-team-board.md`):

| Person | Slice                                      |
| ------ | ------------------------------------------ |
| One    | header + implementation + F1–F10           |
| Other  | CMake + tests E1–E4 + README + explain doc |

Both should be able to draw the data flow on a whiteboard: portfolio service → `pd_compute_drift` → JSON.

---

## 13. Out of scope

- SIMD / BLAS
- Historical volatility, Sharpe, max drawdown as customer features
- ECB HTTP client in C++
- Backtest engine
- Passing arrays of holdings into native in MVP

If week 6–7 is empty and CTO feedforward asks for a “real” metric, add a **second function** in this same library (`pd_max_drawdown` or similar) rather than a second repo folder. Do not start that in week 2.

---

## 14. Definition of Done for the native slice

- [ ] Shared library builds on at least one documented OS
- [ ] All fixtures pass in C tests
- [ ] README can be followed by another teammate
- [ ] Java fallback tests exist with the same fixtures
- [ ] Integration flag documented (`native.enabled`)
- [ ] Demo script: run `ctest` live **or** show test output + explain fallback

Wiring JNA is a bonus, not the course-safety net.

---

## 15. Next document

`06-ux-spec.md` — screens and copy for the five-step flow, including banned advice phrases.

---

## 16. AI disclosure

Drafted with BMAD Fullstack Team assistance (Grok / BMad Orchestrator) on 2026-08-26. C++ and Java should confirm the struct field order before JNA work.
