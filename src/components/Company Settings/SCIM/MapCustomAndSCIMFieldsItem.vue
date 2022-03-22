<template>
  <div class="map-custom-and-scim-fields-item">
    <KSelect
      v-model.trim="value.customFieldResourceId"
      id="input--add-or-edit-scim-group"
      outlined
      dense
      placeholder="Select a item"
      :items="customFields"
    />
    <KSelect
      v-model.trim="value.scimFieldResourceId"
      id="input--add-or-edit-scim-group"
      class="ml-2"
      outlined
      dense
      placeholder="Select a item"
      :items="scimFields"
    />
    <v-icon v-if="isShowDelete" class="ml-2" left medium @click="handleDeleteClick"
      >mdi-delete
    </v-icon>
  </div>
</template>

<script>
import KSelect from '@/components/Common/Inputs/KSelect'

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
  methods: {
    handleDeleteClick() {
      this.$emit('on-delete', this.index)
    }
  }
}
</script>
