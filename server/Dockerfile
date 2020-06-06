 # Dockerfile  
    FROM node:10
    WORKDIR /app  
    COPY package.json /app  
    RUN export GOOGLE_APPLICATION_CREDENTIALS ="$HOME/project/mobile2020/server/resource/detect-faces.json"
    RUN npm install  
    COPY . /app  
    EXPOSE 3000  
    CMD npm start
