<template>
  <div class="vqb-rule" :id="`query-builder-rule-${index}-${getParentIndex}`">
    <div
      v-if="getBadgeRender"
      :id="`playbook-query-builder-rule-logical-operator-custom-group-badge-${index}-${getParentIndex}`"
      class="custom-rule-badge"
      :style="{ left: $parent.query.logicalOperator === 'AND' ? '-60px' : '-57px' }"
    >
      {{ $parent.query.logicalOperator }}
    </div>
    <v-row>
      <v-col md="3">
        <TreeSelect
          v-model="query.operand"
          class="filter-list-select k-treeselect mb-4"
          disable-branch-nodes
          placeholder="Select filter"
          :clearable="false"
          :options="rule.operands"
          :max-height="320"
          @input="handleOperandChange"
        />
      </v-col>
      <v-col>
        <v-text-field
          v-show="query.operand"
          v-model.trim="query.value"
          ref="refTextField"
          :id="`input--query-builder-value-${index}-${getParentIndex}`"
          outlined
          autocomplete="off"
          :placeholder="getPlaceholder"
          :rules="getRules"
          :error-messages="getErrorMessages"
          @change="checkSingularity"
        />
      </v-col>
      <v-col
        md="auto"
        sm="2"
        class="text-right"
        style="
          padding-top: 18px !important;
          padding-left: 10px !important;
          padding-right: 18px !important;
        "
      >
        <v-btn
          v-if="isDeleteRuleButton()"
          :id="`btn--query-builder-close-${index}-${getParentIndex}}`"
          icon
          @click="removeRule"
        >
          <v-icon>mdi-close-circle</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import QueryBuilderRule from 'vue-query-builder/src/components/QueryBuilderRule'
import { createRandomCryptStringNumber } from '@/utils/functions'
import TreeSelect from '@riophae/vue-treeselect'
export default {
  name: 'InvestigationQueryRule',
  components: { TreeSelect },
  extends: QueryBuilderRule,
  inject: {
    checkOperandsDisabilityStatus: {
      type: Function,
      default: () => undefined
    },
    handleInputSingularityChange: {
      type: Function,
      default: () => undefined
    },
    removeErrorMessage: {
      type: Function,
      default: () => undefined
    }
  },
  data() {
    return {
      attachId: null,
      getBadgeRender: false
    }
  },
  watch: {
    '$parent.query.children'() {
      const { $children } = this.$parent
      this.getBadgeRender =
        $children && $children.length && $children[$children.length - 1].attachId !== this.attachId
    }
  },
  computed: {
    isOperatorExists() {
      return this.query.operator !== 'Exists' && this.query.operator !== 'DoesNotExist'
    },
    getParentIndex() {
      if (this.$parent && this.$parent.$parent && this.$parent.$parent.index) {
        return this.$parent.$parent.index
      } else {
        return '0'
      }
    },
    getPlaceholder() {
      return this.rule.placeholders[this.query.operand]
    },
    getRules() {
      if (['from', 'to', 'cc', 'bcc'].includes(this.query.operand))
        return this.rule.textFieldValidations.emailOrDomain
      return this.rule.textFieldValidations[this.query.operand] || []
    },
    getErrorMessages() {
      return this.rule.errorMessages[this.index]
    }
  },
  created() {
    this.attachId = `id-${createRandomCryptStringNumber()}`
  },
  methods: {
    removeRule() {
      this.removeErrorMessage(this.index)
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
    },
    handleOperandChange() {
      this.checkOperandsDisabilityStatus()
      this.$nextTick(() => this.$refs.refTextField.validate())
      this.checkSingularity()
    },
    checkSingularity() {
      this.handleInputSingularityChange({
        operand: this.query.operand,
        value: this.query.value
      })
    }
  }
}
</script>
