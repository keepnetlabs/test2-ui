<template>
  <!-- eslint-disable vue/no-v-html -->
  <div class="vqb-rule">
    <v-row>
      <!-- <label class="mr-5">{{ rule.label }}</label> -->
      <v-col md="2">
        <!-- List of operands (optional) -->
        <v-select
          v-model.trim="query.operand"
          :items="rule.operands"
          outlined
          hide-details
          :menu-props="{ offsetY: true }"
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
        <v-select
          v-model="query.operator"
          :items="rule.operators"
          outlined
          hide-details
          item-value="value"
          :menu-props="{ offsetY: true }"
          item-text="text"
        />
      </v-col>
      <v-col md="2" v-if="query.operand === 'SenderIp'">
        <!-- List of "From" operands-->
        <v-select
          v-model.trim="query.operator"
          :items="rule.operandsSenderIP"
          outlined
          hide-details
          :menu-props="{ offsetY: true }"
        />
      </v-col>
      <v-col md="2" v-if="query.operand === 'From'">
        <!-- List of "From" operands-->
        <v-select
          v-model.trim="query.format"
          :items="rule.operandsFrom"
          outlined
          hide-details
          :menu-props="{ offsetY: true }"
        />
      </v-col>
      <v-col md="2" v-if="query.operand === 'To'">
        <!-- List of "From" operands-->
        <v-select
          v-model.trim="query.format"
          :items="rule.operandsTo"
          outlined
          hide-details
          :menu-props="{ offsetY: true }"
        />
      </v-col>
      <v-col md="2" v-if="query.operand === 'CC'">
        <!-- List of "From" operands-->
        <v-select
          v-model.trim="query.format"
          :items="rule.operandsCC"
          outlined
          hide-details
          :menu-props="{ offsetY: true }"
        />
      </v-col>
      <v-col md="2" v-if="query.operand === 'Analysis result'">
        <!-- List of "Analysis result" operands-->
        <v-select
          v-model="query.value"
          :items="rule.operandsAnalysisResult"
          outlined
          :menu-props="{ offsetY: true }"
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
            (v) => validations.startsWithSpace(v, 'Cannot start with space')
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
      <v-col
        :md="query.operand === 'Analysis result' ? '6' : 'auto'"
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
import * as validations from '../../../utils/validations'
import InputIpAddress from '@/components/Common/Inputs/InputIpAddress'
export default {
  extends: QueryBuilderRule,
  components: {
    InputIpAddress
  },
  data() {
    return {
      validations: validations
    }
  },
  methods: {
    getRules() {
      switch (this.query && this.query.format) {
        case 'Email':
          return [
            (v) => this.validations.required(v, 'Required'),
            (v) => this.validations.mail(v, 'Invalid email address'),
            (v) => this.validations.maxLength(v, 250, 'Invalid email address')
          ]
        case 'Domain':
          return [
            (v) => this.validations.required(v, 'Required'),
            (v) => this.validations.domain(v, 'Invalid domain name')
          ]
        case 'Regex':
          return [(v) => this.validations.required(v, 'Required')]
        case 'Group':
          return [(v) => this.validations.required(v, 'Required')]
        default:
          break
      }
    },
    getPlaceholder() {
      switch (this.query && this.query.format) {
        case 'Email':
          return 'Enter email address'
        case 'Domain':
          return 'Enter domain address'
        case 'Regex':
          return 'Enter regular expression'
        case 'Group':
          return 'Enter group name'
      }
    },
    getSenderIpRules() {
      return [
        (v) => this.validations.required(v, 'Required'),
        (v) => this.validations.ip(v, 'Invalid ip address')
      ]
    },
    getSubjectRules() {
      return [(v) => this.validations.required(v, 'Required')]
    },
    getKeywordRules() {
      return [(v) => this.validations.required(v, 'Required')]
    },
    getAttachmentNameRules() {
      return [(v) => this.validations.required(v, 'Required')]
    },
    getAttachmentExtensionRules() {
      return [
        (v) => this.validations.required(v, 'Required'),
        (v) => this.validations.extension(v, 'Invalid extension Type')
      ]
    },
    getAttachmentHashRules() {
      return [
        (v) => this.validations.required(v, 'Required'),
        (v) => this.validations.maxLength(v, 512, 'Max 512 characters')
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
    if (!this.query.format) {
      this.query.format = 'Email'
    }
  }
}
</script>
