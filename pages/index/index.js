//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    imgUrls: [
      'https://raw.githubusercontent.com/LTimmy/markdownPhotos/master/E-order2.png',
      'https://raw.githubusercontent.com/LTimmy/markdownPhotos/master/E-order3.png'
    ],
    // 关于滑动图片的动画，后期可以循环热销菜品等等
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    carNav:1,  // 当前选中的导航，热销，小炒等
    curIndex:0,  // 当前的下标，用于根据左边导航变换右边的view的list
    // 导航分类
    navLeftItems: [
      {
        id:1,
        name:"热销"
    },
    {
      id:2,
      name:"小炒"
    },
    {
      id:3,
      name:"主食"
    },
    {
      id:4,
      name:"汤类"
    },
    {
      id:5,
      name:"饮料"
    },
    {
      id:6,
      name:"套餐"
    }
    ],
    // 右边的菜品分类，有几个导航就应该有几个分类
    navRightItems: [
      [{
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
      }],
      [],
      [],
      [],
      [],
      []
    ]
  },
  loadingChange() {
    setTimeout(() => {
      this.setData({
        hidden: true
      })
    }, 2000)
  },
  // 点击左边分类栏的响应事件
  switchRightTab: function(e) {
    let id = e.target.dataset.id, // 获取点击的导航的id
      index = parseInt(e.target.dataset.index);  // 获取点击的导航的下标
    this.setData({
      curNav: id,
      curIndex: index
    })
  },
  // 点击菜品事件响应函数
  selectedDish (e) {
    // dish：每一个菜品的id
    let dish = e.currentTarget.dataset.dish;
    // 这里应该做一些事情将菜品加到购物车,向购物车界面传递信息
  
    // 用于改变选择了菜品后view的状态
    //console.log(dish)
    this.setStatus(dish);
  },
  setStatus(dishId) {
    let dishes = this.data.navRightItems;
    for (let dish of dishes) {
      dish.forEach((item) => {
        //console.log(item.id)
        //console.log(dishId)
        if (item.id == dishId) {
          item.status = !item.status || false
        }
      })
    }

    this.setData({
      navRightItems: this.data.navRightItems
    })
  },
  onLoad: function () {
    this.loadingChange()
  },
})
