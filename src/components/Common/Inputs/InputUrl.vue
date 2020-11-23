<script>
import {VTextField} from 'vuetify/lib'
import * as Validations from '@/utils/validations'

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
        (v) => Validations.url(v, 'Invalid URL')
      ]
    }
  }
}
</script>
