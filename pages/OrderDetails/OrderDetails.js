// pages/OrderDetails/OrderDetails.js
//获取应用实例
const app = getApp();
var that, obj, optionss, optionsid;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 订单详情数据
    list: {},
    before_record: [],
    after_record: [],
    pressure_record:[],
    qzurl: "",
    cllist: [],
    //合计金额
    sjia: "",
    chargeMode: "",
    comment_status: 1,
    //默认状态为未收费
    charge: 0,
    options: "",
    changename: "",
    box: "",
    ischecked: 0,
    disa: 'false',//确认完工和订单修改按钮
    phoneHave: true,//是否有手机号码
    giveUp: false,//放弃弹窗
    repaireType: '',
    orderType:1,
    surveyName: '整改测试',//整改员会看到勘察人员姓名
    reform: 4 //整改人员标识
    // reform: ''//整改人员标识
  },
  getRes(res) {
    that = this
    that.setData({
      orderType: res.data.data.order_type, rid: res.data.data.rid
    })
    if (res.data.data.mobile) {
      that.setData({
        phoneHave: true
      })
    } else {
      that.setData({
        phoneHave: false
      })
    }
    if (res.data.data.order_type == 1) {
      res.data.data.order_type = '户内维修';
      that.setData({ repaireType: '报修' })
    } else if (res.data.data.order_type == 2) {
      res.data.data.order_type = '户内整改'
      that.setData({ problem: '整改' })
    } else if (res.data.data.order_type == 3) {
      res.data.data.order_type = '抢险工程'
      that.setData({ repaireType: '抢险' })
    } else if (res.data.data.order_type == 4) {
      res.data.data.order_type = '软管更换'
      that.setData({ problem: '更换' })
    } else if (res.data.data.order_type == 5) {
      res.data.data.order_type = '大修工程'
      that.setData({ repaireType: '大修' })
    } else if (res.data.data.data[i].order_type == 6) {
      res.data.data.order_type = '维保工程'
      that.setData({ problem: '维保' })
    }
    if (that.data.comment_status == 1) {
      console.log(res.data.data)
      if (res.data.code == 0) {
        if (res.data.data.order_list.data.length > 0) {
          var zongjia = 0;
          for (var i = 0; i < res.data.data.order_list.data.length; i++) {
            zongjia = zongjia + Number(res.data.data.order_list.data[i].total_price)
          }
          that.setData({
            list: res.data.data,
            sjia: zongjia,
            cllist: res.data.data.order_list.data
          })

        } else {
          that.setData({
            list: res.data.data
          })
        }

      } else {
        console.log(res.data.msg);
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ reform: app.globalData.reformInfo})//员工身份
    if (options.orderId){
      this.setData({
        orderId: options.orderId 
      })
    }
    var opt = [];
    console.log(options, '详情页订单id')
    if (options.opition) {
      opt = JSON.parse(options.opition);
    }
    if (options.ddid) {
      optionss = options.ddid;
    } else {
      var heji = 0;
      for (var i = 0; i < opt.length; i++) {
        heji = heji + Number(opt[i].total_price);
      }
      //如果是甲方签订收费方式那么合计为0
      if (this.data.reform != 4 || this.data.reform != 1 && this.data.orderType) {
        if (options.chargemode === "1") {
          this.setData({
            chargemode: options.chargemode,
            chargename: "甲方签证"
          })
          heji = 0;
        } else {
          this.setData({
            chargemode: options.chargemode,
            chargename: "自主收费"
          })
        }
      }
      console.log(opt, '收费')
      if (opt.length != 0) {
        this.setData({
          charge: opt[0].charge,
          cllist: opt,
          sjia: heji,
          options: options.option,
          chargename: opt.chargename,
          box: options.box,
          ischecked: options.ischecked
        })
        optionss = opt[0].opitionId;
      }

    }

    if (options.ddid) {
      optionsid = options.ddid;
    } else {
      optionss = optionsid
    }
    that = this;
    that.setData({
      qzurl: app.globalData.protocol + '://' + app.globalData.host
    });
    wx.request({
      url: app.globalData.protocol + '://' + app.globalData.host + '/api/Order/show?_TOKEN=' + app.globalData.token + '',
      method: 'POST',
      data: {
        id: optionss
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res, '详情页订单数据');
        that.getRes(res);
      }
    });
    

  },
  goProcess: function () {
    var option = JSON.stringify(this.data.cllist);
    //设置开工时间
    wx.request({
      url: app.globalData.protocol + '://' + app.globalData.host + '/api/order/start_work?_TOKEN=' + app.globalData.token + '',
      method: 'POST',
      data: {
        id: optionss
      },
      header: {
        'Content-Type': 'application/json',
        'TOKEN': app.globalData.token
      },
      success: function (res) {
        console.log(res)
      }
    })
    wx.navigateTo({
      url: '../TreatmentProcess/TreatmentProcess?ddid=' + optionss + '&kgq=' + this.data.list.before_start_ext_status + '&kgh=' + this.data.list.after_start_ext_status + '&clth=' + this.data.list.order_list_status + '&option=' + option + '&chargemode=' + this.data.chargemode + "&box=" + this.data.box + '&ischecked=' + this.data.ischecked + '&orderType=' + this.data.orderType + '&rid=' + this.data.rid+'&orderId='+this.data.orderId
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  //点击预览图片
  yulan: function (e) {
    wx.previewImage({
      urls: [e.currentTarget.dataset.src] // 需要预览的图片http链接列表
    })
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
  // 一键拨号
  callmeTap: function () {
    that = this;
    if (that.data.list.mobile) {

    }
    wx.makePhoneCall({
      phoneNumber: that.data.list.mobile
    })
  },
  // 上面哪个列表的选择
  toptap: function (e) {
    var currentid = parseInt(e.currentTarget.id)
    this.setData({
      comment_status: currentid
    })
    if (currentid == "0") {//勘察记录
      this.getrecord();
    } else if (currentid == "2") { //整改记录
      this.getReform();
    }
  },
  //获取操作记录/勘察记录
  getrecord: function () {
    var that = this;
    // 整改员获取勘察记录和整改记录
    if (that.data.reform == 4 || that.data.orderType == 2 && that.data.reform == 1) {
      wx.request({
        url: app.globalData.protocol + '://' + app.globalData.host + '/api/Order/internal_details?_TOKEN=' + app.globalData.token + '',
        method: 'POST',
        data: {
          order_id: that.data.orderId,
          survey_status: 1//勘察记录
        },
        header: {
          'Content-Type': 'application/json'
        },
        success: function (res) {
          console.log(res, '勘察记录');
          if (res.data.code == 0) {
            that.setData({
              before_record: res.data.data.before_start_ext,
              after_record: res.data.data.after_start_ext
            })
          } else {
            console.log(res.data.msg);
          }
        }
      });
     
    } else {
      wx.request({
        url: app.globalData.protocol + '://' + app.globalData.host + '/api/Order/show?_TOKEN=' + app.globalData.token + '',
        method: 'POST',
        data: {
          id: optionss
        },
        header: {
          'Content-Type': 'application/json'
        },
        success: function (res) {
          console.log(res,'非整改获取记录')
          if (res.data.code == 0) {
            that.setData({
              before_record: res.data.data.before_start_ext,
              after_record: res.data.data.after_start_ext
            })
          } else {
            console.log(res.data.msg);
          }
        }
      });
    }
    
  },
  // 获取整改记录
  getReform(){
    let that = this;
    wx.request({
      url: app.globalData.protocol + '://' + app.globalData.host + '/api/Order/internal_details?_TOKEN=' + app.globalData.token + '',
      method: 'POST',
      data: {
        order_id: that.data.orderId,
        survey_status: 2//整改记录
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res, '详情页订单数据 整改记录');
        if (res.data.code == 0) {
          if (res.data.data.before_start_ext){
            that.setData({
              before_record: res.data.data.before_start_ext,
              after_record: res.data.data.after_start_ext,
              pressure_record: res.data.data.pressure_start_ext
            })
          }else{
            console.log("该订单还没有勘察")
            that.setData({
              before_record: '', after_record: '', pressure_record: ''
            })
          }
          
        } else {
          console.log(red.data.msg)
        }
      }
    });
  },
  //   放弃弹窗确认按钮
  bindFormSubmit: function (e) {
    that = this
    var texValue = e.detail.value.textarea
    console.log(texValue)
    if (texValue == ' ') {
      return
    } else {
      wx.request({
        url: app.globalData.protocol + '://' + app.globalData.host + '/api/Order/grab_drop?_TOKEN=' + app.globalData.token + '',
        method: 'POST',
        data: {
          id: optionss
        },
        header: {
          'Content-Type': 'application/json'
        },
        success: function (res) {
          console.log(res);
          if (res.data.code == 0) {
            wx.redirectTo({
              url: '../OrderList/OrderList'
            })
          } else {
            console.log(res.data.msg);
          }
        }
      });


      //   提交放弃原因
      wx.request({
        url: app.globalData.protocol + '://' + app.globalData.host + '/api/order/qd_add?_TOKEN=' + app.globalData.token + '',
        method: 'POST',
        data: {
          order_id: optionss,
          content: texValue
        },
        header: {
          'Content-Type': 'application/json'
        },
        success: function (res) {
          console.log(res.data.msg)
        }
      });
      that.setData({
        giveUp: false
      })
    }

  },
  //  放弃已抢未开工订单
  esctap: function () {
    this.setData({
      giveUp: true
    })
  },
  // 取消弃单
  cancel() {
    this.setData({ giveUp: false })
  },
  //确认收款
  charges: function () {
    this.setData({
      //改变订单状态是否已收款
      charge: 1
    })
  },
  // 确认线下收费
  shouqiantap: function () {
    var that = this;
    that.setData({
      //改变订单状态是否已收款
      charge: 1,
      disa: 'true'
    })
    wx.request({
      url: app.globalData.protocol + '://' + app.globalData.host + '/api/Order/receipt?_TOKEN=' + app.globalData.token + '',
      method: 'POST',
      data: {
        id: optionss
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res);
        if (res.data.code == 0) {
          wx.navigateTo({
            url: '../OrderList/OrderList?comment_status=1'
          })
        } else {
          console.log(res.data.msg);
        }
      }
    });
  }
})