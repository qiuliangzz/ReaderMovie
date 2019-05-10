var postsData = require("../../data/posts-data.js");
// import { local_database } from "../../data/posts-data";
Page({
  // 产生事件 捕捉事件 回调函数 处理事件
  //页面的初始数据
  data: {
    imgUrls: ["/images/wx.png", "/images/vr.png", "/images/iqiyi.png"]
  },

  //生命周期函数--监听页面加载
  onLoad: function (options) {
    // ajax写在这
    this.setData({ posts_content: postsData.postList });
  },

  // 跳转到详情页
  onPostTap: function (e) {
    var postId = e.currentTarget.dataset.postid
    wx.navigateTo({
      url: './post-detail/post-detail?id=' + postId
    });
  },
  // banner轮播图跳转文章详情页
  onSwiperTap: function (e) {
    var postId = e.target.dataset.postid
    wx.navigateTo({
      url: './post-detail/post-detail?id=' + postId
    });
  }
});
