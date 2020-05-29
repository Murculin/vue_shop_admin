<template>
  <div class="params">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <!-- 提示信息 -->
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        :closable="false"
        show-icon>
      </el-alert>
      <!-- 选择器 -->
      <div class="selectCateWrap">
        <span class="cascaderTitle">选择商品分类:</span>
        <el-cascader
          v-model="cascaderValue"
          :options="cateList"
          :props="cascaderProps"
          @change="handleChange"></el-cascader>
      </div>
      <!-- tab -->
      <el-tabs v-model="activeName" @tab-click="handleClickTab">
        <el-tab-pane label="动态参数" name="many">
          <div class="btnWrap">
            <el-button
              type="primary"
              size="mini"
              :disabled="!cascaderValue.length"
              @click="handleClickAdd"
            >
              添加参数
            </el-button>
          </div>
          <!-- 动态参数表格 -->
          <el-table :data="manyList" border stripe>
            <el-table-column type="expand">
              <template v-slot:default="scope">
                <!-- 表格拓展列 -->
                <div class="expandWrap">
                  <el-tag
                    v-for="(item, index) in scope.row.attr_vals"
                    :key="index"
                    closable
                    @close="delTag(scope.row, index)"
                  >
                    {{ item }}
                  </el-tag>
                  <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                  >
                  </el-input>
                  <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                </div>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作" width="300px">
              <template v-slot:default="scope">
                <div class="table-config">
                  <el-button type="primary" icon="el-icon-edit" size="mini " @click="handleClickEdit(scope.row)">编辑</el-button>
                  <el-button type="danger" icon="el-icon-delete" size="mini " @click="handleClickDel(scope.row.attr_id)">删除</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <div class="btnWrap">
            <el-button
              type="primary"
              size="mini"
              :disabled="!cascaderValue.length"
              @click="handleClickAdd"
            >
              添加属性
            </el-button>
          </div>
          <!-- 静态属性表格 -->
          <el-table :data="onlyList" border stripe>
            <el-table-column type="expand">
              <template v-slot:default="scope">
                <div class="expandWrap">
                  <el-tag
                    v-for="(item, index) in scope.row.attr_vals"
                    :key="index"
                    closable
                    @close="delTag(scope.row, index)"
                  >
                    {{ item }}
                  </el-tag>
                  <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                  >
                  </el-input>
                  <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                </div>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作" width="300px">
              <template v-slot:default="scope">
                <div class="table-config">
                  <el-button type="primary" icon="el-icon-edit" size="mini " @click="handleClickEdit(scope.row)">编辑</el-button>
                  <el-button type="danger" icon="el-icon-delete" size="mini " @click="handleClickDel(scope.row.attr_id)">删除</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加对话框 -->
    <el-dialog
      :title="addInfo.title"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed">
      <el-form
        :model="addParamsForm"
        :rules="addParamsFormRules"
        ref="addParamsForm"
        label-width="100px">
        <el-form-item :label="addInfo.label" prop="attr_name">
          <el-input v-model="addParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParam">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改对话框 -->
    <el-dialog
      :title="editInfo.title"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed">
      <el-form
        :model="editParamsForm"
        :rules="editParamsFormRules"
        ref="editParamsForm"
        label-width="100px">
        <el-form-item :label="editInfo.label" prop="attr_name">
          <el-input v-model="editParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParam">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { del } from '../../assets/js/common.js'
