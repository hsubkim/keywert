(function () {
  'use strict';

  var SVG_AI   = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2L9.4 5.8L13.5 6.1L10.5 8.8L11.4 12.9L8 10.8L4.6 12.9L5.5 8.8L2.5 6.1L6.6 5.8L8 2Z" fill="#00A08C"/></svg>';
  var SVG_CHK  = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#00A08C" stroke-width="2" stroke-linecap="round"><path d="M3 8l4 4 6-7"/></svg>';
  var SVG_X    = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="rgba(30,30,30,0.3)" stroke-width="1.8" stroke-linecap="round"><path d="M4 4l8 8M12 4l-8 8"/></svg>';
  var SVG_INFO = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="rgba(30,30,30,0.55)" stroke-width="1.5" stroke-linecap="round"><circle cx="8" cy="8" r="6.5"/><path d="M8 5v4M8 11v.5"/></svg>';
  var SVG_STAR = '<svg width="14" height="14" viewBox="0 0 16 16" fill="white"><path d="M8 2L9.4 5.8L13.5 6.1L10.5 8.8L11.4 12.9L8 10.8L4.6 12.9L5.5 8.8L2.5 6.1L6.6 5.8L8 2Z"/></svg>';

  function fi(cls, icon, text, sub) {
    return '<div class="' + cls + '-fi' + (sub ? ' ' + cls + '-fi-sub' : '') + '">'
      + icon
      + '<div class="' + cls + '-fi-right">'
      + '<span>' + text + '</span>'
      + (sub ? '<span class="' + cls + '-fi-sub-text">' + sub + '</span>' : '')
      + '</div></div>';
  }

  function injectStyles() {
    if (document.getElementById('upm-styles')) return;
    var s = document.createElement('style');
    s.id = 'upm-styles';
    s.textContent = [
      /* 오버레이 */
      '#upm-root{display:none;position:fixed;inset:0;z-index:9000;background:rgba(0,0,0,.48);align-items:center;justify-content:center;padding:24px;}',
      /* 모달 */
      '#upm-modal{position:relative;width:920px;max-width:100%;max-height:calc(100vh - 48px);overflow-y:auto;background:#fff;border-radius:16px;padding:32px;box-shadow:0 0 1px 0 rgba(0,0,0,.08),0 2px 8px 0 rgba(0,0,0,.12);display:flex;flex-direction:column;gap:24px;}',
      /* 닫기 */
      '#upm-close{position:absolute;top:16px;right:16px;width:40px;height:40px;display:flex;align-items:center;justify-content:center;background:none;border:none;cursor:pointer;border-radius:4px;transition:background .12s;}',
      '#upm-close:hover{background:rgba(30,30,30,.06);}',
      /* 서비스 탭 */
      '.upm-tabs{display:flex;gap:8px;padding-right:48px;}',
      '.upm-tab{padding:7px 20px;font-size:14px;font-weight:600;border-radius:8px;cursor:pointer;border:none;font-family:inherit;transition:all .15s;}',
      '.upm-tab-insight{background:#0BB8C9;color:#fff;}',
      '.upm-tab-pro{background:#00A08C;color:#fff;}',
      '.upm-tab-inactive{background:#F3F4F6;color:rgba(30,30,30,.55);}',
      '.upm-tab-inactive:hover{background:#E5E7EB;color:rgba(30,30,30,.84);}',
      /* 섹션 */
      '.upm-section{display:none;flex-direction:column;gap:16px;}',
      '.upm-section.active{display:flex;}',
      /* 타이틀 */
      '.upm-title{font-size:24px;font-weight:700;color:#000;line-height:136%;}',
      /* 토글 */
      '.upm-toggle{display:flex;justify-content:flex-end;align-items:center;gap:8px;}',
      '.upm-toggle-label{font-size:14px;font-weight:500;color:rgba(30,30,30,.55);}',
      '.upm-toggle-sw{width:44px;height:24px;background:#00A08C;border-radius:40px;padding:4px 4px 4px 22px;display:flex;align-items:center;cursor:pointer;}',
      '.upm-toggle-knob{width:16px;height:16px;background:#fff;border-radius:50%;}',
      /* 그리드 */
      '.upm-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;align-items:stretch;}',
      '.upm-col{display:flex;flex-direction:column;}',
      '.upm-col-padded{padding-top:40px;}',
      '.upm-col-pro{display:flex;flex-direction:column;filter:drop-shadow(0 0 10px rgba(0,170,140,.36));}',
      /* 프로모 배너 */
      '.upm-promo{background:#00A08C;padding:6px 4px 4px;border-radius:12px 12px 0 0;display:flex;flex-direction:column;align-items:center;gap:0;}',
      '.upm-promo-top{display:flex;align-items:center;gap:4px;font-size:13px;font-weight:700;color:#fff;}',
      '.upm-promo-sub{font-size:12px;color:#E8F6F5;}',
      /* 카드 */
      '.upm-card{background:rgba(90,90,90,.05);border:1px solid rgba(30,30,30,.02);border-radius:12px;padding:16px 16px 32px;display:flex;flex-direction:column;gap:24px;flex:1;}',
      '.upm-card-pro{border-radius:0 0 12px 12px;border-top:none;border-color:#00A08C;}',
      /* 카드 내용 */
      '.upm-card-sub{font-size:13px;font-weight:500;color:#1E1E1E;}',
      '.upm-card-name-row{display:flex;align-items:center;gap:6px;margin-top:2px;}',
      '.upm-card-name{font-size:18px;font-weight:700;color:#000;}',
      '.upm-badge{font-size:14px;font-weight:700;color:#00A08C;background:rgba(0,160,140,.09);padding:0 4px;border-radius:4px;}',
      '.upm-price-wrap{display:flex;flex-direction:column;gap:0;margin-top:16px;}',
      '.upm-orig{font-size:16px;font-weight:500;color:rgba(30,30,30,.42);text-decoration:line-through;}',
      '.upm-price-row{display:flex;align-items:flex-end;gap:4px;}',
      '.upm-price{font-size:22px;font-weight:700;color:#1E1E1E;}',
      '.upm-period{font-size:14px;font-weight:500;color:rgba(30,30,30,.55);margin-bottom:2px;}',
      '.upm-price-sub{font-size:14px;font-weight:500;color:rgba(30,30,30,.55);}',
      /* 버튼 */
      '.upm-btn{width:100%;padding:10px 16px;border-radius:8px;font-size:14px;font-weight:700;font-family:inherit;cursor:pointer;border:none;transition:all .15s;line-height:146%;}',
      '.upm-btn-current{background:rgba(0,160,140,.09);color:rgba(30,30,30,.16);cursor:default;}',
      '.upm-btn-green{background:#00A08C;color:#fff;}',
      '.upm-btn-green:hover{background:#009080;}',
      '.upm-btn-outline{background:#00A08C;color:#fff;}',
      '.upm-btn-outline:hover{background:#009080;}',
      /* 피처 */
      '.upm-features{display:flex;flex-direction:column;gap:4px;}',
      '.upm-feature-label{font-size:14px;font-weight:500;color:rgba(30,30,30,.55);margin-bottom:2px;}',
      '.upm-fi{display:flex;align-items:flex-start;gap:4px;font-size:13px;font-weight:500;color:#1E1E1E;}',
      '.upm-fi svg{flex-shrink:0;margin-top:2px;}',
      '.upm-fi-right{display:flex;flex-direction:column;gap:2px;}',
      '.upm-fi-sub-text{font-size:12px;font-weight:500;color:rgba(30,30,30,.55);}',
      '.upm-fi strong{font-weight:700;}',
      '.upm-group-label{display:flex;align-items:center;gap:4px;font-size:14px;font-weight:500;color:rgba(30,30,30,.55);margin-bottom:2px;}',
      /* VAT */
      '.upm-vat{display:flex;align-items:center;gap:4px;font-size:12px;color:rgba(30,30,30,.55);}',
    ].join('');
    document.head.appendChild(s);
  }

  function insightCards() {
    return [
      '<div class="upm-grid">',

      /* 라이트 */
      '<div class="upm-col upm-col-padded"><div class="upm-card">',
      '<div><div class="upm-card-sub">AI 특허 분석을 체험하고 싶은 개인이라면</div>',
      '<div class="upm-card-name-row"><span class="upm-card-name">라이트</span><span class="upm-badge">47% 할인</span></div>',
      '<div class="upm-price-wrap"><div class="upm-orig">158,000원</div>',
      '<div class="upm-price-row"><span class="upm-price">82,500원</span><span class="upm-period">1인/월</span></div></div></div>',
      '<button class="upm-btn upm-btn-current" disabled>현재 플랜</button>',
      '<div class="upm-features"><div class="upm-feature-label">지급된 토큰 사용</div>',
      fi('upm', SVG_AI, 'AI 토큰 지급'),
      fi('upm', SVG_AI, 'AI 특허 검색'),
      fi('upm', SVG_AI, 'AI 분석 결과물 생성'),
      fi('upm', SVG_X,  '프로젝트 생성 제한'),
      fi('upm', SVG_X,  'AI 분석 결과물 저장 및 공유', '· 파일 10MB/건, 월 누적 100MB'),
      '</div></div></div>',

      /* 프로 */
      '<div class="upm-col upm-col-pro">',
      '<div class="upm-promo">',
      '<div class="upm-promo-top">' + SVG_STAR + '6월 까지, 토큰 2배 이벤트' + SVG_STAR + '</div>',
      '<div class="upm-promo-sub">라이트 대비 약 20배 토큰 제공</div></div>',
      '<div class="upm-card upm-card-pro">',
      '<div><div class="upm-card-sub">AI 특허 분석을 업무에 적극 활용하고 싶다면</div>',
      '<div class="upm-card-name-row"><span class="upm-card-name">프로</span><span class="upm-badge">44% 할인</span></div>',
      '<div class="upm-price-wrap"><div class="upm-orig">598,800원</div>',
      '<div class="upm-price-row"><span class="upm-price">332,500원</span><span class="upm-period">1인/월</span></div></div></div>',
      '<button class="upm-btn upm-btn-green">프로 시작하기</button>',
      '<div class="upm-features"><div class="upm-feature-label">토큰 걱정없는 AI 기능 사용</div>',
      fi('upm', SVG_AI, '<strong>라이트 대비 AI 토큰 10배 지급</strong>'),
      fi('upm', SVG_AI, 'AI 특허 검색'),
      fi('upm', SVG_AI, 'AI 분석 결과물 생성'),
      fi('upm', SVG_CHK, '프로젝트 생성 무제한'),
      fi('upm', SVG_CHK, '외부 사용자 초대 및 협업', '· 게스트 3명/시트 당'),
      fi('upm', SVG_CHK, 'AI 분석 결과물 저장 및 공유 무제한'),
      fi('upm', SVG_CHK, 'PDF 첨부 검색 용량 무제한'),
      fi('upm', SVG_CHK, '어드민(Admin) 기능 제공'),
      '</div></div></div>',

      /* 엔터프라이즈 */
      '<div class="upm-col upm-col-padded"><div class="upm-card">',
      '<div><div class="upm-card-sub">대규모 조직에 맞춤 적용하고 싶다면</div>',
      '<div class="upm-card-name-row"><span class="upm-card-name">엔터프라이즈</span></div>',
      '<div class="upm-price-wrap"><div class="upm-price-sub">15명 이상 이용한다면</div>',
      '<div class="upm-price-row"><span class="upm-price">맞춤형 가격</span></div></div></div>',
      '<button class="upm-btn upm-btn-outline">문의하기</button>',
      '<div class="upm-features"><div class="upm-group-label">라이트 ⋅ 프로 플랜의 모든 기능 ' + SVG_INFO + '</div>',
      fi('upm', SVG_CHK, '외부 사용자 초대 및 협업 무제한'),
      fi('upm', SVG_CHK, '기업 보안 강화 기능', '· SAML SSO 통합 로그인<br>· 접속 IP 관리<br>· 감사 로그'),
      fi('upm', SVG_CHK, '기업 환경에 맞는 결제 방식 지원'),
      fi('upm', SVG_CHK, '전담 어카운트 매니저'),
      '</div></div></div>',

      '</div>',
    ].join('');
  }

  function proCards() {
    return [
      '<div class="upm-grid">',

      /* 라이트 */
      '<div class="upm-col upm-col-padded"><div class="upm-card">',
      '<div><div class="upm-card-sub">특허 검색&amp;분석을 이용하고 싶은 개인이라면</div>',
      '<div class="upm-card-name-row"><span class="upm-card-name">라이트</span><span class="upm-badge">47% 할인</span></div>',
      '<div class="upm-price-wrap"><div class="upm-orig">158,000원</div>',
      '<div class="upm-price-row"><span class="upm-price">82,500원</span><span class="upm-period">1인/월</span></div></div></div>',
      '<button class="upm-btn upm-btn-current" disabled>현재 플랜</button>',
      '<div class="upm-features"><div class="upm-feature-label">지급된 토큰 사용</div>',
      fi('upm', SVG_AI, 'AI 토큰 지급'),
      fi('upm', SVG_AI, 'AI 특허 검색'),
      fi('upm', SVG_AI, 'AI 분석 결과물 생성'),
      fi('upm', SVG_X,  '프로젝트 생성 제한'),
      fi('upm', SVG_X,  'AI 분석 결과물 저장 및 공유', '· 파일 10MB/건, 월 누적 100MB'),
      '</div></div></div>',

      /* 프로 */
      '<div class="upm-col upm-col-pro">',
      '<div class="upm-promo">',
      '<div class="upm-promo-top">' + SVG_STAR + 'insight 무료 토큰 2배 이벤트' + SVG_STAR + '</div>',
      '<div class="upm-promo-sub">pro와 함께 insight 이용도 한번에!</div></div>',
      '<div class="upm-card upm-card-pro">',
      '<div><div class="upm-card-sub">특허 검색&amp;분석을 업무에 활용하고 싶다면</div>',
      '<div class="upm-card-name-row"><span class="upm-card-name">프로</span><span class="upm-badge">44% 할인</span></div>',
      '<div class="upm-price-wrap"><div class="upm-orig">598,800원</div>',
      '<div class="upm-price-row"><span class="upm-price">332,500원</span><span class="upm-period">1인/월</span></div></div></div>',
      '<button class="upm-btn upm-btn-green">프로 시작하기</button>',
      '<div class="upm-features"><div class="upm-feature-label">토큰 걱정없는 AI 기능 사용</div>',
      fi('upm', SVG_AI, '<strong>라이트 대비 AI 토큰 10배 지급</strong>'),
      fi('upm', SVG_AI, 'AI 특허 검색'),
      fi('upm', SVG_AI, 'AI 분석 결과물 생성'),
      fi('upm', SVG_CHK, '프로젝트 생성 무제한'),
      fi('upm', SVG_CHK, '외부 사용자 초대 및 협업', '· 게스트 3명/시트 당'),
      fi('upm', SVG_CHK, 'AI 분석 결과물 저장 및 공유 무제한'),
      fi('upm', SVG_CHK, 'PDF 첨부 검색 용량 무제한'),
      fi('upm', SVG_CHK, '어드민(Admin) 기능 제공'),
      '</div></div></div>',

      /* 엔터프라이즈 */
      '<div class="upm-col upm-col-padded"><div class="upm-card">',
      '<div><div class="upm-card-sub">대규모 조직에 맞춤 적용하고 싶다면</div>',
      '<div class="upm-card-name-row"><span class="upm-card-name">엔터프라이즈</span></div>',
      '<div class="upm-price-wrap"><div class="upm-price-sub">15명 이상 이용한다면</div>',
      '<div class="upm-price-row"><span class="upm-price">맞춤형 가격</span></div></div></div>',
      '<button class="upm-btn upm-btn-outline">문의하기</button>',
      '<div class="upm-features"><div class="upm-group-label">라이트 ⋅ 프로 플랜의 모든 기능 ' + SVG_INFO + '</div>',
      fi('upm', SVG_CHK, '외부 사용자 초대 및 협업 무제한'),
      fi('upm', SVG_CHK, '기업 보안 강화 기능', '· SAML SSO 통합 로그인<br>· 접속 IP 관리<br>· 감사 로그'),
      fi('upm', SVG_CHK, '기업 환경에 맞는 결제 방식 지원'),
      fi('upm', SVG_CHK, '전담 어카운트 매니저'),
      '</div></div></div>',

      '</div>',
    ].join('');
  }

  function modalHTML() {
    return [
      '<div id="upm-root">',
      '<div id="upm-modal">',

      '<button id="upm-close" onclick="closeUnifiedPlanModal()" title="닫기">',
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(30,30,30,0.55)" stroke-width="2.5" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>',
      '</button>',

      /* 서비스 탭 */
      '<div class="upm-tabs">',
      '<button class="upm-tab upm-tab-insight" id="upm-tab-insight" onclick="upmSwitchTab(\'insight\')">Insight 플랜</button>',
      '<button class="upm-tab upm-tab-inactive" id="upm-tab-pro" onclick="upmSwitchTab(\'pro\')">Pro 플랜</button>',
      '</div>',

      /* Insight 섹션 */
      '<div class="upm-section active" id="upm-section-insight">',
      '<h2 class="upm-title">플랜을 구독하고 기술 리서치 전 과정을 AI로 자동화하세요</h2>',
      '<div class="upm-toggle"><span class="upm-toggle-label">연간 플랜</span><div class="upm-toggle-sw"><div class="upm-toggle-knob"></div></div></div>',
      insightCards(),
      '<div class="upm-vat">' + SVG_INFO + '<span>표시된 금액에서 부가세(10%)는 별도로 부과됩니다.</span></div>',
      '</div>',

      /* Pro 섹션 */
      '<div class="upm-section" id="upm-section-pro">',
      '<h2 class="upm-title">특허 검색과 분석, 시각화, 보고서 작성까지 모두 이용하세요.</h2>',
      '<div class="upm-toggle"><span class="upm-toggle-label">연간 플랜</span><div class="upm-toggle-sw"><div class="upm-toggle-knob"></div></div></div>',
      proCards(),
      '<div class="upm-vat">' + SVG_INFO + '<span>표시된 금액에서 부가세(10%)는 별도로 부과됩니다.</span></div>',
      '</div>',

      '</div>',
      '</div>',
    ].join('');
  }

  function init() {
    injectStyles();
    if (!document.getElementById('upm-root')) {
      var div = document.createElement('div');
      div.innerHTML = modalHTML();
      document.body.appendChild(div.firstChild);
    }
    document.getElementById('upm-root').addEventListener('click', function (e) {
      if (e.target === this) closeUnifiedPlanModal();
    });
  }

  window.upmSwitchTab = function (tab) {
    var isInsight = tab === 'insight';
    document.getElementById('upm-tab-insight').className = isInsight ? 'upm-tab upm-tab-insight' : 'upm-tab upm-tab-inactive';
    document.getElementById('upm-tab-pro').className     = isInsight ? 'upm-tab upm-tab-inactive' : 'upm-tab upm-tab-pro';
    document.getElementById('upm-section-insight').className = isInsight ? 'upm-section active' : 'upm-section';
    document.getElementById('upm-section-pro').className     = isInsight ? 'upm-section' : 'upm-section active';
  };

  window.closeUnifiedPlanModal = function () {
    var root = document.getElementById('upm-root');
    if (root) root.style.display = 'none';
  };

  /* 기존 openInsightPlanModal / openProPlanModal 오버라이드 */
  window.openInsightPlanModal = function () {
    var root = document.getElementById('upm-root');
    if (root) { upmSwitchTab('insight'); root.style.display = 'flex'; }
  };
  window.openProPlanModal = function () {
    var root = document.getElementById('upm-root');
    if (root) { upmSwitchTab('pro'); root.style.display = 'flex'; }
  };
  /* 기존 close 함수도 동일하게 처리 */
  window.closeInsightPlanModal = window.closeUnifiedPlanModal;
  window.closeProPlanModal     = window.closeUnifiedPlanModal;

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeUnifiedPlanModal();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
