# githab9# ChainEstate

ChainEstate - blockchain uslubidagi ko'chmas mulk registri uchun tayyorlangan frontend demo platforma.

## Imkoniyatlar

- uy, yer va ofisni blockchain ledgerga ro'yxatdan o'tkazadi
- mulk egasini tekshiradi va verifikatsiya statusini saqlaydi
- mulkni sotish yoki boshqa shaxsga o'tkazishni qayd etadi
- hujjatlarni hash bilan birga blockchain tarixiga bog'laydi
- ma'lumotlarga kim kirishi mumkinligini belgilaydi
- mulkning to'liq audit trail tarixini ko'rsatadi

## Texnologiya

- HTML
- CSS
- Vanilla JavaScript
- `localStorage` asosidagi demo blockchain ledger

## Ishga tushirish

`index.html` ni brauzerda ochish kifoya. Agar lokal server bilan ishlatmoqchi bo'lsangiz:

```powershell
py -m http.server 5500
```

So'ng `http://localhost:5500` ni oching.

## GitHub ga joylash

```powershell
git init
git add .
git commit -m "feat: build ChainEstate blockchain real estate demo"
git branch -M main
git remote add origin https://github.com/<username>/chain-estate.git
git push -u origin main
```

## Free deploy

### GitHub Pages

1. Repoga push qiling.
2. `Settings -> Pages` bo'limiga kiring.
3. `Deploy from a branch` ni tanlang.
4. `main` va `/root` ni belgilang.

### Netlify

1. Repo import qiling.
2. Build command bo'sh qolsin.
3. Publish directory `.` bo'lsin.

### Vercel

1. Repo import qiling.
2. Framework preset `Other`.
3. Build command kerak emas.
4. Output directory `./`.

## Eslatma

Bu MVP/demo. Production uchun backend, haqiqiy smart contract, IPFS yoki cloud storage, autentifikatsiya va davlat API integratsiyasi kerak bo'ladi.
