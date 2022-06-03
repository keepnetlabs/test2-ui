<template>
  <div class="d-flex">
    <v-btn
      v-for="(item, index) in items"
      v-bind="$attrs"
      v-on="$listeners"
      :key="index"
      :class="['fw-600', { 'white--text': isSelected(index), 'ml-4': !isFirstIndex(index) }]"
      style="box-shadow: none !important;"
      color="#2196f3"
      :outlined="!isSelected(index)"
      rounded
      @click="handleButtonClick(item, index)"
    >
      <v-icon style="margin-left: 2px !important;" left>
        {{ isSelected(index) ? '$radio-checked' : '$radio-unchecked' }}
      </v-icon>
      {{ item.label }}
    </v-btn>
  </div>
</template>

<script>
export default {
  name: 'KButtonRadioGroup',
  props: {
    items: {
      type: Array,
      required: true
    },
    value: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      selectedIndex: 0
    }
  },
  watch: {
    value(val) {
      if (val && val !== this.selectedIndex) {
        this.selectedIndex = val
      }
    }
  },
  methods: {
    handleButtonClick(item, index) {
      this.selectedIndex = index
      this.$emit('input', index)
      this.$emit('on-item-click', item)
    },
    isSelected(index) {
      return this.selectedIndex === index
    },
    isFirstIndex(index) {
      return index === 0
    }
  }
}
</script>

<style lang="scss"></style>
