<% tp.user.get_tweet_card(tp, {
	width: 1800,
	fontSize: 62,
	margin: 140,
	padding: 100,
	writeToClipboard: true,
	downloadToDisk: false,
	//logo: `这里放卡片里你的头像 base64代码，例如可以在这样的网站转换 https://c.runoob.com/front-end/59/`,
	name: '你的昵称',
	userId: '你的 ID'
}) %>