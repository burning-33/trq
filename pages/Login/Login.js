// pages/Login/Login.js
const app = getApp();
var time, that, formData, useerName, useerPsd;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 是否弹出提示
    showts:false,
    msg:'',
    names:"",
    psd:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that =this;
        wx.getStorage({
          key: 'name',
          success: function(res) {
            that.setData({
              names:res.data
            })
          },
        }),
        wx.getStorage({
          key: 'psd',
          success: function (res) {
            that.setData({
              psd: res.data
            })
          },
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
  
  },
  //保存用户信息
  // save_name: function (e) {
  //   useerName = e.detail.value;
  // },
  // save_psd: function (e) {
  //   useerPsd = e.detail.value;
  // },
  // 登录
  formSubmit:function(e){
    that = this;  
    formData = e.detail.value;
    wx.setStorage({
      key: 'name',
      data: formData.username,
    })
    wx.setStorage({
      key: 'psd',
      data: formData.password,
    })
    wx.request({
      url: app.globalData.protocol + '://' + app.globalData.host +'/api/Engineer/login',
      method:'POST',
      data: formData,
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        if(res.data.code==0){
          app.globalData.token = res.data.data.token;
          app.globalData.reformInfo = res.data.data.info;
          wx.switchTab({
            url: '../index/index'
          });
        }else{          
          that.setData({
            showts: true,
            msg:res.data.msg
          });
          clearTimeout(time);
          time = setTimeout(function () {
            that.setData({
              showts: false
            });
          }, 3000);
        }
        
      }
    });
  },
})