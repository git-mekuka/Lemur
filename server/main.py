from fastapi import FastAPI, HTTPException, Response, Request # type: ignore
from fastapi.responses import HTMLResponse, RedirectResponse # type: ignore
from fastapi.middleware.cors import CORSMiddleware # type: ignore
from fastapi.staticfiles import StaticFiles # type: ignore

from pydantic import BaseModel # type: ignore

from colorama import Fore, Style

from database import login_status, edit_events, get_events_metrics, get_user_permission, get_users_data_db, delete_user_db

from datetime import datetime, timedelta
import time
import secrets
import os
import urllib.request
import urllib.error
import json

with open('\Lemur\config.json', 'r', encoding='utf-8') as file:
    config_data = json.load(file)

site_url = config_data["site"]["URL"]
session_max_age_seconds = config_data.get("auth", {}).get("session_max_age_seconds", 3600)

app = FastAPI()
app.mount("/static", StaticFiles(directory="../entrance"), name="static")
app.mount("/app/static", StaticFiles(directory="../app"), name="app-static")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # В продакшене замените на конкретные домены
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def load_html(file_name):
    with open(file_name, "r", encoding="utf-8") as file: 
        return file.read()

@app.get("/", summary="Получение сайта авторизации.", tags=["Entrance"])
def entarnce():
    return HTMLResponse(load_html("../entrance/entrance.html"))

@app.get("/app", summary="Получение админ панели.", tags=["App"])
def entarnce_in_app():
    return HTMLResponse(load_html("../app/app.html"))

class AdminData(BaseModel):
    username: str
    password: str

sessions = {}

@app.post("/api/login", summary="Вход в приложение.", tags=["Entrance"])
def login(admin_data: AdminData, response: Response):

    if login_status(admin_data.username, admin_data.password) == True:
        create_session(admin_data.username)
        for session in sessions:
            if sessions[session]["user"] == f"{admin_data.username}":
                token = session
        response.set_cookie(
            key="token", 
            value=f"{token}", 
            max_age=session_max_age_seconds,
            httponly=True,
            samesite="lax"
        )
        print(Style.BRIGHT + Fore.LIGHTGREEN_EX + "Lemur [Main]:" + Style.RESET_ALL + " Вход успешен!")

    else:
        print(Style.BRIGHT + Fore.LIGHTRED_EX +"Lemur [Main]:" + Style.RESET_ALL + " Неверный логин или пароль.")
        raise HTTPException(status_code = 400, detail = "Неверный логин или пароль.")

class EventData(BaseModel):
    event: str
    date: str
    time: str
    timezoneOffset: str
    device: str
    countryCode: str
    region: str
    browser: str
    trafficSource: str

@app.post("/api/events", summary="Отправление события", tags=["Data"])
def post_events(event_data: EventData):
    
    try:
        edit_events(event_data.event, event_data.date, event_data.time, event_data.timezoneOffset, event_data.device, event_data.countryCode, event_data.region, event_data.browser, event_data.trafficSource)
        print(Style.BRIGHT + Fore.LIGHTGREEN_EX + "Lemur [Main]:" + Style.RESET_ALL + " Отправлены данные в базу данных > events" + Style.RESET_ALL)
    except:
        print(Style.BRIGHT + Fore.LIGHTRED_EX +"Lemur [Main]:" + Style.RESET_ALL + " Не удалось отправить данные в базу данных > events")

class FilterData(BaseModel):
    monthFilter: str
    yearFilter: str

@app.post("/api/events/metrics", summary="Получение метрик события", tags=["Data"])
def get_events(filter_data: FilterData):
    try:
        if filter_data.yearFilter != 'none' and filter_data.monthFilter != 'none':
            data = [get_events_metrics('clickButton', filter_data.monthFilter, filter_data.yearFilter),
                    get_events_metrics('eventSiteEntry', filter_data.monthFilter, filter_data.yearFilter),
                    get_events_metrics('clickLink', filter_data.monthFilter, filter_data.yearFilter)]
        elif filter_data.monthFilter != 'none':
            data = [get_events_metrics('clickButton', filter_data.monthFilter),
                    get_events_metrics('eventSiteEntry', filter_data.monthFilter),
                    get_events_metrics('clickLink', filter_data.monthFilter)]
        elif filter_data.yearFilter != 'none':
            data = [get_events_metrics('clickButton', year=filter_data.yearFilter),
                    get_events_metrics('eventSiteEntry', year=filter_data.yearFilter),
                    get_events_metrics('clickLink', year=filter_data.yearFilter)]
        else:
            data = [get_events_metrics('clickButton'),
                    get_events_metrics('eventSiteEntry'),
                    get_events_metrics('clickLink')]
        print(Style.BRIGHT + Fore.LIGHTGREEN_EX + "Lemur [Main]:" + Style.RESET_ALL + " Метрики успешно получены!" + Style.RESET_ALL)
        return data
    except:
        print(Style.BRIGHT + Fore.LIGHTRED_EX + "Lemur [Main]:" + Style.RESET_ALL + " Не удалось получить метрики" + Style.RESET_ALL)

