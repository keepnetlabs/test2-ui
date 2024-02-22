<template>
  <router-view />
</template>

<script>
export default {
  name: 'AwarenessEducator',
  created() {
    if (this.$route.name === 'Awareness Educator') this.$router.push({ name: 'Training Library' })
  }
}
</script>
