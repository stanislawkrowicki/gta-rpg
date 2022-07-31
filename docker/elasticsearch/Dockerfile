FROM docker.elastic.co/elasticsearch/elasticsearch:8.3.3

COPY elasticsearch.yml /usr/share/elasticsearch/config/
COPY jvm.options /etc/elasticsearch/

ENV discovery.type=single-node
ENV bootstrap.memory_lock=true
