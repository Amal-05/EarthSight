import requests
from typing import Dict, Any, List
from app.satellite.base import SatelliteProvider
from app.satellite.demo_provider import DemoSatelliteProvider

class Sentinel2Provider(SatelliteProvider):
    def __init__(self):
        self.stac_api_url = "https://planetarycomputer.microsoft.com/api/stac/v1/search"
        self.fallback = DemoSatelliteProvider()

    def search_imagery(self, bbox: List[float], start_date: str, end_date: str) -> List[Dict[str, Any]]:
        payload = {
            "collections": ["sentinel-2-l2a"],
            "bbox": bbox,
            "datetime": f"{start_date}/{end_date}",
            "query": {"eo:cloud_cover": {"lt": 15}},
            "limit": 10
        }
        try:
            resp = requests.post(self.stac_api_url, json=payload, timeout=5)
            if resp.status_code == 200:
                data = resp.json()
                results = []
                for item in data.get("features", []):
                    props = item.get("properties", {})
                    results.append({
                        "id": item.get("id"),
                        "date": props.get("datetime", "")[:10],
                        "year": int(props.get("datetime", "")[:4]) if props.get("datetime") else None,
                        "cloud_cover": props.get("eo:cloud_cover", 0) / 100.0,
                        "provider": "Sentinel-2 (Live STAC)",
                        "assets": item.get("assets", {})
                    })
                if results:
                    return results
        except Exception as e:
            print(f"[Sentinel2Provider] STAC search fallback to Demo: {e}")
            
        return self.fallback.search_imagery(bbox, start_date, end_date)

    def fetch_image_pair(self, bbox: List[float], year1: int = 2018, year2: int = 2025) -> Dict[str, Any]:
        # Live imagery rendering uses fallback or synthetic renderer for consistent 512x512 processing in MVP
        return self.fallback.fetch_image_pair(bbox, year1, year2)
