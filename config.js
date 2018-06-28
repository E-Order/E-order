/*
** 小程序配置文件
*/

// 服务器负责买家端的主地址
var host = 'http://123.207.7.251:8080/eorder'

var config = {
	service: {
		host,
		
		// 获取openid
		getOpenIdUrl: `${host}/weixin/start`,

		// 获取菜单信息
		getProductUrl: `${host}/buyer/product/list`,

		// 创建订单
		creatOrderUrl: `${host}/buyer/order/create`,

		// 查询订单列表
		getOrderListUrl: `${host}/buyer/order/list`,

		// 查询订单详情
		getOrderDetailUrl: `${host}/buyer/order/detail`,

		// 取消订单
		cancelOrderUrl: `${host}/buyer/order/cancel`,

		// 支付订单
		payOrderUrl: `${host}/buyer/order/pay`
	}
}

module.exports = config
