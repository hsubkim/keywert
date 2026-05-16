/* ── keywert 공유 인증 모듈 ─────────────────────────── */

const KW_USERS = {
  'wert_free':  { name: '김무료', type: 'free' },
  'wert_paid':  { name: '김유료', type: 'paid' },
  'wert_trial': { name: '김체험', type: 'trial' }
};

const KW_PASSWORD = '1111';

/* CSS 주입 */
(function injectStyles() {
  const style = document.createElement('style');
  style.textContent = `
    /* ── User area ── */
    .kw-user-wrap {
      display: flex;
      align-items: center;
      gap: 10px;
      position: relative;
    }
    .kw-user-pill {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 4px 8px 4px 8px;
      border: 1.5px solid #E5E7EB;
      border-radius: 24px;
      background: #fff;
      transition: border-color 0.15s, background 0.15s;
      position: relative;
      user-select: none;
    }
    .kw-user-pill:hover { border-color: #C4C8CE; background: #F9FAFB; }

    .kw-trigger-wrap {
      position: relative;
    }

    .kw-trigger {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 2px 4px 2px 0;
      cursor: pointer;
    }

    .kw-token-link {
      display: flex;
      align-items: center;
      text-decoration: none;
      flex-shrink: 0;
    }

    .kw-icon {
      width: 28px; height: 28px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .kw-icon.free  { background: #F3F4F6; color: #C0C4CA; }
    .kw-icon.paid  { background: #D0F5F9; color: #29B8D8; }
    .kw-icon.trial { background: #DCFCE7; color: #16A34A; }

    .kw-name {
      font-size: 14px; font-weight: 600; color: #111827; white-space: nowrap;
    }

    /* Token badge */
    .kw-token {
      display: flex; align-items: center; gap: 5px;
      font-size: 12px; font-weight: 500; color: #fff;
      padding: 3px 10px; border-radius: 20px;
      white-space: nowrap; flex-shrink: 0;
    }
    .kw-token.paid  { background: #0BB8C9; }
    .kw-token.trial { background: #34C7A9; }
    .kw-token-sep   { opacity: 0.6; }

    .kw-chevron { color: #9CA3AF; flex-shrink: 0; margin-left: 2px; }

    /* Dropdown */
    .kw-dropdown {
      position: absolute;
      top: calc(100% + 6px);
      left: 0;
      min-width: 120px;
      background: #fff;
      border: 1px solid #E5E7EB;
      border-radius: 10px;
      box-shadow: 0 6px 16px rgba(0,0,0,0.09);
      padding: 4px;
      z-index: 500;
      display: none;
    }
    .kw-dropdown.open { display: block; }

    .kw-drop-item {
      display: flex; align-items: center;
      padding: 7px 12px; font-size: 12px; font-weight: 500; color: #374151;
      text-decoration: none; border-radius: 6px; border: none;
      background: none; width: 100%; cursor: pointer; font-family: inherit;
      transition: background 0.12s, color 0.12s;
      white-space: nowrap;
    }
    .kw-drop-item:hover { background: #F3F4F6; }
    .kw-drop-item.danger { color: #EF4444; }
    .kw-drop-item.danger:hover { background: #FEF2F2; }
    .kw-drop-sep { height: 1px; background: #F3F4F6; margin: 3px 0; }

    /* Trial start modal toast */
    .kw-toast {
      position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%);
      background: #111827; color: #fff; font-size: 14px; font-weight: 500;
      padding: 12px 24px; border-radius: 10px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.2);
      z-index: 9999; opacity: 0;
      transition: opacity 0.3s;
    }
    .kw-toast.show { opacity: 1; }
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
  window.location.href = 'index.html';
}

function kwUpgradeToTrial() {
  const user = kwGetUser();
  if (!user || user.type !== 'free') return;
  user.type = 'trial';
  user.name = '김체험';
  kwSetUser(user);
  kwShowToast('무료체험이 시작되었습니다! 🎉 D-10');
  setTimeout(kwRenderHeader, 500);
}

function kwShowToast(msg) {
  const t = document.createElement('div');
  t.className = 'kw-toast';
  t.textContent = msg;
  document.body.appendChild(t);
  requestAnimationFrame(() => { t.classList.add('show'); });
  setTimeout(() => {
    t.classList.remove('show');
    setTimeout(() => t.remove(), 400);
  }, 2800);
}

/* ── 드롭다운 토글 ── */
function kwToggleDropdown(e) {
  e.stopPropagation();
  const dd = document.getElementById('kwDropdown');
  if (dd) dd.classList.toggle('open');
}

document.addEventListener('click', function() {
  const dd = document.getElementById('kwDropdown');
  if (dd) dd.classList.remove('open');
});

/* ── 헤더 렌더링 ── */
function kwRenderHeader() {
  const container = document.getElementById('headerActions');
  if (!container) return;

  const user = kwGetUser();

  /* ── 비로그인 ── */
  if (!user) {
    container.innerHTML = `
      <div style="display:flex;align-items:center;gap:0;">
        <a href="login.html" class="btn-text">로그인</a>
        <div class="btn-divider"></div>
        <a href="signup.html" class="btn-text">회원가입</a>
        <div class="btn-divider"></div>
        <a href="cslab.html" class="btn-text" target="_blank" rel="noopener">고객센터</a>
      </div>
      <a href="login.html" class="btn-primary">무료체험 시작하기</a>
    `;
    return;
  }

  /* ── 로그인 상태 ── */
  const { name, type } = user;

  // 아이콘 스타일
  const iconClass = type; // 'free' | 'paid' | 'trial'

  // 토큰 배지
  let tokenHTML = '';
  if (type === 'paid') {
    tokenHTML = `
      <span class="kw-token paid">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M18.364 5.636C16.958 4.23 15.044 3.5 13 3.5S9.042 4.23 7.636 5.636C6.23 7.042 5.5 8.956 5.5 11s.73 3.958 2.136 5.364C9.042 17.77 10.956 18.5 13 18.5s3.958-.73 5.364-2.136C19.77 14.958 20.5 13.044 20.5 11s-.73-3.958-2.136-5.364z" opacity="0"/><text x="5" y="17" font-size="14" font-weight="900" font-family="Arial">∞</text></svg>
        무제한
        <span class="kw-token-sep">|</span>
        남은 토큰 99%
      </span>`;
  } else if (type === 'trial') {
    tokenHTML = `
      <span class="kw-token trial">
        무료체험 D-10
        <span class="kw-token-sep">|</span>
        남은 토큰 99%
      </span>`;
  }

  // 무료체험 버튼 (무료회원만)
  const trialBtn = type === 'free'
    ? `<button class="btn-primary" onclick="kwUpgradeToTrial()" style="cursor:pointer;font-family:inherit;border:none;">무료체험 시작하기</button>`
    : '';

  const tokenLinkHTML = tokenHTML
    ? `<a href="#" class="kw-token-link" onclick="event.stopPropagation()">${tokenHTML}</a>`
    : '';

  container.innerHTML = `
    <a href="cslab.html" class="btn-text" target="_blank" rel="noopener">고객센터</a>
    <div class="kw-user-wrap">
      <div class="kw-user-pill" id="kwUserPill">
        <div class="kw-trigger-wrap">
          <div class="kw-trigger" onclick="kwToggleDropdown(event)">
            <div class="kw-icon ${iconClass}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <span class="kw-name">${name}</span>
            <svg class="kw-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>
          </div>
          <div class="kw-dropdown" id="kwDropdown">
            <a href="#" class="kw-drop-item">마이페이지</a>
            <div class="kw-drop-sep"></div>
            <button class="kw-drop-item danger" onclick="kwLogout()">로그아웃</button>
          </div>
        </div>
        ${tokenLinkHTML}
      </div>
    </div>
    ${trialBtn}
  `;
}

/* ── 접근 제한 페이지 ── */
const KW_RESTRICTED = ['pro_search.html', 'insight_search.html', 'insight_techtrend.html'];

/* ── 현재 페이지 직접 접근 가드 ── */
function kwPageGuard() {
  if (kwGetUser()) return;
  const page = location.pathname.split('/').pop() || 'index.html';
  if (KW_RESTRICTED.includes(page)) {
    sessionStorage.setItem('kw_redirect', location.href);
    location.replace('login.html');
  }
}

/* ── 링크 클릭 가드 (비로그인 시 제한 페이지 진입 차단) ── */
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
});
