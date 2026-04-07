import secrets
import typing as t

import platformdirs
from curl_cffi import Response, Session
from loguru import logger as log
from yarl import URL

from . import types

from cache_decorator import Cache


NHENTAI_BASE_URL = URL("https://nhentai.net/api/")


@Cache(
    cache_dir=platformdirs.user_cache_dir("ntai"),
    validity_duration="1h",
    args_to_ignore=("session",),
)
def nhentai_search(
    session: Session[Response],
    query: str,
    sort: types.SortType = types.SortType.DATE,
    page: int = 1,
) -> types.GalleryResponse | None:
    url = (NHENTAI_BASE_URL / "v2/search/").with_query(
        dict(query=query, sort=sort.value, page=page)
    )
    resp = session.get(str(url))
    resp_json = t.cast(dict[t.Any, t.Any], resp.json())
    if resp.status_code == 200:
        final = types.GalleryResponse.model_validate(resp_json)
    else:
        final = None
    return final


def find_random_book(
    session: Session[Response],
    query: str,
    sort: types.SortType = types.SortType.DATE,
    blacklist: list[int] | None = None,
) -> tuple[types.GalleryItem | None, types.ErrorType | None]:
    resp = nhentai_search(session, query, sort, 1)
    if not resp:
        log.info(f"Returning None because {resp=}")
        return None, types.ErrorType.NO_RESPONSE
    if resp.num_pages == 0:
        log.info(f"Returning None because {resp.num_pages=}")
        return None, types.ErrorType.NO_RESPONSE

    blacklist_set = set(blacklist or [])
    log.info(f"Blacklist set: {blacklist_set}")
    log.info(f"{min(3, resp.num_pages)=}")

    for i in range(min(3, resp.num_pages)):
        log.info(f"Iteration #{i}")

        page = secrets.randbelow(resp.num_pages) + 1
        log.info(f"Selected page {page} from {resp.num_pages} pages")

        nresp = nhentai_search(session, query, sort, page)
        if not nresp:
            log.info(f"Returning None because {nresp=}")
            return None, types.ErrorType.NO_RESPONSE

        valid_books = [book for book in nresp.result if book.id not in blacklist_set]
        log.info(f"All books: {[b.id for b in nresp.result]}")
        log.info(
            f"Valid books: {[b.id for b in valid_books]}, total {len(valid_books)} out of {len(nresp.result)}"
        )

        if valid_books:
            choice = secrets.choice(valid_books)
            log.success(f"{choice.id=} was randomly selected from valid books")
            return choice, None

    log.info("Return None because no pages are left to check")
    return None, types.ErrorType.NO_PAGES
