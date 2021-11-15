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
    <svg t="1636949655303" class="icon" viewBox="0 0 1171 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5768" width="32" height="32">
      <path d="M566.312485 618.082487 198.037943 986.357029 146.289371 934.645029 568.945371 511.989029 620.657371 563.7376 618.134199 566.260773 1005.202286 953.362286 953.380571 1005.184 566.312485 618.082487 566.312485 618.082487ZM566.292846 106.080329 51.712 620.628114 0 568.952686 568.941714 0.010971 620.653714 51.722971 618.116242 54.260297 1151.488 587.666286 1099.666286 639.488 566.292846 106.080329 566.292846 106.080329Z" p-id="5769" fill="#2c2c2c"></path>
    </svg>
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
  left: -2px;
  bottom: 0px;
}
</style>
