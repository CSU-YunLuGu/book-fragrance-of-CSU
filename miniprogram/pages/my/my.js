// pages/my/my.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
      openid:'',
		  color:["orange","purple"],
        li:[],
        mask:'hide',
        name:'',
        phone:'',
        place:'',
        date:'',
        time:'',
        id:'',
        model:'',
        admin:'hide',
        password:'',
        real_password:'abcdef',
        try_time:0,
    },

    show_detail : function(e){
        this.setData({
            name: this.data.li[e.target.dataset.index].name,
            phone: this.data.li[e.target.dataset.index].phone,
            place: this.data.li[e.target.dataset.index].place,
            date: this.data.li[e.target.dataset.index].date,
            time: this.data.li[e.target.dataset.index].time,
            id: this.data.li[e.target.dataset.index]._id,
            model: this.data.li[e.target.dataset.index].model,
            mask:'mask'
        })
    },

    hide_detail:function(){
        this.setData({
           mask: 'hide'
        })
    },

    cancel_reserve:function(e){
      var that = this
      wx.showModal({
        title:'提示',
        confirmText:'确定',
        content:'要取消预约吗？',
        success: function(res){
          if(res.confirm)
          {
              let num
              if(that.data.model=='个人')
                num=1
              else
                num=30
              let timeindex= get_index(that.data.time)
              console.log('取消时间为',timeindex)
              console.log('数据库要增加人数为',num)
              const _ = wx.cloud.database().command
          wx.cloud.database().collection('reserve').doc(that.data.id).remove().then(res=>{
            wx.cloud.database().collection('place_day_last').where({ 
              date:  that.data.date,
              place: that.data.place,
            }).update({
              data:{
                [timeindex]:_.inc(num)
              }
            }).then(res=>{
              wx.showModal({
                  title:'提示',
                  confirmText:'确定',
                  content:'取消预约成功',
                  success: function(res){
                    if(res.confirm)
                    {
                      wx.reLaunch({
                        url: '../my/my',
                      })
                    }
                  }
                })
              console.log('取消预约成功')
            }).catch(err=>{
              console.log('错误',err)
              show_err()
            })}).catch(err=>{
              console.log('错误',err)
              show_err()
            })
          }
        }
      })
    },

    add_password:function(e) //获取职工号
    {
      this.setData({
        password: e.detail.value
      })
    },

    to_admin:function(){
      if(this.data.password==this.data.real_password)
      {
        wx.navigateTo({
          url: '../../packageA/pages/admin/admin',
        })
      }
      else{
        this.setData({
          try_time:this.data.try_time+1,
          admin:'hide'
        })
        wx.showModal({
          title:'提示',
          confirmText:'确定',
          content:'密码错误'+this.data.try_time+'次，连续错误5次后页面将被锁定',
        })
      }
    },

    cancel:function(){
      this.setData({
        admin:'hide'
      })
    },

    show_admin:function(){
      if(this.data.try_time<5)
      {
        this.setData({
          admin:'admin'
        })
      }
      else{
        wx.showModal({
          title:'提示',
          confirmText:'确定',
          content:'您已输错密码五次，管理员界面已被锁定',
        })
      }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      const app = getApp();
      this.setData({
        openid:app.globalData.openid,
      })
      console.log('启动者为',this.data.openid)
        wx.cloud.database().collection('reserve').where({
          _openid:this.data.openid
        }).get()
      .then(res=>{
        console.log('请求成功',res)
        this.setData({
            li:res.data.reverse()
        })
        console.log(this.data.li)
    })
    .catch(err=>{
        console.log('请求失败',err)
            wx.showModal({
                title:'提示',
                confirmText:'确定',
                content:'网络异常'
            })
    })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})
function show_err(){
    wx.showModal({
      title:'提示',
      confirmText:'确定',
      content:'网络异常，请刷新页面',
      success: function(res){
        if(res.confirm)
        {
          wx.reLaunch({
            url: '../reserve/reserve',
          })
          
        }
      }
    })
  }

  function get_index(str){
    if(str=='09:10~09:50')
        return "time01"
    else if(str=='10:00~10:40')
        return "time02"
    else if(str=='11:00~11:40')
        return "time03"
    else if(str=='14:00~14:40')
        return "time04"
    else if(str=='15:00~15:40')
        return "time05"
    else if(str=='16:00~16:40')
        return "time06"
    else if(str=='17:00~17:40')
        return "time07"
    else if(str=='19:00~19:40')
        return "time08"
    else if(str=='20:00~20:40')
        return "time09"
    else
        return "time10"
  }