FROM node

RUN mkdir /app
WORKDIR /app
ADD ./app /app

RUN npm install --registry https://registry.npm.taobao.org

EXPOSE 80

CMD ["npm", "start"]
