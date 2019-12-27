<template>
  <div class="cate">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <div class="button-wrap">
        <el-button type="primary" @click="handleClickAdd">
          添加分类
        </el-button>
      </div>
      <!-- 树形表格 -->
      <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
      >
        <template v-slot:isUseful="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: lightgreen"
          ></i>
          <i v-else class="el-icon-error" style="color: red"></i>
        </template>
        <template v-slot:level="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level === 1" type="success"
            >二级</el-tag
          >
          <el-tag v-else type="warning">三级</el-tag>
        </template>
        <template v-slot:edit="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="handleClickEdit(scope.row)"
          >
            编辑
          </el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="handleClickDel(scope.row.cat_id)"
          >
            删除
          </el-button>
        </template>
      </tree-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog
      class="addDialog"
      title="添加分类"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateForm"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!-- 级联选择 -->
          <el-cascader
            v-model="cascaderValue"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChage"
            :clearable="true"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑分类对话框 -->
    <el-dialog
      class="editDialog"
      title="编辑分类"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editCateForm"
        :rules="addCateFormRules"
        label-width="100px"
        ref="editCateForm"
      >
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Cate',
  data() {
    return {
      queryInfo: {
        pagenum: 1,
        pagesize: 5
      },
      cateList: [],
      total: 0,
      // 树形表格数据 template指定插槽模板
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          prop: 'cat_deleted',
          type: 'template',
          template: 'isUseful'
        },
        {
          label: '排序',
          type: 'template',
          template: 'level'
        },
        {
          label: '操作',
          width: '200px',
          type: 'template',
          template: 'edit'
        }
      ],
      // add
      addDialogVisible: false,
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      parentCateList: [],
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true
      },
      cascaderValue: [],
      // edit
      editDialogVisible: false,
      editCateForm: {
        cat_id: 0,
        cat_name: ''
      }
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.axios.get('api/categories', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类列表失败')
      }
      this.cateList = res.data.result
      this.total = res.data.total
      console.log(res)
    },
    // 页码相关
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize
      this.getCateList()
    },
    handleCurrentChange(newpage) {
      this.queryInfo.pagenum = newpage
      this.getCateList()
    },
    // 添加分类
    async handleClickAdd() {
      const { data: res } = await this.axios.get('api/categories', {
        params: {
          type: 2
        }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类失败')
      }
      this.parentCateList = res.data
      this.addDialogVisible = true
    },
    addCate() {
      this.$refs.addCateForm.validate(async valid => {
        if (!valid) {
          return
        }
        const { data: res } = await this.axios.post(
          'api/categories',
          this.addCateForm
        )
        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败')
        }
        this.$message.success('添加分类成功')
        this.getCateList()
        this.addDialogVisible = false
      })
    },
    addDialogClosed() {
      this.$refs.addCateForm.resetFields()
      this.cascaderValue = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    parentCateChage() {
      if (this.cascaderValue.length > 0) {
        this.addCateForm.cat_pid = this.cascaderValue[this.cascaderValue.length - 1]
      } else {
        this.addCateForm.cat_pid = 0
      }
      this.addCateForm.cat_level = this.cascaderValue.length
    },
    // 操作区
    // 编辑
    handleClickEdit(cate) {
      this.editCateForm.cat_name = cate.cat_name
      this.editCateForm.cat_id = cate.cat_id
      this.editDialogVisible = true
    },
    editDialogClosed() {
      this.$refs.editCateForm.resetFields()
    },
    editCate() {
      this.$refs.editCateForm.validate(async valid => {
        if (!valid) {
          return
        }
        const { data: res } = await this.axios.put(
          `api/categories/${this.editCateForm.cat_id}`,
          {
            cat_name: this.editCateForm.cat_name
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('编辑分类失败')
        }
        this.$message.success('编辑成功')
        this.editDialogVisible = false
        this.getCateList()
      })
    },
    // 删除
    handleClickDel(id) {
      this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      })
        .then(() => {
          this.axios.delete('api/categories/' + id).then(res => {
            res = res.data
            if (res.meta.status !== 200) {
              return this.$message.error('删除失败')
            }
            this.getCateList()
            this.$message.success('已删除该分类')
          })
        })
        .catch(() => {
          this.$message.info('已取消删除')
        })
    }
  }
}
</script>

<style lang="stylus" scoped>
.el-cascader
  width 100%
</style>
