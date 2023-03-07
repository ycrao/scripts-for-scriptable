// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// always-run-in-app: true; icon-color: purple;
// icon-glyph: download; share-sheet-inputs: plain-text;

/*
name: videoHelper.js
author: raoyc
description: download video from Chinese pop short-video apps, such as douyin, kuaishou, weibo and so on
note: only run in `Scriptable` app
repo_file_url: https://github.com/ycrao/scripts-for-scriptable/blob/main/app/videoHelper.js
raw_file_url: https://raw.githubusercontent.com/ycrao/scripts-for-scriptable/main/app/videoHelper.js
*/
const $http = importModule("http.module")

// 最新可用接口
async function fetchVideo(clip) {
  const re = /(http|https):\/\/([a-zA-Z0-9.:?=&-/%#]+)/g
  const result = clip.match(re)
  console.log(result)
  if (result != null && result[0] !== undefined) {
    const dyUrl = result[0]
    const apiUrl = "https://api.iculture.cc/api/video/"
    json = await $http.req("get", apiUrl, {url: dyUrl}).loadJSON()
    console.log(json)
    if (json.code === 200) {
      let videoUrl = json.url
      if (videoUrl.startsWith("//")) {
        videoUrl = "https:" + videoUrl
      }
      const cb = new CallbackURL("shortcuts://x-callback-url/run-shortcut")
      cb.addParameter("name", "下载文件")
      cb.addParameter("input", "text")
      cb.addParameter("text", videoUrl)
      cb.open()
      notify("VideoHelper", "Please select file path to download/请选择路径下载")
      // Safari.open(videoUrl)
      return
    }
  } else {
    notify("VideoHelper", "Invalid URL/无效URL")
  }
}

// 该接口已失效 抖音/快手/火山/微博/虎牙/轻视频/梨视频/皮皮虾/皮皮搞笑/微视/最右/VUE Vlog/新片场/度小视/六间房/acfun
/*
async function _fetchVideo(clip) {
    const re = /(http|https):\/\/([a-zA-Z0-9.:?=&-/%#]+)/g
    const result = clip.match(re)
    console.log(result)
    if (result != null && result[0] !== undefined) {
      const dyUrl = result[0]
      const apiUrl = "https://api.xcboke.cn/api/juhe"
      json = await $http.req("get", apiUrl, {url: dyUrl}).loadJSON()
      console.log(json)
      if (json.code === 200) {
        let videoUrl = json.data.url
        if (videoUrl.startsWith("//")) {
          videoUrl = "https:" + videoUrl
        }
        const cb = new CallbackURL("shortcuts://x-callback-url/run-shortcut")
        cb.addParameter("name", "下载文件")
        cb.addParameter("input", "text")
        cb.addParameter("text", videoUrl)
        cb.open()
        notify("VideoHelper", "Please select file path to download/请选择路径下载")
        // Safari.open(videoUrl)
        return
      }
    } else {
      notify("VideoHelper", "Invalid URL/无效URL")
    }
}
*/

async function notify(title, body, url) {
  let notification = new Notification()
  notification.title = title
  notification.body = body
  if (url) {
    notification.openURL = url
  }
  return await notification.schedule()
}


let clip = Pasteboard.pasteString()
if (clip == null) {
  const texts = args.plainTexts
  if (texts.length > 0) {
    clip = texts[0]
  } else {
    notify("VideoHelper", "Invalid source/无效来源")
  }
}
await fetchVideo(clip + "")
Script.complete()