from fastapi import APIRouter, File, UploadFile, BackgroundTasks
from fastapi.responses import FileResponse

from head.utils.utils import main_coru, delete_head

from io import BytesIO
from PIL import Image

app_router = APIRouter()


@app_router.post("/photo")
async def load_photo(background_task: BackgroundTasks, file: UploadFile = File()):
    await main_coru(Image.open(BytesIO(file.file.read())))
    return FileResponse("predict.jpg", status_code=200, media_type="image/jpg", background=background_task.add_task(delete_head))