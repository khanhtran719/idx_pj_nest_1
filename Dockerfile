FROM node:18.16-alpine as build

RUN npm i pm2 -g

WORKDIR /opt/app

COPY ./package.json /opt/app/package.json
COPY ./dist ./dist

ENV APP_HOST='localhost'
ENV APP_PORT='3009'
ENV APP_API_DOCUMENT='true'

ENV DB_HOST='103.72.96.54'
ENV DB_PORT='5432'
ENV DB_USERNAME='khanhtn'
ENV DB_PASSWORD='kh@nh124'
ENV DB_DATABASE='dbs_personal'

ENV REDIS_HOST='redis-server-1'
ENV REDIS_PORT='6379'
ENV REDIS_USERNAME='default'
ENV REDIS_PASSWORD=''

ENV S3_REGION='auto'
ENV S3_ACCOUNT_ID='23724040a0d3b2352e589b36b69d8437'
ENV S3_ACCESS_KEY_ID='30dfdd58f5adf2d9a51b2926aae9fd0a'
ENV S3_SECRET_ACCESS_KEY='741cac77745b929653e233a429fcc57cdfcf09feda715f81956f61f451afdb9d'

ENV R2_BUCKET_URL='https://pub-a877d90e2f2844dab75958f2f82dfd6b.r2.dev'

RUN npm install --omit=dev --prefix ./

EXPOSE 3009

CMD ["pm2-runtime", "dist/main.js"]