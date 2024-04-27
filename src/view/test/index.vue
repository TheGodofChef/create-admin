<template>
  <div class="table-box">
    <create-table ref="table" current-row-key="name" :config="config" v-model:selected="selected">
      <template #left="scope">
        <el-button type="primary" @click="clickBtn(scope.selection)">实例按钮</el-button>
      </template>
      <template #right="scope">
        <el-button type="primary" @click="clickBtn(scope.selection)">实例按钮</el-button>
      </template>
    </create-table>
  </div>
</template>

<script setup lang="tsx">
import { ElMessage } from 'element-plus'
import { ref, reactive } from 'vue'

const table = ref()
const config = reactive({
  fApi: {},
  value: {},
  //表单生成规则
  rule: [
    {
      type: 'input',
      field: 'stationName',
      title: '站点名称',
    },
    {
      type: 'datePicker',
      field: 'created_at',
      title: '创建时间',
    },
  ],
  //组件参数配置
  option: {},
  columns: [
    { type: 'selection', width: '50' },
    { type: 'index', width: '80', label: '序号' },
    { prop: 'stationName', label: '站点名称', sortable: true, minWidth: '100', align: 'center' },
    {
      prop: 'action',
      label: '操作',
      minWidth: '80',
      fixed: 'right',
      render: (scope: any) => {
        return (
          <>
            <el-button type="success" link onClick={() => sayHi(scope.$index)}>
              Hi
            </el-button>
          </>
        )
      },
    },
  ],
})
let selected = reactive<any[]>([])
const sayHi = (index: number) => {
  ElMessage({
    message: `hi————第${index + 1}行`,
    type: 'success',
  })
}
const clickBtn = (select: any[]) => {
  console.log(selected[0])
}
</script>

<style scoped lang="scss"></style>