def create_session(user):
    global sessions

    token = secrets.token_urlsafe(32)
    start = datetime.now()
    end = (start + timedelta(seconds=session_max_age_seconds)).strftime("%d.%m.%Y %H:%M")
    start = start.strftime("%d.%m.%Y %H:%M")

    for session in sessions:
        if sessions[session].get("user") == user:
            del sessions[session]
            break
        
    sessions[token] = {
        "user": user,
        "start": start,
        "end": end
    }

@app.get("/api/sessionUser", summary="Имя пользователя", tags=["Data"])
def postSessionUser(request: Request):
    token = request.cookies.get("token")

    if sessions[token]:
        return {"user": sessions[token]["user"]}
    else:
        return {"user": "Undefined"}

@app.get("/api/check_status")
def get_site_status():
    global site_url
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        }
        req = urllib.request.Request(site_url, headers = headers)
        
        with urllib.request.urlopen(req, timeout=5) as response:
            if response.status == 200:
                return "Online"
            else:
                return "Offline"
                
    except urllib.error.HTTPError:
        return "Offline"
    
    except urllib.error.URLError:
        return "Offline (Server Down)"
    
    except:
         return "Undefined"

@app.get("/api/check_TTFB")
def get_site_TTFB():
    global site_url
    start_time = time.time()

    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        }
        req = urllib.request.Request(site_url, headers = headers)
        
        with urllib.request.urlopen(req, timeout=5) as response:
            if response:
                end_time = time.time()
                response_time_ms = (end_time - start_time) * 1000
                return round(response_time_ms, 2)
    except:
        return "--"

@app.get("/api/site_data") 
def get_data():
    site_data = {
        "URL": site_url,
        "status": get_site_status(),
        "TTFB": get_site_TTFB(),
    }
    return site_data    

@app.get("/api/client_ip")
def get_ip(request: Request):
    client_ip = request.client.host
    return client_ip

@app.delete("/api/exitSession")
def exit_session(response: Response, request: Request):
    token = request.cookies.get("token")
    del sessions[token]
    response.delete_cookie("token")

@app.get("/api/userData")
def get_user_data(request: Request):
    user = sessions[request.cookies.get("token")]["user"]
    permission = get_user_permission(user)

    user_data = {
        "user": user,
        "permission": permission
    }
    return user_data

@app.get("/api/usersData")
def get_users_data():
    users_data = get_users_data_db()

    return users_data

class Id(BaseModel):
    id: str

@app.delete("/api/deleteUser")
def delete_user(id: Id, request: Request):
    if get_user_permission(sessions[request.cookies.get("token")]["user"]) == "admin":
        raise HTTPException(status_code=403, detail="Deleting users requires the 'owner' role")
    elif get_user_permission(sessions[request.cookies.get("token")]["user"]) == "owner":
        if id.id == "1":
            raise HTTPException(status_code=403, detail="You cannot delete the owner user")
        else:
            result = delete_user_db(id.id)
            if result == "200":
                raise HTTPException(status_code=200, detail="User deleted successfully")
            else:        
                raise HTTPException(status_code=400, detail="Failed to delete user")
    else:
        raise HTTPException(status_code=401, detail="User not found")

@app.middleware("http")
async def test(request: Request, call_next):
    path = request.url.path
    token = request.cookies.get("token")
    is_true_token = False

    for session in sessions:
        if session == token:
            is_true_token = True 

    if is_true_token and (path == ("/")):
        print(Style.BRIGHT + Fore.LIGHTGREEN_EX + "Lemur [Main]:" + Style.RESET_ALL + " Токен подтвержден, переадресация на /app" + Style.RESET_ALL)
        return RedirectResponse(url="/app")

    if path == ("/app") and (is_true_token == False):
        print(Style.BRIGHT + Fore.LIGHTRED_EX + "Lemur [Main]:" + Style.RESET_ALL + " Токен не подтвержден или не найден, переадресация на /" + Style.RESET_ALL)
        return RedirectResponse(url="/")
    else:
        return await call_next(request)

os.system('cls')
