// 获取豆瓣api参数
function getMovieListData(url, callBack) {
  wx.request({
    url: url,
    header: { 'content-type': 'json' },
    method: 'GET',
    dataType: 'json',
    success: (res) => {
      callBack(res.data)
    },
    fail: (error) => {
      console.log(error);
    }
  });
}

module.exports = {
  getMovieListData: getMovieListData
}