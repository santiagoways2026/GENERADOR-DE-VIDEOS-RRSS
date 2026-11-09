"""Fondo sin la persona, para que al girarlo no asome una segunda silueta.
uso: fondo_limpio.py dir_recorte dir_salida
Rellena la silueta (ensanchada) con el color de alrededor y desenfoca todo un poco,
como un fondo fuera de foco."""
import sys, os, glob
import numpy as np, torch
import torch.nn.functional as F
from torchvision.transforms.functional import gaussian_blur
from PIL import Image, ImageFilter
src, out = sys.argv[1], sys.argv[2]
os.makedirs(out, exist_ok=True)

def suave(x, k):  # x: 1xCxHxW, desenfoque en baja resolución
    p = F.interpolate(x, size=(480, 270), mode="area")
    p = gaussian_blur(p, kernel_size=k * 2 + 1, sigma=k / 2)
    return F.interpolate(p, size=(1920, 1080), mode="bilinear", align_corners=False)

for f in sorted(glob.glob(f"{src}/*.png")):
    im = Image.open(f)
    rgb = torch.from_numpy(np.asarray(im.convert("RGB")).copy()).permute(2, 0, 1).float()[None]
    a = im.getchannel("A").filter(ImageFilter.MaxFilter(25)).filter(ImageFilter.GaussianBlur(4))
    m = torch.from_numpy(np.asarray(a).copy()).float()[None, None] / 255
    keep = 1 - m
    relleno = sum(suave(rgb * keep, k) / (suave(keep, k) + 1e-4) for k in (6, 15, 35)) / 3
    final = rgb * keep + relleno * m
    final = gaussian_blur(final, kernel_size=11, sigma=2.5)
    Image.fromarray(final[0].permute(1, 2, 0).clamp(0, 255).byte().numpy()).save(
        f"{out}/{os.path.basename(f)}", compress_level=1)
    print(os.path.basename(f), flush=True)
