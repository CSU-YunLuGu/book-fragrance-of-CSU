// pages/place_resever.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
      if_err:0, //是否出现错误
      place:'', //预约地点
      disabled:false,//是否对全部多选框开启禁用状态
      tomottow:'', //可选择的第一天
      end_day:'', //可选择的最后一天
      had_reserve:0, //此人在今天已预约过的场数
      had_reserve_arr:[], //记录每个时间段是否被预约过
      class:"", //单位
      name:"",  //姓名
      id:"",    //职工号
      phone:"", //手机号
      mail:"",  //邮箱
      useage:"", //用途
      date:"",  //选择的日期
      time_num:0, //选择的时间数
      time_arr:[], //选择的时间
      time_name_arr:[],//选择的时间的名称
      time_select:[{time:"09:10~09:50",disabled:false},//time为时间段，checke为是否选中，disabled为是否禁用
      {time:"10:00~10:40",disabled:false},{time:"11:00~11:40",disabled:false},{time:"14:00~14:40",disabled:false},{time:"15:00~15:40",disabled:false},{time:"16:00~16:40",disabled:false},{time:"17:00~17:40",disabled:false},{time:"19:00~19:40",disabled:false},{time:"20:00~20:40",disabled:false},{time:"21:00~22:20",disabled:false}],
      lasted:[30,30,30,30,30,30,30,30,30,30], //剩余数量
      class_arr:['gray_border','gray_border','gray_border','gray_border','gray_border','gray_border'] //输入框的class
    },

    add_class:function(e) //获取单位
    {
      this.setData({
        class: e.detail.value
      })
    },

    add_name:function(e) //获取姓名
    {
      this.setData({
        name: e.detail.value
      })
    },

    add_id:function(e) //获取职工号
    {
      this.setData({
        id: e.detail.value
      })
    },

    add_phone:function(e) //获取电话
    {
      this.setData({
        phone: e.detail.value
      })
    },

    add_mail:function(e) //获取电话
    {
      this.setData({
        mail: e.detail.value
      })
    },

    add_useage:function(e) //获取用途
    {
      this.setData({
        useage: e.detail.value
      })
    },

    change_color:function(e){
      let temp = 'class_arr['+e.target.dataset.index+']'
      if(e.detail.value=='')
      {
        this.setData({
          [temp]: 'red_border'
        })
      }
      else
      {
        this.setData({
          [temp]: 'gray_border'
        })
      }
    },

    box_change:function(e){  //获取多选框选择的时间
      //最多选择四个时间
      if(e.detail.value.length==4-this.data.had_reserve) 
      {
        for(let i=0;i<10;i++)
        {
          let temp= 'time_select['+i+'].disabled'
          this.setData({
            [temp]: true,
          })
        }
        for(let i=0;i<4-this.data.had_reserve;i++)
        {
          let temp= 'time_select['+e.detail.value[i]+'].disabled'
          this.setData({
            [temp]: false,
            disabled:true
          })
        }
      }
      else
      {
        if(this.data.disabled==true)
        {
          for(let i=0;i<10;i++)
        {
          let temp= 'time_select['+i+'].disabled'
          this.setData({
            [temp]: false,
          })
        }
        }
      }
      //将选择时间储存到data
      this.setData({
        time_num: e.detail.value.length,
        time_arr: e.detail.value
      })
      console.log(this.data.time_arr)
      let list=[]
      list = JSON.parse(JSON.stringify(e.detail.value));
      change_timearr(list)
      this.setData({
        time_name_arr:list
      })
      console.log(this.data.time_name_arr)
    },

    sub_place_day_last:function(str){  //提交数据到place_day_last数据库
      const _ = wx.cloud.database().command
      console.log(str)
      wx.cloud.database().collection('place_day_last').where({ 
        date: this.data.date
      }).update({
        data:{
          [str]: 0
        }
      }).then(res=>{
        console.log('place_day_last数据提交成功')
      }).catch(err=>{
        console.log('错误',err)
        show_err()
      })
    },

    add_had_reserve:function(){  //提交数据到had_reserve数据库
      const _ = wx.cloud.database().command
      wx.cloud.database().collection('had_reserve').where({ 
        place: this.data.place
      }).update({
        data:{
          had_reserver:_.inc(1)
        }
      }).then(res=>{
        console.log('place_day_last数据提交成功')
      }).catch(err=>{
        console.log('错误',err)
        show_err()
      })
    },

    //提交表单
    submit:function(){  
      if(this.data.name&&this.data.class&&this.data.id&&this.data.phone&&this.data.mail&&this.data.useage&&this.data.time_num)
      {
        for(let k=0;k<this.data.time_num;k++){  //提交数据给reserve数据库
          var temp=this.data.time_select[this.data.time_arr[k]].time
          wx.cloud.database().collection('reserve').add({
            data:{
              class: this.data.class,
              date: this.data.date,
              mail:this.data.mail,
              name:this.data.name,
              phone:this.data.phone,
              place:this.data.place,
              studdentId:this.data.id,
              time: temp,
              useage: this.data.useage,
            }
          }).then(res=>{
            this.sub_place_day_last(this.data.time_name_arr[k])  //提交数据到place_day_last
          }).catch(err=>{
            console.log('错误',err)
            show_err()
          })
        }
        this.add_had_reserve() //提交数据到had_reserve数据库
          wx.showModal({
            title:'提示',
            confirmText:'确定',
            content:'成功',
            success:function(res){
              if(res.confirm)
              {
                wx.reLaunch({
                  url: '../../../pages/choose_place/choose_place',
                })
              }
            }
          })
      }
      else
      {
        wx.showModal({
          title:'提示',
          confirmText:'确定',
          content:'请将所有选项填写完毕'
        })
      }
      
    },

    // 连接数据库,获取每个时间段剩余人数
    getlast:function(){
      let temp=[30,30,30,30,30,30,30,30,30,30] //将剩余人数假定为30
      wx.cloud.database().collection('place_day_last').where({
        date: this.data.date,
        place: this.data.place
      }).get()
      .then(res=>{
        console.log('请求成功',res)
        if(res.data.length==0) //即数据库中暂无此日期的数据，则创建此日期的表
        {
          wx.cloud.database().collection('place_day_last').add({
            data:{
              date:this.data.date,
              place:this.data.place,
              time01:30,
              time02:30,
              time03:30,
              time04:30,
              time05:30,
              time06:30,
              time07:30,
              time08:30,
              time09:30,
              time10:30
            }
          }).then(res=>{
              this.setData({
                lasted:temp
              })
              console.log('添加今日数据成功')
          }).catch(err=>{
            console.log('错误',err)
            show_err()
          })
        }
        else  //数据库中有该日期的表，则获取剩余人数
        {
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
          this.setData({
            lasted:temp
          })
        }
      }).catch(err=>{
        console.log('错误',err)
        show_err()
      })
      // console.log(this.data.time_num)
    },

    get_my:function(){  //获取我已预约过的时间
      let temp=[false,false,false,false,false,false,false,false,false,false]//记录每个时间段是否被预约过
      wx.cloud.database().collection('reserve').where({
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
        // console.log(this.data.had_reserve)
        // console.log(res.data.length)
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
      this.getlast()
      this.get_my()
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      if(options.place==1)
      {
        this.setData({place:"沙龙室1"})
      }
      else
      {
        this.setData({place:"沙龙室2"})
      }
      var date = new Date() 
      //设置今日日期
      this.setData({end_day: get_endday(date.getFullYear(),date.getMonth()+1,date.getDate(),date.getDay())})
      this.setData({tomorrow:get_tomorrow(date.getFullYear(),date.getMonth()+1,date.getDate()),
                    date: get_tomorrow(date.getFullYear(),date.getMonth()+1,date.getDate())
      })
      this.getlast()  //获取剩余天数
      this.get_my()
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

    },

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
    return year+'-'+month+'-'+day
}

function get_endday(year,month,day,num){  
  var day_num //day_num为四周后的周日据今的总天数
  if(num==0)
  {
    day_num=21  
  }
  else{
    day_num= 28-num
  }
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
  for(var i=0;i<day_num;i++)
  {
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
  }
  month++
  return year+'-'+month+'-'+day
}

function change_timearr(arr){
  let len=arr.length
  for(let i=0;i<len;i++)
  {
    switch(arr[i])
    {
      case '0':
        arr[i]='time01'
        break
      case '1':
        arr[i]='time02'
        break
      case '2':
        arr[i]='time03'
        break
      case '3':
        arr[i]='time04'
        break
      case '4':
        arr[i]='time05'
        break
      case '5':
        arr[i]='time06'
        break
      case '6':
        arr[i]='time07'
        break
      case '7':
        arr[i]='time08'
        break
      case '8':
        arr[i]='time09'
        break
      case '9':
        arr[i]='time10'
        break
    }
  }
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
          url: '../../../pages/choose_place/choose_place',
        })
        
      }
    }
  })
  
}