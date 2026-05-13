import{c as ne,d as I,f as z,h as M,p as ie}from"./chunk-DBGMCAYY.js";import{ha as te,ia as v,ma as oe,pa as se,ra as ae}from"./chunk-7YDSM7V4.js";import{$b as $,$c as X,Ab as f,Ac as U,Bb as _,Hb as C,Ib as P,Kb as V,La as j,Mb as o,Mc as k,Nb as q,Ob as H,Pb as b,Qa as a,Rb as h,Sb as x,T as O,U as E,Vb as G,Y as F,Yc as W,Zb as d,_b as Y,bb as B,ca as D,cb as A,da as S,dd as Z,ea as Q,fb as L,hb as g,id as ee,jb as N,ma as R,mc as J,oc as T,pc as K,qa as y,sb as w,tb as l,ub as r,yb as c,zb as u}from"./chunk-C2KL4RQS.js";var ce=`
    .p-message {
        border-radius: dt('message.border.radius');
        outline-width: dt('message.border.width');
        outline-style: solid;
    }

    .p-message-content {
        display: flex;
        align-items: center;
        padding: dt('message.content.padding');
        gap: dt('message.content.gap');
        height: 100%;
    }

    .p-message-icon {
        flex-shrink: 0;
    }

    .p-message-close-button {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        margin-inline-start: auto;
        overflow: hidden;
        position: relative;
        width: dt('message.close.button.width');
        height: dt('message.close.button.height');
        border-radius: dt('message.close.button.border.radius');
        background: transparent;
        transition:
            background dt('message.transition.duration'),
            color dt('message.transition.duration'),
            outline-color dt('message.transition.duration'),
            box-shadow dt('message.transition.duration'),
            opacity 0.3s;
        outline-color: transparent;
        color: inherit;
        padding: 0;
        border: none;
        cursor: pointer;
        user-select: none;
    }

    .p-message-close-icon {
        font-size: dt('message.close.icon.size');
        width: dt('message.close.icon.size');
        height: dt('message.close.icon.size');
    }

    .p-message-close-button:focus-visible {
        outline-width: dt('message.close.button.focus.ring.width');
        outline-style: dt('message.close.button.focus.ring.style');
        outline-offset: dt('message.close.button.focus.ring.offset');
    }

    .p-message-info {
        background: dt('message.info.background');
        outline-color: dt('message.info.border.color');
        color: dt('message.info.color');
        box-shadow: dt('message.info.shadow');
    }

    .p-message-info .p-message-close-button:focus-visible {
        outline-color: dt('message.info.close.button.focus.ring.color');
        box-shadow: dt('message.info.close.button.focus.ring.shadow');
    }

    .p-message-info .p-message-close-button:hover {
        background: dt('message.info.close.button.hover.background');
    }

    .p-message-info.p-message-outlined {
        color: dt('message.info.outlined.color');
        outline-color: dt('message.info.outlined.border.color');
    }

    .p-message-info.p-message-simple {
        color: dt('message.info.simple.color');
    }

    .p-message-success {
        background: dt('message.success.background');
        outline-color: dt('message.success.border.color');
        color: dt('message.success.color');
        box-shadow: dt('message.success.shadow');
    }

    .p-message-success .p-message-close-button:focus-visible {
        outline-color: dt('message.success.close.button.focus.ring.color');
        box-shadow: dt('message.success.close.button.focus.ring.shadow');
    }

    .p-message-success .p-message-close-button:hover {
        background: dt('message.success.close.button.hover.background');
    }

    .p-message-success.p-message-outlined {
        color: dt('message.success.outlined.color');
        outline-color: dt('message.success.outlined.border.color');
    }

    .p-message-success.p-message-simple {
        color: dt('message.success.simple.color');
    }

    .p-message-warn {
        background: dt('message.warn.background');
        outline-color: dt('message.warn.border.color');
        color: dt('message.warn.color');
        box-shadow: dt('message.warn.shadow');
    }

    .p-message-warn .p-message-close-button:focus-visible {
        outline-color: dt('message.warn.close.button.focus.ring.color');
        box-shadow: dt('message.warn.close.button.focus.ring.shadow');
    }

    .p-message-warn .p-message-close-button:hover {
        background: dt('message.warn.close.button.hover.background');
    }

    .p-message-warn.p-message-outlined {
        color: dt('message.warn.outlined.color');
        outline-color: dt('message.warn.outlined.border.color');
    }

    .p-message-warn.p-message-simple {
        color: dt('message.warn.simple.color');
    }

    .p-message-error {
        background: dt('message.error.background');
        outline-color: dt('message.error.border.color');
        color: dt('message.error.color');
        box-shadow: dt('message.error.shadow');
    }

    .p-message-error .p-message-close-button:focus-visible {
        outline-color: dt('message.error.close.button.focus.ring.color');
        box-shadow: dt('message.error.close.button.focus.ring.shadow');
    }

    .p-message-error .p-message-close-button:hover {
        background: dt('message.error.close.button.hover.background');
    }

    .p-message-error.p-message-outlined {
        color: dt('message.error.outlined.color');
        outline-color: dt('message.error.outlined.border.color');
    }

    .p-message-error.p-message-simple {
        color: dt('message.error.simple.color');
    }

    .p-message-secondary {
        background: dt('message.secondary.background');
        outline-color: dt('message.secondary.border.color');
        color: dt('message.secondary.color');
        box-shadow: dt('message.secondary.shadow');
    }

    .p-message-secondary .p-message-close-button:focus-visible {
        outline-color: dt('message.secondary.close.button.focus.ring.color');
        box-shadow: dt('message.secondary.close.button.focus.ring.shadow');
    }

    .p-message-secondary .p-message-close-button:hover {
        background: dt('message.secondary.close.button.hover.background');
    }

    .p-message-secondary.p-message-outlined {
        color: dt('message.secondary.outlined.color');
        outline-color: dt('message.secondary.outlined.border.color');
    }

    .p-message-secondary.p-message-simple {
        color: dt('message.secondary.simple.color');
    }

    .p-message-contrast {
        background: dt('message.contrast.background');
        outline-color: dt('message.contrast.border.color');
        color: dt('message.contrast.color');
        box-shadow: dt('message.contrast.shadow');
    }

    .p-message-contrast .p-message-close-button:focus-visible {
        outline-color: dt('message.contrast.close.button.focus.ring.color');
        box-shadow: dt('message.contrast.close.button.focus.ring.shadow');
    }

    .p-message-contrast .p-message-close-button:hover {
        background: dt('message.contrast.close.button.hover.background');
    }

    .p-message-contrast.p-message-outlined {
        color: dt('message.contrast.outlined.color');
        outline-color: dt('message.contrast.outlined.border.color');
    }

    .p-message-contrast.p-message-simple {
        color: dt('message.contrast.simple.color');
    }

    .p-message-text {
        font-size: dt('message.text.font.size');
        font-weight: dt('message.text.font.weight');
    }

    .p-message-icon {
        font-size: dt('message.icon.size');
        width: dt('message.icon.size');
        height: dt('message.icon.size');
    }

    .p-message-enter-from {
        opacity: 0;
    }

    .p-message-enter-active {
        transition: opacity 0.3s;
    }

    .p-message.p-message-leave-from {
        max-height: 1000px;
    }

    .p-message.p-message-leave-to {
        max-height: 0;
        opacity: 0;
        margin: 0;
    }

    .p-message-leave-active {
        overflow: hidden;
        transition:
            max-height 0.45s cubic-bezier(0, 1, 0, 1),
            opacity 0.3s,
            margin 0.3s;
    }

    .p-message-leave-active .p-message-close-button {
        opacity: 0;
    }

    .p-message-sm .p-message-content {
        padding: dt('message.content.sm.padding');
    }

    .p-message-sm .p-message-text {
        font-size: dt('message.text.sm.font.size');
    }

    .p-message-sm .p-message-icon {
        font-size: dt('message.icon.sm.size');
        width: dt('message.icon.sm.size');
        height: dt('message.icon.sm.size');
    }

    .p-message-sm .p-message-close-icon {
        font-size: dt('message.close.icon.sm.size');
        width: dt('message.close.icon.sm.size');
        height: dt('message.close.icon.sm.size');
    }

    .p-message-lg .p-message-content {
        padding: dt('message.content.lg.padding');
    }

    .p-message-lg .p-message-text {
        font-size: dt('message.text.lg.font.size');
    }

    .p-message-lg .p-message-icon {
        font-size: dt('message.icon.lg.size');
        width: dt('message.icon.lg.size');
        height: dt('message.icon.lg.size');
    }

    .p-message-lg .p-message-close-icon {
        font-size: dt('message.close.icon.lg.size');
        width: dt('message.close.icon.lg.size');
        height: dt('message.close.icon.lg.size');
    }

    .p-message-outlined {
        background: transparent;
        outline-width: dt('message.outlined.border.width');
    }

    .p-message-simple {
        background: transparent;
        outline-color: transparent;
        box-shadow: none;
    }

    .p-message-simple .p-message-content {
        padding: dt('message.simple.content.padding');
    }

    .p-message-outlined .p-message-close-button:hover,
    .p-message-simple .p-message-close-button:hover {
        background: transparent;
    }
`;var re=["container"],me=["icon"],ge=["closeicon"],de=["*"],pe=(n,t)=>({showTransitionParams:n,hideTransitionParams:t}),ue=n=>({value:"visible()",params:n}),fe=n=>({closeCallback:n});function _e(n,t){n&1&&C(0)}function be(n,t){if(n&1&&g(0,_e,1,0,"ng-container",5),n&2){let e=o(2);c("ngTemplateOutlet",e.iconTemplate||e._iconTemplate)}}function he(n,t){if(n&1&&_(0,"i"),n&2){let e=o(2);d(e.cn(e.cx("icon"),e.icon))}}function xe(n,t){n&1&&C(0)}function Ce(n,t){if(n&1&&g(0,xe,1,0,"ng-container",6),n&2){let e=o(2);c("ngTemplateOutlet",e.containerTemplate||e._containerTemplate)("ngTemplateOutletContext",T(2,fe,e.closeCallback))}}function ve(n,t){if(n&1&&_(0,"span",10),n&2){let e=o(4);c("ngClass",e.cx("text"))("innerHTML",e.text,j)}}function ye(n,t){if(n&1&&(u(0,"div"),g(1,ve,1,2,"span",9),f()),n&2){let e=o(3);a(),c("ngIf",!e.escape)}}function we(n,t){if(n&1&&(u(0,"span",8),Y(1),f()),n&2){let e=o(4);c("ngClass",e.cx("text")),a(),$(e.text)}}function Te(n,t){if(n&1&&g(0,we,2,2,"span",11),n&2){let e=o(3);c("ngIf",e.escape&&e.text)}}function ke(n,t){if(n&1&&(g(0,ye,2,1,"div",7)(1,Te,1,1,"ng-template",null,0,U),u(3,"span",8),H(4),f()),n&2){let e=G(2),s=o(2);c("ngIf",!s.escape)("ngIfElse",e),a(3),c("ngClass",s.cx("text"))}}function Ie(n,t){if(n&1&&_(0,"i",8),n&2){let e=o(3);d(e.cn(e.cx("closeIcon"),e.closeIcon)),c("ngClass",e.closeIcon)}}function ze(n,t){n&1&&C(0)}function Me(n,t){if(n&1&&g(0,ze,1,0,"ng-container",5),n&2){let e=o(3);c("ngTemplateOutlet",e.closeIconTemplate||e._closeIconTemplate)}}function Oe(n,t){if(n&1&&(Q(),_(0,"svg",15)),n&2){let e=o(3);d(e.cx("closeIcon"))}}function Ee(n,t){if(n&1){let e=P();u(0,"button",12),V("click",function(i){D(e);let p=o(2);return S(p.close(i))}),l(1,Ie,1,3,"i",13),l(2,Me,1,1,"ng-container"),l(3,Oe,1,2,":svg:svg",14),f()}if(n&2){let e=o(2);d(e.cx("closeButton")),w("aria-label",e.closeAriaLabel),a(),r(e.closeIcon?1:-1),a(),r(e.closeIconTemplate||e._closeIconTemplate?2:-1),a(),r(!e.closeIconTemplate&&!e._closeIconTemplate&&!e.closeIcon?3:-1)}}function Fe(n,t){if(n&1&&(u(0,"div",2)(1,"div"),l(2,be,1,1,"ng-container"),l(3,he,1,2,"i",3),l(4,Ce,1,4,"ng-container")(5,ke,5,3),l(6,Ee,4,6,"button",4),f()()),n&2){let e=o();d(e.cn(e.cx("root"),e.styleClass)),c("@messageAnimation",T(14,ue,K(11,pe,e.showTransitionOptions,e.hideTransitionOptions))),w("aria-live","polite")("role","alert"),a(),d(e.cx("content")),a(),r(e.iconTemplate||e._iconTemplate?2:-1),a(),r(e.icon?3:-1),a(),r(e.containerTemplate||e._containerTemplate?4:5),a(2),r(e.closable?6:-1)}}var De={root:({instance:n})=>["p-message p-component p-message-"+n.severity,"p-message-"+n.variant,{"p-message-sm":n.size==="small","p-message-lg":n.size==="large"}],content:"p-message-content",icon:"p-message-icon",text:"p-message-text",closeButton:"p-message-close-button",closeIcon:"p-message-close-icon"},le=(()=>{class n extends oe{name="message";theme=ce;classes=De;static \u0275fac=(()=>{let e;return function(i){return(e||(e=y(n)))(i||n)}})();static \u0275prov=O({token:n,factory:n.\u0275fac})}return n})();var Se=(()=>{class n extends se{severity="info";text;escape=!0;style;styleClass;closable=!1;icon;closeIcon;life;showTransitionOptions="300ms ease-out";hideTransitionOptions="200ms cubic-bezier(0.86, 0, 0.07, 1)";size;variant;onClose=new N;get closeAriaLabel(){return this.config.translation.aria?this.config.translation.aria.close:void 0}visible=R(!0);_componentStyle=F(le);containerTemplate;iconTemplate;closeIconTemplate;templates;_containerTemplate;_iconTemplate;_closeIconTemplate;closeCallback=e=>{this.close(e)};ngOnInit(){super.ngOnInit(),this.life&&setTimeout(()=>{this.visible.set(!1)},this.life)}ngAfterContentInit(){this.templates?.forEach(e=>{switch(e.getType()){case"container":this._containerTemplate=e.template;break;case"icon":this._iconTemplate=e.template;break;case"closeicon":this._closeIconTemplate=e.template;break}})}close(e){this.visible.set(!1),this.onClose.emit({originalEvent:e})}static \u0275fac=(()=>{let e;return function(i){return(e||(e=y(n)))(i||n)}})();static \u0275cmp=B({type:n,selectors:[["p-message"]],contentQueries:function(s,i,p){if(s&1&&(b(p,re,4),b(p,me,4),b(p,ge,4),b(p,te,4)),s&2){let m;h(m=x())&&(i.containerTemplate=m.first),h(m=x())&&(i.iconTemplate=m.first),h(m=x())&&(i.closeIconTemplate=m.first),h(m=x())&&(i.templates=m)}},inputs:{severity:"severity",text:"text",escape:[2,"escape","escape",k],style:"style",styleClass:"styleClass",closable:[2,"closable","closable",k],icon:"icon",closeIcon:"closeIcon",life:"life",showTransitionOptions:"showTransitionOptions",hideTransitionOptions:"hideTransitionOptions",size:"size",variant:"variant"},outputs:{onClose:"onClose"},features:[J([le]),L],ngContentSelectors:de,decls:1,vars:1,consts:[["escapeOut",""],[1,"p-message","p-component",3,"class"],[1,"p-message","p-component"],[3,"class"],["pRipple","","type","button",3,"class"],[4,"ngTemplateOutlet"],[4,"ngTemplateOutlet","ngTemplateOutletContext"],[4,"ngIf","ngIfElse"],[3,"ngClass"],[3,"ngClass","innerHTML",4,"ngIf"],[3,"ngClass","innerHTML"],[3,"ngClass",4,"ngIf"],["pRipple","","type","button",3,"click"],[3,"class","ngClass"],["data-p-icon","times",3,"class"],["data-p-icon","times"]],template:function(s,i){s&1&&(q(),l(0,Fe,7,16,"div",1)),s&2&&r(i.visible()?0:-1)},dependencies:[ee,W,X,Z,ie,ae,v],encapsulation:2,data:{animation:[ne("messageAnimation",[M(":enter",[z({opacity:0,transform:"translateY(-25%)"}),I("{{showTransitionParams}}")]),M(":leave",[I("{{hideTransitionParams}}",z({height:0,marginTop:0,marginBottom:0,marginLeft:0,marginRight:0,opacity:0}))])])]},changeDetection:0})}return n})(),nn=(()=>{class n{static \u0275fac=function(s){return new(s||n)};static \u0275mod=A({type:n});static \u0275inj=E({imports:[Se,v,v]})}return n})();export{Se as a,nn as b};
