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
    
    navLeftItems:[], // api中所有的data数据，建议编码时同时打开api网站
    curNav:1,  // 当前导航栏
    curIndex:0,  // 当前导航栏对应的index
    foodnum:[],   // 存储每个食物的数量，二维数组，分别对应data类别中的某个食物的数量
  },
  // onload函数，从api获得数据，但是我觉得应该把里面所有的函数都改到onshow中去
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
          imgUrls: res.data.data[0],  // 滑动图片来源于热榜
          navLeftItems: res.data.data
        })
        setTimeout(function () {
          that.setData({
            loadingHidden: true
          })
        }, 1500)
        // 初始化foodnum，这种初始化很麻烦，需要一个一个的复制，希望可以解决
        var array_num = new Array()
        var len1 = res.data.data.length
        for (var i = 0; i < len1; i++) {
          array_num[i] = new Array();
          var len2 = res.data.data[i].foods.length
          for (var j = 0; j < len2; j++) {
            array_num[i][j] = 0;
          }
        }
        that.setData({
          foodnum: array_num,
        })
      }
    })
  },

  // 选择导航栏食物类别，index来源于wxml
  choosefoodtype: function(e) {
    let type = e.target.dataset.type,
    index = parseInt(e.target.dataset.index);
    this.setData({
      curNav:type,
      curIndex:index
    })
  },
  // 点击食物，跳转到食物详情界面，食物详情界面还没有画，但是已经建好了文件夹
  //，可以实现跳转到空白页面，并传递食物的所有数据
  selectproduct:function(e) {
    
  },
  // 添加购物车，购物车图片变为加减号
  add_to_cart:function(e) {
    var that = this;
    let row = this.data.curIndex;  // 食物类别下标
    let col = parseInt(e.target.dataset.colindex); // 食物类别中的具体点击的食物下标
    console.log(row, col);
    // 更新 foodnum，很麻烦，要一个一个的赋值，希望找到简单的更新方法
    var array_num = new Array();
  
    let len1 = this.data.foodnum.length;
    for (var i = 0; i < len1; i++) {
      array_num[i] = new Array();
      var len2 = this.data.foodnum[i].length
      for (var j = 0; j < len2; j++) {
        array_num[i][j] = this.data.foodnum[i][j];
      }
    }
    array_num[row][col] = 1;
    console.log(array_num);
    that.setData({
      foodnum: array_num,
    })
  },
  // 内容同上个函数差不多
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
  // 内容同上个函数，差不多，但是要判断是否减为0，减为0时，要变为购物车图标
  subfood: function (e) {
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
    if (array_num[row][col] > 0) {
      array_num[row][col]--;
    }

    console.log(array_num);
  
    that.setData({
      foodnum: array_num,
    })
  },
  // 我选择在onhide时进行数据传递，数据传递的方式是通过本地的存储，传递的数据是foodnum，
  //整个数据库的data，以及当前的导航栏
  onHide:function() {
    wx.setStorage({
      key: 'navLeftItems',
      data: this.data.navLeftItems,
    })
    wx.setStorage({
      key: 'foodnum',
      data: this.data.foodnum,
    })
    
  },
  onShow:function() {
    var that = this
     wx.getStorage({
      key: 'foodnum',
      success: function (res) {
        console.log("foodnuminindex",res.data)
        that.setData({
          foodnum: res.data,
        })
      }
    })
  }
})
