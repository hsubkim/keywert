/* ── keywert 공유 인증 모듈 ─────────────────────────── */

const KW_USERS = {
  'wert_free':  { name: '김무료', type: 'free' },
  'wert_paid':  { name: '김유료', type: 'paid' },
  'wert_trial': { name: '김체험', type: 'trial' }
};

const KW_PASSWORD = '1111';

/* ── CSS 주입 ── */
(function injectStyles() {
  const style = document.createElement('style');
  style.textContent = `
    /* ── User area ── */
    .kw-user-wrap { display: flex; align-items: center; gap: 10px; position: relative; }
    .kw-user-pill {
      display: flex; align-items: center; gap: 8px; padding: 4px 8px;
      border: 1.5px solid #E5E7EB; border-radius: 24px; background: #fff;
      transition: border-color 0.15s, background 0.15s; position: relative; user-select: none;
    }
    .kw-user-pill:hover { border-color: #C4C8CE; background: #F9FAFB; }
    .kw-trigger-wrap { position: relative; align-self: stretch; display: flex; align-items: center; }
    .kw-trigger { display: flex; align-items: center; gap: 6px; padding: 2px 4px 2px 0; cursor: pointer; }
    .kw-token-link { display: flex; align-items: center; text-decoration: none; flex-shrink: 0; }
    .kw-icon { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .kw-icon.free  { background: #F3F4F6; color: #C0C4CA; }
    .kw-icon.paid  { background: #D0F5F9; color: #29B8D8; }
    .kw-icon.trial { background: #DCFCE7; color: #16A34A; }
    .kw-name { font-size: 14px; font-weight: 600; color: #111827; white-space: nowrap; }
    .kw-token { display: flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 500; color: #fff; padding: 3px 10px; border-radius: 20px; white-space: nowrap; flex-shrink: 0; }
    .kw-token.paid  { background: #0BB8C9; }
    .kw-token.trial { background: #34C7A9; }
    .kw-token-sep { opacity: 0.6; }
    .kw-chevron { color: #9CA3AF; flex-shrink: 0; margin-left: 2px; }
    .kw-pill-sep { width: 1px; height: 16px; background: #E5E7EB; flex-shrink: 0; }
    .kw-workspace-wrap { position: relative; align-self: stretch; display: flex; align-items: center; }
    .kw-workspace { display: flex; align-items: center; gap: 5px; padding: 2px 4px 2px 2px; border-radius: 6px; font-size: 12px; font-weight: 500; color: #374151; cursor: pointer; white-space: nowrap; transition: background 0.12s; }
    .kw-workspace:hover { background: #F3F4F6; }
    .kw-workspace-label { color: #374151; }
    .kw-workspace-chevron { color: #9CA3AF; }
    .kw-ws-dropdown { position: absolute; top: calc(100% + 6px); left: -4px; width: max-content; background: #fff; border: 1px solid #E5E7EB; border-radius: 10px; box-shadow: 0 6px 16px rgba(0,0,0,0.09); padding: 4px; z-index: 500; display: none; }
    .kw-ws-dropdown.open { display: block; }
    .kw-ws-item { display: flex; align-items: center; gap: 5px; padding: 7px 12px 7px 6px; font-size: 12px; font-weight: 500; color: #374151; border-radius: 6px; border: none; background: none; width: 100%; cursor: pointer; font-family: inherit; text-align: left; white-space: nowrap; transition: background 0.12s; }
    .kw-ws-item:hover { background: #F3F4F6; }
    .kw-dropdown { position: absolute; top: calc(100% + 6px); left: 0; width: max-content; background: #fff; border: 1px solid #E5E7EB; border-radius: 10px; box-shadow: 0 6px 16px rgba(0,0,0,0.09); padding: 4px; z-index: 500; display: none; }
    .kw-dropdown.open { display: block; }
    .kw-drop-item { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 7px 12px; font-size: 12px; font-weight: 500; color: #374151; text-decoration: none; border-radius: 6px; border: none; background: none; width: 100%; cursor: pointer; font-family: inherit; transition: background 0.12s; white-space: nowrap; }
    .kw-drop-item:hover { background: #F3F4F6; }
    .kw-drop-item.danger { color: #EF4444; }
    .kw-drop-item.danger:hover { background: #FEF2F2; }
    .kw-drop-chevron { color: #9CA3AF; flex-shrink: 0; }
    .kw-drop-item.danger .kw-drop-chevron { color: #EF4444; }
    .kw-toast { position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%); background: #111827; color: #fff; font-size: 14px; font-weight: 500; padding: 12px 24px; border-radius: 10px; box-shadow: 0 8px 24px rgba(0,0,0,0.2); z-index: 9999; opacity: 0; transition: opacity 0.3s; }
    .kw-toast.show { opacity: 1; }

    /* ── 무료체험 모달 ── */
    .kw-ft-overlay {
      display: none; position: fixed; inset: 0;
      background: rgba(0,0,0,0.5); z-index: 10000;
      overflow-y: auto; padding: 48px 40px 80px;
      box-sizing: border-box;
    }
    .kw-ft-overlay.open { display: flex; align-items: flex-start; justify-content: center; }
    .kw-ft-card {
      width: 888px; flex-shrink: 0;
      background: #fff; border-radius: 16px;
      box-shadow: 0 0 1px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.12);
      padding: 32px; position: relative;
      display: flex; flex-direction: column; gap: 32px;
      font-family: 'Noto Sans KR', sans-serif; color: #1E1E1E;
    }
    .kw-ft-close {
      position: absolute; top: 16px; right: 16px;
      width: 40px; height: 40px;
      display: flex; align-items: center; justify-content: center;
      border: none; background: rgba(90,90,90,0.08); border-radius: 4px;
      cursor: pointer; color: rgba(30,30,30,0.55); transition: background 0.15s;
    }
    .kw-ft-close:hover { background: rgba(90,90,90,0.14); }
    .kw-ft-title { font-size: 28px; font-weight: 700; color: #000; line-height: 136%; letter-spacing: -0.02em; max-width: 620px; }
    /* plan cards */
    .kw-ft-plan-row { display: flex; gap: 16px; }
    .kw-ft-plan-card { flex: 1; display: flex; flex-direction: column; border-radius: 12px; box-shadow: 0 0 10px 10px rgba(0,170,140,0.36); }
    .kw-ft-badge { background: #00A08C; border-radius: 12px 12px 0 0; height: 30px; display: flex; align-items: center; justify-content: center; }
    .kw-ft-badge span { font-size: 13px; font-weight: 700; color: #fff; }
    .kw-ft-body { background: rgba(90,90,90,0.05); border: 1px solid #00A08C; border-top: none; border-radius: 0 0 12px 12px; padding: 16px; display: flex; flex-direction: column; gap: 14px; flex: 1; }
    .kw-ft-plan-header { display: flex; flex-direction: column; gap: 2px; }
    .kw-ft-plan-target { font-size: 13px; font-weight: 500; color: #1E1E1E; line-height: 150%; }
    .kw-ft-plan-name { font-size: 18px; font-weight: 700; color: #000; line-height: 136%; }
    .kw-ft-divider { height: 1px; background: rgba(30,30,30,0.08); }
    .kw-ft-features { display: flex; flex-direction: column; gap: 4px; }
    .kw-ft-features-title { font-size: 14px; font-weight: 500; color: rgba(30,30,30,0.55); margin-bottom: 6px; line-height: 156%; }
    .kw-ft-feat-row { display: flex; align-items: center; gap: 4px; }
    .kw-ft-feat-row-sub { display: flex; align-items: flex-start; gap: 4px; }
    .kw-ft-feat-icon { width: 16px; height: 16px; flex-shrink: 0; }
    .kw-ft-feat-text { font-size: 13px; font-weight: 500; color: #1E1E1E; line-height: 150%; }
    .kw-ft-feat-text-bold { font-size: 13px; font-weight: 700; color: #1E1E1E; line-height: 150%; }
    .kw-ft-feat-sub-group { display: flex; flex-direction: column; gap: 2px; }
    .kw-ft-feat-sub { font-size: 12px; font-weight: 500; color: rgba(30,30,30,0.55); line-height: 150%; }
    .kw-ft-plan-btn { width: 100%; padding: 10px 16px; background: #00A08C; color: #fff; border: none; border-radius: 8px; font-size: 14px; font-weight: 700; font-family: inherit; cursor: pointer; transition: background 0.15s; margin-top: auto; }
    .kw-ft-plan-btn:hover { background: #009080; }
    /* form */
    .kw-ft-inner { display: flex; flex-direction: column; gap: 48px; }
    .kw-ft-fields { display: flex; flex-direction: column; gap: 20px; }
    .kw-ft-field { display: flex; flex-direction: column; gap: 6px; }
    .kw-ft-label { display: flex; align-items: center; gap: 2px; font-size: 14px; font-weight: 500; color: rgba(30,30,30,0.69); line-height: 156%; }
    .kw-ft-required { color: #F04452; }
    .kw-ft-input { width: 100%; padding: 12px; border: 1px solid rgba(30,30,30,0.12); border-radius: 8px; font-size: 16px; font-family: inherit; color: #1E1E1E; background: #fff; outline: none; transition: border-color 0.15s; box-sizing: border-box; }
    .kw-ft-input:focus { border-color: #00A08C; }
    .kw-ft-input::placeholder { color: rgba(30,30,30,0.26); }
    .kw-ft-select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='rgba(30%2C30%2C30%2C0.55)' stroke-width='2' stroke-linecap='round' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; background-size: 20px; padding-right: 40px; cursor: pointer; }
    .kw-ft-textarea { resize: vertical; min-height: 100px; line-height: 1.6; }
    .kw-ft-textarea-wrap { position: relative; }
    .kw-ft-char-count { position: absolute; right: 12px; bottom: 10px; font-size: 13px; color: rgba(30,30,30,0.42); pointer-events: none; }
    /* privacy */
    .kw-ft-privacy { background: rgba(90,90,90,0.03); border-radius: 8px; padding: 12px; display: flex; flex-direction: column; gap: 10px; }
    .kw-ft-privacy-row { display: flex; align-items: center; gap: 8px; }
    .kw-ft-checkbox { width: 20px; height: 20px; border: 2px solid rgba(30,30,30,0.12); border-radius: 4px; flex-shrink: 0; cursor: pointer; appearance: none; position: relative; transition: border-color 0.15s, background 0.15s; }
    .kw-ft-checkbox:checked { border-color: #00A08C; background: #00A08C; }
    .kw-ft-checkbox:checked::after { content: ''; position: absolute; left: 4px; top: 1px; width: 8px; height: 12px; border: 2px solid #fff; border-top: none; border-left: none; transform: rotate(45deg); }
    .kw-ft-privacy-label { font-size: 16px; font-weight: 700; color: rgba(30,30,30,0.84); cursor: pointer; }
    .kw-ft-privacy-text { font-size: 14px; color: rgba(30,30,30,0.69); line-height: 1.65; padding: 0 12px; }
    .kw-ft-privacy-detail { font-size: 12px; color: rgba(30,30,30,0.69); line-height: 1.6; padding: 0 12px; }
    /* submit */
    .kw-ft-submit-wrap { display: flex; flex-direction: column; gap: 16px; }
    .kw-ft-submit { width: 100%; padding: 14px 16px; border: none; border-radius: 8px; font-size: 14px; font-weight: 700; font-family: inherit; cursor: pointer; transition: background 0.15s, color 0.15s; }
    .kw-ft-submit.disabled { background: rgba(0,160,140,0.09); color: rgba(30,30,30,0.16); cursor: default; }
    .kw-ft-submit.active { background: #00A08C; color: #fff; }
    .kw-ft-submit.active:hover { background: #009080; }
    /* success */
    .kw-ft-success { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 10001; align-items: center; justify-content: center; }
    .kw-ft-success.open { display: flex; }
    .kw-ft-success-card { background: #fff; border-radius: 16px; padding: 48px 40px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 16px; width: 420px; box-shadow: 0 24px 64px rgba(0,0,0,0.18); }
    .kw-ft-success-icon { width: 64px; height: 64px; background: rgba(0,160,140,0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; }
    .kw-ft-success-title { font-size: 21px; font-weight: 800; color: #000; line-height: 1.35; font-family: 'Noto Sans KR', sans-serif; }
    .kw-ft-success-desc { font-size: 14px; color: rgba(30,30,30,0.55); line-height: 1.65; font-family: 'Noto Sans KR', sans-serif; }
    .kw-ft-success-redirect { font-size: 13px; color: rgba(30,30,30,0.42); font-family: 'Noto Sans KR', sans-serif; }
  `;
  document.head.appendChild(style);
})();

