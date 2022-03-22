<template>
  <div class="map-custom-and-scim-fields">
    <div v-for="(field, index) in fieldMappings" :key="index">
      <MapCustomAndSCIMFieldsItem
        v-model="fieldMappings[index]"
        :index="index"
        :is-show-delete="isShowDelete"
        :custom-fields="customFields"
        :scim-fields="scimFields"
        @on-delete="handleItemDelete"
      />
    </div>
    <div class="custom-fields-overlay__add" style="margin-top: -8px;" @click="addCustomField">
      <v-icon color="blue" left medium>
        mdi-plus
      </v-icon>
      <div>
        ADD CUSTOM FIELD
      </div>
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
    }
  },
  data() {
    return {
      fieldMappings: []
    }
  },
  computed: {
    isShowDelete() {
      return this.fieldMappings.length > 1
    }
  },
  created() {
    if (!this.isEdit) this.addCustomField()
  },
  methods: {
    addCustomField() {
      this.fieldMappings.push({ scimFieldResourceId: '', customFieldResourceId: '' })
    },
    handleItemDelete(index) {
      this.fieldMappings.splice(index, 1)
    }
  }
}
</script>
