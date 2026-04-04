import typing as t
import random

from curl_cffi import Session
from yarl import URL
import platformdirs

from . import types
from cache_decorator import Cache

NHENTAI_BASE_URL = URL("https://nhentai.net/api/")

@Cache(cache_dir=platformdirs.user_cache_dir("ntai"), validity_duration="30m", args_to_ignore=("session",))
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


def find_random_book(session: Session, query: str, sort: types.SortType = types.SortType.DATE) -> types.GalleryItem | None:
    resp: types.GalleryResponse | None = nhentai_search(session, query, sort, 1)
    if not resp:
        return None

    page = random.randint(1, resp.num_pages)

    nresp = nhentai_search(session, query, sort, page)
    if not nresp:
        return None
    
    return random.choice(nresp.result)
