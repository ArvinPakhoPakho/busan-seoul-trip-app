# Browser check notes

## 檢查時間
2026-04-20 14:31 GMT+8

## 觀察結果
- 首頁成功顯示：hero、城市章節、Day 1~Day 4 切換、篩選 chip、行程卡片、編輯按鈕都已渲染。
- 視覺方向符合「港灣貼紙日記」：奶油黃、海鹽藍、手帳卡片感與可愛鴨鴨元素都已出現。
- PDF 尾段主線與新加必食 Burger Yo 已出現在 Day 1 列表。
- 頁面底部有開發環境提示條（Preview mode / not live），屬管理介面覆蓋，不代表正式站點設計本身。

## 問題
- 地圖區塊目前顯示 fallback 文案：
  - 「這個日期目前沒有可定位的地點。你可以先在下方編輯卡片補上地址，地圖便會自動顯示。」
- 但實際上 Day 1 多個項目已具備地址或可搜尋字串，因此推測是地圖定位流程未成功更新 resolvedLocations。
- Browser console 未見報錯，表示問題較可能在 geocoding promise 使用方式、地圖 script lifecycle，或 marker / geocoder API 兼容性，而不是明顯 runtime crash。

## 後續動作
- 優先檢查 TripMap.tsx 的 geocoder 使用方式。
- 若 geocoder promise 回傳型別與目前寫法不一致，改為 callback 包裝 promise。
- 重新編譯後再檢查地圖點位是否成功顯示。

## 第二輪檢查補充

經直接在頁面內測試 geocoder 後，`Bupyeong Kkangtong Market, Busan` 可以成功解析，並回傳 `39 Bupyeong 1-gil, Jung-gu, Busan, South Korea`。

重新檢視頁面後，地圖資訊卡已從 fallback 文案改為正常狀態，並顯示：

- 地圖焦點：Egg Drop 南浦店早餐
- 地址：Egg Drop Nampo, Busan

這表示地圖定位流程本身已開始工作，較可能只是首輪頁面讀取時 geocoding 尚未完成，因此被過早捕捉到 fallback 狀態。後續仍建議再檢查手機操作與編輯流程，但目前地圖模組已非阻塞問題。

## 第三輪檢查補充

切換到 Day 3 後，頁面已正確顯示：

- 晚間雙分支切換：
  - 動物咖啡廳版
  - Pass 汗蒸幕版
- 必食項目 `Dyupeullit 海雲台 Haeridan Gil 草莓蛋糕`
- 海雲台拍照主線：X the SKY、星巴克、Arte Museum、ClubD Oasis
- 地圖上亦已有對應 marker，可直接看出清單與地圖聯動成功。

打開 Dyupeullit 的編輯器後，已確認可編輯以下核心欄位：

- 項目名稱
- 時間
- 地區
- 地址 / 地圖搜尋字串
- 類別
- 優先度
- 移動到哪一天
- Day 3 分支
- 描述
- 原句筆記
- 刪除項目

因此，用戶要求的「方便修改 / 調動行程」核心功能已經成立，且資料結構亦足以支援日後加入首爾行程。
