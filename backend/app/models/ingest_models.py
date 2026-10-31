from typing import List, Optional
from pydantic import BaseModel, Field


class IngestFileItem(BaseModel):
    filename: str
    status: str = Field(description="compiled, cached, or failed")
    concepts_count: int = 0
    error_message: Optional[str] = None


class IngestResponse(BaseModel):
    status: str
    files_processed: int
    concepts_created: int
    links_generated: int
    time_taken_seconds: float
    output_directory: str
    file_details: List[IngestFileItem] = Field(default_factory=list)
    errors: List[str] = Field(default_factory=list)

