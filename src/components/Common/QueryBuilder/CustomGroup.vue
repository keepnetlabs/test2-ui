<template>
  <!-- eslint-disable vue/no-v-html -->

  <div
    class="vqb-group pa-6 mb-2"
    style="padding-bottom: 18px !important;"
    :id="`playbook-query-builder-group-${index}`"
    :class="[
      depth === 1 && query.children.length <= 1 && 'vqb-disable',
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
      <div class="match-type-container d-flex">
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
    </div>
    <v-btn
      :id="`playbook-query-builder-group-add-group-${index}`"
      class="query__button"
      style="margin-left: 104px; margin-top: 6px;"
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
export default {
  name: 'QueryBuilderGroup',
  components: {
    // eslint-disable-next-line vue/no-unused-components
    QueryBuilderRule: QueryBuilderRule
  },
  mounted() {
    this.$nextTick(() => {
      if (this.query && this.query.children.length === 0) {
        this.addRule()
        this.getCustomBadgeRender = false
      }
    })
  },
  extends: QueryBuilderGroup,
  watch: {
    query() {
      this.$nextTick(() => {
        if (this.depth === 1) {
          const childrenWrap = this.$children[0]
          childrenWrap.$children.forEach((item, index) => {
            item.getCustomBadgeRender = !(index === childrenWrap.$children.length - 1)
          })
        }
      })
    }
  },
  methods: {
    addNewGroup() {
      this.addGroup()
    },
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
            typeof this.selectedRule.operands === 'undefined'
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
  },
  data() {
    return {
      blockAnimation: true,
      attachId: Math.random(),
      getCustomBadgeRender: this.depth !== 1
    }
  }
}
</script>

