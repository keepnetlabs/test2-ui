<template>
  <div v-if="isVisible">
    <div
      class="landing-page-preview-overlay"
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
      :width="drawerWidth"
      height="100%"
    >
      <div class="campaign-manager-scenario-statistics-modal__header--sticky">
        <div class="campaign-manager-scenario-statistics-modal__header k-navigation-drawer__header">
          <div>
            <VListItem>
              <VListItemContent>
                <VListItemTitle class="k-overlay__title">
                  Landing Page Template Preview
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
        <LandingPagePreviewSkeleton v-if="isLoading" />
        <LandingPageTemplateModalPreview
          v-show="!isLoading"
          :type="type"
          :template-name="landingPageParams.name"
          :landing-page-templates="landingPageTemplates"
          :languages="landingPageParams.languages || []"
          :phishing-url="landingPageParams.urlTemplate"
          :is-nested="isNested"
          :is-quishing-prop="isQuishing"
          :disable-edit="disableEdit"
          :is-assisted-by-a-i="landingPageParams.isAssistedByAI"
          @edit="handleEdit"
        />
      </div>
    </VNavigationDrawer>
  </div>
</template>

<script>
import LandingPagePreviewSkeleton from '@/components/SkeletonLoading/LandingPagePreviewSkeleton'
import LandingPageTemplateModalPreview from '@/components/LandingPage/LandingPageTemplateModalPreview'
import { useLoading } from '@/hooks/useLoading'
import useDrawerAnimation from '@/hooks/useDrawerAnimation'
import { PREVIEW_DIALOG_TYPES } from '@/components/Common/Simulator/utils'
import { getLandingPageTemplate } from '@/api/landingPage'
import useHtmlOverflowControl from '@/hooks/useHtmlOverflowControl'
export default {
  name: 'CommonSimulatorLandingPageTemplatesPreviewDialog',
  components: {
    LandingPageTemplateModalPreview,
    LandingPagePreviewSkeleton
  },
  mixins: [useLoading, useDrawerAnimation, useHtmlOverflowControl],
  props: {
    status: {
      type: Boolean,
      default: false
    },
    selectedRow: {
      type: Object,
      default: () => ({})
    },
    type: {
      type: String,
      default: PREVIEW_DIALOG_TYPES.PHISHING
    },
    apiFunc: {
      type: Function,
      default: getLandingPageTemplate
    },
    isNested: {
      type: Boolean,
      default: false
    },
    languages: {
      type: Array,
      default: () => []
    },
    drawerWidth: {
      type: String,
      default: 'calc(100% - 72px)'
    },
    isQuishing: {
      type: Boolean,
      default: false
    },
    disableEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      landingPageTemplates: null,
      landingPageParams: {
        languages: []
      }
    }
  },
  computed: {
    getNavigationDrawerClass() {
      return {
        'k-navigation-drawer k-navigation-drawer--landing-page-preview': true,
        'nested-drawer': this.isNested
      }
    }
  },
  created() {
    this.callForData()
  },
  methods: {
    handleOverlayClick(event) {
      event.stopPropagation()
      event.preventDefault()
      this.closeDrawer()
    },
    handleClose() {
      this.closeDrawer()
    },
    callForData() {
      this.setLoading(true)
      this.apiFunc(this.selectedRow.resourceId)
        .then((response) => {
          const data = response.data.data
          this.landingPageParams.urlTemplate = data.urlTemplate
          this.landingPageParams.name = data.name
          this.landingPageParams.isAssistedByAI = data.isAssistedByAI || false
          if (this.type.toLowerCase() === PREVIEW_DIALOG_TYPES.PHISHING.toLowerCase()) {
            // Tüm dilleri topla (ana dil + diğer diller)
            const allLanguagesMap = new Map()
            // Ana dili ekle
            if (data.languageTypeResourceId) {
              const mainLanguageObj = this.languages.find(
                (lang) => lang.value === data.languageTypeResourceId
              )
              if (mainLanguageObj) {
                allLanguagesMap.set(data.languageTypeResourceId, {
                  text: mainLanguageObj.text || mainLanguageObj.name,
                  value: data.languageTypeResourceId,
                  languageTypeName: data.languageTypeName || mainLanguageObj.text
                })
              }
            }

            // Her landingPage için languages array'inden diğer dilleri ekle
            if (Array.isArray(data.landingPages)) {
              data.landingPages.forEach((page) => {
                if (Array.isArray(page.languages)) {
                  page.languages.forEach((langPage) => {
                    if (!allLanguagesMap.has(langPage.languageTypeResourceId)) {
                      const langObj = this.languages.find(
                        (lang) => lang.value === langPage.languageTypeResourceId
                      )
                      allLanguagesMap.set(langPage.languageTypeResourceId, {
                        text:
                          langObj?.text ||
                          langPage.languageTypeName ||
                          langPage.languageTypeResourceId,
                        value: langPage.languageTypeResourceId,
                        languageTypeName: langPage.languageTypeName
                      })
                    }
                  })
                }
              })
            }

            this.landingPageParams.languages = Array.from(allLanguagesMap.values())

            // landingPages'i dönüştür - her sayfa için tüm dilleri içeren yapı
            this.landingPageTemplates = (data.landingPages || []).map((page) => {
              const transformedPage = {
                name: page.name,
                order: page.order,
                prompt: page.prompt,
                content: page.content, // Ana dilin content'i
                languageTypeResourceId: data.languageTypeResourceId, // Ana dil
                languages: {} // Her dil için content saklanacak
              }

              // Ana dilin content'ini languages objesine ekle
              transformedPage.languages[data.languageTypeResourceId] = page.content

              // Diğer dillerin content'lerini ekle
              if (Array.isArray(page.languages)) {
                page.languages.forEach((langPage) => {
                  transformedPage.languages[langPage.languageTypeResourceId] = langPage.content
                })
              }

              return transformedPage
            })
          } else {
            // Diğer durumlar için eski mantık
            this.landingPageParams.languages =
              this.languages.filter((lang) => {
                return lang.value === data.languageTypeResourceId
              }) || []

            this.landingPageTemplates = data.landingPages
          }

          this.selectedTemplateHeader = data.name
          this.templateHTML = this.landingPageTemplates?.length
            ? this.landingPageTemplates[0]?.content || null
            : null
        })
        .finally(() => {
          this.timeoutId = setTimeout(() => {
            this.setLoading()
          }, 500)
        })
    },
    handleEdit() {
      this.isHtmlOverflowControlManuallyDisabled = true
      this.$emit('on-edit', this.selectedRow)
    }
  }
}
</script>
