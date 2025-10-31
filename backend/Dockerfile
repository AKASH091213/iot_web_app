FROM ubuntu:22.04

# Avoid prompts during package install
ENV DEBIAN_FRONTEND=noninteractive

# Install Node.js + npm + Nginx
RUN apt-get update && apt-get install -y \
    curl ca-certificates nginx \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Set work directory
WORKDIR /app

# Copy package.json and install deps
COPY package.json package-lock.json* ./

Run npm i npm@latest -g
RUN npm install

# Copy source code and build
COPY . .
RUN npm run build

# Copy build files to nginx html folder
RUN rm -rf /var/www/html/* && cp -r dist/* /var/www/html/

# Expose port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
