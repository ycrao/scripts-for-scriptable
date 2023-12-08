// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: red; icon-glyph: images;

const _info = {
  name: 'showPhoto',
  version: '1.1',
  updated_at: '2023-12-06 18:00:00',
  author: 'ycrao',
  description: 'Show a local photo in a widget',
  repo_file_url: 'https://github.com/ycrao/scripts-for-scriptable/blob/main/app/showPhoto.js',
  raw_file_url: 'https://raw.githubusercontent.com/ycrao/scripts-for-scriptable/main/app/showPhoto.js' 
}

const $cache = importModule("cache.module")

const cache = $cache.useSecureStorage()


const picKey = 'userPic'

let picStr = ''
let pic = null

if (cache.contains(picKey)) {
  picStr = cache.get(picKey)
  pic = Image.fromData(Data.fromBase64String(picStr))
} else {
  pic = await Photos.fromLibrary()
  picStr = Data.fromPNG(pic).toBase64String()
  cache.set(picKey, picStr)
}

const widget = new ListWidget()
widget.backgroundColor = new Color("#ffffff", 0.5)
widget.setPadding(0,0,0,0)

const img = widget.addImage(pic)
const height = Math.floor(480/(pic.width*pic.height))
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

