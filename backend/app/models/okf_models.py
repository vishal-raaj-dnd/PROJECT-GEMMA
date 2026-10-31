from enum import Enum
from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field


class OKFNodeType(str, Enum):
    COMPONENT = "component"
    PROCEDURE = "procedure"
    SAFETY = "safety"
    TOOL = "tool"
    FAULT_CODE = "fault_code"
    SPECIFICATION = "specification"
    REFERENCE = "reference"
    GUIDE = "guide"


class OKFFrontmatter(BaseModel):
    id: Optional[str] = Field(default=None, description="Unique identifier for the node")
    type: OKFNodeType = Field(default=OKFNodeType.GUIDE, description="Category classification")
    title: str = Field(description="Human-readable concept or component title")
    description: str = Field(default="", description="1-2 sentence concept summary")
    tags: List[str] = Field(default_factory=list, description="Categorization tags")
    subsystem: Optional[str] = Field(default=None, description="Subsystem belonging")
    part_numbers: List[str] = Field(default_factory=list, description="Associated part/serial numbers")
    safety_prerequisites: List[str] = Field(default_factory=list, description="Paths to required safety nodes")
    required_tools: List[str] = Field(default_factory=list, description="Paths to required tool nodes")
    procedures: List[str] = Field(default_factory=list, description="Paths to connected repair procedures")
    timestamp: Optional[str] = Field(default=None, description="Compilation or update ISO timestamp")


class OKFNode(BaseModel):
    id: str = Field(description="Unique node slug or ID")
    relative_path: str = Field(description="Path relative to the .okf root (e.g. components/valve.md)")
    category: str = Field(description="Subdirectory category")
    frontmatter: OKFFrontmatter = Field(description="Parsed YAML frontmatter")
    content: str = Field(description="Markdown body without frontmatter")
    outgoing_links: List[str] = Field(default_factory=list, description="Referenced relative file paths")
    incoming_links: List[str] = Field(default_factory=list, description="Backlink relative file paths")


class OKFGraphStats(BaseModel):
    total_nodes: int
    total_edges: int
    category_counts: Dict[str, int]
    last_compiled: Optional[datetime] = None
    is_indexed: bool
