# Use an official Node.js runtime as a base image for building the frontend
FROM node:16 AS build

WORKDIR /app

# Install dependencies and build the frontend app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Use a Node.js base image to serve the app directly
FROM node:16

WORKDIR /app

# Copy the build from the previous stage
COPY --from=build /app/build /app/build

# Install `serve` to serve the app
RUN npm install -g serve

# Expose the port that the app will be served on
EXPOSE 3000

# Start the app with the `serve` command
CMD ["serve", "-s", "build", "-l", "3000"]
