<template>
  <div class="input-phishing-link-mini-wrapper">
    <div class="input-phishing-link-mini">
      <div class="input-phishing-link-mini__inputs">
        <div
          class="input-phishing-link-mini__input-group input-phishing-link-mini__input-group--narrow"
        >
          <KSelect
            label="Protocol"
            :value="value.urlSchemaTypeId"
            item-disabled="disabled"
            item-text="text"
            item-value="value"
            outlined
            persistent-hint
            dense
            hide-details
            placeholder="Select URL schema"
            :menu-props="{ offsetY: true }"
            :items="getUrlSchemaTypesModified"
            @change="handleInputChange($event, 'urlSchemaTypeId')"
          ></KSelect>
        </div>

        <div class="input-phishing-link-mini__input-group">
          <VTextField
            label="Subdomain"
            :value="value.subDomain"
            ref="refSubdomain"
            required
            placeholder="subdomain"
            outlined
            dense
            persistent-hint
            hide-details
            :rules="subdomainRules"
            @input="handleInputChange($event, 'subDomain')"
          />
        </div>

        <div class="input-phishing-link-mini__input-group">
          <KSelect
            label="Domain"
            :value="value.domainRecordId"
            item-disabled="disabled"
            item-text="text"
            item-value="value"
            outlined
            persistent-hint
            dense
            hide-details
            placeholder="Select domain record"
            required
            :menu-props="{ offsetY: true }"
            :items="domainRecords"
            :rules="[(v) => Validations.required(v, labels.Required)]"
            @input="handleChangeDomainRecord($event)"
          ></KSelect>
        </div>

        <div
          class="input-phishing-link-mini__input-group input-phishing-link-mini__input-group--narrow"
        >
          <KSelect
            label="Path"
            :value="value.pathTypeId"
            item-disabled="disabled"
            item-text="text"
            item-value="value"
            outlined
            persistent-hint
            dense
            hide-details
            placeholder="/path"
            :items="pathTypes"
            :menu-props="{ offsetY: true }"
            @input="handleInputChange($event, 'pathTypeId')"
          ></KSelect>
        </div>

        <div
          class="input-phishing-link-mini__input-group input-phishing-link-mini__input-group--narrow"
        >
          <KSelect
            label="Extension"
            :value="value.extensionTypeId"
            item-disabled="disabled"
            item-text="text"
            item-value="value"
            outlined
            persistent-hint
            dense
            hide-details
            placeholder="extension"
            :items="extensionTypes"
            :menu-props="{ offsetY: true }"
            @input="handleInputChange($event, 'extensionTypeId')"
          ></KSelect>
        </div>

        <div
          class="input-phishing-link-mini__input-group input-phishing-link-mini__input-group--narrow"
        >
          <KSelect
            label="Parameter"
            :value="value.parameterTypeId"
            item-disabled="disabled"
            item-text="text"
            item-value="value"
            outlined
            persistent-hint
            dense
            hide-details
            placeholder="Select Parameter"
            :items="parameterTypes"
            :menu-props="{ offsetY: true }"
            @input="handleInputChange($event, 'parameterTypeId')"
          ></KSelect>
        </div>
      </div>

      <div class="input-phishing-link-mini__simulation-link">
        <VTextField
          label="Simulation Link"
          v-model.trim="disabledLabel"
          outlined
          dense
          persistent-hint
          hide-details
          readonly
          class="input-phishing-link-mini__simulation-link-input"
        />
      </div>

      <div v-if="showCaptchaOption" class="input-phishing-link-mini__captcha">
        <VCheckbox
          :input-value="captchaEnabled"
          color="#2196f3"
          hide-details
          dense
          class="mt-2"
          @change="$emit('captcha-change', $event)"
        >
          <template #label>
            <span class="body-2">Stop bots to prevent false clicks.</span>
            <VTooltip bottom max-width="260">
              <template #activator="{ on, attrs }">
                <VIcon size="20" class="ml-1" v-bind="attrs" v-on="on" @click.stop>mdi-information</VIcon>
              </template>
              <span>When enabled, bot activity is detected and blocked, preventing false clicks.</span>
            </VTooltip>
          </template>
        </VCheckbox>
      </div>
    </div>
  </div>
</template>

