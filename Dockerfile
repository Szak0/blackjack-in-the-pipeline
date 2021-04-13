FROM python:3.8-slim-buster

RUN cat /etc/resolv.conf

ARG DEBIAN_FRONTEND=noninteractive

ENV VIRTUAL_ENV=/opt/venv
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

ENV FLASK_ENV=development

RUN apt-get update -y && \
apt-get upgrade -y

WORKDIR ./app
ADD /static /app/static
ADD /templates /app/templates
ADD requirements.txt /app
ADD server.py /app

RUN python3 -m venv $VIRTUAL_ENV

RUN pip install --upgrade pip
RUN pip install -r requirements.txt

CMD ["server.py"]
ENTRYPOINT ["python3"]
