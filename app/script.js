const LEMUR_SITE_URL = window.location.origin

let visitMetrics = document.getElementById("visitMetrics");
let clickButtonsMetrics = document.getElementById("clickButtonsMetrics");
let clickLinksMetrics = document.getElementById("clickLinksMetrics");
let adminsHereTag = document.getElementById("adminsHereTag");
let analyticsHereTag = document.getElementById("analyticsHereTag");
let analyticsSection = document.getElementById("analyticsSections");
let adminsSections = document.getElementById("adminsSections");
let dataFilter = document.getElementById("dataFilter");
let sessionUser = document.getElementById("sessionUser");
let adminsList = document.getElementById("adminsList");
let monthInput = document.getElementById("monthInput");
let yearInput = document.getElementById("yearInput");
let choiceMonth = document.getElementById("choiceMonth");
let choiceMonthIcon = document.getElementById("choiceMonthIcon");
let choiceMonthPoint = document.getElementsByClassName("month");
let chooseTag = document.getElementById("chooseTag");
let profile = document.getElementById("profile");
let siteUrl = document.getElementById("siteUrl");
let siteStatus = document.getElementById("siteStatus");
let TTFB = document.getElementById("TTFB");
let onlineIcon = document.getElementById("onlineIcon");
let newCategory = document.getElementById("newCategory");
let patternCategory = document.getElementById("patternCategory");
let newCategoryInputRadio = document.getElementById("newCategoryInputRadio");
let patternCategoryInputRadio = document.getElementById("patternCategoryInputRadio",);
let categoryName = document.getElementById("categoryName");
let categoryDescription = document.getElementById("categoryDescription");
let pattern = document.getElementsByClassName("pattern");
let errorNotFilled = document.getElementById("errorNotFilled");
let errorPatternNotFound = document.getElementById("errorPatternNotFound");
let createCategoryMenu = document.getElementById("createCategoryMenu");
let visitGrowth = document.getElementById("visitGrowth");
let deviceSmartphone = document.getElementById("deviceSmartphone");
let deviceDesktop = document.getElementById("deviceDesktop");
let deviceTablet = document.getElementById("deviceTablet");
let deviceOther = document.getElementById("deviceOther");
let notFound1 = document.getElementById("notFound1");
let notFound2 = document.getElementById("notFound2");
let regionListContainer = document.getElementById("regionListContainer");
let countryListContainer = document.getElementById("countryListContainer");
let map = document.getElementById("map");
let deviceSmartphonePrecent = document.getElementById("deviceSmartphonePrecent");
let deviceDesktopPrecent = document.getElementById("deviceDesktopPrecent");
let deviceTabletPrecent = document.getElementById("deviceTabletPrecent");
let deviceOtherPrecent = document.getElementById("deviceOtherPrecent");
let choiceMonthScore = 0;
let profileScore = 0;
let createCategoryScore = 0;
let choosenMonth;
let choosenPattern;
let siteUser;

