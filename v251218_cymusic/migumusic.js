// example2.js
//如果api地址是ip+端口形式，ios17+可能请求失败''
//getMusicUrl 函数用于获取音乐 URL。必须接受以下四个参数：songname: 歌曲名称，artist: 艺术家名称，songid: 企鹅平台的歌曲songmid，quality: 音质 '128k'|'320k'|'flac'。
async function getMusicUrl(songname, artist, songid, quality) {
	try {
		const id = await getGMId(songname, artist)
		const url = await getUrlFromMG(id, quality)
		//直接返回歌曲url。请勿返回其他信息
		return url
	} catch (e) {
		// 如果获取失败，返回null
		return null
	}
}
//可以通过搜索接口获取其他平台的songid
async function getGMId(songname, artist) {
	const encodedSongInfo = encodeURIComponent(songname + ' ' + artist);
	const switchParam = JSON.stringify({
		song: 1,
		album: 0,
		singer: 0,
		tagSong: 0,
		mvSong: 0,
		songlist: 0,
		bestShow: 1
	});
	const searchUrl =
		`http://pd.musicapp.migu.cn/MIGUM2.0/v1.0/content/search_all.do?ua=Android_migu&version=5.0.1&pageNo=1&pageSize=10&text=${encodedSongInfo}&searchSwitch=${encodeURIComponent(switchParam)}`;
	try {
		// Make a request to the search URL
		const response = await fetch(searchUrl);
		if (!response.ok) {
			throw new Error('Network response was not ok');
		}

		// Parse the JSON response 
		const data = await response.json();
		const result = data.songResultData.result;

		// Extract the DC_TARGETID from the first item in abslist
		if (result && result.length > 0) {
			const id = result[0].id;
			return id;
		} else {
			throw new Error('No results found');
		}
	} catch (error) {
		console.error('There has been a problem with your fetch operation:', error);
	}
}

async function getUrlFromMG(mgId, quality) {
	// Construct the source URL using the provided kwId and quality
	switch (quality) {
		case 'flac':
			quality = 'SQ'
			break;
		case '128k':
			quality = 'PQ'
			break;
		case '320k':
			quality = 'HQ'
			break;
		default:
			quality = 'PQ'
	}
	const sourceUrl = `http://musicapi.haitangw.net/music/mg1.php?id=${mgId}&quality=${quality}`;

	try {
		// Make a request to the source URL
		const response = await fetch(sourceUrl);
		if (!response.ok) {
			throw new Error('Network response was not ok');
		}
		const responseData = await response.json();
		// 提取获取到的url
		if(responseData.data.music_url){
			return responseData.data.music_url;
		}else{
			throw new Error('No results found');
		}
	} catch (error) {
		console.error('There has been a problem with your fetch operation:', error);
		return null;
	}
}
module.exports = {
	// 音源唯一编号
	id: "MGTEST",
	// 作者
	author: "oy",
	// 音源显示的名称
	name: "MGTEST",
	//版本
	version: "0.0.1",
	//更新地址
	srcUrl: "",
	//getMusicUrl方法必须导出
	getMusicUrl
};
