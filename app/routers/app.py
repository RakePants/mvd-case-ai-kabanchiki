from fastapi import APIRouter, File, UploadFile, Response
from fastapi.responses import FileResponse

app_router = APIRouter()


@app_router.get("/")
async def main_page() -> FileResponse:
    return FileResponse("templates/index.html")

