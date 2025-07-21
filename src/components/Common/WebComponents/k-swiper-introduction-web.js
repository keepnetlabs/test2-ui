/**
 * KSwiperIntroductionWeb - Introduction slide web component
 * Equivalent to KSwiperIntroduction.vue with all features
 */

class KSwiperIntroductionWeb extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.data = {}
  }

  static get observedAttributes() {
    return ['data', 'layout', 'theme']
  }

  connectedCallback() {
    this.classList.add('swiper-slide', 'k-swiper-slide', 'k-swiper-slide--introduction')
    this.parseData()
    this.render()
    this.setupEventListeners()
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      if (name === 'data') {
        this.parseData()
      }
      this.render()
    }
  }

  parseData() {
    const dataAttr = this.getAttribute('data')
    try {
      this.data = dataAttr ? JSON.parse(dataAttr) : {}
    } catch (error) {
      console.error('Invalid JSON in data attribute:', error)
      this.data = {}
    }
  }

  get layout() {
    return this.getAttribute('layout') || this.data.layout || 'split'
  }
  get theme() {
    return this.getAttribute('theme') || this.data.theme || 'default'
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        ${this.getStyles()}
      </style>
      
      <div class="k-swiper-introduction k-swiper-introduction--${
        this.layout
      } k-swiper-introduction--${this.theme} ${
      this.data.illustration ? 'k-swiper-introduction--has-illustration' : ''
    }">
        <div class="k-swiper-introduction__content">
          <div class="k-swiper-introduction__text">
            ${
              this.data.title
                ? `<h1 class="k-swiper-introduction__title">${this.data.title}</h1>`
                : ''
            }
            
            <div class="k-swiper-introduction__body">
              ${this.getContentParagraphs()}
            </div>

            ${this.data.button ? this.getActionButton() : ''}
          </div>

          ${this.data.illustration ? this.getIllustration() : ''}
        </div>
      </div>
    `

    this.setupEventListeners()
  }

  getContentParagraphs() {
    if (!this.data.content) return ''

    const contentArray = Array.isArray(this.data.content) ? this.data.content : [this.data.content]
    return contentArray
      .map((paragraph) => `<p class="k-swiper-introduction__paragraph">${paragraph}</p>`)
      .join('')
  }

  getActionButton() {
    const button = this.data.button
    const variant = button.variant || 'primary'

    return `
      <div class="k-swiper-introduction__actions">
        <button 
          class="k-swiper-introduction__button k-swiper-introduction__button--${variant}"
          id="actionButton"
          ${button.tooltip ? `data-tooltip="${button.tooltip}"` : ''}
        >
          ${button.text}
        </button>
        ${
          button.tooltip
            ? `
          <div class="k-swiper-introduction__tooltip" id="tooltip">
            ${button.tooltip}
          </div>
        `
            : ''
        }
      </div>
    `
  }

  getIllustration() {
    const illustration = this.data.illustration
    return `
      <div class="k-swiper-introduction__illustration">
        <img
          src="${illustration.url}"
          alt="${illustration.alt || 'Illustration'}"
          class="k-swiper-introduction__image"
          loading="lazy"
        />
      </div>
    `
  }

  setupEventListeners() {
    const actionButton = this.shadowRoot.getElementById('actionButton')
    if (actionButton) {
      actionButton.addEventListener('click', () => this.handleButtonClick())

      // Tooltip handling
      const tooltip = this.shadowRoot.getElementById('tooltip')
      if (tooltip) {
        actionButton.addEventListener('mouseenter', () => {
          tooltip.style.display = 'block'
        })
        actionButton.addEventListener('mouseleave', () => {
          tooltip.style.display = 'none'
        })
      }
    }
  }

  handleButtonClick() {
    const button = this.data.button
    if (!button) return

    // Swiper navigation
    if (button.action === 'next_slide') {
      const swiperParent = this.closest('k-swiper-web')
      if (swiperParent) {
        swiperParent.slideNext()
      }
    }

    // Dispatch custom event
    this.dispatchEvent(
      new CustomEvent('action', {
        detail: {
          type: button.action,
          data: this.data
        },
        bubbles: true
      })
    )
  }

  getStyles() {
    return `
      :host {
        display: flex;
        width: 100%;
        height: 100%;
      }

      .k-swiper-introduction {
        display: flex;
        flex-direction: column;
        height: 100%;
        min-height: 400px;
        width: calc(100% - 64px);
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        border-radius: 16px;
        padding: 32px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
        position: relative;
      }

      .k-swiper-introduction__content {
        display: flex;
        height: 100%;
        gap: 40px;
        align-items: center;
      }

      .k-swiper-introduction__text {
        flex: 1;
        display: flex;
        flex-direction: column;
      }

      .k-swiper-introduction__title {
        font-size: 32px;
        font-weight: 700;
        color: #253858;
        font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, sans-serif;
        margin: 0 0 24px 0;
        line-height: 1.2;
      }

      .k-swiper-introduction__body {
        margin-bottom: 32px;
      }

      .k-swiper-introduction__paragraph {
        font-size: 16px;
        font-weight: 400;
        color: #5A6C7D;
        font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, sans-serif;
        line-height: 1.6;
        margin: 0 0 16px 0;
      }

      .k-swiper-introduction__paragraph:last-child {
        margin-bottom: 0;
      }

      .k-swiper-introduction__actions {
        position: relative;
      }

      .k-swiper-introduction__button {
        background: #0671C0;
        color: #ffffff;
        border: none;
        padding: 16px 32px;
        border-radius: 8px;
        font-size: 16px;
        font-weight: 600;
        font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, sans-serif;
        cursor: pointer;
        transition: all 0.3s ease;
        outline: none;
      }

      .k-swiper-introduction__button:hover {
        background: #055A9F;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(6, 113, 192, 0.3);
      }

      .k-swiper-introduction__button--primary {
        background: #0671C0;
      }

      .k-swiper-introduction__button--secondary {
        background: transparent;
        color: #0671C0;
        border: 2px solid #0671C0;
      }

      .k-swiper-introduction__button--secondary:hover {
        background: #0671C0;
        color: #ffffff;
      }

      .k-swiper-introduction__tooltip {
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        margin-bottom: 8px;
        padding: 12px 16px;
        background: #0671C0;
        color: #ffffff;
        font-size: 14px;
        line-height: 1.4;
        border-radius: 8px;
        white-space: nowrap;
        max-width: 320px;
        white-space: normal;
        display: none;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      .k-swiper-introduction__tooltip::after {
        content: '';
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        border: 6px solid transparent;
        border-top-color: #0671C0;
      }

      .k-swiper-introduction__illustration {
        flex: 0 0 300px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .k-swiper-introduction__image {
        max-width: 100%;
        height: auto;
        border-radius: 8px;
      }

      /* Layout Variations */
      .k-swiper-introduction--split .k-swiper-introduction__content {
        flex-direction: row;
      }

      .k-swiper-introduction--center .k-swiper-introduction__content {
        flex-direction: column;
        text-align: center;
      }

      .k-swiper-introduction--center .k-swiper-introduction__illustration {
        flex: 0 0 auto;
        margin-bottom: 32px;
      }

      /* Theme Variations */
      .k-swiper-introduction--primary {
        background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
      }

      .k-swiper-introduction--success {
        background: linear-gradient(135deg, #f1f8e9 0%, #dcedc8 100%);
      }

      .k-swiper-introduction--warning {
        background: linear-gradient(135deg, #fff8e1 0%, #ffecb3 100%);
      }

      /* Mobile Responsive */
      @media (max-width: 768px) {
        .k-swiper-introduction {
          width: 100%;
          padding: 20px;
          min-height: 300px;
        }

        .k-swiper-introduction__content {
          flex-direction: column;
          gap: 24px;
          text-align: center;
        }

        .k-swiper-introduction__title {
          font-size: 24px;
          margin-bottom: 16px;
        }

        .k-swiper-introduction__paragraph {
          font-size: 15px;
        }

        .k-swiper-introduction__illustration {
          flex: 0 0 auto;
          order: -1;
        }

        .k-swiper-introduction__image {
          max-width: 200px;
        }

        .k-swiper-introduction__button {
          padding: 14px 28px;
          font-size: 15px;
        }

        .k-swiper-introduction__tooltip {
          max-width: 280px;
          font-size: 13px;
        }
      }

      /* Tablet Responsive */
      @media (min-width: 769px) and (max-width: 1023px) {
        .k-swiper-introduction {
          width: 100%;
          padding: 28px;
        }

        .k-swiper-introduction__content {
          gap: 32px;
        }

        .k-swiper-introduction__title {
          font-size: 28px;
        }

        .k-swiper-introduction__illustration {
          flex: 0 0 250px;
        }
      }

      /* Large screen optimization */
      @media (min-width: 1024px) {
        .k-swiper-introduction {
          width: calc(100% - 64px);
        }
      }

      /* Animation */
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .k-swiper-introduction__title,
      .k-swiper-introduction__paragraph,
      .k-swiper-introduction__button {
        animation: fadeInUp 0.6s ease forwards;
      }

      .k-swiper-introduction__title {
        animation-delay: 0.1s;
      }

      .k-swiper-introduction__paragraph {
        animation-delay: 0.2s;
      }

      .k-swiper-introduction__button {
        animation-delay: 0.3s;
      }
    `
  }

  // Public API for data updates
  updateData(newData) {
    this.data = { ...this.data, ...newData }
    this.setAttribute('data', JSON.stringify(this.data))
    this.render()
  }

  // Get current data
  getData() {
    return { ...this.data }
  }
}

// Register the custom element
customElements.define('k-swiper-introduction-web', KSwiperIntroductionWeb)
