/*  Test suite for the FX (currency conversion) functions in fx.cpp.
    Run with:
        g++ -Wall -Wextra -Werror -o test_fx fx.cpp test/test_fx.cpp -lcurl -ljansson
        ./test_fx
*/

#include <iostream>
#include <cstring>

#include "../fx.hpp"

static int tests_run = 0;
static int tests_failed = 0;

/*  Checks that the FX_Code enum is FX_OK, otherwise fail */
static void check(const char *test_name, FX_Code result, FX_Code expected_result)
{
    tests_run++;
    if (result == expected_result)
    {
        std::cout << "[PASS] " << test_name << "\r\n";
    }
    else
    {
        tests_failed++;
        std::cout << "[FAIL] " << test_name << " -> Error code " << result << "\r\n";
    }
}

static void check_fx_parse_string(const char* test_name, FX_Data *fx_data, const char *json_str, const char *expected_date, double expected_rate, FX_Code expected_result)
{
    tests_run++;
    FX_Code result = fx_parse_string(fx_data, json_str);
    if (result != expected_result)
    {
        tests_failed++;
        std::cout << "[FAIL] " << test_name << " -> Error code " << result << "\r\n";
        return;
    }
    else if (result == expected_result && expected_result == FX_ERR_JSON)
    {
        std::cout << "[PASS] " << test_name << "\r\n";
        return;
    }

    if ((strncmp(fx_data->date, expected_date, 11) != 0) && (fx_data->rate != expected_rate))
    {
        tests_failed++;
        std::cout << "[FAIL] " << test_name << " -> Incorrect date and rate\r\n";
    }
    else if (strncmp(fx_data->date, expected_date, 11) != 0)
    {
        tests_failed++;
        std::cout << "[FAIL] " << test_name << " -> Incorrect date\r\n";
    }
    else if (fx_data->rate != expected_rate)
    {
        tests_failed++;
        std::cout << "[FAIL] " << test_name << " -> Incorrect rate\r\n";
    }
    else
    {
        std::cout << "[PASS] " << test_name << "\r\n";
    }
}

int main()
{
    FX_Code result;

    const char *curr1 = "SEK";
    const char *curr2 = "EUR";
    
    /*  Tests the major function */
    FX_Data fx_data_convert;
    result = fx_convert(&fx_data_convert, curr1, curr2);
    check("FX convert", result, FX_OK);
        
    /*  Only tests that the GET request receives a response, does not check if the response contains valid data */
    const char *url = "https://api.riksbank.se/swea/v1/Observations/Latest/sekeurpmi";
    Response response;
    result = fx_curl(url, &response);
    check("Riksbank API, SEK to EUR GET request", result, FX_OK);
    free(response.string);

    const char *url_broken = "https://api.riksbank/swea/v1/Observations/Latest/sekeurpmi";
    Response response_broken;
    result = fx_curl(url_broken, &response_broken);
    check("Broken Riksbank API link", result, FX_ERR_CURL);
    free(response_broken.string);

    /*  Tests that JSON string is parsed correctly, the date field should be stored in fx_data.date and the value field in fx_data.rate */
    const char *json_str = "{\"date\":\"2026-09-08\",\"value\":11.152}";
    const char *expected_date = "2026-09-08";
    double expected_rate = 11.152;
    FX_Data fx_data_parse_string;
    check_fx_parse_string("Parse JSON string", &fx_data_parse_string, json_str, expected_date, expected_rate, FX_OK);

    /*  Tests that incorrectly formatted JSON strings are detected and aborted */
    const char *json_str_broken = "\0";
    FX_Data fx_data_parse_broken;
    check_fx_parse_string("Parse broken JSON string", &fx_data_parse_broken, json_str_broken, "", 0.0, FX_ERR_JSON);



    std::cout << "\r\n" << tests_run - tests_failed << "/" << tests_run << "\r\n";

    return 0;
}