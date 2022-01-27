FROM openjdk:8
EXPOSE 5000

COPY build/libs/*.jar .
CMD java -jar *.jar

