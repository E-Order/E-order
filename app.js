//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    // 调取API从本地缓存中获取数据
    console.log('App Launch')
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    this.getUserInfo()
  },

  onShow: function () {
    console.log('onShow')
  },

  onHide: function () {
    console.log('onHide')
  },

  getUserInfo: function(cb) {
    var that = this;
    if (this.globalData.userInfo) {
      typeof cd == "function" && cb(this.globalData.userInfo)
    } else {
      // 调用登录接口
      wx.login({
        success: function(res) {
          // 获取openid
          if (res.code) {
            wx.request({
              url: 'https://api.weixin.qq.com/sns/jscode2session',
              data: {
                appid: 'wxfc6223f27324fba6',
                secret: '01c0a9edcdb03e1477e7e444907e96fd',
                grant_type: 'authorization_code',
                js_code: res.code
              },
              method: 'GET',
              header: {
                'content-type': 'application/json'
              },
              success: function(openIdRes) {
                that.globalData.openId = openIdRes.data.openid;
                if (openIdRes.data.openid != null & openIdRes.data.openid != undefined) {
                  wx.getUserInfo({
                    success: function(res) {
                      that.globalData.userInfo = res.userInfo;
                      typeof cb == "function" && cb(that.globalData.userInfo)
                    }
                  })
                  console.log("openId:", that.globalData.openId);
                } else {
                  console.log("获取用户openId失败");
                }
              }
            })
          }
          // wx.getUserInfo({
          //   success: function(res) {
          //     that.globalData.userInfo = res.userInfo;
          //     typeof cb == "function" && cb(that.globalData.userInfo)
          //   }
          // })
        }
      })
    }
  },

  globalData: {
    userInfo: null,
    openId: null,
    tableNo: null, // 通过扫码获得的桌号
  }
})