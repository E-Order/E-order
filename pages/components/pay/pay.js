// pages/components/pay/pay.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this
    var arr1 = new Array()
    var arr2 = new Array()
    wx.getStorage({
      key: 'pay_detail',
      success: function (res) {
        console.log('res2', res.data)  // 获取所有食物的数据并存起来

        arr1 = res.data.cartfood
        arr2 = res.data.items
        that.setData({
          orderDetail: arr1,
          orderItems: arr2,
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
})