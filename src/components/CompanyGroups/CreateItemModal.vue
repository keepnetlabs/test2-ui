<template>
  <app-dialog
    :status="isShow"
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
        <v-list-item class="px-0 py-0">
          <v-list-item-content class="py-0">
            <label class="create-company-group__label">Company Group Name</label>
            <v-text-field
              v-model="groupName"
              placeholder="Enter name"
              dense
              outlined
              persistent-hint
              hint="*Required"
              autocomplete="off"
              :rules="[
                (v) => validations.required(v, 'Required'),
                (v) => validations.maxLength(v, 150, 'Max 150 characters')
              ]"
            ></v-text-field>
          </v-list-item-content>
        </v-list-item>
        <v-list-item class="px-0 py-0">
          <v-list-item-content class="py-0">
            <label class="create-company-group__label mb-0">Add Members</label>
            <v-list-item-title
              class="v-card-sub-header bottom-margin create-company-group__label--sub"
            >
              You can select multiple companies
            </v-list-item-title>
            <v-autocomplete
              v-model="selectedCompanies"
              :items="companies"
              no-data-text="No companies displayed"
              :return-object="true"
              :search-input.sync="search"
              auto-select-first
              autocomplete="off"
              chips
              item-text="companyName"
              item-value="companyNameResourceId"
              multiple
              outlined
              persistent-hint
              placeholder="Select companies"
            ></v-autocomplete>
          </v-list-item-content>
        </v-list-item>
      </v-form>
    </template>
    <template v-slot:app-dialog-footer>
      <div class="delete-user__footer">
        <v-btn @click="changeStatus(false)" color="#f56c6c" class="delete-user__footer-button" text
          >CANCEL</v-btn
        >
        <v-btn
          @click="save"
          color="#2196f3"
          class="delete-user__footer-button"
          style="padding: 0;"
          text
          >SAVE</v-btn
        >
      </div>
    </template>
  </app-dialog>
</template>

<script>
import AppDialog from '../AppDialog'
import {
  searchCompanies,
  createCompanyGroups,
  searchGroupCompanies,
  updateCompanyGroup
} from '@/api/company'
import { maxLength, required } from '@/utils/validations'
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'
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
      search: null,
      groupName: '',
      companies: [],
      selectedCompanies: null,
      validations: {
        required,
        maxLength
      },
      payload: {
        pageSize: 100,
        orderBy: 'CompanyName',
        ascending: true,
        filter: {
          Condition: 'AND',
          FilterGroups: [
            {
              Condition: 'OR',
              FilterItems: [
                {
                  FieldName: 'CompanyName',
                  Operator: 'Contains',
                  Value: ''
                }
              ],
              FilterGroups: []
            }
          ]
        }
      }
    }
  },
  computed: {},
  mounted() {
    searchCompanies(this.payload).then((response) => {
      this.companies =
        response.data.data.hasOwnProperty('results') && response.data.data.results.length > 0
          ? response.data.data.results
          : []
    })
  },
  beforeUpdate() {
    this.editHandler()
  },
  methods: {
    editHandler() {
      if ((this.isShow && this.isEdit) || (this.isShow && this.forCompany)) {
        const _p = this.payload
        //_p.pageSize = 500
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
      this.$emit('changeModalStatus', value)
      if (value === false) {
        this.companies = []
        this.groupName = null
        this.selectedCompanies = null
        this.$refs.refCreateGroupForm.reset()
      }
    },
    save() {
      if (this.$refs.refCreateGroupForm.validate()) {
        let resourceIDs = []
        !!this.selectedCompanies &&
          Object.entries(this.selectedCompanies).forEach((x) => {
            resourceIDs.push(x[1].companyResourceId)
          })
        const payload = { name: this.groupName, companyResourceIdArray: resourceIDs }

        if (!this.isEdit || this.forCompany) {
          createCompanyGroups(payload).then((response) => {
            if (response.data && response.data.code === 'RESOURCE_CREATED') {
              this.$store.dispatch('common/createSnackBar', {
                message: 'Company group has been created',
                color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
                icon: 'mdi-check-circle-outline'
              })
              this.$emit('companyGroupCreated', response.data.resourceId)
              this.changeStatus(false)
            }
          })
        } else {
          updateCompanyGroup(this.selectedRow.resourceId, payload).then((response) => {
            if (response.data && response.data.code === 'RESOURCE_UPDATED') {
              this.$store.dispatch('common/createSnackBar', {
                message: 'Company group has been updated',
                color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
                icon: 'mdi-check-circle-outline'
              })
              this.$emit('companyGroupCreated', response.data.resourceId)
              this.changeStatus(false)
            }
          })
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
        this.debounce(() => {
          this.payload.filter.FilterGroups[0].FilterItems[0].Value = val
          searchCompanies(this.payload)
            .then((response) => {
              this.companies = [
                ...this.companies,
                ...(response.data.data.hasOwnProperty('results') &&
                response.data.data.results.length > 0
                  ? response.data.data.results
                  : [])
              ]
            })
            .catch(() => {})
        }, 500)
      }
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
</style>
