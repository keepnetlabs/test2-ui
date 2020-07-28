<template>
  <div>
    <v-overlay
      id="new-community-overlay"
      :value="showPostIncident"
      :class="{ newCommunityOverlay: showPostIncident }"
      :opacity="1"
      :z-index="999"
      color="white"
    >
      <post-incident
        :editItem="editItem"
        @closeIncidentModal="closeIncidentModal"
        @refreshData="refreshDataFunc"
      />
    </v-overlay>

    <v-card id="component-incidents" flat color="basil">
      <v-card-text id="incidents-component-card" class="pt-0">
        <v-data-iterator
          :items="incidentList"
          :items-per-page.sync="itemsPerPage"
          :footer-props="{ itemsPerPageOptions }"
          :page.sync="page"
        >
          <template v-slot:header>
            <div class="search-wrapper">
              <v-text-field
                @mouseover.native="hover = true"
                placeholder="Filter by attributes or keywords"
                outlined
                class="filter-field pt-6"
                v-model="search"
                id="incidents-search-textfield"
              ></v-text-field>
              <v-icon class="filter-icon">mdi-filter-variant</v-icon>
            </div>
          </template>
          <template v-slot:default="props">
            <v-expansion-panels :multiple="false">
              <v-expansion-panel
                v-for="(item, ind) of props.items"
                :key="ind + item.communityPostResourceId"
                style="border-image: none !important;"
                class="mb-4 mt-0"
                id="edit-incident-post"
                popout
              >
                <singlePost
                  @refreshData="refreshDataFunc"
                  :post="item"
                  :postIndex="ind"
                  :totalPostCount="props.items.length"
                  @openEditPopupItem="openEditPopupItemFunc"
                />
              </v-expansion-panel>
            </v-expansion-panels>
          </template>
          <template slot="no-data">
            <div class="empty-communities">
              <div class="empty-communities-inline">
                <span class="no-community pt-4">
                  No incident has been posted in your communities, yet
                </span>
              </div>
            </div>
          </template>
        </v-data-iterator>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import SinglePost from '../ThreadSharing/SinglePost'
import { getCOmmunityIncidentList, getIncidentList } from '../../api/threadSharing'
import { COMMON_CONSTANTS } from '../../model/constants/commonConstants'
import PostIncident from '../ThreadSharing/PostIncident'

export default {
  components: {
    PostIncident,
    SinglePost
  },
  props: {
    posts: {
      type: Array,
      required: false
    },
    incidentsCommunityName: {
      type: Boolean,
      required: false
    },
    refreshIncidents: {
      type: Boolean,
      required: false
    }
  },
  data: () => ({
    editItem: null,
    openEditPopupItem: null,
    showPostIncident: false,
    status: 'SUCCESS',
    code: 'RESOURCE_RETRIEVED',
    message: 'Resource retrieved',
    validationMessages: [],
    search: '',
    itemsPerPageOptions: [5, 10, 20],
    itemsPerPage: 5,
    page: 1,
    items2: ['Incidents', 'Communities', 'Members'],
    toggle: false,
    tab: null,
    incidentList: []
  }),
  watch: {
    openEditPopupItem: function (newVal, oldVal) {
      if (oldVal != newVal) {
        this.showPostIncident = true
      }
    },
    refreshIncidents: function (newVal, oldVal) {
      if (newVal) this.getIncidentList()
    },
    search: function (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.debounce(() => {
          this.getIncidentList()
        }, 500)
      }
    }
  },
  methods: {
    debounce(fn, delay) {
      if (this.timeout) {
        clearTimeout(this.timeout)
      }
      this.timeout = setTimeout(() => {
        fn()
      }, delay)
    },
    openEditPopupItemFunc(post) {
      this.editItem = post
      this.showPostIncident = true
    },
    closeIncidentModal() {
      this.showPostIncident = false
    },
    refreshDataFunc() {
      this.getIncidentList()
    },
    getIncidentList() {
      const payload = {
        pageNumber: 1,
        pageSize: 500,
        orderBy: 'PostedTime',
        ascending: true,
        filter: {
          Condition: 'AND',
          FilterGroups: [
            {
              Condition: 'OR',
              FilterItems: [
                {
                  Value: this.search,
                  FieldName: 'Title',
                  Operator: 'Contains'
                },
                {
                  Value: this.search,
                  FieldName: 'Description',
                  Operator: 'Contains'
                },
                {
                  Value: this.search,
                  FieldName: 'DiscoveryAndDetection',
                  Operator: 'Contains'
                },
                {
                  Value: this.search,
                  FieldName: 'Scope',
                  Operator: 'Contains'
                }
              ],
              FilterGroups: []
            }
          ]
        }
      }
      const _this = this
      if (this.$router.currentRoute.name === 'Community') {
        getCOmmunityIncidentList(this.$route.params.id, payload).then((response) => {
          this.incidentList = response.data.data.results
          this.incidentList = this.incidentList.map((item) => {
            return { ...item, isToggle: false }
          })
        })
      } else {
        getIncidentList(payload).then((response) => {
          this.incidentList = response.data.data.results
          this.incidentList = this.incidentList.map((item) => {
            return { ...item, isToggle: false }
          })
        })
      }
    }
  },
  mounted() {
    this.getIncidentList()
  }
}
</script>

