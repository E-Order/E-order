// pages/components/myorder/myorder.js
const app = getApp()

var config = require('../../../config.js')
var util = require('../../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders: [],
    orderDetail: [],
    temporderDetail: [],
    ordernum: 0
  },

  /**
   * @method onLoad
   * @desc 生命周期函数--监听页面加载, 同时向服务器获取该用户的订单信息
   */
  onLoad: function (options) {
    this.getOrderList();
  },

  /**
   * @method onReady
   * @desc 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * @method onShow
   * @desc 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * @method onHide
   * @desc 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * @method onUnload
   * @desc 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * @method onPullDownRefresh
   * @desc 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * @method onReachBottom
   * @desc 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * @method onShareAppMessage
   * @desc 用户点击右上角分享
   */
  onShareAppMessage: function () {},

  /**
   * @method getOrderList
   * @desc 从后台服务器获取该用户的订单号(orderId)
   */
  getOrderList: function() {
    var that = this;
    wx.request({
      url: config.service.getOrderListUrl,
      data: {
        'openid': app.globalData.openId,
        'sellerId': app.globalData.sellerId,
        'page': 0,
        'size': 10
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: function(res) {
        // console.log("orders:", res.data.data)
        setTimeout(function () {
          that.setData({
            loadingHidden: true
          });
        }, 1500);
        that.setData({
          orders: res.data.data,
          ordernum: res.data.data.length
        });
        console.log("orders:", that.data.orders);
        console.log("ordernum:", that.data.ordernum);
        that.getAllOrderDetails();
      }
    });
  },

  /**
   * @method getAllOrderDetails
   * @desc 根据获得的orderId，依次访问服务器获得相应的订单信息
   * 使得做成了包含所有订单的界面(参考Ue鲜果)
   */
  getAllOrderDetails: function() {
    var len = this.data.orders.length;
    console.log("orderslen:", len);
    for (var i = 0; i < len; i++) {
      console.log('all details-orderId:', this.data.orders[i].orderId);
      this.getOrderDetails(this.data.orders[i].orderId);
    }
  },

  /**
   * @method getOrderDetails
   * @param orderId
   * @desc 根据参数orderId，访问服务器获取该用户的该订单详情
   */
  getOrderDetails: function(orderId) {
    // var arr = [];
    var that = this;
    wx.request({
      url:config.service.getOrderDetailUrl,
      data:{
        'openid': app.globalData.openId,
        'sellerId':app.globalData.sellerId,
        'orderId': orderId
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: function(res) {
        console.log("order details:", res.data.data);
        var arr = res.data.data;
        var details = that.data.temporderDetail;
        var date = new Date();
        date.setTime(arr.createTime * 1000);
        arr.createTime = util.formatTime(date);
        details.push(res.data.data);
        that.setData({
          temporderDetail: details
        });
        console.log('temporderDetail:', that.data.temporderDetail);
        if (that.data.temporderDetail.length == that.data.ordernum) {
          // 若已经全部取回该用户的订单信息，开始对订单进行时间的排序
          console.log("index == that.data.ordernum");
          that.sortOrder();
        }
      }
    });
  },

  /**
   * @method sortOrder
   * @desc 循环遍历temporderDetail，调用函数findMax()实现时间上的排序
   */
  sortOrder: function() {
    var len = this.data.temporderDetail.length;
    for (var i = 0; i < len; i++) {
      this.findMax();
    }
  },

  /**
   * @method findMax
   * @desc 遍历temporderDetail, 找到时间最新的订单, 
   * 添加到orderDetail并在temporderDetail中删除
   */
  findMax: function() {
    var len = this.data.temporderDetail.length;
    if (len !== 0) {
      var max = 0;
      var index = -1;
      for (var i = 0; i < len; i++) {
        if (this.data.temporderDetail[i].updateTime > max) {
          console.log("i (updateTime > max):", i);
          index = i;
          max = this.data.temporderDetail[i].updateTime;
        }
      }
      console.log('findMax_index:', index);
      var arr = this.data.orderDetail;
      arr.push(this.data.temporderDetail[index]);
      var temparr = this.data.temporderDetail.splice(index, 1);
      this.setData({
        orderDetail: arr,
      });
    }
  }
})