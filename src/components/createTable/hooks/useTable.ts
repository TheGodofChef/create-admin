import type { ConfigType, totalParam } from '../types'
import api from '@/api'

export const useTable = (
    table: any,
    params: any,
    initParam: any,
    formApi: ConfigType,
    props: any,
    loading: boolean
  ) => {
  const mData = ref([])
  const totalParam: totalParam = reactive({
    total: 0
  })
  const selectData = () => {
    if (!props.selected || props.selected.length === 0) {
      table.value.clearSelection()
      return
    }
    props.selected.forEach((row: any) => {
      const item = mData.value.find((item: any) => item[props.currentRowKey] === row[props.currentRowKey])
      nextTick(() => {
        table.value.toggleRowSelection(item, undefined)
      })
    });
  }

  const getData = async (): Promise<void> => {
    if (props.data) {
      mData.value = props.data
      selectData()
      return
    }
    if(!props.action) return
    // 获取数据
    const url: string[] = props.action?.split('/')!
    Object.assign(totalParam, initParam, props.pagination ? params.value : {}, formApi.fApi.formData());
    delete totalParam.search
    delete totalParam.clear
    // @ts-ignore
    loading.value = true
    const { data } = await api[url[0]][url[1]](totalParam)
    loading.value = false
    if (data) {
      totalParam.total = data.total
      mData.value = data.records
      selectData()
    }
  }

  const onSearch = () => {
    if (formApi.fApi?.validate) {
      formApi.fApi.validate(async (valid: any) => {
        if (valid) {
          params.value.pageNo = 1
          getData()
        }
      })
    } else {
      params.value.pageNo = 1
      getData()
    }
  }
  const onClear = () => {
    formApi.fApi.rule.map((v: any) => v.field).map((v: any) => {
      if (v) formApi.fApi.setValue(v, null)
    })
    params.value.pageNo = 1
    getData()
  }
  const handleSizeChange = (val: number) => {
    params.value.pageNo = 1
    params.value.pageSize = val
    getData()
  }
  const handleCurrentChange = (val: number) => {
    params.value.pageNo = val
    getData()
  }
  return {
    ...toRefs(totalParam),
    selectData,
    getData,
    mData,
    onSearch,
    onClear,
    handleSizeChange,
    handleCurrentChange
  }
}