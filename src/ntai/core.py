import secrets
import typing as t

import platformdirs
from cache_decorator import Cache
from curl_cffi import Session
from yarl import URL

from . import types

NHENTAI_BASE_URL = URL("https://nhentai.net/api/")


@Cache(
    cache_dir=platformdirs.user_cache_dir("ntai"),
    validity_duration="1h",
    args_to_ignore=("session",),
)
def nhentai_search(
    session: Session,
    query: str,
    sort: types.SortType = types.SortType.DATE,
    page: int = 1,
) -> types.GalleryResponse | None:
    url = (NHENTAI_BASE_URL / "v2/search/").with_query(
        dict(query=query, sort=sort.value, page=page)
    )
    resp = session.get(str(url))
    resp_json = t.cast(dict[t.Any, t.Any], resp.json())  # type: ignore
    if resp.status_code == 200:
        final = types.GalleryResponse.model_validate(resp_json)
    else:
        final = None
    return final


def find_random_book(
    session: Session,
    query: str,
    sort: types.SortType = types.SortType.DATE,
    blacklist: list[int] | None = None,
) -> types.GalleryItem | None:
    resp: types.GalleryResponse | None = nhentai_search(session, query, sort, 1)
    if not resp or resp.num_pages == 0:
        return None

    blacklist_set = set(blacklist or [])

    for _ in range(min(3, resp.num_pages)):
        page = secrets.randbelow(resp.num_pages) + 1
        nresp = nhentai_search(session, query, sort, page)
        if not nresp:
            return None

        valid_books = [book for book in nresp.result if book.id not in blacklist_set]
        if valid_books:
            return secrets.choice(valid_books)

    return None
