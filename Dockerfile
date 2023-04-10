# Use an official Node.js runtime as a parent image
FROM node:latest

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Set the application environment
ENV NODE_ENV production

# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
