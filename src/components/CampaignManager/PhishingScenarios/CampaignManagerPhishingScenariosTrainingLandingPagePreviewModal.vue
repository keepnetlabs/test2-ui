<template>
  <AppDialog
    icon="mdi-eye"
    custom-size="1600"
    max-height
    max-height-size="900"
    :status="status"
    title="Preview Training Redirect Page"
    style="overflow: hidden;"
    @changeStatus="handleClose"
  >
    <template #app-dialog-body>
      <div class="phished-landing-page" style="pointer-events: none;">
        <div class="phished-landing-page__container">
          <div class="phished-landing-page__image">
            <figure>
              <img id="img--login-main-logo" :src="getLogoImage" alt="logo" />
            </figure>
          </div>
          <h1 class="phished-landing-page__title">
            {{ getInformationMessage }}
          </h1>
          <p class="phished-landing-page__subtitle">
            {{ getRedirectMessage }}
          </p>
          <div class="phished-landing-page__buttons">
            <VBtn v-if="!isMultiple" class="phished-landing-page__button" color="#2196f3"
              >{{ getStartButtonLabel }}
            </VBtn>
            <!-- <VBtn
              v-else
              v-for="button in buttons"
              :key="button.language"
              class="phished-landing-page__button"
              color="#2196f3"
              >{{ button.text }}
            </VBtn> -->
          </div>
        </div>
      </div>
    </template>
    <template #app-dialog-footer>
      <AppDialogFooterWithClose @on-close="handleClose" />
    </template>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog.vue'
import AppDialogFooterWithClose from '@/components/SmallComponents/AppDialogFooterWithClose.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'CampaignManagerPhishingScenariosPreviewDialog',
  components: { AppDialogFooterWithClose, AppDialog },
  props: {
    status: {
      type: Boolean,
      default: false
    },
    nativeLanguages: {
      type: Array
    },
    trainingLanguageIds: {
      type: Array
    },
    informationMessage: {
      type: String,
      default:
        'Because you failed the phishing simulation test, you have been assigned to a training selected by the company admin'
    },
    redirectMessage: {
      type: String,
      default: 'Please start the training and complete the training as soon as possible'
    },
    startButtonLabel: {
      type: String,
      default: 'Start Training'
    }
  },
  computed: {
    ...mapGetters({
      navigatorMenuProps: 'whitelabel/getNavigatorMenuProps'
    }),
    getUser() {
      return this?.$store?.state?.auth?.user
    },
    getLogoImage() {
      if (!this.getUser) return ''
      let image =
        localStorage.getItem('isSelectCompany') === 'true'
          ? this.$store.state.dashboard.selectedCompanyObject.logoUrl
          : this.$store.state.auth.logoUrl
      return image || require('../../../assets/img/no-logo.png')
    },
    isMultiple() {
      const languages = this.trainingLanguageIds?.filter?.((language) => language !== 'All') || []
      return languages.length > 1
    },
    getInformationMessage() {
      if (!this.informationMessage) {
        return `Because you failed the phishing simulation test, you have been assigned to a training selected by the company admin`
      }
      return this.informationMessage
    },
    getRedirectMessage() {
      if (!this.redirectMessage) {
        return `Please start the training and complete the training as soon as possible`
      }
      return this.redirectMessage
    },
    getStartButtonLabel() {
      if (!this.startButtonLabel) {
        return `Start Training`
      }
      return this.startButtonLabel
    }
  },
  methods: {
    handleClose() {
      this.$emit('on-close', false)
    }
  }
}
</script>
