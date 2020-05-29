<template>
  <div class="add">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 提示信息 -->
      <el-alert title="添加商品信息" type="info" center show-icon> </el-alert>
      <!-- 步骤条 -->
      <div class="step-wrap">
        <el-steps :active="activeName - 0" finish-status="success">
          <el-step title="基本信息"></el-step>
          <el-step title="商品参数"></el-step>
          <el-step title="商品属性"></el-step>
          <el-step title="商品图片"></el-step>
          <el-step title="商品内容"></el-step>
        </el-steps>
      </div>
      <!-- tabs -->
      <el-form
        :model="addForm"
        :rules="formRules"
        ref="addForm"
        label-position="top"
      >
        <el-tabs
          v-model="activeName"
          :before-leave="beforeTabLeave"
          @tab-click="handleTabClick"
          tab-position="left"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格(￥)" prop="goods_price">
              <el-input v-model.number="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量(kg)" prop="goods_weight">
              <el-input v-model.number="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model.number="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <Cascader
                :list="cateList"
                @cascaderChange="cascaderChange"
              ></Cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item class="params"
              v-for="item in manyTableList"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-checkbox-group v-model="item.checkList">
                <el-checkbox
                  v-for="(check, i) in item.attr_vals"
                  :label="check"
                  :key="i"
                  border
                  checked
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              v-for="item in onlyTableList"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload class="upload"
              :action="uploadUrl"
              :headers="ajaxHeader"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handelSuccess"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
            <quill-editor v-model="addForm.goods_introduce">
            </quill-editor>
            <!-- 添加按钮 -->
            <el-button @click="add" type="primary" class="editBtn">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览窗口 -->
    <el-dialog :visible.sync="imgDialogVisible"
      @close="imgDialogClosed"
    >
      <img width="100%" :src="preImg" alt="">
    </el-dialog>
  </div>
</template>

<script>
import Cascader from '../Cascader'
import _ from 'lodash'
export default {
  name: 'Add',
  components: {
    Cascader
  },
  data() {
    return {
      // tab页码
      activeName: '0',
      // 分类列表
      cateList: [],
      // 动态/静态属性
      manyTableList: [],
      onlyTableList: [],
      // 图片列表
      pics: [],
      // 图片上传地址
      uploadUrl: 'https://www.liulongbin.top:8888/api/private/v1/upload',
      ajaxHeader: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 预览图片
      preImg: '',
      imgDialogVisible: false,
      // 要提交的总表单
      addForm: {
        goods_name: '',
        goods_cat: '',
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_introduce: '',
        pics: [],
        attrs: []
      },
      // 验证规则
      formRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
          { type: 'number', message: '价格必须为数字值' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' },
          { type: 'number', message: '重量必须为数字值' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' },
          { type: 'number', message: '数量必须为数字值' }
        ]
      }
    }
  },
  created() {
    this.getCateList()
    if (this.$route.params.id) { // 如果路由信息中有id 则为修改页面
      this.getGoods(this.$route.params.id)
    }
  },
  methods: {
    // 根据id获取商品详情 用于编辑
    async getGoods(id) {
      let { data: res } = await this.axios.get('/goods/' + id)
      console.log(res)
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg)
        this.$router.back(-1)
        return
      }
      res = res.data
      this.addForm = {
        goods_name: res.goods_name,
        goods_cat: res.goods_cat,
        goods_price: res.goods_price,
        goods_number: res.goods_number,
        goods_weight: res.goods_weight,
        goods_introduce: res.goods_introduce,
        pics: res.pics,
        attrs: []
      }
    },
    // 获取商品分类
    async getCateList() {
      const { data: res } = await this.axios.get('/categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类列表失败')
      }
      this.cateList = res.data
      console.log(res)
    },
    // 获取动态列表
    async getParamsListMany() {
      const { data: res } = await this.axios.get(
        `/categories/${this.addForm.goods_cat[2]}/attributes/`,
        {
          params: {
            sel: 'many'
          }
        }
      )
      if (res.meta.status !== 200) {
        return
      }
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals
          ? item.attr_vals.split(' ')
          : (item.attr_vals = [])
        item.checkList = []
      })
      this.manyTableList = res.data
      console.log(res.data)
    },
    // 获取静态属性
    async getParamsListOnly() {
      const { data: res } = await this.axios.get(
        `/categories/${this.addForm.goods_cat[2]}/attributes/`,
        {
          params: {
            sel: 'only'
          }
        }
      )
      if (res.meta.status !== 200) {
        return
      }
      this.onlyTableList = res.data
      console.log(res.data)
    },
    // 级联选择器
    cascaderChange(val) {
      this.addForm.goods_cat = val
    },
    // 切换tab
    beforeTabLeave(name, oldname) {
      if (!this.addForm.goods_cat) {
        this.$message.error('请先选择商品分类')
        return false
      }
    },
    handleTabClick () {
      if (this.activeName === '1' && !this.manyTableList.length) {
        this.getParamsListMany()
      } else if (this.activeName === '2' && !this.onlyTableList.length) {
        this.getParamsListOnly()
      }
    },
    // 图片预览
    handlePreview(file) {
      console.log(file)
      this.preImg = file.response.data.url
      this.imgDialogVisible = true
    },
    imgDialogClosed () {
      this.preImg = ''
    },
    // 图片移除
    handleRemove(file, fileList) {
      console.log(file)
      const delPath = file.response.data.tmp_path
      const index = this.addForm.pics.findIndex(item =>
        item.pic === delPath
      )
      this.addForm.pics.splice(index, 1)
      console.log(this.addForm)
    },
    // 图片上传成功的回调
    handelSuccess (response) {
      console.log(response)
      const picInfo = {
        pic: response.data.tmp_path
      }
      this.addForm.pics.push(picInfo)
    },
    // 添加
    add() {
      console.log(this.addForm)
      // 预验证
      this.$refs.addForm.validate(valid => {
        if (!valid) {
          return this.$message.error('请填写必要的表单项')
        }
      })
      // 处理goods_cat
      const form = _.cloneDeep(this.addForm)
      form.goods_cat = form.goods_cat.join(',')
      // 处理attrs
      // many
      this.manyTableList.forEach(item => {
        let newInfo = {
          attr_id: item.attr_id,
          attr_value: item.checkList.join(' ')
        }
        this.addForm.attrs.push(newInfo)
      })
      // only
      this.onlyTableList.forEach(item => {
        let newInfo = {
          attr_id: item.attr_id,
          attr_value: item.attr_vals
        }
        this.addForm.attrs.push(newInfo)
      })
      form.attrs = this.addForm.attrs
      console.log(form)
      if (this.$route.params.id) {
        // 发起修改请求
        this.editGoods(form)
      } else {
        // 发起请求添加商品
        this.addGoods(form)
      }
    },
    async addGoods(form) {
      const { data: res } = await this.axios.post('/goods', form)
      console.log(res)
      if (res.meta.status !== 201) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success('添加商品成功')
      this.$router.back(-1)
    },
    async editGoods(form) {
      const { data: res } = await this.axios.put('/goods/' + this.$route.params.id, form)
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success('修改商品成功')
      this.$router.back(-1)
    }
  }
}
</script>

<style lang="stylus" scoped>
.step-wrap
  padding 0 80px
  margin 20px 0
.params
  border-bottom 1px solid #D3D3D3
  padding-bottom 10px
  margin-bottom 20px
  .el-checkbox
    margin 0 10px 10px 0 !important
.upload
  width 600px
.editBtn
  margin-top 15px
</style>
