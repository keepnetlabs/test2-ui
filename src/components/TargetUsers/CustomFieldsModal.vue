<template>
  <app-modal
    :status="status"
    @closeOverlay="closeOverlay"
    class-name="custom-fields-overlay"
    icon-name="mdi-file-excel"
    title="Edit Fields - Target Users / People"
    ref="refAppModal"
    z-index="999"
  >
    <template v-slot:overlay-body>
      <app-dialog
        :status="isWantToDelete"
        icon="mdi-alert"
        title="Delete Custom Field"
        subtitle="Do you want to delete this custom field?"
        @changeStatus="isWantToDelete = false"
      >
        <template v-slot:app-dialog-body> This custom field will be deleted ! </template>
        <template v-slot:app-dialog-footer>
          <div class="d-flex download-buttons flex-row flex-wrap justify-end">
            <v-btn class="users__button" text color="#f56c6c" @click="isWantToDelete = false"
              >CANCEL</v-btn
            >
            <v-btn class="users__button" text color="#2196f3" @click="deleteCustomField">
              DELETE</v-btn
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
      <ExtendedViewLoading
        size="big"
        class="custom-fields-overlay__loader"
        v-if="loading"
        :loading="loading"
      />
      <template v-else>
        <v-list-item-title class="k-form-group__title mb-2">Active Custom fields</v-list-item-title>
        <draggable
          v-bind="dragOptions"
          group="a"
          :list="customFields"
          handle=".handle"
          @change="handleChangeOfList"
        >
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
        <v-list-item-title class="k-form-group__title mb-2"
          >Unactive Custom fields</v-list-item-title
        >
        <draggable
          @change="handleChangeOfList"
          v-bind="dragOptions"
          group="a"
          :list="unActiveCustomFields"
          handle=".handle"
        >
          <v-list-item :key="item.name" v-for="item in unActiveCustomFields">
            <v-list-item-content>
              <table-field
                isDeleteable
                :item="item"
                @deleteTableField="handleDeleteTableField(item)"
              />
            </v-list-item-content>
          </v-list-item>
        </draggable>
      </template>
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
  createTargetUserCustomField,
  bulkUpdateOfCustomFields
} from '@/api/targetUsers'
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'
import ExtendedViewLoading from '@/components/SkeletonLoading/ExtendedViewLoading'

export default {
  name: 'CustomFieldsModal',
  components: {
    ExtendedViewLoading,
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
      return this.selectedItem && this.selectedItem.isActive ? 'Delete' : 'Active'
    }
  },
  data() {
    return {
      customFields: [],
      selectedItem: null,
      loading: true,
      isWantToDelete: false,
      dragOptions: {
        animation: 200,
        ghostClass: 'ghost'
      },
      unActiveCustomFields: [],
      copyOfCustomFields: [],
      isMakePost: false
    }
  },
  methods: {
    closeOverlay() {
      if (this.isMakePost) {
        this.$emit('closeCustomFieldsModalWithUpdate')
      } else {
        this.$emit('closeCustomFieldsModal')
      }
    },
    handleAddCustomField() {
      this.customFields.push({
        name: '',
        fieldOwner: 'Company',
        fieldDataType: 'String',
        isActive: true,
        isNew: true,
        sortOrder: this.customFields.length + 10
      })
    },
    handleChangeOfList(element = {}) {
      if (element && element.added) {
        const {
          added: { element: newElement }
        } = element
        newElement.isActive = !newElement.isActive
      }
    },
    deleteCustomField() {
      this.findCustomFieldAndDelete()
      this.isWantToDelete = false
    },
    findCustomFieldAndDelete() {
      let index = this.customFields.findIndex(
        (item) => JSON.stringify(item) === JSON.stringify(this.selectedItem)
      )
      if (index > -1) {
        this.customFields.splice(index, 1)
      } else {
        index = this.unActiveCustomFields.findIndex(
          (item) => JSON.stringify(item) === JSON.stringify(this.selectedItem)
        )
        if (index > -1) {
          this.unActiveCustomFields.splice(index, 1)
        }
      }
    },
    callForGetTargetUserCustomFieldsByCompanyId() {
      this.loading = true
      getTargetUserCustomFieldsByCompanyId()
        .then((response) => {
          const { data } = response
          this.customFields = data.data.filter((item) => {
            return item.isActive
          })
          this.unActiveCustomFields = data.data.filter((item) => {
            return !item.isActive
          })
          this.sortCustomFields(this.customFields)
          this.sortCustomFields(this.unActiveCustomFields)
          this.copyOfCustomFields = JSON.parse(JSON.stringify(this.customFields))
        })
        .finally(() => (this.loading = false))
    },
    sortCustomFields(data = []) {
      const sortProp = 'sortOrder'
      data.sort((a, b) => {
        if (a[sortProp] > b[sortProp]) {
          return 1
        } else if (a[sortProp] === b[sortProp]) {
          return 0
        }
        return -1
      })
    },
    addSortPropToCustomFields(data = []) {
      const sortProp = 'sortOrder'
      data = data.reduce((acc, item) => {
        item[sortProp] = acc
        return ++acc
      }, 0)
    },
    submit() {
      if (this.$refs.refAppModal.$refs.refForm.validate()) {
        this.addSortPropToCustomFields(this.customFields)
        this.addSortPropToCustomFields(this.unActiveCustomFields)
        const createdFields = []
        const updatedFields = []
        const allFields = [...this.customFields, ...this.unActiveCustomFields]
        for (let field of allFields) {
          if (field.isNew) {
            createdFields.push(field)
          } else {
            updatedFields.push(field)
          }
        }
        if (createdFields.length) {
          const promises = []
          for (let newItem of createdFields) {
            promises.push(createTargetUserCustomField(newItem))
          }
          Promise.all(promises).then((responses) => {
            responses.forEach((response, index) => {
              const { resourceId } = response.data.data
              createdFields[index]['resourceId'] = resourceId
              updatedFields.push(createdFields[index])
            })
            this.isMakePost = true
            this.$store.dispatch('common/createSnackBar', {
              message: 'Custom field(s) has been created',
              color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
              icon: 'mdi-check-circle'
            })
            this.callForUpdateCustomFields(updatedFields)
          })
        } else if (updatedFields.length) {
          this.callForUpdateCustomFields(updatedFields)
        }
      }
    },
    callForUpdateCustomFields(updatedFields) {
      const payload = {
        targetUserCustomFields: updatedFields
      }
      bulkUpdateOfCustomFields(payload).then(() => {
        this.isMakePost = true
        this.$store.dispatch('common/createSnackBar', {
          message: 'Custom fields has been updated',
          color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
          icon: 'mdi-check-circle'
        })
        this.callForGetTargetUserCustomFieldsByCompanyId()
      })
    },
    handleDeleteTableField(item) {
      this.isWantToDelete = true
      this.selectedItem = JSON.parse(JSON.stringify(item))
    }
  },
  created() {
    this.callForGetTargetUserCustomFieldsByCompanyId()
  },
  watch: {
    customFields(newVal, oldVal) {}
  }
}
</script>

<style lang="scss">
.custom-fields-overlay {
  &__loader {
    max-width: 600px;
  }
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
