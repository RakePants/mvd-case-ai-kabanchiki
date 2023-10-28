from fastapi import Response
from httpx import AsyncClient
from ultralytics import YOLO
import asyncio
from zipfile import ZipFile
import io
from PIL import Image
import os
import aiofiles

model = YOLO("best.pt")


async def post_request(async_client: AsyncClient, f):
    result = await async_client.post(url="http://localhost:1002/photo", files={"file": f})
    f.close()
    return result


async def main_coru(file: Image):
    results = model.predict(file, conf=0.2)
    i = ''
    filenames = set()
    requests_set = set()
    async with AsyncClient() as async_client:
        for item in results:
            item.save_crop(save_dir=f"./")
        for filename in os.listdir("./person_with_gun"):
            file_path = os.path.join("./person_with_gun", filename)
            f = open(file_path, "rb")
            requests_set.add(post_request(async_client, f))
        responses = await asyncio.gather(*requests_set)
        for response in responses:
            if response.status_code == 200:
                with Image.open(io.BytesIO(response.content)) as f2:
                    f2.save(f"./result/im{i}.jpg")
                filenames.add(f"./result/im{i}.jpg")
                if i == '':
                    i = 1
                i += 1
    s = io.BytesIO()
    zf = ZipFile(s, "w")
    for fpath in filenames:
        fdir, fname = os.path.split(fpath)
        zf.write(fpath, fname)
    zf.close()
    return Response(s.getvalue(), media_type="application/zip", status_code=200)


async def delete_files():
    for filename in os.listdir("./person_with_gun"):
        file_path = os.path.join("./person_with_gun", filename)
        try:
            if os.path.isfile(file_path):
                os.remove(file_path)
        except Exception as e:
            print(f'Ошибка при удалении файла {file_path}. {e}')
    for filename in os.listdir("./result"):
        file_path = os.path.join("./result", filename)
        try:
            if os.path.isfile(file_path):
                os.remove(file_path)
        except Exception as e:
            print(f'Ошибка при удалении файла {file_path}. {e}')


if __name__ == '__main__':
    asyncio.run(main_coru("../bus.jpg"))