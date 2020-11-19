<script>
import { VTextField } from 'vuetify/lib'
import * as Validations from '@/utils/validations'

export default {
  name: 'InputJobTitle',
  extends: VTextField,
  props: {
    outlined: {
      default: true
    },
    dense: {
      default: true
    },
    placeholder: {
      default: 'Enter a name for the job title'
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
    rules: {
      default: () => [
        (v) => Validations.required(v, 'Required'),
        (v) => Validations.startsWithEmpty(v, 'Cannot start with space'),
        (v) => Validations.maxLength(v, 64, 'Max 64 characters')
      ]
    }
  }
}
</script>
