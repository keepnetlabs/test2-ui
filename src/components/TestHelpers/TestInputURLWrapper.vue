<template>
  <TestFormWrapper>
    <v-text-field
      v-model.trim="value"
      id="test--input-url"
      placeholder="Enter a URL"
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
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'

export default {
  name: 'TestInputURLWrapper',
  components: { TestFormWrapper },
  data() {
    return {
      value: '',
      rules: [...COMMON_CONSTANTS.DEFAULT_URL_RULES]
    }
  }
}
</script>
