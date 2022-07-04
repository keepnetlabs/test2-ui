<template>
  <div class="form-group-horizontal-content">
    <label class="form-group-horizontal-content__label">{{ label }}</label>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'FormGroupHorizontalContent',
  props: {
    label: {
      type: String
    }
  }
}
</script>
