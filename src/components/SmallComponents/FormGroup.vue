<template>
  <v-list-item :class="['k-form-group', className]">
    <v-list-item-content>
      <slot name="title">
        <label :class="['k-form-group__title', labelClassName]" v-if="title">
          {{ title }}
        </label>
      </slot>
      <slot name="subTitle">
        <v-list-item-subtitle v-if="subTitle" v-html="subTitle" class="k-form-group__sub-title">
        </v-list-item-subtitle>
      </slot>
      <div :class="['k-form-group__content', hasHint && 'k-form-group__content-hint']">
        <slot></slot>
      </div>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
export default {
  name: 'FormGroup',
  props: {
    title: {
      type: String,
      default: ''
    },
    subTitle: {
      type: String,
      default: ''
    },
    hasHint: {
      type: Boolean,
      default: false
    },
    className: {
      type: String
    },
    labelClassName: {
      type: String
    }
  }
}
</script>
