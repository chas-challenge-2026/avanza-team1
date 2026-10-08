# ----------------------------------------
# Stage 1: Build Java Application
# ----------------------------------------
FROM maven:3.9-eclipse-temurin-21 AS java-build
WORKDIR /app

# Copy from context root into the container
COPY backend/AvanzaPortal/pom.xml .
RUN mvn dependency:resolve -q
COPY backend/AvanzaPortal/src ./src
RUN mvn package -DskipTests -q

# ----------------------------------------
# Stage 2: Build C++ Native Library
# ----------------------------------------
FROM eclipse-temurin:21-jdk-jammy AS cpp-build
WORKDIR /app/native

# Install Linux build tools
RUN apt-get update && apt-get install -y cmake g++ build-essential

# Copy the native source code from the context root
COPY native/ ./

# Navigate into the backtest directory where CMakeLists.txt is located and compile
RUN cd backtest && \
    rm -rf build && \
    cmake -B build -DCMAKE_BUILD_TYPE=Release && \
    cmake --build build

# ----------------------------------------
# Stage 3: Final Runtime Image
# ----------------------------------------
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# Copy the Java executable from Stage 1
COPY --from=java-build /app/target/avanza-portal-1.0-SNAPSHOT.jar app.jar

# Copy the compiled C++ library. Note the updated path including /backtest/
COPY --from=cpp-build /app/native/backtest/build/libbacktest.so /usr/lib/libbacktest.so

EXPOSE 8082
ENTRYPOINT ["java", "-jar", "app.jar"]