// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: yellow; icon-glyph: store-alt;

/*
name: rStore.js
author: raoyc
description: rStore - App for Scriptable
version: v1.0
repo_file_url: https://github.com/ycrao/scripts-for-scriptable/blob/main/app/rStore.js
raw_file_url: https://raw.githubusercontent.com/ycrao/scripts-for-scriptable/main/app/rStore.js
*/
const rStoreUrl = 'https://raoyc.com/rstore/app.html'
const usingICloud = true
class RStore {
  constructor() {
    if (usingICloud) {
      this.fm = FileManager.iCloud()
    } else {
      this.fm = FileManager.local()
    }
    this.request = new Request('')
    this.path = this.fm.documentsDirectory()
  }
  
  formatFileName = (fileName) => {  
    const fileNameStrArr = fileName.split('.')
    const len = fileNameStrArr.length
    if (len > 1) {
     const suffixExt = fileNameStrArr[len - 1]
      if (suffixExt.toLowerCase() == 'js') {
        return `${fileName}`
      }
    }
    return `${fileName}.js`
  }
  
  writeToFile = (fileName, content) => {  
    let formattedFileName = this.formatFileName(fileName)
    const filePath = `${this.path}/${formattedFileName}`
    this.fm.writeString(filePath, content)
  }
  
  fetchContent = async(url, headers = {}, callback = () => {}) => {
    this.request.url = url
    this.request.method = 'GET'
    this.request.headers = {
      ...headers
    }
    const data = await this.request.loadString()
    callback(this.request.response, data)
    return data
  }
  
  injectListener = async() => {
    const event = await webView.evaluateJavaScript(
        `(() => {
          const controller = new AbortController()
          const listener = (e) => {
            completion(e.detail)
            controller.abort()
          }
          window.addEventListener(
            'JBridge',
            listener,
            { signal: controller.signal }
          )
        })()`,
        true
      ).catch((err) => {
        console.error(err)
      })
      
    const { code, data } = event;
    if (code === 'installDep' || code === 'installApp') {
        await this.installScript(data)
    }
      
    await injectListener()
  }
  
  installScript = async(data) => {
    console.log(data)
    let scriptName = data[0]
    let url = data[3]
    console.log(scriptName, url)
    await this.saveFile(scriptName, url)
    await this.notify("rStore", `${scriptName} have been installed`, `scriptable:///run/${encodeURIComponent(scriptName)}`)
    // Safari.open(`scriptable:///run/${encodeURIComponent(scriptName)}`) 
  }
  
  notify = async(title, body, url) => {
    let notification = new Notification()
    notification.title = title
    notification.body = body
    if (url) {
      notification.openURL = url
    }
    return await notification.schedule()
  }
  
  
  saveFile = async(appName, url) => {
    const headerStr = `// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: laptop-code;\n
    `
    const content = await this.fetchContent(url)
    const scriptableFileString = content.includes('icon-color') ? content : `${headerStr}${content}`
    this.writeToFile(appName, scriptableFileString)
  }
  
  renderAppStore = async() => {
    const wv = new WebView()
    await wv.loadURL(rStoreUrl)
    const injectListener = async () => {
      const event = await wv.evaluateJavaScript(    
          `(() => {  
              const controller = new AbortController()
              const listener = (e) => {
              completion(e.detail)
              controller.abort()
            }
            window.addEventListener(
              'JBridge',
              listener,
              { signal: controller.signal }
            )
          })()`,
            true
          ).catch((err) => {
            console.error(err);
          });  
      const { code, data } = event;  
      if (code === 'installDep' || code === 'installApp') {  
        await this.installScript(data); 
      }
      await injectListener() 
    }
    injectListener().catch((e) => {
      console.log(e);
    });
    await wv.present()
  }
  
}

rStore = new RStore()
rStore.renderAppStore()