<script>
import * as Validations from '@/utils/validations'
import labels from '@/model/constants/labels'
import { createRandomCryptStringNumber } from '@/utils/functions'
import KSelect from '@/components/Common/Inputs/KSelect.vue'
export default {
  name: 'InputPhishingLinkMini',
  components: { KSelect },
  props: {
    value: {
      type: Object,
      default() {
        return {
          urlSchemaTypeId: '',
          subDomain: '',
          domainRecordId: '',
          pathTypeId: '',
          extensionTypeId: '',
          parameterTypeId: ''
        }
      }
    },
    title: {
      type: String,
      default: 'Phishing Link'
    },
    subtitle: {
      type: String,
      default: 'Create a phishing link for users to click and be directed to the landing page'
    },
    parameterTypes: {
      type: Array,
      default: () => []
    },
    extensionTypes: {
      type: Array,
      default: () => []
    },
    pathTypes: {
      type: Array,
      default: () => []
    },
    domainRecords: {
      type: Array,
      default: () => []
    },
    urlSchemaTypes: {
      type: Array,
      default: () => []
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    showCaptchaOption: {
      type: Boolean,
      default: false
    },
    captchaEnabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      Validations,
      labels,
      urlSchemaTypesModified: [],
      disabledLabel: '',
      subdomainRules: [],
      httpRules: [
        (v) => Validations.required(v, labels.Required),
        (v) => Validations.subdomainBlacklist(v),
        (v) => Validations.subdomainDash(v, 'Only (-) is allowed as special character'),
        (v) => Validations.startsOrEndsWithHyphen(v)
      ],
      httpsRules: [
        (v) => Validations.required(v, labels.Required),
        (v) => Validations.subdomainBlacklist(v),
        (v) => Validations.subdomainDash(v, 'Only (-) is allowed as special character'),
        (v) => Validations.startsOrEndsWithHyphen(v)
      ]
    }
  },
  computed: {
    getUrlSchemaTypesModified() {
      const baseList = this.urlSchemaTypesModified.length
        ? this.urlSchemaTypesModified
        : this.urlSchemaTypes
      return baseList
    }
  },
  watch: {
    value: {
      deep: true,
      immediate: true,
      handler() {
        this.changeDisabledLabel()
        this.$nextTick(() => {
          if (this.$refs.refSubdomain) {
            this.$refs.refSubdomain.validate()
          }
        })
      }
    },
    disabledLabel(val) {
      this.$emit('link-change', val)
    },
    'value.urlSchemaTypeId': {
      immediate: true,
      handler(val) {
        this.subdomainRules = val === '1' ? this.httpRules : this.httpsRules
        this.$nextTick(() => {
          if (this.$refs.refSubdomain) {
            this.$refs.refSubdomain.validate()
          }
        })
      }
    },
    'value.domainRecordId'(val) {
      this.changeDisabledLabel()
      if (val) this.checkSchemaTypes(val)
    },
    'value.parameterTypeId'() {
      this.changeDisabledLabel()
    },
    'value.subDomain'() {
      this.changeDisabledLabel()
    },
    'value.pathTypeId'() {
      this.changeDisabledLabel()
    }
  },
  mounted() {
    if (!this.isEdit) this.setDefaultValue()
    if (this.isEdit && this.value?.domainRecordId) {
      this.checkSchemaTypes(this.value.domainRecordId)
    }
  },
  methods: {
    handleInputChange(value, key) {
      this.$emit('input', {
        ...this.value,
        [key]: value?.trim?.() || ''
      })
      this.changeDisabledLabel()
    },
    setDefaultValue() {
      this.$emit('input', {
        ...this.value,
        urlSchemaTypeId: this.getUrlSchemaTypesModified[0]?.value || '',
        subDomain: 'www',
        domainRecordId: this.domainRecords[0]?.value || '',
        pathTypeId: this.pathTypes[0]?.value || '',
        extensionTypeId: this.extensionTypes[0]?.value || '',
        parameterTypeId: this.parameterTypes[0]?.value || ''
      })
      this.$emit('invisible-captcha', !this.domainRecords[0]?.extraDatas[1]?.value)
      this.$emit('captcha-default-value', this.domainRecords[0]?.extraDatas[1]?.value)
      this.checkSchemaTypes(this.domainRecords[0]?.value)
    },
    changeDisabledLabel() {
      this.disabledLabel = `${
        this.getUrlSchemaTypesModified.find(
          (item) => item.value === this.value.urlSchemaTypeId?.toString() || ''
        )?.text
      }${this.value.subDomain || 'subDomain'}.${
        this.domainRecords.find(
          (item) => item.value === this.value.domainRecordId?.toString() || ''
        )?.text || 'noDomain'
      }/${
        this.pathTypes.find((item) => item.value === this.value.pathTypeId?.toString() || '')
          ?.text || 'noPath'
      }${
        this.extensionTypes.find(
          (item) => item.value === this.value.extensionTypeId?.toString() || ''
        )?.text || 'noExtension'
      }?${
        this.parameterTypes.find(
          (item) => item.value === this.value.parameterTypeId?.toString() || ''
        )?.text
      }=${createRandomCryptStringNumber()}`
    },
    handleChangeDomainRecord(value) {
      this.handleInputChange(value, 'domainRecordId')
      this.checkSchemaTypes(value)
      this.changeDisabledLabel()
    },
    checkSchemaTypes(value) {
      this.$nextTick(() => {
        const domainRecord = this.domainRecords.find((item) => item.value === value)
        this.urlSchemaTypesModified = this.getUrlSchemaTypesModified.map((schema) => {
          const activeVal = domainRecord?.extraDatas[0]?.value
          if (activeVal === '3' || activeVal === '2') {
            schema.disabled = false
          } else {
            schema.disabled = domainRecord?.extraDatas[0]?.value !== schema.value
          }
          return schema
        })
        // Edit mode: if domain is HTTP-only, force schema to HTTP
        const activeVal = domainRecord?.extraDatas[0]?.value
        if (this.isEdit && activeVal === '1' && this.value?.urlSchemaTypeId?.toString() !== '1') {
          this.handleInputChange('1', 'urlSchemaTypeId')
        }
        if (!this.isEdit) {
          this.handleInputChange(
            domainRecord?.extraDatas[0]?.text === 'Both' ? '2' : domainRecord?.extraDatas[0]?.value,
            'urlSchemaTypeId'
          )
        }
        this.$emit('invisible-captcha', !domainRecord?.extraDatas[1]?.value)
        this.$emit('captcha-default-value', domainRecord?.extraDatas[1]?.value)
      })
    }
  }
}
</script>

