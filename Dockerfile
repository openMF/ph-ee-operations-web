FROM node:16.13.0 as builder

RUN apt-get update && apt-get install -y vim

RUN npm install -g @angular/cli@12.2.16

#CMD ng serve --host 0.0.0.0 --disable-host-check --configuration kubernetes

ADD . /app
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
RUN npm rebuild node-sass --force
RUN npm install --force
RUN ng build --configuration kubernetes

FROM nginx:1.19.3
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/dist/web-app /usr/share/nginx/html
EXPOSE 4200
CMD ["nginx", "-g", "daemon off;"]
