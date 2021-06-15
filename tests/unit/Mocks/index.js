export default {
  SEARCH_FIELD_CASE: {
    Condition: 'AND',
    FilterGroups: [
      {
        Condition: 'AND',
        FilterItems: [
          {
            FieldName: 'Name',
            Operator: 'Contains',
            Value: 'custom data'
          },
          {
            FieldName: 'Surname',
            Operator: 'Contains',
            Value: 'custom data'
          }
        ]
      }
    ]
  },
  ADD_BUTTON: {
    show: true,
    action: 'handleClickAction',
    id: 'btn-add--action-button',
    tooltip: '',
    disabled: false
  }
}
