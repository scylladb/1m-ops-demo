# Base image: Python3 + NodeJS 22
FROM nikolaik/python-nodejs:python3.10-nodejs22-alpine

# Install tools
RUN apk update && \
    apk add unzip wget curl

# Install Terraform
RUN wget https://releases.hashicorp.com/terraform/1.10.5/terraform_1.10.5_linux_amd64.zip \
    && unzip terraform_1.10.5_linux_amd64.zip
RUN mv terraform /usr/local/bin/

# Install AWS CLI
RUN pip install awscli --upgrade --user
ENV PATH=~/.local/bin:$PATH

# Copy Terraform files
COPY scylladb-cloud/ /app/scylladb-cloud/
COPY scylladb-enterprise/ /app/scylladb-enterprise/
COPY tablets-scaling/ /app/tablets-scaling/
COPY loader/ /app/loader/
COPY terraform-data.tftpl /app/terraform-data.tftpl
COPY config.json /app/config.json

# Install backend dependencies
COPY app.py /app/app.py
COPY requirements.txt /app/requirements.txt
WORKDIR /app
RUN pip install -r requirements.txt

# Build frontend
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Run Flask app on default port (5000)
WORKDIR /app
CMD ["python3", "app.py"]

