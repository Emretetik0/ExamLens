# ExamLens - PDR Öğretmeni Öğrenci Performans Analiz Sistemi

ExamLens, PDR rehber öğretmenlerinin öğrencilerin deneme sınavı performanslarını incelemesi, trend analizi yapması ve risk grubunda olan öğrencileri anlık tespit edebilmesi için geliştirilmiş bir Single-User Web Uygulamasıdır.

## 🚀 Proje Hakkında

Öğretmenler Excel ortamındaki notları kolayca içe aktararak, sistemin algoritması sayesinde matematik zayıflığı, genel düşüş trendi, not tutarsızlığı veya ani düşüşler yaşayan (kritik) öğrencileri otomatik olarak görüntüleyebilirler.

- **Mimari:** Next.js 16 (App Router), Feature-Based Structure, Clean Architecture (Domain Services)
- **Teknolojiler:** TypeScript, Zustand (Global State), Tailwind CSS v4, Recharts, Zod, xlsx
- **Production-Ready:** Uygulama build esnasında hata fırlatmayan, tam optimize çalışan ve "deployment-ready" konseptiyle üretilmiş bir sistemdir.

---

## 🛠️ Kurulum Talimatları (Local Development)

Uygulamayı kendi bilgisayarınızda çalıştırmak için:

1. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```

2. Development Server'ı ayağa kaldırın:
   ```bash
   npm run dev
   ```

3. Browser'da [http://localhost:3000](http://localhost:3000) adresine gidin. Veriler mock formatta otomatik hazır gelir. İstendiğinde "Veri Yükle" panelinden Excel yüklenebilir.

---

## 🏗️ Build & Production Mode

Sistemi local üzerinde production benzeri (optimize edilmiş) halde çalıştırmak için:

1. Uygulamayı derleyin:
   ```bash
   npm run build
   ```

2. Production modunda başlatın:
   ```bash
   npm run start
   ```

---

## 📦 Deployment (Vercel, Netlify, Render)

ExamLens, modern statik ve dinamik rota optimizasyonuna sahip olduğu için her tür Cloud Node provider'ına hata üretmeden saniyeler içinde deploy edilebilir.

### Vercel'e Nasıl Deploy Edilir? (Öncelikli)

1. Vercel hesabınıza (https://vercel.com) giriş yapın.
2. Dashboard üzerinden **"Add New" -> "Project"** adımlarını izleyin.
3. Projenin yüklü olduğu GitHub reposunu seçin ve "Import" butonuna tıklayın.
4. **Build Settings:**
   - Framework Preset otomatik olarak `Next.js` algılanacaktır.
   - Build Command: `npm run build`
   - Output Directory: `.next` VEYA otomatikte bırakın.
   - Install Command: `npm install`
5. **Environment Variables (.env):**
   - Gelecekte ekleyeceğiniz API Key veya Gizli kimlik verileri olursa, kurulum sırasındaki "Environment Variables" toggle'ını açarak (Örn: NEXT_PUBLIC_API_URL = "...") eklemeleri yapınız. (Mevcut versiyonda tüm mantık Client Store + Domain Service üzerinden işlediği için gerekli değildir).
6. **"Deploy"** butonuna tıklayın. Build başarıyla geçecek ve size yayında olan projenin linkini verecektir!

### Netlify

1. Platforma giriş yapıp "Add new site" -> "Import an existing project" diyin.
2. GitHub deponuzu bağlayın.
3. Build Configuration kısmında komutu otomatik olarak `npm run build` görecektir. "Deploy Data" aşamalarını onaylayın.
