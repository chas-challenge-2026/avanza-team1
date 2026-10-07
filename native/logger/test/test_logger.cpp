/*  How to run:
        g++ -Wall -Wextra -Werror -o test_logger logger.cpp test/test_logger.cpp
        ./test_logger
*/

#include "../logger.hpp"

#include <iostream>
#include <string>

int main()
{
    std::string file_name = "test_log.txt";
    log(LOG_INFO, file_name, "Info log timestamp test.");
    log(LOG_WARN, file_name, "Warning log timestamp test.");
    log(LOG_ERR, file_name, "Error log timestamp test.");

    return 0;
}