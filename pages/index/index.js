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
    
    // api中所有的data数据，建议编码时同时打开api网站
    navLeftItems:[],
    // 当前导航栏
    curNav:1,
    // 当前导航栏对应的index
    curIndex:0,
    // 存储每个食物的数量，二维数组，分别对应data类别中的某个食物的数量
    foodNum:[],
  },
  
  // onload函数，从api获得数据，但是我觉得应该把里面所有的函数都改到onshow中去
  /**
   * @method onLoad
   * @param options
   * @desc 首先判断是否通过扫描二维码进入该小程序，之后再从服务器获取相应商家数据
   */
  onLoad: function(options) {
    if ((options.tableNo !== undefined) && (options.sellerId !== undefined)) {
      // 通过扫描二维码进入小程序
      console.log("扫码获得商家ID和桌号");
      app.globalData.tableNo = parseInt(decodeURIComponent(options.tableNo));
      app.globalData.sellerId = decodeURIComponent(options.sellerId);
    } else {
      if ((app.globalData.tableNo !== null) && (app.globalData.sellerId !== null)) {
        // 由于app.globalData.tableNo和app.globalData.sellerId初始化为null
        // 若两者都不为null时，证明已经通过error页面扫描二维码获取相应的参数
        console.log("商家ID和桌号不为空");
      } else {
        // 不是通过扫描二维码进入小程序，跳转到error页面，强制扫码
        console.log("不是扫码获得商家ID和桌号");
        wx.redirectTo({
          url:'../components/error/error'
        });
      }
    }
    // 从服务器获取相应商家数据
    this.getFood();
    // 从服务器获取用户的openId
    app.getOpenId({});
  },

  // 我选择在onhide时进行数据传递，数据传递的方式是通过本地的存储，传递的数据是foodNum，
  // 整个数据库的data，以及当前的导航栏
  /**
   * @method onHide
   * @desc 进行数据传递，数据传递的方式是通过本地的存储，传递的数据是foodNum，
   * 整个数据库的data，以及当前的导航栏
   */
  onHide:function() {
    wx.setStorage({
      key: 'navLeftItems',
      data: this.data.navLeftItems,
    });
    wx.setStorage({
      key: 'foodNum',
      data: this.data.foodNum,
    });
  },

  /**
   * @method onShow
   * @desc 当重新返回该页面的时候，调用函数setFoodNum()来赋值foodNum
   */
  onShow:function() {
    this.setFoodNum();
    console.log("foodNum", this.data.foodNum);
  },

  /**
   * @method initArray
   * @param {Number} num 数组长度
   * @param {Number} val 数组的初始化值
   * @returns {Array} arr 长度为num,值为val的数组
   * @desc 实现数组的初始化
   */
  initArray: function(num, val) {
    var arr = [];
    for (var i = 0; i < num; i++) {
      arr[i] = val;
    }
    console.log('initArray_arr.fill:', arr);
    return arr;
  },

  /**
   * @method initData
   * @param res 从服务器获得的菜单数据
   * @desc 实现该页面数据的初始化
   */
  initData: function(res) {
    var arr = [];
    let len1 = res.data.data.length;
    for (var i = 0; i < len1; i++) {
      var len2 = res.data.data[i].foods.length;
      arr[i] = this.initArray(len2, 0);
    }
    this.setData({
      // 滑动图片来源于热榜
      imgUrls: res.data.data[0],
      navLeftItems: res.data.data,
      foodNum: arr
    });
  },

  /**
   * @method getFood
   * @desc 通过调用服务器的API来获得相应商家的菜单信息
   */
  getFood: function() {
    var that = this;
    wx.request({
      url: config.service.getProductUrl,
      method: 'GET',
      data: {
        'sellerId': app.globalData.sellerId
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
        console.log("foodlist",res.data);
        setTimeout(function () {
          that.setData({
            loadingHidden: true
          })
        }, 1500);
        that.initData(res);
      }
    });
  },

  /**
   * @method setFoodNum
   * @desc 改变foodNum中的数据, 以便使得和购物车显示同步
   */
  setFoodNum:function() {
    var that = this;
    wx.getStorage({
      key: 'foodNum',
      success: function(res) {
        that.setData({
          foodNum: res.data,
        });
      }
    });
  },

  /**
   * @method chooseFoodType
   * @param e
   * @desc 选择导航栏食物类别, index来源于wxml
   */
  chooseFoodType: function(e) {
    let type = e.target.dataset.type;
    let index = parseInt(e.target.dataset.index);
    this.setData({
      curNav: type,
      curIndex: index
    });
  },

  /**
   * @method selectProduct
   * @param e
   * @desc 点击食物，跳转到食物详情界面
   */
  selectProduct:function(e) {},

  /**
   * @method AddToCart
   * @param e
   * @desc 添加购物车，购物车图片变为加减号
   */
  AddToCart:function(e) {
    var that = this;
    // 食物类别下标
    let row = this.data.curIndex;
    // 食物类别中的具体点击的食物下标
    let col = parseInt(e.target.dataset.colindex);
    console.log(row, col);
    var arr = this.data.foodNum;
    arr[row][col] = 1;
    console.log(arr);
    that.setData({
      foodNum: arr,
    });
  },

  /**
   * @method addFood
   * @param e
   * @desc 增加购物车中食物的数量
   */
  addFood: function (e){
    var that = this;
    let row = this.data.curIndex;
    let col = parseInt(e.target.dataset.colindex);
    console.log(row, col);
    var arr = this.data.foodNum;
    arr[row][col]++;
    console.log(arr);
    that.setData({
      foodNum: arr,
    });
  },

  /**
   * @method subFood
   * @param e
   * @desc 减少购物车中食物的数量, 但是要判断是否减为0，减为0时，要变为购物车图标
   */
  subFood: function (e) {
    var that = this;
    let row = this.data.curIndex;
    let col = parseInt(e.target.dataset.colindex);
    console.log(row, col);
    var arr = this.data.foodNum;
    if (arr[row][col] > 0) {
      arr[row][col]--;
    }
    console.log(arr);
    that.setData({
      foodNum: arr,
    });
  }
})
