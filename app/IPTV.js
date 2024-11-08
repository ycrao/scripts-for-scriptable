// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: red; icon-glyph: tv;

const _info = {
  name: 'IPTV',
  version: '1.0',
  updated_at: '2024-11-08 16:00:00',
  author: 'ycrao',
  description: 'watch IPTV on iPhone',
  repo_file_url: 'https://github.com/ycrao/scripts-for-scriptable/blob/main/app/IPTV.js',
  raw_file_url: 'https://raw.githubusercontent.com/ycrao/scripts-for-scriptable/main/app/IPTV.js' 
}

const $http = importModule("http.module")
// 默认使用的是 fanmingming ipv6 源 <https://github.com/fanmingming/live/blob/main/tv/m3u/ipv6.m3u>
// 如果嫌此源不合适，请参考本 json 格式，编写自己的源
const categories = await $http.req("get", "https://raoyc.com/svtv/static/20241107_fmm_iptv.json").loadJSON()
const table = new UITable()
table.showSeparators = true
let colors = [
  '#000000',
  '#999999',
  '#212121'
]
const colorsInDark = [
  '#d4fb79',
  '#ffffff',
  '#e9df76'
]
if (Device.isUsingDarkAppearance()) {
  colors = colorsInDark
}
const row = new UITableRow()
row.height = 100
const cIcon = UITableCell.imageAtURL("https://raoyc.com/svtv/static/appicon.png")
cIcon.widthWeight = 10
cIcon.leftAligned()
const cTitle = UITableCell.text("IPTV", "使用 fanmingming IPv6 源 by ycrao")
cTitle.titleColor = new Color(colors[0], 1)
cTitle.subtitleColor = new Color(colors[1], 0.8)
// const font = new Font("Heiti SC", 28)
const font = Font.boldMonospacedSystemFont(28)
cTitle.titleFont = font
cTitle.widthWeight = 150
cTitle.rightAligned()
row.addCell(cIcon)
row.addCell(cTitle)
table.addRow(row)
categories.forEach((category) => {
  const tr = new UITableRow()  
  tr.height = 75
  const t = UITableCell.text(category.name)
  t.titleColor = new Color(colors[2], 1)
  t.centerAligned()
  t.widthWeight = 100
  tr.addCell(t)
  table.addRow(tr)
  category.channels.forEach((channel) => {
    const r = new UITableRow()  
    r.height = 50
    const c1 = UITableCell.text(channel.name)
    c1.titleColor = new Color(colors[2], 0.8)
    c1.leftAligned()
    c1.widthWeight = 100
    const c2 = UITableCell.button("去观看")
    c2.onTap = async () => {
      const qs = $http.qs({url: channel.url, channel: channel.name})
      // 这里使用非 http 播放器链接， 以减少 https 页面加载 http 资源受限错误
      // 如还是不能播放，请检查当前手机网络是否支持 ipv6 或者 打开 vconsole 查看控制台报错
      // 某些不支持的视频格式或者跨域等问题可能造成无法播放
      const url = 'http://raoyc.com/svtv/dplayer.html?' + qs
      console.log(url)
      Safari.openInApp(url, true)
    }
    c2.rightAligned()
    c2.widthWeight = 20
    r.addCell(c1)
    r.addCell(c2)
    table.addRow(r)
  })
})
table.present()

