<template>
  <div class="report">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div class="chartWrap">
        <div id="chart1" style="width: 500px;height:400px;"></div>
        <div id="chart2" style="width: 500px;height:400px;"></div>
      </div>
    </el-card>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  data() {
    return {
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      },
      option2: {
        title: {
          text: '物流途径'
        },
        series: [
          {
            name: '物流公司',
            type: 'pie',
            radius: '75%',
            data: [
              { value: 235, name: '邮政' },
              { value: 274, name: '顺丰' },
              { value: 310, name: '圆通' },
              { value: 335, name: '中通' },
              { value: 400, name: '德邦' }
            ],
            roseType: 'angle'
          }
        ]
      }
    }
  },
  async mounted() {
    // 在元素渲染完毕后初始化echarts
    const myChart1 = echarts.init(document.getElementById('chart1'))
    const myChart2 = echarts.init(document.getElementById('chart2'))
    // 设置配置项
    const { data: res } = await this.axios.get('/reports/type/1')
    if (res.meta.status !== 200) {
      return this.$message.error(res.meta.msg)
    }
    console.log(res.data)
    const option = Object.assign(this.options, res.data)
    // 展示数据
    myChart1.setOption(option)
    myChart2.setOption(this.option2)
  }
}
</script>

<style lang="stylus" scoped>
.chartWrap
  display flex
  div
    flex 1
</style>
