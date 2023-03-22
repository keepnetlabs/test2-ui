<template>
  <div class="reports"></div>
</template>

<script>
export default {
  name: 'Reports',
  created() {
    this.$router.push({ name: 'Dashboard' })
  }
}
</script>
