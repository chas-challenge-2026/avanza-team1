#ifndef fx_hpp
#define fx_hpp

#include <cstddef>

/*  This module handles value conversions by calling Sveriges Riksbank's API 
    using Libcurl and using Jansson to parse the JSON data.

    Libcurl functions will most likely be moved to a helper file later on 
    as we'll want to use it with other modules, but this works for now.
*/

typedef struct
{
    char *string;
    size_t size;
} Response;

size_t write_data(char *buffer, size_t size, size_t nmemb, void *user_data);
void fx_convert();
void fx_parse_string();


#endif // fx_hpp