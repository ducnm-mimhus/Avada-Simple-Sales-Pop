(function() {
  const BASE_URL = 'https://rid-governance-strengthen-guys.trycloudflare.com/scripttag';

  const scriptElement = document.createElement('script');
  [0];
  scriptElement.type = 'text/javascript';
  scriptElement.async = !0;
  scriptElement.src = BASE_URL + `/avada-sales-pop.min.js?v=${new Date().getTime()}`;
  const firstScript = document.getElementsByTagName('script')[0];
  firstScript.parentNode.insertBefore(scriptElement, firstScript);
})();
