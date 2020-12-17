<template>
  <app-modal
    v-if="status"
    :status="status"
    @closeOverlay="closeOverlay"
    @submit="submit"
    :title="'New SMTP Setting'"
    icon-name="mdi-mailbox"
    class-name="new-smtp-setting"
    :saveDisable="saveDisable"
  >
    <template v-slot:overlay-body>
      <app-modal-body-header
        title="SMTP Server Settings"
        sub-title="Fill information and credentials"
      />
      <v-form ref="refForm">
        <form-group title="SMTP Setting Name" has-hint>
          <v-text-field
            placeholder="Enter SMTP setting name"
            outlined
            dense
            v-model.trim="formValues.name"
            hint="*Required"
            persistent-hint
            :rules="[(v) => validations.required(v, 'Required')]"
          ></v-text-field>
        </form-group>
        <form-group title="Service Provider" has-hint>
          <k-select
            v-model.trim="formValues.serviceProvider"
            :items="serviceProviderItems"
            class="new-integration__select"
            dense
            outlined
            hint="*Required"
            item-text="name"
            item-value="code"
            :menu-props="{ offsetY: true }"
            persistent-hint
            @change="handleChangeServiceProvider"
            :rules="[(v) => validations.required(v)]"
            placeholder="Select option"
          ></k-select>
        </form-group>
        <form-group title="SMTP Server Address" has-hint>
          <div class="new-smtp-setting__server-address-container">
            <InputUrl
              placeholder="Server URL or IP Address"
              v-model.trim="formValues.serverAddress"
              :rules="[(v) => validations.required(v), (v) => validations.startsWithSpace(v)]"
            ></InputUrl>
            <v-text-field
              placeholder="Port"
              outlined
              ref="refTextField"
              dense
              @input="onPortChange"
              :rules="[(v) => validations.required(v)]"
              :value="formValues.serverPort"
            ></v-text-field>
          </div>
        </form-group>
        <form-group title="User Name or Email Address" has-hint>
          <v-text-field
            placeholder="Enter username"
            outlined
            dense
            v-model.trim="formValues.userName"
            hint="*Required"
            persistent-hint
            :rules="[(v) => validations.required(v, 'Required')]"
          ></v-text-field>
        </form-group>
        <form-group title="Password" has-hint>
          <v-text-field
            placeholder="Enter password"
            outlined
            dense
            v-model.trim="formValues.password"
            hint="*Required"
            persistent-hint
            :type="showPassword ? 'text' : 'password'"
            :append-icon="showPassword ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"
            class="username-field input-group--focused"
            @click:append="showPassword = !showPassword"
            :rules="[(v) => validations.required(v, 'Required')]"
          ></v-text-field>
        </form-group>
        <form-group>
          <v-checkbox
            v-model="formValues.useAuthentication"
            class="mt-n3 mb-1"
            color="#2196f3"
            label="Use Authentication"
          />
          <v-checkbox v-model="formValues.useSSL" class="mb-1" color="#2196f3" label="Use SSL" />
          <v-checkbox
            v-model="formValues.hasSMTPRelay"
            class="mb-2"
            color="#2196f3"
            label="Has SMTP Relay"
          />
        </form-group>
        <form-group
          title="Make Available For"
          sub-title="Companies that will see this setting in their libraries"
          has-hint
        >
          <Treeselect
            :class="['k-treeselect', { 'k-treeselect--error': !isAvailableForValid }]"
            v-model="formValues.availableForRequests"
            :options="treeSelectOptions"
            placeholder="Enter make an available for"
            value-format="object"
            clear-on-select
            disable-branch-nodes
            multiple
            search-nexted
            show-count
            @close="validateAvailableFor"
          />
          <div
            v-if="isAvailableForValidated && !isAvailableForValid"
            class="v-text-field__details checkbox-error"
          >
            <transition appear name="bounce">
              <div class="v-messages theme--light error--text" role="alert">
                <div class="v-messages__wrapper">
                  <div class="v-messages__message" style="padding-left: 10px;">
                    Required
                  </div>
                </div>
              </div>
            </transition>
          </div>
          <div v-else class="v-messages theme--light" role="alert">
            <div class="v-messages__wrapper">
              <div class="v-messages__message" style="padding-left: 10px; font-size: 9px;">
                *Required
              </div>
            </div>
          </div>
        </form-group>
        <form-group title="Reply to">
          <InputEmail
            placeholder="Enter Reply to"
            v-model.trim="formValues.replyTo"
            :hint="null"
            :persistent-hint="false"
            :required="false"
          />
        </form-group>
        <form-group title="Error to">
          <InputEmail
            placeholder="Enter Error to"
            v-model.trim="formValues.errorTo"
            :hint="null"
            :persistent-hint="false"
            :required="false"
          />
        </form-group>
        <form-group title="CC">
          <InputEmail
            placeholder="Enter CC address"
            v-model.trim="formValues.cC"
            :hint="null"
            :persistent-hint="false"
            :required="false"
          />
        </form-group>
        <form-group title="BCC">
          <InputEmail
            placeholder="Enter BCC address"
            v-model.trim="formValues.bCC"
            :hint="null"
            :persistent-hint="false"
            :required="false"
          />
        </form-group>
        <form-group title="Custom Header">
          <v-textarea
            outlined
            dense
            rows="2"
            no-resize
            placeholder="Enter Custom Header"
            height="100"
            v-model.trim="formValues.customHeader"
          ></v-textarea>
        </form-group>
      </v-form>
    </template>
  </app-modal>
