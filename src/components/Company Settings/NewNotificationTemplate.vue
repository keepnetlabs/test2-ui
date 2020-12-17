<template>
  <app-modal
    v-if="status"
    :status="status"
    @closeOverlay="closeOverlay"
    @submit="submit"
    :title="'New Notification Template'"
    icon-name="mdi-email"
    class-name="new-smtp-setting"
    :saveDisable="saveDisable"
  >
    <template v-slot:overlay-body>
      <app-modal-body-header
        title="Create New Notification Template"
        sub-title="Define notification template settings and create email template"
      />
      <v-form ref="refForm" lazy-validation>
        <form-group title="Template Name">
          <v-text-field
            v-bind="commonRules"
            v-model.trim="formValues.name"
            placeholder="Enter template name"
            outlined
            dense
          />
        </form-group>
        <form-group title="Category">
          <k-select
            v-bind="commonRules"
            v-model.trim="formValues.emailTemplateCategoryResourceId"
            :items="categoryItems"
            class="new-integration__select"
            dense
            outlined
            placeholder="Select Option"
          />
        </form-group>
        <form-group title="SMTP">
          <k-select
            v-bind="commonRules"
            v-model.trim="formValues.smtpSettingResourceId"
            :items="smtpItems"
            class="new-integration__select"
            dense
            outlined
            placeholder="Select Option"
          />
        </form-group>
        <make-available-for ref="refMakeAvailableFor" v-model="formValues.availableForRequests" />
        <form-group title="Email Template" class-name="email-template mt-2">
          <email-template
            ref="refEmailTemplate"
            :from-address.sync="formValues.fromAddress"
            :from-name.sync="formValues.fromName"
            :subject.sync="formValues.subject"
            :template.sync="formValues.template"
            @handleEditHtmlTemplate="formValues.template = $event"
          />
        </form-group>
      </v-form>
    </template>
  </app-modal>
</template>

<script>
import AppModal from '@/components/AppModal'
import AppModalBodyHeader from '@/components/SmallComponents/AppModalBodyHeader'
import FormGroup from '@/components/SmallComponents/FormGroup'
import { mail } from '@/utils/validations'
import EmailTemplate from '@/components/Company Settings/EmailTemplate'
import KSelect from '@/components/Common/Inputs/KSelect'
import {
  createEmailTemplate,
  getCategories,
  getEmailTemplate,
  updateEmailTemplate
} from '@/api/company'
import { searchSmtpSettings } from '@/api/smtpSettings'
import MakeAvailableFor from '@/components/Common/MakeAvailableFor/MakeAvailableFor'
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'
import * as Validations from '@/utils/validations'
import labels from '@/model/constants/labels'
import { scrollToComponent } from '@/utils/functions'
export default {
  name: 'NewNotificationTemplate',
  components: {
    MakeAvailableFor,
    KSelect,
    EmailTemplate,
    AppModal,
    AppModalBodyHeader,
    FormGroup
  },
  props: {
    status: {
      type: Boolean,
      default: false
    },
    id: {
      type: String
    }
  },
  data() {
    return {
      labels,
      saveDisable: false,
      Validations: Validations,
      commonRules: {
        hint: '*Required',
        persistentHint: true,
        rules: [
          (v) => Validations.required(v, labels.Required),
          (v) => Validations.startsWithSpace(v),
          (v) => Validations.maxLength(v, 64, labels.getMaxLengthMessage(labels.TemplateName))
        ]
      },
      formValues: {
        availableForRequests: [],
        name: '',
        emailTemplateCategoryResourceId: '',
        smtpSettingResourceId: '',
        fromAddress: '',
        fromName: '',
        subject: '',
        template: null
      },
      categoryItems: [],
      smtpItems: [],
      validations: {
        mail
      },
      smtpAxiosPayload: {
        pageNumber: 1,
        pageSize: 5000,
        orderBy: 'CreateTime',
        ascending: false,
        filter: {
          Condition: 'AND',
          FilterGroups: [
            {
              Condition: 'AND',
              FilterItems: [],
              FilterGroups: []
            }
          ]
        }
      }
    }
  },
  created() {
    this.callForDatas()
    getEmailTemplate(this.id).then((response) => {
      const {
        data: { data }
      } = response
      for (let [key, value] of Object.entries(data)) {
        if (key === 'availableForList') {
          this.formValues[
            'availableForRequests'
          ] = this.$refs.refMakeAvailableFor.getAvailableForListFromBackend(value)
          continue
        }
        this.formValues[key] = value
      }
    })
  },
  mounted() {
    this.$nextTick(() => {
      this.formValues.template = this.$refs.refEmailTemplate.$refs.refPreview.outerHTML
    })
  },
  methods: {
    callForDatas() {
      Promise.all([this.callForCategories(), this.callForSmtpSettings()]).then((response) => {
        const [categories, smtpSettings] = response
        const {
          data: { data: categoriesData }
        } = categories
        const { data: { data: smtpSettingsData = {} } = {} } = smtpSettings
        this.categoryItems = categoriesData.map((category) => {
          return { text: category.name, value: category.resourceId }
        })
        this.smtpItems = smtpSettingsData.results.map((smtpItem) => {
          return { text: smtpItem.name, value: smtpItem.resourceId }
        })
      })
    },
    callForCategories() {
      return getCategories()
    },
    callForSmtpSettings() {
      return searchSmtpSettings(this.smtpAxiosPayload)
    },
    closeOverlay() {
      this.$emit('closeOverlay')
    },
    submit() {
      const { refForm, refMakeAvailableFor } = this.$refs
      refMakeAvailableFor.validateAvailableFor(this.formValues.availableForRequests)
      if (refForm.validate() && refMakeAvailableFor.isAvailableForValid) {
        this.saveDisable = true
        const payload = {
          ...this.formValues,
          availableForRequests: this.formValues.availableForRequests.map((item) => {
            let { resourceId, type, id } = item
            return {
              resourceId: resourceId ? resourceId : id,
              type
            }
          })
        }
        if (this.id) {
          updateEmailTemplate(this.id, payload)
            .then((response) => {
              this.$store.dispatch('common/createSnackBar', {
                message: response.data.message,
                color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
                icon: 'mdi-check-circle'
              })
              this.$emit('closeOverlayWithUpdate')
            })
            .finally(() => (this.saveDisable = false))
        } else {
          createEmailTemplate(payload)
            .then((response) => {
              this.$store.dispatch('common/createSnackBar', {
                message: response.data.message,
                color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
                icon: 'mdi-check-circle'
              })
              this.$emit('closeOverlayWithUpdate')
            })
            .finally(() => {
              this.saveDisable = false
            })
        }
      } else {
        const el = refForm.$el.querySelector('.error--text')
        scrollToComponent(el)
      }
    }
  }
}
</script>

<style></style>
