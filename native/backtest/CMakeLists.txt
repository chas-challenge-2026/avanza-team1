cmake_minimum_required(VERSION 3.16)
project(native_modules LANGUAGES C CXX)

set(CMAKE_POSITION_INDEPENDENT_CODE ON)
set(CMAKE_POLICY_VERSION_MINIMUM 3.5) # Needed for newer cmake versions as Jansson is about to be deprecated. - Svartakatten

if(WIN32)
    set(CURL_USE_OPENSSL OFF CACHE BOOL "" FORCE)
    set(CURL_USE_SCHANNEL ON CACHE BOOL "" FORCE)  # Use Windows Schannel on Windows
else()
    set(CURL_USE_OPENSSL ON CACHE BOOL "" FORCE)   # Use OpenSSL on Linux/Docker
    set(CURL_USE_SCHANNEL OFF CACHE BOOL "" FORCE)
endif()

#Jansson - Automatic installation from github to run tests - Svartakatten
include(FetchContent)
FetchContent_Declare(
    jansson
    GIT_REPOSITORY https://github.com/akheron/jansson.git
    GIT_TAG        v2.14
    FIND_PACKAGE_ARGS NAMES jansson
)
set(JANSSON_BUILD_DOCS OFF CACHE BOOL "" FORCE)
set(JANSSON_BUILD_TESTS OFF CACHE BOOL "" FORCE)
FetchContent_MakeAvailable(jansson)

#libcurl - Automatic installation from github to run tests - Svartakatten
FetchContent_Declare(
    curl
    GIT_REPOSITORY https://github.com/curl/curl.git
    GIT_TAG        curl-8_5_0
    FIND_PACKAGE_ARGS NAMES CURL
)
set(BUILD_TESTING OFF CACHE BOOL "" FORCE)
set(BUILD_SHARED_LIBS OFF CACHE BOOL "" FORCE)
set(HTTP_ONLY ON CACHE BOOL "" FORCE)
FetchContent_MakeAvailable(curl)
#

set(CMAKE_C_STANDARD 99)
set(CMAKE_C_STANDARD_REQUIRED ON)
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
if(NOT CMAKE_BUILD_TYPE)
    set(CMAKE_BUILD_TYPE Release)
endif()

# --- risk (C) ---
add_library(risk STATIC ../risk/risk.c ../risk/helpers/helpers.c ../fx/fx.cpp ../logger/logger.cpp) # Edited call to fx and logger to run backtest Methods
target_include_directories(risk PUBLIC ../risk ../risk/helpers ../logger ${jansson_SOURCE_DIR}/src ${jansson_BINARY_DIR}/include ${curl_SOURCE_DIR}/include) # - Svartakatten
target_link_libraries(risk PUBLIC jansson libcurl)
target_compile_options(risk PRIVATE -Wall -Wextra -Wpedantic)
if(UNIX)
    target_link_libraries(risk PUBLIC m)
endif()

# --- backtest (C++17) ---
add_library(backtest SHARED backtest.cpp)
target_include_directories(backtest PUBLIC ${CMAKE_CURRENT_SOURCE_DIR})
target_compile_options(backtest PRIVATE -Wall -Wextra -Wpedantic)
target_link_libraries(backtest PRIVATE risk)

# --- tests ---
enable_testing()

add_executable(test_risk ../risk/tests/test_risk.c)
target_compile_options(test_risk PRIVATE -Wall -Wextra -Wpedantic)
target_link_libraries(test_risk PRIVATE risk)
add_test(NAME test_risk COMMAND test_risk)

add_executable(test_backtest tests/tests.cpp)
target_compile_options(test_backtest PRIVATE -Wall -Wextra -Wpedantic)
target_link_libraries(test_backtest PRIVATE backtest)
add_test(NAME test_backtest COMMAND test_backtest)

# --- Sanitizers ---
option(SANITIZE "Build with AddressSanitizer + UBSan" OFF)
if(SANITIZE) # Edited method to make one foreach call instead of multiple single-requests - Svartakatten
    foreach(tgt IN ITEMS risk backtest test_risk test_backtest)
        target_compile_options(${tgt} PRIVATE -fsanitize=address,undefined -fno-omit-frame-pointer -g)
        target_link_options(${tgt} PRIVATE -fsanitize=address,undefined)
    endforeach()
endif()