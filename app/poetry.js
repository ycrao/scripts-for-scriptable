// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-blue; icon-glyph: file-word;

const _info = {
  name: 'poetry',
  version: '1.1',
  updated_at: '2023-12-04 17:45:00',
  author: 'ycrao',
  description: 'widget to show a poetry',
  repo_file_url: 'https://github.com/ycrao/scripts-for-scriptable/blob/main/app/poetry.js',
  raw_file_url: 'https://raw.githubusercontent.com/ycrao/scripts-for-scriptable/main/app/poetry.js' 
}

renderMedium = async (widget, poetry) => {
  const t1 = widget.addText(poetry.hitokoto)
  t1.font = Font.heavySystemFont(24)
  t1.textColor = new Color("#ffffff", 1)
  t1.leftAlignText()
  widget.addSpacer(20)
  const t2 = widget.addText(" —— " + poetry.from_who + '《' + poetry.from + '》')
  t2.font = Font.lightSystemFont(12)
  t2.textColor = new Color("#fffc79", 1)
  t2.rightAlignText()
  return widget
};

renderNotSupported = async () => {
  const notification = new Notification()
  notification.title = "Warning"
  notification.subtitle = "not supported for " + config.widgetFamily + " size"
  await notification.schedule()
}

const widget = new ListWidget()
widget.backgroundColor = new Color('#1e1e1e', 1)
widget.setPadding(20, 12, 20, 12)

const request = new Request("https://v1.hitokoto.cn/?c=i")
const poetry = await request.loadJSON()
console.log(poetry)

console.log(config.widgetFamily)
if (config.widgetFamily === 'medium' || config.widgetFamily === undefined) {
  await this.renderMedium(widget, poetry)
} else {
  await this.renderNotSupported()
}

if (config.runsInApp) {
  widget.presentMedium()
}

Script.setWidget(widget)
Script.complete()