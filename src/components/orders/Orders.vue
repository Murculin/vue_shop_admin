<template>
  <div class="orders">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 搜索框 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input
            v-model="queryInfo.query"
            placeholder="请输入内容"
            class="input-with-select"
            @blur="getOrderList"
            clearable
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getOrderList"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="orderList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="500">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格"></el-table-column>
        <el-table-column prop="order_pay" label="是否付款">
          <template v-slot:default="scope">
            <el-tag type="danger">{{ orderPay(scope.row.order_pay) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"></el-table-column>
        <el-table-column prop="create_time" label="下单时间" width="200">
        </el-table-column>
        <el-table-column label="操作" width="150px">
          <template v-slot:default="scope">
            <el-button
              size="mini"
              icon="el-icon-edit"
              type="primary"
              @click="handleClickEdit(scope.row)"
            ></el-button>
            <el-button
              size="mini"
              icon="el-icon-location-information"
              type="success"
              @click="handleClickLocation(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 15, 20, 25]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 编辑地址弹窗 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- 编辑地址表单 -->
      <el-form
        :model="addressForm"
        :rules="addressFormRules"
        ref="addressForm"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            :options="cityData"
            v-model="addressForm.address1"
            :props="{ expandTrigger: 'hover' }"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 物流进度弹窗 -->
    <el-dialog
      title="物流进度"
      :visible.sync="locationDialogVisible"
      width="50%"
    >
      <el-timeline>
        <el-timeline-item
          v-for="(item, index) in locationList"
          :key="index"
          type="primary"
          :timestamp="item.time">
          {{ item.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityData from '../../assets/js/citydata'
export default {
  data() {
    return {
      // 搜索相关
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      // 列表
      orderList: [],
      // edit
      editDialogVisible: false,
      addressForm: {
        address1: [],
        address2: ''
      },
      addressFormRules: {
        address1: [
          { required: true, message: '请选择地址', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      },
      cityData: cityData,
      // location
      locationDialogVisible: false,
      // 物流信息列表
      locationList: []
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    // 获取数据
    async getOrderList() {
      const { data: res } = await this.axios.get('/api/orders', {
        params: this.queryInfo
      })
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.total = res.data.total
      this.orderList = res.data.goods
    },
    orderPay(isPay) {
      return isPay === 0 ? '已付款' : '未付款'
    },
    // 翻页
    handleSizeChange (newsize) {
      this.queryInfo.pagesize = newsize
      this.getOrderList()
    },
    handleCurrentChange (newpage) {
      this.queryInfo.pagenum = newpage
      this.getOrderList()
    },
    // edit
    handleClickEdit(row) {
      console.log(row)
      this.editDialogVisible = true
    },
    editDialogClosed() {
      this.$refs.addressForm.resetFields()
    },
    editUser() {
      this.editDialogVisible = false
    },
    // 物流信息功能
    async handleClickLocation(row) {
      const { data: res } = await this.axios.get('/api/kuaidi/1106975712662')
      console.log(res)
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg)
      }
      this.locationList = res.data
      this.locationDialogVisible = true
    }
  }
}
</script>

<style lang="stylus" scoped></style>
