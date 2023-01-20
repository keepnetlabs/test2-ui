export const integrationTypesEnum = [
  { name: 'VirusTotal', value: 1 },
  { name: 'FortiSandbox', value: 2 },
  { name: 'Vmray', value: 3 },
  { name: 'Ibm X-Force', value: 4 },
  { name: 'SpamHouseZen', value: 5 },
  { name: 'GoogleSafeBrowser', value: 6 },
  { name: 'CustomIntegration', value: 7 }
]
export const scanTypesEnum = [
  { name: 'Url', value: 1 },
  { name: 'Attachment', value: 2 },
  { name: 'Ip', value: 3 },
  { name: 'Hash', value: 4 }
]

const getCreateTimeObj = (isArray, date) => {
  let createTimeOperator, createTimeValue
  if (isArray) {
    createTimeOperator = date[0].Operator
    createTimeValue = date[0].Value
  } else {
    createTimeOperator = date ? date.Operator : 'Contains'
    createTimeValue = date ? date.Value : ''
  }
  return {
    FieldName: 'CreateTime',
    Operator: createTimeOperator,
    Value: createTimeValue
  }
}

export const createAxiosPayloadForSandboxStats = (company, integration, date) => {
  const isArray = Array.isArray(date)
  const axiosPayload = {
    pageNumber: 1,
    pageSize: 10,
    orderBy: 'TotalRequest',
    ascending: true,
    filter: {
      Condition: 'AND',
      FilterGroups: [
        {
          Condition: 'AND',
          FilterItems: [
            {
              Value: '',
              FieldName: 'AnalysisEngineTypeId',
              Operator: 'Contains'
            },
            {
              Value: '',
              FieldName: 'ClientResourceId',
              Operator: 'Contains'
            },
            {
              FieldName: 'ScanType',
              Operator: 'Contains',
              Value: ''
            },
            {
              Value: '',
              FieldName: 'TotalRequest',
              Operator: '>'
            },
            {
              Value: '',
              FieldName: 'HarmfulRequest',
              Operator: '='
            },
            {
              Value: '',
              FieldName: 'UndetectedRequest',
              Operator: '='
            }
          ],
          FilterGroups: []
        }
      ]
    },
    FilterSummary: {
      Condition: 'AND',
      FilterGroups: [
        {
          Condition: 'AND',
          FilterItems: [
            {
              Value: integration,
              FieldName: 'AnalysisEngineTypeId',
              Operator: integration ? 'Include' : 'Contains'
            },
            {
              Value: company,
              FieldName: 'CompanyName',
              Operator: company ? 'Include' : 'Contains'
            },
            {
              Value: company,
              FieldName: 'ClientResourceId',
              Operator: company ? 'Include' : 'Contains'
            },
            getCreateTimeObj(isArray, date)
          ],
          FilterGroups: []
        }
      ]
    }
  }
  if (isArray)
    axiosPayload.FilterSummary.FilterGroups[0].FilterItems.push({
      Value: date[1].Value,
      FieldName: 'CreateTime',
      Operator: date[1].Operator
    })
  return axiosPayload
}

export const createAxiosPayloadForSandboxLogs = (company, integration, date) => {
  const isArray = Array.isArray(date)
  const axiosPayload = {
    pageNumber: 1,
    pageSize: 10,
    orderBy: 'CreateTime',
    ascending: false,
    filter: {
      Condition: 'AND',
      FilterGroups: [
        {
          Condition: 'AND',
          FilterItems: [
            {
              Value: integration,
              FieldName: 'AnalysisEngineTypeId',
              Operator: integration ? 'Include' : 'Contains'
            },
            {
              Value: company,
              FieldName: 'CompanyName',
              Operator: company ? 'Include' : 'Contains'
            },
            {
              Value: company,
              FieldName: 'ClientResourceId',
              Operator: company ? 'Include' : 'Contains'
            },
            getCreateTimeObj(isArray, date),
            {
              FieldName: 'ScanType',
              Operator: 'Contains',
              Value: ''
            },
            {
              Value: '',
              FieldName: 'Details',
              Operator: 'Contains'
            },
            {
              Value: '',
              FieldName: 'Status',
              Operator: 'Contains'
            }
          ],
          FilterGroups: []
        },
        {
          Condition: 'OR',
          FilterItems: [
            {
              Value: '',
              FieldName: 'AnalysisEngineTypeId',
              Operator: 'Contains'
            },
            {
              Value: '',
              FieldName: 'CompanyName',
              Operator: 'Contains'
            },
            {
              Value: '',
              FieldName: 'ClientResourceId',
              Operator: 'Contains'
            },
            {
              FieldName: 'CreateTime',
              Operator: 'Contains',
              Value: ''
            },
            {
              FieldName: 'ScanType',
              Operator: 'Contains',
              Value: ''
            },
            {
              Value: '',
              FieldName: 'Details',
              Operator: 'Contains'
            },
            {
              Value: '',
              FieldName: 'Status',
              Operator: 'Contains'
            }
          ],
          FilterGroups: []
        }
      ]
    }
  }
  if (isArray)
    axiosPayload.bodyData.filter.FilterGroups[0].FilterItems.push({
      Value: date[1].Value,
      FieldName: 'CreateTime',
      Operator: date[1].Operator
    })
  return axiosPayload
}
