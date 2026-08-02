
const STORAGE_KEY = 'fieldglass_owm_key';

const els = {
  form: document.getElementById('lookupForm'),
  input: document.getElementById('cityInput'),
  button: document.getElementById('lookupButton'),
  hint: document.getElementById('hint'),
  panel: document.getElementById('panel'),
  notice: document.getElementById('notice'),
  noticeTitle: document.getElementById('noticeTitle'),
  noticeBody: document.getElementById('noticeBody'),
  loading: document.getElementById('loading'),
  cityName: document.getElementById('cityName'),
  cityMeta: document.getElementById('cityMeta'),
  iconSlot: document.getElementById('iconSlot'),
  temp: document.getElementById('temp'),
  desc: document.getElementById('desc'),
  feels: document.getElementById('feels'),
  windSpeed: document.getElementById('windSpeed'),
  windNeedle: document.getElementById('windNeedle'),
  humidity: document.getElementById('humidity'),
  pressure: document.getElementById('pressure'),
  stamp: document.getElementById('stamp'),
  apiKeyInput: document.getElementById('apiKeyInput'),
  saveKeyButton: document.getElementById('saveKeyButton'),
  keybox: document.getElementById('keybox'),
};


function getApiKey(){
  return localStorage.getItem(STORAGE_KEY) || '';
}

function setApiKey(key){
  localStorage.setItem(STORAGE_KEY, key.trim());
}

(function initKeyBox(){
  const existing = getApiKey();
  if (existing){
    els.apiKeyInput.value = existing;
    els.keybox.open = false;
  } else {
    els.keybox.open = true;
  }
})();

els.saveKeyButton.addEventListener('click', () => {
  const val = els.apiKeyInput.value.trim();
  if (!val){
    showNotice('Missing key', 'Paste an OpenWeatherMap API key above before saving.');
    return;
  }
  setApiKey(val);
  els.keybox.open = false;
  showHint('Key saved. Try a search below.');
});


