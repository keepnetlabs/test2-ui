/**
 * Preview sayfalarında form submit, link tıklama ve diğer eventleri engelleyen script
 * @returns {string} HTML'e inject edilecek script tag'i
 */
export function getPreventClickScript() {
  const method = `(function() {
    'use strict';

    function initializeEventPrevention() {
      // Tüm event türlerini tanımla
      const eventTypes = [
        'click', 'auxclick', 'dblclick', 'mousedown', 'mouseup',
        'keydown', 'keyup', 'keypress', 'submit', 'change',
        'focus', 'blur', 'input', 'select', 'dragstart',
        'contextmenu'
      ];

      // Her event türü için body listener ekle
      eventTypes.forEach(eventType => {
        document.body.addEventListener(eventType, function(e) {
          // Form submit eventlerini engelle
          if (e.target.tagName === 'FORM' || e.target.closest('form')) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            return false;
          }
        }, true);
      });

      // Özellikle anchor linkleri engelle
      ['click', 'auxclick'].forEach(anchorEvent => {
        document.body.addEventListener(anchorEvent, function(e) {
          const anchor = e.target.closest('a');
          if (anchor) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            try { anchor.setAttribute('data-blocked', 'true'); } catch (_) {}
            return false;
          }
        }, true);
      });
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initializeEventPrevention);
    } else {
      initializeEventPrevention();
    }
  })();`
  return '<script>' + method + '</script>'
}
