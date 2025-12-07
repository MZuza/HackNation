FROM node:20-alpine
WORKDIR /usr/src/app
COPY ./dist/frontend/browser ./dist/frontend/
RUN npm install -g @angular/cli@18.2.12
RUN npm install pm2 -g
EXPOSE 4000
CMD ["pm2-runtime", "start", "ng", "--", "serve"]
