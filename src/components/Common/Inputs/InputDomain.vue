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
import labels from '@/model/constants/labels'

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
      console.log('val', val)
      const isValIncludes = val.includes(labels.AllDomains)
      this.$emit('input', isValIncludes ? [labels.AllDomains] : val)
      this.setDomainItemsDisability(isValIncludes)
    },
    setDomainItemsDisability(val = false) {
      this.items.forEach((item) => {
        if (item.value !== labels.AllDomains) {
          item.disabled = val
        }
      })
    }
  }
}
</script>
