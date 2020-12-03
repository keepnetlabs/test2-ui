<template>
  <!-- eslint-disable vue/no-v-html -->
  <div class="vqb-rule">
    <v-row>
      <!-- <label class="mr-5">{{ rule.label }}</label> -->
      <v-col md="2">
        <!-- List of operands (optional) -->
        <k-select
          v-model.trim="query.operand"
          :items="rule.operands"
          outlined
          min-width-type="small"
          nudge-width="20"
          @input="handleOperandChange"
        />
      </v-col>
      <v-col
        md="2"
        v-if="
          typeof rule.operators !== 'undefined' &&
          query.operand !== 'SenderIp' &&
          rule.operators.length > 1
        "
      >
        <!-- List of operators (e.g. =, !=, >, <) -->
        <k-select
          v-model="query.operator"
          :items="rule.operators"
          outlined
          item-value="value"
          min-width-type="small"
          item-text="text"
        />
      </v-col>
      <v-col md="2" v-if="query.operand === 'SenderIp'">
        <!-- List of "From" operands-->
        <k-select
          v-model.trim="query.operator"
          :items="rule.operandsSenderIP"
          outlined
          min-width-type="small"
        />
      </v-col>
      <template v-if="isOperatorExists">
        <v-col md="2" v-if="query.operand === 'From'">
          <!-- List of "From" operands-->
          <k-select
            min-width-type="small"
            v-model.trim="query.format"
            :items="rule.operandsFrom"
            outlined
            hide-details
          />
        </v-col>

        <v-col md="2" v-if="query.operand === 'To'">
          <!-- List of "From" operands-->
          <k-select
            min-width-type="small"
            v-model.trim="query.format"
            :items="rule.operandsTo"
            outlined
            hide-details
          />
        </v-col>
        <v-col md="2" v-if="query.operand === 'CC'">
          <!-- List of "From" operands-->
          <k-select
            min-width-type="small"
            v-model.trim="query.format"
            :items="rule.operandsCC"
            outlined
            hide-details
          />
        </v-col>
        <v-col md="2" v-if="query.operand === 'Analysis result'">
          <!-- List of "Analysis result" operands-->
          <k-select
            min-width-type="small"
            v-model="query.value"
            :items="rule.operandsAnalysisResult"
            outlined
          />
        </v-col>
        <v-col
          v-if="
            rule.type === 'conditions' &&
            query.operand !== 'Analysis result' &&
            query.operand !== 'SenderIp' &&
            query.operand !== 'Subject' &&
            query.operand !== 'Keyword' &&
            query.operand !== 'AttachmentName' &&
            query.operand !== 'AttachmentExtension' &&
            query.operand !== 'AttachmentHash'
          "
          md=""
          sm="10"
        >
          <!-- Condition text input-->
          <v-text-field
            v-model.trim="query.value"
            :placeholder="getPlaceholder()"
            outlined
            :rules="getRules()"
            autocomplete="disabled"
            md=""
            sm="10"
          />
        </v-col>
        <v-col v-if="query.operand === 'SenderIp'">
          <!-- Condition text input-->
          <InputIpAddress
            v-model.trim="query.value"
            placeholder="Enter IP or a regular expression"
            :rules="[
              (v) => validations.required(v, 'Required'),
              (v) => validations.startsWithSpace(v, 'Cannot start with space'),
              (v) => validations.ip(v, 'Invalid ip address')
            ]"
            md=""
            sm="10"
          />
        </v-col>
        <v-col v-if="query.operand === 'Subject'">
          <!-- Condition text input-->
          <v-text-field
            v-model.trim="query.value"
            placeholder="Enter subject or a regular expression"
            outlined
            :rules="getSubjectRules()"
            autocomplete="disabled"
            md=""
            sm="10"
          />
        </v-col>
        <v-col v-if="query.operand === 'Keyword'">
          <!-- Condition text input-->
          <v-text-field
            v-model.trim="query.value"
            placeholder="Enter keywords or a regular expression to search in email body"
            outlined
            :rules="getKeywordRules()"
            autocomplete="disabled"
            md=""
            sm="10"
          />
        </v-col>
        <v-col v-if="query.operand === 'AttachmentName'">
          <!-- Condition text input-->
          <v-text-field
            v-model.trim="query.value"
            placeholder="Enter file name or a regular expression"
            outlined
            :rules="getAttachmentNameRules()"
            autocomplete="disabled"
            md=""
            sm="10"
          />
        </v-col>
        <v-col v-if="query.operand === 'AttachmentExtension'">
          <v-text-field
            v-model.trim="query.value"
            placeholder="Enter file extension"
            outlined
            :rules="getAttachmentExtensionRules()"
            autocomplete="disabled"
            md=""
            sm="10"
          />
        </v-col>
        <v-col v-if="query.operand === 'AttachmentHash'">
          <v-text-field
            v-model.trim="query.value"
            placeholder="Enter SHA512 or MD5 hash"
            outlined
            :rules="getAttachmentHashRules()"
            autocomplete="disabled"
            md=""
            sm="10"
          />
        </v-col>
      </template>

      <v-col
        :md="query.operand === 'Analysis result' ? '6' : !isOperatorExists ? '8' : 'auto'"
        sm="2"
        class="text-right"
        style="
          padding-top: 18px !important;
          padding-left: 10px !important;
          padding-right: 18px !important;
        "
      >
        <!-- Remove rule button -->
        <v-btn icon v-if="isDeleteRuleButton()" @click="removeRule">
          <v-icon>mdi-close-circle</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import QueryBuilderRule from 'vue-query-builder/src/components/QueryBuilderRule'
