function accepterCookies() {
  setCookie('rgpd_consent', 'true', 365); // 1 an
  document.getElementById('cookie-banner').style.display = 'none';
}

if (!getCookie('rgpd_consent')) {
  document.getElementById('cookie-banner').style.display = 'block';
}