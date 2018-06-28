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
   * @method onLoad
   * @desc 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this;
    //调用应用实例的方法获取全局数据
    app.getUserInfo( function(userInfo) {
      // 更新数据
      that.setData( {
        userInfo: userInfo
      });
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
   * @method clickView
   * @param e
   * @desc 跳转到相应的页面
   */
  clickView: function(e) {
    // 获取点击是userInfoList中的哪一个
    let index = e.currentTarget.dataset.index;
    if (index == 0) {
      console.log("我的订单");
      // 跳转到订单详情界面
      wx.navigateTo({
        url: '../myorder/myorder'
      });
    } else if (index == 1) {
      console.log("我的优惠券");
      // do something
    }
  }
})