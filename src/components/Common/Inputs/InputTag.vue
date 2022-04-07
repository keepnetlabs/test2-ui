<template>
  <v-combobox
    :value="value"
    type="combobox"
    :items="items"
    chips
    deletable-chips
    outlined
    multiple
    dense
    persistent-hint
    small-chips
    :return-object="false"
    placeholder="Enter tags and press enter key"
    @input="handleTagItemChange"
    @update:search-input="handleSearchInputChange"
  />
</template>

<script>
export default {
  name: "InputTag",
  emits: ["input", "searchInputChange"],
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    value: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  methods: {
    handleTagItemChange(newValue) {
      this.$emit("input", newValue);
    },
    handleSearchInputChange(newValue) {
      this.$emit("searchInputChange", newValue);
    },
  },
};
</script>