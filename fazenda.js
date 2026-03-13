const express = require("express");
const { chromium } = require("playwright");

const app = express();

app.get("/scrape", async (req, res) => {
  const browser = await chromium.launch({
    args: ["--no-sandbox"]
  });

  const page = await browser.newPage();
  await page.goto(req.query.url);

  const title = await page.title();
  const content = await page.content();

    const items = await page.$$eval(
    '.indentacaoNormal:first-of-type a',
    elements => elements.map(el => ({
        text: el.innerText,
        link: el.href
    }))
    );
  await browser.close();

  res.json({ items });
});

app.listen(3000);