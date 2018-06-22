// pages/components/pay/pay.js
const app = getApp()

var config = require('../../../config')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderDetail:[],
    orderItems:[],
    amount:'0'
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this
    // var arr1 = new Array()
    // var arr2 = new Array()
    wx.getStorage({
      key: 'pay_detail',
      success: function (res) {
        console.log('res2', res.data)  // 获取所有食物的数据并存起来
        // arr1 = res.data.cartfood
        // arr2 = res.data.items
        that.setData({
          // orderDetail: arr1,
          // orderItems: arr2,
          orderDetail: res.data.cartfood,
          orderItems: res.data.items,
          amount: res.data.amount
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /* ********************
  ** 提交订单 submitOrder
  ** 
  ** 参数 : options 表示该订单选择哪种付款方式
  ** 返回值 : 
  ******************** */
  submitOrder: function(options) {
    var that = this
    wx.request({
      url:config.service.creatOrderUrl,
      data: {
        'deskId': app.globalData.tableNo,
        'openid': app.globalData.openId,
        'sellerId':app.globalData.sellerId,
        'amount': that.data.amount,
        'items': that.data.orderItems
        // 'paystatus': true
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'POST',
      success: function(res) {
        // console.log(res.data.code)
        // console.log('deskid', app.globalData.tableNo)
        // console.log('openid', app.globalData.openId)
        // console.log('amount', that.data.amount)
        // console.log('food', arr)
        console.log(res.data)
      }
    })
  },

  /* ********************
  ** 线下支付 pay_by_money
  ** 
  ** 参数 : 
  ** 返回值 : 
  ******************** */
  pay_by_money: function() {
    this.submitOrder("pay_offline")
    this.offline_done()
  },

  /* ********************
  ** 线上支付 pay_online
  ** 
  ** 参数 : 
  ** 返回值 : 
  ******************** */
  pay_online: function() {
    this.submitOrder("pay_online")
    // this.emptyCart()
    this.online_done()
  },

  /* ********************
  ** 清空购物车 emptyCart
  ** 
  ** 参数 : 
  ** 返回值 : 
  ******************** */
  emptyCart: function() {
    var that = this
    wx.getStorage({
      key: 'foodnum',
      success: function (res) {
        var array = res.data
        var len = array.length
        for (var i = 0; i < len; i++) {
          array[i].fill(0)
        }
        // array.fill(0)
        console.log('array(emptycart):', array)
        wx.setStorage({
          key: 'foodnum',
          data: array,
        })
      }
    })
  },

  /* ********************
  ** 跳转到菜单页面 gotoIndex
  ** 
  ** 参数 : 
  ** 返回值 : 
  ******************** */
  gotoIndex: function() {
    //跳转到菜单界面
    console.log("跳转到菜单界面")
    wx.switchTab({
      url: '../../index/index'　　
    })
  },

  /* ********************
  ** 线下支付完成操作 offline_done
  ** 
  ** 参数 : 
  ** 返回值 : 
  ******************** */
  offline_done: function() {
    var that = this
    this.emptyCart()
    wx.showToast({
      title: '订单提交成功！',
      icon: 'success',
      duration: 1000,
      mask: true,
      success: function() {
        setTimeout(function() {
          wx.hideToast()
          that.gotoIndex()
        }, 1000)
      }
    })
  },

  /* ********************
  ** 线上支付完成操作 online_done
  ** 
  ** 参数 : 
  ** 返回值 : 
  ******************** */
  online_done: function() {
    var that = this
    wx.showToast({
      title: '跳转到支付页面',
      icon: 'loading',
      duration: 1000,
      mask: true,
      success: function() {
        setTimeout(function() {
          wx.hideToast()
        }, 3000)
        setTimeout(function() {
          that.pay_done()
        }, 1000)
      }
    })
  },

  /* ********************
  ** 线上支付提示 pay_done
  ** 
  ** 参数 : 
  ** 返回值 : 
  ******************** */
  pay_done: function() {
    var that = this
    wx.showModal({
      title: '确认支付',
      content: '模拟实现线上支付',
      success: function(res) {
        if (res.confirm) {
          that.emptyCart()
          wx.showToast({
            title: '支付成功！',
            icon: 'success',
            duration: 1000,
            success: function() {
              setTimeout(function() {
                wx.hideToast()
              }, 3000)
              setTimeout(function() {
                that.gotoIndex()
              }, 1000)
            }
          })
        } else {
          wx.showToast({
            title: '取消支付',
            duration: 1000,
            success: function() {
              setTimeout(function() {
                wx.hideToast()
              }, 3000)
              setTimeout(function() {
                that.gotoIndex()
              }, 1000)
            }
          })
        }
      }
    })
  }
})