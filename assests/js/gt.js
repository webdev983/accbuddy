async function loadScript() {
  const script = document.createElement('script');
  script.src = "https://www.googletagmanager.com/gtag/js?id=G-MTKNRB2JR5";
  document.head.append(script);
  return new Promise((resolve) => {
      script.onload = resolve;
  });
}

function executeScript() {
  loadScript().then(() => {
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-MTKNRB2JR5');
  });
}

window.addEventListener('load', executeScript);
