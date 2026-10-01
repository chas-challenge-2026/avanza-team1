#ifndef HELPERS_H
#define HELPERS_H

#include "../risk.h"

#include <stdbool.h>

typedef struct
{
    double sum;
    double sum_squared;
    size_t count;
} RollingStatistics;

bool valid_price_series(const double prices[], size_t size);

/**
 * @brief Calculates simple returns from a price series.
 *
 * @param prices Price array in chronological order.
 * @param size Number of prices.
 * @param returns Output array containing size - 1 returns.
 * 
 * @return RISK_SUCCESS on success, otherwise RISK_INVALID_INPUT.
 */
RiskStatus calculate_returns(const double prices[], size_t size, double returns[]);

RiskStatus calculate_return_statistics(const double prices[], size_t size, double *mean, double *variance);

void rolling_statistics_add(RollingStatistics *stats, double value);
void rolling_statistics_remove(RollingStatistics *stats, double value);

double rolling_statistics_mean(const RollingStatistics *stats);
double rolling_statistics_variance(const RollingStatistics *stats);

#endif