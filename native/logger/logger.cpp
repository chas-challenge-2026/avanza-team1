#include "logger.hpp"

#include <iostream>
#include <fstream>
#include <string>
#include <ctime>
#include <sys/stat.h>
#include <sys/types.h>

/**
 * @brief Creates a formatted timestamp for use in logging.
 * 
 * @return The formatted timestamp.
*/
static std::string log_create_timestamp();

/**
 * @brief Checks if "logs" directory exists, otherwise creates it.
*/
static void log_create_dir();

/**
 * @brief Creates a formatted message for use in logging.
 * 
 * @param code Type of message.
 * @param message Message to print. For example an error message when something failed.
 * @param timestamp A formatted timestamp. Use log_create_timestamp() to get one.
 * 
 * @return The fully formatted message including timestamp and message type.
*/
static std::string log_create_message(LOG_TYPE code, std::string message, std::string timestamp);

void log(LOG_TYPE code, std::string file_name, std::string message)
{
    log_to_console(code, message);
    log_to_file(code, file_name, message);
}

void log_to_console(LOG_TYPE code, std::string message)
{
    std::string timestamp = log_create_timestamp();
    std::string final_message = log_create_message(code, message, timestamp);

    std::cout << final_message;

    return;
}

void log_to_file(LOG_TYPE code, std::string file_name, std::string message)
{
    std::string timestamp = log_create_timestamp();
    std::string final_message = log_create_message(code, message, timestamp);

    log_create_dir();

    /*  Assembles file path and opens it for writing. */
    std::string file_path;
    file_path = "logs/" + file_name;
    std::ofstream file(file_path, std::ios::app);
    if (!file)
    {
        std::cout << "Unable to open file: " << file_name << "\r\n";
        return;
    }

    file << final_message;

    file.close();

    return;
}

std::string log_create_timestamp()
{
    /*  Creates a timestamped with the format [YYYY-MM-DD HH:MM:SS] */
    time_t now = time(NULL);
    struct tm timestamp_tm = *localtime(&now);

    char timestamp_format[22];
    strftime(timestamp_format, sizeof(timestamp_format), "[%Y-%m-%d %H:%M:%S]", &timestamp_tm);
    
    std::string timestamp_string = timestamp_format;

    return timestamp_string;
}

std::string log_create_message(LOG_TYPE code, std::string message, std::string timestamp)
{
    std::string final_message;

    /*  Chosen log type is pasted after timestamp and before error message. */
    if (code == LOG_WARN)
    {
        final_message = timestamp + " WARNING: " + message + "\r\n";
    }
    else if (code == LOG_ERR)
    {
        final_message = timestamp + " ERROR: " + message + "\r\n";
    }
    else
    {
        final_message = timestamp + " INFO: " + message + "\r\n";
    }

    return final_message;
}

void log_create_dir()
{
    /*  Check if directory "logs" exists, otherwise create it. */
    struct stat sb;
    if (stat("logs", &sb) != 0)
    {
        if (mkdir("logs", 0777) == -1)
        {
            std::cout << "Unable to create folder \"logs\"\r\n";
        }
    }

    return;
}