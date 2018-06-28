// detail.js

var app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    food: null
  },

  /**
   * @method onLoad
   * @param options
   * @desc 获取相应的菜品信息
   */
  onLoad: function (options) {
    var that = this;
    wx.getStorage({
      key: 'navLeftItems',
      success: function(res) {
        console.log(res.data)
        let len1 = res.data.length;
        for (var i = 0; i < len1; i++) {
          let len2 = res.data[i].foods.length;
          for (var j = 0; j < len2; j++) {
            if (res.data[i].foods[j].id == options.id) {
              that.setData({
                food: res.data[i].foods[j]
              })
            }
          }
        }
      },
    }); 
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
    
  }
})