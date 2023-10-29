from ultralytics import YOLO
import asyncio
import io
from PIL import Image
import os
import zipfile
import requests
from fastapi import HTTPException

model = YOLO("best.pt")


async def post_request(f):
    result = requests.post(url="http://192.168.0.131:1002/photo", files={"file": f})
    f.close()
    return result


async def main_coru(file: Image):
    results = model.predict(file, conf=0.2)
    i = ''
    filenames = set()
    requests_array = []
    im_array = results[0].plot()
    im = Image.fromarray(im_array[..., ::-1])
    im.save('./result/result.jpg')
    filenames.add("./result/result.jpg")
    for item in results:
        item.save_crop(save_dir=f"./")
    for filename in os.listdir("./person_with_gun"):
        file_path = os.path.join("./person_with_gun", filename)
        f = open(file_path, mode="rb")
        requests_array.append(post_request(f))
    responses = await asyncio.gather(*requests_array)
    for response in responses:
        if response.status_code == 200:
            with Image.open(io.BytesIO(response.content)) as f2:
                f2.save(f"./result/im{i}.jpg")
            filenames.add(f"./result/im{i}.jpg")
            if i == '':
                i = 1
            i += 1
    s = io.BytesIO()
    zf = zipfile.ZipFile(s, "w")
    for fpath in filenames:
        fdir, fname = os.path.split(fpath)
        zf.write(fpath, fname)
    zf.close()
    return s.getvalue()


async def delete_files():
    try:
        for filename in os.listdir("./person_with_gun"):
            file_path = os.path.join("./person_with_gun", filename)
            if os.path.isfile(file_path):
                os.remove(file_path)
    except:
        pass
    try:
        for filename in os.listdir("./result"):
            file_path = os.path.join("./result", filename)
            if os.path.isfile(file_path):
                os.remove(file_path)
    except:
        pass
    try:
        for filename in os.listdir("./personal_without_gun"):
            file_path = os.path.join("./personal_without_gun", filename)
            if os.path.isfile(file_path):
                os.remove(file_path)
    except:
        pass


if __name__ == '__main__':
    asyncio.run(main_coru("../bus.jpg"))