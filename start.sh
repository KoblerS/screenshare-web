docker build . -t app
docker run -d -it -p 8000:8000 -p 9000:9000 app
