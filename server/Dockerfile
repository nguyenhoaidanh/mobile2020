 # Dockerfile  
    FROM node:10
    WORKDIR /app  
    COPY package.json /app  
    ENV GOOGLE_APPLICATION_CREDENTIALS "/app/resource/detect-faces.json"
    RUN npm install  
    RUN npm install -g logrotate-stream
    COPY . /app  
    EXPOSE 3000  
    CMD npm start 2>&1 | logrotate-stream logs/app.log --keep 5 --size '1m' --compress
