// pages/choose_place/choose_place.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tip:'hide', //tip的class
        button:'hide', //button按钮的class
        time:5, //倒计时
        time_class:'sure', //time的class
        who:1,  //1为个人，2为团体
        place:1  //地点
    },
    show_tip:function(e)
    {
        this.setData({
            tip:'tip',
            who:e.target.dataset.who,
            place:e.target.dataset.place
        })
        let interval = setInterval(() => {
          this.setData({
            time:this.data.time-1
        })
        if(this.data.time<=0)
        {
          this.setData({
            time_class:'hide',
            button:'sure'
        })
        clearInterval(interval)
        }
        }, 1000);
        
    },

    to_reserve(){
      this.setData({
        tip:'hide'
    })
      if(this.data.who==1) //个人预约
        {
            wx.navigateTo({
                url: '../../packageA/pages/personal_reserve/personal_reserve?place='+this.data.place,
              })
        }
        else{
            wx.navigateTo({
                url: '../../packageA/pages/team_reserve/team_reserve?place='+this.data.place,
              })
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        // 连接数据库
      wx.cloud.database().collection('had_reserve').get()
      .then(res=>{
        console.log('请求成功',res)
        this.setData({
            complet:res.data
        })
        console.log(this.data.complet)
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