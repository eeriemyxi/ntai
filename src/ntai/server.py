import typing as t

from curl_cffi import Session
from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi.responses import JSONResponse

from . import core, types

app = FastAPI(root_path="/api")
session = Session()


def parse_blacklist(
    blacklist: str | None = Query(
        None, description="A comma-separated list of integer book ids to be blacklisted"
    )
) -> list[int]:
    if not blacklist:
        return []

    try:
        return [int(item.strip()) for item in blacklist.split(",") if item.strip()]
    except ValueError:
        raise HTTPException(
            status_code=422, detail="Blacklist items must be valid integers."
        )


@app.get("/nhentai/search")
def nhentai_search(
    query: str, sort: types.SortType = types.SortType.DATE, page: int = 1
):
    result = core.nhentai_search(session, query, sort, page)
    if not result:
        raise HTTPException(500)
    return JSONResponse(result.model_dump())


@app.get("/nhentai/random")
def nhentai_random(
    query: str,
    sort: types.SortType = types.SortType.DATE,
    blacklist: list[int] = Depends(parse_blacklist),
):
    result, err = core.find_random_book(session, query, sort, blacklist)
    if not result:
        raise HTTPException(500, detail={"code": err})
    return JSONResponse(result.model_dump())
