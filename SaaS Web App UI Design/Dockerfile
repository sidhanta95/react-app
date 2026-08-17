FROM node:22-alpine AS builder
WORKDIR /app

# install npm dependencies (use npm to avoid pnpm supply-chain errors in CI)
COPY package.json ./
RUN npm install

# copy sources and build
COPY . .
RUN npm run build

FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
