FROM node:20-bullseye-slim 

WORKDIR /app
# Install required packages
COPY . /app
RUN npm install

#run migration 
RUN npm run migration:run

# Run node js app
CMD ["npm","run","dev"]




