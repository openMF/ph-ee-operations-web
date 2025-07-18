FROM node:18.19.0 as builder

# Install vim editor with specific version and clean up to reduce image size
RUN apt-get update \
    && apt-get install -y --no-install-recommends vim \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN npm install -g @angular/cli@16.2.12

#CMD ng serve --host 0.0.0.0 --disable-host-check --configuration kubernetes

COPY . /app
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
RUN npm rebuild node-sass --force \
    && npm install --force \
    && ng build --configuration kubernetes

FROM nginx:1.19.3
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/dist/web-app /usr/share/nginx/html
EXPOSE 4200
CMD ["nginx", "-g", "daemon off;"]
