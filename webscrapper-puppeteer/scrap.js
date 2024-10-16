const puppeteer = require('puppeteer');
var tickerEnum = require('./ticker-enum');

async function main() {
  // Iniciar o navegador e abrir uma nova página
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  const startTime = Date.now();
  let endTime;

    try {
        for (let i = 0; i < Object.keys(tickerEnum).length; i++) {

            const ticket = Object.values(tickerEnum)[i].toString();
            // Navegar até a página alvo
            await page.goto('https://br.financas.yahoo.com/quote/'+ticket+'/', {
              waitUntil: 'networkidle2',
            });

            // Capturar os valores desejados
              const data = await page.evaluate((ticket) => {
              const selectorPrice = `fin-streamer[data-symbol="${ticket}"][data-field="regularMarketPrice"]`;
              const selectorPercent = `fin-streamer[data-symbol="${ticket}"][data-field="regularMarketChangePercent"]`;
              const name = document.querySelector('h1').innerText.substring(0, document.querySelector('h1').innerText.indexOf('(') - 2);
              const valuePrice = document.querySelector(selectorPrice).innerText; 
              const valuePercent = document.querySelector(selectorPercent).innerText.trim().replace('(', '').replace(')', '').replace('%', '');
              
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
            }, ticket);

            console.log(data);
        };
      } catch (error) {
        return error;
        // Fechar o navegador
        await browser.close();
      }
  // Fechar o navegador
  await browser.close();
  endTime = Date.now();
  const timeTaken = endTime - startTime;
  console.log(`Tempo total de execução: ${timeTaken/1000} s`);
}

setInterval(async () => {
    main();
}, 120000);
