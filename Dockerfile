ARG application_name=simple-file-drive
ARG spring_profile=prod
ARG username=admin
ARG password=admin
ARG max_file_size=1GB
ARG max_request_size=1GB

## Build stage
FROM adoptopenjdk:11-jdk-hotspot-bionic AS builder

ARG REFRESHED_AT
ENV REFRESHED_AT $REFRESHED_AT

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

RUN curl -sL https://deb.nodesource.com/setup_12.x | bash -
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update -qq 
RUN apt-get install -qq --no-install-recommends \
    nodejs \
    yarn
RUN rm -rf /var/lib/apt/lists/*

COPY frontend frontend
COPY gradle gradle
COPY src src
COPY build.gradle .
COPY gradlew .
COPY settings.gradle .

RUN chmod +x ./gradlew
RUN ./gradlew build

## Release stage
FROM adoptopenjdk/openjdk11:alpine-jre

ARG application_name
ARG spring_profile
ARG username
ARG password
ARG max_file_size
ARG max_request_size

ENV APPLICATION=${application_name}
ENV WORKDIR=/home/${APPLICATION}
ENV DATA_PATH=${WORKDIR}/data
ENV SPRING_ACTIVE_PROFILE=${spring_profile}

RUN addgroup -S ${APPLICATION} && \
    adduser -S ${APPLICATION} -G ${APPLICATION}

RUN mkdir -p ${WORKDIR}
RUN chown -R ${APPLICATION}:${APPLICATION} ${WORKDIR}
WORKDIR ${WORKDIR}

RUN mkdir -p ${DATA_PATH}
RUN chown -R ${APPLICATION}:${APPLICATION} ${DATA_PATH}

COPY --from=builder build/libs/*.war ./application.war

USER ${APPLICATION}

ENV USER_NAME=${username}
ENV PASSWORD=${password}
ENV MAX_FILE_SIZE=${max_file_size}
ENV MAX_REQUEST_SIZE=${max_request_size}
ENV BASE_PATH=${DATA_PATH}

EXPOSE 8080

ENTRYPOINT ["java", "-Dspring.profiles.active=${SPRING_ACTIVE_PROFILE}", "-jar", "./application.war"]