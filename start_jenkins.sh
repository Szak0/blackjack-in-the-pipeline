docker run \
  --name jenkins-blueocean \
  --rm \
  --detach \
  --env DOCKER_HOST=unix:///var/run/docker.sock \
  --env DOCKER_CERT_PATH=/certs/client \
  --env DOCKER_TLS_VERIFY=1 \
  --publish 8080:8080 \
  --publish 50000:50000 \
  -v jenkins-data:/var/jenkins_home \
  -v jenkins-docker-certs:/certs/client:ro \
  -v /var/run/docker.sock:/var/run/docker.sock \
  myjenkins-blueocean:1.1 
