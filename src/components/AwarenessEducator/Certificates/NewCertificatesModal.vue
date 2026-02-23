<template>
  <AppModal
    v-if="status"
    :status="status"
    :title="getModalTitle"
    icon-name="mdi-send"
    confirm-button-id="btn-save--certificates-template-modal"
    cancel-button-id="btn-cancel--certificates-template-modal"
    title-id="text--certificates-template-modal-title"
    :save-disable="saveDisable"
    @closeOverlay="handleClose"
    @submit="submit"
  >
    <template #overlay-body>
      <AppModalBodyHeader :title="getBodyTitle" :sub-title="getBodySubtitle" />
      <v-form ref="refForm" lazy-validation>
        <FormGroup has-hint :title="labels.CertificateName">
          <InputEntityName
            v-model.trim="formData.name"
            id="input--certificate-name"
            entity-name="certificate"
          />
        </FormGroup>
        <FormGroup
          :title="labels.Description"
          :sub-title="labels.DescriptionCertificateSub"
          has-hint
        >
          <InputDescription
            v-model.trim="formData.description"
            id="input--certificate-description"
            required
            :max-length="300"
          />
        </FormGroup>
        <MakeAvailableFor
          v-model="formData.availableForRequests"
          ref="refMakeAvailableFor"
          sub-title="Companies that will see this setting in their libraries"
        />
        <FormGroup :title="labels.CertificateTemplate"> </FormGroup>
        <DatatableLoading v-if="loading" :loading="loading" />
        <EmailTemplate
          v-else
          ref="refEmailTemplate"
          onlyGrapes="true"
          :is-edit="!!selectedItem"
          :activeBlockManagerComponents="activeBlockManagerComponents"
          :template.sync="formData.template"
          @handleEditHtmlTemplate="handleEditHtmlTemplate"
        />
      </v-form>
    </template>
  </AppModal>
</template>

