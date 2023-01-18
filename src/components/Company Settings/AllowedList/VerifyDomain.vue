<template>
  <div v-if="status">
    <app-dialog
      :type="!isVerified ? 'delete' : ''"
      :title="title"
      :icon="titleIcon"
      :subtitle="selectedDomain.domain"
      title-id="verify--domain-popup-title"
      subtitle-id="verify--domain-popup-popup-subtitle"
      size="big"
      max-height-size="530px"
      :status="status"
      @changeStatus="closeModal"
    >
      <template v-slot:app-dialog-body>
        <div class="verify-domain-container">
          <div v-if="selectedDomain.status === 'Verified'" class="verify-desc">
            This domain is already verified.<br />
            Here are the DNS record details.
          </div>
          <div v-else>
            <div v-if="isVerified" class="verify-desc">
              If you have created the TXT Record, you can try to verify now. Or, you can come back
              later to verify your domain.
              <br /><br />
              Use values below to create a TXT record from your DNS management panel.
            </div>
            <div v-else class="verify-desc">
              This domain cannot be verified at the moment.<br />
              {{ selectedDomain.domain }}<br /><br />

              <strong>Error: Verification code not found, you can check again later.</strong>
              <br /><br />

              Use values below to create a TXT record from your DNS management panel. If you already
              created the DNS record, wait for a while and try again.
            </div>
          </div>
          <div class="name-value-container">
            <div class="text-title-container">
              <p>How to verify</p>
              Use values below to create a TXT record from your DNS management panel before
              verifying. You can verify the domain right after clicking
              <strong>‘SAVE’</strong> button or later from the
              <strong>‘Domain Verification’</strong> list.
            </div>
            <form-group class="mt-6" title="Name" hint>
              <v-container>
                <v-row>
                  <v-col cols="12" md="7">
                    <v-text-field
                      v-model="selectedDomain.domain"
                      outlined
                      hint=""
                      placeholder=""
                      required
                      disabled
                    />
                  </v-col>

                  <v-col cols="12" md="5">
                    <div class="copy-btn" @click="copyToClipboard(selectedDomain.domain)">
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
                      v-model="selectedDomain.txtRecord"
                      outlined
                      hint=""
                      required
                      disabled
                    />
                  </v-col>

                  <v-col cols="12" md="5">
                    <div class="copy-btn" @click="copyToClipboard(selectedDomain.txtRecord)">
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
        </div>
      </template>
      <template v-slot:app-dialog-footer>
        <div>
          <v-card class="d-flex justify-end verify-button-container" flat>
            <v-card v-if="!verifyStartStatus" class="pa-2 later" @click="closeModal" flat>
              <span v-if="selectedDomain.status !== 'Verified'">VERIFY LATER</span>
              <span v-else class="btn-blue">CLOSE</span>
            </v-card>
            <v-card v-if="selectedDomain.status !== 'Verified'" class="pa-2 now" flat>
              <div v-if="!verifyStartStatus" @click="verifyDomain()">VERIFY NOW</div>
              <div v-else class="verifying">
                VERIFYING<img alt="" src="../../../assets/img/verify-loading-icon.svg" />
              </div>
            </v-card>
          </v-card>
        </div>
      </template>
    </app-dialog>
  </div>
</template>

<script>
import AppDialog from '../../AppDialog'
import { getAllowListListVerify } from '@/api/allowList'
import FormGroup from '@/components/SmallComponents/FormGroup'
import labels from '@/model/constants/labels'
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'
import { copyToClipboard } from '@/utils/functions'
export default {
  name: 'VerifyDomain',
  components: {
    AppDialog,
    FormGroup
    //AppDialogFooter
  },
  props: {
    status: {
      type: Boolean
    },
    selectedDomain: {
      type: Object
    }
  },
  data() {
    return {
      verifyStartStatus: false,
      isVerified: true
    }
  },
  computed: {
    title() {
      let popupTitle = 'Cannot verify domain'
      if (this.isVerified) {
        popupTitle = 'Verify domain'
      }
      if (this.selectedDomain.status === 'Verified') {
        popupTitle = 'Verified domain'
      }
      return popupTitle
    },
    titleIcon() {
      let icon = ''
      if (!this.isVerified) {
        icon = 'mdi-alert-circle'
      }
      if (this.selectedDomain.status === 'Verified') {
        icon = 'mdi-check-circle '
      }
      return icon
    }
  },
  methods: {
    copyToClipboard,
    closeModal() {
      this.$emit('handleCloseModal')
      this.confirmText = ''
    },
    verifyDomain() {
      this.verifyStartStatus = true
      getAllowListListVerify(this.selectedDomain.allowListResourceId).then((response) => {
        setTimeout(() => {
          this.verifyStartStatus = false
          if (response.data.data.status === 1) {
            this.isVerified = false
          } else {
            this.$emit('handleVerifyDomainPopup')
          }
          this.$emit('getDatatableList')
        }, 100)
      })
    }
  }
}
</script>
