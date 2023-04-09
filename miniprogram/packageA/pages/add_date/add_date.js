// packageA/pages/add_date/add_date.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        place:'阅览室1',
        date:'',
        tomottow:'', //可选择的第一天
        on_show:0, //正在展示的地点
        place1_focus:'', //地点一按钮的样式
        place2_focus:'blur',//地点二按钮的样式
        get_time:0,
        nothing:'', //底部空白
        is_get_all:0,//是否获得全部数据
        li:[],
        mask:'hide',
        choose_place:'',
        choose_date:'',
        index:0,
        id:'',
        time_color:['orange','hide'],
        val_color:['blue','hide']
    },

    show_place1:function(){
        this.setData({
          on_show:1,
          place2_focus:'blur',
          place1_focus:'',
          place:'阅览室1'
        })
      
    },

    show_place2:function(){
        this.setData({
          on_show:2,
          place1_focus:'blur',
          place2_focus:'',
          place:'阅览室2'
        })
    },

    add_Date:function(e){  //获取时间
        this.setData({
          date: e.detail.value
        })
      },

    change_reserve_status:function(){
      wx.cloud.database().collection('reserve').where({
        date: this.data.date,
        place: this.data.place,
        status: 1
      }).update({
        data:{
          status:3
        }
      }).catch(err=>{
        console.log('错误',err)
        show_err()
      })

      },

    forbid:function(){
      wx.cloud.database().collection('place_day_last').where({
        date: this.data.date,
        place: this.data.place
      }).get()
      .then(res=>{
        if(res.data.length==0) //即数据库中暂无此日期的数据，则创建此日期的表
        {
          wx.cloud.database().collection('place_day_last').add({
            data:{
              date:this.data.date,
              place:this.data.place,
              status:0, //0则此日禁选，1则可选
              time01:30,
              time02:30,
              time03:30,
              time04:30,
              time05:30,
              time06:30,
              time07:30,
              time08:30,
              time09:30,
            }
          }).then(res=>{
            wx.showModal({
              title:'提示',
              confirmText:'确定',
              content:'禁选成功',
            })    
              console.log('禁选成功')
          }).catch(err=>{
            console.log('错误',err)
            show_err()
          })
        }
        else  //数据库中有该日期的表，则获取剩余人数
        {
          if(res.data[0].status==0)
          {
            wx.showModal({
                title:'提示',
                confirmText:'确定',
                content:'已禁选',
            })
          }
          else{
            var id = res.data[0]._id
            var temp=[30,30,30,30,30,30,30,30,30,30]
            temp[0]=res.data[0].time01
            temp[1]=res.data[0].time02
            temp[2]=res.data[0].time03
            temp[3]=res.data[0].time04
            temp[4]=res.data[0].time05
            temp[5]=res.data[0].time06
            temp[6]=res.data[0].time07
            temp[7]=res.data[0].time08
            temp[8]=res.data[0].time09
            temp[9]=res.data[0].time10
            for(var i=0; i < 10 ;i++)
            {
              var that=this
              if(temp[i]<30)
              {
                wx.showModal({
                  title:'提示',
                  confirmText:'确定',
                  content:'该日已有人预约，确定要禁选吗？（禁选后此人界面将显示未过审，即使曾过审）',
                  success: function(res){
                    if(res.confirm)
                    {
                      that.change_reserve_status()
                      wx.cloud.database().collection('place_day_last').doc(id).update({
                        data:{
                          status:0
                        }
                      }).then(res=>{
                        wx.showModal({
                          title:'提示',
                          confirmText:'确定',
                          content:'禁选成功',
                        })    
                          console.log('禁选成功')
                      }).catch(err=>{
                        console.log('错误',err)
                        show_err()
                      })
                    }
                  }
                })
                break
              }
            }
          }
        }
      }).catch(err=>{
        console.log('错误',err)
        show_err()
      })
    },

    show_forbid:function(){
      let temp =[]
      wx.cloud.database().collection('place_day_last').where({
        status:0
    }).orderBy('date','desc').skip(this.data.get_time*20).limit(20).get()
        .then(res=>{
          console.log('请求成功',res)
          temp=res.data
          this.setData({
            li:this.data.li.concat(temp),
            get_time:this.data.get_time+1,
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

    show_detail : function(e){
      this.setData({
          index:e.target.dataset.index,
          choose_place: this.data.li[e.target.dataset.index].place,
          choose_date: this.data.li[e.target.dataset.index].date,
          id: this.data.li[e.target.dataset.index]._id,
          mask:'mask'
      })
  },

  hide_detail:function(){
    this.setData({
       mask: 'hide'
    })
},

  sure_cancel:function(){
    wx.cloud.database().collection('place_day_last').doc(this.data.id).update({
      data:{
        status:1
      }
    }).then(res=>{
      wx.cloud.database().collection('reserve').where({
        date: this.data.choose_date,
        place: this.data.choose_place,
        status: 3
      }).update({
        data:{
          status:1
        }
      }).catch(err=>{
        console.log('错误',err)
        show_err()
      }).then(res=>{
        let temp = 'li['+this.data.index+'].status'
        this.setData({
          [temp]:1,
          mask: 'hide',
        })
       wx.showModal({
        title:'提示',
        confirmText:'确定',
        content:'解禁成功',
      })
      })
    }).catch(err=>{
      console.log('错误',err)
      show_err()
    })
  },

  cancel:function(){
    var that=this
    wx.showModal({
        title:'提示',
        confirmText:'确定',
        content:'确定要解禁吗？',
        success: function(res){
          if(res.confirm)
          {
            that.sure_cancel()     
          }
        }
    })
  },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        var date = new Date() 
        this.setData({tomorrow:get_tomorrow(date.getFullYear(),date.getMonth()+1,date.getDate()),
            date: get_tomorrow(date.getFullYear(),date.getMonth()+1,date.getDate())
        })
        this.show_forbid()
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
      if(this.data.is_get_all==0)
      {
        this.show_forbid()
      }
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