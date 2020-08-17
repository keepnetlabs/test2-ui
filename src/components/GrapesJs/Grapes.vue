<template>
  <div class="grapes-container">
    <div class="panel__top">
      <div class="panel__basic-actions"></div>
    </div>
    <div id="gjs">
      <h1>Grapes Deneme</h1>
    </div>
    <div id="blocks"></div>
  </div>
</template>

<script>
import grapesjs from 'grapesjs'

export default {
  name: 'Grapes',
  components: grapesjs,
  mounted() {
    const editor = grapesjs.init({
      // Indicate where to init the editor. You can also pass an HTMLElement
      container: '#gjs',
      // Get the content for the canvas directly from the element
      // As an alternative we could use: `components: '<h1>Hello World Component!</h1>'`,
      fromElement: true,
      // Size of the editor
      height: '300px',
      width: 'auto',
      // Disable the storage manager for the moment
      storageManager: false,
      // Avoid any default panel
      panels: { defaults: [] },
      blockManager: {
        appendTo: '#blocks',
        blocks: [
          {
            id: 'section', // id is mandatory
            label: '<b>Section</b>', // You can use HTML/SVG inside labels
            attributes: { class: 'gjs-block-section' },
            content: `<section>
          <h1>This is a simple title</h1>
          <div>This is just a Lorem text: Lorem ipsum dolor sit amet</div>
        </section>`
          },
          {
            id: 'text',
            label: 'Text',
            content: '<div data-gjs-type="text">Insert your text here</div>'
          },
          {
            id: 'image',
            label: 'Image',
            // Select the component once it's dropped
            select: true,
            // You can pass components as a JSON instead of a simple HTML string,
            // in this case we also use a defined component type `image`
            content: { type: 'image' },
            // This triggers `active` event on dropped components and the `image`
            // reacts by opening the AssetManager
            activate: true
          }
        ]
      }
    })
    editor.BlockManager.add('my-block-id', {
      label: 'asd',
      category: 'fff',
      content: {
        tagName: 'div',
        draggable: true,
        attributes: { 'some-attribute': 'some-value' },
        components: [
          {
            tagName: 'span',
            content: '<b>Content burya span ici</b>'
          },
          {
            tagName: 'div',
            // use `content` for static strings, `components` string will be parsed
            // and transformed in Components
            components: '<span>Buraya ise component</span>'
          }
        ]
      }
    })
    editor.Panels.addPanel({
      id: 'panel-top',
      el: '.panel__top'
    })
    editor.Panels.addPanel({
      id: 'basic-actions',
      el: '.panel__basic-actions',
      buttons: [
        {
          id: 'visibility',
          active: true, // active by default
          className: 'btn-toggle-borders',
          label: '<u>B</u>',
          command: 'sw-visibility' // Built-in command
        },
        {
          id: 'export',
          className: 'btn-open-export',
          label: 'Exp',
          command: 'export-template',
          context: 'export-template' // For grouping context of buttons from the same panel
        },
        {
          id: 'show-json',
          className: 'btn-show-json',
          label: 'JSON',
          context: 'show-json',
          command(editor) {
            editor.Modal.setTitle('Components JSON')
              .setContent(
                `<textarea style="width:100%; height: 250px;">
            ${JSON.stringify(editor.getComponents())}
          </textarea>`
              )
              .open()
          }
        }
      ]
    })
    editor.on('run:export-template:before', (opts) => {
      console.log('Before the command run')
      if (0 /* some condition */) {
        opts.abort = 1
      }
    })
    editor.on('run:export-template', () => console.log('After the command run'))
    editor.on('abort:export-template', () => console.log('Command aborted'))
  }
}
</script>

<style lang="scss">
.grapes-container {
  #gjs {
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
  .panel__top {
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
