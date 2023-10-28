from fastapi import FastAPI
import uvicorn
from app.routers.app import app_router

app = FastAPI()
app.include_router(app_router)

if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=1000)
