// ============================================================
// ProtecTEEN Unified System — Google Apps Script Backend
// Serves as REST API for the Vue.js frontend on Vercel
// ============================================================

// --- Spreadsheet IDs ---
// Replace these with your actual Google Spreadsheet IDs
const SPREADSHEET_IDS = {
  profiling: 'YOUR_PROFILING_SPREADSHEET_ID',
  amvat:     'YOUR_AMVAT_SPREADSHEET_ID'
};

const REGION_MAP = {
  'III':  'III',
  'VI':   'VI',
  'X':    'X',
  'NCR':  'NCR',
  'IV-A': 'IV-A'
};
 
// ── Target per region (edit here to update dashboard targets) ──
const REGION_TARGETS = {
  'III':  200,
  'VI':   200,
  'X':    200,
  'NCR':  200,
  'IV-A': 200,
  'TOTAL': 1000
};
 
// ============================================================
// ROUTING
// ============================================================
 
function doGet(e) {
  const action = e?.parameter?.action || '';
  const q      = e?.parameter?.q      || '';
  let result;
  try {
    if      (action === 'getLocationDB')   result = getLocationDB();
    else if (action === 'getDashboard')    result = getDashboard();
    else if (action === 'searchProfiling') result = searchProfiling(q);
    else if (action === 'searchAMVAT')     result = searchAMVAT(q);
    else result = { success: false, error: 'Unknown GET action: ' + action };
  } catch (err) {
    result = { success: false, error: err.toString() };
  }
  return buildResponse(result);
}
 
function doPost(e) {
  let body;
  try { body = JSON.parse(e.postData.contents); }
  catch (err) { return buildResponse({ success: false, error: 'Invalid JSON body' }); }
 
  const action = body.action || '';
  let result;
  try {
    if      (action === 'submitProfiling')    result = submitProfiling(body.data);
    else if (action === 'submitNotQualified') result = submitNotQualified(body.data);
    else if (action === 'submitAMVAT')        result = submitAMVAT(body.data);
    else if (action === 'searchProfiling')    result = searchProfiling(body.searchTerm);
    else result = { success: false, error: 'Unknown POST action: ' + action };
  } catch (err) {
    Logger.log('Error in doPost [' + action + ']: ' + err.toString());
    result = { success: false, error: err.toString() };
  }
  return buildResponse(result);
}
 
function buildResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
 
// ============================================================
// LOCATION DB
// ============================================================
 
function getLocationDB() {
  try {
    const cache = CacheService.getScriptCache();
    const cached = cache.get('locationDB');
    if (cached) return JSON.parse(cached);
 
    const ss = SpreadsheetApp.openById(SPREADSHEET_IDS.profiling);
    const sheet = ss.getSheetByName('LocationDB');
    if (!sheet) return { success: false, error: 'LocationDB sheet not found' };
 
    const data = sheet.getDataRange().getValues();
    const db = {};
    for (let i = 1; i < data.length; i++) {
      const [region, province, municipality, barangay] = data[i];
      if (!region || !province || !municipality || !barangay) continue;
      if (!db[region]) db[region] = {};
      if (!db[region][province]) db[region][province] = {};
      if (!db[region][province][municipality]) db[region][province][municipality] = [];
      if (!db[region][province][municipality].includes(barangay))
        db[region][province][municipality].push(barangay);
    }
    cache.put('locationDB', JSON.stringify(db), 21600);
    return db;
  } catch (err) {
    Logger.log('getLocationDB error: ' + err.toString());
    return {};
  }
}
 
// ============================================================
// DUPLICATE DETECTION HELPER
// ============================================================
 
