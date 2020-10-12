docker build . -t app
docker run -it -p 443:443 -p 9000:9000 app
