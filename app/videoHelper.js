// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// always-run-in-app: true; icon-color: purple;
// icon-glyph: download; share-sheet-inputs: plain-text;

const _info = {
    name: 'videoHelper',
    version: '1.4',
    updated_at: '2024-11-14 12:45:00',
    author: 'raoyc',
    description: 'download video from Chinese pop short-video apps, such as douyin, kuaishou, weibo and so on',
    repo_file_url: 'https://github.com/ycrao/scripts-for-scriptable/blob/main/app/videoHelper.js',
    raw_file_url: ' https://raw.githubusercontent.com/ycrao/scripts-for-scriptable/main/app/videoHelper.js'
}

const $http = importModule("http.module")

// 本次解析服务额外依赖
async function encryptParams(jsonData) {
  const jsonStr = JSON.stringify(jsonData);
  const webView = new WebView()
  await webView.loadHTML('', 'https://www.xiazaitool.com/dy')
  // await webView.present(false)
  let jsStr = `
function encrypt(str) {
  // 密钥--应和后台java解密或是前台js解密的密钥保持一致（16进制）
  var key = CryptoJS.enc.Utf8.parse("aLr8011v82deTFQwCZd1wCcD");
  // 偏移量
  var srcs = CryptoJS.enc.Utf8.parse(str);
  // 算法
  var encrypted = CryptoJS.AES.encrypt(srcs, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  // 替换--防止值为“1”的情况
  var reg = new RegExp('/', "g"); 
  return encrypted.toString().replace(reg, "#");
}
function loadScript(url, callback) {
  const script = document.createElement("script")
  script.type = "application/javascript"
  script.src = url
  document.getElementsByTagName('head')[0].appendChild(script);
  script.onload = function() {  
    var params = '${jsonStr}';
    var encryptedStr = encrypt(params);
    callback(encryptedStr)
  }
}
const scriptUrl = 'https://www.xiazaitool.com/parseVideo/js/crytool.js'
loadScript(scriptUrl, (encryptedStr) => {
  completion(encryptedStr)
})
  `
  const encryptedStr = await webView.evaluateJavaScript(jsStr, true)
  jsonData.params = encryptedStr;
  return jsonData
}

async function fetchVideo(clip) {
  const re = /(http|https):\/\/([a-zA-Z0-9.:?=&-/%#]+)/g
  const result = clip.match(re)
  console.log(result)
  if (result != null && result[0] !== undefined) {
      const dyUrl = result[0]
      const apiUrl = "https://www.xiazaitool.com/video/parseVideoUrl"
      let params = {
        url: dyUrl,
        platform: 'douyin',
      }
      const encryptedParams = await encryptParams(params)
      json = await $http.req(
        'post', 
        apiUrl, 
        encryptedParams,
        {
          'Timestam': new Date().getTime()
        }
      ).loadJSON()
      console.log(json)
      if (json.status == 200) {
        let videoUrl = json.data.voideDeatilVoList[0]['url']
        const cb = new CallbackURL("shortcuts://x-callback-url/run-shortcut")
        cb.addParameter("name", "下载文件")
        cb.addParameter("input", "text")
        cb.addParameter("text", videoUrl)
        cb.open()
        notify("VideoHelper", "Please select file path to download/请选择路径下载")
        return
      }
  } 
}

// 该接口已也失效，并改名为 _fetchVideo3，之前仅支持 `抖音` 与 `tiktok` 2个平台无水印视频下载，
/*
async function fetchVideo3(clip) {
    const re = /(http|https):\/\/([a-zA-Z0-9.:?=&-/%#]+)/g
    const result = clip.match(re)
    console.log(result)
    if (result != null && result[0] !== undefined) {
        const dyUrl = result[0]
        const apiUrl = "https://www.tikdd.cc/g1.php"
        let param = {
          url: dyUrl,
          count: 12,
          cursor: 0,
          web:1,
          hd:1
        }
        json = await $http.postForm(apiUrl, param).loadJSON()
        console.log(json)
        if (json.code == 0) {
          let videoUrl = json.data.play
          const cb = new CallbackURL("shortcuts://x-callback-url/run-shortcut")
          cb.addParameter("name", "下载文件")
          cb.addParameter("input", "text")
          cb.addParameter("text", videoUrl)
          cb.open()
          notify("VideoHelper", "Please select file path to download/请选择路径下载")
          return
        }
    } 
}
*/

// 该接口已也失效，并改名为 _fetchVideo2
/*
async function _fetchVideo2(clip) {
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
*/
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
