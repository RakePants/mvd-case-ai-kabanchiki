FROM python:3.11
WORKDIR /usr/src/person_with_gun
COPY . /usr/src/person_with_gun
RUN pip install --no-cache-dir -r requirements.txt
EXPOSE 1001
CMD uvicorn person_with_gun.start_server:app --host 0.0.0.0 --port 1001 --workers 1