cmake_minimum_required(VERSION 3.28.3)

project(native_modules LANGUAGES C CXX)

set(CMAKE_C_STANDARD 99)
set(CMAKE_C_STANDARD_REQUIRED ON)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

add_library(risk STATIC
    ../risk/risk.c
    ../risk/helpers/helpers.c
)

target_include_directories(risk
    PUBLIC
        ../risk
        ../risk/helpers
)

add_library(backtest SHARED
    backtest.cpp
)

target_include_directories(backtest
    PUBLIC
        ${CMAKE_CURRENT_SOURCE_DIR}
        ${CMAKE_CURRENT_SOURCE_DIR}/tests
)

target_link_libraries(backtest
    PRIVATE
        risk    
)

add_executable(test_backtest
    tests/tests.cpp
)

target_link_libraries(test_backtest
    PRIVATE
        backtest
)