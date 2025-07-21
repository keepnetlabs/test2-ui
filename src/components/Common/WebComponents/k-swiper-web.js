/**
 * KSwiperWeb - Main swiper container web component
 * Uses Swiper.js library for consistent behavior with Vue components
 */

class KSwiperWeb extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.swiper = null
    this.swiperConfig = {}
  }

  static get observedAttributes() {
    return [
      'pagination',
      'navigation',
      'internal-navigation',
      'slides-per-view',
      'space-between',
      'loop',
      'autoplay',
      'current-slide'
    ]
  }

  connectedCallback() {
    this.render()
    this.loadSwiperAndInit()
  }

  disconnectedCallback() {
    if (this.swiper) {
      this.swiper.destroy(true, true)
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue && this.swiper) {
      if (name === 'current-slide') {
        this.swiper.slideTo(parseInt(newValue) || 0)
      } else {
        // Rebuild swiper for other attribute changes
        this.updateSwiper()
      }
    }
  }

  get pagination() {
    return this.getAttribute('pagination') || 'false'
  }
  get navigation() {
    return this.getAttribute('navigation') === 'true'
  }
  get internalNavigation() {
    return this.getAttribute('internal-navigation') === 'true'
  }
  get slidesPerView() {
    return parseInt(this.getAttribute('slides-per-view')) || 1
  }
  get spaceBetween() {
    return parseInt(this.getAttribute('space-between')) || 0
  }
  get loop() {
    return this.getAttribute('loop') === 'true'
  }
  get autoplay() {
    return this.getAttribute('autoplay')
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        ${this.getStyles()}
      </style>
      
      <div class="k-swiper">
        ${this.navigation ? this.getExternalNavigation() : ''}
        
        <div class="swiper">
          <div class="swiper-wrapper">
            <slot></slot>
          </div>
          
          ${this.pagination !== 'false' ? '<div class="swiper-pagination"></div>' : ''}
          ${this.internalNavigation ? this.getInternalNavigation() : ''}
        </div>
      </div>
    `
  }

  getStyles() {
    return `
      /* Swiper base styles */
      .swiper {
        width: 100%;
        height: auto;
        min-height: 400px;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
        background: #fff;
      }

      .swiper-wrapper {
        display: flex;
      }

      .swiper-slide {
        flex-shrink: 0;
        width: 100%;
        height: auto;
        position: relative;
        display: flex;
        align-items: stretch;
        justify-content: center;
      }

      /* K-Swiper container styles */
      .k-swiper {
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px 80px;
        position: relative;
        display: flex;
        align-items: center;
        gap: 20px;
      }

      /* External Navigation */
      .k-swiper-nav {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 60px;
        height: 60px;
        border: 2px solid #e3f2fd;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.95);
        color: #2196f3;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        z-index: 100;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      }

      .k-swiper-nav:hover:not(:disabled) {
        background: #2196f3;
        color: white;
        transform: translateY(-50%) scale(1.1);
        box-shadow: 0 6px 25px rgba(33, 150, 243, 0.3);
        border-color: #2196f3;
      }

      .k-swiper-nav:disabled {
        opacity: 0.3;
        cursor: not-allowed;
        pointer-events: none;
      }

      .k-swiper-nav--prev { left: 0; }
      .k-swiper-nav--next { right: 0; }

      /* Internal Navigation */
      .swiper-button-next,
      .swiper-button-prev {
        width: 50px !important;
        height: 50px !important;
        background: rgba(255, 255, 255, 0.95) !important;
        border-radius: 50% !important;
        color: #2196f3 !important;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1) !important;
        border: 2px solid #e3f2fd !important;
        transition: all 0.3s ease !important;
      }

      .swiper-button-next:after,
      .swiper-button-prev:after {
        font-size: 18px !important;
        font-weight: bold !important;
      }

      .swiper-button-next:hover,
      .swiper-button-prev:hover {
        background: #2196f3 !important;
        color: white !important;
        transform: scale(1.1) !important;
        border-color: #2196f3 !important;
      }

      /* Pagination Styles */
      .swiper-pagination-progressbar {
        background: rgba(255, 255, 255, 0.3) !important;
        height: 6px !important;
        border-radius: 3px !important;
        bottom: 20px !important;
        left: 20px !important;
        right: 20px !important;
        width: calc(100% - 40px) !important;
      }

      .swiper-pagination-progressbar-fill {
        background: linear-gradient(90deg, #2196f3, #21cbf3) !important;
        border-radius: 3px !important;
        box-shadow: 0 2px 10px rgba(33, 150, 243, 0.3) !important;
      }

      .swiper-pagination-bullets {
        bottom: 20px !important;
      }

      .swiper-pagination-bullet {
        width: 12px !important;
        height: 12px !important;
        background: rgba(255, 255, 255, 0.5) !important;
        opacity: 1 !important;
        transition: all 0.3s ease !important;
        margin: 0 6px !important;
      }

      .swiper-pagination-bullet-active {
        background: #2196f3 !important;
        transform: scale(1.3) !important;
        box-shadow: 0 2px 10px rgba(33, 150, 243, 0.4) !important;
      }

      /* Mobile Responsive */
      @media (max-width: 768px) {
        .k-swiper {
          padding: 8px !important;
        }
        
        .k-swiper-nav,
        .swiper-button-next,
        .swiper-button-prev {
          display: none !important;
        }
      }
    `
  }

  getExternalNavigation() {
    return `
      <button class="k-swiper-nav k-swiper-nav--prev" id="prevBtn" type="button">
        <svg width="11" height="20" viewBox="0 0 11 20" fill="none">
          <path d="M0.38296 20.0762C0.111788 19.805 0.111788 19.3654 0.38296 19.0942L9.19758 10.2796L0.38296 1.46497C0.111788 1.19379 0.111788 0.754138 0.38296 0.482966C0.654131 0.211794 1.09379 0.211794 1.36496 0.482966L10.4341 9.55214C10.8359 9.9539 10.8359 10.6053 10.4341 11.007L1.36496 20.0762C1.09379 20.3474 0.654131 20.3474 0.38296 20.0762Z"
            fill="currentColor" transform-origin="center" transform="rotate(180)"/>
        </svg>
      </button>
      
      <button class="k-swiper-nav k-swiper-nav--next" id="nextBtn" type="button">
        <svg width="11" height="20" viewBox="0 0 11 20" fill="none">
          <path d="M0.38296 20.0762C0.111788 19.805 0.111788 19.3654 0.38296 19.0942L9.19758 10.2796L0.38296 1.46497C0.111788 1.19379 0.111788 0.754138 0.38296 0.482966C0.654131 0.211794 1.09379 0.211794 1.36496 0.482966L10.4341 9.55214C10.8359 9.9539 10.8359 10.6053 10.4341 11.007L1.36496 20.0762C1.09379 20.3474 0.654131 20.3474 0.38296 20.0762Z"
            fill="currentColor"/>
        </svg>
      </button>
    `
  }

  getInternalNavigation() {
    return `
      <div class="swiper-button-next"></div>
      <div class="swiper-button-prev"></div>
    `
  }

  async loadSwiperAndInit() {
    try {
      // Load Swiper.js if not already loaded
      if (!window.Swiper) {
        await this.loadSwiperJS()
      }
      this.initSwiper()
    } catch (error) {
      console.error('Failed to load Swiper.js:', error)
    }
  }

  async loadSwiperJS() {
    return new Promise((resolve, reject) => {
      // Check if already loading
      if (window.swiperLoading) {
        window.swiperLoading.then(resolve).catch(reject)
        return
      }

      window.swiperLoading = new Promise((res, rej) => {
        const script = document.createElement('script')
        script.src = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js'
        script.onload = () => {
          // Also load CSS
          const link = document.createElement('link')
          link.rel = 'stylesheet'
          link.href = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css'
          document.head.appendChild(link)
          res()
        }
        script.onerror = rej
        document.head.appendChild(script)
      })

      window.swiperLoading.then(resolve).catch(reject)
    })
  }

  initSwiper() {
    const swiperEl = this.shadowRoot.querySelector('.swiper')

    this.swiperConfig = {
      slidesPerView: this.slidesPerView,
      spaceBetween: this.spaceBetween,
      loop: this.loop,
      autoHeight: true,

      // Autoplay
      autoplay:
        this.autoplay && this.autoplay !== 'false'
          ? {
              delay:
                typeof this.autoplay === 'string' && !isNaN(this.autoplay)
                  ? parseInt(this.autoplay)
                  : 3000
            }
          : false,

      // Pagination
      pagination:
        this.pagination !== 'false'
          ? {
              el: '.swiper-pagination',
              type: this.pagination === 'true' ? 'bullets' : this.pagination,
              clickable: true
            }
          : false,

      // Navigation
      navigation: this.internalNavigation
        ? {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
          }
        : false,

      // Events
      on: {
        init: (swiper) => {
          this.swiper = swiper
          this.updateExternalNavigation(swiper)
          this.dispatchEvent(
            new CustomEvent('swiper-init', {
              detail: { swiper },
              bubbles: true
            })
          )
        },
        slideChange: (swiper) => {
          this.updateExternalNavigation(swiper)
          this.setAttribute('current-slide', swiper.activeIndex)
          this.dispatchEvent(
            new CustomEvent('slide-change', {
              detail: {
                activeIndex: swiper.activeIndex,
                isBeginning: swiper.isBeginning,
                isEnd: swiper.isEnd
              },
              bubbles: true
            })
          )
        }
      }
    }

    this.swiper = new window.Swiper(swiperEl, this.swiperConfig)
    this.setupExternalNavigation()
  }

  setupExternalNavigation() {
    if (!this.navigation) return

    const prevBtn = this.shadowRoot.getElementById('prevBtn')
    const nextBtn = this.shadowRoot.getElementById('nextBtn')

    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.slidePrev())
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.slideNext())
    }
  }

  updateExternalNavigation(swiper) {
    if (!this.navigation) return

    const prevBtn = this.shadowRoot.getElementById('prevBtn')
    const nextBtn = this.shadowRoot.getElementById('nextBtn')

    if (prevBtn && nextBtn && !this.loop) {
      prevBtn.disabled = swiper.isBeginning
      nextBtn.disabled = swiper.isEnd
    }
  }

  updateSwiper() {
    if (this.swiper) {
      this.swiper.destroy(true, true)
      this.initSwiper()
    }
  }

  // Public API Methods
  slideNext() {
    if (this.swiper) this.swiper.slideNext()
  }

  slidePrev() {
    if (this.swiper) this.swiper.slidePrev()
  }

  slideTo(index, speed = 300) {
    if (this.swiper) this.swiper.slideTo(index, speed)
  }

  // Property getters for external access
  get swiperInstance() {
    return this.swiper
  }

  get activeIndex() {
    return this.swiper ? this.swiper.activeIndex : 0
  }

  get isBeginning() {
    return this.swiper ? this.swiper.isBeginning : true
  }

  get isEnd() {
    return this.swiper ? this.swiper.isEnd : false
  }
}

// Register the custom element
customElements.define('k-swiper-web', KSwiperWeb)
