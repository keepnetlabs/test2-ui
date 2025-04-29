<template>
  <app-dialog
    v-if="isShow"
    :status="true"
    icon="mdi-account-multiple-plus"
    :title="getTitle"
    :subtitle="getSubtitle"
    title-id="text--create-company-group-popup-title"
    subtitle-id="text--create-company-group-popup-subtitle"
    customSize="800"
    @changeStatus="changeStatus"
  >
    <template v-slot:app-dialog-body>
      <v-form
        v-if="(!!selectedRow && !!isEdit === true) || !!isEdit === false"
        ref="refCreateGroupForm"
        lazy-validation
      >
        <v-list-item class="px-0">
          <v-list-item-content :class="!isEdit ? 'pt-0' : 'py-0 mb-n3'">
            <label for="input--company-group-name" class="create-company-group__label"
              >Company Group Name</label
            >
            <InputEntityName
              v-model.trim="groupName"
              id="input--company-group-name"
              entityName="company group"
              :initialRules="companyGroupNameRules"
            />
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="!isEdit" class="p-0">
          <v-list-item-content class="py-0" style="overflow: visible;">
            <label for="input--company-group-add-members" class="create-company-group__label mb-0"
              >Add Members</label
            >
            <v-list-item-title
              class="v-card-sub-header bottom-margin create-company-group__label--sub"
            >
              You can select multiple companies
            </v-list-item-title>
            <v-autocomplete
              v-infinite-scroll="{
                target: '.input--company-group-add-members',
                callback: getCompanies,
                isOriginalVuetifyComponent: true
              }"
              v-select-search-handler="{
                callback: getCompaniesSearch,
                isLoadingKey: 'isCompaniesLoading',
                isOriginalVuetifyComponent: true
              }"
              v-model.trim="selectedCompanies"
              id="input--company-group-add-members"
              :menu-props="{
                contentClass: 'input--company-group-add-members',
                auto: true
              }"
              :items="companies"
              :return-object="true"
              auto-select-first
              deletable-chips
              class="company-groups-select-company"
              autocomplete="off"
              chips
              item-text="companyName"
              item-value="companyNameResourceId"
              multiple
              outlined
              persistent-hint
              placeholder="Select companies"
              :no-data-text="isCompaniesLoading ? 'Loading...' : 'No company available'"
              @focus="showLoader = true"
            >
            </v-autocomplete>
          </v-list-item-content>
        </v-list-item>
      </v-form>
    </template>
    <template v-slot:app-dialog-footer>
      <div class="delete-user__footer">
        <v-btn
          id="btn-cancel--company-save-company-groups-popup"
          color="#f56c6c"
          class="delete-user__footer-button"
          text
          @click="changeStatus(false)"
          >{{ labels.Cancel }}</v-btn
        >
        <v-btn
          id="btn-save--company-save-company-groups-popup"
          color="#2196f3"
          class="delete-user__footer-button"
          style="padding: 0;"
          text
          :disabled="saveDisable"
          @click="save"
          >{{ labels.Save }}</v-btn
        >
      </div>
    </template>
  </app-dialog>
</template>

<script>
import AppDialog from '../AppDialog'
import {
  createCompanyGroups,
  searchCompanies,
  searchGroupCompanies,
  updateCompanyGroup
} from '@/api/company'
import { maxLength, required, startsWithSpace } from '@/utils/validations'
import labels from '@/model/constants/labels'
import InfiniteScroll from '@/directives/infinite-scroll'
import SelectSearchHandler from '@/directives/select-search-handler'
import { getSelectSearchPayload } from '@/utils/functions'
import InputEntityName from '@/components/Common/Inputs/InputEntityName'

