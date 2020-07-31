<template>
  <!-- eslint-disable vue/no-v-html -->

  <div class="vqb-group pa-4 mb-3" :class="'elevation-' + (depth - 1).toString()">
    <div class="vqb-group-heading card-header">
      <div class="match-type-container d-flex">
        <div class="edit-privacy-buttons">
          <button
            :class="{
              btnActive: query.logicalOperator === `${labels.matchTypes[1].label}`,
              'first-depth-button':
                query.logicalOperator === `${labels.matchTypes[1].label}` && depth <= 1
            }"
            @click="query.logicalOperator = `${labels.matchTypes[1].label}`"
            class="public-btn"
            type="button"
          >
            AND
          </button>
          <button
            :class="{
              btnActive: query.logicalOperator === `${labels.matchTypes[0].label}`,
              'first-depth-button':
                query.logicalOperator === `${labels.matchTypes[0].label}` && depth <= 1
            }"
            @click="query.logicalOperator = `${labels.matchTypes[0].label}`"
            class="private-btn"
            type="button"
          >
            OR
          </button>
        </div>

        <v-btn
          v-if="depth > 1 && $parent.$parent.query.children.length > 1"
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
        <v-btn v-if="depth !== 1" text color="#2196f3" class="mr-2" @click="addRule">
          <v-icon>mdi-plus</v-icon> {{ labels.addRule }}
        </v-btn>
      </div>
    </div>
    <v-btn
      class="query__button"
      style="margin-left: 86px;"
      v-if="depth < maxDepth && depth === 1"
      text
      color="#2196f3"
      @click="addGroup"
    >
      <v-icon>mdi-plus</v-icon> {{ labels.addGroup }}
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
      }
    })
  },
  extends: QueryBuilderGroup,
  methods: {
    addNewGroup() {
      this.addGroup()
    },
    deleteGroup() {
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
    }
  }
}
</script>

<style lang="scss">
.vue-query-builder {
  .vqb-group {
    border-radius: 20px;
    padding: 34px;

    position: relative;

    &:not(.elevation-0) {
      margin-left: 100px;
      &:before {
        content: '';
        position: absolute;
        left: -35px;
        width: 36px;
        top: -8px;
        // animation: asasa 0.2s ease-in-out;
        height: calc(54%);
        /* height: calc(105%); */
        border-color: #00bcd4;
        border-style: solid;
        border-width: 0 0 1.5px 1.5px;
        border-radius: 4px;
        border-bottom-right-radius: 0;
        border-top-left-radius: 0;
      }
      &:after {
        content: '';
        position: absolute;
        left: -35px;
        width: 36px;
        top: -8px;
        /* height: calc(53%); */
        height: calc(105%);
        border-color: #00bcd4;
        border-style: solid;
        border-width: 0 0 0px 1.5px;
        border-radius: 1px;
      }
      &:first-child {
        &:before {
          top: -22px !important;
          height: calc(53%);
        }
      }
    }
    &:last-child {
      &:after {
        height: 0;
      }
    }

    background-color: #ffffff;
    box-shadow: 0 1px 5px 0 rgba(80, 80, 80, 0.2), 0 2px 2px 0 rgba(80, 80, 80, 0.14),
      0 3px 1px -2px rgba(80, 80, 80, 0.12);
    .rule-actions {
      .v-btn__content {
        font-size: 14px !important;
        font-weight: 600 !important;
        line-height: 1.71 !important;
        letter-spacing: normal !important;
        color: #2196f3 !important;
      }
    }
    .vqb-rule {
      margin-top: 15px;
      margin-bottom: 15px;
      background-color: #f5f5f5;
      border-color: #ddd;
      padding: 21px 24px 0 24px;
      position: relative;
      margin-left: 100px;
      &:before {
        content: '';
        position: absolute;
        left: -36px;
        width: 37px;
        top: -69px;
        height: calc(50% + 71px);
        //animation: asasab 0.2s ease-in-out;
        border-color: #2196f3;
        border-style: solid;
        border-width: 0 0 1.5px 1.5px;
        border-radius: 4px;
        border-bottom-right-radius: 0;
        border-top-left-radius: 0;
      }
      &:first-child {
        &:before {
          height: calc(50% + 14px);
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
      margin-top: 32px;
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
  margin-top: 15px;
  margin-bottom: 15px;
  background-color: #f5f5f5;
  border-color: #ddd;
  padding: 21px 24px 0 24px;
  position: relative;
}
.match-type-container {
  margin-bottom: 9.5px !important;
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

@keyframes asasa {
  0% {
    height: 0;
  }
  100% {
    height: calc(53%);
  }
}
@keyframes asasab {
  0% {
    height: 0;
  }
  100% {
    height: calc(50% + 71px);
  }
}

.first-depth-button.btnActive {
  background: #00bcd4 !important;
}
</style>
