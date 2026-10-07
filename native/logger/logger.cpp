#include "logger.hpp"

#include <iostream>
#include <fstream>
#include <string>
#include <ctime>
#include <sys/stat.h>
#include <sys/types.h>

void log(LOG_TYPE code, std::string file_name, std::string error_message)
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

    /*  Assembles file path and opens it for writing. */
    std::string file_path;
    file_path = "logs/" + file_name;
    std::ofstream file(file_path, std::ios::app);
    if (!file)
    {
        std::cout << "Unable to open file: " << file_name << "\r\n";
        return;
    }


    /*  Creates a timestamped with the format [YYYY-MM-DD HH:MM:SS] */
    time_t now = time(NULL);
    struct tm timestamp_tm = *localtime(&now);

    char timestamp_format[22];
    strftime(timestamp_format, sizeof(timestamp_format), "[%Y-%m-%d %H:%M:%S]", &timestamp_tm);
    
    std::string timestamp_string = timestamp_format;


    std::string final_message;
    
    /*  Chosen log type is pasted after timestamp and before error message. */
    if (code == LOG_WARN)
    {
        final_message = timestamp_string + " WARNING:\t" + error_message + "\r\n";
    }
    else if (code == LOG_ERR)
    {
        final_message = timestamp_string + " ERROR:\t" + error_message + "\r\n";
    }
    else
    {
        final_message = timestamp_string + " INFO:\t\t" + error_message + "\r\n";
    }

    file << final_message;

    file.close();

    return;
}