FROM node:12-alpine
WORKDIR /tmp/build
COPY . .
RUN npm run build

FROM lambci/lambda:nodejs12.x
COPY --from=0 /tmp/build/dist /var/task
