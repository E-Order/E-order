const app = getApp()

Page({
  data: {
    cartImg: '/images/cart-null.png',
    tipWords: '购物车空空如也',
    condition:true,
    foodnum:[],
    cartfood:[],
    cartfoodnum:[]
  },
  gocheck:function() {
    // 计算购物车总价格，跳转到支付页面

  },
  onLoad: function() {
    
  },
  onShow:function() {
    var that = this
    var tempfoodnum = new Array();
    var foodincart = new Array();
    var foodnumincart = new Array();
    wx.getStorage({
      key: 'foodnum',
      success: function (res) {
        console.log(res.data)
        that.setData({
          foodnum: res.data
        })
        let len1 = res.data.length
        for (var i = 0; i < len1; i++) {
          tempfoodnum[i] = new Array();
          let len2 = res.data[i].length;
          for (var j = 0; j < len2; j++) {
            tempfoodnum[i][j] = res.data[i][j]
          }
        }
      }
    })
    console.log("tempfoodnum", tempfoodnum)
    wx.getStorage({
      key: 'navLeftItems',
      success: function (res) {
        let len1 = tempfoodnum.length;
        var index = 0;
        for (var i = 0; i < len1; i++) {
          let len2 = tempfoodnum.length;
          for (var j = 0; j < len2; j++) {
            if (tempfoodnum[i][j] > 0) {
              foodincart[index] = res.data[i].foods[j];
              foodnumincart[index] = tempfoodnum[i][j];
              index++;
            }
          }
        }
        that.setData({
          cartfood: foodincart,
          cartfoodnum: foodnumincart
        })
        if (index > 0) {
          that.setData({
            condition: false
          })
        }
      }
    })
    console.log("foodincart", foodincart)
    console.log("foodnumincart", foodnumincart)
  },
  addfood: function (e) {
    var that = this;
    let col = parseInt(e.target.dataset.colindex);
    var array_num = new Array();
    let len1 = this.data.cartfoodnum.length;
    for (var i = 0; i < len1; i++) {
      array_num[i] = this.data.cartfoodnum[i];
    }
    array_num[col]++;
    that.setData({
      cartfoodnum: array_num,
    })
  },
  subfood: function (e) {
    var that = this;
    let col = parseInt(e.target.dataset.colindex);
    var array_num = new Array();
    var arrayfood = new Array();
    let len1 = this.data.cartfoodnum.length;
    var index = 0;
    for (var i = 0; i < len1; i++) {
      array_num[i] = this.data.cartfoodnum[i];
      if (i == col && array_num[col] > 0) {
        array_num[col]--;
      }
      if (array_num[i] != 0) {
        arrayfood[index] = this.data.cartfood[i];
        index++;
      }
    }
    that.setData({
      cartfoodnum: array_num,
      cartfood: arrayfood
    })
  }
})