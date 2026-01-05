<template>
  <div v-if="isVisible">
    <div
      class="notification-templates-preview-overlay"
      :class="{ 'nested-overlay': isNested }"
      @click="handleOverlayClick"
    ></div>
    <VNavigationDrawer
      :value="isVisible"
      :class="getNavigationDrawerClass"
      :data-drawer-id="drawerId"
      fixed
      :overlay-color="null"
      right
      stateless
      width="calc(100% - 72px)"
      height="100%"
    >
      <div class="campaign-manager-scenario-statistics-modal__header--sticky">
        <div class="campaign-manager-scenario-statistics-modal__header k-navigation-drawer__header">
          <div>
            <VListItem>
              <VListItemContent>
                <VListItemTitle class="k-overlay__title">
                  {{ getTitle }}
                </VListItemTitle>
              </VListItemContent>
            </VListItem>
          </div>
          <div>
            <VIcon class="cursor-pointer" color="#757575" @click="handleClose">
              mdi-close
            </VIcon>
          </div>
        </div>
      </div>
      <div class="campaign-manager-scenario-statistics-modal__body k-navigation-drawer__body">
        <DatatableLoading v-if="isLoading" :loading="isLoading" />
        <div v-if="!isLoading" class="email-template-preview">
          <div class="email-template-preview__title mb-4">
            {{ selectedRow?.name }}
          </div>
          <div class="email-template-preview__container">
            <div
              v-if="!isLoading && selectedLanguages.length > 0"
              class="d-flex align-center justify-space-between mb-4"
            >
              <InputLanguagePreview
                hide-details
                :value="activeLanguage"
                :items="selectedLanguages"
                :label="languageLabel"
                style="max-width: 300px;"
                @input="handleLanguageChange"
              />
              <div class="notification-email-template-preview__actions d-flex align-center gap-2">
                <VTooltip v-if="showEditButton" bottom>
                  <template #activator="{ on }">
                    <div
                      v-on="on"
                      :class="{
                        'notification-edit-button--disabled': isEditDisabled
                      }"
                    >
                      <VBtn icon outlined color="#2196F3" small @click="handleEdit">
                        <VIcon small>mdi-pencil</VIcon>
                      </VBtn>
                    </div>
                  </template>
                  <span v-if="!isEditDisabled">Edit Template</span>
                </VTooltip>
                <VTooltip bottom>
                  <template #activator="{ on }">
                    <div v-on="on">
                      <VBtn icon outlined color="#2196F3" small @click="handleExternalLink">
                        <VIcon small>mdi-open-in-new</VIcon>
                      </VBtn>
                    </div>
                  </template>
                  <span>Open in New Tab</span>
                </VTooltip>
              </div>
            </div>
            <hr class="mt-4 ml-n4 mr-n4" v-if="!!emailTemplate" />
            <div v-if="!!emailTemplate" class="email-template-preview__text mt-4">
              <div>
                <span class="email-template-preview__text--title">Subject: </span>
                <span class="email-template-preview__text--body">{{ subject }}</span>
              </div>
              <div v-if="fromName" style="margin-top: 2px;">
                <span class="email-template-preview__text--title">From Name: </span>
                <span class="email-template-preview__text--body">{{ fromName }}</span>
              </div>
              <div v-if="fromAddress" style="margin-top: 2px;">
                <span class="email-template-preview__text--title">From Email: </span>
                <span class="email-template-preview__text--body">{{ fromAddress }}</span>
              </div>
              <div v-if="ccAddresses && ccAddresses.length > 0" style="margin-top: 2px;">
                <span class="email-template-preview__text--title">CC: </span>
                <span class="email-template-preview__text--body">{{ ccAddresses.join(', ') }}</span>
              </div>
            </div>
            <hr class="mt-4 ml-n4 mr-n4" v-if="!!emailTemplate" />
            <div class="mt-2">
              <KEmailPreview v-if="!!emailTemplate" ref="refPreview" :html="emailTemplate" />
            </div>
          </div>
        </div>
      </div>
    </VNavigationDrawer>
  </div>
</template>

