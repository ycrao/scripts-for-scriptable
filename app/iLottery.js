// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: pink; icon-glyph: money-check-alt;

const _info = {
  name: 'iLottery',
  version: '1.1',
  updated_at: '2023-12-04 17:45:00',
  author: 'ycrao',
  description: 'Show Chinese lottery result: 双色球(ssq) and 大乐透(dlt).',
  repo_file_url: 'https://github.com/ycrao/scripts-for-scriptable/blob/main/app/iLottery.js',
  raw_file_url: 'https://raw.githubusercontent.com/ycrao/scripts-for-scriptable/main/app/iLottery.js' 
}

const lotteryConfig = {
  ssq: {
    title: '双色球',
    url: 'http://datachart.500.com/ssq/history/newinc/history.php',
    jumpUrl: 'https://m.zhcw.com/kaijiang/'
  },
  dlt: {
    title: '大乐透',
    url: 'http://datachart.500.com/dlt/history/newinc/history.php',
    jumpUrl: 'https://m.lottery.gov.cn/mltsz/index.html'
  }
}


const param = args.widgetParameter

const symbols = ['dlt', 'ssq']

// default dlt
let symbol = 'dlt'
if (param != null && symbols.includes(param)) {
  symbol = param
}

async function getLatestLottery(symbol) {
  let url = lotteryConfig[symbol]['url']
  const wv = new WebView()
  await wv.loadURL(url)
  jsStr = `
  let result = []
  const firstTr = (document.querySelector('#tdata')).querySelector('tr')
  result = (firstTr.innerText).split('\\t')
  console.log(result)
  completion(result)
  `
  const data = await wv.evaluateJavaScript(jsStr, true)
  // wv.present(true)
  return data
}

/*
dlt:
["23140","01","02","09","19","30","01","02","1,043,730,972","6","10,000,000","113","129,633","311,212,097","2023-12-06"]
ssq:
["23140","03","04","11","14","30","31","05"," ","2,606,606,136","12","7,033,098","123","247,938","480,392,100","2023-12-05"]
*/
const data = await getLatestLottery(symbol)
const widget = new ListWidget()
widget.backgroundColor = new Color('#000000', 1)
widget.setPadding(10, 10, 10, 10)
const ws = widget.addStack()
ws.size = new Size(36*10, 40)
const title = ws.addText(lotteryConfig[symbol]['title'])
title.font = Font.ultraLightRoundedSystemFont(20)
title.textColor = new Color("#ffffff", 1)
title.centerAlignText()
ws.centerAlignContent()
widget.addSpacer(20)

const ws1 = widget.addStack()
ws1.size = new Size(36*10, 20)
const subtitle = ws1.addText('第' + data[0] + '期 @' + data[data.length-1])
subtitle.font = Font.ultraLightRoundedSystemFont(14)
subtitle.textColor = new Color("#ffd700", 1)
subtitle.centerAlignText()
widget.addSpacer(20)

s = widget.addStack()
s.size = new Size(36*10, 36)
s.url = lotteryConfig[symbol]['jumpUrl']
s.centerAlignContent()
s.layoutHorizontally()

colors = {
  dlt: ["#3399cc", "#3399cc", "#3399cc", "#3399cc", "#3399cc", "#ff9933", "#ff9933"],
  ssq: ["#cc3333", "#cc3333", "#cc3333", "#cc3333", "#cc3333", "#cc3333", "#3399cc"],
}
for (let i = 0; i < 7; i ++) {
  let s1 = s.addStack()
  s1.size = new Size(36, 36)
  s1.cornerRadius = 18
  t1 = s1.addText(data[i+1])
  t1.font = Font.lightSystemFont(18)
  t1.textColor = Color.white()
  t1.centerAlignText()
  s1.centerAlignContent()
  s1.backgroundColor = new Color(colors[symbol][i])
  if (i < 6) { 
    let s2 = s.addStack()
    s2.size = new Size(4, 36)
  }
}

if (config.runsInApp) {
  widget.presentLarge()
}
Script.setWidget(widget)
Script.complete()
