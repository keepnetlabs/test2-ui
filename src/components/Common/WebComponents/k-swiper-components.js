/**
 * KSwiper Web Components Bundle
 * All KSwiper components as Web Components for HTML export and LMS integration
 *
 * Usage:
 * <script type="module" src="./k-swiper-components.js"></script>
 *
 * Example:
 * <k-swiper-web pagination="progressbar" navigation="true">
 *   <k-swiper-introduction-web data='{"title":"Welcome","content":"Hello World"}'></k-swiper-introduction-web>
 *   <k-swiper-education-web data='{"title":"Learn","fields":[...]}'></k-swiper-education-web>
 *   <k-swiper-feedback-web data='{"title":"Feedback"}'></k-swiper-feedback-web>
 * </k-swiper-web>
 */

// Import all web components
import './k-swiper-web.js'
import './k-swiper-slide-web.js'
import './k-swiper-introduction-web.js'
import './k-swiper-education-web.js'
import './k-swiper-behavior-web.js'
import './k-swiper-feedback-web.js'

// Utility class for easier component creation and management
class KSwiperUtils {
  /**
   * Create a complete swiper with slides programmatically
   * @param {Object} config - Swiper configuration
   * @param {Array} slides - Array of slide configurations
   * @returns {HTMLElement} - Created swiper element
   */
  static createSwiper(config = {}, slides = []) {
    const swiper = document.createElement('k-swiper-web')

    // Set swiper attributes
    Object.entries(config).forEach(([key, value]) => {
      if (typeof value === 'boolean') {
        if (value) swiper.setAttribute(key, 'true')
      } else {
        swiper.setAttribute(key, value)
      }
    })

    // Add slides
    slides.forEach((slideConfig) => {
      const slide = this.createSlide(slideConfig)
      if (slide) swiper.appendChild(slide)
    })

    return swiper
  }

  /**
   * Create a slide element based on type and configuration
   * @param {Object} slideConfig - Slide configuration
   * @returns {HTMLElement} - Created slide element
   */
  static createSlide(slideConfig) {
    const { type, data, ...attributes } = slideConfig

    let slide
    switch (type) {
      case 'introduction':
        slide = document.createElement('k-swiper-introduction-web')
        break
      case 'education':
        slide = document.createElement('k-swiper-education-web')
        break
      case 'behavior':
        slide = document.createElement('k-swiper-behavior-web')
        break
      case 'feedback':
        slide = document.createElement('k-swiper-feedback-web')
        break
      default:
        slide = document.createElement('k-swiper-slide-web')
    }

    // Set data attribute
    if (data) {
      slide.setAttribute('data', JSON.stringify(data))
    }

    // Set other attributes
    Object.entries(attributes).forEach(([key, value]) => {
      slide.setAttribute(key, value)
    })

    return slide
  }

