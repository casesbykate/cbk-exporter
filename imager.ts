import puppeteer from "puppeteer";
import SkyFiles from "skyfiles";
import database from "./database-v2.json";

(async () => {

    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setViewport({ width: 630, height: 630 });
    const html = await SkyFiles.readText("template.html");

    for (const [id, data] of (database as any).entries()) {
        await page.setContent(html.replace("<body></body>", `<body>${data.text.replace(/\n/g, "<br>")}</body>`));
        const imageBuffer = await page.screenshot();
        await SkyFiles.write(`temp/${id}.png`, imageBuffer as Buffer);
    }

    await page.close();
    await browser.close();
})();