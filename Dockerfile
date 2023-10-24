FROM node:lts as BUILDER
#?ARG NPM
WORKDIR /app
COPY package.json /app/package.json
COPY tsconfig.json /app/tsconfig.json
#?COPY .npmrc /app/.npmrc
COPY src /app/src
RUN npm run prod
#?RUN npm run clean:prod
#RUN npm i --omit=dev
#?RUN rm -rf .npmrc

FROM node:lts-slim
WORKDIR /app
COPY --from=builder /app/dist /app/dist
CMD ["node", "./dist/index.cjs"]
EXPOSE 6005
