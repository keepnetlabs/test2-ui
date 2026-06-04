<template>
  <app-dialog
    :status="isShow"
    icon="mdi-earth"
    icon-color="blue"
    title="Migrate data residency"
    subtitle="Move this company's user data to a regional database. The current location is shown below."
    title-id="text--sovereignty-migrate-title"
    subtitle-id="text--sovereignty-migrate-subtitle"
    class-name="sovereignty-migrate-dialog"
    dialog-body-class="sovereignty-migrate-dialog__body"
    size="big"
    @changeStatus="onDialogChange"
  >
    <template #app-dialog-body>
      <div
        class="sovereignty-migrate-modal__body"
        :class="{ 'sovereignty-migrate-modal__body--submitting': submitting }"
      >
        <template v-if="isInitializing">
          <v-skeleton-loader
            type="image"
            class="sovereignty-migrate-modal__skeleton sovereignty-migrate-modal__skeleton--notice"
          />
          <v-skeleton-loader
            type="paragraph"
            class="sovereignty-migrate-modal__skeleton sovereignty-migrate-modal__skeleton--summary"
          />
          <v-skeleton-loader
            type="text, image"
            class="sovereignty-migrate-modal__skeleton sovereignty-migrate-modal__skeleton--field"
          />
        </template>
        <template v-else>
          <AlertBox
            v-if="isAlreadyAssigned"
            id="alert--sovereignty-already-assigned"
            class="bg-yellow-light sovereignty-migrate-modal__notice"
            icon-color="#f57c00"
            icon-name="mdi-alert"
            :slots="{ primaryAction: false, secondaryAction: false }"
          >
            <template #text>
              <p class="mb-0">
                This company is already assigned to <strong>{{ currentLocationLabel }}</strong>. Region changes aren't supported.
              </p>
            </template>
          </AlertBox>
          <AlertBox
            v-else
            class="bg-aqua-light sovereignty-migrate-modal__notice"
            icon-color="#2196F3"
            icon-name="mdi-information"
            :slots="{ primaryAction: false, secondaryAction: false }"
          >
            <template #text>
              <p class="mb-0">
                Once queued, the migration runs in the background. Large companies may take several minutes to complete.
              </p>
            </template>
          </AlertBox>
          <div class="sovereignty-migrate-modal__summary">
            <div id="text--sovereignty-migrate-company" class="sovereignty-migrate-modal__current-line">
              <span class="sovereignty-migrate-modal__current-key">Company:</span>
              <span class="sovereignty-migrate-modal__current-val">{{ companyName }}</span>
            </div>
            <div id="text--sovereignty-current-region" class="sovereignty-migrate-modal__current-line">
              <span class="sovereignty-migrate-modal__current-key">Current location:</span>
              <span class="sovereignty-migrate-modal__current-val">{{ currentLocationLabel }}</span>
            </div>
          </div>
          <v-form
            v-if="!isAlreadyAssigned"
            ref="refMigrateForm"
            lazy-validation
            class="sovereignty-migrate-modal__form"
          >
            <FormGroup
              title="Target region"
              sub-title="Where this company's user data will be stored."
              class-name="sovereignty-migrate-modal__field-group"
            >
              <v-select
                id="select--sovereignty-migrate-region"
                v-model="targetRegionCode"
                :items="regionItems"
                outlined
                dense
                :disabled="submitting"
                hide-details="auto"
                item-text="displayName"
                item-value="value"
                placeholder="Select a region"
                no-data-text="No regions are configured yet."
                :menu-props="{ offsetY: true }"
                :rules="[(v) => !!v || 'Required']"
                class="sovereignty-migrate-modal__target-select"
              />
            </FormGroup>
          </v-form>
        </template>
      </div>
    </template>
    <template #app-dialog-footer>
      <div :class="{ 'sovereignty-migrate-modal__footer--locked': submitting }">
        <div
          v-if="isAlreadyAssigned"
          class="d-flex justify-end"
        >
          <v-btn
            text
            color="#383b41"
            id="btn-close--sovereignty-migrate"
            class="k-dialog__button"
            @click="close"
          >
            Close
          </v-btn>
        </div>
        <app-dialog-footer
          v-else
          action-button-text="Queue migration"
          cancel-button-id="btn-cancel--sovereignty-migrate"
          confirm-button-id="btn-confirm--sovereignty-migrate"
          :confirm-button-disabled="!canSubmit"
          @handleClose="close"
          @handleConfirm="submit"
        />
      </div>
    </template>
  </app-dialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'
