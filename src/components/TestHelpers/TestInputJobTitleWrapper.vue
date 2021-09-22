<template>
  <TestFormWrapper>
    <v-text-field
      v-model.trim="value"
      id="test--input-job-title"
      placeholder="Enter a name for the job title"
      outlined
      persistent-hint
      hint="*Required"
      autocomplete="off"
      :rules="rules"
    />
  </TestFormWrapper>
</template>

<script>
import TestFormWrapper from '@/components/TestHelpers/TestFormWrapper'
import * as Validations from '@/utils/validations'
import labels from '@/model/constants/labels'

export default {
  name: 'TestInputJobTitleWrapper',
  components: { TestFormWrapper },
  data() {
    return {
      value: '',
      rules: [
        (v) => Validations.required(v, 'Required'),
        (v) => Validations.startsWithSpace(v, 'Cannot start with space'),
        (v) => Validations.maxLength(v, 64, 'Max 64 characters')
      ]
    }
  }
}
</script>
