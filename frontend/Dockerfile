# Use Node.js image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend code
COPY . .

# Set port environment variable
ENV PORT=5173

# Expose port for local development
EXPOSE 5173

# Run development server
CMD [ "npm", "run", "dev", "--", "--host", "0.0.0.0"]