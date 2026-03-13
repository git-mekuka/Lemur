import psycopg2 # type: ignore
import psycopg2.extras # type: ignore
from colorama import Fore, Style
from datetime import date
import json
import os

# Загрузка конфигурации из config.json
config_path = os.path.join(os.path.dirname(__file__), '..', 'config.json')
with open(config_path, 'r', encoding='utf-8') as f:
    config = json.load(f)

db_config = config['database']
db_config['port'] = int(db_config['port'])

connection = psycopg2.connect(**db_config)

def login_status(login, password):
    cursor = connection.cursor()
    cursor.execute("SELECT login, password FROM admins WHERE login = %s AND password = %s", (login, password))
    status =  bool(len(cursor.fetchall()))

    connection.commit()
    cursor.close()
    
    if status == True:
        print(Fore.BLUE + Style.BRIGHT +"Lemur [DataBase]:" + Fore.RESET + Style.RESET_ALL + " Логин-статус получен, значение " + Fore.RESET + Style.BRIGHT + Fore.LIGHTBLUE_EX + f"{status}" + Style.RESET_ALL)
        return True
    else:
        print(Fore.BLUE + Style.BRIGHT +"Lemur [DataBase]:" + Fore.RESET + Style.RESET_ALL + " Логин-статус получен, значение " + Fore.RESET + Style.BRIGHT + Fore.LIGHTBLUE_EX + f"{status}" + Style.RESET_ALL)
        return False

def new_admin(login, password):
    cursor = connection.cursor()
    cursor.execute("SELECT id FROM admins")
    id = len(cursor.fetchall()) + 1
    
    cursor.execute("SELECT login FROM admins")
    check_login = cursor.fetchall()
    cortege_login = [(f"{login}",)]

    if cortege_login[0] in check_login:
        print(Fore.LIGHTRED_EX + Style.BRIGHT +"Lemur [DataBase]:" + Fore.RESET + Style.RESET_ALL + " Администратор с таким логином уже существует!\n")
    else:
        try:
            cursor.execute("INSERT INTO admins VALUES(%s, %s, %s)", (id, login, password))
            print(Fore.BLUE + Style.BRIGHT +"Lemur [DataBase]:" + Fore.RESET + Style.RESET_ALL + " Успешно создан администратор:" + Style.DIM + f"\n LOGIN: {login}\n PASSWORD: {password}\n ID: {id}\n")
        except:
            print(Fore.LIGHTRED_EX + Style.BRIGHT +"Lemur [DataBase]:" + Fore.RESET + Style.RESET_ALL + " Не удалось создать нового администратора")

    connection.commit()
    cursor.close()

def edit_events(event, date, time, timezoneOffset, device, countryCode, region):
    cursor = connection.cursor()
    try:
        cursor.execute("INSERT INTO events VALUES (%s, %s, %s, %s, %s)", (event, f"{date} {time} {"+" if int(timezoneOffset) > 0 else ""}{timezoneOffset}", device, countryCode, region))
        print(Fore.BLUE + Style.BRIGHT +"Lemur [DataBase]:" + Fore.RESET + Style.RESET_ALL + " Успешный запрос в базу данных")
    except:
        print(Fore.LIGHTRED_EX + Style.BRIGHT +"Lemur [DataBase]:" + Fore.RESET + Style.RESET_ALL + " Не удалось выполнить запрос в базу данных")
    
    connection.commit()
    cursor.close()

