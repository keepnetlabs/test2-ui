<template>
  <div>
    <div class="k-shadow-frame" style="padding-top: 10px;" v-html="content" />
  </div>
</template>

<script>
export default {
  props: ['content'],
  mounted() {}
}
</script>
