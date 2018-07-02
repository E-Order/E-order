// pages/components/pay/pay.js
const app = getApp()

var config = require('../../../config')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderDetail: [],
    orderItems: [],
    amount: '0'
  },

  /**
   * @method onLoad
   * @desc 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this;
    wx.getStorage({
      key: 'pay_detail',
      success: function (res) {
        // 获取所有食物的数据并存起来
        console.log('res2', res.data);
        that.setData({
          orderDetail: res.data.cartFood,
          orderItems: res.data.items,
          amount: res.data.amount
        });
      }
    });
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
   * @method submitOrder
   * @param {String} options 表示该订单选择哪种付款方式
   * @desc 向服务器提交订单并完成相应的后续工作
   */
  submitOrder: function(options) {
    console.log('submit_sellerId:', app.globalData.sellerId);
    console.log('submit_deskId:', app.globalData.tableNo);
    console.log('submit_openid:', app.globalData.openId);
    var that = this;
    console.log('JSON:', JSON.stringify(that.data.orderItems));
    wx.request({
      url:config.service.creatOrderUrl,
      data: {
        'deskId': app.globalData.tableNo,
        'openid': app.globalData.openId,
        'sellerId':app.globalData.sellerId,
        'amount': that.data.amount,
        'items': JSON.stringify(that.data.orderItems)
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function(res) {
        console.log(res.data);
        if (options == 'pay_offline') {
          console.log('pay_offline');
          that.offlineOperate();
        } else if (options == 'pay_online') {
          console.log('pay_online');
          that.onlineOperate(res.data.data.orderId);
        }
      }
    });
  },

  /**
   * @method payByMoney
   * @desc 完成线下支付的工作
   */
  payByMoney: function() {
    this.submitOrder('pay_offline');
  },

  /**
   * @method payOnline
   * @desc 完成线上支付的工作
   */
  payOnline: function() {
    this.submitOrder('pay_online');
  },

  /**
   * @method emptyCart
   * @desc 当用户提交订单后清空购物车的内容
   */
  emptyCart: function() {
    var that = this;
    wx.getStorage({
      key: 'foodNum',
      success: function (res) {
        var array = res.data;
        var len = array.length;
        for (var i = 0; i < len; i++) {
          array[i].fill(0);
        }
        wx.setStorage({
          key: 'foodNum',
          data: array,
        });
      }
    });
  },

  /**
   * @method gotoIndex
   * @desc 完成支付后自动跳转到菜单页面
   */
  gotoIndex: function() {
    //跳转到菜单界面
    console.log('跳转到菜单界面');
    wx.switchTab({
      url: '../../index/index'　　
    });
  },

  /**
   * @method offlineOperate
   * @desc 线下支付中，用户提交订单后进行的一系列操作(清空购物车, 订单提交成功信息和跳转到菜单界面)
   */
  offlineOperate: function() {
    var that = this;
    this.emptyCart();
    wx.showToast({
      title: '订单提交成功！',
      icon: 'success',
      duration: 1000,
      mask: true,
      success: function() {
        setTimeout(function() {
          wx.hideToast();
          that.gotoIndex();
        }, 1000)
      }
    });
  },

  /**
   * @method onlineOperate
   * @param orderId 提交订单后获得的订单号
   * @desc 线上支付中，用户提交订单后进行的一系列操作(由于无法实现微信小程序的付款，只能模拟付款)
   */
  onlineOperate: function(orderId) {
    var that = this;
    wx.showToast({
      title: '跳转到支付页面',
      icon: 'loading',
      duration: 1000,
      mask: true,
      success: function() {
        setTimeout(function() {
          wx.hideToast();
        }, 3000);
        setTimeout(function() {
          that.simulateOnlinePay(orderId);
        }, 1000);
      }
    })
  },

  /**
   * @method simulateOnlinePay
   * @param orderId 提交订单后获得的订单号
   * @desc 模拟线上付款
   */
  simulateOnlinePay: function(orderId) {
    var that = this;
    wx.showModal({
      title: '确认支付',
      content: '模拟实现线上支付',
      success: function(res) {
        if (res.confirm) {
          // 确定支付，清空购物车并告知服务器该订单线上付款成功，跳转到菜单页面
          that.emptyCart();
          that.onlinePaySuccess(orderId);
          wx.showToast({
            title: '支付成功！',
            icon: 'success',
            duration: 1000,
            success: function() {
              setTimeout(function() {
                wx.hideToast();
              }, 3000);
              setTimeout(function() {
                that.gotoIndex();
              }, 1000);
            }
          });
        } else {
          // 取消支付，告知服务器该订单线上付款不成功，取消该订单，跳转到菜单页面
          that.emptyCart();
          // that.cancelOrder(orderId);
          wx.showToast({
            title: '取消支付',
            duration: 1000,
            success: function() {
              setTimeout(function() {
                wx.hideToast();
              }, 3000);
              setTimeout(function() {
                that.gotoIndex();
              }, 1000);
            }
          });
        }
      }
    });
  },

  /**
   * @method onlinePaySuccess
   * @param orderId 提交订单后获得的订单号
   * @desc 告知服务器该订单线上付款成功
   */
  onlinePaySuccess: function(orderId) {
    console.log('orderId:', orderId);
    wx.request({
      url: config.service.payOrderUrl,
      data: {
        'openid': app.globalData.openId,
        'orderId': orderId,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function(res) {
        console.log(res.data);
      }
    });
  },

  /**
   * @method cancelOrder
   * @param orderId 提交订单后获得的订单号
   * @desc 告知服务器取消该订单
   */
  cancelOrder: function(orderId) {
    console.log('orderId:', orderId);
    wx.request({
      url:config.service.cancelOrderUrl,
      data: {
        'openid': app.globalData.openId,
        'orderId': orderId,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: 'POST',
      success: function(res) {
        console.log(res.data);
      }
    });
  }
})