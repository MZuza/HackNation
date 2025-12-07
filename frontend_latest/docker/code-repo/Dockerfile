FROM busybox
ARG PACKAGE_VERSION
ENV PACKAGE_VERSION=$PACKAGE_VERSION
RUN mkdir -p /usr/src/code/
WORKDIR /usr/src/code
COPY frontend_$PACKAGE_VERSION.zip .
RUN cp /usr/src/code/frontend_$PACKAGE_VERSION.zip frontend_latest.zip
ENTRYPOINT ["cp", "-a", "--remove-destination", "/usr/src/code/.", "/frontend_code/"]
