FROM node:10

ARG UID=1000
ARG GID=1000
ARG UNAME=mcod

WORKDIR /opt/mcod
ADD . /opt/mcod

RUN groupadd -g $GID -o $UNAME
RUN useradd -m -u $UID -g $GID -o -s /bin/bash $UNAME

ADD ./docker/frontend/local/proxy.local.conf.json /opt/mcod/local-proxy.conf.json

RUN npm install -g @angular/cli
RUN npm install

EXPOSE 4200

CMD ng serve --host 0.0.0.0 --proxy-config proxy.local.conf.json --public-host http://mcod.local -c local
