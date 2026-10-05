#ifndef logger_hpp
#define logger_hpp

#include <string>

/*  Simple logger for Native modules. Creates a directory called "logs" next to the executable and writes to files in there.
    Currently no option to save log files in another directory.

    Example of a log:
    [2026-10-05 16:20:11] INFO:		Info log test.
    [2026-10-05 16:20:11] WARNING:	Warning log test.
    [2026-10-05 16:20:11] ERROR:	Error log test. 
*/

typedef enum
{
    LOG_INFO,
    LOG_WARN,
    LOG_ERR
} LOG_TYPE;

/**
 * @brief Writes a timestamped log message to a file.
 * 
 * @param code Enum for choosing between info, warning, and error.
 * @param file_name Name of log file to write to, including file type.
 * @param error_message Text string to write to the log file.
 * 
 * @details Each time the function is called it will create/open the specified file 
 * and write the error message in this format on one line: "[Timestamp] LOG_TYPE: Error message."
*/
void log(LOG_TYPE code, std::string file_name, std::string error_message);

#endif