<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <div>
        <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>
      </div>
      <!-- 角色列表 -->
      <el-table :data="rolesList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template v-slot:default="scope">
            <!-- 一级 -->
            <el-row
              :class="['border-bottom', index1 === 0 ? 'border-top' : '', 'vertical-center']"
              v-for="(item1, index1) in scope.row.children"
              :key="item1.id">
              <el-col :span="5">
                <el-tag closable @close="handleClickTagRemove(scope.row, item1.id)">{{ item1.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row
                  :class="[index2 === 0 ? '' : 'border-top', 'vertical-center']"
                  v-for="(item2, index2) in item1.children"
                  :key="item2.id">
                  <!-- 二级 -->
                  <el-col :span="6">
                    <el-tag type="success" closable @close="handleClickTagRemove(scope.row, item2.id)">
                      {{ item2.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级 -->
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      @close="handleClickTagRemove(scope.row, item3.id)"
                      closable>
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <!-- 操作区 -->
        <el-table-column label="操作" width="300px">
          <template v-slot:default="scope">
            <div class="table-config">
              <el-button type="primary" icon="el-icon-edit" size="mini " @click="handleClickEdit(scope.row.id)">编辑</el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini " @click="handleClickDel(scope.row.id)">删除</el-button>
              <el-button type="warning" icon="el-icon-s-tools" size="mini" @click="handleClickSetRights(scope.row)">分配权限</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed">
      <el-form
        :model="addRoleForm"
        :rules="addRoleFormRules"
        ref="addRoleForm"
        label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色对话框 -->
    <el-dialog
      title="修改角色角色"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed">
      <el-form
        :model="editRoleForm"
        :rules="editRoleFormRules"
        ref="editRoleForm"
        label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限对话框 -->
    <el-dialog
      class="rights-dialog"
      title="分配权限"
      :visible.sync="rightsDialogVisible"
      width="50%"
      @close="rightsDialogClosed">
      <!-- 树形控件 -->
      <el-tree
        :data="rightsList"
        :props="defaultProps"
        ref="tree"
        show-checkbox
        node-key="id"
        :default-checked-keys="defKeys"
        default-expand-all>
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rightsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Roles',
  data () {
    return {
      rolesList: [],
      // 添加相关
      addDialogVisible: false,
      addRoleForm: {
        roleName: '',
        roleDesc: '',
        children: []
      },
      addRoleFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入描述', trigger: 'blur' }
        ]
      },
      // 编辑角色相关
      editDialogVisible: false,
      editRoleForm: {},
      editRoleFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入描述', trigger: 'blur' }
        ]
      },
      // 分配权限
      role: {},
      rightsDialogVisible: false,
      rightsList: [],
      // tree控件设置
      defaultProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认选中的节点id
      defKeys: []
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    // 获取角色列表
    async getRolesList () {
      const { data: res } = await this.axios.get('api/roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.rolesList = res.data
      console.log(res)
    },
    // 添加角色
    addDialogClosed () {
      this.$refs.addRoleForm.resetFields()
    },
    addRole () {
      this.$refs.addRoleForm.validate(async valid => {
        if (!valid) {
          return
        }
        const { data: res } = await this.axios.post('api/roles', this.addRoleForm)
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg)
        }
        this.getRolesList()
        this.addDialogVisible = false
        this.$message.success('添加角色成功')
      })
    },
    // 编辑角色
    async handleClickEdit (id) {
      const { data: res } = await this.axios.get('api/roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户详情失败')
      }
      this.editRoleForm = res.data
      this.editDialogVisible = true
    },
    editRole () {
      this.$refs.editRoleForm.validate(async valid => {
        if (!valid) {
          return
        }
        const { data: res } = await this.axios.put('api/roles/' + this.editRoleForm.roleId, {
          roleName: this.editRoleForm.roleName,
          roleDesc: this.editRoleForm.roleDesc
        })
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.editDialogVisible = false
        this.getRolesList()
        this.$message.success('更新角色成功')
      })
    },
    editDialogClosed () {
      this.$refs.editRoleForm.resetFields()
    },
    // 删除
    handleClickDel (id) {
      this.$confirm('此操作将永久删除该角色的信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        this.axios.delete('api/roles/' + id).then((res) => {
          res = res.data
          console.log(res)
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          this.getRolesList()
          this.$message.success('已删除该角色')
        })
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    // 删除权限
    handleClickTagRemove (role, rightId) {
      this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        this.axios.delete(`api/roles/${role.id}/rights/${rightId}`).then((res) => {
          res = res.data
          console.log(res)
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          role.children = res.data
          this.$message.success('已删除该权限')
        })
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    // 分配权限
    async handleClickSetRights (role) {
      this.role = role
      const { data: res } = await this.axios.get('api/rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败')
      }
      this.rightsList = res.data
      this.getDefKeys(role, this.defKeys)
      this.rightsDialogVisible = true
      console.log(res)
    },
    // 递归获取所有三级权限,保存到数组中
    getDefKeys (node, arr) {
      // 没有children属性的为三级权限
      console.log(node)
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getDefKeys(item, arr)
      })
    },
    rightsDialogClosed () {
      this.defKeys = []
    },
    async setRights () {
      const keyArr = this.$refs.tree.getHalfCheckedKeys().concat(this.$refs.tree.getCheckedKeys())
      const rids = keyArr.join(',')
      const { data: res } = await this.axios.post(`api/roles/${this.role.id}/rights`, {
        rids: rids
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success('分配权限成功')
      this.getRolesList()
      this.rightsDialogVisible = false
    }
  }
}
</script>

<style lang="stylus" scoped>
.table-config
  display flex
  justify-content space-between
.el-tag
  margin 7px
.border-top
  border-top 1px solid #eee
.border-bottom
  border-bottom 1px solid #eee
.vertical-center
  display flex
  align-items center
.rights-dialog >>> .el-dialog__body
  padding 0 20px 20px 20px
</style>
