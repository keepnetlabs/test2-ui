<template>
  <div>
    <div>
      <KSelect
        v-model="filter.operator"
        dense
        height="40"
        outlined
        required
        hide-details
        :menu-props="{ offsetY: true }"
        :items="textFilterItems"
      />
    </div>
    <div>
      <VTextField
        v-model="filter.value"
        placeholder="Enter Value"
        class="filter__text mt-2"
        outlined
        dense
        height="40"
      />
    </div>
  </div>
</template>

<script>
import KSelect from '@/components/Common/Inputs/KSelect.vue'

export default {
  name: 'TrainingLibrarySelectFilter',
  components: { KSelect },
  props: {
    filter: {
      type: Object
    }
  },
  data() {
    return {
      filteredSelectValue: 'Contains',
      filteredValue: '',
      textFilterItems: [
        { text: 'Contains', value: 'Contains' },
        { text: 'Equal', value: '=' },
        { text: 'Not Equal', value: '!=' }
      ]
    }
  }
}
</script>
