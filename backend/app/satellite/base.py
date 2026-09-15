from abc import ABC, abstractmethod
from typing import Dict, Any, List

class SatelliteProvider(ABC):
    @abstractmethod
    def search_imagery(self, bbox: List[float], start_date: str, end_date: str) -> List[Dict[str, Any]]:
        """Search for satellite scenes matching bounding box and date range."""
        pass
        
    @abstractmethod
    def fetch_image_pair(self, bbox: List[float], year1: int, year2: int) -> Dict[str, Any]:
        """Fetch preprocessed satellite image pair for T1 (year1) and T2 (year2)."""
        pass
