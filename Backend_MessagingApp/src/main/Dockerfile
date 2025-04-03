version: '3.8'

services:
  mongodb:
    image: mongo:5.0
    container_name: mongodb_container
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: rootpassword
    volumes:
      - mongodb_data:/data/db

  springboot-app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: springboot_container
    ports:
      - "8081:8081" # Expose the application port
    environment:
      SPRING_DATA_MONGODB_USERNAME: RasulNovruzov
      SPRING_DATA_MONGODB_PASSWORD: Rasul2005
      SPRING_DATA_MONGODB_DATABASE: rasul
      SPRING_DATA_MONGODB_URI: mongodb://mongodb_container:27017/rasul
    depends_on:
      - mongodb

volumes:
  mongodb_data:
    driver: local