export default {
  name: 'CreateItemModal',
  components: {
    AppDialog,
    InputEntityName
  },
  directives: {
    'infinite-scroll': InfiniteScroll,
    'select-search-handler': SelectSearchHandler
  },
  props: {
    isShow: {
      type: Boolean
    },
    selectedRow: {
      type: Object
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    forCompany: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      saveDisable: false,
      isCompaniesLoading: true,
      labels,
      search: null,
      groupName: '',
      companies: [],
      selectedCompanies: [],
      validations: {
        required,
        maxLength,
        startsWithSpace
      },
      totalNumberOfPagesOfCompanies: 1,
      payload: {
        pageNumber: 1,
        pageSize: 10000,
        orderBy: 'CompanyName',
        ascending: true,
        filter: {
          Condition: 'AND',
          FilterGroups: [
            {
              Condition: 'AND',
              FilterItems: [],
              FilterGroups: []
            },
            {
              Condition: 'OR',
              FilterItems: [],
              FilterGroups: []
            }
          ]
        }
      },
      showLoader: false,
      companyGroupNameRules: [
        (v) => this.validations.required(v),
        (v) => this.validations.startsWithSpace(v),
        (v) =>
          this.validations.maxLength(
            v,
            64,
            labels.getMaxLengthMessage(labels.CompanyGroupNameSecondLower)
          )
      ]
    }
  },
  computed: {
    getTitle() {
      return this.isEdit ? 'Edit Company Group' : 'Create New Company Group'
    },
    getSubtitle() {
      return this.isEdit
        ? 'Edit a name to your group and save'
        : 'Give a name to your new group and save'
    }
  },
  created() {
    this.getCompanies()
    if (this.selectedRow) {
      this.selectedCompanies = this.selectedRow
      this.editHandler()
    }
  },
  methods: {
    getCompanies(addPage) {
      if (addPage) {
        this.payload.pageNumber += 1
        if (this.payload.pageNumber > this.totalNumberOfPagesOfCompanies) return
      }
      this.isCompaniesLoading = true
      searchCompanies(this.payload)
        .then((response) => {
          this.setCompanies(response)
          this.totalNumberOfPagesOfCompanies = response.data.data.totalNumberOfPages
        })
        .finally(() => {
          this.showLoader = false
          this.isCompaniesLoading = false
        })
    },
    setCompanies(response) {
      const { data: { data = [] } = [] } = response
      this.companies = [...this.companies, ...data.results]
    },
    getCompaniesSearch(search = '') {
      if (search) {
        searchCompanies(getSelectSearchPayload(this.payload, search, 'CompanyName'))
          .then(this.setCompanies)
          .finally(() => {
            this.isCompaniesLoading = false
          })
      } else {
        this.getCompanies()
      }
    },
    editHandler() {
      if ((this.isShow && this.isEdit) || (this.isShow && this.forCompany)) {
        const _p = this.payload
        this.groupName = this.forCompany ? null : this.selectedRow.name
        if (this.forCompany) {
          this.selectedCompanies = [this.selectedRow]
        } else {
          searchGroupCompanies(this.selectedRow.resourceId, _p)
            .then((response) => {
              this.selectedCompanies =
                response.data.data.hasOwnProperty('results') &&
                response.data.data.results.length > 0
                  ? response.data.data.results
                  : []
              this.companies.push(...this.selectedCompanies)
            })
            .catch(() => {})
        }
      }
    },
    changeStatus(value) {
      if (value === false) {
        this.companies = null
        this.groupName = null
        this.selectedCompanies = []
        this.$refs.refCreateGroupForm.reset()
      }
      this.$emit('changeModalStatus', value)
    },
    save() {
      if (this.$refs.refCreateGroupForm.validate()) {
        this.saveDisable = true
        let resourceIDs = []
        !!this.selectedCompanies &&
          Object.entries(this.selectedCompanies).forEach((x) => {
            resourceIDs.push(x[1].companyResourceId)
          })
        const payload = {
          name: this.groupName,
          companyResourceIdArray: resourceIDs
        }

        if (!this.isEdit || this.forCompany) {
          createCompanyGroups(payload)
            .then((response) => {
              this.$emit('companyGroupCreated', response.data.data.resourceId, this.groupName)
              this.changeStatus(false)
            })
            .finally(() => (this.saveDisable = false))
        } else {
          updateCompanyGroup(this.selectedRow.resourceId, payload)
            .then((response) => {
              localStorage.setItem('companyGroupName', this.groupName)
              this.$emit('companyGroupCreated', response.data.resourceId)
              this.changeStatus(false)
            })
            .finally(() => (this.saveDisable = false))
        }
      }
    }
  }
}
</script>