import KSelect from '@/components/Common/Inputs/KSelect'
import * as validations from '../../../utils/validations'
import InputIpAddress from '@/components/Common/Inputs/InputIpAddress'
import labels from '@/model/constants/labels'
export default {
  extends: QueryBuilderRule,
  components: {
    InputIpAddress,
    KSelect
  },
  data() {
    return {
      validations: validations,
      attachId: null
    }
  },
  watch: {
    'query.operator'(newVal = '', oldVal = '') {
      if (newVal === 'Exists' || newVal === 'DoesNotExist') {
        this.query.format = ''
        this.query.value = ''
      }
      if (
        (oldVal === 'Exists' || oldVal === 'DoesNotExist') &&
        newVal !== 'Exists' &&
        newVal !== 'DoesNotExists'
      ) {
        this.query.format = 'Email'
      }
    }
  },
  computed: {
    isOperatorExists() {
      return this.query.operator !== 'Exists' && this.query.operator !== 'DoesNotExist'
    }
  },
  methods: {
    getAttachedItem(item) {
      item = `.${item}`
      return document.querySelector(item)
    },
    getRules() {
      switch (this.query && this.query.format) {
        case 'Email':
          return [
            (v) => this.validations.required(v, labels.Required),
            (v) => this.validations.mail(v, labels.InvalidEmailAddress),
            (v) => this.validations.maxLength(v, 64, labels.getMaxLengthMessage('Email'))
          ]
        case 'Domain':
          return [
            (v) => this.validations.required(v, labels.Required),
            (v) => this.validations.domain(v, 'Invalid domain name'),
            (v) => this.validations.maxLength(v, 256, labels.getMaxLengthMessage('Domain', 256))
          ]
        case 'Regex':
          return [
            (v) => this.validations.required(v, labels.Required),
            (v) => this.validations.maxLength(v, 64, labels.getMaxLengthMessage('Regex'))
          ]
        case 'Group':
          return [
            (v) => this.validations.required(v, labels.Required),
            (v) => this.validations.maxLength(v, 64, labels.getMaxLengthMessage('Group'))
          ]
        default:
          break
      }
    },
    getPlaceholder() {
      switch (this.query && this.query.format) {
        case 'Email':
          return 'Enter an email address'
        case 'Domain':
          return 'Enter a domain address'
        case 'Regex':
          return 'Enter a regular expression'
        case 'Group':
          return 'Enter a group name'
      }
    },
    getSenderIpRules() {
      return [
        (v) => this.validations.required(v, 'Required'),
        (v) => this.validations.ip(v, 'Invalid ip address')
      ]
    },
    getSubjectRules() {
      return [
        (v) => this.validations.required(v, labels.Required),
        (v) => this.validations.maxLength(v, 64, labels.getMaxLengthMessage('Subject', 64))
      ]
    },
    getKeywordRules() {
      return [
        (v) => this.validations.required(v, labels.Required),
        (v) => this.validations.maxLength(v, 64, labels.getMaxLengthMessage('Keyword', 64))
      ]
    },
    getAttachmentNameRules() {
      return [
        (v) => this.validations.required(v, labels.Required),
        (v) => this.validations.maxLength(v, 64, labels.getMaxLengthMessage('AttachmentName', 64))
      ]
    },
    getAttachmentExtensionRules() {
      return [
        (v) => this.validations.minLength(v, 3, labels.getMinLengthMessage('Extension', 3)),
        (v) => this.validations.extension(v, 'Invalid extension'),
        (v) => this.validations.maxLength(v, 10, labels.getMaxLengthMessage('Extension', 10))
      ]
    },
    getAttachmentHashRules() {
      return [
        (v) => this.validations.required(v, labels.Required),
        (v) =>
          this.validations.maxLength(v, 512, labels.getMaxLengthMessage('Attachment hash', 512))
      ]
    },
    handleOperandChange(value) {
      if (value === 'SenderIp') {
        this.query.operator = 'Equal'
        this.query.format = 'Ip'
      } else if (value === 'Analysis result') {
        this.query.value = 'Phishing'
      } else if (value === 'To' || value === 'CC' || value === 'From') {
        this.query.format = 'Email'
      }
    },
    removeRule() {
      this.remove()
    },
    isDeleteRuleButton() {
      let ruleCount = 0
      this.$parent.$parent.query.children.map((obj) => {
        if (obj.type === 'query-builder-rule') {
          ruleCount++
        }
      })
      return ruleCount > 1
    }
  },
  created() {
    this.attachId = `id-${Math.floor(Math.random() * 10000).toString()}`
    if (!this.query.format) {
      this.query.format = 'Email'
    }
  }
}
</script>
