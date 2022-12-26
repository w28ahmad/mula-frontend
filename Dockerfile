# Stage 1
FROM node:18.12.1-alpine AS build
WORKDIR /app

COPY package.json /app/package.json
RUN npm install
RUN npm install react-scripts@2.1.8 -g

COPY package-lock.json /app/
COPY public /app/public
COPY src /app/src

RUN npm run build

# Stage 2
FROM nginx:stable-alpine
COPY --from=build /app/build /var/www
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]