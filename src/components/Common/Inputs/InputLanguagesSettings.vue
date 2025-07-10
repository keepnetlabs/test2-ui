<template>
  <div class="position-relative" v-click-outside="handleClickOutside">
    <DataTableTooltip
      v-if="showOverFlowTooltip"
      :tooltipStyle="overFlowTooltipStyle"
      :content="overFlowTooltipContent"
    />
    <div class="d-flex gap-4">
      <VTextField
        v-model.trim="getTextFieldValue"
        ref="refSearchTextField"
        id="input-language-settings"
        outlined
        hide-details
        readonly
        autocomplete="off"
        placeholder="Search languages to manage"
        :append-icon="appendIcon"
        :disabled="isGenerateWithAIDisabled"
        @focus="handleSearchInputFocus"
      />
      <VBtn
        class="fw-600"
        rounded
        outlined
        color="#2196f3"
        :style="getGenerateWithAIButtonStyle"
        @click="handleGenerateWithAI"
      >
        <VIcon :style="getGenerateWithAIButtonIconStyle">mdi-creation</VIcon>
        <span class="button-new__text">Localize</span>
      </VBtn>
    </div>
    <div v-show="!loading" class="switch-account__container input-language-settings__container">
      <div>
        <div class="px-4 py-4 pb-12" :style="{ maxHeight: menuMaxHeight, overflowY: 'auto' }">
          <div>
            <VTextField
              v-model.trim="searchValue"
              outlined
              hide-details
              autocomplete="off"
              prepend-inner-icon="mdi-magnify"
              placeholder="Search"
            />
            <VTreeview
              :key="treeViewKey"
              ref="refTreeView"
              :value="value"
              class="input-languages-settings-treeview"
              dense
              selectable
              open-all
              return-object
              item-text="text"
              item-key="value"
              item-disabled="disabled"
              :search="searchValue"
              :hoverable="false"
              :items="items"
              @input="handleTreeViewChange"
            >
              <template #label="{ item }">
                <div
                  :class="item.text === 'Preferred Languages' ? 'd-flex flex-column mt-1' : ''"
                  style="margin-top: 1px;"
                >
                  <span>{{ item.text }}</span>
                  <div v-if="item.text === 'Preferred Languages'">
                    <div class="fw-400 mt-1 mb-1">
                      Based on target users' language preferences within your company.
                    </div>
                  </div>
                </div>
              </template>
            </VTreeview>
          </div>
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
import { createRandomCryptStringNumber } from '@/utils/functions'
import DataTableTooltip from '@/components/DataTableComponents/DataTableTooltip.vue'
export default {
  name: 'InputLanguagesSettings',
  components: {
    DataTableTooltip
  },
  props: {
    value: {
      type: Array
    },
    isGenerateWithAIDisabled: {
      type: Boolean,
      default: false
    },
    languageItems: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      appendIcon: 'mdi-menu-down',
      treeViewKey: `key-${createRandomCryptStringNumber()}`,
      selectedLanguages: this.value || [],
      loading: false,
      menuMaxHeight: '300px',
      searchValue: '',
      items: this.languageItems,
      showOverFlowTooltip: false,
      overFlowTooltipContent: 'Maximum of 10 languages added. Uncheck one to add another.',
      overFlowTooltipStyle: {
        top: '0px',
        left: '0px'
      },
      activeNodes: []
    }
  },
  computed: {
    getGenerateWithAIButtonIconStyle() {
      return {
        fontSize: '20px',
        marginTop: '1px',
        opacity: this.isGenerateButtonDisabled ? '0.5' : '1'
      }
    },
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
    getGenerateWithAIButtonStyle() {
      const style = {}
      if (this.isGenerateButtonDisabled) {
        style.opacity = '0.5'
        style.pointerEvents = 'none'
        style.cursor = 'default'
      }
      return style
    },
    isGenerateButtonDisabled() {
      return this.value.length <= 1 || this.isGenerateWithAIDisabled
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
      this.removeLanguageNodeEventListeners()
    },
    handleClickOutside() {
      this.treeViewKey = `key-${createRandomCryptStringNumber()}`
      this.handleTreeViewChange(this.value)
      this.changeMenuStatus('hidden')
      this.removeLanguageNodeEventListeners()
    },
    handleTreeViewChange(event) {
      this.selectedLanguages = event
      if (this.selectedLanguages.length >= 10) {
        this.items.forEach((item) => {
          item.children.forEach((child) => {
            const findedLanguage = this.selectedLanguages.find((item) => item.value === child.value)
            if (!findedLanguage) {
              this.$set(child, 'disabled', true)
            }
          })
        })
      } else {
        this.items.forEach((item) => {
          item.children.forEach((child) => {
            this.$set(child, 'disabled', false)
          })
        })
      }
    },
    handleSearchInputFocus() {
      this.changeMenuStatus('visible')
      this.setupLanguageNodeTooltips()
    },
    handleTooltipShow(e) {
      const node = e.target
      if (
        this.selectedLanguages.length >= 10 &&
        node.parentElement.classList.contains('v-treeview-node--disabled')
      ) {
        this.updateTooltipPosition(e)
        this.showOverFlowTooltip = true
      }
    },
    handleTooltipHide() {
      this.showOverFlowTooltip = false
      this.overFlowTooltipStyle = {
        top: '0px',
        left: '0px'
      }
    },
    updateTooltipPosition(e) {
      const { left, top, height } = e.target.getBoundingClientRect()
      this.overFlowTooltipStyle = {
        top: `${top + height + 5}px`,
        left: `${left}px`,
        zIndex: '100000000000',
        maxWidth: '220px !important',
        padding: '8px 12px'
      }
    },
    setupLanguageNodeTooltips() {
      this.activeNodes = document.querySelectorAll(
        '.input-languages-settings-treeview .v-treeview-node--leaf .v-treeview-node__root'
      )
      this.activeNodes.forEach((node) => {
        node.addEventListener('mouseover', this.handleTooltipShow)
        node.addEventListener('mouseout', this.handleTooltipHide)
      })
    },
    removeLanguageNodeEventListeners() {
      this.activeNodes.forEach((node) => {
        node.removeEventListener('mouseover', this.handleTooltipShow)
        node.removeEventListener('mouseout', this.handleTooltipHide)
      })
      this.activeNodes = []
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
        } else if (resize) {
          this.menuMaxHeight = '300px'
        }
      }
    },
    handleGenerateWithAI() {
      this.$emit('on-generate-with-ai')
    }
  }
}
</script>
