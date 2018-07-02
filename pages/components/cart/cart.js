const app = getApp()

Page({
  data: {
    cartImg: '/images/cart-null.png',
    tipWords: '购物车空空如也',
    condition:true,
    // 二维数组，每种食物类别的每种食物的数量，应该与index界面中的相同
    foodNum:[],
    // 从index界面获取到数据后，如果食物数量不为0的话，填充到cartFood中
    cartFood:[],
    // 每个cartFood中的食物对应的数量
    cartFoodNum:[],
    amount: '0'
  },

  /**
   * @method calTotal
   * @desc 计算当前购物车下总金额
   */
  calTotal: function() {
    var total = 0;
    let kind = this.data.cartFood.length;
    for (var i = 0; i < kind; i++) {
      total += this.data.cartFood[i].price * this.data.cartFoodNum[i];
    }
    this.setData({
      amount: total,
    })
  },

  /**
   * @method updateFoodNum
   * @desc 更改foodNum矩阵，使得能够实现与index页面的数据交互
   */
  updateFoodNum: function() {
    let kind = this.data.cartFood.length;
    var that = this;
    wx.getStorage({
      key: 'navLeftItems',
      success: function (res) {
        let len1 = res.data.length;
        for (var i = 0; i < len1; i++) {
          let len2 = res.data[i].foods.length;
          for (var j = 0; j < len2; j++) {
            that.data.foodNum[i][j] = 0;
          }
        }
        for (var k = 0; k < kind; k++) {
          for (var i = 0; i < len1; i++) {
            let len2 = res.data[i].foods.length;
            for (var j = 0; j < len2; j++) {
              if (that.data.cartFood[k].id == res.data[i].foods[j].id) {
                that.data.foodNum[i][j] = that.data.cartFoodNum[k];
              }
            }
          }
        }
      }
    })
  },

  /**
   * @method onLoad
   */
  onLoad: function() {},

  /**
   * @method onShow
   * @desc 赋值foodNum，cartFood和cartFoodNum
   */
  onShow:function() {
    var that = this;
    var tempFoodNum = [];
    var foodInCart = [];
    var foodNumInCart = [];
    // 获取index页面的foodNum矩阵
    wx.getStorage({
      key: 'foodNum',
      success: function (res) {
        console.log(res.data)
        that.setData({
          foodNum: res.data
        })
        console.log("FoodNum", that.data.foodNum);
        tempFoodNum = res.data;
      }
    });
    console.log("tempFoodNum", tempFoodNum);
    // 赋值cartFood和cartFoodNum
    wx.getStorage({
      key: 'navLeftItems',
      success: function (res) {
        let len1 = tempFoodNum.length;
        var index = 0;
        for (var i = 0; i < len1; i++) {
          let len2 = tempFoodNum[i].length;
          console.log("len2:", len2);
          for (var j = 0; j < len2; j++) {
            if (tempFoodNum[i][j] > 0) {
              foodInCart[index] = res.data[i].foods[j];
              foodNumInCart[index] = tempFoodNum[i][j];
              index++;
            }
          }
        }
        that.setData({
          cartFood: foodInCart,
          cartFoodNum: foodNumInCart
        });
        console.log("cartFood", that.data.cartFood);
        console.log("cartFoodNum", that.data.cartFoodNum);
        that.calTotal();
        if (index > 0) {
          that.setData({
            condition: false
          });
        } else {
          that.setData({
            condition: true
          });
        }
      }
    });
    console.log("foodInCart", foodInCart);
    console.log("foodNumInCart", foodNumInCart);
    console.log("total", this.amount);
  },

  /**
   * @method onHide
   * @desc 存储foodNum矩阵
   */
  onHide:function() {
    console.log("foodNum", this.data.foodNum);
    wx.setStorage({
      key: 'foodNum',
      data: this.data.foodNum,
    });
  },

  /**
   * @method addFood
   * @param e
   * @desc 增加购物车中该食物的数量, 更新foodNum矩阵和更新当前购物车总额
   */
  addFood: function (e) {
    var that = this;
    let col = parseInt(e.target.dataset.colindex);
    // var arr = [];
    // let len1 = this.data.cartFoodNum.length;
    // for (var i = 0; i < len1; i++) {
    //   arr[i] = this.data.cartFoodNum[i];
    // }
    var arr = this.data.cartFoodNum;
    arr[col]++;
    that.setData({
      cartFoodNum: arr,
    });
    console.log("arrincart",arr);
    console.log("addFoodNum", this.data.foodNum);
    this.updateFoodNum();
    this.calTotal();
  },

  /**
   * @method subFood
   * @param e
   * @desc 减少购物车中该食物的数量, 更新foodNum矩阵和更新当前购物车总额
   */
  subFood: function (e) {
    var that = this;
    let col = parseInt(e.target.dataset.colindex);
    // var arr = [];
    // var arrayfood = [];
    // let len1 = this.data.cartFoodNum.length;
    // var index = 0;
    // for (var i = 0; i < len1; i++) {
    //   var temp = this.data.cartFoodNum[i];
    //   if (i == col) {
    //    temp--;
    //   }
    //   if (temp != 0) {
    //     arrayfood[index] = this.data.cartFood[i];
    //     arr[index] = temp;
    //     index++;
    //   } 
    // }
    var arr = this.data.cartFoodNum;
    var arrFood = this.data.cartFood;
    arr[col]--;
    if (arr[col] == 0) {
      arr.splice(col, 1);
      arrFood.splice(col, 1);
    }
    if (arrFood.length == 0) {
      that.setData({
        condition:true
      })
    }
    that.setData({
      cartFoodNum: arr,
      cartFood: arrFood
    })
    this.updateFoodNum();
    this.calTotal()
  },

  /**
   * @method pay
   * @desc 跳转到pay页面并储存相应的订单信息
   */
  pay: function() {
    var arr = this.makeOrder();
    var that = this;
    console.log("items", arr);
    console.log("amount", that.data.amount);
    wx.setStorage({
      key: 'pay_detail',
      data: {
        'cartFood': that.data.cartFood,
        'amount': that.data.amount,
        'items': arr
      },
    });
    //跳转到支付界面
    console.log("跳转到支付界面");
    wx.navigateTo({
      url: '../pay/pay'　　
    })
  },

  /**
   * @method makeOrder
   * @returns arr
   * @desc 生成订单中菜品信息的数组
   */
  makeOrder: function() {
    var arr = [];
    var len = this.data.cartFood.length;
    for (var i = 0; i < len; i++) {
      arr[i] = {"productId": this.data.cartFood[i].id, "productQuantity": this.data.cartFoodNum[i]};
    }
    console.log(arr);
    return arr;
  },
})