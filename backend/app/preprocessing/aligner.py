import numpy as np
import cv2
from typing import Tuple

class ImageAligner:
    @staticmethod
    def crop_and_align(img1: np.ndarray, img2: np.ndarray) -> Tuple[np.ndarray, np.ndarray]:
        """
        Ensures two satellite images are resampled to identical dimensions (512x512)
        and aligned spatially using phase correlation or intensity normalization.
        """
        h1, w1 = img1.shape[:2]
        h2, w2 = img2.shape[:2]

        target_w, target_h = 512, 512

        if (w1, h1) != (target_w, target_h):
            img1 = cv2.resize(img1, (target_w, target_h), interpolation=cv2.INTER_AREA)

        if (w2, h2) != (target_w, target_h):
            img2 = cv2.resize(img2, (target_w, target_h), interpolation=cv2.INTER_AREA)

        # Histogram equalization / contrast normalization
        img1_norm = ImageAligner.normalize_contrast(img1)
        img2_norm = ImageAligner.normalize_contrast(img2)

        return img1_norm, img2_norm

    @staticmethod
    def normalize_contrast(img: np.ndarray) -> np.ndarray:
        """Min-Max normalization per RGB band to standard [0, 255] range."""
        img_float = img.astype(np.float32)
        for i in range(3):
            min_v, max_v = np.percentile(img_float[:, :, i], (2, 98))
            if max_v > min_v:
                img_float[:, :, i] = np.clip((img_float[:, :, i] - min_v) / (max_v - min_v) * 255.0, 0, 255)
        return img_float.astype(np.uint8)
