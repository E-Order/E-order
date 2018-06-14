// pages/components/myorder/myorder.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: null,
    orders: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.GetOrderList()
    //console.log('test',this.data.orders)
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
    var arr = new Array()
    arr = this.GetOrderDetails()
    this.setData({
      allorders:arr
    })
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
  ** 获取订单列表 GetOrderList
  ** 从后台服务器获取该用户的订单列表
  ** 参数 : 无
  ** 返回值 : arr 数组
  ******************** */
  GetOrderList: function() {
    var that = this
    var arr = new Array()
    var id = app.globalData.openId
    wx.request({
      url:'https://private-b4689-ordermeal.apiary-mock.com/eorder/buyer/order/list',
      data: {
        'openid': id,
        'page': 0,
        'size': 10
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'GET',
      success: function(res) {
       console.log("orders:", res.data.data)
       setTimeout(function () {
         that.setData({
           loadingHidden: true
         })
       }, 1500)
        arr = res.data.data
        that.setData({
          orders: arr,
          //openid: app.globalData.openId
        })
      }
    })
    return arr
  },

  /* ********************
  ** 获取订单详情 GetOrderDetails
  ** 从后台服务器获取该用户的某个订单的详情
  ** 参数 : openid, orderid
  ** 返回值 : arr 数组
  ******************** */
  /**
   * 获取订单详情可以只根据用户id，这样就做成了
   * 包含所有订单的界面，参考Ue鲜果
   * 循环遍历整个后台，获取与用户id相同的所有订单
   * 将其加入arr中，而不是只有一个订单
   */
  GetOrderDetails: function(/*openid, orderid*/) {
    var that = this
    var arr = new Array()
    wx.request({
      url:'https://private-b4689-ordermeal.apiary-mock.com/eorder/buyer/order/detail',
      data:{
       // 'openid': openid,
       // 'orderid': orderid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'GET',
      success: function(res) {
        console.log("order details:", res.data.data)
        arr = res.data.data
        that.setData({
          orderDetail: arr,
        })
      }
    })
    return arr
  },

})