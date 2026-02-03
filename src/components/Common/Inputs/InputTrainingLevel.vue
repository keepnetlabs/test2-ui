<template>
  <FormGroup :title="title" :sub-title="subTitle">
    <KSelect
      :value="value"
      :items="items"
      :item-text="itemText"
      :item-value="itemValue"
      :disabled="disabled"
      :loading="loading"
      :rules="required ? requiredRules : []"
      :hint="required ? '*Required' : ''"
      :persistent-hint="required"
      dense
      outlined
      autocomplete="off"
      :placeholder="placeholder"
      @input="$emit('input', $event)"
    />
  </FormGroup>
</template>

<script>
import FormGroup from "@/components/SmallComponents/FormGroup.vue";
import KSelect from "@/components/Common/Inputs/KSelect.vue";
import labels from "@/model/constants/labels";
import * as Validations from "@/utils/validations";

export default {
  name: "InputTrainingLevel",
  components: { FormGroup, KSelect },
  props: {
    value: {
      type: [String, Number],
      default: ""
    },
    items: {
      type: Array,
      default: () => []
    },
    itemText: {
      type: String,
      default: "text"
    },
    itemValue: {
      type: String,
      default: "id"
    },
    title: {
      type: String,
      default: "Training Level"
    },
    subTitle: {
      type: String,
      default: "Select the level of knowledge required for this training"
    },
    placeholder: {
      type: String,
      default: "Select level"
    },
    loading: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    requiredRules() {
      return [(v) => Validations.required(v, labels.Required)];
    }
  }
};
</script>