/* ── 유틸 ── */
function kwGetUser() {
  try { return JSON.parse(localStorage.getItem('kw_user')); } catch { return null; }
}

function kwSetUser(data) {
  localStorage.setItem('kw_user', JSON.stringify(data));
}

function kwLogout() {
  localStorage.removeItem('kw_user');
  sessionStorage.removeItem('kw_workspace');
  window.location.href = 'index.html';
}

function kwShowToast(msg) {
  const t = document.createElement('div');
  t.className = 'kw-toast';
  t.textContent = msg;
  document.body.appendChild(t);
  requestAnimationFrame(() => { t.classList.add('show'); });
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400); }, 2800);
}

/* ── 드롭다운 토글 ── */
function kwToggleDropdown(e) {
  e.stopPropagation();
  const dd = document.getElementById('kwDropdown');
  const wd = document.getElementById('kwWsDropdown');
  if (wd) wd.classList.remove('open');
  if (dd) dd.classList.toggle('open');
}

function kwToggleWorkspace(e) {
  e.stopPropagation();
  const wd = document.getElementById('kwWsDropdown');
  const dd = document.getElementById('kwDropdown');
  if (dd) dd.classList.remove('open');
  if (wd) wd.classList.toggle('open');
}

function kwSelectWorkspace(e, name) {
  e.stopPropagation();
  sessionStorage.setItem('kw_workspace', name);
  const label = document.querySelector('.kw-workspace-label');
  if (label) label.textContent = name;
  const wd = document.getElementById('kwWsDropdown');
  if (wd) wd.classList.remove('open');
}

