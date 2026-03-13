const express = require("express");
const { chromium } = require("playwright");
const axios = require("axios");
const fs = require("fs");

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

app.get("/download", async (req, res) => {
    try {
        const browser = await chromium.launch({
            args: ["--no-sandbox"]
        });
        const context = await browser.newContext();

        const response = await context.request.get(
            req.query.url
        );

        const pdf = await response.body();
        await browser.close();

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", 'attachment; filename="' + req.query.filename ?? "documento" + '.pdf"');
        res.send(pdf);
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro ao obter o arquivo PDF.");
    }
});

app.listen(3000);