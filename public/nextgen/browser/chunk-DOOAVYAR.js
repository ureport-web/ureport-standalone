import{a as _t,b as Tt}from"./chunk-H2J46C3W.js";import{C as Z,F as P,R as tt,Z as mt,ha as yt,ia as et,k as Y,ma as k,n as vt,pa as C,ra as nt,sa as xt,u as ht,v as gt,w as O}from"./chunk-7YDSM7V4.js";import{Ab as Q,Ac as bt,Bb as j,Ec as r,Fc as ut,Hb as K,Hc as h,Ib as H,Ic as pt,Jb as st,Jc as q,Kb as L,Mb as v,Mc as g,Nb as w,Nc as ft,Ob as D,Pb as $,Qa as f,Qb as B,Rb as u,S as F,Sb as p,T as m,Tb as lt,U as at,Ub as ct,Vb as dt,Y as s,Zb as l,bb as y,ca as R,cb as ot,da as A,dd as W,ea as X,fb as _,gb as rt,hb as I,id as E,ma as S,mc as M,md as U,qa as d,sa as it,sb as b,tb as T,ub as x,yb as z,zb as N}from"./chunk-C2KL4RQS.js";var wt=`
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
`;var Nt=["previcon"],Lt=["nexticon"],Ft=["content"],Et=["prevButton"],Ot=["nextButton"],Pt=["inkbar"],Vt=["tabs"],V=["*"];function Rt(e,c){e&1&&K(0)}function At(e,c){if(e&1&&I(0,Rt,1,0,"ng-container",11),e&2){let t=v(2);z("ngTemplateOutlet",t.prevIconTemplate||t._prevIconTemplate)}}function St(e,c){e&1&&(X(),j(0,"svg",10))}function zt(e,c){if(e&1){let t=H();N(0,"button",9,3),L("click",function(){R(t);let n=v();return A(n.onPrevButtonClick())}),T(2,At,1,1,"ng-container")(3,St,1,0,":svg:svg",10),Q()}if(e&2){let t=v();l(t.cx("prevButton")),b("aria-label",t.prevButtonAriaLabel)("tabindex",t.tabindex())("data-pc-group-section","navigator"),f(2),x(t.prevIconTemplate||t._prevIconTemplate?2:3)}}function Qt(e,c){e&1&&K(0)}function jt(e,c){if(e&1&&I(0,Qt,1,0,"ng-container",11),e&2){let t=v(2);z("ngTemplateOutlet",t.nextIconTemplate||t._nextIconTemplate)}}function Kt(e,c){e&1&&(X(),j(0,"svg",12))}function Ht(e,c){if(e&1){let t=H();N(0,"button",9,4),L("click",function(){R(t);let n=v();return A(n.onNextButtonClick())}),T(2,jt,1,1,"ng-container")(3,Kt,1,0,":svg:svg",12),Q()}if(e&2){let t=v();l(t.cx("nextButton")),b("aria-label",t.nextButtonAriaLabel)("tabindex",t.tabindex())("data-pc-group-section","navigator"),f(2),x(t.nextIconTemplate||t._nextIconTemplate?2:3)}}function $t(e,c){e&1&&D(0)}function qt(e,c){e&1&&K(0)}function Wt(e,c){if(e&1&&I(0,qt,1,0,"ng-container",1),e&2){let t=v(),a=dt(1);z("ngTemplateOutlet",t.content()?t.content():a)}}var Ut={root:({instance:e})=>["p-tabs p-component",{"p-tabs-scrollable":e.scrollable()}]},Dt=(()=>{class e extends k{name="tabs";theme=wt;classes=Ut;static \u0275fac=(()=>{let t;return function(n){return(t||(t=d(e)))(n||e)}})();static \u0275prov=m({token:e,factory:e.\u0275fac})}return e})();var Gt={root:"p-tablist",content:"p-tablist-content p-tablist-viewport",tabList:"p-tablist-tab-list",activeBar:"p-tablist-active-bar",prevButton:"p-tablist-prev-button p-tablist-nav-button",nextButton:"p-tablist-next-button p-tablist-nav-button"},Bt=(()=>{class e extends k{name="tablist";classes=Gt;static \u0275fac=(()=>{let t;return function(n){return(t||(t=d(e)))(n||e)}})();static \u0275prov=m({token:e,factory:e.\u0275fac})}return e})();var It=(()=>{class e extends C{prevIconTemplate;nextIconTemplate;templates;content;prevButton;nextButton;inkbar;tabs;pcTabs=s(F(()=>G));isPrevButtonEnabled=S(!1);isNextButtonEnabled=S(!1);resizeObserver;showNavigators=r(()=>this.pcTabs.showNavigators());tabindex=r(()=>this.pcTabs.tabindex());scrollable=r(()=>this.pcTabs.scrollable());_componentStyle=s(Bt);constructor(){super(),ut(()=>{this.pcTabs.value(),U(this.platformId)&&setTimeout(()=>{this.updateInkBar()})})}get prevButtonAriaLabel(){return this.config?.translation?.aria?.previous}get nextButtonAriaLabel(){return this.config?.translation?.aria?.next}ngAfterViewInit(){super.ngAfterViewInit(),this.showNavigators()&&U(this.platformId)&&(this.updateButtonState(),this.bindResizeObserver())}_prevIconTemplate;_nextIconTemplate;ngAfterContentInit(){this.templates?.forEach(t=>{switch(t.getType()){case"previcon":this._prevIconTemplate=t.template;break;case"nexticon":this._nextIconTemplate=t.template;break}})}ngOnDestroy(){this.unbindResizeObserver(),super.ngOnDestroy()}onScroll(t){this.showNavigators()&&this.updateButtonState(),t.preventDefault()}onPrevButtonClick(){let t=this.content.nativeElement,a=P(t),n=Math.abs(t.scrollLeft)-a,i=n<=0?0:n;t.scrollLeft=Y(t)?-1*i:i}onNextButtonClick(){let t=this.content.nativeElement,a=P(t)-this.getVisibleButtonWidths(),n=t.scrollLeft+a,i=t.scrollWidth-a,o=n>=i?i:n;t.scrollLeft=Y(t)?-1*o:o}updateButtonState(){let t=this.content?.nativeElement,a=this.el?.nativeElement,{scrollWidth:n,offsetWidth:i}=t,o=Math.abs(t.scrollLeft),J=P(t);this.isPrevButtonEnabled.set(o!==0),this.isNextButtonEnabled.set(a.offsetWidth>=i&&Math.abs(o-n+J)>1)}updateInkBar(){let t=this.content?.nativeElement,a=this.inkbar?.nativeElement,n=this.tabs?.nativeElement,i=ht(t,'[data-pc-name="tab"][data-p-active="true"]');a&&(a.style.width=vt(i)+"px",a.style.left=Z(i).left-Z(n).left+"px")}getVisibleButtonWidths(){let t=this.prevButton?.nativeElement,a=this.nextButton?.nativeElement;return[t,a].reduce((n,i)=>i?n+P(i):n,0)}bindResizeObserver(){this.resizeObserver=new ResizeObserver(()=>this.updateButtonState()),this.resizeObserver.observe(this.el.nativeElement)}unbindResizeObserver(){this.resizeObserver&&(this.resizeObserver.unobserve(this.el.nativeElement),this.resizeObserver=null)}static \u0275fac=function(a){return new(a||e)};static \u0275cmp=y({type:e,selectors:[["p-tablist"]],contentQueries:function(a,n,i){if(a&1&&($(i,Nt,4),$(i,Lt,4),$(i,yt,4)),a&2){let o;u(o=p())&&(n.prevIconTemplate=o.first),u(o=p())&&(n.nextIconTemplate=o.first),u(o=p())&&(n.templates=o)}},viewQuery:function(a,n){if(a&1&&(B(Ft,5),B(Et,5),B(Ot,5),B(Pt,5),B(Vt,5)),a&2){let i;u(i=p())&&(n.content=i.first),u(i=p())&&(n.prevButton=i.first),u(i=p())&&(n.nextButton=i.first),u(i=p())&&(n.inkbar=i.first),u(i=p())&&(n.tabs=i.first)}},hostVars:3,hostBindings:function(a,n){a&2&&(b("data-pc-name","tablist"),l(n.cx("root")))},features:[M([Bt]),_],ngContentSelectors:V,decls:9,vars:9,consts:[["content",""],["tabs",""],["inkbar",""],["prevButton",""],["nextButton",""],["type","button","pRipple","",3,"class"],[3,"scroll"],["role","tablist"],["role","presentation"],["type","button","pRipple","",3,"click"],["data-p-icon","chevron-left"],[4,"ngTemplateOutlet"],["data-p-icon","chevron-right"]],template:function(a,n){if(a&1){let i=H();w(),T(0,zt,4,6,"button",5),N(1,"div",6,0),L("scroll",function(J){return R(i),A(n.onScroll(J))}),N(3,"div",7,1),D(5),j(6,"span",8,2),Q()(),T(8,Ht,4,6,"button",5)}a&2&&(x(n.showNavigators()&&n.isPrevButtonEnabled()?0:-1),f(),l(n.cx("content")),f(2),l(n.cx("tabList")),f(3),l(n.cx("activeBar")),b("data-pc-section","inkbar"),f(2),x(n.showNavigators()&&n.isNextButtonEnabled()?8:-1))},dependencies:[E,W,_t,Tt,xt,nt,et],encapsulation:2,changeDetection:0})}return e})(),Jt={root:({instance:e})=>["p-tab",{"p-tab-active":e.active(),"p-disabled":e.disabled()}]},Mt=(()=>{class e extends k{name="tab";classes=Jt;static \u0275fac=(()=>{let t;return function(n){return(t||(t=d(e)))(n||e)}})();static \u0275prov=m({token:e,factory:e.\u0275fac})}return e})();var Xt=(()=>{class e extends C{value=q();disabled=h(!1,{transform:g});pcTabs=s(F(()=>G));pcTabList=s(F(()=>It));el=s(it);_componentStyle=s(Mt);ripple=r(()=>this.config.ripple());id=r(()=>`${this.pcTabs.id()}_tab_${this.value()}`);ariaControls=r(()=>`${this.pcTabs.id()}_tabpanel_${this.value()}`);active=r(()=>tt(this.pcTabs.value(),this.value()));tabindex=r(()=>this.disabled()?-1:this.active()?this.pcTabs.tabindex():-1);mutationObserver;onFocus(t){this.disabled()||this.pcTabs.selectOnFocus()&&this.changeActiveValue()}onClick(t){this.disabled()||this.changeActiveValue()}onKeyDown(t){switch(t.code){case"ArrowRight":this.onArrowRightKey(t);break;case"ArrowLeft":this.onArrowLeftKey(t);break;case"Home":this.onHomeKey(t);break;case"End":this.onEndKey(t);break;case"PageDown":this.onPageDownKey(t);break;case"PageUp":this.onPageUpKey(t);break;case"Enter":case"NumpadEnter":case"Space":this.onEnterKey(t);break;default:break}t.stopPropagation()}ngAfterViewInit(){super.ngAfterViewInit(),this.bindMutationObserver()}onArrowRightKey(t){let a=this.findNextTab(t.currentTarget);a?this.changeFocusedTab(t,a):this.onHomeKey(t),t.preventDefault()}onArrowLeftKey(t){let a=this.findPrevTab(t.currentTarget);a?this.changeFocusedTab(t,a):this.onEndKey(t),t.preventDefault()}onHomeKey(t){let a=this.findFirstTab();this.changeFocusedTab(t,a),t.preventDefault()}onEndKey(t){let a=this.findLastTab();this.changeFocusedTab(t,a),t.preventDefault()}onPageDownKey(t){this.scrollInView(this.findLastTab()),t.preventDefault()}onPageUpKey(t){this.scrollInView(this.findFirstTab()),t.preventDefault()}onEnterKey(t){this.disabled()||this.changeActiveValue(),t.preventDefault()}findNextTab(t,a=!1){let n=a?t:t.nextElementSibling;return n?O(n,"data-p-disabled")||O(n,"data-pc-section")==="inkbar"?this.findNextTab(n):n:null}findPrevTab(t,a=!1){let n=a?t:t.previousElementSibling;return n?O(n,"data-p-disabled")||O(n,"data-pc-section")==="inkbar"?this.findPrevTab(n):n:null}findFirstTab(){return this.findNextTab(this.pcTabList?.tabs?.nativeElement?.firstElementChild,!0)}findLastTab(){return this.findPrevTab(this.pcTabList?.tabs?.nativeElement?.lastElementChild,!0)}changeActiveValue(){this.pcTabs.updateValue(this.value())}changeFocusedTab(t,a){gt(a),this.scrollInView(a)}scrollInView(t){t?.scrollIntoView?.({block:"nearest"})}bindMutationObserver(){U(this.platformId)&&(this.mutationObserver=new MutationObserver(t=>{t.forEach(()=>{this.active()&&this.pcTabList?.updateInkBar()})}),this.mutationObserver.observe(this.el.nativeElement,{childList:!0,characterData:!0,subtree:!0}))}unbindMutationObserver(){this.mutationObserver?.disconnect()}ngOnDestroy(){this.mutationObserver&&this.unbindMutationObserver(),super.ngOnDestroy()}static \u0275fac=(()=>{let t;return function(n){return(t||(t=d(e)))(n||e)}})();static \u0275cmp=y({type:e,selectors:[["p-tab"]],hostVars:11,hostBindings:function(a,n){a&1&&L("focus",function(o){return n.onFocus(o)})("click",function(o){return n.onClick(o)})("keydown",function(o){return n.onKeyDown(o)}),a&2&&(b("data-pc-name","tab")("id",n.id())("aria-controls",n.ariaControls())("role","tab")("aria-selected",n.active())("aria-disabled",n.disabled())("data-p-disabled",n.disabled())("data-p-active",n.active())("tabindex",n.tabindex()),l(n.cx("root")))},inputs:{value:[1,"value"],disabled:[1,"disabled"]},outputs:{value:"valueChange"},features:[M([Mt]),rt([nt]),_],ngContentSelectors:V,decls:1,vars:0,template:function(a,n){a&1&&(w(),D(0))},dependencies:[E,et],encapsulation:2,changeDetection:0})}return e})(),Yt={root:({instance:e})=>["p-tabpanel",{"p-tabpanel-active":e.active()}]},kt=(()=>{class e extends k{name="tabpanel";classes=Yt;static \u0275fac=(()=>{let t;return function(n){return(t||(t=d(e)))(n||e)}})();static \u0275prov=m({token:e,factory:e.\u0275fac})}return e})();var De=(()=>{class e extends C{pcTabs=s(F(()=>G));lazy=h(!1,{transform:g});value=q(void 0);content=pt("content");id=r(()=>`${this.pcTabs.id()}_tabpanel_${this.value()}`);ariaLabelledby=r(()=>`${this.pcTabs.id()}_tab_${this.value()}`);active=r(()=>tt(this.pcTabs.value(),this.value()));isLazyEnabled=r(()=>this.pcTabs.lazy()||this.lazy());hasBeenRendered=!1;shouldRender=r(()=>!this.isLazyEnabled()||this.hasBeenRendered?!0:this.active()?(this.hasBeenRendered=!0,!0):!1);_componentStyle=s(kt);static \u0275fac=(()=>{let t;return function(n){return(t||(t=d(e)))(n||e)}})();static \u0275cmp=y({type:e,selectors:[["p-tabpanel"]],contentQueries:function(a,n,i){a&1&&lt(i,n.content,Ft,5),a&2&&ct()},hostVars:8,hostBindings:function(a,n){a&2&&(st("hidden",!n.active()),b("data-pc-name","tabpanel")("id",n.id())("role","tabpanel")("aria-labelledby",n.ariaLabelledby())("data-p-active",n.active()),l(n.cx("root")))},inputs:{lazy:[1,"lazy"],value:[1,"value"]},outputs:{value:"valueChange"},features:[M([kt]),_],ngContentSelectors:V,decls:3,vars:1,consts:[["defaultContent",""],[4,"ngTemplateOutlet"]],template:function(a,n){a&1&&(w(),I(0,$t,1,0,"ng-template",null,0,bt),T(2,Wt,1,1,"ng-container")),a&2&&(f(2),x(n.shouldRender()?2:-1))},dependencies:[W],encapsulation:2,changeDetection:0})}return e})(),Zt={root:"p-tabpanels"},Ct=(()=>{class e extends k{name="tabpanels";classes=Zt;static \u0275fac=(()=>{let t;return function(n){return(t||(t=d(e)))(n||e)}})();static \u0275prov=m({token:e,factory:e.\u0275fac})}return e})();var te=(()=>{class e extends C{_componentStyle=s(Ct);static \u0275fac=(()=>{let t;return function(n){return(t||(t=d(e)))(n||e)}})();static \u0275cmp=y({type:e,selectors:[["p-tabpanels"]],hostVars:4,hostBindings:function(a,n){a&2&&(b("data-pc-name","tabpanels")("role","presentation"),l(n.cx("root")))},features:[M([Ct]),_],ngContentSelectors:V,decls:1,vars:0,template:function(a,n){a&1&&(w(),D(0))},dependencies:[E],encapsulation:2,changeDetection:0})}return e})(),G=(()=>{class e extends C{value=q(void 0);scrollable=h(!1,{transform:g});lazy=h(!1,{transform:g});selectOnFocus=h(!1,{transform:g});showNavigators=h(!0,{transform:g});tabindex=h(0,{transform:ft});id=S(mt("pn_id_"));_componentStyle=s(Dt);updateValue(t){this.value.update(()=>t)}static \u0275fac=(()=>{let t;return function(n){return(t||(t=d(e)))(n||e)}})();static \u0275cmp=y({type:e,selectors:[["p-tabs"]],hostVars:4,hostBindings:function(a,n){a&2&&(b("data-pc-name","tabs")("id",n.id()),l(n.cx("root")))},inputs:{value:[1,"value"],scrollable:[1,"scrollable"],lazy:[1,"lazy"],selectOnFocus:[1,"selectOnFocus"],showNavigators:[1,"showNavigators"],tabindex:[1,"tabindex"]},outputs:{value:"valueChange"},features:[M([Dt]),_],ngContentSelectors:V,decls:1,vars:0,template:function(a,n){a&1&&(w(),D(0))},dependencies:[E],encapsulation:2,changeDetection:0})}return e})(),Be=(()=>{class e{static \u0275fac=function(a){return new(a||e)};static \u0275mod=ot({type:e});static \u0275inj=at({imports:[G,te,It,Xt]})}return e})();export{It as a,Xt as b,De as c,te as d,G as e,Be as f};
