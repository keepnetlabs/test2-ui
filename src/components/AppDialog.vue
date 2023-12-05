<template>
  <v-dialog
    :content-class="getClassName"
    :opacity="0.23"
    :value="status"
    :id="id"
    :width="dialogWidth"
    class="k-dialog"
    :hide-overlay="hideOverlay"
    @click:outside="changeStatus(false)"
    @input="changeStatus"
  >
    <v-card class="k-dialog__card" light>
      <v-form lazy-validation ref="refDialogForm" onSubmit="return false;">
        <v-list-item
          v-if="icon || title"
          class="k-dialog__header"
          :class="[maxHeight && 'k-dialog__header-max-height']"
        >
          <div :class="getIconWrapperClass" v-if="icon">
            <v-icon :color="getIconColor" :class="getIconClass" left medium>
              {{ icon }}
            </v-icon>
          </div>
          <div>
            <v-list-item-title :class="getTitleClass" :id="titleId">{{ title }}</v-list-item-title>
            <v-list-item-subtitle v-if="subtitle" class="k-dialog__sub-title" :id="subtitleId">{{
              subtitle
            }}</v-list-item-subtitle>
          </div>
        </v-list-item>
        <div
          :class="['k-dialog__body', dialogBodyClass]"
          :style="[
            {
              maxHeight: maxHeightSize ? maxHeightSize : '400px',
              minHeight: maxHeightSize ? maxHeightSize : ''
            }
          ]"
        >
          <slot name="app-dialog-body">
            {{ body }}
          </slot>
        </div>
        <v-card-actions
          class="k-dialog__footer"
          :class="[maxHeight && maxHeightSize && 'k-dialog__footer-max-height']"
        >
          <slot name="app-dialog-footer"></slot>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
/*
    **** props *****
   status --> Modal Status
   icon --> Title Icon
   iconColor --> Icon color
   title --> Title
   subTitle --> Subtitle
   body--> Body (string)
   size --> Size (big,small)
   className --> ClassName for Dialog

    **** Slots ****
    app-dialog-body
    app-dialog-footer

     */
export default {
  name: 'AppDialog',
  props: {
    status: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String
    },
    iconColor: {
      type: String,
      default: 'blue'
    },
    iconClassName: {
      type: String
    },
    hideOverlay: {
      type: Boolean,
      default: false
    },
    title: {
      type: String
    },
    customSize: {
      type: String
    },
    subtitle: {
      type: String
    },
    body: {
      type: String
    },
    maxHeight: {
      type: Boolean,
      default: false
    },
    maxHeightSize: {
      type: String
    },
    dialogBodyClass: {
      type: String
    },
    size: {
      type: String,
      default: 'small'
    },
    className: {
      type: String,
      default: ''
    },
    id: {
      type: String
    },
    titleId: {
      type: String
    },
    subtitleId: {
      type: String
    },
    type: {
      type: String,
      default: ''
    }
  },
  computed: {
    dialogWidth() {
      let retValue = '480'

      if (this.size === 'big') {
        retValue = '580'
      }

      if (this.size === 'maximum') {
        retValue = '650'
      }

      if (this.size === 'ultraMaximum') {
        retValue = '700'
      }

      if (this.customSize) {
        retValue = this.customSize
      }

      return retValue
    },
    getClassName() {
      let className = this.className || ''
      if (this.maxHeight && this.maxHeightSize) className += ' k-dialog__max-height-border-radius'
      return className
    },
    getTitleClass() {
      const className = ['k-dialog__title']
      if (this.isDelete) className.push('k-dialog__title--delete')
      return className
    },
    isDelete() {
      return this?.type?.toLowerCase() === 'delete'
    },
    getIconColor() {
      if (this.isDelete) return '#B83A3A'
      return this.iconColor
    },
    getIconWrapperClass() {
      const className = ['v-btn v-cart-icon-wrapper']
      if (this.isDelete) className.push('k-dialog__delete-icon-wrapper')
      return className
    },
    getIconClass() {
      const className = ['ml-2']
      if (this.iconClassName) className.push(this.iconClassName)
      return className
    }
  },
  methods: {
    changeStatus(value) {
      this.$emit('changeStatus', value)
    }
  }
}
</script>