function checkDuplicate(ss, formData) {
  // Check all region sheets for a name + birthdate match
  const firstName = (formData.first_name || '').toLowerCase().trim();
  const lastName  = (formData.last_name  || '').toLowerCase().trim();
  const birthDate = (formData.birth_date || '').trim();
 
  for (const region of Object.keys(REGION_MAP)) {
    const sheet = ss.getSheetByName(REGION_MAP[region]);
    if (!sheet || sheet.getLastRow() <= 1) continue;
 
    const data    = sheet.getDataRange().getValues();
    const headers = data[0].map(h => String(h).trim());
    const fnCol   = headers.indexOf('First Name');
    const lnCol   = headers.indexOf('Last Name');
    const dobCol  = headers.indexOf('Date of Birth');
 
    if (fnCol === -1 || lnCol === -1) continue;
 
    for (let i = 1; i < data.length; i++) {
      const fn  = (data[i][fnCol]  || '').toString().toLowerCase().trim();
      const ln  = (data[i][lnCol]  || '').toString().toLowerCase().trim();
      const dob = dobCol !== -1 ? (data[i][dobCol] || '').toString().trim() : '';
 
      // Match: same first+last name AND same birth date
      if (fn === firstName && ln === lastName && (dob === birthDate || !birthDate)) {
        return {
          isDuplicate: true,
          existingRegion: region,
          existingName: `${data[i][fnCol]} ${data[i][lnCol]}`,
          existingRow: i + 1,
          message: `Duplicate detected: ${data[i][fnCol]} ${data[i][lnCol]} is already profiled in Region ${region} (row ${i + 1}).`
        };
      }
    }
  }
  return { isDuplicate: false };
}
 
// ============================================================
// SUBMIT PROFILING — with duplicate check
// ============================================================
 
function submitProfiling(formData) {
  if (!formData) throw new Error('No form data received');
 
  const sheetName = REGION_MAP[formData.region];
  if (!sheetName) throw new Error('No matching sheet for region: ' + formData.region);
 
  const ss = SpreadsheetApp.openById(SPREADSHEET_IDS.profiling);
 
  // ── Duplicate Check ──
  const dupCheck = checkDuplicate(ss, formData);
  if (dupCheck.isDuplicate) {
    return {
      success: false,
      duplicate: true,
      error: dupCheck.message,
      existingRegion: dupCheck.existingRegion,
      existingName: dupCheck.existingName
    };
  }
 
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    addProfilingHeaders(sheet);
  }
 
  const today    = new Date();
  const dateOnly = Utilities.formatDate(today, Session.getScriptTimeZone(), 'MM-dd-yyyy');
  const toStr    = (val) => Array.isArray(val) ? val.join(', ') : (val || '');
 
  sheet.appendRow([
    dateOnly,
    formData.fourPs             || '',
    formData.slp                || '',
    formData.ip_membership      || '',
    formData.household_number   || '',
    formData.first_name         || '',
    formData.middle_name        || '',
    formData.last_name          || '',
    formData.region             || '',
    formData.province           || '',
    formData.municipality_city  || '',
    formData.barangay           || '',
    formData.street_address     || '',
    formData.sitio_purok        || '',
    formData.contact            || '',
    formData.civil_status       || '',
    formData.religion           || '',
    formData.family_head        || '',
    formData.has_child          || '',
    formData.number_children    || '',
    formData.with_partner       || '',
    formData.birth_date         || '',
    formData.sex                || '',
    formData.education          || '',
    formData.occupation         || '',
    formData.occupation_class   || '',
    formData.disability_special || '',
    formData.critical_illness   || '',
    formData.house_type         || '',
    formData.roof_material      || '',
    formData.outer_wall         || '',
    formData.tenure_status      || '',
    formData.toilet_facility    || '',
    formData.water_supply       || '',
    formData.garbage_disposal   || '',
    formData.electricity        || '',
    formData.health_condition   || '',
    formData.health_services    || '',
    toStr(formData.give_birth),
    toStr(formData.pre_post_care),
    formData.died_pregnancy     || '',
    formData.child_died         || '',
    formData.childhood_care     || '',
    formData.family_planning    || '',
    toStr(formData.fam_plan_method),
    toStr(formData.fam_plan_reason),
    toStr(formData.natural_disasters),
    toStr(formData.human_hazards),
    formData.forced_displacement || '',
    toStr(formData.violence),
    toStr(formData.vices),
  ]);
 
  if (formData.family_members && formData.family_members.length > 0) {
    saveFamilyMembers(ss, formData);
  }
 
  return { success: true, message: `Profiling data saved to sheet "${sheetName}".` };
}
 
