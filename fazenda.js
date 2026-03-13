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

  await browser.close();

  res.json({ title, content });
});

app.listen(3000);