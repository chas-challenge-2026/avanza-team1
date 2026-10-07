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

/**
 * @brief Callback function for Curl GET request.
 * 
 * @param buffer Data received by Curl, not entered manually.
 * @param size Always 1, not entered manually.
 * @param nmemb Size of data received by Curl, not entered manually.
 * @param user_data Pointer to a Response struct where buffer will be stored in ->string
 * 
 * @return Size of data received.
 * 
 * @details Used in fx_curl() which uses curl_easy_setopt() and curl_easy_perform(). Not to be used manually.
 * 
 */
size_t write_data(char *buffer, size_t size, size_t nmemb, void *user_data);

/**
 * @brief Calculates an amount of money from a different currency into Swedish kronor (SEK).
 * 
 * @param val Amount of money in curr currency to convert to SEK.
 * @param curr 3 letter currency code (examples: EUR, USD, CAD) to convert into Swedish kronor (SEK)
 * 
 * @return Resulting amount of money in SEK.
 * 
 */
double fx_convert_current(double val, const char *curr);

/**
 * @brief Converts a series of daily stock prices from curr to SEK.
 * 
 * @param prices Double array of all combined daily prices.
 * @param instruments Number of instruments (for example a stock or a fund).
 * @param instrument_target Index of instrument to convert.
 * @param days Number of days per instrument.
 * @param curr 3 letter currency code (examples: EUR, USD, CAD) to convert into Swedish kronor (SEK).
 * 
 * @return Error code.
 * 
 * @details The length of prices is instruments * days. Assuming instruments is 5 and days is 10, the length of
 * prices will be 50. Index 0-9 of prices will be 10 days of stock prices for instrument 0. Instrument 1 is 10-19, 
 * instrument 2 is 20-29, etc. Instrument_target decides which of these sequences of prices to convert into SEK.
 * 
 */
FX_Code fx_convert_series(double *prices, int instruments, int instrument_target, int days, const char *curr);

/*  Parses the JSON data in buffer and stores the date and exchange rate in fx_data */

/**
 * @brief Parses JSON string in buffer and stores data in fx_data.
 * 
 * @param fx_data Pointer to FX_Data struct that will store date and exchange rate.
 * @param buffer JSON string.
 * 
 * @return Error code.
 * 
 */
FX_Code fx_parse_string(FX_Data *fx_data, const char *buffer);

/**
 * @brief Helper function for Curl GET request.
 * 
 * @param url URL to get response from.
 * @param response Pointer to Response struct which will store the response.
 * 
 * @return Error code.
 * 
 * @details response.string will be allocated and needs to be freed after use.
 */
FX_Code fx_curl(const char *url, Response *response);

/*  Takes a JSON string with the format of [{"date":"YYYY-MM-DD", "value":0.00}] 
    and stores them as key value pairs in fx_map */

/**
 * @brief Parses JSON string in buffer and stores the sequence of dates and exchange rates
 * as key-value pairs in fx_map.
 * 
 * @param buffer JSON string.
 * @param fx_map Pointer to map that will store dates as strings and exchange rates as doubles.
 * 
 * @return Error code.
 * 
 */
FX_Code fx_parse_string_interval(const char *buffer, std::map<std::string, double> *fx_map);


#endif // fx_hpp