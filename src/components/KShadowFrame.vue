<template>
  <div>
    <div class="k-shadow-frame" v-html="content" />
  </div>
</template>

<script>
export default {
  props: ['content'],
  mounted() {}
}
</script>
