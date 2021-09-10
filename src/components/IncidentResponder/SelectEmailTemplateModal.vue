<template>
  <AppDialog
    maxHeight
    size="ultraMaximum"
    customSize="1200"
    title-id="text--incident-responder-select-email-template-popup-title"
    subtitle-id="text--incident-responder-select-email-template-popup-subtitle"
    maxHeightSize="665"
    :status="status"
    :title="labels.SelectEmailTemplateTitle"
    @changeStatus="handleChangeStatus"
  >
    <template #app-dialog-body>
      <KListPreview
        v-model="previewModel"
        :options="emailTemplates"
        :item-preview-func="getEmailTemplate"
      />
    </template>
    <template #app-dialog-footer>
      <div class="d-flex flex-end" style="justify-content: flex-end;">
        <v-btn
          id="btn-cancel-select-emails-popup"
          class="k-dialog__button"
          text
          color="#F56C6C"
          @click="handleChangeStatus"
          >CANCEL
        </v-btn>
        <v-btn
          id="btn-cancel-select-emails--popup"
          class="k-dialog__button ml-4"
          text
          color="#2196F3"
          @click="handleConfirm"
          >CONFIRM
        </v-btn>
      </div>
    </template>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import labels from '@/model/constants/labels'
import KListPreview from '@/components/IncidentResponder/KListPreview'
import { getEmailTemplate } from '@/api/company'
export default {
  name: 'SelectEmailTemplateModal',
  components: { KListPreview, AppDialog },
  props: {
    status: {
      type: Boolean
    },
    emailTemplates: {
      type: Array
    },
    templateTypes: {
      type: Array
    },
    selectedTemplate: {
      type: String
    }
  },
  data() {
    return {
      labels,
      previewModel: this.selectedTemplate,
      getEmailTemplate,
      axiosPayload: {
        pageNumber: 1,
        pageSize: 10,
        orderBy: 'CreateTime',
        ascending: false,
        filter: {
          Condition: 'AND',
          FilterGroups: [
            {
              Condition: 'AND',
              FilterItems: [
                { Value: 'WMnpwDBjAFN9', FieldName: 'TypeResourceId', Operator: 'Include' }
              ],
              FilterGroups: []
            },
            { Condition: 'OR', FilterItems: [], FilterGroups: [] }
          ]
        }
      }
    }
  },
  methods: {
    handleChangeStatus() {
      this.$emit('on-close')
    },
    handleConfirm() {
      this.$emit('on-confirm', this.previewModel)
    }
  }
}
</script>
