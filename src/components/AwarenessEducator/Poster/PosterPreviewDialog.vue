<template>
  <AppDialog
    icon="mdi-eye"
    custom-size="1600"
    :status="status"
    :title="title"
    :subtitle="subtitle"
    max-height
    max-height-size="900"
    class-name="campaign-manager-preview-dialog"
    @changeStatus="handleClose"
  >
    <template #app-dialog-body>
      <DatatableLoading v-if="isLoading" :loading="isLoading" />
      <ElTabs v-if="!isLoading" v-model="tab">
        <ElTabPane id="poster-info--preview-content" name="preview" :label="labels.Preview">
          <div class="template-preview pt-4">
            <div class="template-preview__text">
              <div v-if="showPosterName">
                <div>
                  <span class="training-library-preview__title">Poster Name: </span>
                  <span class="training-library-preview__desc">{{ name }}</span>
                </div>
              </div>
              <FormGroupHorizontalContent
                class="mt-4"
                style="max-width: 500px;"
                label="Specifications"
              >
                <KSelect
                  v-model="specification"
                  dense
                  outlined
                  placeholder="Select specification"
                  :items="languages"
                  @input="callForData(true)"
                />
              </FormGroupHorizontalContent>
              <div class="d-flex justify-space-between align-center">
                <div>
                  <span class="template-preview__text--title">Poster Name: </span>
                  <span class="template-preview__text--body">{{ posterParams.posterName }}</span>
                </div>

                <VBtn
                  id="btn-preview-indiviual-printout"
                  class="white--text btn-util btn-download-add-in"
                  color="#2196F3"
                  rounded
                  @click="handleDownloadPoster"
                >
                  <v-icon left>mdi-download</v-icon>
                  {{ labels.DownloadPoster }}
                </VBtn>
              </div>
            </div>
            <hr class="mt-4" />
          </div>
        </ElTabPane>
        <ElTabPane :label="labels.Details" name="details" id="poster-preview-details"> </ElTabPane>
      </ElTabs>
    </template>
    <template #app-dialog-footer>
      <AppDialogFooterWithClose id="btn-close--scenario-preview" @on-close="handleClose" />
    </template>
  </AppDialog>
</template>
<script>
import AppDialogFooterWithClose from '@/components/SmallComponents/AppDialogFooterWithClose.vue'
import DatatableLoading from '@/components/SkeletonLoading/WidgetLoading.vue'
import AppDialog from '@/components/AppDialog.vue'
import labels from '@/model/constants/labels'
import FormGroupHorizontalContent from '@/components/SmallComponents/FormGroupHorizontalContent.vue'
import KSelect from '@/components/Common/Inputs/KSelect.vue'

export default {
  name: 'PosterPreviewDialog',
  components: {
    KSelect,
    FormGroupHorizontalContent,
    AppDialog,
    DatatableLoading,
    AppDialogFooterWithClose
  },
  props: {
    status: {
      type: Boolean
    },
    selectedRow: {
      type: Object
    },
    title: {
      type: String,
      default: labels.PosterPreview
    },
    subtitle: {
      type: String,
      default: ''
    },
    showPosterName: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tab: 'preview',
      specification: '',
      languages: [],
      isLoading: false,
      labels,
      posterParams: {}
    }
  },
  computed: {
    getTitle() {
      return labels.PosterPreview
    },
    getSubtitle() {
      return this.selectedRow?.name || ''
    }
  },
  created() {
    this.callForData()
  },
  methods: {
    callForData() {},
    handleClose() {
      this.$emit('on-close')
    },
    handleDownloadPoster() {}
  }
}
</script>
