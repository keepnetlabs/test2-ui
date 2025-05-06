<template>
  <div>
    <v-overlay
      v-if="showPostIncident"
      color="white"
      id="new-community-overlay"
      :value="showPostIncident"
      :class="{ newCommunityOverlay: showPostIncident }"
      :opacity="1"
      :z-index="9"
    >
      <post-incident
        v-if="showPostIncident"
        ref="incidentModal"
        :editItem="editItem"
        @closeIncidentModal="closeIncidentModal"
        @refreshData="refreshDataFunc"
      />
    </v-overlay>
    <v-card id="component-incidents" flat color="basil">
      <v-card-text id="incidents-component-card" class="pt-0">
        <v-data-iterator
          hide-default-footer
          :items="incidentList"
          :items-per-page.sync="itemsPerPage"
          :page="page"
          @change="$forceUpdate()"
        >
          <template v-slot:header>
            <div class="search-wrapper">
              <div>
                <v-text-field
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
                  v-model="companyValue"
                  item-value="resourceId"
                  id="threat-sharing-incidents-search-company"
                  outlined
                  class="edit-select"
                  max-width="100"
                  hide-details
                  clearable
                  item-text="name"
                  :items="companyItem"
                  :placeholder="'Company'"
                  :disabled="incidentLoading"
                  :menu-props="{ offsetY: true }"
                  @change="callForIncidentList"
                />
              </div>
              <div class="d-flex">
                <k-select
                  v-model="threats"
                  placeholder="Threat"
                  outlined
                  class="edit-select"
                  multiple
                  hide-details
                  item-text="name"
                  item-value="resourceId"
                  id="threat-sharing-incidents-search-threat"
                  :items="threatsList"
                  :menu-props="{ offsetY: true }"
                  :slots="{ selection: true }"
                  :disabled="incidentLoading"
                  @change="callForIncidentList"
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
                  popout
                  style="border-image: none !important;"
                  class="mb-4 mt-0"
                  id="edit-incident-post"
                >
                  <singlePost
                    :post="item"
                    :postIndex="ind"
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
                    @refreshData="refreshDataFunc"
                    @openEditPopupItem="openEditPopupItemFunc"
                  />
                </v-expansion-panel>
              </v-expansion-panels>
            </v-skeleton-loader>
          </template>
          <template #no-data>
            <v-skeleton-loader :loading="incidentLoading" type="article, actions">
              <div class="empty-communities">
                <div class="empty-communities-inline">
                  <span class="no-community pt-4">
                    {{
                      checkDatatableIsEmpty()
                        ? 'Sorry, that search and filter criteria has no results.'
                        : 'No incident has been shared'
                    }}
                  </span>
                  <div
                    v-if="showPostFirstIncidentButton"
                    class="create-post-incident"
                    id="threat-sharing-post-incident-button"
                    @click="showPostIncident = true"
                  >
                    Post The First Incident
                  </div>
                </div>
              </div>
            </v-skeleton-loader>
          </template>
          <template #footer>
            <v-row
              v-if="incidentList && incidentList.length"
              class="mt-2"
              justify="end"
              style="margin: 5px !important;"
            >
              <el-pagination
                layout="sizes, prev, pager, next,slot"
                :current-page.sync="page"
                :page-sizes="itemsPerPageArray"
                :page-size="itemsPerPage"
                :total="incidentList && totalNumberOfRecords"
                @size-change="handleSizeChange"
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
import SinglePost from '@/components/ThreatSharing/SinglePost/SinglePost'
import {
  getCOmmunityIncidentList,
  getCommunityPost,
  getIncidentList,
  listThreatCategories
} from '@/api/threatSharing'
import PostIncident from '@/components/ThreatSharing/PostIncident/PostIncident'
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'
import { getCompanyListForThreatSharing } from '@/api/company'
import KSelect from '@/components/Common/Inputs/KSelect'
import useDebounce from '@/hooks/useDebounce'
import { getIncidentListPayload } from '@/components/ThreatSharing/Incidents/utils'

