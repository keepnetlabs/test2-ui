<script>
import { VTextField } from 'vuetify/lib'
import labels from '@/model/constants/labels'
import * as Validations from '@/utils/validations'
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'

export default {
  name: 'InputEmail',
  extends: VTextField,
  props: {
    outlined: {
      default: true
    },
    dense: {
      default: true
    },
    placeholder: {
      default: 'Enter an email address'
    },
    hint: {
      default: '*Required'
    },
    persistentHint: {
      default: true
    },
    autocomplete: {
      default: 'off'
    },
    required: {
      type: Boolean,
      default: true
    },
    rules: {
      default: () => [...COMMON_CONSTANTS.DEFAULT_EMAIL_RULES]
    }
  },
  created() {
    if (this.required) {
      this.rules.splice(
        2,
        0,
        (v) => Validations.required(v, labels.Required),
        (v) => Validations.minLength(v, 8, labels.getMinLengthMessage(labels.Email, 8))
      )
    } else {
      this.persistentHint = false
      this.hint = null
    }
  }
}
</script>
