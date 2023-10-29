from fastapi import APIRouter
from fastapi.responses import FileResponse

app_router = APIRouter()


@app_router.get("/")
async def main_page() -> FileResponse:
    return FileResponse("templates/index.html")

