# GrapesJS: Merge Tag Drag & Drop — Teknik Kısıt Analizi

## Sorun

Kullanıcılar email template editöründe merge tag'leri (örn. `{FIRSTNAME}`) sürükle-bırak ile metin bloğu içinde **kelimelerin arasına** ekleyemiyor. Tag metnin sonuna ya da başına gidiyor, istenen konuma değil.

---

## Kök Neden: İki Bağımsız Sistem

Web platformunda "metin içine bir şey eklemek" iki farklı mekanizmayla çalışır. Bu mekanizmalar birbirinden habersizdir.

### 1. Drag & Drop → Component Tree Seviyesi

GrapesJS sürükle-bırak işleminde şu soruyu sorar:

> "Mouse hangi **component**'ın üzerinde?"

Cevabı bulur ve yeni elementi o component'ın **children** listesine ekler. Hangi karakter pozisyonuna denk geldiğini bilmez, bilemez.

```
[Mouse Drop]
     │
     ▼
GrapesJS: "Text bloğunun üzerine bırakıldı"
     │
     ▼
component.components().add(<span>{FIRSTNAME}</span>)
     │
     ▼
Sonuç: Metnin SONUNA eklendi
```

### 2. Text Cursor → Karakter / Selection Seviyesi

Browser'ın text cursor sistemi ise şu soruyu sorar:

> "Mouse metnin hangi **karakterler arasında**?"

Bu soru ancak `contenteditable` aktifken (yani RTE modunda) cevaplanabilir. Cevap, browser'ın **Selection API**'si aracılığıyla bir `Range` nesnesi olarak döner.

```
[Mouse Click in contenteditable]
     │
     ▼
Browser Selection API: "5. karakterden sonra"
     │
     ▼
Range { startContainer: TextNode, startOffset: 5 }
     │
     ▼
Cursor tam oraya konumlanır
```

---

## Somut Örnek

Metin bloğu şunu içeriyor: `Hello World`

### GrapesJS Component Tree Olarak:

```
Text Component
  └─ TextNode: "Hello World"   ← tek bir text node, bölünemez
```

### DnD ile tag bırakınca:

```
Text Component
  ├─ TextNode: "Hello World"
  └─ <span>{FIRSTNAME}</span>  ← sona eklendi, araya giremedi
```

`"Hello World"` aynı text node'un içinde. GrapesJS bu text node'u ikiye bölüp araya yeni bir element ekleyemiyor. Bu işlem **browser'ın Selection API'sinin** sorumluluğunda.

### `rteEditor.insertHTML()` ile:

```
1. Selection API: cursor "Hello" ile "World" arasında
2. Browser text node'u böler: "Hello " | "World"
3. Araya HTML inject edilir

Sonuç:
  Text Component
    ├─ TextNode: "Hello "
    ├─ <span>{FIRSTNAME}</span>
    └─ TextNode: " World"
```

---

## Karşılaştırma

| Özellik | Drag & Drop | RTE `insertHTML` |
|---|---|---|
| Çalışma seviyesi | Component tree | Text node / karakter |
| Cursor pozisyonu bilgisi | ❌ Yok | ✅ Tam koordinat |
| "Kelimelerin arasına ekle" | ❌ Mümkün değil | ✅ Mümkün |
| Kullanılan API | `components().add()` | `Selection API` |
| GrapesJS modu | Her zaman | Sadece RTE modunda |

---

## Endüstri Standardı

Bu kısıt GrapesJS'e özgü değil, **web platformunun temel bir gerçeği**. Drag & Drop API ile Selection API birbirinden bağımsız tasarlanmıştır ve aralarında köprü yoktur.

Bu nedenle Mailchimp, HubSpot, Klaviyo, Campaign Monitor gibi tüm profesyonel email editor'ları aynı yaklaşımı benimser:

- **Sürükle-bırak** → yeni blok/element eklemek için (component seviyesi)
- **Toolbar butonu** → metin içine cursor konumuna eklemek için (karakter seviyesi)

---

## Uygulanan Çözüm

Bu gerçekten hareketle editöre iki katmanlı çözüm eklendi:

### 1. RTE Toolbar `{ }` Butonu (Ana Çözüm)

Metin bloğuna tıklanarak cursor konumlandırılır, ardından toolbar'daki `{ }` butonuyla arama yapılabilir bir dropdown açılır. Seçilen tag imlecin tam konumuna eklenir.

```
Metne tıkla → Cursor konumla → { } butonuna tıkla → Ara → Seç → Cursor'a eklendi
```

**Teknik mekanizma:**
```javascript
rteEditor.insertHTML('<span>{FIRSTNAME}</span>');
// browser Selection API'si üzerinden çalışır
// cursor'ın tam konumuna ekler
```

### 2. DnD İyileştirme (Yardımcı)

Sürükle-bırak yapıldığında, merge tag'in seçili text bileşeninin **dışına** düşmesi önlenir. Seçili bir text bileşeni varsa tag onun içine yönlendirilir.

```javascript
editor.on("block:drag:stop", (droppedComponent, block) => {
  const isMergeTag = block.attributes?.class === "merged-text";
  if (!isMergeTag) return;
  // ...seçili text component'ına taşı
});
```

> **Not:** Bu iyileştirme tag'i bileşenin içine sokar, ancak kelimelerin tam arasına yerleştiremez. "Kelimelerin arasına" için RTE toolbar yolu kullanılmalıdır.

---

## İlgili Dosya

`src/components/GrapesJs/Newsletter/GrapesNewsletterModal.vue`

- `setRichTextEditor()` → `{ }` toolbar butonu tanımı
- `showMergeTagDropdown()` → arama kutulu dropdown
- `getMergeTagsForDropdown()` → merge tag listesi filtresi
- `onDragStop()` → DnD iyileştirme mantığı