function addProfilingHeaders(sheet) {
  const headers = [
    'Date Submitted','4Ps Member','SLP Beneficiary','IP Membership','Household Number',
    'First Name','Middle Name','Last Name','Region','Province','Municipality/City',
    'Barangay','Street Address','Sitio/Purok','Contact','Civil Status','Religion',
    'Family Head','Has a child','How many children','Living with partner','Date of Birth',
    'Sex','Education','Occupation','Class of Worker','Disability/Special Needs',
    'Critical Illness','House Type','Roof Material','Outer Wall','Tenure Status',
    'Toilet Facility','Water Supply','Garbage Disposal','Electricity',
    'Health Condition','Health Services','Where give birth','Pre/Post Natal Care',
    'Died in Pregnancy','Child Died','Childhood Care (ECCD)','Family Planning',
    'Family Planning Method','Reason Not Using FP','Natural Disasters','Human Hazards',
    'Forced Displacement','Violence','Vices'
  ];
  sheet.appendRow(headers);
  const range = sheet.getRange(1, 1, 1, headers.length);
  range.setBackground('#7c3aed');
  range.setFontColor('#ffffff');
  range.setFontWeight('bold');
}
 
// ============================================================
// FAMILY MEMBERS
// ============================================================
 
function saveFamilyMembers(ss, formData) {
  let sheet = ss.getSheetByName('FamilyMembers');
  if (!sheet) {
    sheet = ss.insertSheet('FamilyMembers');
    const headers = [
      'Date Submitted','Household Number','Respondent Name',
      'Member First Name','Member Middle Name','Member Last Name','Member Ext Name',
      'Birthday','Sex','Pregnant Status','Relationship to Family Head',
      'Civil Status','Marriage Planning','Religion','Indigenous Group','IP Group',
      'Disability/Special Needs','Critical Illness','Attending School',
      'Highest Education','Currently Employed','OFW','Occupation',
      'Class of Worker','Nature of Employment','Basis of Payment',
      'Unemployment Status','Solo Parent'
    ];
    sheet.appendRow(headers);
    const range = sheet.getRange(1, 1, 1, headers.length);
    range.setBackground('#7c3aed');
    range.setFontColor('#ffffff');
    range.setFontWeight('bold');
  }
 
  const today = new Date();
  const dateOnly = Utilities.formatDate(today, Session.getScriptTimeZone(), 'MM-dd-yyyy');
  const respondentName = [formData.first_name, formData.middle_name, formData.last_name].filter(Boolean).join(' ');
 
  formData.family_members.forEach(member => {
    const birthday = [member.birth_month, member.birth_day, member.birth_year].filter(Boolean).join(' ');
    const toStr = (val) => Array.isArray(val) ? val.join(', ') : (val || '');
    sheet.appendRow([
      dateOnly, formData.household_number, respondentName,
      member.first_name || '', member.middle_name || '', member.last_name || '', member.ext_name || '',
      birthday, member.sex || '', member.pregnant_status || '', member.relationship || '',
      member.civil_status || '', member.marriage_planning || '', member.religion || '',
      member.indigenous || '', member.ip_group || '',
      toStr(member.disability), toStr(member.critical_illness),
      member.attending_school || '', member.education || '', member.employed || '', member.ofw || '',
      member.occupation || '', member.class_worker || '', member.nature_employment || '',
      member.basis_payment || '', member.unemployment_status || '', member.solo_parent || '',
    ]);
  });
}
 
// ============================================================
// NOT QUALIFIED
// ============================================================
 
