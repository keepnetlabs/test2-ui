<template>
  <app-modal
    :status="status"
    @closeOverlay="closeOverlay"
    class-name="custom-fields-overlay"
    icon-name="mdi-file-excel"
    title="Edit Fields - Target Users / People"
  >
    <template v-slot:overlay-body>
      <v-list-item class="mt-8 mb-6 custom-fields-overlay__list-item">
        <v-list-item-content>
          <v-list-item-title>
            Edit Table Fields
          </v-list-item-title>
          <v-list-item-subtitle>
            Add, remove or edit custom fields on datatable
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item :key="index" v-for="(item, index) in fields">
        <v-list-item-content>
          <table-field :item="item" @deleteTableField="handleDeleteTableField(index)" />
        </v-list-item-content>
      </v-list-item>
      <v-list-item class="custom-fields-overlay__list-item mt-2">
        <v-list-item-content>
          <v-list-item-title class="custom-fields-overlay__title">Custom Fields</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item :key="index" v-for="(item, index) in customFields">
        <v-list-item-content>
          <table-field isDeleteable @deleteTableField="handleDeleteTableField(index)" />
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          <div @click="handleAddCustomField" class="custom-fields-overlay__add">
            <v-icon color="blue" left medium>
              mdi-plus
            </v-icon>
            <div>
              ADD CUSTOM FIELD
            </div>
          </div>
        </v-list-item-content>
      </v-list-item>
    </template>
    <template v-slot:overlay-footer>
      <v-btn @click="closeOverlay" class="new-integration__footer-btn-cancel" rounded>
        CANCEL
      </v-btn>
      <div class="new-integration__footer__right-col">
        <v-btn
          @click="submit"
          class="new-integration__footer-btn-save white--text"
          color="#2196f3"
          rounded
        >
          SAVE
        </v-btn>
      </div>
    </template>
  </app-modal>
</template>

<script>
import AppModal from '../AppModal'
import TableField from './subcomponents/TableField'
import { getTargetUserCustomFieldsByCompanyId } from '../../api/targetUsers'

export default {
  name: 'CustomFieldsModal',
  components: {
    AppModal,
    TableField
  },
  props: {
    status: {
      type: Boolean
    }
  },
  data() {
    return {
      customFields: [],
      fields: []
    }
  },
  methods: {
    closeOverlay() {
      this.$emit('closeCustomFieldsModal')
    },
    handleAddCustomField() {
      this.customFields.push({})
    },
    callForGetTargetUserCustomFieldsByCompanyId() {
      getTargetUserCustomFieldsByCompanyId()
        .then((response) => {
          const { data } = response
          this.fields = data.data
        })
        .catch((error) => {})
    },
    submit() {},
    handleDeleteTableField(index) {
      this.customFields.splice(index, 1)
    }
  },
  created() {
    this.callForGetTargetUserCustomFieldsByCompanyId()
  }
}
</script>

<style lang="scss">
.custom-fields-overlay {
  &__list-item {
    .v-list-item__title {
      font-size: 24px;
      font-weight: normal;
      line-height: 1.29;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87) !important;
    }

    .v-list-item__subtitle {
      font-size: 14px;
      font-weight: normal;
      line-height: 1.5;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87) !important;
    }
  }

  &__title {
    font-size: 20px !important;
    font-weight: 600 !important;
    line-height: 1.2;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87) !important;
  }

  &__add {
    display: flex;
    align-items: center;
    font-size: 14px;
    font-weight: 600;
    line-height: 1.71;
    letter-spacing: normal;
    color: #2196f3;
    margin-top: -13px;
    cursor: pointer;
  }
}
</style>
