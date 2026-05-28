(function () {
  'use strict';

  var SVG_AI   = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2L9.4 5.8L13.5 6.1L10.5 8.8L11.4 12.9L8 10.8L4.6 12.9L5.5 8.8L2.5 6.1L6.6 5.8L8 2Z" fill="#00A08C"/></svg>';
  var SVG_CHK  = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#00A08C" stroke-width="2" stroke-linecap="round"><path d="M3 8l4 4 6-7"/></svg>';
  var SVG_X    = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="rgba(30,30,30,0.3)" stroke-width="1.8" stroke-linecap="round"><path d="M4 4l8 8M12 4l-8 8"/></svg>';
  var SVG_INFO = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="rgba(30,30,30,0.55)" stroke-width="1.5" stroke-linecap="round"><circle cx="8" cy="8" r="6.5"/><path d="M8 5v4M8 11v.5"/></svg>';
  var SVG_STAR_W = '<svg width="14" height="14" viewBox="0 0 16 16" fill="white"><path d="M8 2L9.4 5.8L13.5 6.1L10.5 8.8L11.4 12.9L8 10.8L4.6 12.9L5.5 8.8L2.5 6.1L6.6 5.8L8 2Z"/></svg>';

  function fi(icon, text, sub) {
    return '<div class="ppm-fi' + (sub ? ' ppm-fi-sub' : '') + '">'
      + icon
      + '<div class="ppm-fi-right">'
      + '<span>' + text + '</span>'
      + (sub ? '<span class="ppm-fi-sub-text">' + sub + '</span>' : '')
      + '</div>'
      + '</div>';
  }

  function injectStyles() {
    if (document.getElementById('ppm-styles')) return;
    var s = document.createElement('style');
    s.id = 'ppm-styles';
    s.textContent = [
      '#ppm-root{display:none;position:fixed;inset:0;z-index:9000;background:rgba(0,0,0,.48);align-items:center;justify-content:center;padding:24px;}',
      '#ppm-modal{position:relative;width:888px;max-width:100%;max-height:calc(100vh - 48px);overflow-y:auto;background:#fff;border-radius:16px;padding:32px;box-shadow:0 0 1px 0 rgba(0,0,0,.08),0 1px 4px 0 rgba(0,0,0,.08),0 2px 8px 0 rgba(0,0,0,.12);display:flex;flex-direction:column;gap:32px;}',
      '#ppm-close{position:absolute;top:16px;right:16px;width:40px;height:40px;display:flex;align-items:center;justify-content:center;background:none;border:none;cursor:pointer;border-radius:4px;transition:background .12s;}',
      '#ppm-close:hover{background:rgba(30,30,30,.06);}',
      '.ppm-title{font-family:inherit;font-size:28px;font-weight:700;color:#000;line-height:136%;padding-right:48px;}',
      '.ppm-content{display:flex;flex-direction:column;gap:10px;}',
      '.ppm-plans-wrap{position:relative;}',
      '.ppm-toggle{position:absolute;top:0;right:0;display:flex;align-items:center;gap:8px;z-index:1;}',
      '.ppm-toggle-label{font-size:14px;font-weight:500;color:rgba(30,30,30,.55);}',
      '.ppm-toggle-sw{width:44px;height:24px;background:#00A08C;border-radius:40px;padding:4px 4px 4px 22px;display:flex;align-items:center;cursor:pointer;}',
      '.ppm-toggle-knob{width:16px;height:16px;background:#fff;border-radius:50%;}',
      '.ppm-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;align-items:stretch;}',
      '.ppm-col{display:flex;flex-direction:column;}',
      '.ppm-col-padded{padding-top:40px;}',
      '.ppm-promo-banner{background:#00A08C;padding:2px 4px;border-radius:12px 12px 0 0;display:flex;flex-direction:column;align-items:center;gap:-2px;}',
      '.ppm-promo-top{display:flex;align-items:center;gap:4px;font-size:13px;font-weight:700;color:#fff;}',
      '.ppm-promo-sub{font-size:12px;font-weight:400;color:#E8F6F5;}',
      '.ppm-card{background:rgba(90,90,90,.05);border:1px solid rgba(30,30,30,.02);border-radius:12px;padding:16px 16px 32px;display:flex;flex-direction:column;gap:24px;flex:1;}',
      '.ppm-card-pro{border-radius:0 0 12px 12px;border-top:none;border-color:#00A08C;}',
      '.ppm-col-pro{display:flex;flex-direction:column;filter:drop-shadow(0 0 10px rgba(0,170,140,.36));}',
      '.ppm-card-head{display:flex;flex-direction:column;gap:24px;}',
      '.ppm-card-top{display:flex;flex-direction:column;gap:2px;}',
      '.ppm-card-sub{font-size:13px;font-weight:500;color:#1E1E1E;}',
      '.ppm-card-name-row{display:flex;align-items:center;gap:6px;}',
      '.ppm-card-name{font-size:18px;font-weight:700;color:#000;}',
      '.ppm-badge{font-size:14px;font-weight:700;color:#00A08C;background:rgba(0,160,140,.09);padding:0 4px;border-radius:4px;}',
      '.ppm-price-wrap{display:flex;flex-direction:column;gap:0;}',
      '.ppm-original-price{font-size:16px;font-weight:500;color:rgba(30,30,30,.42);text-decoration:line-through;}',
      '.ppm-price-row{display:flex;align-items:flex-end;gap:4px;}',
      '.ppm-price{font-size:22px;font-weight:700;color:#1E1E1E;}',
      '.ppm-period{font-size:14px;font-weight:500;color:rgba(30,30,30,.55);margin-bottom:2px;}',
      '.ppm-price-sub{font-size:14px;font-weight:500;color:rgba(30,30,30,.55);}',
      '.ppm-btn{width:100%;padding:10px 16px;border-radius:8px;font-size:14px;font-weight:700;font-family:inherit;cursor:pointer;border:none;transition:all .15s;line-height:146%;}',
      '.ppm-btn-current{background:rgba(0,160,140,.09);color:rgba(30,30,30,.16);cursor:default;}',
      '.ppm-btn-green{background:#00A08C;color:#fff;}',
      '.ppm-btn-green:hover{background:#009080;}',
      '.ppm-btn-outline-green{background:#00A08C;color:#fff;border:1px solid transparent;}',
      '.ppm-btn-outline-green:hover{background:#009080;}',
      '.ppm-features{display:flex;flex-direction:column;gap:4px;}',
      '.ppm-feature-label{font-size:14px;font-weight:500;color:rgba(30,30,30,.55);margin-bottom:2px;}',
      '.ppm-fi{display:flex;align-items:flex-start;gap:4px;font-size:13px;font-weight:500;color:#1E1E1E;}',
      '.ppm-fi svg{flex-shrink:0;margin-top:2px;}',
      '.ppm-fi-right{display:flex;flex-direction:column;gap:2px;}',
      '.ppm-fi-sub-text{font-size:12px;font-weight:500;color:rgba(30,30,30,.55);}',
      '.ppm-fi strong{font-weight:700;}',
      '.ppm-feature-group-label{display:flex;align-items:center;gap:4px;font-size:14px;font-weight:500;color:rgba(30,30,30,.55);margin-bottom:2px;}',
      '.ppm-vat{display:flex;align-items:center;gap:4px;font-size:12px;color:rgba(30,30,30,.55);}',
    ].join('\n');
    document.head.appendChild(s);
  }

  function modalHTML() {
    return [
      '<div id="ppm-root">',
      '<div id="ppm-modal">',

      '<button id="ppm-close" onclick="closeProPlanModal()" title="닫기">',
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(30,30,30,0.55)" stroke-width="2.5" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>',
      '</button>',

      '<h2 class="ppm-title">특허 검색과 분석, 시각화, 보고서 작성까지 모두 이용하세요.</h2>',

      '<div class="ppm-content">',
      '<div class="ppm-plans-wrap">',

      '<div class="ppm-toggle">',
      '<span class="ppm-toggle-label">연간 플랜</span>',
      '<div class="ppm-toggle-sw"><div class="ppm-toggle-knob"></div></div>',
      '</div>',

      '<div class="ppm-grid">',

      /* ── 라이트 ── */
      '<div class="ppm-col ppm-col-padded">',
      '<div class="ppm-card">',
      '<div class="ppm-card-head">',
      '<div class="ppm-card-top">',
      '<div class="ppm-card-sub">특허 검색&amp;분석을 이용하고 싶은 개인이라면</div>',
      '<div class="ppm-card-name-row"><span class="ppm-card-name">라이트</span><span class="ppm-badge">47% 할인</span></div>',
      '</div>',
      '<div class="ppm-price-wrap">',
      '<div class="ppm-original-price">158,000원</div>',
      '<div class="ppm-price-row"><span class="ppm-price">82,500원</span><span class="ppm-period">1인/월</span></div>',
      '</div>',
      '</div>',
      '<button class="ppm-btn ppm-btn-current" disabled>현재 플랜</button>',
      '<div class="ppm-features">',
      '<div class="ppm-feature-label">지급된 토큰 사용</div>',
      fi(SVG_AI, 'AI 토큰 지급'),
      fi(SVG_AI, 'AI 특허 검색'),
      fi(SVG_AI, 'AI 분석 결과물 생성'),
      fi(SVG_X,  '프로젝트 생성 제한'),
      fi(SVG_X,  'AI 분석 결과물 저장 및 공유', '· 파일 10MB/건, 월 누적 100MB'),
      '</div>',
      '</div>',
      '</div>',

      /* ── 프로 ── */
      '<div class="ppm-col ppm-col-pro">',
      '<div class="ppm-promo-banner">',
      '<div class="ppm-promo-top">' + SVG_STAR_W + 'insight 무료 토큰 2배 이벤트' + SVG_STAR_W + '</div>',
      '<div class="ppm-promo-sub">pro와 함께 insight 이용도 한번에!</div>',
      '</div>',
      '<div class="ppm-card ppm-card-pro">',
      '<div class="ppm-card-head">',
      '<div class="ppm-card-top">',
      '<div class="ppm-card-sub">특허 검색&amp;분석을 업무에 활용하고 싶다면</div>',
      '<div class="ppm-card-name-row"><span class="ppm-card-name">프로</span><span class="ppm-badge">44% 할인</span></div>',
      '</div>',
      '<div class="ppm-price-wrap">',
      '<div class="ppm-original-price">598,800원</div>',
      '<div class="ppm-price-row"><span class="ppm-price">332,500원</span><span class="ppm-period">1인/월</span></div>',
      '</div>',
      '</div>',
      '<button class="ppm-btn ppm-btn-green">프로 시작하기</button>',
      '<div class="ppm-features">',
      '<div class="ppm-feature-label">토큰 걱정없는 AI 기능 사용</div>',
      fi(SVG_AI,  '<strong>라이트 대비 AI 토큰 10배 지급</strong>'),
      fi(SVG_AI,  'AI 특허 검색'),
      fi(SVG_AI,  'AI 분석 결과물 생성'),
      fi(SVG_CHK, '프로젝트 생성 무제한'),
      fi(SVG_CHK, '외부 사용자 초대 및 협업', '· 게스트 3명/시트 당'),
      fi(SVG_CHK, 'AI 분석 결과물 저장 및 공유 무제한'),
      fi(SVG_CHK, 'PDF 첨부 검색 용량 무제한'),
      fi(SVG_CHK, '어드민(Admin) 기능 제공'),
      '</div>',
      '</div>',
      '</div>',

      /* ── 엔터프라이즈 ── */
      '<div class="ppm-col ppm-col-padded">',
      '<div class="ppm-card">',
      '<div class="ppm-card-head">',
      '<div class="ppm-card-top">',
      '<div class="ppm-card-sub">대규모 조직에 맞춤 적용하고 싶다면</div>',
      '<div class="ppm-card-name-row"><span class="ppm-card-name">엔터프라이즈</span></div>',
      '</div>',
      '<div class="ppm-price-wrap">',
      '<div class="ppm-price-sub">15명 이상 이용한다면</div>',
      '<div class="ppm-price-row"><span class="ppm-price">맞춤형 가격</span></div>',
      '</div>',
      '</div>',
      '<button class="ppm-btn ppm-btn-outline-green">문의하기</button>',
      '<div class="ppm-features">',
      '<div class="ppm-feature-group-label">라이트 ⋅ 프로 플랜의 모든 기능 ' + SVG_INFO + '</div>',
      fi(SVG_CHK, '외부 사용자 초대 및 협업 무제한'),
      fi(SVG_CHK, '기업 보안 강화 기능', '· SAML SSO 통합 로그인\n· 접속 IP 관리\n· 감사 로그'),
      fi(SVG_CHK, '기업 환경에 맞는 결제 방식 지원'),
      fi(SVG_CHK, '전담 어카운트 매니저'),
      '</div>',
      '</div>',
      '</div>',

      '</div>', /* /ppm-grid */
      '</div>', /* /ppm-plans-wrap */

      '<div class="ppm-vat">',
      SVG_INFO,
      '<span>표시된 금액에서 부가세(10%)는 별도로 부과됩니다.</span>',
      '</div>',

      '</div>', /* /ppm-content */
      '</div>', /* /ppm-modal */
      '</div>', /* /ppm-root */
    ].join('');
  }

  function init() {
    injectStyles();
    if (!document.getElementById('ppm-root')) {
      var div = document.createElement('div');
      div.innerHTML = modalHTML();
      document.body.appendChild(div.firstChild);
    }
    document.getElementById('ppm-root').addEventListener('click', function (e) {
      if (e.target === this) closeProPlanModal();
    });
  }

  window.openProPlanModal = function () {
    var root = document.getElementById('ppm-root');
    if (root) root.style.display = 'flex';
  };

  window.closeProPlanModal = function () {
    var root = document.getElementById('ppm-root');
    if (root) root.style.display = 'none';
  };

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') window.closeProPlanModal();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
