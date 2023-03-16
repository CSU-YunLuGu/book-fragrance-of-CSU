// index.js
Page({
  data:{
      academy:['计算机学院','建艺院'],
      ifactive_academy:'请选择你的学院',
      ifactive_date:'请选择日期',
      purpose:'',
      counselor:'',
      contact:'',
      contact_information:'',
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
  ToSubmit: function(e){
      console.log('点击提交')
      wx.cloud.database().collection('Event_Reservations').add({
        data:{
          Porpose:this.data.purpose,
          Date:this.data.ifactive_date,
          Counselor:this.data.counselor,
          Contact:this.data.contact,
          Contact_information:this.data.InputContact_information
        },
        success:function(res){
          console.log("上传成功",res)
          console.log(academy)
        }
      })
  },
  ToReset: function(e){
      console.log('点击重置')
  }
})
