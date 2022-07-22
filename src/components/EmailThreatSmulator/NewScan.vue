<template>
  <div>
    <app-dialog
      v-if="permissionModalStatus"
      :status="permissionModalStatus"
      className="email-threat-simulator-warning"
      icon="mdi-information"
      iconColor="#f56c6c"
      title="Warning!"
      subtitle="Do not use your real email accounts"
      body="We recommend creating a test account and even using virtual machine because of the potential security problems."
    >
      <template v-slot:app-dialog-footer>
        <div class="d-flex download-buttons flex-row flex-wrap justify-end">
          <div class="d-flex flex-row flex-end">
            <v-btn
              id="threat-sharing-right-column-permission-modal-button"
              class="pa-0 k-dialog__button"
              text
              color="#2196f3"
              @click="permissionModalStatus = false"
              >I UNDERSTAND
            </v-btn>
          </div>
        </div>
      </template>
    </app-dialog>

    <app-modal :status="status" icon-name="mdi-shield-half-full" title="Create New Scan">
      <template v-slot:overlay-body>
        <v-stepper light v-model="step" class="k-stepper">
          <v-stepper-header class="k-stepper__header">
            <v-stepper-step class="k-stepper__step" :complete="step > 1" :step="1"
              >Email Settings</v-stepper-step
            >
            <v-divider class="k-stepper__divider" />
            <v-stepper-step class="k-stepper__step" :complete="step > 2" :step="2"
              >Scan and Delivery
            </v-stepper-step>
            <v-divider class="k-stepper__divider" />
            <v-stepper-step class="k-stepper__step" :complete="step > 3" :step="3"
              >User Agreement
            </v-stepper-step>
          </v-stepper-header>
          <v-stepper-items class="k-stepper__items">
            <v-stepper-content class="k-stepper__content" :step="1">
              <div class="phishing-scenario-info">
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title class="new-phishing-scenario__title">
                      Email Login Information</v-list-item-title
                    >
                    <v-list-item-subtitle class="new-phishing-scenario__sub-title"
                      >Enter email information</v-list-item-subtitle
                    >
                  </v-list-item-content>
                </v-list-item>
                <v-alert v-if="emailLoginStatus" dense color="rgba(245, 108, 108, 0.2)" class="my-8 py-5 " max-width="600">
                  <v-icon class="mr-4" marig color="#f56c6c"> mdi-close-circle </v-icon>
                  <strong>Username or password is incorrect. Please try again.</strong>
                </v-alert>
                <v-form ref="refFormStep1" lazy-validation>
                  <form-group
                    title="Scenario Name"
                    sub-title="Enter emails address that you created for test purposes"
                    hint
                  >
                    <InputEmail
                      v-model.trim="emailSettingsValues.email"
                      id="input--new-scan-email"
                      entityName="email address"
                      initialPlaceholder="Email address"
                      :disabled="editItemsDisabled"
                      hint
                    />
                  </form-group>
                  <form-group
                    title="Choose an Option"
                    sub-title="Automate the scan via entering the password to your account or choose manual <br/> method to manually find penetrated emails."
                  >
                    <div class="radio-btn-list">
                      <v-radio-group
                        class="option-radio"
                        v-model="emailSettingsValues.scanType"
                        id="input--new-scan-options"
                        :mandatory="false"
                        row
                        hide-details
                      >
                        <v-radio
                          v-for="(item, index) in scanOptions"
                          :key="index"
                          :value="item.value"
                          :label="item.label"
                          color="#2196f3"
                        />
                      </v-radio-group>
                    </div>
                  </form-group>
                  <form-group
                    title="Password"
                    sub-title="Use your account password"
                    has-hint
                    class-name="mt-8"
                  >
                    <v-text-field
                      v-bind="commonRules(emailSettingsValues.scanType == 'Manual' ? false : true)"
                      v-model="emailSettingsValues.password"
                      outlined
                      dense
                      placeholder="Password"
                      hint=""
                      type="password"
                      place
                      :disabled="emailSettingsValues.scanType == 'Manual' ? true : false"
                    />
                    <v-checkbox
                      v-model="emailSettingsValues.owa"
                      color="#2196f3"
                      label="OWA"
                      :disabled="emailSettingsValues.scanType == 'Manual' ? true : false"
                    />
                    <div v-if="emailSettingsValues.owa" class="label-left-form">
                      <label>OWA URL</label>
                      <v-text-field
                        class="ml-2"
                        v-bind="commonRules(emailSettingsValues.owa)"
                        v-model="emailSettingsValues.owaUrl"
                        outlined
                        hint=""
                        placeholder="OWA URL"
                      />
                    </div>
                    <div v-if="emailSettingsValues.owa" class="label-left-form">
                      <label>Username</label>
                      <v-text-field
                        class="ml-2"
                        v-bind="commonRules(emailSettingsValues.owa)"
                        v-model="emailSettingsValues.username"
                        outlined
                        hint=""
                        placeholder="Username"
                      />
                    </div>
                  </form-group>
                </v-form>
              </div>
            </v-stepper-content>
            <v-stepper-content class="k-stepper__content" :step="2">
              <div class="phishing-scenario-info">
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title class="new-phishing-scenario__title">
                      Scan and Delivery Settings</v-list-item-title
                    >
                  </v-list-item-content>
                </v-list-item>

                <v-form ref="refFormStep2" lazy-validation>
                  <form-group title="Continuos Scan" hint class-name="my-8">
                    <v-checkbox
                      v-model="scanAndDeliveryValues.continuousScan"
                      color="#2196f3"
                      label="Scan with new attack vectors when added"
                    />
                  </form-group>
                  <form-group
                    title="Distribution"
                    sub-title="Send emails with selected intervals or over a specified time period. Limit number of emails to be sent in each batch."
                  >
                    <div class="label-left-form">
                      <label class="little">Sending Limit</label>
                      <v-text-field
                        v-model="scanAndDeliveryValues.sendingLimit"
                        class="shrink mx-1"
                        type="number"
                        outlined
                        hint=""
                        placeholder="Sending Limit"
                      />
                    </div>
                    <v-radio-group
                      class="option-radio my-0"
                      v-model="scanAndDeliveryValues.sendingLoopType.loopType"
                      :mandatory="false"
                      column
                      hide-details
                    >
                      <div>
                        <v-radio
                          active-class="active"
                          value="SMTP"
                          label="Send emails with SMTP Delay every"
                          color="#2196f3"
                          class="float-md-left pt-1"
                        />
                        <div class="loop-type-input-container">
                          <div class="float-md-left left-input">
                            <v-text-field
                              v-model="scanAndDeliveryValues.sendingLoopType.smtpTimeMinute"
                              class="shrink mx-5"
                              type="number"
                              outlined
                              hint=""
                              placeholder="Sending Limit"
                              :disabled="
                                scanAndDeliveryValues.sendingLoopType.loopType === 'SMTP'
                                  ? false
                                  : true
                              "
                            />
                          </div>
                          <div class="float-md-left right-input">
                            <v-select
                              v-model="scanAndDeliveryValues.sendingLoopType.smtpTimeType"
                              :items="smtpTimeTypes"
                              item-disabled="disabled"
                              item-text="text"
                              item-value="value"
                              outlined
                              required
                              :disabled="
                                scanAndDeliveryValues.sendingLoopType.loopType === 'SMTP'
                                  ? false
                                  : true
                              "
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <v-radio
                          active-class="active"
                          value="DistributeEmails"
                          label="Distribute emails over "
                          color="#2196f3"
                          class="float-md-left pt-1"
                        />
                        <div class="loop-type-input-container">
                          <div class="float-md-left left-input">
                            <v-text-field
                              v-model="scanAndDeliveryValues.sendingLoopType.distributeTimeMinute"
                              class="shrink mx-5"
                              type="number"
                              outlined
                              hint=""
                              placeholder="Sending Limit"
                              :disabled="
                                scanAndDeliveryValues.sendingLoopType.loopType === 'SMTP'
                                  ? true
                                  : false
                              "
                            />
                          </div>
                          <div class="float-md-left right-input">
                            <v-select
                              v-model="scanAndDeliveryValues.sendingLoopType.distributeTimeType"
                              :items="timeTypes"
                              item-disabled="disabled"
                              item-text="text"
                              item-value="value"
                              outlined
                              required
                              persistent-hint
                              :disabled="
                                scanAndDeliveryValues.sendingLoopType.loopType === 'SMTP'
                                  ? true
                                  : false
                              "
                            />
                          </div>
                        </div>
                      </div>
                    </v-radio-group>
                  </form-group>
                </v-form>
              </div>
            </v-stepper-content>
            <v-stepper-content class="k-stepper__content" :step="3">
              <div class="phishing-scenario-info">
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title class="new-phishing-scenario__title">
                      User Agreement</v-list-item-title
                    >
                    <v-list-item-subtitle class="new-phishing-scenario__sub-title"
                      >Accept user agreement to start the scan</v-list-item-subtitle
                    >
                  </v-list-item-content>
                </v-list-item>

                <v-form ref="refFormStep3" lazy-validation>
                  <form-group hint class-name="mt-8">
                    <div class="user-agreement-container">
                      <strong> Lorem ipsum dolor sit amet</strong><br /><br />

                      consectetur adipiscing elit. Massa amet in elementum pharetra sed massa lorem
                      elit. Bibendum viverra proin in consectetur ac dictum. Tristique eleifend sed
                      bibendum enim. Blandit ultricies maecenas vivamus lacus. Et amet, eu fames
                      malesuada porttitor posuere aliquam praesent odio. Amet enim velit accumsan
                      nunc interdum laoreet lacus, in. Laoreet lacinia risus arcu mi, felis vitae,
                      nulla eget vulputate. Nulla sit euismod morbi scelerisque elementum id. Varius
                      massa maecenas libero hendrerit ut in. Eget justo risus pulvinar non. Urna
                      euismod magna risus fringilla tortor ac iaculis. Enim orci, sit aliquam
                      phasellus ullamcorper molestie tempor egestas lacus. Suspendisse tortor
                      adipiscing aliquet at. Leo, orci neque, viverra sit maecenas varius et mi.
                      Praesent nec dui vitae sollicitudin cras. Malesuada in laoreet parturient
                      quisque in nulla. Neque, velit neque, pellentesque in viverra massa ipsum vel
                      ante. Venenatis eget bibendum porttitor vitae integer donec. Ut cras quam
                      dignissim integer placerat fringilla. Rutrum mattis egestas imperdiet sed in
                      egestas tellus amet posuere. Ac ac imperdiet id augue quis. Amet interdum
                      lorem neque bibendum hac amet viverra. Risus lorem ut facilisis pulvinar
                      quisque iaculis. Lacus, amet metus, blandit ornare ut auctor. Aliquet commodo
                      dolor cursus elit risus egestas lectus. Quam scelerisque venenatis lectus
                      nullam amet fringilla. Elementum pulvinar faucibus adipiscing tincidunt
                      posuere ornare bibendum molestie. Nulla nulla mauris, at in vitae et viverra.
                      Non turpis vitae dictum sollicitudin commodo risus. Sagittis potenti metus
                      odio viverra. Augue lectus elit aliquet nulla. Natoque quisque id donec
                      quisque at pellentesque nulla malesuada. Pharetra feugiat auctor enim dolor
                      suscipit orci felis venenatis, integer. Rhoncus aliquet neque tincidunt ut in
                      urna neque. Consectetur sed nisl, quam gravida velit ultricies gravida. Et
                      enim sed tempor condimentum rutrum id nam. Et eros viverra feugiat est, cras
                      non convallis aenean mauris. Aliquet cras tincidunt at dignissim tortor diam
                      amet. Amet, in facilisi amet scelerisque faucibus sodales. Nec, feugiat
                      faucibus accumsan vitae, sit eget gravida imperdiet elementum. Morbi nisl
                      condimentum mauris bibendum et pulvinar est. Enim nibh faucibus tristique
                      aenean ornare tortor in faucibus integer. Neque gravida tellus sit et felis
                      auctor viverra nisl. Dictumst risus nullam amet sit dolor. Sed ut tortor, arcu
                      ultricies convallis. Maecenas tellus pretium consectetur ac lacinia diam,
                      tristique proin. Ut mauris lorem est ac amet sodales tortor aenean. A, tempor
                      pellentesque sit pellentesque ultrices quam vitae, amet et. Justo, mi luctus
                      felis aliquam maecenas tincidunt cursus nibh vulputate. Lacus, et, est
                      tristique amet venenatis ullamcorper dictum a sed. Morbi tellus tortor mauris
                      mi diam volutpat arcu aliquet porta.
                    </div>
                    <v-checkbox
                      v-model="acceptRule"
                      color="#2196f3"
                      label="I accept the user agreement"
                      :rules="validateCheckbox"
                    />
                  </form-group>
                </v-form>
              </div>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </template>
      <template #overlay-footer>
        <StepperFooter
          :max-step="3"
          :step.sync="step"
          :disabled-statuses="{ nextButton: isSubmitDisabled, submitButton: isSubmitDisabled }"
          @on-cancel="closeNewScanPopup"
          @on-back="backStep"
          @on-next="nextStep(+1)"
          @on-submit="submit"
        />
      </template>
    </app-modal>
  </div>
