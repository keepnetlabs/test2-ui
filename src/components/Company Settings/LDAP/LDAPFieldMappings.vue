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
      id="btn-save--ldap-field-mappings"
      class="mt-8"
      :style="getSubmitButtonStyle"
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
import { PROPERTY_STORE } from '@/model/constants/commonConstants'
import { defaultFieldMappings } from './utils'
import { mapGetters } from 'vuex'
export default {
  name: 'LDAPFieldMappings',
  components: {
    ConfigureCompanyStepHeader,
    SaveChangesButton,
    DatatableLoading,
    MapTable
  },
  mixins: [useLoading],
  props: {
    fieldMappings: {
      type: Array
    },
    isLoadingFromParent: {
      type: Boolean
    },
    initialCustomFields: {
      type: Array
    }
  },
  data() {
    return {
      labels,
      customFields: JSON.parse(JSON.stringify(this.initialCustomFields)),
      tableData: [],
      mappingData: {
        columns: [],
        headers: [],
        tableData: []
      },
      initialMappingData: {
        columns: [],
        headers: [],
        tableData: []
      }
    }
  },
  created() {
    this.callApis(true)
  },
  computed: {
    ...mapGetters({
      getLDAPSettingCreatePermission: 'permissions/getLDAPSettingCreatePermission'
    }),
    getSubmitButtonStyle() {
      const { isLoading, isLoadingFromParent, getLDAPSettingCreatePermission } = this
      const disabledStyle = {
        opacity: '0.5',
        pointerEvents: 'none',
        cursor: 'auto'
      }
      if (!getLDAPSettingCreatePermission) return disabledStyle
      if (JSON.stringify(this.mappingData) === JSON.stringify(this.initialMappingData))
        return disabledStyle
      return (isLoading || isLoadingFromParent) && disabledStyle
    }
  },
  methods: {
    callApis(isInitial = false) {
      this.setLoading(true)
      Promise.all([this.callForData(isInitial), this.getLDAPFields()]).finally(() => {
        this.customFields = this.customFields.map((cField) => ({
          name: cField.name,
          selectedValue:
            this.mappingData.columns.find(
              (column) => column.resourceId === cField['ldapFieldResourceId']
            ) || null,
          required: false,
          customFieldResourceId: cField.resourceId
        }))
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
        this.mappingData.headers[0].isSelectDisabled = true
        this.setTableData()
        this.setLoading()
        this.$nextTick(() => {
          this?.$refs?.refMapTable?.setDisabilityOfSelect()
          this.initialMappingData = JSON.parse(JSON.stringify(this.mappingData))
        })
      })
    },
    setTableData() {
      const customFieldDefaultValues = this.customFields.reduce((acc, cField) => {
        acc[cField.name] = ''
        return acc
      }, {})
      const defaultNewItem = {}
      this.mappingData.headers.map((header) => (defaultNewItem[header.name] = ''))
      this.mappingData.tableData = this.tableData.map((item) => {
        const newItem = { ...JSON.parse(JSON.stringify(defaultNewItem)) }
        for (const mapper of defaultFieldMappings) {
          newItem[mapper.customFieldResourceId] = item[mapper.customFieldResourceId] || ''
        }
        for (const key of Object.keys(customFieldDefaultValues)) {
          if (!item[key]) newItem[key] = customFieldDefaultValues[key]
          else newItem[key] = item[key]
        }
        return newItem
      })
    },
    callForData(isInitial = false) {
      return LDAPService.searchADUsers({
        fieldMappings: this.fieldMappings.filter(
          (mapping) => mapping.customFieldResourceId && mapping.ldapFieldResourceId
        )
      }).then((response) => {
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
    handleMapTableSelectChange(item) {
      const findedFieldMappingIndex = this.fieldMappings.findIndex((fMap) => {
        const customField = this.customFields.find((cField) => cField.name === item.header.name)
        const comparator = customField?.customFieldResourceId || item.header.name
        return fMap.customFieldResourceId === comparator
      })
      if (findedFieldMappingIndex !== -1) {
        if (item.name === 'None Selected') {
          if (
            ['LastName', 'Department', 'FirstName', 'Email', 'PhoneNumber'].includes(
              item?.header?.name
            )
          ) {
            this.fieldMappings[findedFieldMappingIndex].ldapFieldResourceId = ''
          } else {
            this.fieldMappings.splice(findedFieldMappingIndex, 1)
          }
        } else this.fieldMappings[findedFieldMappingIndex].ldapFieldResourceId = item.resourceId
      } else if (item.name !== 'None Selected') {
        this.fieldMappings.push({
          customFieldResourceId: item.header.customFieldResourceId,
          ldapFieldResourceId: item.resourceId
        })
      }
      this.setLoading(true)
      this.callForData().finally(this.setLoading)
    },
    handleSubmit() {
      this.$emit('on-submit', {
        fieldMappings: this.fieldMappings.filter((fMap) => fMap.ldapFieldResourceId)
      })
    }
  }
}
</script>
