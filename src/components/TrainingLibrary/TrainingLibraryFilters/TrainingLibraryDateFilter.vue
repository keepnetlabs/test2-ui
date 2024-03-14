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
        :key="`${getDateKey}2`"
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
        :key="`${getDateKey}2`"
        placeholder="Select date"
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
  },
  computed: {
    getDateKey() {
      return this.$store?.state?.auth?.user?.userCompany?.timeZone
    }
  }
}
</script>
