const puppeteer = require('puppeteer');

async function main() {
  // Iniciar o navegador e abrir uma nova página
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Navegar até a página alvo
  await page.goto('https://br.financas.yahoo.com/quote/PRIO3.SA/', {
    waitUntil: 'networkidle2',
  });

  // Capturar os valores desejados
    const data = await page.evaluate(() => {
    const name = document.querySelector('h1').innerText.substring(0, document.querySelector('h1').innerText.indexOf('(') - 2);
    const valuePrice = document.querySelector('fin-streamer[data-symbol="PRIO3.SA"][data-field="regularMarketPrice"]').innerText; 
    const valuePercent = document.querySelector('fin-streamer[data-symbol="PRIO3.SA"][data-field="regularMarketChangePercent"]').innerText.trim().replace('(', '').replace(')', '').replace('%', '');
    
    const valueOpen = document.querySelector('td[data-test="OPEN-value"]')
		? document.querySelector('td[data-test="OPEN-value"]').innerText
		: null;

    const valueMin = document.querySelector('td[data-test="DAYS_RANGE-value"]')
        ? document.querySelector('td[data-test="DAYS_RANGE-value"]').innerText.substring(0, document.querySelector('td[data-test="DAYS_RANGE-value"]').innerText.indexOf(' '))
        : null;

    const valueMax = document.querySelector('td[data-test="DAYS_RANGE-value"]')
        ? document.querySelector('td[data-test="DAYS_RANGE-value"]').innerText.substring(document.querySelector('td[data-test="DAYS_RANGE-value"]').innerText.lastIndexOf(' ') + 1, document.querySelector('td[data-test="DAYS_RANGE-value"]').innerText.lenght)
        : null;
    
    const descricaoFechamento = document.querySelector('div[id="quote-market-notice"]')
        ? document.querySelector('div[id="quote-market-notice"]').innerText.substring(0, document.querySelector('div[id="quote-market-notice"]').innerText.indexOf(':'))
        : null; 

    const dataFechamento = document.querySelector('div[id="quote-market-notice"]')
        ? document.querySelector('div[id="quote-market-notice"]').innerText.substring(document.querySelector('div[id="quote-market-notice"]').innerText.indexOf(':') + 2, document.querySelector('div[id="quote-market-notice"]').innerText.lastIndexOf(':') - 3)
        : null; 

    const horaFechamento = document.querySelector('div[id="quote-market-notice"]')
        ? document.querySelector('div[id="quote-market-notice"]').innerText.substring(document.querySelector('div[id="quote-market-notice"]').innerText.lastIndexOf(':') - 2, document.querySelector('div[id="quote-market-notice"]').innerText.lastIndexOf(':') + 5)
        : null; 

    return {
      name,
      valuePrice,
      valuePercent,
      valueOpen,
      valueMin,
      valueMax,
      descricaoFechamento,
      dataFechamento,
      horaFechamento,
    };
  });

  console.log(data);

  // Fechar o navegador
  await browser.close();
};

setInterval(async () => {
    main();
}, 60000);
