<template>
  <div class="map-custom-and-scim-fields">
    <div v-for="(field, index) in fieldMappings" :key="index">
      <MapCustomAndSCIMFieldsItem
        v-model="fieldMappings[index]"
        :index="index"
        :is-show-delete="isShowDelete"
        :is-edit="isEdit"
        :custom-fields="customFields"
        :scim-fields="scimFields"
        @on-delete="handleItemDelete"
        @on-custom-field-change="handleCustomFieldChange"
        @on-scim-field-change="handleScimFieldChange"
      />
    </div>
    <div
      v-if="!isEdit && !isEmptyMessageRendered"
      class="custom-fields-overlay__add"
      :style="getAddCustomFieldStyle"
      @click="addCustomField"
    >
      <v-icon :color="isEdit ? '#757575' : 'blue'" left medium>
        mdi-plus
      </v-icon>
      <div>
        ADD CUSTOM FIELD
      </div>
    </div>
    <div v-if="isEmptyMessageRendered">
      You do not have any custom field
    </div>
  </div>
</template>

<script>
import MapCustomAndSCIMFieldsItem from '@/components/Company Settings/SCIM/MapCustomAndSCIMFieldsItem'
export default {
  name: 'MapCustomAndSCIMFields',
  components: { MapCustomAndSCIMFieldsItem },
  props: {
    scimFields: {
      type: Array
    },
    customFields: {
      type: Array
    },
    isEdit: {
      type: Boolean
    },
    initialValue: {
      type: Array
    }
  },
  data() {
    return {
      fieldMappings: this.initialValue || []
    }
  },
  computed: {
    isShowDelete() {
      return this.fieldMappings.length > 1
    },
    isEmptyMessageRendered() {
      return !this.fieldMappings.length
    },
    getAddCustomFieldStyle() {
      const style = { marginTop: '-8px' }
      if (this.isEdit) {
        style.pointerEvents = 'none'
        style.color = '#757575 !important'
        style.opacity = '0.8'
      }
      return style
    }
  },
  methods: {
    addCustomField() {
      this.fieldMappings.push({ scimFieldResourceId: '', customFieldResourceId: '' })
    },
    handleItemDelete(index) {
      const { scimFieldResourceId, customFieldResourceId } = this.fieldMappings[index]
      this.changeCustomFieldItemDisability(
        this.getCustomFieldIndexByValue(customFieldResourceId),
        false
      )
      this.changeScimFieldDisability(this.getScimFieldIndexByValue(scimFieldResourceId), false)
      this.fieldMappings.splice(index, 1)
    },
    handleCustomFieldChange(val, oldVal) {
      const findedIndex = this.getCustomFieldIndexByValue(val)
      if (findedIndex === -1) return
      this.changeCustomFieldItemDisability(findedIndex, true)
      this.changeCustomFieldItemDisability(this.getCustomFieldIndexByValue(oldVal), false)
    },
    getCustomFieldIndexByValue(val) {
      return this.customFields.findIndex((item) => item.value === val)
    },
    changeCustomFieldItemDisability(findedIndex, disabled) {
      this.$set(this.customFields, findedIndex, {
        ...this.customFields[findedIndex],
        disabled
      })
    },
    handleScimFieldChange(val, oldVal) {
      const findedIndex = this.getScimFieldIndexByValue(val)
      if (findedIndex === -1) return
      this.changeScimFieldDisability(findedIndex, true)
      this.changeScimFieldDisability(this.getScimFieldIndexByValue(oldVal), false)
    },
    getScimFieldIndexByValue(val) {
      return this.scimFields.findIndex((item) => item.value === val)
    },
    changeScimFieldDisability(findedIndex, disabled) {
      this.$set(this.scimFields, findedIndex, {
        ...this.scimFields[findedIndex],
        disabled
      })
    }
  }
}
</script>