const allCountries = {
  // А
  AF: "Афганистан",
  AL: "Албания",
  DZ: "Алжир",
  AS: "Американское Самоа",
  AD: "Андорра",
  AO: "Ангола",
  AI: "Ангилья",
  AQ: "Антарктида",
  AG: "Антигуа и Барбуда",
  AR: "Аргентина",
  AM: "Армения",
  AW: "Аруба",
  AU: "Австралия",
  AT: "Австрия",
  AZ: "Азербайджан",

  // Б
  BS: "Багамские Острова",
  BH: "Бахрейн",
  BD: "Бангладеш",
  BB: "Барбадос",
  BY: "Беларусь",
  BE: "Бельгия",
  BZ: "Белиз",
  BJ: "Бенин",
  BM: "Бермудские Острова",
  BT: "Бутан",
  BO: "Боливия",
  BQ: "Бонайре, Синт-Эстатиус и Саба",
  BA: "Босния и Герцеговина",
  BW: "Ботсвана",
  BV: "Остров Буве",
  BR: "Бразилия",
  IO: "Британская территория в Индийском океане",
  BN: "Бруней-Даруссалам",
  BG: "Болгария",
  BF: "Буркина-Фасо",
  BI: "Бурунди",

  // В
  CV: "Кабо-Верде",
  KH: "Камбоджа",
  CM: "Камерун",
  CA: "Канада",
  KY: "Острова Кайман",
  CF: "Центральноафриканская Республика",
  TD: "Чад",
  CL: "Чили",
  CN: "Китай",
  CX: "Остров Рождества",
  CC: "Кокосовые острова",
  CO: "Колумбия",
  KM: "Коморы",
  CD: "Демократическая Республика Конго",
  CG: "Конго",
  CK: "Острова Кука",
  CR: "Коста-Рика",
  CI: "Кот-д'Ивуар",
  HR: "Хорватия",
  CU: "Куба",
  CW: "Кюрасао",
  CY: "Кипр",
  CZ: "Чехия",

  // Д
  DK: "Дания",
  DJ: "Джибути",
  DM: "Доминика",
  DO: "Доминиканская Республика",

  // Э
  EC: "Эквадор",
  EG: "Египет",
  SV: "Сальвадор",
  GQ: "Экваториальная Гвинея",
  ER: "Эритрея",
  EE: "Эстония",
  SZ: "Эсватини",
  ET: "Эфиопия",

  // Ф
  FK: "Фолклендские острова",
  FO: "Фарерские острова",
  FJ: "Фиджи",
  FI: "Финляндия",
  FR: "Франция",
  GF: "Французская Гвиана",
  PF: "Французская Полинезия",
  TF: "Французские Южные территории",

  // Г
  GA: "Габон",
  GM: "Гамбия",
  GE: "Грузия",
  DE: "Германия",
  GH: "Гана",
  GI: "Гибралтар",
  GR: "Греция",
  GL: "Гренландия",
  GD: "Гренада",
  GP: "Гваделупа",
  GU: "Гуам",
  GT: "Гватемала",
  GG: "Гернси",
  GN: "Гвинея",
  GW: "Гвинея-Бисау",
  GY: "Гайана",

  // Х
  HT: "Гаити",
  HM: "Остров Херд и острова Макдональд",
  VA: "Ватикан",
  HN: "Гондурас",
  HK: "Гонконг",
  HU: "Венгрия",

  // И
  IS: "Исландия",
  IN: "Индия",
  ID: "Индонезия",
  IR: "Иран",
  IQ: "Ирак",
  IE: "Ирландия",
  IM: "Остров Мэн",
  IL: "Израиль",
  IT: "Италия",

  // Я
  JM: "Ямайка",
  JP: "Япония",
  JE: "Джерси",
  JO: "Иордания",

  // К
  KZ: "Казахстан",
  KE: "Кения",
  KI: "Кирибати",
  KP: "КНДР",
  KR: "Республика Корея",
  KW: "Кувейт",
  KG: "Киргизия",

  // Л
  LA: "Лаос",
  LV: "Латвия",
  LB: "Ливан",
  LS: "Лесото",
  LR: "Либерия",
  LY: "Ливия",
  LI: "Лихтенштейн",
  LT: "Литва",
  LU: "Люксембург",

  // М
  MO: "Макао",
  MG: "Мадагаскар",
  MW: "Малави",
  MY: "Малайзия",
  MV: "Мальдивы",
  ML: "Мали",
  MT: "Мальта",
  MH: "Маршалловы Острова",
  MQ: "Мартиника",
  MR: "Мавритания",
  MU: "Маврикий",
  YT: "Майотта",
  MX: "Мексика",
  FM: "Микронезия",
  MD: "Молдова",
  MC: "Монако",
  MN: "Монголия",
  ME: "Черногория",
  MS: "Монтсеррат",
  MA: "Марокко",
  MZ: "Мозамбик",
  MM: "Мьянма",

  // Н
  NA: "Намибия",
  NR: "Науру",
  NP: "Непал",
  NL: "Нидерланды",
  NC: "Новая Каледония",
  NZ: "Новая Зеландия",
  NI: "Никарагуа",
  NE: "Нигер",
  NG: "Нигерия",
  NU: "Ниуэ",
  NF: "Остров Норфолк",
  MK: "Северная Македония",
  MP: "Северные Марианские острова",
  NO: "Норвегия",

  // О
  OM: "Оман",

  // П
  PK: "Пакистан",
  PW: "Палау",
  PS: "Государство Палестина",
  PA: "Панама",
  PG: "Папуа — Новая Гвинея",
  PY: "Парагвай",
  PE: "Перу",
  PH: "Филиппины",
  PN: "Острова Питкэрн",
  PL: "Польша",
  PT: "Португалия",
  PR: "Пуэрто-Рико",

  // К
  QA: "Катар",

  // Р
  RE: "Реюньон",
  RO: "Румыния",
  RU: "Россия",
  RW: "Руанда",

  // С
  BL: "Сен-Бартелеми",
  SH: "Острова Святой Елены, Вознесения и Тристан-да-Кунья",
  KN: "Сент-Китс и Невис",
  LC: "Сент-Люсия",
  MF: "Сен-Мартен",
  PM: "Сен-Пьер и Микелон",
  VC: "Сент-Винсент и Гренадины",
  WS: "Самоа",
  SM: "Сан-Марино",
  ST: "Сан-Томе и Принсипи",
  SA: "Саудовская Аравия",
  SN: "Сенегал",
  RS: "Сербия",
  SC: "Сейшельские Острова",
  SL: "Сьерра-Леоне",
  SG: "Сингапур",
  SX: "Синт-Мартен",
  SK: "Словакия",
  SI: "Словения",
  SB: "Соломоновы Острова",
  SO: "Сомали",
  ZA: "Южная Африка",
  GS: "Южная Георгия и Южные Сандвичевы острова",
  SS: "Южный Судан",
  ES: "Испания",
  LK: "Шри-Ланка",
  SD: "Судан",
  SR: "Суринам",
  SJ: "Шпицберген и Ян-Майен",
  SE: "Швеция",
  CH: "Швейцария",
  SY: "Сирия",

  // Т
  TW: "Тайвань",
  TJ: "Таджикистан",
  TZ: "Танзания",
  TH: "Таиланд",
  TL: "Восточный Тимор",
  TG: "Того",
  TK: "Токелау",
  TO: "Тонга",
  TT: "Тринидад и Тобаго",
  TN: "Тунис",
  TR: "Турция",
  TM: "Туркменистан",
  TC: "Теркс и Кайкос",
  TV: "Тувалу",

  // У
  UG: "Уганда",
  UA: "Украина",
  AE: "Объединенные Арабские Эмираты",
  GB: "Великобритания",
  UM: "Внешние малые острова США",
  US: "США",
  UY: "Уругвай",
  UZ: "Узбекистан",

  // В
  VU: "Вануату",
  VE: "Венесуэла",
  VN: "Вьетнам",
  VG: "Виргинские Острова (Великобритания)",
  VI: "Виргинские Острова (США)",

  // У
  WF: "Уоллис и Футуна",

  // Й
  EH: "Западная Сахара",

  // Й
  YE: "Йемен",

  // З
  ZM: "Замбия",
  ZW: "Зимбабве",

  // Аксленд (особые территории)
  AX: "Аландские острова",
};
const russianRegions = {
  // Республики
  AD: "Республика Адыгея",
  BA: "Республика Башкортостан",
  BU: "Республика Бурятия",
  AL: "Республика Алтай",
  DA: "Республика Дагестан",
  IN: "Республика Ингушетия",
  KB: "Кабардино-Балкарская Республика",
  KL: "Республика Калмыкия",
  KC: "Карачаево-Черкесская Республика",
  KR: "Республика Карелия",
  KO: "Республика Коми",
  CR: "Республика Крым",
  ME: "Республика Марий Эл",
  MO: "Республика Мордовия",
  SA: "Республика Саха (Якутия)",
  SE: "Республика Северная Осетия — Алания",
  TA: "Республика Татарстан",
  TY: "Республика Тыва",
  UD: "Удмуртская Республика",
  KK: "Республика Хакасия",
  CE: "Чеченская Республика",
  CU: "Чувашская Республика",

  // Края
  ALT: "Алтайский край",
  ZAB: "Забайкальский край",
  KAM: "Камчатский край",
  KRA: "Краснодарский край",
  KDA: "Краснодарский край", // альтернативный код
  KYA: "Красноярский край",
  PER: "Пермский край",
  PRI: "Приморский край",
  STA: "Ставропольский край",
  KHA: "Хабаровский край",

  // Области
  AMU: "Амурская область",
  ARK: "Архангельская область",
  AST: "Астраханская область",
  BEL: "Белгородская область",
  BRY: "Брянская область",
  VLA: "Владимирская область",
  VGG: "Волгоградская область",
  VLG: "Вологодская область",
  VOR: "Воронежская область",
  IVA: "Ивановская область",
  IRK: "Иркутская область",
  KGD: "Калининградская область",
  KLU: "Калужская область",
  KEM: "Кемеровская область",
  KIR: "Кировская область",
  KOS: "Костромская область",
  KGN: "Курганская область",
  KRS: "Курская область",
  LEN: "Ленинградская область",
  LIP: "Липецкая область",
  MAG: "Магаданская область",
  MOS: "Московская область",
  MUR: "Мурманская область",
  NIZ: "Нижегородская область",
  NGR: "Новгородская область",
  NVS: "Новосибирская область",
  OMS: "Омская область",
  ORE: "Оренбургская область",
  ORL: "Орловская область",
  PNZ: "Пензенская область",
  PSK: "Псковская область",
  ROS: "Ростовская область",
  RYA: "Рязанская область",
  SAM: "Самарская область",
  SAR: "Саратовская область",
  SAK: "Сахалинская область",
  SVE: "Свердловская область",
  SMO: "Смоленская область",
  TAM: "Тамбовская область",
  TVE: "Тверская область",
  TOM: "Томская область",
  TUL: "Тульская область",
  TYU: "Тюменская область",
  ULY: "Ульяновская область",
  CHE: "Челябинская область",
  YAR: "Ярославская область",

  // Города федерального значения
  MOW: "Москва",
  SPE: "Санкт-Петербург",
  SEV: "Севастополь",

  // Автономная область
  YEV: "Еврейская автономная область",

  // Автономные округа
  NEN: "Ненецкий автономный округ",
  KHM: "Ханты-Мансийский автономный округ — Югра",
  CHU: "Чукотский автономный округ",
  YAN: "Ямало-Ненецкий автономный округ",

  // Альтернативные/устаревшие коды (для обратной совместимости)
  TAT: "Республика Татарстан",
  YAR: "Ярославская область",
  NVS: "Новосибирская область",
  OMS: "Омская область",
  TVE: "Тверская область",
  TOM: "Томская область",
};

