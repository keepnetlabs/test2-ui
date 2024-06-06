<template>
  <FormGroup
    class-name="email-template input-phishing-link mt-2 p-4"
    :title="title"
    :sub-title="subtitle"
  >
    <div class="d-flex" style="max-width: 980px;">
      <KSelect
        :value="value.urlSchemaTypeId"
        item-disabled="disabled"
        item-text="text"
        item-value="value"
        outlined
        persistent-hint
        class="same-width"
        style="max-width: 102px;"
        placeholder="Select URL schema"
        :menu-props="{ offsetY: true }"
        :items="getUrlSchemaTypesModified"
        @change="handleInputChange($event, 'urlSchemaTypeId')"
      ></KSelect>
      <VTextField
        :value="value.subDomain"
        ref="refSubdomain"
        required
        placeholder="subdomain"
        hint="*Required"
        outlined
        dense
        persistent-hint
        class="same-width"
        :rules="subdomainRules"
        @input="handleInputChange($event, 'subDomain')"
      />
      <KSelect
        :value="value.domainRecordId"
        item-disabled="disabled"
        item-text="text"
        item-value="value"
        outlined
        persistent-hint
        label="Domain"
        class="same-width"
        placeholder="Select domain record"
        required
        :menu-props="{ offsetY: true }"
        :items="domainRecords"
        :rules="[(v) => Validations.required(v, labels.Required)]"
        @input="handleChangeDomainRecord($event)"
      ></KSelect>
      <KSelect
        :value="value.pathTypeId"
        item-disabled="disabled"
        item-text="text"
        item-value="value"
        outlined
        persistent-hint
        class="same-width"
        placeholder="/path"
        :items="pathTypes"
        :menu-props="{ offsetY: true }"
        @input="handleInputChange($event, 'pathTypeId')"
      ></KSelect>
      <KSelect
        :value="value.extensionTypeId"
        item-disabled="disabled"
        item-text="text"
        item-value="value"
        outlined
        persistent-hint
        class="same-width"
        placeholder="extension"
        :items="extensionTypes"
        :menu-props="{ offsetY: true }"
        @input="handleInputChange($event, 'extensionTypeId')"
      ></KSelect>
      <KSelect
        :value="value.parameterTypeId"
        item-disabled="disabled"
        item-text="text"
        item-value="value"
        outlined
        persistent-hint
        label="Parameter"
        class="same-width"
        placeholder="Select Parameter"
        :items="parameterTypes"
        :menu-props="{ offsetY: true }"
        @input="handleInputChange($event, 'parameterTypeId')"
      ></KSelect>
    </div>
    <div style="max-width: 980px;">
      <VTextField
        v-model.trim="disabledLabel"
        style="max-width: 100% !important;"
        outlined
        dense
        persistent-hint
        disabled
        label="Your link is"
      />
    </div>
  </FormGroup>
</template>

<script>
import FormGroup from '@/components/SmallComponents/FormGroup.vue'
import * as Validations from '@/utils/validations'
import labels from '@/model/constants/labels'
import { createRandomCryptStringNumber } from '@/utils/functions'
import KSelect from '@/components/Common/Inputs/KSelect.vue'
export default {
  name: 'InputPhishingLink',
  components: { KSelect, FormGroup },
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
      return this.urlSchemaTypesModified.length ? this.urlSchemaTypesModified : this.urlSchemaTypes
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
    'value.domainRecordId'() {
      this.changeDisabledLabel()
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
  },
  methods: {
    handleInputChange(value, key) {
      this.$emit('input', {
        ...this.value,
        [key]: value.trim()
      })
      this.changeDisabledLabel()
    },
    setDefaultValue() {
      this.$emit('input', {
        ...this.value,
        urlSchemaTypeId: this.getUrlSchemaTypesModified[0]?.value || '',
        domainRecordId: this.domainRecords[0]?.value || '',
        pathTypeId: this.pathTypes[0]?.value || '',
        extensionTypeId: this.extensionTypes[0]?.value || '',
        parameterTypeId: this.parameterTypes[0]?.value || ''
      })
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
        this.urlSchemaTypesModified = this.urlSchemaTypesModified.map((schema) => {
          const activeVal = domainRecord?.extraDatas[0]?.value
          if (activeVal === '3') {
            schema.disabled = false
          } else {
            schema.disabled = domainRecord?.extraDatas[0]?.value !== schema.value
          }
          return schema
        })
        this.handleInputChange(
          domainRecord?.extraDatas[0]?.text === 'Both' ? '2' : domainRecord?.extraDatas[0]?.value,
          'urlSchemaTypeId'
        )
      })
    }
  }
}
</script>
