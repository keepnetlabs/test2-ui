<template>
  <div class="advanced-reports-card">
    <div class="advanced-reports-card__left">
      <h3>{{ title }}</h3>
      <p>{{ description }}</p>
    </div>
    <div class="advanced-reports-card__right">
      <VBtn
        class="fw-600 no-box-shadow"
        color="#2196f3"
        rounded
        outlined
        @click="handleActionButtonClick"
      >
        {{ buttonText }}
      </VBtn>
    </div>
  </div>
</template>

<script>
import button from 'element-ui/packages/button'

export default {
  name: 'AdvancedReportsCard',
  computed: {
    button() {
      return button
    }
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    buttonText: {
      type: String,
      default: 'CREATE REPORT'
    },
    resourceId: {
      type: String,
      default: ''
    },
    reportType: {
      type: String,
      default: ''
    }
  },
  methods: {
    handleActionButtonClick() {
      this.$emit('on-action-button-click', this.resourceId)
    }
  }
}
</script>
