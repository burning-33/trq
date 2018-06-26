//index.js
//获取应用实例
const app = getApp();
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showts:'',
    msg:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // that = this;
    // var time = setInterval(function () {
    //   if (app.globalData.code && app.globalData.encryptedData && app.globalData.iv && app.globalData.token) {
    //     // 获取Token
    //     wx.request({
    //       url: app.globalData.protocol + '://' + app.globalData.host + '/api/Engineer/bind?_TOKEN=' + app.globalData.token,
    //       data: {
    //         "code": app.globalData.code,
    //         "encryptedData": app.globalData.encryptedData,
    //         "iv": app.globalData.iv
    //       },
    //       header: {
    //         'content-type': 'application/json'
    //       },
    //       method: "POST",//get为默认方法/POST
    //       success: function (res) {
    //         console.log(res);
    //         if (res.data.code == 0) {
    //            console.log('绑定微信成功');
    //         } else {
    //           that.setData({
    //             showts: true,
    //             msg: res.data.msg
    //           });
    //           clearTimeout(time);
    //           time = setTimeout(function () {
    //             that.setData({
    //               showts: false
    //             });
    //           }, 3000);
    //         }
    //       }
    //     });
    //     clearInterval(time);
    //   }
    // }, 100);
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