document.addEventListener('click', function() {
  const dd = document.getElementById('kwDropdown');
  if (dd) dd.classList.remove('open');
  const wd = document.getElementById('kwWsDropdown');
  if (wd) wd.classList.remove('open');
});

/* ── 헤더 렌더링 ── */
function kwRenderHeader() {
  const container = document.getElementById('headerActions');
  if (!container) return;

  const user = kwGetUser();

  /* 비로그인 */
  if (!user) {
    container.innerHTML = `
      <div style="display:flex;align-items:center;gap:0;">
        <a href="login.html" class="btn-text">로그인</a>
        <div class="btn-divider"></div>
        <a href="signup.html" class="btn-text">회원가입</a>
        <div class="btn-divider"></div>
        <a href="cslab.html" class="btn-text" target="_blank" rel="noopener">고객센터</a>
      </div>
      <button class="btn-primary" onclick="kwHandleFreeTrialClick()" style="cursor:pointer;font-family:inherit;border:none;">무료체험 시작하기</button>
    `;
    return;
  }

  const { name, type } = user;

  let tokenHTML = '';
  if (type === 'paid') {
    tokenHTML = `<span class="kw-token paid">무제한 <span class="kw-token-sep">|</span> 남은 토큰 99%</span>`;
  } else if (type === 'trial') {
    tokenHTML = `<span class="kw-token trial">무료체험 D-10 <span class="kw-token-sep">|</span> 남은 토큰 99%</span>`;
  }

  const trialBtn = type === 'free'
    ? `<button class="btn-primary" onclick="kwHandleFreeTrialClick()" style="cursor:pointer;font-family:inherit;border:none;">무료체험 시작하기</button>`
    : '';

  const tokenLinkHTML = tokenHTML
    ? `<a href="mypage_subscription.html" class="kw-token-link" onclick="event.stopPropagation()">${tokenHTML}</a>`
    : '';

  const savedWorkspace = sessionStorage.getItem('kw_workspace') || '워크스페이스';

  const workspaceHTML = (type === 'paid' || type === 'trial') ? `
    <div class="kw-pill-sep"></div>
    <div class="kw-workspace-wrap">
      <div class="kw-workspace" onclick="kwToggleWorkspace(event)">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
        <span class="kw-workspace-label">${savedWorkspace}</span>
        <svg class="kw-workspace-chevron" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>
      </div>
      <div class="kw-ws-dropdown" id="kwWsDropdown">
        <button class="kw-ws-item" onclick="kwSelectWorkspace(event,'개인스페이스')"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>개인스페이스</button>
        <button class="kw-ws-item" onclick="kwSelectWorkspace(event,'워트인텔리전스')"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>워트인텔리전스</button>
      </div>
    </div>
  ` : '';

  container.innerHTML = `
    <a href="cslab.html" class="btn-text" target="_blank" rel="noopener">고객센터</a>
    <div class="kw-user-wrap">
      <div class="kw-user-pill" id="kwUserPill">
        <div class="kw-trigger-wrap">
          <div class="kw-trigger" onclick="kwToggleDropdown(event)">
            <div class="kw-icon ${type}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <span class="kw-name">${name}</span>
            <svg class="kw-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>
          </div>
          <div class="kw-dropdown" id="kwDropdown">
            <a href="mypage_subscription.html" class="kw-drop-item">마이페이지<svg class="kw-drop-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6"/></svg></a>
            <button class="kw-drop-item danger" onclick="kwLogout()">로그아웃<svg class="kw-drop-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6"/></svg></button>
          </div>
        </div>
        ${workspaceHTML}
        ${tokenLinkHTML}
      </div>
    </div>
    ${trialBtn}
  `;
}

