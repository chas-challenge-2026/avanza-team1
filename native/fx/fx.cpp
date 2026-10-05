#include "fx.hpp"

#include <iostream>
#include <cstdlib>
#include <cstring>
#include <ctime>
#include <map>
#include <jansson.h>
#include <curl/curl.h>

#define URL_LEN 100

size_t write_data(char *buffer, size_t size, size_t nmemb, void *user_data)
{
    size_t real_size = size * nmemb;
    
    Response *response = (Response*)user_data;
        
    char *ptr = (char*)realloc(response->string, response->size + real_size + 1);
    if (ptr == NULL)
    {
        return CURL_WRITEFUNC_ERROR;
    }
    
    response->string = ptr;
    memcpy(&(response->string[response->size]), buffer, real_size);
    response->size += real_size;
    response->string[response->size] = '\0';
    
    return real_size;
}

double fx_convert_current(double val, const char *curr)
{
    /*  Expect currency to be 3 letters (examples: GBP, EUR, USD) */
    if ((strlen(curr) != 3))
    {
        return 0;
    }
 
    double res;
    char url[URL_LEN];

    snprintf(url, URL_LEN, "https://api.riksbank.se/swea/v1/Observations/Latest/SEK%spmi", curr);
    
    /*  response.string gets allocated on the heap in fx_curl, remember to free after parsing */
    Response response;
    FX_Code result = fx_curl(url, &response);
    if (result != FX_OK)
    {
        free(response.string);
        return 0;
    }

    FX_Data fx_data;
    result = fx_parse_string(&fx_data, response.string);
    if (result != FX_OK)
    {
        free(response.string);
        return 0;
    }

    free(response.string);

    res = val * fx_data.rate;

    return res;
}

FX_Code fx_curl(const char *url, Response *response)
{
    CURL *handle = curl_easy_init();
    CURLcode result;
    if (handle == NULL)
    {
        return FX_ERR_CURL;
    }

    response->string = (char*)malloc(1);
    response->size = 0;

    curl_easy_setopt(handle, CURLOPT_URL, url); // The Riksbank API allows 5 calls per minute and 1000 calls per day
    curl_easy_setopt(handle, CURLOPT_WRITEFUNCTION, write_data);
    curl_easy_setopt(handle, CURLOPT_WRITEDATA, (void*)response);
    
    result = curl_easy_perform(handle);
    if (result != CURLE_OK)
    {
        std::cout << "Error: " << curl_easy_strerror(result) << "\r\n";
        curl_easy_cleanup(handle);
        return FX_ERR_CURL;
    }

    curl_easy_cleanup(handle);
    
    return FX_OK;
}

FX_Code fx_parse_string(FX_Data *fx_data, const char *buffer)
{
    json_error_t json_error;
    json_t *json = json_loads(buffer, 0, &json_error);
    if (!json)
    {
        std::cout << "Error on line " << json_error.line << ": " << json_error.text << "\r\n";
        return FX_ERR_JSON;
    }

    json_t *json_date = json_object_get(json, "date");
    if (!json_is_string(json_date))
    {
        json_decref(json);
        return FX_ERR_JSON;
    }
    
    const char *str = json_string_value(json_date);
    snprintf(fx_data->date, sizeof(char) * 11, "%s", str);

    json_t *json_value = json_object_get(json, "value");
    if (!json_is_real(json_value))
    {
        json_decref(json);
        return FX_ERR_JSON;
    }

    double value = json_real_value(json_value);
    fx_data->rate = value;   

    json_decref(json);
    
    return FX_OK;
}

FX_Code fx_parse_string_interval(const char *buffer, std::map<std::string, double> *fx_map)
{
    json_error_t json_error;
    json_t *json = json_loads(buffer, 0, &json_error);
    if (!json)
    {
        std::cout << "Error on line " << json_error.line << ": " << json_error.text << "\r\n";
        return FX_ERR_JSON;
    }
    
    size_t i;
    const char *key;
    json_t *value, *object;
    size_t arr_size = json_array_size(json);
    
    for (i = 0; i < arr_size; i++)
    {
        object = json_array_get(json, i);

        std::string date;
        double fx_rate;

        json_object_foreach(object, key, value)
        {
            switch (json_typeof(value))
            {
                case JSON_STRING:
                    date = json_string_value(value);
                    break;
                case JSON_REAL:
                    fx_rate = json_real_value(value);
                    break;
                default:
                    break;
            }
        }

        fx_map->insert({date, fx_rate});
    }

    json_decref(json);

    return FX_OK;
}


FX_Code fx_convert_series(double *prices, int instruments, int instrument_target, int days, const char *curr)
{
    /*  Expect currency to be 3 letters (examples: GBP, EUR, USD) */
    if ((strlen(curr) != 3))
    {
        return FX_ERR_INVALID_CURRENCY;
    }

    if (days < 1 || instruments < 1 || instrument_target < 0 || instrument_target > instruments - 1)
    {
        return FX_ERR;
    }

    if (prices == nullptr)
    {
        return FX_ERR_NULLPTR;
    }
    
    /*  days + ((days / 5) * 2) = total days including weekends
        Adds 31 days of extra data to safely account for non-weekend non-bank days */
    int total_days = days + ((days / 5) * 2) + 31;

    /*  Calculates what start date to feed into API call. */
    time_t current_timestamp = time(NULL);
    struct tm end_time_tm = *localtime(&current_timestamp);
    time_t target_timestamp = time(NULL) - (3600 * 24 * total_days);
    struct tm start_time_tm = *localtime(&target_timestamp);

    char start_date[11], end_date[11];
    strftime(start_date, sizeof(char) * 11, "%Y-%m-%d", &start_time_tm);
    strftime(end_date, sizeof(char) * 11, "%Y-%m-%d", &end_time_tm);
    
    char url[URL_LEN];

    snprintf(url, URL_LEN, "https://api.riksbank.se/swea/v1/Observations/sek%spmi/%s/%s", curr, start_date, end_date);
    
    
    /*  response.string gets allocated on the heap in fx_curl, remember to free after parsing */
    Response response;
    FX_Code result = fx_curl(url, &response);
    if (result != FX_OK)
    {
        free(response.string);
        return result;
    }

    std::map<std::string, double> fx_map;
    result = fx_parse_string_interval(response.string, &fx_map);
    if (result != FX_OK)
    {
        free(response.string);
        return result;
    }

    free(response.string);

    size_t start_id = days * instrument_target;
    size_t end_id = start_id + days;
    size_t map_id = fx_map.size() - days + 1;
    auto it = fx_map.begin();

    std::advance(it, map_id - 1);

    for (size_t i = start_id; i < end_id; i++)
    {

        /*  Rounds the result to 2 decimal points. */
        prices[i] *= it->second;
        double temp = (int)(prices[i] * 100 + .5);
        prices[i] = (double)temp / 100;

        it++;
    }

    return FX_OK;
}