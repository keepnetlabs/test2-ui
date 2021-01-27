<template>
  <div class="switch-account">
    <v-card style="height: 100%; overflow: hidden; border-radius: 20px;">
      <v-list-item class="switch-account__header">
        <div class="v-btn v-cart-icon-wrapper">
          <v-icon medium left color="blue" class="ml-2">mdi-swap-horizontal</v-icon>
        </div>
        <v-list-item-content>
          <v-list-item-title class="v-card-headline">Switch Company</v-list-item-title>
          <v-list-item-subtitle class="connection-lost-title"
            >Switch between reseller and company accounts</v-list-item-subtitle
          >
        </v-list-item-content>
      </v-list-item>
      <div class="switch-account__content">
        <div>
          <div class="switch-account__content--current-user mb-6">
            <div class="switch-account__content--current-user__section-header">
              You are now:
            </div>
            <div class="d-flex">
              <div class="switch-account__content--current-user__logo">
                <img v-if="!!getLogoImage" :src="getLogoImage" />
              </div>
              <div class="switch-account__content--current-user__details">
                <span class="switch-account__content--current-user__details--companyName">{{
                  getSelectedCompanyName
                }}</span>
                <span class="switch-account__content--current-user__details--role">{{
                  getRolename
                }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="switch-account__content--current-user">
          <div class="switch-account__content--current-user__section-header">
            Switch to
          </div>
          <treeselect
            :multiple="false"
            :flat="false"
            placeholder="Select company to manage"
            :options="orderedAccounts"
            v-model="value"
            value-format="object"
            :load-options="loadOptions"
            :auto-load-root-options="false"
          >
            <label slot="option-label" slot-scope="{ node }">
              <img
                :src="node.raw.logoUrl || require('../assets/img/no-logo.png')"
                alt=""
                style="width: 32px; height: 32px;"
              />
              <span>{{ node.label }}</span>
            </label>
          </treeselect>
        </div>
        <!--<v-container fluid v-if="!companyLoading">
          <v-data-iterator
            :items="orderedAccounts"
            :search="search"
            :items-per-page="9999"
            hide-default-footer
            :custom-filter="sort"
            class="container-iterator"
          >
            <template v-slot:no-results>
              <div class="container-iterator__no-results">
                {{ "Sorry, we couldn't find any results matching your criteria" }}
              </div>
            </template>
            <template v-slot:header>
              <v-text-field
                label="Search"
                outlined
                dense
                :items="keys"
                v-model="search"
                class="search-field"
              ></v-text-field>
            </template>
            <template v-slot:default="props">
              <v-row class="switch-ac-row">
                <v-col
                  v-for="(item, index) in props.items"
                  :class="{ 'not-reseller': index === 0 }"
                  :key="index"
                  cols="12"
                  sm="12"
                  md="12"
                  lg="12"
                  class="mt-0 pt-0"
                >
                  <v-card style="border-radius: 20px;">
                    <div
                      class="switch-account-wrapper d-flex flex-wrap flex-row"
                      @click="onClickSelectedAccount(item)"
                    >
                      <div class="switch-account-logo">
                        <v-img
                          src="https://picsum.photos/id/11/500/300"
                          lazy-src="https://picsum.photos/id/11/10/6"
                          aspect-ratio="1"
                          class="grey lighten-2"
                          max-width="45"
                          max-height="45"
                        ></v-img>
                      </div>
                      <div class="switch-right-wrapper">
                        <div class="swith-account-title">{{ item.name }}</div>
                        <div v-if="index === 0" class="switch-account-description">
                          Manage all Companies as reseller
                        </div>
                        <div v-else class="switch-account-description">
                          Company admin. Manage this company’s activities
                        </div>
                      </div>
                    </div>
                  </v-card>
                </v-col>
              </v-row>
            </template>
          </v-data-iterator>
        </v-container>-->
      </div>
      <div class="switch-account__footer">
        <v-btn
          color="#f56c6c"
          class="delete-user__footer-button"
          @click="setSwitchDialog(false)"
          text
          >{{ labels.Cancel }}</v-btn
        >
        <v-btn
          text
          color="#2196f3"
          class="k-dialog__button"
          :disabled="isSwitchAccountDisabled"
          @click="onClickSelectedAccount(value)"
          >{{ labels.Confirm }}</v-btn
        >
      </div>
    </v-card>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import { getCompanyList } from '../api/company'
import PostCardLoading from './SkeletonLoading/PostCardLoading'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import labels from '@/model/constants/labels'
import { LOAD_ROOT_OPTIONS } from '@riophae/vue-treeselect'
const sleep = (d) => new Promise((r) => setTimeout(r, d))
let called = false
export default {
  name: 'SwitchAccount',
  data() {
    return {
      labels,
      value: null,
      keys: ['name'],
      itemsPerPageOptions: [4, 8, 12],
      itemsPerPage: 4,
      search: '',
      companies: [],
      orderedAccounts: null,
      companyLoading: false,
      isSwitchAccountDisabled: false
    }
  },
  components: {
    Treeselect
  },
  created() {
    this.isSwitchAccountDisabled = false
    this.$store.watch((state) => {
      if (state.dashboard.isSwitchDialogOpen) {
      }
    })
  },
  methods: {
    ...mapActions({
      selectCompany: 'dashboard/selectCompany',
      setDialogBar: 'dashboard/setSwitchDialog',
      setSwitchDialog: 'dashboard/setSwitchDialog'
    }),
    sort(items, value) {
      return value
        ? items.filter((item) => item.name.toLowerCase().indexOf(value.toLowerCase()) >= 0)
        : items
    },
    loadOptions({ callback }) {
      let vm = this
      this.companyLoading = true
      getCompanyList()
        .then((response) => {
          let accounts = response.data.data
          function removeEmptyArrays(data) {
            for (var key in data) {
              var item = data[key]
              // see if this item is an array
              if (Array.isArray(item)) {
                // see if the array is empty
                if (item.length == 0) {
                  // remove this item from the parent object
                  delete data[key]
                } else {
                  removeEmptyArrays(item)
                }
                // if this item is an object, then recurse into it
                // to remove empty arrays in it too
              } else if (typeof item == 'object') {
                removeEmptyArrays(item)
              }
            }
            return data
          }
          const swaps = { name: 'label', resourceId: 'id' }
          const pattern = new RegExp(
            Object.keys(swaps)
              .map((e) => `(?:"(${e})":)`)
              .join('|'),
            'g'
          )
          const result = JSON.parse(
            JSON.stringify(accounts).replace(pattern, (m) => `"${swaps[m.slice(1, -2)]}":`)
          )
          this.orderedAccounts = removeEmptyArrays(result)
          callback() // notify vue-treeselect about data population completion
        })
        .finally(() => {
          this.companyLoading = false
        })
    },
    getSelectedCompanyDetails(account) {
      this.$router.go(0)
      localStorage.setItem('isSelectCompany', true)
      localStorage.setItem('companyId', account.resourceId)
      localStorage.setItem('companyRequestId', account.resourceId)
      localStorage.setItem('selectedCompanyRequestId', account.resourceId)
      localStorage.setItem('selectedCompanyName', account.name)
    },
    onClickSelectedAccount({ label, id }) {
      this.isSwitchAccountDisabled = true
      this.getSelectedCompanyDetails({ name: label, resourceId: id })
      this.setDialogBar(false)
      this.search = ''
    }
  },
  computed: {
    ...mapGetters({
      isLoadingFromStore: 'common/getIsLoading',
      getDropdown: 'dashboard/getCompanyDropdowns',
      isSwitchDialogOpen: 'dashboard/getIsSwitchDialogOpen'
    }),
    ...mapState({
      currentCompany: (state) => state.dashboard.selectedCompany
    }),
    switchDialog: {
      get() {
        return this.isSwitchDialogOpen
      },
      set(newValue) {
        this.setSwitchDialog(newValue)
      }
    },
    getLogoImage() {
      if (this.$store.state.auth.user == undefined) {
        return ''
      }
      let image =
        localStorage.getItem('isSelectCompany') === 'true'
          ? this.$store.state.dashboard.selectedCompanyObject.logoUrl
          : this.$store.state.auth.logoUrl
      return image || require('../assets/img/no-logo.png')
    },

    getSelectedCompanyName() {
      if (this.$store.state.auth.companyName == undefined) {
        return ''
      }
      return this.$store.state.auth.selectedCompanyName
    },

    getFirstName() {
      if (this.$store.state.auth.user == undefined) {
        return ''
      }
      return this.$store.state.auth.user.firstName
    },
    getRolename() {
      if (this.$store.state.auth.userRoleName == undefined) {
        return ''
      }
      return this.$store.state.auth.userRoleName
    },
    isLoading: {
      get() {
        return this.isLoadingFromStore
      },
      set() {}
    }
  },
  watch: {
    isSwitchDialogOpen(newVal, oldVal) {
      if (newVal) {
      }
    }
  }
}
</script>

<style scoped lang="scss">
.switch-account-wrapper {
  cursor: pointer;
  padding: 24px;
  .switch-right-wrapper {
    max-width: 85%;
  }
  .switch-account-logo {
    border: solid 1px #dcdcdc;
    width: 46px;
    height: 46px;
    margin-right: 16px;
  }
  .swith-account-title {
    font-family: 'Open Sans', sans-serif !important;
    margin-bottom: 5px;
    font-size: 20px;
    font-weight: 600;
    line-height: 1.3;
    color: rgba(0, 0, 0, 0.87) !important;
    max-width: 100%;
    text-overflow: ellipsis;
    display: block;
    overflow: hidden;
    white-space: nowrap;
  }
  .switch-account-description {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 12px;
    line-height: 1.58;
    color: rgba(0, 0, 0, 0.87) !important;
  }
}

.connection-lost-title {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 16px !important;
  font-weight: 500 !important;
  color: rgba(0, 0, 0, 0.87);
}
.connection-lost-sub-title {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 13px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: rgba(0, 0, 0, 0.54) !important;
}
.v-list-item__subtitle {
  font-family: Helvetica;
  font-size: 14px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.2 !important;
  letter-spacing: normal;
  color: rgba(0, 0, 0, 0.87) !important;
  margin-left: 2px;
}

.v-sheet {
  border-radius: 20px;
  background-color: white;
}

.v-card-headline {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 20px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.4;
  letter-spacing: normal;
  color: var(--black-87);
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

.container-iterator {
  max-height: 500px;
  overflow: hidden;
  padding: 5px;
  min-height: 200px;
  &__no-results {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 60px;
  }
}

.switch-ac-row {
  max-height: 459px;
  overflow: auto;
  margin-right: 0;
  margin-left: -12px;
  padding-top: 13px;
}

/*
  .not-reseller {
    .swith-account-title {
      margin-top: 13px !important;
    }
    .switch-account-description {
      display: none !important;
    }
  }
*/
.v-dialog {
  .search-field {
    height: 40px;
  }
}

.switch-account {
  .v-card {
    overflow: visible !important;
  }
  &__header {
    border-bottom: 1px solid #e0e0e0;
    padding: 24px;
    .v-list-item__content {
      padding: 0 !important;
    }
  }
  &__content {
    padding: 24px;
    &--current-user {
      &__section-header {
        font-size: 18px;
        font-weight: 600;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        color: #383b41;
        margin-bottom: 8px;
      }
      &__logo {
        img {
          width: 32px;
          height: 32px;
          border: solid 0.5px #dcdcdc;
        }
        margin-right: 8px;
      }
      &__details {
        display: flex;
        flex-flow: column;
        &--companyName {
          font-size: 16px;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          line-height: 1;
          letter-spacing: normal;
          color: #383b41;
        }
        &--role {
          font-size: 12px;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          line-height: 1.58;
          letter-spacing: normal;
          color: #383b41;
        }
      }
    }
  }
  &__footer {
    border-top: 1px solid #e0e0e0;
    padding: 16px 24px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