export default {
  name: 'Params',
  data () {
    return {
      // 选择器
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      cascaderValue: [],
      cateList: [],
      // tab
      activeName: 'many',
      manyList: [],
      onlyList: [],
      // add
      addDialogVisible: false,
      addParamsForm: {
        attr_name: ''
      },
      addParamsFormRules: {
        attr_name: [
          { required: true, message: '请添加参数名称', trigger: 'blur' }
        ]
      },
      // edit
      editDialogVisible: false,
      editParamsForm: {
        attr_id: 0,
        attr_name: ''
      },
      editParamsFormRules: {
        attr_name: [
          { required: true, message: '请添加属性名称', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    cateId () {
      if (this.cascaderValue.length !== 3) {
        return null
      }
      return this.cascaderValue[2]
    },
    addInfo () {
      let obj = {}
      obj.title = this.activeName === 'many' ? '添加动态参数' : '添加静态属性'
      obj.label = this.activeName === 'many' ? '动态参数: ' : '静态属性: '
      return obj
    },
    editInfo () {
      let obj = {}
      obj.title = this.activeName === 'many' ? '修改动态参数' : '修改静态属性'
      obj.label = this.activeName === 'many' ? '动态参数: ' : '静态属性: '
      return obj
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    // 获取分类列表
    async getCateList () {
      const { data: res } = await this.axios.get('/categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类列表失败')
      }
      this.cateList = res.data
      console.log(res)
    },
    // 获取属性列表
    async getParamsList () {
      const { data: res } = await this.axios.get(`/categories/${this.cateId}/attributes/`, {
        params: {
          sel: this.activeName
        }
      })
      if (res.meta.status !== 200) {
        return
      }
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        item.inputValue = ''
        item.inputVisible = false
      })
      if (this.activeName === 'many') {
        this.manyList = res.data
      } else {
        this.onlyList = res.data
      }
      console.log(res.data)
    },
    // 级联选择器值变化
    handleChange () {
      if (this.cascaderValue.length !== 3) {
        this.cascaderValue = []
        this.manyList = []
        this.onlyList = []
        return
      }
      this.getParamsList()
    },
    handleClickTab () {
      this.getParamsList()
    },
    // add
    handleClickAdd () {
      this.addDialogVisible = true
    },
    addDialogClosed () {
      this.$refs.addParamsForm.resetFields()
    },
    addParam () {
      this.$refs.addParamsForm.validate(async valid => {
        if (!valid) {
          return
        }
        const { data: res } = await this.axios.post(
          `/categories/${this.cateId}/attributes`,
          {
            attr_name: this.addParamsForm.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success('添加参数成功')
        this.getParamsList()
        this.addDialogVisible = false
      })
    },
    // edit
    editDialogClosed () {
      this.$refs.editParamsForm.resetFields()
    },
    handleClickEdit (scope) {
      let name = scope.attr_name
      this.editParamsForm.attr_name = name
      this.editParamsForm.attr_id = scope.attr_id
      this.editDialogVisible = true
    },
    editParam () {
      this.$refs.editParamsForm.validate(async valid => {
        if (!valid) {
          return
        }
        const { data: res } = await this.axios.put(`/categories/${this.cateId}/attributes/${this.editParamsForm.attr_id}`, {
          attr_name: this.editParamsForm.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.editParamsForm = {
          attr_name: '',
          attr_id: 0
        }
        this.getParamsList()
        this.editDialogVisible = false
        this.$message.success('编辑成功')
      })
    },
    // del
    handleClickDel (id) {
      del(id, `/categories/${this.cateId}/attributes/`, this.getParamsList, this)
    },
    // tag
    showInput (scope) {
      scope.inputVisible = true
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    async handleInputConfirm (scope) {
      let inputValue = scope.inputValue
      if (inputValue.trim()) {
        let vals = scope.attr_vals
        vals.push(inputValue)
        scope.inputVisible = false
        scope.inputValue = ''
        vals = vals.join(' ')
        const { data: res } = await this.axios.put(`/categories/${this.cateId}/attributes/${scope.attr_id}`, {
          attr_name: scope.attr_name,
          attr_sel: scope.attr_sel,
          attr_vals: vals
        })
        if (res.meta.status !== 200) {
          this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
      } else {
        scope.inputVisible = false
        scope.inputValue = ''
      }
    },
    async delTag (scope, index) {
      let vals = scope.attr_vals
      vals.splice(index, 1)
      vals = vals.join(' ')
      const { data: res } = await this.axios.put(`/categories/${this.cateId}/attributes/${scope.attr_id}`, {
        attr_name: scope.attr_name,
        attr_sel: scope.attr_sel,
        attr_vals: vals
      })
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      console.log(vals, res)
    }
  }
}
</script>

<style lang="stylus" scoped>
.el-alert
  margin-bottom 15px
.cascaderTitle
  font-size 16px
  margin-right 10px
.el-tabs
  margin-top 15px
.expandWrap
  .el-tag
    margin-right 10px
  .input-new-tag
    width 100px
</style>
