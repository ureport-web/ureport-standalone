import{a as wt,b as Dt}from"./chunk-54IPWCL3.js";import{Aa as rt,B as Q,Ba as Ct,N as ot,V as xt,da as Bt,ea as st,g as it,ia as A,j as yt,la as F,ma as L,na as l,oa as m,q as Tt,r as _t,s as z,y as at}from"./chunk-RP2SIKJL.js";import{$ as o,$b as pt,Ab as N,Eb as b,Fb as V,Gb as q,Gc as vt,Hb as W,Kc as r,Lc as ht,Nb as U,Nc as g,Ob as G,Pb as ut,Pc as gt,Qb as O,Qc as X,Sb as h,Ta as v,Tb as I,Tc as T,Ub as M,Uc as mt,V as S,Vb as J,W as _,Wb as k,X as lt,Xb as p,Yb as f,Z as x,Zb as bt,ac as ft,ec as c,ga as H,ha as K,ia as nt,ib as B,jb as dt,jd as Y,mb as w,nb as D,ob as P,pd as R,qa as $,tc as E,td as Z,ua as u,wa as ct,wb as y,zb as C}from"./chunk-4S52IWZL.js";var Nt=`
    .p-tabs {
        display: flex;
        flex-direction: column;
    }

    .p-tablist {
        display: flex;
        position: relative;
        overflow: hidden;
        background: dt('tabs.tablist.background');
    }

    .p-tablist-viewport {
        overflow-x: auto;
        overflow-y: hidden;
        scroll-behavior: smooth;
        scrollbar-width: none;
        overscroll-behavior: contain auto;
    }

    .p-tablist-viewport::-webkit-scrollbar {
        display: none;
    }

    .p-tablist-tab-list {
        position: relative;
        display: flex;
        border-style: solid;
        border-color: dt('tabs.tablist.border.color');
        border-width: dt('tabs.tablist.border.width');
    }

    .p-tablist-content {
        flex-grow: 1;
    }

    .p-tablist-nav-button {
        all: unset;
        position: absolute !important;
        flex-shrink: 0;
        inset-block-start: 0;
        z-index: 2;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: dt('tabs.nav.button.background');
        color: dt('tabs.nav.button.color');
        width: dt('tabs.nav.button.width');
        transition:
            color dt('tabs.transition.duration'),
            outline-color dt('tabs.transition.duration'),
            box-shadow dt('tabs.transition.duration');
        box-shadow: dt('tabs.nav.button.shadow');
        outline-color: transparent;
        cursor: pointer;
    }

    .p-tablist-nav-button:focus-visible {
        z-index: 1;
        box-shadow: dt('tabs.nav.button.focus.ring.shadow');
        outline: dt('tabs.nav.button.focus.ring.width') dt('tabs.nav.button.focus.ring.style') dt('tabs.nav.button.focus.ring.color');
        outline-offset: dt('tabs.nav.button.focus.ring.offset');
    }

    .p-tablist-nav-button:hover {
        color: dt('tabs.nav.button.hover.color');
    }

    .p-tablist-prev-button {
        inset-inline-start: 0;
    }

    .p-tablist-next-button {
        inset-inline-end: 0;
    }

    .p-tablist-prev-button:dir(rtl),
    .p-tablist-next-button:dir(rtl) {
        transform: rotate(180deg);
    }

    .p-tab {
        flex-shrink: 0;
        cursor: pointer;
        user-select: none;
        position: relative;
        border-style: solid;
        white-space: nowrap;
        gap: dt('tabs.tab.gap');
        background: dt('tabs.tab.background');
        border-width: dt('tabs.tab.border.width');
        border-color: dt('tabs.tab.border.color');
        color: dt('tabs.tab.color');
        padding: dt('tabs.tab.padding');
        font-weight: dt('tabs.tab.font.weight');
        transition:
            background dt('tabs.transition.duration'),
            border-color dt('tabs.transition.duration'),
            color dt('tabs.transition.duration'),
            outline-color dt('tabs.transition.duration'),
            box-shadow dt('tabs.transition.duration');
        margin: dt('tabs.tab.margin');
        outline-color: transparent;
    }

    .p-tab:not(.p-disabled):focus-visible {
        z-index: 1;
        box-shadow: dt('tabs.tab.focus.ring.shadow');
        outline: dt('tabs.tab.focus.ring.width') dt('tabs.tab.focus.ring.style') dt('tabs.tab.focus.ring.color');
        outline-offset: dt('tabs.tab.focus.ring.offset');
    }

    .p-tab:not(.p-tab-active):not(.p-disabled):hover {
        background: dt('tabs.tab.hover.background');
        border-color: dt('tabs.tab.hover.border.color');
        color: dt('tabs.tab.hover.color');
    }

    .p-tab-active {
        background: dt('tabs.tab.active.background');
        border-color: dt('tabs.tab.active.border.color');
        color: dt('tabs.tab.active.color');
    }

    .p-tabpanels {
        background: dt('tabs.tabpanel.background');
        color: dt('tabs.tabpanel.color');
        padding: dt('tabs.tabpanel.padding');
        outline: 0 none;
    }

    .p-tabpanel:focus-visible {
        box-shadow: dt('tabs.tabpanel.focus.ring.shadow');
        outline: dt('tabs.tabpanel.focus.ring.width') dt('tabs.tabpanel.focus.ring.style') dt('tabs.tabpanel.focus.ring.color');
        outline-offset: dt('tabs.tabpanel.focus.ring.offset');
    }

    .p-tablist-active-bar {
        z-index: 1;
        display: block;
        position: absolute;
        inset-block-end: dt('tabs.active.bar.bottom');
        height: dt('tabs.active.bar.height');
        background: dt('tabs.active.bar.background');
        transition: 250ms cubic-bezier(0.35, 0, 0.25, 1);
    }
`;var zt=["previcon"],Qt=["nexticon"],Ot=["content"],jt=["prevButton"],Ht=["nextButton"],Kt=["inkbar"],$t=["tabs"],j=["*"];function qt(e,d){e&1&&U(0)}function Wt(e,d){if(e&1&&P(0,qt,1,0,"ng-container",11),e&2){let t=h(2);b("ngTemplateOutlet",t.prevIconTemplate||t._prevIconTemplate)}}function Ut(e,d){e&1&&(nt(),W(0,"svg",10))}function Gt(e,d){if(e&1){let t=G();V(0,"button",9,3),O("click",function(){H(t);let n=h();return K(n.onPrevButtonClick())}),C(2,Wt,1,1,"ng-container")(3,Ut,1,0,":svg:svg",10),q()}if(e&2){let t=h();c(t.cx("prevButton")),b("pBind",t.ptm("prevButton")),y("aria-label",t.prevButtonAriaLabel)("tabindex",t.tabindex())("data-pc-group-section","navigator"),v(2),N(t.prevIconTemplate||t._prevIconTemplate?2:3)}}function Jt(e,d){e&1&&U(0)}function Xt(e,d){if(e&1&&P(0,Jt,1,0,"ng-container",11),e&2){let t=h(2);b("ngTemplateOutlet",t.nextIconTemplate||t._nextIconTemplate)}}function Yt(e,d){e&1&&(nt(),W(0,"svg",12))}function Zt(e,d){if(e&1){let t=G();V(0,"button",9,4),O("click",function(){H(t);let n=h();return K(n.onNextButtonClick())}),C(2,Xt,1,1,"ng-container")(3,Yt,1,0,":svg:svg",12),q()}if(e&2){let t=h();c(t.cx("nextButton")),b("pBind",t.ptm("nextButton")),y("aria-label",t.nextButtonAriaLabel)("tabindex",t.tabindex())("data-pc-group-section","navigator"),v(2),N(t.nextIconTemplate||t._nextIconTemplate?2:3)}}function te(e,d){e&1&&M(0)}function ee(e,d){e&1&&U(0)}function ne(e,d){if(e&1&&P(0,ee,1,0,"ng-container",1),e&2){let t=h(),i=ft(1);b("ngTemplateOutlet",t.content()?t.content():i)}}var ie={root:({instance:e})=>["p-tabs p-component",{"p-tabs-scrollable":e.scrollable()}]},It=(()=>{class e extends A{name="tabs";style=Nt;classes=ie;static \u0275fac=(()=>{let t;return function(n){return(t||(t=u(e)))(n||e)}})();static \u0275prov=_({token:e,factory:e.\u0275fac})}return e})();var ae={root:({instance:e})=>["p-tab",{"p-tab-active":e.active(),"p-disabled":e.disabled()}]},Mt=(()=>{class e extends A{name="tab";classes=ae;static \u0275fac=(()=>{let t;return function(n){return(t||(t=u(e)))(n||e)}})();static \u0275prov=_({token:e,factory:e.\u0275fac})}return e})();var oe={root:"p-tablist",content:"p-tablist-content p-tablist-viewport",tabList:"p-tablist-tab-list",activeBar:"p-tablist-active-bar",prevButton:"p-tablist-prev-button p-tablist-nav-button",nextButton:"p-tablist-next-button p-tablist-nav-button"},kt=(()=>{class e extends A{name="tablist";classes=oe;static \u0275fac=(()=>{let t;return function(n){return(t||(t=u(e)))(n||e)}})();static \u0275prov=_({token:e,factory:e.\u0275fac})}return e})();var Et=new x("TABLIST_INSTANCE"),Rt=(()=>{class e extends L{$pcTabList=o(Et,{optional:!0,skipSelf:!0})??void 0;bindDirectiveInstance=o(l,{self:!0});onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]))}prevIconTemplate;nextIconTemplate;templates;content;prevButton;nextButton;inkbar;tabs;pcTabs=o(S(()=>tt));isPrevButtonEnabled=$(!1);isNextButtonEnabled=$(!1);resizeObserver;showNavigators=r(()=>this.pcTabs.showNavigators());tabindex=r(()=>this.pcTabs.tabindex());scrollable=r(()=>this.pcTabs.scrollable());_componentStyle=o(kt);constructor(){super(),ht(()=>{this.pcTabs.value(),Z(this.platformId)&&setTimeout(()=>{this.updateInkBar()})})}get prevButtonAriaLabel(){return this.config?.translation?.aria?.previous}get nextButtonAriaLabel(){return this.config?.translation?.aria?.next}onAfterViewInit(){this.showNavigators()&&Z(this.platformId)&&(this.updateButtonState(),this.bindResizeObserver())}_prevIconTemplate;_nextIconTemplate;onAfterContentInit(){this.templates?.forEach(t=>{switch(t.getType()){case"previcon":this._prevIconTemplate=t.template;break;case"nexticon":this._nextIconTemplate=t.template;break}})}onDestroy(){this.unbindResizeObserver()}onScroll(t){this.showNavigators()&&this.updateButtonState(),t.preventDefault()}onPrevButtonClick(){let t=this.content.nativeElement,i=Q(t),n=Math.abs(t.scrollLeft)-i,a=n<=0?0:n;t.scrollLeft=it(t)?-1*a:a}onNextButtonClick(){let t=this.content.nativeElement,i=Q(t)-this.getVisibleButtonWidths(),n=t.scrollLeft+i,a=t.scrollWidth-i,s=n>=a?a:n;t.scrollLeft=it(t)?-1*s:s}updateButtonState(){let t=this.content?.nativeElement,i=this.el?.nativeElement,{scrollWidth:n,offsetWidth:a}=t,s=Math.abs(t.scrollLeft),et=Q(t);this.isPrevButtonEnabled.set(s!==0),this.isNextButtonEnabled.set(i.offsetWidth>=a&&Math.abs(s-n+et)>1)}updateInkBar(){let t=this.content?.nativeElement,i=this.inkbar?.nativeElement,n=this.tabs?.nativeElement,a=Tt(t,'[data-pc-name="tab"][data-p-active="true"]');i&&(i.style.width=yt(a)+"px",i.style.left=at(a).left-at(n).left+"px")}getVisibleButtonWidths(){let t=this.prevButton?.nativeElement,i=this.nextButton?.nativeElement;return[t,i].reduce((n,a)=>a?n+Q(a):n,0)}bindResizeObserver(){this.resizeObserver=new ResizeObserver(()=>this.updateButtonState()),this.resizeObserver.observe(this.el.nativeElement)}unbindResizeObserver(){this.resizeObserver&&(this.resizeObserver.unobserve(this.el.nativeElement),this.resizeObserver=null)}static \u0275fac=function(i){return new(i||e)};static \u0275cmp=B({type:e,selectors:[["p-tablist"]],contentQueries:function(i,n,a){if(i&1&&(J(a,zt,4),J(a,Qt,4),J(a,Bt,4)),i&2){let s;p(s=f())&&(n.prevIconTemplate=s.first),p(s=f())&&(n.nextIconTemplate=s.first),p(s=f())&&(n.templates=s)}},viewQuery:function(i,n){if(i&1&&(k(Ot,5),k(jt,5),k(Ht,5),k(Kt,5),k($t,5)),i&2){let a;p(a=f())&&(n.content=a.first),p(a=f())&&(n.prevButton=a.first),p(a=f())&&(n.nextButton=a.first),p(a=f())&&(n.inkbar=a.first),p(a=f())&&(n.tabs=a.first)}},hostVars:2,hostBindings:function(i,n){i&2&&c(n.cx("root"))},features:[E([kt,{provide:Et,useExisting:e},{provide:F,useExisting:e}]),D([l]),w],ngContentSelectors:j,decls:9,vars:11,consts:[["content",""],["tabs",""],["inkbar",""],["prevButton",""],["nextButton",""],["type","button","pRipple","",3,"pBind","class"],[3,"scroll","pBind"],["role","tablist",3,"pBind"],["role","presentation",3,"pBind"],["type","button","pRipple","",3,"click","pBind"],["data-p-icon","chevron-left"],[4,"ngTemplateOutlet"],["data-p-icon","chevron-right"]],template:function(i,n){if(i&1){let a=G();I(),C(0,Gt,4,7,"button",5),V(1,"div",6,0),O("scroll",function(et){return H(a),K(n.onScroll(et))}),V(3,"div",7,1),M(5),W(6,"span",8,2),q()(),C(8,Zt,4,7,"button",5)}i&2&&(N(n.showNavigators()&&n.isPrevButtonEnabled()?0:-1),v(),c(n.cx("content")),b("pBind",n.ptm("content")),v(2),c(n.cx("tabList")),b("pBind",n.ptm("tabList")),v(3),c(n.cx("activeBar")),b("pBind",n.ptm("activeBar")),v(2),N(n.showNavigators()&&n.isNextButtonEnabled()?8:-1))},dependencies:[R,Y,wt,Dt,Ct,rt,st,m,l],encapsulation:2,changeDetection:0})}return e})(),At=new x("TAB_INSTANCE"),se=(()=>{class e extends L{$pcTab=o(At,{optional:!0,skipSelf:!0})??void 0;bindDirectiveInstance=o(l,{self:!0});onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]))}value=X();disabled=g(!1,{transform:T});pcTabs=o(S(()=>tt));pcTabList=o(S(()=>Rt));el=o(ct);_componentStyle=o(Mt);ripple=r(()=>this.config.ripple());id=r(()=>`${this.pcTabs.id()}_tab_${this.value()}`);ariaControls=r(()=>`${this.pcTabs.id()}_tabpanel_${this.value()}`);active=r(()=>ot(this.pcTabs.value(),this.value()));tabindex=r(()=>this.disabled()?-1:this.active()?this.pcTabs.tabindex():-1);mutationObserver;onFocus(t){this.disabled()||this.pcTabs.selectOnFocus()&&this.changeActiveValue()}onClick(t){this.disabled()||this.changeActiveValue()}onKeyDown(t){switch(t.code){case"ArrowRight":this.onArrowRightKey(t);break;case"ArrowLeft":this.onArrowLeftKey(t);break;case"Home":this.onHomeKey(t);break;case"End":this.onEndKey(t);break;case"PageDown":this.onPageDownKey(t);break;case"PageUp":this.onPageUpKey(t);break;case"Enter":case"NumpadEnter":case"Space":this.onEnterKey(t);break;default:break}t.stopPropagation()}onAfterViewInit(){this.bindMutationObserver()}onArrowRightKey(t){let i=this.findNextTab(t.currentTarget);i?this.changeFocusedTab(t,i):this.onHomeKey(t),t.preventDefault()}onArrowLeftKey(t){let i=this.findPrevTab(t.currentTarget);i?this.changeFocusedTab(t,i):this.onEndKey(t),t.preventDefault()}onHomeKey(t){let i=this.findFirstTab();this.changeFocusedTab(t,i),t.preventDefault()}onEndKey(t){let i=this.findLastTab();this.changeFocusedTab(t,i),t.preventDefault()}onPageDownKey(t){this.scrollInView(this.findLastTab()),t.preventDefault()}onPageUpKey(t){this.scrollInView(this.findFirstTab()),t.preventDefault()}onEnterKey(t){this.disabled()||this.changeActiveValue(),t.preventDefault()}findNextTab(t,i=!1){let n=i?t:t.nextElementSibling;return n?z(n,"data-p-disabled")||z(n,"data-pc-section")==="activebar"?this.findNextTab(n):n:null}findPrevTab(t,i=!1){let n=i?t:t.previousElementSibling;return n?z(n,"data-p-disabled")||z(n,"data-pc-section")==="activebar"?this.findPrevTab(n):n:null}findFirstTab(){return this.findNextTab(this.pcTabList?.tabs?.nativeElement?.firstElementChild,!0)}findLastTab(){return this.findPrevTab(this.pcTabList?.tabs?.nativeElement?.lastElementChild,!0)}changeActiveValue(){this.pcTabs.updateValue(this.value())}changeFocusedTab(t,i){_t(i),this.scrollInView(i)}scrollInView(t){t?.scrollIntoView?.({block:"nearest"})}bindMutationObserver(){Z(this.platformId)&&(this.mutationObserver=new MutationObserver(t=>{t.forEach(()=>{this.active()&&this.pcTabList?.updateInkBar()})}),this.mutationObserver.observe(this.el.nativeElement,{childList:!0,characterData:!0,subtree:!0}))}unbindMutationObserver(){this.mutationObserver?.disconnect()}onDestroy(){this.mutationObserver&&this.unbindMutationObserver()}static \u0275fac=(()=>{let t;return function(n){return(t||(t=u(e)))(n||e)}})();static \u0275cmp=B({type:e,selectors:[["p-tab"]],hostVars:10,hostBindings:function(i,n){i&1&&O("focus",function(s){return n.onFocus(s)})("click",function(s){return n.onClick(s)})("keydown",function(s){return n.onKeyDown(s)}),i&2&&(y("id",n.id())("aria-controls",n.ariaControls())("role","tab")("aria-selected",n.active())("aria-disabled",n.disabled())("data-p-disabled",n.disabled())("data-p-active",n.active())("tabindex",n.tabindex()),c(n.cx("root")))},inputs:{value:[1,"value"],disabled:[1,"disabled"]},outputs:{value:"valueChange"},features:[E([Mt,{provide:At,useExisting:e},{provide:F,useExisting:e}]),D([rt,l]),w],ngContentSelectors:j,decls:1,vars:0,template:function(i,n){i&1&&(I(),M(0))},dependencies:[R,st,m],encapsulation:2,changeDetection:0})}return e})(),re={root:({instance:e})=>["p-tabpanel",{"p-tabpanel-active":e.active()}]},Ft=(()=>{class e extends A{name="tabpanel";classes=re;static \u0275fac=(()=>{let t;return function(n){return(t||(t=u(e)))(n||e)}})();static \u0275prov=_({token:e,factory:e.\u0275fac})}return e})();var Lt=new x("TABPANEL_INSTANCE"),le=(()=>{class e extends L{$pcTabPanel=o(Lt,{optional:!0,skipSelf:!0})??void 0;bindDirectiveInstance=o(l,{self:!0});pcTabs=o(S(()=>tt));onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]))}lazy=g(!1,{transform:T});value=X(void 0);content=gt("content");id=r(()=>`${this.pcTabs.id()}_tabpanel_${this.value()}`);ariaLabelledby=r(()=>`${this.pcTabs.id()}_tab_${this.value()}`);active=r(()=>ot(this.pcTabs.value(),this.value()));isLazyEnabled=r(()=>this.pcTabs.lazy()||this.lazy());hasBeenRendered=!1;shouldRender=r(()=>!this.isLazyEnabled()||this.hasBeenRendered?!0:this.active()?(this.hasBeenRendered=!0,!0):!1);_componentStyle=o(Ft);static \u0275fac=(()=>{let t;return function(n){return(t||(t=u(e)))(n||e)}})();static \u0275cmp=B({type:e,selectors:[["p-tabpanel"]],contentQueries:function(i,n,a){i&1&&bt(a,n.content,Ot,5),i&2&&pt()},hostVars:7,hostBindings:function(i,n){i&2&&(ut("hidden",!n.active()),y("id",n.id())("role","tabpanel")("aria-labelledby",n.ariaLabelledby())("data-p-active",n.active()),c(n.cx("root")))},inputs:{lazy:[1,"lazy"],value:[1,"value"]},outputs:{value:"valueChange"},features:[E([Ft,{provide:Lt,useExisting:e},{provide:F,useExisting:e}]),D([l]),w],ngContentSelectors:j,decls:3,vars:1,consts:[["defaultContent",""],[4,"ngTemplateOutlet"]],template:function(i,n){i&1&&(I(),P(0,te,1,0,"ng-template",null,0,vt),C(2,ne,1,1,"ng-container")),i&2&&(v(2),N(n.shouldRender()?2:-1))},dependencies:[Y,m],encapsulation:2,changeDetection:0})}return e})(),ce={root:"p-tabpanels"},St=(()=>{class e extends A{name="tabpanels";classes=ce;static \u0275fac=(()=>{let t;return function(n){return(t||(t=u(e)))(n||e)}})();static \u0275prov=_({token:e,factory:e.\u0275fac})}return e})();var Pt=new x("TABPANELS_INSTANCE"),de=(()=>{class e extends L{$pcTabPanels=o(Pt,{optional:!0,skipSelf:!0})??void 0;bindDirectiveInstance=o(l,{self:!0});_componentStyle=o(St);onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]))}static \u0275fac=(()=>{let t;return function(n){return(t||(t=u(e)))(n||e)}})();static \u0275cmp=B({type:e,selectors:[["p-tabpanels"]],hostVars:3,hostBindings:function(i,n){i&2&&(y("role","presentation"),c(n.cx("root")))},features:[E([St,{provide:Pt,useExisting:e},{provide:F,useExisting:e}]),D([l]),w],ngContentSelectors:j,decls:1,vars:0,template:function(i,n){i&1&&(I(),M(0))},dependencies:[R,m],encapsulation:2,changeDetection:0})}return e})(),Vt=new x("TABS_INSTANCE"),tt=(()=>{class e extends L{$pcTabs=o(Vt,{optional:!0,skipSelf:!0})??void 0;bindDirectiveInstance=o(l,{self:!0});onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]))}value=X(void 0);scrollable=g(!1,{transform:T});lazy=g(!1,{transform:T});selectOnFocus=g(!1,{transform:T});showNavigators=g(!0,{transform:T});tabindex=g(0,{transform:mt});id=$(xt("pn_id_"));_componentStyle=o(It);updateValue(t){this.value.update(()=>t)}static \u0275fac=(()=>{let t;return function(n){return(t||(t=u(e)))(n||e)}})();static \u0275cmp=B({type:e,selectors:[["p-tabs"]],hostVars:3,hostBindings:function(i,n){i&2&&(y("id",n.id()),c(n.cx("root")))},inputs:{value:[1,"value"],scrollable:[1,"scrollable"],lazy:[1,"lazy"],selectOnFocus:[1,"selectOnFocus"],showNavigators:[1,"showNavigators"],tabindex:[1,"tabindex"]},outputs:{value:"valueChange"},features:[E([It,{provide:Vt,useExisting:e},{provide:F,useExisting:e}]),D([l]),w],ngContentSelectors:j,decls:1,vars:0,template:function(i,n){i&1&&(I(),M(0))},dependencies:[R,m],encapsulation:2,changeDetection:0})}return e})(),Pe=(()=>{class e{static \u0275fac=function(i){return new(i||e)};static \u0275mod=dt({type:e});static \u0275inj=lt({imports:[tt,de,le,Rt,se,m,m]})}return e})();export{Rt as a,se as b,le as c,de as d,tt as e,Pe as f};
