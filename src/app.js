const express = require('express');
const cors = require("cors");
const puppeteer = require('puppeteer');
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res)=>{
  console.log(req.body)
})

app.get('/pdf', async (req, res) => {
  const { html, name } = req.body;
  console.log(req.body)
  try {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    await page.setViewport({
        width: 794,
        height: 1123, 
        deviceScaleFactor: 2
    });

    await page.setContent(name);
    const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true, 
    });

    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="colorful_cv.pdf"');
    res.end(pdfBuffer);
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).send('Error generating PDF');
  }
});

const port = 3000;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
