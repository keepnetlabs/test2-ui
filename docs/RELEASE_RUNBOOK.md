# KeepnetLabs.UI Release Runbook

> **Amaç:** Frontend (KeepnetLabs.UI) release sürecinin adım adım dokümantasyonu.  
> **Versiyon:** 1.0 | **Son güncelleme:** 2026-02-22

---

## İçindekiler

- [Özet](#özet) · [Gereksinimler](#gereksinimler) · [Roller](#roller-raci) · [Release Öncesi](#release-öncesi-kontrol-listesi)
1. [Genel Bakış](#1-genel-bakış)
2. [Branch Stratejisi](#2-branch-stratejisi)
3. [Azure DevOps Pipeline](#3-azure-devops-cicd-pipeline)
4. [Azure → Cloudflare Akışı](#4-azure--cloudflare-repo-akışı)
5. [Cloudflare Deployment](#5-cloudflare-deployment)
6. [Rollback Prosedürü](#6-rollback-prosedürü)
7. [TEST → PROD Akışı](#7-test--prod-release-akışı)
8. [Erişim Bilgileri](#8-gerekli-erişim-bilgileri-ve-credentiallar)
9. [Sorun Giderme](#9-sorun-giderme)
10. [Release Sonrası Kontrol](#10-release-sonrası-kontrol-listesi)
11. [Hızlı Referans](#11-hızlı-referans)

---

## Özet

| Alan                  | Değer                           |
| --------------------- | ------------------------------- |
| **Ürün**              | KeepnetLabs.UI (Frontend)       |
| **Ortamlar**          | TEST, PROD                      |
| **CI/CD**             | Azure DevOps → Cloudflare Pages |
| **Branch stratejisi** | feature → dev → test → release  |
| **Tahmini süre**     | TEST: ~5-10 dk, PROD: ~5-10 dk |

---

## Gereksinimler

| Gereksinim | Açıklama |
|------------|----------|
| **Azure DevOps** | Pipeline görüntüleme, Run tetikleme yetkisi |
| **GitHub** | `Keepnet/KeepnetLabs.UI` repo erişimi, branch push |
| **Cloudflare** | Pages projesi erişimi (Deployments, Rollback) |
| **Onay** | Pipelines'da GH_Repo_TEST / GH_Repo_PROD stage onayı; release öncesi ilgili kişi/ekip onayı |

### Roller (RACI)

| Rol | Sorumluluk |
|-----|------------|
| **Executor** | Branch oluşturma, push, pipeline tetikleme |
| **Approver** | GH_Repo_TEST / GH_Repo_PROD stage onayı |
| **Verifier** | Smoke test, deployment doğrulama |

---

## 1. Genel Bakış

**Akış:** test / release branch → Azure pipeline (CI_Test / CI_Prod) → **GH_Repo_TEST / GH_Repo_PROD onayı** → Cloudflare push → Build + deploy.

| Ortam    | Tetikleyici Branch | Onay                 | Cloudflare              |
| -------- | ------------------ | -------------------- | ----------------------- |
| **TEST** | `test`             | GH_Repo_TEST onayı   | Build + deploy otomatik |
| **PROD** | `release/*`        | GH_Repo_PROD onayı   | Build + deploy otomatik |

---

## Release Öncesi Kontrol Listesi

| # | Kontrol |
|---|---------|
| 1 | TEST ortamında doğrulama tamamlandı mı? |
| 2 | Kritik değişiklikler release notlarına eklendi mi? |
| 3 | İlgili ekip release zamanından haberdar mı? |
| 4 | Rollback prosedürü (Bölüm 6) gözden geçirildi mi? |

---

## 2. Branch Stratejisi

```
feature/44200
    │
    │  PR açılır (commit: #44200)
    ▼
  dev
    │
    │  branch açılır
    ▼
  test          → CI_Test build → GH_Repo_TEST onayı → TEST deploy
    │
    │  release branch çıkılır
    ▼
  release/YYYY_MM_DD   → CI_Prod build → GH_Repo_PROD onayı → PROD deploy (örn: release/2026_02_21)
```

### Kurallar

- **Not:** Bu projede `main` branch kullanılmaz. Akış: dev → test → release
- **feature/taskid** → Geliştirme branch'i (örn: `feature/44200`)
- **dev** → feature branch'lerden PR ile merge edilir
- **test** → dev'den branch açılır → CI_Test build → **GH_Repo_TEST onayı** → TEST deploy
- **release/YYYY_MM_DD** → test'ten branch çıkılır → CI_Prod build → **GH_Repo_PROD onayı** → PROD deploy

---

## 3. Azure DevOps CI/CD Pipeline

### 3.1 Pipeline Dosyaları

| Dosya                              | Açıklama                                                                 |
| ---------------------------------- | ------------------------------------------------------------------------ |
| `devops/KeepnetLabs.UI-main.yml`   | Ana pipeline tanımı (dosya adındaki "main" = ana pipeline, branch değil) |
| `devops/sub-KeepnetLabs.UI-CI.yml` | Build (lint, test, build) adımları                                       |
| `devops/sub-KeepnetLabs.UI-GH.yml` | GitHub'a push (Cloudflare tetikleyicisi)                                 |
| `devops/sub-KeepnetLabs.UI-CD.yml` | IIS deploy (şu an kullanılmıyor)                                         |

### 3.2 Pipeline Tetikleme Adımları

**Önemli:** Build tamamlandıktan sonra **GH_Repo_TEST** (TEST) veya **GH_Repo_PROD** (PROD) stage'i Pipelines üzerinden onaylanmalıdır. Onay sonrası Azure kodu Cloudflare'e push eder.

#### TEST Ortamı

1. `test` branch oluşturulur (dev'den) → Merge alınır
2. Azure pipeline tetiklenir → **CI_Test** build tamamlanır
3. **Pipelines** → Run detayına git → **GH_Repo_TEST** stage'ini **onayla**
4. Onay sonrası kodu Cloudflare test repo'suna push eder → Cloudflare build + deploy otomatik

#### PROD Ortamı

1. `release/YYYY_MM_DD` branch oluşturulur (test'ten) → Onay verilir
2. Azure pipeline tetiklenir → **CI_Prod** build tamamlanır
3. Önceki release branch ile karşılaştırma yapılır, task ID'ler (#44200 vb.) raporlanır
4. **Pipelines** → Run detayına git → **GH_Repo_PROD** stage'ini **onayla**
5. Onay sonrası kodu Cloudflare prod repo'suna push eder → Cloudflare build + deploy otomatik

### 3.3 Pipeline Aşamaları (Stages)

```
TEST akışı:
  Merge → CI_Test (Build) → GH_Repo_TEST onayı → Cloudflare test repo'ya push → Build + deploy

PROD akışı:
  Onay → CI_Prod (Build) → Karşılaştırma/rapor → GH_Repo_PROD onayı → Cloudflare prod repo'ya push → Build + deploy
```

### 3.4 Build Adımları (sub-KeepnetLabs.UI-CI.yml)

1. Node.js 16.20.2 kurulumu
2. `config.Production.js` → `config.js` kopyalama
3. `yarn install`
4. `yarn run lint`
5. `yarn test:unit`
6. `yarn run build`
7. `Web.config` → `dist` taşıma
8. Artifact olarak `drop` yayınlama

### 3.5 Release Branch Karşılaştırma ve Raporlama

Release branch çıkıldıktan sonra Azure üzerinde:

1. **Önceki release branch** ile **yeni release branch** karşılaştırılır
2. **Commit ID'leri** (task ID formatında, örn: `#44200`) incelenir ve farklar tespit edilir
3. Sonuçlar **raporlanır** (Azure Pipeline çıktısı veya ilgili araç)

**Not:** Commit'ler `#taskid` formatında yazılır (örn: `#44200`). Önceki release branch (örn: `release/2026_02_18`) ile mevcut branch (örn: `release/2026_02_21`) arasındaki task ID'ler karşılaştırılır.

**Nerede:** [Azure DevOps Repo](https://dev.azure.com/keepnetlabsuk/Keepnet/_git/KeepnetLabs.UI) → Pipelines → KeepnetLabs.UI → Run detayında commit history ve diff görüntülenir.

---

## 4. Azure → Cloudflare Repo Akışı

### 4.1 Repository

- **Kaynak:** `Keepnet/KeepnetLabs.UI` (Azure buradan build alır)
- **Hedef:** Cloudflare test/prod repo'ları (Azure buraya push eder)

### 4.2 Branch Akışı

| Branch (kaynak) | Azure push hedefi    | Ortam |
| --------------- | -------------------- | ----- |
| `test`          | Cloudflare test repo | TEST  |
| `release/*`     | Cloudflare prod repo | PROD  |

### 4.3 PR Merge Stratejisi

1. **TEST'e release:**

   - feature/44200 → dev'e PR aç → Merge (commit mesajı: `#44200 açıklama`)
   - dev'den test branch'i aç/merge → CI_Test build → **GH_Repo_TEST onayı** → TEST'e deploy

2. **PROD'a release:**
   - test'ten `release/YYYY_MM_DD` branch oluştur (örn: `release/2026_02_21`)
   - Push → CI_Prod build → Karşılaştırma → **GH_Repo_PROD onayı** → PROD deploy

---

## 5. Cloudflare Deployment

### 5.1 Bağlantı

- Azure pipeline kodu Cloudflare'deki test ve prod repo'larına push eder
- Cloudflare bu repo'lardan build alır ve deploy'u otomatik yapar

### 5.2 Deployment Adımları

1. CI_Test / CI_Prod build tamamlanır
2. **GH_Repo_TEST / GH_Repo_PROD** Pipelines'dan onaylanır
3. Azure kodu Cloudflare repo'larına push eder
4. Cloudflare build + deploy otomatik yapar

### 5.3 Doğrulama

1. **Cloudflare Dashboard:** [PROD](https://dash.cloudflare.com/2d35926d788c4fac8b00e362a4734323/pages/view/keepnetlabs-dash) | [TEST](https://dash.cloudflare.com/2d35926d788c4fac8b00e362a4734323/pages/view/b0f0e3b160ee002cb69c260b5ed-test-ui)
2. **Deployments** sekmesinde son deployment durumunu kontrol et
3. **Preview URL** veya **Production URL** ile erişim testi yap
4. TEST / PROD canlı URL'leri Cloudflare Dashboard → Project Settings'ten alınır

---

## 6. Rollback Prosedürü

Frontend release'inde sorun yaşanması durumunda aşağıdaki yöntemlerden biri uygulanır. **Öncelik sırası:** 1 → 2 → 3.

### 6.1 Cloudflare Üzerinde Önceki Deployment'a Geri Dönüş

**En hızlı yöntem.** Canlı ortamı hemen eski haline getirir.

1. [PROD](https://dash.cloudflare.com/2d35926d788c4fac8b00e362a4734323/pages/view/keepnetlabs-dash) veya [TEST](https://dash.cloudflare.com/2d35926d788c4fac8b00e362a4734323/pages/view/b0f0e3b160ee002cb69c260b5ed-test-ui) Dashboard'a git
2. **Deployments** sekmesine tıkla
3. Önceki başarılı deployment'ı bul (yeşil ✓)
4. **⋯** (üç nokta) → **Rollback to this deployment**
5. Onayla

---

### 6.2 GitHub Revert Stratejisi

**Seçenek A: Revert commit**

```bash
# Sorunlu commit'i bul
git log --oneline

# Revert oluştur (ters commit)
git revert <commit-hash> -m 1
git push origin test   # veya release/YYYY_MM_DD
```

Pipeline tetiklenir → **GH_Repo_TEST / GH_Repo_PROD onayı** ver → Cloudflare deploy.

**Seçenek B: Önceki release branch veya commit'e dönüş**

```bash
# Önceki release branch'e veya commit hash'e reset
git checkout release/2026_02_21
git reset --hard release/2026_02_18   # veya ilgili commit hash
git push origin release/2026_02_21 --force
```

Pipeline tetiklenir → **GH_Repo_PROD onayı** ver → Cloudflare deploy.

---

### 6.3 Önceki Başarılı Build'e Pipeline Üzerinden Dönüş

Azure DevOps'ta önceki başarılı build'i yeniden deploy etmek için:

1. **Azure DevOps** → **Pipelines** → **KeepnetLabs.UI**
2. **Runs** sekmesinde önceki başarılı build'i bul
3. **⋯** → **Re-run** veya **Retain** (build'in silinmediğinden emin ol)
4. Cloudflare zaten önceki deployment'a geri dönüldüyse ek adım gerekmez; pipeline'ı sadece kaynak kod senkronizasyonu için kullanıyorsan, bu adım opsiyonel

**Not:** Cloudflare kendi build history'sine sahip; Azure pipeline "re-run" yeni build tetikler. Bu yüzden **6.1 Cloudflare Rollback** genelde en pratik yöntemdir.

---

### 6.4 Rollback Sonrası Doğrulama Adımları

| Adım | Kontrol |
|------|---------|
| 1 | Cloudflare Dashboard’da deployment durumu **Success** mı? |
| 2 | Canlı URL’de erişim testi yapıldı mı? |
| 3 | Login, ana sayfa, kritik akışlar çalışıyor mu? |
| 4 | Tarayıcı cache temizlenerek test edildi mi? (Ctrl+Shift+R) |
| 5 | Sorun giderildi mi? İlgili takıma bilgi verildi mi? |

---

**Özet:** Sorun anında → **Cloudflare Rollback** (6.1) ile hızlı geri al. Sonrasında GitHub’da revert commit veya branch reset ile kalıcı düzeltme yap.

---

## 7. TEST → PROD Release Akışı

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. Geliştirme                                                    │
│    feature/44200 → dev (PR) — commit: #44200                      │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ 2. TEST'e Gönder                                                 │
│    dev → test branch merge → CI_Test build → GH_Repo_TEST onayı → Cloudflare Build+Deploy │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ 3. TEST Doğrulama                                               │
│    QA / smoke test → Onay                                        │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ 4. PROD Release                                                 │
│    test'ten release/YYYY_MM_DD branch çık → CI_Prod build → Karşılaştırma → GH_Repo_PROD onayı → Cloudflare Build+Deploy │
└─────────────────────────────────────────────────────────────────┘
```

---

## 8. Gerekli Erişim Bilgileri ve Credential'lar

### 8.1 Azure DevOps

| Kaynak             | Konum                                                                 | Açıklama                       |
| ------------------ | --------------------------------------------------------------------- | ------------------------------ |
| **Repo**           | [KeepnetLabs.UI](https://dev.azure.com/keepnetlabsuk/Keepnet/_git/KeepnetLabs.UI) | Azure Git repo                 |
| Pipeline           | Pipelines → KeepnetLabs.UI                                            | Ana CI/CD pipeline            |
| Variable Groups    | Pipelines → Library → Variable groups  | Test-UI-Config, Prod-UI-Config |
| Service Connection | Project Settings → Service connections | GitHub bağlantısı              |

### 8.2 Variable Groups (Nerede Bulunur)

**Azure DevOps** → **Pipelines** → **Library** → **Variable groups**

| Grup               | İçerik (örnek)            | Kullanım                          |
| ------------------ | ------------------------- | --------------------------------- |
| **Test-UI-Config** | `testGitHubConnectionURL` | GitHub test branch push URL       |
| **Prod-UI-Config** | `prodGitHubConnectionURL` | GitHub production branch push URL |

### 8.3 Config Token'ları (config.Production.js)

`public/config.Production.js` içindeki `#{...}#` token'ları pipeline sırasında değiştirilir:

- `knl_cloud_status`, `knl_google_tag_manager_status`, `knl_sentry_dsn_status`, vb.
- Bu değerler ilgili variable group'lardan alınır

### 8.4 GitHub

| Kaynak      | Konum                                                   |
| ----------- | ------------------------------------------------------- |
| Repo        | https://github.com/Keepnet/KeepnetLabs.UI               |
| Branches    | `test`, `production`, `release/*`                       |
| Credentials | Azure DevOps Service Connection (GitHub PAT veya OAuth) |

### 8.5 Cloudflare

| Ortam    | Cloudflare Pages                                                                                            |
| -------- | ----------------------------------------------------------------------------------------------------------- |
| **PROD** | https://dash.cloudflare.com/2d35926d788c4fac8b00e362a4734323/pages/view/keepnetlabs-dash                    |
| **TEST** | https://dash.cloudflare.com/2d35926d788c4fac8b00e362a4734323/pages/view/b0f0e3b160ee002cb69c260b5ed-test-ui |

---

## 9. Sorun Giderme

### Acil Durum (Hotfix)

Kritik bug PROD'da ise:

1. `test` veya `release/*` branch'inde fix yap
2. Hızlı PR + merge
3. `release/YYYY_MM_DD` branch oluştur (veya mevcut release'a push)
4. CI_Prod build → **GH_Repo_PROD onayı** → Cloudflare deploy
5. Cloudflare Rollback gerekirse: **Bölüm 6.1** — Dashboard → Deployments → Rollback

### Yaygın Sorunlar

| Sorun                  | Kontrol                                                                             |
| ---------------------- | ---------------------------------------------------------------------------------- |
| Pipeline tetiklenmiyor | Branch adı doğru mu? (`test` veya `release/YYYY_MM_DD` örn: `release/2026_02_21`) |
| Build hatası           | `yarn lint`, `yarn test:unit` lokal çalıştır                                      |
| GitHub push hatası     | Service Connection ve PAT geçerliliğini kontrol et                                |
| Cloudflare deploy yok  | GH_Repo_TEST / GH_Repo_PROD onayı verildi mi? Azure push tamamlandı mı? Cloudflare Dashboard kontrol et |
| Config hatalı          | Variable group'lardaki token değerlerini kontrol et                               |

---

## 10. Release Sonrası Kontrol Listesi

- [ ] Pipelines'da GH_Repo_TEST *(TEST)* / GH_Repo_PROD *(PROD)* stage onayı verildi mi?
- [ ] Azure'da önceki release ile karşılaştırma raporu incelendi mi? *(PROD)*
- [ ] Cloudflare PROD deployment başarılı mı?
- [ ] Canlı ortamda smoke test yapıldı mı?
- [ ] Kritik akışlar (login, ana sayfa) test edildi mi?
- [ ] İlgili takıma release tamamlandı bilgisi verildi mi?

### Başarı Kriterleri

Release başarılı sayılır:

- Cloudflare deployment durumu **Success**
- Canlı URL erişilebilir
- Login ve ana sayfa çalışıyor
- Kritik akışlarda regresyon yok

---

## 11. Hızlı Referans

```bash
# Yeni feature başlat (task ID: 44200)
git checkout dev && git pull
git checkout -b feature/44200
# Commit'lerde #44200 formatı kullan: git commit -m "#44200 açıklama"

# Feature → dev (PR merge sonrası)
# dev'den test branch aç
git checkout dev && git pull
git checkout -b test
git push origin test
# → Azure Pipelines'da CI_Test build sonrası GH_Repo_TEST onayı ver

# PROD'a release (tarih: YYYY_MM_DD, örn: 2026_02_21)
git checkout test && git pull
git checkout -b release/2026_02_21
git push origin release/2026_02_21
# → Azure Pipelines'da CI_Prod build + karşılaştırma sonrası GH_Repo_PROD onayı ver
```

---

## Doküman Geçmişi

| Versiyon | Tarih | Değişiklik |
|----------|-------|------------|
| 1.0 | 2026-02-22 | İlk sürüm — Branch stratejisi, CI/CD, Rollback, Sorun giderme, Task ID (#44200), Release karşılaştırma |

---

## İlgili Kaynaklar

| Kaynak | Link |
|--------|------|
| Azure Repo | [KeepnetLabs.UI](https://dev.azure.com/keepnetlabsuk/Keepnet/_git/KeepnetLabs.UI) |
| GitHub Repo | [Keepnet/KeepnetLabs.UI](https://github.com/Keepnet/KeepnetLabs.UI) |
| Cloudflare PROD | [Dashboard](https://dash.cloudflare.com/2d35926d788c4fac8b00e362a4734323/pages/view/keepnetlabs-dash) |
| Cloudflare TEST | [Dashboard](https://dash.cloudflare.com/2d35926d788c4fac8b00e362a4734323/pages/view/b0f0e3b160ee002cb69c260b5ed-test-ui) |

*Bu runbook periyodik olarak güncellenmeli. Değişiklik önerileri için ilgili ekip ile iletişime geçin.*

---
