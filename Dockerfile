FROM openjdk:8
EXPOSE 5000

COPY target/*.jar .
CMD java -jar *.jar

