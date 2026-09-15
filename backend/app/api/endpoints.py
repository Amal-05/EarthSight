from fastapi import APIRouter, HTTPException, Body
from typing import Dict, Any, List, Optional
from pydantic import BaseModel

from app.config import settings
from app.satellite.demo_provider import DemoSatelliteProvider
from app.satellite.sentinel_provider import Sentinel2Provider
from app.preprocessing.aligner import ImageAligner
from app.segmentation.engine import FeatureSegmenter
from app.change_detection.detector import MultiTemporalChangeDetector
from app.statistics.calculator import GeospatialStatsCalculator
from app.semantic_search.query_parser import NaturalLanguageQueryParser
from app.reporting.summary_generator import AISummaryReportGenerator

router = APIRouter()

# Global service instances
demo_provider = DemoSatelliteProvider()
sentinel_provider = Sentinel2Provider()
segmenter = FeatureSegmenter()
detector = MultiTemporalChangeDetector()

# Pydantic Schemas
class SearchQuery(BaseModel):
    bbox: List[float] = [-97.7431, 30.2672, -97.6431, 30.3672]
    start_date: str = "2018-01-01"
    end_date: str = "2025-12-31"
    mode: str = "demo" # "demo" or "live"

class FetchPairRequest(BaseModel):
    bbox: List[float] = [-97.7431, 30.2672, -97.6431, 30.3672]
    year1: int = 2018
    year2: int = 2025
    mode: str = "demo"

class QueryRequest(BaseModel):
    query: str
    year1: Optional[int] = 2018
    year2: Optional[int] = 2025

@router.get("/health")
def health_check():
    return {
        "status": "online",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "feature_classes": settings.FEATURE_CLASSES
    }

@router.post("/satellite/search")
def search_satellite(req: SearchQuery):
    provider = sentinel_provider if req.mode == "live" else demo_provider
    scenes = provider.search_imagery(req.bbox, req.start_date, req.end_date)
    return {"status": "success", "scenes": scenes, "mode": req.mode}

@router.post("/satellite/fetch-pair")
def fetch_pair(req: FetchPairRequest):
    provider = sentinel_provider if req.mode == "live" else demo_provider
    pair_data = provider.fetch_image_pair(req.bbox, req.year1, req.year2)
    return {"status": "success", "pair": pair_data}

@router.post("/analysis/full-pipeline")
def run_full_pipeline(req: FetchPairRequest):
    """
    Executes end-to-end processing pipeline:
    1. Fetch image pair (T1, T2)
    2. Align & normalize
    3. Perform 6-class segmentation
    4. Detect multi-temporal changes
    5. Calculate geospatial metrics
    6. Generate AI narrative report
    """
    provider = sentinel_provider if req.mode == "live" else demo_provider
    pair_data = provider.fetch_image_pair(req.bbox, req.year1, req.year2)

    img1 = np_from_list(pair_data["image1_array"])
    img2 = np_from_list(pair_data["image2_array"])

    # Preprocessing
    img1_norm, img2_norm = ImageAligner.crop_and_align(img1, img2)

    # Segmentation
    mask1, color_mask1, pct1 = segmenter.segment(img1_norm)
    mask2, color_mask2, pct2 = segmenter.segment(img2_norm)

    # Change Detection
    change_mat, color_overlay, feat_stats = detector.detect_changes(mask1, mask2, target_feature="all")

    # Geospatial Statistics
    stats_result = GeospatialStatsCalculator.calculate_full_statistics(feat_stats, req.year1, req.year2, req.bbox)

    # AI Report Summary
    report = AISummaryReportGenerator.generate_narrative_report(stats_result)

    return {
        "status": "success",
        "mode": req.mode,
        "year1": req.year1,
        "year2": req.year2,
        "image1_base64": pair_data["image1_base64"],
        "image2_base64": pair_data["image2_base64"],
        "segmentation_mask1_base64": segmenter.to_base64_mask(color_mask1),
        "segmentation_mask2_base64": segmenter.to_base64_mask(color_mask2),
        "change_overlay_base64": detector.to_base64_overlay(color_overlay),
        "percentages_year1": pct1,
        "percentages_year2": pct2,
        "statistics": stats_result,
        "ai_report": report
    }

@router.post("/semantic-query")
def semantic_query(req: QueryRequest):
    """
    Parses natural language query into structured parameters and runs filtered change analysis.
    """
    parsed = NaturalLanguageQueryParser.parse_query(req.query)
    
    # Run pipeline for requested timeframe and feature
    year1 = parsed.get("start_year", req.year1 or 2018)
    year2 = parsed.get("end_year", req.year2 or 2025)
    target_feature = parsed.get("feature", "all")

    pair_data = demo_provider.fetch_image_pair(settings.DEFAULT_AOI["bbox"], year1, year2)
    img1 = np_from_list(pair_data["image1_array"])
    img2 = np_from_list(pair_data["image2_array"])

    img1_norm, img2_norm = ImageAligner.crop_and_align(img1, img2)
    mask1, color_mask1, pct1 = segmenter.segment(img1_norm)
    mask2, color_mask2, pct2 = segmenter.segment(img2_norm)

    change_mat, color_overlay, feat_stats = detector.detect_changes(mask1, mask2, target_feature=target_feature)
    stats_result = GeospatialStatsCalculator.calculate_full_statistics(feat_stats, year1, year2, settings.DEFAULT_AOI["bbox"])
    report = AISummaryReportGenerator.generate_narrative_report(stats_result, parsed)

    return {
        "status": "success",
        "parsed_query": parsed,
        "year1": year1,
        "year2": year2,
        "target_feature": target_feature,
        "image1_base64": pair_data["image1_base64"],
        "image2_base64": pair_data["image2_base64"],
        "change_overlay_base64": detector.to_base64_overlay(color_overlay),
        "statistics": stats_result,
        "ai_report": report
    }

def np_from_list(img_list: List) -> Any:
    import numpy as np
    return np.array(img_list, dtype=np.uint8)