document.querySelectorAll("path[data-code]").forEach((path) => {
  const tip = tippy(path, {
    content: "", // пустой изначально
    placement: "top",
    theme: "dark",
    allowHTML: true,
  });

  // Можно сохранить ссылку в data-атрибут
  path._tippy = tip;
});

map.addEventListener("mouseover", (event) => {
  if (event.target != map) {
    const path = event.target;
    const code = path.getAttribute("data-code").replace("RU-", "");
    const value = document.getElementById(code);
    // Получаем экземпляр tippy для этого path
    const tip = path._tippy || tippy(path);
    if (value) {
      tip.setContent(
        `${russianRegions[code]}<br>${value.textContent} посещений`,
      );
    } else {
      tip.setContent(`${russianRegions[code]}<br>0 посещений`);
    }
  }
});

function setCategoryMenu() {
  if (createCategoryScore == 0) {
    createCategoryMenu.classList.remove("hide");
    createCategoryScore = 1;
  } else {
    createCategoryMenu.classList.add("hide");
    errorNotFilled.classList.add("hide");
    errorPatternNotFound.classList.add("hide");
    createCategoryScore = 0;
  }
}

[...pattern].forEach((currentlyPattern) => {
  currentlyPattern.addEventListener("click", () => {
    choosenPattern = currentlyPattern.getAttribute("pattern");

    [...pattern].forEach((currentlyPattern) => {
      currentlyPattern.style.border = "none";
    });

    currentlyPattern.style.border = "#48c759 1px solid";
  });
});

