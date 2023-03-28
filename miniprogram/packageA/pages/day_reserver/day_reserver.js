// packageA/pages/all_reserver/all_reserver.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
      page_time:'',
      page_date:'',
      page_place:'',
      time_arr:["09:10~09:50","10:00~10:40","11:00~11:40","14:00~14:40","15:00~15:40","16:00~16:40","17:00~17:40","19:00~19:40",
      "20:00~20:40","21:00~22:20"],
      li:[],
      mask:'hide',
      class:'',
      name:'',
      phone:'',
      place:'',
      date:'',
      time:'',
      id:'',
      mail:'',
      model:'',
      useage:'',
    },

    show_detail : function(e){
      this.setData({
          mail:this.data.li[e.target.dataset.index].mail,
          name: this.data.li[e.target.dataset.index].name,
          phone: this.data.li[e.target.dataset.index].phone,
          place: this.data.li[e.target.dataset.index].place,
          date: this.data.li[e.target.dataset.index].date,
          time: this.data.li[e.target.dataset.index].time,
          id: this.data.li[e.target.dataset.index]._id,
          model: this.data.li[e.target.dataset.index].model,
          class:this.data.li[e.target.dataset.index].class,
          useage:this.data.li[e.target.dataset.index].useage,
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
                content:'取消预约成功（如需查看最新数据，请刷新页面）',
              })
              that.setData({
                mask:'hide'
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

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      if(options.place==1)
      {
        this.setData({
          page_place:"沙龙室1",
          page_time: this.data.time_arr[options.index],
          page_date: options.date
      })
      }
      else
      {
        this.setData({
          page_place:"沙龙室2",
          page_time: this.data.time_arr[options.index],
          page_date: options.date
        })
      }
      
      //连接数据库，获取数据
        wx.cloud.database().collection('reserve').where({
          date:this.data.page_date,
          place:this.data.page_place,
          time:this.data.page_time,
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