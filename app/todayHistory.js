// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: teal; icon-glyph: newspaper;

const _info = {
  name: 'todayHistory',
  version: '1.1',
  updated_at: '2023-12-06 13:00:00',
  author: 'ycrao',
  description: 'history events on today',
  repo_file_url: 'https://github.com/ycrao/scripts-for-scriptable/blob/main/app/todayHistory.js',
  raw_file_url: 'https://raw.githubusercontent.com/ycrao/scripts-for-scriptable/main/app/todayHistory.js' 
}

class Billboard {
  constructor(title, items) {
    this.title = title
    this.items = items
  }
  
  randomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }
  
  render() {
    const widget = new ListWidget()
    widget.backgroundColor = new Color('#1e1e1e', 1)
    widget.setPadding(10, 10, 10, 10)
    const title = widget.addText(this.title)
    title.font = Font.boldSystemFont(18)
    title.textColor = new Color("#f7e01e", 1)
    title.centerAlignText()
    widget.addSpacer(20)
    const len = this.items.length
    console.log(len)
    let maxInt = 5
    let start = 0
    if (len > maxInt) {
      const diff = len - maxInt
      start = Math.floor(Math.random()*diff)
    }
    let loop = 0
    while (loop < maxInt) {
      let idx = loop + start
      // using stack
      const stack = widget.addStack()
      const t = stack.addText(this.items[idx].title)
      t.font = Font.lightSystemFont(12)
      t.textColor = new Color(this.randomColor(), 1)
      t.leftAlignText()
      t.lineLimit = 1
      stack.centerAlignContent()
      if (this.items[idx].url) {
        stack.url = `${this.items[idx].url}`
      }
      widget.addSpacer(10)
      loop ++
    }
    if (config.runsInApp) {
      widget.presentLarge()
    }
    
    Script.setWidget(widget)
    Script.complete()
  }
}

async function getItems() {   
  const wv = new WebView()
  await wv.loadURL("https://tool.lu/todayonhistory/")
  jsStr = `
  const newsItems = []
  const ulEl = document.querySelector('#tohlis')
  const liEls = ulEl.querySelectorAll('li')
  
  liEls.forEach((li) => {
    let title = li.innerText
    title = title.replace('\\n', '')
    console.log(title)
    let url = "https://m.baidu.com/s?word=" + encodeURIComponent(title)
    newsItems.push({
      title: title,
      url: url
    })
  })
  completion(newsItems)
  `
  const newsItems = await wv.evaluateJavaScript(jsStr, true)
  // wv.present(true)
  return newsItems
}

const items = await getItems()

bb = new Billboard("历史上的今天", items)
bb.render()
