# Импорты библиотек для проекта Lemur

# FastAPI и связанные модули
from fastapi import FastAPI, HTTPException, Response, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

# Pydantic
from pydantic import BaseModel

# Colorama для цветного вывода
from colorama import Fore, Style

# Дата и время
from datetime import datetime, date, timedelta

# Стандартные библиотеки
import secrets
import os
import time

# urllib для HTTP запросов
import urllib.request
import urllib.error

# PostgreSQL
import psycopg2
import psycopg2.extras
