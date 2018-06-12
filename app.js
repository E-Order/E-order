//app.js
App({

  onLaunch: function () {
    // 展示本地存储能力
    // 调取API从本地缓存中获取数据
    console.log('App Launch')
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
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
          // var appid = 'wxfc6223f27324fba6';
          var appid = that.globalData.appid
          // var secret = '01c0a9edcdb03e1477e7e444907e96fd';
          var secret = that.globalData.secret
          console.log('res.code', res.code);
          var d = that.globalData;//这里存储了appid、secret、token串    
          var l = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + d.appid + '&secret=' + d.secret + '&js_code=' + res.code + '&grant_type=authorization_code'; 
          wx.request({
            url: l,
            data:{},
            method:'GET',
            success: function (res1) {
              console.log('openid',res1.data.openid) //获取openid  
              that.globalData.openId = res1.data.openid
            }
          })
           wx.getUserInfo({
             success: function(res) {
               that.globalData.userInfo = res.userInfo;
               console.log("userInfo:", res.userInfo);
               typeof cb == "function" && cb(that.globalData.userInfo)
             }
           })
        }
      })
    }
  },

  globalData: {
    appid:'wx3cf64998f8d0620d',
    secret:'45309d94006144ae9bbfc4eeeec71a9f',
    userInfo: null,
    openId: null,
    tableNo: null, // 通过扫码获得的桌号
  }
})