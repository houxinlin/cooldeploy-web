<template>
  <el-container>
    <el-header class="header">
      <div>CoolDeploy部署工具</div>
    </el-header>
    <el-container class="container">
      <el-aside class="aside" width="200px">
        <el-menu router class="el-menu-vertical-demo">
          <el-menu-item :index="'project'">
            <span>项目部署</span>
          </el-menu-item>
          <el-menu-item :index="'setting'">
            <span>系统设置</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
  <div class="socket-btn" @click="drawer=!drawer">
      <el-button class="sk-btn" size="mini" type="primary">查看日志</el-button>
  </div>
  <el-drawer custom-class="drawer" v-model="drawer" title="I am the title" :with-header="false" direction="btt" size="50%">
    <el-scrollbar ref="scrollbar">
      <div style="white-space: pre-line;">
        {{messageLine}}
      </div>
    </el-scrollbar>

  </el-drawer>
</template>

<script>
import { defineComponent, onMounted, ref } from "vue";
import { ElNotification } from "element-plus";
export default {
  setup(props, context) {
    const scrollbar = ref(null);
    onMounted(() => {});
    return {
      props,
      scrollbar,
      drawer: ref(true),
      messageLine: ref(""),
      timetCount: 10,
    };
  },

  mounted() {

    this.drawer = false;
    setInterval(() => {
      this.timetCount++;
    }, 1000);
    this.connect();
  },
  methods: {
    connect() {
      this.socket = new WebSocket(import.meta.env.VITE_APP_WEBSOCKET);
      this.socket.onopen = this.open;
      this.socket.onerror = this.error;
      this.socket.onmessage = this.getMessage;
    },
    open: function () {
      ElNotification({
        title: "WebScoket连接成功",
        position: "bottom-right",
        duration: 1500,
      });
    },
    error: function () {
      ElNotification({
        title: "WebSocket断开连接",
        message: "正在重新连接",
        position: "bottom-right",
        duration: 1500,
      });
      setTimeout(() => {
        this.connect();
      }, 2000);
    },
    getMessage: function (msg) {
      if (this.timetCount >= 10) {
        ElNotification({
          title: "有新的消息",
          message: "受到新消息推送",
          position: "bottom-right",
          duration: 1500,
        });
      }
      this.timetCount = 0;
      this.messageLine = this.messageLine + msg.data;
      setTimeout(() => {
        this.scrollbar.setScrollTop(99999999);
      }, 10);
    },
    send: function () {
      this.socket.send(params);
    },
    close: function () {
      ElNotification({
        title: "WebSocket断开连接",
        message: "正在重新连接",
        position: "bottom-right",
        duration: 1500,
      });
      setTimeout(() => {
        this.connect();
      }, 2000);
    },
  },
};
</script>

<style>
.drawer {
  background: #444242d1 !important;
  color: #ffffff;
  line-height: 20px;
  font-size: 10px;
}

.el-header {
  box-shadow: 0px 3px 5px #e8e8e8;
}

.aside {
  margin-top: 4px;
}

.socket-btn {
position: fixed;
    left: 33px;
    bottom: 11px;
}
.el-menu{
  
}
.header{
      display: flex;
    justify-content: flex-start;
    align-items: center;
    color: #4a4a4a;
    font-size: 17px;
    font-weight: 900;
    padding-left: 103px;
}
.sk-btn{
      width: 130px;
}
</style>
