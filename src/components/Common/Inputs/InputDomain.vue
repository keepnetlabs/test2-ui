<template>
  <KSelect
    type="autocomplete"
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
    :loading="isLoading"
    :hide-no-data="isLoading"
    hint="*Required"
    :placeholder="placeholder"
    :items="items"
    :rules="rules"
    :slots="{ progress: true }"
    @change="handleDomainChange"
    @focus="handleFocus"
  >
    <template #progress>
      <KSelectLoading v-show="showLoader" />
    </template>
  </KSelect>
</template>

<script>
import KSelect from '@/components/Common/Inputs/KSelect'
import labels from '@/model/constants/labels'
import KSelectLoading from '@/components/KSelectLoading.vue'

export default {
  name: 'InputDomain',
  components: { KSelectLoading, KSelect },
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
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    showLoader: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleDomainChange(val = []) {
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
    },
    handleFocus() {
      this.$emit('on-focus')
    }
  }
}
</script>
