docker build -t disbursement-service .
docker run -d -t -p 3000:3000 disbursement-service