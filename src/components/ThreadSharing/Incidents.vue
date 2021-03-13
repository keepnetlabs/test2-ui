<template>
  <div>
    <v-overlay
      id="new-community-overlay"
      :value="showPostIncident"
      :class="{ newCommunityOverlay: showPostIncident }"
      :opacity="1"
      :z-index="22"
      color="white"
      v-if="showPostIncident"
    >
      <post-incident
        :editItem="editItem"
        @closeIncidentModal="closeIncidentModal"
        @refreshData="refreshDataFunc"
        v-if="showPostIncident"
      />
    </v-overlay>
    <v-card id="component-incidents" flat color="basil">
      <v-card-text id="incidents-component-card" class="pt-0">
        <v-data-iterator
          :items="incidentList"
          :items-per-page.sync="itemsPerPage"
          :page="page"
          hide-default-footer
          @change="$forceUpdate()"
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
                  id="threat-sharing-incidents-search-textfield"
                  hide-details
                  prepend-inner-icon="mdi-magnify"
                  :disabled="incidentLoading"
                ></v-text-field>
              </div>
              <div>
                <v-select
                  :items="companyItem"
                  :placeholder="'Company'"
                  outlined
                  class="edit-select"
                  max-width="100"
                  v-model="companyValue"
                  hide-details
                  clearable
                  item-text="name"
                  :menu-props="{ offsetY: true }"
                  item-value="resourceId"
                  @change="!isLoadState && getIncidentList('', '', true)"
                  :disabled="incidentLoading"
                  id="threat-sharing-incidents-search-company"
                />
              </div>
              <div class="d-flex">
                <k-select
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
                  @change="!isLoadState && getIncidentList('', '', true)"
                  :slots="{ selection: true }"
                  :disabled="incidentLoading"
                  id="threat-sharing-incidents-search-threat"
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
                </k-select>
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
                    :searchValues="{
                      search,
                      companyValue,
                      threats,
                      page,
                      totalNumberOfRecords,
                      totalNumberOfPages,
                      itemsPerPage
                    }"
                    :incidents="incidentList"
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
                    {{
                      checkDatatableIsEmpty()
                        ? 'Search criteria has no results'
                        : 'No incident has been shared'
                    }}
                  </span>
                  <div
                    v-if="!search && !companyValue && !threats && routerName === 'Community'"
                    class="create-post-incident"
                    @click="showPostIncident = true"
                    block
                    rounded
                    id="threat-sharing-post-incident-button"
                  >
                    Post The First Incident
                  </div>
                </div>
              </div>
            </v-skeleton-loader>
          </template>
          <template v-slot:footer>
            <v-row
              class="mt-2"
              justify="end"
              style="margin: 5px !important;"
              v-if="incidentList && incidentList.length"
            >
              <el-pagination
                layout="sizes, prev, pager, next,slot"
                @size-change="handleSizeChange"
                :current-page.sync="page"
                :page-sizes="itemsPerPageArray"
                :page-size="itemsPerPage"
                :total="incidentList && totalNumberOfRecords"
                @current-change="onChangePagination"
              >
                <template>
                  <span class="el-pagination__total el-pagination__text--1">Rows per page:</span>
                  <span class="el-pagination__text el-pagination__text--2">
                    {{ page }}-{{ numberOfPages }}
                    of
                    {{ incidentList && totalNumberOfRecords }}
                  </span>
                </template>
              </el-pagination>
            </v-row>
          </template>
        </v-data-iterator>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import SinglePost from '../ThreadSharing/SinglePost'
import {
  getCommunityDetails,
  getCOmmunityIncidentList,
  getCommunityPost,
  getIncidentList,
  listThreatCategories
} from '../../api/threadSharing'
import PostIncident from '../ThreadSharing/PostIncident'
import { COMMON_CONSTANTS } from '../../model/constants/commonConstants'
import { getCompanyList, getCompanyListForThreatSharing } from '../../api/company'
import KSelect from '@/components/Common/Inputs/KSelect'

