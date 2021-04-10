# SimpleFileDrive

[![Build](https://github.com/donghoon-khan/http-file-server/actions/workflows/build.yml/badge.svg)](https://github.com/donghoon-khan/http-file-server/actions/workflows/build.yml)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

SimpleFileDrive is a web UI for file driving.

## Features

- [x] List files/directories
- [x] Create directory
- [x] Delete directory
- [x] Move file/directory
- [x] Upload file
- [x] Download file

## Requirements

- JAVA 11 or newer

## Building

Gradle:

```bash
$ gradle clean build
```

Docker:

```bash
$ docker build -t simple-file-drive .
```

## Getting Started

You can run the SimpleFileDrive WAR directly, via Docker, or in Kubernetes.

### Running from WAR

```bash
$ java -jar build/libs/simple-file-drive-<version>.war
```

Open a browser and navigate to [http://localhost:8080](http://localhost:8080). The port can be overridden by adding the following config:

```bash
--server.port=<port>
```

### Running with Docker

Build image:

```bash
$ docker build -t simple-file-drive .
```

Launch container in background:

```bash
$ docker run -d -p 8080:8080 simple-file-drive
```
