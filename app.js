//app.js

var config = require('./config');

App({

  /**
   * @method onLoad
   */
  onLaunch: function () {
    // 展示本地存储能力
    // 调取API从本地缓存中获取数据
    console.log('App Launch');
    var logs = wx.getStorageSync('logs') || [];
    logs.unshift(Date.now());
    wx.setStorageSync('logs', logs);
  },

  /**
   * @method onShow
   */
  onShow: function () {
    console.log('onShow');
  },

  /**
   * @method onHide
   */
  onHide: function () {
    console.log('onHide');
  },

  /**
   * @method getUserInfo
   * @desc 获取用户信息
   */
  getUserInfo: function(cb) {
    var that = this;
    if (this.globalData.userInfo) {
      typeof cd == "function" && cb(this.globalData.userInfo);
    } else {
      // 获取用户信息
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.getUserInfo({
              success: res => {
                // 可以将 res 发送给后台解码出 unionId
                that.globalData.userInfo = res.userInfo;
                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                // 所以此处加入 callback 以防止这种情况
                if (that.userInfoReadyCallback) {
                  that.userInfoReadyCallback(res);
                }
              }
            });
          }
        }
      });
    }
  },

  /**
   * @method getOpenId
   * @desc 请求服务器获得该用户的openId
   */
  getOpenId: function() {
    var that = this;
    wx.login({
      success: function(res) {
        if (res.code) {
          console.log('res.code', res.code);
          wx.request({
            url: config.service.getOpenIdUrl,
            data:{
              code: res.code,
            },
            method:'GET',
            success: function (result) {
              console.log(result.data.openid);
              that.globalData.openId = result.data.openid;
            },
            fail: function(result) {
              console.log('获取用户登录态失败！' + result.errMsg);
            }
          });
        } else {
          console.log('获取用户登录态失败！' + res.errMsg);
        }
      }
    });
  },

  globalData: {
    userInfo: null,
    openId: null,
    // 通过扫码获得的桌号
    tableNo: null,
     // 通过扫码获得的商家ID
    sellerId: null,
  }
})