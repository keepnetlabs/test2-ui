<template>
  <grid-layout
    :layout="layout"
    v-bind="layoutAttrs"
    v-on="gridLayoutEvents"
    @breakpoint-changed="breakPointChanged"
    :cols="{ lg: 12, md: 12, sm: 12, xs: 6 }"
  >
    <grid-item
      v-for="item in layout"
      drag-ignore-from=".widget-body"
      :key="item.i"
      :static="isStatic"
      v-bind="item"
      @move="moveEvent"
      @resize="resizeEvent"
      @moved="movedEvent"
      @resized="resizedEvent"
      @container-resized="containerResizedEvent"
    >
      <slot :name="item.i"></slot>
    </grid-item>
  </grid-layout>
</template>

<script>
import { GridLayout, GridItem } from 'vue-grid-layout'

export default {
  name: 'KSmartGrid',
  components: {
    GridLayout,
    GridItem
  },
  props: {
    layout: {
      type: Array,
      required: true
    },
    colNum: {
      type: Number,
      default: 12
    },
    maxRows: {
      type: Number
    },
    rowHeight: {
      type: Number,
      default: 48
    },
    margin: {
      type: Array,
      default: () => [10, 10]
    },
    draggable: {
      type: Boolean,
      default: true
    },
    resizable: {
      type: Boolean,
      default: true
    },
    isStatic: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      layoutAttrs: {
        // layout: this.layout,
        colNum: this.colNum,
        rowHeight: this.rowHeight,
        maxRows: this.maxRows,
        margin: this.margin,
        isDraggable: this.draggable,
        isResizable: this.resizable,
        isMirrored: false,
        autoSize: true,
        verticalCompact: true,
        useCssTransforms: false,
        responsive: true
      }
    }
  },
  created() {
    const listeners = this.$listeners

    const layoutEventList = [
      'layout-created',
      'layout-before-mount',
      'layout-mounted',
      'layout-ready',
      'layout-updated'
    ]

    this.gridLayoutEvents = this.pick(listeners, layoutEventList)
  },
  methods: {
    // Picks the key-value pairs corresponding to the given keys from an object.
    pick(obj, arr) {
      return arr.reduce((acc, curr) => {
        return curr in obj && (acc[curr] = obj[curr]), acc
      }, {})
    },
    moveEvent(i, newX, newY) {
      this.$emit('move', { i, newX, newY })
    },
    resizeEvent(i, newH, newW, newHPx, newWPx) {
      this.$emit('resize', { i, newH, newW, newHPx, newWPx })
    },
    movedEvent(i, newX, newY) {
      this.$emit('moved', { i, newX, newY })
    },
    resizedEvent(i, newH, newW, newHPx, newWPx) {
      this.$emit('resized', { i, newH, newW, newHPx, newWPx })
    },
    containerResizedEvent(i, newH, newW, newHPx, newWPx) {
      this.$emit('container-resized', { i, newH, newW, newHPx, newWPx })
    },
    breakPointChanged(newBreakpoint, newLayout) {
      this.$emit('breakpointChanged', { newBreakpoint, newLayout })
    }
  }
}
</script>

<style lang="scss">
.vue-grid-layout {
  background: transparent;
  // .vue-grid-item {}
  .smartwidget {
    height: inherit;
    width: inherit;
    &.smartwidget-fullscreen {
      height: 100%;
      width: 100%;
    }
  }
}
</style>