</template>

<script>
import AppModal from '../AppModal'
import AppDialog from '@/components/AppDialog'
import labels from '@/model/constants/labels'
import FormGroup from '@/components/SmallComponents/FormGroup'
import * as Validations from '@/utils/validations'
import { scrollToComponent, isDifferent } from '@/utils/functions'
import InputEmail from '@/components/Common/Inputs/InputEmail'
import StepperFooter from '@/components/Stepper/StepperFooter'

export default {
  name: 'NewScan',
  components: {
    StepperFooter,
    AppModal,
    AppDialog,
    FormGroup,
    InputEmail
  },
  data() {
    return {
      selectedTab: '1',
      emailLoginStatus: false,
      selectedScanOptions: 'Automate',
      smtpTimeTypes: ['seconds', 'minutes', 'hours'],
      timeTypes: ['hours', 'minutes'],
      scanOptions: [
        {
          value: 'Automate',
          label: 'Automate with password'
        },
        {
          value: 'Manual',
          label: 'Manual (no password required)'
        }
      ],
      labels,
      step: 1,
      Validations: Validations,
      emailSettingsValues: {
        email: '',
        scanType: 'Automate',
        password: '',
        owa: false,
        owaUrl: '',
        username: '',
        methodTypeId: '1'
      },
      scanAndDeliveryValues: {
        continuousScan: false,
        sendingLimit: 50,
        sendingLoopType: {
          loopType: 'SMTP',
          smtpTimeMinute: 20,
          smtpTimeType: 'seconds',
          distributeTimeMinute: 20,
          distributeTimeType: 'hours'
        }
      },
      acceptRule: false,
      baseRules: {
        hint: '*Required',
        persistentHint: true,
        rules: [
          (v) => Validations.required(v, labels.Required),
          (v) => Validations.maxLength(v, 256, labels.getMaxLengthMessage(labels.TemplateName))
        ]
      },
      permissionModalStatus: true
    }
  },
  props: {
    status: {
      type: Boolean,
      default: false
    },
    editableFormValues: {
      required: false
    },
    isEdit: {
      type: Boolean
    },
    isDuplicate: {
      type: Boolean,
      default: false
    },
    isAttachmentBased: {
      type: Boolean,
      default: false
    },
    scenarioId: {
      type: String
    },
    scenarioDetailsLookup: {
      required: true
    }
  },
  methods: {
    commonRules(isNeed) {
      if (isNeed) {
        return this.baseRules
      }
    },
    nextStep() {
      const currentStep = JSON.parse(JSON.stringify(this.step))
      console.log(this.$refs.refFormStep1.validate())
      if (currentStep === 1) {
        if (this.$refs.refFormStep1.validate()) {
          this.step += 1
        } else {
          const el = this.$refs.refFormStep1.$el.querySelector('.v-messages__message')
          scrollToComponent(el)
        }
      }
      if (currentStep === 2) {
        this.step += 1
      }
      // if (currentStep === 2) {
      //   this.step += 1
      // }
    },
    backStep() {
      this.step -= 1
      this.isSubmitDisabled = false
    },
    closeNewScanPopup() {
      return this.$emit('changeNewScenarioModalStatus', false)
      // const isChanged = isDifferent(this.formValues, this.initialFormValues)
      // if (!isChanged) {
      //   return this.$emit('changeNewScenarioModalStatus', false)
      // }
      // this.$store.dispatch('common/setIsShowLeavingDialog', {
      //   show: true,
      //   callback: () => {
      //     this.$emit('changeNewScenarioModalStatus', false)
      //   }
      // })
    },
    submit() {
      if (this.$refs.refFormStep3.validate()) {
        alert(1)
      }

      //   this.isSubmitDisabled = true
      //   let isValid = true
      //   const { refMakeAvailableFor } = this.$refs
      //   if (refMakeAvailableFor) {
      //     refMakeAvailableFor.validateAvailableFor(this.formValues.availableForRequests)
      //     isValid = refMakeAvailableFor.isAvailableForValid
      //   }
      //   if (this.isEdit && !this.isDuplicate) {
      //     updateScenario(this.formValues, this.scenarioId)
      //       .then(() => {
      //         this.$emit('changeNewScenarioModalStatus', false, true)
      //       })
      //       .finally(() => {
      //         this.isSubmitDisabled = false
      //       })
      //   } else {
      //     createScenario(this.formValues)
      //       .then(() => {
      //         this.$emit('changeNewScenarioModalStatus', false, true)
      //       })
      //       .finally(() => {
      //         this.isSubmitDisabled = false
      //       })
      //   }
    }
  },
  watch: {
    landingPageTemplateResourceId() {
      this.selectedTab = '1'
    },
    // 'emailSettingsValues.methodTypeId'(val, oldVal) {
    //   console.log('iam deleted')
    //   if (val !== oldVal) {
    //     this.formValues.emailTemplateId = null
    //     this.formValues.landingPageTemplateId = null
    //     this.landingPageTemplateId = null
    //     this.emailTemplateResourceId = null
    //   }
    // },
    emailSettingsValues: {
      handler: function (value) {
        if (value.scanType === 'Manual') {
          this.emailSettingsValues.password = ''
          this.emailSettingsValues.owa = false
          this.emailSettingsValues.owaUrl = ''
          this.emailSettingsValues.username = ''
        }
      },
      deep: true
    }
  },
  computed: {
    validateCheckbox() {
      return [this.acceptRule === true || labels.Required]
    }
  },
  created() {
    // this.callForLanguages()
    // if (!this.isEdit) {
    //   this.initialFormValues = JSON.parse(JSON.stringify(this.emailSettingsValues))
    // }
    // let _this = this
    // if (this.isEdit) {
    //   this.isSubmitDisabled = true
    // }
  }
}
</script>
<style lang="scss">
.radio-btn-list {
  .v-input--selection-controls {
    margin-top: 5px;
  }
}
.email-threat-simulator-warning {
  .v-cart-icon-wrapper {
    background-color: #fef7f7 !important;
    border: 1px solid #f56c6c !important;
  }
  .k-dialog__title {
    color: #f56c6c !important;
  }
}
</style>
<style lang="scss" scoped>
.label-left-form {
  width: 80%;
  display: flex;
  flex-wrap: nowrap;
  margin-top: 10px;
  label {
    padding-top: 9px;
    margin-right: 30px;
    min-width: 80px;
    &.little {
      font-size: 14px;
    }
  }
}
.loop-type-input-container {
  height: 36px;
  margin-bottom: 10px;
  .left-input {
    width: 90px;
  }
  .right-input {
    width: 120px;
  }
}
.user-agreement-container {
  max-width: 554px;
  height: 345px;
  border-radius: 8px;
  background: #fafafa;
  border: 1px solid #e0e0e0;
  padding: 11px 16px 11px 10px;
  overflow: auto;
  margin-bottom: 16px;
  font-size: 13px;
  line-height: 18px;
  scroll-padding: 50px 0 0 50px;
  &::-webkit-scrollbar {
    width: 14px;
  }

  &::-webkit-scrollbar-thumb {
    border: 4px solid rgba(0, 0, 0, 0);
    background-clip: padding-box;
    border-radius: 9999px;
    background-color: #757575;
  }
}
.email-login-error {
  max-width: 554px;
  background: rgba(245, 108, 108, 0.2);
}
</style>
