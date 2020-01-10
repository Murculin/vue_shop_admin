<template>
  <el-container class="home-container">
    <el-header>
      <span>电商后台管理系统</span>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu
          class="el-menu-vertical-demo"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          :unique-opened="true"
          :router="true"
          :default-active="$route.path"
        >
          <el-submenu
            :index="item.id + ''"
            v-for="item in menuList"
            :key="item.id"
          >
            <template slot="title">
              <i :class="iconList[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      menuList: [],
      iconList: {
        '125': 'el-icon-user-solid',
        '103': 'el-icon-s-check',
        '101': 'el-icon-s-goods',
        '102': 'el-icon-s-order',
        '145': 'el-icon-s-marketing'
      }
    }
  },
  created () {
    this.getMenuList()
  },
  methods: {
    logout () {
      sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList () {
      const { data: res } = await this.axios.get('/api/menus')
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('无访问权限')
      }
      this.menuList = res.data
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~styles/variable.styl';

.home-container
  height 100%

.el-header
  background-color $homeColor
  display flex
  align-items center
  justify-content space-between
  color $titleFontColor
  font-size $font-size-lx

.el-aside
  background-color $asideColor
  color $titleFontColor
  .el-menu
    border none
.el-main
  background-color $mainColor
</style>
