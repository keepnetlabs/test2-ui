<template>
  <div>
    <div class="form">
      <div class="input-header">Upload Email</div>
      <div class="input-sub">.eml or .msg files only.</div>
      <div class="upload-wrapper">
        <k-file-upload
          ref="refFileUpload"
          :extensions="['eml', 'msg']"
          :is-stand-alone="true"
          @inputFile="uploadFile"
        />
      </div>
      <div>Clone Url</div>
      <div>
        <v-text-field
          id="post-title-text-field"
          label="Title"
          outlined
          dense
          class="title-field filter-field pt-4"
          v-model.trim="cloneUrl"
          solo
          validate-on-blur
          :rules="[url.required, url.format]"
        ></v-text-field>
        <v-btn @click="cloneUrlButtonCLick">Clone Url</v-btn>
      </div>
    </div>
    <div class="grapes-container-modal mt-5">
      <div class="panel__top-modal">
        <div class="panel__basic-actions-modal"></div>
      </div>
      <div id="gjsNewsletterModal"></div>
      <div id="blocksModal"></div>
    </div>
    <iframe
      id="inlineframe"
      :src="cloneUrlPage"
      frameborder="0"
      scrolling="auto"
      width="500"
      height="500"
      marginwidth="5"
      marginheight="5"
    ></iframe>
  </div>
</template>

<script>
import GrapesNewsletterModal from 'grapesjs'
import 'grapesjs-blocks-basic'
import 'grapesjs-preset-newsletter'
import 'grapesjs-preset-webpage'
import './assets/css/grapesjsstyle.scss'
import 'grapesjs-plugin-forms'
import exampleComponent from './components/exampleComponent'
import exampleComponent2 from './components/exampleComponent2'
import to from './mergedTexts/to'
import toName from './mergedTexts/toName'
import subject from './mergedTexts/subject'
import macroForm from './mergedTexts/macroForm'
import macroAttachment from './mergedTexts/macroAttachment'
import mergedFrom from './mergedTexts/from'
import fromName from './mergedTexts/fromName'
import customMacroAttachment from './mergedTexts/customMacroAttachment'
import trainingUrl from './mergedTexts/trainingUrl'
import phishingUrl from './mergedTexts/phishingUrl'
import macroUrl from './mergedTexts/macroUrl'
import custom from 'grapesjs-custom-code'
import exportGrapes from 'grapesjs-plugin-export'
import { uploadEmlOrMsg } from '../../../api/threadSharing'
import { COMMON_CONSTANTS } from '../../../model/constants/commonConstants'
import KFileUpload from '@/components/Common/FileUpload/FileUpload'

export default {
  name: 'GrapesNewsletterModal',
  components: { KFileUpload },
  data() {
    return {
      cloneUrl: null,
      cloneUrlPage: null,
      editor: null,
      url: {
        required: (v) => (v && v.length <= 256) || 'It must between 1 - 256 characters',
        format: (v) =>
          /https?:\/\/(www\.)[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi.test(
            v
          ) || 'invalid url'
      }
    }
  },
  mounted() {
    this.editor = GrapesNewsletterModal.init({
      container: '#gjsNewsletterModal',
      fromElement: 1,
      storageManager: { type: 0 },
      plugins: ['gjs-preset-newsletter', 'gjs-preset-webpage', exportGrapes],
      pluginsOpts: {
        'gjs-preset-newsletter': {
          modalTitleImport: 'Import Template',
          importPlaceholder: 'Template Here',
          inlineCss: true
        }
      }
    })
    let blockManager = this.editor.BlockManager
    blockManager.add('exampleComponent', exampleComponent)
    blockManager.add('exampleComponent2', exampleComponent2)
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
    let pn = this.editor.Panels
    pn.getButton('options', 'sw-visibility').set('active', 1)
    //pn.getButton('options', 'gjs-open-import-template').set('active', 1)
  },
  methods: {
    uploadFile(e) {
      this.msgEmlFile = e
      uploadEmlOrMsg(this.msgEmlFile)
        .then((response) => {
          debugger
          this.getGrapesWebModalDraw(response.data.data.body)
        })
        .catch((error) => {
          this.$store.dispatch('common/createSnackBar', {
            color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
            message: 'Error when getting details of uploaded file'
          })
        })
    },
    getGrapesWebModalDraw(htmlBody) {
      const domComponents = this.editor.DomComponents
      domComponents.clear()
      this.editor.setComponents(`${htmlBody}`)
    },
    cloneUrlButtonCLick() {
      this.cloneUrlPage = this.cloneUrl
    }
  }
}
</script>

<style lang="scss"></style>