import FormGroup from '@/components/SmallComponents/FormGroup'
import AlertBox from '@/components/AlertBox'
import { getRegions } from '@/api/regions'
import { migrateCompanySovereignty, getCompanyByID } from '@/api/company'
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'

const DEFAULT_BATCH_SIZE = 500

export default {
  name: 'SovereigntyMigrateModal',
  components: {
    AppDialog,
    AppDialogFooter,
    FormGroup,
    AlertBox
  },
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    companyResourceId: {
      type: String,
      default: ''
    },
    companyName: {
      type: String,
      default: ''
    },
    currentRegionCode: {
      type: String,
      default: ''
    },
    currentRegionLabel: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      targetRegionCode: '',
      sovereigntyRegionsList: [],
      fetchedRegionCode: '',
      submitting: false,
      isInitializing: false
    }
  },
  computed: {
    regionItems() {
      return (this.sovereigntyRegionsList || []).map((r) => ({
        displayName: r.displayName || r.code,
        value: r.code
      }))
    },
    effectiveRegionCode() {
      const fetched = (this.fetchedRegionCode || '').trim()
      if (fetched) return fetched
      return (this.currentRegionCode || '').trim()
    },
    isAlreadyAssigned() {
      return !!this.effectiveRegionCode
    },
    currentLocationLabel() {
      const preset = (this.currentRegionLabel || '').trim()
      if (preset) return preset
      const code = this.effectiveRegionCode
      if (!code) return 'Central (no region)'
      const raw = (this.sovereigntyRegionsList || []).find((r) => r.code === code)
      if (raw && (raw.displayName || raw.code)) return raw.displayName || raw.code
      return code
    },
    canSubmit() {
      return (
        !!this.companyResourceId &&
        !!this.targetRegionCode &&
        !this.submitting &&
        !this.isAlreadyAssigned &&
        !this.isInitializing
      )
    }
  },
  watch: {
    isShow(val) {
      if (val) {
        this.resetForm()
        this.isInitializing = true
        Promise.all([this.fetchRegions(), this.fetchCompanyState()]).finally(() => {
          this.isInitializing = false
        })
      }
    }
  },
  methods: {
    onDialogChange(open) {
      if (!open) this.close()
    },
    close() {
      this.$emit('close')
    },
    resetForm() {
      this.targetRegionCode = ''
      this.fetchedRegionCode = ''
      this.submitting = false
      this.$nextTick(() => this.$refs.refMigrateForm?.resetValidation?.())
    },
    applyDefaultTargetRegion() {
      const list = this.sovereigntyRegionsList
      if (!Array.isArray(list) || !list.length) return
      if (this.targetRegionCode) return
      const sorted = [...list].sort(
        (a, b) => (Number(a.sortOrder) || 0) - (Number(b.sortOrder) || 0)
      )
      const first = sorted[0]
      if (first?.code) this.targetRegionCode = first.code
    },
    fetchRegions() {
      return getRegions({ loading: false })
        .then((res) => {
          const list = res?.data?.data
          this.sovereigntyRegionsList = Array.isArray(list) ? list : []
          this.applyDefaultTargetRegion()
        })
        .catch(() => {
          this.sovereigntyRegionsList = []
        })
    },
    fetchCompanyState() {
      if (!this.companyResourceId) return Promise.resolve()
      return getCompanyByID(this.companyResourceId, false)
        .then((res) => {
          const data = res?.data?.data || {}
          const code = data.regionCode ?? data.RegionCode ?? ''
          this.fetchedRegionCode = String(code || '').trim()
        })
        .catch(() => {})
    },
    submit() {
      if (!this.$refs.refMigrateForm?.validate?.()) return
      if (!this.canSubmit) return
      this.submitting = true
      migrateCompanySovereignty(this.companyResourceId, {
        targetRegionCode: this.targetRegionCode,
        batchSize: DEFAULT_BATCH_SIZE
      })
        .then(() => {
          this.$store.dispatch(
            'common/createSnackBar',
            {
              color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
              message: 'Migration queued. This may take a few minutes to complete.',
              icon: 'mdi-check-circle'
            },
            { root: true }
          )
          this.$emit('success')
          this.close()
        })
        .catch(() => {})
        .finally(() => {
          this.submitting = false
        })
    }
  }
}
</script>
