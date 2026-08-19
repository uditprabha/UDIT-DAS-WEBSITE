function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Leads");
    if (!sheet) sheet = ss.insertSheet("Leads");

    var headers = [
      "Timestamp",
      "Name",
      "Business Name",
      "Business Type",
      "City",
      "WhatsApp",
      "Email",
      "Current Website",
      "Need",
      "Message",
      "Selected Demo",
      "UTM Source",
      "UTM Medium",
      "UTM Campaign",
      "UTM Content"
    ];

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
      sheet.setFrozenRows(1);
    }

    var data = {};
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    sheet.appendRow([
      new Date(),
      data.name || "",
      data.business_name || "",
      data.business_type || "",
      data.city || "",
      data.whatsapp || "",
      data.email || "",
      data.current_website || "",
      data.need || "",
      data.message || "",
      data.selected_demo || "",
      data.utm_source || "",
      data.utm_medium || "",
      data.utm_campaign || "",
      data.utm_content || ""
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ result: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", error: String(error) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService.createTextOutput("Udit Das lead form is live.");
}
