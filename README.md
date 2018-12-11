# 在wexp项目中使用该组件
wexp-easy-canvas是基于wexp框架编写，旨在帮助开发者简单绘制canvas的组件（只需要用户提供一个json格式的数据就自动绘制canvas）

## 安装

```bash
$ npm i wexp-easy-canvas -S --production
```

## 使用

```bash
usingComponents: {
  "k-canvas": "wexp-easy-canvas/index"
}
```

```wxml
<k-canvas id="k-canvas"/>
```

```javascript
// 绘制方法
const canvas = this.selectComponent('#k-canvas')
const options = {}
canvas.draw(options).then(res => {
  // 绘制完成回调
})
```

```javascript
// 获取本地地址并且保存方法
const canvas = this.selectComponent('#k-canvas')
canvas.saveImage().then(res => {
  const wxSaveImageToPhotosAlbum = this.promisify(wx.saveImageToPhotosAlbum)
  wxSaveImageToPhotosAlbum({
    filePath: res.tempFilePath
  }).then(res => {
    wx.showToast({
      title: '已保存到相册'
    })
  }).catch(res => {
    wx.showToast({
      title: '请打开保存相册权限',
      duration: 1000,
      mask: true,
      icon: 'none'
    })
    setTimeout(() => {
      wx.openSetting()
    }, 1000)
  })
})
```

## API
### container (画板大小以及上左距离)
属性 | 含义 | 默认值 | 可选值
---|--------------------|---|---
top | 画板距离容器顶部距离 | | 
left | 画板距离容器左侧距离 | | 
width | 画板宽度 | 0 | 
height | 画板高度 | 0 | 

### nodes (画板内容)
#### image（图片）
属性 | 含义 | 默认值 | 可选值
---|--------------------|---|---
src | 绘制的图片地址 | | 
top | 开始端距离顶部距离 | | 
left | 开始端距离左侧的距离 | | 
width | 要画多宽 | 0 | 
height | 要画多高 | 0 | 
radius | 图片的圆角（支持`20`, `'30, 20'`, `'10, 20, 30, 40'`）| 0 |

#### text（文本）
属性 | 含义 | 默认值 | 可选值
---|---|---|---
content | 绘制文本 | ''（空字符串） | 
color | 颜色 | black | 
fontSize | 字体大小 | 16 | 
textAlign | 文字对齐方式 | left | center、right 
lineHeight | 行高，只有在多行文本中才有用 | 20 | 
top | 文本左上角距离画板顶部的距离 | 0 | 
left | 文本左上角距离画板左侧的距离 | 0 | 
maxLine | 最大行数，当设置了该属性，超出行数内容的显示为... | 2 | 
width | 和 `maxLine` 属性配套使用，`width` 就是达到换行的宽度 |  | 
textDecoration | 显示中划线、下划线效果 | none | overline（上划线）、 underline（下划线）、line-through（中划线）

#### rect (矩形，线条)
属性 | 含义 | 默认值 | 可选值
---|---|---|---
background | 背景颜色 | transparent | 
top | 左上角距离画板顶部的距离 | | 
left | 左上角距离画板左侧的距离 | | 
width | 要画多宽 | 0 | 
height | 要画多高 | 0 | 
radius | 图片的圆角（支持`20`, `'30, 20'`, `'10, 20, 30, 40'`）| 0 |


<details><summary>options结构</summary><br>

```js
{
  container: {
    width: width * 0.8,
    height: width * 1.2,
    left: width * 0.1,
    top: width * 0.1
  },
  nodes: [
    {
      type: 'rect',
      background: '#fff',
      top: 0,
      left: 0,
      width: width * 0.8,
      height: width * 1.2
    },
    {
      type: 'image',
      src: 'https://img.alicdn.com/imgextra/i2/345698811/TB2yCrmXCCI.eBjy1XbXXbUBFXa_!!345698811.jpg',
      width: width * 0.8,
      height: width * 0.8,
      left: 0,
      top: 0
    },
    {
      type: 'rect',
      background: '#98A9C2',
      radius: 5,
      top: width * 0.8 + 10,
      left: 0,
      width: width * 0.8,
      height: 40
    },
    {
      type: 'text',
      content: '欧式抱枕奢华靠垫新古典靠包沙发靠包含芯办公室抱枕轻奢特价包邮',
      fontSize: 14,
      maxLine: 2,
      lineHeight: 20,
      color: '#fff',
      textAlign: 'left',
      width: width * 0.8 - 20,
      top: width * 0.8 + 10,
      left: 10
    },
    {
      type: 'text',
      content: '¥',
      fontSize: 12,
      maxLine: 1,
      color: '#ff5000',
      textAlign: 'left',
      width: 10,
      top: width * 0.8 + 86,
      left: 0
    },
    {
      type: 'text',
      content: '1320',
      fontSize: 20,
      maxLine: 1,
      color: '#ff5000',
      textAlign: 'left',
      width: 60,
      top: width * 0.8 + 80,
      left: 10
    },
    {
      type: 'text',
      content: '¥',
      fontSize: 12,
      maxLine: 1,
      color: '#999',
      textDecoration: 'line-through',
      textAlign: 'left',
      width: 10,
      top: width * 0.8 + 112,
      left: 0
    },
    {
      type: 'text',
      content: '9678',
      fontSize: 14,
      maxLine: 1,
      color: '#999',
      textDecoration: 'line-through',
      textAlign: 'left',
      width: 40,
      top: width * 0.8 + 110,
      left: 10
    },
    {
      type: 'image',
      src: 'https://img.alicdn.com/imgextra/i2/345698811/TB2yCrmXCCI.eBjy1XbXXbUBFXa_!!345698811.jpg',
      width: 80,
      height: 80,
      radius: 40,
      left: width * 0.8 - 80,
      top: width * 0.8 + 60
    }
  ]
}
```
</details> 




