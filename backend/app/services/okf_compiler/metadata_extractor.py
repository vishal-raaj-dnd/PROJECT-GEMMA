import os
import logging
from typing import Dict, Any, Tuple
from pydantic import BaseModel, Field

from app.config import settings
from app.services.okf_compiler.parser import smart_local_classify

logger = logging.getLogger(__name__)


class ConceptMetadata(BaseModel):
    type: str = Field(
        description="OKF category: 'component', 'procedure', 'safety', 'tool', 'fault_code', 'specification', 'guide', 'reference'"
    )
    title: str = Field(description="Clean, concise concept or component title")
    description: str = Field(description="1-2 sentence precise summary of this concept")
    tags: list[str] = Field(description="3 to 5 lowercase tags related to the concept")
    filename: str = Field(description="Safe lowercase kebab-case slug without extension")


def extract_metadata(chunk_content: str, header: str, idx: int) -> Tuple[Dict[str, Any], str]:
    """
    Extracts structured OKF metadata using Gemma / Gemini API.
    Gracefully falls back to deterministic local heuristic classification when offline.
    """
    api_key = settings.gemma_api_key or os.environ.get("GEMMA_API_KEY") or os.environ.get("GEMINI_API_KEY")

    if not api_key:
        logger.info("No GEMMA_API_KEY found. Using deterministic local classifier for concept #%d", idx)
        meta = smart_local_classify(header, chunk_content, idx)
        return meta, chunk_content

    try:
        from google import genai
        from google.genai import types

        client = genai.Client(api_key=api_key)
        prompt = (
            "You are an expert Open Knowledge Format (OKF) curator for industrial machinery.\n"
            "Analyze this document chunk and categorize it strictly into one of: "
            "['component', 'procedure', 'safety', 'tool', 'fault_code', 'specification', 'guide', 'reference'].\n"
            "Ensure the filename is a concise lowercase kebab-case slug.\n\n"
            f"--- CHUNK HEADER: {header} ---\n{chunk_content}\n--- END CHUNK ---"
        )

        response = client.models.generate_content(
            model=settings.gemma_model,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=ConceptMetadata,
                temperature=0.1
            )
        )

        parsed = ConceptMetadata.model_validate_json(response.text)
        return parsed.model_dump(), chunk_content

    except Exception as e:
        logger.warning("Gemma metadata extraction failed (%s). Falling back to local classifier.", str(e))
        meta = smart_local_classify(header, chunk_content, idx)
        return meta, chunk_content
