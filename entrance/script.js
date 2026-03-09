const LEMUR_SITE_URL = "http://127.0.0.1:8000"

let loginUsernameInput = document.getElementById("login-username");
let loginPasswordInput = document.getElementById("login-password");
let loginStatus = document.getElementById("login-status")
let loginView = document.getElementById("login-view")

window.onload = () => loginView.classList.replace("login-view-hidden", "login-view-visible");

async function getEntranceData(){
    let adminData = {
        username: loginUsernameInput.value,
        password: loginPasswordInput.value
    };

    let result = await makeRequest(`${LEMUR_SITE_URL}/login`, "POST", {"Content-Type": "application/json"}, adminData);
    if(result.status == 200){
        window.location.href = `${LEMUR_SITE_URL}/app`;
    }
    if(result.status == 400){
        loginStatus.classList.replace("login-status-hidden", "login-status-visible");
        loginPasswordInput.value = "";
    }
}
async function makeRequest(url, method, headers, bodyData) {
    let result = await fetch(url, {
    method: method,
    headers: headers,
    body: JSON.stringify(bodyData)
    });
    return result;
}

// (() => {
//     // Получаем текущий хост (IP или localhost)
//     const hostname = window.location.hostname;  // 127.0.0.1 или 192.168.31.135
//     const port = '8000';  // Ваш реальный порт Uvicorn
    
//     console.log(`http://${hostname}:${port}`)
//     return `http://${hostname}:${port}`;
// })();