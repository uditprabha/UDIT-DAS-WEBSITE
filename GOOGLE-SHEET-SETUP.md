# Send booking leads to Google Sheets

Do this once in your Google account. Takes about 3 minutes.

## 1. Create the sheet

1. Open [Google Sheets](https://sheets.google.com) and sign in.
2. Click **Blank spreadsheet**.
3. Name it `Udit Das Website Leads`.
4. Rename the first tab to `Leads` (bottom-left, double-click).

## 2. Add the script

1. In that sheet: **Extensions → Apps Script**.
2. Delete any code already in the editor.
3. Open `google-apps-script/Code.gs` from this project and paste all of it.
4. Click the disk **Save**. Name the project `Website Leads`.

## 3. Publish the web app

1. Click **Deploy → New deployment**.
2. Click the gear next to **Select type** → **Web app**.
3. Fill in:
   - Description: `Lead form`
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Click **Deploy**.
5. Authorize with your Google account. If you see “Google hasn’t verified this app”:
   - Click **Advanced**
   - Click **Go to Website Leads (unsafe)**
   - Click **Allow**
6. Copy the **Web app URL**. It looks like:
   `https://script.google.com/macros/s/AKfycb..../exec`

## 4. Connect this website

1. Open `js/config.js`.
2. Paste the URL:

```js
window.UDIT_SHEET_URL = "https://script.google.com/macros/s/YOUR_ID/exec";
```

3. Save the file and refresh the site.
4. Submit a test lead. A new row should appear in the `Leads` tab within a few seconds.

## Notes

- If you edit the script later, use **Deploy → Manage deployments → Edit → New version**.
- Keep **Who has access** set to **Anyone** or the form cannot write from the website.
- You can share the sheet with yourself / a VA. Do not make the sheet public unless you want to.
