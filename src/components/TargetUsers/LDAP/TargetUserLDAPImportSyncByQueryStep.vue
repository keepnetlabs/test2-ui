<template>
  <div>
    <TargetUserLDAPImportSyncByQueryViewUsers
      v-if="showUsersDialog"
      ref="refDialog"
      :status="showUsersDialog"
      @on-close="toggleShowUsersDialog"
    />
    <vue-query-builder
      v-model="query"
      id="target-user-ldap-query-builder"
      class="w-100"
      :max-depth="1"
      :labels="label"
      :rules="rules"
    >
      <template #default="slotProps">
        <v-form ref="refForm" lazy-validation>
          <query-builder-group
            v-bind="slotProps"
            ref="queryBuilderGroup"
            hide-first-group-header
            :query.sync="query"
          >
            <template #group-footer>
              <div
                class="w-100"
                style="position: absolute; bottom: 58px; text-align: right; right: 46px;"
              >
                <v-btn
                  class="fw-600 no-box-shadow"
                  color="#2196F3"
                  rounded
                  outlined
                  @click="handleViewUsers"
                >
                  <v-icon left>mdi-account-multiple</v-icon>
                  VIEW USERS
                </v-btn>
              </div>
            </template>
          </query-builder-group>
        </v-form>
      </template>
    </vue-query-builder>
  </div>
</template>

<script>
import VueQueryBuilder from 'vue-query-builder'
import QueryBuilderGroup from '../../Common/QueryBuilder/CustomGroup'
import TargetUserLDAPImportSyncByQueryViewUsers from '@/components/TargetUsers/LDAP/TargetUserLDAPImportSyncByQueryViewUsers'
export default {
  name: 'TargetUserLDAPImportSyncByQueryStep',
  components: {
    TargetUserLDAPImportSyncByQueryViewUsers,
    VueQueryBuilder,
    QueryBuilderGroup
  },
  inject: ['fieldMappings', 'customFields'],
  provide() {
    return {
      viewUsersTableFilterParams: this.viewUsersTableFilterParams
    }
  },
  data() {
    const fieldMappings = this.fieldMappings.map((item) => ({
      text: item.customFieldResourceId,
      value: item.customFieldResourceId
    }))
    this.customFields.map((cField) => {
      if (
        !fieldMappings.find((fMap) => fMap.text === cField.name || fMap.text === cField.resourceId)
      ) {
        fieldMappings.push({ text: cField.name, value: cField.name })
      }
      return cField
    })
    return {
      showUsersDialog: false,
      query: {
        logicalOperator: 'AND',
        children: [
          {
            type: 'query-builder-group',
            query: {
              logicalOperator: 'AND',
              children: []
            }
          }
        ]
      },
      rules: [
        {
          type: 'conditions',
          id: 'conditions',
          label: 'Conditions',
          operands: fieldMappings,
          operators: [
            { text: 'contains', value: 'Contains' },
            { text: 'does not contain', value: 'DoesNotContain' },
            { text: 'is equal to', value: 'Equal' },
            { text: 'is not equal to', value: 'IsNotEqual' }
          ]
        }
      ],
      label: {
        matchType: 'Match Type',
        matchTypes: [
          { id: 'OR', label: 'OR' },
          { id: 'AND', label: 'AND' }
        ],
        addRule: 'ADD CONDITION',
        addGroup: 'ADD ANOTHER CONDITION SET',
        textInputPlaceholder: 'value'
      },
      viewUsersTableFilterParams: {
        items: [],
        operator: 'AND'
      }
    }
  },
  created() {
    console.log('this.f', this.fieldMappings)
  },
  methods: {
    handleViewUsers() {
      this.viewUsersTableFilterParams.items = this.transformQuery(this.query.children, [])
      this.viewUsersTableFilterParams.operator =
        this.query.children[0].query.logicalOperator === 'OR'
      this.toggleShowUsersDialog()
    },

    transformQuery(children, filterItems) {
      children.map((child) => {
        if (child.children) {
          this.transformQuery(child.children, filterItems)
        } else if (child.query) {
          if (child.type === 'query-builder-group') {
            this.transformQuery(child.query.children, filterItems)
          } else if (child.type === 'query-builder-rule') {
            debugger
            filterItems.push({
              Value: child.query.value || '',
              FieldName: child.query.operand,
              Operator: child.query.operator
            })
          }
        }
      })
      return filterItems
    },
    toggleShowUsersDialog() {
      this.showUsersDialog = !this.showUsersDialog
    }
  }
}
</script>