export default {
  components: {
    KSelect,
    PostIncident,
    SinglePost
  },
  mixins: [useDebounce],
  props: {
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
    }
  },
  data: () => ({
    search: null,
    totalNumberOfRecords: null,
    totalNumberOfPages: null,
    itemsPerPageArray: [5, 10, 20],
    page: 1,
    itemsPerPage: 5,
    companyItem: [],
    companyValue: null,
    threatsList: [],
    threats: [],
    editItem: null,
    openEditPopupItem: null,
    showPostIncident: false,
    incidentList: [],
    incidentLoading: true
  }),
  computed: {
    showPostFirstIncidentButton() {
      return (
        !this.search &&
        !this.companyValue &&
        this.threats.length === 0 &&
        this.incidentList.length === 0 &&
        this.routerName === 'Community'
      )
    },
    numberOfPages() {
      return Math.ceil(this.incidentList && this.totalNumberOfRecords / this.itemsPerPage)
    },
    routerName() {
      return this.$route.name
    }
  },
  watch: {
    incidentLoading: function (newVal, oldVal) {
      if (oldVal !== newVal) {
        this.$emit('setThreatSharingStepLoading', newVal)
      }
    },
    openEditPopupItem: function (newVal, oldVal) {
      if (oldVal !== newVal) {
        this.showPostIncident = true
      }
    },
    refreshIncidents: function (newVal) {
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
        } else if (!this.isLoadState) {
          this.debounce(() => {
            this.getIncidentList('', '', true)
          }, 750)
        }
      }
    },
    '$route.query.postId'() {
      this.$forceUpdate()
    }
  },
  created() {
    getCompanyListForThreatSharing().then((response) => (this.companyItem = response.data.data))
    this.getThreats()
    if (this.$route.query && this.$route.query.postId) {
      this.getSharedPost()
    } else {
      const incidentsData = this.$store.state['incidents'].incidents.incidentsData
      if (!this.isLoadState || !incidentsData) {
        return this.getIncidentList()
      }
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
        this.$emit('setLoadState')
      }, 100)

      if (this.isTableReload) {
        this.page = 1
        this.search = null
        this.companyValue = []
        this.threats = []
        this.getIncidentList()
        this.$store.dispatch('tableReload/setTableReload', false)
      }
    }
  },
  methods: {
    callForIncidentList() {
      !this.isLoadState && this.getIncidentList('', '', true)
    },
    checkDatatableIsEmpty() {
      return this.search || this.companyValue || this.threats.length
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
    openEditPopupItemFunc(post) {
      this.editItem = post
      this.showPostIncident = true
    },
    checkIfCanCloseIncidentModal() {
      if (this.$refs.incidentModal) {
        this.$refs.incidentModal.onCancelClicked()
      }
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
                  postId: this.$route.query.postId,
                  communityId: this.$route.params['id'],
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
      const payload = getIncidentListPayload(
        companyId || companyResourceId,
        isSearch ? 1 : this.page,
        this.itemsPerPage,
        this.search,
        this.threats
      )
      this.incidentLoading = true
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
          .finally(() => (this.incidentLoading = false))
      } else {
        if (this.$router.currentRoute.name === 'Community') {
          getCOmmunityIncidentList(this.$route.params.id, payload)
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
              this.incidentLoading = false
              if (error?.response?.data?.message === 'No permission to access resource') {
                this.$router
                  .push({
                    name: 'Threat Sharing',
                    params: {
                      isCommunity: true,
                      postId: this.$route.query.postId,
                      communityId: this.$route.params['id'],
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
        } else if (!this.isLoadState || this.isTableReload) {
          getIncidentList(payload)
            .then((response) => {
              if (isSearch) this.page = 1
              this.incidentList = response.data.data.results
              this.incidentList = this.incidentList.map((item) => {
                return { ...item, isToggle: false }
              })
              this.totalNumberOfRecords = response.data.data.totalNumberOfRecords
              this.totalNumberOfPages = response.data.data.totalNumberOfPages
            })
            .finally(() => {
              this.incidentLoading = false
            })
        }
      }
    }
  }
}
</script>