def get_events_metrics(event, month = date.today().month, year = date.today().year):
    cursor = connection.cursor(cursor_factory=psycopg2.extras.DictCursor)
    try:
        target_months = [1, 3, 5, 7, 8, 10, 12]
        day_metrics = []
        day = []
        metrics = []
        if int(month) in target_months:
            days = 31
        elif int(month) == 2:
            days = 28
        else:
            days = 30
        
        for i in range(1, days + 1):
            day.append(i)
            metrics.append(0)

        cursor.execute("""SELECT 
                            date::date as day, 
                            COUNT(*) as event_count
                        FROM events 
                        WHERE 
                            event = %s 
                            AND EXTRACT(MONTH FROM date) = %s
                            AND EXTRACT(YEAR FROM date) = %s
                        GROUP BY date::date
                        ORDER BY day """, 
        (event, month, year))
        date_metrics_data = cursor.fetchall()
        for i in range(len(date_metrics_data)):
            day_metrics.append([int(str(date_metrics_data[i][0]).split("-")[2]), int(date_metrics_data[i][1])])
        
        for i in range(len(day_metrics)):
            metrics[day_metrics[i][0] - 1] = day_metrics[i][1]

        if event == "eventSiteEntry":
            last_month = int(month)
            last_year = int(year)
            if last_month == 1:
                last_month = 12
                last_year = last_year - 1 
            else:
                last_month = last_month - 1
            cursor.execute("""SELECT 
                                COUNT(*) as event_count
                            FROM events 
                            WHERE 
                                event = 'eventSiteEntry'
                                AND EXTRACT(MONTH FROM date) = %s
                                AND EXTRACT(YEAR FROM date) = %s""",
            (last_month, last_year))
            last_month_metrics = cursor.fetchall()[0][0]
            if last_month_metrics == 0:
                if sum(metrics) > 0:
                    growth = 100
                else:
                    growth = 0
            else:
                growth = round(((sum(metrics) - last_month_metrics) / last_month_metrics)*100, 1)

            cursor.execute("""SELECT 
                                device, COUNT(*) AS device_count 
                            FROM events 
                            WHERE 
                                event = 'eventSiteEntry'
                                AND device IS NOT NULL
                                AND EXTRACT(MONTH FROM date) = %s
                                AND EXTRACT(YEAR FROM date) = %s
                            GROUP BY device""", (month, year))
            devices = cursor.fetchall()

            smartphone = 0
            desktop = 0
            tablet = 0
            other_device = 0

            for device_name, count in devices:
                if device_name == 'smartphone':
                    smartphone = count
                elif device_name == 'desktop':
                    desktop = count
                elif device_name == 'tablet':
                    tablet = count
                else:
                    other_device += count

            cursor.execute("""SELECT 
                                country_code,
                                COUNT(*) AS count
                            FROM events 
                            WHERE 
                                event = 'eventSiteEntry'
                                AND country_code IS NOT NULL
                                AND EXTRACT(MONTH FROM date) = %s
                                AND EXTRACT(YEAR FROM date) = %s
                            GROUP BY 
                                country_code""", (month, year))
            countryList = cursor.fetchall()

            cursor.execute("""SELECT 
                                region,
                                COUNT(*) AS count
                            FROM events 
                            WHERE 
                                event = 'eventSiteEntry'
                                AND region IS NOT NULL
                                AND country_code = 'RU'
                                AND EXTRACT(MONTH FROM date) = %s
                                AND EXTRACT(YEAR FROM date) = %s
                            GROUP BY 
                                region""", (month, year))
            regionList = cursor.fetchall()

            event_data = {
                "event": event,
                "day": day,
                "metrics": metrics,
                "metricsSum": sum(metrics),
                "growth": growth,
                "smartphone": smartphone,
                "desktop": desktop,
                "tablet": tablet,
                "otherDevice": other_device,
                "countryList": countryList,
                "regionList": regionList
            }
        else:
            event_data = {
                "event": event,
                "day": day,
                "metrics": metrics,
                "metricsSum": sum(metrics)
            }

        print(Fore.BLUE + Style.BRIGHT +"Lemur [DataBase]:" + Fore.RESET + Style.RESET_ALL + " Успешный запрос в базу данных")
        return event_data
    except Exception as e:
        print(Fore.LIGHTRED_EX + Style.BRIGHT +"Lemur [DataBase]:" + Fore.RESET + Style.RESET_ALL + f" Не удалось выполнить запрос в базу данных. Ошибка: {e}")

def get_user_permission(user):
    cursor = connection.cursor()

    try:
        cursor.execute("SELECT permission FROM admins WHERE login = %s", (user,))
        permission = cursor.fetchone()
        if permission:
            permission = permission[0]
        print(Fore.BLUE + Style.BRIGHT +"Lemur [DataBase]:" + Fore.RESET + Style.RESET_ALL + " Успешный запрос в базу данных")
        return permission
    except Exception as e:
        print(Fore.LIGHTRED_EX + Style.BRIGHT +"Lemur [DataBase]:" + Fore.RESET + Style.RESET_ALL + f" Не удалось выполнить запрос в базу данных. Ошибка: {e}")
        return "undefined"

def get_users_data_db():
    cursor = connection.cursor()

    cursor.execute('SELECT "user_id","login","permission" FROM admins')
    data = cursor.fetchall()
    
    return data