<script>
import AppModal from '@/components/AppModal'
import labels from '@/model/constants/labels'
import AppModalBodyHeader from '@/components/SmallComponents/AppModalBodyHeader'
import FormGroup from '@/components/SmallComponents/FormGroup'
import InputEntityName from '@/components/Common/Inputs/InputEntityName'
import { EMITS } from '@/components/AwarenessEducator/utils'
import InputDescription from '@/components/Common/Inputs/InputDescription'
import MakeAvailableFor from '@/components/Common/MakeAvailableFor/MakeAvailableFor'
import EmailTemplate from '@/components/Company Settings/EmailTemplate'
import AwarenessEducatorService from '@/api/awarenessEducator'
import { scrollToComponent } from '@/utils/functions'
import companyLogo from '@/components/GrapesJs/Newsletter/mergedTexts/companyLogo'
import firstName from '@/components/GrapesJs/Newsletter/mergedTexts/firstName'
import lastName from '@/components/GrapesJs/Newsletter/mergedTexts/lastName'
import fullName from '@/components/GrapesJs/Newsletter/mergedTexts/fullName'
import email from '@/components/GrapesJs/Newsletter/mergedTexts/email'
import trainingName from '@/components/GrapesJs/Newsletter/mergedTexts/trainingName'
import trainingDescription from '@/components/GrapesJs/Newsletter/mergedTexts/trainingDescription'
import trainingCoverImageUrl from '@/components/GrapesJs/Newsletter/mergedTexts/trainingCoverImageUrl'
import fromEmail from '@/components/GrapesJs/Newsletter/mergedTexts/fromEmail'
import fromName from '@/components/GrapesJs/Newsletter/mergedTexts/fromName'
import subject from '@/components/GrapesJs/Newsletter/mergedTexts/subject'
import trainingCompleteDate from '@/components/GrapesJs/Newsletter/mergedTexts/trainingCompleteDate'
import dateEmailSent from '@/components/GrapesJs/Newsletter/mergedTexts/dateEmailSent'
import DatatableLoading from '@/components/SkeletonLoading/WidgetLoading'
export default {
  name: 'NewCertificatesModal',
  components: {
    DatatableLoading,
    EmailTemplate,
    MakeAvailableFor,
    InputDescription,
    InputEntityName,
    FormGroup,
    AppModalBodyHeader,
    AppModal
  },
  props: {
    status: {
      type: Boolean,
      default: false
    },
    selectedItem: {
      type: Object
    },
    isDuplicate: {
      type: Boolean
    }
  },
  data() {
    return {
      loading: false,
      labels,
      saveDisable: false,
      activeBlockManagerComponents: {
        '{COMPANYLOGO}': companyLogo,
        '{FIRSTNAME}': firstName,
        '{LASTNAME}': lastName,
        '{FULLNAME}': fullName,
        '{EMAIL}': email,
        '{TRAININGNAME}': trainingName,
        '{TRAININGDESCRIPTION}': trainingDescription,
        '{TRAININGCOVERIMAGEURL}': trainingCoverImageUrl,
        '{FROMEMAIL}': fromEmail,
        '{FROMNAME}': fromName,
        '{SUBJECT}': subject,
        '{TRAININGCOMPLETEDATE}': trainingCompleteDate,
        '{DATEEMAILSENT}': dateEmailSent
      },
      formData: {
        name: '',
        description: '',
        template: '',
        availableForRequests: []
      }
    }
  },
  computed: {
    getModalTitle() {
      return this.selectedItem ? this.getSelectedItemTitle : labels.CreateNewCertificate
    },
    getSelectedItemTitle() {
      return this.isDuplicate ? labels.DuplicateCertificate : labels.EditCertificate
    },
    getBodyTitle() {
      return labels.TrainingCertificateInformation
    },
    getBodySubtitle() {
      return this.selectedItem ? this.getSelectedItemSubTitle : labels.CreateNewCertificateSub
    },
    getSelectedItemSubTitle() {
      return this.isDuplicate ? labels.DuplicateCertificateSub : labels.EditCertificateSub
    }
  },
  created() {
    if (this.selectedItem) {
      this.callForData()
    } else {
      this.getDefaultCertificateTemplate()
    }
  },
  methods: {
    handleEditHtmlTemplate(template) {
      this.formData.template = template
    },
    getDefaultCertificateTemplate() {
      this.loading = true
      AwarenessEducatorService.getDefaultCertificateTemplate()
        .then((response) => {
          if (!this.selectedItem) {
            this.formData.template = response?.data?.data?.template || ''
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    callForData() {
      this.loading = true
      AwarenessEducatorService.getCertificate(this.selectedItem.id)
        .then((response) => {
          const { name = '', description = '', template = '', availableForList = [] } =
            response?.data?.data || {}
          this.formData.name = this.isDuplicate ? `${name} - Copy` : name
          this.formData.description = description
          this.formData.template = template
          this.setMakeAvailableForData(availableForList)
        })
        .finally(() => (this.loading = false))
    },
    setMakeAvailableForData(availableForList = []) {
      if (this?.$refs?.refMakeAvailableFor && availableForList?.length) {
        const availableForListFromBackend = this.$refs.refMakeAvailableFor.getAvailableForListFromBackend(
          availableForList
        )
        if (availableForListFromBackend.length) {
          this.formData.availableForRequests = availableForListFromBackend
        } else {
          this.formData.availableForRequests = [
            {
              id: 'MyCompanyOnly',
              label: 'My company only',
              type: 'MyCompanyOnly',
              resourceId: null
            }
          ]
        }
      } else {
        this.formData.availableForRequests = [
          {
            id: 'MyCompanyOnly',
            label: 'My company only',
            type: 'MyCompanyOnly',
            resourceId: null
          }
        ]
      }
    },
    handleClose() {
      this.$emit(EMITS.ON_CLOSE)
    },
    submit() {
      if (this.$refs.refForm.validate()) {
        this.saveDisable = true
        if (this.selectedItem && !this.isDuplicate) {
          AwarenessEducatorService.updateCertificate(this.formData, this.selectedItem.id)
            .then(() => {
              this.$emit(EMITS.ON_CLOSE, true)
            })
            .finally(() => {
              this.saveDisable = false
            })
        } else {
          AwarenessEducatorService.createCertificate(this.formData)
            .then(() => {
              this.$emit(EMITS.ON_CLOSE, true)
            })
            .finally(() => {
              this.saveDisable = false
            })
        }
      } else {
        this.$nextTick(() => {
          const el = this.$refs.refForm.$el.querySelector('.error--text')
          scrollToComponent(el)
        })
      }
    }
  }
}
</script>
