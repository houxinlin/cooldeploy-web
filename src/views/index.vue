<template>
  <el-container>
    <el-header>Header</el-header>
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

</template>


<style scoped>
.el-header {
  box-shadow: 0px 3px 5px #e8e8e8;
}
.aside {
  margin-top: 4px;
}
</style>