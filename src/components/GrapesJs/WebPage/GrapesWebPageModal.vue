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
import 'grapesjs-preset-newsletter'
import 'grapesjs-blocks-basic'
import 'grapesjs-preset-webpage'
import 'grapesjs-plugin-forms'
import s3 from 'grapesjs-plugin-s3'
import custom from 'grapesjs-custom-code'
import exportGrapes from 'grapesjs-plugin-export'
import cssParser from 'grapesjs-parser-postcss'
import { setGrapesjsStyle } from '../Newsletter/assets/css/grapesStyle'
import exampleComponent from '../Newsletter/components/exampleComponent'
import exampleComponent2 from '../Newsletter/components/exampleComponent2'
import amazonTemplate from '../Newsletter/components/amazonTemplate'
import to from '../Newsletter/mergedTexts/to'
import toName from '../Newsletter/mergedTexts/toName'
import subject from '../Newsletter/mergedTexts/subject'
import macroForm from '../Newsletter/mergedTexts/macroForm'
import macroAttachment from '../Newsletter/mergedTexts/macroAttachment'
import mergedFrom from '../Newsletter/mergedTexts/from'
import fromName from '../Newsletter/mergedTexts/fromName'
import customMacroAttachment from '../Newsletter/mergedTexts/customMacroAttachment'
import trainingUrl from '../Newsletter/mergedTexts/trainingUrl'
import phishingUrl from '../Newsletter/mergedTexts/phishingUrl'
import macroUrl from '../Newsletter/mergedTexts/macroUrl'
import { GrapesS3Options } from '../../../model/constants/commonConstants'

export default {
  name: 'GrapesWebPageModal',
  components: GrapesWebPageModal,
  props: {
    htmlData: {
      required: false
    }
  },
  data() {
    return {
      editor: null
    }
  },
  mounted() {
    this.setGrapesEditor()
    window.addEventListener('popstate', function (event) {
      // Log the state data to the console
    })
  },
  methods: {
    setGrapesEditor() {
      this.editor = GrapesWebPageModal.init({
        container: '#gjsWebPageModal',
        fromElement: 1,
        storageManager: { type: 0 },
        plugins: ['gjs-preset-newsletter'],
        components: this.editorHtml || '',
        style: setGrapesjsStyle()
      })
      let pn = this.editor.Panels
      let blockManager = this.editor.BlockManager
      blockManager.add('exampleComponent', exampleComponent)
      blockManager.add('exampleComponent2', exampleComponent2)
      blockManager.add('amazonTemplate', amazonTemplate)
      blockManager.add('to', to)
      blockManager.add('toName', toName)
      blockManager.add('subject', subject)
      blockManager.add('macroFrom', macroForm)
      blockManager.add('macroAttachment', macroAttachment)
      blockManager.add('from', mergedFrom)
      blockManager.add('fromName', fromName)
      blockManager.add('customMacroAttachment', customMacroAttachment)
      blockManager.add('trainingUrl', trainingUrl)
      blockManager.add('phishingUrl', phishingUrl)
      blockManager.add('macroUrl', macroUrl)
      pn.getButton('options', 'sw-visibility').set('active', 0)
      if (!!this.htmlData) {
        this.getGrapesWebModalDraw(this.htmlData)
      }
    },
    getGrapesWebModalDraw(html) {
      const domComponents = this.editor.DomComponents
      domComponents.clear()
      this.editor.setComponents(html)
    },
    getGrapesEditorContent() {
      let htmlContent = this.editor.Commands.run('gjs-get-inlined-html')
      return htmlContent
    }
  }
}
</script>

<style lang="scss"></style>
