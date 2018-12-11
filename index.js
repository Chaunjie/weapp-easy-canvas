'use strict';

Component({
  externalClasses: ['custom-class'],
  data: {
    show: false,
    container: {},
    nodes: [],
    resolve: '',
    reject: '',
    imageList: '',
    imageTemArr: [],
    ctx: ''
  },
  methods: {
    promisify: function promisify(fn) {
      return function () {
        var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        return new Promise(function (resolve, reject) {
          args.success = function (res) {
            resolve(res);
          };
          args.fail = function (res) {
            reject(res);
          };

          fn(args);
        });
      };
    },
    draw: function draw(options) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        _this.setData({
          container: options.container,
          show: true,
          nodes: options.nodes,
          resolve: resolve,
          reject: reject
        }, function () {
          _this.getImageList(options.nodes);
          _this.loadAllImages();
        });
      });
    },
    getImageList: function getImageList(views) {
      var imageList = views.filter(function (r) {
        return r.type === 'image';
      });
      this.setData({
        imageList: imageList
      });
    },
    loadAllImages: function loadAllImages() {
      var _data = this.data,
          imageList = _data.imageList,
          imageTemArr = _data.imageTemArr,
          reject = _data.reject;

      for (var i = 0; i < imageList.length; i++) {
        (function (i, self) {
          self.getImageInfo(imageList[i].src).then(function (res) {
            imageTemArr.push(res);
            self.setData({
              imageTemArr: imageTemArr
            }, function () {
              if (i === imageList.length - 1) {
                self.startDraw();
              }
            });
          }).catch(function (res) {
            reject(res);
          });
        })(i, this);
      }
    },
    startDraw: function startDraw() {
      var _data2 = this.data,
          ctx = _data2.ctx,
          nodes = _data2.nodes,
          imageTemArr = _data2.imageTemArr,
          container = _data2.container,
          resolve = _data2.resolve;

      for (var i = 0, imageIndex = 0; i < nodes.length; i++) {
        var r = nodes[i];
        switch (r.type) {
          case 'image':
            var imageHeight = r.height || imageTemArr[imageIndex].height * container.width / imageTemArr[imageIndex].width;
            this.drawImage(imageTemArr[imageIndex].path, r.left, r.top, r.width, imageHeight, r.radius || 0);
            imageIndex++;
            break;
          case 'text':
            this.analysisText(r);
            break;
          case 'rect':
            this.drawRect(r);
            break;
        }
      }
      ctx.closePath();
      ctx.draw(false, function () {
        resolve();
      });
    },
    analysisText: function analysisText(params) {
      var ctx = this.data.ctx;

      ctx.save();
      var _params$maxLine = params.maxLine,
          maxLine = _params$maxLine === undefined ? 2 : _params$maxLine,
          _params$color = params.color,
          color = _params$color === undefined ? 'black' : _params$color,
          _params$content = params.content,
          content = _params$content === undefined ? '' : _params$content,
          _params$fontSize = params.fontSize,
          fontSize = _params$fontSize === undefined ? 16 : _params$fontSize,
          _params$top = params.top,
          top = _params$top === undefined ? 0 : _params$top,
          _params$left = params.left,
          left = _params$left === undefined ? 0 : _params$left,
          _params$lineHeight = params.lineHeight,
          lineHeight = _params$lineHeight === undefined ? 20 : _params$lineHeight,
          _params$textAlign = params.textAlign,
          textAlign = _params$textAlign === undefined ? 'left' : _params$textAlign,
          width = params.width,
          _params$textDecoratio = params.textDecoration,
          textDecoration = _params$textDecoratio === undefined ? 'none' : _params$textDecoratio;

      var chr = content.split('');
      var temp = '';
      var row = [];
      ctx.beginPath();
      ctx.setTextBaseline('top');
      ctx.setFontSize(fontSize);
      ctx.setFillStyle(color);
      ctx.setTextAlign(textAlign);
      for (var i = 0; i < chr.length; i++) {
        if (ctx.measureText) {
          temp += chr[i];
          var textWidth = ctx.measureText(temp).width;
          if (textWidth > width) {
            i--; // 这里添加了a-- 是为了防止字符丢失，效果图中有对比
            var newRemp = temp.substring(0, temp.length - 1);
            row.push(newRemp);
            temp = '';
          }
        } else {
          wx.showToast({
            title: '微信版本太低，无法使用 measureText 功能',
            duration: 1000,
            mask: true,
            icon: 'none'
          });
        }
      }
      row.push(temp);

      // 如果数组长度大于最大行数 则截取前几个
      if (row.length > maxLine) {
        var rowCut = row.slice(0, maxLine);
        var rowPart = rowCut[maxLine - 1];
        var test = '';
        var empty = [];
        for (var a = 0; a < rowPart.length; a++) {
          if (ctx.measureText) {
            if (ctx.measureText(test).width < width - fontSize * 2) {
              test += rowPart[a];
            } else {
              break;
            }
          } else {
            wx.showToast({
              title: '微信版本太低，无法使用 measureText 功能',
              duration: 1000,
              mask: true,
              icon: 'none'
            });
          }
        }
        empty.push(test);
        var group = empty[0] + '...';
        rowCut.splice(maxLine - 1, 1, group);
        row = rowCut;
      }
      for (var b = 0; b < row.length; b++) {
        this.drawText(row[b], left, top + b * lineHeight, width, fontSize, color, textAlign, textDecoration);
      }
      ctx.restore();
    },
    getImageInfo: function getImageInfo(url) {
      return new Promise(function (resolve, reject) {
        wx.getImageInfo({
          src: url,
          complete: function complete(res) {
            if (res.errMsg === 'getImageInfo:ok') {
              resolve(res);
            } else {
              reject(new Error('getImageInfo fail'));
            }
          }
        });
      });
    },
    drawImage: function drawImage(path, left, top, width, height, radius) {
      var ctx = this.data.ctx;

      ctx.save();
      if (radius) {
        this.drawCircle(left, top, width, height, radius);
      }
      ctx.drawImage(path, left, top, width, height);
      ctx.restore();
    },
    getRadius: function getRadius(radius) {
      if (typeof radius === 'number') {
        return new Array(4).fill(radius);
      } else if (typeof radius === 'string') {
        var arr = radius.split(',');
        if (arr.length === 2) {
          var newArr = [];
          newArr[0] = newArr[2] = +arr[0];
          newArr[1] = newArr[3] = +arr[1];
          return newArr;
        } else if (arr.length === 4) {
          var _newArr = arr.map(function (r) {
            return +r;
          });
          return _newArr;
        }
      }
    },
    drawCircle: function drawCircle(left, top, width, height, radius) {
      var ctx = this.data.ctx;
      // const r = Math.sqrt(width ** 2 + height ** 2)

      var radiusArr = this.getRadius(radius);
      ctx.setFillStyle('transparent');
      ctx.arc(left + radiusArr[0], top + radiusArr[0], radiusArr[0], Math.PI, Math.PI * 1.5);
      ctx.moveTo(left + radiusArr[0], top);
      ctx.lineTo(left + width - radiusArr[0], top);
      ctx.lineTo(left + width, top + radiusArr[0]);
      ctx.arc(left + width - radiusArr[1], top + radiusArr[1], radiusArr[1], Math.PI * 1.5, Math.PI * 2);
      ctx.lineTo(left + width, top + height - radiusArr[1]);
      ctx.lineTo(left + width - radiusArr[1], top + height);
      ctx.arc(left + width - radiusArr[2], top + height - radiusArr[2], radiusArr[2], 0, Math.PI * 0.5);
      ctx.lineTo(left + radiusArr[2], top + height);
      ctx.lineTo(left, top + height - radiusArr[2]);
      ctx.arc(left + radiusArr[3], top + height - radiusArr[3], radiusArr[3], Math.PI * 0.5, Math.PI);
      ctx.lineTo(left, top + radiusArr[3]);
      ctx.lineTo(left + radiusArr[3], top);
      ctx.fill();
      ctx.closePath();
      ctx.clip();
    },
    drawText: function drawText(text, left, top, width, fontSize, color, textAlign, textDecoration) {
      var ctx = this.data.ctx;

      var rectWidth = ctx.measureText(text).width;
      if (textDecoration === 'overline') {
        this.drawRect({ background: color, top: top, left: left, width: rectWidth, height: 1 });
      } else if (textDecoration === 'line-through') {
        this.drawRect({ background: color, top: top + fontSize / 2 + 1, left: left, width: rectWidth, height: 1 });
      } else if (textDecoration === 'underline') {
        this.drawRect({ background: color, top: top + fontSize, left: left, width: rectWidth, height: 1 });
      }
      ctx.fillText(text, left, top, rectWidth);
    },
    drawRect: function drawRect(params) {
      var ctx = this.data.ctx;

      ctx.save();
      var background = params.background,
          _params$top2 = params.top,
          top = _params$top2 === undefined ? 0 : _params$top2,
          _params$left2 = params.left,
          left = _params$left2 === undefined ? 0 : _params$left2,
          _params$width = params.width,
          width = _params$width === undefined ? 0 : _params$width,
          _params$height = params.height,
          height = _params$height === undefined ? 0 : _params$height,
          _params$radius = params.radius,
          radius = _params$radius === undefined ? 0 : _params$radius;

      if (radius) {
        this.drawCircle(left, top, width, height, radius);
      }
      ctx.setFillStyle(background);
      ctx.fillRect(left, top, width, height);
      ctx.restore();
    },
    saveImage: function saveImage() {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        wx.canvasToTempFilePath({
          canvasId: 'shareCanvas',
          complete: function complete(res) {
            if (res.errMsg === 'canvasToTempFilePath:ok') {
              resolve(res);
            } else {
              reject(res);
            }
          }
        }, _this2);
      });
    }
  },
  ready: function ready() {
    var ctx = wx.createCanvasContext('shareCanvas', this);
    this.setData({
      ctx: ctx
    });
  }
});