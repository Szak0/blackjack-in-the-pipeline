sudo docker build -t myjenkins-blueocean:1.1 .

sudo docker run \
  --name jenkins-blueocean \
  --rm \
  --detach \
  --publish 8080:8080 \
  --publish 50000:50000 \
  -v jenkins-data:/var/jenkins_home \
  -v jenkins-docker-certs:/certs/client:ro \
  -v /var/run/docker.sock:/var/run/docker.sock \
  --env-file .env \
  myjenkins-blueocean:1.1 

sudo docker exec -it -u root jenkins-blueocean chown jenkins /var/run/docker.sock
sudo docker exec -it -u root jenkins-blueocean chown jenkins /usr/local/bin/aws

RUN curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl \
    && chmod +x ./kubectl \
    && mv ./kubectl /usr/local/bin/kubectl


RUN aws configure set default.region eu-central-1
aws ecr get-login-password --region eu-west-2 | docker login --username AWS --password-stdin 003235076673.dkr.ecr.eu-west-2.amazonaws.com
