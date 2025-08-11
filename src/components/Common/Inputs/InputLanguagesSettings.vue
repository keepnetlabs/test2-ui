<template>
  <div class="position-relative" v-click-outside="handleClickOutside">
    <DataTableTooltip
      v-if="showOverFlowTooltip"
      :tooltipStyle="overFlowTooltipStyle"
      :content="overFlowTooltipContent"
    />
    <div class="d-flex gap-4">
      <div class="position-relative">
        <div>
          <VBtn class="fw-600" rounded outlined color="#2196f3" @click="handleLocalizeClick">
            <VIcon>mdi-web</VIcon>
            <span class="button-new__text ml-1" style="text-transform: none;">Localize</span>
          </VBtn>
        </div>
        <div
          v-show="!loading || isShowLanguages"
          class="switch-account__container input-language-settings__container"
        >
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
                    <span
                      v-if="item.text === 'All Languages'"
                      style="
                        background-color: #e0e0e0;
                        width: 100%;
                        height: 1px;
                        display: inline-block;
                      "
                    ></span>
                    <div
                      v-else
                      :class="item.text === 'Preferred Languages' ? 'd-flex flex-column mt-1' : ''"
                      style="margin-top: 1px;"
                    >
                      <span
                        v-if="item.text !== 'Preferred Languages' && item.text !== 'All Languages'"
                        >{{ item.text }}</span
                      >
                      <div v-if="item.text === 'Preferred Languages'">
                        <div class="fw-400 mt-1 mb-1">
                          Languages your employees prefer
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
              class="k-dialog__button mr-4 px-0"
              :style="getAddButtonStyle"
              @click="handleAdd"
              >LOCALIZE</VBtn
            >
          </div>
        </div>
      </div>

      <VBtn class="fw-600" rounded outlined color="#2196f3" @click="handleShowRedFlagsClick">
        <VIcon>mdi-flag</VIcon>
        <span class="button-new__text ml-1" style="text-transform: none;">{{ redFlagsText }}</span>
      </VBtn>
      <VTextField
        v-if="false"
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
      <VIcon
        color="#2196f3"
        class="executive-reports-card__right-btn"
        small
        @click="handleEditModeClick"
        >mdi-pencil</VIcon
      >
      <VMenu bottom :offset="24" nudge-bottom="40" nudge-left="40">
        <template #activator="{ on }">
          <VIcon v-on="on" color="#2196f3" class="executive-reports-card__right-btn" small
            >mdi-dots-vertical</VIcon
          >
        </template>
        <VList>
          <VListItem class="cursor-pointer" @click="handleUploadEmailButtonClick">
            <VListItemTitle>
              <VIcon>mdi-upload</VIcon>
              <span>Import Email</span>
            </VListItemTitle>
          </VListItem>
        </VList>
      </VMenu>
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
    },
    showRedFlags: {
      type: Boolean,
      default: false
    },
    activeLanguage: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      appendIcon: 'mdi-menu-down',
      treeViewKey: `key-${createRandomCryptStringNumber()}`,
      selectedLanguages: this.value || [],
      loading: false,
      isShowLanguages: false,
      menuMaxHeight: '300px',
      searchValue: '',
      items: this.languageItems,
      showOverFlowTooltip: false,
      overFlowTooltipContent: 'Active language can’t be removed. Switch to another language first.',
      overFlowTooltipStyle: {
        top: '0px',
        left: '0px'
      },
      activeNodes: []
    }
  },
  computed: {
    redFlagsText() {
      return this.showRedFlags ? 'Hide Red Flags' : 'Show Red Flags'
    },
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
    },
    activeLanguage: {
      immediate: true,
      handler(val) {
        this.items.forEach((item) => {
          item.children.forEach((child) => {
            if (val === child.value) {
              this.$set(child, 'disabled', true)
            } else {
              this.$set(child, 'disabled', false)
            }
          })
        })
      }
    }
  },
  methods: {
    handleLocalizeClick() {
      this.isShowLanguages = true
      this.setupLanguageNodeTooltips()
      this.changeMenuStatus('visible')
    },
    handleAdd() {
      this.$emit('input', this.selectedLanguages)
      this.changeMenuStatus('hidden')
      this.removeLanguageNodeEventListeners()
      this.handleGenerateWithAI()
    },
    handleClickOutside() {
      this.treeViewKey = `key-${createRandomCryptStringNumber()}`
      this.handleTreeViewChange(this.value)
      this.changeMenuStatus('hidden')
      this.removeLanguageNodeEventListeners()
    },
    handleTreeViewChange(event) {
      this.selectedLanguages = event
    },
    handleSearchInputFocus() {
      this.changeMenuStatus('visible')
      this.setupLanguageNodeTooltips()
    },
    handleTooltipShow(e) {
      const node = e.target
      if (node.parentElement.classList.contains('v-treeview-node--disabled')) {
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
    },
    handleEditModeClick() {
      this.$emit('on-edit-mode-click')
    },
    handleUploadEmailButtonClick() {
      this.$emit('on-upload-email-button-click')
    },
    handleShowRedFlagsClick() {
      this.$emit('on-show-red-flags-click')
    }
  }
}
</script>
