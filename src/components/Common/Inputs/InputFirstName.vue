<script>
import { VTextField } from 'vuetify/lib'
import * as Validations from '@/utils/validations'

export default {
  name: 'InputFirstName',
  extends: VTextField,
  props: {
    outlined: {
      default: true
    },
    dense: {
      default: true
    },
    placeholder: {
      default: 'Enter first name'
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
      //
      default: () => [
        (v) => Validations.required(v, 'Required'),
        (v) => Validations.startsWithSpace(v, 'Cannot start with space'),
        (v) => Validations.maxLength(v, 40, 'Max 40 characters')
      ]
    }
  }
}
</script>
