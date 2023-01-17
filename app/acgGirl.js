// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: red; icon-glyph: palette;

/*
name: acgGirl.js
author: raoyc
description: a widget to show ACG girl
note: only run in `Scriptable` app
repo_file_url: https://github.com/ycrao/scripts-for-scriptable/blob/main/app/acgGirl.js
raw_file_url: https://github.com/ycrao/scripts-for-scriptable/blob/main/app/acgGirl.js
*/
const $http = importModule("http.module")

/*
provider: hanxiaohan,xjh,yimian,yiluo,ouklc,btstu,r10086,ixiaowai
*/
async function acgApi(provider) {
  let url = rawUrl = ""
  let urls = []
  let json = null, img = null
  switch (provider) {
    // hanxiaohan api, see: https://api.vvhan.com/dongman.html
    case "hanxiaohan":
      rawUrl = "https://api.vvhan.com/api/acgimg"
      img = await $http.req("get", rawUrl).loadImage()
      break
    // xjh api, see: http://img.xjh.me/
    case "xjh":
      url = "https://img.xjh.me/random_img.php"
      img = await $http.req("get", url, {type:"acg", return:"json"}).loadJSON().then(json => {   
        if ((json.error == 0) && (json.result == 200))  {  
           rawUrl = "https:" + json.img
          return $http.req("get", rawUrl).loadImage()
        }
      })
      break
    // yimian api, see: https://www.eee.dog/tech/rand-pic-api.html
    case "yimian":
      url = "https://api.yimian.xyz/img"
      img = await $http.req("get", url, {type:"moe", "R18": true}).loadImage()
      break
     // yiluo api, see: https://bk.kurlsq.cn/index.php/2022/09/01/%e9%9a%8f%e6%9c%ba%e4%ba%8c%e6%ac%a1%e5%85%83%e5%a3%81%e7%ba%b8api%e6%ba%90%e7%a0%81/ + https://api.kurlsq.cn/?action=doc&id=1
    case "yiluo":
      url = "https://api.kurlsq.cn/API/acgtp/api.php"
      img = await $http.req("get", url, {type:"moe", "R18": true}).loadImage()
      break
    // ouklc api, see: https://ouklc.com/131
    case "ouklc":
      urls = [
        "https://www.ouklc.com/api/tp",
        "https://www.ouklc.com/api/tp2",
        "https://www.ouklc.com/api/tp3",
        "https://www.ouklc.com/api/tp4",
      ]
      url = urls[Math.floor(Math.random()*3)]
      img = await $http.req("get", url).loadImage()
      break

   // see: https://api.btstu.cn/doc/sjbz.php
   case "btstu":
      url = "https://api.btstu.cn/sjbz/api.php?format=images"
      img = await $http.req("get", url).loadImage()
      break
   // see: https://img.r10086.com/
   case "r10086":
      let typeKeywords = ['动漫综合1', '动漫综合2', '动漫综合3', '动漫综合4', '动漫综合5', '动漫综合6', '动漫综合7', '动漫综合8', '动漫综合9', '动漫综合10', '动漫综合11', '动漫综合12', '动漫综合13', '动漫综合14', '动漫综合15', '动漫综合16', '动漫综合17', '动漫综合18', '东方project1', '猫娘1', '物语系列1', '物语系列2', '少女前线1', '明日方舟1', '明日方舟2', '重装战姬1', 'P站系列1', 'P站系列2', 'P站系列3', 'P站系列4', 'CG系列1', 'CG系列2', 'CG系列3', 'CG系列4', 'CG系列5', '守望先锋', '王者荣耀', '少女写真1', '少女写真2', '少女写真3', '少女写真4', '少女写真5', '少女写真6', '死库水萝莉', '萝莉', '极品美女图片', '日本COS中国COS']
      const length = typeKeywords.length
      url = "https://api.r10086.com/img-api.php"
      const randomTypeKeyword = typeKeywords[Math.floor(Math.random()*(length-1))]
      console.log(randomTypeKeyword)
      img = await $http.req("get", url, {type: randomTypeKeyword}).loadImage()
      break
   // ixiaowai api, see: https://api.ixiaowai.cn/
   case "ixiaowai":
      url = "https://api.ixiaowai.cn/api/api.php"
      img = await $http.req("get", url).loadImage()
      break
   default:
   // see: https://cdn.seovx.com/
   case "seovx":
      // not supported
      break
  }
  return img
}
const providers = "hanxiaohan,xjh,yimian,yiluo,ouklc,btstu,r10086,ixiaowai".split(',')
const param = args.widgetParameter
const widget = new ListWidget()
widget.backgroundColor = new Color("#ffffff", 0.5)
widget.setPadding(0,0,0,0)
let provider = "ixiaowai"
if (param != null && providers.includes(param)) {
  provider = param
}
const acgPic = await acgApi(provider)
const img = widget.addImage(acgPic)
const height = Math.floor(480/(acgPic.width*acgPic.height))
img.imageSize = new Size(480, height)
img.resizable = true
img.centerAlignImage()
img.imageOpacity = 0.8
// img.applyFittingContentMode()
img.applyFillingContentMode()

if (config.runsInApp) {
  widget.presentLarge()
}

Script.setWidget(widget)
Script.complete()