function submitNotQualified(formData) {
  if (!formData) throw new Error('No form data received');
 
  const ss = SpreadsheetApp.openById(SPREADSHEET_IDS.profiling);
  let sheet = ss.getSheetByName('not_qualified_response');
 
  if (!sheet) {
    sheet = ss.insertSheet('not_qualified_response');
    const headers = [
      'Date Submitted','Qualification Status / Reasons','Household Number',
      'First Name','Middle Name','Last Name','Region','Province','Municipality/City',
      'Barangay','Street Address','Sitio/Purok','Contact','Civil Status','Religion',
      'Family Head','Has Child','Number of Children','With Partner',
      'Birth Date','Age','Sex','Education','Occupation','Occupation Class',
      'Disability/Special Needs','Critical Illness','4Ps Member','SLP Beneficiary','IP Membership'
    ];
    sheet.appendRow(headers);
    const range = sheet.getRange(1, 1, 1, headers.length);
    range.setBackground('#ff9800');
    range.setFontColor('#ffffff');
    range.setFontWeight('bold');
  }
 
  let age = '';
  if (formData.birth_date) {
    const parts = formData.birth_date.split('-');
    if (parts.length === 3) {
      const byear = parseInt(parts[0]), bmonth = parseInt(parts[1]) - 1, bday = parseInt(parts[2]);
      const today = new Date();
      let ageYears = today.getFullYear() - byear;
      if (today.getMonth() < bmonth || (today.getMonth() === bmonth && today.getDate() < bday)) ageYears--;
      age = ageYears;
    }
  }
 
  const reasons = [];
  if (formData.fourPs === 'Yes') reasons.push('4Ps member');
  if (formData.has_child === 'No') reasons.push('Does not have a living child');
  if (parseInt(formData.number_children) === 0) reasons.push('Does not have children');
  if (age !== '' && age > 19) reasons.push(`Age is ${age} (must be 19 or below)`);
  if (formData.with_partner === 'Yes' && age <= 17 && age > 0)
    reasons.push(`Living with partner at age ${age} (must be 18–19)`);
 
  const status = reasons.length > 0 ? 'NOT QUALIFIED: ' + reasons.join('; ') : 'Not Qualified';
  const today = new Date();
  const dateOnly = Utilities.formatDate(today, Session.getScriptTimeZone(), 'MM-dd-yyyy');
 
  sheet.appendRow([
    dateOnly, status,
    formData.household_number || '', formData.first_name || '', formData.middle_name || '',
    formData.last_name || '', formData.region || '', formData.province || '',
    formData.municipality_city || '', formData.barangay || '', formData.street_address || '',
    formData.sitio_purok || '', formData.contact || '', formData.civil_status || '',
    formData.religion || '', formData.family_head || '', formData.has_child || '',
    formData.number_children || '', formData.with_partner || '', formData.birth_date || '',
    age, formData.sex || '', formData.education || '', formData.occupation || '',
    formData.occupation_class || '', formData.disability_special || '',
    formData.critical_illness || '', formData.fourPs || '', formData.slp || '',
    formData.ip_membership || '',
  ]);
 
  return { success: true, message: 'Response saved as Not Qualified.' };
}
 
// ============================================================
// SUBMIT AMVAT
// ============================================================
 
function submitAMVAT(data) {
  if (!data) throw new Error('No AMVAT data received');
 
  const region = data.profile?.region;
  const sheetName = REGION_MAP[region];
  if (!sheetName) throw new Error('No matching AMVAT sheet for region: ' + region);
 
  const ss = SpreadsheetApp.openById(SPREADSHEET_IDS.amvat);
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) { sheet = ss.insertSheet(sheetName); addAMVATHeaders(sheet); }
 
  const today    = new Date();
  const dateOnly = Utilities.formatDate(today, Session.getScriptTimeZone(), 'MM-dd-yyyy');
 
  const row = [
    dateOnly,
    data.profile?.name              || '',
    data.profile?.region            || '',
    data.profile?.province          || '',
    data.profile?.municipality_city || '',
    data.profile?.barangay          || '',
    data.profile?.street_sitio      || '',
    data.profile?.contact           || '',
    data.profile?.civilStatus       || '',
    data.profile?.hasChild          || '',
    data.profile?.numChildren       || '',
    data.profile?.livingWithPartner || '',
    data.profile?.religion          || '',
    data.profile?.dateOfBirth       || '',
    data.profile?.education         || '',
    data.profile?.occupation        || '',
  ];
 
  for (let i = 1; i <= 25; i++) row.push(data.responses?.['q' + i] || '');
 
  row.push(data.profile?.child_disability  || '');
  row.push(data.profile?.mother_disability || '');
  row.push(data.profile?.living_parents    || '');
  row.push(data.profile?.violence          || '');
  row.push(data.profile?.age               || '');
  row.push(data.profile?.income_source     || '');
  row.push(data.profile?.education_skills  || '');
 
  const s = data.scores || {};
  row.push(s.empowerment?.score || '', s.empowerment?.interpretation || '');
  row.push(s.pregnancy?.score   || '', s.pregnancy?.interpretation   || '');
  row.push(s.health?.score      || '', s.health?.interpretation      || '');
  row.push(s.education?.score   || '', s.education?.interpretation   || '');
  row.push(s.support?.score     || '', s.support?.interpretation     || '');
  row.push(s.mentalhealth?.score || '', s.mentalhealth?.interpretation || '');
 
  row.push(s.subtotal || '');
  row.push(s.deductions?.childDisability  || 0);
  row.push(s.deductions?.motherDisability || 0);
  row.push(s.deductions?.livingParents    || 0);
  row.push(s.deductions?.violence         || 0);
  row.push(s.deductions?.age             || 0);
  row.push(s.deductions?.incomeSource    || 0);
  row.push(s.deductions?.educationSkills || 0);
  row.push(s.totalDeduction              || 0);
  row.push(s.total?.score                || '');
  row.push(s.total?.interpretation       || '');
 
  sheet.appendRow(row);
  return { success: true, message: `AMVAT assessment saved to sheet "${sheetName}".` };
}
 
