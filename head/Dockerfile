FROM python:3.11
WORKDIR /usr/src/head
COPY . /usr/src/head
RUN pip install --no-cache-dir -r requirements.txt
EXPOSE 1002
CMD uvicorn head.start_server:app --host 0.0.0.0 --port 1002 --workers 1