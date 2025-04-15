<template>
  <AppDialog
    title-id="text--incident-responder-roi-summary-title"
    subtitle-id="text--incident-responder-roi-summary-subtitle"
    class-name="roi-modal"
    size="big"
    icon="mdi-cog"
    title="ROI Summary Settings"
    subtitle="To calculate saving in time and money for automating the email analysis"
    :status="status"
    @changeStatus="handleClose"
  >
    <template #app-dialog-body>
      <v-form ref="form" lazy-validation>
        <v-list-item class="roi-modal__list-item">
          <v-list-item-content>
            <label class="roi-modal__label" for="input--incident-responder-roi-popup-saved-time">{{
              labels.RoiSummarySavedTimeLabel
            }}</label>
            <v-text-field
              v-mask="'###'"
              v-model="baseManHour"
              id="input--incident-responder-roi-popup-saved-time"
              placeholder="Enter saved time"
              outlined
              class="edit-name-textfield edit-select standard-height"
              :rules="[
                (v) => Validations.required(v, labels.Required),
                (v) => Validations.startsWith(v, 'Cannot start with 0', 0)
              ]"
            ></v-text-field>
          </v-list-item-content>
        </v-list-item>
        <v-list-item class="roi-modal__list-item">
          <v-list-item-content>
            <label for="input--incident-responder-roi-popup-hourly-rate" class="roi-modal__label">{{
              labels.RoiSummaryHourlyLabel
            }}</label>
            <v-text-field
              v-mask="'###'"
              v-model="baseManHourCost"
              id="input--incident-responder-roi-popup-hourly-rate"
              placeholder="Enter hourly rate"
              outlined
              class="edit-name-textfield edit-select standard-height"
              :rules="[
                (v) => Validations.required(v, labels.Required),
                (v) => Validations.startsWith(v, 'Cannot start with 0', 0)
              ]"
            ></v-text-field>
          </v-list-item-content>
        </v-list-item>
      </v-form>
    </template>
    <template #app-dialog-footer>
      <div class="download-modal__footer justify-end">
        <AppDialogFooter
          cancel-button-id="btn-cancel--incident-responder-roi-popup"
          confirm-button-id="btn-save--incident-responder-roi-popup"
          :action-button-text="labels.Save"
          :confirm-button-disabled="isRoiSettingSubmitButtonDisabled"
          @handleClose="handleClose"
          @handleConfirm="submitRoiModal"
        />
      </div>
    </template>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'
import labels from '@/model/constants/labels'
import { mapGetters } from 'vuex'
import { getRoiSettings, updateRoiSettings } from '@/api/incidentResponder'
import * as Validations from '@/utils/validations'
export default {
  name: 'IncidentResponderROIDialog',
  components: { AppDialogFooter, AppDialog },
  props: {
    status: {
      type: Boolean
    }
  },
  data() {
    return {
      Validations,
      labels,
      isConfirmButtonDisabled: false,
      baseManHour: null,
      baseManHourCost: null
    }
  },
  computed: {
    ...mapGetters({
      getIncidentResponderROISettingGetPermission:
        'permissions/getIncidentResponderROISettingGetPermission'
    }),
    isRoiSettingSubmitButtonDisabled() {
      return this.isConfirmButtonDisabled
    }
  },
  created() {
    if (this.getIncidentResponderROISettingGetPermission) {
      this.callForGetRoiSettings()
    }
  },
  methods: {
    callForGetRoiSettings() {
      getRoiSettings().then((response) => {
        const {
          data: { data }
        } = response
        this.baseManHour = data.baseManHour
        this.baseManHourCost = data.baseManHourCost
      })
    },
    handleClose(forceUpdate = false) {
      this.$emit('on-close', forceUpdate)
    },
    submitRoiModal() {
      if (this.$refs.form.validate()) {
        this.isConfirmButtonDisabled = true
        updateRoiSettings({
          baseManHour: this.baseManHour,
          baseManHourCost: this.baseManHourCost
        })
          .then(() => {
            this.handleClose(true)
          })
          .finally(() => {
            this.isConfirmButtonDisabled = false
          })
      }
    }
  }
}
</script>
