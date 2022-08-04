FROM redislabs/redisearch:latest as redisearch
FROM redislabs/rejson:latest as rejson
FROM redis:latest

ARG LIBRARY_PATH=/usr/lib/redis/modules

COPY --from=redisearch $LIBRARY_PATH/redisearch.so $LIBRARY_PATH/
COPY --from=rejson $LIBRARY_PATH/*.so $LIBRARY_PATH/

COPY redis.conf /usr/local/etc/redis/redis.conf

CMD [ "redis-server", "/usr/local/etc/redis/redis.conf" ]