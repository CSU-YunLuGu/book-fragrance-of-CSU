// index.js
Page({
  data:{
      academy:['文学与新闻传播学院','外国语学院','建筑与艺术学院','商学院','法学院','马克思主义学院','公共管理学院','数学与统计学院','物理与电子学院','化学化工学院','机电工程学院','能源科学与工程学院','材料科学与工程学院','粉末冶金研究院','交通运输工程学院','土木工程学院','冶金与环境学院','地球科学与信息物理学院','资源与安全工程学院','资源加工与生物工程学院','自动化学院','计算机学院','体育教研部','基础医学院','湘雅公共卫生学院','湘雅护理学院','湘雅口腔医学院','湘雅药学院','生命科学学院','邓迪国际学院'],
      ifactive_academy:'请选择你的学院',
      ifactive_date:'请选择日期',
      purpose:'',
      counselor:'',
      contact:'',
      contact_information:'',
      host:'',
  },
  onLoad:function(options){
    wx.cloud.database().collection('Event_Reservations').get()
    .then(res=>{
      console.log('请求成功(Event_Reservations)',res)
      this.setData({
          complet:res.data
      })
      console.log(this.data.complet)
  })
  },
  bindPickerChange: function(e) {
      console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
        ifactive_academy : this.data.academy[e.detail.value]
      })
  },
  bindPickerDate:function(e){
      console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
          ifactive_date:e.detail.value
        })
  },
  InputPurpose:function(e){
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      purpose:e.detail.value
    })
  }, 
  InputCounselor:function(e){
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      counselor:e.detail.value
    })
  },
  InputContact:function(e){
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      contact:e.detail.value
    })
  },
  InputContact_information:function(e){
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      contact_information:e.detail.value
    })
  },
  InputHost:function(e){
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      host:e.detail.value
    })
  },
  ToSubmit: function(e){
      console.log('点击提交')
      if(this.data.purpose!=''&&this.data.ifactive_date!="请选择日期"&&this.data.counselor!=''&&this.data.contact!=''&&this.data.contact_information!=''&&this.data.host!=''&&this.data.ifactive_academy!="请选择你的学院"){
        wx.cloud.database().collection('Event_Reservations').add({
          data:{
            Academy:this.data.ifactive_academy,
            Porpose:this.data.purpose,
            Date:this.data.ifactive_date,
            Counselor:this.data.counselor,
            Contact:this.data.contact,
            Contact_information:this.data.contact_information,
            Host:this.data.host,
          },
          success:function(res){
            console.log("上传成功",res)
          }
        })
      }
      else{
        wx.showModal({
          title: '提示',
          content: '你所填写的信息不完全',
          
        })
      }
  },
  ToReset: function(e){
      console.log('点击重置')
  }
})
