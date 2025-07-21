/**
 * KSwiperEducationWeb - Education slide web component
 * Equivalent to KSwiperEducation.vue with phishing email and red flag tracking
 */

class KSwiperEducationWeb extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.data = {}
    this.reviewedFlags = new Set()
  }

  static get observedAttributes() {
    return ['data', 'layout', 'theme']
  }

  connectedCallback() {
    this.classList.add('swiper-slide', 'k-swiper-slide', 'k-swiper-slide--education')
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
    return this.getAttribute('layout') || this.data.layout || 'default'
  }
  get theme() {
    return this.getAttribute('theme') || this.data.theme || 'phishing'
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        ${this.getStyles()}
      </style>
      
      <div class="k-swiper-education k-swiper-education--${this.layout} k-swiper-education--${
      this.theme
    } ${this.data.htmlContent ? 'k-swiper-education--has-html' : ''}">
        <div class="k-swiper-education__content">
          <!-- Header Section -->
          <div class="k-swiper-education__header">
            ${
              this.data.title ? `<h1 class="k-swiper-education__title">${this.data.title}</h1>` : ''
            }
            ${
              this.data.description
                ? `<p class="k-swiper-education__description">${this.data.description}</p>`
                : ''
            }
          </div>

          <!-- Main Content Section -->
          <div class="k-swiper-education__main-content">
            ${this.data.fields && this.data.fields.length ? this.getFieldsSection() : ''}
            ${
              this.data.fields && this.data.fields.length && this.data.htmlContent
                ? '<div class="k-swiper-education__separator"></div>'
                : ''
            }
            ${this.data.htmlContent ? this.getHtmlContent() : ''}
          </div>

          ${this.data.actions && this.data.actions.length ? this.getActionsSection() : ''}

          <!-- Footer Info -->
          <div class="k-swiper-education__footer">
            ${this.data.isShowRedFlags ? this.getRedFlagsProgress() : ''}
          </div>
        </div>
      </div>
    `

    this.setupEventListeners()
  }

  getFieldsSection() {
    return `
      <div class="k-swiper-education__fields">
        ${this.data.fields.map((field, index) => this.getFieldItem(field, index)).join('')}
      </div>
    `
  }

  getFieldItem(field, index) {
    if (field.tooltip) {
      return `
        <div class="k-swiper-education__field" data-field-index="${index}">
          <div class="k-swiper-education__field-content" data-flagged-area data-field="${field.key}" data-tooltip="${field.tooltip}">
            <span class="k-swiper-education__field-icon">
              <img src="https://imagedelivery.net/KxWh-mxPGDbsqJB3c5_fmA/506bf119-942d-4224-7ab1-98292e2e3900/public" 
                   alt="Red Flag" class="k-swiper-education__field-icon-image">
            </span>
            <span class="k-swiper-education__field-key">${field.key}:</span>
            <span class="k-swiper-education__field-value">${field.value}</span>
          </div>
          <div class="k-swiper-education__field-tooltip">${field.tooltip}</div>
        </div>
      `
    } else {
      return `
        <div class="k-swiper-education__field" data-field-index="${index}">
          <div class="k-swiper-education__field-content">
            <span class="k-swiper-education__field-key">${field.key}:</span>
            <span class="k-swiper-education__field-value">${field.value}</span>
          </div>
        </div>
      `
    }
  }

  getHtmlContent() {
    return `
      <div class="k-swiper-education__html-content">
        <div class="k-swiper-education__html-wrapper">${this.data.htmlContent}</div>
      </div>
    `
  }

  getActionsSection() {
    return `
      <div class="k-swiper-education__actions">
        ${this.data.actions
          .map(
            (action, index) => `
          <button 
            class="k-swiper-education__action-button k-swiper-education__action-button--${
              action.variant || 'primary'
            }"
            data-action="${action.action}"
            data-action-index="${index}"
          >
            ${action.text}
          </button>
        `
          )
          .join('')}
      </div>
    `
  }

  getRedFlagsProgress() {
    return `
      <div class="k-swiper-education__red-flags">
        <span class="k-swiper-education__red-flags-text">
          Red Flags Reviewed: (<span id="reviewedCount">${this.data.redFlagsReviewed || 0}</span>/${
      this.data.totalRedFlags || 0
    })
        </span>
      </div>
    `
  }

  setupEventListeners() {
    // Red flag hover tracking for fields
    this.shadowRoot.querySelectorAll('[data-flagged-area]').forEach((area) => {
      const tooltip = area.parentElement.querySelector('.k-swiper-education__field-tooltip')

      area.addEventListener('mouseenter', (e) => {
        const flagId = e.target.getAttribute('data-field')
        if (flagId && !this.reviewedFlags.has(flagId)) {
          this.reviewedFlags.add(flagId)
          this.updateRedFlagProgress()
        }

        if (tooltip) {
          tooltip.style.display = 'block'
        }
      })

      area.addEventListener('mouseleave', () => {
        if (tooltip) {
          tooltip.style.display = 'none'
        }
      })
    })

    // Red flag hover tracking for HTML content
    this.shadowRoot.querySelectorAll('.flagged-area').forEach((area) => {
      area.addEventListener('mouseenter', (e) => {
        const flagId = e.target.getAttribute('data-field')
        if (flagId && !this.reviewedFlags.has(flagId)) {
          this.reviewedFlags.add(flagId)
          this.updateRedFlagProgress()
        }
      })
    })

    // Action buttons
    this.shadowRoot.querySelectorAll('.k-swiper-education__action-button').forEach((button) => {
      button.addEventListener('click', (e) => {
        const action = e.target.getAttribute('data-action')
        const actionIndex = parseInt(e.target.getAttribute('data-action-index'))
        this.handleActionClick(this.data.actions[actionIndex])
      })
    })
  }

  updateRedFlagProgress() {
    const reviewedCountEl = this.shadowRoot.getElementById('reviewedCount')
    if (reviewedCountEl) {
      reviewedCountEl.textContent = this.reviewedFlags.size
    }

    // Update data
    if (this.data.redFlagsReviewed !== undefined) {
      this.data.redFlagsReviewed = this.reviewedFlags.size
    }

    // Dispatch progress event
    this.dispatchEvent(
      new CustomEvent('red-flag-progress', {
        detail: {
          reviewed: this.reviewedFlags.size,
          total: this.data.totalRedFlags || 0,
          reviewedFlags: Array.from(this.reviewedFlags)
        },
        bubbles: true
      })
    )
  }

  handleActionClick(action) {
    if (!action) return

    // Swiper navigation
    if (action.action === 'next_slide') {
      const swiperParent = this.closest('k-swiper-web')
      if (swiperParent) {
        swiperParent.slideNext()
      }
    } else if (action.action === 'prev_slide') {
      const swiperParent = this.closest('k-swiper-web')
      if (swiperParent) {
        swiperParent.slidePrev()
      }
    }

    // Dispatch custom event
    this.dispatchEvent(
      new CustomEvent('action', {
        detail: {
          type: action.action,
          data: action
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

      .k-swiper-education {
        display: flex;
        flex-direction: column;
        height: 100%;
        min-height: 400px;
        width: calc(100% - 64px);
        background: linear-gradient(135deg, #fff5f5 0%, #fee);
        border-radius: 16px;
        padding: 32px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
      }

      .k-swiper-education__content {
        display: flex;
        flex-direction: column;
        height: 100%;
        gap: 24px;
      }

      .k-swiper-education__header {
        text-align: center;
      }

      .k-swiper-education__title {
        font-size: 32px;
        font-weight: 700;
        color: #253858;
        font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, sans-serif;
        margin: 0 0 16px 0;
        line-height: 1.2;
      }

      .k-swiper-education__description {
        font-size: 16px;
        font-weight: 400;
        color: #5A6C7D;
        font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, sans-serif;
        line-height: 1.5;
        margin: 0;
      }

      .k-swiper-education__main-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 24px;
      }

      .k-swiper-education__fields {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .k-swiper-education__field {
        position: relative;
      }

      .k-swiper-education__field-content {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
        background: #fff;
        border-radius: 8px;
        border: 2px solid transparent;
        transition: all 0.3s ease;
        cursor: pointer;
      }

      .k-swiper-education__field-content[data-flagged-area] {
        border-color: #e00;
        background: #ffeaea;
      }

      .k-swiper-education__field-content[data-flagged-area]:hover {
        border-color: #c00;
        background: #ffdddd;
      }

      .k-swiper-education__field-icon {
        flex-shrink: 0;
      }

      .k-swiper-education__field-icon-image {
        width: 20px;
        height: 20px;
      }

      .k-swiper-education__field-key {
        font-weight: 600;
        color: #253858;
        font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      }

      .k-swiper-education__field-value {
        color: #5A6C7D;
        font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      }

      .k-swiper-education__field-tooltip {
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        margin-top: 8px;
        padding: 12px 16px;
        background: #B83A3A;
        color: #fff;
        font-size: 12px;
        line-height: 1.4;
        border-radius: 4px;
        white-space: normal;
        word-break: break-word;
        min-width: 240px;
        max-width: 300px;
        z-index: 1000;
        display: none;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      .k-swiper-education__field-tooltip::before {
        content: '';
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        border: 6px solid transparent;
        border-bottom-color: #B83A3A;
      }

      .k-swiper-education__separator {
        height: 1px;
        background: linear-gradient(90deg, transparent, #ddd, transparent);
        margin: 16px 0;
      }

      .k-swiper-education__html-content {
        flex: 1;
        overflow: auto;
      }

      .k-swiper-education__html-wrapper {
        background: #fff;
        border-radius: 8px;
        padding: 20px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      /* Red flag styles for HTML content */
      .k-swiper-education__html-wrapper .flagged-area {
        position: relative;
        display: inline-block;
        border: 1px solid #e00;
        border-radius: 4px;
        padding: 0.2em 0.6em 0.2em 2em;
        margin: 0 0.1em;
        cursor: pointer;
      }

      .k-swiper-education__html-wrapper .flagged-area::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 0.5em;
        width: 1em;
        height: 1em;
        transform: translateY(-50%);
        background: url('https://imagedelivery.net/KxWh-mxPGDbsqJB3c5_fmA/506bf119-942d-4224-7ab1-98292e2e3900/public') no-repeat center/contain;
      }

      .k-swiper-education__html-wrapper .flagged-area:hover::after {
        content: attr(data-flag-tooltip);
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translate(-50%, 0);
        margin-top: 0.3em;
        padding: 0.4em 0.6em;
        background: #B83A3A;
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: 16px;
        color: #fff;
        white-space: normal;
        word-break: break-word;
        min-width: 240px;
        border-radius: 4px;
        z-index: 1000;
      }

      .k-swiper-education__actions {
        display: flex;
        gap: 16px;
        justify-content: center;
        flex-wrap: wrap;
      }

      .k-swiper-education__action-button {
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
        font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, sans-serif;
        border: none;
        cursor: pointer;
        transition: all 0.3s ease;
        outline: none;
      }

      .k-swiper-education__action-button--primary {
        background: #0671C0;
        color: #ffffff;
      }

      .k-swiper-education__action-button--primary:hover {
        background: #055A9F;
        transform: translateY(-1px);
      }

      .k-swiper-education__action-button--secondary {
        background: transparent;
        color: #0671C0;
        border: 1px solid #0671C0;
      }

      .k-swiper-education__action-button--secondary:hover {
        background: #0671C0;
        color: #ffffff;
      }

      .k-swiper-education__footer {
        border-top: 1px solid rgba(0, 0, 0, 0.1);
        padding-top: 16px;
        text-align: center;
      }

      .k-swiper-education__red-flags-text {
        font-size: 14px;
        color: #5A6C7D;
        font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      }

      /* Theme Variations */
      .k-swiper-education--phishing {
        background: linear-gradient(135deg, #fff5f5 0%, #fee);
      }

      .k-swiper-education--security {
        background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe);
      }

      .k-swiper-education--warning {
        background: linear-gradient(135deg, #fffbeb 0%, #fef3c7);
      }

      /* Mobile Responsive */
      @media (max-width: 768px) {
        .k-swiper-education {
          width: 100%;
          padding: 20px;
          min-height: 350px;
        }

        .k-swiper-education__title {
          font-size: 24px;
        }

        .k-swiper-education__content {
          gap: 20px;
        }

        .k-swiper-education__field-content {
          flex-direction: column;
          align-items: flex-start;
          gap: 8px;
        }

        .k-swiper-education__field-tooltip {
          min-width: 200px;
          max-width: 250px;
          font-size: 11px;
        }

        .k-swiper-education__actions {
          flex-direction: column;
        }
      }

      /* Tablet Responsive */
      @media (min-width: 769px) and (max-width: 1023px) {
        .k-swiper-education {
          width: 100%;
          padding: 28px;
        }

        .k-swiper-education__title {
          font-size: 28px;
        }
      }

      /* Large screen optimization */
      @media (min-width: 1024px) {
        .k-swiper-education {
          width: calc(100% - 64px);
        }
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

  // Get reviewed flags
  getReviewedFlags() {
    return Array.from(this.reviewedFlags)
  }

  // Reset reviewed flags
  resetReviewedFlags() {
    this.reviewedFlags.clear()
    this.updateRedFlagProgress()
  }
}

// Register the custom element
customElements.define('k-swiper-education-web', KSwiperEducationWeb)
