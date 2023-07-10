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
                <img
                  v-if="!!getLogoImage"
                  :src="getLogoImage"
                  id="img--switch-account-logo"
                  alt="logo"
                />
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
                  >{{ getRoleName }}</span
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
              v-model.trim="searchedCompanyText"
              ref="refSearchTextField"
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
              ref="refSwitchAccountTreeView"
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
      searchCompanyIcon: 'mdi-menu-down',
      search: '',
      companies: [],
      orderedAccounts: [],
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
    this.isCompaniesLoading = true
    getMyCompanies()
      .then((response) => {
        if (response?.data?.data) {
          this.defaultOrderedItems = JSON.parse(JSON.stringify(response.data.data))
          this.orderedAccounts = response.data.data
          if (this.searchedCompanyText) {
            this.handleSearchText()
          }
        }
      })
      .finally(() => {
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
      this.isOpenAllMenuItems = false
      this.searchedCompanyText = this.selectedAccount.label
      if (this.$refs && this.$refs.refSearchTextField && this.$refs.refSearchTextField) {
        const el = this.$refs.refSearchTextField.$el
        el && el.querySelector('input').blur()
      }
    },
    changeMenuStatus(status = 'hidden') {
      const menu = document.querySelector('.switch-account__container')
      if (menu) {
        menu.style.visibility = status
      }
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
        const defaultOrderedItems = JSON.parse(JSON.stringify(this.defaultOrderedItems))
        const excluded = new Set()
        this.isOpenAllMenuItems = !!this.searchedCompanyText
        function getObjectValueByPath(obj, path, fallback) {
          // credit: http://stackoverflow.com/questions/6491463/accessing-nested-javascript-objects-with-string-key#comment55278413_6491621
          if (obj == null || !path || typeof path !== 'string') return fallback
          if (obj[path] !== undefined) return obj[path]
          path = path.replace(/\[(\w+)\]/g, '.$1') // convert indexes to properties
          path = path.replace(/^\./, '') // strip a leading dot
          return getNestedValue(obj, path?.split('.'), fallback)
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
          return text && text.toLocaleLowerCase().indexOf(search?.toLocaleLowerCase()) > -1
        }
        function filterTreeItems(filter, item, search, idKey, textKey, childrenKey, excluded) {
          if (filter(item, search, textKey)) {
            return true
          }

          const children = getObjectValueByPath(item, childrenKey)

          if (children) {
            let match = false
            for (const child of children) {
              if (filterTreeItems(filter, child, search, idKey, textKey, childrenKey, excluded)) {
                match = true
              }
            }

            if (match) return true
          }
          excluded.add(getObjectValueByPath(item, idKey))
          return false
        }
        for (const defaultOrderedItem of defaultOrderedItems) {
          filterTreeItems(
            filterTreeItem,
            defaultOrderedItem,
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
        this.orderedAccounts = defaultOrderedItems
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
    switchDialog: {
      get() {
        return this.isSwitchDialogOpen
      },
      set(newValue) {
        this.setSwitchDialog(newValue)
      }
    },
    hasUser() {
      return this.$store?.state?.auth?.user
    },
    hasCompanyName() {
      return this.$store?.state?.auth?.companyName
    },
    hasUserRoleName() {
      return this.$store?.state?.auth?.userRoleName
    },
    getLogoImage() {
      if (!this.hasUser) return ''
      let image =
        localStorage.getItem('isSelectCompany') === 'true'
          ? this.$store.state.dashboard.selectedCompanyObject.logoUrl
          : this.$store.state.auth.logoUrl
      return image || require('../assets/img/no-logo.png')
    },
    getSelectedCompanyName() {
      if (!this.hasCompanyName) return ''
      return this.$store.state.auth.selectedCompanyName
    },

    getFirstName() {
      if (!this.hasUser) return ''
      return this.$store.state.auth.user.firstName
    },
    getRoleName() {
      if (!this.hasUserRoleName) return ''
      return this.$store.state.auth.userRoleName
    },
    isLoading: {
      get() {
        return this.isLoadingFromStore
      },
      set() {}
    }
  }
}
</script>
