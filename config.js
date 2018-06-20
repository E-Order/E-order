/*
** 小程序配置文件
*/

// 服务器负责买家端的主地址
var host = 'https://private-b4689-ordermeal.apiary-mock.com/eorder/buyer'

var config = {
	service: {
		host,
		
		// 获取openid
		getOpenIdUrl: 'http://eorder1.natapp1.cc/eorder/weixin/start',
		// getOpenIdUrl: `${host}/login/start/`,

		// 获取菜单信息
		getProductUrl: `${host}/product/list`,

		// 创建订单
		creatOrderUrl: `${host}/order/create`,

		// 查询订单列表
		getOrderListUrl: `${host}/order/list`,

		// 查询订单详情
		getOrderDetailUrl: `${host}/order/detail`,

		// 取消订单
		cancelOrderUrl: `${host}/order/cancel`,

		// 支付订单
		payOrderUrl: `${host}/order/pay`
	}
}

module.exports = config
