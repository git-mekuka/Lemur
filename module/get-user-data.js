const LEMUR_SITE_URL = "http://127.0.0.1:8000"

async function postEvent(eventType){
  let eventData = null;
  let dateData = new Date();

  if (eventType == "eventSiteEntry"){
    let location = await getGeolocation();
    eventData = {
      event: eventType,
      date: dateData.getDate() + "." + (dateData.getMonth() + 1) + "." + dateData.getFullYear(),
      time: dateData.getHours() + ":" + dateData.getMinutes() + ":" + dateData.getSeconds(),
      timezoneOffset: String(dateData.getTimezoneOffset() / (-60)),
      device: getDevice(),
      countryCode: location.countryCode,
      region: location.region,
    }
  }
  else{
    eventData = {
      event: eventType,
      date: dateData.getDate() + "." + (dateData.getMonth() + 1) + "." + dateData.getFullYear(),
      time: dateData.getHours() + ":" + dateData.getMinutes() + ":" + dateData.getSeconds(),
      timezoneOffset: String(dateData.getTimezoneOffset() / (-60)),
      device: getDevice(),
      countryCode: "[null]",
      region: "[null]",
    }
  }
 
  console.log(eventData)
  makeRequest(`${LEMUR_SITE_URL}/events`, "POST", {"Content-Type": "application/json"}, eventData);
}

function getDevice(){
  const userAgent = navigator.userAgent;

  const isSmartphone = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  const isTablet = /iPad|Tablet|Tab|Kindle|Silk/i.test(userAgent);
  const isDesktop = /Windows NT|Macintosh|Mac OS X|Linux x86_64|WOW64|Win64/i.test(userAgent);
  const isOther = !isSmartphone && !isTablet && !isDesktop;

  let devices = {
    smartphone: isSmartphone,
    tablet: isTablet,
    desktop: isDesktop,
    otherDevice: isOther
  }

  for (device in devices){
    if (devices[device]){
      return device;
    }
  } 
}

async function getIp(){
  let result = await makeRequest(`${LEMUR_SITE_URL}/client_ip`, "GET", {"Content-Type": "application/json"});
  let ip = await result.json();
  return ip;
}

async function getGeolocation() {
  result = await makeRequest(`http://ip-api.com/json/${"212.94.18.0"}`, "GET", {"Content-Type": "application/json"});
  geolocation = await result.json();

  let country = null
  let region = null

  if (geolocation.status == "fail" ){
    return {country: country, region: region}
  }
  else if (geolocation.status == "success" ){
    countryCode = geolocation.countryCode
    region = geolocation.region
  }

  return {countryCode: countryCode, region: region};
}

async function makeRequest(url, method, headers, bodyData = 0) {
  if (bodyData != 0){
    let result = await fetch(url, {
    method: method,
    headers: headers,
    body: JSON.stringify(bodyData)
    });
    return result;
  }
  else{
    let result = await fetch(url, {
    method: method,
    headers: headers
    });
    return result;    
  }
}

postEvent('eventSiteEntry')