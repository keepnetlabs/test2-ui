<template>
  <app-modal
    :status="status"
    @closeOverlay="closeOverlay"
    class-name="custom-fields-overlay"
    icon-name="mdi-file-excel"
    title="Edit Fields - Target Users / People"
    ref="refAppModal"
  >
    <template v-slot:overlay-body>
      <app-dialog
        :status="isWantToDelete"
        icon="mdi-alert"
        title="Delete Custom Field"
        subtitle="Do you want to delete this custom field?"
        @changeStatus="isWantToDelete = false"
      >
        <template v-slot:app-dialog-body> This custom field status is will be changed ! </template>
        <template v-slot:app-dialog-footer>
          <div class="d-flex download-buttons flex-row flex-wrap justify-end">
            <v-btn class="users__button" text color="#f56c6c" @click="isWantToDelete = false"
              >CANCEL</v-btn
            >
            <v-btn class="users__button" text color="#2196f3" @click="deleteCustomField">
              {{ getAppDialogButtonText }}</v-btn
            >
          </div>
        </template>
      </app-dialog>
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
      <draggable v-bind="dragOptions" v-model="customFields" handle=".handle">
        <v-list-item :key="item.name" v-for="item in customFields">
          <v-list-item-content>
            <table-field
              isDeleteable
              :item="item"
              @deleteTableField="handleDeleteTableField(item)"
            />
          </v-list-item-content>
        </v-list-item>
      </draggable>
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
import AppDialog from '../AppDialog'
import TableField from './subcomponents/TableField'
import Draggable from 'vuedraggable'
import {
  getTargetUserCustomFieldsByCompanyId,
  updateTargetUserCustomField,
  createTargetUserCustomField
} from '../../api/targetUsers'
import { COMMON_CONSTANTS } from '../../model/constants/commonConstants'

export default {
  name: 'CustomFieldsModal',
  components: {
    AppModal,
    AppDialog,
    TableField,
    Draggable
  },
  props: {
    status: {
      type: Boolean
    }
  },
  computed: {
    getAppDialogButtonText() {
      return this.selectedItem && this.selectedItem.isActive ? 'Inactive' : 'Active'
    }
  },
  data() {
    return {
      customFields: [],
      selectedItem: null,
      isWantToDelete: false,
      dragOptions: {
        animation: 200,
        ghostClass: 'ghost'
      },
      copyOfCustomFields: []
    }
  },
  methods: {
    closeOverlay() {
      this.$emit('closeCustomFieldsModal')
    },
    handleAddCustomField() {
      this.customFields.push({
        name: '',
        fieldOwner: 'Company',
        fieldDataType: 'String',
        isActive: true,
        isNew: true
      })
    },
    deleteCustomField() {
      this.selectedItem.isActive = !this.selectedItem.isActive
      updateTargetUserCustomField({ ...this.selectedItem, fieldDataType: 'String' })
        .then((response) => {
          this.isWantToDelete = false
          this.selectedItem = null
          this.callForGetTargetUserCustomFieldsByCompanyId()
        })
        .catch((error) => {
          this.isWantToDelete = false
          this.selectedItem = null
        })
    },
    callForGetTargetUserCustomFieldsByCompanyId() {
      getTargetUserCustomFieldsByCompanyId()
        .then((response) => {
          const { data } = response
          this.customFields = data.data.filter((item) => {
            return item.isActive
          })
          this.copyOfCustomFields = JSON.parse(JSON.stringify(this.customFields))
        })
        .catch((error) => {})
    },
    submit() {
      if (this.$refs.refAppModal.$refs.refForm.validate()) {
        this.customFields.map((item) => {
          if (item.isNew) {
            createTargetUserCustomField(item)
              .then((response) => {
                this.callForGetTargetUserCustomFieldsByCompanyId()
              })
              .catch((error) => {})
          } else {
            const updatedField = this.copyOfCustomFields.find((copyField) => {
              return (
                copyField.resourceId === item.resourceId &&
                (item.name !== copyField.name || item.isActive !== copyField.isActive)
              )
            })

            if (updatedField) {
              updateTargetUserCustomField({ ...item, fieldDataType: 'String' })
                .then((response) => {
                  const message = response.data.message
                  this.$store.dispatch('common/createSnackBar', {
                    message,
                    color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR
                  })
                  this.callForGetTargetUserCustomFieldsByCompanyId()
                })
                .catch((error) => {})
            }
          }
        })
      }
    },
    handleDeleteTableField(item) {
      this.isWantToDelete = true
      this.selectedItem = JSON.parse(JSON.stringify(item))
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
.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
.ghost {
  opacity: 0;
}
</style>
