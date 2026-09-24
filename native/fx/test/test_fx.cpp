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

/*  Checks that the FX_Code enum is the expected result, otherwise fail */
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

    const char *curr = "USD";
    
    /*  Tests the major function */
    FX_Data fx_data_convert;
    result = fx_convert_current(&fx_data_convert, curr);
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

    // const char *start_date = "2015-01-01";
    // const char *end_date = "2020-01-01";
    const char *url_interval = "https://api.riksbank.se/swea/v1/Observations/sekeurpmi/2015-01-01/2020-01-01";
    Response response_interval;
    result = fx_curl(url_interval, &response_interval);
    check("Riksbank interval", result, FX_OK);
    // std::cout << "response_interval.string: " << response_interval.string << "\r\n";
    free(response_interval.string);

    const char *interval_json = "[{\"date\":\"2025-01-02\",\"value\":11.4223},{\"date\":\"2025-01-03\",\"value\":11.4395},{\"date\":\"2025-01-07\",\"value\":11.475},{\"date\":\"2025-01-08\",\"value\":11.5125},{\"date\":\"2025-01-09\",\"value\":11.4945},{\"date\":\"2025-01-10\",\"value\":11.497},{\"date\":\"2025-01-13\",\"value\":11.5055},{\"date\":\"2025-01-14\",\"value\":11.512},{\"date\":\"2025-01-15\",\"value\":11.5015},{\"date\":\"2025-01-16\",\"value\":11.485},{\"date\":\"2025-01-17\",\"value\":11.506},{\"date\":\"2025-01-20\",\"value\":11.4945},{\"date\":\"2025-01-21\",\"value\":11.475},{\"date\":\"2025-01-22\",\"value\":11.467},{\"date\":\"2025-01-23\",\"value\":11.4685},{\"date\":\"2025-01-24\",\"value\":11.459},{\"date\":\"2025-01-27\",\"value\":11.496},{\"date\":\"2025-01-28\",\"value\":11.478},{\"date\":\"2025-01-29\",\"value\":11.4555},{\"date\":\"2025-01-30\",\"value\":11.47},{\"date\":\"2025-01-31\",\"value\":11.474},{\"date\":\"2025-02-03\",\"value\":11.481},{\"date\":\"2025-02-04\",\"value\":11.418},{\"date\":\"2025-02-05\",\"value\":11.3583},{\"date\":\"2025-02-06\",\"value\":11.321},{\"date\":\"2025-02-07\",\"value\":11.2865},{\"date\":\"2025-02-10\",\"value\":11.2765},{\"date\":\"2025-02-11\",\"value\":11.2525},{\"date\":\"2025-02-12\",\"value\":11.2895},{\"date\":\"2025-02-13\",\"value\":11.2815},{\"date\":\"2025-02-14\",\"value\":11.2445},{\"date\":\"2025-02-17\",\"value\":11.216},{\"date\":\"2025-02-18\",\"value\":11.2115},{\"date\":\"2025-02-19\",\"value\":11.214},{\"date\":\"2025-02-20\",\"value\":11.166},{\"date\":\"2025-02-21\",\"value\":11.1425},{\"date\":\"2025-02-24\",\"value\":11.153},{\"date\":\"2025-02-25\",\"value\":11.1455},{\"date\":\"2025-02-26\",\"value\":11.143},{\"date\":\"2025-02-27\",\"value\":11.159},{\"date\":\"2025-02-28\",\"value\":11.188},{\"date\":\"2025-03-03\",\"value\":11.15},{\"date\":\"2025-03-04\",\"value\":11.0995},{\"date\":\"2025-03-05\",\"value\":11.0125},{\"date\":\"2025-03-06\",\"value\":10.962},{\"date\":\"2025-03-07\",\"value\":10.9715},{\"date\":\"2025-03-10\",\"value\":10.9695},{\"date\":\"2025-03-11\",\"value\":10.9815},{\"date\":\"2025-03-12\",\"value\":10.9765},{\"date\":\"2025-03-13\",\"value\":11.07},{\"date\":\"2025-03-14\",\"value\":11.0538},{\"date\":\"2025-03-17\",\"value\":11.0225},{\"date\":\"2025-03-18\",\"value\":10.997},{\"date\":\"2025-03-19\",\"value\":11.0025},{\"date\":\"2025-03-20\",\"value\":11.0295},{\"date\":\"2025-03-21\",\"value\":10.933},{\"date\":\"2025-03-24\",\"value\":10.957},{\"date\":\"2025-03-25\",\"value\":10.7975},{\"date\":\"2025-03-26\",\"value\":10.8395},{\"date\":\"2025-03-27\",\"value\":10.8235},{\"date\":\"2025-03-28\",\"value\":10.82},{\"date\":\"2025-03-31\",\"value\":10.849},{\"date\":\"2025-04-01\",\"value\":10.816},{\"date\":\"2025-04-02\",\"value\":10.764},{\"date\":\"2025-04-03\",\"value\":10.7205},{\"date\":\"2025-04-04\",\"value\":10.974},{\"date\":\"2025-04-07\",\"value\":11.078},{\"date\":\"2025-04-08\",\"value\":10.9775},{\"date\":\"2025-04-09\",\"value\":11.0715},{\"date\":\"2025-04-10\",\"value\":11.019},{\"date\":\"2025-04-11\",\"value\":11.1198},{\"date\":\"2025-04-14\",\"value\":11.0065},{\"date\":\"2025-04-15\",\"value\":11.0611},{\"date\":\"2025-04-16\",\"value\":11.155},{\"date\":\"2025-04-17\",\"value\":11.0278},{\"date\":\"2025-04-22\",\"value\":10.9153},{\"date\":\"2025-04-23\",\"value\":10.9395},{\"date\":\"2025-04-24\",\"value\":10.911},{\"date\":\"2025-04-25\",\"value\":11.0015},{\"date\":\"2025-04-28\",\"value\":10.997},{\"date\":\"2025-04-29\",\"value\":10.962},{\"date\":\"2025-04-30\",\"value\":10.9715},{\"date\":\"2025-05-02\",\"value\":10.9375},{\"date\":\"2025-05-05\",\"value\":10.9355},{\"date\":\"2025-05-06\",\"value\":10.88},{\"date\":\"2025-05-07\",\"value\":10.903},{\"date\":\"2025-05-08\",\"value\":10.903},{\"date\":\"2025-05-09\",\"value\":10.92},{\"date\":\"2025-05-12\",\"value\":10.8845},{\"date\":\"2025-05-13\",\"value\":10.8255},{\"date\":\"2025-05-14\",\"value\":10.854},{\"date\":\"2025-05-15\",\"value\":10.8875},{\"date\":\"2025-05-16\",\"value\":10.9327},{\"date\":\"2025-05-19\",\"value\":10.9015},{\"date\":\"2025-05-20\",\"value\":10.8835},{\"date\":\"2025-05-21\",\"value\":10.8445},{\"date\":\"2025-05-22\",\"value\":10.8485},{\"date\":\"2025-05-23\",\"value\":10.8348},{\"date\":\"2025-05-26\",\"value\":10.8335},{\"date\":\"2025-05-27\",\"value\":10.8785},{\"date\":\"2025-05-28\",\"value\":10.8735},{\"date\":\"2025-05-30\",\"value\":10.8735},{\"date\":\"2025-06-02\",\"value\":10.8535},{\"date\":\"2025-06-03\",\"value\":10.9245},{\"date\":\"2025-06-04\",\"value\":10.9475},{\"date\":\"2025-06-05\",\"value\":10.943},{\"date\":\"2025-06-09\",\"value\":10.97},{\"date\":\"2025-06-10\",\"value\":10.946},{\"date\":\"2025-06-11\",\"value\":10.9845},{\"date\":\"2025-06-12\",\"value\":10.9355},{\"date\":\"2025-06-13\",\"value\":10.9635},{\"date\":\"2025-06-16\",\"value\":10.9615},{\"date\":\"2025-06-17\",\"value\":10.948},{\"date\":\"2025-06-18\",\"value\":11.027},{\"date\":\"2025-06-19\",\"value\":11.067},{\"date\":\"2025-06-23\",\"value\":11.1635},{\"date\":\"2025-06-24\",\"value\":11.063},{\"date\":\"2025-06-25\",\"value\":11.06},{\"date\":\"2025-06-26\",\"value\":11.091},{\"date\":\"2025-06-27\",\"value\":11.1183},{\"date\":\"2025-06-30\",\"value\":11.1465},{\"date\":\"2025-07-01\",\"value\":11.159},{\"date\":\"2025-07-02\",\"value\":11.2005},{\"date\":\"2025-07-03\",\"value\":11.2515},{\"date\":\"2025-07-04\",\"value\":11.2505},{\"date\":\"2025-07-07\",\"value\":11.1645},{\"date\":\"2025-07-08\",\"value\":11.1695},{\"date\":\"2025-07-09\",\"value\":11.1645},{\"date\":\"2025-07-10\",\"value\":11.152},{\"date\":\"2025-07-11\",\"value\":11.148},{\"date\":\"2025-07-14\",\"value\":11.205},{\"date\":\"2025-07-15\",\"value\":11.27},{\"date\":\"2025-07-16\",\"value\":11.3195},{\"date\":\"2025-07-17\",\"value\":11.311},{\"date\":\"2025-07-18\",\"value\":11.2505},{\"date\":\"2025-07-21\",\"value\":11.212},{\"date\":\"2025-07-22\",\"value\":11.211},{\"date\":\"2025-07-23\",\"value\":11.164},{\"date\":\"2025-07-24\",\"value\":11.185},{\"date\":\"2025-07-25\",\"value\":11.1665},{\"date\":\"2025-07-28\",\"value\":11.1545},{\"date\":\"2025-07-29\",\"value\":11.156},{\"date\":\"2025-07-30\",\"value\":11.1435},{\"date\":\"2025-07-31\",\"value\":11.1575},{\"date\":\"2025-08-01\",\"value\":11.1965},{\"date\":\"2025-08-04\",\"value\":11.1825},{\"date\":\"2025-08-05\",\"value\":11.173},{\"date\":\"2025-08-06\",\"value\":11.1955},{\"date\":\"2025-08-07\",\"value\":11.1945},{\"date\":\"2025-08-08\",\"value\":11.178},{\"date\":\"2025-08-11\",\"value\":11.182},{\"date\":\"2025-08-12\",\"value\":11.192},{\"date\":\"2025-08-13\",\"value\":11.1575},{\"date\":\"2025-08-14\",\"value\":11.182},{\"date\":\"2025-08-15\",\"value\":11.1775},{\"date\":\"2025-08-18\",\"value\":11.157},{\"date\":\"2025-08-19\",\"value\":11.158},{\"date\":\"2025-08-20\",\"value\":11.177},{\"date\":\"2025-08-21\",\"value\":11.164},{\"date\":\"2025-08-22\",\"value\":11.1775},{\"date\":\"2025-08-25\",\"value\":11.1345},{\"date\":\"2025-08-26\",\"value\":11.1565},{\"date\":\"2025-08-27\",\"value\":11.116},{\"date\":\"2025-08-28\",\"value\":11.0735},{\"date\":\"2025-08-29\",\"value\":11.055},{\"date\":\"2025-09-01\",\"value\":11.012},{\"date\":\"2025-09-02\",\"value\":11.003},{\"date\":\"2025-09-03\",\"value\":11.0015},{\"date\":\"2025-09-04\",\"value\":11.0185},{\"date\":\"2025-09-05\",\"value\":11.001},{\"date\":\"2025-09-08\",\"value\":11.0005},{\"date\":\"2025-09-09\",\"value\":11.0018},{\"date\":\"2025-09-10\",\"value\":10.951},{\"date\":\"2025-09-11\",\"value\":10.9515},{\"date\":\"2025-09-12\",\"value\":10.9485},{\"date\":\"2025-09-15\",\"value\":10.9115},{\"date\":\"2025-09-16\",\"value\":10.9305},{\"date\":\"2025-09-17\",\"value\":10.9635},{\"date\":\"2025-09-18\",\"value\":10.998},{\"date\":\"2025-09-19\",\"value\":11.0705},{\"date\":\"2025-09-22\",\"value\":11.0495},{\"date\":\"2025-09-23\",\"value\":10.9887},{\"date\":\"2025-09-24\",\"value\":11.035},{\"date\":\"2025-09-25\",\"value\":11.0485},{\"date\":\"2025-09-26\",\"value\":11.037},{\"date\":\"2025-09-29\",\"value\":11.03},{\"date\":\"2025-09-30\",\"value\":11.0565},{\"date\":\"2025-10-01\",\"value\":11.0355},{\"date\":\"2025-10-02\",\"value\":11.0025},{\"date\":\"2025-10-03\",\"value\":11.003},{\"date\":\"2025-10-06\",\"value\":10.988},{\"date\":\"2025-10-07\",\"value\":10.9495},{\"date\":\"2025-10-08\",\"value\":10.9635},{\"date\":\"2025-10-09\",\"value\":10.987},{\"date\":\"2025-10-10\",\"value\":11.008},{\"date\":\"2025-10-13\",\"value\":11.013},{\"date\":\"2025-10-14\",\"value\":11.038},{\"date\":\"2025-10-15\",\"value\":11.0195},{\"date\":\"2025-10-16\",\"value\":11.013},{\"date\":\"2025-10-17\",\"value\":11.03},{\"date\":\"2025-10-20\",\"value\":10.99},{\"date\":\"2025-10-21\",\"value\":10.9345},{\"date\":\"2025-10-22\",\"value\":10.916},{\"date\":\"2025-10-23\",\"value\":10.9193},{\"date\":\"2025-10-24\",\"value\":10.904},{\"date\":\"2025-10-27\",\"value\":10.912},{\"date\":\"2025-10-28\",\"value\":10.921},{\"date\":\"2025-10-29\",\"value\":10.896},{\"date\":\"2025-10-30\",\"value\":10.94},{\"date\":\"2025-10-31\",\"value\":10.925},{\"date\":\"2025-11-03\",\"value\":10.935},{\"date\":\"2025-11-04\",\"value\":10.9865},{\"date\":\"2025-11-05\",\"value\":11.0175},{\"date\":\"2025-11-06\",\"value\":10.99},{\"date\":\"2025-11-07\",\"value\":11.046},{\"date\":\"2025-11-10\",\"value\":10.987},{\"date\":\"2025-11-11\",\"value\":10.973},{\"date\":\"2025-11-12\",\"value\":10.9395},{\"date\":\"2025-11-13\",\"value\":10.9405},{\"date\":\"2025-11-14\",\"value\":10.9835},{\"date\":\"2025-11-17\",\"value\":10.9635},{\"date\":\"2025-11-18\",\"value\":10.997},{\"date\":\"2025-11-19\",\"value\":10.992},{\"date\":\"2025-11-20\",\"value\":10.9995},{\"date\":\"2025-11-21\",\"value\":11.026},{\"date\":\"2025-11-24\",\"value\":11.006},{\"date\":\"2025-11-25\",\"value\":11.048},{\"date\":\"2025-11-26\",\"value\":11.0345},{\"date\":\"2025-11-27\",\"value\":10.9945},{\"date\":\"2025-11-28\",\"value\":10.9695},{\"date\":\"2025-12-01\",\"value\":10.963},{\"date\":\"2025-12-02\",\"value\":10.9865},{\"date\":\"2025-12-03\",\"value\":10.955},{\"date\":\"2025-12-04\",\"value\":10.967},{\"date\":\"2025-12-05\",\"value\":10.959},{\"date\":\"2025-12-08\",\"value\":10.9495},{\"date\":\"2025-12-09\",\"value\":10.9015},{\"date\":\"2025-12-10\",\"value\":10.858},{\"date\":\"2025-12-11\",\"value\":10.845},{\"date\":\"2025-12-12\",\"value\":10.8865},{\"date\":\"2025-12-15\",\"value\":10.9155},{\"date\":\"2025-12-16\",\"value\":10.942},{\"date\":\"2025-12-17\",\"value\":10.936},{\"date\":\"2025-12-18\",\"value\":10.9015},{\"date\":\"2025-12-19\",\"value\":10.904},{\"date\":\"2025-12-22\",\"value\":10.856},{\"date\":\"2025-12-23\",\"value\":10.82},{\"date\":\"2025-12-29\",\"value\":10.816},{\"date\":\"2025-12-30\",\"value\":10.818}]";
    std::map<std::string, double> fx_map;
    result = fx_parse_string_interval(interval_json, fx_map);
    check("Interval JSON parsing", result, FX_OK);

    std::cout << "\r\nTests passed: " << tests_run - tests_failed << "/" << tests_run << "\r\n";

    return 0;
}

// 