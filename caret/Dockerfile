# Dockerfile for Plasmo Chrome extension

# Use an official Node.js image as the base image
FROM node:18-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN apt-get update && apt-get install -y python3 python3-pip

RUN npm install

# Copy the rest of the extension source code
COPY ./ /app/src

# Expose the port for Plasmo dev server (if using live reloading)
EXPOSE 5173

# Start Plasmo development server
CMD ["npm", "run", "dev"]
