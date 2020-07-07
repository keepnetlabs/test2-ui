<template>
  <!-- eslint-disable vue/no-v-html -->

  <div class="vqb-group pa-4 mb-3" :class="'elevation-' + (depth - 1).toString()">
    <div class="vqb-group-heading card-header">
      <div class="match-type-container d-flex">
        <v-switch
          v-if="depth !== 1"
          v-model="query.logicalOperator"
          :true-value="labels.matchTypes[0].id"
          :false-value="labels.matchTypes[1].id"
          :label="`${labels.matchTypes[0].label} / ${labels.matchTypes[1].label}`"
        />

        <v-btn v-if="depth > 1" icon class="ml-auto" @click="remove">
          <v-icon>mdi-close-circle</v-icon>
        </v-btn>
      </div>
    </div>
    <query-builder-children v-bind="$props" />
    <div class="vqb-group-body card-body">
      <div class="rule-actions">
        <!-- <select v-model="selectedRule" class="form-control mr-2">
            <option v-for="rule in rules" :key="rule.id" :value="rule">
              {{ rule.label }}
            </option>
          </select> -->
        <v-btn v-if="depth !== 1" text color="primary" class="mr-2" @click="addRule">
          <v-icon>mdi-plus</v-icon> {{ labels.addRule }}
        </v-btn>

        <v-btn v-if="depth < maxDepth" text color="primary" @click="addGroup">
          <v-icon>mdi-plus</v-icon> {{ labels.addGroup }}
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import QueryBuilderGroup from 'vue-query-builder/src/components/QueryBuilderGroup'
import QueryBuilderRule from './CustomRule'
export default {
  name: 'QueryBuilderGroup',
  components: {
    // eslint-disable-next-line vue/no-unused-components
    QueryBuilderRule: QueryBuilderRule
  },
  extends: QueryBuilderGroup,
  data: () => ({})
}
</script>

<style lang="scss">
.vue-query-builder {
  .vqb-group {
    border-radius: 20px;
    padding: 34px;
    background-color: #ffffff;
    box-shadow: 0 1px 5px 0 rgba(80, 80, 80, 0.2), 0 2px 2px 0 rgba(80, 80, 80, 0.14),
      0 3px 1px -2px rgba(80, 80, 80, 0.12);
    .rule-actions {
    }
  }
}
.vqb-rule {
  margin-top: 15px;
  margin-bottom: 15px;
  background-color: #f5f5f5;
  border-color: #ddd;
  padding: 16px 24px;
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
</style>
