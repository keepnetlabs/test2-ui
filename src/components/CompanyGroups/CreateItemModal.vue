<template>
  <app-dialog
    v-if="isShow"
    :status="true"
    icon="mdi-account-multiple-plus"
    :title="this.isEdit ? 'Edit Company Group' : 'Create New Company Group'"
    :subtitle="
      this.isEdit ? 'Edit a name to your group and save' : 'Give a name to your new group and save'
    "
    @changeStatus="changeStatus"
  >
    <template v-slot:app-dialog-body>
      <v-form
        v-if="(!!selectedRow && !!isEdit === true) || !!isEdit === false"
        ref="refCreateGroupForm"
        lazy-validation
      >
        <v-list-item class="px-0">
          <v-list-item-content class="pt-0">
            <label class="create-company-group__label">Company Group Name</label>
            <v-text-field
              v-model.trim="groupName"
              placeholder="Enter name"
              dense
              outlined
              persistent-hint
              hint="*Required"
              autocomplete="off"
              :rules="[
                (v) => validations.required(v),
                (v) => validations.startsWithSpace(v),
                (v) =>
                  validations.maxLength(
                    v,
                    64,
                    labels.getMaxLengthMessage(labels.CompanyGroupNameSecondLower)
                  )
              ]"
            ></v-text-field>
          </v-list-item-content>
        </v-list-item>
        <v-list-item class="p-0">
          <v-list-item-content class="py-0">
            <label class="create-company-group__label mb-0">Add Members</label>
            <v-list-item-title
              class="v-card-sub-header bottom-margin create-company-group__label--sub"
            >
              You can select multiple companies
            </v-list-item-title>
            <v-autocomplete
              v-model.trim="selectedCompanies"
              :items="companies"
              no-data-text="No companies displayed"
              :return-object="true"
              :search-input.sync="search"
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
            />
          </v-list-item-content>
        </v-list-item>
      </v-form>
    </template>
    <template v-slot:app-dialog-footer>
      <div class="delete-user__footer">
        <v-btn
          @click="changeStatus(false)"
          color="#f56c6c"
          class="delete-user__footer-button"
          text
          >{{ labels.Cancel }}</v-btn
        >
        <v-btn
          @click="save"
          color="#2196f3"
          class="delete-user__footer-button"
          style="padding: 0;"
          text
          :disabled="saveDisable"
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

export default {
  name: 'CreateItemModal',
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
  components: {
    AppDialog
  },
  data() {
    return {
      saveDisable: false,
      labels,
      search: null,
      groupName: '',
      companies: [],
      selectedCompanies: null,
      validations: {
        required,
        maxLength,
        startsWithSpace
      },
      payload: {
        pageSize: 100000,
        orderBy: 'CompanyName',
        ascending: true,
        filter: {
          Condition: 'AND',
          FilterGroups: [
            {
              Condition: 'AND',
              FilterItems: [],
              FilterGroups: []
            }
          ]
        }
      }
    }
  },
  beforeUpdate() {
    this.selectedCompanies = this.selectedRow
    this.editHandler()
  },
  methods: {
    getDefaultCompanies() {
      searchCompanies(this.payload).then((response) => {
        this.companies =
          response.data.data.hasOwnProperty('results') && response.data.data.results.length > 0
            ? response.data.data.results
            : []
      })
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
            })
            .catch(() => {})
        }
      }
    },
    changeStatus(value) {
      if (value === false) {
        this.companies = null
        this.groupName = null
        this.selectedCompanies = null
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
        const payload = { name: this.groupName, companyResourceIdArray: resourceIDs }

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
    },
    debounce(fn, delay) {
      if (this.timeout) {
        clearTimeout(this.timeout)
      }
      this.timeout = setTimeout(() => {
        fn()
      }, delay)
    }
  },
  watch: {
    search(val) {
      if (val && val.length > 2) {
        /*
        this.debounce(() => {
          this.payload.filter.FilterGroups[0].FilterItems[0].Value = val
          searchCompanies(this.payload)
            .then((response) => {
              debugger
              this.companies = [
                ...this.companies,
                ...(response.data.data.hasOwnProperty('results') &&
                response.data.data.results.length > 0
                  ? response.data.data.results
                  : [])
              ]
            })
            .catch(() => {})
        }, 1000)
         */
      }
    },
    isShow(status) {
      status && this.getDefaultCompanies()
    }
  }
}
</script>

<style lang="scss">
.create-company-group {
  &__label {
    font-size: 20px;
    font-weight: 600;
    line-height: 23px;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
    margin-bottom: 16px !important;
    &--sub {
      font-size: 14px;
      line-height: 21px;
      color: rgba(0, 0, 0, 0.87);
      margin-bottom: 16px !important;
    }
  }
  &__footer {
    display: flex;
    justify-content: flex-end;
    width: 100%;
    &-button {
      font-size: 14px;
      font-weight: 600;
      line-height: 1.71;
      letter-spacing: normal;
    }
  }
}
.company-groups-select-company {
  .v-chip {
    padding: 6px 12px;
    height: auto;
    &__content {
      word-break: break-word;
      white-space: normal;
    }
  }
}
</style>
