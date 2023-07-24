FROM node:16.13.0 as builder
RUN apt-get update && apt-get install -y vim less postgresql-client

RUN npm install -g @angular/cli@12.2.16

#CMD ng serve --host 0.0.0.0 --disable-host-check --configuration kubernetes

ADD . /app
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
RUN npm rebuild node-sass --force
RUN npm install --force
RUN ng build --configuration kubernetes

FROM amazonlinux:2023

ARG CACHEBUST=1

RUN dnf -y upgrade && \
# Install nginx
    dnf -y install nginx && \
# Create the non-root user to run the application
    dnf -y install shadow-utils && \
    groupadd --system --gid 1000 nginxgroup && \
    useradd --uid 1000 --gid nginxgroup --no-user-group nginxuser && \
    dnf -y remove shadow-utils && \
# Clean up the yum cache
    dnf -y clean all

RUN mkdir -p /app/logs
RUN rm -rf /var/log/nginx && ln -sf /app/logs /var/log/nginx
RUN chown -R nginxuser:nginxgroup /var/lib/nginx/
RUN chown -R nginxuser:nginxgroup /app

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder --chown=nginxuser:nginxgroup /app/dist/web-app /app/html
EXPOSE 4200
USER nginxuser:nginxgroup
CMD ["nginx", "-g", "daemon off;"]