</template>

<script>
import AppModal from '@/components/AppModal'
import AppModalBodyHeader from '@/components/SmallComponents/AppModalBodyHeader'
import FormGroup from '@/components/SmallComponents/FormGroup'
import * as validations from '@/utils/validations'
import { scrollToComponent } from '@/utils/functions'
import { getLookupListByTypeId } from '@/api/common'
import {
  createSMTPSettings,
  getSmtpSettings,
  searchAvailableFor,
  updateSmtpSettings
} from '@/api/smtpSettings'
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'
import KSelect from '@/components/Common/Inputs/KSelect'
import InputUrl from '@/components/Common/Inputs/InputUrl'
import InputEmail from '@/components/Common/Inputs/InputEmail'
import Treeselect from '@riophae/vue-treeselect'
export default {
  name: 'NewSmtpSettings',
  components: {
    KSelect,
    AppModal,
    AppModalBodyHeader,
    FormGroup,
    InputUrl,
    InputEmail,
    Treeselect
  },
  props: {
    status: {
      type: Boolean,
      default: false
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    resourceId: {
      type: String
    }
  },
  data() {
    return {
      isAvailableForValidated: false,
      isAvailableForValid: true,
      saveDisable: false,
      formValues: {
        name: '',
        availableForRequests: [],
        serviceProvider: '',
        serverAddress: '',
        serverPort: '',
        userName: '',
        password: '',
        useAuthentication: false,
        useSSL: false,
        hasSMTPRelay: false,
        replyTo: '',
        errorTo: '',
        cC: '',
        bCC: '',
        customHeader: ''
      },
      showPassword: false,
      searchAvailableForPayload: {
        pageNumber: 1,
        pageSize: 1000,
        orderBy: 'CreateTime',
        ascending: false
      },
      serviceProviderItems: [],
      treeSelectOptions: [
        {
          id: 'MyCompanyOnly',
          label: 'My company only',
          type: 'MyCompanyOnly',
          resourceId: null
        },
        {
          id: 'AllCompanies',
          label: 'All companies',
          type: 'AllCompanies',
          resourceId: null
        },
        {
          id: 'Group',
          label: 'Company Groups',
          children: []
        },
        {
          id: 'Company',
          label: 'Companies',
          children: []
        }
      ],
      validations: validations
    }
  },
  methods: {
    validateAvailableFor(value = {}) {
      this.isAvailableForValidated = true
      this.isAvailableForValid = !!value.length
    },
    submit() {
      const refForm = this.$refs.refForm
      this.validateAvailableFor(this.formValues.availableForRequests)
      if (refForm.validate() && this.isAvailableForValid) {
        this.saveDisable = true
        const {
          name,
          serverAddress,
          serverPort,
          userName,
          password,
          useAuthentication,
          useSSL,
          hasSMTPRelay,
          replyTo,
          errorTo,
          cC,
          bCC,
          customHeader,
          availableForRequests
        } = this.formValues

        const payload = {
          name,
          availableForRequests: availableForRequests.map((item) => {
            let { resourceId, type, id } = item
            return {
              resourceId: resourceId ? resourceId : id,
              type
            }
          }),
          serverAddress,
          serverPort,
          userName,
          password,
          useAuthentication: Number(useAuthentication),
          useSSL: Number(useSSL),
          hasSMTPRelay: Number(hasSMTPRelay),
          replyTo,
          errorTo,
          cC,
          bCC,
          customHeader
        }

        if (this.isEdit) {
          this.callForUpdateSmtpSettings(payload)
        } else {
          this.callForCreateSmtpSettings(payload)
        }
      } else {
        return this.$nextTick(() => {
          this.saveDisable = false
          const el = refForm.$el.querySelector('.error--text')
          scrollToComponent(el)
        })
      }
    },
    callForCreateSmtpSettings(payload = {}) {
      createSMTPSettings(payload)
        .then(() => {
          this.$store.dispatch('common/createSnackBar', {
            message: 'New SMTP settings has been created',
            color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
            icon: 'mdi-check-circle'
          })
          this.saveDisable = false
          this.$emit('closeOverlayWithUpdate')
        })
        .catch(() => {
          this.$store.dispatch('common/createSnackBar', {
            color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
            message: 'New SMTP settings can not be created'
          })
          this.saveDisable = false
        })
    },
    callForSearchAvailableFor() {
      return searchAvailableFor(this.searchAvailableForPayload).then((response) => {
        const { data: { data = {} } = {} } = response
        const { companies = {}, groups = {} } = data
        this.$set(this.treeSelectOptions, 3, {
          ...this.treeSelectOptions[3],
          children: companies.results.map((item) => {
            return {
              id: item['companyResourceId'],
              label: item.companyName,
              resourceId: item['companyResourceId'],
              type: 'Company'
            }
          })
        })
        this.$set(this.treeSelectOptions, 2, {
          ...this.treeSelectOptions[2],
          children: groups.results.map((item) => {
            return { id: item.resourceId, label: item.name, type: 'Group' }
          })
        })
      })
    },
    callForUpdateSmtpSettings(payload = {}) {
      updateSmtpSettings({ ...payload, resourceId: this.resourceId })
        .then(() => {
          this.$store.dispatch('common/createSnackBar', {
            message: 'SMTP settings have been updated',
            color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
            icon: 'mdi-check-circle'
          })
          this.saveDisable = false
          this.$emit('closeOverlayWithUpdate')
        })
        .catch(() => {
          this.$store.dispatch('common/createSnackBar', {
            color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
            message: 'New SMTP settings can not be updated'
          })
          this.saveDisable = false
        })
    },
    handleChangeServiceProvider(item = '') {
      if (item !== ':') {
        const [serverAddress, serverPort] = item.split(':')
        this.formValues.serverAddress = serverAddress
        this.formValues.serverPort = serverPort
      } else {
        this.formValues.serverAddress = ''
        this.formValues.serverPort = ''
      }
    },
    closeOverlay() {
      this.$emit('closeOverlay')
    },
    onPortChange(val) {
      const numberVal = Number(val)
      const newVal = isNaN(numberVal) ? '' : val
      const renderedValue = /[0-9]/gi.test(newVal) ? newVal : this.formValues.serverPort
      this.formValues.serverPort = renderedValue
      this.$refs.refTextField.lazyValue = renderedValue
    },
    callForGetSmtpSettings() {
      getSmtpSettings(this.resourceId).then((response) => {
        const {
          data: {
            data: {
              cc,
              bcc,
              customHeader,
              errorTo,
              hasSMTPRelay,
              name,
              password,
              replyTo,
              serverAddress,
              serverPort,
              useAuthentication,
              useSSL,
              userName,
              availableForList
            } = {}
          } = {}
        } = response
        this.formValues.availableForRequests = availableForList.map((item) => {
          let { resourceId: id, typeName } = item
          let label
          let resourceId = id
          if (typeName === 'MyCompanyOnly') {
            label = 'My company only'
            resourceId = null
          } else if (typeName === 'AllCompanies') {
            label = 'All companies'
            resourceId = null
          }
          return {
            id,
            type: typeName,
            resourceId,
            label
          }
        })
        this.formValues.cC = cc
        this.formValues.bCC = bcc
        this.formValues.customHeader = customHeader
        this.formValues.errorTo = errorTo
        this.formValues.hasSMTPRelay = hasSMTPRelay
        this.formValues.name = name
        this.formValues.password = password
        this.formValues.replyTo = replyTo
        this.formValues.serverAddress = serverAddress
        this.formValues.serverPort = serverPort
        this.formValues.useAuthentication = useAuthentication
        this.formValues.useSSL = useSSL
        this.formValues.userName = userName
        this.formValues.serviceProvider = `${serverAddress}:${serverPort}`
      })
    },
    setTreeSelectOptions(isDisabled = false) {
      this.$set(this.treeSelectOptions, 2, {
        ...this.treeSelectOptions[2],
        children: this.treeSelectOptions[2].children.map((item) => {
          return {
            ...item,
            isDisabled
          }
        })
      })
      this.$set(this.treeSelectOptions, 3, {
        ...this.treeSelectOptions[3],
        children: this.treeSelectOptions[3].children.map((item) => {
          return { ...item, isDisabled }
        })
      })
    }
  },
  watch: {
    'formValues.availableForRequests'(newVal, oldVal) {
      if (newVal) {
        if (newVal.some((item) => item.type === 'MyCompanyOnly')) {
          if (
            oldVal &&
            oldVal.some((item) => item.type === 'MyCompanyOnly') &&
            newVal.some((item) => item.type === 'AllCompanies')
          ) {
            this.formValues.availableForRequests = [this.treeSelectOptions[1]]
          } else if (newVal.length > 1) {
            this.$nextTick(() => {
              this.formValues.availableForRequests = [this.treeSelectOptions[0]]
            })
          }
          this.setTreeSelectOptions(true)
        } else if (newVal.some((item) => item.type === 'AllCompanies')) {
          if (newVal.length > 1) {
            this.$nextTick(() => {
              this.formValues.availableForRequests = [this.treeSelectOptions[1]]
            })
          }
          this.setTreeSelectOptions(true)
        } else {
          this.setTreeSelectOptions(false)
        }
        this.validateAvailableFor(newVal)
      }
    }
  },
  created() {
    this.callForSearchAvailableFor().finally(() => {
      if (this.isEdit && this.resourceId) {
        this.callForGetSmtpSettings()
      }
    })
    getLookupListByTypeId(12).then((response) => {
      const { data: { data = [] } = {} } = response
      this.serviceProviderItems = data
    })
  }
}
</script>

<style lang="scss">
.new-smtp-setting {
  &__server-address-container {
    display: flex;
    & > div:first-child {
      flex-basis: 90%;
    }
    & > div:last-child {
      flex-basis: 15%;
      margin-left: 16px;
    }
  }
}
[data-id='AllCompanies'],
[data-id='MyCompanyOnly'] {
  .vue-treeselect__checkbox-container {
    display: none;
  }
}
</style>
