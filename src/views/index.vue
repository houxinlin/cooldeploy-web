<template>
  <el-container>
    <el-header></el-header>
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
    <svg t="1636682058564" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2434" width="48" height="48">
      <path d="M263.10883555 897.96941748c0 45.9613677 60.71424948 72.06411378 94.18372742 38.58492682l385.83470458-385.82985008c22.1305363-22.12932267 22.1305363-55.03931733 0-77.16985363L357.29256297 87.73449955c-34.32751408-34.33722311-94.18372741-5.67007763-94.18372742 39.15411912v771.08079881z m0 0" p-id="2435" fill="#1296db"></path>
    </svg>
  </div>
  <el-drawer custom-class="drawer" v-model="drawer" title="I am the title" :with-header="false" direction="ltr" size="30%">
    <el-scrollbar>
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
    return {
      props,
      drawer: ref(false),
      messageLine: ref(""),
      timetCount: 10,
    };
  },

  mounted() {
    setInterval(() => {
      this.timetCount++;
    }, 1000);
    this.connect();
  },
  methods: {
    connect() {
      this.socket = new WebSocket("ws://localhost:5991/wbs");
      this.socket.onopen = this.open;
      this.socket.onerror = this.error;
      this.socket.onmessage = this.getMessage;
    },
    open: function () {
      console.log("socket连接成功");
    },
    error: function () {
      console.log("连接错误");
    },
    getMessage: function (msg) {
      if (this.timetCount >= 10) {
        this.timetCount = 0;
        ElNotification({
          title: "有新的消息",
          message: "受到新消息推送",
          position: "bottom-left",
          duration: 1500,
        });
      }
      document.querySelector(".el-scrollbar__view").scrollTop = 100000;
      this.messageLine = this.messageLine + msg.data;
    },
    send: function () {
      this.socket.send(params);
    },
    close: function () {
      console.log("socket已经关闭");
    },
  },
};
</script>

<style>
.drawer {
  background: #444242d1 !important;
  color: #ffffff;
  line-height: 20px;
}

.el-header {
  box-shadow: 0px 3px 5px #e8e8e8;
}

.aside {
  margin-top: 4px;
}

.socket-btn {
  position: fixed;
  left: -23px;
  bottom: 6px;
}
</style>
