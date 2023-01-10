// webview_demo.js
// only run in `Scriptable` app

// ----- just open url by system browser
Safari.open("https://bing.com")
Safari.openInApp("https://bing.com", true)

// ----- webview render
let htmlStr = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ShowTime</title>
    <style type="text/css">
    body {
      background-color: #f1f1f1;
    }
    p {
      font-size: 14px;
      font-family: "Heiti SC";
      text-align: center;
    }
    </style>
</head>
<body>
    <p>now time is: <span id="timeBox"></span></p>
    <script type="text/javascript">
        let timeBox = document.getElementById("timeBox");
        function showTime() {
            let date = new Date();
            let year = date.getFullYear(),
            month = date.getMonth() + 1,
            day = date.getDate(),
            hour = date.getHours(),
            minute = date.getMinutes(),
            second = date.getSeconds();
            let timeStr = year + '-' + normalize(month) + '-' + normalize(day) + ' ' + normalize(hour) + ':' + normalize(minute) + ':' + normalize(second);
            timeBox.innerHTML = timeStr;
        }
        function normalize(timeNumber) {
            return timeNumber < 10 ? ("0" + timeNumber) : timeNumber;
        }
        setInterval(showTime, 1000);
    </script>
</body>
</html>
`

WebView.loadHTML(htmlStr)

let jsStr = `Math.PI`
let webview = new WebView()
let pi = await webview.evaluateJavaScript(jsStr)
console.log("pi ≈ " + pi)