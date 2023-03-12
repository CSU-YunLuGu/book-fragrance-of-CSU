// pages/choose_place/choose_place.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        complet:[],
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