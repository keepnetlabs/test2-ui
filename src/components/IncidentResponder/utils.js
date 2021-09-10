import { getTemplateTypes, searchEmailTemplate } from '@/api/company'
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
        FilterItems: [{ Value: 'WMnpwDBjAFN9', FieldName: 'TypeResourceId', Operator: 'Include' }],
        FilterGroups: []
      },
      { Condition: 'OR', FilterItems: [], FilterGroups: [] }
    ]
  }
}
export const getEmailTypesAndEmailTemplates = () => {
  return getTemplateTypes()
    .then(({ data: { data } }) => {
      axiosPayload.filter.FilterGroups[0].FilterItems[0].Value = data.find(
        (item) => item.name === 'Suspicious Email Analysis Report Update'
      )['resourceId']
      return data
    })
    .then((data) => {
      return Promise.all([searchEmailTemplate(axiosPayload), Promise.resolve(data)])
    })
}
