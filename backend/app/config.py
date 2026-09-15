import os

class Settings:
    PROJECT_NAME: str = "EarthSight API"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    
    # Feature Classes
    FEATURE_CLASSES: list = [
        "buildings",
        "vegetation",
        "roads",
        "water",
        "agriculture",
        "barren"
    ]
    
    # Color map for segmentation classes (RGB)
    CLASS_COLORS: dict = {
        "buildings": [239, 68, 68],      # Red
        "vegetation": [34, 197, 94],     # Green
        "roads": [168, 85, 247],         # Purple
        "water": [59, 130, 246],         # Blue
        "agriculture": [234, 179, 8],    # Yellow
        "barren": [156, 163, 175]        # Gray
    }
    
    # Change Detection Colors
    CHANGE_COLORS: dict = {
        "increase": [34, 197, 94],       # Green
        "decrease": [239, 68, 68],       # Red
        "significant": [245, 158, 11],   # Yellow/Orange
        "no_change": [100, 116, 139]     # Slate Gray
    }
    
    # Demo default location: Austin Tech Corridor / Suburban expansion zone
    DEFAULT_AOI: dict = {
        "name": "Austin Suburban Expansion Corridor",
        "bbox": [-97.7431, 30.2672, -97.6431, 30.3672],
        "center": [30.3172, -97.6931],
        "zoom": 13,
        "available_years": [2018, 2020, 2022, 2025]
    }

settings = Settings()
