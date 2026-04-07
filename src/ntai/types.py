from enum import Enum

from pydantic import BaseModel


class ErrorType(int, Enum):
    OK = 1
    NO_PAGES = 2
    NO_RESPONSE = 3


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
    japanese_title: str | None
    num_pages: int
    tag_ids: list[int]


class GalleryResponse(BaseModel):
    result: list[GalleryItem]
    num_pages: int
    per_page: int
    total: int
