import labels from '@/model/constants/labels'
import { getStoreValue, PROPERTY_STORE } from '@/model/constants/commonConstants'
import * as Validations from '@/utils/validations'

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
  ],
  EXTENDED_VIEW_TABLE_DATA: [
    {
      resourceId: 'g2NawVDuWhku',
      reportedBy: 'keepnetlabs@keepnetlabs.com',
      subject: 'Some Email',
      from: 'keepnetlabs@keepnetlabs.com',
      attachmentCount: 2,
      status: 'Open',
      result: 'Undetected',
      source: 'Auto Analysis',
      tags: [],
      createTime: '2021/07/04 20:24',
      lastUpdateDate: '2021/07/04 20:41',
      matchingPlaybooks: [],
      total: 0,
      senderName: 'Keepnet Labs'
    },
    {
      resourceId: 'n8ulgynyEvrt',
      reportedBy: 'keepnetlabs@keepnetlabs.com',
      subject: 'Some Email',
      from: 'keepnetlabs@keepnetlabs.com',
      attachmentCount: 2,
      status: 'Open',
      result: 'Undetected',
      source: 'Auto Analysis',
      tags: [],
      createTime: '2021/07/04 20:24',
      lastUpdateDate: '2021/07/04 20:41',
      matchingPlaybooks: [],
      total: 0,
      senderName: 'Keepnet Labs'
    },
    {
      resourceId: 'nH9y6uZtFu1u',
      reportedBy: 'keepnetlabs@keepnetlabs.com',
      subject: 'Some Email',
      from: 'keepnetlabs@keepnetlabs.com',
      attachmentCount: 2,
      status: 'Open',
      result: 'Undetected',
      source: 'Auto Analysis',
      tags: [],
      createTime: '2021/07/04 20:24',
      lastUpdateDate: '2021/07/04 20:41',
      matchingPlaybooks: [],
      total: 0,
      senderName: 'Keepnet Labs'
    },
    {
      resourceId: 'lEjz34TVhE6d',
      reportedBy: 'keepnetlabs@keepnetlabs.com',
      subject: 'Some Email',
      from: 'keepnetlabs@keepnetlabs.com',
      attachmentCount: 2,
      status: 'Open',
      result: 'Undetected',
      source: 'Auto Analysis',
      tags: [],
      createTime: '2021/07/04 20:24',
      lastUpdateDate: '2021/07/04 20:41',
      matchingPlaybooks: [],
      total: 0,
      senderName: 'Keepnet Labs'
    },
    {
      resourceId: 'NELszB3bAubf',
      reportedBy: 'keepnetlabs@keepnetlabs.com',
      subject: 'Some Email',
      from: 'keepnetlabs@keepnetlabs.com',
      attachmentCount: 2,
      status: 'Open',
      result: 'Undetected',
      source: 'Auto Analysis',
      tags: [],
      createTime: '2021/07/04 20:24',
      lastUpdateDate: '2021/07/04 20:41',
      matchingPlaybooks: [],
      total: 0,
      senderName: 'Keepnet Labs'
    },
    {
      resourceId: 'JsGbuK5V2pcV',
      reportedBy: 'keepnetlabs@keepnetlabs.com',
      subject: 'Some Email',
      from: 'keepnetlabs@keepnetlabs.com',
      attachmentCount: 2,
      status: 'Open',
      result: 'Undetected',
      source: 'Auto Analysis',
      tags: [],
      createTime: '2021/07/04 19:52',
      lastUpdateDate: '2021/07/04 20:22',
      matchingPlaybooks: [],
      total: 0,
      senderName: 'Keepnet Labs'
    },
    {
      resourceId: 'E8HuZZMKuntA',
      reportedBy: 'keepnetlabs@outlook.com',
      subject: 'Reported email',
      from: 'atakanozgun@hotmail.com',
      attachmentCount: 1,
      status: 'Open',
      result: 'Undetected',
      source: 'Auto Analysis',
      tags: [],
      createTime: '2021/07/04 19:33',
      lastUpdateDate: '2021/07/04 20:37',
      matchingPlaybooks: [],
      total: 0,
      senderName: 'Atakan ?zg?n'
    },
    {
      resourceId: 'FjZtCPldWe6B',
      reportedBy: 'sedatozdemirtest@outlook.com',
      subject: 'TESTING CXCZCZXCXZCXZCZ',
      from: 'sedatozdemirtest@outlook.com',
      attachmentCount: 1,
      status: 'Open',
      result: 'Undetected',
      source: 'test:mGvMWnVWR9H9',
      tags: [],
      createTime: '2021/07/01 18:20',
      lastUpdateDate: '2021/07/04 20:37',
      matchingPlaybooks: [
        {
          resourceId: 'mGvMWnVWR9H9',
          name: 'test'
        }
      ],
      total: 0,
      senderName: 'sedatozdemirtest@outlook.com'
    },
    {
      resourceId: 'Vcc42m08tj65',
      reportedBy: 'sedatozdemirtest@outlook.com',
      subject: 'Training Enrollment',
      from: 'no-reply@keepnetlabs.com',
      attachmentCount: 0,
      status: 'Closed',
      result: 'Simulation',
      source: null,
      tags: [],
      createTime: '2021/07/01 18:20',
      lastUpdateDate: '2021/07/04 20:37',
      matchingPlaybooks: [],
      total: 0,
      senderName: 'Keepnet Labs'
    },
    {
      resourceId: 'WmMhG8sVBKE7',
      reportedBy: 'sedatozdemirtest@outlook.com',
      subject: 'FW: CXCZCZXCXZCXZCZ',
      from: 'ozan@devkeepnet.com',
      attachmentCount: 1,
      status: 'Open',
      result: 'Undetected',
      source: 'test:mGvMWnVWR9H9',
      tags: [],
      createTime: '2021/07/01 02:05',
      lastUpdateDate: '2021/07/04 20:37',
      matchingPlaybooks: [
        {
          resourceId: 'mGvMWnVWR9H9',
          name: 'test'
        }
      ],
      total: 0,
      senderName: 'ozan bey'
    }
  ],
  EXTENDED_VIEW_ROW_ACTIONS: [
    {
      name: labels.Edit,
      id: 'btn-unit-test-emails-row-actions',
      icon: 'mdi-pencil',
      action: 'edit'
    },
    {
      name: labels.PreviewEmail,
      id: 'btn-preview-email--incident-responder-emails-row-actions',
      icon: 'mdi-eye',
      action: 'irPreview'
    },
    {
      name: labels.Details,
      id: 'btn-details--incident-responder-emails-row-actions',
      icon: 'mdi-text-box-multiple',
      action: 'handleDetails'
    },
    {
      name: labels.Investigate,
      id: 'btn-investigate--incident-responder-emails-row-actions',
      icon: 'mdi-magnify',
      action: 'handleInvestigate'
    }
  ],
  EXTENDED_VIEW_COLUMNS: [
    {
      property: 'name',
      align: 'left',
      label: 'Name',
      sortable: true,
      show: true,
      fixed: 'left',
      type: 'text'
    },
    {
      property: 'createTime',
      align: 'left',
      label: 'Name',
      sortable: true,
      show: true,
      fixed: false,
      type: 'text'
    },
    {
      property: 'lastUpdateDate',
      align: 'left',
      label: 'Name',
      sortable: true,
      show: true,
      fixed: false,
      type: 'text'
    }
  ],
  EXTENDED_VIEW_OPTIONS: {
    titleKey: 'subject',
    footer: [
      {
        label: 'Date Created',
        key: 'createTime'
      },
      {
        label: 'Last update',
        key: 'lastUpdateDate'
      }
    ],
    col: [
      {
        property: PROPERTY_STORE.SUBJECT,
        label: getStoreValue(PROPERTY_STORE.SUBJECT),
        isEditable: false,
        type: 'text',
        show: true
      },
      {
        property: PROPERTY_STORE.REPORTEDBY,
        label: getStoreValue(PROPERTY_STORE.REPORTEDBY),
        isEditable: false,
        type: 'text',
        show: true
      },
      {
        property: PROPERTY_STORE.RESOURCEID,
        label: 'Case Id',
        isEditable: false,
        type: 'text',
        show: true
      },
      {
        property: PROPERTY_STORE.ANALYSISSOURCE,
        label: 'Analysis Source',
        isEditable: false,
        type: 'analysisSource',
        show: true
      },
      {
        property: PROPERTY_STORE.RESULT,
        label: getStoreValue(PROPERTY_STORE.RESULT),
        isEditable: true,
        type: 'badge',
        editOptions: {
          component: 'select',
          getDisabledValue(row) {
            return row.status === 'BeingAnalyzed'
          },
          props: {
            items: ['Phishing', 'Malicious', 'Undetected', 'Simulation']
          }
        },
        show: true
      },
      {
        property: PROPERTY_STORE.STATUS,
        label: getStoreValue(PROPERTY_STORE.STATUS),
        isEditable: true,
        type: 'colorfulText',
        editOptions: {
          component: 'select',
          getDisabledValue(row) {
            return row.status === 'BeingAnalyzed'
          },
          props: {
            items: [
              'Open',
              'Closed',
              { text: labels.InProgress, value: 'InProgress' },
              { text: labels.FalsePositive, value: 'FalsePositive' }
            ]
          }
        },
        show: true
      },
      {
        property: 'tags',
        label: 'Tags',
        isEditable: true,
        type: 'smallBadge',
        editOptions: {
          component: 'combobox',
          props: {
            placeholder: 'Enter Tags'
          }
        },
        show: true
      },
      {
        property: 'note',
        label: labels.Notes,
        isEditable: true,
        type: 'text',
        editOptions: {
          component: 'textarea',
          getDisabledValue() {
            return false
          },
          props: {
            placeholder: 'Enter Notes',
            rules: [
              (v) => Validations.maxLength(v, 256, labels.getMaxLengthMessage(labels.Notes, 256))
            ]
          }
        },
        show: true,
        showOnlyPreview: true
      }
    ]
  }
}
