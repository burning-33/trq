// pages/PersonalCenter/PersonalCenter.js
const app = getApp();
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 会员列表
    list:[{
      url:'../OrderList/OrderList',
      src:'../../images/gg1.png',
      wsrc: '',
      name:''
    }],
    text: '维修员'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    wx.request({
      url: app.globalData.protocol + '://' + app.globalData.host + '/api/Engineer/userinfo?_TOKEN=' + app.globalData.token + '',
      method: 'POST',
      data: {
        "_TOKEN": app.globalData.token
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res);
        if (res.data.data.order_type == 1){
          if (app.globalData.reformInfo == 1){
            that.setData({ text: '维修班长' })
          }else{
            that.setData({ text: '维修员' })
          }
        } else if (res.data.data.order_type == 2){
          if(app.globalData.reformInfo==4){
            that.setData({ text: '整改员' })
          } else if (app.globalData.reformInfo == 1){
            that.setData({ text: '整改班长' })
          } else if (app.globalData.reformInfo == 3){
            that.setData({ text: '勘察员' })
          }
        } else if (res.data.data.order_type == 3){
          that.setData({ text: '抢险施工员' })
        } else if (res.data.data.order_type == 4) {
          that.setData({ text: '软管更换员' })
        } else if (res.data.data.order_type == 5) {
          that.setData({ text: '大修施工员' })
        } else if (res.data.data.order_type == 6){
          that.setData({ text: '维保员' })
        }
        that.setData({
          wsrc: res.data.data.avatar,
          name: res.data.data.nickname
        })
      }
    }); 

    wx.getUserInfo({
      success: res => {
        app.globalData.userInfo = res.userInfo
        this.setData({
          wsrc: res.userInfo.avatarUrl,
          name: res.userInfo.nickName
        })
      }
    })  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})