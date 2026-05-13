import{c as ee}from"./chunk-JXIGLDRY.js";import{ha as W,ia as b,ja as X,ma as Y,pa as Z}from"./chunk-43D2A2M3.js";import{$b as L,Ab as h,Bb as O,Fb as C,Gb as I,Ib as f,Kb as u,Lc as V,Ma as F,Mb as r,Nb as R,Ob as B,Pb as w,Qa as s,Rb as T,Sb as k,T as E,U as M,Vb as N,Wb as Q,Xc as G,Y as P,Zb as m,_b as K,_c as H,bb as j,ca as l,cb as z,cd as U,da as p,ea as S,fb as A,hb as d,hd as J,jb as x,lc as q,pa as D,qa as y,sb as _,yb as c,zb as g,zc as $}from"./chunk-Z36KDTBG.js";var ne=`
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
`;var ie=["removeicon"],oe=["*"];function re(n,a){if(n&1){let e=f();g(0,"img",4),u("error",function(i){l(e);let o=r();return p(o.imageError(i))}),h()}if(n&2){let e=r();m(e.cx("image")),c("src",e.image,F)("alt",e.alt)}}function ce(n,a){if(n&1&&O(0,"span",6),n&2){let e=r(2);m(e.icon),c("ngClass",e.cx("icon")),_("data-pc-section","icon")}}function ae(n,a){if(n&1&&d(0,ce,1,4,"span",5),n&2){let e=r();c("ngIf",e.icon)}}function se(n,a){if(n&1&&(g(0,"div"),K(1),h()),n&2){let e=r();m(e.cx("label")),_("data-pc-section","label"),s(),L(e.label)}}function le(n,a){if(n&1){let e=f();g(0,"span",10),u("click",function(i){l(e);let o=r(3);return p(o.close(i))})("keydown",function(i){l(e);let o=r(3);return p(o.onKeydown(i))}),h()}if(n&2){let e=r(3);m(e.removeIcon),c("ngClass",e.cx("removeIcon")),_("data-pc-section","removeicon")("tabindex",e.disabled?-1:0)("aria-label",e.removeAriaLabel)}}function pe(n,a){if(n&1){let e=f();S(),g(0,"svg",11),u("click",function(i){l(e);let o=r(3);return p(o.close(i))})("keydown",function(i){l(e);let o=r(3);return p(o.onKeydown(i))}),h()}if(n&2){let e=r(3);m(e.cx("removeIcon")),_("data-pc-section","removeicon")("tabindex",e.disabled?-1:0)("aria-label",e.removeAriaLabel)}}function me(n,a){if(n&1&&(C(0),d(1,le,1,6,"span",8)(2,pe,1,5,"svg",9),I()),n&2){let e=r(2);s(),c("ngIf",e.removeIcon),s(),c("ngIf",!e.removeIcon)}}function de(n,a){}function _e(n,a){n&1&&d(0,de,0,0,"ng-template")}function ge(n,a){if(n&1){let e=f();g(0,"span",12),u("click",function(i){l(e);let o=r(2);return p(o.close(i))})("keydown",function(i){l(e);let o=r(2);return p(o.onKeydown(i))}),d(1,_e,1,0,null,13),h()}if(n&2){let e=r(2);m(e.cx("removeIcon")),_("tabindex",e.disabled?-1:0)("data-pc-section","removeicon")("aria-label",e.removeAriaLabel),s(),c("ngTemplateOutlet",e.removeIconTemplate||e._removeIconTemplate)}}function he(n,a){if(n&1&&(C(0),d(1,me,3,2,"ng-container",3)(2,ge,2,6,"span",7),I()),n&2){let e=r();s(),c("ngIf",!e.removeIconTemplate&&!e._removeIconTemplate),s(),c("ngIf",e.removeIconTemplate||e._removeIconTemplate)}}var fe={root:({instance:n})=>["p-chip p-component",{"p-disabled":n.disabled}],image:"p-chip-image",icon:"p-chip-icon",label:"p-chip-label",removeIcon:"p-chip-remove-icon"},te=(()=>{class n extends Y{name="chip";theme=ne;classes=fe;static \u0275fac=(()=>{let e;return function(i){return(e||(e=y(n)))(i||n)}})();static \u0275prov=E({token:n,factory:n.\u0275fac})}return n})();var ue=(()=>{class n extends Z{label;icon;image;alt;styleClass;disabled=!1;removable=!1;removeIcon;onRemove=new x;onImageError=new x;visible=!0;get removeAriaLabel(){return this.config.getTranslation(X.ARIA).removeLabel}get chipProps(){return this._chipProps}set chipProps(e){this._chipProps=e,e&&typeof e=="object"&&Object.entries(e).forEach(([t,i])=>this[`_${t}`]!==i&&(this[`_${t}`]=i))}_chipProps;_componentStyle=P(te);removeIconTemplate;templates;_removeIconTemplate;ngAfterContentInit(){this.templates.forEach(e=>{switch(e.getType()){case"removeicon":this._removeIconTemplate=e.template;break;default:this._removeIconTemplate=e.template;break}})}ngOnChanges(e){if(super.ngOnChanges(e),e.chipProps&&e.chipProps.currentValue){let{currentValue:t}=e.chipProps;t.label!==void 0&&(this.label=t.label),t.icon!==void 0&&(this.icon=t.icon),t.image!==void 0&&(this.image=t.image),t.alt!==void 0&&(this.alt=t.alt),t.styleClass!==void 0&&(this.styleClass=t.styleClass),t.removable!==void 0&&(this.removable=t.removable),t.removeIcon!==void 0&&(this.removeIcon=t.removeIcon)}}close(e){this.visible=!1,this.onRemove.emit(e)}onKeydown(e){(e.key==="Enter"||e.key==="Backspace")&&this.close(e)}imageError(e){this.onImageError.emit(e)}static \u0275fac=(()=>{let e;return function(i){return(e||(e=y(n)))(i||n)}})();static \u0275cmp=j({type:n,selectors:[["p-chip"]],contentQueries:function(t,i,o){if(t&1&&(w(o,ie,4),w(o,W,4)),t&2){let v;T(v=k())&&(i.removeIconTemplate=v.first),T(v=k())&&(i.templates=v)}},hostVars:7,hostBindings:function(t,i){t&2&&(_("data-pc-name","chip")("aria-label",i.label)("data-pc-section","root"),m(i.cn(i.cx("root"),i.styleClass)),Q("display",!i.visible&&"none"))},inputs:{label:"label",icon:"icon",image:"image",alt:"alt",styleClass:"styleClass",disabled:[2,"disabled","disabled",V],removable:[2,"removable","removable",V],removeIcon:"removeIcon",chipProps:"chipProps"},outputs:{onRemove:"onRemove",onImageError:"onImageError"},features:[q([te]),A,D],ngContentSelectors:oe,decls:6,vars:4,consts:[["iconTemplate",""],[3,"class","src","alt","error",4,"ngIf","ngIfElse"],[3,"class",4,"ngIf"],[4,"ngIf"],[3,"error","src","alt"],[3,"class","ngClass",4,"ngIf"],[3,"ngClass"],["role","button",3,"class","click","keydown",4,"ngIf"],["role","button",3,"class","ngClass","click","keydown",4,"ngIf"],["data-p-icon","times-circle","role","button",3,"class","click","keydown",4,"ngIf"],["role","button",3,"click","keydown","ngClass"],["data-p-icon","times-circle","role","button",3,"click","keydown"],["role","button",3,"click","keydown"],[4,"ngTemplateOutlet"]],template:function(t,i){if(t&1&&(R(),B(0),d(1,re,1,4,"img",1)(2,ae,1,1,"ng-template",null,0,$)(4,se,2,4,"div",2)(5,he,3,2,"ng-container",3)),t&2){let o=N(3);s(),c("ngIf",i.image)("ngIfElse",o),s(3),c("ngIf",i.label),s(),c("ngIf",i.removable)}},dependencies:[J,G,H,U,ee,b],encapsulation:2,changeDetection:0})}return n})(),Oe=(()=>{class n{static \u0275fac=function(t){return new(t||n)};static \u0275mod=z({type:n});static \u0275inj=M({imports:[ue,b,b]})}return n})();export{ue as a,Oe as b};
