from fastapi import FastAPI
import uvicorn
from head.routers.router import app_router

app = FastAPI()
app.include_router(app_router)


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=1002)
