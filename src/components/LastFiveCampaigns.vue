<template>
  <div>
    <div v-if="doubleTable && campaigns2.length" class="data-table-wrapper">
      <v-data-table
        flat
        :headers="firstTable"
        :items="campaigns2"
        :disable-pagination="true"
        hide-default-footer
      >
        <template v-slot:item.campaignName="{ item }">
          <div class="medium-device">{{ item.campaignName }}</div>
        </template>
      </v-data-table>
      <v-data-table
        flat
        :headers="headers"
        :items="campaigns"
        :disable-pagination="true"
        hide-default-footer
      >
        <template v-slot:item.behaviour="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <!-- <v-icon color="primary" class="ml-4" dark >mdi-chart-pie</v-icon>-->
              <div class="ml-3" v-on="on">
                <flat-simple-pie :pieData="item.behaviourData"></flat-simple-pie>
              </div>
            </template>
            <div v-if="item.behaviour && item.behaviour.length > 0">
              <span v-for="(behaviour, index) in item.behaviour" :key="index">
                {{ behaviour }}
                <br />
              </span>
            </div>

            <div v-else>
              <span>No Data</span>
            </div>
          </v-tooltip>
        </template>

        <template v-slot:item.action="{ item }">
          <v-icon class="ml-2" medium @click="editItem(item)">
            mdi-file-document-box
          </v-icon>
        </template>
        <template v-slot:no-data>
          <div class="no-data-wrapper">
            <div class="no-data-title">There's no data yet</div>
            <div class="no-data-button">
              <v-btn color="#2196f3" dark rounded>
                <v-icon left>mdi-plus-thick</v-icon>
                START A CAMPAIGN
              </v-btn>
            </div>
          </div>
        </template>
      </v-data-table>
    </div>
    <div v-else class="data-table-wrapper-single">
      <v-data-table
        flat
        :headers="singleTable"
        :items="singleTableCampaigns"
        :disable-pagination="true"
        hide-default-footer
      >
        <template v-slot:item.behaviour="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <!-- <v-icon color="primary" class="ml-4" dark >mdi-chart-pie</v-icon>-->
              <div class="ml-3" v-on="on">
                <flat-simple-pie :pieData="item.behaviourData"></flat-simple-pie>
              </div>
            </template>
            <div v-if="item.behaviour && item.behaviour.length > 0">
              <span v-for="(behaviour, index) in item.behaviour" :key="index">
                {{ behaviour }}
                <br />
              </span>
            </div>
            <div v-else>
              <span>No Data</span>
            </div>
          </v-tooltip>
        </template>

        <template v-slot:item.action="{ item }">
          <v-icon class="ml-2" medium @click="editItem(item)">
            mdi-file-document-box
          </v-icon>
        </template>
        <template v-slot:no-data>
          <div class="no-data-wrapper">
            <div class="no-data-title">There's no data yet</div>
            <div class="no-data-button">
              <v-btn color="#2196f3" dark rounded>
                <v-icon left>mdi-plus-thick</v-icon>
                START A CAMPAIGN
              </v-btn>
            </div>
          </div>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script>
import FlatSimplePie from './FlatSimplePie'

export default {
  components: {
    FlatSimplePie
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
    firstTable: [
      {
        text: 'Campaign Name',
        align: 'left',
        sortable: true,
        value: 'campaignName',
        divider: true,
        class: 'fixed-column'
      }
    ],
    headers: [
      {
        text: 'Company',
        value: 'company',
        class: 'first-col',
        sortable: true,
        width: 130
      },
      {
        text: 'Behavior',
        value: 'behaviour',
        sortable: false,
        width: 80
      },
      {
        text: 'Delivery',
        value: 'delivery',
        sortable: true,
        width: 110
      },
      {
        text: 'Status',
        value: 'status',
        sortable: true,
        width: 100
      },
      {
        text: 'Actions',
        value: 'action',
        sortable: false,
        width: 80
      }
    ],
    singleTable: [
      {
        text: 'Campaign Name',
        align: 'left',
        sortable: true,
        value: 'campaignName',
        divider: true
      },
      {
        text: 'Company',
        value: 'company',
        class: 'first-col',
        sortable: true
      },
      {
        text: 'Behavior',
        value: 'behaviour',
        sortable: false
      },
      {
        text: 'Delivery',
        value: 'delivery',
        sortable: true,
        width: 110
      },
      {
        text: 'Status',
        value: 'status',
        sortable: true,
        width: 100
      },
      {
        text: 'Actions',
        value: 'action',
        sortable: false
      }
    ],
    desserts2: [],
    editedIndex: -1,
    editedItem: {
      name: '',
      calories: 0,
      fat: 0,
      carbs: 0,
      protein: 0
    },
    defaultItem: {
      name: '',
      calories: 0,
      fat: 0,
      carbs: 0,
      protein: 0
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

  created() {
    window.addEventListener('resize', this.onResize)
    this.initialize()
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
    },

    onResize() {
      if (window.innerWidth < 800 && window.innerWidth > 600) {
        this.doubleTable = true
      } else {
        this.doubleTable = false
      }
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
      tr:nth-child(even) {
        background: #fafafa !important;
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

::v-deep tr:nth-child(even) {
  background: #fafafa;
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
