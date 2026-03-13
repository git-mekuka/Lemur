import uvicorn # type: ignore
import json
import os

config_path = os.path.join(os.path.dirname(__file__), '..', 'config.json')
with open(config_path, 'r', encoding='utf-8') as file:
    config = json.load(file)

uvicorn_config = config['uvicorn']

if __name__ == '__main__':
    uvicorn.run(
        uvicorn_config['app'],
        host=uvicorn_config['host'],
        port=uvicorn_config['port'],
        workers=uvicorn_config['workers'],
        reload=uvicorn_config['reload'],
        log_level=uvicorn_config['log_level'],
        access_log=uvicorn_config['access_log']
    )