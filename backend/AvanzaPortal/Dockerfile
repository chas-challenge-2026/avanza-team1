FROM maven:3.8-openjdk-11 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:resolve -q
COPY src ./src
RUN mvn package -DskipTests -q

FROM eclipse-temurin:11-jre-jammy
WORKDIR /app
COPY --from=build /app/target/avanza-portal-1.0-SNAPSHOT.jar app.jar
EXPOSE 8082
ENTRYPOINT ["java", "-jar", "app.jar"]
