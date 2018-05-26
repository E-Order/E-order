//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    // 关于滑动图片的动画，后期可以循环热销菜品等等
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    // 左右导航栏
    navLeftItems:[],
    curNav:1,
    curIndex:0,
    condition:[],
    foodnum:[],
  },
  onLoad: function() {
    var that = this
    wx.request({
      url:'https://private-d2cad-ordermeal.apiary-mock.com/sell/buyer/product/list',
      method: 'GET',
      data: {},
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
        console.log(res.data.data)
        that.setData({
          imgUrls: res.data.data[0],
          navLeftItems: res.data.data
        })
        setTimeout(function () {
          that.setData({
            loadingHidden: true
          })
        }, 1500)
        var array_num = new Array()
        var array_condition = new Array()
        var len1 = res.data.data.length
        for (var i = 0; i < len1; i++) {
          array_num[i] = new Array();
          array_condition[i] = new Array();
          var len2 = res.data.data[i].foods.length
          for (var j = 0; j < len2; j++) {
            array_num[i][j] = 0;
            array_condition[i][j] = true;
          }
        }
        that.setData({
          condition: array_condition,
          foodnum: array_num,
        })
      }
    })
  },

  // 事件处理函数
  choosefoodtype: function(e) {
    let type = e.target.dataset.type,
    index = parseInt(e.target.dataset.index);
    this.setData({
      curNav:type,
      curIndex:index
    })
  },
  selectproduct:function(e) {
    
  },
  add_to_cart:function(e) {
    var that = this;
    let row = this.data.curIndex;
    let col = parseInt(e.target.dataset.colindex);
    console.log(row, col);
    var array_num = new Array();
    var array_condition = new Array();
    let len1 = this.data.condition.length;
    for (var i = 0; i < len1; i++) {
      array_num[i] = new Array();
      array_condition[i] = new Array();
      var len2 = this.data.condition[i].length
      for (var j = 0; j < len2; j++) {
        array_num[i][j] = this.data.foodnum[i][j];
        array_condition[i][j] = this.data.condition[i][j];
      }
    }
    array_num[row][col] = 1;
    array_condition[row][col] = false;
    
    console.log(array_num);
    console.log(array_condition);
    that.setData({
      condition: array_condition,
      foodnum: array_num,
    })
  },
  addfood: function (e){
    var that = this;
    let row = this.data.curIndex;
    let col = parseInt(e.target.dataset.colindex);
    console.log(row, col);
    var array_num = new Array();
    let len1 = this.data.foodnum.length;
    for (var i = 0; i < len1; i++) {
      array_num[i] = new Array();
      var len2 = this.data.foodnum[i].length
      for (var j = 0; j < len2; j++) {
        array_num[i][j] = this.data.foodnum[i][j];
      }
    }
    array_num[row][col]++;
    that.setData({
      foodnum: array_num,
    })
  },
  subfood: function (e) {
    var that = this;
    let row = this.data.curIndex;
    let col = parseInt(e.target.dataset.colindex);
    console.log(row, col);
    var array_num = new Array();
    var array_condition = new Array();
    let len1 = this.data.condition.length;
    for (var i = 0; i < len1; i++) {
      array_num[i] = new Array();
      array_condition[i] = new Array();
      var len2 = this.data.condition[i].length
      for (var j = 0; j < len2; j++) {
        array_num[i][j] = this.data.foodnum[i][j];
        array_condition[i][j] = this.data.condition[i][j];
      }
    }
    if (array_num[row][col] > 0) {
      array_num[row][col]--;
    }
    if (array_num[row][col] == 0) {
      array_condition[row][col] = true;
    }

    console.log(array_num);
    console.log(array_condition);
    that.setData({
      condition: array_condition,
      foodnum: array_num,
    })
  },
  onHide:function() {
    wx.setStorage({
      key: 'navLeftItems',
      data: this.data.navLeftItems,
    })
    wx.setStorage({
      key: 'foodnum',
      data: this.data.foodnum,
    })
    wx.setStorage({
      key: 'curIndex',
      data: this.data.curIndex,
    })
  }
})
