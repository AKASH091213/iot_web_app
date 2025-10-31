FROM ubuntu:22.04

# Avoid prompts during package install
ENV DEBIAN_FRONTEND=noninteractive

# Install Node.js + npm + Nginx
RUN apt-get update && apt-get install -y \
    curl ca-certificates nginx \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \


# Copy package.json and install deps
COPY package.json package-lock.json* ./

Run npm i npm@latest -g
RUN npm install

# Copy source code and build
COPY . .
RUN npm app.js

# Copy build files to nginx html folder


# Expose port
EXPOSE 80



