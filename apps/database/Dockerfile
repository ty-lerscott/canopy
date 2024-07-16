FROM ghcr.io/tursodatabase/libsql-server:latest

ENV SQLD_HTTP_LISTEN_ADDR=0.0.0.0:8080
ENV SQLD_USERNAME=${TURSO_DB_USER}
ENV SQLD_PASSWORD=${TURSO_DB_PASSWORD}

CMD ["sqld", "--http-listen-addr", "$SQLD_HTTP_LISTEN_ADDR", "--username", "$SQLD_USERNAME", "--password", "$SQLD_PASSWORD"]