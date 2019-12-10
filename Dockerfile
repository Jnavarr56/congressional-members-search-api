# base image
FROM node:12.2.0-alpine

# set working directory
WORKDIR /app/congressional-members-search-api

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/congressional-members-search-api/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /app/congressional-members-search-api/package.json
RUN npm install 


EXPOSE 3000


# start app
CMD ["npm", "start"]