async function createCategory() {
  let categoryData = {};
  if (newCategoryInputRadio.checked) {
    if (categoryName.value) {
      errorNotFilled.classList.add("hide");
      categoryDescription.value
        ? (categoryData.description = categoryDescription.value)
        : (categoryData.description = "none");

      categoryData.name = categoryName.value;
      categoryData.user = siteUser;

      makeRequest(
        `${LEMUR_SITE_URL}/api/categoryData`,
        "POST",
        { "Content-Type": "application/json" },
        categoryData,
      );
    } else {
      errorNotFilled.classList.remove("hide");
    }
  }
  if (patternCategoryInputRadio.checked) {
    if (choosenPattern) {
      categoryData.user = siteUser;
      categoryData.name = choosenPattern;
      categoryData.description = "none";

      makeRequest(
        `${LEMUR_SITE_URL}/api/categoryData`,
        "POST",
        { "Content-Type": "application/json" },
        categoryData,
      );
    } else {
      errorPatternNotFound.classList.remove("hide");
    }
  }
}

function openCategoryAction(action) {
  (action == "pattern"
    ? () => {
        newCategory.classList.add("hide");
        patternCategory.classList.remove("hide");
        errorNotFilled.classList.add("hide");
      }
    : () => {
        newCategory.classList.remove("hide");
        patternCategory.classList.add("hide");
        errorPatternNotFound.classList.add("hide");
      })();
}

