"""Recorta a la persona de un tramo de vídeo con DeepLabV3 de torchvision.
uso: recortar.py video desde hasta salida_dir   (fotogramas a 30 fps)
Escribe un PNG RGBA por fotograma con la persona y el resto transparente."""
import sys, subprocess, os
import numpy as np, torch
from PIL import Image, ImageFilter
from torchvision.models.segmentation import deeplabv3_resnet101, DeepLabV3_ResNet101_Weights
video, desde, hasta, out = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]), sys.argv[4]
torch.set_num_threads(4)
w = DeepLabV3_ResNet101_Weights.COCO_WITH_VOC_LABELS_V1
m = deeplabv3_resnet101(weights=w).eval()
mean = torch.tensor([0.485, 0.456, 0.406]).view(3, 1, 1); std = torch.tensor([0.229, 0.224, 0.225]).view(3, 1, 1)
W, H = 1080, 1920
p = subprocess.Popen(["ffmpeg", "-v", "error", "-ss", f"{desde/30:.4f}", "-i", video, "-frames:v", str(hasta - desde),
                      "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], stdout=subprocess.PIPE)
os.makedirs(out, exist_ok=True)
prev = None
with torch.no_grad():
    for i in range(desde, hasta):
        buf = p.stdout.read(W * H * 3)
        if len(buf) < W * H * 3: break
        img = np.frombuffer(buf, np.uint8).reshape(H, W, 3)
        small = np.asarray(Image.fromarray(img).resize((540, 960), Image.BILINEAR))
        x = (torch.from_numpy(small.copy()).permute(2, 0, 1).float() / 255 - mean) / std
        prob = torch.softmax(m(x.unsqueeze(0))["out"][0], 0)[15].numpy()  # 15 = persona
        if prev is not None: prob = 0.6 * prob + 0.4 * prev  # suaviza el parpadeo entre fotogramas
        prev = prob
        a = Image.fromarray((prob * 255).astype(np.uint8)).resize((W, H), Image.BICUBIC)
        a = a.point(lambda v: 0 if v < 90 else (255 if v > 170 else int((v - 90) * 255 / 80)))
        a = a.filter(ImageFilter.GaussianBlur(2))
        Image.fromarray(np.dstack([img, np.asarray(a)]), "RGBA").save(f"{out}/{i:05d}.png", compress_level=1)
        print(i, flush=True)
