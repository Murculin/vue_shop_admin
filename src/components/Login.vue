<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/logo.png">
      </div>
      <el-form
        class="login_form"
        label-width="0px"
        :model="loginForm"
        :rules="loginRules"
        ref="loginForm"
      >
        <el-form-item prop="username">
          <el-input
            placeholder="输入用户名"
            prefix-icon="el-icon-user"
            v-model="loginForm.username"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            placeholder="输入密码"
            prefix-icon="el-icon-lock"
            v-model="loginForm.password"
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登陆</el-button>
          <el-button type="info" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  name: 'Login',
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 4, max: 10, message: '长度在 4 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '密码长度应在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    login () {
      this.$refs.loginForm.validate(async valid => {
        if (!valid) {
          return
        }
        const { data: res } = await this.axios.post('/login', this.loginForm)
        console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success('登陆成功')
        sessionStorage.setItem('token', res.data.token)
        localStorage.setItem('user', JSON.stringify(res.data))
        this.setUser(res.data)
        this.$router.push('/home')
      })
    },
    resetForm () {
      this.$refs.loginForm.resetFields()
    },
    ...mapMutations([
      'setUser'
    ])
  }
}
</script>

<style lang="stylus" scoped>
@import '~styles/variable.styl'
.login_container
  background-color $bgColor
  height 100%
  .login_box
    position absolute
    left 50%
    top 50%
    transform translate(-50%,-50%)
    width 450px
    height 300px
    background-color #fff
    border-radius 3px
    .avatar_box
      position absolute
      left 50%
      transform translate(-50%,-50%)
      width 130px
      height 130px
      border 1px solid #eee
      border-radius 50%
      padding 10px
      box-shadow 0 0 10px #ddd
      background-color #fff
      img
        width 100%
        height 100%
        border-radius 50%
        background-color #eee
    .login_form
      position absolute
      bottom 0
      box-sizing border-box
      width 100%
      padding 0 20px
      .btns
        display flex
        justify-content flex-end
</style>
