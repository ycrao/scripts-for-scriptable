// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-green; icon-glyph: file-powerpoint;

const _info = {
  name: 'acgPPT',
  version: '1.0',
  updated_at: '2023-12-05 10:30:00',
  author: 'ycrao',
  description: 'PowerPoint slideshow for ACG, powered by r10086.com',
  repo_file_url: 'https://github.com/ycrao/scripts-for-scriptable/blob/main/app/acgPPT.js',
  raw_file_url: 'https://raw.githubusercontent.com/ycrao/scripts-for-scriptable/main/app/acgPPT.js' 
}

async function ppt(topic) {
  
  let htmlStr = `
  <body>
  <style>
      html,
      body {
          margin: 0;
          width: 100%;
          height: 100%;
      }
  </style>
  <div id="dynamic-background" style="width: 100%; height: 100%; position: fixed;z-index: -1;">
      <script>
          window.addEventListener("load", function(e){
              document.getElementById("dynamic-background").innerHTML = '<iframe src="https://api.r10086.com/PPT/PPT2.php?PPT=${topic}" width="100%" height="100%" style="border: 0;"></iframe>';
                 });
      </script>
  </div>
  </body>
  `
  const wb = new WebView()
  wb.loadHTML(htmlStr)
  wb.present()
}

const topics = [
  "赛马娘", "东京食尸鬼", "Fate", 
  "为美好世界献上祝福", "某科学的超电磁炮", 
  "原神", "神奇宝贝", "龙珠", 
  "罪恶王冠", "鬼灭之刃", "火影忍者",
  "海贼王", "进击的巨人", "零开始的异世界生活",
  "刀剑神域", "钢之炼金术师", "妖精的尾巴",
  "缘之空"
]
const length = topics.length
const randomTopic = topics[Math.floor(Math.random()*(length-1))]
console.log(randomTopic)
ppt(randomTopic)
