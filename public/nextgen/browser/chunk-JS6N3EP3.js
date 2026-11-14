import{a as ie}from"./chunk-SOVMQVX6.js";import{da as Y,ea as x,fa as Z,ia as ee,la as ne,ma as te,na as v}from"./chunk-RP2SIKJL.js";import{$ as y,Eb as c,Fb as _,Gb as g,Gc as G,Hb as R,Lb as w,Mb as T,Ob as h,Pa as D,Qb as u,Sb as r,Ta as p,Tb as Q,Tc as V,Ub as K,Vb as k,W as M,X as S,Xb as E,Ya as I,Yb as B,Z as P,ac as L,bc as O,ec as d,ed as U,fc as H,ga as s,gc as $,ha as l,hd as J,ia as A,ib as N,jb as j,jd as W,mb as F,nb as z,ob as m,pd as X,tc as q,ua as C,wb as f}from"./chunk-4S52IWZL.js";var oe=`
    .p-chip {
        display: inline-flex;
        align-items: center;
        background: dt('chip.background');
        color: dt('chip.color');
        border-radius: dt('chip.border.radius');
        padding-block: dt('chip.padding.y');
        padding-inline: dt('chip.padding.x');
        gap: dt('chip.gap');
    }

    .p-chip-icon {
        color: dt('chip.icon.color');
        font-size: dt('chip.icon.font.size');
        width: dt('chip.icon.size');
        height: dt('chip.icon.size');
    }

    .p-chip-image {
        border-radius: 50%;
        width: dt('chip.image.width');
        height: dt('chip.image.height');
        margin-inline-start: calc(-1 * dt('chip.padding.y'));
    }

    .p-chip:has(.p-chip-remove-icon) {
        padding-inline-end: dt('chip.padding.y');
    }

    .p-chip:has(.p-chip-image) {
        padding-block-start: calc(dt('chip.padding.y') / 2);
        padding-block-end: calc(dt('chip.padding.y') / 2);
    }

    .p-chip-remove-icon {
        cursor: pointer;
        font-size: dt('chip.remove.icon.size');
        width: dt('chip.remove.icon.size');
        height: dt('chip.remove.icon.size');
        color: dt('chip.remove.icon.color');
        border-radius: 50%;
        transition:
            outline-color dt('chip.transition.duration'),
            box-shadow dt('chip.transition.duration');
        outline-color: transparent;
    }

    .p-chip-remove-icon:focus-visible {
        box-shadow: dt('chip.remove.icon.focus.ring.shadow');
        outline: dt('chip.remove.icon.focus.ring.width') dt('chip.remove.icon.focus.ring.style') dt('chip.remove.icon.focus.ring.color');
        outline-offset: dt('chip.remove.icon.focus.ring.offset');
    }
`;var ae=["removeicon"],pe=["*"];function se(n,a){if(n&1){let e=h();_(0,"img",4),u("error",function(i){s(e);let o=r();return l(o.imageError(i))}),g()}if(n&2){let e=r();d(e.cx("image")),c("pBind",e.ptm("image"))("src",e.image,D)("alt",e.alt)}}function le(n,a){if(n&1&&R(0,"span",6),n&2){let e=r(2);d(e.icon),c("pBind",e.ptm("icon"))("ngClass",e.cx("icon"))}}function de(n,a){if(n&1&&m(0,le,1,4,"span",5),n&2){let e=r();c("ngIf",e.icon)}}function me(n,a){if(n&1&&(_(0,"div",7),H(1),g()),n&2){let e=r();d(e.cx("label")),c("pBind",e.ptm("label")),p(),$(e.label)}}function _e(n,a){if(n&1){let e=h();_(0,"span",11),u("click",function(i){s(e);let o=r(3);return l(o.close(i))})("keydown",function(i){s(e);let o=r(3);return l(o.onKeydown(i))}),g()}if(n&2){let e=r(3);d(e.removeIcon),c("pBind",e.ptm("removeIcon"))("ngClass",e.cx("removeIcon")),f("tabindex",e.disabled?-1:0)("aria-label",e.removeAriaLabel)}}function ge(n,a){if(n&1){let e=h();A(),_(0,"svg",12),u("click",function(i){s(e);let o=r(3);return l(o.close(i))})("keydown",function(i){s(e);let o=r(3);return l(o.onKeydown(i))}),g()}if(n&2){let e=r(3);d(e.cx("removeIcon")),c("pBind",e.ptm("removeIcon")),f("tabindex",e.disabled?-1:0)("aria-label",e.removeAriaLabel)}}function fe(n,a){if(n&1&&(w(0),m(1,_e,1,6,"span",9)(2,ge,1,5,"svg",10),T()),n&2){let e=r(2);p(),c("ngIf",e.removeIcon),p(),c("ngIf",!e.removeIcon)}}function he(n,a){}function ue(n,a){n&1&&m(0,he,0,0,"ng-template")}function ve(n,a){if(n&1){let e=h();_(0,"span",13),u("click",function(i){s(e);let o=r(2);return l(o.close(i))})("keydown",function(i){s(e);let o=r(2);return l(o.onKeydown(i))}),m(1,ue,1,0,null,14),g()}if(n&2){let e=r(2);d(e.cx("removeIcon")),c("pBind",e.ptm("removeIcon")),f("tabindex",e.disabled?-1:0)("aria-label",e.removeAriaLabel),p(),c("ngTemplateOutlet",e.removeIconTemplate||e._removeIconTemplate)}}function be(n,a){if(n&1&&(w(0),m(1,fe,3,2,"ng-container",3)(2,ve,2,6,"span",8),T()),n&2){let e=r();p(),c("ngIf",!e.removeIconTemplate&&!e._removeIconTemplate),p(),c("ngIf",e.removeIconTemplate||e._removeIconTemplate)}}var ye={root:({instance:n})=>["p-chip p-component",{"p-disabled":n.disabled}],image:"p-chip-image",icon:"p-chip-icon",label:"p-chip-label",removeIcon:"p-chip-remove-icon"},re=(()=>{class n extends ee{name="chip";style=oe;classes=ye;static \u0275fac=(()=>{let e;return function(i){return(e||(e=C(n)))(i||n)}})();static \u0275prov=M({token:n,factory:n.\u0275fac})}return n})();var ce=new P("CHIP_INSTANCE"),xe=(()=>{class n extends te{$pcChip=y(ce,{optional:!0,skipSelf:!0})??void 0;bindDirectiveInstance=y(v,{self:!0});onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]))}label;icon;image;alt;styleClass;disabled=!1;removable=!1;removeIcon;onRemove=new I;onImageError=new I;visible=!0;get removeAriaLabel(){return this.config.getTranslation(Z.ARIA).removeLabel}get chipProps(){return this._chipProps}set chipProps(e){this._chipProps=e,e&&typeof e=="object"&&Object.entries(e).forEach(([t,i])=>this[`_${t}`]!==i&&(this[`_${t}`]=i))}_chipProps;_componentStyle=y(re);removeIconTemplate;templates;_removeIconTemplate;onAfterContentInit(){this.templates.forEach(e=>{e.getType()==="removeicon"?this._removeIconTemplate=e.template:this._removeIconTemplate=e.template})}onChanges(e){if(e.chipProps&&e.chipProps.currentValue){let{currentValue:t}=e.chipProps;t.label!==void 0&&(this.label=t.label),t.icon!==void 0&&(this.icon=t.icon),t.image!==void 0&&(this.image=t.image),t.alt!==void 0&&(this.alt=t.alt),t.styleClass!==void 0&&(this.styleClass=t.styleClass),t.removable!==void 0&&(this.removable=t.removable),t.removeIcon!==void 0&&(this.removeIcon=t.removeIcon)}}close(e){this.visible=!1,this.onRemove.emit(e)}onKeydown(e){(e.key==="Enter"||e.key==="Backspace")&&this.close(e)}imageError(e){this.onImageError.emit(e)}static \u0275fac=(()=>{let e;return function(i){return(e||(e=C(n)))(i||n)}})();static \u0275cmp=N({type:n,selectors:[["p-chip"]],contentQueries:function(t,i,o){if(t&1&&(k(o,ae,4),k(o,Y,4)),t&2){let b;E(b=B())&&(i.removeIconTemplate=b.first),E(b=B())&&(i.templates=b)}},hostVars:5,hostBindings:function(t,i){t&2&&(f("aria-label",i.label),d(i.cn(i.cx("root"),i.styleClass)),O("display",!i.visible&&"none"))},inputs:{label:"label",icon:"icon",image:"image",alt:"alt",styleClass:"styleClass",disabled:[2,"disabled","disabled",V],removable:[2,"removable","removable",V],removeIcon:"removeIcon",chipProps:"chipProps"},outputs:{onRemove:"onRemove",onImageError:"onImageError"},features:[q([re,{provide:ce,useExisting:n},{provide:ne,useExisting:n}]),z([v]),F],ngContentSelectors:pe,decls:6,vars:4,consts:[["iconTemplate",""],[3,"pBind","class","src","alt","error",4,"ngIf","ngIfElse"],[3,"pBind","class",4,"ngIf"],[4,"ngIf"],[3,"error","pBind","src","alt"],[3,"pBind","class","ngClass",4,"ngIf"],[3,"pBind","ngClass"],[3,"pBind"],["role","button",3,"pBind","class","click","keydown",4,"ngIf"],["role","button",3,"pBind","class","ngClass","click","keydown",4,"ngIf"],["data-p-icon","times-circle","role","button",3,"pBind","class","click","keydown",4,"ngIf"],["role","button",3,"click","keydown","pBind","ngClass"],["data-p-icon","times-circle","role","button",3,"click","keydown","pBind"],["role","button",3,"click","keydown","pBind"],[4,"ngTemplateOutlet"]],template:function(t,i){if(t&1&&(Q(),K(0),m(1,se,1,5,"img",1)(2,de,1,1,"ng-template",null,0,G)(4,me,2,4,"div",2)(5,be,3,2,"ng-container",3)),t&2){let o=L(3);p(),c("ngIf",i.image)("ngIfElse",o),p(3),c("ngIf",i.label),p(),c("ngIf",i.removable)}},dependencies:[X,U,J,W,ie,x,v],encapsulation:2,changeDetection:0})}return n})(),Oe=(()=>{class n{static \u0275fac=function(t){return new(t||n)};static \u0275mod=j({type:n});static \u0275inj=S({imports:[xe,x,x]})}return n})();export{xe as a,Oe as b};
