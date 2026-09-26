(function () {
  var mount = document.querySelector('[data-booking-form-mount]');
  if (!mount) return;

  var DRAFT_KEY = 'andelo-book-a-call-draft';
  var SAVE_MS = 500;

  var FIT_OPTIONS = [
    'We need a design team',
    'Our creative team is at capacity',
    'Our work multiplies across brands or locations',
    'Something else',
  ];
  var URGENCY_OPTIONS = [
    'As soon as possible',
    'In the next month or two',
    'Just exploring for now',
  ];

  var COUNTRY_CODES = [
    { code: '+61', label: 'Australia (+61)' },
    { code: '+64', label: 'New Zealand (+64)' },
    { code: '+1', label: 'United States / Canada (+1)' },
    { code: '+44', label: 'United Kingdom (+44)' },
    { code: '+65', label: 'Singapore (+65)' },
    { code: '+62', label: 'Indonesia (+62)' },
    { code: '+63', label: 'Philippines (+63)' },
    { code: '+91', label: 'India (+91)' },
    { code: '+86', label: 'China (+86)' },
    { code: '+81', label: 'Japan (+81)' },
    { code: '+49', label: 'Germany (+49)' },
    { code: '+33', label: 'France (+33)' },
    { code: '+971', label: 'UAE (+971)' },
    { code: '+852', label: 'Hong Kong (+852)' },
  ];

  var EMAIL_TYPO_MAP = {
    'gmial.com': 'gmail.com',
    'gmai.com': 'gmail.com',
    'gmil.com': 'gmail.com',
    'gnail.com': 'gmail.com',
    'gmail.con': 'gmail.com',
    'gmail.co': 'gmail.com',
    'hotmial.com': 'hotmail.com',
    'hotmil.com': 'hotmail.com',
    'hotmail.con': 'hotmail.com',
    'outlok.com': 'outlook.com',
    'outlook.con': 'outlook.com',
    'yaho.com': 'yahoo.com',
    'yahooo.com': 'yahoo.com',
    'icloud.con': 'icloud.com',
    'andell.com.au': 'andelo.com.au',
  };

  function esc(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/"/g, '&quot;');
  }

  function optionTags(options, placeholder) {
    var html = '<option value="">' + esc(placeholder) + '</option>';
    options.forEach(function (opt) {
      html += '<option value="' + esc(opt) + '">' + esc(opt) + '</option>';
    });
    return html;
  }

  function countryOptions() {
    return COUNTRY_CODES.map(function (row) {
      return '<option value="' + esc(row.code) + '">' + esc(row.label) + '</option>';
    }).join('');
  }

  mount.innerHTML =
    '<form data-book-call novalidate class="flex flex-col gap-[26px]">' +
    '<div class="bac-honeypot" aria-hidden="true">' +
    '<label for="bac-website">Website</label>' +
    '<input type="text" id="bac-website" name="website_url" tabindex="-1" autocomplete="off">' +
    '</div>' +
    '<div>' +
    '<label for="bac-email" class="field-label-dark">Work email <span class="text-brand">*</span></label>' +
    '<input type="email" id="bac-email" class="field-dark" autocomplete="email" inputmode="email" required>' +
    '<div data-email-typo class="hidden field-email-typo-dark"></div>' +
    '<div data-err="email" class="hidden field-error-dark">Enter your work email.</div>' +
    '</div>' +
    '<div>' +
    '<label for="bac-name" class="field-label-dark">Full name <span class="text-brand">*</span></label>' +
    '<input type="text" id="bac-name" class="field-dark" autocomplete="name" required>' +
    '<div data-err="name" class="hidden field-error-dark">Enter your full name.</div>' +
    '</div>' +
    '<div>' +
    '<label for="bac-company" class="field-label-dark">Company <span class="text-brand">*</span></label>' +
    '<input type="text" id="bac-company" class="field-dark" autocomplete="organization" required>' +
    '<div data-err="company" class="hidden field-error-dark">Enter your company.</div>' +
    '</div>' +
    '<div>' +
    '<label for="bac-title" class="field-label-dark">Job title <span class="text-brand">*</span></label>' +
    '<input type="text" id="bac-title" class="field-dark" autocomplete="organization-title" required>' +
    '<div data-err="title" class="hidden field-error-dark">Enter your job title.</div>' +
    '</div>' +
    '<div>' +
    '<label for="bac-fit" class="field-label-dark">Which fits you best? <span class="text-brand">*</span></label>' +
    '<select id="bac-fit" class="field-dark" required>' +
    optionTags(FIT_OPTIONS, 'Choose one') +
    '</select>' +
    '<div data-err="fit" class="hidden field-error-dark">Choose the option that fits best.</div>' +
    '</div>' +
    '<div>' +
    '<label for="bac-urgency" class="field-label-dark">How soon do you need help? <span class="text-brand">*</span></label>' +
    '<select id="bac-urgency" class="field-dark" required>' +
    optionTags(URGENCY_OPTIONS, 'Choose one') +
    '</select>' +
    '<div data-err="urgency" class="hidden field-error-dark">Choose how soon you need help.</div>' +
    '</div>' +
    '<div>' +
    '<label for="bac-notes" class="field-label-dark">Anything we should know before we talk? <span class="text-body-caption font-medium">(optional)</span></label>' +
    '<textarea id="bac-notes" rows="4" class="field-dark" placeholder="Workload, channels, team size, or what prompted you to reach out."></textarea>' +
    '</div>' +
    '<div>' +
    '<label class="field-label-dark">Phone <span class="text-body-caption font-medium">(optional)</span></label>' +
    '<div class="field-phone-row">' +
    '<select id="bac-dial" class="field-dark field-phone-dial" aria-label="Country code">' +
    countryOptions() +
    '</select>' +
    '<input type="tel" id="bac-phone" class="field-dark" autocomplete="tel-national" inputmode="tel" placeholder="412 345 678">' +
    '</div>' +
    '</div>' +
    '<div data-form-error class="hidden field-error-dark" role="alert"></div>' +
    '<button type="submit" class="btn-mint w-full border-none cursor-pointer mt-[2px]" data-submit>Send enquiry</button>' +
    '<p class="text-caption text-body-caption text-center m-0 [text-wrap:pretty]">We use your details only to respond to this enquiry. See our <a href="/privacy-policy/" class="link">privacy policy</a>.</p>' +
    '</form>' +
    '<div data-success class="hidden mt-1 text-center py-6">' +
    '<p class="font-display text-title text-heading m-0 [text-wrap:pretty]" data-success-msg></p>' +
    '</div>';

  var form = mount.querySelector('[data-book-call]');
  var success = mount.querySelector('[data-success]');
  var successMsg = mount.querySelector('[data-success-msg]');
  var submitBtn = mount.querySelector('[data-submit]');
  var formError = mount.querySelector('[data-form-error]');
  var emailTypo = mount.querySelector('[data-email-typo]');

  var fields = {
    email: document.getElementById('bac-email'),
    name: document.getElementById('bac-name'),
    company: document.getElementById('bac-company'),
    title: document.getElementById('bac-title'),
    fit: document.getElementById('bac-fit'),
    urgency: document.getElementById('bac-urgency'),
    notes: document.getElementById('bac-notes'),
    dial: document.getElementById('bac-dial'),
    phone: document.getElementById('bac-phone'),
    honeypot: document.getElementById('bac-website'),
  };

  var saveTimer;

  function showErr(key, on) {
    var el = mount.querySelector('[data-err="' + key + '"]');
    if (el) el.classList.toggle('hidden', !on);
    var map = {
      email: fields.email,
      name: fields.name,
      company: fields.company,
      title: fields.title,
      fit: fields.fit,
      urgency: fields.urgency,
    };
    var input = map[key];
    if (!input) return;
    if (on) {
      input.setAttribute('aria-invalid', 'true');
      if (el && el.id) input.setAttribute('aria-describedby', el.id);
    } else {
      input.setAttribute('aria-invalid', 'false');
      input.removeAttribute('aria-describedby');
    }
  }

  function readDraft() {
    return {
      work_email: fields.email.value,
      full_name: fields.name.value,
      company: fields.company.value,
      job_title: fields.title.value,
      fit_option: fields.fit.value,
      urgency: fields.urgency.value,
      notes: fields.notes.value,
      dial: fields.dial.value,
      phone_local: fields.phone.value,
    };
  }

  function applyDraft(data) {
    if (!data || typeof data !== 'object') return;
    if (data.work_email) fields.email.value = data.work_email;
    if (data.full_name) fields.name.value = data.full_name;
    if (data.company) fields.company.value = data.company;
    if (data.job_title) fields.title.value = data.job_title;
    if (data.fit_option) fields.fit.value = data.fit_option;
    if (data.urgency) fields.urgency.value = data.urgency;
    if (data.notes) fields.notes.value = data.notes;
    if (data.dial) fields.dial.value = data.dial;
    if (data.phone_local) fields.phone.value = data.phone_local;
    checkEmailTypo();
  }

  function scheduleSave() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(function () {
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(readDraft()));
      } catch (e) {}
    }, SAVE_MS);
  }

  try {
    applyDraft(JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null'));
  } catch (e) {}

  function emailDomain(email) {
    var at = email.lastIndexOf('@');
    if (at < 0) return '';
    return email.slice(at + 1).toLowerCase();
  }

  var typoSuggestion = '';

  function checkEmailTypo() {
    var email = fields.email.value.trim();
    var domain = emailDomain(email);
    typoSuggestion = EMAIL_TYPO_MAP[domain] || '';
    if (!typoSuggestion) {
      emailTypo.classList.add('hidden');
      emailTypo.innerHTML = '';
      return;
    }
    emailTypo.classList.remove('hidden');
    emailTypo.innerHTML =
      'Did you mean <button type="button" class="field-email-typo-fix-dark" data-email-typo-fix>' +
      esc(typoSuggestion) +
      '</button>?';
  }

  emailTypo.addEventListener('click', function (ev) {
    if (!ev.target.matches('[data-email-typo-fix]') || !typoSuggestion) return;
    var email = fields.email.value.trim();
    var local = email.split('@')[0];
    fields.email.value = local + '@' + typoSuggestion;
    typoSuggestion = '';
    emailTypo.classList.add('hidden');
    emailTypo.innerHTML = '';
    scheduleSave();
  });

  function buildPhone() {
    var local = fields.phone.value.replace(/[^\d]/g, '');
    if (!local) return '';
    var dial = fields.dial.value || '+61';
    if (dial === '+61' && local.charAt(0) === '0') local = local.slice(1);
    return dial + local;
  }

  function validate() {
    var ok = true;
    var email = fields.email.value.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showErr('email', true);
      ok = false;
    } else showErr('email', false);
    if (!fields.name.value.trim()) {
      showErr('name', true);
      ok = false;
    } else showErr('name', false);
    if (!fields.company.value.trim()) {
      showErr('company', true);
      ok = false;
    } else showErr('company', false);
    if (!fields.title.value.trim()) {
      showErr('title', true);
      ok = false;
    } else showErr('title', false);
    if (!fields.fit.value) {
      showErr('fit', true);
      ok = false;
    } else showErr('fit', false);
    if (!fields.urgency.value) {
      showErr('urgency', true);
      ok = false;
    } else showErr('urgency', false);
    return ok;
  }

  Object.keys(fields).forEach(function (key) {
    var el = fields[key];
    if (!el || key === 'honeypot') return;
    el.addEventListener('input', scheduleSave);
    el.addEventListener('change', scheduleSave);
  });
  fields.email.addEventListener('input', checkEmailTypo);
  fields.email.addEventListener('blur', checkEmailTypo);

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    formError.classList.add('hidden');
    formError.textContent = '';
    if (!validate()) return;

    submitBtn.disabled = true;
    var prevLabel = submitBtn.textContent;
    submitBtn.textContent = 'Sending…';

    var payload = {
      website_url: fields.honeypot.value,
      work_email: fields.email.value.trim(),
      full_name: fields.name.value.trim(),
      company: fields.company.value.trim(),
      job_title: fields.title.value.trim(),
      fit_option: fields.fit.value,
      urgency: fields.urgency.value,
      notes: fields.notes.value.trim(),
      phone: buildPhone(),
      source_url: window.location.href,
    };

    fetch('/api/book-a-call', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(function (res) {
        return res.json().catch(function () {
          return {};
        }).then(function (data) {
          return { res: res, data: data };
        });
      })
      .then(function (_ref) {
        var res = _ref.res;
        var data = _ref.data;
        if (!res.ok) {
          throw new Error(data.error || 'Something went wrong. Try again.');
        }
        var first = data.firstName || payload.full_name.split(/\s+/)[0] || 'there';
        try {
          localStorage.removeItem(DRAFT_KEY);
        } catch (e) {}
        form.classList.add('hidden');
        successMsg.textContent =
          'Thanks, ' + first + ". I'll email you shortly with a couple of times for a call.";
        success.classList.remove('hidden');
      })
      .catch(function (err) {
        formError.textContent = err.message || 'Something went wrong. Try again.';
        formError.classList.remove('hidden');
        submitBtn.disabled = false;
        submitBtn.textContent = prevLabel;
      });
  });
})();
