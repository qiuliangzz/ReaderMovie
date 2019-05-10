var postsData = require("../../../data/posts-data.js")
var appInst = getApp();

Page({
  data: {
    isPlayingMusic: false
  },
  onLoad: function (option) {
    var globalData = appInst.globalData;
    var postId = option.id;
    this.setData({
      currentPostId: postId
    })
    var postData = postsData.postList[postId];
    this.setData({ postData })
    // 如果在onLoad中，不是异步的去执行一个数据绑定，
    // 则不需要使用this.setData方法，
    // 只需要对this.data赋值即可实现数据绑定
    // this.data.postData = postData;

    // 使用缓存
    var postsCollected = wx.getStorageSync('posts_collected');
    if (postsCollected) {
      var postsCollected = postsCollected[postId]
      if (postsCollected) {
        this.setData({
          collected: postsCollected
        })
      }
    } else {
      var postsCollected = {};
      postsCollected[postId] = false;
      wx.setStorageSync('posts_collected', postsCollected);
    }
    if (globalData.g_isPlayingMusic && globalData.g_currentMusicPostId === postId) {
      // 总控播放并且是当前页面，播放当前页面音乐
      this.setData({
        isPlayingMusic: true
      })
    }
    this.setMusicMonitor()
  },
  // 监听音乐
  setMusicMonitor: function () {
    //点击播放图标和总控开关都会触发这个函数
    var globalData = appInst.globalData;
    var currentPostId = this.data.currentPostId;
    wx.onBackgroundAudioPlay((result) => {
      this.setData({
        isPlayingMusic: true
      })
      // 让全局播放状态保持一致
      globalData.g_isPlayingMusic = true;
      globalData.g_currentMusicPostId = currentPostId;
    });
    wx.onBackgroundAudioPause((result) => {
      this.setData({
        isPlayingMusic: false
      })
      globalData.g_isPlayingMusic = false;
      globalData.g_currentMusicPostId = null;
    });
    wx.onBackgroundAudioStop(result => {
      this.setData({
        isPlayingMusic: false
      })
      globalData.g_isPlayingMusic = false;
      globalData.g_currentMusicPostId = null;
    });
  },
  onCollectionTap: function (e) {
    this.getPostsCollectedSync() // 多用同步 
    // this.getPostsCollected()
  },

  // 异步
  getPostsCollected: function () {
    wx.getStorage({
      key: 'posts_collected',
      success: (res) => {
        var postsCollected = res.data;
        var postCollected = postsCollected[this.data.currentPostId]
        // 收藏状态切换
        postCollected = !postCollected;
        postsCollected[this.data.currentPostId] = postCollected;
        // 交互
        // this.showModal(postsCollected, postCollected)
        this.showToast(postsCollected, postCollected)
      }
    });
  },

  // 同步
  getPostsCollectedSync: function () {
    var postsCollected = wx.getStorageSync('posts_collected');
    var postCollected = postsCollected[this.data.currentPostId]
    // 收藏状态切换
    postCollected = !postCollected;
    postsCollected[this.data.currentPostId] = postCollected;
    // 交互
    // this.showModal(postsCollected, postCollected)
    this.showToast(postsCollected, postCollected)
  },

  showToast: function (postsCollected, postCollected) {
    // 更新文章是否收藏的缓存值
    wx.setStorageSync('posts_collected', postsCollected);
    // 更新数据绑定变量，从而实现切换图片
    this.setData({
      collected: postCollected
    })
    wx.showToast({
      title: postCollected ? '收藏成功' : "取消成功",
      duration: 1000
    })
  },

  showModal: function (postsCollected, postCollected) {
    // var that = this;
    wx.showModal({
      title: '收藏',
      content: postCollected ? '是否收藏该文章？' : "是否取消收藏该文章？",
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#333',
      confirmText: "确认",
      confirmColor: '#405f80',
      success: res => {
        if (res.confirm) {
          // 更新文章是否收藏的缓存值
          wx.setStorageSync('posts_collected', postsCollected);
          // 更新数据绑定变量，从而实现切换图片
          // that.setData({
          //   collected: postCollected
          // })
          this.setData({
            collected: postCollected
          })
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    });
  },

  // 小程序暂时没有分享功能
  onShareTap: function (e) {
    var itemList = ["分享给微信好友", "分享到朋友圈", "分享到QQ", "分享到QQ空间", "分享到微博"]
    wx.showActionSheet({
      itemList: itemList,
      itemColor: '#405f80',
      success: (res) => {
        // res.tapIndex 数组元素的序号，从0开始
        // res.canael 用户是不是点击了取消按钮
        wx.showModal({
          title: '用户分享到了' + itemList[res.tapIndex],
          content: '现在小程序无法实现分享功能'
        });
      }
    });
  },

  // 音乐播放基本实现
  onMusicTap: function (e) {
    var currentPostId = this.data.currentPostId;
    var music = postsData.postList[currentPostId].music;
    var isPlayingMusic = this.data.isPlayingMusic;
    if (isPlayingMusic) {
      wx.pauseBackgroundAudio();
      this.setData({
        isPlayingMusic: false
      })
    }
    else {
      wx.playBackgroundAudio({
        dataUrl: music.url,
        title: music.title,
        coverImgUrl: music.coverImg,
      })
      this.setData({
        isPlayingMusic: true
      })
    }
  }
})