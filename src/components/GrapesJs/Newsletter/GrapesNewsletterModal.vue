<template>
  <div style="margin-bottom: 70px !important;" id="threat-sharing-post-incident-grapesjs-modal">
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
import 'grapesjs-tooltip'
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
import { uploadEmlOrMsg } from '../../../api/threadSharing'
import { COMMON_CONSTANTS } from '../../../model/constants/commonConstants'
import { setGrapesjsStyle } from './assets/css/grapesStyle'
import 'grapesjs-component-code-editor/dist/grapesjs-component-code-editor.min.css'
import 'grapesjs/dist/css/grapes.min.css'
import parserPostCSS from 'grapesjs-parser-postcss'
import componentEditor from '../../GrapesJs/ComponentEditor/index'

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
      urlMergedTexts: [{ value: '', name: 'No Merged Text' }]
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
      let _this = this
      const component = this.editor.getSelected()
      setTimeout(() => {
        let mergedTextsNames = _this.urlMergedTexts.map((item) => item.value)
        if (
          component.getTrait('href').props().value === '' ||
          !mergedTextsNames.includes(component.getTrait('href').props().value)
        ) {
          document.querySelector(
            '#gjsNewsletterModal > div.gjs-editor.gjs-one-bg.gjs-two-color > div.gjs-pn-panels > div.gjs-pn-panel.gjs-pn-views-container.gjs-one-bg.gjs-two-color > div:nth-child(3) > div:nth-child(1) > div.gjs-trt-traits.gjs-one-bg.gjs-two-color > div:nth-child(4) > div > div.gjs-field-wrp.gjs-field-wrp--select > div > div:nth-child(1) > select'
          ).selectedIndex = 0
        }
        //component.getTrait('href').props()
      }, 10)
    },
    setMergedTextsForLinks() {
      Object.keys(this.blockManagerComponents).forEach((key) => {
        if (this.blockManagerComponents[key].attributes.isUrl)
          this.urlMergedTexts.push({
            value: key,
            name: this.blockManagerComponents[key].label,
            title: 'asdasd'
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
        },
        {
          type: 'select',
          label: 'Merged Texts',
          name: 'href',
          options: this.urlMergedTexts
        }
      ]
      /*if (this.urlMergedTexts.length > 1) {
        this.traits.push()
      }*/
    },
    setGrapesEditor() {
      let _this = this
      this.editor = GrapesNewsletterModal.init({
        container: '#gjsNewsletterModal',
        fromElement: 1,
        storageManager: { type: 0 },
        plugins: [
          'gjs-preset-newsletter',
          'gjs-preset-webpage',
          parserPostCSS,
          componentEditor,
          'grapesjs-tooltip'
        ],
        pluginsOpts: {
          'gjs-preset-newsletter': {
            modalTitleImport: 'Import Template',
            importPlaceholder: 'Template Here',
            inlineCss: true,
            categoryLabel: 'Basic'
          }
        },
        noticeOnUnload: false,
        styleManager: {
          sectors: [
            {
              name: 'Dimension',
              open: true
            }
          ]
        }
      })
      debugger
      const copyEditor = Object.assign({}, this.editor)
      this.editor.on('component:selected', () => {
        const selected = this.editor.getSelected()
        if (selected && selected.is('link')) {
          document.getElementsByClassName('gjs-pn-btn fa fa-cog')[0].click()
          setTimeout(() => {
            document
              .querySelector(
                '#gjsNewsletterModal > div.gjs-editor.gjs-one-bg.gjs-two-color > div.gjs-pn-panels > div.gjs-pn-panel.gjs-pn-views-container.gjs-one-bg.gjs-two-color > div:nth-child(3) > div:nth-child(1) > div.gjs-trt-traits.gjs-one-bg.gjs-two-color > div:nth-child(2) > div > div.gjs-field-wrp.gjs-field-wrp--text > div > input[type=text]'
              )
              .addEventListener('change', (a, b, c) => {
                this.asd(a, b, c)
              })
            document
              .querySelector(
                '#gjsNewsletterModal > div.gjs-editor.gjs-one-bg.gjs-two-color > div.gjs-pn-panels > div.gjs-pn-panel.gjs-pn-views-container.gjs-one-bg.gjs-two-color > div:nth-child(3) > div:nth-child(1) > div.gjs-trt-traits.gjs-one-bg.gjs-two-color > div:nth-child(4) > div > div.gjs-field-wrp.gjs-field-wrp--select > div > div:nth-child(1) > select'
              )
              .addEventListener('change', (a, b, c) => {
                this.asd(a, b, c)
              })
            if (selected.getTrait('href').props().value === '') {
              document.querySelector(
                '#gjsNewsletterModal > div.gjs-editor.gjs-one-bg.gjs-two-color > div.gjs-pn-panels > div.gjs-pn-panel.gjs-pn-views-container.gjs-one-bg.gjs-two-color > div:nth-child(3) > div:nth-child(1) > div.gjs-trt-traits.gjs-one-bg.gjs-two-color > div:nth-child(2) > div > div.gjs-field-wrp.gjs-field-wrp--text > div > input[type=text]'
              ).value = ''
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
        } else {
          this.editor.StyleManager.getSectors().models[0].attributes.open = true
          this.editor.StyleManager.getSectors().models[1].attributes.open = true
          this.editor.StyleManager.getSectors().models[2].attributes.open = true
          this.editor.StyleManager.render()
          /*document.getElementById('gjs-sm-dimension').className =
            'gjs-sm-sector gjs-sm-sector__dimension no-select gjs-sm-open'
          document.querySelector('#gjs-sm-dimension #gjs-sm-caret').className = 'fa fa-caret-down'
          document.querySelector('#gjs-sm-dimension .gjs-sm-properties').style.display = 'block'
          document.getElementById('gjs-sm-typography').className =
            'gjs-sm-sector gjs-sm-sector__typography no-select gjs-sm-open'
          document.querySelector('#gjs-sm-typography #gjs-sm-caret').className = 'fa fa-caret-down'
          document.querySelector('#gjs-sm-typography .gjs-sm-properties').style.display = 'block'
          document.getElementById('gjs-sm-decorations').className =
            'gjs-sm-sector gjs-sm-sector__decorations no-select gjs-sm-open'
          document.querySelector('#gjs-sm-decorations #gjs-sm-caret').className = 'fa fa-caret-down'
          document.querySelector('#gjs-sm-decorations .gjs-sm-properties').style.display = 'block'*/
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

      let pn = this.editor.Panels
      pn.getButton('options', 'sw-visibility').set('active', 0)
      if (!!this.htmlData) {
        this.getGrapesWebModalDraw(this.htmlData)
      }
      const panelViews = pn.addPanel({
        id: 'views'
      })
      panelViews.get('buttons').add([
        {
          attributes: {
            title: 'Open Code'
          },
          className: 'fa fa-file-code-o',
          command: 'open-code',
          togglable: false, //do not close when button is clicked again
          id: 'open-code'
        }
      ])
      const blocks = blockManager.getAll()
      blocks.map((block) => {
        if (block.attributes.id === 'sect100') {
          block.attributes.category = {
            label: 'Layout'
          }
        } else if (block.attributes.id === 'sect50') {
          block.attributes.category = {
            label: 'Layout'
          }
        } else if (block.attributes.id === 'sect30') {
          block.attributes.category = {
            label: 'Layout'
          }
        } else if (block.attributes.id === 'sect37') {
          block.attributes.category = {
            label: 'Layout'
          }
        } else if (block.attributes.id === 'button') {
          block.attributes.category = {
            label: 'Basic'
          }
        } else if (block.attributes.id === 'divider') {
          block.attributes.category = {
            label: 'Layout'
          }
        } else if (block.attributes.id === 'text') {
          block.attributes.category = {
            label: 'Typography'
          }
        } else if (block.attributes.id === 'text-sect') {
          block.attributes.category = {
            label: 'Typography'
          }
        } else if (block.attributes.id === 'image') {
          block.attributes.category = {
            label: 'Basic'
          }
        } else if (block.attributes.id === 'quote') {
          block.attributes.category = {
            label: 'Typography'
          }
        } else if (block.attributes.id === 'link') {
          block.attributes.category = {
            label: 'Typography'
          }
        } else if (block.attributes.id === 'link-block') {
          block.attributes.category = {
            label: 'Typography'
          }
        } else if (block.attributes.id === 'grid-items') {
          block.attributes.category = {
            label: 'Layout'
          }
        } else if (block.attributes.id === 'list-items') {
          block.attributes.category = {
            label: 'Layout'
          }
        } else if (block.attributes.id === 'column1') {
          block.attributes.category = {
            label: 'Layout'
          }
        } else if (block.attributes.id === 'column2') {
          block.attributes.category = {
            label: 'Layout'
          }
        } else if (block.attributes.id === 'column3') {
          block.attributes.category = {
            label: 'Layout'
          }
        } else if (block.attributes.id === 'column3-7') {
          block.attributes.category = {
            label: 'Layout'
          }
        } else if (block.attributes.id === 'video') {
          block.attributes.category = {
            label: 'Basic'
          }
        } else if (block.attributes.id === 'form') {
          block.attributes.category = {
            label: 'Forms'
          }
        } else if (block.attributes.id === 'input') {
          block.attributes.category = {
            label: 'Forms'
          }
        } else if (block.attributes.id === 'textarea') {
          block.attributes.category = {
            label: 'Forms'
          }
        } else if (block.attributes.id === 'select') {
          block.attributes.category = {
            label: 'Forms'
          }
        } else if (block.attributes.id === 'label') {
          block.attributes.category = {
            label: 'Forms'
          }
        } else if (block.attributes.id === 'checkbox') {
          block.attributes.category = {
            label: 'Forms'
          }
        } else if (block.attributes.id === 'radio') {
          block.attributes.category = {
            label: 'Forms'
          }
        } else if (block.attributes.id === 'text-basic') {
          block.attributes.category = {
            label: 'Forms'
          }
        } else if (block.attributes.id === 'map') {
          block.attributes.category = {
            label: 'Components'
          }
        } else if (block.attributes.id === 'h-navbar') {
          block.attributes.category = {
            label: 'Components'
          }
        } else if (block.attributes.id === 'countdown') {
          block.attributes.category = {
            label: 'Components'
          }
        } else {
          block.attributes.category = {
            label: 'Components'
          }
        }
      })
      for (const [key, value] of Object.entries(this.blockManagerComponents)) {
        blockManager.add(key, value)
      }
      setTimeout(() => {
        let mergedTexts = document.getElementsByClassName('merged-text')
        for (let i = 0; i < mergedTexts.length; i++) {
          document
            .getElementsByClassName('merged-text')
            [i].setAttribute(
              'title',
              document.getElementsByClassName('merged-text')[i].getAttribute('data-title')
            )
        }
        document.querySelector('.fa-download').classList.add('fa-upload')
        document.querySelector('.fa-download').classList.remove('fa-download')
      }, 1000)
      const rte = this.editor.RichTextEditor
      /*rte.remove('link')
      rte.add('link', {
        icon: 'fa fa-link',
        attributes: { title: 'Link' },
        // Example on it's easy to wrap a selected content

      })*/
      rte.get('link').result = (rte) => {
        copyEditor.select(copyEditor.DomComponents.getWrapper().find('body')[0])
        setTimeout(() => {
          copyEditor.DomComponents.render()
          //copyEditor.DomComponents.load()
        }, 400)
        setTimeout(() => {
          copyEditor.select(copyEditor.DomComponents.getWrapper().find('a#Reset')[0])
        }, 500)
        return rte.insertHTML(
          `<a href="" data-gjs-type="link" id="${rte.selection()}">${rte.selection()}</a>`
        )
      }
      rte.get('link').btn.innerHTML =
        "<img height='19' width='20' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAdNJREFUWAntlj1LA0EQhu+M2AgWVhaCf0AIqI2FNha2aVL7GxQt09hG9J/Y29qkEdKIhWAhpLCwEkQQND4v3B6TdTe5iOIpOzDszOx8vDe3X1mWKHUgdSB1IHUgdeBfdyCv8nXD4XAev1V4CZ6LxPTyPB9oDv9lhs2I3yv2B/ga/+eITzUzhZrwOfwCT6K2y4pje5Iz88qp3E0XN9VIYAd+g6vStABdXtXoxMDNhiYI6GI/DMzdY4v9lifjL/nG6FbUclkxhhnkY2ou8MuPjD0s4tiCLT2i7MGL4YjprcpV5FRuS62x2fBswLcm4g5ZG+NHSLlh1XCk2o1oMSa3nSfju/So8zdNFDVVy9FITX8N7pi6fdbEpdFLkUz7KLFjpPTzBB1DZ54tUw3y9bGvFXPCUNb1Aer8cnTlhMAocOWuDczHTJ8AFo6q5QBaDJl2UB0oemH4HRwYtBtG9sWeb6igj4tZN/EWgzEjshbqsEm2RlEZDYD1PmaEFZC1OqiDixOQX7nqDjgyLoqP3GU8lRwg/6pzLifET77qnDcgO7Au8qpUHjsEVHnNuLyqEX0sODzBkcBff24Ff7GPFqD6LfV7sPpAk546kDqQOpA6kDrw9zrwAQ55zcgJtHvUAAAAAElFTkSuQmCC'>"
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

<style lang="scss">
.gjs-pn-panel.gjs-pn-commands.gjs-one-bg,
.gjs-pn-buttons {
  background-color: #383b41 !important;
}
.gjs-editor {
  .gjs-one-bg {
    background-color: #383b41 !important;
  }
  .gjs-pn-btn.fa {
    color: white !important;
    font-size: 20px !important;
    max-height: 20px !important;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .gjs-pn-active {
    background-color: #757575 !important;
  }
  .gjs-pn-panel.gjs-pn-options.gjs-one-bg.gjs-two-color {
    border-right: 2px solid #757575 !important;
  }
  .gjs-pn-panel.gjs-pn-views.gjs-one-bg.gjs-two-color {
    padding: 0 !important;
    span {
      width: 19%;
      margin: 0 !important;
      padding: 20px !important;
    }
  }
  .gjs-pn-panel.gjs-pn-views-container.gjs-one-bg.gjs-two-color,
  .gjs-clm-tags.gjs-one-bg.gjs-two-color,
  .gjs-sm-properties,
  .gjs-blocks-c {
    background-color: #757575 !important;
  }
  .gjs-clm-label,
  .gjs-clm-header-label,
  .gjs-clm-sels-info,
  .gjs-sm-title,
  .gjs-sm-label,
  .gjs-traits-label {
    color: white !important;
  }
  input,
  .gjs-field,
  .codepanel-separator,
  .codepanel-label,
  .gjs-btn-prim {
    background-color: #383b41 !important;
    color: white !important;
  }
  .gjs-clm-tag.gjs-three-bg {
    border-radius: 4px !important;
    background-color: #1173c1 !important;
    color: white !important;
  }
  .gjs-pn-panel.gjs-pn-views.gjs-one-bg.gjs-two-color {
    border-left: none !important;
  }
  .gjs-pn-views-container {
    border-top: none !important;
  }
  .gjs-blocks-c {
    justify-content: space-between !important;
  }
  .gjs-block-categories {
    margin-top: 50px;
    .gjs-block {
      margin: 4px 4px 4px 2% !important;
    }
  }
  .gjs-block-categories:before {
    content: 'Add Elements';
    position: absolute;
    top: 16px;
    font-size: 12px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: normal;
    color: white;
    left: 16px;
  }
  .gjs-rte-toolbar {
    border: none !important;
    .gjs-rte-actionbar {
      background-color: #757575 !important;
      border-radius: 4px !important;
      .gjs-rte-action {
        height: 40px;
        width: 40px;
        color: white !important;
        border-right: 1px solid #383b41 !important;
        box-shadow: 0 5px 12px 2px rgba(91, 91, 91, 0.29), 0 3px 18px 2px rgba(56, 59, 65, 0) !important;
        background-image: linear-gradient(to top, #5b5b5b 67%, #827d7d) !important;
        font-size: 16px;
        &.gjs-rte-active {
          background-image: linear-gradient(to top, #383b41 100%, #383b41) !important;
        }
        &:first-child {
          border-top-left-radius: 4px;
          border-bottom-left-radius: 4px;
        }
        &:last-child {
          border-top-right-radius: 4px;
          border-bottom-right-radius: 4px;
          span {
            transform: none !important;
          }
          //background-image: url('../../../assets/img/link@2x.png') !important;
        }
      }
    }
  }
  .gjs-pn-panel.gjs-pn-options.gjs-one-bg.gjs-two-color {
    padding-right: 125px;
    width: 550px;
  }
  .gjs-pn-btn.fa.fa-eye {
    position: absolute;
    right: 30px;
    &:after {
      content: 'Preview';
      margin-left: 5px;
      font-size: 14px;
    }
  }
  .gjs-pn-buttons {
    .gjs-pn-btn {
      margin: 0 8px !important;
    }
  }
  .gjs-radio-item-label {
    border: 1px solid transparent;
  }
  .gjs-radio-item input:checked + .gjs-radio-item-label {
    border: 1px solid #434343;
  }
  .gjs-trt-trait.gjs-trt-trait--text,
  .gjs-trt-trait.gjs-trt-trait--select {
    background: #757575 !important;
  }
  .gjs-label {
    color: white !important;
  }
  .gjs-pn-panel.gjs-pn-commands.gjs-one-bg.gjs-two-color.gjs-hidden,
  .gjs-pn-panel.gjs-pn-devices-c.gjs-one-bg.gjs-two-color.gjs-hidden {
    display: block !important;
  }
  .gjs-pn-panel.gjs-pn-views.gjs-one-bg.gjs-two-color.gjs-hidden {
    display: block !important;
    height: 40px;
    .gjs-pn-buttons {
      display: none !important;
    }
  }
  .gjs-off-prv.fa.fa-eye-slash {
    display: flex;
    position: absolute;
    right: 24px;
    top: 6px;
    background: white;
    color: #2196f3;
    border-radius: 2px;
    box-shadow: inset 0 1px 3px 0 rgba(0, 0, 0, 0.22);
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: normal;
    &:after {
      content: 'Preview';
      margin-left: 4px;
      font-size: 14px;
    }
  }
  .gjs-cv-canvas {
    top: 40px !important;
  }
}
</style>