[...choiceMonthPoint].forEach((monthPoint) => {
  monthPoint.addEventListener("click", (event) => {
    monthInput.textContent = monthPoint.textContent;
    choosenMonth = monthPoint.getAttribute("data-month");
    chooseTag.remove();
    if (choosenMonth == "") {
      monthInput.style.color = "#5e5e5e";
    } else {
      monthInput.style.color = "white";
    }
    setChoiceMonth();
  });
});

function exitSession() {
  makeRequest(`${LEMUR_SITE_URL}/api/exitSession`, "DELETE", {
    "Content-Type": "application/json",
  });
  window.location.href = `${LEMUR_SITE_URL}`;
}

function setChoiceMonth() {
  if (choiceMonthScore == 0) {
    choiceMonth.classList.remove("hide");
    setTimeout(() => {
      choiceMonth.classList.add("choice-month-filter-show");
    }, 1);
    choiceMonthIcon.classList.add("icon-rotate");
    choiceMonthScore = 1;
  } else {
    choiceMonth.classList.remove("choice-month-filter-show");
    setTimeout(() => {
      choiceMonth.classList.add("hide");
    }, 100);
    choiceMonthIcon.classList.remove("icon-rotate");
    choiceMonthScore = 0;
  }
}

function openAdminsPage() {
  analyticsHereTag.hidden = true;
  analyticsSection.classList.add("hide");
  adminsHereTag.hidden = false;
  adminsSections.classList.remove("hide");
  dataFilter.classList.add("hide");
}

function setProfile() {
  if (profileScore == 0) {
    profile.classList.remove("hide");
    profileScore = 1;
  } else {
    profile.classList.add("hide");
    profileScore = 0;
  }
}

function openAnalyticssPage() {
  analyticsHereTag.hidden = false;
  analyticsSection.classList.remove("hide");
  adminsHereTag.hidden = true;
  adminsSections.classList.add("hide");
  dataFilter.classList.remove("hide");
}

function setFilter() {
  let filter = {
    monthFilter: null,
    yearFilter: null,
  };
  let monthFilter = choosenMonth;
  let yearFilter = yearInput.value;

  if (!yearFilter){
    yearInput.value = new Date().getFullYear();
  }

  filter.monthFilter = monthFilter ? monthFilter : "none";
  filter.yearFilter = yearFilter ? yearFilter : "none";

  console.log(filter);
  getEventsMetrics(filter, "update");
}

