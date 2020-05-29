<template>
  <el-container class="home-container">
    <el-aside width="230px">
      <el-menu
        class="el-menu-vertical-demo"
        background-color="#344a5f"
        text-color="#fff"
        active-text-color="#409EFF"
        :unique-opened="true"
        :router="true"
        :default-active="$route.path"
      >
        <div class="logo-wrap">
          <img src="../assets/logo.png">
        </div>
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
    <el-container>
      <el-header>
        <span class="title">电商后台管理系统</span>
        <div class="operate">
          <div class="userInfo">
            欢迎 {{ this.user.username }}
          </div>
          <i class="el-icon-switch-button" @click="logout"></i>
        </div>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { mapState } from 'vuex'
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
  computed: {
    ...mapState([
      'user'
    ])
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
      const { data: res } = await this.axios.get('/menus')
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
  background-color #fff
  box-shadow 0 3px 16px 0 rgba(0,0,0,0.1)
  display flex
  align-items center
  justify-content space-between
  color black
  font-size $font-size-lx
  .operate
    display flex
    align-items center
    .userInfo
      font-size 14px
      margin-right 10px
      height 22px
      line-height 22px
.el-aside
  background-color $asideColor
  color $titleFontColor
  background-color #344a5f
  padding-top 30px
  .logo-wrap
    margin 0 auto
    width 100px
    height 100px
   img
    width 100%
    height 100%
  .el-menu
    border none
.el-main
  background-color #F5F5F5
  margin-top 7px
</style>