export default {
  components: {
    KSelect,
    PostIncident,
    SinglePost
  },
  computed: {
    numberOfPages() {
      return Math.ceil(this.incidentList && this.totalNumberOfRecords / this.itemsPerPage)
    },
    routerName() {
      return this.$route.name
    }
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
    },
    isLoadState: {
      type: Boolean
    },
    setLoadState: {
      required: false
    },
    isTableReload: {
      required: false
    },
    setThreatSharingStepLoading: {
      required: false
    }
  },
  data: () => ({
    search: null,
    totalNumberOfRecords: null,
    totalNumberOfPages: null,
    itemsPerPageArray: [5, 10, 20],
    page: 1,
    itemsPerPage: 5,
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
    itemsPerPageOptions: [5, 10, 20],
    items2: ['Incidents', 'Communities', 'Members'],
    toggle: false,
    tab: null,
    incidentList: [],
    incidentLoading: true
  }),
  watch: {
    incidentLoading: function (newVal, oldVal) {
      if (oldVal != newVal) {
        this.$emit('setThreatSharingStepLoading', newVal)
      }
    },
    openEditPopupItem: function (newVal, oldVal) {
      if (oldVal != newVal) {
        this.showPostIncident = true
      }
    },
    refreshIncidents: function (newVal, oldVal) {
      if (newVal && !this.isLoadState) {
        this.getIncidentList()
      }
    },
    search: function (newVal, oldVal) {
      if (newVal !== oldVal) {
        if (!newVal) {
          if (!this.isLoadState) {
            this.getIncidentList('', '', true)
          }
        } else {
          if (!this.isLoadState) {
            this.debounce(() => {
              this.getIncidentList('', '', true)
            }, 1000)
          }
        }
      }
    },
    watch: {
      '$route.query.postId'(val) {
        this.$forceUpdate()
      }
    }
  },
  methods: {
    checkDatatableIsEmpty() {
      let result = this.search || this.companyValue || this.threats.length
      return result
    },
    handleSizeChange(val) {
      this.itemsPerPage = val
      if (!this.isLoadState) {
        this.getIncidentList('', '', true)
      }
    },
    onChangePagination() {
      if (!this.isLoadState) {
        this.getIncidentList()
      }
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
      if (!this.isLoadState) {
        this.getIncidentList()
      }
    },
    getThreats() {
      listThreatCategories().then((response) => {
        this.threatsList = response.data.data
      })
    },
    getSharedPost() {
      let _this = this
      getCommunityPost(this.$route.query.postId)
        .then((response) => {
          let item = response.data.data
          this.numberOfPages = 1
          this.totalNumberOfRecords = 1
          item.isToggle = true
          item.communityPostResourceId = this.$route.query.postId
          this.incidentList.push(item)
          this.incidentLoading = false
        })
        .catch((error) => {
          if (error.response.status === 403) {
            this.$router
              .push({
                name: 'Threat Sharing',
                params: {
                  isCommunity: true,
                  postId: _this.$route.query.postId,
                  communityId: _this.$route.params['id'],
                  communityName: localStorage.getItem('communityName')
                }
              })
              .finally(() => {
                this.$store.dispatch('common/createSnackBar', {
                  color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
                  message: `you need to join the ${localStorage.getItem(
                    'communityName'
                  )} before viewing the post`
                })
              })
          }
        })
        .finally(() => {
          this.incidentLoading = false
        })
    },
    getIncidentList(memberId, companyId, isSearch) {
      let companyResourceId = Array.isArray(this.companyValue) ? null : this.companyValue
      const payload = {
        postedCompanyResourceId: companyId || companyResourceId,
        pageNumber: isSearch ? 1 : this.page,
        pageSize: this.itemsPerPage,
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
      this.incidentList = []
      if (memberId) {
        getCOmmunityIncidentList(this.$route.params.id, payload)
          .then((response) => {
            if (isSearch) this.page = 1
            this.incidentList = response.data.data.results
            this.incidentList = this.incidentList.map((item) => {
              return { ...item, isToggle: false }
            })
            this.incidentLoading = false
            this.totalNumberOfRecords = response.data.data.totalNumberOfRecords
            this.totalNumberOfPages = response.data.data.totalNumberOfPages
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
              if (isSearch) this.page = 1
              this.incidentList = response.data.data.results
              _this.incidentList = _this.incidentList.map((item) => {
                return { ...item, isToggle: false }
              })
              this.incidentLoading = false
              this.totalNumberOfRecords = response.data.data.totalNumberOfRecords
              this.totalNumberOfPages = response.data.data.totalNumberOfPages
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
              if (
                error.response &&
                error.response.data &&
                error.response.data.message === 'No permission to access resource'
              ) {
                this.$router
                  .push({
                    name: 'Threat Sharing',
                    params: {
                      isCommunity: true,
                      postId: _this.$route.query.postId,
                      communityId: _this.$route.params['id'],
                      communityName: localStorage.getItem('communityName')
                    }
                  })
                  .finally(() => {
                    this.$store.dispatch('common/createSnackBar', {
                      color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
                      message: `you need to join the ${localStorage.getItem(
                        'communityName'
                      )} before viewing the post`
                    })
                  })
              }
            })
        } else {
          if (!this.isLoadState || this.isTableReload) {
            getIncidentList(payload)
              .then((response) => {
                if (isSearch) this.page = 1
                this.incidentList = response.data.data.results
                this.incidentList = this.incidentList.map((item) => {
                  return { ...item, isToggle: false }
                })
                this.totalNumberOfRecords = response.data.data.totalNumberOfRecords
                this.totalNumberOfPages = response.data.data.totalNumberOfPages
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
    nextPage() {
      if (this.page + 1 <= this.numberOfPages) this.page += 1
    },
    formerPage() {
      if (this.page - 1 >= 1) this.page -= 1
    },
    updateItemsPerPage(number) {
      this.itemsPerPage = number
    }
  },
  created() {
    getCompanyListForThreatSharing().then((response) => (this.companyItem = response.data.data))
    this.getThreats()
    let _this = this
    if (this.$route.query && this.$route.query.postId) {
      this.isSharedPost = true
      this.getSharedPost()
    } else {
      if (this.isLoadState) {
        const incidentsData = this.$store.state['incidents'].incidents.incidentsData
        if (incidentsData) {
          this.incidentList = incidentsData.tableData
          this.incidentList = this.incidentList.map((item) => {
            return { ...item, isToggle: false }
          })
          this.page = incidentsData.searchValues.page
          this.totalNumberOfRecords = incidentsData.searchValues.totalNumberOfRecords
          this.totalNumberOfPages = incidentsData.searchValues.totalNumberOfPages
          this.itemsPerPage = incidentsData.searchValues.itemsPerPage
          this.search = incidentsData.searchValues.search
          this.companyValue = incidentsData.searchValues.companyValue
          this.threats = incidentsData.searchValues.threats
          this.incidentLoading = false
          setTimeout(() => {
            _this.$emit('setLoadState')
          }, 100)
        } else {
          this.getIncidentList()
        }
        if (this.isTableReload) {
          this.page = 1
          this.search = null
          this.companyValue = []
          this.threats = []
          this.getIncidentList()
          this.$store.dispatch('tableReload/setTableReload', false)
        }
      } else {
        if (!this.isLoadState) {
          this.getIncidentList()
        }
      }
    }
  }
}
</script>

<style lang="scss" src="./Incidents.scss"></style>