function addAMVATHeaders(sheet) {
  const headers = [
    'Date','Name','Region','Province','Municipality/City','Barangay',
    'Street/Sitio/Purok','Contact','Civil Status','Has Child','Num Children',
    'Living with Partner','Religion','Date of Birth','Education','Occupation',
    'Q1','Q2','Q3','Q4','Q5','Q6','Q7','Q8','Q9','Q10',
    'Q11','Q12','Q13','Q14','Q15','Q16','Q17','Q18','Q19','Q20',
    'Q21','Q22','Q23','Q24','Q25',
    'Child Disability/Illness','Mother Disability/Illness','Living Parents',
    'Abuse/Violence','Age at first Birth','Income Source','Education Status',
    'Empowerment Score','Empowerment Interpretation',
    'Pregnancy Score','Pregnancy Interpretation',
    'Health Score','Health Interpretation',
    'Education Score','Education Interpretation',
    'Support Score','Support Interpretation',
    'Mental Health Score','Mental Health Interpretation',
    'Part I Subtotal',
    'Child Disability Deduction','Mother Disability Deduction','Living Parents Deduction',
    'Violence Deduction','Age Deduction','Income Deduction','Education Deduction',
    'Total Deduction','Final Total Score','Overall Interpretation'
  ];
  sheet.appendRow(headers);
  const range = sheet.getRange(1, 1, 1, headers.length);
  range.setBackground('#7c3aed');
  range.setFontColor('#ffffff');
  range.setFontWeight('bold');
}
 
// ============================================================
// SEARCH PROFILING
// ============================================================
 
function searchProfiling(searchTerm) {
  if (!searchTerm || searchTerm.trim().length < 2)
    return { success: false, error: 'Search term too short', results: [] };
 
  searchTerm = searchTerm.toLowerCase().trim();
  const ss = SpreadsheetApp.openById(SPREADSHEET_IDS.profiling);
  const results = [];
 
  Object.keys(REGION_MAP).forEach(region => {
    const sheet = ss.getSheetByName(REGION_MAP[region]);
    if (!sheet || sheet.getLastRow() <= 1) return;
 
    const data    = sheet.getDataRange().getValues();
    const headers = data[0].map(h => String(h).trim());
    const col = {
      fn:  headers.indexOf('First Name'),
      mn:  headers.indexOf('Middle Name'),
      ln:  headers.indexOf('Last Name'),
      reg: headers.indexOf('Region'),
      prov:headers.indexOf('Province'),
      mun: headers.indexOf('Municipality/City'),
      bar: headers.indexOf('Barangay'),
      dob: headers.indexOf('Date of Birth'),
      con: headers.indexOf('Contact'),
    };
    if (col.fn === -1 || col.ln === -1) return;
 
    for (let i = 1; i < data.length && results.length < 30; i++) {
      const row = data[i];
      const fn  = (row[col.fn] || '').toString().toLowerCase();
      const mn  = (row[col.mn] || '').toString().toLowerCase();
      const ln  = (row[col.ln] || '').toString().toLowerCase();
      const full = `${fn} ${mn} ${ln}`.replace(/\s+/g, ' ').trim();
      if (!fn.includes(searchTerm) && !ln.includes(searchTerm) && !full.includes(searchTerm)) continue;
 
      results.push({
        rowIndex: i + 1,
        fullName: `${row[col.fn]||''} ${row[col.mn]||''} ${row[col.ln]||''}`.replace(/\s+/g,' ').trim(),
        region:   row[col.reg] || region,
        province: row[col.prov] || '',
        municipality: row[col.mun] || '',
        barangay: row[col.bar] || '',
        birthDate: col.dob !== -1 ? (row[col.dob] || '').toString() : '',
        contact:  col.con !== -1 ? (row[col.con] || '').toString() : '',
      });
    }
  });
 
  return { success: true, results, count: results.length };
}
 
