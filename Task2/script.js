/* ---------- Helpers ---------- */
const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => Array.from(root.querySelectorAll(s));

const form = $('#signupForm');
const fields = {
  name: $('#name'),
  email: $('#email'),
  phone: $('#phone'),
  password: $('#password')
};
const rows = {
  name: $('#row-name'),
  email: $('#row-email'),
  phone: $('#row-phone'),
  password: $('#row-password')
};
const errors = {
  name: $('#nameError'),
  email: $('#emailError'),
  phone: $('#phoneError'),
  password: $('#passwordError')
};
const strengthEl = $('#passwordStrength');
const toast = $('#toast');
const submitBtn = $('#submitBtn');

/* ---------- Validation Rules ---------- */
function isNameValid(value){
  return value.trim().length >= 2;
}

function isEmailValid(value){
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

function isPhoneValid(value){
  const v = value.replace(/[\s-]/g, '');
  const eg = /^01\d{9}$/.test(v);
  const generic = /^\+?\d{10,15}$/.test(v);
  return eg || generic;
}

function passwordInfo(value){
  const len = value.length >= 8;
  const upper = /[A-Z]/.test(value);
  const lower = /[a-z]/.test(value);
  const digit = /\d/.test(value);
  const special = /[^A-Za-z0-9]/.test(value);

  const passed = [len, upper, lower, digit].filter(Boolean).length;
  let level = 'weak';
  if (passed >= 3) level = 'medium';
  if (passed === 4 && (special || value.length >= 10)) level = 'strong';

  return { len, upper, lower, digit, special, level, ok: passed >= 4 };
}

/* ---------- UI Feedback ---------- */
function setRowState(key, valid, message=''){
  rows[key].classList.toggle('invalid', !valid);
  rows[key].classList.toggle('valid', valid);
  errors[key].textContent = message;
}

function updatePasswordStrength(){
  const info = passwordInfo(fields.password.value);
  let tips = [];
  if (!info.len) tips.push('٨ أحرف على الأقل');
  if (!info.upper) tips.push('حرف كبير');
  if (!info.lower) tips.push('حرف صغير');
  if (!info.digit) tips.push('رقم');

  strengthEl.dataset.level = info.level;
  strengthEl.textContent = fields.password.value
    ? `قوة كلمة المرور: ${info.level === 'weak' ? 'ضعيفة' : info.level === 'medium' ? 'متوسطة' : 'قوية'}`
    : '';
  return info;
}

function showToast(msg){
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(()=>toast.classList.remove('show'), 3000);
}

/* ---------- Field-level Validation ---------- */
function validateField(key){
  const val = fields[key].value;

  switch(key){
    case 'name':
      const nv = isNameValid(val);
      setRowState('name', nv, nv ? '' : 'الاسم مطلوب ولا يقل عن حرفين.');
      return nv;
    case 'email':
      const ev = isEmailValid(val);
      setRowState('email', ev, ev ? '' : 'صيغة البريد غير صحيحة.');
      return ev;
    case 'phone':
      const pv = isPhoneValid(val);
      setRowState('phone', pv, pv ? '' : 'أدخل رقمًا صحيحًا (مثال مصر: 01XXXXXXXXX).');
      return pv;
    case 'password':
      const info = updatePasswordStrength();
      const pv2 = info.ok;
      setRowState('password', pv2, pv2 ? '' : 'كلمة المرور ضعيفة: اجعلها ٨+ أحرف وتحتوي حرفًا كبيرًا وصغيرًا ورقمًا.');
      return pv2;
  }
}

Object.keys(fields).forEach(key=>{
  fields[key].addEventListener('blur', ()=>validateField(key));
  fields[key].addEventListener('input', ()=>validateField(key));
});

/* ---------- Submit ---------- */
form.addEventListener('submit', (e)=>{
  e.preventDefault();
  let allValid = true;
  Object.keys(fields).forEach(k=>{
    const ok = validateField(k);
    if(!ok) allValid = false;
  });

  if(!allValid){
    const firstInvalid = $('.form-row.invalid input');
    if (firstInvalid) firstInvalid.focus();
    showToast('تأكد من تصحيح الحقول المظللة.');
    return;
  }

  showToast('تم الإرسال بنجاح ✔️');
  form.reset();
  strengthEl.textContent = '';
  $$('.form-row').forEach(r=>r.classList.remove('valid','invalid'));
});

