<template>
  <div
    class="vqb-group investigation-query-group pa-6 mb-2"
    style="padding-bottom: 18px;"
    :id="`playbook-query-builder-group-${index}`"
  >
    <div
      v-if="getCustomBadgeRender"
      class="custom-group-badge"
      :id="`playbook-query-builder-group-logical-operator-custom-group-badge-${index}`"
      :style="{ left: $parent.query.logicalOperator === 'AND' ? '-60px' : '-57px' }"
    >
      {{ $parent.query.logicalOperator }}
    </div>
    <div class="vqb-group-heading card-header">
      <div class="match-type-container d-flex">
        <div
          class="match-type-container__buttons"
          :id="`playbook-query-builder-group-logical-operator-${index}`"
        >
          <span
            style="position: absolute;"
            :class="{
              'match-type-container__buttons--active':
                query.logicalOperator === `${labels.matchTypes[1].label}`,
              'match-type-container__buttons--animate-2':
                query.logicalOperator === `${labels.matchTypes[1].label}` && !blockAnimation
            }"
          ></span>
          <span
            style="z-index: 88; color: white;"
            :class="{
              'match-type-container__buttons--active-1':
                query.logicalOperator === `${labels.matchTypes[1].label}`
            }"
            @click="handleLogicalOperatorChange(`${labels.matchTypes[1].label}`)"
            >AND</span
          >
          <span
            style="position: absolute; left: 66.5px;"
            :class="{
              'match-type-container__buttons--active':
                query.logicalOperator === `${labels.matchTypes[0].label}`,
              'match-type-container__buttons--animate-1':
                query.logicalOperator === `${labels.matchTypes[0].label}` && !blockAnimation
            }"
          ></span>
          <span
            :class="{
              'match-type-container__buttons--active-2':
                query.logicalOperator === `${labels.matchTypes[0].label}`
            }"
            style="z-index: 88; color: white;"
            @click="handleLogicalOperatorChange(`${labels.matchTypes[0].label}`)"
            >OR</span
          >
        </div>
      </div>
    </div>
    <query-builder-children v-bind="$props" />
    <div class="vqb-group-body card-body">
      <div class="rule-actions">
        <v-btn
          v-if="depth === 1"
          :id="`playbook-query-builder-group-add-rule-${index}`"
          text
          color="#2196f3"
          class="mr-2"
          @click="addRule"
        >
          <v-icon>mdi-plus</v-icon> {{ labels.addRule }}
        </v-btn>
      </div>
      <slot name="group-footer"></slot>
    </div>
  </div>
</template>

<script>
import deepClone from 'vue-query-builder/src/utilities'
import { createRandomCryptNumber } from '@/utils/functions'
import QueryBuilderGroup from 'vue-query-builder/src/components/QueryBuilderGroup'
import QueryBuilderRule from '@/components/Investigation/InvestigationQueryRule'
export default {
  name: 'InvestigationQueryGroup',
  extends: QueryBuilderGroup,
  components: {
    // eslint-disable-next-line vue/no-unused-components
    QueryBuilderRule
  },
  provide() {
    return {
      checkOperandsDisabilityStatus: this.checkOperandsDisabilityStatus,
      handleInputSingularityChange: this.handleInputSingularityChange,
      removeErrorMessage: this.removeErrorMessage
    }
  },
  data() {
    return {
      blockAnimation: true,
      attachId: createRandomCryptNumber(),
      getCustomBadgeRender: this.depth !== 1
    }
  },
  watch: {
    query() {
      this.$nextTick(() => {
        if (this.depth === 1) {
          const childrenWrap = this.$children[0]
          childrenWrap.$children.forEach((item, index) => {
            item.getCustomBadgeRender = index !== childrenWrap.$children.length - 1
          })
        }
      })
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.query && this.query.children.length === 0) {
        this.addRule()
        this.getCustomBadgeRender = false
      }
    })
  },
  methods: {
    handleLogicalOperatorChange(value) {
      if (value !== this.query.logicalOperator) {
        this.blockAnimation = false
        this.query.logicalOperator = value
      }
      this.checkOperandsDisabilityStatus()
      this.$emit('logical-operator-change', this.query.logicalOperator)
    },
    checkOperandsDisabilityStatus() {
      this.rules[0].operands[0].children[1].isDisabled =
        this.query.logicalOperator === 'AND'
          ? this.query.children.some((child) => child.query.operand === 'from')
          : false
      this.rules[0].operands[0].children[6].isDisabled =
        this.query.logicalOperator === 'AND'
          ? this.query.children.some((child) => child.query.operand === 'ip')
          : false
    },
    checkAllSingularity() {
      this.query.children.forEach(({ query }, index) =>
        this.checkSingularity({ operand: query.operand, value: query.value }, index)
      )
    },
    handleInputSingularityChange(item, index = 0) {
      const safeItem = item ?? { operand: '', value: '' }
      this.checkSingularity(safeItem, index)
      this.checkAllSingularity()
    },
    checkSingularity(item, index = 0) {
      const safeItem = item ?? { operand: '', value: '' }
      if (!safeItem.operand && !safeItem.value) return
      let message = ''
      if (
        this.query.children.some(
          ({ query }, itemIndex) =>
            query.value &&
            query.value === safeItem.value &&
            query.operand === safeItem.operand &&
            index !== itemIndex &&
            itemIndex < index
        )
      )
        message = `There is already ${safeItem.operand} with same value`
      this.$set(this.rules[0].errorMessages, index, message)
    },
    removeErrorMessage(index) {
      this.rules[0].errorMessages.splice(index, 1)
      this.checkAllSingularity()
    },
    addRule() {
      let updated_query = deepClone(this.query)
      let child = {
        type: 'query-builder-rule',
        query: {
          rule: this.selectedRule.id,
          operand: null,
          value: ''
        }
      }
      if (this.ruleById(child.query.rule).type === 'multi-select') {
        child.query.value = []
      }
      updated_query.children.push(child)
      this.$emit('update:query', updated_query)
    }
  }
}
</script>
