import numpy as np
import cv2
import base64
from io import BytesIO
from PIL import Image
from typing import Dict, Any, Tuple
from app.config import settings

class FeatureSegmenter:
    CLASSES = ["buildings", "vegetation", "roads", "water", "agriculture", "barren"]
    
    CLASS_IDS = {
        "barren": 0,
        "vegetation": 1,
        "water": 2,
        "roads": 3,
        "buildings": 4,
        "agriculture": 5
    }

    def segment(self, img_rgb: np.ndarray) -> Tuple[np.ndarray, np.ndarray, Dict[str, float]]:
        """
        Segments 512x512 RGB satellite image into 6 land cover classes.
        Returns:
        - class_mask: (512, 512) uint8 array with class IDs 0..5
        - color_mask: (512, 512, 3) RGB visualization
        - class_percentages: Dict of coverage percentages per class
        """
        h, w, _ = img_rgb.shape
        class_mask = np.zeros((h, w), dtype=np.uint8) # Default to 0 (barren)

        # Convert to HSV & Lab color spaces for robust spectral index extraction
        hsv = cv2.cvtColor(img_rgb, cv2.COLOR_RGB2HSV)
        r, g, b = img_rgb[:, :, 0].astype(float), img_rgb[:, :, 1].astype(float), img_rgb[:, :, 2].astype(float)

        # 1. Water Index (NDWI proxy: (G - R) / (G + R) or high blue with low red/green)
        water_mask = (b > r + 30) & (b > g + 10) & (r < 100)
        class_mask[water_mask] = self.CLASS_IDS["water"]

        # 2. Vegetation Index (NDVI proxy: (G - R) / (G + R) > threshold)
        # Deep forest vegetation
        veg_mask = (g > r + 25) & (g > b + 20) & (g > 70) & (~water_mask)
        class_mask[veg_mask] = self.CLASS_IDS["vegetation"]

        # 3. Agriculture (Yellowish-green or bright lime green crops)
        agri_mask = (g > r + 10) & (r > 60) & (b < 100) & (~veg_mask) & (~water_mask)
        class_mask[agri_mask] = self.CLASS_IDS["agriculture"]

        # 4. Roads (Gray neutral asphalt/concrete lines)
        gray_diff = np.maximum.reduce([np.abs(r - g), np.abs(g - b), np.abs(r - b)])
        road_mask = (gray_diff < 18) & (r > 80) & (r < 160) & (~veg_mask) & (~water_mask) & (~agri_mask)
        # Refine roads using morphological line features
        kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3))
        road_mask = cv2.morphologyEx(road_mask.astype(np.uint8), cv2.MORPH_CLOSE, kernel).astype(bool)
        class_mask[road_mask] = self.CLASS_IDS["roads"]

        # 5. Buildings (High brightness, reddish/brownish/bright white roof tops)
        building_mask = ((r > 170) & (g < 130) & (b < 130)) | ((r > 200) & (g > 200) & (b > 200)) | ((r > 160) & (gray_diff > 25))
        building_mask = building_mask & (~water_mask) & (~veg_mask) & (~agri_mask)
        class_mask[building_mask] = self.CLASS_IDS["buildings"]

        # Build RGB Color Mask for UI Overlay
        color_mask = np.zeros((h, w, 3), dtype=np.uint8)
        for name, cid in self.CLASS_IDS.items():
            color = settings.CLASS_COLORS[name]
            color_mask[class_mask == cid] = color

        # Calculate Percentages
        total_pixels = h * w
        class_percentages = {}
        for name, cid in self.CLASS_IDS.items():
            count = np.sum(class_mask == cid)
            class_percentages[name] = round((count / total_pixels) * 100.0, 2)

        return class_mask, color_mask, class_percentages

    def to_base64_mask(self, color_mask: np.ndarray) -> str:
        pil_img = Image.fromarray(color_mask)
        buffer = BytesIO()
        pil_img.save(buffer, format="PNG")
        return "data:image/png;base64," + base64.b64encode(buffer.getvalue()).decode("utf-8")
