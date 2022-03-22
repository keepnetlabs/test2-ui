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
    <div class="custom-fields-overlay__add" :style="getAddCustomFieldStyle" @click="addCustomField">
      <v-icon :color="isEdit ? '#757575' : 'blue'" left medium>
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
    },
    getAddCustomFieldStyle(){
      const style={marginTop:"-8px"}
      if(this.isEdit){
        style.pointerEvents='none'
        style.color="#757575 !important";
        style.opacity="0.8"
      }
      return style
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
    },
    handleCustomFieldChange(val,oldVal){
      const findedIndex=this.customFields.findIndex(item=>item.value===val)
      if(findedIndex ===-1) return
      this.$set(this.customFields,findedIndex,{...this.customFields[findedIndex],disabled:true})
      const findedIndexOfOldVal=this.customFields.findIndex(item=>item.value===oldVal)
      this.$set(this.customFields,findedIndexOfOldVal,{...this.customFields[findedIndexOfOldVal],disabled:false})
    },
    handleScimFieldChange(val,oldVal){
    const findedIndex=this.scimFields.findIndex(item=>item.value===val)
      if(findedIndex ===-1) return
      this.$set(this.scimFields,findedIndex,{...this.scimFields[findedIndex],disabled:true})
      const findedIndexOfOldVal=this.scimFields.findIndex(item=>item.value===oldVal)
      this.$set(this.scimFields,findedIndexOfOldVal,{...this.scimFields[findedIndexOfOldVal],disabled:false})
    }


  }
}
</script>
