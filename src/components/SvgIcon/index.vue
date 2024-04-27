<template>
  <div v-if="externalRouter" :style="styleExternalIcon" class="svg-external-icon svg-icon"></div>
  <svg v-else :class="iconClass" aria-hidden="true">
    <use class="svg-use" :href="svgIconName" />
  </svg>
</template>

<script setup>
import { computed } from 'vue'
import { isExternal } from '@/utils/validate';
const props = defineProps({
  iconName: {
    type: String,
    required: true
  },
  iconClass: {
    type: String,
    default: 'svg-icon'
  }
})

const svgIconName = computed(() => {
  return `#${props.iconName}`
})

const externalRouter = computed(() => {
  return isExternal(props.iconClass)
})

const styleExternalIcon = computed(() => {
  {
    return {
      mask: `url(${props.iconClass}) no-repeat 50% 50%`,
      '-webkit-mask': `url(${props.iconClass}) no-repeat 50% 50%`
    }
  }
})

</script>

<style scoped>
.svg-icon {
  width: var(--el-menu-icon-width);
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
  font-size: 16px;
  margin-right: 5px;
  vertical-align: middle;
  flex-shrink: 0;
}

.el-menu--collapse > .el-menu-item [class^='svg-icon'] {
  margin: 0;
  vertical-align: middle;
  width: var(--el-menu-icon-width);
  text-align: center;
}

.svg-external-icon {
  background-color: currentColor;
  mask-size: cover !important;
  display: inline-block;
}
</style>
