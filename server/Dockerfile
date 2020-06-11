 # Dockerfile  
    FROM node:10
    WORKDIR /app  
    COPY package.json /app  
    ENV ENV_NODE "product" GOOGLE_APPLICATION_CREDENTIALS "/app/resource/detect-faces.json"
    RUN npm install  
    COPY . /app  
    EXPOSE 3000  
    CMD npm start
