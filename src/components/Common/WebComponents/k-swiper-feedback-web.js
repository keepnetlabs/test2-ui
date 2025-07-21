/**
 * KSwiperFeedbackWeb - Feedback slide web component
 * Equivalent to KSwiperFeedback.vue with star rating and native textarea
 */

class KSwiperFeedbackWeb extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.data = {}
    this.rating = 0
    this.hoverRating = 0
    this.feedbackText = ''
    this.isSubmitting = false
    this.isFocused = false
  }

  static get observedAttributes() {
    return ['data', 'layout', 'theme']
  }

  connectedCallback() {
    this.classList.add('swiper-slide', 'k-swiper-slide', 'k-swiper-slide--feedback')
    this.parseData()
    this.initializeState()
    this.render()
    this.setupEventListeners()
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      if (name === 'data') {
        this.parseData()
        this.initializeState()
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

  initializeState() {
    this.rating = this.data.initialRating || 0
    this.feedbackText = this.data.initialText || ''
  }

  get layout() {
    return this.getAttribute('layout') || this.data.layout || 'default'
  }
  get theme() {
    return this.getAttribute('theme') || this.data.theme || 'primary'
  }

  get computedPlaceholder() {
    const placeholder =
      this.data.placeholder || 'Tell us what was helpful or what can be improved...'
    if (this.data.userName) {
      return `${this.data.userName}, ${placeholder.toLowerCase()}`
    }
    return placeholder
  }

  get hasTextError() {
    if (this.data.requireText && !this.feedbackText.trim()) {
      return true
    }

    if (this.data.minTextLength > 0 && this.feedbackText.trim().length < this.data.minTextLength) {
      return true
    }

    return false
  }

  get textErrorMessage() {
    if (this.data.requireText && !this.feedbackText.trim()) {
      return 'Feedback text is required'
    }

    if (this.data.minTextLength > 0 && this.feedbackText.trim().length < this.data.minTextLength) {
      return `Minimum ${this.data.minTextLength} characters required`
    }

    return ''
  }

  get isValid() {
    const ratingValid = this.data.requireRating !== false ? this.rating > 0 : true
    const textValid = !this.hasTextError

    return ratingValid && textValid
  }

  get feedbackData() {
    return {
      rating: this.rating,
      text: this.feedbackText ? this.feedbackText.trim() : '',
      timestamp: new Date().toISOString()
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        ${this.getStyles()}
      </style>
      
      <div class="k-swiper-feedback k-swiper-feedback--${this.layout} k-swiper-feedback--${
      this.theme
    } ${this.data.actions && this.data.actions.length ? 'k-swiper-feedback--has-actions' : ''}">
        <div class="k-swiper-feedback__content">
          <!-- Header Section -->
          <div class="k-swiper-feedback__header">
            ${this.data.title ? `<h1 class="k-swiper-feedback__title">${this.data.title}</h1>` : ''}
          </div>

          <!-- Star Rating Section -->
          <div class="k-swiper-feedback__rating">
            <div class="k-swiper-feedback__stars">
              ${this.getStarsHtml()}
            </div>
          </div>

          <!-- Feedback Text Section -->
          <div class="k-swiper-feedback__input">
            <div class="k-swiper-feedback__textarea-wrapper">
              <textarea
                id="feedbackTextarea"
                placeholder="${this.computedPlaceholder}"
                rows="${this.data.rows || 4}"
                maxlength="${this.data.maxLength || 500}"
                class="k-swiper-feedback__textarea ${
                  this.hasTextError ? 'k-swiper-feedback__textarea--error' : ''
                }"
              >${this.feedbackText}</textarea>

              <!-- Character Counter -->
              ${
                this.data.maxLength
                  ? `
                <div class="k-swiper-feedback__counter">
                  <span id="characterCount">${this.feedbackText.length}</span>/${this.data.maxLength}
                </div>
              `
                  : ''
              }

              <!-- Error Message -->
              ${
                this.hasTextError
                  ? `
                <div class="k-swiper-feedback__error">
                  ${this.textErrorMessage}
                </div>
              `
                  : ''
              }
            </div>
          </div>

          <!-- Actions Section -->
          ${this.data.actions && this.data.actions.length ? this.getActionsSection() : ''}
        </div>
      </div>
    `

    this.setupEventListeners()
  }

  getStarsHtml() {
    let starsHtml = ''
    for (let star = 1; star <= 5; star++) {
      const isActive = star <= this.rating
      const isHover = star <= this.hoverRating
      const starClass = `k-swiper-feedback__star ${
        isActive || isHover ? 'k-swiper-feedback__star--active' : ''
      }`

      starsHtml += `
        <button 
          class="${starClass}"
          data-star="${star}"
          aria-label="Rate ${star} ${star === 1 ? 'star' : 'stars'}"
          type="button"
        >
          ${isActive || isHover ? '★' : '☆'}
        </button>
      `
    }
    return starsHtml
  }

  getActionsSection() {
    return `
      <div class="k-swiper-feedback__actions">
        ${this.data.actions
          .map(
            (action, index) => `
          <button 
            class="k-swiper-feedback__action-button k-swiper-feedback__action-button--${
              action.type || 'primary'
            } ${
              !this.isValid || this.isSubmitting ? 'k-swiper-feedback__action-button--disabled' : ''
            }"
            data-action="${action.action}"
            data-action-index="${index}"
            ${(!this.isValid || this.isSubmitting) && action.action === 'submit' ? 'disabled' : ''}
          >
            ${this.isSubmitting && action.action === 'submit' ? 'Submitting...' : action.text}
          </button>
        `
          )
          .join('')}
      </div>
    `
  }

  setupEventListeners() {
    // Star rating
    this.shadowRoot.querySelectorAll('.k-swiper-feedback__star').forEach((star) => {
      const starValue = parseInt(star.getAttribute('data-star'))

      star.addEventListener('click', () => this.setRating(starValue))
      star.addEventListener('mouseenter', () => this.setHoverRating(starValue))
      star.addEventListener('mouseleave', () => this.setHoverRating(0))
    })

    // Textarea
    const textarea = this.shadowRoot.getElementById('feedbackTextarea')
    if (textarea) {
      textarea.addEventListener('input', (e) => {
        this.feedbackText = e.target.value
        this.updateCharacterCount()
        this.updateValidation()
      })

      textarea.addEventListener('focus', () => {
        this.isFocused = true
        this.updateFocusState()
      })

      textarea.addEventListener('blur', () => {
        this.isFocused = false
        this.updateFocusState()
      })
    }

    // Action buttons
    this.shadowRoot.querySelectorAll('.k-swiper-feedback__action-button').forEach((button) => {
      button.addEventListener('click', (e) => {
        if (e.target.disabled) return

        const actionIndex = parseInt(e.target.getAttribute('data-action-index'))
        this.handleActionClick(this.data.actions[actionIndex])
      })
    })
  }

  setRating(star) {
    this.rating = star
    this.updateStars()
    this.updateValidation()

    // Dispatch rating change event
    this.dispatchEvent(
      new CustomEvent('rating-change', {
        detail: star,
        bubbles: true
      })
    )
  }

  setHoverRating(star) {
    this.hoverRating = star
    this.updateStars()
  }

  updateStars() {
    this.shadowRoot.querySelectorAll('.k-swiper-feedback__star').forEach((starEl) => {
      const starValue = parseInt(starEl.getAttribute('data-star'))
      const isActive = starValue <= this.rating
      const isHover = starValue <= this.hoverRating

      starEl.className = `k-swiper-feedback__star ${
        isActive || isHover ? 'k-swiper-feedback__star--active' : ''
      }`
      starEl.textContent = isActive || isHover ? '★' : '☆'
    })
  }

  updateCharacterCount() {
    const countEl = this.shadowRoot.getElementById('characterCount')
    if (countEl) {
      countEl.textContent = this.feedbackText.length
    }
  }

  updateValidation() {
    this.updateActionButtons()
    this.updateTextareaError()
  }

  updateActionButtons() {
    this.shadowRoot.querySelectorAll('.k-swiper-feedback__action-button').forEach((button) => {
      const action = button.getAttribute('data-action')
      const shouldDisable = (!this.isValid || this.isSubmitting) && action === 'submit'

      button.disabled = shouldDisable
      button.className = button.className.replace(/k-swiper-feedback__action-button--disabled/g, '')
      if (shouldDisable) {
        button.className += ' k-swiper-feedback__action-button--disabled'
      }
    })
  }

  updateTextareaError() {
    const textarea = this.shadowRoot.getElementById('feedbackTextarea')
    if (textarea) {
      textarea.className = textarea.className.replace(/k-swiper-feedback__textarea--error/g, '')
      if (this.hasTextError) {
        textarea.className += ' k-swiper-feedback__textarea--error'
      }
    }
  }

  updateFocusState() {
    // Additional focus state updates if needed
  }

  async handleActionClick(action) {
    if (!action) return

    // Handle different action types
    if (action.action === 'submit') {
      await this.handleSubmit(action)
    } else if (action.action === 'next_slide') {
      const swiperParent = this.closest('k-swiper-web')
      if (swiperParent) {
        swiperParent.slideNext()
      }
    } else if (action.action === 'prev_slide') {
      const swiperParent = this.closest('k-swiper-web')
      if (swiperParent) {
        swiperParent.slidePrev()
      }
    } else if (action.action === 'cancel') {
      this.handleCancel()
    }

    // Emit to parent
    this.dispatchEvent(
      new CustomEvent('action', {
        detail: {
          type: action.action,
          data: action,
          feedbackData: this.feedbackData
        },
        bubbles: true
      })
    )
  }

  async handleSubmit(action) {
    if (!this.isValid) return

    this.isSubmitting = true
    this.updateValidation()

    try {
      // Emit feedback data
      this.dispatchEvent(
        new CustomEvent('submit', {
          detail: this.feedbackData,
          bubbles: true
        })
      )

      // Auto-advance to next slide if configured
      if (action.autoNext) {
        setTimeout(() => {
          const swiperParent = this.closest('k-swiper-web')
          if (swiperParent) {
            swiperParent.slideNext()
          }
        }, 1000)
      }
    } catch (error) {
      this.dispatchEvent(
        new CustomEvent('error', {
          detail: error,
          bubbles: true
        })
      )
    } finally {
      this.isSubmitting = false
      this.updateValidation()
    }
  }

  handleCancel() {
    this.reset()
    this.dispatchEvent(
      new CustomEvent('cancel', {
        bubbles: true
      })
    )
  }

  reset() {
    this.rating = 0
    this.feedbackText = ''
    this.hoverRating = 0
    this.render()

    this.dispatchEvent(
      new CustomEvent('reset', {
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

      .k-swiper-feedback {
        display: flex;
        flex-direction: column;
        height: 100%;
        min-height: 400px;
        width: calc(100% - 64px);
        background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
        border-radius: 16px;
        padding: 32px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
      }

      .k-swiper-feedback__content {
        display: flex;
        flex-direction: column;
        height: 100%;
        gap: 32px;
        align-items: center;
        text-align: center;
      }

      .k-swiper-feedback__header {
        width: 100%;
      }

      .k-swiper-feedback__title {
        font-size: 32px;
        font-weight: 700;
        color: #253858;
        font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, sans-serif;
        margin: 0;
        line-height: 1.2;
      }

      .k-swiper-feedback__rating {
        display: flex;
        justify-content: center;
        width: 100%;
      }

      .k-swiper-feedback__stars {
        display: flex;
        gap: 8px;
      }

      .k-swiper-feedback__star {
        background: none;
        border: none;
        font-size: 32px;
        color: #E0E0E0;
        cursor: pointer;
        transition: all 0.2s ease;
        padding: 4px;
        border-radius: 4px;
        outline: none;
      }

      .k-swiper-feedback__star:hover {
        transform: scale(1.1);
      }

      .k-swiper-feedback__star--active {
        color: #FFD700;
        text-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
      }

      .k-swiper-feedback__input {
        width: 100%;
        max-width: 500px;
      }

      .k-swiper-feedback__textarea-wrapper {
        position: relative;
        width: 100%;
      }

      .k-swiper-feedback__textarea {
        width: calc(100% - 32px);
        background: #ffffff;
        border: 2px solid rgba(33, 150, 243, 0.2);
        border-radius: 12px;
        padding: 16px;
        font-family: 'Open Sans', sans-serif;
        font-size: 16px;
        line-height: 1.5;
        color: #253858;
        resize: none;
        transition: all 0.3s ease;
        outline: none;
      }

      .k-swiper-feedback__textarea::placeholder {
        color: #9E9E9E;
        font-style: italic;
      }

      .k-swiper-feedback__textarea:hover {
        border-color: rgba(33, 150, 243, 0.4);
      }

      .k-swiper-feedback__textarea:focus {
        border-color: #2196F3;
        box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.1);
      }

      .k-swiper-feedback__textarea--error {
        border-color: #f44336;
      }

      .k-swiper-feedback__textarea--error:focus {
        border-color: #f44336;
        box-shadow: 0 0 0 2px rgba(244, 67, 54, 0.1);
      }

      .k-swiper-feedback__counter {
        position: absolute;
        bottom: 8px;
        right: 12px;
        font-size: 12px;
        color: #9E9E9E;
        font-family: 'Open Sans', sans-serif;
      }

      .k-swiper-feedback__error {
        color: #f44336;
        font-size: 12px;
        margin-top: 4px;
        font-family: 'Open Sans', sans-serif;
      }

      .k-swiper-feedback__actions {
        display: flex;
        gap: 16px;
        justify-content: center;
        flex-wrap: wrap;
        margin-top: auto;
      }

      .k-swiper-feedback__action-button {
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
        min-width: 120px;
      }

      .k-swiper-feedback__action-button:hover:not(.k-swiper-feedback__action-button--disabled) {
        background: #055A9F;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(6, 113, 192, 0.3);
      }

      .k-swiper-feedback__action-button--primary {
        background: #0671C0;
      }

      .k-swiper-feedback__action-button--secondary {
        background: transparent;
        color: #0671C0;
        border: 2px solid #0671C0;
      }

      .k-swiper-feedback__action-button--secondary:hover:not(.k-swiper-feedback__action-button--disabled) {
        background: #0671C0;
        color: #ffffff;
      }

      .k-swiper-feedback__action-button--disabled {
        background: #CCCCCC;
        color: #666666;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
      }

      /* Theme Variations */
      .k-swiper-feedback--primary {
        background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
      }

      .k-swiper-feedback--success {
        background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
      }

      .k-swiper-feedback--warning {
        background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
      }

      /* Layout Variations */
      .k-swiper-feedback--compact .k-swiper-feedback__content {
        gap: 24px;
        padding: 16px;
      }

      .k-swiper-feedback--compact .k-swiper-feedback__title {
        font-size: 24px;
      }

      .k-swiper-feedback--compact .k-swiper-feedback__star {
        font-size: 24px;
      }

      /* Mobile Responsive */
      @media (max-width: 768px) {
        .k-swiper-feedback {
          width: 100%;
          padding: 20px;
          min-height: 350px;
        }

        .k-swiper-feedback__content {
          gap: 24px;
        }

        .k-swiper-feedback__title {
          font-size: 24px;
        }

        .k-swiper-feedback__star {
          font-size: 28px;
        }

        .k-swiper-feedback__textarea {
          font-size: 15px;
          padding: 14px;
        }

        .k-swiper-feedback__action-button {
          padding: 14px 28px;
          font-size: 15px;
          min-width: 100px;
        }
      }

      /* Tablet Responsive */
      @media (min-width: 769px) and (max-width: 1023px) {
        .k-swiper-feedback {
          width: 100%;
          padding: 28px;
        }

        .k-swiper-feedback__title {
          font-size: 28px;
        }
      }

      /* Large screen optimization */
      @media (min-width: 1024px) {
        .k-swiper-feedback {
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

      .k-swiper-feedback__title,
      .k-swiper-feedback__stars,
      .k-swiper-feedback__textarea,
      .k-swiper-feedback__action-button {
        animation: fadeInUp 0.6s ease forwards;
      }

      .k-swiper-feedback__title {
        animation-delay: 0.1s;
      }

      .k-swiper-feedback__stars {
        animation-delay: 0.2s;
      }

      .k-swiper-feedback__textarea {
        animation-delay: 0.3s;
      }

      .k-swiper-feedback__action-button {
        animation-delay: 0.4s;
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

  // Get current feedback
  getFeedback() {
    return this.feedbackData
  }

  // Set rating programmatically
  setRatingValue(rating) {
    this.setRating(rating)
  }

  // Set feedback text programmatically
  setFeedbackText(text) {
    this.feedbackText = text
    const textarea = this.shadowRoot.getElementById('feedbackTextarea')
    if (textarea) {
      textarea.value = text
    }
    this.updateCharacterCount()
    this.updateValidation()
  }
}

// Register the custom element
customElements.define('k-swiper-feedback-web', KSwiperFeedbackWeb)
