<template>
  <!-- eslint-disable vue/no-v-html -->

  <div
    class="vqb-group pa-6 mb-2"
    style="padding-bottom: 18px;"
    :id="`playbook-query-builder-group-${index}`"
    :class="[
      depth === 1 && query.children.length <= 1 && 'vqb-disable',
      !isRenderFirstGroupHeader && 'vqb-hide-first-group-header',
      'elevation-' + (depth - 1).toString()
    ]"
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
      <div v-if="isRenderFirstGroupHeader" class="match-type-container d-flex">
        <div
          class="match-type-container__buttons"
          :id="`playbook-query-builder-group-logical-operator-${index}`"
          :class="{
            'match-type-container__buttons--first-depth': depth <= 1
          }"
        >
          <span
            style="position: absolute;"
            :class="{
              'match-type-container__buttons--active':
                query.logicalOperator === `${labels.matchTypes[1].label}`,
              'match-type-container__buttons--animate-2':
                query.logicalOperator === `${labels.matchTypes[1].label}` && !blockAnimation,
              'match-type-container__buttons--active-first-depth':
                query.logicalOperator === `${labels.matchTypes[1].label}` && depth <= 1
            }"
          ></span>
          <span
            style="z-index: 88; color: white;"
            :class="{
              'match-type-container__buttons--active-1':
                query.logicalOperator === `${labels.matchTypes[1].label}`,
              'match-type-container__buttons--active-first-depth':
                query.logicalOperator === `${labels.matchTypes[1].label}` && depth <= 1
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
                query.logicalOperator === `${labels.matchTypes[0].label}` && !blockAnimation,
              'match-type-container__buttons--active-first-depth':
                query.logicalOperator === `${labels.matchTypes[0].label}` && depth <= 1
            }"
          ></span>
          <span
            :class="{
              'match-type-container__buttons--active-2':
                query.logicalOperator === `${labels.matchTypes[0].label}`,
              'match-type-container__buttons--active-first-depth':
                query.logicalOperator === `${labels.matchTypes[0].label}` && depth <= 1
            }"
            style="z-index: 88; color: white;"
            @click="handleLogicalOperatorChange(`${labels.matchTypes[0].label}`)"
            >OR</span
          >
        </div>

        <v-btn
          v-if="depth > 1 && $parent.$parent.query.children.length > 1"
          :id="`playbook-query-builder-group-close-${index}`"
          icon
          class="ml-auto"
          @click="deleteGroup"
        >
          <v-icon>mdi-close-circle</v-icon>
        </v-btn>
      </div>
    </div>
    <query-builder-children v-bind="$props" />
    <div class="vqb-group-body card-body">
      <div class="rule-actions">
        <v-btn
          v-if="depth !== 1"
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
    <v-btn
      :id="`playbook-query-builder-group-add-group-${index}`"
      class="query__button"
      style="margin-left: 104px; margin-top: -8px;"
      v-if="depth < maxDepth && depth === 1"
      color="#00bcd4"
      rounded
      @click="addGroup"
    >
      <v-icon color="white">mdi-plus</v-icon>
      <span style="color: white; margin-left: 8px;"> {{ labels.addGroup }} </span>
    </v-btn>
  </div>
</template>

<script>
import QueryBuilderGroup from 'vue-query-builder/src/components/QueryBuilderGroup'
import QueryBuilderRule from './CustomRule'
import deepClone from 'vue-query-builder/src/utilities'
import { createRandomCryptNumber } from '@/utils/functions'
export default {
  name: 'QueryBuilderGroup',
  extends: QueryBuilderGroup,
  components: {
    // eslint-disable-next-line vue/no-unused-components
    QueryBuilderRule: QueryBuilderRule
  },
  props: {
    hideFirstGroupHeader: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      blockAnimation: true,
      attachId: createRandomCryptNumber(),
      getCustomBadgeRender: this.depth !== 1
    }
  },
  computed: {
    isRenderFirstGroupHeader() {
      return this.hideFirstGroupHeader
        ? !(this.depth === 1 && this.query.children.length <= 1)
        : true
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
    },
    deleteGroup() {
      this.blockAnimation = true
      this.remove()
    },
    addRule() {
      let updated_query = deepClone(this.query)
      let child = {
        type: 'query-builder-rule',
        query: {
          rule: this.selectedRule.id,
          operator: this.selectedRule.operators[0].value || this.selectedRule.operators[0],
          operand:
            this.selectedRule.operands === undefined
              ? this.selectedRule.label
              : this.selectedRule.operands[0].value || this.selectedRule.operands[0],
          value: null
        }
      }
      // A bit hacky, but `v-model` on `select` requires an array.
      if (this.ruleById(child.query.rule).type === 'multi-select') {
        child.query.value = []
      }
      updated_query.children.push(child)
      this.$emit('update:query', updated_query)
    },
    addGroup() {
      this.blockAnimation = true
      let updated_query = deepClone(this.query)
      if (this.depth < this.maxDepth) {
        updated_query.children.push({
          type: 'query-builder-group',
          query: {
            logicalOperator: this.labels.matchTypes[0].id,
            children: []
          }
        })
        this.$emit('update:query', updated_query)
      }
    }
  }
}
</script>
