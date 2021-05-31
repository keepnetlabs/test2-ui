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
                <img v-if="!!getLogoImage" :src="getLogoImage" id="img--switch-account-logo" />
              </div>
              <div class="switch-account__content--current-user__details">
                <span
                  id="text--switch-account-company-name"
                  class="switch-account__content--current-user__details--companyName"
                  >{{ getSelectedCompanyName }}</span
                >
                <span
                  id="text--switch-account-user-role-name"
                  class="switch-account__content--current-user__details--role"
                  >{{ getRolename }}</span
                >
              </div>
            </div>
          </div>
        </div>
        <div class="switch-account__content--current-user">
          <div class="switch-account__content--current-user__section-header">
            Switch to
          </div>
          <div style="position: relative;" v-click-outside="handleSearchCompanyFocusOut">
            <v-text-field
              v-model="searchedCompanyText"
              id="input--switch-account-search-company"
              outlined
              hide-details
              autocomplete="off"
              placeholder="Search for a company to manage"
              :append-icon="searchCompanyIcon"
              @input="handleSearchText"
              @focus="handleSearchCompanyFocus"
            ></v-text-field>
            <switch-account-tree-view
              :is-showing-menu="isMenuOpen"
              :items="orderedAccounts"
              :loading="isCompaniesLoading"
              :search="searchedText"
              :is-open-all="isOpenAllMenuItems"
              @on-selected-account="handleOnSelectedAccount"
            />
          </div>
        </div>
      </div>
      <div class="switch-account__footer">
        <v-btn
          id="btn-cancel--switch-company-dashboard-popup"
          color="#f56c6c"
          class="delete-user__footer-button"
          @click="setSwitchDialog(false)"
          text
          >{{ labels.Cancel }}</v-btn
        >
        <v-btn
          text
          id="btn-confirm--switch-company-dashboard-popup"
          color="#2196f3"
          class="k-dialog__button"
          :disabled="isSwitchAccountDisabled"
          @click="onClickSelectedAccount(selectedAccount)"
          >{{ labels.Confirm }}</v-btn
        >
      </div>
    </v-card>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import { getMyCompanies } from '@/api/company'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import labels from '@/model/constants/labels'
