import numpy as np
import cv2
import base64
from io import BytesIO
from PIL import Image, ImageDraw, ImageFilter
from typing import Dict, Any, List
from app.satellite.base import SatelliteProvider

class DemoSatelliteProvider(SatelliteProvider):
    def __init__(self):
        self.width = 512
        self.height = 512

    def search_imagery(self, bbox: List[float], start_date: str, end_date: str) -> List[Dict[str, Any]]:
        return [
            {
                "id": "DEMO-SENTINEL2-2018",
                "date": "2018-06-15",
                "year": 2018,
                "cloud_cover": 0.02,
                "provider": "Sentinel-2 (Demo Mode)",
                "resolution": "10m"
            },
            {
                "id": "DEMO-SENTINEL2-2020",
                "date": "2020-07-10",
                "year": 2020,
                "cloud_cover": 0.01,
                "provider": "Sentinel-2 (Demo Mode)",
                "resolution": "10m"
            },
            {
                "id": "DEMO-SENTINEL2-2022",
                "date": "2022-06-20",
                "year": 2022,
                "cloud_cover": 0.03,
                "provider": "Sentinel-2 (Demo Mode)",
                "resolution": "10m"
            },
            {
                "id": "DEMO-SENTINEL2-2025",
                "date": "2025-05-18",
                "year": 2025,
                "cloud_cover": 0.01,
                "provider": "Sentinel-2 (Demo Mode)",
                "resolution": "10m"
            }
        ]

    def _generate_synthetic_scene(self, year: int) -> np.ndarray:
        """
        Generates a 512x512 RGB realistic synthetic satellite image for a given year.
        Simulates:
        - Vegetation (deep green with subtle noise)
        - Water body (lake on upper right)
        - Agriculture (patchwork fields on left)
        - Barren land (light brownish soil)
        - Roads (gray grid)
        - Buildings (red/white roofs expanding over years)
        """
        np.random.seed(42) # Base terrain consistency
        
        # Canvas background (Barren/soil texture)
        img = np.full((self.height, self.width, 3), [180, 165, 140], dtype=np.uint8)
        
        # Add terrain noise
        noise = np.random.randint(-15, 15, (self.height, self.width, 3), dtype=np.int16)
        img = np.clip(img.astype(np.int16) + noise, 0, 255).astype(np.uint8)

        # 1. Agriculture Fields (Patchwork polygons on West side)
        agri_mask = np.zeros((self.height, self.width), dtype=np.uint8)
        cv2.rectangle(agri_mask, (20, 20), (180, 150), 255, -1)
        cv2.rectangle(agri_mask, (20, 160), (150, 300), 255, -1)
        cv2.rectangle(agri_mask, (160, 20), (280, 120), 255, -1)
        
        # Color fields with agricultural crops (Yellowish-green & golden tan)
        img[agri_mask == 255] = [80, 170, 60]
        
        # 2. Water Body (Reservoir / Lake in North East)
        # Water shrinks slightly from 2018 -> 2025
        water_radius = 90 - (year - 2018) * 2
        water_center = (400, 120)
        cv2.circle(img, water_center, water_radius, (30, 90, 200), -1)
        # Lake shoreline noise
        cv2.ellipse(img, (380, 140), (water_radius + 20, water_radius - 10), 30, 0, 360, (30, 90, 200), -1)

        # 3. Dense Forest / Vegetation (South-East & Central belt)
        # Vegetation retreats as urbanization expands from 2018 to 2025
        veg_mask = np.zeros((self.height, self.width), dtype=np.uint8)
        cv2.rectangle(veg_mask, (200, 250), (490, 490), 255, -1)
        cv2.circle(veg_mask, (180, 380), 80, 255, -1)
        
        # If year > 2018, clear out some vegetation for new developments
        if year >= 2020:
            cv2.rectangle(veg_mask, (220, 260), (360, 380), 0, -1) # De-forested block for development
        if year >= 2025:
            cv2.rectangle(veg_mask, (360, 260), (450, 420), 0, -1) # Further urban expansion
            
        img[veg_mask == 255] = [30, 140, 50]

        # 4. Road Infrastructure Network
        # Main Arterial Highway
        cv2.line(img, (0, 250), (512, 250), (90, 90, 100), 10)
        cv2.line(img, (250, 0), (250, 512), (90, 90, 100), 10)
        
        # Secondary streets expanding over years
        if year >= 2018:
            cv2.line(img, (100, 250), (100, 512), (110, 110, 120), 5)
            cv2.line(img, (100, 380), (250, 380), (110, 110, 120), 5)
        if year >= 2020:
            # New suburban grid in cleared vegetation area
            cv2.line(img, (250, 300), (370, 300), (110, 110, 120), 5)
            cv2.line(img, (370, 250), (370, 400), (110, 110, 120), 5)
        if year >= 2025:
            # Major outer ring beltway built by 2025
            cv2.line(img, (370, 350), (512, 350), (120, 120, 130), 6)
            cv2.line(img, (450, 250), (450, 512), (120, 120, 130), 6)

        # 5. Buildings / Urban Built-Up Area
        # 2018 Built-up core (North-West cluster)
        self._draw_building_cluster(img, 50, 270, 200, 450, density=0.3, seed=1)
        
        # 2020 Urban expansion into cleared area
        if year >= 2020:
            self._draw_building_cluster(img, 230, 270, 350, 370, density=0.65, seed=2)
            
        # 2025 Commercial complex & residential expansion
        if year >= 2025:
            self._draw_building_cluster(img, 375, 270, 480, 480, density=0.75, seed=3)
            # Commercial roof tops (larger white/gray rectangles)
            cv2.rectangle(img, (390, 280), (440, 330), (230, 230, 235), -1)
            cv2.rectangle(img, (410, 370), (470, 420), (210, 210, 220), -1)

        # Gaussian blur slightly for satellite sensor PSF (Point Spread Function) look
        img = cv2.GaussianBlur(img, (3, 3), 0.5)
        return img

    def _draw_building_cluster(self, img: np.ndarray, x1: int, y1: int, x2: int, y2: int, density: float, seed: int):
        np.random.seed(seed)
        step = 16
        for x in range(x1, x2 - step, step):
            for y in range(y1, y2 - step, step):
                if np.random.rand() < density:
                    roof_color = [np.random.randint(190, 240), np.random.randint(60, 100), np.random.randint(60, 100)]
                    w, h = np.random.randint(8, 12), np.random.randint(8, 12)
                    cv2.rectangle(img, (x, y), (x + w, y + h), roof_color, -1)

    def fetch_image_pair(self, bbox: List[float], year1: int = 2018, year2: int = 2025) -> Dict[str, Any]:
        img1 = self._generate_synthetic_scene(year1)
        img2 = self._generate_synthetic_scene(year2)

        return {
            "bbox": bbox,
            "year1": year1,
            "year2": year2,
            "image1_base64": self._to_base64(img1),
            "image2_base64": self._to_base64(img2),
            "image1_array": img1.tolist(),
            "image2_array": img2.tolist(),
            "dimensions": [self.width, self.height]
        }

    def _to_base64(self, img_np: np.ndarray) -> str:
        pil_img = Image.fromarray(img_np)
        buffer = BytesIO()
        pil_img.save(buffer, format="PNG")
        return "data:image/png;base64," + base64.b64encode(buffer.getvalue()).decode("utf-8")
