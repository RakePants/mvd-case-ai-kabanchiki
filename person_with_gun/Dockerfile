FROM python:3.11
WORKDIR /usr/src/person_with_gun
COPY . /usr/src/person_with_gun
RUN pip install --no-cache-dir -r requirements.txt
EXPOSE 8001
CMD uvicorn person_with_gun.start_server:app --host 0.0.0.0 --port 8001 --workers 2