FROM python:3.11
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN pip install -r requirements.txt
EXPOSE 1000
CMD uvicorn app.start_server:app --host 0.0.0.0 --port 1000 --workers 1