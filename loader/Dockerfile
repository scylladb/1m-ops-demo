FROM ubuntu:20.04

ENV DEBIAN_FRONTEND=noninteractive \
    RUSTUP_HOME=/usr/local/rustup \
    CARGO_HOME=/usr/local/cargo \
    PATH=/usr/local/cargo/bin:$PATH

RUN apt-get update -y && \
    apt-get install -y build-essential libssl-dev git-all pkg-config curl && \
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y && \
    git clone https://github.com/scylladb/cql-stress.git /home/ubuntu/cql-stress && \
    cd /home/ubuntu/cql-stress && \
    cargo build --release

WORKDIR /home/ubuntu/cql-stress

COPY loader.sh /loader.sh
RUN chmod +x /loader.sh

ENTRYPOINT ["/loader.sh"]
