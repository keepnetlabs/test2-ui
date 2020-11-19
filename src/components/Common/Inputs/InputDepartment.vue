<script>
import { VTextField } from 'vuetify/lib'
import * as Validations from '@/utils/validations'

export default {
  name: 'InputDepartment',
  extends: VTextField,
  props: {
    outlined: {
      default: true
    },
    dense: {
      default: true
    },
    placeholder: {
      default: 'Enter a name for the department'
    },
    persistentHint: {
      default: true
    },
    autocomplete: {
      default: 'off'
    },
    rules: {
      default: () => [
        (v) => Validations.startsWithEmpty(v, 'Cannot start with space'),
        (v) => Validations.maxLength(v, 64, 'Max 64 characters')
      ]
    }
  }
}
</script>
