FROM nginx:1.17-alpine


ENV TZ="Asia/Shanghai"

RUN cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
    && echo 'Asia/Shanghai' >/etc/timezone \
	&& mkdir -p /app

COPY ./dist /app
COPY ./nginx.conf /etc/nginx/nginx.conf
