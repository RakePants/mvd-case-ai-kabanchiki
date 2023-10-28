from fastapi import HTTPException
import asyncio
import os
import torch
from PIL import Image

model = torch.hub.load('ultralytics/yolov5', 'custom', path='./crowdhuman_yolov5m.pt')


async def main_coru(file: Image):
    try:
        results = model(file)
        image_df = results.pandas().xyxy[0].loc[results.pandas().xyxy[0]['name'] == 'head'].to_dict()
        image_coords = {
            key: list(image_df[key].values())[0] for key in ['xmin', 'ymin', 'xmax', 'ymax']
        }
        xmin = image_coords['xmin']
        ymin = image_coords['ymin']
        xmax = image_coords['xmax']
        ymax = image_coords['ymax']
        cropped_image = file.crop((xmin, ymin, xmax, ymax))
        cropped_image.save("predict.jpg")
        return cropped_image
    except:
        raise HTTPException(status_code=204)


async def delete_head():
    os.remove("./predict.jpg")