  /**
   * Generate complete HTML for export
   * @param {Object} config - Configuration object
   * @returns {string} - Complete HTML string
   */
  static generateHTML(config) {
    const {
      title = 'MicroLearning Export',
      swiperConfig = {},
      slides = [],
      customCSS = '',
      customJS = ''
    } = config

    const swiperAttributes = Object.entries(swiperConfig)
      .map(([key, value]) => {
        if (typeof value === 'boolean') {
          return value ? key : ''
        }
        return `${key}="${value}"`
      })
      .filter(Boolean)
      .join(' ')

    const slidesHTML = slides
      .map((slideConfig) => {
        const { type, data, ...attributes } = slideConfig
        const tagName = `k-swiper-${type}-web`

        const attributesString = Object.entries(attributes)
          .map(([key, value]) => `${key}="${value}"`)
          .join(' ')

        const dataAttribute = data ? `data='${JSON.stringify(data).replace(/'/g, '&#39;')}'` : ''

        return `<${tagName} ${dataAttribute} ${attributesString}></${tagName}>`
      })
      .join('\n    ')

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  
  <!-- Google Fonts -->
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&display=swap" rel="stylesheet">
  
  <!-- KSwiper Web Components -->
  <script type="module" src="./js/k-swiper-components.js"></script>
  
  <style>
    /* Global Styles */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .microlearning-container {
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
    }

    /* Loading Indicator */
    .loading {
      text-align: center;
      color: white;
      font-size: 18px;
    }

    .loading::after {
      content: '';
      display: inline-block;
      animation: dots 1.5s infinite;
    }

    @keyframes dots {
      0%, 20% { content: ''; }
      40% { content: '.'; }
      60% { content: '..'; }
      80%, 100% { content: '...'; }
    }

    /* Custom CSS */
    ${customCSS}
  </style>
</head>
<body>
  <div class="microlearning-container">
    <div class="loading" id="loading">Loading MicroLearning Content</div>
    
    <k-swiper-web ${swiperAttributes} style="display: none;" id="mainSwiper">
      ${slidesHTML}
    </k-swiper-web>
  </div>

  <script>
    // Wait for web components to be defined
    Promise.all([
      customElements.whenDefined('k-swiper-web'),
      customElements.whenDefined('k-swiper-introduction-web'),
      customElements.whenDefined('k-swiper-education-web'),
      customElements.whenDefined('k-swiper-behavior-web'),
      customElements.whenDefined('k-swiper-feedback-web')
    ]).then(() => {
      // Hide loading and show swiper
      document.getElementById('loading').style.display = 'none'
      document.getElementById('mainSwiper').style.display = 'block'
      
      // Setup event listeners
      const swiper = document.getElementById('mainSwiper')
      
      // Listen for slide changes
      swiper.addEventListener('slide-change', (e) => {
        console.log('Slide changed to:', e.detail.activeIndex)
      })
      
      // Listen for actions from slides
      swiper.addEventListener('action', (e) => {
        console.log('Action triggered:', e.detail)
      })
      
      // Listen for feedback submissions
      swiper.addEventListener('submit', (e) => {
        console.log('Feedback submitted:', e.detail)
        // Here you could send data to your LMS or analytics service
      })
      
      // Listen for red flag progress
      swiper.addEventListener('red-flag-progress', (e) => {
        console.log('Red flags reviewed:', e.detail)
      })
      
      console.log('KSwiper Web Components loaded successfully!')
    }).catch(error => {
      console.error('Failed to load web components:', error)
      document.getElementById('loading').textContent = 'Failed to load content. Please refresh the page.'
    })

    // Custom JavaScript
    ${customJS}
  </script>
</body>
</html>`
  }

  /**
   * Download generated HTML as a file
   * @param {Object} config - Configuration object
   * @param {string} filename - Output filename
   */
  static downloadHTML(config, filename = 'microlearning-export.html') {
    const html = this.generateHTML(config)
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    URL.revokeObjectURL(url)
  }

  /**
   * Generate SCORM manifest for LMS integration
   * @param {Object} config - SCORM configuration
   * @returns {string} - SCORM manifest XML
   */
  static generateSCORMManifest(config) {
    const {
      identifier = 'microlearning-export',
      title = 'MicroLearning Content',
      description = 'Interactive MicroLearning module created with KSwiper Web Components',
      version = '1.0',
      organization = 'KeepnetLabs'
    } = config

    return `<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="${identifier}" version="${version}" 
          xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2" 
          xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2" 
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
          xsi:schemaLocation="http://www.imsproject.org/xsd/imscp_rootv1p1p2 imscp_rootv1p1p2.xsd 
                             http://www.imsglobal.org/xsd/imsmd_rootv1p2p1 imsmd_rootv1p2p1.xsd 
                             http://www.adlnet.org/xsd/adlcp_rootv1p2 adlcp_rootv1p2.xsd">

  <metadata>
    <schema>ADL SCORM</schema>
    <schemaversion>1.2</schemaversion>
    <lom xmlns="http://www.imsglobal.org/xsd/imsmd_rootv1p2p1">
      <general>
        <identifier>
          <catalog>URI</catalog>
          <entry>${identifier}</entry>
        </identifier>
        <title>
          <langstring xml:lang="en">${title}</langstring>
        </title>
        <description>
          <langstring xml:lang="en">${description}</langstring>
        </description>
      </general>
      <technical>
        <format>text/html</format>
        <location>index.html</location>
      </technical>
    </lom>
  </metadata>

  <organizations default="ORG-${identifier}">
    <organization identifier="ORG-${identifier}">
      <title>${title}</title>
      <item identifier="ITEM-${identifier}" identifierref="RES-${identifier}">
        <title>${title}</title>
        <adlcp:masteryscore>80</adlcp:masteryscore>
      </item>
    </organization>
  </organizations>

  <resources>
    <resource identifier="RES-${identifier}" type="webcontent" 
              adlcp:scormtype="sco" href="index.html">
      <file href="index.html"/>
      <file href="js/k-swiper-components.js"/>
      <dependency identifierref="SCORM-API"/>
    </resource>
    
    <resource identifier="SCORM-API" type="webcontent">
      <file href="js/scorm-api.js"/>
    </resource>
  </resources>
</manifest>`
  }

  /**
   * Check if web components are supported
   * @returns {boolean} - Support status
   */
  static isSupported() {
    return (
      'customElements' in window &&
      'attachShadow' in Element.prototype &&
      'content' in document.createElement('template')
    )
  }

  /**
   * Load polyfills for older browsers
   * @returns {Promise} - Promise that resolves when polyfills are loaded
   */
  static async loadPolyfills() {
    if (this.isSupported()) {
      return Promise.resolve()
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = 'https://unpkg.com/@webcomponents/webcomponentsjs@2/webcomponents-bundle.js'
      script.onload = resolve
      script.onerror = reject
      document.head.appendChild(script)
    })
  }
}

// Global utilities
window.KSwiperUtils = KSwiperUtils

// Auto-load polyfills if needed
if (!KSwiperUtils.isSupported()) {
  console.warn('Web Components not fully supported. Loading polyfills...')
  KSwiperUtils.loadPolyfills()
    .then(() => {
      console.log('Web Components polyfills loaded successfully!')
    })
    .catch((error) => {
      console.error('Failed to load Web Components polyfills:', error)
    })
}

// Export for module usage
export { KSwiperUtils }
export default KSwiperUtils

console.log('🚀 KSwiper Web Components Bundle loaded successfully!')
console.log('📖 Usage: https://github.com/your-repo/kswiper-web-components')
console.log('🛠️ Utils available: window.KSwiperUtils')
