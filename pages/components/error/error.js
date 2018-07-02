// pages/components/error/error.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {},

  /**
   * @method onLoad
   * @param options
   * @desc 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

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
   * @method scan
   * @desc 用户调用相机扫描相应的二维码获取商家id和桌号
   */
  scan: function() {
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        console.log(res);
        // 从path参数中截取参数-桌号
        var table = res.path.match(/tableNo=(\S*)&s/)[1];
        // 从path参数中截取参数-桌号
        var seller = res.path.match(/sellerId=(\S*)&/)[1];
        console.log("table:", table);
        console.log("seller:", seller);
        app.globalData.tableNo = parseInt(table);
        app.globalData.sellerId = seller;
        // 跳转回index页面显示相应的菜单信息
        wx.switchTab({
          url: "../../index/index"
        });
      }
    });
  }
})