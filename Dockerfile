FROM node:lts-alpine3.12

# Create application directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY src/ /usr/src/app

EXPOSE 8000
EXPOSE 9000
CMD ["npm", "start"]