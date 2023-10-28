from fastapi import APIRouter, File, Response, BackgroundTasks, UploadFile
from fastapi.responses import FileResponse

from person_with_gun.utils.utils import main_coru, delete_files
from io import BytesIO
from PIL import Image

app_router = APIRouter()


@app_router.post("/photo")
async def load_photo(background_task: BackgroundTasks, file: UploadFile = File()):
    result = await main_coru(Image.open(BytesIO(file.file.read())))
    background_task.add_task(delete_files)
    if result:
        result.background = background_task
        return result
    return Response(status_code=204, background=background_task)