/* ── 무료체험 클릭 핸들러 ── */
function kwHandleFreeTrialClick() {
  const user = kwGetUser();
  if (!user) {
    /* 비로그인: 현재 페이지 저장 후 로그인으로 */
    sessionStorage.setItem('kw_free_trial_pending', '1');
    sessionStorage.setItem('kw_redirect', location.href);
    location.href = 'login.html';
    return;
  }
  /* 로그인 상태: 모달 바로 표시 */
  kwShowFreeTrialModal();
}

/* ── 무료체험 모달 표시/숨김 ── */
function kwShowFreeTrialModal() {
  const overlay = document.getElementById('kwFtOverlay');
  if (!overlay) return;
  overlay.classList.add('open');
  overlay.scrollTop = 0;
  document.body.style.overflow = 'hidden';
}

function kwHideFreeTrialModal() {
  const overlay = document.getElementById('kwFtOverlay');
  if (!overlay) return;
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

/* ── 무료체험 폼 유효성 ── */
function kwFreeTrialCheckForm() {
  var company = document.getElementById('kwFtCompany');
  var jobType = document.getElementById('kwFtJobType');
  var privacy = document.getElementById('kwFtPrivacy');
  var btn = document.getElementById('kwFtSubmit');
  if (!btn) return;
  var valid = company && company.value.trim() && jobType && jobType.value && privacy && privacy.checked;
  btn.className = 'kw-ft-submit ' + (valid ? 'active' : 'disabled');
}

/* ── 무료체험 textarea 글자수 ── */
function kwFreeTrialUpdateCount(el) {
  var counter = document.getElementById('kwFtCharCount');
  if (counter) counter.textContent = el.value.length + '/300';
}

/* ── 무료체험 신청 제출 ── */
function kwSubmitFreeTrial() {
  var btn = document.getElementById('kwFtSubmit');
  if (!btn || btn.classList.contains('disabled')) return;

  /* wert_trial로 로그인 처리 */
  kwSetUser({ name: '김체험', type: 'trial' });

  /* 성공 오버레이 표시 */
  var success = document.getElementById('kwFtSuccess');
  if (success) success.classList.add('open');

  /* 2.5초 후 모달 닫고 헤더 갱신 */
  setTimeout(function() {
    if (success) success.classList.remove('open');
    kwHideFreeTrialModal();
    kwRenderHeader();
  }, 2500);
}

/* ── 무료체험 모달 HTML 주입 ── */
function kwInjectFreeTrialModal() {
  if (document.getElementById('kwFtOverlay')) return;

  var el = document.createElement('div');
  el.id = 'kwFtOverlay';
  el.className = 'kw-ft-overlay';
  el.innerHTML = `
    <div class="kw-ft-card">
      <button class="kw-ft-close" onclick="kwHideFreeTrialModal()" aria-label="닫기">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>

      <h2 class="kw-ft-title">키워트의 AI 특허 검색·분석을 무료로 체험해보세요</h2>

      <!-- 플랜 카드 -->
      <div class="kw-ft-plan-row">
        <!-- Insight 라이트 -->
        <div class="kw-ft-plan-card">
          <div class="kw-ft-badge"><span>insight</span></div>
          <div class="kw-ft-body">
            <div class="kw-ft-plan-header">
              <span class="kw-ft-plan-target">AI 특허 분석을 체험하고 싶은 개인이라면</span>
              <span class="kw-ft-plan-name">라이트</span>
            </div>
            <div class="kw-ft-divider"></div>
            <div class="kw-ft-features">
              <p class="kw-ft-features-title">지급된 토큰 사용</p>
              <div class="kw-ft-feat-row"><svg class="kw-ft-feat-icon" viewBox="0 0 16 16" fill="none"><path d="M9 2L3.5 9.5H8L6 14L12.5 6H8L9 2Z" fill="#00A08C"/></svg><span class="kw-ft-feat-text">AI 토큰 지급</span></div>
              <div class="kw-ft-feat-row"><svg class="kw-ft-feat-icon" viewBox="0 0 16 16" fill="none"><path d="M9 2L3.5 9.5H8L6 14L12.5 6H8L9 2Z" fill="#00A08C"/></svg><span class="kw-ft-feat-text">AI 특허 검색</span></div>
              <div class="kw-ft-feat-row"><svg class="kw-ft-feat-icon" viewBox="0 0 16 16" fill="none"><path d="M9 2L3.5 9.5H8L6 14L12.5 6H8L9 2Z" fill="#00A08C"/></svg><span class="kw-ft-feat-text">AI 분석 결과물 생성</span></div>
              <div class="kw-ft-feat-row"><svg class="kw-ft-feat-icon" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="#00A08C" stroke-width="1.5"/><path d="M5.5 8l2 2 3-3" stroke="#00A08C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg><span class="kw-ft-feat-text">프로젝트 생성 제한</span></div>
              <div class="kw-ft-feat-row-sub">
                <svg class="kw-ft-feat-icon" viewBox="0 0 16 16" fill="none" style="margin-top:2px;"><rect x="2" y="1.5" width="12" height="13" rx="1.5" stroke="rgba(30,30,30,0.42)" stroke-width="1.5"/><path d="M5 5.5h6M5 8h6M5 10.5h4" stroke="rgba(30,30,30,0.42)" stroke-width="1.2" stroke-linecap="round"/></svg>
                <div class="kw-ft-feat-sub-group"><span class="kw-ft-feat-text">AI 분석 결과물 저장 및 공유</span><span class="kw-ft-feat-sub">· 파일 10MB/건, 월 누적 100MB</span></div>
              </div>
            </div>
            <button class="kw-ft-plan-btn">무료 토큰 제공</button>
          </div>
        </div>

        <!-- Pro 프로 -->
        <div class="kw-ft-plan-card">
          <div class="kw-ft-badge"><span>pro</span></div>
          <div class="kw-ft-body">
            <div class="kw-ft-plan-header">
              <span class="kw-ft-plan-target">AI 특허 분석을 업무에 적극 활용하고 싶다면</span>
              <span class="kw-ft-plan-name">프로</span>
            </div>
            <div class="kw-ft-divider"></div>
            <div class="kw-ft-features">
              <p class="kw-ft-features-title">토큰 걱정없는 AI 기능 사용</p>
              <div class="kw-ft-feat-row"><svg class="kw-ft-feat-icon" viewBox="0 0 16 16" fill="none"><path d="M9 2L3.5 9.5H8L6 14L12.5 6H8L9 2Z" fill="#00A08C"/></svg><span class="kw-ft-feat-text-bold">라이트 대비 AI 토큰 10배 지급</span></div>
              <div class="kw-ft-feat-row"><svg class="kw-ft-feat-icon" viewBox="0 0 16 16" fill="none"><path d="M9 2L3.5 9.5H8L6 14L12.5 6H8L9 2Z" fill="#00A08C"/></svg><span class="kw-ft-feat-text">AI 특허 검색</span></div>
              <div class="kw-ft-feat-row"><svg class="kw-ft-feat-icon" viewBox="0 0 16 16" fill="none"><path d="M9 2L3.5 9.5H8L6 14L12.5 6H8L9 2Z" fill="#00A08C"/></svg><span class="kw-ft-feat-text">AI 분석 결과물 생성</span></div>
              <div class="kw-ft-feat-row"><svg class="kw-ft-feat-icon" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="#00A08C" stroke-width="1.5"/><path d="M5.5 8l2 2 3-3" stroke="#00A08C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg><span class="kw-ft-feat-text">프로젝트 생성 무제한</span></div>
              <div class="kw-ft-feat-row-sub">
                <svg class="kw-ft-feat-icon" viewBox="0 0 16 16" fill="none" style="margin-top:2px;"><circle cx="13" cy="3" r="2" stroke="#00A08C" stroke-width="1.4"/><circle cx="3" cy="8" r="2" stroke="#00A08C" stroke-width="1.4"/><circle cx="13" cy="13" r="2" stroke="#00A08C" stroke-width="1.4"/><path d="M5 8.8L11 12M11 4L5 7.2" stroke="#00A08C" stroke-width="1.2" stroke-linecap="round"/></svg>
                <div class="kw-ft-feat-sub-group"><span class="kw-ft-feat-text">외부 사용자 초대 및 협업</span><span class="kw-ft-feat-sub">· 게스트 3명/시트 당</span></div>
              </div>
              <div class="kw-ft-feat-row"><svg class="kw-ft-feat-icon" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="#00A08C" stroke-width="1.5"/><path d="M5.5 8l2 2 3-3" stroke="#00A08C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg><span class="kw-ft-feat-text">AI 분석 결과물 저장 및 공유 무제한</span></div>
              <div class="kw-ft-feat-row"><svg class="kw-ft-feat-icon" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="#00A08C" stroke-width="1.5"/><path d="M5.5 8l2 2 3-3" stroke="#00A08C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg><span class="kw-ft-feat-text">PDF 첨부 검색 용량 무제한</span></div>
              <div class="kw-ft-feat-row"><svg class="kw-ft-feat-icon" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="#00A08C" stroke-width="1.5"/><path d="M5.5 8l2 2 3-3" stroke="#00A08C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg><span class="kw-ft-feat-text">어드민(Admin) 기능 제공</span></div>
            </div>
            <button class="kw-ft-plan-btn">무료 체험 7일</button>
          </div>
        </div>
      </div>

      <!-- 폼 -->
      <div class="kw-ft-inner">
        <div class="kw-ft-fields">

          <div class="kw-ft-field">
            <label class="kw-ft-label" for="kwFtCompany">회사 <span class="kw-ft-required">*</span></label>
            <input id="kwFtCompany" type="text" class="kw-ft-input" value="워트인텔리전스" placeholder="워트전자, 법무법인 워트, 워트대학교" oninput="kwFreeTrialCheckForm()">
          </div>

          <div class="kw-ft-field">
            <label class="kw-ft-label" for="kwFtJobType">직군 <span class="kw-ft-required">*</span></label>
            <select id="kwFtJobType" class="kw-ft-input kw-ft-select" onchange="kwFreeTrialCheckForm()">
              <option value="">직군을 선택해주세요</option>
              <option value="ip" selected>IP 실무자</option>
              <option value="rd">R&amp;D 연구자</option>
              <option value="strategy">전략·기획자</option>
              <option value="other">기타</option>
            </select>
          </div>

          <div class="kw-ft-field">
            <label class="kw-ft-label" for="kwFtDept">부서명</label>
            <input id="kwFtDept" type="text" class="kw-ft-input" value="IP팀" placeholder="부서명을 입력해주세요">
          </div>

          <div class="kw-ft-field">
            <label class="kw-ft-label" for="kwFtRank">직급</label>
            <input id="kwFtRank" type="text" class="kw-ft-input" value="팀장" placeholder="직급을 입력해주세요">
          </div>

          <div class="kw-ft-field">
            <label class="kw-ft-label" for="kwFtEmail">회사 이메일</label>
            <input id="kwFtEmail" type="email" class="kw-ft-input" value="hsubkim@wert.co.kr" placeholder="이메일을 입력해주세요">
          </div>

          <div class="kw-ft-field">
            <label class="kw-ft-label" for="kwFtPhone">회사 전화번호</label>
            <input id="kwFtPhone" type="tel" class="kw-ft-input" value="0212345678" placeholder="(-)를 제외하고 입력해주세요">
          </div>

          <div class="kw-ft-field">
            <label class="kw-ft-label" for="kwFtRoute">어떻게 키워트 인사이트를 알게 되셨나요?</label>
            <select id="kwFtRoute" class="kw-ft-input kw-ft-select">
              <option value="">경로를 선택해주세요</option>
              <option value="referral" selected>지인 추천</option>
              <option value="search">검색</option>
              <option value="sns">SNS</option>
              <option value="media">미디어/뉴스</option>
              <option value="event">행사/세미나</option>
              <option value="other">기타</option>
            </select>
          </div>

          <div class="kw-ft-field">
            <label class="kw-ft-label" for="kwFtPurpose">키워트 인사이트를 어디에 활용하고 싶으신가요?</label>
            <div class="kw-ft-textarea-wrap">
              <textarea id="kwFtPurpose" class="kw-ft-input kw-ft-textarea" maxlength="300"
                placeholder="예) 활용 업무, 해결하고싶은 이슈, 활용하고 싶은 기능 등"
                oninput="kwFreeTrialUpdateCount(this)">선행기술조사 및 특허 분석 업무에 주로 활용하고자 합니다. AI 특허 검색과 분석 결과물 생성 기능을 통해 조사 업무 효율화를 기대하고 있습니다.</textarea>
              <span class="kw-ft-char-count" id="kwFtCharCount">97/300</span>
            </div>
          </div>

          <div class="kw-ft-privacy">
            <div class="kw-ft-privacy-row">
              <input type="checkbox" class="kw-ft-checkbox" id="kwFtPrivacy" checked onchange="kwFreeTrialCheckForm()">
              <label class="kw-ft-privacy-label" for="kwFtPrivacy">개인정보 처리방침에 동의합니다</label>
            </div>
            <p class="kw-ft-privacy-text">'㈜워트인텔리전스'는 고객님의 신청내용에 정확하고 신속한 답변을 드리기 위해 필요한 최소한의 개인정보를 수집하고 있습니다. 이에 개인정보의 수집범위, 보유 및 이용기간에 관하여 고지하오니 확인하신 후 동의하여 주시기 바랍니다.</p>
            <p class="kw-ft-privacy-detail">(1) 개인정보 수집범위 : 성명, 회사명, 연락처, 이메일<br>(2) 보유 및 이용기간 : 동의를 철회할 때까지</p>
            <div style="border-top: 1px solid rgba(30,30,30,0.08); margin-top: 2px; padding-top: 10px; display: flex; flex-direction: column; gap: 8px;">
              <div class="kw-ft-privacy-row">
                <input type="checkbox" class="kw-ft-checkbox" id="kwFtMarketing" onchange="kwFreeTrialCheckForm()">
                <label class="kw-ft-privacy-label" for="kwFtMarketing">무료체험 혜택 제공 및 이벤트·프로모션 안내를 위한 광고성 정보 수신에 동의합니다.</label>
              </div>
              <p class="kw-ft-privacy-text">동의 시 이메일, 문자(SMS/LMS), 전화 등을 통해 무료체험 및 서비스 관련 정보를 받아보실 수 있습니다. 동의는 언제든지 철회할 수 있으며, 동의하지 않을 경우 무료체험 혜택 제공이 제한될 수 있습니다.</p>
            </div>
          </div>

        </div>

        <div class="kw-ft-submit-wrap">
          <button id="kwFtSubmit" class="kw-ft-submit active" onclick="kwSubmitFreeTrial()">신청</button>
        </div>
      </div>
    </div>

    <!-- 성공 오버레이 -->
    <div class="kw-ft-success" id="kwFtSuccess">
      <div class="kw-ft-success-card">
        <div class="kw-ft-success-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00A08C" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h2 class="kw-ft-success-title">무료 체험 신청이<br>완료되었습니다!</h2>
        <p class="kw-ft-success-desc">담당자 확인 후 이메일로 안내 드리겠습니다.<br>빠른 시일 내에 연락드리겠습니다.</p>
        <p class="kw-ft-success-redirect">잠시 후 창이 닫힙니다...</p>
      </div>
    </div>
  `;

  /* ESC 키로 닫기 */
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') kwHideFreeTrialModal();
  });

  /* 오버레이 배경 클릭으로 닫기 */
  el.addEventListener('click', function(e) {
    if (e.target === el) kwHideFreeTrialModal();
  });

  document.body.appendChild(el);
}

