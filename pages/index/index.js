//index.js
//获取应用实例
const app = getApp()

var config = require('../../config')

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
  onLoad: function(options) {
    if ((options.tableNo !== undefined) && (options.sellerId !== undefined)) {
      console.log("扫码获得商家ID和桌号")
      app.globalData.tableNo = parseInt(decodeURIComponent(options.tableNo))
      app.globalData.sellerId = decodeURIComponent(options.sellerId)
    } else {
      if ((app.globalData.tableNo !== null) && (app.globalData.sellerId !== null)) {
        console.log("商家ID和桌号不为空")
      } else {
        console.log("不是扫码获得商家ID和桌号")
        wx.redirectTo({
          url:'../components/Error/Error'
        })
      }
    }

    this.getFood()
    app.getUserInfo({})
    app.getOpenId({})
  },

  // 我选择在onhide时进行数据传递，数据传递的方式是通过本地的存储，传递的数据是foodnum，
  // 整个数据库的data，以及当前的导航栏
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
    this.setFoodnum()
    console.log("foodnum", this.data.foodnum)
  },

  /* ********************
  ** 初始化数组 initarray
  ** 通过调用函数实现数组的初始化
  ** 参数 : num为数组的大小, val为数组的初始化值
  ** 返回值 : arr, 数组
  ******************** */
  initarray: function(num, val) {
    var arr = new Array();
    for (var i = 0; i < num; i++) {
      arr[i] = val;
    }
    // arr.fill(val, 0, num)
    console.log('arr.fill:', arr)
    return arr;
  },

  /* ********************
  ** 初始化数据 initdata
  ** 通过调用函数实现数据的初始化
  ** 参数 : res是从后台获得的数据
  ** 返回值 : 无
  ******************** */
  initdata: function(res) {
    var array_num = new Array()
    let len1 = res.data.data.length
    for (var i = 0; i < len1; i++) {
      var len2 = res.data.data[i].foods.length
      array_num[i] = this.initarray(len2, 0);
    }
    this.setData({
      imgUrls: res.data.data[0], // 滑动图片来源于热榜
      navLeftItems: res.data.data,
      foodnum: array_num
    })
  },

  /* ********************
  ** 获取食物 getFood
  ** 通过后台API获得相应的菜单信息
  ** 参数 : 无
  ** 返回值 : 无
  ******************** */
  getFood: function() {
    var that = this
    wx.request({
      // url:config.service.getProductUrl,
      url:'http://123.207.7.251:8080/eorder/buyer/product/list',
      method: 'GET',
      data: {
        'sellerId': app.globalData.sellerId
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
        console.log("foodlist",res.data)
        setTimeout(function () {
          that.setData({
            loadingHidden: true
          })
        }, 1500)
        that.initdata(res)
      }
    })
  },

  /* ********************
  ** setFoodnum
  ** 改变foodnum中的数据, 以便使得和购物车显示同步
  ** 参数 : 无
  ** 返回值 : 无
  ******************** */
  setFoodnum:function() {
    var that = this
    wx.getStorage({
      key: 'foodnum',
      success: function(res) {
        that.setData({
          foodnum: res.data,
        })
      }
    })
  },

  /* ********************
  ** 食物类别 choosefoodtype
  ** 选择导航栏食物类别, index来源于wxml
  ** 参数 : 无
  ** 返回值 : 无
  ******************** */
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
  /* ********************
  ** 查看食物 selectproduct
  ** 点击食物，跳转到食物详情界面
  ** 参数 : 无
  ** 返回值 : 无
  ******************** */
  selectproduct:function(e) {
    
  },

  /* ********************
  ** 添加购物车 add_to_cart
  ** 添加购物车，购物车图片变为加减号
  ** 参数 : 无
  ** 返回值 : 无
  ******************** */
  add_to_cart:function(e) {
    var that = this;
    let row = this.data.curIndex;  // 食物类别下标
    let col = parseInt(e.target.dataset.colindex); // 食物类别中的具体点击的食物下标
    console.log(row, col);
    // 更新 foodnum，很麻烦，要一个一个的赋值，希望找到简单的更新方法
    // var array_num = new Array();
  
    // let len1 = this.data.foodnum.length;
    // for (var i = 0; i < len1; i++) {
    //   array_num[i] = new Array();
    //   var len2 = this.data.foodnum[i].length
    //   for (var j = 0; j < len2; j++) {
    //     array_num[i][j] = this.data.foodnum[i][j];
    //   }
    // }
    // array_num[row][col] = 1;
    var array_num = this.data.foodnum
    array_num[row][col] = 1
    console.log(array_num)
    that.setData({
      foodnum: array_num,
    })
  },

  /* ********************
  ** 添加食物 addfood
  ** 添加购物车中食物的数量
  ** 参数 : 无
  ** 返回值 : 无
  ******************** */
  addfood: function (e){
    var that = this;
    let row = this.data.curIndex;
    let col = parseInt(e.target.dataset.colindex);
    console.log(row, col);
    var array_num = this.data.foodnum
    array_num[row][col]++
    console.log(array_num)
    that.setData({
      foodnum: array_num,
    })
  },

  /* ********************
  ** 减少食物 subfood
  ** 减少购物车中食物的数量, 但是要判断是否减为0，减为0时，要变为购物车图标
  ** 参数 : 无
  ** 返回值 : 无
  ******************** */
  subfood: function (e) {
    var that = this;
    let row = this.data.curIndex;
    let col = parseInt(e.target.dataset.colindex);
    console.log(row, col);
    var array_num = this.data.foodnum
    if (array_num[row][col] > 0) {
      array_num[row][col]--;
    }
    console.log(array_num);
    that.setData({
      foodnum: array_num,
    })
  }
})
