// pages/my/my.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        openid:'',
        color:["purple","orange","red","red"], //红色是未过审，紫色待审核，橙色过审
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
        key:'abcdef',
        try_time:0,
        useage:'',
        status:0,
        user_date:'', //user表中的date
        dis_reserve_time:0, //取消预约的次数
        tomorrow:'',
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
            useage:this.data.li[e.target.dataset.index].useage,
            mask:'mask'
        })
        if(this.data.li[e.target.dataset.index].status==0){
          this.setData({
            status: '待审核',
        })
        }
        else if(this.data.li[e.target.dataset.index].status==1)
        {
          this.setData({
            status: '已过审',
          })
        }
        else{
          this.setData({
            status: '未过审',
          })
        }
    },

    hide_detail:function(){
        this.setData({
           mask: 'hide'
        })
    },

    add_dis_reserve_time:function(){
      const _ = wx.cloud.database().command
      wx.cloud.database().collection('user').where({
        _openid: this.data.openid
      }).update({
        data:{
          dis_reserve_time: _.inc(1),
        }
      }).then(res=>{
        this.setData({
          dis_reserve_time: this.data.dis_reserve_time+1
        })
      })
    },

    cancel_reserve:function(e){
      if(this.data.dis_reserve_time==3){
        wx.showModal({
          title:'提示',
          confirmText:'确定',
          content:'今天已经取消预约3次了，明天再来吧',
        })
      }
      else{
        var that = this
        wx.showModal({
          title:'提示',
          confirmText:'确定',
          content:'要取消预约吗？',
          success: function(res){
            if(res.confirm)
            {
                that.add_dis_reserve_time()
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
      }
    },

    add_password:function(e) //获取职工号
    {
      this.setData({
        password: e.detail.value
      })
    },

    success: function (res) {
        wx.showActionSheet({
          itemList: ['单日预约记录','总预约记录','团体预约审核','添加不可预约时间段',"管理员预约"],
          success: function (res) {
              if (res.tapIndex == 0) {
                //1.如果选择单日预约记录
                wx.navigateTo({
                  url: '../../packageA/pages/admin/admin'
                })
              } else if (res.tapIndex == 1){
                //2.如果选择总预约记录
                wx.navigateTo({
                  url: '../../packageA/pages/all_reserver/all_reserver'
                })
              } 
              else if (res.tapIndex == 2){
                wx.navigateTo({
                  url: '../../packageA/pages/check/check'
                })
              }
              else if(res.tapIndex == 3){
                wx.navigateTo({
                  url: '../../packageA/pages/add_date/add_date'
                })
              }
              else{
                wx.navigateTo({
                  url: '../../packageA/pages/admin_reserve/admin_reserve'
                })
              }
            }
        })
    },

    to_admin:function(){
      if(this.data.password==this.data.key)
      {
        this.success()
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
        if(this.data.try_time==0)
        {
          wx.cloud.database().collection('had_reserve').doc("fc8e64656422ad19066caca335d73f97").get()
            .then(res=>{
              // console.log('请求成功',res)
              this.setData({
                key:res.data.key
              })
              // console.log(this.data.key)
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

    get_user:function(){    //获取user信息
      wx.cloud.database().collection('user').get()
      .then(res=>{
        console.log('请求成功',res)
        if(res.data.length==0) //无记录则创建用户
        {
          wx.cloud.database().collection('user').add({
            data:{
              date: this.data.tomorrow,
              dis_reserve_time: 0,
              reserve_time: 0,
            }
          }).then(res=>{
              this.setData({
                user_date: this.data.tomorrow,
                dis_reserve_time: 0,
            })
          }).catch(err=>{
            show_err()
            console.log(err)
          })
        }
        else
        {
            this.setData({
              user_date: res.data[0].date,
          })
          if(this.data.user_date==this.data.tomorrow)
          {
            this.setData({
              dis_reserve_time: res.data[0].dis_reserve_time
            })
          }
          else{
            wx.cloud.database().collection('user').where({
              _openid:this.data.openid
            }).update({
              data:{
                date: this.data.tomorrow,
                reserve_time:0,
                dis_reserve_time:0,
              }
            }).then(res=>{
              this.setData({
                dis_reserve_time: 0
              })
            })
          }
        }
    })
    .catch(err=>{
        console.log('请求失败',err)
        show_err()
    })
  },

  get_tomorrow:function(){
    var date = new Date() 
      //设置明日日期
    this.setData({tomorrow:get_tomorrow(date.getFullYear(),date.getMonth()+1,date.getDate())})
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
          _openid:this.data.openid,
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
    this.get_tomorrow()
    this.get_user()
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

  function get_tomorrow(year,month,day){
    var mon_day=[31,28,31,30,31,30,31,31,30,31,30,31]
    month--
    //在月份为2时考虑闰月
    if(mon_day==1)
    {
      if((year%4==0&&year%100!=0)||year%400==0)
      {
        mon_day[1]=29
      }
    }
      if(day<mon_day[month])
      {
        day++
      }
      else
      {
        if(month<11)
        {
          month++;
          day=1;
        }
        else{
          year++;
          month=0;
          day=1;
        }
      }
      month++
      if(month<10)
      {
        month='0'+month
      }
      if(day<10)
      {
        day='0'+day
      }
      return year+'-'+month+'-'+day
  }