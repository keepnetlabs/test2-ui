<template>
  <div>
    <div class="d-flex">
      <v-btn
        v-bind="$attrs"
        v-on="$listeners"
        :class="['fw-600', 'k-button-radio-group', { 'white--text': value }]"
        :style="getStyles"
        color="#2196f3"
        :outlined="!value"
        rounded
        @click="handleButtonClick"
      >
        <v-icon style="margin-left: 2px !important;" left>
          {{ value ? '$radio-checked' : '$radio-unchecked' }}
        </v-icon>
        {{ label }}
      </v-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: 'KButtonCheckbox',
  props: {
    label: {
      type: String
    },
    value: {
      type: Boolean,
      default: false
    },
    customStyle: {
      type: String
    }
  },
  computed: {
    getStyles() {
      return `box-shadow: none !important; ${this.customStyle}`
    }
  },
  methods: {
    handleButtonClick() {
      this.$emit('input', !this.value)
    }
  }
}
</script>
