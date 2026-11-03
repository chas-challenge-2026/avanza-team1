#include "../logger/logger.hpp"
#include "fx.hpp"
#include <cmath>
#include <cstring>
#include <iostream>
#include <cstdlib>
#include <ctime>
#include <map>
#include <string>
#include <iterator>
#include <jansson.h>
#include <curl/curl.h>


#define URL_LEN 128
#define LOG_FILE "fx_log.txt"

//--------------------------- Cut off here (from libraries). Makes readability nicer, you can choose whether you keep it ;)


static std::string fx_code_to_string(FX_Code code);

size_t write_data(char *buffer, size_t size, size_t nmemb, void *user_data)
{
    size_t real_size = size * nmemb;
    Response *response = static_cast<Response*>(user_data);
        
    char *ptr = static_cast<char*>(realloc(response->string, response->size + real_size + 1));
    if (ptr == nullptr)
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
    if (curr == nullptr || strlen(curr) != 3)
    {
        log(LOG_ERR, LOG_FILE, fx_code_to_string(FX_ERR_INVALID_CURRENCY));
        return 0;
    }

    char url[URL_LEN];
    snprintf(url, URL_LEN, "https://api.riksbank.se/swea/v1/Observations/Latest/SEK%spmi", curr);
    
    /*  response.string gets allocated on the heap in fx_curl, remember to free after parsing */
    Response response = {nullptr, 0};
    FX_Code result = fx_curl(url, &response);
    if (result != FX_OK)
    {
        free(response.string);
        log(LOG_ERR, LOG_FILE, fx_code_to_string(result));
        return 0;
    }

    FX_Data fx_data;
    result = fx_parse_string(&fx_data, response.string);
    free(response.string);

    if (result != FX_OK)
    {
        log(LOG_ERR, LOG_FILE, fx_code_to_string(result));
        return 0;
    }

    return val * fx_data.rate;
}

FX_Code fx_curl(const char *url, Response *response)
{
    response->string = nullptr;
    response->size = 0;

    CURL *handle = curl_easy_init();
    if (handle == nullptr)
    {
        log(LOG_ERR, LOG_FILE, fx_code_to_string(FX_ERR_CURL));
        return FX_ERR_CURL;
    }

    response->string = static_cast<char*>(malloc(1));
    if (response->string == nullptr)
    {
        curl_easy_cleanup(handle);
        return FX_ERR_CURL;
    }
    response->string[0] = '\0';

    curl_easy_setopt(handle, CURLOPT_URL, url); // The Riksbank API allows 5 calls per minute and 1000 calls per day
    curl_easy_setopt(handle, CURLOPT_WRITEFUNCTION, write_data);
    curl_easy_setopt(handle, CURLOPT_WRITEDATA, static_cast<void*>(response));
    
    CURLcode result = curl_easy_perform(handle);
    if (result != CURLE_OK)
    {
        curl_easy_cleanup(handle);
        log(LOG_ERR, LOG_FILE, curl_easy_strerror(result));
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
        std::string error = "Error on line " + std::to_string(json_error.line) + ": " + json_error.text;
        log(LOG_ERR, LOG_FILE, error);
        return FX_ERR_JSON;
    }

    json_t *json_date = json_object_get(json, "date");
    if (!json_is_string(json_date))
    {
        json_decref(json);
        log(LOG_ERR, LOG_FILE, fx_code_to_string(FX_ERR_JSON));
        return FX_ERR_JSON;
    }

    const char *str = json_string_value(json_date);
    snprintf(fx_data->date, sizeof(char) * 11, "%s", str);

    json_t *json_value = json_object_get(json, "value");
    if (!json_is_number(json_value))
    {
        json_decref(json);
        log(LOG_ERR, LOG_FILE, fx_code_to_string(FX_ERR_JSON));
        return FX_ERR_JSON;
    }

    fx_data->rate = json_real_value(json_value);
    json_decref(json);

    return FX_OK;
}

