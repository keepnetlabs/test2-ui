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
    persistentHint: {
      default: true
    },
    autocomplete: {
      default: 'off'
    },
    rules: {
      default: () => [(v) => Validations.phone(v, 'Invalid phone number')]
    }
  }
}
</script>
