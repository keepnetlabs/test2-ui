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
        @change="handleOperatorChange"
      />
    </div>
    <div>
      <InputDate
        v-if="filter.operator !== 'between'"
        v-model="filter.value"
        style="width: 100% !important;"
        placeholder="Select date"
        class="mt-2"
        type="datetime"
        ref="refPicker"
        @change="$emit('on-date-picker-change')"
      />
      <InputDate
        v-else
        v-model="filter.value"
        placeholder="Select date"
        :key="betweenPickerKey"
        ref="refPicker2"
        type="datetimerange"
        class="w-100 mt-2"
        @change="$emit('on-date-picker-change')"
      />
    </div>
  </div>
</template>

<script>
import KSelect from '@/components/Common/Inputs/KSelect.vue'
import InputDate from '../../Common/Inputs/InputDate.vue'
import { createRandomCryptStringNumber } from '@/utils/functions'
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
      betweenPickerKey: `key-${createRandomCryptStringNumber()}`,
      dateFilterItems: [
        { text: 'Exact date', value: '=' },
        { text: 'After', value: '>=' },
        { text: 'Before', value: '<=' },
        { text: 'Between', value: 'between' }
      ]
    }
  },
  methods: {
    handleOperatorChange(operator) {
      if (operator === 'between') {
        this.filter.value = []
        this.betweenPickerKey = `key-${createRandomCryptStringNumber()}`
      } else {
        this.filter.value = ''
      }
    }
  }
}
</script>
