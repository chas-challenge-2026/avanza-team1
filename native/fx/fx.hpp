#ifndef fx_hpp
#define fx_hpp

#include <cstddef>

size_t write_data(char *buffer, size_t size, size_t nmemb, void *user_data);
void fx_convert();

typedef struct
{
    char *string;
    size_t size;
} Response;

#endif // fx_hpp