<template>
  <div>
    <div class="grapes-container-modal mt-5">
      <div class="panel__top-modal">
        <div class="panel__basic-actions-modal"></div>
      </div>
      <div id="gjsWebPageModal"></div>
      <div id="blocksModal"></div>
    </div>
    <!--<v-btn @click="getGrapesWebModalDraw()"></v-btn>-->
  </div>
</template>

<script>
import GrapesWebPageModal from 'grapesjs'
import 'grapesjs-blocks-basic'
import 'grapesjs-preset-webpage'
import 'grapesjs-plugin-forms'
import custom from 'grapesjs-custom-code'
import exportGrapes from 'grapesjs-plugin-export'
import cssParser from 'grapesjs-parser-postcss'
import { setGrapesjsStyle } from '../Newsletter/assets/css/grapesStyle'

export default {
  name: 'GrapesWebPageModal',
  components: GrapesWebPageModal,
  data() {
    return {
      editor: null
    }
  },
  mounted() {
    this.setGrapesEditor()
    window.addEventListener('popstate', function (event) {
      // Log the state data to the console
      console.log(event.state)
    })
  },
  methods: {
    setGrapesEditor() {
      this.editor = GrapesWebPageModal.init({
        container: '#gjsWebPageModal',
        fromElement: 1,
        storageManager: { type: 0 },
        plugins: ['gjs-preset-webpage', exportGrapes, cssParser],
        components: this.editorHtml || '',
        style: setGrapesjsStyle()
      })
      let pn = this.editor.Panels
      pn.getButton('options', 'sw-visibility').set('active', 1)
    },
    getGrapesWebModalDraw() {
      const domComponents = this.editor.DomComponents
      domComponents.clear()
      this.editor.setComponents(`<html><div>deneme</div></html>`)
    }
  }
}
</script>

<style lang="scss"></style>
