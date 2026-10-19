import{a as Qe}from"./chunk-ZDGLK54F.js";import{a as Ve,h as Ke,i as ze}from"./chunk-5GN6XSW7.js";import{a as Me}from"./chunk-JJAGKUSK.js";import{a as De}from"./chunk-LI2KPXVA.js";import{b as Fe}from"./chunk-H5WSU5TD.js";import{a as Le}from"./chunk-C36H567T.js";import{p as ke}from"./chunk-HG3OLFKI.js";import{K as J,M as Q,N as L,O as F,Q as X,W as ve,ba as we,ea as Ie,fa as Y,ga as Ce,ja as Oe,ka as Te,r as H,ra as Se,s as E,xa as Ee,ya as Ae}from"./chunk-CXPSUUCS.js";import{$b as $,$c as _e,Bb as r,Cb as m,Db as _,Dc as A,Eb as K,Hc as q,Ib as T,Jb as S,Kb as O,Kc as he,Lb as C,Nb as w,Pb as p,Pc as h,Qc as M,Sa as s,Sb as I,Tb as k,U as ee,Ub as f,V as te,Vb as y,W as ne,Ya as U,Yb as N,Zb as re,_ as P,ac as g,bc as z,bd as ge,cc as j,cd as fe,db as oe,dc as Z,dd as ye,ea as u,eb as le,ed as xe,fa as d,ga as D,hb as ae,jb as c,kc as se,kd as be,lb as v,lc as ce,mb as pe,mc as ue,oa as R,pc as de,qc as me,rc as V,sa as ie,sc as B,tc as W,vb as b}from"./chunk-5CDEAHDS.js";var Re=`
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
`;var Ge=["item"],Pe=["empty"],Ue=["header"],Ne=["footer"],je=["selecteditem"],Ze=["group"],We=["loader"],Je=["removeicon"],Xe=["loadingicon"],Ye=["clearicon"],et=["dropdownicon"],tt=["focusInput"],nt=["multiIn"],it=["multiContainer"],ot=["ddBtn"],lt=["items"],at=["scroller"],pt=["overlay"],rt=n=>({i:n}),Be=n=>({$implicit:n}),st=(n,a,e)=>({removeCallback:n,index:a,class:e}),G=n=>({height:n}),qe=(n,a)=>({$implicit:n,options:a}),ct=n=>({options:n}),ut=()=>({}),dt=(n,a,e)=>({option:n,i:a,scrollerOptions:e}),mt=(n,a)=>({$implicit:n,index:a});function ht(n,a){if(n&1){let e=C();m(0,"input",18,2),w("input",function(i){u(e);let o=p();return d(o.onInput(i))})("keydown",function(i){u(e);let o=p();return d(o.onKeyDown(i))})("change",function(i){u(e);let o=p();return d(o.onInputChange(i))})("focus",function(i){u(e);let o=p();return d(o.onInputFocus(i))})("blur",function(i){u(e);let o=p();return d(o.onInputBlur(i))})("paste",function(i){u(e);let o=p();return d(o.onInputPaste(i))})("keyup",function(i){u(e);let o=p();return d(o.onInputKeyUp(i))}),_()}if(n&2){let e=p();g(e.cn(e.cx("pcInputText"),e.inputStyleClass)),r("pAutoFocus",e.autofocus)("ngStyle",e.inputStyle)("variant",e.$variant())("invalid",e.invalid())("pSize",e.size())("fluid",e.hasFluid),b("type",e.type)("value",e.inputValue())("id",e.inputId)("autocomplete",e.autocomplete)("placeholder",e.placeholder)("name",e.name())("minlength",e.minlength())("min",e.min())("max",e.max())("pattern",e.pattern())("size",e.inputSize())("maxlength",e.maxlength())("tabindex",e.$disabled()?-1:e.tabindex)("required",e.required()?"":void 0)("readonly",e.readonly?"":void 0)("disabled",e.$disabled()?"":void 0)("aria-label",e.ariaLabel)("aria-labelledby",e.ariaLabelledBy)("aria-required",e.required())("aria-expanded",e.overlayVisible??!1)("aria-controls",e.overlayVisible?e.id+"_list":null)("aria-activedescendant",e.focused?e.focusedOptionId:void 0)}}function _t(n,a){if(n&1){let e=C();D(),m(0,"svg",21),w("click",function(){u(e);let i=p(2);return d(i.clear())}),_()}if(n&2){let e=p(2);g(e.cx("clearIcon")),b("aria-hidden",!0)}}function gt(n,a){}function ft(n,a){n&1&&c(0,gt,0,0,"ng-template")}function yt(n,a){if(n&1){let e=C();m(0,"span",22),w("click",function(){u(e);let i=p(2);return d(i.clear())}),c(1,ft,1,0,null,23),_()}if(n&2){let e=p(2);g(e.cx("clearIcon")),b("aria-hidden",!0),s(),r("ngTemplateOutlet",e.clearIconTemplate||e._clearIconTemplate)}}function xt(n,a){if(n&1&&(T(0),c(1,_t,1,3,"svg",19)(2,yt,2,4,"span",20),S()),n&2){let e=p();s(),r("ngIf",!e.clearIconTemplate&&!e._clearIconTemplate),s(),r("ngIf",e.clearIconTemplate||e._clearIconTemplate)}}function bt(n,a){n&1&&O(0)}function vt(n,a){if(n&1){let e=C();m(0,"span",22),w("click",function(i){u(e);let o=p(2).index,l=p(2);return d(!l.readonly&&!l.$disabled()?l.removeOption(i,o):"")}),D(),K(1,"svg",30),_()}if(n&2){let e=p(4);g(e.cx("chipIcon")),s(),g(e.cx("chipIcon")),b("aria-hidden",!0)}}function wt(n,a){}function It(n,a){n&1&&c(0,wt,0,0,"ng-template")}function Ct(n,a){if(n&1&&(m(0,"span"),c(1,It,1,0,null,29),_()),n&2){let e=p(2).index,t=p(2);b("aria-hidden",!0),s(),r("ngTemplateOutlet",t.removeIconTemplate||t._removeIconTemplate)("ngTemplateOutletContext",W(3,st,t.removeOption.bind(t),e,t.cx("chipIcon")))}}function Ot(n,a){if(n&1&&c(0,vt,2,5,"span",20)(1,Ct,2,7,"span",14),n&2){let e=p(3);r("ngIf",!e.removeIconTemplate&&!e._removeIconTemplate),s(),r("ngIf",e.removeIconTemplate||e._removeIconTemplate)}}function Tt(n,a){if(n&1){let e=C();m(0,"li",26,5)(2,"p-chip",28),w("onRemove",function(i){let o=u(e).index,l=p(2);return d(l.readonly?"":l.removeOption(i,o))}),c(3,bt,1,0,"ng-container",29)(4,Ot,2,2,"ng-template",null,6,A),_()()}if(n&2){let e=a.$implicit,t=a.index,i=p(2);g(i.cx("chipItem",V(14,rt,t))),b("id",i.id+"_multiple_option_"+t)("aria-label",i.getOptionLabel(e))("aria-setsize",i.modelValue().length)("aria-posinset",t+1)("aria-selected",!0),s(2),g(i.cx("pcChip")),r("label",!i.selectedItemTemplate&&!i._selectedItemTemplate&&i.getOptionLabel(e))("disabled",i.$disabled())("removable",!0),s(),r("ngTemplateOutlet",i.selectedItemTemplate||i._selectedItemTemplate)("ngTemplateOutletContext",V(16,Be,e))}}function St(n,a){if(n&1){let e=C();m(0,"ul",24,3),w("focus",function(i){u(e);let o=p();return d(o.onMultipleContainerFocus(i))})("blur",function(i){u(e);let o=p();return d(o.onMultipleContainerBlur(i))})("keydown",function(i){u(e);let o=p();return d(o.onMultipleContainerKeyDown(i))}),c(2,Tt,6,18,"li",25),m(3,"li",26)(4,"input",27,4),w("input",function(i){u(e);let o=p();return d(o.onInput(i))})("keydown",function(i){u(e);let o=p();return d(o.onKeyDown(i))})("change",function(i){u(e);let o=p();return d(o.onInputChange(i))})("focus",function(i){u(e);let o=p();return d(o.onInputFocus(i))})("blur",function(i){u(e);let o=p();return d(o.onInputBlur(i))})("paste",function(i){u(e);let o=p();return d(o.onInputPaste(i))})("keyup",function(i){u(e);let o=p();return d(o.onInputKeyUp(i))}),_()()()}if(n&2){let e=p();g(e.cx("inputMultiple")),r("tabindex",-1),b("aria-orientation","horizontal")("aria-activedescendant",e.focused?e.focusedMultipleOptionId:void 0),s(2),r("ngForOf",e.modelValue()),s(),g(e.cx("inputChip")),s(),g(e.cx("pcInputText")),r("pAutoFocus",e.autofocus)("ngStyle",e.inputStyle),b("type",e.type)("id",e.inputId)("autocomplete",e.autocomplete)("name",e.name())("minlength",e.minlength())("maxlength",e.maxlength())("size",e.size())("min",e.min())("max",e.max())("pattern",e.pattern())("placeholder",e.$filled()?null:e.placeholder)("tabindex",e.$disabled()?-1:e.tabindex)("required",e.required()?"":void 0)("readonly",e.readonly?"":void 0)("disabled",e.$disabled()?"":void 0)("aria-label",e.ariaLabel)("aria-labelledby",e.ariaLabelledBy)("aria-required",e.required())("aria-expanded",e.overlayVisible??!1)("aria-controls",e.overlayVisible?e.id+"_list":null)("aria-activedescendant",e.focused?e.focusedOptionId:void 0)}}function Vt(n,a){if(n&1&&(D(),K(0,"svg",33)),n&2){let e=p(2);g(e.cx("loader")),r("spin",!0),b("aria-hidden",!0)}}function Et(n,a){}function kt(n,a){n&1&&c(0,Et,0,0,"ng-template")}function Mt(n,a){if(n&1&&(m(0,"span"),c(1,kt,1,0,null,23),_()),n&2){let e=p(2);g(e.cx("loader")),b("aria-hidden",!0),s(),r("ngTemplateOutlet",e.loadingIconTemplate||e._loadingIconTemplate)}}function At(n,a){if(n&1&&(T(0),c(1,Vt,1,4,"svg",31)(2,Mt,2,4,"span",32),S()),n&2){let e=p();s(),r("ngIf",!e.loadingIconTemplate&&!e._loadingIconTemplate),s(),r("ngIf",e.loadingIconTemplate||e._loadingIconTemplate)}}function Lt(n,a){if(n&1&&K(0,"span",36),n&2){let e=p(2);r("ngClass",e.dropdownIcon),b("aria-hidden",!0)}}function Ft(n,a){n&1&&(D(),K(0,"svg",38))}function Dt(n,a){}function Kt(n,a){n&1&&c(0,Dt,0,0,"ng-template")}function zt(n,a){if(n&1&&(T(0),c(1,Ft,1,0,"svg",37)(2,Kt,1,0,null,23),S()),n&2){let e=p(2);s(),r("ngIf",!e.dropdownIconTemplate&&!e._dropdownIconTemplate),s(),r("ngTemplateOutlet",e.dropdownIconTemplate||e._dropdownIconTemplate)}}function Qt(n,a){if(n&1){let e=C();m(0,"button",34,7),w("click",function(i){u(e);let o=p();return d(o.handleDropdownClick(i))}),c(2,Lt,1,2,"span",35)(3,zt,3,2,"ng-container",14),_()}if(n&2){let e=p();g(e.cx("dropdown")),r("disabled",e.$disabled()),b("aria-label",e.dropdownAriaLabel)("tabindex",e.tabindex),s(2),r("ngIf",e.dropdownIcon),s(),r("ngIf",!e.dropdownIcon)}}function Rt(n,a){n&1&&O(0)}function $t(n,a){n&1&&O(0)}function Bt(n,a){if(n&1&&c(0,$t,1,0,"ng-container",29),n&2){let e=a.$implicit,t=a.options;p(2);let i=N(6);r("ngTemplateOutlet",i)("ngTemplateOutletContext",B(2,qe,e,t))}}function qt(n,a){n&1&&O(0)}function Ht(n,a){if(n&1&&c(0,qt,1,0,"ng-container",29),n&2){let e=a.options,t=p(4);r("ngTemplateOutlet",t.loaderTemplate||t._loaderTemplate)("ngTemplateOutletContext",V(2,ct,e))}}function Gt(n,a){n&1&&(T(0),c(1,Ht,1,4,"ng-template",null,10,A),S())}function Pt(n,a){if(n&1){let e=C();m(0,"p-scroller",42,9),w("onLazyLoad",function(i){u(e);let o=p(2);return d(o.onLazyLoad.emit(i))}),c(2,Bt,1,5,"ng-template",null,1,A)(4,Gt,3,0,"ng-container",14),_()}if(n&2){let e=p(2);$(V(8,G,e.scrollHeight)),r("items",e.visibleOptions())("itemSize",e.virtualScrollItemSize)("autoSize",!0)("lazy",e.lazy)("options",e.virtualScrollOptions),s(4),r("ngIf",e.loaderTemplate||e._loaderTemplate)}}function Ut(n,a){n&1&&O(0)}function Nt(n,a){if(n&1&&(T(0),c(1,Ut,1,0,"ng-container",29),S()),n&2){p();let e=N(6),t=p();s(),r("ngTemplateOutlet",e)("ngTemplateOutletContext",B(3,qe,t.visibleOptions(),me(2,ut)))}}function jt(n,a){if(n&1&&(m(0,"span"),z(1),_()),n&2){let e=p(2).$implicit,t=p(3);s(),j(t.getOptionGroupLabel(e.optionGroup))}}function Zt(n,a){n&1&&O(0)}function Wt(n,a){if(n&1&&(T(0),m(1,"li",46),c(2,jt,2,1,"span",14)(3,Zt,1,0,"ng-container",29),_(),S()),n&2){let e=p(),t=e.$implicit,i=e.index,o=p().options,l=p(2);s(),g(l.cx("optionGroup")),r("ngStyle",V(7,G,o.itemSize+"px")),b("id",l.id+"_"+l.getOptionIndex(i,o)),s(),r("ngIf",!l.groupTemplate),s(),r("ngTemplateOutlet",l.groupTemplate)("ngTemplateOutletContext",V(9,Be,t.optionGroup))}}function Jt(n,a){if(n&1&&(m(0,"span"),z(1),_()),n&2){let e=p(2).$implicit,t=p(3);s(),j(t.getOptionLabel(e))}}function Xt(n,a){n&1&&O(0)}function Yt(n,a){if(n&1){let e=C();T(0),m(1,"li",47),w("click",function(i){u(e);let o=p().$implicit,l=p(3);return d(l.onOptionSelect(i,o))})("mouseenter",function(i){u(e);let o=p().index,l=p().options,x=p(2);return d(x.onOptionMouseEnter(i,x.getOptionIndex(o,l)))}),c(2,Jt,2,1,"span",14)(3,Xt,1,0,"ng-container",29),_(),S()}if(n&2){let e=p(),t=e.$implicit,i=e.index,o=p().options,l=p(2);s(),g(l.cx("option",W(13,dt,t,i,o))),r("ngStyle",V(17,G,o.itemSize+"px")),b("id",l.id+"_"+l.getOptionIndex(i,o))("aria-label",l.getOptionLabel(t))("aria-selected",l.isSelected(t))("aria-disabled",l.isOptionDisabled(t))("data-p-focused",l.focusedOptionIndex()===l.getOptionIndex(i,o))("aria-setsize",l.ariaSetSize)("aria-posinset",l.getAriaPosInset(l.getOptionIndex(i,o))),s(),r("ngIf",!l.itemTemplate&&!l._itemTemplate),s(),r("ngTemplateOutlet",l.itemTemplate||l._itemTemplate)("ngTemplateOutletContext",B(19,mt,t,o.getOptions?o.getOptions(i):i))}}function en(n,a){if(n&1&&c(0,Wt,4,11,"ng-container",14)(1,Yt,4,22,"ng-container",14),n&2){let e=a.$implicit,t=p(3);r("ngIf",t.isOptionGroup(e)),s(),r("ngIf",!t.isOptionGroup(e))}}function tn(n,a){if(n&1&&(T(0),z(1),S()),n&2){let e=p(4);s(),Z(" ",e.searchResultMessageText," ")}}function nn(n,a){n&1&&O(0,null,12)}function on(n,a){if(n&1&&(m(0,"li",46),c(1,tn,2,1,"ng-container",48)(2,nn,2,0,"ng-container",23),_()),n&2){let e=p().options,t=p(2);g(t.cx("emptyMessage")),r("ngStyle",V(6,G,e.itemSize+"px")),s(),r("ngIf",!t.emptyTemplate&&!t._emptyTemplate)("ngIfElse",t.empty),s(),r("ngTemplateOutlet",t.emptyTemplate||t._emptyTemplate)}}function ln(n,a){if(n&1&&(m(0,"ul",43,11),c(2,en,2,2,"ng-template",44)(3,on,3,8,"li",45),_()),n&2){let e=a.$implicit,t=a.options,i=p(2);$(t.contentStyle),g(i.cn(i.cx("list"),t.contentStyleClass)),b("id",i.id+"_list")("aria-label",i.listLabel),s(2),r("ngForOf",e),s(),r("ngIf",!e||e&&e.length===0&&i.showEmptyMessage)}}function an(n,a){n&1&&O(0)}function pn(n,a){if(n&1&&(m(0,"div",39),c(1,Rt,1,0,"ng-container",23),m(2,"div"),c(3,Pt,5,10,"p-scroller",40)(4,Nt,2,6,"ng-container",14),_(),c(5,ln,4,8,"ng-template",null,8,A)(7,an,1,0,"ng-container",23),_(),m(8,"span",41),z(9),_()),n&2){let e=p();g(e.cn(e.cx("overlay"),e.panelStyleClass)),r("ngStyle",e.panelStyle),s(),r("ngTemplateOutlet",e.headerTemplate||e._headerTemplate),s(),g(e.cx("listContainer")),re("max-height",e.virtualScroll?"auto":e.scrollHeight),s(),r("ngIf",e.virtualScroll),s(),r("ngIf",!e.virtualScroll),s(3),r("ngTemplateOutlet",e.footerTemplate||e._footerTemplate),s(2),Z(" ",e.selectedMessageText," ")}}var rn=`
    ${Re}

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
`,sn={root:{position:"relative"}},cn={root:({instance:n})=>["p-autocomplete p-component p-inputwrapper",{"p-invalid":n.invalid(),"p-focus":n.focused,"p-inputwrapper-filled":n.$filled(),"p-inputwrapper-focus":n.focused&&!n.$disabled()||n.autofocus||n.overlayVisible,"p-autocomplete-open":n.overlayVisible,"p-autocomplete-clearable":n.showClear&&!n.$disabled(),"p-autocomplete-fluid":n.hasFluid}],pcInputText:"p-autocomplete-input",inputMultiple:({instance:n})=>["p-autocomplete-input-multiple",{"p-disabled":n.$disabled(),"p-variant-filled":n.$variant()==="filled"}],chipItem:({instance:n,i:a})=>["p-autocomplete-chip-item",{"p-focus":n.focusedMultipleOptionIndex()===a}],pcChip:"p-autocomplete-chip",chipIcon:"p-autocomplete-chip-icon",inputChip:"p-autocomplete-input-chip",loader:"p-autocomplete-loader",dropdown:"p-autocomplete-dropdown",overlay:({instance:n})=>["p-autocomplete-overlay p-component-overlay p-component",{"p-input-filled":n.$variant()==="filled","p-ripple-disabled":n.config.ripple()===!1}],listContainer:"p-autocomplete-list-container",list:"p-autocomplete-list",optionGroup:"p-autocomplete-option-group",option:({instance:n,option:a,i:e,scrollerOptions:t})=>({"p-autocomplete-option":!0,"p-autocomplete-option-selected":n.isSelected(a),"p-focus":n.focusedOptionIndex()===n.getOptionIndex(e,t),"p-disabled":n.isOptionDisabled(a)}),emptyMessage:"p-autocomplete-empty-message",clearIcon:"p-autocomplete-clear-icon"},$e=(()=>{class n extends Oe{name="autocomplete";theme=rn;classes=cn;inlineStyles=sn;static \u0275fac=(()=>{let e;return function(i){return(e||(e=ie(n)))(i||n)}})();static \u0275prov=te({token:n,factory:n.\u0275fac})}return n})();var un={provide:Le,useExisting:ee(()=>He),multi:!0},He=(()=>{class n extends De{overlayService;zone;minLength=1;minQueryLength;delay=300;panelStyle;styleClass;panelStyleClass;inputStyle;inputId;inputStyleClass;placeholder;readonly;scrollHeight="200px";lazy=!1;virtualScroll;virtualScrollItemSize;virtualScrollOptions;autoHighlight;forceSelection;type="text";autoZIndex=!0;baseZIndex=0;ariaLabel;dropdownAriaLabel;ariaLabelledBy;dropdownIcon;unique=!0;group;completeOnFocus=!1;showClear=!1;dropdown;showEmptyMessage=!0;dropdownMode="blank";multiple;addOnTab=!1;tabindex;dataKey;emptyMessage;showTransitionOptions=".12s cubic-bezier(0, 0, 0.2, 1)";hideTransitionOptions=".1s linear";autofocus;autocomplete="off";optionGroupChildren="items";optionGroupLabel="label";overlayOptions;get suggestions(){return this._suggestions()}set suggestions(e){this._suggestions.set(e),this.handleSuggestionsChange()}optionLabel;optionValue;id;searchMessage;emptySelectionMessage;selectionMessage;autoOptionFocus=!1;selectOnFocus;searchLocale;optionDisabled;focusOnHover=!0;typeahead=!0;addOnBlur=!1;separator;appendTo=he(void 0);completeMethod=new v;onSelect=new v;onUnselect=new v;onAdd=new v;onFocus=new v;onBlur=new v;onDropdownClick=new v;onClear=new v;onInputKeydown=new v;onKeyUp=new v;onShow=new v;onHide=new v;onLazyLoad=new v;inputEL;multiInputEl;multiContainerEL;dropdownButton;itemsViewChild;scroller;overlayViewChild;itemsWrapper;itemTemplate;emptyTemplate;headerTemplate;footerTemplate;selectedItemTemplate;groupTemplate;loaderTemplate;removeIconTemplate;loadingIconTemplate;clearIconTemplate;dropdownIconTemplate;onHostClick(e){this.onContainerClick(e)}primeng=P(Te);value;_suggestions=R(null);timeout;overlayVisible;suggestionsUpdated;highlightOption;highlightOptionChanged;focused=!1;loading;scrollHandler;listId;searchTimeout;dirty=!1;_itemTemplate;_groupTemplate;_selectedItemTemplate;_headerTemplate;_emptyTemplate;_footerTemplate;_loaderTemplate;_removeIconTemplate;_loadingIconTemplate;_clearIconTemplate;_dropdownIconTemplate;focusedMultipleOptionIndex=R(-1);focusedOptionIndex=R(-1);_componentStyle=P($e);$appendTo=q(()=>this.appendTo()||this.config.overlayAppendTo());visibleOptions=q(()=>this.group?this.flatOptions(this._suggestions()):this._suggestions()||[]);inputValue=q(()=>{let e=this.modelValue(),t=this.optionValueSelected?(this.suggestions||[]).find(i=>F(i,e,this.equalityKey())):e;if(Q(e))if(typeof e=="object"||this.optionValueSelected){let i=this.getOptionLabel(t);return i??e}else return e;else return""});get focusedMultipleOptionId(){return this.focusedMultipleOptionIndex()!==-1?`${this.id}_multiple_option_${this.focusedMultipleOptionIndex()}`:null}get focusedOptionId(){return this.focusedOptionIndex()!==-1?`${this.id}_${this.focusedOptionIndex()}`:null}get searchResultMessageText(){return Q(this.visibleOptions())&&this.overlayVisible?this.searchMessageText.replaceAll("{0}",this.visibleOptions().length):this.emptySearchMessageText}get searchMessageText(){return this.searchMessage||this.config.translation.searchMessage||""}get emptySearchMessageText(){return this.emptyMessage||this.config.translation.emptySearchMessage||""}get selectionMessageText(){return this.selectionMessage||this.config.translation.selectionMessage||""}get emptySelectionMessageText(){return this.emptySelectionMessage||this.config.translation.emptySelectionMessage||""}get selectedMessageText(){return this.hasSelectedOption()?this.selectionMessageText.replaceAll("{0}",this.multiple?this.modelValue()?.length:"1"):this.emptySelectionMessageText}get ariaSetSize(){return this.visibleOptions().filter(e=>!this.isOptionGroup(e)).length}get listLabel(){return this.config.getTranslation(Ce.ARIA).listLabel}get virtualScrollerDisabled(){return!this.virtualScroll}get optionValueSelected(){return typeof this.modelValue()=="string"&&this.optionValue}chipItemClass(e){return this._componentStyle.classes.chipItem({instance:this,i:e})}constructor(e,t){super(),this.overlayService=e,this.zone=t}ngOnInit(){super.ngOnInit(),this.id=this.id||ve("pn_id_"),this.cd.detectChanges()}templates;ngAfterContentInit(){this.templates.forEach(e=>{switch(e.getType()){case"item":this._itemTemplate=e.template;break;case"group":this._groupTemplate=e.template;break;case"selecteditem":this._selectedItemTemplate=e.template;break;case"selectedItem":this._selectedItemTemplate=e.template;break;case"header":this._headerTemplate=e.template;break;case"empty":this._emptyTemplate=e.template;break;case"footer":this._footerTemplate=e.template;break;case"loader":this._loaderTemplate=e.template;break;case"removetokenicon":this._removeIconTemplate=e.template;break;case"loadingicon":this._loadingIconTemplate=e.template;break;case"clearicon":this._clearIconTemplate=e.template;break;case"dropdownicon":this._dropdownIconTemplate=e.template;break;default:this._itemTemplate=e.template;break}})}ngAfterViewChecked(){this.suggestionsUpdated&&this.overlayViewChild&&this.zone.runOutsideAngular(()=>{setTimeout(()=>{this.overlayViewChild&&this.overlayViewChild.alignOverlay()},1),this.suggestionsUpdated=!1})}handleSuggestionsChange(){if(this.loading){this._suggestions()?.length>0||this.showEmptyMessage||this.emptyTemplate?this.show():this.hide();let e=this.overlayVisible&&this.autoOptionFocus?this.findFirstFocusedOptionIndex():-1;this.focusedOptionIndex.set(e),this.suggestionsUpdated=!0,this.loading=!1,this.cd.markForCheck()}}flatOptions(e){return(e||[]).reduce((t,i,o)=>{t.push({optionGroup:i,group:!0,index:o});let l=this.getOptionGroupChildren(i);return l&&l.forEach(x=>t.push(x)),t},[])}isOptionGroup(e){return this.optionGroupLabel&&e.optionGroup&&e.group}findFirstOptionIndex(){return this.visibleOptions().findIndex(e=>this.isValidOption(e))}findLastOptionIndex(){return X(this.visibleOptions(),e=>this.isValidOption(e))}findFirstFocusedOptionIndex(){let e=this.findSelectedOptionIndex();return e<0?this.findFirstOptionIndex():e}findLastFocusedOptionIndex(){let e=this.findSelectedOptionIndex();return e<0?this.findLastOptionIndex():e}findSelectedOptionIndex(){return this.hasSelectedOption()?this.visibleOptions().findIndex(e=>this.isValidSelectedOption(e)):-1}findNextOptionIndex(e){let t=e<this.visibleOptions().length-1?this.visibleOptions().slice(e+1).findIndex(i=>this.isValidOption(i)):-1;return t>-1?t+e+1:e}findPrevOptionIndex(e){let t=e>0?X(this.visibleOptions().slice(0,e),i=>this.isValidOption(i)):-1;return t>-1?t:e}isValidSelectedOption(e){return this.isValidOption(e)&&this.isSelected(e)}isValidOption(e){return e&&!(this.isOptionDisabled(e)||this.isOptionGroup(e))}isOptionDisabled(e){return this.optionDisabled?L(e,this.optionDisabled):!1}isSelected(e){return this.multiple?this.unique?this.modelValue()?.some(t=>F(t,e,this.equalityKey())):!1:F(this.modelValue(),e,this.equalityKey())}isOptionMatched(e,t){return this.isValidOption(e)&&this.getOptionLabel(e).toLocaleLowerCase(this.searchLocale)===t.toLocaleLowerCase(this.searchLocale)}isInputClicked(e){return e.target===this.inputEL?.nativeElement}isDropdownClicked(e){return this.dropdownButton?.nativeElement?e.target===this.dropdownButton.nativeElement||this.dropdownButton.nativeElement.contains(e.target):!1}equalityKey(){return this.optionValue?void 0:this.dataKey}onContainerClick(e){this.$disabled()||this.loading||this.isInputClicked(e)||this.isDropdownClicked(e)||(!this.overlayViewChild||!this.overlayViewChild.overlayViewChild?.nativeElement.contains(e.target))&&E(this.inputEL?.nativeElement)}handleDropdownClick(e){let t;this.overlayVisible?this.hide(!0):(E(this.inputEL?.nativeElement),t=this.inputEL?.nativeElement?.value,this.dropdownMode==="blank"?this.search(e,"","dropdown"):this.dropdownMode==="current"&&this.search(e,t,"dropdown")),this.onDropdownClick.emit({originalEvent:e,query:t})}onInput(e){if(this.typeahead){let t=this.minQueryLength||this.minLength;this.searchTimeout&&clearTimeout(this.searchTimeout);let i=e.target.value;this.maxlength()!==null&&(i=i.split("").slice(0,this.maxlength()).join("")),!this.multiple&&!this.forceSelection&&this.updateModel(i),i.length===0&&!this.multiple?(this.onClear.emit(),setTimeout(()=>{this.hide()},this.delay/2)):i.length>=t?(this.focusedOptionIndex.set(-1),this.searchTimeout=setTimeout(()=>{this.search(e,i,"input")},this.delay)):this.hide()}}onInputChange(e){if(this.forceSelection){let t=!1;if(this.visibleOptions()){let i=this.visibleOptions().find(o=>this.isOptionMatched(o,this.inputEL?.nativeElement?.value||""));i!==void 0&&(t=!0,!this.isSelected(i)&&this.onOptionSelect(e,i))}t||(this.inputEL?.nativeElement&&(this.inputEL.nativeElement.value=""),!this.multiple&&this.updateModel(null))}}onInputFocus(e){if(this.$disabled())return;!this.dirty&&this.completeOnFocus&&this.search(e,e.target.value,"focus"),this.dirty=!0,this.focused=!0;let t=this.focusedOptionIndex()!==-1?this.focusedOptionIndex():this.overlayVisible&&this.autoOptionFocus?this.findFirstFocusedOptionIndex():-1;this.focusedOptionIndex.set(t),this.overlayVisible&&this.scrollInView(this.focusedOptionIndex()),this.onFocus.emit(e)}onMultipleContainerFocus(e){this.$disabled()||(this.focused=!0)}onMultipleContainerBlur(e){this.focusedMultipleOptionIndex.set(-1),this.focused=!1}onMultipleContainerKeyDown(e){if(this.$disabled()){e.preventDefault();return}switch(e.code){case"ArrowLeft":this.onArrowLeftKeyOnMultiple(e);break;case"ArrowRight":this.onArrowRightKeyOnMultiple(e);break;case"Backspace":this.onBackspaceKeyOnMultiple(e);break;default:break}}onInputBlur(e){if(this.dirty=!1,this.focused=!1,this.focusedOptionIndex.set(-1),this.addOnBlur&&this.multiple&&!this.typeahead){let t=(this.multiInputEl?.nativeElement?.value||e.target.value||"").trim();t&&!this.isSelected(t)&&(this.updateModel([...this.modelValue()||[],t]),this.onAdd.emit({originalEvent:e,value:t}),this.multiInputEl?.nativeElement?this.multiInputEl.nativeElement.value="":e.target.value="")}this.onModelTouched(),this.onBlur.emit(e)}onInputPaste(e){if(this.separator&&this.multiple&&!this.typeahead){let t=(e.clipboardData||window.clipboardData)?.getData("Text");if(t){let i=t.split(this.separator),o=[...this.modelValue()||[]];if(i.forEach(l=>{let x=l.trim();x&&!this.isSelected(x)&&o.push(x)}),o.length>(this.modelValue()||[]).length){let l=o.slice((this.modelValue()||[]).length);this.updateModel(o),l.forEach(x=>{this.onAdd.emit({originalEvent:e,value:x})}),this.multiInputEl?.nativeElement?this.multiInputEl.nativeElement.value="":e.target.value="",e.preventDefault()}}}else this.onKeyDown(e)}onInputKeyUp(e){this.onKeyUp.emit(e)}onKeyDown(e){if(this.$disabled()){e.preventDefault();return}switch(this.onInputKeydown.emit(e),e.code){case"ArrowDown":this.onArrowDownKey(e);break;case"ArrowUp":this.onArrowUpKey(e);break;case"ArrowLeft":this.onArrowLeftKey(e);break;case"ArrowRight":this.onArrowRightKey(e);break;case"Home":this.onHomeKey(e);break;case"End":this.onEndKey(e);break;case"PageDown":this.onPageDownKey(e);break;case"PageUp":this.onPageUpKey(e);break;case"Enter":case"NumpadEnter":this.onEnterKey(e);break;case"Escape":this.onEscapeKey(e);break;case"Tab":this.onTabKey(e);break;case"Backspace":this.onBackspaceKey(e);break;case"ShiftLeft":case"ShiftRight":break;default:this.handleSeparatorKey(e);break}}handleSeparatorKey(e){if(this.separator&&this.multiple&&!this.typeahead&&(this.separator===e.key||typeof this.separator=="string"&&e.key===this.separator||this.separator instanceof RegExp&&e.key.match(this.separator))){let t=(this.multiInputEl?.nativeElement?.value||e.target.value||"").trim();t&&!this.isSelected(t)&&(this.updateModel([...this.modelValue()||[],t]),this.onAdd.emit({originalEvent:e,value:t}),this.multiInputEl?.nativeElement?this.multiInputEl.nativeElement.value="":e.target.value="",e.preventDefault())}}onArrowDownKey(e){if(!this.overlayVisible)return;let t=this.focusedOptionIndex()!==-1?this.findNextOptionIndex(this.focusedOptionIndex()):this.findFirstFocusedOptionIndex();this.changeFocusedOptionIndex(e,t),e.preventDefault(),e.stopPropagation()}onArrowUpKey(e){if(this.overlayVisible)if(e.altKey)this.focusedOptionIndex()!==-1&&this.onOptionSelect(e,this.visibleOptions()[this.focusedOptionIndex()]),this.overlayVisible&&this.hide(),e.preventDefault();else{let t=this.focusedOptionIndex()!==-1?this.findPrevOptionIndex(this.focusedOptionIndex()):this.findLastFocusedOptionIndex();this.changeFocusedOptionIndex(e,t),e.preventDefault(),e.stopPropagation()}}onArrowLeftKey(e){let t=e.currentTarget;this.focusedOptionIndex.set(-1),this.multiple&&(J(t.value)&&this.hasSelectedOption()?(E(this.multiContainerEL?.nativeElement),this.focusedMultipleOptionIndex.set(this.modelValue().length)):e.stopPropagation())}onArrowRightKey(e){this.focusedOptionIndex.set(-1),this.multiple&&e.stopPropagation()}onHomeKey(e){let{currentTarget:t}=e,i=t.value.length;t.setSelectionRange(0,e.shiftKey?i:0),this.focusedOptionIndex.set(-1),e.preventDefault()}onEndKey(e){let{currentTarget:t}=e,i=t.value.length;t.setSelectionRange(e.shiftKey?0:i,i),this.focusedOptionIndex.set(-1),e.preventDefault()}onPageDownKey(e){this.scrollInView(this.visibleOptions().length-1),e.preventDefault()}onPageUpKey(e){this.scrollInView(0),e.preventDefault()}onEnterKey(e){if(!this.typeahead&&!this.forceSelection&&this.multiple){let t=e.target.value?.trim();t&&!this.isSelected(t)&&(this.updateModel([...this.modelValue()||[],t]),this.inputEL?.nativeElement&&(this.inputEL.nativeElement.value=""))}if(this.overlayVisible)this.focusedOptionIndex()!==-1&&this.onOptionSelect(e,this.visibleOptions()[this.focusedOptionIndex()]),this.hide();else return;e.preventDefault()}onEscapeKey(e){this.overlayVisible&&this.hide(!0),e.preventDefault()}onTabKey(e){if(this.focusedOptionIndex()!==-1){this.onOptionSelect(e,this.visibleOptions()[this.focusedOptionIndex()]);return}if(this.multiple&&!this.typeahead){let t=(this.multiInputEl?.nativeElement?.value||this.inputEL?.nativeElement?.value||"").trim();if(this.addOnTab&&t&&!this.isSelected(t)){this.updateModel([...this.modelValue()||[],t]),this.onAdd.emit({originalEvent:e,value:t}),this.multiInputEl?.nativeElement?this.multiInputEl.nativeElement.value="":this.inputEL?.nativeElement&&(this.inputEL.nativeElement.value=""),this.updateInputValue(),e.preventDefault(),this.overlayVisible&&this.hide();return}}this.overlayVisible&&this.hide()}onBackspaceKey(e){if(this.multiple){if(Q(this.modelValue())&&!this.inputEL?.nativeElement?.value){let t=this.modelValue()[this.modelValue().length-1],i=this.modelValue().slice(0,-1);this.updateModel(i),this.onUnselect.emit({originalEvent:e,value:t})}e.stopPropagation()}}onArrowLeftKeyOnMultiple(e){let t=this.focusedMultipleOptionIndex()<1?0:this.focusedMultipleOptionIndex()-1;this.focusedMultipleOptionIndex.set(t)}onArrowRightKeyOnMultiple(e){let t=this.focusedMultipleOptionIndex();t++,this.focusedMultipleOptionIndex.set(t),t>this.modelValue().length-1&&(this.focusedMultipleOptionIndex.set(-1),E(this.inputEL?.nativeElement))}onBackspaceKeyOnMultiple(e){this.focusedMultipleOptionIndex()!==-1&&this.removeOption(e,this.focusedMultipleOptionIndex())}onOptionSelect(e,t,i=!0){this.multiple?(this.inputEL?.nativeElement&&(this.inputEL.nativeElement.value=""),this.isSelected(t)||this.updateModel([...this.modelValue()||[],t])):this.updateModel(t),this.onSelect.emit({originalEvent:e,value:t}),i&&this.hide(!0)}onOptionMouseEnter(e,t){this.focusOnHover&&this.changeFocusedOptionIndex(e,t)}search(e,t,i){t!=null&&(i==="input"&&t.trim().length===0||(this.loading=!0,this.completeMethod.emit({originalEvent:e,query:t})))}removeOption(e,t){e.stopPropagation();let i=this.modelValue()[t],o=this.modelValue().filter((l,x)=>x!==t);this.updateModel(o),this.onUnselect.emit({originalEvent:e,value:i}),E(this.inputEL?.nativeElement)}updateModel(e){let t=this.multiple?e.map(i=>this.getOptionValue(i)):this.getOptionValue(e);this.value=t,this.writeModelValue(e),this.onModelChange(t),this.updateInputValue(),this.cd.markForCheck()}updateInputValue(){this.inputEL&&this.inputEL.nativeElement&&(this.multiple?this.inputEL.nativeElement.value="":this.inputEL.nativeElement.value=this.inputValue())}autoUpdateModel(){if((this.selectOnFocus||this.autoHighlight)&&this.autoOptionFocus&&!this.hasSelectedOption()){let e=this.findFirstFocusedOptionIndex();this.focusedOptionIndex.set(e),this.onOptionSelect(null,this.visibleOptions()[this.focusedOptionIndex()],!1)}}scrollInView(e=-1){let t=e!==-1?`${this.id}_${e}`:this.focusedOptionId;if(this.itemsViewChild&&this.itemsViewChild.nativeElement){let i=H(this.itemsViewChild.nativeElement,`li[id="${t}"]`);i?i.scrollIntoView&&i.scrollIntoView({block:"nearest",inline:"nearest"}):this.virtualScrollerDisabled||setTimeout(()=>{this.virtualScroll&&this.scroller?.scrollToIndex(e!==-1?e:this.focusedOptionIndex())},0)}}changeFocusedOptionIndex(e,t){this.focusedOptionIndex()!==t&&(this.focusedOptionIndex.set(t),this.scrollInView(),this.selectOnFocus&&this.onOptionSelect(e,this.visibleOptions()[t],!1))}show(e=!1){this.dirty=!0,this.overlayVisible=!0;let t=this.focusedOptionIndex()!==-1?this.focusedOptionIndex():this.autoOptionFocus?this.findFirstFocusedOptionIndex():-1;this.focusedOptionIndex.set(t),e&&E(this.inputEL?.nativeElement),e&&E(this.inputEL?.nativeElement),this.onShow.emit(),this.cd.markForCheck()}hide(e=!1){let t=()=>{this.dirty=e,this.overlayVisible=!1,this.focusedOptionIndex.set(-1),e&&E(this.inputEL?.nativeElement),this.onHide.emit(),this.cd.markForCheck()};setTimeout(()=>{t()},0)}clear(){this.updateModel(null),this.inputEL?.nativeElement&&(this.inputEL.nativeElement.value=""),this.onClear.emit()}hasSelectedOption(){return Q(this.modelValue())}getAriaPosInset(e){return(this.optionGroupLabel?e-this.visibleOptions().slice(0,e).filter(t=>this.isOptionGroup(t)).length:e)+1}getOptionLabel(e){return this.optionLabel?L(e,this.optionLabel):e&&e.label!=null?e.label:e}getOptionValue(e){return this.optionValue?L(e,this.optionValue):e&&e.value!=null?e.value:e}getOptionIndex(e,t){return this.virtualScrollerDisabled?e:t&&t.getItemOptions(e).index}getOptionGroupLabel(e){return this.optionGroupLabel?L(e,this.optionGroupLabel):e&&e.label!=null?e.label:e}getOptionGroupChildren(e){return this.optionGroupChildren?L(e,this.optionGroupChildren):e.items}onOverlayAnimationStart(e){if(e.toState==="visible"&&(this.itemsWrapper=H(this.overlayViewChild.overlayViewChild?.nativeElement,this.virtualScroll?".p-scroller":".p-autocomplete-panel"),this.virtualScroll&&(this.scroller?.setContentEl(this.itemsViewChild?.nativeElement),this.scroller?.viewInit()),this.visibleOptions()&&this.visibleOptions().length))if(this.virtualScroll){let t=this.modelValue()?this.focusedOptionIndex():-1;t!==-1&&this.scroller?.scrollToIndex(t)}else{let t=H(this.itemsWrapper,".p-autocomplete-item.p-highlight");t&&t.scrollIntoView({block:"nearest",inline:"center"})}}writeControlValue(e,t){let i=this.multiple?this.visibleOptions().filter(o=>e?.some(l=>F(l,o,this.equalityKey()))):this.visibleOptions().find(o=>F(e,o,this.equalityKey()));this.value=e,t(J(i)?e:i),this.updateInputValue(),this.cd.markForCheck()}ngOnDestroy(){this.scrollHandler&&(this.scrollHandler.destroy(),this.scrollHandler=null),super.ngOnDestroy()}static \u0275fac=function(t){return new(t||n)(U(we),U(pe))};static \u0275cmp=oe({type:n,selectors:[["p-autoComplete"],["p-autocomplete"],["p-auto-complete"]],contentQueries:function(t,i,o){if(t&1&&(I(o,Ge,5),I(o,Pe,5),I(o,Ue,5),I(o,Ne,5),I(o,je,5),I(o,Ze,5),I(o,We,5),I(o,Je,5),I(o,Xe,5),I(o,Ye,5),I(o,et,5),I(o,Ie,4)),t&2){let l;f(l=y())&&(i.itemTemplate=l.first),f(l=y())&&(i.emptyTemplate=l.first),f(l=y())&&(i.headerTemplate=l.first),f(l=y())&&(i.footerTemplate=l.first),f(l=y())&&(i.selectedItemTemplate=l.first),f(l=y())&&(i.groupTemplate=l.first),f(l=y())&&(i.loaderTemplate=l.first),f(l=y())&&(i.removeIconTemplate=l.first),f(l=y())&&(i.loadingIconTemplate=l.first),f(l=y())&&(i.clearIconTemplate=l.first),f(l=y())&&(i.dropdownIconTemplate=l.first),f(l=y())&&(i.templates=l)}},viewQuery:function(t,i){if(t&1&&(k(tt,5),k(nt,5),k(it,5),k(ot,5),k(lt,5),k(at,5),k(pt,5)),t&2){let o;f(o=y())&&(i.inputEL=o.first),f(o=y())&&(i.multiInputEl=o.first),f(o=y())&&(i.multiContainerEL=o.first),f(o=y())&&(i.dropdownButton=o.first),f(o=y())&&(i.itemsViewChild=o.first),f(o=y())&&(i.scroller=o.first),f(o=y())&&(i.overlayViewChild=o.first)}},hostVars:4,hostBindings:function(t,i){t&1&&w("click",function(l){return i.onHostClick(l)}),t&2&&($(i.sx("root")),g(i.cn(i.cx("root"),i.styleClass)))},inputs:{minLength:[2,"minLength","minLength",M],minQueryLength:[2,"minQueryLength","minQueryLength",M],delay:[2,"delay","delay",M],panelStyle:"panelStyle",styleClass:"styleClass",panelStyleClass:"panelStyleClass",inputStyle:"inputStyle",inputId:"inputId",inputStyleClass:"inputStyleClass",placeholder:"placeholder",readonly:[2,"readonly","readonly",h],scrollHeight:"scrollHeight",lazy:[2,"lazy","lazy",h],virtualScroll:[2,"virtualScroll","virtualScroll",h],virtualScrollItemSize:[2,"virtualScrollItemSize","virtualScrollItemSize",M],virtualScrollOptions:"virtualScrollOptions",autoHighlight:[2,"autoHighlight","autoHighlight",h],forceSelection:[2,"forceSelection","forceSelection",h],type:"type",autoZIndex:[2,"autoZIndex","autoZIndex",h],baseZIndex:[2,"baseZIndex","baseZIndex",M],ariaLabel:"ariaLabel",dropdownAriaLabel:"dropdownAriaLabel",ariaLabelledBy:"ariaLabelledBy",dropdownIcon:"dropdownIcon",unique:[2,"unique","unique",h],group:[2,"group","group",h],completeOnFocus:[2,"completeOnFocus","completeOnFocus",h],showClear:[2,"showClear","showClear",h],dropdown:[2,"dropdown","dropdown",h],showEmptyMessage:[2,"showEmptyMessage","showEmptyMessage",h],dropdownMode:"dropdownMode",multiple:[2,"multiple","multiple",h],addOnTab:[2,"addOnTab","addOnTab",h],tabindex:[2,"tabindex","tabindex",M],dataKey:"dataKey",emptyMessage:"emptyMessage",showTransitionOptions:"showTransitionOptions",hideTransitionOptions:"hideTransitionOptions",autofocus:[2,"autofocus","autofocus",h],autocomplete:"autocomplete",optionGroupChildren:"optionGroupChildren",optionGroupLabel:"optionGroupLabel",overlayOptions:"overlayOptions",suggestions:"suggestions",optionLabel:"optionLabel",optionValue:"optionValue",id:"id",searchMessage:"searchMessage",emptySelectionMessage:"emptySelectionMessage",selectionMessage:"selectionMessage",autoOptionFocus:[2,"autoOptionFocus","autoOptionFocus",h],selectOnFocus:[2,"selectOnFocus","selectOnFocus",h],searchLocale:[2,"searchLocale","searchLocale",h],optionDisabled:"optionDisabled",focusOnHover:[2,"focusOnHover","focusOnHover",h],typeahead:[2,"typeahead","typeahead",h],addOnBlur:[2,"addOnBlur","addOnBlur",h],separator:"separator",appendTo:[1,"appendTo"]},outputs:{completeMethod:"completeMethod",onSelect:"onSelect",onUnselect:"onUnselect",onAdd:"onAdd",onFocus:"onFocus",onBlur:"onBlur",onDropdownClick:"onDropdownClick",onClear:"onClear",onInputKeydown:"onInputKeydown",onKeyUp:"onKeyUp",onShow:"onShow",onHide:"onHide",onLazyLoad:"onLazyLoad"},features:[de([un,$e]),ae],decls:9,vars:12,consts:[["overlay",""],["content",""],["focusInput",""],["multiContainer",""],["focusInput","","multiIn",""],["token",""],["removeicon",""],["ddBtn",""],["buildInItems",""],["scroller",""],["loader",""],["items",""],["empty",""],["pInputText","","aria-autocomplete","list","role","combobox",3,"pAutoFocus","class","ngStyle","variant","invalid","pSize","fluid","input","keydown","change","focus","blur","paste","keyup",4,"ngIf"],[4,"ngIf"],["role","listbox",3,"class","tabindex","focus","blur","keydown",4,"ngIf"],["type","button","pRipple","",3,"class","disabled","click",4,"ngIf"],[3,"visibleChange","onAnimationStart","onHide","hostAttrSelector","visible","options","target","appendTo","showTransitionOptions","hideTransitionOptions"],["pInputText","","aria-autocomplete","list","role","combobox",3,"input","keydown","change","focus","blur","paste","keyup","pAutoFocus","ngStyle","variant","invalid","pSize","fluid"],["data-p-icon","times",3,"class","click",4,"ngIf"],[3,"class","click",4,"ngIf"],["data-p-icon","times",3,"click"],[3,"click"],[4,"ngTemplateOutlet"],["role","listbox",3,"focus","blur","keydown","tabindex"],["role","option",3,"class",4,"ngFor","ngForOf"],["role","option"],["role","combobox","aria-autocomplete","list",3,"input","keydown","change","focus","blur","paste","keyup","pAutoFocus","ngStyle"],[3,"onRemove","label","disabled","removable"],[4,"ngTemplateOutlet","ngTemplateOutletContext"],["data-p-icon","times-circle"],["data-p-icon","spinner",3,"class","spin",4,"ngIf"],[3,"class",4,"ngIf"],["data-p-icon","spinner",3,"spin"],["type","button","pRipple","",3,"click","disabled"],[3,"ngClass",4,"ngIf"],[3,"ngClass"],["data-p-icon","chevron-down",4,"ngIf"],["data-p-icon","chevron-down"],[3,"ngStyle"],[3,"items","style","itemSize","autoSize","lazy","options","onLazyLoad",4,"ngIf"],["role","status","aria-live","polite",1,"p-hidden-accessible"],[3,"onLazyLoad","items","itemSize","autoSize","lazy","options"],["role","listbox"],["ngFor","",3,"ngForOf"],["role","option",3,"class","ngStyle",4,"ngIf"],["role","option",3,"ngStyle"],["pRipple","","role","option",3,"click","mouseenter","ngStyle"],[4,"ngIf","ngIfElse"]],template:function(t,i){if(t&1){let o=C();c(0,ht,2,30,"input",13)(1,xt,3,2,"ng-container",14)(2,St,7,33,"ul",15)(3,At,3,2,"ng-container",14)(4,Qt,4,7,"button",16),m(5,"p-overlay",17,0),ue("visibleChange",function(x){return u(o),ce(i.overlayVisible,x)||(i.overlayVisible=x),d(x)}),w("onAnimationStart",function(x){return u(o),d(i.onOverlayAnimationStart(x))})("onHide",function(){return u(o),d(i.hide())}),c(7,pn,10,12,"ng-template",null,1,A),_()}t&2&&(r("ngIf",!i.multiple),s(),r("ngIf",i.$filled()&&!i.$disabled()&&i.showClear&&!i.loading),s(),r("ngIf",i.multiple),s(),r("ngIf",i.loading),s(),r("ngIf",i.dropdown),s(),r("hostAttrSelector",i.attrSelector),se("visible",i.overlayVisible),r("options",i.overlayOptions)("target","@parent")("appendTo",i.$appendTo())("showTransitionOptions",i.showTransitionOptions)("hideTransitionOptions",i.hideTransitionOptions))},dependencies:[be,_e,ge,fe,xe,ye,Ke,Fe,Ae,ze,Se,Me,Ee,Ve,Qe,Y,ke],encapsulation:2,changeDetection:0})}return n})(),Hn=(()=>{class n{static \u0275fac=function(t){return new(t||n)};static \u0275mod=le({type:n});static \u0275inj=ne({imports:[He,Y]})}return n})();export{He as a,Hn as b};
