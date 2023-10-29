from fastapi import FastAPI
import uvicorn
from starlette.middleware.cors import CORSMiddleware

from person_with_gun.routers.router import app_router

app = FastAPI()
app.include_router(app_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type", "Authorization"],
)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=1001)
