<template>
  <div>
    <datatable
      v-if="singleTableList"
      :refName="'lastFiveCampaigns'"
      :columns="columns"
      :table="singleTableList"
      :title="title"
      :countRow="5"
      :pageSizes="[]"
      :defaultSort="'date'"
      :selectable="false"
      :filterable="true"
      :options="true"
      :rowActions="rowActions"
      :addUsers="addUsers"
      :empty="iEmpty"
      :selectEvent="selectEvent"
      :chartOptions="chartOptions"
    />
  </div>
</template>

<script>
import Datatable from '../DataTable'

export default {
  components: {
    Datatable
  },
  name: 'last-five-campaigns',
  props: {
    campaignList2: {
      type: Array,
      required: true
    },
    campaignList: {
      type: Array,
      required: true
    },
    singleTableList: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    doubleTable: false,
    dialog: false,
    columns: [
      // Should be defined to show the table
      {
        property: 'campaignName',
        align: 'left',
        editable: false,
        label: 'Campaign Name',
        fixed: 'left',
        sortable: true,
        show: true,
        type: 'text',
        width: 480
      },
      {
        property: 'company',
        align: 'left',
        editable: false,
        label: 'Company',
        fixed: false,
        sortable: true,
        show: true,
        type: 'text',
        width: 180
      },
      {
        property: 'behaviourData',
        align: 'center',
        editable: false,
        label: 'Behaviour',
        fixed: false,
        sortable: false,
        show: true,
        type: 'chart',
        width: 80
      },
      {
        property: 'delivery',
        align: 'right',
        editable: false,
        label: 'Delivery',
        fixed: false,
        sortable: false,
        show: true,
        type: 'text',
        width: 110
      },
      {
        property: 'status',
        align: 'right',
        editable: false,
        label: 'Status',
        fixed: false,
        sortable: false,
        show: true,
        type: 'text',
        width: 100
      }
    ],
    title: {
      icon: 'mdi-tab-unselected',
      title: 'Last 5 Campaigns Stats',
      subTitle: ''
    },
    pageSizes: [6, 13, 25, 50, 100],
    rowActions: [
      {
        name: 'Go to the report',
        icon: 'mdi-text-box',
        action: 'goToReport'
      }
    ],
    addUsers: {
      show: true,
      popUp: true
    },
    iEmpty: {
      message: 'You do not have Campaigns, yet',
      btn: 'Start Now',
      icon: 'mdi-account-plus'
    },
    selectEvent: {
      clipboard: true,
      edit: true,
      delete: true,
      download: true
    },
    chartOptions: {
      chart: {
        width: 60,
        height: 60,
        type: 'pie',
        offsetX: -1,
        offsetY: 1
      },
      labels: ['Team A', 'Team B', 'Team C', 'Team D'],
      colors: ['#67c23a', '#409eff', '#f56c6c', '#ffcc33'],
      legend: {
        show: false
      },
      tooltip: {
        enabled: false
      },
      dataLabels: {
        enabled: false
      }
    }
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    }
  },

  watch: {
    dialog(val) {
      val || this.close()
    }
  },

  mounted() {
    if (window.innerWidth < 800 && window.innerWidth > 600) {
      this.doubleTable = true
    } else {
      this.doubleTable = false
    }
  },

  methods: {
    initialize() {
      this.campaigns = this.campaignList
      this.campaigns2 = this.campaignList2
      this.singleTableCampaigns = this.singleTableList
      this.desserts = [
        {
          campaignName: 'Whatsapp Farklı Konumdan Erişildi',
          company: 'Keepnet Labs',
          behaviour: ['19 No response', '2 Read', '2 Clicked', '1 Data Submitted'],
          behaviourData: [19, 2, 2, 1],
          delivery: '4/4',
          status: 'Finished'
        },
        {
          campaignName: 'e-Devlet Kapısına Eklenen Yeni Hizmetler',
          company: 'Keepnet Labs',
          behaviour: [],
          behaviourData: [],
          delivery: '4/4',
          status: 'Finished'
        },
        {
          campaignName: 'Spotify Parola Sıfırlama',
          company: 'Keepnet Labs',
          behaviour: ['19 No response', '2 Read', '2 Clicked', '1 Data Submitted'],
          behaviourData: [19, 2, 2, 1],
          delivery: '5/5',
          status: 'Finished'
        },
        {
          campaignName: 'Bienvenue dans Mail iCloud-23121321',
          company: 'Keepnet Labs',
          behaviour: ['19 No response', '2 Read', '2 Clicked', '1 Data Submitted'],
          behaviourData: [19, 2, 2, 1],
          delivery: '7/7',
          status: 'Finished'
        },
        {
          campaignName: 'SOmeone Sent a Document - Excel-Test',
          company: 'Keepnet Labs',
          behaviour: ['19 No response', '2 Read', '2 Clicked', '1 Data Submitted'],
          behaviourData: [19, 2, 2, 1],
          delivery: '5/5',
          status: 'Finished'
        }
      ]
    },

    editItem(item) {
      this.editedIndex = this.desserts.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem(item) {
      const index = this.desserts.indexOf(item)
      confirm('Are you sure you want to delete this item?') && this.desserts.splice(index, 1)
    },

    close() {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.desserts[this.editedIndex], this.editedItem)
      } else {
        this.desserts.push(this.editedItem)
      }
      this.close()
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep .v-data-table-header > tr > th > span,
::v-deep table > tbody > tr > td {
  font-family: 'Open Sans', sans-serif !important;
}
.no-data-wrapper {
  padding-top: 80px;
  padding-bottom: 80px;
  margin: 0 auto;

  .no-data-title {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 24px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.29;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
    margin-bottom: 16px;
  }

  .no-data-button {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 14px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.71;
    letter-spacing: normal;
    color: #ffffff;
  }
}

.display-none {
  display: none !important;
}

.data-table-wrapper {
  display: flex;
  flex-direction: row;

  ::v-deep .v-data-table:first-child {
    width: 30%;
    z-index: 3;

    table {
      border-radius: 12px;
      box-shadow: 0 1px 3px 0 rgba(142, 142, 142, 0.2), 0 1px 1px 0 rgba(243, 243, 243, 0.14),
        0 1px 1px -1px rgba(204, 204, 204, 0.12);
    }
  }
  ::v-deep .v-data-table:nth-child(2) {
    width: 70%;
    z-index: 1;
    table {
      border-bottom-left-radius: 0;
      border-top-left-radius: 0;
    }
  }
  @media only screen and (max-width: 769px) {
    .medium-device {
      width: 380px;
    }
    ::v-deep .v-data-table:first-child {
      width: 40%;
      overflow: unset;
      background-color: #ffffff !important;

      tr {
        background-color: #ffffff;
        border-bottom: 1px solid #b3d4fc !important;
      }
    }
    ::v-deep .v-data-table:nth-child(2) {
      width: 60%;
      overflow: auto;
    }
  }
  ::v-deep table {
    overflow: hidden;
    border-radius: 20px;
  }

  ::v-deep thead {
    background-color: #fff;

    th {
      font-family: 'Open Sans', sans-serif !important;
      font-size: 12px;
      font-weight: 600;
      font-style: normal;
      font-stretch: normal;
      line-height: normal;
      letter-spacing: normal;
      color: black !important;
    }
  }
}

::v-deep .v-data-table-header__icon {
  color: #000 !important;
  opacity: 1 !important;
}

::v-deep .v-data-table > .v-data-table__wrapper,
::v-deep .v-data-table > .v-data-table__wrapper > table {
  transform: rotateX(180deg);
  -ms-transform: rotateX(180deg);
  -webkit-transform: rotateX(180deg);
  scrollbar-color: yellow blue;
}

@media only screen and (min-width: 1025px) {
  ::v-deep .v-data-table-header__icon {
    margin-left: 8px !important;
  }
}

::v-deep .first-col {
  width: 200px;
}
@media only screen and (max-width: 769px) {
  .no-data-wrapper {
    margin-left: 0 !important;
  }
}
</style>
