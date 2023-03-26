// app.js
App({
  globalData:{
    openid:''
  },

  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        env:'cloud1-9gkrvr9f6cef335d',
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      });
        let that = this;
        wx.cloud.callFunction({
          name: 'get_openid',
          complete: res => {
            // console.log(res)
            //你想要完成的功能，比如存储openid到全局
            that.globalData.openid = res.result.openid;
          }
        })
    }
  },

});
