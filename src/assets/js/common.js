
// 删除按钮 callback 成功时的回调函数
export const del = (id, url, callback, vm) => {
  console.log(id, url, vm)
  vm.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'error'
  })
    .then(() => {
      vm.axios.delete(url + id).then(res => {
        res = res.data
        console.log(res)
        if (res.meta.status !== 200) {
          return vm.$message.error('删除失败')
        }
        callback()
        vm.$message.success('已删除')
      })
    })
    .catch(() => {
      vm.$message.info('已取消删除')
    })
}
