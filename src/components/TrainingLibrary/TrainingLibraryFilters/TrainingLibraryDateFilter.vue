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
        :items="dateFilterItems"
      />
    </div>
    <div>
      <InputDate
        v-if="filter.operator !== 'between'"
        v-model="filter.value"
        type="datetime"
        ref="refPicker"
      />
      <InputDate v-model="filter.value" ref="refPicker2" type="datetimerange" />
    </div>
  </div>
</template>

<script>
import KSelect from '@/components/Common/Inputs/KSelect.vue'
import InputDate from '../../Common/Inputs/InputDate.vue'

export default {
  name: 'TrainingLibraryDateFilter',
  components: { InputDate, KSelect },
  props: {
    filter: {
      type: Object
    }
  },
  data() {
    return {
      filteredSelectValue: '=',
      filteredValue: '',
      dateFilterItems: [
        { text: 'Exact date', value: '=' },
        { text: 'After', value: '>=' },
        { text: 'Before', value: '<=' },
        { text: 'Between', value: 'between' }
      ]
    }
  }
}
</script>
