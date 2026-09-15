import numpy as np
import cv2
import base64
from io import BytesIO
from PIL import Image
from typing import Dict, Any, Tuple
from app.config import settings
from app.segmentation.engine import FeatureSegmenter

class MultiTemporalChangeDetector:
    def __init__(self):
        self.class_ids = FeatureSegmenter.CLASS_IDS
        self.inv_class_ids = {v: k for k, v in self.class_ids.items()}

    def detect_changes(
        self,
        mask_t1: np.ndarray,
        mask_t2: np.ndarray,
        target_feature: str = "all"
    ) -> Tuple[np.ndarray, np.ndarray, Dict[str, Any]]:
        """
        Compares segmentation masks at T1 and T2.
        Returns:
        - change_matrix: (512, 512) uint8 change category
        - color_overlay: (512, 512, 4) RGBA overlay mask with transparency
        - statistics: Dict of detailed change metrics
        """
        h, w = mask_t1.shape
        # 0: no_change, 1: increase, 2: decrease, 3: significant_transition
        change_matrix = np.zeros((h, w), dtype=np.uint8)
        color_overlay = np.zeros((h, w, 4), dtype=np.uint8)

        # Basic diff mask
        changed_pixels = (mask_t1 != mask_t2)
        change_matrix[changed_pixels] = 3 # Default to significant change

        feature_stats = {}
        
        for feat_name, cid in self.class_ids.items():
            t1_present = (mask_t1 == cid)
            t2_present = (mask_t2 == cid)

            gained = t2_present & (~t1_present)
            lost = t1_present & (~t2_present)
            stable = t1_present & t2_present

            feature_stats[feat_name] = {
                "t1_pixel_count": int(np.sum(t1_present)),
                "t2_pixel_count": int(np.sum(t2_present)),
                "pixel_gain": int(np.sum(gained)),
                "pixel_loss": int(np.sum(lost)),
                "stable_pixels": int(np.sum(stable)),
                "net_pixel_change": int(np.sum(gained)) - int(np.sum(lost))
            }

            # If user filters by specific feature (e.g. vegetation or buildings)
            if target_feature.lower() == feat_name or target_feature.lower() == "all":
                # Increase = Green
                color_overlay[gained] = [34, 197, 94, 200]
                change_matrix[gained] = 1

                # Decrease = Red
                color_overlay[lost] = [239, 68, 68, 200]
                change_matrix[lost] = 2

        # Non-target significant transitions = Yellow
        if target_feature.lower() == "all":
            sig_mask = (change_matrix == 3)
            color_overlay[sig_mask] = [245, 158, 11, 160]

        return change_matrix, color_overlay, feature_stats

    def to_base64_overlay(self, color_overlay: np.ndarray) -> str:
        pil_img = Image.fromarray(color_overlay, mode="RGBA")
        buffer = BytesIO()
        pil_img.save(buffer, format="PNG")
        return "data:image/png;base64," + base64.b64encode(buffer.getvalue()).decode("utf-8")
