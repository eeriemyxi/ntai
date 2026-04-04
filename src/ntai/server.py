from curl_cffi import Session
from fastapi import FastAPI
from fastapi.responses import JSONResponse

from . import core, types

app = FastAPI(root_path="/api")
session = Session()


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
    query: str, sort: types.SortType = types.SortType.DATE
) -> JSONResponse:
    result = core.find_random_book(session, query, sort)
    if not result:
        return JSONResponse(dict(status_code=500))
    return JSONResponse(result.model_dump())

