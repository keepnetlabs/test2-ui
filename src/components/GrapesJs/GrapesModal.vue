<template>
  <div class="grapes-container-modal mt-5">
    <div class="panel__top-modal">
      <div class="panel__basic-actions-modal"></div>
    </div>
    <div id="gjsModal"></div>
    <div id="blocksModal"></div>
  </div>
</template>

<script>
import grapesjs from 'grapesjs'
import 'grapesjs-blocks-basic'
import 'grapesjs-preset-newsletter'
export default {
  name: 'GrapesModal',
  components: grapesjs,
  mounted() {
    const editor = grapesjs.init({
      container: '#gjsModal',
      fromElement: 1,
      storageManager: { type: 0 },
      plugins: ['gjs-blocks-basic', 'gjs-preset-newsletter']
    })
  }
}
</script>

<style lang="scss">
.grapes-container-modal {
  #gjsModal {
    border: 3px solid #444;
  }

  /* Reset some default styling */
  .gjs-cv-canvas {
    top: 0;
    width: 100%;
    height: 100%;
  }
  .gjs-block {
    width: auto;
    height: auto;
    min-height: auto;
  }
  .panel__top-modal {
    padding: 0;
    width: 100%;
    display: flex;
    position: initial;
    justify-content: center;
    justify-content: space-between;
  }
  .panel__basic-actions {
    position: initial;
  }
}
</style>
