var appInst = getApp();
var util = require("../../utils/util.js")
Page({
  data: {
    inTheaters: {},
    comingSoon: {},
    top250: {},
    containerShow: true,
    searchPannelShow: false,
    searchResult: {}
  },
  onLoad: function () {
    var url = appInst.globalData.doubanBaseUrl;
    var inTheatersUrl = `${url}/v2/movie/in_theaters?start=0&count=3`;
    var comingSoonURrl = `${url}/v2/movie/coming_soon?start=0&count=3`;
    var top250Url = `${url}/v2/movie/top250?start=0&count=3`;
    this.getMovieListData(top250Url, "top250", "豆瓣Top250");
    this.getMovieListData(inTheatersUrl, "inTheaters", "正在热映");
    this.getMovieListData(comingSoonURrl, "comingSoon", "即将上映");
  },
  // 获取豆瓣api参数
  getMovieListData: function (url, settedKey, categoryTitle) {
    wx.request({
      url: url,
      data: {},
      header: { 'content-type': 'json' },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (res) => {
        const { data } = res;
        this.processDoubanData(data, settedKey, categoryTitle)
      },
      fail: (error) => {
        console.log(error);
      }
    });
  },
  // 数据处理
  processDoubanData: function (data, settedKey, categoryTitle) {
    var movies = [];
    for (var index in data.subjects) {
      var subject = data.subjects[index];
      var title = subject.title;
      if (title.length >= 6) {
        title = title.substring(0, 6) + "...";
      }
      var temp = {
        title: title,
        average: subject.rating.average,
        stars: util.convertToStarsArray(subject.rating.stars),
        coverageUrl: subject.images.large,
        movieId: subject.id,
      }
      movies.push(temp)
    }
    var readData = {};
    readData[settedKey] = { categoryTitle: categoryTitle, movies: movies }
    this.setData(readData)
  },
  // 更多跳转
  onMoreTap: function (e) {
    var category = e.currentTarget.dataset.category;
    wx.navigateTo({
      url: 'more-movie/more-movie?category=' + category
    });
  },

  // 搜索框
  onBindFocus: function (e) {
    this.setData({
      containerShow: false,
      searchPannelShow: true
    })
  },
  // 关闭搜索
  onCancelImgTap: function (e) {
    this.setData({
      containerShow: true,
      searchPannelShow: false,
      searchResult: {}
    })
  },
  onBindBlur: function (e) {
    var text = e.detail.value;
    var url = appInst.globalData.doubanBaseUrl;
    var searchUrl = `${url}/v2/movie/search?q=${text}`;
    this.getMovieListData(searchUrl, "searchResult", "")
  },
  // 跳转详情页面
  onMovieTap: function (e) {
    var movieId = e.currentTarget.dataset.movieid
    wx.navigateTo({
      url: 'movie-detail/movie-detail?id=' + movieId
    });
  }
})