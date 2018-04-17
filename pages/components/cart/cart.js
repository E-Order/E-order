const app = getApp()
Page({
  data: {
    condition:true, // 用于判断购物车是否为空
    cartImg: '/images/cart-null.png',
    tipWords: '购物车空空如也',
    dishes:[
      {
        name: "土豆肉丝盖浇饭",
        price: 15,
        num: 1,
        id: 1
      },
      {
        name: "蘑菇芝士汤",
        price: 15,
        num: 1,
        id: 2
      }
    ]
  },
  gocheck:function() {
    // 计算购物车总价格，跳转到支付页面
  },
  onLoad: function() {
    if (this.data.dishes.size == 0){
      this.setData({
        condition:true
      })
    } else {
      this.setData({
        condition: false
      })
    }
  }
})