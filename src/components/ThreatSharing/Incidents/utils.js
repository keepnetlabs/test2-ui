export const getIncidentListPayload = (
  postedCompanyResourceId = '',
  pageNumber = 1,
  itemsPerPage = 5,
  search = '',
  threats = []
) => ({
  postedCompanyResourceId,
  pageNumber,
  pageSize: itemsPerPage,
  orderBy: 'PostedTime',
  ascending: false,
  filter: {
    Condition: 'AND',
    FilterGroups: [
      {
        Condition: 'OR',
        FilterItems: [
          {
            Value: search,
            FieldName: 'Title',
            Operator: 'Contains'
          },
          {
            Value: search,
            FieldName: 'Description',
            Operator: 'Contains'
          },
          {
            Value: search,
            FieldName: 'DiscoveryAndDetection',
            Operator: 'Contains'
          },
          {
            Value: search,
            FieldName: 'Scope',
            Operator: 'Contains'
          }
        ],
        FilterGroups: []
      },
      {
        Condition: 'AND',
        FilterItems: [
          {
            FieldName: 'CategoryResourceId',
            Operator: 'Include',
            Value: threats.toString()
          }
        ],
        FilterGroups: []
      }
    ]
  }
})
