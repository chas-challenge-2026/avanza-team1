#ifndef fx_hpp
#define fx_hpp

#include <cstddef>

/*  This module handles value conversions by calling Sveriges Riksbank's API 
    using Libcurl and using Jansson to parse the JSON data.

    Libcurl functions will most likely be moved to a helper file later on 
    as we'll want to use it with other modules, but this works for now.
*/

typedef enum
{
    FX_OK,
    FX_ERR_INVALID_CURRENCY,    /*  Currency signature not 3 letters */
    FX_ERR_CURL,                /*  Curl error */
    FX_ERR_NULLPTR,             /*  Invalid pointer to FX_Struct */
    FX_ERR_JSON                 /*  Error when parsing JSON */
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

/*  Accepts an FX_Data struct to store date and exchange rate between two currencies (curr1, curr2) */
FX_Code fx_convert(FX_Data *fx_data, const char *curr1, const char *curr2);

/*  Parses the JSON data in buffer and stores the date and exchange rate in fx_data */
FX_Code fx_parse_string(FX_Data *fx_data, const char *buffer);

/*  Helper function for Curl GET request, must free response.string after use */
FX_Code fx_curl(const char *url, Response *response);


#endif // fx_hpp