const ICONS = {
  'clear-day': `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="12" stroke="currentColor" stroke-width="3"/>
    <g stroke="currentColor" stroke-width="3" stroke-linecap="round">
      <line x1="32" y1="4" x2="32" y2="12"/>
      <line x1="32" y1="52" x2="32" y2="60"/>
      <line x1="4" y1="32" x2="12" y2="32"/>
      <line x1="52" y1="32" x2="60" y2="32"/>
      <line x1="12.3" y1="12.3" x2="17.9" y2="17.9"/>
      <line x1="46.1" y1="46.1" x2="51.7" y2="51.7"/>
      <line x1="12.3" y1="51.7" x2="17.9" y2="46.1"/>
      <line x1="46.1" y1="17.9" x2="51.7" y2="12.3"/>
    </g>
  </svg>`,
  'clear-night': `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M42 12c-11 2-19 12-19 23 0 13 10.5 23.5 23.5 23.5 6 0 11.4-2.2 15.6-5.9C57 55.2 51 57 44.5 57 31.5 57 21 46.5 21 33.5c0-9 5-16.8 12.4-20.7A23.6 23.6 0 0 0 42 12z" fill="currentColor"/>
    <circle cx="14" cy="16" r="1.6" fill="currentColor"/>
    <circle cx="8" cy="26" r="1.2" fill="currentColor"/>
    <circle cx="18" cy="30" r="1" fill="currentColor"/>
  </svg>`,
  clouds: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 44a10 10 0 0 1-1-19.9A13 13 0 0 1 44 22a9 9 0 0 1 2 17.8" stroke="currentColor" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
    <path d="M18 44h28a8 8 0 0 0 0-16" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
  </svg>`,
  rain: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 34a9 9 0 0 1-1-17.9A12 12 0 0 1 40 13a8 8 0 0 1 2 15.8" stroke="currentColor" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
    <g stroke="currentColor" stroke-width="3" stroke-linecap="round">
      <line x1="20" y1="42" x2="16" y2="54"/>
      <line x1="32" y1="42" x2="28" y2="54"/>
      <line x1="44" y1="42" x2="40" y2="54"/>
    </g>
  </svg>`,
  thunderstorm: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 32a9 9 0 0 1-1-17.9A12 12 0 0 1 40 11a8 8 0 0 1 2 15.8" stroke="currentColor" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
    <path d="M33 38 24 52h9l-4 12 15-18h-9z" fill="currentColor"/>
  </svg>`,
  snow: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 32a9 9 0 0 1-1-17.9A12 12 0 0 1 40 11a8 8 0 0 1 2 15.8" stroke="currentColor" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
    <g stroke="currentColor" stroke-width="2.4" stroke-linecap="round">
      <line x1="20" y1="42" x2="20" y2="54"/>
      <line x1="15" y1="45" x2="25" y2="51"/>
      <line x1="25" y1="45" x2="15" y2="51"/>
      <line x1="40" y1="42" x2="40" y2="54"/>
      <line x1="35" y1="45" x2="45" y2="51"/>
      <line x1="45" y1="45" x2="35" y2="51"/>
    </g>
  </svg>`,
  mist: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g stroke="currentColor" stroke-width="3" stroke-linecap="round">
      <line x1="10" y1="22" x2="46" y2="22"/>
      <line x1="16" y1="32" x2="54" y2="32"/>
      <line x1="10" y1="42" x2="46" y2="42"/>
      <line x1="20" y1="52" x2="50" y2="52"/>
    </g>
  </svg>`,
};

function iconFor(group, isNight){
  if (group === 'clear') return ICONS[isNight ? 'clear-night' : 'clear-day'];
  return ICONS[group] || ICONS.clouds;
}


function conditionGroup(owmMain){
  const m = (owmMain || '').toLowerCase();
  if (m === 'clear') return 'clear';
  if (m === 'clouds') return 'clouds';
  if (m === 'rain') return 'rain';
  if (m === 'drizzle') return 'drizzle';
  if (m === 'thunderstorm') return 'thunderstorm';
  if (m === 'snow') return 'snow';
  if (['mist','smoke','haze','dust','fog','sand','ash','squall','tornado'].includes(m)) return 'mist';
  return 'default';
}


function showLoading(on){
  els.loading.hidden = !on;
  els.button.disabled = on;
}

function showPanel(on){
  els.panel.hidden = !on;
}

function showNotice(title, body){
  els.notice.hidden = false;
  els.noticeTitle.textContent = title;
  els.noticeBody.textContent = body;
}

function hideNotice(){
  els.notice.hidden = true;
}

function showHint(text){
  els.hint.textContent = text;
}


async function lookupCity(city){
  const key = getApiKey();

  if (!key){
    els.keybox.open = true;
    showNotice('API key needed', 'Add your free OpenWeatherMap key below, then search again.');
    showPanel(false);
    return;
  }

  hideNotice();
  showPanel(false);
  showLoading(true);

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${key}`;

  try{
    const res = await fetch(url);

    if (res.status === 404){
      showNotice('No such station found.', `We couldn't find a place called "${city}". Check the spelling and try again.`);
      showLoading(false);
      return;
    }
    if (res.status === 401){
      showNotice('Key not active yet.', 'Your API key was rejected. New keys can take a few minutes to activate after signup.');
      showLoading(false);
      return;
    }
    if (!res.ok){
      showNotice('The sky went quiet.', `The weather service returned an error (status ${res.status}). Try again shortly.`);
      showLoading(false);
      return;
    }

    const data = await res.json();
    render(data);

  } catch (err){
    
  } finally {
    showLoading(false);
  }
}

function render(data){
  const main = data.weather?.[0]?.main || '';
  const description = data.weather?.[0]?.description || '—';
  const group = conditionGroup(main);

  
  const now = data.dt;
  const isNight = data.sys && (now < data.sys.sunrise || now > data.sys.sunset);

  document.body.setAttribute('data-condition', group);
  document.body.setAttribute('data-time', isNight ? 'night' : 'day');

  els.cityName.textContent = data.name || 'Unknown';
  els.cityMeta.textContent = [data.sys?.country, `${Math.round(data.coord?.lat)}°, ${Math.round(data.coord?.lon)}°`]
    .filter(Boolean).join(' · ');

  els.iconSlot.innerHTML = iconFor(group, isNight);

  els.temp.textContent = `${Math.round(data.main.temp)}°`;
  els.desc.textContent = description;
  els.feels.textContent = `Feels like ${Math.round(data.main.feels_like)}°`;

  els.windSpeed.textContent = `${data.wind.speed.toFixed(1)} m/s`;
  if (typeof data.wind.deg === 'number'){
    els.windNeedle.style.transform = `rotate(${data.wind.deg}deg)`;
    els.windNeedle.style.transformOrigin = '12px 12px';
  }

  els.humidity.textContent = `${data.main.humidity}%`;
  els.pressure.textContent = `${data.main.pressure} hPa`;

  const stampDate = new Date(data.dt * 1000);
  els.stamp.textContent = `Reading taken ${stampDate.toLocaleString(undefined, {
    hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short'
  })}`;

  showPanel(true);
  showHint('Press enter, or tap the button, to take another reading.');
}


els.form.addEventListener('submit', (e) => {
  e.preventDefault();
  const city = els.input.value.trim();
  if (!city){
    showNotice('Nothing entered.', 'Type a city name before taking a reading.');
    return;
  }
  lookupCity(city);
});