async function getSiteData() {
  let result = await makeRequest(`${LEMUR_SITE_URL}/api/site_data`, "GET", {
    "Content-Type": "application/json",
  });
  let siteData = await result.json();

  siteUrl.textContent = siteData.URL;
  TTFB.textContent = siteData.TTFB;
  siteStatus.textContent = siteData.status;

  TTFB.style.color = "white";
  if (siteData.status == "Online") {
    siteStatus.style.color = "#48c759";
    onlineIcon.classList.remove("hide");
  } else if (siteData.status == "Undefined") {
    siteStatus.style.color = "#d6c05f";
  } else {
    siteStatus.style.color = "#BE2F2F";
  }

  console.log(siteData);
}

async function getEventsMetrics(
  filter = { monthFilter: "none", yearFilter: "none" },
  action,
) {
  let result = await makeRequest(
    `${LEMUR_SITE_URL}/api/events/metrics`,
    "POST",
    { "Content-Type": "application/json" },
    filter,
  );
  let eventMetrics = await result.json();
  Charts(eventMetrics, action);
  visitMetrics.textContent = eventMetrics[1].metricsSum;
  visitGrowth.textContent = eventMetrics[1].growth;

  deviceDesktop.textContent = eventMetrics[1].desktop;
  deviceSmartphone.textContent = eventMetrics[1].smartphone;
  deviceTablet.textContent = eventMetrics[1].tablet;
  deviceOther.textContent = eventMetrics[1].otherDevice;

  allDeviceSum = eventMetrics[1].desktop + eventMetrics[1].smartphone + eventMetrics[1].tablet + eventMetrics[1].otherDevice;

  deviceDesktopPrecent.textContent = Math.round(eventMetrics[1].desktop / allDeviceSum * 1000) / 10;
  deviceSmartphonePrecent.textContent = Math.round(eventMetrics[1].smartphone / allDeviceSum * 1000) / 10;
  deviceTabletPrecent.textContent = Math.round(eventMetrics[1].tablet / allDeviceSum * 1000) / 10;
  deviceOtherPrecent.textContent = Math.round(eventMetrics[1].otherDevice / allDeviceSum * 1000) / 10;

  clickButtonsMetrics.textContent = eventMetrics[0].metricsSum;
  clickLinksMetrics.textContent = eventMetrics[2].metricsSum;

  let countryList = eventMetrics[1].countryList;

  if (countryList.length) {
    countryListContainer.innerHTML = ``;
    for (i = 0; i < countryList.length; i++) {
      country = allCountries[countryList[i][0]];
      value = countryList[i][1];
      countryListContainer.innerHTML += `
        <div class="country-object">
          <p>${country}</p>
          <p>${value} посещений</p>
        </div>`;
    }
  } else {
    countryListContainer.innerHTML = `<span id="notFound1" class="not-found">Записи не найдены</span>`;
  }

  let regionList = eventMetrics[1].regionList;

  if (regionList.length) {
    regionListContainer.innerHTML = ``;
    for (i = 0; i < regionList.length; i++) {
      region = russianRegions[regionList[i][0]];
      value = regionList[i][1];
      regionListContainer.innerHTML += `
        <div class="country-object">
          <p>${region}</p>
          <p><span id="${regionList[i][0]}">${value}</span> посещений</p>
        </div>`;
    }
  } else {
    regionListContainer.innerHTML = `<span id="notFound1" class="not-found">Записи не найдены</span>`;
  }

  const paths = document.querySelectorAll("path[data-code]");

  [...paths].forEach((path) => {
    path.style.fill = `color-mix(in oklab, transparent 100%, rgb(255, 65, 119) 0%)`;
    path.style.stroke = "#3a3a3a";
  });

  let max = Math.max(...regionList.map((x) => x[1]));
  for (let region of regionList) {
    let fillPercent = (region[1] / max) * 100;
    let path = document.querySelector(`path[data-code='RU-${region[0]}']`);
    path.style.fill = `color-mix(in oklab, transparent ${100 - fillPercent}%, rgb(255, 65, 119) ${fillPercent}%)`;
    path.style.stroke = `color-mix(in oklab, transparent ${100 - fillPercent}%, rgb(255, 65, 119) ${fillPercent}%)`;
  }
  console.log(eventMetrics);
}

