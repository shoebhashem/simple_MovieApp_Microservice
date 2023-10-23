# Use an official Node.js runtime as the base image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of the application code into the container
COPY . .

# Copy the public folder into the container
COPY ../public ./public

# Expose the port that the application will run on
EXPOSE 4000

# Start the application
CMD ["npm", "start"]
