<template>
  <app-dialog
    :status="isShow"
    icon="mdi-account-multiple-plus"
    title="Create New Company Group"
    subtitle="Give a name to your new group and save"
  >
    <template v-slot:app-dialog-body>
      <v-form ref="refCreateGroupForm" lazy-validation>
        <v-list-item class="px-0 py-0">
          <v-list-item-content class="py-0">
            <label class="create-company-group__label">Company Group Name</label>
            <v-text-field
              placeholder="Enter name"
              dense
              outlined
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
              :items="companies"
              v-model="selectedCompanies"
              chips
              clearable
              item-text="companyName"
              item-value="companyNameResourceId"
              multiple
              small-chips
              outlined
              placeholder="Select companies"
            ></v-autocomplete>
          </v-list-item-content>
        </v-list-item>
      </v-form>
    </template>
    <template v-slot:app-dialog-footer>
      <div class="delete-user__footer">
        <v-btn @click="closeModal" color="#f56c6c" class="delete-user__footer-button" text
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
import { searchCompanies } from '../../api/company'
import { maxLength, required } from '@/utils/validations'
export default {
  name: 'CreateItemModal',
  props: {
    isShow: {
      type: Boolean
    },
    selectedRow: {
      type: Object
    }
  },
  components: {
    AppDialog
  },
  data() {
    return {
      companies: [],
      selectedCompanies: [],
      validations: {
        required,
        maxLength
      },
      payload: {
        pageSize: 3000,
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
                },
                {
                  FieldName: 'IndustryName',
                  Operator: 'Contains',
                  Value: ''
                },
                {
                  FieldName: 'LicenseTypeName',
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
    this.getData()
  },
  methods: {
    getData() {
      searchCompanies(this.payload)
        .then((response) => {
          this.companies =
            response.data.data.hasOwnProperty('results') && response.data.data.results.length > 0
              ? response.data.data.results
              : []
        })
        .catch((error) => {})
    },
    closeModal() {
      this.$emit('changeModalStatus', false)
    },
    confirmDelete() {
      this.$emit('confirmDelete', this.selectedRow)
      this.$emit('changeModalStatus', false)
    },
    save() {
      this.$refs.refCreateGroupForm.validate()
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
