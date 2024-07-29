<template>
  <div style="margin-bottom: 110px !important;" id="threat-sharing-post-incident-grapesjs-modal">
    <DefaultErrorDialog
      v-if="showInvalidUrlMessage"
      :status="showInvalidUrlMessage"
      error-message="Please enter a invalid URL"
      @on-close="showInvalidUrlMessage = false"
    />
    <div class="grapes-container-modal">
      <div class="panel__top-modal">
        <div class="panel__basic-actions-modal"></div>
      </div>
      <div id="gjsNewsletterModal" style="height: 100vh;"></div>
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
import amazonTemplate from './components/amazonTemplate'
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
import { uploadEmlOrMsg } from '@/api/threatSharing'
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'
import plugin from 'grapesjs-style-bg'
import 'grapick/dist/grapick.min.css'
import 'grapesjs-component-code-editor/dist/grapesjs-component-code-editor.min.css'
import 'grapesjs/dist/css/grapes.min.css'
import submitButton from '@/components/GrapesJs/Newsletter/components/submitButton'
import { deleteFiles, getUploadedFiles, uploadFiles } from '@/api/file'
import { minifyHTML } from '@/api/scenarios'
import { copyToClipboard } from '@/utils/functions'
import * as validations from '@/utils/validations'
import DefaultErrorDialog from '@/components/Common/Others/DefaultErrorDialog'
import outlookButton from '@/components/GrapesJs/Newsletter/components/outlookButton'
import {
  getComponentTypeDefaultParams,
  getTraits,
  setBlocksCategories
} from '@/components/GrapesJs/Newsletter/utils'
export default {
  name: 'GrapesNewsletterModal',
  components: { DefaultErrorDialog },
  props: {
    htmlData: {
      required: false
    },
    isAttachmentBasedTemplate: {
      type: Boolean,
      default: false
    },
    blockManagerComponents: {
      type: Object,
      default() {
        return {
          exampleComponent: exampleComponent,
          exampleComponent2: exampleComponent2,
          amazonTemplate: amazonTemplate,
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
    },
    templateType: {
      type: String,
      default: 'email'
    }
  },
  data() {
    return {
      showInvalidUrlMessage: false,
      editor: null,
      url: {
        required: (v) => (v && v.length <= 256) || 'It must between 1 - 256 characters',
        format: (v) =>
          /(ftp|http|https):\/\/(\w+:?\w*@)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%@\-\/]))?/gi.test(v) ||
          'invalid url'
      },
      urlMergedTexts: [{ value: '', name: 'No Merged Text' }]
    }
  },
  created() {
    this.callForImages()
  },
  mounted() {
    this.setMergedTextsForLinks()
    this.setTraits()
    this.setGrapesEditor()
  },
  methods: {
    onSelectComponent() {
      this.editor.on('component:selected', () => {
        const selected = this?.editor?.getSelected()
        if (selected && selected.is('link')) {
          document.getElementsByClassName('gjs-pn-btn fa fa-cog')[0].click()
          setTimeout(() => {
            document
              .querySelector(
                '#gjsNewsletterModal > div.gjs-editor.gjs-one-bg.gjs-two-color > div.gjs-pn-panels > div.gjs-pn-panel.gjs-pn-views-container.gjs-one-bg.gjs-two-color > div:nth-child(3) > div:nth-child(1) > div.gjs-trt-traits.gjs-one-bg.gjs-two-color > div:nth-child(2) > div > div.gjs-field-wrp.gjs-field-wrp--text > div > input[type=text]'
              )
              ?.addEventListener('change', () => {
                this.setMergeTextNames()
              })
            document
              .querySelector(
                '#gjsNewsletterModal > div.gjs-editor.gjs-one-bg.gjs-two-color > div.gjs-pn-panels > div.gjs-pn-panel.gjs-pn-views-container.gjs-one-bg.gjs-two-color > div:nth-child(3) > div:nth-child(1) > div.gjs-trt-traits.gjs-one-bg.gjs-two-color > div:nth-child(4) > div > div.gjs-field-wrp.gjs-field-wrp--select > div > div:nth-child(1) > select'
              )
              ?.addEventListener('change', () => {
                this.setMergeTextNames()
              })
            if (selected.getTrait('href').props().value === '') {
              const el = document.querySelector(
                '#gjsNewsletterModal > div.gjs-editor.gjs-one-bg.gjs-two-color > div.gjs-pn-panels > div.gjs-pn-panel.gjs-pn-views-container.gjs-one-bg.gjs-two-color > div:nth-child(3) > div:nth-child(1) > div.gjs-trt-traits.gjs-one-bg.gjs-two-color > div:nth-child(2) > div > div.gjs-field-wrp.gjs-field-wrp--text > div > input[type=text]'
              )
              if (el) {
                el.value = ''
              }
            }
            let mergedTextsNames = this.urlMergedTexts.map((item) => item.value)
            if (
              !mergedTextsNames.includes(selected.getTrait('href').props().value) &&
              document.querySelector(
                '#gjsNewsletterModal > div.gjs-editor.gjs-one-bg.gjs-two-color > div.gjs-pn-panels > div.gjs-pn-panel.gjs-pn-views-container.gjs-one-bg.gjs-two-color > div:nth-child(3) > div:nth-child(1) > div.gjs-trt-traits.gjs-one-bg.gjs-two-color > div:nth-child(4) > div > div.gjs-field-wrp.gjs-field-wrp--select > div > div:nth-child(1) > select'
              )
            ) {
              const element = document.querySelector(
                '#gjsNewsletterModal > div.gjs-editor.gjs-one-bg.gjs-two-color > div.gjs-pn-panels > div.gjs-pn-panel.gjs-pn-views-container.gjs-one-bg.gjs-two-color > div:nth-child(3) > div:nth-child(1) > div.gjs-trt-traits.gjs-one-bg.gjs-two-color > div:nth-child(4) > div > div.gjs-field-wrp.gjs-field-wrp--select > div > div:nth-child(1) > select'
              )
              if (element) {
                element.selectedIndex = 0
              }
            }
          }, 250)
        } else if (selected) {
          const name = selected.getName()
          if (['Input', 'Textarea', 'Button', 'Checkbox'].includes(name)) {
            const settingsTab = document.querySelector('.gjs-pn-buttons span[title="Settings"]')
            if (settingsTab) {
              settingsTab.click()
            }
          }
        }
      })
    },
    onDragStop() {
      this.editor.on('block:drag:stop', (droppedComponent, block) => {
        if (droppedComponent && block.attributes && block.attributes.customId === 'grapesForm') {
          droppedComponent.components().forEach((inner) => {
            const view = inner?.find('label')?.[0]?.view
            if (!view) return
            switch (view.el.textContent) {
              case 'Name':
                inner.find('input')[0].addAttributes({ name: 'Name' })
                break
              case 'Email':
                inner.find('input')[0].addAttributes({ name: 'Email' })
                break
              case 'Gender':
                inner.find('input')[0].addAttributes({ name: 'Male' })
                inner.find('input')[1].addAttributes({ name: 'Female' })
                break
              case 'Message':
                inner.find('textarea')[0].addAttributes({ name: 'Message' })
                break
              default:
                break
            }
          })
        }
      })
    },
    changeEditorComponentFunction() {
      this.editor.setComponents = (function (originalFct) {
        return function (components) {
          try {
            originalFct(components)
          } catch (ex) {
            window.alert('Parse error: ' + ex)
          }
        }
      })(this.editor.setComponents)
    },
    removeVideoElement() {
      const videoIndex = this.editor.Blocks.all.models.findIndex(
        (model) => model?.attributes?.label === 'Video'
      )
      if (videoIndex !== -1) {
        this.editor.Blocks.all.models.splice(videoIndex, 1)
      }
    },
    setPanels() {
      let pn = this.editor.Panels
      pn.getButton('options', 'export-template').set('className', 'fa fa-import')
      pn.getButton('options', 'gjs-open-import-webpage').set('className', 'fa fa-code')
      document.querySelector('span[title="Open Layer Manager"]').style.display = 'none'
      document.querySelector('span[title="Open Blocks"]').style.order = '-1'
      pn.removeButton('options', 'preview')
      pn.addButton('options', {
        id: 'my-preview',
        className: 'fa fa-eye',
        attributes: { title: 'Preview' },
        active: false
      })
      document.querySelector('span[title="Preview"]').addEventListener('click', () => {
        const win = window.open('', '_blank')
        win.document.title = 'Mail Preview'
        win.document.body.innerHTML = this.getGrapesEditorContent().replace(
          /{COMPANYLOGO}/g,
          this?.$store?.state?.whitelabel.mainLogoUrl || ''
        )
      })
      pn.getButton('options', 'sw-visibility').set('active', 0)
    },
    addCustomCSS() {
      this.editor.Css.setRule('.grapes-custom-button', {
        color: 'white',
        'background-color': '#2196F3',
        padding: '8px 12px',
        'border-radius': '4px',
        display: 'inline-block'
      })
    },
    setLinkType() {
      let dType = this.editor.DomComponents.getType('link')
      let dModel = dType.model
      let dView = dType.view
      this.editor.DomComponents.addType('link', {
        model: dModel.extend({
          defaults: Object.assign({}, dModel.prototype.defaults, {
            traits: this.traits
          })
        }),
        view: dView
      })
    },
    addCustomProperties() {
      this.editor.StyleManager.removeProperty('decorations', 'background')
      this.editor.StyleManager.addProperty('dimension', {
        property: 'display',
        type: 'select',
        list: [
          { name: 'inline-block', value: 'inline-block' },
          { name: 'flex', value: 'flex' },
          { name: 'grid', value: 'grid' },
          { name: 'inline', value: 'inline' },
          { name: 'block', value: 'block' },
          { name: 'none', value: 'none' }
        ]
      })
      this.editor.StyleManager.addProperty(
        'decorations',
        {
          name: 'Background Image',
          property: 'background-image',
          type: 'text'
        },
        { at: 1 }
      )
    },
    addFonts() {
      let styleManager = this.editor.StyleManager
      let fontProperty = styleManager.getProperty('typography', 'font-family')
      if (fontProperty?.attributes) {
        fontProperty.attributes.options.push({ value: 'sans-serif', name: 'Sans-serif' })
      }
      styleManager.render()
    },
    callForImages() {
      getUploadedFiles().then((res) => {
        const {
          data: { data }
        } = res
        const assetManager = this.editor.AssetManager
        const assets = data.map((img) => {
          const obj = {
            src: '',
            category: 'c1',
            name: img['originalName'],
            resourceId: img['resourceId']
          }
          obj.src = APP_CONFIG.VUE_APP_APP_API_TEST + img['previewLink']
          return obj
        })
        assetManager.add(assets)
        this.renderAssetsToAssetsManager(data)
      })
    },
    renderAssetsToAssetsManager(data = []) {
      this.editor.AssetManager.render(data)
    },
    destroyEditor() {
      this.editor.destroy()
    },
    setMergeTextNames() {
      const component = this?.editor?.getSelected()
      if (component) {
        setTimeout(() => {
          let mergedTextsNames = this.urlMergedTexts.map((item) => item.value)
          if (
            component.getTrait('href').props().value === '' ||
            !mergedTextsNames.includes(component.getTrait('href').props().value)
          ) {
            const element = document.querySelector(
              '#gjsNewsletterModal > div.gjs-editor.gjs-one-bg.gjs-two-color > div.gjs-pn-panels > div.gjs-pn-panel.gjs-pn-views-container.gjs-one-bg.gjs-two-color > div:nth-child(3) > div:nth-child(1) > div.gjs-trt-traits.gjs-one-bg.gjs-two-color > div:nth-child(4) > div > div.gjs-field-wrp.gjs-field-wrp--select > div > div:nth-child(1) > select'
            )
            if (element) {
              element.selectedIndex = 0
            }
          }
        }, 10)
      }
    },
    setMergedTextsForLinks() {
      const blockManagerComponents = JSON.parse(JSON.stringify(this.blockManagerComponents))
      if (this.isAttachmentBasedTemplate) {
        delete blockManagerComponents['{PHISHINGURL}']
      }
      Object.keys(blockManagerComponents).forEach((key) => {
        if (
          blockManagerComponents[key] &&
          blockManagerComponents[key].attributes &&
          blockManagerComponents[key].attributes.isUrl
        )
          this.urlMergedTexts.push({
            value: key,
            name: blockManagerComponents[key].label,
            title: 'Title'
          })
      })
    },
    setTraits() {
      this.traits = getTraits(this.urlMergedTexts)
    },
    setGrapesEditor() {
      let _this = this
      const myNewComponentTypes = (editor) => {
        editor.DomComponents.addType('cell', {
          isComponent(el) {
            let result = ''
            const tag = el.tagName
            if (tag === 'TD' || tag === 'TH') {
              result = {
                type: 'cell',
                tagName: tag.toLowerCase()
              }
              result.components = `<td><div>${el.innerHTML}</div></td>`
            }

            return result
          }
        })
        editor.DomComponents.addType('phishing-submit-button', {
          isComponent(el) {
            const { tagName } = el
            if (['BUTTON', 'INPUT'].includes(tagName) && el.getAttribute('type') === 'submit') {
              return {
                type: 'phishing-submit-button',
                tagName: tagName.toLowerCase()
              }
            }
          },
          model: {
            defaults: {
              traits: [
                {
                  name: 'value',
                  label: 'Text'
                },
                'id',
                {
                  type: 'text',
                  label: 'URL Redirection',
                  name: 'urlredirection'
                },
                {
                  type: 'select',
                  label: 'Type',
                  name: 'type',
                  options: [{ id: 'submit', name: 'Submit' }]
                }
              ],
              attributes: { type: 'submit' }
            }
          },
          view: {
            events: {
              click: 'handleClick'
            },
            init({ model }) {
              this.listenTo(
                model,
                'change:attributes:urlredirection',
                this.handleURLRedirectionChange
              )
              this.listenTo(model, 'change:attributes:value', this.handleTextChange)
            },
            handleURLRedirectionChange(component, value) {
              if (!value) return

              const renderErrorMessage = () => {
                setTimeout(() => {
                  component.addAttributes({ urlredirection: '' })
                }, 100)
                _this.showInvalidUrlMessage = true
              }

              try {
                //checking is valid url
                if (!validations.isDomainUrl(value, '')) {
                  renderErrorMessage()
                }
              } catch (e) {
                renderErrorMessage()
              }
            },
            handleTextChange(component, value) {
              if (component?.getEl()?.constructor?.name === 'HTMLButtonElement') {
                component.components(value)
              }
            },
            handleClick() {
              const { urlredirection } = this.model.getAttributes()
              if (urlredirection) {
                //urlredirection
              }
            }
          }
        })
        editor.DomComponents.addType('outlook-button', getComponentTypeDefaultParams(true, true))
        editor.DomComponents.addType('text', getComponentTypeDefaultParams(true, true))
        editor.DomComponents.addType('link', getComponentTypeDefaultParams(true, true))
        editor.DomComponents.addType('span', getComponentTypeDefaultParams(true, true))
        editor.DomComponents.addType('label', getComponentTypeDefaultParams(false, true))
        editor.DomComponents.addType('image', {
          isComponent: (el) => {
            return el.tagName === 'IMG'
          },
          model: {
            defaults: {
              traits: ['src', 'URL', 'alt']
            },
            init() {
              this.on('change:attributes:URL', this.handleAttrChange)
              this.on('change:attributes:src', this.srcChange)
            },
            handleAttrChange(component, value) {
              try {
                if (component?.getEl()?.parentElement?.constructor?.name === 'HTMLAnchorElement') {
                  const parent = component.closest('a')
                  parent.set('attributes', { href: value })
                  return
                }
              } catch (e) {
                return
              }
              const style = component.getStyle()
              let styleHTML = ''
              const keys = Object.keys(style)
              const el = component?.getEl()
              for (const key of keys) {
                styleHTML += `${key}:${style[key]};`
                el.style[key] = style[key]
              }
              const coll = component?.collection || null
              if (coll) {
                const at = coll.indexOf(component)
                el.setAttribute('href', value)
                coll.remove(component)
                if (at !== -1) {
                  coll.add(`<a href='${value}'> ${el.outerHTML}</a>`, {
                    at
                  })
                }
              }
            },
            srcChange(component, value) {
              component.set('src', value)
            }
          },
          view: {
            init() {},
            onRender() {}
          }
        })
      }
      this.editor = GrapesNewsletterModal.init({
        container: '#gjsNewsletterModal',
        fromElement: 1,
        storageManager: { type: 0 },
        plugins: ['gjs-preset-newsletter', 'gjs-preset-webpage', myNewComponentTypes, plugin],
        pluginsOpts: {
          'gjs-preset-newsletter': {
            modalTitleImport: 'Import Template',
            importPlaceholder: 'Template Here',
            inlineCss: true,
            categoryLabel: 'Basic',
            cmdInlineHtml: 'get-html-juiced'
          }
        },
        noticeOnUnload: false,
        styleManager: {
          sectors: [
            {
              name: 'extra',
              buildProps: ['display']
            }
          ]
        }
      })
      this.changeEditorComponentFunction()
      this.onSelectComponent()
      this.onDragStop()
      this.setLinkType()
      this.editor.on('component:drag:end', (droppedComponent) => {
        const el = droppedComponent?.target?.getEl()
        if (
          el?.id?.includes('outlook-button-href-id') &&
          el?.parentElement?.constructor?.name !== 'HTMLSpanElement'
        ) {
          const buttonStyles = { ...droppedComponent.target.getStyle() }
          let arrangedComment =
            '<!--[if mso]> <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="" style="height:34px;v-text-anchor:middle;width:65px;" arcsize="12%" stroke="f" fillcolor="#2196F3">        <w:anchorlock/>        <center style="color:#ffffff; font-family:Arial, sans-serif; font-size:13px;">    <![endif]-->'
          arrangedComment = arrangedComment.replace(
            /href="([^\'\"]+)?"/g,
            `href="${droppedComponent?.target?.attributes?.attributes?.href}"`
          )
          arrangedComment = arrangedComment.replace(
            /fillcolor="([^\'\"]+)?"/g,
            `fillcolor="${buttonStyles['background-color'] || buttonStyles['background']}}"`
          )
          arrangedComment = arrangedComment.replace(
            /color\:\#?(\w|\s|-)+\;/g,
            `color:${buttonStyles.color};`
          )
          arrangedComment = arrangedComment.replace(
            /font-family\:\#?(\w|\s|-|\,)+\;/g,
            `font-family:${buttonStyles['font-family']};`
          )
          arrangedComment = arrangedComment.replace(
            /font-size\:\#?(\w|\s|-)+\;/g,
            `font-size:${buttonStyles['font-size']};`
          )
          if (buttonStyles['width']) {
            arrangedComment = arrangedComment.replace(
              /width\:\#?(\w|\s|-)+\;/g,
              `width:${
                buttonStyles['width']?.includes('px')
                  ? buttonStyles['width']?.replace('px', '')
                  : buttonStyles['width']
              }px;`
            )
          } else if (typeof buttonStyles['width'] === 'undefined' || buttonStyles['width'] === '') {
            let width = droppedComponent?.target?.getEl()?.getBoundingClientRect()?.width
            if (width < 65) {
              width += 12
            } else if (width < 95) {
              width += 14
            } else if (width < 140) {
              width += 18
            } else {
              width += 22
            }
            width = Math.round(width)
            arrangedComment = arrangedComment.replace(
              /width\:\#?(\w|\s|-)+\;/g,
              `width:${width}px;`
            )
          }
          const children = droppedComponent.parent.components()
          const at = droppedComponent?.index
          const content =
            droppedComponent.target.getInnerHTML().startsWith('<span') ||
            droppedComponent.target.getInnerHTML().startsWith('')
              ? droppedComponent.target.toHTML()
              : droppedComponent.target.getInnerHTML()
          droppedComponent?.target.remove()
          const newComponent = children.add(
            `<span class="outlook-button-span-id">  ${arrangedComment}  ${content} <!--[if mso]>        </center>    </v:roundrect>    <![endif]--></span>`,
            { at }
          )
          const anchor = newComponent
            .components()
            .models.find((comp) => comp?.getEl()?.id?.includes('outlook'))
          if (anchor) {
            anchor.setStyle(buttonStyles)
          }
          if (newComponent) {
            const copyStyle = { ...buttonStyles }
            if (copyStyle.padding) {
              delete copyStyle.padding
            }
            if (copyStyle.margin) {
              delete copyStyle.margin
            }
            if (copyStyle.width) {
              delete copyStyle.width
            }
            newComponent.setStyle(copyStyle)
          }
          this.editor
            .getWrapper()
            .find('.outlook-button-span-id')
            .find((cmp) => {
              if (cmp.toHTML().includes('<a')) return
              cmp.remove()
            })
        }
      })
      this.editor.on('style:property:update', (styleChanges) => {
        if (!styleChanges.to.value && styleChanges?.property?.attributes?.property !== 'width') {
          return
        }
        if (
          ![
            'background-color',
            'color',
            'font-family',
            'font-size',
            'background',
            'width'
          ].includes(styleChanges.property.attributes.property)
        ) {
          return
        }
        const updatedComponent = this.editor.getSelected()
        if (
          updatedComponent?.getEl()?.id?.includes('outlook') ||
          updatedComponent?.getEl()?.classList.contains('outlook-button-span-id')
        ) {
          const parent = updatedComponent?.parent()
          if (parent) {
            const children = parent.components()
            const commentElement = children?.models?.find(
              (el) => el?.attributes?.type === 'comment'
            )
            if (commentElement) {
              if (
                styleChanges?.property?.attributes?.property === 'background-color' ||
                styleChanges?.property?.attributes?.property === 'background'
              ) {
                commentElement.attributes.content = commentElement.attributes.content.replace(
                  /fillcolor="([^\'\"]+)"/g,
                  `fillcolor="${styleChanges.value}"`
                )
              }
              if (styleChanges?.property?.attributes?.property === 'color') {
                commentElement.attributes.content = commentElement.attributes.content.replace(
                  /color\:\#?(\w|\s|-)+\;/g,
                  `color:${styleChanges.value};`
                )
              }
              if (styleChanges?.property?.attributes?.property === 'font-family') {
                commentElement.attributes.content = commentElement.attributes.content.replace(
                  /font-family\:\#?(\w|\s|-|\,)+\;/g,
                  `font-family:${styleChanges.value};`
                )
              }
              if (styleChanges?.property?.attributes?.property === 'font-size') {
                commentElement.attributes.content = commentElement.attributes.content.replace(
                  /font-size\:\#?(\w|\s|-)+\;/g,
                  `font-size:${styleChanges.value};`
                )
              }
              if (styleChanges?.property?.attributes?.property === 'width') {
                const isShowWidth = [0, '0', '', 'auto', undefined].includes(
                  styleChanges?.to?.value
                )
                if (isShowWidth) {
                  setTimeout(() => {
                    let width = updatedComponent.parent()?.getEl()?.getBoundingClientRect()?.width
                    if (width < 65) {
                      width += 12
                    } else if (width < 95) {
                      width += 14
                    } else if (width < 140) {
                      width += 18
                    } else {
                      width += 22
                    }
                    width = Math.round(width)
                    commentElement.attributes.content = commentElement.attributes.content.replace(
                      /width\:\#?(\w|\s|-)+\;/g,
                      `width:${width}px;`
                    )
                    commentElement.attributes.content = commentElement.attributes.content.replace(
                      /width:undefinedpx;/g,
                      `width:${width}px;`
                    )
                  }, 500)
                } else {
                  setTimeout(() => {
                    commentElement.attributes.content = commentElement.attributes.content.replace(
                      /width\:\#?(\w|\s|-)+\;/g,
                      `width:${styleChanges?.to?.value}px;`
                    )
                    commentElement.attributes.content = commentElement.attributes.content.replace(
                      /width:undefinedpx;/g,
                      `width:${styleChanges?.to?.value}px;`
                    )
                  }, 500)
                }
              }
            }
          }
        }
      })
      this.editor.on('component:update', (updatedComponent) => {
        if (updatedComponent?.getEl()?.id?.includes('outlook')) {
          const getCommentElement = () => {
            const parent = updatedComponent.parent()
            const children = parent.components()
            return children?.models?.find((el) => el?.attributes?.type === 'comment')
          }
          if (updatedComponent?.changed?.attributes?.href) {
            const commentElement = getCommentElement()
            if (commentElement) {
              commentElement.attributes.content = commentElement.attributes.content.replace(
                /href="([^\'\"]+)?"/g,
                `href="${updatedComponent?.changed?.attributes?.href}"`
              )
            }
          } else {
            const commentElement = getCommentElement()
            if (commentElement) {
              //if(document.querySelector('.gjs-sm-property__width .gjs-field-integer input')?.value)return
              let width = updatedComponent.parent()?.getEl()?.getBoundingClientRect()?.width
              if (width < 65) {
                width += 12
              } else if (width < 95) {
                width += 14
              } else if (width < 140) {
                width += 18
              } else {
                width += 22
              }

              commentElement.attributes.content = commentElement.attributes.content.replace(
                /width\:\#?(\w|\s|-)+\;/g,
                `width:${Math.round(width)}px;`
              )
              commentElement.attributes.content = commentElement.attributes.content.replace(
                /width:undefinedpx/g,
                `width:${Math.round(width)}px;`
              )
            }
          }
        }
      })
      this.editor.on('component:deselected', (updatedComponent) => {
        const el = updatedComponent?.getEl()
        if (el?.id?.includes('outlook-button-href-id') && !el.innerText) {
          const commentElement = this.getCommentElementByComponent(updatedComponent)
          if (commentElement?.attributes) {
            commentElement.attributes.content = commentElement.attributes.content.replace(
              /width\:\#?(\w|\s|-)+\;/g,
              `width:180px;`
            )
            commentElement.attributes.content = commentElement.attributes.content.replace(
              /width:undefinedpx/g,
              `width:180px;`
            )
            commentElement.attributes.content = commentElement.attributes.content.replace(
              /height\:\#?(\w|\s|-)+\;/g,
              `height:70px;`
            )
            commentElement.attributes.content = commentElement.attributes.content.replace(
              /height:undefinedpx/g,
              `height:70px;`
            )
            updatedComponent.components('No Label')
          }
        }
      })
      this.editor.on('component:remove', (component) => {
        if (component?.ccid?.includes('outlook-button-href-id')) {
          const editor = this.editor
          const outlookSpanItems = editor.DomComponents.getWrapper().find('.outlook-button-span-id')
          for (let i = 0; i < outlookSpanItems.length; i++) {
            const element = outlookSpanItems[i]
            if (!element?.toHTML?.()?.includes('outlook-button-href-id')) element.remove()
          }
        }
      })

      this.removeVideoElement()
      let blockManager = this.editor.BlockManager
      blockManager.add('amazonTemplate', amazonTemplate)
      this.setPanels()
      if (!!this.htmlData) {
        this.getGrapesWebModalDraw(this.htmlData)
      }
      setBlocksCategories(blockManager.getAll())
      blockManager.add('Submit Phishing Button', submitButton)
      blockManager.add('Outlook Button', outlookButton)
      this.addCustomCSS()
      const blockManagerComponents = JSON.parse(JSON.stringify(this.blockManagerComponents))
      if (this.isAttachmentBasedTemplate) {
        delete blockManagerComponents['{PHISHINGURL}']
      }
      for (const [key, value] of Object.entries(blockManagerComponents)) {
        if (key === '{COMPANYLOGO}') {
          value.content.components[0].src = '{COMPANYLOGO}'
        }
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
      }, 1000)
      this.setRichTextEditor()
    },
    setRichTextEditor() {
      const rte = this.editor.RichTextEditor
      rte.get('link').result = (rte) => {
        rte.insertHTML(`<a href="" data-selectme>${rte.selection()}</a>`)
        const sel = this?.editor?.getSelected()
        if (sel) {
          sel.trigger('disable')
          const toSel = sel.find('[data-selectme]')[0]
          if (toSel) {
            const attr = toSel.getAttributes()
            delete attr['data-selectme']
            toSel.setAttributes(attr)
            toSel.set('selectable', true)
            this.editor.select(toSel)
          }
        }
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
        .catch(() => {
          this.$store.dispatch('common/createSnackBar', {
            color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
            message: 'Error when getting details of uploaded file'
          })
        })
    },
    getCommentElementByComponent(component) {
      const parent = component?.parent?.()
      const children = parent?.components?.()
      if (children) {
        return children?.models?.find((el) => el?.attributes?.type === 'comment') || null
      }
      return null
    },
    getGrapesWebModalDraw(html) {
      this.editor.DomComponents.clear()
      const doc = new DOMParser().parseFromString(html, 'text/html')
      const docId = doc.body.id
      this.editor.setComponents(doc.children[0].outerHTML)
      this.editor.getWrapper().setStyle(doc.body.style.cssText)
      this.editor.getWrapper().addAttributes({
        id: docId
      })
      this.editor.on('load', () => {
        // this line for clicking style manager tabs
        let el
        el = document.querySelector('.gjs-blocks-cs .gjs-blocks-no-cat:last-child')
        if (el) {
          el.style.display = 'none'
        }
        el = document.querySelector('span[title="Fullscreen"]')
        if (el) {
          el.style.display = 'none'
        }
        el = document.querySelector('span[title="View code"]')
        if (el) {
          el.style.display = 'none'
        }
        document.querySelectorAll('.gjs-sm-sector-title').forEach((item) => item.click())
        try {
          document
            .querySelector('.gjs-pn-devices-c .gjs-pn-buttons .fa-desktop')
            .setAttribute('title', 'Desktop')
          document
            .querySelector('.gjs-pn-devices-c .gjs-pn-buttons .fa-tablet')
            .setAttribute('title', 'Tablet')
          document
            .querySelector('.gjs-pn-devices-c .gjs-pn-buttons .fa-mobile')
            .setAttribute('title', 'Mobile')
          document
            .querySelector('.gjs-pn-options .gjs-pn-buttons .fa-undo')
            .setAttribute('title', 'Undo')
          document
            .querySelector('.gjs-pn-options .gjs-pn-buttons .fa-repeat')
            .setAttribute('title', 'Repeat')
          document
            .querySelector('.gjs-pn-options .gjs-pn-buttons .fa-code')
            .setAttribute('title', 'Import')
          document
            .querySelector('.gjs-pn-options .gjs-pn-buttons .fa-trash')
            .setAttribute('title', 'Clear canvas')
        } catch (e) {}
        //removing default button
        const defaultButton = document.querySelector(
          '.gjs-block-categories .gjs-blocks-c div[title="Button"]'
        )
        if (defaultButton) {
          defaultButton.style.display = 'none'
        }
        this.addCustomProperties()
        this.addFonts()
        document.querySelector('.fa-code').addEventListener('click', () => {
          const editor = this.editor
          const html = editor.runCommand('get-html-juiced')
          let md = editor.Modal
          // Init code viewer if not yet instantiated
          let codeViewer = editor.CodeManager.getViewer('CodeMirror')
          let viewer
          let container = document.createElement('div')
          let btnImp = document.createElement('button')
          let btnCopyToClipboard = document.createElement('button')
          // Init import button
          btnImp.innerHTML = 'Import'
          btnImp.type = 'button'
          btnCopyToClipboard.innerHTML = 'Copy to clipboard'
          btnImp.className = 'gjs-btn-prim gjs-btn-import mt-2'
          btnCopyToClipboard.className = 'ml-2 gjs-btn-prim gjs-btn-import mt-2'
          btnImp.onclick = () => {
            editor.DomComponents.getWrapper().set('content', '')
            const code = codeViewer.editor.getValue()
            const callback = (importedCode = code) => {
              const doc = new DOMParser().parseFromString(importedCode, 'text/html')
              editor.setComponents(doc.children[0].outerHTML)
              editor.getWrapper().setStyle(doc.body.style.cssText)
              editor.Modal.close()
            }
            minifyHTML(code)
              .then((response) => {
                callback(response?.data?.data?.htmlContent || '')
              })
              .catch(() => callback(code))
          }
          btnCopyToClipboard.type = 'button'
          btnCopyToClipboard.onclick = () => {
            copyToClipboard(codeViewer.editor.getValue())
          }
          codeViewer.set({
            codeName: 'htmlmixed',
            readOnly: 0,
            theme: 'hopscotch'
          })
          let txtarea = document.createElement('textarea')
          container.appendChild(txtarea)
          container.appendChild(btnImp)
          container.appendChild(btnCopyToClipboard)
          codeViewer.init(txtarea)
          viewer = codeViewer.editor
          viewer.setOption('lineWrapping', 1)
          md.setContent('')
          md.setContent(container)
          codeViewer.setContent(html)
          viewer.refresh()
        })
        this.handleAssetUploadEvents()
      })
    },
    handleAssetUploadEvents() {
      this.editor.on('asset:upload:end', (images) => {
        if (images?.data?.[0]) {
          const url = images.data[0].src
          fetch(url)
            .then((res) => res.blob())
            .then((blob) => {
              const file = new File([blob], images.data[0].name, { type: blob.type })
              const formData = new FormData()
              formData.append('Files', file)
              uploadFiles(formData)
            })
        }
      })
      this.editor.on('asset:remove', (props) => {
        const { attributes } = props
        deleteFiles([attributes.resourceId])
      })
      this.editor.on('asset:open', () => {
        const assetManager = this.editor.AssetManager
        const container = assetManager.getContainer()
        const header = container.querySelector('.gjs-am-assets-header')
        const renderedSearchField = header.querySelector('form + input')
        if (renderedSearchField) {
          renderedSearchField.value = ''
          return
        }
        //this code means there is no search field
        header.appendChild(this.createImageAssetSearchField())
      })
    },
    createImageAssetSearchField() {
      const searchField = document.createElement('input')
      searchField.style.cssText =
        'background:#fff;outline:none;width:100%;border-radius:2px;margin-top:16px;margin-bottom:4px;padding:4px'
      searchField.setAttribute('placeholder', 'Search')
      searchField.addEventListener('input', (e) => {
        const { value } = e.target
        const assets = this.editor.AssetManager.getAll()
        this.renderAssetsToAssetsManager(
          assets.filter((asset) => {
            return asset.attributes.name.toLowerCase().includes(value.toLowerCase())
          })
        )
      })
      return searchField
    },
    getGrapesEditorContent() {
      const { editor } = this
      editor?.select(editor?.getWrapper())
      if (this.templateType === 'email') {
        try {
          return this.editor.Commands.run('get-html-juiced')
        } catch (e) {
          return ''
        }
      }
      //this is for the landing page
      const html = editor.getHtml()
      const css = editor.getCss()
      const htmlDOM = document.createElement('template')
      htmlDOM.innerHTML = html
      let head = htmlDOM.querySelector('head')
      let style = document.createElement('style')
      style.innerHTML = css
      const meta = document.createElement('meta')
      meta.httpEquiv = 'Content-Security-Policy'
      meta.content = 'upgrade-insecure-requests'
      if (head) {
        head.appendChild(style)
        head.appendChild(meta)
      } else {
        head = document.createElement('head')
        head.appendChild(style)
        head.appendChild(meta)
        const htmlElement = htmlDOM.querySelector('html')
        if (htmlElement) {
          let headOfHtmlElement = htmlElement.querySelector('head')
          if (headOfHtmlElement) {
            headOfHtmlElement.innerHTML = head.innerHTML
          }
          htmlElement.insertAdjacentElement('afterbegin', head)
        } else {
          const newHtmlDOM = document.createElement('html')
          newHtmlDOM.innerHTML = html?.trim().startsWith('<body') ? html : htmlDOM.innerHTML
          newHtmlDOM.insertAdjacentElement('afterbegin', head)
          return newHtmlDOM.outerHTML
        }
      }
      return htmlDOM.outerHTML
    }
  }
}
</script>
