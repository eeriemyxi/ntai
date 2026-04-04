from enum import Enum
from typing import List, Optional

from pydantic import BaseModel


class SortType(str, Enum):
    DATE = "date"
    POPULAR = "popular"
    POPULAR_TODAY = "popular-today"
    POPULAR_WEEK = "popular-week"
    POPULAR_MONTH = "popular-month"


class GalleryItem(BaseModel):
    id: int
    media_id: str
    thumbnail: str
    thumbnail_width: int
    thumbnail_height: int
    english_title: str
    japanese_title: Optional[str]
    num_pages: int
    tag_ids: List[int]


class GalleryResponse(BaseModel):
    result: List[GalleryItem]
    num_pages: int
    per_page: int
    total: int
