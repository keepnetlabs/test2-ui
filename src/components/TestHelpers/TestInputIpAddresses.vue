<template>
  <TestFormWrapper>
    <v-text-field
      v-model.trim="value"
      id="test--input-ip-address"
      placeholder="Enter an ip adress"
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
  name: 'TestInputIpAddresses',
  components: { TestFormWrapper },
  data() {
    return {
      value: '',
      rules: [
        (v) => Validations.required(v, labels.Required),
        (v) => Validations.startsWithSpace(v, labels.CannotStartWithSpace),
        (v) =>
          Validations.maxLength(v, 40, labels.getMaxLengthMessage(labels.LastNameSecondLower, 40))
      ]
    }
  }
}
</script>
