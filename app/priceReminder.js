// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: orange; icon-glyph: bell;

/*
name: priceReminder.js
author: raoyc
description: a widget to show XAUUSD/XAGUSD/Au(T+D)/Ag(T+D) realtime price
note: only run in `Scriptable` app
repo_file_url: https://github.com/ycrao/scripts-for-scriptable/blob/main/app/priceReminder.js
raw_file_url: https://github.com/ycrao/scripts-for-scriptable/blob/main/app/priceReminder.js
*/
async function getPriceArr() {
  const jsStr = `
function loadScript(url, callback) {
  const script = document.createElement("script")
  script.type = "application/javascript"
  script.charset = "gb18030"
  script.src = url
  document.getElementsByTagName('head')[0].appendChild(script);

  script.onload = function() {  
      let xauArr = hq_str_hf_XAU.split(','), xagArr = hq_str_hf_XAG.split(','), autdArr = hq_str_gds_AUTD.split(','), agtdArr = hq_str_gds_AGTD.split(',')
      let priceArr = [xauArr[0], xagArr[0], autdArr[0], agtdArr[0]]
      callback(priceArr)
   }
  
}
let url = "https://hq.sinajs.cn/?rn=" + (new Date()).getTime() + "&list=hf_XAU,hf_XAG,gds_AUTD,gds_AGTD"
loadScript(url, (priceArr) => {
  completion(priceArr)
})
`
  const webView = new WebView()
  await webView.loadHTML(``, "https://finance.sina.com.cn/nmetal/")
  // webView.present()
  const priceArr = await webView.evaluateJavaScript(jsStr, true)
  return priceArr
}

