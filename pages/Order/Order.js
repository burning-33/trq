    // pages/Order/Order.js
const app = getApp();
var that,obj,dataid,time,zdata;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 弹出提示
    showts:false, 
    showtss:false,
    msg:'',
    page:1,
    daodi:false,
    list:[],
    ddid:0,
    orderId:'',
    huifou:false,
    giveUp:false,//放弃弹窗
    texValue: '', //放弃弹窗输入内容
    fangqiId:'',
    phoneHave:'',
    phoneHaveArr:[],
    repaireType:'',
    surveyName:'整改测试',//整改员会看到勘察人员姓名
     reform: 4 //整改人员标识
    // reform: ''//整改人员标识
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    qianglist(this);
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
    this.setData({page:1})
    that = this;
    // 获取列表
    qianglist(this);
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
    qianglist(this)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.setData({
      page:this.data.page+1
    })
    qianglist(this);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  // 抢单
  jiedantap:function(e){
    that = this;
    dataid = e.target.dataset.id;

    wx.request({
      url: app.globalData.protocol + '://' + app.globalData.host + '/api/Order/grab?_TOKEN=' + app.globalData.token + '',
      method: 'POST',
      data: {
        "id": dataid
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        if(res.data.code==0){
          that.setData({
            showts: true,
            ddid: dataid,
            orderId: e.target.dataset.orderid
          });
        }else{
          that.setData({
            showtss: true,
            msg: res.data.msg
          });
          clearTimeout(time);
          time = setTimeout(function () {
            that.setData({
              showtss: false
            });
          }, 3000);
        }
        that.setData({
          page: 1
        })
        qianglist(that);        
      }
    });
    
  },
  // 确定信息被点
  quedingtap:function(){
    this.setData({
      showts: false
    });
    wx.navigateTo({
      url: '../OrderDetails/OrderDetails?ddid=' + this.data.ddid + '&orderId = ' + this.data.orderId
    })
  },
  // 放弃未接订单
  fangqitap:function(e){
    that = this;
    that.setData({
          giveUp:true,
           fangqiId: e.currentTarget.dataset.id
    })
    wx.request({
      url: app.globalData.protocol + '://' + app.globalData.host + '/api/Order/drop?_TOKEN=' + app.globalData.token + '',
      method: 'POST',
      data: {
        id: that.data.fangqiId
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        that.setData({
          page: 1
        })
        qianglist(that);
      }
    });
  },
  // 取消弃单
  cancel(){
    this.setData({ giveUp:false})
  }
})

// 获取抢单列
function qianglist(that){
  wx.showLoading({
    title: '数据加载中',
  })
  that.setData({ reform: app.globalData.reformInfo })//员工身份
  var arr = []
  console.log(app.globalData.token)
  wx.request({
    url: app.globalData.protocol + '://' + app.globalData.host + '/api/Order/index?_TOKEN=' + app.globalData.token + '',
    method: 'POST',
    data: {
      "page": that.data.page
    },
    header: {
      'Content-Type': 'application/json'
    },
    success: function (res) {
      if (res.data) {
        wx.hideLoading()
        console.log(res.data.data.data,'首页订单列')
        for (var i = 0; i < res.data.data.data.length; i++) {
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
          that.setData({ phoneHaveArr: arr })
          if (res.data.data.data[i].order_type == 1) {
            res.data.data.data[i].order_type = '户内维修'
            that.setData({ repaireType: '报修' })
          } else if (res.data.data.data[i].order_type == 2) {
            res.data.data.data[i].order_type = '户内整改'
            that.setData({ problem: '整改' })
          } else if (res.data.data.data[i].order_type == 3) {
            res.data.data.data[i].order_type = '抢险工程'
            that.setData({ repaireType: '抢险' })
          } else if (res.data.data.data[i].order_type == 4) {
            res.data.data.data[i].order_type = '软管更换'
            that.setData({ problem: '更换' })
          } else if (res.data.data.data[i].order_type == 5) {
            res.data.data.data[i].order_type = '大修工程'
            that.setData({ repaireType: '大修' })
          } else if (res.data.data.data[i].order_type == 6) {
            res.data.data.data[i].order_type = '维保工程'
            that.setData({ problem: '维保' })
          }

        }
        zdata = res.data.data.data;
        if (zdata.length == 0) {
          that.setData({
            daodi: true
          })
        }
        obj = (that.data.page == 1) ? [] : that.data.list;
        for (let i = 0; i < obj.length; i++) {
          if (obj[i].mobile) {
            that.setData({
              phoneHave: true
            })
          } else {
            that.setData({
              phoneHave: false
            })
          }
          arr.push(that.data.phoneHave)
          that.setData({ phoneHaveArr: arr })
        }
        for (var i = 0; i < zdata.length; i++) {
          obj.push(zdata[i]);
        }
        that.setData({
          list: obj
        })           
      }
      
    }
  });
}    