const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    userInfoList: [
      {
      icon: '/images/icon-dingdan.png',
      text: '我的订单'
    },
      {
        icon: '/images/icon-card.png',
        text: '我的优惠券'
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo( function(userInfo) {
      // 更新数据
      that.setData( {
        userInfo: userInfo
      })
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
  clickview: function(e) {
    // 获取点击是userInfoList中的哪一个
    let index = e.target.dataset.index;
    if (index == 0) {
      console.log("我的订单");
      // do something
    } else if (index == 1) {
      console.log("我的优惠券");
      // do something
    }
  }
})