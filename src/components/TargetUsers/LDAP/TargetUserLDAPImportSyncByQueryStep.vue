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
import { getAxiosPayloadOfManuallyTable } from '@/components/TargetUsers/LDAP/utils'
export default {
  name: 'TargetUserLDAPImportSyncByQueryStep',
  components: {
    TargetUserLDAPImportSyncByQueryViewUsers,
    VueQueryBuilder,
    QueryBuilderGroup
  },
  inject: {
    fieldMappings: {},
    customFields: {},
    getEditedScheduledFilter: {
      type: Function
    }
  },
  provide() {
    return {
      viewUsersTableFilterParams: this.viewUsersTableFilterParams
    }
  },
  data() {
    const fieldMappings = this.fieldMappings.map((item) => ({
      text: item.text,
      value: item.customFieldResourceId
    }))
    this.customFields.map((cField) => {
      const index = fieldMappings.findIndex(
        (fMap) => fMap.text === cField.name || fMap.text === cField.resourceId
      )
      if (index !== -1) {
        fieldMappings[index].text = cField.name
        fieldMappings[index].value = cField.name
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
            { text: 'is equal to', value: '=' },
            { text: 'is not equal to', value: '!=' }
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
    this.setEditedFilter()
  },
  methods: {
    setEditedFilter() {
      const filter = this.getEditedScheduledFilter()
      if (filter) {
        let andItems, orItems
        if (filter?.filterGroups?.length) {
          andItems = filter?.filterGroups[0]?.filterItems
          orItems = filter?.filterGroups[1]?.filterItems
        } else {
          andItems = filter?.FilterGroups[0]?.FilterItems
          orItems = filter?.FilterGroups[1]?.FilterItems
        }
        const condition = andItems?.length ? 'AND' : 'OR'
        const items = condition === 'AND' ? andItems : orItems
        items.map((item) => {
          this.query.children[0].query.children.push({
            query: {
              format: item.fieldName,
              operand: item.fieldName,
              operator: item.operator === 'Include' ? 'Contains' : item.operator,
              rule: 'conditions',
              value: item.value
            },
            type: 'query-builder-rule'
          })
        })
        this.query.children[0].query.logicalOperator = condition
      }
    },
    handleViewUsers() {
      this.setViewUsersTableFilterParams()
      this.toggleShowUsersDialog()
    },
    setViewUsersTableFilterParams() {
      this.viewUsersTableFilterParams.items = this.transformQuery(this.query.children, [])
      this.viewUsersTableFilterParams.operator =
        this.query.children[0].query.logicalOperator === 'OR'
      const timeZoneIndex = this.viewUsersTableFilterParams.items.findIndex(
        (item) => item.FieldName === 'TimeZone'
      )
      if (timeZoneIndex !== -1) {
        this.viewUsersTableFilterParams.items[timeZoneIndex].FieldName = 'TimeZoneId'
      }
      return this.viewUsersTableFilterParams
    },
    getPayloadFilter() {
      this.setViewUsersTableFilterParams()
      const { viewUsersTableFilterParams } = this
      return getAxiosPayloadOfManuallyTable(true, viewUsersTableFilterParams)?.filter
    },
    transformQuery(children, filterItems) {
      children.map((child) => {
        if (child.children) {
          this.transformQuery(child.children, filterItems)
        } else if (child.query) {
          if (child.type === 'query-builder-group') {
            this.transformQuery(child.query.children, filterItems)
          } else if (child.type === 'query-builder-rule') {
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
