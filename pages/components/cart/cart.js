const app = getApp()

Page({
  data: {
    cartImg: '/images/cart-null.png',
    tipWords: '购物车空空如也',
    condition:true,
    foodnum:[],  // 二维数组，每种食物类别的每种食物的数量，应该与index界面中的相同，
    //但是我这里购物车中增加时没有更新它所以现在会有购物车界面与index界面不同步的bug
    cartfood:[],  // 从index界面获取到数据后，如果食物数量不为0的话，填充到cartfood中
    cartfoodnum:[],  // 每个cartfood中的食物对应的数量
    amount: '0'
  },

  // 计算当前购物车下总金额
  calTotal: function(e) {
    var total = 0;
    let kind = this.data.cartfood.length;
    for (var i = 0; i < kind; i++) {
      total += this.data.cartfood[i].price * this.data.cartfoodnum[i];
      // console.log("total", total)
    }
    this.setData({
      amount: total,
    })
  },

  // 更改foodnum矩阵，使得能够实现与index页面的数据交互
  updateFoodnum: function(e) {
    let kind = this.data.cartfood.length;
    var that = this
    wx.getStorage({
      key: 'navLeftItems',
      success: function (res) {
        let len1 = res.data.length;
        for (var i = 0; i < len1; i++) {
          let len2 = res.data[i].foods.length;
          for (var j = 0; j < len2; j++)
            that.data.foodnum[i][j] = 0;
        }
        
        for (var k = 0; k < kind; k++) {
          for (var i = 0; i < len1; i++) {
            let len2 = res.data[i].foods.length;
            for (var j = 0; j < len2; j++)
              if (that.data.cartfood[k].id == res.data[i].foods[j].id) {
                that.data.foodnum[i][j] = that.data.cartfoodnum[k];
              }
          }
        }
      }
    })
  },

  onLoad: function() {
    
  },

  onShow:function() {
    var that = this
    var tempfoodnum = new Array();
    var foodincart = new Array();
    var foodnumincart = new Array();
    //从index界面获取数据，并填充cartfood，同样赋值时很麻烦，希望能解决
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
        that.calTotal()
        if (index > 0) {
          that.setData({
            condition: false
          })
        }
      }
    })
    console.log("foodincart", foodincart)
    console.log("foodnumincart", foodnumincart)
    console.log("total", this.amount)
  },

  onHide:function() {
    
    //this.updateFoodnum()
    console.log("foonumincart", this.data.foodnum)
    wx.setStorage({
      key: 'foodnum',
      data: this.data.foodnum,
    })
  },


  //给food添加一个type，或者根据食物的id的第一位来判断，我把食物id的第一位设为了与type相同的值
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
    console.log("array_numincart",array_num)
    console.log("addfoodnum", this.data.foodnum)
    this.updateFoodnum();
    this.calTotal()
  },

  subfood: function (e) {
    var that = this;
    let col = parseInt(e.target.dataset.colindex);
    var array_num = new Array();
    var arrayfood = new Array();
    let len1 = this.data.cartfoodnum.length;
    var index = 0;
    for (var i = 0; i < len1; i++) {
      var temp = this.data.cartfoodnum[i];
      if (i == col) {
       temp--;
      }
      if (temp != 0) {
        arrayfood[index] = this.data.cartfood[i];
        array_num[index] = temp;
        index++;
      } 
    }
    if (arrayfood.length == 0) {
      that.setData({
        condition:true
      })
    }
    that.setData({
      cartfoodnum: array_num,
      cartfood: arrayfood
    })
    this.updateFoodnum();
    this.calTotal()
  }
})