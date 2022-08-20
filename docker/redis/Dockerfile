FROM redislabs/redisearch:latest as redisearch
FROM redislabs/rejson:latest as rejson
FROM redis:latest

ARG LIBRARY_PATH=/usr/lib/redis/modules

# This is not working; CMD is overwritten by compose
ARG REDIS_PASSWORD
ENV REDIS_PASSWORD $REDIS_PASSWORD

COPY --from=redisearch $LIBRARY_PATH/redisearch.so $LIBRARY_PATH/
COPY --from=rejson $LIBRARY_PATH/*.so $LIBRARY_PATH/

COPY redis.conf /usr/local/etc/redis/redis.conf

CMD [ "redis-server", "/usr/local/etc/redis/redis.conf", "--requirepass ${REDIS_PASSWORD}" ]