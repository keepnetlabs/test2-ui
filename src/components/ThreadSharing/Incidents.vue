<template>
  <div>
    <v-overlay
      id="new-community-overlay"
      :value="showPostIncident"
      :class="{ newCommunityOverlay: showPostIncident }"
      :opacity="1"
      :z-index="9"
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
          :page="page"
          @update:page="onChangePagination"
        >
          <template v-slot:header>
            <div class="search-wrapper">
              <div>
                <v-text-field
                  @mouseover.native="hover = true"
                  placeholder="Search"
                  outlined
                  class="filter-field search-wrapper__search-filter"
                  v-model.trim="search"
                  id="incidents-search-textfield"
                  hide-details
                  prepend-inner-icon="mdi-magnify"
                ></v-text-field>
              </div>
              <div>
                <v-select
                  :items="companyItem"
                  :placeholder="'Company'"
                  outlined
                  class="edit-select"
                  v-model="companyValue"
                  hide-details
                  clearable
                  item-text="name"
                  :menu-props="{ offsetY: true }"
                  item-value="resourceId"
                  @change="getIncidentList()"
                />
              </div>
              <div class="d-flex">
                <v-select
                  :items="threatsList"
                  placeholder="Threat"
                  outlined
                  class="edit-select"
                  v-model="threats"
                  multiple
                  hide-details
                  :menu-props="{ offsetY: true }"
                  item-text="name"
                  item-value="resourceId"
                  @change="getIncidentList()"
                >
                  <template v-slot:selection="{ item, index }">
                    <span
                      v-if="index === 0"
                      style="
                        font-size: 13px;
                        line-height: 1.6;
                        letter-spacing: normal;
                        color: rgba(0, 0, 0, 0.72) !important;
                      "
                    >
                      {{ item.name }}
                    </span>
                    <span v-if="index === 1" class="caption pl-1">
                      (+{{ threats.length - 1 }})</span
                    >
                  </template>
                </v-select>
              </div>
            </div>
          </template>
          <template v-slot:default="props">
            <v-skeleton-loader :loading="incidentLoading" type="article, actions">
              <v-expansion-panels :accordion="false" :multiple="false">
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
                    :key="$route.query.postId || '1'"
                  />
                </v-expansion-panel>
              </v-expansion-panels>
            </v-skeleton-loader>
          </template>
          <template slot="no-data">
            <v-skeleton-loader :loading="incidentLoading" type="article, actions">
              <div class="empty-communities">
                <div class="empty-communities-inline">
                  <span class="no-community pt-4">
                    No incident has been shared, yet
                  </span>
                  <div
                    class="create-post-incident"
                    @click="showPostIncident = true"
                    block
                    rounded
                    id="post-inc-btn"
                  >
                    Post The First Incident
                  </div>
                </div>
              </div>
            </v-skeleton-loader>
          </template>
        </v-data-iterator>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import SinglePost from '../ThreadSharing/SinglePost'
