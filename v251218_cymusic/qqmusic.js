// example1.js 必须是utf-8编码，脚本所用编程语言为JavaScript
//如果api地址是ip+端口形式，ios17+可能请求失败

//getMusicUrl 函数用于获取音乐 URL。必须接受以下四个参数：songname: 歌曲名称，artist: 艺术家名称，songid: 企鹅平台的歌曲songmid，quality: 音质 '128k'|'320k'|'flac'。
async function getMusicUrl(songname, artist, songmid, quality) {
	switch (quality) {
		case 'flac':
			quality = 'lossless'
			break;
		case '128k':
			quality = 'standard'
			break;
		case '320k':
			quality = 'exhigh'
			break;
		default:
			quality = 'standard'
	}
	const targetUrl = `http://musicapi.haitangw.net/music/qq.php?id=${songmid}&level=/${quality}`;
	try {
		const response = await fetch(targetUrl, {
			method: 'GET',
			headers: {
				'User-Agent':'okhttp/4.10.0',
				'Accept-Encoding':'gzip'
			},
		});
		const responseJson = await response.json();
		//直接返回歌曲url。请勿返回其他信息
		if(responseJson.data.url){
			return responseJson.data.url;
		}else{
			throw new Error('No results found');
		}
	} catch (e) {
		console.error(e);
		// 如果获取失败，返回null
		return null;
	}
}

module.exports = {
	// 音源唯一编号
	id: "QQTEST",
	// 作者
	author: "oy",
	// 音源显示的名称
	name: "小秋TEST",
	//版本
	version: "0.0.1",
	//更新地址
	srcUrl: "",
	//getMusicUrl方法必须导出
	getMusicUrl

};
