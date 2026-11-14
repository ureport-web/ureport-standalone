import{a as qe}from"./chunk-JS6N3EP3.js";import{a as Be}from"./chunk-SOVMQVX6.js";import{a as Ae,g as Qe,h as $e}from"./chunk-QNSGMFFR.js";import{b as Re}from"./chunk-B6W3EO6D.js";import{b as ze}from"./chunk-GM6LEXQL.js";import{a as Ke}from"./chunk-DMVIH3KL.js";import{p as Fe}from"./chunk-QHAX2N6X.js";import{Aa as De,J as Y,L as z,M as L,N as F,P as ee,V as Ce,aa as Oe,da as Te,ea as N,fa as Se,ia as Ve,la as Ee,na as R,oa as Me,q as P,r as E,ta as ke,za as Le}from"./chunk-RP2SIKJL.js";import{$ as Q,Eb as r,Fb as m,Gb as _,Gc as A,Hb as D,Kc as G,Lb as T,Mb as S,Nb as O,Nc as fe,Ob as C,Qb as w,Sb as a,Ta as s,Tc as h,Uc as k,V as te,Vb as I,W as ne,Wb as M,X as ie,Xb as f,Ya as v,Yb as y,Z as oe,Za as ae,ac as Z,bc as ue,cb as j,dc as q,ec as g,ed as ye,fc as K,ga as u,gc as W,gd as xe,ha as d,hc as J,hd as be,ia as B,ib as pe,id as ve,jb as re,jd as we,mb as se,nb as ce,ob as c,oc as de,pc as me,pd as Ie,qa as $,qc as he,tc as _e,ua as le,uc as ge,vc as V,wb as b,wc as H,xc as X}from"./chunk-4S52IWZL.js";var He=`
    .p-autocomplete {
        display: inline-flex;
    }

    .p-autocomplete-loader {
        position: absolute;
        top: 50%;
        margin-top: -0.5rem;
        inset-inline-end: dt('autocomplete.padding.x');
    }

    .p-autocomplete:has(.p-autocomplete-dropdown) .p-autocomplete-loader {
        inset-inline-end: calc(dt('autocomplete.dropdown.width') + dt('autocomplete.padding.x'));
    }

    .p-autocomplete:has(.p-autocomplete-dropdown) .p-autocomplete-input {
        flex: 1 1 auto;
        width: 1%;
    }

    .p-autocomplete:has(.p-autocomplete-dropdown) .p-autocomplete-input,
    .p-autocomplete:has(.p-autocomplete-dropdown) .p-autocomplete-input-multiple {
        border-start-end-radius: 0;
        border-end-end-radius: 0;
    }

    .p-autocomplete-dropdown {
        cursor: pointer;
        display: inline-flex;
        user-select: none;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        position: relative;
        width: dt('autocomplete.dropdown.width');
        border-start-end-radius: dt('autocomplete.dropdown.border.radius');
        border-end-end-radius: dt('autocomplete.dropdown.border.radius');
        background: dt('autocomplete.dropdown.background');
        border: 1px solid dt('autocomplete.dropdown.border.color');
        border-inline-start: 0 none;
        color: dt('autocomplete.dropdown.color');
        transition:
            background dt('autocomplete.transition.duration'),
            color dt('autocomplete.transition.duration'),
            border-color dt('autocomplete.transition.duration'),
            outline-color dt('autocomplete.transition.duration'),
            box-shadow dt('autocomplete.transition.duration');
        outline-color: transparent;
    }

    .p-autocomplete-dropdown:not(:disabled):hover {
        background: dt('autocomplete.dropdown.hover.background');
        border-color: dt('autocomplete.dropdown.hover.border.color');
        color: dt('autocomplete.dropdown.hover.color');
    }

    .p-autocomplete-dropdown:not(:disabled):active {
        background: dt('autocomplete.dropdown.active.background');
        border-color: dt('autocomplete.dropdown.active.border.color');
        color: dt('autocomplete.dropdown.active.color');
    }

    .p-autocomplete-dropdown:focus-visible {
        box-shadow: dt('autocomplete.dropdown.focus.ring.shadow');
        outline: dt('autocomplete.dropdown.focus.ring.width') dt('autocomplete.dropdown.focus.ring.style') dt('autocomplete.dropdown.focus.ring.color');
        outline-offset: dt('autocomplete.dropdown.focus.ring.offset');
    }

    .p-autocomplete-overlay {
        position: absolute;
        top: 0;
        left: 0;
        background: dt('autocomplete.overlay.background');
        color: dt('autocomplete.overlay.color');
        border: 1px solid dt('autocomplete.overlay.border.color');
        border-radius: dt('autocomplete.overlay.border.radius');
        box-shadow: dt('autocomplete.overlay.shadow');
        min-width: 100%;
    }

    .p-autocomplete-list-container {
        overflow: auto;
    }

    .p-autocomplete-list {
        margin: 0;
        list-style-type: none;
        display: flex;
        flex-direction: column;
        gap: dt('autocomplete.list.gap');
        padding: dt('autocomplete.list.padding');
    }

    .p-autocomplete-option {
        cursor: pointer;
        white-space: nowrap;
        position: relative;
        overflow: hidden;
        display: flex;
        align-items: center;
        padding: dt('autocomplete.option.padding');
        border: 0 none;
        color: dt('autocomplete.option.color');
        background: transparent;
        transition:
            background dt('autocomplete.transition.duration'),
            color dt('autocomplete.transition.duration'),
            border-color dt('autocomplete.transition.duration');
        border-radius: dt('autocomplete.option.border.radius');
    }

    .p-autocomplete-option:not(.p-autocomplete-option-selected):not(.p-disabled).p-focus {
        background: dt('autocomplete.option.focus.background');
        color: dt('autocomplete.option.focus.color');
    }

    .p-autocomplete-option-selected {
        background: dt('autocomplete.option.selected.background');
        color: dt('autocomplete.option.selected.color');
    }

    .p-autocomplete-option-selected.p-focus {
        background: dt('autocomplete.option.selected.focus.background');
        color: dt('autocomplete.option.selected.focus.color');
    }

    .p-autocomplete-option-group {
        margin: 0;
        padding: dt('autocomplete.option.group.padding');
        color: dt('autocomplete.option.group.color');
        background: dt('autocomplete.option.group.background');
        font-weight: dt('autocomplete.option.group.font.weight');
    }

    .p-autocomplete-input-multiple {
        margin: 0;
        list-style-type: none;
        cursor: text;
        overflow: hidden;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        padding: calc(dt('autocomplete.padding.y') / 2) dt('autocomplete.padding.x');
        gap: calc(dt('autocomplete.padding.y') / 2);
        color: dt('autocomplete.color');
        background: dt('autocomplete.background');
        border: 1px solid dt('autocomplete.border.color');
        border-radius: dt('autocomplete.border.radius');
        width: 100%;
        transition:
            background dt('autocomplete.transition.duration'),
            color dt('autocomplete.transition.duration'),
            border-color dt('autocomplete.transition.duration'),
            outline-color dt('autocomplete.transition.duration'),
            box-shadow dt('autocomplete.transition.duration');
        outline-color: transparent;
        box-shadow: dt('autocomplete.shadow');
    }

    .p-autocomplete-input-multiple.p-disabled {
        opacity: 1;
        background: dt('inputtext.disabled.background');
        color: dt('inputtext.disabled.color');
    }

    .p-autocomplete-input-multiple:not(.p-disabled):hover {
        border-color: dt('autocomplete.hover.border.color');
    }

    .p-autocomplete.p-focus .p-autocomplete-input-multiple:not(.p-disabled) {
        border-color: dt('autocomplete.focus.border.color');
        box-shadow: dt('autocomplete.focus.ring.shadow');
        outline: dt('autocomplete.focus.ring.width') dt('autocomplete.focus.ring.style') dt('autocomplete.focus.ring.color');
        outline-offset: dt('autocomplete.focus.ring.offset');
    }

    .p-autocomplete.p-invalid .p-autocomplete-input-multiple {
        border-color: dt('autocomplete.invalid.border.color');
    }

    .p-variant-filled.p-autocomplete-input-multiple {
        background: dt('autocomplete.filled.background');
    }

    .p-autocomplete-input-multiple.p-variant-filled:not(.p-disabled):hover {
        background: dt('autocomplete.filled.hover.background');
    }

    .p-autocomplete.p-focus .p-autocomplete-input-multiple.p-variant-filled:not(.p-disabled) {
        background: dt('autocomplete.filled.focus.background');
    }

    .p-autocomplete-chip.p-chip {
        padding-block-start: calc(dt('autocomplete.padding.y') / 2);
        padding-block-end: calc(dt('autocomplete.padding.y') / 2);
        border-radius: dt('autocomplete.chip.border.radius');
    }

    .p-autocomplete-input-multiple:has(.p-autocomplete-chip) {
        padding-inline-start: calc(dt('autocomplete.padding.y') / 2);
        padding-inline-end: calc(dt('autocomplete.padding.y') / 2);
    }

    .p-autocomplete-chip-item.p-focus .p-autocomplete-chip {
        background: dt('autocomplete.chip.focus.background');
        color: dt('autocomplete.chip.focus.color');
    }

    .p-autocomplete-input-chip {
        flex: 1 1 auto;
        display: inline-flex;
        padding-block-start: calc(dt('autocomplete.padding.y') / 2);
        padding-block-end: calc(dt('autocomplete.padding.y') / 2);
    }

    .p-autocomplete-input-chip input {
        border: 0 none;
        outline: 0 none;
        background: transparent;
        margin: 0;
        padding: 0;
        box-shadow: none;
        border-radius: 0;
        width: 100%;
        font-family: inherit;
        font-feature-settings: inherit;
        font-size: 1rem;
        color: inherit;
    }

    .p-autocomplete-input-chip input::placeholder {
        color: dt('autocomplete.placeholder.color');
    }

    .p-autocomplete.p-invalid .p-autocomplete-input-chip input::placeholder {
        color: dt('autocomplete.invalid.placeholder.color');
    }

    .p-autocomplete-empty-message {
        padding: dt('autocomplete.empty.message.padding');
    }

    .p-autocomplete-fluid {
        display: flex;
    }

    .p-autocomplete-fluid:has(.p-autocomplete-dropdown) .p-autocomplete-input {
        width: 1%;
    }

    .p-autocomplete:has(.p-inputtext-sm) .p-autocomplete-dropdown {
        width: dt('autocomplete.dropdown.sm.width');
    }

    .p-autocomplete:has(.p-inputtext-sm) .p-autocomplete-dropdown .p-icon {
        font-size: dt('form.field.sm.font.size');
        width: dt('form.field.sm.font.size');
        height: dt('form.field.sm.font.size');
    }

    .p-autocomplete:has(.p-inputtext-lg) .p-autocomplete-dropdown {
        width: dt('autocomplete.dropdown.lg.width');
    }

    .p-autocomplete:has(.p-inputtext-lg) .p-autocomplete-dropdown .p-icon {
        font-size: dt('form.field.lg.font.size');
        width: dt('form.field.lg.font.size');
        height: dt('form.field.lg.font.size');
    }

    .p-autocomplete-clear-icon {
        position: absolute;
        top: 50%;
        margin-top: -0.5rem;
        cursor: pointer;
        color: dt('form.field.icon.color');
        inset-inline-end: dt('autocomplete.padding.x');
    }

    .p-autocomplete:has(.p-autocomplete-dropdown) .p-autocomplete-clear-icon {
        inset-inline-end: calc(dt('autocomplete.padding.x') + dt('autocomplete.dropdown.width'));
    }

    .p-autocomplete:has(.p-autocomplete-clear-icon) .p-autocomplete-input {
        padding-inline-end: calc((dt('form.field.padding.x') * 2) + dt('icon.size'));
    }

    .p-inputgroup .p-autocomplete-dropdown {
        border-radius: 0;
    }

    .p-inputgroup > .p-autocomplete:last-child:has(.p-autocomplete-dropdown) > .p-autocomplete-input {
        border-start-end-radius: 0;
        border-end-end-radius: 0;
    }

    .p-inputgroup > .p-autocomplete:last-child .p-autocomplete-dropdown {
        border-start-end-radius: dt('autocomplete.dropdown.border.radius');
        border-end-end-radius: dt('autocomplete.dropdown.border.radius');
    }
`;var Ze=["item"],We=["empty"],Je=["header"],Xe=["footer"],Ye=["selecteditem"],et=["group"],tt=["loader"],nt=["removeicon"],it=["loadingicon"],ot=["clearicon"],lt=["dropdownicon"],at=["focusInput"],pt=["multiIn"],rt=["multiContainer"],st=["ddBtn"],ct=["items"],ut=["scroller"],dt=["overlay"],mt=i=>({i}),Ne=i=>({$implicit:i}),ht=(i,p,e)=>({removeCallback:i,index:p,class:e}),U=i=>({height:i}),Ue=(i,p)=>({$implicit:i,options:p}),_t=i=>({options:i}),gt=()=>({}),ft=(i,p,e)=>({option:i,i:p,scrollerOptions:e}),yt=(i,p)=>({$implicit:i,index:p});function xt(i,p){if(i&1){let e=C();m(0,"input",18,2),w("input",function(n){u(e);let o=a();return d(o.onInput(n))})("keydown",function(n){u(e);let o=a();return d(o.onKeyDown(n))})("change",function(n){u(e);let o=a();return d(o.onInputChange(n))})("focus",function(n){u(e);let o=a();return d(o.onInputFocus(n))})("blur",function(n){u(e);let o=a();return d(o.onInputBlur(n))})("paste",function(n){u(e);let o=a();return d(o.onInputPaste(n))})("keyup",function(n){u(e);let o=a();return d(o.onInputKeyUp(n))}),_()}if(i&2){let e=a();g(e.cn(e.cx("pcInputText"),e.inputStyleClass)),r("pAutoFocus",e.autofocus)("pt",e.ptm("pcInputText"))("ngStyle",e.inputStyle)("variant",e.$variant())("invalid",e.invalid())("pSize",e.size())("fluid",e.hasFluid),b("type",e.type)("value",e.inputValue())("id",e.inputId)("autocomplete",e.autocomplete)("placeholder",e.placeholder)("name",e.name())("minlength",e.minlength())("min",e.min())("max",e.max())("pattern",e.pattern())("size",e.inputSize())("maxlength",e.maxlength())("tabindex",e.$disabled()?-1:e.tabindex)("required",e.required()?"":void 0)("readonly",e.readonly?"":void 0)("disabled",e.$disabled()?"":void 0)("aria-label",e.ariaLabel)("aria-labelledby",e.ariaLabelledBy)("aria-required",e.required())("aria-expanded",e.overlayVisible??!1)("aria-controls",e.overlayVisible?e.id+"_list":null)("aria-activedescendant",e.focused?e.focusedOptionId:void 0)}}function bt(i,p){if(i&1){let e=C();B(),m(0,"svg",21),w("click",function(){u(e);let n=a(2);return d(n.clear())}),_()}if(i&2){let e=a(2);g(e.cx("clearIcon")),r("pBind",e.ptm("clearIcon")),b("aria-hidden",!0)}}function vt(i,p){}function wt(i,p){i&1&&c(0,vt,0,0,"ng-template")}function It(i,p){if(i&1){let e=C();m(0,"span",22),w("click",function(){u(e);let n=a(2);return d(n.clear())}),c(1,wt,1,0,null,23),_()}if(i&2){let e=a(2);g(e.cx("clearIcon")),r("pBind",e.ptm("clearIcon")),b("aria-hidden",!0),s(),r("ngTemplateOutlet",e.clearIconTemplate||e._clearIconTemplate)}}function Ct(i,p){if(i&1&&(T(0),c(1,bt,1,4,"svg",19)(2,It,2,5,"span",20),S()),i&2){let e=a();s(),r("ngIf",!e.clearIconTemplate&&!e._clearIconTemplate),s(),r("ngIf",e.clearIconTemplate||e._clearIconTemplate)}}function Ot(i,p){i&1&&O(0)}function Tt(i,p){if(i&1){let e=C();m(0,"span",22),w("click",function(n){u(e);let o=a(2).index,l=a(2);return d(!l.readonly&&!l.$disabled()?l.removeOption(n,o):"")}),B(),D(1,"svg",31),_()}if(i&2){let e=a(4);g(e.cx("chipIcon")),r("pBind",e.ptm("chipIcon")),s(),g(e.cx("chipIcon")),b("aria-hidden",!0)}}function St(i,p){}function Vt(i,p){i&1&&c(0,St,0,0,"ng-template")}function Et(i,p){if(i&1&&(m(0,"span",32),c(1,Vt,1,0,null,29),_()),i&2){let e=a(2).index,t=a(2);r("pBind",t.ptm("chipIcon")),b("aria-hidden",!0),s(),r("ngTemplateOutlet",t.removeIconTemplate||t._removeIconTemplate)("ngTemplateOutletContext",X(4,ht,t.removeOption.bind(t),e,t.cx("chipIcon")))}}function Mt(i,p){if(i&1&&c(0,Tt,2,6,"span",20)(1,Et,2,8,"span",30),i&2){let e=a(3);r("ngIf",!e.removeIconTemplate&&!e._removeIconTemplate),s(),r("ngIf",e.removeIconTemplate||e._removeIconTemplate)}}function kt(i,p){if(i&1){let e=C();m(0,"li",26,5)(2,"p-chip",28),w("onRemove",function(n){let o=u(e).index,l=a(2);return d(l.readonly?"":l.removeOption(n,o))}),c(3,Ot,1,0,"ng-container",29)(4,Mt,2,2,"ng-template",null,6,A),_()()}if(i&2){let e=p.$implicit,t=p.index,n=a(2);g(n.cx("chipItem",V(16,mt,t))),r("pBind",n.ptm("chipItem")),b("id",n.id+"_multiple_option_"+t)("aria-label",n.getOptionLabel(e))("aria-setsize",n.modelValue().length)("aria-posinset",t+1)("aria-selected",!0),s(2),g(n.cx("pcChip")),r("pt",n.ptm("pcChip"))("label",!n.selectedItemTemplate&&!n._selectedItemTemplate&&n.getOptionLabel(e))("disabled",n.$disabled())("removable",!0),s(),r("ngTemplateOutlet",n.selectedItemTemplate||n._selectedItemTemplate)("ngTemplateOutletContext",V(18,Ne,e))}}function At(i,p){if(i&1){let e=C();m(0,"ul",24,3),w("focus",function(n){u(e);let o=a();return d(o.onMultipleContainerFocus(n))})("blur",function(n){u(e);let o=a();return d(o.onMultipleContainerBlur(n))})("keydown",function(n){u(e);let o=a();return d(o.onMultipleContainerKeyDown(n))}),c(2,kt,6,20,"li",25),m(3,"li",26)(4,"input",27,4),w("input",function(n){u(e);let o=a();return d(o.onInput(n))})("keydown",function(n){u(e);let o=a();return d(o.onKeyDown(n))})("change",function(n){u(e);let o=a();return d(o.onInputChange(n))})("focus",function(n){u(e);let o=a();return d(o.onInputFocus(n))})("blur",function(n){u(e);let o=a();return d(o.onInputBlur(n))})("paste",function(n){u(e);let o=a();return d(o.onInputPaste(n))})("keyup",function(n){u(e);let o=a();return d(o.onInputKeyUp(n))}),_()()()}if(i&2){let e=a();g(e.cx("inputMultiple")),r("pBind",e.ptm("inputMultiple"))("tabindex",-1),b("aria-orientation","horizontal")("aria-activedescendant",e.focused?e.focusedMultipleOptionId:void 0),s(2),r("ngForOf",e.modelValue()),s(),g(e.cx("inputChip")),r("pBind",e.ptm("inputChip")),s(),g(e.cx("pcInputText")),r("pAutoFocus",e.autofocus)("pBind",e.ptm("input"))("ngStyle",e.inputStyle),b("type",e.type)("id",e.inputId)("autocomplete",e.autocomplete)("name",e.name())("minlength",e.minlength())("maxlength",e.maxlength())("size",e.size())("min",e.min())("max",e.max())("pattern",e.pattern())("placeholder",e.$filled()?null:e.placeholder)("tabindex",e.$disabled()?-1:e.tabindex)("required",e.required()?"":void 0)("readonly",e.readonly?"":void 0)("disabled",e.$disabled()?"":void 0)("aria-label",e.ariaLabel)("aria-labelledby",e.ariaLabelledBy)("aria-required",e.required())("aria-expanded",e.overlayVisible??!1)("aria-controls",e.overlayVisible?e.id+"_list":null)("aria-activedescendant",e.focused?e.focusedOptionId:void 0)}}function Lt(i,p){if(i&1&&(B(),D(0,"svg",35)),i&2){let e=a(2);g(e.cx("loader")),r("pBind",e.ptm("loader"))("spin",!0),b("aria-hidden",!0)}}function Ft(i,p){}function Bt(i,p){i&1&&c(0,Ft,0,0,"ng-template")}function Dt(i,p){if(i&1&&(m(0,"span",32),c(1,Bt,1,0,null,23),_()),i&2){let e=a(2);g(e.cx("loader")),r("pBind",e.ptm("loader")),b("aria-hidden",!0),s(),r("ngTemplateOutlet",e.loadingIconTemplate||e._loadingIconTemplate)}}function Kt(i,p){if(i&1&&(T(0),c(1,Lt,1,5,"svg",33)(2,Dt,2,5,"span",34),S()),i&2){let e=a();s(),r("ngIf",!e.loadingIconTemplate&&!e._loadingIconTemplate),s(),r("ngIf",e.loadingIconTemplate||e._loadingIconTemplate)}}function zt(i,p){if(i&1&&D(0,"span",38),i&2){let e=a(2);r("ngClass",e.dropdownIcon),b("aria-hidden",!0)}}function Rt(i,p){if(i&1&&(B(),D(0,"svg",40)),i&2){let e=a(3);r("pBind",e.ptm("dropdown"))}}function Qt(i,p){}function $t(i,p){i&1&&c(0,Qt,0,0,"ng-template")}function qt(i,p){if(i&1&&(T(0),c(1,Rt,1,1,"svg",39)(2,$t,1,0,null,23),S()),i&2){let e=a(2);s(),r("ngIf",!e.dropdownIconTemplate&&!e._dropdownIconTemplate),s(),r("ngTemplateOutlet",e.dropdownIconTemplate||e._dropdownIconTemplate)}}function Ht(i,p){if(i&1){let e=C();m(0,"button",36,7),w("click",function(n){u(e);let o=a();return d(o.handleDropdownClick(n))}),c(2,zt,1,2,"span",37)(3,qt,3,2,"ng-container",14),_()}if(i&2){let e=a();g(e.cx("dropdown")),r("pBind",e.ptm("dropdown"))("disabled",e.$disabled()),b("aria-label",e.dropdownAriaLabel)("tabindex",e.tabindex),s(2),r("ngIf",e.dropdownIcon),s(),r("ngIf",!e.dropdownIcon)}}function Gt(i,p){i&1&&O(0)}function Pt(i,p){i&1&&O(0)}function Nt(i,p){if(i&1&&c(0,Pt,1,0,"ng-container",29),i&2){let e=p.$implicit,t=p.options;a(2);let n=Z(6);r("ngTemplateOutlet",n)("ngTemplateOutletContext",H(2,Ue,e,t))}}function Ut(i,p){i&1&&O(0)}function jt(i,p){if(i&1&&c(0,Ut,1,0,"ng-container",29),i&2){let e=p.options,t=a(4);r("ngTemplateOutlet",t.loaderTemplate||t._loaderTemplate)("ngTemplateOutletContext",V(2,_t,e))}}function Zt(i,p){i&1&&(T(0),c(1,jt,1,4,"ng-template",null,10,A),S())}function Wt(i,p){if(i&1){let e=C();m(0,"p-scroller",45,9),w("onLazyLoad",function(n){u(e);let o=a(2);return d(o.onLazyLoad.emit(n))}),c(2,Nt,1,5,"ng-template",null,1,A)(4,Zt,3,0,"ng-container",14),_()}if(i&2){let e=a(2);q(V(9,U,e.scrollHeight)),r("pt",e.ptm("virtualScroller"))("items",e.visibleOptions())("itemSize",e.virtualScrollItemSize)("autoSize",!0)("lazy",e.lazy)("options",e.virtualScrollOptions),s(4),r("ngIf",e.loaderTemplate||e._loaderTemplate)}}function Jt(i,p){i&1&&O(0)}function Xt(i,p){if(i&1&&(T(0),c(1,Jt,1,0,"ng-container",29),S()),i&2){a();let e=Z(6),t=a();s(),r("ngTemplateOutlet",e)("ngTemplateOutletContext",H(3,Ue,t.visibleOptions(),ge(2,gt)))}}function Yt(i,p){if(i&1&&(m(0,"span"),K(1),_()),i&2){let e=a(2).$implicit,t=a(3);s(),W(t.getOptionGroupLabel(e.optionGroup))}}function en(i,p){i&1&&O(0)}function tn(i,p){if(i&1&&(T(0),m(1,"li",49),c(2,Yt,2,1,"span",14)(3,en,1,0,"ng-container",29),_(),S()),i&2){let e=a(),t=e.$implicit,n=e.index,o=a().options,l=a(2);s(),g(l.cx("optionGroup")),r("pBind",l.ptm("optionGroup"))("ngStyle",V(8,U,o.itemSize+"px")),b("id",l.id+"_"+l.getOptionIndex(n,o)),s(),r("ngIf",!l.groupTemplate),s(),r("ngTemplateOutlet",l.groupTemplate)("ngTemplateOutletContext",V(10,Ne,t.optionGroup))}}function nn(i,p){if(i&1&&(m(0,"span"),K(1),_()),i&2){let e=a(2).$implicit,t=a(3);s(),W(t.getOptionLabel(e))}}function on(i,p){i&1&&O(0)}function ln(i,p){if(i&1){let e=C();T(0),m(1,"li",50),w("click",function(n){u(e);let o=a().$implicit,l=a(3);return d(l.onOptionSelect(n,o))})("mouseenter",function(n){u(e);let o=a().index,l=a().options,x=a(2);return d(x.onOptionMouseEnter(n,x.getOptionIndex(o,l)))}),c(2,nn,2,1,"span",14)(3,on,1,0,"ng-container",29),_(),S()}if(i&2){let e=a(),t=e.$implicit,n=e.index,o=a().options,l=a(2);s(),g(l.cx("option",X(14,ft,t,n,o))),r("pBind",l.getPTOptions(t,o,n,"option"))("ngStyle",V(18,U,o.itemSize+"px")),b("id",l.id+"_"+l.getOptionIndex(n,o))("aria-label",l.getOptionLabel(t))("aria-selected",l.isSelected(t))("aria-disabled",l.isOptionDisabled(t))("data-p-focused",l.focusedOptionIndex()===l.getOptionIndex(n,o))("aria-setsize",l.ariaSetSize)("aria-posinset",l.getAriaPosInset(l.getOptionIndex(n,o))),s(),r("ngIf",!l.itemTemplate&&!l._itemTemplate),s(),r("ngTemplateOutlet",l.itemTemplate||l._itemTemplate)("ngTemplateOutletContext",H(20,yt,t,o.getOptions?o.getOptions(n):n))}}function an(i,p){if(i&1&&c(0,tn,4,12,"ng-container",14)(1,ln,4,23,"ng-container",14),i&2){let e=p.$implicit,t=a(3);r("ngIf",t.isOptionGroup(e)),s(),r("ngIf",!t.isOptionGroup(e))}}function pn(i,p){if(i&1&&(T(0),K(1),S()),i&2){let e=a(4);s(),J(" ",e.searchResultMessageText," ")}}function rn(i,p){i&1&&O(0,null,12)}function sn(i,p){if(i&1&&(m(0,"li",49),c(1,pn,2,1,"ng-container",51)(2,rn,2,0,"ng-container",23),_()),i&2){let e=a().options,t=a(2);g(t.cx("emptyMessage")),r("pBind",t.ptm("emptyMessage"))("ngStyle",V(7,U,e.itemSize+"px")),s(),r("ngIf",!t.emptyTemplate&&!t._emptyTemplate)("ngIfElse",t.empty),s(),r("ngTemplateOutlet",t.emptyTemplate||t._emptyTemplate)}}function cn(i,p){if(i&1&&(m(0,"ul",46,11),c(2,an,2,2,"ng-template",47)(3,sn,3,9,"li",48),_()),i&2){let e=p.$implicit,t=p.options,n=a(2);q(t.contentStyle),g(n.cn(n.cx("list"),t.contentStyleClass)),r("pBind",n.ptm("list")),b("id",n.id+"_list")("aria-label",n.listLabel),s(2),r("ngForOf",e),s(),r("ngIf",!e||e&&e.length===0&&n.showEmptyMessage)}}function un(i,p){i&1&&O(0)}function dn(i,p){if(i&1&&(m(0,"div",41),c(1,Gt,1,0,"ng-container",23),m(2,"div",42),c(3,Wt,5,11,"p-scroller",43)(4,Xt,2,6,"ng-container",14),_(),c(5,cn,4,9,"ng-template",null,8,A)(7,un,1,0,"ng-container",23),_(),m(8,"span",44),K(9),_()),i&2){let e=a();g(e.cn(e.cx("overlay"),e.panelStyleClass)),r("pBind",e.ptm("overlay"))("ngStyle",e.panelStyle),s(),r("ngTemplateOutlet",e.headerTemplate||e._headerTemplate),s(),g(e.cx("listContainer")),ue("max-height",e.virtualScroll?"auto":e.scrollHeight),r("pBind",e.ptm("listContainer"))("tabindex",-1),s(),r("ngIf",e.virtualScroll),s(),r("ngIf",!e.virtualScroll),s(3),r("ngTemplateOutlet",e.footerTemplate||e._footerTemplate),s(2),J(" ",e.selectedMessageText," ")}}var mn=`
    ${He}

    /* For PrimeNG */
    p-autoComplete.ng-invalid.ng-dirty .p-autocomplete-input,
    p-autoComplete.ng-invalid.ng-dirty .p-autocomplete-input-multiple,
    p-auto-complete.ng-invalid.ng-dirty .p-autocomplete-input,
    p-auto-complete.ng-invalid.ng-dirty .p-autocomplete-input-multiple p-autocomplete.ng-invalid.ng-dirty .p-autocomplete-input,
    p-autocomplete.ng-invalid.ng-dirty .p-autocomplete-input-multiple {
        border-color: dt('autocomplete.invalid.border.color');
    }

    p-autoComplete.ng-invalid.ng-dirty .p-autocomplete-input:enabled:focus,
    p-autoComplete.ng-invalid.ng-dirty:not(.p-disabled).p-focus .p-autocomplete-input-multiple,
    p-auto-complete.ng-invalid.ng-dirty .p-autocomplete-input:enabled:focus,
    p-auto-complete.ng-invalid.ng-dirty:not(.p-disabled).p-focus .p-autocomplete-input-multiple,
    p-autocomplete.ng-invalid.ng-dirty .p-autocomplete-input:enabled:focus,
    p-autocomplete.ng-invalid.ng-dirty:not(.p-disabled).p-focus .p-autocomplete-input-multiple {
        border-color: dt('autocomplete.focus.border.color');
    }

    p-autoComplete.ng-invalid.ng-dirty .p-autocomplete-input-chip input::placeholder,
    p-auto-complete.ng-invalid.ng-dirty .p-autocomplete-input-chip input::placeholder,
    p-autocomplete.ng-invalid.ng-dirty .p-autocomplete-input-chip input::placeholder {
        color: dt('autocomplete.invalid.placeholder.color');
    }

    p-autoComplete.ng-invalid.ng-dirty .p-autocomplete-input::placeholder,
    p-auto-complete.ng-invalid.ng-dirty .p-autocomplete-input::placeholder,
    p-autocomplete.ng-invalid.ng-dirty .p-autocomplete-input::placeholder {
        color: dt('autocomplete.invalid.placeholder.color');
    }
`,hn={root:{position:"relative"}},_n={root:({instance:i})=>["p-autocomplete p-component p-inputwrapper",{"p-invalid":i.invalid(),"p-focus":i.focused,"p-inputwrapper-filled":i.$filled(),"p-inputwrapper-focus":i.focused&&!i.$disabled()||i.autofocus||i.overlayVisible,"p-autocomplete-open":i.overlayVisible,"p-autocomplete-clearable":i.showClear&&!i.$disabled(),"p-autocomplete-fluid":i.hasFluid}],pcInputText:"p-autocomplete-input",inputMultiple:({instance:i})=>["p-autocomplete-input-multiple",{"p-disabled":i.$disabled(),"p-variant-filled":i.$variant()==="filled"}],chipItem:({instance:i,i:p})=>["p-autocomplete-chip-item",{"p-focus":i.focusedMultipleOptionIndex()===p}],pcChip:"p-autocomplete-chip",chipIcon:"p-autocomplete-chip-icon",inputChip:"p-autocomplete-input-chip",loader:"p-autocomplete-loader",dropdown:"p-autocomplete-dropdown",overlay:({instance:i})=>["p-autocomplete-overlay p-component-overlay p-component",{"p-input-filled":i.$variant()==="filled","p-ripple-disabled":i.config.ripple()===!1}],listContainer:"p-autocomplete-list-container",list:"p-autocomplete-list",optionGroup:"p-autocomplete-option-group",option:({instance:i,option:p,i:e,scrollerOptions:t})=>({"p-autocomplete-option":!0,"p-autocomplete-option-selected":i.isSelected(p),"p-focus":i.focusedOptionIndex()===i.getOptionIndex(e,t),"p-disabled":i.isOptionDisabled(p)}),emptyMessage:"p-autocomplete-empty-message",clearIcon:"p-autocomplete-clear-icon"},Ge=(()=>{class i extends Ve{name="autocomplete";style=mn;classes=_n;inlineStyles=hn;static \u0275fac=(()=>{let e;return function(n){return(e||(e=le(i)))(n||i)}})();static \u0275prov=ne({token:i,factory:i.\u0275fac})}return i})();var Pe=new oe("AUTOCOMPLETE_INSTANCE"),gn={provide:Ke,useExisting:te(()=>je),multi:!0},je=(()=>{class i extends Re{overlayService;zone;$pcAutoComplete=Q(Pe,{optional:!0,skipSelf:!0})??void 0;bindDirectiveInstance=Q(R,{self:!0});minLength=1;minQueryLength;delay=300;panelStyle;styleClass;panelStyleClass;inputStyle;inputId;inputStyleClass;placeholder;readonly;scrollHeight="200px";lazy=!1;virtualScroll;virtualScrollItemSize;virtualScrollOptions;autoHighlight;forceSelection;type="text";autoZIndex=!0;baseZIndex=0;ariaLabel;dropdownAriaLabel;ariaLabelledBy;dropdownIcon;unique=!0;group;completeOnFocus=!1;showClear=!1;dropdown;showEmptyMessage=!0;dropdownMode="blank";multiple;addOnTab=!1;tabindex;dataKey;emptyMessage;showTransitionOptions=".12s cubic-bezier(0, 0, 0.2, 1)";hideTransitionOptions=".1s linear";autofocus;autocomplete="off";optionGroupChildren="items";optionGroupLabel="label";overlayOptions;get suggestions(){return this._suggestions()}set suggestions(e){this._suggestions.set(e),this.handleSuggestionsChange()}optionLabel;optionValue;id;searchMessage;emptySelectionMessage;selectionMessage;autoOptionFocus=!1;selectOnFocus;searchLocale;optionDisabled;focusOnHover=!0;typeahead=!0;addOnBlur=!1;separator;appendTo=fe(void 0);completeMethod=new v;onSelect=new v;onUnselect=new v;onAdd=new v;onFocus=new v;onBlur=new v;onDropdownClick=new v;onClear=new v;onInputKeydown=new v;onKeyUp=new v;onShow=new v;onHide=new v;onLazyLoad=new v;inputEL;multiInputEl;multiContainerEL;dropdownButton;itemsViewChild;scroller;overlayViewChild;itemsWrapper;itemTemplate;emptyTemplate;headerTemplate;footerTemplate;selectedItemTemplate;groupTemplate;loaderTemplate;removeIconTemplate;loadingIconTemplate;clearIconTemplate;dropdownIconTemplate;onHostClick(e){this.onContainerClick(e)}value;_suggestions=$(null);timeout;overlayVisible;suggestionsUpdated;highlightOption;highlightOptionChanged;focused=!1;loading;scrollHandler;listId;searchTimeout;dirty=!1;_itemTemplate;_groupTemplate;_selectedItemTemplate;_headerTemplate;_emptyTemplate;_footerTemplate;_loaderTemplate;_removeIconTemplate;_loadingIconTemplate;_clearIconTemplate;_dropdownIconTemplate;focusedMultipleOptionIndex=$(-1);focusedOptionIndex=$(-1);_componentStyle=Q(Ge);$appendTo=G(()=>this.appendTo()||this.config.overlayAppendTo());visibleOptions=G(()=>this.group?this.flatOptions(this._suggestions()):this._suggestions()||[]);inputValue=G(()=>{let e=this.modelValue(),t=this.optionValueSelected?(this.suggestions||[]).find(n=>F(n,e,this.equalityKey())):e;if(z(e))if(typeof e=="object"||this.optionValueSelected){let n=this.getOptionLabel(t);return n??e}else return e;else return""});get focusedMultipleOptionId(){return this.focusedMultipleOptionIndex()!==-1?`${this.id}_multiple_option_${this.focusedMultipleOptionIndex()}`:null}get focusedOptionId(){return this.focusedOptionIndex()!==-1?`${this.id}_${this.focusedOptionIndex()}`:null}get searchResultMessageText(){return z(this.visibleOptions())&&this.overlayVisible?this.searchMessageText.replaceAll("{0}",this.visibleOptions().length):this.emptySearchMessageText}get searchMessageText(){return this.searchMessage||this.config.translation.searchMessage||""}get emptySearchMessageText(){return this.emptyMessage||this.config.translation.emptySearchMessage||""}get selectionMessageText(){return this.selectionMessage||this.config.translation.selectionMessage||""}get emptySelectionMessageText(){return this.emptySelectionMessage||this.config.translation.emptySelectionMessage||""}get selectedMessageText(){return this.hasSelectedOption()?this.selectionMessageText.replaceAll("{0}",this.multiple?this.modelValue()?.length:"1"):this.emptySelectionMessageText}get ariaSetSize(){return this.visibleOptions().filter(e=>!this.isOptionGroup(e)).length}get listLabel(){return this.config.getTranslation(Se.ARIA).listLabel}get virtualScrollerDisabled(){return!this.virtualScroll}get optionValueSelected(){return typeof this.modelValue()=="string"&&this.optionValue}chipItemClass(e){return this._componentStyle.classes.chipItem({instance:this,i:e})}constructor(e,t){super(),this.overlayService=e,this.zone=t}onInit(){this.id=this.id||Ce("pn_id_"),this.cd.detectChanges()}templates;onAfterContentInit(){this.templates.forEach(e=>{switch(e.getType()){case"item":this._itemTemplate=e.template;break;case"group":this._groupTemplate=e.template;break;case"selecteditem":this._selectedItemTemplate=e.template;break;case"selectedItem":this._selectedItemTemplate=e.template;break;case"header":this._headerTemplate=e.template;break;case"empty":this._emptyTemplate=e.template;break;case"footer":this._footerTemplate=e.template;break;case"loader":this._loaderTemplate=e.template;break;case"removetokenicon":this._removeIconTemplate=e.template;break;case"loadingicon":this._loadingIconTemplate=e.template;break;case"clearicon":this._clearIconTemplate=e.template;break;case"dropdownicon":this._dropdownIconTemplate=e.template;break;default:this._itemTemplate=e.template;break}})}onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"])),this.suggestionsUpdated&&this.overlayViewChild&&this.zone.runOutsideAngular(()=>{setTimeout(()=>{this.overlayViewChild&&this.overlayViewChild.alignOverlay()},1),this.suggestionsUpdated=!1})}handleSuggestionsChange(){if(this.loading){this._suggestions()?.length>0||this.showEmptyMessage||this.emptyTemplate?this.show():this.hide();let e=this.overlayVisible&&this.autoOptionFocus?this.findFirstFocusedOptionIndex():-1;this.focusedOptionIndex.set(e),this.suggestionsUpdated=!0,this.loading=!1,this.cd.markForCheck()}}flatOptions(e){return(e||[]).reduce((t,n,o)=>{t.push({optionGroup:n,group:!0,index:o});let l=this.getOptionGroupChildren(n);return l&&l.forEach(x=>t.push(x)),t},[])}isOptionGroup(e){return this.optionGroupLabel&&e.optionGroup&&e.group}findFirstOptionIndex(){return this.visibleOptions().findIndex(e=>this.isValidOption(e))}findLastOptionIndex(){return ee(this.visibleOptions(),e=>this.isValidOption(e))}findFirstFocusedOptionIndex(){let e=this.findSelectedOptionIndex();return e<0?this.findFirstOptionIndex():e}findLastFocusedOptionIndex(){let e=this.findSelectedOptionIndex();return e<0?this.findLastOptionIndex():e}findSelectedOptionIndex(){return this.hasSelectedOption()?this.visibleOptions().findIndex(e=>this.isValidSelectedOption(e)):-1}findNextOptionIndex(e){let t=e<this.visibleOptions().length-1?this.visibleOptions().slice(e+1).findIndex(n=>this.isValidOption(n)):-1;return t>-1?t+e+1:e}findPrevOptionIndex(e){let t=e>0?ee(this.visibleOptions().slice(0,e),n=>this.isValidOption(n)):-1;return t>-1?t:e}isValidSelectedOption(e){return this.isValidOption(e)&&this.isSelected(e)}isValidOption(e){return e&&!(this.isOptionDisabled(e)||this.isOptionGroup(e))}isOptionDisabled(e){return this.optionDisabled?L(e,this.optionDisabled):!1}isSelected(e){return this.multiple?this.unique?this.modelValue()?.some(t=>F(t,e,this.equalityKey())):!1:F(this.modelValue(),e,this.equalityKey())}isOptionMatched(e,t){return this.isValidOption(e)&&this.getOptionLabel(e).toLocaleLowerCase(this.searchLocale)===t.toLocaleLowerCase(this.searchLocale)}isInputClicked(e){return e.target===this.inputEL?.nativeElement}isDropdownClicked(e){return this.dropdownButton?.nativeElement?e.target===this.dropdownButton.nativeElement||this.dropdownButton.nativeElement.contains(e.target):!1}equalityKey(){return this.optionValue?void 0:this.dataKey}onContainerClick(e){this.$disabled()||this.loading||this.isInputClicked(e)||this.isDropdownClicked(e)||(!this.overlayViewChild||!this.overlayViewChild.overlayViewChild?.nativeElement.contains(e.target))&&E(this.inputEL?.nativeElement)}handleDropdownClick(e){let t;this.overlayVisible?this.hide(!0):(E(this.inputEL?.nativeElement),t=this.inputEL?.nativeElement?.value,this.dropdownMode==="blank"?this.search(e,"","dropdown"):this.dropdownMode==="current"&&this.search(e,t,"dropdown")),this.onDropdownClick.emit({originalEvent:e,query:t})}onInput(e){if(this.typeahead){let t=this.minQueryLength||this.minLength;this.searchTimeout&&clearTimeout(this.searchTimeout);let n=e.target.value;this.maxlength()!==null&&(n=n.split("").slice(0,this.maxlength()).join("")),!this.multiple&&!this.forceSelection&&this.updateModel(n),n.length===0&&!this.multiple?(this.onClear.emit(),setTimeout(()=>{this.hide()},this.delay/2)):n.length>=t?(this.focusedOptionIndex.set(-1),this.searchTimeout=setTimeout(()=>{this.search(e,n,"input")},this.delay)):this.hide()}}onInputChange(e){if(this.forceSelection){let t=!1;if(this.visibleOptions()){let n=this.visibleOptions().find(o=>this.isOptionMatched(o,this.inputEL?.nativeElement?.value||""));n!==void 0&&(t=!0,!this.isSelected(n)&&this.onOptionSelect(e,n))}t||(this.inputEL?.nativeElement&&(this.inputEL.nativeElement.value=""),!this.multiple&&this.updateModel(null))}}onInputFocus(e){if(this.$disabled())return;!this.dirty&&this.completeOnFocus&&this.search(e,e.target.value,"focus"),this.dirty=!0,this.focused=!0;let t=this.focusedOptionIndex()!==-1?this.focusedOptionIndex():this.overlayVisible&&this.autoOptionFocus?this.findFirstFocusedOptionIndex():-1;this.focusedOptionIndex.set(t),this.overlayVisible&&this.scrollInView(this.focusedOptionIndex()),this.onFocus.emit(e)}onMultipleContainerFocus(e){this.$disabled()||(this.focused=!0)}onMultipleContainerBlur(e){this.focusedMultipleOptionIndex.set(-1),this.focused=!1}onMultipleContainerKeyDown(e){if(this.$disabled()){e.preventDefault();return}switch(e.code){case"ArrowLeft":this.onArrowLeftKeyOnMultiple(e);break;case"ArrowRight":this.onArrowRightKeyOnMultiple(e);break;case"Backspace":this.onBackspaceKeyOnMultiple(e);break;default:break}}onInputBlur(e){if(this.dirty=!1,this.focused=!1,this.focusedOptionIndex.set(-1),this.addOnBlur&&this.multiple&&!this.typeahead){let t=(this.multiInputEl?.nativeElement?.value||e.target.value||"").trim();t&&!this.isSelected(t)&&(this.updateModel([...this.modelValue()||[],t]),this.onAdd.emit({originalEvent:e,value:t}),this.multiInputEl?.nativeElement?this.multiInputEl.nativeElement.value="":e.target.value="")}this.onModelTouched(),this.onBlur.emit(e)}onInputPaste(e){if(this.separator&&this.multiple&&!this.typeahead){let t=(e.clipboardData||window.clipboardData)?.getData("Text");if(t){let n=t.split(this.separator),o=[...this.modelValue()||[]];if(n.forEach(l=>{let x=l.trim();x&&!this.isSelected(x)&&o.push(x)}),o.length>(this.modelValue()||[]).length){let l=o.slice((this.modelValue()||[]).length);this.updateModel(o),l.forEach(x=>{this.onAdd.emit({originalEvent:e,value:x})}),this.multiInputEl?.nativeElement?this.multiInputEl.nativeElement.value="":e.target.value="",e.preventDefault()}}}else this.onKeyDown(e)}onInputKeyUp(e){this.onKeyUp.emit(e)}onKeyDown(e){if(this.$disabled()){e.preventDefault();return}switch(this.onInputKeydown.emit(e),e.code){case"ArrowDown":this.onArrowDownKey(e);break;case"ArrowUp":this.onArrowUpKey(e);break;case"ArrowLeft":this.onArrowLeftKey(e);break;case"ArrowRight":this.onArrowRightKey(e);break;case"Home":this.onHomeKey(e);break;case"End":this.onEndKey(e);break;case"PageDown":this.onPageDownKey(e);break;case"PageUp":this.onPageUpKey(e);break;case"Enter":case"NumpadEnter":this.onEnterKey(e);break;case"Escape":this.onEscapeKey(e);break;case"Tab":this.onTabKey(e);break;case"Backspace":this.onBackspaceKey(e);break;case"ShiftLeft":case"ShiftRight":break;default:this.handleSeparatorKey(e);break}}handleSeparatorKey(e){if(this.separator&&this.multiple&&!this.typeahead&&(this.separator===e.key||typeof this.separator=="string"&&e.key===this.separator||this.separator instanceof RegExp&&e.key.match(this.separator))){let t=(this.multiInputEl?.nativeElement?.value||e.target.value||"").trim();t&&!this.isSelected(t)&&(this.updateModel([...this.modelValue()||[],t]),this.onAdd.emit({originalEvent:e,value:t}),this.multiInputEl?.nativeElement?this.multiInputEl.nativeElement.value="":e.target.value="",e.preventDefault())}}onArrowDownKey(e){if(!this.overlayVisible)return;let t=this.focusedOptionIndex()!==-1?this.findNextOptionIndex(this.focusedOptionIndex()):this.findFirstFocusedOptionIndex();this.changeFocusedOptionIndex(e,t),e.preventDefault(),e.stopPropagation()}onArrowUpKey(e){if(this.overlayVisible)if(e.altKey)this.focusedOptionIndex()!==-1&&this.onOptionSelect(e,this.visibleOptions()[this.focusedOptionIndex()]),this.overlayVisible&&this.hide(),e.preventDefault();else{let t=this.focusedOptionIndex()!==-1?this.findPrevOptionIndex(this.focusedOptionIndex()):this.findLastFocusedOptionIndex();this.changeFocusedOptionIndex(e,t),e.preventDefault(),e.stopPropagation()}}onArrowLeftKey(e){let t=e.currentTarget;this.focusedOptionIndex.set(-1),this.multiple&&(Y(t.value)&&this.hasSelectedOption()?(E(this.multiContainerEL?.nativeElement),this.focusedMultipleOptionIndex.set(this.modelValue().length)):e.stopPropagation())}onArrowRightKey(e){this.focusedOptionIndex.set(-1),this.multiple&&e.stopPropagation()}onHomeKey(e){let{currentTarget:t}=e,n=t.value.length;t.setSelectionRange(0,e.shiftKey?n:0),this.focusedOptionIndex.set(-1),e.preventDefault()}onEndKey(e){let{currentTarget:t}=e,n=t.value.length;t.setSelectionRange(e.shiftKey?0:n,n),this.focusedOptionIndex.set(-1),e.preventDefault()}onPageDownKey(e){this.scrollInView(this.visibleOptions().length-1),e.preventDefault()}onPageUpKey(e){this.scrollInView(0),e.preventDefault()}onEnterKey(e){if(!this.typeahead&&!this.forceSelection&&this.multiple){let t=e.target.value?.trim();t&&!this.isSelected(t)&&(this.updateModel([...this.modelValue()||[],t]),this.inputEL?.nativeElement&&(this.inputEL.nativeElement.value=""))}if(this.overlayVisible)this.focusedOptionIndex()!==-1&&this.onOptionSelect(e,this.visibleOptions()[this.focusedOptionIndex()]),this.hide();else return;e.preventDefault()}onEscapeKey(e){this.overlayVisible&&this.hide(!0),e.preventDefault()}onTabKey(e){if(this.focusedOptionIndex()!==-1){this.onOptionSelect(e,this.visibleOptions()[this.focusedOptionIndex()]);return}if(this.multiple&&!this.typeahead){let t=(this.multiInputEl?.nativeElement?.value||this.inputEL?.nativeElement?.value||"").trim();if(this.addOnTab&&t&&!this.isSelected(t)){this.updateModel([...this.modelValue()||[],t]),this.onAdd.emit({originalEvent:e,value:t}),this.multiInputEl?.nativeElement?this.multiInputEl.nativeElement.value="":this.inputEL?.nativeElement&&(this.inputEL.nativeElement.value=""),this.updateInputValue(),e.preventDefault(),this.overlayVisible&&this.hide();return}}this.overlayVisible&&this.hide()}onBackspaceKey(e){if(this.multiple){if(z(this.modelValue())&&!this.inputEL?.nativeElement?.value){let t=this.modelValue()[this.modelValue().length-1],n=this.modelValue().slice(0,-1);this.updateModel(n),this.onUnselect.emit({originalEvent:e,value:t})}e.stopPropagation()}}onArrowLeftKeyOnMultiple(e){let t=this.focusedMultipleOptionIndex()<1?0:this.focusedMultipleOptionIndex()-1;this.focusedMultipleOptionIndex.set(t)}onArrowRightKeyOnMultiple(e){let t=this.focusedMultipleOptionIndex();t++,this.focusedMultipleOptionIndex.set(t),t>this.modelValue().length-1&&(this.focusedMultipleOptionIndex.set(-1),E(this.inputEL?.nativeElement))}onBackspaceKeyOnMultiple(e){this.focusedMultipleOptionIndex()!==-1&&this.removeOption(e,this.focusedMultipleOptionIndex())}onOptionSelect(e,t,n=!0){this.multiple?(this.inputEL?.nativeElement&&(this.inputEL.nativeElement.value=""),this.isSelected(t)||this.updateModel([...this.modelValue()||[],t])):this.updateModel(t),this.onSelect.emit({originalEvent:e,value:t}),n&&this.hide(!0)}onOptionMouseEnter(e,t){this.focusOnHover&&this.changeFocusedOptionIndex(e,t)}search(e,t,n){t!=null&&(n==="input"&&t.trim().length===0||(this.loading=!0,this.completeMethod.emit({originalEvent:e,query:t})))}removeOption(e,t){e.stopPropagation();let n=this.modelValue()[t],o=this.modelValue().filter((l,x)=>x!==t);this.updateModel(o),this.onUnselect.emit({originalEvent:e,value:n}),E(this.inputEL?.nativeElement)}updateModel(e){let t=null;e&&(t=this.multiple?e.map(n=>this.getOptionValue(n)):this.getOptionValue(e)),this.value=t,this.writeModelValue(e),this.onModelChange(t),this.updateInputValue(),this.cd.markForCheck()}updateInputValue(){this.inputEL&&this.inputEL.nativeElement&&(this.multiple?this.inputEL.nativeElement.value="":this.inputEL.nativeElement.value=this.inputValue())}autoUpdateModel(){if((this.selectOnFocus||this.autoHighlight)&&this.autoOptionFocus&&!this.hasSelectedOption()){let e=this.findFirstFocusedOptionIndex();this.focusedOptionIndex.set(e),this.onOptionSelect(null,this.visibleOptions()[this.focusedOptionIndex()],!1)}}scrollInView(e=-1){let t=e!==-1?`${this.id}_${e}`:this.focusedOptionId;if(this.itemsViewChild&&this.itemsViewChild.nativeElement){let n=P(this.itemsViewChild.nativeElement,`li[id="${t}"]`);n?n.scrollIntoView&&n.scrollIntoView({block:"nearest",inline:"nearest"}):this.virtualScrollerDisabled||setTimeout(()=>{this.virtualScroll&&this.scroller?.scrollToIndex(e!==-1?e:this.focusedOptionIndex())},0)}}changeFocusedOptionIndex(e,t){this.focusedOptionIndex()!==t&&(this.focusedOptionIndex.set(t),this.scrollInView(),this.selectOnFocus&&this.onOptionSelect(e,this.visibleOptions()[t],!1))}show(e=!1){this.dirty=!0,this.overlayVisible=!0;let t=this.focusedOptionIndex()!==-1?this.focusedOptionIndex():this.autoOptionFocus?this.findFirstFocusedOptionIndex():-1;this.focusedOptionIndex.set(t),e&&E(this.inputEL?.nativeElement),e&&E(this.inputEL?.nativeElement),this.onShow.emit(),this.cd.markForCheck()}hide(e=!1){let t=()=>{this.dirty=e,this.overlayVisible=!1,this.focusedOptionIndex.set(-1),e&&E(this.inputEL?.nativeElement),this.onHide.emit(),this.cd.markForCheck()};setTimeout(()=>{t()},0)}clear(){this.updateModel(null),this.inputEL?.nativeElement&&(this.inputEL.nativeElement.value=""),this.onClear.emit()}hasSelectedOption(){return z(this.modelValue())}getAriaPosInset(e){return(this.optionGroupLabel?e-this.visibleOptions().slice(0,e).filter(t=>this.isOptionGroup(t)).length:e)+1}getOptionLabel(e){return this.optionLabel?L(e,this.optionLabel):e&&e.label!=null?e.label:e}getOptionValue(e){return this.optionValue?L(e,this.optionValue):e&&e.value!=null?e.value:e}getOptionIndex(e,t){return this.virtualScrollerDisabled?e:t&&t.getItemOptions(e).index}getOptionGroupLabel(e){return this.optionGroupLabel?L(e,this.optionGroupLabel):e&&e.label!=null?e.label:e}getOptionGroupChildren(e){return this.optionGroupChildren?L(e,this.optionGroupChildren):e.items}getPTOptions(e,t,n,o){return this.ptm(o,{context:{option:e,index:this.getOptionIndex(n,t),selected:this.isSelected(e),focused:this.focusedOptionIndex()===this.getOptionIndex(n,t),disabled:this.isOptionDisabled(e)}})}onOverlayAnimationStart(e){if(e.toState==="visible"&&(this.itemsWrapper=P(this.overlayViewChild.overlayViewChild?.nativeElement,this.virtualScroll?".p-scroller":".p-autocomplete-panel"),this.virtualScroll&&(this.scroller?.setContentEl(this.itemsViewChild?.nativeElement),this.scroller?.viewInit()),this.visibleOptions()&&this.visibleOptions().length))if(this.virtualScroll){let t=this.modelValue()?this.focusedOptionIndex():-1;t!==-1&&this.scroller?.scrollToIndex(t)}else{let t=P(this.itemsWrapper,".p-autocomplete-item.p-highlight");t&&t.scrollIntoView({block:"nearest",inline:"center"})}}writeControlValue(e,t){let n=this.multiple?this.visibleOptions().filter(o=>e?.some(l=>F(l,o,this.equalityKey()))):this.visibleOptions().find(o=>F(e,o,this.equalityKey()));this.value=e,t(Y(n)?e:n),this.updateInputValue(),this.cd.markForCheck()}onDestroy(){this.scrollHandler&&(this.scrollHandler.destroy(),this.scrollHandler=null)}static \u0275fac=function(t){return new(t||i)(j(Oe),j(ae))};static \u0275cmp=pe({type:i,selectors:[["p-autoComplete"],["p-autocomplete"],["p-auto-complete"]],contentQueries:function(t,n,o){if(t&1&&(I(o,Ze,5),I(o,We,5),I(o,Je,5),I(o,Xe,5),I(o,Ye,5),I(o,et,5),I(o,tt,5),I(o,nt,5),I(o,it,5),I(o,ot,5),I(o,lt,5),I(o,Te,4)),t&2){let l;f(l=y())&&(n.itemTemplate=l.first),f(l=y())&&(n.emptyTemplate=l.first),f(l=y())&&(n.headerTemplate=l.first),f(l=y())&&(n.footerTemplate=l.first),f(l=y())&&(n.selectedItemTemplate=l.first),f(l=y())&&(n.groupTemplate=l.first),f(l=y())&&(n.loaderTemplate=l.first),f(l=y())&&(n.removeIconTemplate=l.first),f(l=y())&&(n.loadingIconTemplate=l.first),f(l=y())&&(n.clearIconTemplate=l.first),f(l=y())&&(n.dropdownIconTemplate=l.first),f(l=y())&&(n.templates=l)}},viewQuery:function(t,n){if(t&1&&(M(at,5),M(pt,5),M(rt,5),M(st,5),M(ct,5),M(ut,5),M(dt,5)),t&2){let o;f(o=y())&&(n.inputEL=o.first),f(o=y())&&(n.multiInputEl=o.first),f(o=y())&&(n.multiContainerEL=o.first),f(o=y())&&(n.dropdownButton=o.first),f(o=y())&&(n.itemsViewChild=o.first),f(o=y())&&(n.scroller=o.first),f(o=y())&&(n.overlayViewChild=o.first)}},hostVars:4,hostBindings:function(t,n){t&1&&w("click",function(l){return n.onHostClick(l)}),t&2&&(q(n.sx("root")),g(n.cn(n.cx("root"),n.styleClass)))},inputs:{minLength:[2,"minLength","minLength",k],minQueryLength:[2,"minQueryLength","minQueryLength",k],delay:[2,"delay","delay",k],panelStyle:"panelStyle",styleClass:"styleClass",panelStyleClass:"panelStyleClass",inputStyle:"inputStyle",inputId:"inputId",inputStyleClass:"inputStyleClass",placeholder:"placeholder",readonly:[2,"readonly","readonly",h],scrollHeight:"scrollHeight",lazy:[2,"lazy","lazy",h],virtualScroll:[2,"virtualScroll","virtualScroll",h],virtualScrollItemSize:[2,"virtualScrollItemSize","virtualScrollItemSize",k],virtualScrollOptions:"virtualScrollOptions",autoHighlight:[2,"autoHighlight","autoHighlight",h],forceSelection:[2,"forceSelection","forceSelection",h],type:"type",autoZIndex:[2,"autoZIndex","autoZIndex",h],baseZIndex:[2,"baseZIndex","baseZIndex",k],ariaLabel:"ariaLabel",dropdownAriaLabel:"dropdownAriaLabel",ariaLabelledBy:"ariaLabelledBy",dropdownIcon:"dropdownIcon",unique:[2,"unique","unique",h],group:[2,"group","group",h],completeOnFocus:[2,"completeOnFocus","completeOnFocus",h],showClear:[2,"showClear","showClear",h],dropdown:[2,"dropdown","dropdown",h],showEmptyMessage:[2,"showEmptyMessage","showEmptyMessage",h],dropdownMode:"dropdownMode",multiple:[2,"multiple","multiple",h],addOnTab:[2,"addOnTab","addOnTab",h],tabindex:[2,"tabindex","tabindex",k],dataKey:"dataKey",emptyMessage:"emptyMessage",showTransitionOptions:"showTransitionOptions",hideTransitionOptions:"hideTransitionOptions",autofocus:[2,"autofocus","autofocus",h],autocomplete:"autocomplete",optionGroupChildren:"optionGroupChildren",optionGroupLabel:"optionGroupLabel",overlayOptions:"overlayOptions",suggestions:"suggestions",optionLabel:"optionLabel",optionValue:"optionValue",id:"id",searchMessage:"searchMessage",emptySelectionMessage:"emptySelectionMessage",selectionMessage:"selectionMessage",autoOptionFocus:[2,"autoOptionFocus","autoOptionFocus",h],selectOnFocus:[2,"selectOnFocus","selectOnFocus",h],searchLocale:[2,"searchLocale","searchLocale",h],optionDisabled:"optionDisabled",focusOnHover:[2,"focusOnHover","focusOnHover",h],typeahead:[2,"typeahead","typeahead",h],addOnBlur:[2,"addOnBlur","addOnBlur",h],separator:"separator",appendTo:[1,"appendTo"]},outputs:{completeMethod:"completeMethod",onSelect:"onSelect",onUnselect:"onUnselect",onAdd:"onAdd",onFocus:"onFocus",onBlur:"onBlur",onDropdownClick:"onDropdownClick",onClear:"onClear",onInputKeydown:"onInputKeydown",onKeyUp:"onKeyUp",onShow:"onShow",onHide:"onHide",onLazyLoad:"onLazyLoad"},features:[_e([gn,Ge,{provide:Pe,useExisting:i},{provide:Ee,useExisting:i}]),ce([R]),se],decls:9,vars:13,consts:[["overlay",""],["content",""],["focusInput",""],["multiContainer",""],["focusInput","","multiIn",""],["token",""],["removeicon",""],["ddBtn",""],["buildInItems",""],["scroller",""],["loader",""],["items",""],["empty",""],["pInputText","","aria-autocomplete","list","role","combobox",3,"pAutoFocus","pt","class","ngStyle","variant","invalid","pSize","fluid","input","keydown","change","focus","blur","paste","keyup",4,"ngIf"],[4,"ngIf"],["role","listbox",3,"pBind","class","tabindex","focus","blur","keydown",4,"ngIf"],["type","button","pRipple","",3,"pBind","class","disabled","click",4,"ngIf"],[3,"visibleChange","onAnimationStart","onHide","pt","hostAttrSelector","visible","options","target","appendTo","showTransitionOptions","hideTransitionOptions"],["pInputText","","aria-autocomplete","list","role","combobox",3,"input","keydown","change","focus","blur","paste","keyup","pAutoFocus","pt","ngStyle","variant","invalid","pSize","fluid"],["data-p-icon","times",3,"pBind","class","click",4,"ngIf"],[3,"pBind","class","click",4,"ngIf"],["data-p-icon","times",3,"click","pBind"],[3,"click","pBind"],[4,"ngTemplateOutlet"],["role","listbox",3,"focus","blur","keydown","pBind","tabindex"],["role","option",3,"pBind","class",4,"ngFor","ngForOf"],["role","option",3,"pBind"],["role","combobox","aria-autocomplete","list",3,"input","keydown","change","focus","blur","paste","keyup","pAutoFocus","pBind","ngStyle"],[3,"onRemove","pt","label","disabled","removable"],[4,"ngTemplateOutlet","ngTemplateOutletContext"],[3,"pBind",4,"ngIf"],["data-p-icon","times-circle"],[3,"pBind"],["data-p-icon","spinner",3,"pBind","class","spin",4,"ngIf"],[3,"pBind","class",4,"ngIf"],["data-p-icon","spinner",3,"pBind","spin"],["type","button","pRipple","",3,"click","pBind","disabled"],[3,"ngClass",4,"ngIf"],[3,"ngClass"],["data-p-icon","chevron-down",3,"pBind",4,"ngIf"],["data-p-icon","chevron-down",3,"pBind"],[3,"pBind","ngStyle"],[3,"pBind","tabindex"],[3,"pt","items","style","itemSize","autoSize","lazy","options","onLazyLoad",4,"ngIf"],["role","status","aria-live","polite",1,"p-hidden-accessible"],[3,"onLazyLoad","pt","items","itemSize","autoSize","lazy","options"],["role","listbox",3,"pBind"],["ngFor","",3,"ngForOf"],["role","option",3,"pBind","class","ngStyle",4,"ngIf"],["role","option",3,"pBind","ngStyle"],["pRipple","","role","option",3,"click","mouseenter","pBind","ngStyle"],[4,"ngIf","ngIfElse"]],template:function(t,n){if(t&1){let o=C();c(0,xt,2,31,"input",13)(1,Ct,3,2,"ng-container",14)(2,At,7,36,"ul",15)(3,Kt,3,2,"ng-container",14)(4,Ht,4,8,"button",16),m(5,"p-overlay",17,0),he("visibleChange",function(x){return u(o),me(n.overlayVisible,x)||(n.overlayVisible=x),d(x)}),w("onAnimationStart",function(x){return u(o),d(n.onOverlayAnimationStart(x))})("onHide",function(){return u(o),d(n.hide())}),c(7,dn,10,15,"ng-template",null,1,A),_()}t&2&&(r("ngIf",!n.multiple),s(),r("ngIf",n.$filled()&&!n.$disabled()&&n.showClear&&!n.loading),s(),r("ngIf",n.multiple),s(),r("ngIf",n.loading),s(),r("ngIf",n.dropdown),s(),r("pt",n.ptm("pcOverlay"))("hostAttrSelector",n.$attrSelector),de("visible",n.overlayVisible),r("options",n.overlayOptions)("target","@parent")("appendTo",n.$appendTo())("showTransitionOptions",n.showTransitionOptions)("hideTransitionOptions",n.hideTransitionOptions))},dependencies:[Ie,ye,xe,be,we,ve,Qe,ze,De,$e,ke,Be,Le,Ae,qe,N,Fe,Me,R],encapsulation:2,changeDetection:0})}return i})(),Wn=(()=>{class i{static \u0275fac=function(t){return new(t||i)};static \u0275mod=re({type:i});static \u0275inj=ie({imports:[je,N,N]})}return i})();export{je as a,Wn as b};
