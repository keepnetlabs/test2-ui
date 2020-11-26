<template>
  <div class="companies"></div>
</template>

<script>
export default {
  name: 'Companies',
  created() {
    this.$router.push({ name: 'Dashboard' })
  },
  methods: {}
}
</script>
