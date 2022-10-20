<template>
  <div>
    <app-dialog
      type="delete"
      icon="mdi-delete"
      title="Delete domain?"
      subtitle="Domain will deleted permanently"
      title-id="text--domain-delete-popup-title"
      subtitle-id="text--domain-delete-popup-subtitle"
      :status="status"
      @changeStatus="closeModal"
    >
      <template v-slot:app-dialog-body>
        <div class="domain-delete-text-container">
          <div class="delete-title">Do you want to delete this domain?</div>
          <v-card class="d-flex mt-4" flat>
            <v-card class="confirm-label align-self-auto py-2" flat>
              Type “DELETE” to confirm
            </v-card>
            <v-card class="pl-4 confirm-input" flat>
              <v-text-field
                outlined
                placeholder="DELETE"
                @keyup="uppercase"
                v-model="confirmText"
                type="text"
                class="p-0"
              />
            </v-card>
          </v-card>
        </div>
      </template>
      <template v-slot:app-dialog-footer>
        <app-dialog-footer
          cancel-button-id="btn-cancel--delete-domain-popup"
          confirm-button-id="btn-delete--delete-domain-popup"
          type="delete"
          @handleClose="closeModal"
          @handleConfirm="handleDelete"
          :confirmButtonDisabled="buttonDisableStatus"
        />
      </template>
    </app-dialog>
  </div>
</template>

<script>
import AppDialog from '../../AppDialog'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'
import { deleteAllowListItems } from '@/api/allowList'
export default {
  name: 'DeleteDomain',
  components: {
    AppDialog,
    AppDialogFooter
  },
  props: {
    status: {
      type: Boolean
    },
    selectedItems: {
      type: Array
    }
  },
  data() {
    return {
      confirmText: '',
      buttonDisableStatus: true
    }
  },
  methods: {
    uppercase() {
      this.confirmText = this.confirmText.toUpperCase()
    },
    closeModal() {
      this.$emit('handleCloseModal')
      this.confirmText = ''
    },
    handleDelete() {
      const ids = { resourceIds: [] }
      this.selectedItems.forEach((item) => {
        ids.resourceIds.push(item.allowListResourceId)
      })
      deleteAllowListItems(ids).then(() => {
        this.$emit('handleSuccessDeleteAction')
      })
      this.closeModal()
    }
  },
  watch: {
    confirmText(val) {
      if (val === 'DELETE') {
        this.buttonDisableStatus = false
      } else {
        this.buttonDisableStatus = true
      }
    }
  }
}
</script>

<style lang="scss">
.domain-delete-text-container {
  color: #383b41;
  font-weight: 400;
  .delete-title {
    font-size: 13px;
    line-height: 18px;
  }
  .confirm-label {
    font-size: 14px;
    line-height: 21px;
    width: 40%;
  }
  .confirm-input {
    width: 62%;
    .v-text-field .v-input__control {
      height: 0 !important;
      min-height: 0 !important;
    }
  }
}
</style>
