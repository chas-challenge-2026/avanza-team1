/*  Test suite for the FX (currency conversion) functions in fx.cpp.
    Run with:
        g++ -Wall -Wextra -Werror -o test_fx fx.cpp test/test_fx.cpp -lcurl -ljansson
        ./test_fx
*/

#include <iostream>

#include "../fx.hpp"

static int tests_run = 0;
static int tests_failed = 0;

/*  Checks that the FX_Code enum is FX_OK, otherwise fail */
static void check(const char *test_name, FX_Code result)
{
    tests_run++;
    if (result == FX_OK)
    {
        std::cout << "[PASS] " << test_name << "\r\n";
    }
    else
    {
        tests_failed++;
        std::cout << "[FAIL] " << test_name << " -> Error code " << result << "\r\n";
    }
}

int main()
{
    const char *url = "https://api.riksbank.se/swea/v1/Observations/Latest/sekeurpmi";
    Response response;
    FX_Code result = fx_curl(url, &response);
    check("Riksbank API, SEK to EUR GET request", result);

    std::cout << "\r\n" << tests_run - tests_failed << "/" << tests_run << "\r\n";

    return 0;
}