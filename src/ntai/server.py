import typing as t

from curl_cffi import Session
from fastapi import FastAPI, Query
from fastapi.responses import JSONResponse
from pydantic import BeforeValidator

from . import core, types

app = FastAPI(root_path="/api")
session = Session()


def parse_comma_separated_ints(value: str | None) -> list[int]:
    if not value:
        return []
    return [int(item.strip()) for item in value.split(",")]


CommaIntList = t.Annotated[list[int], BeforeValidator(parse_comma_separated_ints)]


@app.get("/nhentai/search")
def nhentai_search(
    query: str, sort: types.SortType = types.SortType.DATE, page: int = 1
) -> JSONResponse:
    result = core.nhentai_search(session, query, sort, page)
    if not result:
        return JSONResponse(dict(status_code=500))
    return JSONResponse(result.model_dump())


@app.get("/nhentai/random")
def nhentai_random(
    query: str,
    sort: types.SortType = types.SortType.DATE,
    blacklist: CommaIntList = Query(
        None, description="A comma-separated list of integer book ids to be blacklisted"
    ),
) -> JSONResponse:
    result = core.find_random_book(session, query, sort, blacklist)
    if not result:
        return JSONResponse(dict(status_code=500))
    return JSONResponse(result.model_dump())
