const puppeteer = require('puppeteer');

(async () => {
  // Iniciar o navegador e abrir uma nova página
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Navegar até a página alvo e aguardar o carregamento da página
  await page.goto('https://br.financas.yahoo.com/quote/PRIO3.SA/', {
    waitUntil: 'networkidle2',
  });

  // Esperar que o preço atual da ação apareça na página antes de prosseguir
  await page.waitForSelector('fin-streamer[data-symbol="PRIO3.SA"][data-field="regularMarketPrice"]');

  // Capturar todo o conteúdo do HTML do corpo da página
  const html = await page.evaluate(() => document.querySelector('body').innerHTML);

  console.log(html); // Exibir o HTML da página

  // Fechar o navegador
  await browser.close();
})();
