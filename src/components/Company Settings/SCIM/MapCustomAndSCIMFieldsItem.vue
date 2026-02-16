<template>
  <div class="map-custom-and-scim-fields-item">
    <KSelect
      :value="value.customFieldResourceId"
      class="map-custom-and-scim-fields-item__select"
      id="input--add-or-edit-scim-custom-field"
      outlined
      dense
      clearable
      placeholder="Select a custom field"
      :disabled="isEdit"
      :items="customFields"
      @change="handleCustomFieldChange"
      @click:clear="handleCustomFieldChange('')"
    />
    <KSelect
      :value="value.scimFieldResourceId"
      id="input--add-or-edit-scim-scim-field"
      class="map-custom-and-scim-fields-item__select ml-2"
      outlined
      dense
      clearable
      placeholder="Select a scim field"
      :disabled="isEdit"
      :items="scimFields"
      @change="handleScimFieldChange"
      @click:clear="handleScimFieldChange('')"
    />
    <v-icon v-if="isShowDelete && !isEdit" class="ml-2 mt-n5" left medium @click="handleDeleteClick"
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
  methods: {
    handleDeleteClick() {
      this.$emit('on-delete', this.index)
    },
    handleScimFieldChange(val) {
      this.$emit('on-scim-field-change', val, this.value.scimFieldResourceId)
      this.$emit('input', {
        customFieldResourceId: this.value.customFieldResourceId,
        scimFieldResourceId: val
      })
    },
    handleCustomFieldChange(val) {
      this.$emit('on-custom-field-change', val, this.value.customFieldResourceId)
      this.$emit('input', {
        customFieldResourceId: val,
        scimFieldResourceId: this.value.scimFieldResourceId
      })
    }
  }
}
</script>
