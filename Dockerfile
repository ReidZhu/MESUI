# STEP 1: Build
FROM harbor1.wok.wistron.com.cn/baseimage/node:12-alpine as builder
WORKDIR /app

COPY ./package.json  /app

RUN npm i

COPY ./ /app

RUN npm run build

# STEP 2: Setup
FROM harbor1.wok.wistron.com.cn/baseimage/nginx:latest

RUN rm -rf /etc/nginx/nginx.conf

COPY --from=builder /app/_nginx/nginx.conf /etc/nginx/nginx.conf

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/dist /usr/share/nginx/html

CMD [ "nginx", "-g", "daemon off;"]