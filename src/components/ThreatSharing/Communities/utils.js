export const privacyList = [
  { name: 'Public', id: 1 },
  { name: 'Private', id: 2 },
  { name: 'Hidden', id: 3 }
]

export const getAllCommunitiesFilter = (filter, industryValue, privacyValue) => {
  return {
    Condition: 'AND',
    FilterGroups: [
      {
        Condition: 'OR',
        FilterItems: [
          {
            FieldName: 'CommunityName',
            Operator: 'Contains',
            Value: filter
          },
          {
            FieldName: 'CommunityDescription',
            Operator: 'Contains',
            Value: filter
          }
        ],
        FilterGroups: []
      },
      {
        Condition: 'AND',
        FilterItems: [
          {
            FieldName: 'IndustryResourceId',
            Operator: 'Include',
            Value: industryValue
          }
        ],
        FilterGroups: []
      },
      {
        Condition: 'AND',
        FilterItems: [
          {
            FieldName: 'PrivacyStatusId',
            Operator: 'Include',
            Value: privacyValue
          }
        ],
        FilterGroups: []
      }
    ]
  }
}
