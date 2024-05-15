<template>
  <router-view />
</template>
<script>
import { getSystemUserSettings } from '@/api/settings'
import { mapGetters } from 'vuex'

export default {
  name: 'App',
  created() {
    this.$store.dispatch('login/getWhiteLabelByUrl')
  },
  mounted() {
    /*
    if (window.location.origin === 'https://test-ui.devkeepnet.com') {
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.innerHTML = `var $zoho=$zoho || {};$zoho.salesiq = $zoho.salesiq || {widgetcode:"siq8c30e3e6c12ba193ce53e5bb012ce0be08f44a20eab54844eaff0aabf126c2f8", values:{},ready:function(){}};var d=document;s=d.createElement("script");s.type="text/javascript";s.id="zsiqscript";s.defer=true;s.src="https://salesiq.zoho.com/widget";t=d.getElementsByTagName("script")[0];t.parentNode.insertBefore(s,t);d.write("<div id='zsiqwidget'></div>");`
      document.body.insertAdjacentElement('beforeend', script)
    }
     */
  },
  computed: {
    ...mapGetters({
      user: 'auth/userGetter'
    })
  },
  watch: {
    user: {
      deep: true,
      handler(val) {
        if (Object.keys(val).length > 0) {
          this.getSystemUserSettings()
        }
      }
    }
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
        this.$store.commit('common/SET_SELECTED_TIME_ZONE', response.data.data.timeZoneId)
        this.$store.commit('common/SET_SELECTED_TIME_ZONE_NAME', response.data.data.timeZoneName)
      })
    }
  }
}
</script>
