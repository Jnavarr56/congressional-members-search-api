# base image
FROM node:12.2.0-alpine

# set working directory
WORKDIR /app/api

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/api/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /app/api/package.json
RUN npm install 


EXPOSE 3000


# start app
CMD ["npm", "start"]