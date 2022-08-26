<template>
  <router-view />
</template>
<script>
import { getSystemUserSettings } from '@/api/settings'

export default {
  name: 'App',
  created() {
    this.$store.dispatch('login/getWhiteLabelByUrl')
    this.getSystemUserSettings()
  },
  methods: {
    getSystemUserSettings() {
      getSystemUserSettings().then((response) => {
        localStorage.setItem('selectedDateFormat', response.data.data.dateFormat)
        localStorage.setItem('selectedTimeFormat', response.data.data.timeFormat)
      })
    }
  }
}
</script>
