<template>
  <div :class="wrapperClasses">
    <div>
      <img src="../../assets/img/gsuite-logo.png" alt="gsuite-logo">
    </div>
    <div class="mx-12">
      <img src="../../assets/img/outlook.png" alt="outlook-logo">
    </div>
    <div>
      <img src="../../assets/img/office-365-logo.png" alt="office-logo">
    </div>
  </div>
</template>

<script>
  export default {
    name: "Logos",
    props: {
      wrapperClasses: {
        type: String,
      }
    }
  }
</script>

<style scoped>

</style>
