<template>
  <form-group
    class-name="input-copy-to-clipboard"
    :title="labels.title"
    :sub-title="labels.subtitle"
  >
    <v-form v-model="isValid" lazy-validation ref="refForm" onSubmit="return false;">
      <div class="copy-to-clipboard__container saml-domain data-container-with-search-input">
        <slot name="search-input">
          <v-text-field
            id="input--saml-settings-domain-to-add"
            placeholder="Enter Domain name"
            style="max-width: 428px;"
            outlined
            dense
            persistent-hint
            hint="*Required"
          ></v-text-field>
        </slot>
        <v-btn
          id="btn-add--exclude-ip-address"
          outlined
          rounded
          color="#2196F3"
          :class="['btn-domain-add ml-4', { 'btn-data-container-invalid': isButtonDisabled }]"
          @click="handleAddClick"
        >
          <v-icon left>mdi-plus</v-icon>
          Add</v-btn
        >
      </div>
    </v-form>
  </form-group>
</template>

<script>
import FormGroup from '@/components/SmallComponents/FormGroup'
export default {
  name: 'DataContainerWithSearchInput',
  components: { FormGroup },
  emits: ['on-add-click'],
  props: {
    labels: {
      type: Object,
      default() {
        return { title: '', subtitle: '' }
      }
    },
    inputValue: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isValid: true
    }
  },
  computed: {
    isButtonDisabled() {
      return !this.isValid || !this.inputValue
    }
  },
  methods: {
    handleAddClick() {
      if (this.validateForm()) {
        this.$emit('on-add-click')
        this.$nextTick(() => {
          this.$refs.refForm.resetValidation()
        })
      }
    },
    validateForm() {
      return this.$refs.refForm.validate()
    }
  }
}
</script>
