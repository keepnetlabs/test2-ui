<template>
  <VNavigationDrawer
    v-click-outside="handleClickOutside"
    v-if="status"
    :value="drawerModel"
    class="k-navigation-drawer k-navigation-drawer--landing-page-preview"
    temporary
    fixed
    stateless
    :hide-overlay="isNested"
    :overlay-color="!isNested ? 'rgba(0, 0, 0, 0.17)' : undefined"
    :overlay-opacity="!isNested ? 1 : undefined"
    :z-index="isNested ? '10012' : undefined"
    right
    width="calc(100% - 72px)"
    height="100%"
    @input="drawerModel = $event"
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
        @edit="handleEdit"
      />
    </div>
  </VNavigationDrawer>
</template>

<script>
import LandingPagePreviewSkeleton from '@/components/SkeletonLoading/LandingPagePreviewSkeleton'
import LandingPageTemplateModalPreview from '@/components/LandingPage/LandingPageTemplateModalPreview'
import { useLoading } from '@/hooks/useLoading'
import { PREVIEW_DIALOG_TYPES } from '@/components/Common/Simulator/utils'
import { getLandingPageTemplate } from '@/api/landingPage'
import useHtmlOverflowControl from '@/hooks/useHtmlOverflowControl'
export default {
  name: 'CommonSimulatorLandingPageTemplatesPreviewDialog',
  components: {
    LandingPageTemplateModalPreview,
    LandingPagePreviewSkeleton
  },
  mixins: [useLoading, useHtmlOverflowControl],
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
    }
  },
  data() {
    return {
      drawerModel: this.status,
      landingPageTemplates: null,
      landingPageParams: {
        languages: []
      }
    }
  },
  computed: {
    getSubtitle() {
      return this?.selectedRow?.name || ''
    }
  },
  watch: {
    status(newVal) {
      this.drawerModel = newVal
    },
    drawerModel(newVal) {
      if (!newVal) {
        this.handleClose()
      }
    }
  },
  created() {
    this.callForData()
  },
  methods: {
    handleClickOutside(event) {
      // SnackBar tıklanırsa ignore et
      if (event && event.target) {
        const snackbarElement = event.target.closest(
          '.v-snack__wrapper, .v-snackbar, [data-snackbar]'
        )
        if (snackbarElement) {
          return
        }
      }

      this.drawerModel = false
    },
    handleClose() {
      this.$emit('on-close')
    },
    callForData() {
      this.setLoading(true)
      this.apiFunc(this.selectedRow.resourceId)
        .then((response) => {
          const data = response.data.data
          this.landingPageParams.urlTemplate = data.urlTemplate
          this.landingPageParams.name = data.name

          this.landingPageParams.languages =
            this.languages.filter((lang) => {
              return lang.value === data.languageTypeResourceId
            }) || []

          this.landingPageTemplates = data.landingPages
          this.selectedTemplateHeader = data.name
          this.templateHTML = data.landingPages?.length
            ? data.landingPages[0]?.content || null
            : null
        })
        .finally(() => {
          this.timeoutId = setTimeout(() => {
            this.setLoading()
          }, 500)
        })
    },
    handleEdit() {
      this.$emit('on-edit', this.selectedRow)
    }
  }
}
</script>
