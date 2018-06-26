// pages/OrderList/OrderList.js
//获取应用实例
const app = getApp();
var that, obj;
Page({


  /**
   * 页面的初始数据
   */
  data: {
    // 上面两个选择
    comment_status: 0,
    pages: [1, 1],
    daodi: [false, false],
    list: [],
    list2: [],
    huifou:true,
    // 班长
    banzhang: 0,
    xiashu: [],
    xiashudata: [],
    index: 0,
    phoneHave: '',
    phoneHaveArr: [],
    orderType:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
        console.log(options)
        if (options.comment_status){
              this.setData({
                    comment_status: options.comment_status
              })
        }else{
              this.setData({
                    comment_status:0
              })
        }
       
    that = this;
    // 是否是班长
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
        console.log(res)
        that.setData({
          banzhang: res.data.data.is_monitor
        })
        // 是班长的话获取下属员工
        if (res.data.data.is_monitor == 2) {
          wx.request({
            url: app.globalData.protocol + '://' + app.globalData.host + '/api/Engineer/lower?_TOKEN=' + app.globalData.token + '',
            method: 'POST',
            header: {
              'Content-Type': 'application/json'
            },
            success: function (res) {
              that.setData({
                xiashu: res.data.data
              })
              obj = [];
              for (var i = 0; i < that.data.xiashu.length; i++) {
                obj.push(that.data.xiashu[i].username + '-' + that.data.xiashu[i].mobile);
              }
              that.setData({
                xiashudata: obj
              })
            }
          });
        }
      }
    });
   that.getAllOrder(that);
  },
  getAllOrder(that){
    that.setData({
      daodi:[false,false],
      pages: [1, 1]
    })
    wx.request({
      url: app.globalData.protocol + '://' + app.globalData.host + '/api/Order/all_orders?_TOKEN=' + app.globalData.token + '',
      method: 'POST',
      data: {
        status: 1,
        page: that.data.pages[0]
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res,'订单列未完成订单');
        if (res.data.code == 0) {
          that.setData({
            list: res.data.data.data,
          })
          var arr = []
          if (res.data) {
            for (var i = 0; i < res.data.data.data.length; i++) {
              that.setData({
                orderType: res.data.data.data[i].order_type,
              })
              if (res.data.data.data[i].mobile) {
                that.setData({
                  phoneHave: true
                })
              } else {
                that.setData({
                  phoneHave: false
                })
              }
              arr.push(that.data.phoneHave)
            }
            that.setData({
              phoneHaveArr: arr
            })
          }


        } else {
          console.log(res.data.msg);
        }
      }
    });
    wx.request({
      url: app.globalData.protocol + '://' + app.globalData.host + '/api/Order/all_orders?_TOKEN=' + app.globalData.token + '',
      method: 'POST',
      data: {
        status: 4,
        page: that.data.pages[1]
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res, '订单列已完成订单');
        for (var i = 0; i < res.data.data.data.length; i++) {
          that.setData({
            orderType: res.data.data.data[i].order_type,
          })
        }
        if (res.data.code == 0) {
          that.setData({
            banzhang: 0,
            list2: res.data.data.data
          })
        } else {
          console.log(res.data.msg);
        }
      }
    });
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
    that = this;
    obj = that.data.pages;
    obj[that.data.comment_status] = obj[that.data.comment_status] + 1;
    that.setData({
      pages: obj,
    })
    if (that.data.huifou) {
      that.setData({
        huifou: false
      });
      wx.request({
        url: app.globalData.protocol + '://' + app.globalData.host + '/api/Order/all_orders?_TOKEN=' + app.globalData.token + '',
        method: 'POST',
        data: {
          comment_status: that.data.comment_status,
          page: that.data.pages[that.data.comment_status]
        },
        header: {
          'Content-Type': 'application/json'
        },
        success: function (res) {
          console.log(res);
          that.setData({
            huifou: true
          });
          if (res.data.code == 0) {
            // 已经显示完了
            if (that.data.pages[that.data.comment_status] >= res.data.data.last_page) {
              obj = that.data.daodi;
              obj[that.data.comment_status] = true;
              that.setData({
                daodi: obj,
                huifou: false
              });
            }
            obj = (that.data.comment_status == 0) ? that.data.list : that.data.list2;
            for (var i = 0; i < res.data.data.data.length; i++) {
              obj.push(res.data.data.data[i]);
            }
            if (that.data.comment_status == 0) {
              that.setData({
                list: obj
              })
            } else {
              that.setData({
                list2: obj
              })
            }
          } else {
            console.log(res.data.msg);
            that.setData({
              huifou: false
            });
          }
        }
      });
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  // 上面哪个列表的选择
  toptap: function (e) {
    this.setData({
      comment_status: parseInt(e.currentTarget.id)
    });
  },
  // 获取派送给谁
  bindPickerChange: function (e) {
    that = this;
    that.setData({
      index: e.detail.value
    })
    wx.request({
      url: app.globalData.protocol + '://' + app.globalData.host + '/api/Order/reassignment?_TOKEN=' + app.globalData.token + '',
      method: 'POST',
      data: {
        id: e.currentTarget.dataset.id,
        aeid: that.data.xiashu[that.data.index].id
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        obj = that.data.pages;
        obj[0] = 1;
        that.setData({
          pages: obj
        })
        wx.request({
          url: app.globalData.protocol + '://' + app.globalData.host + '/api/Order/all_orders?_TOKEN=' + app.globalData.token + '',
          method: 'POST',
          data: {
            status: 1,
            page: that.data.pages[0]
          },
          header: {
            'Content-Type': 'application/json'
          },
          success: function (res) {
            console.log(res);
            if (res.data.code == 0) {
              that.setData({
                list: res.data.data.data
              })
            } else {
              console.log(res.data.msg);
            }
          }
        });
      }
    });
  }
});