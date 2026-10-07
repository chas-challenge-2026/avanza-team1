#ifndef logger_hpp
#define logger_hpp

#include <string>

/*  Simple logger for Native modules. 

    Usage:
        Use log() to write a timestamped error message, a warning, or info to both the console and the specified file.
        Use log_to_console() to write the message only to the console.
        Use log_to_file() to write the message only to the specified file.

    The functions that print to files will create if necessary and use a "logs" directory next to the executable.
    Currently no option to save log files in another directory.

    Example of a log:
    [2026-10-05 16:20:11] INFO: Info log test.
    [2026-10-05 16:20:11] WARNING: Warning log test.
    [2026-10-05 16:20:11] ERROR: Error log test. 
*/

typedef enum
{
    LOG_INFO,
    LOG_WARN,
    LOG_ERR
} LOG_TYPE;

/**
 * @brief Writes a timestamped log message to a file and the console.
 * 
 * @param code Enum for choosing between info, warning, and error.
 * @param file_name Name of log file to write to, including file type.
 * @param error_message Text string to write to the log file.
 * 
 * @details Uses log_to_console() and log_to_file() to output a timestamped 
 * error message with specified type to both the console and a specified file. 
 * File will be put in a "logs" directory next to the executable. 
 * The directory will be created if it doesn't already exist. 
 * Currently no way to select a different directory.
*/
void log(LOG_TYPE code, std::string file_name, std::string message);

/**
 * @brief Writes a log message to the console.
 * 
 * @param code Enum for choosing between info, warning, and error.
 * @param message The message to write.
 * 
 * @details Outputs a timestamped message with specified type to the console.
*/
void log_to_console(LOG_TYPE code, std::string message);

/**
 * @brief Writes a log message to the console.
 * 
 * @param code Enum for choosing between info, warning, and error.
 * @param file_name Name of file, including file type, of log file to write to.
 * @param message The message to write.
 * 
 * @details Outputs a timestamped message with specified type to a file.
*/
void log_to_file(LOG_TYPE code, std::string file_name, std::string message);

#endif