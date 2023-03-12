// pages/team_reserve/team_reserve.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
      firstDay: [2023,2,9], //第一元素为第一周星期一在的年份，之后分别是月和日
      show_week:0, //是否显示
      week:"请选择周次",
      class:"",
      name:"",
      id:"",
      phone:"",
      mail:"",
      perpurs:"",
      //会用到的数据有place,class,name,id,phone,mail,perpurs,time
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

    add_perpurs:function(e) //获取用途
    {
      this.setData({
        perpurs: e.detail.value
      })
    },

    add_Date:function(e){
      this.setData({
        date: e.detail.value
      })
    },

    submit:function(){
      let str='time01'
      const _ = wx.cloud.database().command
      wx.cloud.database().collection('place_day_last').where({ //提交数据到place_day_last数据库
        date: '2023-3-12'
      }).update({
        data:{
          [str]:_.inc(-1)
        }
      }).catch(err=>{
        wx.showModal({
          title:'提示',
          confirmText:'确定',
          content:'网络异常'
        })
      })
    },

    choice_week:function(){
      var date = new Date()
      var year = date.getFullYear()
      var mon = date.getMonth()
      var day = date.getDate()
      console.log(date)
      console.log(this.data.firstDay)
      wx.showActionSheet({
        itemList: ['1','2','3','4'],
        success:function(res){
          console.log(res.tapIndex)
        }
      })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      //获取预约地点
      if(options.place==1)
      {
        this.setData({place:"地点一"})
      }
      else
      {
        this.setData({place:"地点二"})
      }
      //获得今日日期
      var date = new Date() 
      //设置今日日期
      this.setData({today:[date.getFullYear(),date.getMonth()+1,date.getDate()]})
      //设置截至日期
      this.setData({end_day: get_endday(date.getFullYear(),date.getMonth()+1,date.getDate(),date.getDay())})
      console.log()
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

//获取四周后周日的日期，num是今天的星期数，如星期日则num为0，星期1-6对于num1-6
//year,month,day分别对应今日的年月日
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
