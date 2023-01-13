# scripts-for-scriptable

>   Just as its name.

[iOS Scriptable](https://scriptable.app/) | [TestFlight](https://testflight.apple.com/join/uN1vTqxk) | [macOS Scriptable](https://scriptable.app/mac-beta/)

### demo

>   Some component demos.

- [request_demo](demo/request_demo.js)
- [alert_demo](demo/alert_demo.js)
- [dictation_demo](demo/dictation_demo.js)
- [speech_demo](demo/speech_demo.js)
- [location_demo](demo/location_demo.js)
- [message_demo](demo/message_demo.js)
- [keychain_demo](demo/keychain_demo.js)
- [webview_demo](demo/webview_demo.js)
- [uitable_demo](demo/uitable_demo.js) support light and dark appearance
- [widget_demo](demo/widget_demo.js) a widget to show Chinese poetry

#### screenshot


![alert_demo](screenshot/alert_demo.png)

![webview_demo](screenshot/webview_demo.png)

![uitable_demo](screenshot/uitable_demo.png)

![widget_demo](screenshot/widget_demo.png)



### module or library

- [spark-md5.min.js](app/spark-md5.min.js) code from [js-spark-md5](https://github.com/satazor/js-spark-md5)
- [cache.module](app/cache.module.js)
- [http.module](app/http.module.js)

#### usage

```js
// using md5 hash
const sparkMD5 = importModule("spark-md5.min");
let hash = sparkMD5.hash("hi, there")
console.log(hash)

// using cache module
const $cache = importModule("cache.module")

// impl by Keychain
// note: you can pass prefix string to isolate different app
let sCache = $cache.useSecureStorage('prefixForApp1')
sCache.set("hello", "world")
let sVal = sCache.get("hello")
console.log(sVal)

// impl by FileManager
// note: you can pass prefix string to isolate different app
let fCache = $cache.useFileStorage('prefixForApp2')
fCache.set("hello", "world")
let fVal = fCache.get("hello")
console.log(fVal)

// using http module
const $http = importModule("http.module")
$http.req('get', 'https://httpbin.org/ip').loadJSON().then(resp => {
    let ip = resp.origin
    console.log(ip);
});
```

### app

#### zhihuHot

>   展示知乎热点，建议提前安装好知乎 App，以方便点击跳转，源代码 [zhihuHot](app/zhihuHot.js)，依赖同目录下 `http.module` 与 `cache.module` 模块。

预览图如下：

![zhihuHot](screenshot/zhihuHot.png)

#### priceReminder

>   贵金属价格提醒器，展示 `XAUUSD/XAGUSD/Au(T+D)/Ag(T+D)` 等价格，数据来源新浪财经，由于 widget 机制，价格刷新不及时。

预览图如下：

![priceReminder](screenshot/priceReminder.png)

