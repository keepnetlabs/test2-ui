<template>
  <v-text-field
    placeholder="Enter phone number"
    outlined
    dense
    :rules="[
      (v) => validations.maxLength(v, 11, '10 characters'),
      (v) => validations.minLength(v, 9, '10 characters')
    ]"
    ref="refTextField"
    :value="value.val"
    @input="onPhoneNumberChange"
  >
    <template v-slot:prepend-inner>
      <v-menu bottom offset-y min-width="133" max-height="250">
        <template v-slot:activator="{ on }">
          <div v-on="on" class="phishing-reporter__header-container-panel-right-col pl-0">
            <div class="phone-number__text">
              {{ value.code }}
            </div>
            <v-icon style="padding-left: 6px;">mdi-chevron-down</v-icon>
          </div>
        </template>
        <v-list>
          <v-list-item @click="handleListItemClick(item)" :key="item" v-for="item in listItems">
            <v-list-item-title>{{ item }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>
  </v-text-field>
</template>

<script>
import { maxLength, minLength } from '@/utils/validations'

export default {
  name: 'PhoneNumber',
  props: {
    value: {
      code: '+90',
      val: ''
    }
  },
  data() {
    return {
      listItems: [],
      selectedPhoneItem: null,
      validations: {
        maxLength,
        minLength
      }
    }
  },
  methods: {
    handleListItemClick(code) {
      this.$emit('input', { ...this.value, code })
    },
    onPhoneNumberChange(val) {
      const numberVal = Number(val)
      const newVal = isNaN(numberVal) ? '' : val
      const renderedValue = /[0-9]/gi.test(newVal)
        ? newVal
        : val.length === 0
        ? val
        : this.value.val
      this.$refs.refTextField.lazyValue = renderedValue
      this.$emit('input', { ...this.value, val: renderedValue })
    }
  },
  created() {
    for (let i = 0; i < 100; i++) {
      this.listItems.push(`+${i}`)
    }
    this.$emit('input', { code: '+90', val: '' })
  }
}
</script>

<style lang="scss">
.phone-number {
  &__text {
    font-size: 13px;
    font-weight: normal;
    line-height: normal;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.72) !important;
  }
}
</style>
