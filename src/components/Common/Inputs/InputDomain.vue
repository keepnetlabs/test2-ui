<template>
  <KSelect
    :value="value"
    class="input-domain"
    custom-menu-class="input-domain__menu"
    id="input--direct-email-creation-domains"
    outlined
    dense
    persistent-hint
    small-chips
    deletable-chips
    multiple
    hint="*Required"
    :placeholder="placeholder"
    :items="items"
    :rules="rules"
    @change="handleDomainChange"
  />
</template>

<script>
import KSelect from '@/components/Common/Inputs/KSelect'

export default {
  name: 'InputDomain',
  components: { KSelect },
  props: {
    value: {
      type: Array,
      default: () => []
    },
    items: {
      type: Array,
      default: () => []
    },
    placeholder: {
      type: String,
      default: 'Select a item'
    },
    rules: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    handleDomainChange(val = []) {
      const isValIncludes = val.includes('All')
      this.$emit('input', isValIncludes ? ['All'] : val)
      this.setDomainItemsDisability(isValIncludes)
    },
    setDomainItemsDisability(val = false) {
      this.domainItems.forEach((item) => {
        if (item.value !== 'All') {
          item.disabled = val
        }
      })
    }
  }
}
</script>
