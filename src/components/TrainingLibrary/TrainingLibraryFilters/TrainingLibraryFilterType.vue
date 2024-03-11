<template>
  <VListItem class="my-2">
    <VRadioGroup
      :value="filterType"
      class="mt-2 mb-3 pt-0 campaign-manager-target-groups-radio"
      hide-details
      @change="handleSetFilter"
    >
      <VRadio
        :id="`input--campaign-manager-radio-distribution-to`"
        class="mb-0"
        color="#2196f3"
        label="Or"
        value="OR"
      />
      <VRadio
        :id="`input--campaign-manager-radio-distribution-to`"
        class="mb-0 mt-4"
        color="#2196f3"
        label="And"
        value="AND"
      />
    </VRadioGroup>
  </VListItem>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'TrainingLibraryFilterType',
  computed: {
    ...mapGetters({
      filterType: 'trainingLibrary/getFilterType'
    })
  },
  methods: {
    ...mapActions({
      setFilterType: 'trainingLibrary/setFilterType'
    }),
    handleSetFilter(event) {
      this.$emit('on-filter-selected')
      this.setFilterType(event)
    }
  }
}
</script>
