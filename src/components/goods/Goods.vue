<template>
  <div class="goods">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <!-- 搜索与添加 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input
            v-model="queryInfo.query"
            placeholder="请输入内容"
            class="input-with-select"
            @clear="getGoodsList"
            clearable
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="handleClickAdd"
            >添加商品</el-button
          >
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column width="520" prop="goods_name" label="商品名称">
        </el-table-column>
        <el-table-column prop="goods_price" label="商品价格">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量"> </el-table-column>
        <el-table-column label="创建时间" width="150">
          <template v-slot:default="scope">
            <span>
              {{ formatTime(scope.row.add_time) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot:default="scope">
            <div class="btnWrap">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="handleClickEdit(scope.row)"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="handleClickDel(scope.row)"
              ></el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { del } from '../../assets/js/common'
export default {
  name: 'Goods',
  data() {
    return {
      // 搜索信息
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 20
      },
      // 商品列表
      goodsList: [],
      // 商品总数
      total: 0
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    // 获取商品列表
    async getGoodsList () {
      const { data: res } = await this.axios('api/goods', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败')
      }
      this.goodsList = res.data.goods
      this.total = res.data.total
      console.log(this.goodsList)
    },
    // 翻页功能
    handleSizeChange (newsize) {
      this.queryInfo.pagesize = newsize
      this.getGoodsList()
    },
    handleCurrentChange (newpage) {
      this.queryInfo.pagenum = newpage
      this.getGoodsList()
    },
    // 处理时间
    formatTime (time) {
      time = new Date(time)
      const year = time.getFullYear()
      let month = this.format(time.getMonth() + 1)
      let day = this.format(time.getDate())
      let hours = this.format(time.getHours())
      let minutes = this.format(time.getMinutes())
      let seconds = this.format(time.getSeconds())
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    },
    format (num) {
      num = num < 10 ? '0' + num : num
      return num
    },
    // 添加
    handleClickAdd () {
      this.$router.push('/goods/add')
    },
    // 编辑
    handleClickEdit (row) {
      console.log(row)
    },
    // 删除
    handleClickDel (row) {
      const url = 'api/goods/'
      del(row.goods_id, url, this.getGoodsList, this)
    }
  }
}
</script>

<style lang="stylus" scoped></style>
