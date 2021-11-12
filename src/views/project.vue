<template>
  <div>

    <el-button type="primary" @click="dialogFormVisible = true">增加</el-button>
    <el-table :data="projects" style="width: 100%">
      <el-table-column prop="firstCommitId" label="当前commit ID" width="180">

      </el-table-column>
      <el-table-column prop="projectName" label="项目名称" width="180">
      </el-table-column>
      <el-table-column prop="buildTool" label="项目构建工具" width="180">
      </el-table-column>
      <el-table-column prop="shell" label="执行脚本" width="180">
        <template #default="scope">

          <el-button size="mini" type="info" @click="showProjectShell( scope.row)">查看</el-button>

        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button size="mini" @click="handlerConfig(scope.$index, scope.row)">配置</el-button>
          <el-popconfirm confirm-button-text="执行shell" cancel-button-text="构建" :icon="InfoFilled" icon-color="red" title="你想要执行什么操作？" @confirm="taskExecShellEvent(scope.row)" @cancel="taskBuildEvent(scope.row)">
            <template #reference>
              <el-button type="danger" size="mini">操作</el-button>
            </template>
          </el-popconfirm>
          <el-button size="mini" type="success" v-if="scope.row.buildTool=='GRADLE'" @click="exectureTask(scope.$index, scope.row)">执行task</el-button>

        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="dialogFormVisible" title="输入Git路径">
      <el-alert title="点击确认后，将尝试拉取远程项目，并自动编译" closable="false" type="success" />
      <el-tabs type="card" @tab-click="handleClick">
        <el-tab-pane label="GIT路径">
          <span>SSH路径</span>
          <el-input v-model="gitSshUrl" autocomplete="off"></el-input>

        </el-tab-pane>
      </el-tabs>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="dialogFormVisible = false">加载</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog v-model="dialogConfigVisible" title="项目配置">
      <el-tabs type="card" @tab-click="handleClick">
        <el-tab-pane label="构建命令">
          <el-alert title="[构建命令]用于执行构建工具所提供的命令,如'gradlew build',但您可以在这里省略'gradlew'，直接填写'build'" closable="false" type="error" />

          <el-button type="primary" @click="addCommand" size="mini">添加</el-button>
          <template v-for="(item,index) in commands" :key="index">
            <div class="command-item">
              <span>{{index+1}}</span>
              <el-row>
                <el-autocomplete @focus="autocompleteFocus(index)" v-model="commands[index]" :fetch-suggestions="querySearch" popper-class="my-autocomplete" placeholder="Please input" @select="handleCommandSelect">
                  <template #default="{ item }">
                    <div class="value">{{ item }}</div>
                  </template>
                </el-autocomplete>
              </el-row>
              <div class="icon" @click="deleteCommand(index)">
                <el-icon :size="iconSize" :color="color">
                  <Delete></Delete>
                </el-icon>
              </div>
            </div>

          </template>
        </el-tab-pane>
        <el-tab-pane label="Shell脚本">
          <el-alert title="[Shell脚本]用于项目编译、部署,在自动构建时,将会执行此shell,构建命令可以无，但是Shell脚本必须存在" closable="false" type="error" />
          <el-input v-model="shellTxt" :autosize="{ minRows: 5, maxRows: 20 }" type="textarea" placeholder="Please input" />
        </el-tab-pane>
      </el-tabs>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogConfigVisible = false">取消</el-button>
          <el-button type="primary" @click="handlerSaveConfig ">保存</el-button>
        </span>
      </template>
    </el-dialog>

    <el-drawer size="18%" v-model="dialogTaskVisible" title="选择任务" direction="rtl" :before-close="handleClose">
      <el-scrollbar>
        <el-button style="margin-bottom:10px" @click="execProjectTask(item)" v-for="item in commandAuto" :key="item" type="info" size="mini" plain>
          {{item}}
        </el-button>
      </el-scrollbar>

    </el-drawer>

    <el-dialog v-model="shellDialogVisible" title="shell" width="30%" center>
      <pre style="white-space: pre-line;">
        {{projectShell}}
      </pre>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="shellDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="shellDialogVisible = false">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ElLoading } from "element-plus";
