<template>
  <div v-if="showToolbar" class="browser-toolbar">
    <div class="browser-toolbar__controls">
      <span class="browser-toolbar__dot browser-toolbar__dot--red"></span>
      <span class="browser-toolbar__dot browser-toolbar__dot--yellow"></span>
      <span class="browser-toolbar__dot browser-toolbar__dot--green"></span>
    </div>
    <div class="browser-toolbar__url-bar">
      <span class="browser-toolbar__url-text">{{ formattedUrl }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BrowserToolbar',
  props: {
    url: {
      type: String,
      default: ''
    },
    pageIndex: {
      type: Number,
      default: 0
    },
    showToolbar: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    formattedUrl() {
      if (!this.url) return ''
      const randomNum = Math.floor(Math.random() * 10000000000)

      let formattedUrl = `${this.url}${randomNum}`
      if (this.pageIndex > 0) {
        formattedUrl += `&order=${this.pageIndex + 1}`
      }
      return formattedUrl
    }
  }
}
</script>