import SwitchAccountTreeView from '@/components/SwitchAccountTreeView'
const sleep = (d) => new Promise((r) => setTimeout(r, d))
let called = false
export default {
  name: 'SwitchAccount',
  components: { SwitchAccountTreeView },
  props: {
    navigatorMenuProps: {
      type: Object
    }
  },
  data() {
    return {
      labels,
      defaultOrderedItems: [],
      value: null,
      isMenuOpen: false,
      isOpenAllMenuItems: false,
      keys: ['name'],
      searchCompanyIcon: 'mdi-menu-down',
      itemsPerPageOptions: [4, 8, 12],
      itemsPerPage: 4,
      search: '',
      companies: [],
      orderedAccounts: [],
      companyLoading: false,
      treeViewModel: [],
      openedArrays: [],
      searchedCompanyText: '',
      isCompaniesLoading: false,
      isSwitchAccountDisabled: false,
      timeout: null,
      searchedText: '',
      selectedAccount: ''
    }
  },
  created() {
    this.isSwitchAccountDisabled = false
    this.$store.watch((state) => {
      if (state.dashboard.isSwitchDialogOpen) {
      }
    })
    this.isCompaniesLoading = true
    getMyCompanies()
      .then((response) => {
        this.defaultOrderedItems = JSON.parse(JSON.stringify(response.data.data))
        this.orderedAccounts = response.data.data
      })
      .finally(() => {
        this.companyLoading = false
        this.isCompaniesLoading = false
      })
  },
  methods: {
    ...mapActions({
      selectCompany: 'dashboard/selectCompany',
      setDialogBar: 'dashboard/setSwitchDialog',
      setSwitchDialog: 'dashboard/setSwitchDialog'
    }),
    handleSearchCompanyFocus() {
      this.searchCompanyIcon = 'mdi-menu-up'
      this.isMenuOpen = true
      this.changeMenuStatus('visible')
      this.searchedCompanyText = ''
      this.orderedAccounts = this.defaultOrderedItems
    },
    handleOnSelectedAccount(item) {
      this.selectedAccount = item
      this.searchedCompanyText = item.label
      this.isMenuOpen = false
      this.changeMenuStatus()
      this.searchCompanyIcon = 'mdi-menu-down'
    },
    handleSearchCompanyFocusOut() {
      this.searchCompanyIcon = 'mdi-menu-down'
      this.isMenuOpen = false
      this.changeMenuStatus()

      this.searchedCompanyText = this.selectedAccount.label
    },
    changeMenuStatus(status = 'hidden') {
      const menu = document.querySelector('.switch-account__container')
      if (menu) {
        menu.style.visibility = status
      }
    },
    companiesRouterClick() {
      this.setSwitchDialog(false)
      this.$router.push('/companies')
    },
    sort(items, value) {
      return value
        ? items.filter((item) => item.name.toLowerCase().indexOf(value.toLowerCase()) >= 0)
        : items
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
      if (id && label) {
        this.isSwitchAccountDisabled = true
        this.getSelectedCompanyDetails({ name: label, resourceId: id })
        this.setDialogBar(false)
        this.search = ''
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
    handleSearchText() {
      this.debounce(() => {
        const excluded = new Set()
        this.isOpenAllMenuItems = !!this.searchedCompanyText
        function getObjectValueByPath(obj, path, fallback) {
          // credit: http://stackoverflow.com/questions/6491463/accessing-nested-javascript-objects-with-string-key#comment55278413_6491621
          if (obj == null || !path || typeof path !== 'string') return fallback
          if (obj[path] !== undefined) return obj[path]
          path = path.replace(/\[(\w+)\]/g, '.$1') // convert indexes to properties
          path = path.replace(/^\./, '') // strip a leading dot
          return getNestedValue(obj, path.split('.'), fallback)
        }

        function getNestedValue(obj, path, fallback) {
          const last = path.length - 1

          if (last < 0) return obj === undefined ? fallback : obj

          for (let i = 0; i < last; i++) {
            if (obj == null) {
              return fallback
            }
            obj = obj[path[i]]
          }

          if (obj == null) return fallback

          return obj[path[last]] === undefined ? fallback : obj[path[last]]
        }

        function filterTreeItem(item, search, textKey) {
          const text = getObjectValueByPath(item, textKey)
          return text && text.toLocaleLowerCase().indexOf(search.toLocaleLowerCase()) > -1
        }
        function filterTreeItems(filter, item, search, idKey, textKey, childrenKey, excluded) {
          if (filter(item, search, textKey)) {
            return true
          }

          const children = getObjectValueByPath(item, childrenKey)

          if (children) {
            let match = false
            for (let i = 0; i < children.length; i++) {
              if (
                filterTreeItems(filter, children[i], search, idKey, textKey, childrenKey, excluded)
              ) {
                match = true
              }
            }

            if (match) return true
          }
          excluded.add(getObjectValueByPath(item, idKey))
          return false
        }
        for (let i = 0; i < this.defaultOrderedItems.length; i++) {
          filterTreeItems(
            filterTreeItem,
            this.defaultOrderedItems[i],
            this.searchedCompanyText,
            'resourceId',
            'name',
            'children',
            excluded
          )
        }
        const isExcluded = (key) => {
          return !!this.searchedCompanyText && excluded.has(key)
        }

        const checkElements = (children = []) => {
          return children.reduce((acc, child) => {
            if (child.children.length) {
              child.children = checkElements(child.children)
            }
            if (!isExcluded(getObjectValueByPath(child, 'resourceId'))) {
              acc.push(child)
            }
            return acc
          }, [])
        }

        this.orderedAccounts = this.defaultOrderedItems
          .filter((item) => {
            return !isExcluded(getObjectValueByPath(item, 'resourceId'))
          })
          .reduce((acc, item) => {
            if (item.children) {
              item.children = checkElements(item.children)
            }
            acc.push(item)
            return acc
          }, [])
      }, 750)
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
    isShowingSwitchAccountTreeView() {
      return this.isMenuOpen && !this.isCompaniesLoading
    },
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
    },
    searchedCompanyText(val) {}
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
  font-size: 20px;
  font-weight: 600;
  line-height: 1.15;
  letter-spacing: normal;
  color: #2196f3 !important;
  white-space: pre-wrap;
  word-break: break-word;
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
    &--info-text {
      font-size: 14px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.5;
      letter-spacing: normal;
      color: #383b41;
      text-decoration: none;
      margin-bottom: 0;
    }
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
