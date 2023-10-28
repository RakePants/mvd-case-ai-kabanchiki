FROM python:3.11
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN pip install -r requirements.txt
EXPOSE 8000
CMD uvicorn app.start_server:app --host 0.0.0.0 --port 8000 --workers 2