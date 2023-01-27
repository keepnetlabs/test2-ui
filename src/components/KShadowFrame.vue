<template>
  <div>
    <div v-html="content" class="k-shadow-frame" style="padding-top: 10px;" />
  </div>
</template>

<script>
export default {
  props: ['content']
}
</script>