/* ── 접근 제한 페이지 ── */
const KW_RESTRICTED = ['pro_search.html', 'insight_search.html', 'insight_techtrend.html', 'chemistry_search.html'];

function kwPageGuard() {
  if (kwGetUser()) return;
  const page = location.pathname.split('/').pop() || 'index.html';
  if (KW_RESTRICTED.includes(page)) {
    sessionStorage.setItem('kw_redirect', location.href);
    location.replace('login.html');
  }
}

function kwGuardLinks() {
  if (kwGetUser()) return;
  document.querySelectorAll('a[href]').forEach(function(link) {
    const href = link.getAttribute('href') || '';
    const target = href.split('/').pop().split('?')[0].split('#')[0];
    if (KW_RESTRICTED.includes(target)) {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        sessionStorage.setItem('kw_redirect', href);
        location.href = 'login.html';
      });
    }
  });
}

/* ── 초기화 ── */
document.addEventListener('DOMContentLoaded', function() {
  kwPageGuard();
  kwRenderHeader();
  kwGuardLinks();

  /* 모달 주입 (free_trial.html 자체 페이지 제외) */
  const page = location.pathname.split('/').pop() || '';
  if (page !== 'free_trial.html' && page !== 'login.html' && page !== 'signup.html') {
    kwInjectFreeTrialModal();
    kwFreeTrialCheckForm();

    /* 로그인 후 모달 자동 열기 */
    if (sessionStorage.getItem('kw_free_trial_pending') && kwGetUser()) {
      sessionStorage.removeItem('kw_free_trial_pending');
      kwShowFreeTrialModal();
    }

    /* 정적 HTML의 free_trial.html 링크를 모달로 전환 */
    document.querySelectorAll('a[href="free_trial.html"]').forEach(function(link) {
      link.removeAttribute('href');
      link.style.cursor = 'pointer';
      link.addEventListener('click', function(e) {
        e.preventDefault();
        kwHandleFreeTrialClick();
      });
    });

    /* 히어로 섹션 등 무료체험 버튼 */
    document.querySelectorAll('.btn-hero-primary').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        kwHandleFreeTrialClick();
      });
    });
  }
});
