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
    log_to_console(LOG_INFO, "Info log console test.");
    log_to_console(LOG_WARN, "Warning log console test.");
    log_to_console(LOG_ERR, "Error log console test.");

    log_to_file(LOG_INFO, file_name, "Info log file test.");
    log_to_file(LOG_WARN, file_name, "Warning log file test.");
    log_to_file(LOG_ERR, file_name, "Error log file test.");

    log(LOG_INFO, file_name, "Info log both test.");
    log(LOG_WARN, file_name, "Warning log both test.");
    log(LOG_ERR, file_name, "Error log both test.");

    return 0;
}