// ============================================================
// SEARCH AMVAT — for duplicate/assessed check
// ============================================================
 
function searchAMVAT(searchTerm) {
  if (!searchTerm || searchTerm.trim().length < 2)
    return { success: false, results: [] };
 
  searchTerm = searchTerm.toLowerCase().trim();
  const ss = SpreadsheetApp.openById(SPREADSHEET_IDS.amvat);
  const results = [];
 
  Object.keys(REGION_MAP).forEach(region => {
    const sheet = ss.getSheetByName(REGION_MAP[region]);
    if (!sheet || sheet.getLastRow() <= 1) return;
 
    const data    = sheet.getDataRange().getValues();
    const headers = data[0].map(h => String(h).trim());
    const nameCol = headers.indexOf('Name');
    if (nameCol === -1) return;
 
    for (let i = 1; i < data.length && results.length < 30; i++) {
      const name = (data[i][nameCol] || '').toString().toLowerCase();
      if (!name.includes(searchTerm)) continue;
      results.push({ fullName: data[i][nameCol], region });
    }
  });
 
  return { success: true, results };
}
 
// ============================================================
// DASHBOARD — with targets
// ============================================================
 
function getDashboard() {
  try {
    const result = {
      profiling: {},
      amvat:     {},
      notQualified: 0,
      targets: REGION_TARGETS,
      target: REGION_TARGETS['TOTAL'] || 1000
    };
 
    const profilingSS = SpreadsheetApp.openById(SPREADSHEET_IDS.profiling);
    const amvatSS     = SpreadsheetApp.openById(SPREADSHEET_IDS.amvat);
 
    Object.keys(REGION_MAP).forEach(region => {
      const sheet = profilingSS.getSheetByName(REGION_MAP[region]);
      result.profiling[region] = sheet ? Math.max(0, sheet.getLastRow() - 1) : 0;
    });
 
    const nqSheet = profilingSS.getSheetByName('not_qualified_response');
    result.notQualified = nqSheet ? Math.max(0, nqSheet.getLastRow() - 1) : 0;
 
    Object.keys(REGION_MAP).forEach(region => {
      const sheet = amvatSS.getSheetByName(REGION_MAP[region]);
      if (!sheet || sheet.getLastRow() <= 1) {
        result.amvat[region] = { low: 0, mid: 0, high: 0, total: 0 };
        return;
      }
      const data     = sheet.getDataRange().getValues();
      const headers  = data[0].map(h => String(h).trim());
      const scoreCol = headers.indexOf('Final Total Score');
      let low = 0, mid = 0, high = 0;
      for (let i = 1; i < data.length; i++) {
        const score = parseFloat(data[i][scoreCol]);
        if (isNaN(score)) continue;
        if      (score <= 40) low++;
        else if (score <= 60) mid++;
        else                  high++;
      }
      result.amvat[region] = { low, mid, high, total: low + mid + high };
    });
 
    return result;
  } catch (err) {
    Logger.log('getDashboard error: ' + err.toString());
    return { profiling: {}, amvat: {}, notQualified: 0, error: err.toString() };
  }
}
 
function clearLocationCache() {
  CacheService.getScriptCache().remove('locationDB');
  Logger.log('Cache cleared!');
}