// uitable_demo.js
// only run in `Scriptable` app
const table = new UITable()
table.showSeparators = true
let financeNews = [
  {
    "title": "重磅数据公布！2022年存款增超26万亿",
    "link": "https://finance.sina.com.cn/stock/zqgd/2023-01-11/doc-imxztruc8976258.shtml"
  },
  {
    "title": "重磅！默沙东新冠口服药首发报价一瓶1500元 效果如何",
    "link": "https://finance.sina.com.cn/jjxw/2023-01-11/doc-imxztruc8983384.shtml",
  },
  {
    "title": "特斯拉“以价换量”能玩多久",
    "link": "https://finance.sina.com.cn/jjxw/2023-01-11/doc-imxzuhrv8882848.shtml"
  },
   {
    "title": "套娃式充会员，智能时代看电视更麻烦了？",
    "link": "https://finance.sina.com.cn/jjxw/2023-01-11/doc-imxzuhru2101455.shtml"
  },
  {
    "title": "手机“联姻”卫星通信，是噱头还是刚需",
    "link": "https://finance.sina.com.cn/tech/tele/2022-11-07/doc-imqqsmrp5184074.shtml",
  },
  {
    "title": "LPR利率三连降 全国首套房贷利率今年或“奔三”",
    "link": "https://finance.sina.com.cn/stock/roll/2023-01-10/doc-imxzrnva2311658.shtml"
  }
]
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
const cIcon = UITableCell.imageAtURL("https://n.sinaimg.cn/finance/app2018/images/finance_logo.png")
cIcon.widthWeight = 10
cIcon.leftAligned()
const cTitle = UITableCell.text("最新热门财经新闻", "from Sina")
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
financeNews.forEach((item) => {
  const r = new UITableRow()
  r.height = 75
  const c1 = UITableCell.text(item.title)
  c1.titleColor = new Color(colors[2], 0.8)
  c1.leftAligned()
  c1.widthWeight = 100
  const c2 = UITableCell.button("去阅读")
  c2.onTap = async () => {
     Safari.open(item.link)
  }
  c2.rightAligned()
  c2.widthWeight = 20
  r.addCell(c1)
  r.addCell(c2)
  table.addRow(r)
})
table.present()