<style lang="scss">
.vue-query-builder {
  .vqb-group {
    border-radius: 20px;
    padding: 34px;
    margin-bottom: 16px !important;
    position: relative;

    &:not(.elevation-0) {
      margin-left: 107px;
      &:before {
        content: '';
        position: absolute;
        left: -43px;
        width: 36px;
        top: -16px;
        height: calc(50% + 24px);
        /* height: calc(105%); */
        border-color: #00bcd4;
        border-style: solid;
        border-width: 0 0 1px 1px;
        border-radius: 4px;
        border-bottom-right-radius: 0;
        border-top-left-radius: 0;
      }
      &:after {
        content: '';
        position: absolute;
        left: -43px;
        width: 36px;
        top: -8px;
        /* height: calc(53%); */
        height: calc(105%);
        border-color: #00bcd4;
        border-style: solid;
        border-width: 0 0 0px 1px;
        border-radius: 1px;
      }
      &:first-child {
        &:before {
          top: -8px !important;
          height: calc(50% + 16px);
        }
      }
    }
    &:last-child {
      margin-bottom: 0 !important;
      &:after {
        height: 0;
      }
    }

    background-color: #ffffff;
    box-shadow: 0 1px 5px 0 rgba(80, 80, 80, 0.2), 0 2px 2px 0 rgba(80, 80, 80, 0.14),
      0 3px 1px -2px rgba(80, 80, 80, 0.12);
    .rule-actions {
      margin-left: 108px !important;
      margin-top: 10px;

      .v-btn__content {
        font-size: 14px !important;
        font-weight: 600 !important;
        line-height: 1.71 !important;
        letter-spacing: normal !important;
        color: #2196f3 !important;
      }
    }
    .vqb-rule {
      //margin-top: 15px;
      //margin-bottom: 15px;
      margin-bottom: 8px;
      &:last-child {
        margin-bottom: 0;
      }
      background-color: #f5f5f5;
      border-color: #ddd;
      //padding: 21px 24px 0 24px;
      position: relative;
      margin-left: 107px;
      &:before {
        content: '';
        position: absolute;
        left: -43px;
        width: 37px;
        top: -78px;
        height: calc(50% + 80px);
        //animation: asasab 0.2s ease-in-out;
        border-color: #2196f3;
        border-style: solid;
        border-width: 0 0 1px 1px;
        border-radius: 4px;
        border-bottom-right-radius: 0;
        border-top-left-radius: 0;
        @media (max-width: 768px) {
          top: -108px;
          height: calc(50% + 110px);
        }
      }
      &:first-child {
        &:before {
          height: calc(50% + 11px);
          top: -8px;
        }
      }
    }
  }
  .elevation-1 {
    box-shadow: 0 1px 14px 0 rgba(80, 80, 80, 0.2), 0 2px 2px 0 rgba(80, 80, 80, 0.14),
      0 3px 1px -2px rgba(80, 80, 80, 0.12) !important;
  }
  .elevation-0 {
    & > .vqb-children {
      //margin-top: 32px;
    }
    padding-left: 0 !important;
  }
}
.query__button {
  .v-btn__content {
    font-size: 14px !important;
    font-weight: 600 !important;
    line-height: 1.71 !important;
    letter-spacing: normal !important;
    color: #2196f3 !important;
  }
}
.vqb-rule {
  //margin-top: 15px;
  //margin-bottom: 15px;
  background-color: #f5f5f5;
  border-color: #ddd;
  //padding: 21px 24px 0 24px;
  position: relative;
  border-radius: 8px;
  .row {
    margin-left: 0 !important;
    padding-left: 24px !important;
    margin-right: 0 !important;
  }
  .col {
    padding-right: 8px !important;
    padding-left: 0 !important;
    padding-top: 16px !important;
    padding-bottom: 0 !important;
    .v-select__selections {
      flex-wrap: nowrap;
    }
    .v-text-field.v-text-field--enclosed .v-text-field__details {
      margin-bottom: 2px;
    }
    &:first-child {
      //padding-left: 24px !important;
    }
  }
}
.match-type-container {
  margin-bottom: 16px !important;
  &__buttons {
    width: 135px;
    min-height: 36px;
    max-height: 36px;
    position: relative;
    display: flex;
    align-items: center;
    color: white !important;
    box-shadow: inset 0 1px 3px 0 rgba(0, 0, 0, 0.22);
    border-radius: 18px;
    background-color: #2196f3;
    span {
      cursor: pointer;
      width: 66.5px;
      text-align: center;
      font-size: 14px;
      font-weight: 600;
      line-height: 1;
      letter-spacing: normal;
      color: white;
      &:first-child {
        margin-left: 2px;
      }
      margin-right: 2px;
    }
    &--active {
      //padding: 4px 17px;
      padding: 16px 0;
      display: flex;
      &-1 {
        color: #2196f3 !important;
      }
      &-2 {
        color: #2196f3 !important;
      }
      justify-content: center;
      align-items: center;
      box-shadow: 0 1px 5px 0 rgba(80, 80, 80, 0.2), 0 2px 2px 0 rgba(80, 80, 80, 0.14),
        0 3px 1px -2px rgba(80, 80, 80, 0.12);
      background-color: white;
      border-radius: 18px;
      color: #2196f3 !important;
      &-first-depth {
        color: #00bcd4 !important;
      }
    }
    &--animate-1 {
      animation: fromLeft 0.1s ease-in-out;
      transition: color 0.1s ease-in-out;
    }
    &--animate-2 {
      animation: fromRight 0.1s ease-in-out;
      transition: color 0.1s ease-in-out;
    }
    &--first-depth {
      background: #00bcd4 !important;
    }
  }
}
/*
  .vue-query-builder .vqb-group.depth-1 .vqb-rule,
  .vue-query-builder .vqb-group.depth-2 {
    border-left: 2px solid #8bc34a;
  }
  .vue-query-builder .vqb-group.depth-2 .vqb-rule,
  .vue-query-builder .vqb-group.depth-3 {
    border-left: 2px solid #00bcd4;
  }
  .vue-query-builder .vqb-group.depth-3 .vqb-rule,
  .vue-query-builder .vqb-group.depth-4 {
    border-left: 2px solid #ff5722;
  }*/
.vue-query-builder .close {
  opacity: 1;
  color: rgb(150, 150, 150);
}
@media (min-width: 768px) {
  .vue-query-builder .vqb-rule.form-inline .form-group {
    display: block;
  }
}

@keyframes fromLeft {
  0% {
    transform: translateX(-66.5px);
  }
  100% {
    transform: translateX(0);
  }
}
@keyframes fromRight {
  0% {
    transform: translateX(66.5px);
  }
  100% {
    transform: translateX(0);
  }
}

.first-depth-button.btnActive {
  background: #00bcd4 !important;
}
.vqb-disable {
  .match-type-container__buttons--first-depth {
    background: #757575 !important;
    pointer-events: none !important;
    opacity: 0.3;
  }
  .match-type-container__buttons--active-first-depth {
    color: #757575 !important;
  }
  .vqb-group {
    &:before {
      border-color: #757575 !important;
      opacity: 0.3;
    }
  }
}
.custom-group-badge {
  @media (max-width: 896px) {
    top: 137px;
  }
  position: absolute;
  left: -57px;
  bottom: -21px;
  padding: 4px 6px;
  border-radius: 4px;
  line-height: 1.33;
  font-weight: 600;
  background-color: #e0f9fc;
  border: solid 1px rgba(42, 201, 221, 0.65);
  font-size: 12px;
  z-index: 9;
  color: #00bcd4;
}
</style>
