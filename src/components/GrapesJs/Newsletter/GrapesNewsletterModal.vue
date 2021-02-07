<template>
  <div style="margin-bottom: 70px !important;">
    <div class="grapes-container-modal">
      <div class="panel__top-modal">
        <div class="panel__basic-actions-modal"></div>
      </div>
      <div id="gjsNewsletterModal"></div>
      <div id="blocksModal"></div>
    </div>
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
import { setGrapesjsStyle } from './assets/css/grapesStyle'

export default {
  name: 'GrapesNewsletterModal',
  //components: { KFileUpload },
  props: {
    htmlData: {
      required: false
    },
    blockManagerComponents: {
      type: Object,
      default() {
        return {
          exampleComponent: exampleComponent,
          exampleComponent2: exampleComponent2,
          to: to,
          toName: toName,
          subject: subject,
          macroFrom: macroForm,
          macroAttachment: macroAttachment,
          from: mergedFrom,
          fromName: fromName,
          customMacroAttachment: customMacroAttachment,
          trainingUrl: trainingUrl,
          phishingUrl: phishingUrl,
          macroUrl: macroUrl
        }
      }
    }
  },
  data() {
    return {
      cloneUrl: null,
      cloneUrlPage: null,
      editor: null,
      url: {
        required: (v) => (v && v.length <= 256) || 'It must between 1 - 256 characters',
        format: (v) =>
          /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/gi.test(
            v
          ) || 'invalid url'
      },
      urlMergedTexts: [{ value: ' ', name: 'No Merged Text' }]
    }
  },
  mounted() {
    this.setMergedTextsForLinks()
    this.setTraits()
    this.setGrapesEditor()
    window.addEventListener('popstate', function (event) {
      // Log the state data to the console
    })
  },
  methods: {
    asd(a, b, c) {
      const component = this.editor.getSelected()
      setTimeout(() => {
        if (component.getTrait('href').props().value === ' ') {
          document.querySelector(
            '#gjsNewsletterModal > div.gjs-editor.gjs-one-bg.gjs-two-color > div.gjs-pn-panels > div.gjs-pn-panel.gjs-pn-views-container.gjs-one-bg.gjs-two-color > div:nth-child(3) > div:nth-child(1) > div.gjs-trt-traits.gjs-one-bg.gjs-two-color > div:nth-child(2) > div > div.gjs-field-wrp.gjs-field-wrp--text > div > input[type=text]'
          ).value = ''
          debugger
          document.querySelector(
            '#gjsNewsletterModal > div.gjs-editor.gjs-one-bg.gjs-two-color > div.gjs-pn-panels > div.gjs-pn-panel.gjs-pn-views-container.gjs-one-bg.gjs-two-color > div:nth-child(3) > div:nth-child(1) > div.gjs-trt-traits.gjs-one-bg.gjs-two-color > div:nth-child(4) > div > div.gjs-field-wrp.gjs-field-wrp--select > div > div:nth-child(1) > select'
          ).value = 'No Merged Text'
        }
        //console.log(component.getTrait('href').props())
      }, 10)
    },
    setMergedTextsForLinks() {
      Object.keys(this.blockManagerComponents).forEach((key) => {
        if (this.blockManagerComponents[key].attributes.isUrl)
          this.urlMergedTexts.push({
            value: key,
            name: this.blockManagerComponents[key].label
          })
      })
    },
    setTraits() {
      this.traits = [
        {
          type: 'text',
          label: 'Title',
          name: 'title'
        },
        {
          type: 'text',
          label: 'Href',
          name: 'href'
        },
        {
          type: 'select',
          label: 'Target',
          name: 'target',
          options: [
            { value: '', name: 'This Window' },
            { value: '_blank', name: 'New Window' }
          ]
        }
      ]
      if (this.urlMergedTexts.length > 1) {
        this.traits.push({
          type: 'select',
          label: 'Merged Texts',
          name: 'href',
          options: this.urlMergedTexts
        })
      }
    },
    setGrapesEditor() {
      let _this = this
      this.editor = GrapesNewsletterModal.init({
        container: '#gjsNewsletterModal',
        fromElement: 1,
        storageManager: { type: 0 },
        plugins: ['gjs-preset-newsletter', 'gjs-preset-webpage'],
        pluginsOpts: {
          'gjs-preset-newsletter': {
            modalTitleImport: 'Import Template',
            importPlaceholder: 'Template Here',
            inlineCss: true,
            categoryLabel: 'Basic'
          }
        },
        noticeOnUnload: false
      })
      this.editor.on('component:selected', () => {
        const selected = this.editor.getSelected()
        if (selected && selected.is('link')) {
          document.getElementsByClassName('gjs-pn-btn fa fa-cog')[0].click()
          setTimeout(() => {
            if (
              document.querySelector(
                '#gjsNewsletterModal > div.gjs-editor.gjs-one-bg.gjs-two-color > div.gjs-pn-panels > div.gjs-pn-panel.gjs-pn-views-container.gjs-one-bg.gjs-two-color > div:nth-child(3) > div:nth-child(1) > div.gjs-trt-traits.gjs-one-bg.gjs-two-color > div:nth-child(4) > div > div.gjs-field-wrp.gjs-field-wrp--select > div > div:nth-child(1) > select'
              )
            ) {
              document
                .querySelector(
                  '#gjsNewsletterModal > div.gjs-editor.gjs-one-bg.gjs-two-color > div.gjs-pn-panels > div.gjs-pn-panel.gjs-pn-views-container.gjs-one-bg.gjs-two-color > div:nth-child(3) > div:nth-child(1) > div.gjs-trt-traits.gjs-one-bg.gjs-two-color > div:nth-child(4) > div > div.gjs-field-wrp.gjs-field-wrp--select > div > div:nth-child(1) > select'
                )
                .addEventListener('change', (a, b, c) => {
                  this.asd(a, b, c)
                })
              if (selected.getTrait('href').props().value === ' ') {
                document.querySelector(
                  '#gjsNewsletterModal > div.gjs-editor.gjs-one-bg.gjs-two-color > div.gjs-pn-panels > div.gjs-pn-panel.gjs-pn-views-container.gjs-one-bg.gjs-two-color > div:nth-child(3) > div:nth-child(1) > div.gjs-trt-traits.gjs-one-bg.gjs-two-color > div:nth-child(2) > div > div.gjs-field-wrp.gjs-field-wrp--text > div > input[type=text]'
                ).value = ''
              }
            }
            let mergedTextsNames = _this.urlMergedTexts.map((item) => item.value)
            if (
              !mergedTextsNames.includes(selected.getTrait('href').props().value) &&
              document.querySelector(
                '#gjsNewsletterModal > div.gjs-editor.gjs-one-bg.gjs-two-color > div.gjs-pn-panels > div.gjs-pn-panel.gjs-pn-views-container.gjs-one-bg.gjs-two-color > div:nth-child(3) > div:nth-child(1) > div.gjs-trt-traits.gjs-one-bg.gjs-two-color > div:nth-child(4) > div > div.gjs-field-wrp.gjs-field-wrp--select > div > div:nth-child(1) > select'
              )
            ) {
              document.querySelector(
                '#gjsNewsletterModal > div.gjs-editor.gjs-one-bg.gjs-two-color > div.gjs-pn-panels > div.gjs-pn-panel.gjs-pn-views-container.gjs-one-bg.gjs-two-color > div:nth-child(3) > div:nth-child(1) > div.gjs-trt-traits.gjs-one-bg.gjs-two-color > div:nth-child(4) > div > div.gjs-field-wrp.gjs-field-wrp--select > div > div:nth-child(1) > select'
              ).selectedIndex = 0
            }
          }, 50)
        }
      })
      setTimeout(() => {
        if (!document.getElementsByClassName('gjs-btn-prim').length) {
          document
            .getElementsByClassName('gjs-pn-btn fa fa-code')[0]
            .addEventListener('click', () => {
              setTimeout(() => {
                document.getElementsByClassName('gjs-btn-prim')[0].setAttribute('type', 'button')
              }, 100)
            })
        }
      }, 500)
      let dType = this.editor.DomComponents.getType('link')
      let dModel = dType.model
      let dView = dType.view
      this.editor.DomComponents.addType('link', {
        model: dModel.extend(
          {
            defaults: Object.assign({}, dModel.prototype.defaults, {
              traits: this.traits
            })
          },
          {
            isComponent: function (el) {
              if (el.tagName == 'A') {
                return { type: 'link' }
              }
            }
          }
        ),
        view: dView
      })
      let blockManager = this.editor.BlockManager
      for (const [key, value] of Object.entries(this.blockManagerComponents)) {
        blockManager.add(key, value)
      }
      let pn = this.editor.Panels
      pn.getButton('options', 'sw-visibility').set('active', 0)
      if (!!this.htmlData) {
        this.getGrapesWebModalDraw(this.htmlData)
      }
      //pn.getButton('options', 'gjs-open-import-template').set('active', 1)
    },
    uploadFile(e) {
      this.msgEmlFile = e
      uploadEmlOrMsg(this.msgEmlFile)
        .then((response) => {
          this.getGrapesWebModalDraw(response.data.data.body)
        })
        .catch((error) => {
          this.$store.dispatch('common/createSnackBar', {
            color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
            message: 'Error when getting details of uploaded file'
          })
        })
    },
    cloneUrlButtonCLick() {
      this.cloneUrlPage = this.cloneUrl
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
