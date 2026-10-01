#ifndef fx_hpp
#define fx_hpp

#include <cstddef>
#include <map>
#include <string>

/*  This module handles value conversions by calling Sveriges Riksbank's API 
    using Libcurl and using Jansson to parse the JSON data.
*/

typedef enum
{
    FX_OK,
    FX_ERR_INVALID_CURRENCY,    /*  Currency signature not 3 letters */
    FX_ERR_CURL,                /*  Curl error */
    FX_ERR_NULLPTR,             /*  Invalid pointer to FX_Struct */
    FX_ERR_JSON,                /*  Error when parsing JSON */
    FX_ERR_INVALID_DATE,        /*  Dates must be in YYYY-MM-DD format */
    FX_ERR                      /*  Generic error */
} FX_Code;

/*  Struct for Curl callback function */
typedef struct
{
    char *string;
    size_t size;
} Response;

typedef struct
{
    char date[11];
    double rate;
} FX_Data;

/*  Callback function for Curl GET request */
size_t write_data(char *buffer, size_t size, size_t nmemb, void *user_data);

/*  Accepts an FX_Data struct to store date and exchange rate between SEK and another currency */
FX_Code fx_convert_current(FX_Data *fx_data, const char *curr);

/*  Accepts a double array of prices divided up between instruments and days.
    instrument_target is the index for which series of prices to convert from curr to SEK.
    Example: prices[50], instruments 5, instrument_target 2, days 10, curr EUR. Index 20-29 will be converted from EUR to SEK. */
FX_Code fx_convert_series(double *prices, int instruments, int instrument_target, int days, const char *curr);

/*  Parses the JSON data in buffer and stores the date and exchange rate in fx_data */
FX_Code fx_parse_string(FX_Data *fx_data, const char *buffer);

/*  Helper function for Curl GET request, must free response.string after use */
FX_Code fx_curl(const char *url, Response *response);

/*  Takes a JSON string with the format of [{"date":"YYYY-MM-DD", "value":0.00}] 
    and stores them as key value pairs in fx_map */
FX_Code fx_parse_string_interval(const char *buffer, std::map<std::string, double> *fx_map);


#endif // fx_hpp