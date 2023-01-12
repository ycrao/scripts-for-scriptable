// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: yellow; icon-glyph: question;

/*
name: zhihuHot.js
author: raoyc
description: a widget to show zhihu hot questions
note: only run in `Scriptable` app
repo_file_url: https://github.com/ycrao/scripts-for-scriptable/blob/main/app/zhihuHot.min.js
raw_file_url: https://github.com/ycrao/scripts-for-scriptable/blob/main/app/zhihuHot.js
*/
const $http = importModule("http.module")
const $cache = importModule("cache.module")

function getRandomIntArr(length) {
  if (length <= 6) {
    return [0, 1, 2, 3, 4, 5]
  }
  let randomIntArr = []
  for (let i = 0; i < length; i ++) {
    randomIntArr.push(i)
  }
  randomIntArr.sort(() => {
    return Math.random() - 0.5
  })
  return randomIntArr
}

// code from https://github.com/evilbutcher/Scriptables/blob/master/Bilibili.js
function getRandomColorHexValue() {
  var r = Math.floor(Math.random() * 256);
  if (r + 50 < 255) {
    r = r + 50;
  }
  if (r > 230 && r < 255) {
    r = r - 50;
  }
  var g = Math.floor(Math.random() * 256);
  if (g + 50 < 255) {
    g = g + 50;
  }
  if (g > 230 && g < 255) {
    g = g - 50;
  }
  var b = Math.floor(Math.random() * 256);
  if (b + 50 < 255) {
    b = b + 50;
  }
  if (b > 230 && b < 255) {
    b = b - 50;
  }
  var color = "#" + r.toString(16) + g.toString(16) + b.toString(16);
  return color;
}
const cache = $cache.useFileStorage()
const date = new Date()
let year = date.getFullYear(),
  month = date.getMonth() + 1,
  day = date.getDate(),
  hour = date.getHours();
// cache refresh by one hour
const key = 'zhihuHot:' + year + month + day + hour

let result = null, items = [], randomIntArr = [0, 1, 2, 3, 4, 5]
if (cache.contains(key)) {
  result = JSON.parse(cache.get(key))
  console.log(result)
} else {
  result = await $http.req("get", "https://www.zhihu.com/api/v3/feed/topstory/hot-lists/total").loadJSON()
  cache.set(key, JSON.stringify(result))
}

if (result != null) {
  items = result.data
  if (items.length > 6) {
     randomIntArr = getRandomIntArr(items.length)
  }
}


const widget = new ListWidget()
widget.backgroundColor = new Color('#1e1e1e', 1)
widget.setPadding(10, 10, 10, 10)
const title = widget.addText("知乎热榜")
title.font = Font.boldSystemFont(18)
title.textColor = new Color("#f7e01e", 1)
title.centerAlignText()
widget.addSpacer(20)

// random question
for (let i = 0; i < 6; i++) {
  let idx = randomIntArr[i]
  // using text
  /*
  const text = widget.addText(items[idx].target.title)  
  text.font = Font.lightSystemFont(12)
  text.textColor = new Color(getRandomColorHexValue(), 1)
  text.leftAlignText()  
  text.lineLimit = 1
  widget.addSpacer(10)
  */
  // using stack
  const stack = widget.addStack()
  const t = stack.addText(items[idx].target.title)
  t.font = Font.lightSystemFont(12)
  t.textColor = new Color(getRandomColorHexValue(), 1)
  t.leftAlignText()
  t.lineLimit = 1
  stack.centerAlignContent() 
  stack.url = `zhihu://question/${items[idx].target.id}`
  widget.addSpacer(10)
}


if (config.runsInApp) {
  widget.presentLarge()
}

Script.setWidget(widget)
Script.complete()