# Build RediSearh
FROM rust:latest AS builder

RUN apt clean && apt -y update && apt -y install --no-install-recommends \
    clang && rm -rf /var/lib/apt/lists/*

WORKDIR /

# RediSearch
RUN git clone --recursive https://github.com/RediSearch/RediSearch.git

WORKDIR /RediSearch

RUN make setup

RUN make build

RUN mkdir -p bin/search

RUN mv bin/**/search/redisearch.so bin/search/redisearch.so

RUN echo $(ls -1 ./bin/)

# Redis JSON
WORKDIR /

RUN git clone https://github.com/RedisJSON/RedisJSON

WORKDIR /RedisJSON

RUN cargo build --release

RUN echo $(ls -1 ./target/release/)

# Build Redis
FROM redis:latest

ARG LIBRARY_PATH=/usr/lib/redis/modules

WORKDIR /data

RUN mkdir -p ${LIBRARY_PATH}
COPY --from=builder /RediSearch/bin/search/redisearch.so ${LIBRARY_PATH}
COPY --from=builder /RedisJSON/target/release/librejson.so ${LIBRARY_PATH}

COPY redis.conf /usr/local/etc/redis/redis.conf
