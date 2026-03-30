import psycopg2 # type: ignore
import psycopg2.extras # type: ignore
from colorama import Fore, Style
from datetime import date
import json
import os
from argon2 import PasswordHasher # type: ignore
from dotenv import load_dotenv # type: ignore


ph = PasswordHasher()

# загружаем переменные из .env
load_dotenv()

# получаем строку подключения
DATABASE_URL = os.getenv("DATABASE_URL")

# подключаемся к базе
connection = psycopg2.connect(DATABASE_URL)

def login_status(login, password):
    cursor = connection.cursor()
    cursor.execute("SELECT password FROM admins WHERE login = %s", (login,))
    hash = cursor.fetchone()

    if hash is None:
        print(Fore.BLUE + Style.BRIGHT +"Lemur [DataBase]:" + Fore.RESET + Style.RESET_ALL + " Логин-статус получен, значение " + Fore.RESET + Style.BRIGHT + Fore.LIGHTBLUE_EX + "False" + Style.RESET_ALL)
        return False

    connection.commit()
    cursor.close()

    try:
        ph.verify(hash[0], password)
        print(Fore.BLUE + Style.BRIGHT +"Lemur [DataBase]:" + Fore.RESET + Style.RESET_ALL + " Логин-статус получен, значение " + Fore.RESET + Style.BRIGHT + Fore.LIGHTBLUE_EX + "True" + Style.RESET_ALL)
        return True
    except:
        print(Fore.BLUE + Style.BRIGHT +"Lemur [DataBase]:" + Fore.RESET + Style.RESET_ALL + " Логин-статус получен, значение " + Fore.RESET + Style.BRIGHT + Fore.LIGHTBLUE_EX + "False" + Style.RESET_ALL)
        return False

def new_admin(login, password):
    cursor = connection.cursor()
    cursor.execute("SELECT user_id FROM admins")
    id = len(cursor.fetchall()) + 1
    
    cursor.execute("SELECT login FROM admins")
    check_login = cursor.fetchall()
    cortege_login = [(f"{login}",)]

    if cortege_login[0] in check_login:
        print(Fore.LIGHTRED_EX + Style.BRIGHT +"Lemur [DataBase]:" + Fore.RESET + Style.RESET_ALL + " Администратор с таким логином уже существует!\n")
        return "400"
    else:
        try:
            password = ph.hash(password)
            cursor.execute("INSERT INTO admins VALUES(%s, %s, %s, %s)", (id, login, password, "admin"))
            connection.commit()
            print(Fore.BLUE + Style.BRIGHT +"Lemur [DataBase]:" + Fore.RESET + Style.RESET_ALL + " Успешно создан администратор:" + Style.DIM + f"\n LOGIN: {login}\n PASSWORD: {password}\n ID: {id}\n")
            return "200"
        except Exception as e:
            print(Fore.LIGHTRED_EX + Style.BRIGHT +"Lemur [DataBase]:" + Fore.RESET + Style.RESET_ALL + f" Не удалось создать нового администратора. Ошибка: {e}")
            connection.rollback()
            return "400"
        finally:
            cursor.close()


def edit_events(event, date, time, timezoneOffset, device, countryCode, region, browser, trafficSource):
    cursor = connection.cursor()
    
    # Формируем строку даты правильно
    if int(timezoneOffset) > 0:
        offset_str = f"+{timezoneOffset}"
    else:
        offset_str = timezoneOffset  # уже должно быть с минусом
    
    date_string = f"{date} {time}{offset_str}"
    
    try:
        cursor.execute(
            "INSERT INTO events VALUES (%s, %s, %s, %s, %s, %s, %s)", 
            (event, date_string, device, countryCode, region, browser, trafficSource)
        )
        print(Fore.BLUE + Style.BRIGHT + "Lemur [DataBase]:" + Fore.RESET + Style.RESET_ALL + " Успешный запрос в базу данных")
    except Exception as e:
        print(Fore.LIGHTRED_EX + Style.BRIGHT + "Lemur [DataBase]:" + Fore.RESET + Style.RESET_ALL + f" Не удалось выполнить запрос в базу данных. Ошибка: {e}")
        connection.rollback()  # ← важно откатить при ошибке!
        raise  # ← пробросить ошибку дальше, чтобы клиент узнал о проблеме
    else:
        connection.commit()
    finally:
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

            cursor.execute("""SELECT
                                browser,
                                COUNT(*) AS count
                            FROM events
                            WHERE
                                event = 'eventSiteEntry'
                                AND browser IS NOT NULL
                                AND EXTRACT(MONTH FROM date) = %s
                                AND EXTRACT(YEAR FROM date) = %s
                            GROUP BY
                                browser;""", (month, year))
            browserList = cursor.fetchall()

            cursor.execute("""SELECT
                                traffic_source,
                                COUNT(*) AS count
                            FROM events
                            WHERE
                                event = 'eventSiteEntry'
                                AND traffic_source IS NOT NULL
                                AND EXTRACT(MONTH FROM date) = %s
                                AND EXTRACT(YEAR FROM date) = %s
                            GROUP BY
                                traffic_source;""", (month, year))
            trafficSourceList = cursor.fetchall()

            direct = 0
            referral = 0
            internal = 0

            for source, cnt in trafficSourceList:
                if source == 'direct':
                    direct = cnt
                elif source == 'referral':
                    referral = cnt
                elif source == 'internal':
                    internal = cnt


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
                "regionList": regionList,
                "browserList": browserList,
                "direct": direct,
                "referral": referral,
                "internal": internal
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
    finally:
        cursor.close()

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
    finally:
        cursor.close()

def get_users_data_db():
    cursor = connection.cursor()

    cursor.execute('SELECT "user_id","login","permission" FROM admins ORDER BY user_id ASC')
    data = cursor.fetchall()

    cursor.close()
    print(Fore.BLUE + Style.BRIGHT +"Lemur [DataBase]:" + Fore.RESET + Style.RESET_ALL + " Успешный запрос в базу данных")

    return data

    
def delete_user_db(user_id):
    cursor = connection.cursor()

    try:
        cursor.execute("DELETE FROM admins WHERE user_id = %s", (user_id,))
        connection.commit()
        return "200"
    except Exception as e:
        print(Fore.LIGHTRED_EX + Style.BRIGHT +"Lemur [DataBase]:" + Fore.RESET + Style.RESET_ALL + f" Не удалось выполнить запрос в базу данных. Ошибка: {e}")
        connection.rollback()
        return "400"
    finally:
        cursor.close()

def edit_password_db(user, new_password):
    cursor = connection.cursor()
    new_password = ph.hash(new_password)
    try:
        cursor.execute("UPDATE admins SET password = %s WHERE login = %s", (new_password, user))
        connection.commit()
        return "200"
    except Exception as e:
        print(Fore.LIGHTRED_EX + Style.BRIGHT +"Lemur [DataBase]:" + Fore.RESET + Style.RESET_ALL + f" Не удалось выполнить запрос в базу данных. Ошибка: {e}")
        connection.rollback()
        return "400"
    finally:
        cursor.close()


def edit_login_db(user, new_login):
    cursor = connection.cursor()

    try:
        cursor.execute("UPDATE admins SET login = %s WHERE login = %s", (new_login, user))
        connection.commit()
        return "200"
    except Exception as e:
        print(Fore.LIGHTRED_EX + Style.BRIGHT +"Lemur [DataBase]:" + Fore.RESET + Style.RESET_ALL + f" Не удалось выполнить запрос в базу данных. Ошибка: {e}")
        connection.rollback()
        return "400"
    finally:        
        cursor.close()