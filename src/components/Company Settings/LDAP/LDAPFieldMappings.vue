<template>
  <div>
    <ConfigureCompanyStepHeader
      class="mb-6"
      :title="labels.FieldMapping"
      :subtitle="labels.FieldMappingSub"
    />
    <DatatableLoading v-if="isLoading || isLoadingFromParent" :loading="isLoading" />
    <MapTable
      v-else
      ref="refMapTable"
      class="ldap-field-mapping-map-table"
      :map-table-data="mappingData"
      @on-change="handleMapTableSelectChange"
    />
    <SaveChangesButton
      class="mt-8"
      :style="(isLoading || isLoadingFromParent) && { opacity: '0.5', pointerEvents: 'none' }"
      @click="handleSubmit"
    />
  </div>
</template>

<script>
import MapTable from '@/components/TargetUsers/subcomponents/MapTable'
import LDAPService from '@/api/ldap'
import DatatableLoading from '@/components/SkeletonLoading/WidgetLoading'
import { useLoading } from '@/hooks/useLoading'
import SaveChangesButton from '@/components/Common/Buttons/SaveChangesButton'
import ConfigureCompanyStepHeader from '@/components/Companies/ConfigureCompanyStepHeader'
import labels from '@/model/constants/labels'
import { getTargetUserCustomFieldsByCompanyId } from '@/api/targetUsers'
import { PROPERTY_STORE } from '@/model/constants/commonConstants'
export default {
  name: 'LDAPFieldMappings',
  components: { ConfigureCompanyStepHeader, SaveChangesButton, DatatableLoading, MapTable },
  mixins: [useLoading],
  props: {
    fieldMappings: {
      type: Array
    },
    isLoadingFromParent: {
      type: Boolean
    }
  },
  data() {
    return {
      labels,
      customFields: [],
      tableData: [],
      mappingData: {
        columns: [],
        headers: [],
        tableData: []
      }
    }
  },
  created() {
    this.callApis(true)
  },
  methods: {
    callApis(isInitial = false) {
      this.setLoading(true)
      Promise.all([
        this.callForData(isInitial),
        this.getLDAPFields(),
        this.callForCustomFields()
      ]).finally(() => {
        const mappedHeaders = [
          ...this.fieldMappings.map((item) => ({
            name:
              this.customFields.find(
                (cField) => cField.customFieldResourceId === item.customFieldResourceId
              )?.name || item.customFieldResourceId,
            selectedValue:
              this.mappingData.columns.find(
                (column) => column.resourceId === item['ldapFieldResourceId']
              ) || null,
            required: false
          }))
        ]
        const customFields = this.customFields.filter((cField) => {
          return !mappedHeaders.find((mappedHeader) => mappedHeader.name === cField.name)
        })
        this.mappingData.headers = [...mappedHeaders, ...customFields]
        this.setTableData()
        this.setLoading()
      })
    },
    setTableData() {
      const customFieldDefaultValues = this.customFields.reduce((acc, cField) => {
        acc[cField.name] = ''
        return acc
      }, {})
      this.mappingData.tableData = this.tableData.map((item) => {
        for (const key of Object.keys(customFieldDefaultValues)) {
          if (!item[key]) item[key] = customFieldDefaultValues[key]
        }
        return item
      })
    },
    callForData(isInitial = false) {
      return LDAPService.searchADUsers({ fieldMappings: this.fieldMappings }).then((response) => {
        const {
          data: { data }
        } = response
        this.tableData = data
        if (!isInitial) this.setTableData()
        return this
      })
    },
    getLDAPFields() {
      return LDAPService.getLDAPFields().then((response) => {
        const {
          data: { data }
        } = response
        this.mappingData.columns = data?.fields || []
        this.mappingData.columns.unshift({
          name: PROPERTY_STORE.NONE_SELECTED,
          disabled: false,
          selectedValue: null,
          required: false
        })
        return this
      })
    },
    callForCustomFields() {
      return getTargetUserCustomFieldsByCompanyId().then((response) => {
        const {
          data: { data }
        } = response
        this.customFields = data
          .filter((cField) => cField.fieldDataType === 'String')
          .map((cField) => ({
            name: cField.name,
            selectedValue:
              this.mappingData.columns.find(
                (column) => column.resourceId === cField['ldapFieldResourceId']
              ) || null,
            required: false,
            customFieldResourceId: cField.resourceId
          }))
        return this
      })
    },
    handleMapTableSelectChange(item) {
      const findedFieldMappingIndex = this.fieldMappings.findIndex((fMap) => {
        const customField = this.customFields.find((cField) => cField.name === item.header.name)
        const comparator = customField?.customFieldResourceId || item.header.name
        return fMap.customFieldResourceId === comparator
      })
      if (findedFieldMappingIndex !== -1) {
        if (item.name === 'None Selected') this.fieldMappings.splice(findedFieldMappingIndex, 1)
        else this.fieldMappings[findedFieldMappingIndex].ldapFieldResourceId = item.resourceId
      } else {
        if (item.name !== 'None Selected') {
          this.fieldMappings.push({
            customFieldResourceId: item.header.customFieldResourceId,
            ldapFieldResourceId: item.resourceId
          })
        }
      }
      this.setLoading(true)
      this.callForData().finally(this.setLoading)
    },
    handleSubmit() {
      this.$emit('on-submit', { fieldMappings: this.fieldMappings })
    }
  }
}
</script>
<style lang="scss">
.ldap-field-mapping-map-table {
  overflow-x: auto;
  table {
    width: 100%;
  }
  tr {
    display: table-row !important;
  }
  td {
    display: table-cell !important;
    height: 48px !important;
  }
}
</style>
