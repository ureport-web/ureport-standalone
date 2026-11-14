import{c as se,d as M,f as B,h as E,p as le}from"./chunk-QHAX2N6X.js";import{Aa as me,da as ie,ea as T,ia as ae,la as ce,ma as re,na as C}from"./chunk-RP2SIKJL.js";import{$ as v,Ab as l,Eb as o,Fb as u,Gb as f,Gc as Z,Hb as _,Nb as y,Oa as R,Ob as q,Qb as G,Sb as s,Ta as c,Tb as $,Tc as z,Ub as Y,Vb as b,W as O,X as S,Xb as h,Ya as j,Yb as x,Z as A,ac as J,ec as g,ed as ee,fc as K,ga as D,gc as U,ha as F,hd as ne,ia as N,ib as P,jb as L,jd as te,mb as V,nb as H,ob as d,pd as oe,qa as Q,tc as W,ua as w,vc as k,wb as I,wc as X,zb as r}from"./chunk-4S52IWZL.js";var de=`
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
`;var ue=["container"],fe=["icon"],_e=["closeicon"],be=["*"],he=(n,t)=>({showTransitionParams:n,hideTransitionParams:t}),xe=n=>({value:"visible()",params:n}),Ce=n=>({closeCallback:n});function ve(n,t){n&1&&y(0)}function ye(n,t){if(n&1&&d(0,ve,1,0,"ng-container",4),n&2){let e=s(2);o("ngTemplateOutlet",e.iconTemplate||e._iconTemplate)}}function Te(n,t){if(n&1&&_(0,"i",2),n&2){let e=s(2);g(e.cn(e.cx("icon"),e.icon)),o("pBind",e.ptm("icon"))}}function we(n,t){n&1&&y(0)}function Ie(n,t){if(n&1&&d(0,we,1,0,"ng-container",5),n&2){let e=s(2);o("ngTemplateOutlet",e.containerTemplate||e._containerTemplate)("ngTemplateOutletContext",k(2,Ce,e.closeCallback))}}function ke(n,t){if(n&1&&_(0,"span",9),n&2){let e=s(4);o("pBind",e.ptm("text"))("ngClass",e.cx("text"))("innerHTML",e.text,R)}}function ze(n,t){if(n&1&&(u(0,"div"),d(1,ke,1,3,"span",8),f()),n&2){let e=s(3);c(),o("ngIf",!e.escape)}}function Me(n,t){if(n&1&&(u(0,"span",7),K(1),f()),n&2){let e=s(4);o("pBind",e.ptm("text"))("ngClass",e.cx("text")),c(),U(e.text)}}function Be(n,t){if(n&1&&d(0,Me,2,3,"span",10),n&2){let e=s(3);o("ngIf",e.escape&&e.text)}}function Ee(n,t){if(n&1&&(d(0,ze,2,1,"div",6)(1,Be,1,1,"ng-template",null,0,Z),u(3,"span",7),Y(4),f()),n&2){let e=J(2),i=s(2);o("ngIf",!i.escape)("ngIfElse",e),c(3),o("pBind",i.ptm("text"))("ngClass",i.cx("text"))}}function Oe(n,t){if(n&1&&_(0,"i",7),n&2){let e=s(3);g(e.cn(e.cx("closeIcon"),e.closeIcon)),o("pBind",e.ptm("closeIcon"))("ngClass",e.closeIcon)}}function Se(n,t){n&1&&y(0)}function Ae(n,t){if(n&1&&d(0,Se,1,0,"ng-container",4),n&2){let e=s(3);o("ngTemplateOutlet",e.closeIconTemplate||e._closeIconTemplate)}}function De(n,t){if(n&1&&(N(),_(0,"svg",14)),n&2){let e=s(3);g(e.cx("closeIcon")),o("pBind",e.ptm("closeIcon"))}}function Fe(n,t){if(n&1){let e=q();u(0,"button",11),G("click",function(a){D(e);let p=s(2);return F(p.close(a))}),r(1,Oe,1,4,"i",12),r(2,Ae,1,1,"ng-container"),r(3,De,1,3,":svg:svg",13),f()}if(n&2){let e=s(2);g(e.cx("closeButton")),o("pBind",e.ptm("closeButton")),I("aria-label",e.closeAriaLabel),c(),l(e.closeIcon?1:-1),c(),l(e.closeIconTemplate||e._closeIconTemplate?2:-1),c(),l(!e.closeIconTemplate&&!e._closeIconTemplate&&!e.closeIcon?3:-1)}}function Ne(n,t){if(n&1&&(u(0,"div",2)(1,"div",2),r(2,ye,1,1,"ng-container"),r(3,Te,1,3,"i",1),r(4,Ie,1,4,"ng-container")(5,Ee,5,4),r(6,Fe,4,7,"button",3),f()()),n&2){let e=s();g(e.cn(e.cx("root"),e.styleClass)),o("pBind",e.ptm("root"))("@messageAnimation",k(16,xe,X(13,he,e.showTransitionOptions,e.hideTransitionOptions))),I("aria-live","polite")("role","alert"),c(),g(e.cx("content")),o("pBind",e.ptm("content")),c(),l(e.iconTemplate||e._iconTemplate?2:-1),c(),l(e.icon?3:-1),c(),l(e.containerTemplate||e._containerTemplate?4:5),c(2),l(e.closable?6:-1)}}var Qe={root:({instance:n})=>["p-message p-component p-message-"+n.severity,"p-message-"+n.variant,{"p-message-sm":n.size==="small","p-message-lg":n.size==="large"}],content:"p-message-content",icon:"p-message-icon",text:"p-message-text",closeButton:"p-message-close-button",closeIcon:"p-message-close-icon"},ge=(()=>{class n extends ae{name="message";style=de;classes=Qe;static \u0275fac=(()=>{let e;return function(a){return(e||(e=w(n)))(a||n)}})();static \u0275prov=O({token:n,factory:n.\u0275fac})}return n})();var pe=new A("MESSAGE_INSTANCE"),Re=(()=>{class n extends re{_componentStyle=v(ge);bindDirectiveInstance=v(C,{self:!0});$pcMessage=v(pe,{optional:!0,skipSelf:!0})??void 0;onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptm("host"))}severity="info";text;escape=!0;style;styleClass;closable=!1;icon;closeIcon;life;showTransitionOptions="300ms ease-out";hideTransitionOptions="200ms cubic-bezier(0.86, 0, 0.07, 1)";size;variant;onClose=new j;get closeAriaLabel(){return this.config.translation.aria?this.config.translation.aria.close:void 0}visible=Q(!0);containerTemplate;iconTemplate;closeIconTemplate;templates;_containerTemplate;_iconTemplate;_closeIconTemplate;closeCallback=e=>{this.close(e)};onInit(){this.life&&setTimeout(()=>{this.visible.set(!1)},this.life)}onAfterContentInit(){this.templates?.forEach(e=>{switch(e.getType()){case"container":this._containerTemplate=e.template;break;case"icon":this._iconTemplate=e.template;break;case"closeicon":this._closeIconTemplate=e.template;break}})}close(e){this.visible.set(!1),this.onClose.emit({originalEvent:e})}static \u0275fac=(()=>{let e;return function(a){return(e||(e=w(n)))(a||n)}})();static \u0275cmp=P({type:n,selectors:[["p-message"]],contentQueries:function(i,a,p){if(i&1&&(b(p,ue,4),b(p,fe,4),b(p,_e,4),b(p,ie,4)),i&2){let m;h(m=x())&&(a.containerTemplate=m.first),h(m=x())&&(a.iconTemplate=m.first),h(m=x())&&(a.closeIconTemplate=m.first),h(m=x())&&(a.templates=m)}},inputs:{severity:"severity",text:"text",escape:[2,"escape","escape",z],style:"style",styleClass:"styleClass",closable:[2,"closable","closable",z],icon:"icon",closeIcon:"closeIcon",life:"life",showTransitionOptions:"showTransitionOptions",hideTransitionOptions:"hideTransitionOptions",size:"size",variant:"variant"},outputs:{onClose:"onClose"},features:[W([ge,{provide:pe,useExisting:n},{provide:ce,useExisting:n}]),H([C]),V],ngContentSelectors:be,decls:1,vars:1,consts:[["escapeOut",""],[3,"pBind","class"],[3,"pBind"],["pRipple","","type","button",3,"pBind","class"],[4,"ngTemplateOutlet"],[4,"ngTemplateOutlet","ngTemplateOutletContext"],[4,"ngIf","ngIfElse"],[3,"pBind","ngClass"],[3,"pBind","ngClass","innerHTML",4,"ngIf"],[3,"pBind","ngClass","innerHTML"],[3,"pBind","ngClass",4,"ngIf"],["pRipple","","type","button",3,"click","pBind"],[3,"pBind","class","ngClass"],["data-p-icon","times",3,"pBind","class"],["data-p-icon","times",3,"pBind"]],template:function(i,a){i&1&&($(),r(0,Ne,7,18,"div",1)),i&2&&l(a.visible()?0:-1)},dependencies:[oe,ee,ne,te,le,me,T,C],encapsulation:2,data:{animation:[se("messageAnimation",[E(":enter",[B({opacity:0,transform:"translateY(-25%)"}),M("{{showTransitionParams}}")]),E(":leave",[M("{{hideTransitionParams}}",B({height:0,marginTop:0,marginBottom:0,marginLeft:0,marginRight:0,opacity:0}))])])]},changeDetection:0})}return n})(),ln=(()=>{class n{static \u0275fac=function(i){return new(i||n)};static \u0275mod=L({type:n});static \u0275inj=S({imports:[Re,T,T]})}return n})();export{Re as a,ln as b};