import { ElNotification } from "element-plus";
import { defineComponent, toRefs, reactive } from "vue";
import {
  buildProjectApi,
  listProjectApi,
  listTasksApi,
  saveConfigApi,
  gradleTaskApi,
  shellProjectApi,
} from "../apis/project";
import {
  Search,
  Edit,
  Check,
  Message,
  Star,
  Delete,
} from "@element-plus/icons";
export default {
  components: {
    Delete,
  },
  mounted() {
    this.listProject();
  },
  setup() {
    const state = reactive({
      dialogConfigVisible: false,
      gitSshUrl: "",
      iconSize: 17,
      dialogFormVisible: false,
      commands: [],
      projects: [],
      shellDialogVisible: false,
      projectShell: "",
      shellTxt: "#!/bin/sh\n",
      selectProjectIndex: -1,
      commandAuto: [],
      dialogTaskVisible: false,
      selectCommandInputIndex: -1,
      loading: null,
    });
    const addCommand = () => {
      state.commands.push("");
    };
    const deleteCommand = (index) => {
      state.commands.splice(index, 1);
    };
    const listProject = () => {
      listProjectApi().then((res) => {
        state.projects = res.data.data;
        console.log(state.projects);
      });
    };
    const handlerSaveConfig = () => {
      saveConfigApi({
        projectName: state.projects[state.selectProjectIndex].projectName,
        projectCommands: state.commands,
        shell: state.shellTxt,
      }).then((res) => {
        if (res.data.code == 0) {
          state.dialogConfigVisible = false;
        }
        listProject();
        ElNotification({
          title: "提示",
          duration: 3000,
          message: res.data.data,
          type: "success",
        });
      });
    };
    const handlerConfig = (i, item) => {
      state.selectProjectIndex = i;
      state.dialogConfigVisible = !state.dialogConfigVisible;
      state.shellTxt = item.shell;
      state.commands = item.buildCommands;
      listTasksApi({ name: item.projectName }).then((res) => {
        state.commandAuto = res.data.data;
      });
    };
    const querySearch = (queryString, cb) => {
      const newValue = state.commandAuto.filter((i) => {
        return i.toLowerCase().startsWith(queryString);
      });
      return cb(newValue);
    };
    const handleCommandSelect = (i) => {
      state.commands[state.selectCommandInputIndex] = i;
    };
    const autocompleteFocus = (i) => {
      state.selectCommandInputIndex = i;
    };
    const exectureTask = (i, item) => {
      state.loading = ElLoading.service({
        lock: true,
        text: "Loading",
        background: "rgba(0, 0, 0, 0.7)",
      });

      listTasksApi({ name: item.projectName }).then((res) => {
        state.selectProjectIndex = i;
        state.commandAuto = res.data.data;
        state.dialogTaskVisible = !state.dialogTaskVisible;
        state.loading.close();
      });
    };

    const execProjectTask = (i) => {
      gradleTaskApi({
        projectName: state.projects[state.selectProjectIndex].projectName,
        taskName: i,
      }).then((res) => {
        ElNotification({
          title: "调用成功",
          message: "请打开左边输出窗口查看日志",
          position: "bottom-right",
          duration: 1500,
        });
      });
    };

    const taskBuildEvent = (i) => {
      buildProjectApi({ projectName: i.projectName }).then((res) => {
        ElNotification({
          title: "调用成功",
          message: "请打开左边输出窗口查看日志",
          position: "bottom-right",
          duration: 1500,
        });
      });
    };
    const taskExecShellEvent = (i) => {
      shellProjectApi({ projectName: i.projectName }).then((res) => {
        ElNotification({
          title: "调用成功",
          message: "请打开左边输出窗口查看日志",
          position: "bottom-right",
          duration: 1500,
        });
      });
    };
    const showProjectShell = (i) => {
      state.projectShell = i.shell;
      state.shellDialogVisible = !state.shellDialogVisible;
    };
    return {
      ...toRefs(state),
      handlerConfig,
      taskBuildEvent,
      taskExecShellEvent,
      execProjectTask,
      showProjectShell,
      exectureTask,
      listProject,
      autocompleteFocus,
      querySearch,
      deleteCommand,
      addCommand,
      handlerSaveConfig,
      handleCommandSelect,
    };
  },
};
</script>

<style >
.icon {
  margin-left: 10px;
  cursor: pointer;
}
.command-item {
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-items: center;
}
.command-item span {
  background: #f0f0f0;
  border-radius: 100%;
  padding: 10px;
  width: 10px;
  height: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #000000;
  font-size: 10px;
}
.command-item input {
  width: 200px;
  margin-left: 10px;
}

.el-drawer__body {
  flex: none;
  height: 80%;
}
</style>