async function getFrontCanvas(prices) {
  const htmlStr = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>metal price</title>
    <!--<script src="https://cdn.bootcdn.net/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>-->
</head>
<style>
@font-face {
    font-family: 'ProggyTiny';
    src: url('data:font/woff2;charset=utf-8;base64,d09GMgABAAAAAAOgAA4AAAAAEqwAAANLAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGhYGVgCBNAgCEQgKmziXCgs4AAE2AiQDOAQgBYJrB3YMCBtOD8iuBhxjih6pcBURt7tuuD6kYcPxibBhPDyt0d7f2TORZukODYWQTZvEHVRLo9FUYqQy8A8/7j33ix4dymuDKiNYV9qqffhzfR5wFNiAut7WF5V8AHAN4yYXq/8B9Nm/bWNP1xUURBC3uDwijhvUy+r3U5sL2sgI81SMAXY2KimTAyPiypf9fO+VQFbXKBxf4avIqCpfhRKF4zPd3ipqQE1uJUw2cWkCugEqIhmiRK+0oPpSPcFL/e7jr0lkqDvor+jxq/cbUVAe24GaQABUkGCYlWCYzSeWldjYeJS0dQ1tMdgKtbmVnZObh28RnUpaHSiPzCLH0Od+xH3PdazRUnBGCUawgG8rSqkCpoB9xDbqd7ScQkANTANAh3WcX0hYkFcwIW8dJ/187V4o9FWu5aPaooskulrLYCAJ01MhJgY9xSjEDJ5i6az/2FniyWYfZMjrOSO8L/IPXmHBWc2aIeF96Zz2Sybmx/favd8L0YFoOfcLOUNOaifAY6BqwbvXvDnocE6ZVzIwwhCwP7cgjWV+1p1jDOdAP4TQWskuCee9cnaOeA8hLHizuf1ccVfn94zsgih3cqn33ZTgf1MghHhmPOWmdiVP020q7Sln2I4/JMijfBxeOWs+ESp2ooMK0n4fD4msLtDouAunePe20ZQhWGfZw2LFfj+DmRnoQdvWYncHrNY0z1tW1wJIGnk5O2jKTH2ZcnDwS4A32fndtn8XHtfXPitwoWwUpsBOgHCN8tT5HfrA5aOZgoT7+s6b5lJTaekGYukgfA6tnfR/Gjz41+5tB95fuPWDr2/e7qCU2EA7CxBIP/4XEpAQAACRAABZZlZlL3vAlDs0UHHZRMFNBNDrXwAMQgDBJ0JAxalAQBJSJ6BuVi085vpbq86zUt0ByzYSJSmXyiLgSVmVfHhtRNnFfPU5SNPpD2/afFo/zR/0Py+D178gGVt93gWaBH5qewioedb2AqZ3aF9wPMeFD55xtXFzN3HMRg4eZgcHC1eJq5OVlQ/YOPoAyCysPOxNXAHU+I6LZSMjM0OvaWyOhVlrWTEIVzkFwRJVJFZePgERNU0d8xYsWrHP5omkMqVab9B74/rmeTklje4JGKfnni+ef4hyHwAAAA==') format('woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
}
@font-face {
    font-family: 'LcdD';
    src: url('data:font/woff2;charset=utf-8;base64,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') format('woff2');
    font-weight: normal;
    font-style: italic;
    font-display: swap;
}
body {
    background-color: #1e1e1e;
}
.lcdDText {
    font-family: 'LcdD';
    font-weight: normal;
    font-style: italic;
    font-size: 24px;
    color: #ff0;
}
.proggyTinyText {
    font-family: 'ProggyTiny' !important;
    font-weight: normal;
    font-style: normal;
    color: #fff;
}
rt {
    font-size: 16px;
}
sub {
    font-size: 14px;
}
#container {
    width: 300px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-content: center;
    justify-content: center;
    align-items: center;
    background-color: #1e1e1e;
}
.item {
    width: 120px;
    height: 48px;
}
</style>

<body>
<div id="container">
    <div class="item">
        <ruby class="lcdDText">
            ${prices[0]}<rt class="symbol proggyTinyText">XAUUSD</rt>
        </ruby>
        <sub class="unit proggyTinyText">usd/oz</sub>
    </div>
    <div class="item">
        <ruby class="lcdDText">
            ${prices[1]}<rt class="symbol proggyTinyText">XAGUSD</rt>
        </ruby>
        <sub class="unit proggyTinyText">usd/oz</sub>
    </div>
    <div class="item">
        <ruby class="lcdDText">
            ${prices[2]}<rt class="symbol proggyTinyText">Au(T+D)</rt>
        </ruby>
        <sub class="unit proggyTinyText">cny/g</sub>
    </div>
    <div class="item">
        <ruby class="lcdDText">
            ${prices[3].replace('.00', '')}<rt class="symbol proggyTinyText">Ag(T+D)</rt>
        </ruby>
        <sub class="unit proggyTinyText">cny/kg</sub>
    </div>
    
</div>
<!--
<script type="text/javascript">
html2canvas(document.querySelector("#container")).then(canvas => {
  document.body.appendChild(canvas)
  const dataUrl = canvas.toDataURL("image/png")
  log(dataUrl)
})
</script>
-->
</body>
</html>
`
  const webView = new WebView()
  await webView.loadHTML(htmlStr, "https://cdn.bootcdn.net")
  // await webView.present(false)
  
  let jsStr = `
function loadScript(url, callback) {
  const script = document.createElement("script")
  script.type = "application/javascript"
  script.src = url
  document.getElementsByTagName('head')[0].appendChild(script);
  script.onload = function() {  
      html2canvas(document.querySelector("#container")).then(canvas => {
        // document.body.appendChild(canvas)
        const dataUrl = canvas.toDataURL("image/png")
        callback(dataUrl)
      })
   }
}
const scriptUrl = "https://cdn.bootcdn.net/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"
loadScript(scriptUrl, (dataUrl) => {
  completion(dataUrl)
})
  `
  const url = await webView.evaluateJavaScript(jsStr, true)
  console.log(url)
  return url
}

const priceArr = await getPriceArr()
const imageStr = await getFrontCanvas(priceArr)
const imageBase64Str = imageStr.replace("data:image/png;base64,", "")
const widget = new ListWidget()
widget.backgroundColor = new Color('#1e1e1e', 1)
widget.setPadding(10, 10, 10, 10)
const title = widget.addText("PriceReminder")
title.font = Font.ultraLightRoundedSystemFont(20)
title.textColor = new Color("#f7e01e", 1)
title.centerAlignText()
widget.addSpacer(20)
const pricePic = Image.fromData(Data.fromBase64String(imageBase64Str))
const img = widget.addImage(pricePic)
img.size = new Size(300, 0)
if (config.runsInApp) {
  widget.presentLarge()
}

Script.setWidget(widget)
Script.complete()
