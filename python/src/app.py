import os
from typing import Any, Dict

from fastapi import FastAPI
from fastapi.responses import JSONResponse
from .endpoints.status import check_status
from .endpoints.health import check_health
from .endpoints.db_query import db_query as run_db_query
from .endpoints.db_insert import db_insert as run_db_insert
from .endpoints.db_update import db_update as run_db_update
from .endpoints.db_delete import db_delete as run_db_delete
from .endpoints.db_nl_query import db_nl_query as run_db_nl_query
from .endpoints.flows_trigger_json import trigger_flow_json as run_trigger_flow_json
from .endpoints.flows_metrics import get_flows_metrics as run_get_flows_metrics
from .endpoints.flows_file import (
    trigger_flow_with_file as run_trigger_flow_with_file,
    trigger_flow_with_url as run_trigger_flow_with_url,
)
app = FastAPI(title="WorqHat Python Examples")


@app.get("/status")
def status() -> Any:
    try:
        return JSONResponse(content=check_status())
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@app.get("/health")
def health() -> Any:
    try:
        return JSONResponse(content=check_health())
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@app.get("/db/query")
def db_query() -> Any:
    try:
        query = "SELECT * FROM customer_management_data WHERE customer_type = 'individual' LIMIT 10"
        return JSONResponse(content=run_db_query(query))
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@app.get("/db/insert")
def db_insert() -> Any:
    try:
        return JSONResponse(content=run_db_insert())
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@app.get("/db/update")
def db_update() -> Any:
    try:
        return JSONResponse(content=run_db_update())
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@app.get("/db/delete")
def db_delete() -> Any:
    try:
        return JSONResponse(content=run_db_delete())
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@app.get("/db/nl-query")
def db_nl_query() -> Any:
    try:
        return JSONResponse(content=run_db_nl_query())
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@app.get("/flows/trigger-json")
def flows_trigger_json() -> Any:
    try:
        return JSONResponse(content=run_trigger_flow_json())
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@app.get("/flows/metrics")
def flows_metrics() -> Any:
    try:
        return JSONResponse(content=run_get_flows_metrics())
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@app.get("/flows/file-url")
def flows_file_url() -> Any:
    try:
        return JSONResponse(content=run_trigger_flow_with_url())
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@app.get("/flows/file-upload")
def flows_file_upload() -> Any:
    try:
        # Place an image at python/src/image.png to test file upload
        return JSONResponse(content=run_trigger_flow_with_file())
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
