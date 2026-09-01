#include "fx.hpp"

#include <iostream>
#include <cstdlib>
#include <cstring>
#include <jansson.h>
#include <curl/curl.h>

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

void fx_convert()
{
    CURL *handle = curl_easy_init();
    CURLcode result;
    if (handle == NULL)
    {
        std::cout << "HTTP request failed\r\n";
        // return NULL;
        return;
    }

    Response response;
    response.string = (char*)malloc(1);
    response.size = 0;

    curl_easy_setopt(handle, CURLOPT_URL, "https://www.google.com");
    curl_easy_setopt(handle, CURLOPT_WRITEFUNCTION, write_data);
    curl_easy_setopt(handle, CURLOPT_WRITEDATA, (void*)&response);

    result = curl_easy_perform(handle);
    if (result != CURLE_OK)
    {
        std::cout << "Error: " << curl_easy_strerror(result) << "\r\n";
        // return NULL;
        return;
    }

    curl_easy_cleanup(handle);

    int len = strlen(response.string);

    char *full_string = (char*)malloc(len + 1);
    strncpy(full_string, response.string, len);

    std::cout << "Response: " << response.string << "\r\n";
    
    free(response.string);
}