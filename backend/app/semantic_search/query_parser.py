import re
from typing import Dict, Any

class NaturalLanguageQueryParser:
    FEATURE_SYNONYMS = {
        "buildings": ["building", "buildings", "built-up", "urban", "urbanization", "housing", "structures", "construction"],
        "vegetation": ["vegetation", "forest", "tree", "trees", "greenery", "canopy", "woods"],
        "roads": ["road", "roads", "highway", "street", "pavement", "infrastructure", "traffic"],
        "water": ["water", "lake", "reservoir", "river", "water-body", "water body", "pond"],
        "agriculture": ["agriculture", "farmland", "crop", "crops", "farm", "fields"],
        "barren": ["barren", "soil", "dirt", "wasteland", "desert", "empty land"]
    }

    OPERATION_SYNONYMS = {
        "increase": ["increase", "increased", "increase in", "growth", "expansion", "expanded", "added", "new", "more"],
        "decrease": ["decrease", "decreased", "loss", "lost", "reduction", "reduced", "decline", "smaller", "shrinkage", "shrinking"],
        "change": ["change", "changed", "difference", "delta", "shift", "transition"]
    }

    @classmethod
    def parse_query(cls, query_text: str) -> Dict[str, Any]:
        text = query_text.lower().strip()

        # 1. Identify Feature Class
        matched_feature = "all"
        for feat, synonyms in cls.FEATURE_SYNONYMS.items():
            for syn in synonyms:
                if re.search(r'\b' + re.escape(syn) + r'\b', text):
                    matched_feature = feat
                    break
            if matched_feature != "all":
                break

        # 2. Identify Operation
        matched_operation = "change"
        for op, synonyms in cls.OPERATION_SYNONYMS.items():
            for syn in synonyms:
                if re.search(r'\b' + re.escape(syn) + r'\b', text):
                    matched_operation = op
                    break
            if matched_operation != "change":
                break

        # 3. Identify Years (e.g. "between 2018 and 2025" or "from 2020 to 2025")
        years = re.findall(r'\b(20\d{2})\b', text)
        start_year = 2018
        end_year = 2025

        if len(years) >= 2:
            start_year = int(years[0])
            end_year = int(years[1])
        elif len(years) == 1:
            end_year = int(years[0])

        return {
            "query": query_text,
            "feature": matched_feature,
            "operation": matched_operation,
            "start_year": start_year,
            "end_year": end_year,
            "location": "Selected Area of Interest (AOI)",
            "threshold": 0.05,
            "parsed_structure": {
                "feature_target": matched_feature.upper(),
                "action_intent": matched_operation.upper(),
                "timeframe": f"{start_year} -> {end_year}"
            }
        }