<script>
import DatatableLoading from '@/components/SkeletonLoading/WidgetLoading'
import { getEmailTemplate } from '@/api/company'
import KEmailPreview from '@/components/KEmailPreview'
import InputLanguagePreview from '@/components/Common/Inputs/InputLanguagePreview.vue'
import useDrawerAnimation from '@/hooks/useDrawerAnimation'
import { openHtmlInNewWindow } from '@/utils/functions'
export default {
  name: 'NotificationTemplatesPreviewDialog',
  components: { InputLanguagePreview, KEmailPreview, DatatableLoading },
  mixins: [useDrawerAnimation],
  props: {
    status: {
      type: Boolean
    },
    selectedRow: {
      type: Object
    },
    templateData: {
      type: Object,
      default: null
    },
    isNested: {
      type: Boolean,
      default: false
    },
    showEditButton: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isLoading: false,
      emailTemplate: null,
      selectedLanguages: [],
      activeLanguage: '',
      languagesData: [],
      fromName: '',
      fromAddress: '',
      ccAddresses: [],
      subject: ''
    }
  },
  computed: {
    getNavigationDrawerClass() {
      return {
        'k-navigation-drawer k-navigation-drawer--email-template-preview': true,
        'nested-drawer': this.isNested
      }
    },
    getTitle() {
      return 'Notification Template Preview'
    },
    getSubtitle() {
      return this.selectedRow?.name || ''
    },
    languageLabel() {
      return `Template Language${this.selectedLanguages.length > 1 ? 's' : ''} (${
        this.selectedLanguages.length
      })`
    },
    isEditDisabled() {
      return !this.selectedRow?.isOwner
    }
  },
  created() {
    if (this.templateData) {
      this.setupFromTemplateData(this.templateData)
    } else if (this.selectedRow?.resourceId) {
      this.callForData()
    }
  },
  watch: {
    status(val) {
      if (!this.isNested) {
        if (val) {
          document.documentElement.style.overflow = 'hidden'
        } else {
          document.documentElement.style.overflow = ''
        }
      }
    },
    templateData(newVal) {
      if (newVal && Object.keys(newVal).length > 0) {
        this.setupFromTemplateData(newVal)
      }
    }
  },
  methods: {
    setupFromTemplateData(data) {
      const companyLogoUrl = this?.$store?.state?.whitelabel.emailTemplateLogoUrl || ''

      // Ana dil template'ini set et
      const mainTemplate = data.template?.replace(/{COMPANYLOGO}/g, companyLogoUrl) || ''

      // Metadata alanlarını set et
      this.subject = data.subject || ''
      this.fromName = data.fromName || ''
      this.fromAddress = data.fromAddress || ''
      this.ccAddresses = data.ccAddresses || []

      // Languages data array'ini oluştur (ana dil + ek diller)
      this.languagesData = []

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
      this.activeLanguage = data.selectedLanguageResourceId
      this.emailTemplate = mainTemplate
    },
    callForData() {
      this.isLoading = true
      getEmailTemplate(this.selectedRow.resourceId)
        .then((response) => {
          const data = response?.data?.data || {}
          const companyLogoUrl = this?.$store?.state?.whitelabel.emailTemplateLogoUrl || ''

          // Ana dil template'ini set et
          const mainTemplate = data.template?.replace(/{COMPANYLOGO}/g, companyLogoUrl) || ''

          // Metadata alanlarını set et
          this.subject = data.subject || ''
          this.fromName = data.fromName || ''
          this.fromAddress = data.fromAddress || ''
          this.ccAddresses = data.ccAddresses || []

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
    handleOverlayClick() {
      this.closeDrawer()
    },
    handleClose() {
      // Don't clear selectedRow here to avoid losing data when edit button is clicked
      this.closeDrawer()
    },
    handleExternalLink() {
      openHtmlInNewWindow(this.emailTemplate)
    },
    handleEdit() {
      this.$emit('on-edit')
    }
  }
}
</script>

<style scoped lang="scss">
.notification-templates-preview-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.17);
  z-index: 1002 !important;

  &.nested-overlay {
    z-index: 1113 !important;
    background-color: transparent;
  }
}

.k-navigation-drawer.k-navigation-drawer--email-template-preview {
  transition: right 0.25s ease-in-out;
  z-index: 1003 !important;

  &.nested-drawer {
    z-index: 1114 !important;
  }
}

.notification-email-template-preview__actions {
  gap: 0.5rem;
}

.notification-edit-button--disabled {
  opacity: 0.5;
  pointer-events: none;
}

.email-template-preview {
  &__title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #212121;
    padding: 0 1rem;
    word-break: break-word;
  }

  &__container {
    padding: 0;
  }

  &__text {
    &--title {
      font-weight: 600;
      color: #424242;
    }

    &--body {
      color: #757575;
      word-break: break-word;
    }
  }
}
</style>
