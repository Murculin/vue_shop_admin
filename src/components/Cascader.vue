<template>
  <div class="selectCateWrap">
    <span v-if="showTitle" class="cascaderTitle">{{ title }}</span>
    <el-cascader
      v-model="value"
      :options="list"
      :props="cascaderProps"
      @change="handleChange"></el-cascader>
  </div>
</template>

<script>
export default {
  name: 'Cascader',
  props: {
    showTitle: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    list: {
      type: Array,
      default: () => []
    },
    cascaderProps: {
      type: Object,
      default: () => {
        return {
          expandTrigger: 'hover',
          value: 'cat_id',
          label: 'cat_name',
          children: 'children'
        }
      }
    }
  },
  data () {
    return {
      value: []
    }
  },
  methods: {
    handleChange () {
      if (this.value.length !== 3) {
        this.value = []
        return
      }
      this.$emit('cascaderChange', this.value)
    }
  }
}
</script>

<style lang="stylus" scoped>
.cascaderTitle
  font-size 16px
  margin-right 10px
</style>
