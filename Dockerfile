FROM node:20 as build
ARG DEPLOY_ENV
WORKDIR /app
ADD package.json /app/
ADD package-lock.json /app/
RUN npm config set strict-ssl false
RUN npm install

COPY . /app/
RUN if [ "$DEPLOY_ENV" = "uat" ]; then \
      npm run build:uat; \
    else \
      npm run build; \
    fi

FROM nginx:stable as serve
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf.template /etc/nginx/templates/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]