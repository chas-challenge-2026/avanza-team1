#ifndef HELPERS_H
#define HELPERS_H

#include <math.h>
#include <stdbool.h>
#include <stdlib.h>


double calculate_average_return(const double prices[], size_t size);

RiskStatus calculate_returns(const double prices[], size_t size, double returns[]);

bool valid_price_series(const double prices[], size_t size);


#endif