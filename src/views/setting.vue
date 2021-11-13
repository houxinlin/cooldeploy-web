<template>
  <div>
    <el-tabs type="border-card">
      <el-tab-pane label="SSH公钥">
        <el-button @click="generatorRsa" type="primary" size="mini">生成SSH公钥</el-button>
        <div class="item">
          <el-card style="margin-top:10px" class="box-card">
            <template #header>
              <div class="card-header">
                <span>当前公钥</span>
                <span @click="copySSH" class="point-style">
                  <el-icon>
                    <CopyDocument />
                  </el-icon>
                </span>
              </div>
            </template>
            <div class="content">{{sshPub}}</div>
          </el-card>
        </div>
      </el-tab-pane>
      <el-tab-pane label="系统密码">
        <div class="item">
          <el-card style="margin-top:10px" class="box-card">
            <template #header>
              <div class="card-header">
                <span>设置登陆密码</span>
              </div>
            </template>
            <el-input type="password" v-model="passwd" />
            <el-button style="margin-top:10px" type="primary" @click="savePasswd" size="mini">保存密码</el-button>
          </el-card>
        </div>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>
import { ElLoading } from "element-plus";
import { ElNotification } from "element-plus";
import { defineComponent, toRefs, reactive } from "vue";
import {
  getRsaPubAPI,
  configLoginPasswdApi,
  getSystemConfigApi,
  generatorApi,
} from "../apis/system";
import { ElMessage } from "element-plus";
import { CopyDocument } from "@element-plus/icons";
export default {
  mounted() {
    this.getPub();
  },
  components: {
    CopyDocument,
  },
  setup() {
    const state = reactive({
      sshPub: "",
      passwd: "",
    });
    const copySSH = () => {
      navigator.clipboard.writeText(state.sshPub).then(
        function () {
          ElMessage({
            message: "复制成功.",
            type: "success",
            duration: 800,
          });
        },
        function (err) {}
      );
    };
    const getPub = () => {
      getRsaPubAPI().then((res) => {
        state.sshPub = res.data.data;
      });
      getSystemConfigApi().then((res) => {
        state.passwd = res.data.data.login_passwd;
      });
    };

    const generatorRsa = () => {
      generatorApi().then((r) => {
        ElMessage({
          message: r.data.data,
          type: "success",
          duration: 800,
        });
      });
    };
    const savePasswd = () => {
      configLoginPasswdApi({ passwd: state.passwd }).then((r) => {
        ElMessage({
          message: r.data.data,
          type: "success",
          duration: 800,
        });
      });
    };
    return {
      copySSH,
      getPub,
      savePasswd,
      generatorRsa,
      ...toRefs(state),
    };
  },
};
</script>

<style scoped>
.content {
  word-wrap: break-word;
  word-break: normal;
  font-size: 12px;
  color: #000000;
}
.item {
  width: 500px;
}
.item .card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.point-style {
  cursor: pointer;
}
</style>
