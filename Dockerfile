FROM node:15

WORKDIR /

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
COPY tsconfig.json ./

# Bundle app source
COPY . .

RUN npm ci --quiet && npm run build
# If you are building your code for production
# RUN npm ci --only=production


EXPOSE 8080

CMD [ "node", "./build/bin/www.js"]