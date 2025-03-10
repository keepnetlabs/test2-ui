<template>
  <div class="position-relative" v-click-outside="handleClickOutside">
    <VTextField
      v-model.trim="getTextFieldValue"
      ref="refSearchTextField"
      id="input-language-settings"
      outlined
      hide-details
      autocomplete="off"
      placeholder="Search languages to manage"
      :append-icon="appendIcon"
      @focus="handleSearchInputFocus"
    />
    <div v-show="!loading" class="switch-account__container input-language-settings__container">
      <div>
        <div class="px-4 py-4 pb-12" :style="{ maxHeight: menuMaxHeight, overflowY: 'auto' }">
          <VTextField
            v-model.trim="searchValue"
            outlined
            hide-details
            autocomplete="off"
            prepend-inner-icon="mdi-magnify"
            placeholder="Search"
          />
          <VTreeview
            :value="value"
            class="input-languages-settings-treeview"
            dense
            selectable
            open-all
            return-object
            item-text="text"
            item-key="value"
            :search="searchValue"
            :hoverable="false"
            :items="getItems"
            @input="handleTreeViewChange"
          >
          </VTreeview>
        </div>
      </div>
      <div class="p-4 input-language-settings__footer">
        <VBtn
          text
          id="btn-confirm--switch-company-dashboard-popup"
          color="#2196f3"
          class="k-dialog__button mr-2 py- px-0"
          :style="getAddButtonStyle"
          @click="handleAdd"
          >Add</VBtn
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InputLanguagesSettings',
  props: {
    value: {
      type: Array
    }
  },
  data() {
    return {
      appendIcon: 'mdi-menu-down',
      selectedLanguages: this.value || [],
      loading: false,
      menuMaxHeight: '300px',
      searchValue: '',
      items: [
        {
          value: 1,
          text: 'Preferred Languages',
          children: [
            { value: 2, text: 'English (United Kingdom)' },
            { value: 3, text: 'English (United States)', active: false, visible: false },
            { value: 4, text: 'German' }
          ]
        },
        {
          value: 5,
          text: 'All Languages',
          children: [
            { value: 6, text: 'French' },
            { value: 7, text: 'Spanish' },
            { value: 8, text: 'Italian' }
          ]
        }
      ]
    }
  },
  computed: {
    getTextFieldValue() {
      const length = this.value.length
      return `Language${length > 1 ? 's' : ''} (${length})`
    },
    getAddButtonStyle() {
      const style = { marginTop: '2px' }
      if (!this.selectedLanguages.length) {
        style.color = '#2196f3 !important'
        style.opacity = '0.5'
        style.pointerEvents = 'none'
      }
      return style
    },
    getItems() {
      return this.items
    }
  },
  watch: {
    loading(val) {
      if (!val) {
        this.$nextTick(() => {
          this.handleMenuHeight()
        })
      }
    }
  },
  methods: {
    handleAdd() {
      this.$emit('input', this.selectedLanguages)
      this.changeMenuStatus('hidden')
    },
    handleClickOutside() {
      this.changeMenuStatus('hidden')
    },
    handleTreeViewChange(event) {
      this.selectedLanguages = event
    },
    handleSearchInputFocus() {
      this.changeMenuStatus('visible')
    },
    changeMenuStatus(status = 'hidden') {
      const menu = document.querySelector('.switch-account__container')
      if (menu) {
        menu.style.visibility = status
      }
    },
    handleMenuHeight(resize = false) {
      const menu = document.querySelector('.switch-account__container')
      if (menu) {
        const { bottom } = menu.getBoundingClientRect()
        const { innerHeight } = window
        const maxBottom = bottom + (300 - parseInt(this.menuMaxHeight.replace('px', '')))
        if (maxBottom > innerHeight) {
          const diff = Math.round(maxBottom - innerHeight) + 8
          const newMaxHeight = 300 - diff
          this.menuMaxHeight = `${newMaxHeight}px`
        } else {
          if (resize) {
            this.menuMaxHeight = '300px'
          }
        }
      }
    }
  }
}
</script>
