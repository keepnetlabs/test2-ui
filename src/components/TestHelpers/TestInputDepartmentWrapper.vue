<template>
  <TestFormWrapper>
    <v-text-field
      v-model.trim="value"
      id="test--input-department"
      placeholder="Enter a name for the department"
      outlined
      :rules="rules"
      autocomplete="off"
    />
  </TestFormWrapper>
</template>

<script>
import TestFormWrapper from '@/components/TestHelpers/TestFormWrapper'
import * as Validations from '@/utils/validations'
import labels from '@/model/constants/labels'

export default {
  name: 'TestInputDepartment',
  components: { TestFormWrapper },
  data() {
    return {
      value: '',
      rules: [
        (v) => Validations.startsWithSpace(v, labels.CannotStartWithSpace),
        (v) => Validations.maxLength(v, 64, labels.getMaxLengthMessage(labels.Department))
      ]
    }
  }
}
</script>
