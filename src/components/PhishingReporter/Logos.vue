<template>
  <div :class="wrapperClasses">
    <div style="display: flex; align-items: center;">
      <img src="../../assets/img/google-workspace.png" alt="g-suite-logo" />
    </div>
    <div>
      <img
        src="../../assets/img/outlook.svg"
        :class="{ 'mx-2': hasMidMargin }"
        alt="outlook-logo"
      />
    </div>
    <div>
      <img src="../../assets/img/microsoft-365-logo.png" alt="microsoft-365-logo" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Logos',
  props: {
    wrapperClasses: {
      type: String
    },
    hasMidMargin: {
      type: Boolean,
      default: false
    }
  }
}
</script>
