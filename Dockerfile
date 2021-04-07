ARG             application_name=http-file-server
ARG             spring_profile=prod
ARG             jar=target/*.jar

## Build stage
FROM            openjdk:11-jre-alpine AS builder

ARG             application_name
ARG             jar=target/*.jar

ENV             APPLICATION=${application_name}
ENV             JAR_FILE=${jar}

WORKDIR         /home/${APPLICATION}

COPY            ${JAR_FILE} ${APPLICATION}.jar

RUN             java -Djarmode=layertools -jar ${APPLICATION}.jar extract

## Release stage
FROM            openjdk:11-jre-alpine

ARG             application_name
ARG             spring_profile

ENV             APPLICATION=${application_name}
ENV             SPRING_ACTIVE_PROFILE=${spring_profile}

LABEL           maintainer="mustwin@kakao.com"

RUN \
                addgroup -S ${APPLICATION} && \
                adduser -S ${APPLICATION} -G ${APPLICATION}

RUN             mkdir -p /home/${APPLICATION}

WORKDIR         /home/${APPLICATION}

COPY            --from=builder /home/${APPLICATION}/dependencies ./
COPY            --from=builder /home/${APPLICATION}/spring-boot-loader ./
COPY            --from=builder /home/${APPLICATION}/snapshot-dependencies ./
COPY            --from=builder /home/${APPLICATION}/application ./

RUN             chown -R ${APPLICATION}:${APPLICATION} /home/${APPLICATION}

USER            ${APPLICATION}

ENTRYPOINT      ["java", "-Dspring.profiles.active=${SPRING_ACTIVE_PROFILE}", "org.springframework.boot.loader.JarLauncher"]