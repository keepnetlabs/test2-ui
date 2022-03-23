<template>
  <div class="map-custom-and-scim-fields-item">
    <KSelect
      v-model.trim="value.customFieldResourceId"
      id="input--add-or-edit-scim-group"
      style="flex-basis: 50%;"
      outlined
      dense
      placeholder="Select a custom field"
      :disabled="isEdit"
      :rules="[(v) => Validations.required(v)]"
      :items="customFields"
    />
    <KSelect
      v-model.trim="value.scimFieldResourceId"
      id="input--add-or-edit-scim-group"
      style="flex-basis: 50%;"
      class="ml-2"
      outlined
      dense
      placeholder="Select a scim field"
      :disabled="isEdit"
      :items="scimFields"
      :rules="[(v) => Validations.required(v)]"
    />
    <v-icon v-if="isShowDelete" class="ml-2 mt-n5" left medium @click="handleDeleteClick"
      >mdi-delete
    </v-icon>
  </div>
</template>

<script>
import KSelect from '@/components/Common/Inputs/KSelect'
import * as Validations from '@/utils/validations'
export default {
  name: 'MapCustomAndSCIMFieldsItem',
  components: { KSelect },
  props: {
    scimFields: {
      type: Array
    },
    customFields: {
      type: Array
    },
    isShowDelete: {
      type: Boolean
    },
    isEdit: {
      type: Boolean
    },
    index: {
      type: Number
    },
    value: {
      type: Object,
      default() {
        return {
          scimFieldResourceId: '',
          customFieldResourceId: ''
        }
      }
    }
  },
  data() {
    return {
      Validations
    }
  },
  watch: {
    'value.scimFieldResourceId'(val, oldVal) {
      this.$emit('on-scim-field-change', val, oldVal)
    },
    'value.customFieldResourceId'(val, oldVal) {
      this.$emit('on-custom-field-change', val, oldVal)
    }
  },
  methods: {
    handleDeleteClick() {
      this.$emit('on-delete', this.index)
    }
  }
}
</script>
