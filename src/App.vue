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
        if (response?.data?.data?.dateFormat) {
          localStorage.setItem('selectedDateFormat', response.data.data.dateFormat)
        }
        if (response?.data?.data?.timeFormat) {
          localStorage.setItem('selectedTimeFormat', response.data.data.timeFormat)
        }
        const payload = {
          dateFormat: response?.data?.data?.dateFormat || null,
          timeFormat: response?.data?.data?.timeFormat || null
        }
        this.$store.commit('auth/SET_FORMATS', payload)
      })
    }
  }
}
</script>
