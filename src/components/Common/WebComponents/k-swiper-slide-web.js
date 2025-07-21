/**
 * KSwiperSlideWeb - Basic slide wrapper web component
 * Provides slide-specific functionality and styling
 */

class KSwiperSlideWeb extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  static get observedAttributes() {
    return ['type', 'centered', 'background']
  }

  connectedCallback() {
    this.classList.add('swiper-slide')
    this.render()
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render()
    }
  }

  get type() {
    return this.getAttribute('type') || 'default'
  }
  get centered() {
    return this.getAttribute('centered') === 'true'
  }
  get background() {
    return this.getAttribute('background') || ''
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        ${this.getStyles()}
      </style>
      
      <div class="k-swiper-slide" data-type="${this.type}">
        <div class="k-slide-content">
          <slot></slot>
        </div>
      </div>
    `
  }

  getStyles() {
    return `
      :host {
        display: flex;
        width: 100%;
        height: 100%;
      }

      .k-swiper-slide {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        position: relative;
        ${this.background ? `background: ${this.background};` : ''}
      }

      .k-slide-content {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        ${
          this.centered
            ? `
          align-items: center;
          justify-content: center;
          text-align: center;
        `
            : ''
        }
      }

      /* Type-specific styles */
      .k-swiper-slide[data-type="html"] .k-slide-content {
        padding: 20px;
      }

      .k-swiper-slide[data-type="video"] .k-slide-content {
        padding: 0;
        background: #000;
      }

      .k-swiper-slide[data-type="quiz"] .k-slide-content {
        padding: 30px;
        background: #f8f9fa;
      }

      .k-swiper-slide[data-type="fullscreen"] .k-slide-content {
        padding: 0;
        height: 100vh;
      }

      /* Mobile Responsive */
      @media (max-width: 768px) {
        .k-slide-content {
          padding: 15px !important;
        }
      }
    `
  }
}

// Register the custom element
customElements.define('k-swiper-slide-web', KSwiperSlideWeb)