FX_Code fx_parse_string_interval(const char *buffer, std::map<std::string, double> *fx_map)
{
    json_error_t json_error;
    json_t *json = json_loads(buffer, 0, &json_error);
    if (!json || !json_is_array(json))
    {
        if (json) json_decref(json);
        std::string error = "Error on line " + std::to_string(json_error.line) + ": " + json_error.text;
        log(LOG_ERR, LOG_FILE, error);
        return FX_ERR_JSON;
    }

    size_t arr_size = json_array_size(json);
    for (size_t i = 0; i < arr_size; i++)
    {
        json_t *object = json_array_get(json, i);
        if(!json_is_object(object)) continue;

        json_t *date_obj = json_object_get(object, "date");
        json_t *val_obj = json_object_get(object, "value");

        if (json_is_string(date_obj) && json_is_number(val_obj))
        {
            std::string date = json_string_value(date_obj);
            double fx_rate = json_number_value(val_obj);
            fx_map->insert({date, fx_rate});
        }
    }

    json_decref(json);
    return FX_OK;
}


FX_Code fx_convert_series(double *prices, int instruments, int instrument_target, int days, const char *curr)
{
    /*  Expect currency to be 3 letters (examples: GBP, EUR, USD) */
    if (curr == nullptr || strlen(curr) != 3)
    {
        log(LOG_ERR, LOG_FILE, "Invalid currency.");
        return FX_ERR_INVALID_CURRENCY;
    }

    if (days < 1 || instruments < 1 || instrument_target < 0 || instrument_target > instruments - 1)
    {
        log(LOG_ERR, LOG_FILE, "Incorrect days, instruments, or instrument target.");
        return FX_ERR;
    }

    if (prices == nullptr)
    {
        log(LOG_ERR, LOG_FILE, "Prices is nullptr.");
        return FX_ERR_NULLPTR;
    }
    
    /*  days + ((days / 5) * 2) = total days including weekends
        Adds 31 days of extra data to safely account for non-weekend non-bank days */
    int total_days = days + ((days / 5) * 2) + 31;

    /*  Calculates what start date to feed into API call. */
    time_t current_timestamp = time(nullptr);
    struct tm end_time_tm = *localtime(&current_timestamp);
    time_t target_timestamp = current_timestamp - (static_cast<time_t>(total_days) * 3600 * 24);
    struct tm start_time_tm = *localtime(&target_timestamp);

    char start_date[11], end_date[11];
    strftime(start_date, sizeof(start_date), "%Y-%m-%d", &start_time_tm);
    strftime(end_date, sizeof(end_date), "%Y-%m-%d", &end_time_tm);
    
    char url[URL_LEN];
    snprintf(url, URL_LEN, "https://api.riksbank.se/swea/v1/Observations/sek%spmi/%s/%s", curr, start_date, end_date);
    
    /*  response.string gets allocated on the heap in fx_curl, remember to free after parsing */
    Response response = {nullptr, 0};
    FX_Code result = fx_curl(url, &response);
    if (result != FX_OK)
    {
        free(response.string);
        log(LOG_ERR, LOG_FILE, fx_code_to_string(result));
        return result;
    }

    std::map<std::string, double> fx_map;
    result = fx_parse_string_interval(response.string, &fx_map);
    free(response.string);

    if (result != FX_OK)
    {
        log(LOG_ERR, LOG_FILE, fx_code_to_string(result));
        return result;
    }

    // Protects against unsigned underflow if API would return less days than requested - Svartakatten
    if (fx_map.size() < static_cast<size_t>(days))
    {
        log(LOG_ERR, LOG_FILE, "Not enough FX observations returned for the requested days.");
        return FX_ERR;
    }

    size_t start_id = static_cast<size_t>(days) * static_cast<size_t>(instrument_target);
    size_t end_id = start_id + static_cast<size_t>(days);

    auto it = fx_map.begin();
    std::advance(it, fx_map.size() - static_cast<size_t>(days));

    for (size_t i = start_id; i < end_id; i++, ++it)
    {
        /*  Rounds the result to 2 decimal points. */
        prices[i] *= it->second;
        prices[i] = std::round(prices[i] * 100.0) / 100.0;
    }

    return FX_OK;
}

static std::string fx_code_to_string(FX_Code code)
{
    if (code == FX_ERR_INVALID_CURRENCY)
        return "Invalid currency.";
    else if(code == FX_ERR_CURL)
        return "cURL error.";
    else if(code == FX_ERR_NULLPTR)
        return "Nullptr error.";
    else if(code == FX_ERR_JSON)
        return "JSON error.";
    else if(code == FX_ERR_INVALID_DATE)
        return "Invalid date.";
    else if(code == FX_ERR)
        return "Unspecified error.";
    else
        return "Unknown error.";
}