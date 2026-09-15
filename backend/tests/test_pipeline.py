import pytest
import numpy as np
from app.satellite.demo_provider import DemoSatelliteProvider
from app.segmentation.engine import FeatureSegmenter
from app.change_detection.detector import MultiTemporalChangeDetector
from app.statistics.calculator import GeospatialStatsCalculator
from app.semantic_search.query_parser import NaturalLanguageQueryParser
from app.reporting.summary_generator import AISummaryReportGenerator

def test_demo_provider():
    provider = DemoSatelliteProvider()
    pair = provider.fetch_image_pair([-97.74, 30.26, -97.64, 30.36], 2018, 2025)
    assert "image1_base64" in pair
    assert "image2_base64" in pair
    assert pair["year1"] == 2018
    assert pair["year2"] == 2025

def test_segmentation_engine():
    provider = DemoSatelliteProvider()
    pair = provider.fetch_image_pair([-97.74, 30.26, -97.64, 30.36], 2018, 2025)
    img1 = np.array(pair["image1_array"], dtype=np.uint8)
    
    segmenter = FeatureSegmenter()
    mask, color_mask, pct = segmenter.segment(img1)
    
    assert mask.shape == (512, 512)
    assert color_mask.shape == (512, 512, 3)
    assert "buildings" in pct
    assert "vegetation" in pct

def test_change_detection_and_stats():
    provider = DemoSatelliteProvider()
    pair = provider.fetch_image_pair([-97.74, 30.26, -97.64, 30.36], 2018, 2025)
    img1 = np.array(pair["image1_array"], dtype=np.uint8)
    img2 = np.array(pair["image2_array"], dtype=np.uint8)

    segmenter = FeatureSegmenter()
    mask1, _, _ = segmenter.segment(img1)
    mask2, _, _ = segmenter.segment(img2)

    detector = MultiTemporalChangeDetector()
    _, color_overlay, feat_stats = detector.detect_changes(mask1, mask2, "all")
    assert color_overlay.shape == (512, 512, 4)

    stats = GeospatialStatsCalculator.calculate_full_statistics(feat_stats, 2018, 2025)
    assert "summary_cards" in stats
    assert "buildings" in stats["summary_cards"]

def test_query_parser():
    parsed = NaturalLanguageQueryParser.parse_query("Show vegetation loss between 2018 and 2025")
    assert parsed["feature"] == "vegetation"
    assert parsed["operation"] == "decrease"
    assert parsed["start_year"] == 2018
    assert parsed["end_year"] == 2025
