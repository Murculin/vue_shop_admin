<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <!-- 搜索与添加 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input
            v-model="queryInfo.query"
            placeholder="请输入内容"
            class="input-with-select"
            @clear="getUserList"
            clearable
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 用户列表 -->
      <el-table :data="userList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template v-slot:default="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              @change="stateChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template v-slot:default="scope">
            <div class="table-config">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="handleClickEdit(scope.row.id)"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="handleClickDel(scope.row.id)"
              ></el-button>
              <el-tooltip
                effect="dark"
                content="分配角色"
                placement="top"
                :enterable="false"
              >
                <el-button
                  type="warning"
                  icon="el-icon-s-tools"
                  size="mini"
                  @click="handleClickRole(scope.row)"
                ></el-button>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 5, 10, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form
        :model="addUserForm"
        :rules="addUserFormRules"
        ref="addUserForm"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="addUserForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editUserForm"
        :rules="editUserFormRules"
        ref="editUserForm"
        label-width="70px"
      >
        <el-form-item label="用户名">
          <el-input v-model="editUserForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色对话框对话框 -->
    <el-dialog
      class="roleDialog"
      title="分配角色"
      :visible.sync="roleDialogVisible"
      width="50%"
      @close="roleDialogClosed"
    >
      <p>当前的用户: {{ userInfo.username }}</p>
      <p>当前的角色: {{ userInfo.role_name }}</p>
      <p>
        <span>分配新角色: </span>
        <el-select v-model="selectedRoleId" placeholder="请选择">
          <el-option
            v-for="item in rolesList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="roleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Users',
  data() {
    // 表单验证规则
    const cheackEmail = (rule, value, callback) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法的邮箱'))
    }
    const cheackMobile = (rule, value, callback) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法的手机号'))
    }
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userList: [],
      total: 0,
      addDialogVisible: false,
      editDialogVisible: false,
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addUserFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用户名应长度在 4 到 10 个字符',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 12,
            message: '密码长度应在 6 到 12 个字符',
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: cheackEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: cheackMobile, trigger: 'blur' }
        ]
      },
      editUserForm: {},
      editUserFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: cheackEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: cheackMobile, trigger: 'blur' }
        ]
      },
      // 分配角色相关
      roleDialogVisible: false,
      userInfo: {},
      rolesList: [],
      selectedRoleId: ''
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    // 获取用户列表
    async getUserList() {
      const { data: res } = await this.axios.get('/api/users', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户列表失败')
      }
      this.userList = res.data.users
      this.total = res.data.total
      console.log(res)
    },
    // 翻页功能
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize
      this.getUserList()
    },
    handleCurrentChange(newpage) {
      this.queryInfo.pagenum = newpage
      this.getUserList()
    },
    // 修改用户状态
    async stateChange(row) {
      const state = row.mg_state
      const { data: res } = await this.axios.put(`/api/users/${row.id}/state/${state}`)
      if (res.meta.status !== 200) {
        return this.$message.error('修改用户状态失败')
      }
      console.log(res)
      this.$message.success('修改用户状态成功')
    },
    // 添加用户对话框功能
    addDialogClosed() {
      this.$refs.addUserForm.resetFields()
    },
    addUser() {
      this.$refs.addUserForm.validate(async valid => {
        if (!valid) {
          return
        }
        const { data: res } = await this.axios.post(
          '/api/users',
          this.addUserForm
        )
        if (res.meta.status !== 201) {
          this.$message.error('添加失败,请检查网络状况')
        }
        this.$message.success('添加用户成功')
        this.addDialogVisible = false
        this.getUserList()
      })
    },
    // 列表功能区
    // 点击编辑按钮
    async handleClickEdit(id) {
      const { data: res } = await this.axios.get('api/users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户详情失败')
      }
      this.editUserForm = res.data
      this.editDialogVisible = true
    },
    editDialogClosed() {
      this.$refs.editUserForm.resetFields()
    },
    // 确认编辑
    editUser() {
      this.$refs.editUserForm.validate(async valid => {
        if (!valid) {
          return
        }
        const { data: res } = await this.axios.put(
          'api/users/' + this.editUserForm.id,
          {
            email: this.editUserForm.email,
            mobile: this.editUserForm.mobile
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('更新用户信息失败')
        }
        this.editDialogVisible = false
        this.getUserList()
        this.$message.success('更新用户信息成功')
      })
    },
    // 删除按钮
    handleClickDel(id) {
      this.$confirm('此操作将永久删除该用户的信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      })
        .then(() => {
          this.axios.delete('api/users/' + id).then(res => {
            res = res.data
            console.log(res)
            if (res.meta.status !== 200) {
              return this.$message.error('删除用户失败')
            }
            this.getUserList()
            this.$message.success('已删除该用户')
          })
        })
        .catch(() => {
          this.$message.info('已取消删除')
        })
    },
    // 分配角色按钮
    async handleClickRole(user) {
      this.userInfo = user
      console.log(user)
      this.roleDialogVisible = true
      const { data: res } = await this.axios.get('api/roles')
      if (res.meta.status !== 200) {
        return this.message.error('获取角色列表失败')
      }
      this.rolesList = res.data
      console.log(res)
    },
    roleDialogClosed() {
      this.userInfo = {}
      this.selectedRoleId = ''
    },
    // 点击确定按钮分配角色
    async setRole() {
      if (!this.selectedRoleId) {
        return this.$message.error('请选择分配的角色')
      }
      const { data: res } = await this.axios.put(
        `api/users/${this.userInfo.id}/role`,
        {
          rid: this.selectedRoleId
        }
      )
      console.log(this.selectedRoleId, res)
      if (res.meta.status !== 200) {
        return this.$message.error('分配角色失败')
      }
      this.$message.success('分配角色成功')
      this.getUserList()
      this.roleDialogVisible = false
    }
  }
}
</script>

<style lang="stylus" scoped>
.roleDialog
  p
    font-size 14px
    margin 14px 0
    line-height 20px
</style>
