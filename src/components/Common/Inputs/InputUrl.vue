<script>
import { VTextField } from 'vuetify/lib'
import * as Validations from '@/utils/validations'
import labels from '@/model/constants/labels'
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'
export default {
  name: 'InputUrl',
  extends: VTextField,
  props: {
    outlined: {
      default: true
    },
    dense: {
      default: true
    },
    placeholder: {
      default: 'Enter a URL'
    },
    hint: {
      default: labels.DefaultHint
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
      default: () => [...COMMON_CONSTANTS.DEFAULT_URL_RULES]
    }
  },
  created() {
    if (this.required) {
      this.rules.splice(0, 0, (v) => Validations.required(v, labels.Required))
    } else {
      this.persistentHint = false
      this.hint = null
    }
  }
}
</script>
