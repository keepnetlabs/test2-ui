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
    if (!this.isEdit)
      this.fieldMappings.push({ scimFieldResourceId: '', customFieldResourceId: '' })
  },
  methods: {
    handleItemDelete(vModel, index) {}
  }
}
</script>
