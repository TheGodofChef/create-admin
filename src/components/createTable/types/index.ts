export type paramsType = {
  pageNo: number,
  pageSize: number,
  [props: string]: any;
}

export interface BtnType {
  type: string,
  field: string,
  props: any,
  children?: string[],
  emit?: any,
  on?: any
}

export interface FormType {
  type: string,
  field?: string,
  title?: string,
  class?: string,
  children?: any[]
}

export type Columns = {
  type?: string,
  prop?: string,
  label?: string,
  width?: string,
  align?: string,
  isShow?: boolean,
  [prop: string]: any,
}

export type ConfigType = {
  fApi: any,
  value: any,
  rule?: FormType[],
  columns?: Columns[],
  option?: any,
  [prop: string]: any,
}

export interface totalParam {
  [key: string]: any;
};

