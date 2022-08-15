<template>
  <KSelect
    v-bind="$attrs"
    :value="value"
    type="autocomplete"
    id="input--timezone"
    class="input-timezone"
    :style="getStyle"
    outlined
    dense
    :hide-details="!hint"
    placeholder="Select a timezone"
    min-width-type="huge"
    :persistent-hint="persistentHint"
    :hint="hint"
    :items="items"
    :rules="rules"
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
    },
    hint: {
      type: String
    },
    rules: {
      type: Array,
      default: () => []
    },
    persistentHint: {
      type: Boolean,
      default: false
    },
    isBlock: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    getStyle() {
      if (this.isBlock) {
        return ''
      }

      return 'max-width: 195px;'
    },
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
