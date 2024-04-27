<template>
  <div class="card table-main">
    <form-create v-model="formApi.value" v-model:api="formApi.fApi" v-bind="formApi" v-on="$attrs"
      @search-click="onSearch" @clear-click="onClear" v-if="formApi.rule && formApi.rule.length"></form-create>
    <div class="table-header">
      <div class="header-button-lf">
        <slot name="left" :selection="selection"></slot>
      </div>
      <div class="header-button-ri">
        <slot name="right" :selection="selection"></slot>
        <el-popover :visible="visible" placement="bottom" :width="160">
          <p>这里预留用来做动态调整显示表格列</p>
          <div style="text-align: right; margin: 0">
            <el-button size="small" text @click="visible = false">cancel</el-button>
            <el-button size="small" type="primary" @click="visible = false">confirm</el-button>
          </div>
          <template #reference>
            <el-button v-if="columns.length" icon="Operation" circle @click="openColSetting" />
          </template>
        </el-popover>
      </div>
    </div>
    <el-table ref="table" v-bind="$attrs" :current-row-key="currentRowKey" :row-key="rowKey" :border="border"
      :data="mData" style="width: 100%" @selection-change="handleSelectionChange" v-loading="loading">
      <template v-for="propItem in columns" :key="propItem.prop">
        <el-table-column v-if="propItem.type && ['selection', 'index', 'expand'].includes(propItem.type)"
          :key="propItem.type" v-bind="propItem" :align="propItem.align ?? 'center'"
          :reserve-selection="propItem.type == 'selection'">
          <template v-if="propItem.type == 'expand'" #default="scope">
            <component :is="propItem.render" v-bind="scope" v-if="propItem.render"> </component>
            <slot v-else :name="propItem.type" v-bind="scope"></slot>
          </template>
        </el-table-column>
        <TableColumn v-if="!propItem.type && propItem.prop && propItem.isShow" :column="propItem">
          <template v-for="slot in Object.keys($slots)" #[slot]="scope">
            <slot :name="slot" :row="scope.row"></slot>
          </template>
        </TableColumn>
      </template>
    </el-table>
    <slot name="pagination">
      <el-pagination v-if="pagination" v-model:currentPage="params.pageNo" v-model:page-size="params.pageSize"
        :page-sizes="pageSizes" layout="->, total, sizes, prev, pager, next, jumper" :total="total"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </slot>
  </div>
</template>

<script setup lang="tsx">
import { ref, reactive } from 'vue'
import TableColumn from './components/TableColumn.vue'
import type { TableProps } from 'element-plus'
import { formOptions } from './hooks/useFormOption'
import { useTable } from './hooks/useTable'
import _ from 'lodash'
import Sortable from 'sortablejs'
import type { paramsType, BtnType, FormType, ConfigType, Columns } from './types/index'
interface ProTableProps {
  pagination?: boolean
  pageSizes?: number[]
  pageSize?: number
  selected?: any[]
  action?: string
  requestAuto?: boolean;
  data?: any[]
  config: ConfigType
  initParam?: any; // 初始化请求参数 ==> 非必传（默认为{}）
  currentRowKey?: string | number
  border?: boolean,
  rowKey?: string | Function,
}

const emit = defineEmits(['update:selected', 'update:config', 'dargSort'])

const props = withDefaults(defineProps<ProTableProps>(), {
  pagination: true,
  pageSizes: () => [10, 50, 100, 200, 300],
  pageSize: 10,
  selected: () => [],
  border: true,
  currentRowKey: 'id',
  initParam: {},
  requestAuto: true,
  rowKey: "id",
  config: () => ({
    columns: [],
    fApi: {},
    value: {},
    rule: [],
    option: {},
  }),
})

const table = ref()
// 接收 columns 并设置为响应式
const columns = reactive<Columns[]>(_.cloneDeep(props.config?.columns))
const flatColumnsFunc = (columns: Columns[], flatArr: Columns[] = []) => {
  columns.forEach(async col => {
    if (col._children?.length) flatArr.push(...flatColumnsFunc(col._children))
    flatArr.push(col)
    col.isShow = col.isShow ?? true
  })
  return flatArr.filter(item => !item._children?.length)
}
flatColumnsFunc(columns)

// 以后做显示列过滤用
const colSetting = columns!.filter(
  item => !["selection", "index", "expand"].includes(item.type!) && item.prop !== "action" && item.isShow
)

let formApi = reactive<ConfigType>(
  _.cloneDeep({
    fApi: props.config?.fApi,
    value: props.config?.value,
    rule: props.config?.rule,
    option: { ...formOptions(), ...props.config?.option, },
  })
)

watch(
  () => props.config,
  (val) => {
    if (!val) return
    const searchBtn: BtnType = {
      type: 'button',
      field: 'search',
      props: { type: 'primary' },
      children: ['查询'],
      on: { click: () => onSearch() },
    }
    const resetBtn: BtnType = {
      type: 'button',
      field: 'clear',
      props: { type: 'default' },
      children: ['清空'],
      on: { click: () => onClear() },
    }
    const hasSearch = val.rule.some((item: BtnType) => item.field === 'search')
    const hasClear = val.rule.some((item: BtnType) => item.field === 'clear')
    if (formApi?.rule && formApi.rule.length !== 0) {
      if (!hasSearch) formApi?.rule?.push(searchBtn)
      if (!hasClear) formApi?.rule?.push(resetBtn)
    }
  },
  {
    immediate: true,
  }
)
onMounted(() => {
  emit('update:config', {
    columns: columns,
    fApi: formApi.fApi,
    value: formApi.value,
    rule: formApi.rule,
    option: formApi.option
  })
})

let params = computed<paramsType>(() => {
  return {
    pageNo: 1,
    pageSize: props.pageSize,
    orderBy: 'create_time',
    orderDirection: 'DESC',
  }
})
let loading = ref(false)

const { getData, mData, total, onSearch, onClear, handleSizeChange, handleCurrentChange } = useTable(table, params, props.initParam, formApi, props, loading)



// 初始化请求
onMounted(() => {
  props.requestAuto && getData()
  dragSort()
})

// 拖拽排序
const dragSort = () => {
  const tbody = document.querySelector(".el-table__body-wrapper tbody") as HTMLElement;
  Sortable.create(tbody, {
    handle: ".move",
    animation: 300,
    onEnd({ newIndex, oldIndex }: { newIndex: number, oldIndex: number }) {
      const [removedItem] = mData.value.splice(oldIndex!, 1);
      mData.value.splice(newIndex!, 0, removedItem);
      emit("dargSort", { newIndex, oldIndex });
    }
  });
};

const selection = ref<any>([])
const handleSelectionChange = (val: any) => {
  selection.value = val
  nextTick(() => {
    emit('update:selected', selection.value)
  })
}

const visible = ref(false)
const openColSetting = () => {
  visible.value = true
}

defineExpose({
  selection,
  fApi: formApi,
  getData,
  onSearch,
  onClear,
})
</script>

<style lang="scss">
@import './index.scss';

.form-btns {
  .el-form-item {
    margin-right: 15px !important;
  }
}
</style>
