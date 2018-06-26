// pages/TreatmentProcess/TreatmentProcess.js
const app = getApp();
var that, time, optionsid, kgq, kgh, cltj, obj, myshijian, result = 0,choose = true;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 正在环节   0开工前   1开工后   2费用明细
    huanjie:0,
    // 图片
    listimg:{},
    showts:false,
    imglist:[],
    text:'',
    feiyong:0,  
    fuwulist:[],
    actionind:-1,
    mingxi:0,
    cllist:[],
    chargemode:"1",
    // 服务+明细
    sjia:0,
    tjfw:[],
    //路径头
    qzurl:'',
    flag:"",
    chargename: "",
    chargename1:"true",
    box:"",
    ischecked:'',
    orderType:'',
    orderId:'',
    reform:4//整改人员标识
    // reform:''//整改人员标识
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options,'流程页参数')
    this.setData({ 
      orderType: options.orderType, //业务类型
      rid: options.rid, //片区id
      orderId:options.orderId,
      reform: app.globalData.reformInfo//员工身份
      })
    var zongjia = 0;
    if (options.chargemode=="2"){
          this.setData({
            chargemode:2,
            chargename: "true",
            chargename1:"",
          })
    } 
    optionsid = options.ddid;
    var isArry = JSON.parse(options.option);
    if (isArry.length> 0 && isArry[0].material_name){
      var option = JSON.parse(options.option);
      if (option.length > 0) {
        for (var i = 0; i < option.length; i++) {
          zongjia = zongjia + Number(option[i].total_price);
        }
        zongjia = Math.round(zongjia * 100) / 100;
      }
      if (options.ischecked == 2){
        this.setData({
          flag: "true",
          tjfw: ["20"],
          feiyong: 20,
          mingxi: zongjia,
          sjia: 0,
          cllist: option,
          box: options.box,
          ischecked: options.ischecked
        })
      }else{
        this.setData({
          flag: "true",
          tjfw: ["20"],
          feiyong: 0,
          mingxi: zongjia,
          sjia: 0,
          cllist: option,
          box: options.box,
          ischecked: options.ischecked
        })
      }
    } else if (this.data.huanjie == 2) { 
      that = this;
      wx.request({
        url: app.globalData.protocol + '://' + app.globalData.host + '/api/Order/show?_TOKEN=' + app.globalData.token + '',
        method: 'POST',
        data: {
          id: optionsid
        },
        header: {
          'Content-Type': 'application/json'
        },
        success: function (res) {
          if (res.data.data.order_list.data.length > 0) {
            for (var i = 0; i < res.data.data.order_list.data.length; i++) {
              zongjia = zongjia + Number(res.data.data.order_list.data[i].total_price);
            }
          }
          that.setData({
            flag: "true",
            feiyomg:20,
            mingxi: zongjia,
            sjia: zongjia,
            cllist: res.data.data.order_list.data
          })
        }
      });
    };
   
   
    this.setData({
      huanjie: (options.kgq == 0) ? 0 : (options.kgh == 0) ? 1 : (options.kgq == 1) ?2:'',
      qzurl: app.globalData.protocol + '://' + app.globalData.host
    });
    that = this;
    wx.request({
      url: app.globalData.protocol + '://' + app.globalData.host + '/api/Service/index?_TOKEN=' + app.globalData.token + '',
      method: 'POST',
      data: {
        "page": 1
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        that.setData({
          fuwulist: res.data.data.data
        })
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
  
  },
  huanjie:function(e){
    console.log(e.target.dataset.hi+'环节');
    this.setData({
      huanjie: e.target.dataset.hi
    });
    that = this;
    wx.request({
      url: app.globalData.protocol + '://' + app.globalData.host + '/api/Order/show?_TOKEN=' + app.globalData.token + '',
      method: 'POST',
      data: {
        id: optionsid
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res,'获取已上传的信息');
        if (res.data.code == 0) {
          if (e.target.dataset.hi == 0){
            that.setData({
              imglist: res.data.data.before_start_ext.images,
              text: res.data.data.before_start_ext.content
            })
          }
          if (e.target.dataset.hi == 1) {
            that.setData({
              imglist: res.data.data.after_start_ext.images,
              text: res.data.data.after_start_ext.content
            })
          }
          if (that.data.reform ==4 && e.target.dataset.hi == 2){
            console.log("压力测试赋值")
            that.setData({
              imglist: res.data.data.pressure_start_ext.images,
              text: res.data.data.pressure_start_ext.content
            })
          }
        } else {
          console.log(res.data.msg);
        }
      }
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  // 双向数据绑定
  textinput:function(e){
    this.setData({
      text: e.detail.value
    })
  },
  // 更换图片
  changeImageTap(){

  },
  // 上传图片
  chooseImageTap: function () {
    var that = this;
    wx.chooseImage({
      count: 10, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        console.log(res.tempFilePaths);
        var tempFilePaths = res.tempFilePaths;
        var obj = that.data.imglist;
        for (var i = 0; i < tempFilePaths.length; i++) {
          wx.uploadFile({
            url: app.globalData.protocol + '://' + app.globalData.host + '/api/Upload/upload?_TOKEN=' + app.globalData.token + '',
            filePath: res.tempFilePaths[i], //获取到上传的图片
            name: 'file',
            success: function (info) {
              console.log(JSON.parse(info.data).url);//info.data就是上传成功的图片名称 您可以在wxml里面搞一个隐藏域存储起来，在上面Submit提交里拼装一块提交出去
              // console.log(res.tempFilePaths);
              // // success
               var obj = that.data.imglist;
              // var tempFilePaths = res.tempFilePaths;
              // for (var i = 0; i < tempFilePaths.length; i++) {
               obj.push(JSON.parse(info.data).url);
              // }
               that.setData({
                 imglist: obj
               })
            }
          })
        }
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })

  },
  // 非整改请求
  beforeRequest(myshijian){
    let that = this;
    obj = {
      id: optionsid,
      created_at: myshijian,
      images: that.data.imglist,
      content: that.data.text
    }
    console.log(obj)
    wx.request({
      url: app.globalData.protocol + '://' + app.globalData.host + '/api/Order/' + ((that.data.huanjie == 0) ? 'before_start' : 'after_start') + '?_TOKEN=' + app.globalData.token + '',
      method: 'POST',
      data: obj,
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res, '开工前/完工后');
        if (res.data.code == 0) {
          wx.showToast({
            title: res.data.msg,
            duration: 2000
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }

        if (res.data.code == 0) {
          that.setData({
            huanjie: parseInt(that.data.huanjie) + 1,
            imglist: [],
            text: ''
          })
          var aaaa = { 'target': { 'dataset': { 'hi': that.data.huanjie } } }
          time = setTimeout(function () {
            that.setData({
              showts: false
            });
          }, 3000);
          clearTimeout(time);
          that.huanjie(aaaa);
        } else {
          console.log(res.data.msg);
        }
      }
    });
  },
  // 提交
  tijiaotap: function (e) {
    var myDate = new Date();
    myshijian = myDate.getFullYear() + '-' + ((myDate.getMonth() + 1 < 10) ? myDate.getMonth()+1 : '0' + myDate.getMonth()+1) + '-' + ((myDate.getDate().toString().length == 2) ? myDate.getDate() : '0' + myDate.getDate()) + ' ' + ((myDate.getHours().toString().length == 2) ? myDate.getHours() : '0' + myDate.getHours()) + ':' + ((myDate.getMinutes().toString().length == 2) ? myDate.getMinutes() : '0' + myDate.getMinutes()) + ':' + ((myDate.getSeconds().toString().length == 2) ? myDate.getSeconds() : '0' + myDate.getSeconds());
    that = this;
    if (that.data.huanjie!=2){
      // 判断输入内容是否为空
      if (that.data.huanjie == 1){//开工后
        console.log(that.data.text,'完工后')
        if (!that.data.text){
          console.log(that.data.text,'内容不能为空')
          wx.showToast({
            title: '内容不能为空',
            icon:"none"
          })
        }else{
          that.beforeRequest(myshijian);
        }
      }else{
        that.beforeRequest(myshijian);
      }
      
    }else{
      // 整改人员压力测试上传成功后隔两秒跳转到确认完工页
      if(that.data.reform==4){
        console.log("压力测试提交")
        obj = {
          id: optionsid,
          created_at: myshijian,
          images: that.data.imglist,
          content: that.data.text
        }
        var chargemode = that.data.chargemode;
        var box = that.data.box;
        var opition = that.data.cllist;
        
        console.log(obj,'压力测试参数')
          wx.request({
            url: app.globalData.protocol + '://' + app.globalData.host + '/api/Order/pressure?_TOKEN=' + app.globalData.token + '',
            method: 'POST',
            data: obj,
            header: {
              'Content-Type': 'application/json'
            },
            success(res){
              console.log(res, '压力测试上传成功跳转完工页');
              if (res.data.code == 0) {
                wx.showToast({
                  title: res.data.msg
                })
              } else {
                wx.showToast({
                  title: res.data.msg,
                  icon: 'none'
                })
              }
              if (res.data.code == 0) {
                  that.setData({
                    imglist: [],
                    text: ''
                  })   
                wx.navigateTo({
                  url: '../OrderDetails/OrderDetails?opition=' + opition + '&chargemode=' + chargemode + '&box=' + box + '&ischecked=' + that.data.ischecked+'&orderId='+that.data.orderId
                })
              } else if (res.data.code == -2){
                wx.showToast({
                  title: res.data.msg,
                  icon: 'none'
                })
                console.log(res.data.msg,'压力测试报错');
              }else{
                console.log(res.data.msg);
              }
            }
          })
      }else{
        // 非整改人员上传费用明细数据
        if (that.data.cllist && that.data.cllist.length != 0) {
          var name = "name";
          for (var i = 0; i < that.data.cllist.length; i++) {
            that.data.cllist[i][name] = that.data.cllist[i].material_name;
          }
          if (!that.data.cllist.gyid) {
            that.data.cllist.gyid = 1;
          }
          obj = {
            id: optionsid,
            created_at: myshijian,
            all_total_price: that.data.sjia,
            service: this.data.tjfw,
            data: that.data.cllist,
            gyid: that.data.cllist.gyid,
            chargemode: this.data.chargemode,
            box: this.data.box
          }
          var opitionId = "opitionId";
          var charge = "charge";
          obj.data[0][opitionId] = obj.id;
          obj.data[0][charge] = 1;
          var chargemode = obj.chargemode;
          var box = obj.box;
          var opition = JSON.stringify(obj.data);
          wx.request({
            url: app.globalData.protocol + '://' + app.globalData.host + '/api/Order/order_list?_TOKEN=' + app.globalData.token + '',
            method: 'POST',
            data: obj,
            header: {
              'Content-Type': 'application/json'
            },
            success: function (res) {
              console.log(res)
              if (res.data.code == 0) {
                wx.navigateTo({
                  url: '../OrderDetails/OrderDetails?opition=' + opition + '&chargemode=' + chargemode + '&box=' + box + '&ischecked=' + that.data.ischecked
                })
              }
            }
          });
        } else {
          obj = {
            id: optionsid,
            created_at: myshijian,
            all_total_price: that.data.sjia,
            service: this.data.tjfw,
            data: [{}],
            gyid: '',
            chargemode: this.data.chargemode,
            box: this.data.box
          }
          var obj1 = {
            id: optionsid,
            created_at: myshijian,
            all_total_price: that.data.sjia,
            service: this.data.tjfw,
            data: [],
            gyid: '',
            chargemode: this.data.chargemode,
            box: this.data.box
          }
          var charge = "charge";
          var chargemode = obj.chargemode;
          var box = obj.box;
          obj.data[0][charge] = 1;
          var opition = JSON.stringify(obj.data);
          wx.request({
            url: app.globalData.protocol + '://' + app.globalData.host + '/api/Order/order_list?_TOKEN=' + app.globalData.token + '',
            method: 'POST',
            data: obj1,
            heWader: {
              'Content-Type': 'application/json'
            },
            success: function (res) {
              console.log(res,'费用明细')
              if (res.data.code == 0) {
                wx.navigateTo({
                  url: '../OrderDetails/OrderDetails?opition=' + opition + '&chargemode=' + chargemode + '&box=' + box + '&ischecked=' + that.data.ischecked
                })
              }
            }
          });
        }    

      }
       
    }
    console.log(that.data.huanjie,'环节');
    if (that.data.huanjie == 1) {
      wx.request({
        url: app.globalData.protocol + '://' + app.globalData.host + '/api/Service/index?_TOKEN=' + app.globalData.token + '',
        method: 'POST',
        data: {
          "page": 1
        },
        header: {
          'Content-Type': 'application/json'
        },
        success: function (res) {
          console.log(res);
          that.setData({
            fuwulist: res.data.data.data
          })
        }
      });
    }
  },
  //数据修改
  change:function(){
    var hclist = JSON.stringify(this.data.cllist);   
    wx.navigateTo({
      url: '../AddMaterial/AddMaterial?hclist=' + hclist + '&orderType=' + this.data.orderType + '&rid=' + this.data.rid
    })
  },
  // 选择服务费用
  // fuwufeitap:function(e){
  //   that = this;
  //   obj = Number(e.currentTarget.dataset.qian) + Number(that.data.mingxi)
  //   console.log(e)
  //   that.setData({     
  //     actionind: Number(e.currentTarget.dataset.ind),
  //     feiyong: e.currentTarget.dataset.qian,
  //     sjia: obj
  //   })
  // },
  checkboxChange:function(e){
    var arra = e.detail.value;
    var tjfw = [];
    if(!choose){
          if (arra.length == 0) {
            that.setData({
              flag:"",
              tjfw: tjfw,
              feiyong: 0,
              box:"",
              sjia: Number(that.data.mingxi),
              ischecked: 1
            })
          } else {
                if(!choose){
                  for (var i = 0; i < arra.length; i++) {
                    result = 20;
                  }
                  tjfw.push(this.data.fuwulist[0].price);
                  that.setData({
                    flag: "true",
                    tjfw: tjfw,
                    box:"true",
                    feiyong: result,
                    sjia: result + Number(that.data.mingxi),
                    ischecked: 2
                  })
                }
          }
    }else{
      if (arra.length == 0) {
        //未选择服务费
        that.setData({
          tjfw: tjfw,
          feiyong: 0,
          sjia: 0,
          box:"",
          ischecked:1
        })
      } else {
        //选择服务费
        for (var i = 0; i < arra.length; i++) {
          result = 20;
          tjfw.push(this.data.fuwulist[arra[i].split(',')[1]]);
        }
        that.setData({
          tjfw: tjfw,
          feiyong: result,
          sjia: 0,
          box:"true",
          ischecked:2
        })
      }
    }
  },
  //自主收费
  radioChange:function(e){
    if (e.detail.value === "1"){
      choose = true;
        that.setData({         
          sjia: 0,
          chargemode:"1"
        })
      }else{
      choose = false;
        that.setData({
          sjia: result + Number(that.data.mingxi),
          chargemode: "2"
        })
      }
  },
  // 重新设置钱
  setfeiyong:function(){
    that.setData({
      actionind: -1,
      feiyong: 0
    })
  }
})