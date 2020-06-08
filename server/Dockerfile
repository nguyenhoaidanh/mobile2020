 # Dockerfile  
    FROM node:10
    WORKDIR /app  
    COPY package.json /app  
    ENV GOOGLE_APPLICATION_CREDENTIALS "home/thuc/project/mobile2020/server/resource/detect-faces.json"
    RUN npm install  
    COPY . /app  
    EXPOSE 3000  
    CMD npm start
