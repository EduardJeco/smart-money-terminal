# Smart Money Intelligence Terminal
### Powered by Claude Opus 4 + Extended Thinking

---

## 🚀 Deploy ke Vercel (5 Menit)

### Step 1: Upload ke GitHub
1. Buat akun di https://github.com jika belum punya
2. Buat repository baru → klik "New" → nama: `smart-money-terminal`
3. Upload semua file ini ke repository tersebut
   - Bisa drag & drop via GitHub web interface

### Step 2: Connect ke Vercel
1. Buka https://vercel.com → Sign up dengan GitHub
2. Klik "Add New Project"
3. Pilih repository `smart-money-terminal`
4. Klik **Deploy** (settings default sudah benar)

### Step 3: Tambah API Key
1. Di Vercel dashboard → pilih project kamu
2. Klik **Settings** → **Environment Variables**
3. Tambah:
   - **Name**: `ANTHROPIC_API_KEY`
   - **Value**: `sk-ant-api03-...` (API key kamu)
4. Klik **Save**
5. Klik **Redeploy** di tab Deployments

### Step 4: Akses Terminal
✅ Kamu dapat URL permanen: `https://smart-money-terminal-xxx.vercel.app`
✅ Akses dari browser manapun, kapanpun
✅ Tidak perlu buka terminal lagi

---

## 💡 Cara Menggunakan

1. **Masukkan ticker** asset yang ingin dianalisis (BTC, AAPL, ES1!, dll)
2. **Pilih module** analisis yang diinginkan
3. **Paste data** market intel di text area:
   - Data price action & volume
   - Berita terkait asset
   - Whale transaction alerts
   - 13F filing data
   - Open interest changes
   - Apapun yang relevan
4. Klik **Execute Analysis**
5. Claude Opus 4 dengan Extended Thinking akan:
   - Menganalisis institutional flow
   - Mendeteksi liquidity grabs
   - Memberikan Market Integrity Score 0-100
   - Memberikan strategic intelligence

---

## 🔧 Cara Update Aplikasi

Kalau mau ubah sesuatu:
1. Edit file di GitHub langsung (klik file → edit icon)
2. Commit perubahan
3. Vercel otomatis re-deploy dalam ~1 menit

---

## 📊 Contoh Data Input

```
BTC/USD — Current Price: $67,420
Timeframe: 4H

Volume Analysis:
- Spot volume last 4h: 2.3B
- Futures OI change: +340M (significant increase)
- Large transactions (>100 BTC): 23 detected
  - 2,400 BTC moved from cold wallet to Binance (BEARISH signal)
  - 800 BTC moved Binance → unknown wallet (BULLISH signal)

Coinbase Premium: -0.8% (institutional selling pressure)
Korea Premium (Kimchi): +1.2%

News:
- BlackRock IBIT ETF inflow: $240M today (vs avg $180M)
- CPI data tomorrow — consensus 3.1% YoY
- Whale alert: Satoshi-era wallet moved 500 BTC after 10 years

Funding Rate: +0.01% (slightly bullish, not overheated)
Liquidation Heatmap: Large cluster at $65,800 and $69,500
```

---

## ⚠️ Disclaimer
Ini adalah alat analisis AI. Bukan financial advice. Selalu gunakan money management dan risk management yang proper.
