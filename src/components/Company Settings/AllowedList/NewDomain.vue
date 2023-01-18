<template>
  <div>
    <div class="new-domain-vector">
      <app-modal :status="status" icon-name="mdi-plus" title="Domain Verification">
        <template v-slot:overlay-body>
          <v-form class="mt-8" ref="refdomainForm">
            <form-group title="Domain" sub-title="Enter a domain you want to use" hint>
              <v-text-field
                v-bind="commonRules(true)"
                v-model="formValues.domain"
                outlined
                hint=""
                placeholder="Enter your domain"
                required
              />
            </form-group>
            <div class="name-value-container">
              <div class="text-title-container">
                <p>How to verify</p>
                Use values below to create a TXT record from your DNS management panel before
                verifying. You can verify the domain right after clicking
                <strong>‘SAVE’</strong> button or later from the
                <strong>‘domain Verification’</strong> list.
              </div>
              <form-group class="mt-6" title="Name" hint>
                <v-container>
                  <v-row>
                    <v-col cols="12" md="7">
                      <v-text-field
                        v-model="formValues.domain"
                        outlined
                        hint=""
                        placeholder=""
                        required
                        disabled
                      />
                    </v-col>

                    <v-col cols="12" md="5">
                      <div class="copy-btn" @click="copyToClipboard(formValues.domain)">
                        Copy to clipboard
                      </div>
                    </v-col>
                  </v-row>
                </v-container>
              </form-group>
              <form-group title="Value" hint>
                <v-container>
                  <v-row>
                    <v-col cols="12" md="7">
                      <v-text-field
                        ref="txtValue"
                        v-model="formValues.txtRecord"
                        outlined
                        hint=""
                        required
                        disabled
                      />
                    </v-col>

                    <v-col cols="12" md="5">
                      <div class="copy-btn" @click="copyToClipboard(formValues.txtRecord)">
                        Copy to clipboard
                      </div>
                    </v-col>
                  </v-row>
                </v-container>
              </form-group>
              <form-group
                title="TTL"
                sub-title="Use any value. For example: 1 hour (or 3600 seconds)"
                hint
              >
              </form-group>
            </div>
          </v-form>
        </template>
        <template v-slot:overlay-footer>
          <v-btn class="add-user-overlay__footer-btn-cancel" rounded @click="closeDomainPopup">
            {{ labels.Cancel }}
          </v-btn>
          <v-btn
            class="add-user-overlay__footer-btn-save white--text"
            color="#2196f3"
            rounded
            :disabled="saveButtonStatus"
            @click="submit"
          >
            {{ labels.Save }}
          </v-btn>
        </template>
      </app-modal>
    </div>
  </div>
</template>

<script>
import AppModal from '../../AppModal'
import labels from '@/model/constants/labels'
import FormGroup from '@/components/SmallComponents/FormGroup'
import * as Validations from '@/utils/validations'
import { createTxtRecord, createAllowListList } from '@/api/allowList'
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'
import { copyToClipboard } from '@/utils/functions'

export default {
  name: 'Newdomain',
  components: {
    AppModal,
    FormGroup
  },
  data() {
    return {
      categoryResources: [],
      labels,
      Validations: Validations,
      formValues: {
        domain: '',
        txtRecord: ''
      },
      baseRules: {
        hint: '*Required',
        persistentHint: true,
        rules: [
          (v) => Validations.required(v, labels.Required),
          (v) => Validations.maxLength(v, 160, labels.getMaxLengthMessage('Domain Name', 160))
        ]
      },
      isSubmitDisabled: false,
      isFormValuesChanged: false
    }
  },
  props: {
    status: {
      type: Boolean,
      default: false
    },
    changeNewDomainPopupStatus: {
      type: Function
    }
  },
  computed: {
    saveButtonStatus() {
      if (this.formValues.domain.length === 0 || this.formValues.domain.length > 160) {
        return true
      }
      return false
    }
  },
  created() {
    this.getTxtRecord()
  },
  methods: {
    copyToClipboard,
    commonRules(isNeed) {
      if (isNeed) {
        return this.baseRules
      }
    },
    setNumberRangeRule(isNeed) {
      if (isNeed) {
        return this.numberRangeRule
      }
    },
    closeDomainPopup() {
      this.$store.dispatch('common/setIsShowLeavingDialog', {
        show: true,
        callback: () => {
          this.changeNewDomainPopupStatus(false)
        }
      })
    },
    getTxtRecord() {
      createTxtRecord().then((record) => {
        this.formValues.txtRecord = record.data.data
      })
    },
    submit() {
      if (this.$refs.refdomainForm.validate()) {
        const bodyFormData = new FormData()
        bodyFormData.append('Domain', this.formValues.domain)
        bodyFormData.append('TxtRecord', this.formValues.txtRecord)
        createAllowListList(bodyFormData)
          .then((returnValue) => {
            this.changeNewDomainPopupStatus(false, true, returnValue.data.data.resourceId)
          })
          .catch((error) => {
            const errorResponse = error.response.data
            let msg = errorResponse.message
            if (errorResponse?.validationMessages && errorResponse.validationMessages.length > 0) {
              let msg = ''
              for (let i = 0; i < errorResponse.validationMessages.length; i++) {
                const listMsg = errorResponse.validationMessages[i]
                msg += listMsg + ', '
              }
              msg = msg.slice(0, -1)
            }
            this.$store.dispatch('common/createSnackBar', {
              message: msg,
              color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
              icon: 'mdi-alert-circle'
            })
          })
      }
    }
  }
}
</script>
