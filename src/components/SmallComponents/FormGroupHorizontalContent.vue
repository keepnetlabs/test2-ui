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

<style lang="scss">
.form-group-horizontal-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: -4px;
  &--left {
    display: flex;
    flex-direction: column;
    margin-top: -12px !important;
    span {
      font-weight: normal;
      font-size: 9px;
      line-height: 12px;
      color: #383b41;
    }
  }
  > *:first-child {
    flex-basis: 50%;
    margin-top: -15px;
    max-width: 240px;
    margin-right: 8px;
  }
  .v-text-field.v-text-field--enclosed .v-text-field__details {
    margin-bottom: 2px;
  }
  .v-input--dense > .v-input__control > .v-input__slot {
    margin-bottom: 0;
  }
  .v-text-field {
    max-width: 400px !important;
  }
  &__label {
    font-weight: normal;
    font-size: 14px;
    line-height: 21px;
    color: #383b41;
  }
}
</style>
