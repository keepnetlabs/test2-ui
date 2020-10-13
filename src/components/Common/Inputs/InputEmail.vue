<script>
import { VTextField } from 'vuetify/lib'
import * as Validations from '@/utils/validations'

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
      default: 'Enter a URL'
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
        (v) => Validations.email(v, 'Invalid email address'),
        (v) => Validations.minLength(v, 8, 'Minimum 8 characters'),
        (v) => Validations.maxLength(v, 254, 'Email address cannot exceed 254 characters')
      ]
    }
  }
}
</script>
