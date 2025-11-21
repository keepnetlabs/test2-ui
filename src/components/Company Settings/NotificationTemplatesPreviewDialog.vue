<template>
  <AppDialog
    custom-size="1600"
    max-height
    max-height-size="900"
    icon="mdi-eye"
    :status="status"
    :title="getTitle"
    :subtitle="getSubtitle"
    @changeStatus="handleClose"
  >
    <template #app-dialog-body>
      <DatatableLoading v-if="isLoading" :loading="isLoading" />
      <div v-if="!isLoading && selectedLanguages.length > 0" class="mb-4">
        <InputLanguagePreview
          :value="activeLanguage"
          :items="selectedLanguages"
          :label="languageLabel"
          style="max-width: 300px;"
          @input="handleLanguageChange"
        />
      </div>
      <KEmailPreview v-if="!!emailTemplate" ref="refPreview" :html="emailTemplate" />
    </template>
    <template #app-dialog-footer>
      <div class="d-flex" style="justify-content: flex-end;">
        <v-btn
          id="btn--close-campaign-manager-preview-popup"
          class="pa-0 k-dialog__button"
          text
          color="#2196f3"
          @click="handleClose"
          >CLOSE
        </v-btn>
      </div>
    </template>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import DatatableLoading from '@/components/SkeletonLoading/WidgetLoading'
import { getEmailTemplate } from '@/api/company'
import KEmailPreview from '@/components/KEmailPreview'
import InputLanguagePreview from '@/components/Common/Inputs/InputLanguagePreview.vue'
export default {
  name: 'NotificationTemplatesPreviewDialog',
  components: { InputLanguagePreview, KEmailPreview, DatatableLoading, AppDialog },
  props: {
    status: {
      type: Boolean
    },
    selectedRow: {
      type: Object
    }
  },
  data() {
    return {
      isLoading: false,
      emailTemplate: null,
      selectedLanguages: [],
      activeLanguage: '',
      languagesData: []
    }
  },
  computed: {
    getTitle() {
      return 'Notification Template Preview'
    },
    getSubtitle() {
      return this.selectedRow?.name || ''
    },
    languageLabel() {
      return `Template Language (${this.selectedLanguages.length})`
    }
  },
  created() {
    this.callForData()
  },
  methods: {
    callForData() {
      this.isLoading = true
      getEmailTemplate(this.selectedRow.resourceId)
        .then((response) => {
          const data = response?.data?.data || {}
          const companyLogoUrl = this?.$store?.state?.whitelabel.emailTemplateLogoUrl || ''

          // Ana dil template'ini set et
          const mainTemplate = data.template?.replace(/{COMPANYLOGO}/g, companyLogoUrl) || ''

          // Languages data array'ini oluştur (ana dil + ek diller)
          this.languagesData = [
            {
              languageTypeResourceId: data.languageTypeResourceId,
              languageTypeName: data.languageTypeName || '',
              template: mainTemplate
            }
          ]

          // Ek dilleri ekle (varsa)
          if (data.languages && data.languages.length > 0) {
            data.languages.forEach((lang) => {
              this.languagesData.push({
                languageTypeResourceId: lang.languageTypeResourceId,
                languageTypeName: lang.languageTypeName || '',
                template: lang.template?.replace(/{COMPANYLOGO}/g, companyLogoUrl) || ''
              })
            })
          }

          // selectedLanguages array'ini oluştur
          this.selectedLanguages = this.languagesData.map((lang) => ({
            text: lang.languageTypeName,
            value: lang.languageTypeResourceId
          }))

          // İlk dili aktif yap
          this.activeLanguage = data.languageTypeResourceId
          this.emailTemplate = mainTemplate
        })
        .finally(() => (this.isLoading = false))
    },
    handleLanguageChange(languageResourceId) {
      this.activeLanguage = languageResourceId
      const selectedLang = this.languagesData.find(
        (lang) => lang.languageTypeResourceId === languageResourceId
      )
      if (selectedLang) {
        this.emailTemplate = selectedLang.template
      }
    },
    handleClose() {
      this.$emit('on-close')
    }
  }
}
</script>
