<template>
  <TestFormWrapper>
    <v-text-field
      v-model.trim="value"
      id="test--input-company"
      placeholder="Enter a name for the company"
      outlined
      persistent-hint
      hint="*Required"
      :rules="rules"
      autocomplete="disabled"
    />
  </TestFormWrapper>
</template>

<script>
import TestFormWrapper from '@/components/TestHelpers/TestFormWrapper'
import * as Validations from '@/utils/validations'
import labels from '@/model/constants/labels'

export default {
  name: 'TestInputCompanyWrapper',
  components: { TestFormWrapper },
  data() {
    return {
      value: '',
      rules: [
        (v) => Validations.required(v, labels.Required),
        (v) => Validations.startsWithSpace(v, labels.CannotStartWithSpace),
        (v) =>
          Validations.maxLength(v, 64, labels.getMaxLengthMessage(labels.CompanyNameSecondLower))
      ]
    }
  }
}
</script>