<style lang="scss">
#component-incidents {
  z-index: 8;
  .search-wrapper {
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    > div {
      padding-right: 10px;
    }

    .filter-icon {
      color: rgba(0, 0, 0, 0.34) !important;
      cursor: pointer;
    }
  }

  .v-cart-icon-wrapper {
    width: 48px;
    height: 48px;
    border-radius: 10px;
    margin-right: 24px;
    box-shadow: 0 2px 20px 0 rgba(100, 181, 246, 0.5);
    border: solid 1px rgba(100, 181, 246, 0.5);
    background-color: #e3f2fd;
  }

  .delete-info {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 13px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.72);
  }

  .invite-sub-header {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
  }

  .v-card-headline {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 20px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.4;
    letter-spacing: normal;
    color: #2196f3;
  }

  .v-card-sub-header {
    font-family: Helvetica;
    font-size: 15px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.2;
    letter-spacing: normal;
    color: #000 !important;
  }

  .share-inline-wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;

    .share-combo-label {
      width: 100%;
      text-align: left;
      margin-bottom: 8px;
      font-family: Helvetica;
      font-size: 16px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87);
    }
  }

  .v-overlay__scrim {
    border-radius: 0 !important;
  }

  .v-card:not(.v-sheet--tile):not(.v-card--shaped) {
    border-radius: 12px !important;
  }

  .v-overlay__content {
    border-radius: 12px !important;
    box-shadow: 0 11px 15px -7px rgba(80, 80, 80, 0.2), 0 24px 38px 0 rgba(80, 80, 80, 0.14),
      0 9px 46px 8px rgba(201, 113, 113, 0.12) !important;
  }

  .send-incident {
    margin-right: -18px;
  }

  .investigate-overlay,
  .post-incident-overlay {
    .v-overlay__content {
      width: 100%;
      height: 100vh;
      position: fixed;
      left: 0;
      top: 0;
      overflow-y: scroll;
    }
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s !important;
  }

  .fade-enter-active {
    transition: all 0.3s ease;
  }

  .fade-leave-active {
    transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
  }

  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0 !important;
  }

  .empty-communities {
    align-items: center;
    display: flex;
    justify-content: center;
    position: relative;
    min-height: 171px;
    width: 100%;

    .empty-communities-inline {
      align-items: center;
      display: flex;
      flex-direction: column;
      justify-content: center;
      min-width: 420px;

      .no-community {
        font-family: 'Open Sans', sans-serif !important;
        font-size: 24px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.29;
        letter-spacing: normal;
        color: #000;
        text-align: center;
        width: 100%;
        padding-top: 50px;
        padding-bottom: 16px;
      }
    }
  }

  .post-inc-btn {
    align-items: center;
    background-color: #2196f3 !important;
    color: #fff;
    display: flex;
    font-family: 'Open Sans', sans-serif !important;
    font-size: 14px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.71;
    letter-spacing: normal;
    height: 36px !important;
    text-transform: unset !important;
  }

  .v-expansion-panel {
    border-radius: 20px !important;
    box-shadow: 0 1px 5px 0 rgba(80, 80, 80, 0.2), 0 2px 2px 0 rgba(80, 80, 80, 0.14),
      0 3px 1px -2px rgba(80, 80, 80, 0.12) !important;
    background-color: #fff;
    border: unset !important;
  }

  .v-expansion-panel::before {
    box-shadow: unset !important;
  }

  .v-expansion-panel::after {
    border: unset !important;
  }

  .v-expansion-panel-header {
    box-shadow: unset !important;
    border: unset !important;
  }

  .v-window {
    border-radius: 20px !important;
    margin: 0 24px !important;
  }

  .v-expansion-panel-content {
    border-radius: 20px !important;
    font-family: 'Open Sans', sans-serif !important;
  }

  .v-expansion-panel-content__wrap {
    padding: 0 !important;
  }

  .create-com-btn {
    background-color: #2196f3 !important;
    color: #fff;
    font-family: 'Open Sans', sans-serif !important;
    font-size: 14px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.71;
    letter-spacing: normal;
    height: 36px !important;
    text-transform: capitalize !important;
    padding-bottom: 10px;
    width: 193px !important;
    max-width: 193px !important;
  }

  .v-form {
    width: 100%;
  }

  .delete-dialog-body {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 13px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.72);
    margin-top: 38px;
    margin-bottom: 4px;
  }
}
</style>
