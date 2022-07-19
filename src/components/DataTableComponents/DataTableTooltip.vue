<template>
  <div class="datatable-tooltip" :style="tooltipStyle">
    {{ content }}
  </div>
</template>

<script>
export default {
  name: 'DataTableTooltip',
  props: {
    tooltipStyle: {
      type: Object
    },
    content: {
      type: String
    }
  }
}
</script>
