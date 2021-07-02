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
  },
  PAGINATION_DATA: [
    {
      name: 'Gürkan',
      surname: 'Uğurlu'
    },
    {
      name: 'Arda',
      surname: 'Dura'
    },
    {
      name: 'asksak',
      surname: 'aslaslsla'
    },
    {
      name: 'asksak',
      surname: 'aslaslsla'
    },
    {
      name: 'asksak',
      surname: 'aslaslsla'
    },
    {
      name: 'asksak',
      surname: 'aslaslsla'
    },
    {
      name: 'asksak',
      surname: 'aslaslsla'
    },
    {
      name: 'asksak',
      surname: 'aslaslsla'
    },
    {
      name: 'asksak',
      surname: 'aslaslsla'
    },
    {
      name: 'asksak',
      surname: 'aslaslsla'
    },
    {
      name: 'asksak',
      surname: 'aslaslsla'
    },
    {
      name: 'asksak',
      surname: 'aslaslsla'
    },
    {
      name: 'asksak',
      surname: 'aslaslsla'
    }
  ]
}
