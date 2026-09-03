#include "fx.hpp"

#include <iostream>
#include <cstdlib>
#include <cstring>
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

void fx_convert(FX_Data *fx_data, const char *curr1, const char *curr2)
{
    if (fx_data == NULL)
    {
        std::cout << "Error: Invalid FX_Data struct\r\n";
        return;
    }

    // Expect currencies to be 3 letters (examples: SEK, GBP, EUR, USD)
    if ((strlen(curr1) != 3) || (strlen(curr2) != 3))
    {
        std::cout << "Error: Invalid currency\r\n";
        return;
    }

    char url[URL_LEN];

    snprintf(url, URL_LEN, "https://api.riksbank.se/swea/v1/Observations/Latest/%s%spmi", curr1, curr2);

    // response.string gets allocated on the heap in fx_curl, remember to free after parsing
    Response response;
    fx_curl(url, &response);

    fx_parse_string(fx_data, response.string);

    free(response.string);
}

void fx_curl(const char *url, Response *response)
{
    // std::cout << "url: " << url << "\r\n";

    CURL *handle = curl_easy_init();
    CURLcode result;
    if (handle == NULL)
    {
        std::cout << "HTTP request failed\r\n";
        // return NULL;
        return;
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
        // return NULL;
        return;
    }

    curl_easy_cleanup(handle);

    // int len = strlen(response->string);

    // char *full_string = (char*)malloc(len + 1);
    // strncpy(full_string, response->string, len);

    // std::cout << "Response: " << response->string << "\r\n";
    // free(response->string);
}

void fx_parse_string(FX_Data *fx_data, const char *buffer)
{
    // const char *test_string = "{\"date\":\"2026-09-01\",\"value\":11.1145}";

    json_error_t json_error;
    json_t *json = json_loads(buffer, 0, &json_error);
    if (!json)
    {
        std::cout << "Error on line " << json_error.line << ": " << json_error.text << "\r\n";
    }

    json_t *json_date = json_object_get(json, "date");
    if (json_is_string(json_date))
    {
        const char *str = json_string_value(json_date);

        std::cout << "str: " << str << "\r\n";
        snprintf(fx_data->date, sizeof(char) * 11, "%s", str);
    }

    json_t *json_value = json_object_get(json, "value");
    if (json_is_real(json_value))
    {
        double value = json_real_value(json_value);

        std::cout << "value: " << value << "\r\n";
        fx_data->rate = value;
    }
   

    json_decref(json);
}