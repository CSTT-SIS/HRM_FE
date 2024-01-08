# DEPENDENCIES
FROM node:18-alpine AS fulldeps

RUN apk update && \
    apk add --update git && \
    apk add --update openssh

RUN mkdir -p /home/vangtats/hrm_fe

WORKDIR /home/vangtats/hrm_fe
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# BUILDER
FROM node:18-alpine AS builder

RUN mkdir -p /home/vangtats/hrm_fe

WORKDIR /home/vangtats/hrm_fe

COPY --from=fulldeps /home/vangtats/hrm_fe/node_modules ./node_modules

COPY . .

RUN npm run build

# RUNNER
FROM node:18-alpine AS runner

RUN mkdir -p /home/vangtats/hrm_fe

WORKDIR /home/vangtats/hrm_fe

COPY --from=builder /home/vangtats/hrm_fe/node_modules ./node_modules
COPY --from=builder /home/vangtats/hrm_fe/.next ./.next
COPY --from=builder /home/vangtats/hrm_fe/.env ./.env

FROM nginx:stable-alpine
COPY --from=builder /home/vangtats/hrm_fe/.next /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