async function getUserData() {
  let result = await makeRequest(`${LEMUR_SITE_URL}/api/userData`, "GET", {
    "Content-Type": "application/json",
  });
  let userData = await result.json();

  sessionUser.textContent = userData.user;
  tippy("#profileButton", {
    content: `
        <div class="pv2-container">
            <div class="pv2-main">
                <img src="app/static/img/av.svg" alt="def-avatar" width="50px" height="50px">
                <div class="pv2-user-info">
                    <p class="pv2-user-login">${userData.user}</p>
                    <p class="pv2-user-permission">${userData.permission}</p>
                </div>
            </div>
            <div class="pv2-buttons">
                <button>Редактировать логин</button>
                <button>Редактировать пароль</button>
            </div>
        </div>
    `,
    theme: "dark-profile",
    trigger: "click",
    interactive: true,
    maxWidth: "600px",
    allowHTML: true,
    onShow(instance) {
      instance.popper.style.borderRadius = "20px";
    },
  });
  console.log(userData);
}

async function  getUsersData() {
  let result = await makeRequest(`${LEMUR_SITE_URL}/api/usersData`, "GET", {
    "Content-Type": "application/json",
  });
  let usersData = await result.json();

  for (let userData of usersData){
    adminsList.innerHTML += 
    `
      <div class="admin-pattern">
          <div class="main-admin-pattern">
              <p class="data-admin-pattern"><span class="info-data-admin-pattern">id:</span>${userData[0]}</p>
              <p class="data-admin-pattern"><span class="info-data-admin-pattern">login:</span>${userData[1]}</p>
              <p class="data-admin-pattern"><span class="info-data-admin-pattern">permission:</span>${userData[2]}</p>
          </div>
          <div class="button-admin-pattern">
              <button>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M7 7H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-1"/><path d="M20.385 6.585a2.1 2.1 0 0 0-2.97-2.97L9 12v3h3zM16 5l3 3"/></g></svg>
              </button>
              <button class="copy-button" data-copy-text="id: ${userData[0]} login: ${userData[1]} permission: ${userData[2]}">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M7 9.667A2.667 2.667 0 0 1 9.667 7h8.666A2.667 2.667 0 0 1 21 9.667v8.666A2.667 2.667 0 0 1 18.333 21H9.667A2.667 2.667 0 0 1 7 18.333z"/><path d="M4.012 16.737A2 2 0 0 1 3 15V5c0-1.1.9-2 2-2h10c.75 0 1.158.385 1.5 1"/></g></svg>
              </button>
              <button>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7h16m-10 4v6m4-6v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"/></svg>
              </button>
          </div>
      </div>
    `
  }
  console.log(usersData)
  initializeTippy()
}

async function CopyUserDataButton(text) {
  await navigator.clipboard.writeText(text)
}

function initializeTippy() {
  if (window.tippyInstances) {
    window.tippyInstances.forEach(instance => instance.destroy());
  }
  
  window.tippyInstances = tippy('.copy-button', {
    content: 'Скопировано!',
    trigger: 'click',
    placement: 'top',
    theme: 'green',
    onShow(instance) {
      if (instance._timeoutId) {
        clearTimeout(instance._timeoutId);
      }
      const textToCopy = instance.reference.dataset.copyText;
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy)
      }
      instance._timeoutId = setTimeout(() => {
        instance.hide();
      }, 1000);
    },
  });
}

async function makeRequest(url, method, headers, bodyData = 0) {
  if (bodyData != 0) {
    let result = await fetch(url, {
      method: method,
      headers: headers,
      body: JSON.stringify(bodyData),
    });
    return result;
  } else {
    let result = await fetch(url, {
      method: method,
      headers: headers,
    });
    return result;
  }
}

getUsersData()
getUserData();
getEventsMetrics();
getSiteData();
