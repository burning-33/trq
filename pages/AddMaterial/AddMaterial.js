// pages/AddMaterial/AddMaterial.js
const app = getApp();
var that, obj, dataid, time, zdata, qian, hclist, gyid = "gyid";;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 左
    title: '',
    list: [],
    zuoaction: 0,
    // 右
    list2: [],
    // 层
    ceng: false,
    cengid: '',
    cengmz: '',
    cengjg: 0,
    cengdw: '',
    cenghide: '',
    // cenggg: '',
    cengsl: 0,//默认数量为1
    cengzj: 0,
    chenglist: [],
    chenlist: [],
    tjtitle: false,
    ceng2: false,
    // 回传数据
    hclist: [],
    chlist: [],
    orderType: '',
    rid:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    that = this;
    if (options.hclist) {
      hclist = JSON.parse(options.hclist);
    }
    that.setData({ orderType: options.orderType,rid:options.rid })
    console.log(hclist)
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.protocol + '://' + app.globalData.host + '/api/material_category/index?_TOKEN=' + app.globalData.token + '',
      method: 'POST',
      data: {
        order_type: parseInt(that.data.orderType)
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res.data.data,'一级材料')
        if(res.data.data){
          wx.hideLoading()
          that.setData({
            list: res.data.data,
            hclist: hclist
          })
          huoquyou(that, res.data.data[0].id);
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  // 左边被点击了
  zuotap: function (e) {
    this.setData({
      zuoaction: e.currentTarget.dataset.ind
    });

    huoquyou(this, e.currentTarget.dataset.id);
  },
  // 右边被点击了
  youtap: function (e) {
    var that = this;
    // console.log(app.globalData.token)
    // console.log(e.currentTarget.dataset.id, parseInt(that.data.orderType), parseInt(that.data.rid))
    wx.request({
      url: app.globalData.protocol + '://' + app.globalData.host + '/api/material_category/sublist?_TOKEN=' + app.globalData.token + '',
      method: 'POST',
      data: {
        category_id: e.currentTarget.dataset.id,
        bus_id: parseInt(that.data.orderType),
        rid: parseInt(that.data.rid)
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        if (res.data.data.length == 0){
          wx.showToast({
            title: '当前没有材料',
            icon: 'none'
          })
        }else{
          var num = "num";
          var yangshi = "yangshi";
          var total_price = "total_price";
          console.log(res.data.data);
          for (var i = 0; i < res.data.data.length; i++) {
            res.data.data[i][num] = 1;
            res.data.data[i][yangshi] = "defalut";
            res.data.data[i][total_price] = res.data.data[i].price;
            if (res.data.data[i].specification === "") {
              that.setData({
                ceng: true,
                title: e.currentTarget.dataset.name,
                chenglist: [],
                chenlist: res.data.data,
                cengdw: 1,
                cenghide: 'cenghide'
              })
              return;
            } else {
              that.setData({
                ceng: true,
                title: e.currentTarget.dataset.name,
                chenglist: res.data.data,
                cengdw: 1,
                chenlist: [],
                cenghide: ""
              })
            }
          }
        }
        
      }
    });
  },
  //点击复选框添加数据
  checkboxChange: function (e) {
    this.setData({
      chenlist: [],
    })
    for (var i = 0; i < this.data.chenglist.length; i++) {
      //判断当前点击的是否已经是选中状态，如果是已经选中了再次点击的时候取消选中状态
      if (this.data.chenglist[i].yangshi === "is_checked") {
        this.data.chenglist[i].yangshi = "defalut";
      }
      this.setData({
        chenglist: this.data.chenglist
      })
    }
    for (var i = 0; i < e.detail.value.length; i++) {
      this.data.chenlist.push(this.data.chenglist[e.detail.value[i]]);
      //如果当前点击的是没选中状态，添加选中状态效果 
      if (this.data.chenglist[e.detail.value[i]].yangshi === "defalut") {
        this.data.chenglist[e.detail.value[i]].yangshi = "is_checked";
      } else {
        this.data.chenglist[e.detail.value[i]].yangshi = "defalut";
      }
      console.log(this.data.chenlist);
      this.setData({
        cengsl: 1,
        ceng2: true,
        cenghide: "",
        cengzj: this.data.chenlist[i].price,
        chenglist: this.data.chenglist,
        chenlist: this.data.chenlist
      })
    }
    //选择的材料多余一种
    if (this.data.chlist.length > 0) {
      for (var j = 0; j < this.data.chlist.length; j++) {
        for (var k = 0; k < this.data.chenlist.length; k++) {
          if (this.data.chlist[j].id === this.data.chenlist[k].id) {
            this.data.chenlist[k].num = this.data.chlist[j].num;
            this.data.chenlist[k].total_price = this.data.chenlist[k].num * this.data.chenlist[k].price;
            this.setData({
              ceng2: true,
              cenghide: "",
              cengsl: this.data.chenlist[k].num,
              cengzj: this.data.chenlist[k].total_price,
              chenlist: this.data.chenlist
            })
          }
        }


      }
    }

  },
  // 隐藏层
  cengsec: function () {
    this.setData({
      ceng: false,
      cengid: '',
      cengmz: '',
      cengjg: 0,
      cengdw: '',
      cenggg: '',
      chenlist: [],
      cenghide: ""
    })
  },
  // 双向数据绑定
  sxinput: function (e) {
    obj = this.data.chenlist[e.currentTarget.dataset.id].price * e.detail.value;
    qian = Number(e.detail.value);
    if (qian > 0) {
      var chlist = this.data.chenlist[e.currentTarget.dataset.id];
      zdata = {
        name: chlist.material_name + ' ' + chlist.specification,
        num: qian,
        price: chlist.price,
        specification: chlist.specification,
        total_price: qian * chlist.price
      }
      this.data.chenlist[e.currentTarget.dataset.id].num = Number(e.detail.value);
      this.data.chenlist[e.currentTarget.dataset.id].total_price = this.data.chenlist[e.currentTarget.dataset.id].price * e.detail.value;
      this.data.chlist = zdata;
      this.setData({
        cengsl: this.data.cengsl + qian,
        cengzj: this.data.cengzj + obj,
        chenlist: this.data.chenlist,
        chlist: this.data.chenlist
      })
    } else {
      this.data.chenlist[e.currentTarget.dataset.id].num = Number(e.detail.value);
      this.setData({
        cengsl: this.data.cengsl + qian,
        cengzj: this.data.cengzj + obj,
        chenlist: this.data.chenlist,
        chlist: this.data.chenlist
      })
    }
  },
  // 双向数据绑定二改
  zhinput: function (e) {
    obj = this.data.hclist;
    obj[e.currentTarget.dataset.ind].num = Number(e.detail.value)
    this.setData({
      hclist: obj
    })
  },
  changegy: function (e) {
    this.data.hclist[gyid] = e.detail.value;
  },
  // 提交个体数据
  tijiaotap: function (e) {
    that = this;
    var flag = false;
    for (var i = 0; i < that.data.chenlist.length; i++) {
      //判断如果提交的数量是否有小于1的
      if (that.data.chenlist[i].num < 1) {
        flag = true;
        break;
      }
    }
    //提交数量没有小于1的
    if (!flag) {
      if (that.data.hclist && that.data.hclist.length > 0) {
        for (var i = 0; i < that.data.chenlist.length; i++) {
          //添加新材料，在之前有材料的基础上进行push
          that.data.hclist.push(that.data.chenlist[i]);
        }
        obj = that.data.hclist;
      } else {
        obj = that.data.chenlist;
        obj[gyid] = 1;
      }
      that.setData({
        hclist: obj,
        // 清除弹层
        ceng: false,
        cengid: '',
        cengmz: '',
        cengjg: 0,
        cengdw: '',
        cenggg: '',
        cengsl: 0,
        cengzj: 0
      })
    } else {
      //提交数量有小于1的提示用户输入正确数量
      that.setData({
        tjtitle: true,
      });
      clearTimeout(time);
      time = setTimeout(function () {
        that.setData({
          tjtitle: false
        });
      }, 3000);
    }
  },
  // 已选材料被点击
  cengshow2: function () {
    that = this
    this.setData({
      ceng2: (that.data.ceng2) ? false : true
    })
  },
  // 已选择材料背景黑色点击
  cengsec2: function () {
    this.setData({
      ceng2: false
    })
  },
  // 删除选好了的材料
  eschclist: function (e) {
    that = this
    obj = that.data.hclist
    obj.splice(e.currentTarget.dataset.ind, 1)
    that.setData({
      hclist: obj,
      chlist: obj
    })
  },
  // 数据回传
  huichuantap: function () {
    that = this;
    obj = that.data.hclist;
    qian = 0;
    if (obj) {
      for (var i = 0; i < obj.length; i++) {
        qian += Number(obj[i].num * obj[i].price)
      }
      for (var i = 0; i < that.data.hclist.length; i++) {
        that.data.hclist[i].total_price = Number(that.data.hclist[i].num * that.data.hclist[i].price)
      }
    }
    console.log(qian, '总价')
    qian = Math.round(qian * 100) / 100;
    console.log(qian, '总价两位小数')
    // that.data.hclist.total_price = qian;
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面
    // obj = Number(qian) + Number(prevPage.data.feiyong)
    obj = Number(qian)
    //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
    prevPage.setData({
      cllist: that.data.hclist,
      mingxi: qian,
      sjia: 0,
      feiyong: 0
    })
    wx.navigateBack();

  }
})

function huoquyou(that, dataid) {
  wx.request({
    url: app.globalData.protocol + '://' + app.globalData.host + '/api/material_category/material_index?_TOKEN=' + app.globalData.token + '',
    method: 'POST',
    data: {
      category_id: dataid,
      order_type: parseInt(that.data.orderType)
    },
    header: {
      'Content-Type': 'application/json'
    },
    success: function (res) {
      console.log(res,'二级材料')
      that.setData({
        list2: res.data.data
      })
    }
  });
}