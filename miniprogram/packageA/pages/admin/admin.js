// packageA/pages/admin/admin.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
      date:'',
      place1_empty:1, //地点一是否有预约,1为空
      place2_empty:1, //地点二是否有预约
      place1:[], //地点一的预约情况
      place2:[], //地点二的预约情况
      on_show:0, //正在展示的地点
      index:0, //要查看的具体时间段的下标
      time_arr:["09:10~09:50","10:00~10:40","11:00~11:40","14:00~14:40","15:00~15:40","16:00~16:40","17:00~17:40","19:00~19:40",
      "20:00~20:40","21:00~22:20",]
    },

    getlast:function(){
      let temp=[30,30,30,30,30,30,30,30,30,30] //将剩余人数假定为30
      let temp2=[30,30,30,30,30,30,30,30,30,30]
      wx.cloud.database().collection('place_day_last').where({
        date: this.data.date,
      }).get()
      .then(res=>{
        console.log('请求成功',res)
        if(res.data.length==0) //即数据库中暂无此日期的数据，则创建此日期的表
        {
          wx.showModal({
            title: '提示',
            content:'此日无数据',
          })
        }
        else if(res.data.length==1) //数据库中有该日期的表，则获取剩余人数
        {
            temp[0]=30-res.data[0].time01
            temp[1]=30-res.data[0].time02
            temp[2]=30-res.data[0].time03
            temp[3]=30-res.data[0].time04
            temp[4]=30-res.data[0].time05
            temp[5]=30-res.data[0].time06
            temp[6]=30-res.data[0].time07
            temp[7]=30-res.data[0].time08
            temp[8]=30-res.data[0].time09
            temp[9]=30-res.data[0].time10
          if(res.data[0].place=='沙龙室1')
          {
            this.setData({
              place1:temp,
              place1_empty:0,
              on_show:1
            })
            console.log('place2 is',this.data.place1)
          }
          else
          {
            this.setData({
              place2:temp,
              place2_empty:0,
              on_show:2
            })
            console.log('place2 is',this.data.place2)
          }
        }
        else{
            temp[0]=30-res.data[0].time01
            temp[1]=30-res.data[0].time02
            temp[2]=30-res.data[0].time03
            temp[3]=30-res.data[0].time04
            temp[4]=30-res.data[0].time05
            temp[5]=30-res.data[0].time06
            temp[6]=30-res.data[0].time07
            temp[7]=30-res.data[0].time08
            temp[8]=30-res.data[0].time09
            temp[9]=30-res.data[0].time10
            temp2[0]=30-res.data[1].time01
            temp2[1]=30-res.data[1].time02
            temp2[2]=30-res.data[1].time03
            temp2[3]=30-res.data[1].time04
            temp2[4]=30-res.data[1].time05
            temp2[5]=30-res.data[1].time06
            temp2[6]=30-res.data[1].time07
            temp2[7]=30-res.data[1].time08
            temp2[8]=30-res.data[1].time09
            temp2[9]=30-res.data[1].time10
            if(res.data[0].place=='沙龙室1')
            {
              this.setData({
                place1:temp,
                place2:temp2,
                place1_empty:0,
                place2_empty:0,
                on_show:1
              })
            }
            else{
              this.setData({
                place1:temp2,
                place2:temp,
                place1_empty:0,
                place2_empty:0,
                on_show:1
              })
            }
            console.log('place1 is',this.data.place1)
            console.log('place2 is',this.data.place2)
        }
      }).catch(err=>{
        console.log('错误',err)
        show_err()
      })
      // console.log(this.data.time_num)
    },

    get_my:function(){  //获取我已预约过的时间
      wx.cloud.database().collection('reserve').where({
        _openid:this.data.openid,
        date : this.data.date
      }).get().then(res=>{
        for(let i=0;i<res.data.length;i++)
        {
          for(let j=0;j<10;j++)
          {
            if(this.data.time_select[j].time== res.data[i].time) //即该场已预约过
            {
              temp[j]=true
            }
          }
        }
        this.setData({
          had_reserve:res.data.length,
          had_reserve_arr:temp
        })
          if(this.data.had_reserve>3) //如果已经预约4个过程，则禁止选择
        {
          for(let i=0;i<10;i++)
          {
            let time_temp= 'time_select['+i+'].disabled'
            this.setData({
              [time_temp]: true,
            })
          }
          wx.showModal({
            title:'提示',
            confirmText:'确定',
            content:'你已预约过四个场地'
          })
        }
        console.log("设置成功")
      }).catch(err=>{
        show_err()
        console.log("错误",err)
      })
    },

    add_Date:function(e){  //获取时间
      this.setData({
        date: e.detail.value
      })
      console.log(this.data.date)
      this.getlast()
    },

    show_place1:function(){
      if(this.data.place1_empty)
      {
        wx.showModal({
          title: '提示',
          content:'该日此地点无数据',
        })
      }
      else{
        this.setData({
          on_show:1
        })
      }
    },

    show_place2:function(){
      this.setData({
        on_show:2
      })
    },

    to_all:function(e){
      wx.navigateTo({
        url: '../all_reserver/all_reserver?place='+this.data.on_show+'&index='+e.target.dataset.index+'&date='+this.data.date,
      })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

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