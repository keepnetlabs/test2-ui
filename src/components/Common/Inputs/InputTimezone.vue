<template>
  <KSelect
    v-bind="$attrs"
    :value="value"
    type="autocomplete"
    id="input--timezone"
    class="input-timezone ml-2"
    style="max-width: 195px;"
    outlined
    dense
    hide-details
    placeholder="Select a timezone"
    min-width-type="huge"
    :items="items"
    @change="$emit('input', $event)"
  />
</template>

<script>
import KSelect from '@/components/Common/Inputs/KSelect'
export default {
  name: 'InputTimezone',
  components: { KSelect },
  props: {
    value: {
      type: String
    }
  },
  computed: {
    items() {
      const { timeZoneList = [] } = this.$store.getters['common/getTimezones'] || {}
      return timeZoneList.map((item) => ({ text: item.displayName, value: item.id }))
    }
  },
  created() {
    this.callForGetTimeZones()
  },
  methods: {
    callForGetTimeZones() {
      if (
        this.$store?.getters['common/getTimezones'] &&
        !this.$store?.getters['common/getTimezones']?.timeZoneList?.length
      ) {
        this.$store.dispatch('common/getTimezone')
      }
    }
  }
}
</script>
