export const formOptions = (labelWidth: number = 100, span: number = 8) => {
  return {
    submitBtn: false,
    resetBtn: false,
    row: { type: 'flex' },
    global: {
      '*': {
        col: { span },
        props: { clearable: true }
      }
    },
    form: {
      inline: true,
      labelSuffix: ':',
      labelWidth: labelWidth + 'px'
    }
  }
}