import {
  getCOmmunityIncidentList,
  getCommunityPost,
  getIncidentList,
  listThreatCategories
} from '../../api/threadSharing'
import PostIncident from '../ThreadSharing/PostIncident'
import { COMMON_CONSTANTS } from '../../model/constants/commonConstants'
import { getCompanyList } from '../../api/company'

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
    isSharedPost: true,
    companyItem: [],
    companyValue: null,
    threatsList: [],
    threats: [],
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
    incidentList: [],
    incidentLoading: true
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
    },
    watch: {
      '$route.query.postId'(val) {
        this.$forceUpdate()
      }
    }
  },
  methods: {
    onChangePagination(val) {
      this.page = val
    },
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
    getThreats() {
      listThreatCategories().then((response) => {
        this.threatsList = response.data.data
      })
    },
    getSharedPost() {
      getCommunityPost(this.$route.query.postId)
        .then((response) => {
          let item = response.data.data
          item.isToggle = true
          item.communityPostResourceId = this.$route.query.postId
          this.incidentList.push(item)
          this.incidentLoading = false
        })
        .catch((error) => {
          this.$store.dispatch('common/createSnackBar', {
            color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
            message: 'Incidents can not be reached'
          })
        })
    },
    getIncidentList(memberId, companyId) {
      let companyResourceId = this.companyValue
      const payload = {
        postedCompanyResourceId: companyId || companyResourceId,
        pageNumber: 1,
        pageSize: 500,
        orderBy: 'PostedTime',
        ascending: false,
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
            },
            {
              Condition: 'AND',
              FilterItems: [
                {
                  FieldName: 'CategoryResourceId',
                  Operator: 'Include',
                  Value: this.threats.toString()
                }
              ],
              FilterGroups: []
            }
          ]
        }
      }
      this.incidentLoading = true
      const _this = this
      if (memberId) {
        getCOmmunityIncidentList(this.$route.params.id, payload)
          .then((response) => {
            this.incidentList = response.data.data.results
            this.incidentList = this.incidentList.map((item) => {
              return { ...item, isToggle: false }
            })
            this.incidentLoading = false
          })
          .catch((error) => {
            if (
              error.response &&
              error.response.data &&
              error.response.data.code === 'RESOURCE_NOT_FOUND'
            ) {
              this.incidentList = []
              this.incidentLoading = false
            }
          })
      } else {
        if (this.$router.currentRoute.name === 'Community') {
          getCOmmunityIncidentList(this.$route.params.id, payload)
            .then((response) => {
              this.incidentList = response.data.data.results
              _this.incidentList = _this.incidentList.map((item) => {
                return { ...item, isToggle: false }
              })
              _this.incidentLoading = false
            })
            .catch((error) => {
              if (
                error.response &&
                error.response.data &&
                error.response.data.code === 'RESOURCE_NOT_FOUND'
              ) {
                this.incidentList = []
                this.incidentLoading = false
              }
            })
        } else {
          getIncidentList(payload)
            .then((response) => {
              this.incidentList = response.data.data.results
              this.incidentList = this.incidentList.map((item) => {
                return { ...item, isToggle: false }
              })
              this.incidentLoading = false
            })
            .catch((error) => {
              if (
                error.response &&
                error.response.data &&
                error.response.data.code === 'RESOURCE_NOT_FOUND'
              ) {
                this.incidentList = []
                this.incidentLoading = false
              }
            })
        }
      }
    }
  },
  mounted() {
    getCompanyList().then((response) => (this.companyItem = response.data.data))
    this.getThreats()
    if (this.$route.query && this.$route.query.postId) {
      this.isSharedPost = true
      this.getSharedPost()
    } else {
      this.getIncidentList()
    }
  }
}
</script>

<style lang="scss">
#component-incidents {
  z-index: 8;
  .create-post-incident {
    font-size: 14px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.71;
    letter-spacing: normal;
    text-align: center;
    color: #ffffff;
    text-transform: uppercase;
    width: 207px;
    border-radius: 18px;
    height: 36px;
    -webkit-box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.1), 0 2px 5px 0 rgba(33, 150, 243, 0.3);
    box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.1), 0 2px 5px 0 rgba(33, 150, 243, 0.3);
    background-color: #2196f3;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
  .search-wrapper {
    align-items: center;
    display: flex;
    flex-direction: row;
    padding: 8px;
    margin: 24px 0px;
    justify-content: flex-start;
    background-color: #f2f2f2;
    border-radius: 8px;
    .v-text-field--outlined > .v-input__control > .v-input__slot {
      background: white !important;
    }
    > div {
      &:first-child {
        width: 220px;
      }
      padding-right: 8px;
      width: 220px;
    }
    &__search-filter {
      font-size: 16px !important;
      padding-right: 8px;
      .v-input__slot {
        min-height: 40px !important;
      }
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
      z-index: 9999;
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
    height: 100% !important;
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
