// index.js
Page({
  data:{
    nowdata:new Date().toISOString().substring(0, 10),
    enddate:new Date(Date.parse(new Date())+60*60*1000*24*30).toISOString().substring(0, 10),

      academy:['文学与新闻传播学院','外国语学院','建筑与艺术学院','商学院','法学院','马克思主义学院','公共管理学院','数学与统计学院','物理与电子学院','化学化工学院','机电工程学院','能源科学与工程学院','材料科学与工程学院','粉末冶金研究院','交通运输工程学院','土木工程学院','冶金与环境学院','地球科学与信息物理学院','资源与安全工程学院','资源加工与生物工程学院','自动化学院','计算机学院','体育教研部','基础医学院','湘雅公共卫生学院','湘雅护理学院','湘雅口腔医学院','湘雅药学院','生命科学学院','邓迪国际学院'],
      session:['8:00-9:40',
               '10:00-11:40',
               '14:00-15:40',
               '16:00-17:40',
               '19:00-20:40',
               '21:00-22:40',
              ],
      ifactive_academy:'请选择你的学院',
      ifactive_date:'请选择日期',
      ifactive_session_start:'请选择开始节次',
      start_index:'',
      end_index:'',
      ifactive_session_end:'请选择结束节次',
      purpose:'',
      counselor:'',
      contact:'',
      contact_information:'',
      host:'',
      number_of_people:'',
      warn_Contact_information:'black',
      class_arr:['gray_border','gray_border','rad_font','gray_border','gray_border','gray_border'] //输入框的class
  },
  onLoad:function(options){  
    console.log(new Date().toJSON().substring(0, 10) + ' ' + new Date().toTimeString().substring(0,8)),
    console.log(this.data.nowdata),
    console.log(this.data.enddate),
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
  bindPickerSessionStart:function(e){
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      ifactive_session_start:this.data.session[e.detail.value],
      start_index:e.detail.value,
    })
  },
  bindPickerSessionEnd:function(e){
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      ifactive_session_end:this.data.session[e.detail.value],
      end_index:e.detail.value,
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
    if(e.detail.value.length!=11&&e.detail.value.length!=0){
      this.setData({
        warn_Contact_information:'red',
      })
    }
    else{
      this.setData({
        warn_Contact_information:'black',
      })
    }
  },
  InputHost:function(e){
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      host:e.detail.value
    })
  },
  InputNumber_of_people:function(e){
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      number_of_people:e.detail.value
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
  ToSubmit: function(e){
      console.log('点击提交')
      if(this.data.purpose!=''
      &&this.data.ifactive_date!="请选择日期"
      &&this.data.counselor!=''
      &&this.data.contact!=''
      &&this.data.contact_information!=''
      &&this.data.host!=''
      &&this.data.ifactive_academy!="请选择你的学院"
      &&this.data.number_of_people!=""
      &&this.data.ifactive_session_start!="请选择开始节次"
      &&this.data.ifactive_session_end!="请选择结束节次"
      &&this.data.warn_Contact_information!="red"
      ){
        if(this.data.start_index>this.data.end_index){
          wx.showModal({
            title: '提示',
            content: '开始节次与结束节次错误',
            
          })
        }
        else{
          wx.cloud.database().collection('Event_Reservations').add({
            data:{
              Academy:this.data.ifactive_academy,
              Porpose:this.data.purpose,
              Date:this.data.ifactive_date,
              Counselor:this.data.counselor,
              Contact:this.data.contact,
              Contact_information:this.data.contact_information,
              Host:this.data.host,
              Number_of_people:this.data.number_of_people,
              Start:this.data.ifactive_session_start,
              End:this.data.ifactive_session_end,
            },
            success:function(res){
              console.log("上传成功",res),
              wx.showToast({
                title: '预约成功',
                icon: 'success',
                duration: 2000
              })
            }
          })
        }
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
