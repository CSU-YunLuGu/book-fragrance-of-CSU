// packageA/pages/check/check.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        time_arr:["09:10~09:50","10:00~10:40","11:00~11:40","14:00~14:40","15:00~15:40","16:00~16:40","17:00~17:40","19:00~19:40",
      "20:00~20:40","21:00~22:20"],
      color:['purple','orange','red'],
      li:[], //存数据
      status:0,
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
      index: 0,
      get_time:1,//请求数据的次数
      is_get_all:0,//是否已获取所有数据
      nothing:'hide'//页面底部空白是否显示
    },

    show_detail : function(e){
        this.setData({
            index:e.target.dataset.index,
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
  
    agree:function(){
      const _ = wx.cloud.database().command
      wx.cloud.database().collection('reserve').doc(this.data.id).update({
        data:{
          status:1
        }
      }).then(res=>{
        wx.showModal({
          title:'提示',
          confirmText:'确定',
          content:'审核成功'
        })
        console.log('审核成功')
        this.setData({
          mask: 'hide'
       })
        let temp = 'li['+this.data.index+'].status'
        this.setData({
          [temp]:1
        })
      }).catch(err=>{
        console.log('错误',err)
        show_err()
      })
      
    },

    deny:function(){
      const _ = wx.cloud.database().command
      wx.cloud.database().collection('reserve').doc(this.data.id).update({
        data:{
          status:2
        }
      }).then(res=>{
        let timeindex= get_index(this.data.time)
        console.log('否决时间为',timeindex)
        wx.cloud.database().collection('place_day_last').where({ 
          date:  this.data.date,
          place: this.data.place,
        }).update({
          data:{
            [timeindex]:30
          }
        }).then(res=>{
          wx.showModal({
            title:'提示',
            confirmText:'确定',
            content:'否决成功'
          })
          this.setData({
            mask: 'hide'
         })
         let temp = 'li['+this.data.index+'].status'
          this.setData({
            [temp]:2
          })
        }).catch(err=>{
        console.log('错误',err)
        show_err()
       })
      }).catch(err=>{
        console.log('错误',err)
        show_err()
      })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        wx.cloud.database().collection('reserve').where({
            status:0
        }).orderBy('date','desc').limit(20).get()
      .then(res=>{
        console.log('请求成功',res)
        this.setData({
            li:res.data
        })
        console.log(this.data.li)
        if(res.data.length<20)
        {
          this.setData({
            is_get_all:1,
            nothing:'nothing'
        })
        }
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
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {
        if(this.data.is_get_all==0)
      {
        let temp =[]
          wx.cloud.database().collection('reserve').where({
            status:0
        }).orderBy('date','desc').skip(this.data.get_time*20).limit(20).get()
          .then(res=>{
            console.log('请求成功',res)
            temp=res.data
            this.setData({
                li:this.data.li.concat(temp)
            })
            console.log(this.data.li)
            if(res.data.length<20)
            {
              this.setData({
                is_get_all:1,
                nothing:'nothing'
            })}
        })
        .catch(err=>{
            console.log('请求失败',err)
                wx.showModal({
                    title:'提示',
                    confirmText:'确定',
                    content:'网络异常'
                })
        })
      }
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
            url: '../../../pages/reserve/reserve',
          })
          
        }
      }
    })
  }