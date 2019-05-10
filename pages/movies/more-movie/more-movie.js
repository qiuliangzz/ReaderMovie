var appInst = getApp();
var api = require("../../../api/index.js");
var util = require("../../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    movies: {},
    navigationBarTitle: '',
    requestUrl: '',
    totalCount: 0,
    isEmpty: true
  },

  /**
   * 生命周期函数--监听页面加载,数据
   */
  onLoad: function (options) {
    var url = appInst.globalData.doubanBaseUrl;
    var category = options.category;
    this.data.navigationBarTitle = category;
    var dataUrl = ''
    switch (category) {
      case "正在热映":
        dataUrl = `${url}/v2/movie/in_theaters`;
        break;
      case "即将上映":
        dataUrl = `${url}/v2/movie/coming_soon`;
        break;
      case "豆瓣Top250":
        dataUrl = `${url}/v2/movie/top250`;
        break;
      default:
        break;
    }
    this.data.requestUrl = dataUrl;
    api.getMovieListData(dataUrl, this.processDoubanData)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成,UI
   */
  onReady: function () {
    wx.setNavigationBarTitle({
      title: this.data.navigationBarTitle
    });
  },

  // 数据处理
  processDoubanData: function (data) {
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
    // 加载更多，新数据拼接旧数据
    var totalMovies = {};
    if (!this.data.isEmpty) {
      totalMovies = this.data.movies.concat(movies)
    } else {
      totalMovies = movies;
      this.setData({
        isEmpty: false
      })
    }
    this.setData({
      movies: totalMovies
    })
    this.data.totalCount += 20;
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  },

  // // 上拉加载，滚动到底部时触发
  // onScrollToLower: function (e) {
  //   var nextUrl = `${this.data.requestUrl}?start=${this.data.totalCount}&count=20`
  //   api.getMovieListData(nextUrl, this.processDoubanData);
  //   wx.showNavigationBarLoading();
  // },

  /**
   * 页面相关事件处理函数--监听用户下拉刷新动作
   */
  onPullDownRefresh: function () {
    var refreshUrl = `${this.data.requestUrl}?start=0&count=20`;
    // 置空所有数据 
    this.data.movies = {};
    this.data.isEmpty = true;
    this.data.totalCount = 0;
    api.getMovieListData(refreshUrl, this.processDoubanData);
    wx.showNavigationBarLoading();
  },

  /**
   * 页面上拉触底事件的处理函数,上拉加载
   */
  onReachBottom: function () {
    var nextUrl = `${this.data.requestUrl}?start=${this.data.totalCount}&count=20`
    api.getMovieListData(nextUrl, this.processDoubanData);
    wx.showNavigationBarLoading();
  },
  onMovieTap: function (e) {
    var movieId = e.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: '../movie-detail/movie-detail?id=' + movieId
    });
  }
})