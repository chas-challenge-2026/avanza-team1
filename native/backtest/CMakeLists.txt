cmake_minimum_required(VERSION 3.16)
project(native_modules LANGUAGES C CXX)

set(CMAKE_C_STANDARD 99)
set(CMAKE_C_STANDARD_REQUIRED ON)
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_POSITION_INDEPENDENT_CODE ON)

if(NOT CMAKE_BUILD_TYPE)
    set(CMAKE_BUILD_TYPE Release)
endif()

# --- risk (C) ---
add_library(risk STATIC ../risk/risk.c ../risk/helpers/helpers.c)
target_include_directories(risk PUBLIC ../risk ../risk/helpers)
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
if(SANITIZE)
    target_compile_options(risk PRIVATE -fsanitize=address,undefined -g)
    target_compile_options(backtest PRIVATE -fsanitize=address,undefined -g)
    target_compile_options(test_risk PRIVATE -fsanitize=address,undefined -g)
    target_compile_options(test_backtest PRIVATE -fsanitize=address,undefined -g)
    add_link_options(-fsanitize=address,undefined)
endif()