/**
 * KSwiperBehaviorWeb - Behavior analysis slide web component
 * Equivalent to KSwiperBehavior.vue with tips and action handling
 */

class KSwiperBehaviorWeb extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.data = {}
  }

  static get observedAttributes() {
    return ['data', 'layout', 'theme']
  }

  connectedCallback() {
    this.classList.add('swiper-slide', 'k-swiper-slide', 'k-swiper-slide--behavior')
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
    return this.getAttribute('theme') || this.data.theme || 'primary'
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        ${this.getStyles()}
      </style>
      
      <div class="k-swiper-behavior k-swiper-behavior--${this.layout} k-swiper-behavior--${
      this.theme
    } ${this.data.actions && this.data.actions.length ? 'k-swiper-behavior--has-actions' : ''}">
        <div class="k-swiper-behavior__content">
          <!-- Header Section -->
          <div class="k-swiper-behavior__header">
            ${this.data.title ? `<h1 class="k-swiper-behavior__title">${this.data.title}</h1>` : ''}
            ${
              this.data.description
                ? `<p class="k-swiper-behavior__description">${this.data.description}</p>`
                : ''
            }
          </div>

          <!-- Behavior Tips Section -->
          ${this.data.tips && this.data.tips.length ? this.getTipsSection() : ''}

          <!-- Actions Section -->
          ${this.data.actions && this.data.actions.length ? this.getActionsSection() : ''}
        </div>
      </div>
    `

    this.setupEventListeners()
  }

  getTipsSection() {
    const tipsToShow = this.data.tips.slice(0, 3) // Show max 3 tips like Vue version
    return `
      <div class="k-swiper-behavior__tips">
        ${tipsToShow.map((tip, index) => this.getTipItem(tip, index)).join('')}
      </div>
    `
  }

  getTipItem(tip, index) {
    return `
      <div class="k-swiper-behavior__tip" data-tip-index="${index}">
        <div class="k-swiper-behavior__tip-content">
          <!-- Icon -->
          <div class="k-swiper-behavior__tip-icon">
            ${this.getTipIcon(tip)}
          </div>

          <!-- Text Content -->
          <div class="k-swiper-behavior__tip-text">
            <h3 class="k-swiper-behavior__tip-title">${tip.title}</h3>
            <p class="k-swiper-behavior__tip-description">${tip.description}</p>
          </div>
        </div>
      </div>
    `
  }

  getTipIcon(tip) {
    if (tip.iconPath) {
      return `<img src="${tip.iconPath}" alt="${tip.title}" class="k-swiper-behavior__tip-icon-image">`
    } else if (tip.icon) {
      return `<span class="k-swiper-behavior__tip-icon-text">${this.getIconText(tip.icon)}</span>`
    } else {
      return `<span class="k-swiper-behavior__tip-icon-text">ⓘ</span>`
    }
  }

  getIconText(icon) {
    // Convert MDI icons to text/emoji equivalents
    const iconMap = {
      'mdi-magnify': '🔍',
      'mdi-link-variant': '🔗',
      'mdi-clock-outline': '⏰',
      'mdi-lock': '🔒',
      'mdi-file-document-multiple': '📄',
      'mdi-refresh': '🔄',
      'mdi-information-outline': 'ⓘ'
    }
    return iconMap[icon] || '•'
  }

  getActionsSection() {
    return `
      <div class="k-swiper-behavior__actions">
        ${this.data.actions
          .map(
            (action, index) => `
          <button 
            class="k-swiper-behavior__action-button k-swiper-behavior__action-button--${
              action.type || 'primary'
            } ${action.disabled ? 'k-swiper-behavior__action-button--disabled' : ''}"
            data-action="${action.action}"
            data-action-index="${index}"
            ${action.disabled ? 'disabled' : ''}
          >
            ${action.text}
          </button>
        `
          )
          .join('')}
      </div>
    `
  }

  setupEventListeners() {
    // Action buttons
    this.shadowRoot.querySelectorAll('.k-swiper-behavior__action-button').forEach((button) => {
      button.addEventListener('click', (e) => {
        if (e.target.disabled) return

        const actionIndex = parseInt(e.target.getAttribute('data-action-index'))
        this.handleActionClick(this.data.actions[actionIndex])
      })
    })
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

      .k-swiper-behavior {
        display: flex;
        flex-direction: column;
        height: 100%;
        min-height: 400px;
        width: calc(100% - 64px);
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        border-radius: 16px;
        padding: 24px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
      }

      .k-swiper-behavior__content {
        display: flex;
        flex-direction: column;
        height: 100%;
        gap: 24px;
      }

      .k-swiper-behavior__header {
        text-align: left;
      }

      .k-swiper-behavior__title {
        font-size: 32px;
        font-weight: 700;
        color: #253858;
        font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, sans-serif;
        margin: 0 0 16px 0;
        line-height: 1.2;
      }

      .k-swiper-behavior__description {
        font-size: 16px;
        font-weight: 400;
        color: #253858;
        font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, sans-serif;
        line-height: 1.5;
        margin: 0;
      }

      .k-swiper-behavior__tips {
        display: grid;
        grid-template-columns: 1fr;
        gap: 20px;
        margin-top: 48px;
        flex: 1;
      }

      .k-swiper-behavior__tip {
        padding: 0 20px 20px 20px;
        border-left: 5px solid #0671C0;
        background: transparent;
        transition: all 0.3s ease;
      }

      .k-swiper-behavior__tip-content {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }

      .k-swiper-behavior__tip-icon {
        flex-shrink: 0;
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(6, 113, 192, 0.1);
        border-radius: 8px;
      }

      .k-swiper-behavior__tip-icon-image {
        width: 32px;
        height: 32px;
        object-fit: contain;
      }

      .k-swiper-behavior__tip-icon-text {
        font-size: 24px;
        color: #0671C0;
      }

      .k-swiper-behavior__tip-text {
        flex: 1;
      }

      .k-swiper-behavior__tip-title {
        font-size: 18px;
        font-weight: 600;
        color: #253858;
        font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, sans-serif;
        margin: 0 0 8px 0;
        line-height: 1.3;
      }

      .k-swiper-behavior__tip-description {
        font-size: 14px;
        font-weight: 400;
        color: #5A6C7D;
        font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, sans-serif;
        line-height: 1.4;
        margin: 0;
      }

      .k-swiper-behavior__actions {
        display: flex;
        gap: 12px;
        justify-content: center;
        flex-wrap: wrap;
        margin-top: auto;
      }

      .k-swiper-behavior__action-button {
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

      .k-swiper-behavior__action-button--primary {
        background: #0671C0;
        color: #ffffff;
      }

      .k-swiper-behavior__action-button--primary:hover:not(.k-swiper-behavior__action-button--disabled) {
        background: #055A9F;
        transform: translateY(-1px);
      }

      .k-swiper-behavior__action-button--secondary {
        background: transparent;
        color: #0671C0;
        border: 1px solid #0671C0;
      }

      .k-swiper-behavior__action-button--secondary:hover:not(.k-swiper-behavior__action-button--disabled) {
        background: #0671C0;
        color: #ffffff;
      }

      .k-swiper-behavior__action-button--disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      /* Theme Variations */
      .k-swiper-behavior--primary .k-swiper-behavior__tip-icon {
        background: rgba(6, 113, 192, 0.1);
      }

      .k-swiper-behavior--success .k-swiper-behavior__tip-icon {
        background: rgba(76, 175, 80, 0.1);
      }

      .k-swiper-behavior--success .k-swiper-behavior__tip:hover {
        border-color: #4CAF50;
        background: #F8FFF8;
      }

      .k-swiper-behavior--warning .k-swiper-behavior__tip-icon {
        background: rgba(255, 152, 0, 0.1);
      }

      .k-swiper-behavior--warning .k-swiper-behavior__tip:hover {
        border-color: #FF9800;
        background: #FFFBF5;
      }

      /* Mobile Responsive */
      @media (max-width: 768px) {
        .k-swiper-behavior {
          width: 100%;
          padding: 16px;
          min-height: 300px;
        }

        .k-swiper-behavior__title {
          font-size: 24px;
          margin-bottom: 12px;
        }

        .k-swiper-behavior__description {
          font-size: 14px;
        }

        .k-swiper-behavior__tips {
          gap: 16px;
        }

        .k-swiper-behavior__tip {
          padding: 16px;
        }

        .k-swiper-behavior__tip-content {
          gap: 12px;
        }

        .k-swiper-behavior__tip-icon {
          width: 40px;
          height: 40px;
        }

        .k-swiper-behavior__tip-icon-text {
          font-size: 20px;
        }

        .k-swiper-behavior__tip-title {
          font-size: 16px;
          margin-bottom: 6px;
        }

        .k-swiper-behavior__tip-description {
          font-size: 13px;
        }

        .k-swiper-behavior__action-button {
          padding: 10px 20px;
          font-size: 13px;
        }
      }

      /* Tablet Responsive */
      @media (min-width: 769px) and (max-width: 1023px) {
        .k-swiper-behavior {
          width: 100%;
          padding: 20px;
        }

        .k-swiper-behavior__title {
          font-size: 28px;
        }

        .k-swiper-behavior__tips {
          grid-template-columns: 1fr;
          gap: 18px;
        }
      }

      /* Large screen optimization */
      @media (min-width: 1024px) {
        .k-swiper-behavior {
          width: calc(100% - 64px);
          
          .k-swiper-behavior__tips {
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          }
        }
      }

      /* Animation */
      @keyframes slideInLeft {
        from {
          opacity: 0;
          transform: translateX(-20px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      .k-swiper-behavior__tip {
        animation: slideInLeft 0.6s ease forwards;
      }

      .k-swiper-behavior__tip:nth-child(1) { animation-delay: 0.1s; }
      .k-swiper-behavior__tip:nth-child(2) { animation-delay: 0.2s; }
      .k-swiper-behavior__tip:nth-child(3) { animation-delay: 0.3s; }
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
customElements.define('k-swiper-behavior-web', KSwiperBehaviorWeb)
