import{da as z,ea as u,ia as q,la as G,ma as H,na as o}from"./chunk-RP2SIKJL.js";import{$ as p,Eb as r,Fb as f,Gb as v,Hb as P,Nb as D,Sb as d,Ta as a,Tc as R,Uc as V,Vb as y,W as k,X as T,Xb as h,Yb as _,Z as x,bc as c,ec as s,fc as E,hd as j,ib as w,ic as A,jb as B,jd as O,mb as I,nb as S,ob as b,pd as Q,tc as F,ua as g,vc as N,wb as M}from"./chunk-4S52IWZL.js";var $=`
    .p-progressbar {
        display: block;
        position: relative;
        overflow: hidden;
        height: dt('progressbar.height');
        background: dt('progressbar.background');
        border-radius: dt('progressbar.border.radius');
    }

    .p-progressbar-value {
        margin: 0;
        background: dt('progressbar.value.background');
    }

    .p-progressbar-label {
        color: dt('progressbar.label.color');
        font-size: dt('progressbar.label.font.size');
        font-weight: dt('progressbar.label.font.weight');
    }

    .p-progressbar-determinate .p-progressbar-value {
        height: 100%;
        width: 0%;
        position: absolute;
        display: none;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        transition: width 1s ease-in-out;
    }

    .p-progressbar-determinate .p-progressbar-label {
        display: inline-flex;
    }

    .p-progressbar-indeterminate .p-progressbar-value::before {
        content: '';
        position: absolute;
        background: inherit;
        inset-block-start: 0;
        inset-inline-start: 0;
        inset-block-end: 0;
        will-change: inset-inline-start, inset-inline-end;
        animation: p-progressbar-indeterminate-anim 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite;
    }

    .p-progressbar-indeterminate .p-progressbar-value::after {
        content: '';
        position: absolute;
        background: inherit;
        inset-block-start: 0;
        inset-inline-start: 0;
        inset-block-end: 0;
        will-change: inset-inline-start, inset-inline-end;
        animation: p-progressbar-indeterminate-anim-short 2.1s cubic-bezier(0.165, 0.84, 0.44, 1) infinite;
        animation-delay: 1.15s;
    }

    @keyframes p-progressbar-indeterminate-anim {
        0% {
            inset-inline-start: -35%;
            inset-inline-end: 100%;
        }
        60% {
            inset-inline-start: 100%;
            inset-inline-end: -90%;
        }
        100% {
            inset-inline-start: 100%;
            inset-inline-end: -90%;
        }
    }
    @-webkit-keyframes p-progressbar-indeterminate-anim {
        0% {
            inset-inline-start: -35%;
            inset-inline-end: 100%;
        }
        60% {
            inset-inline-start: 100%;
            inset-inline-end: -90%;
        }
        100% {
            inset-inline-start: 100%;
            inset-inline-end: -90%;
        }
    }

    @keyframes p-progressbar-indeterminate-anim-short {
        0% {
            inset-inline-start: -200%;
            inset-inline-end: 100%;
        }
        60% {
            inset-inline-start: 107%;
            inset-inline-end: -8%;
        }
        100% {
            inset-inline-start: 107%;
            inset-inline-end: -8%;
        }
    }
    @-webkit-keyframes p-progressbar-indeterminate-anim-short {
        0% {
            inset-inline-start: -200%;
            inset-inline-end: 100%;
        }
        60% {
            inset-inline-start: 107%;
            inset-inline-end: -8%;
        }
        100% {
            inset-inline-start: 107%;
            inset-inline-end: -8%;
        }
    }
`;var L=["content"],U=n=>({$implicit:n});function W(n,m){if(n&1&&(f(0,"div"),E(1),v()),n&2){let e=d(2);c("display",e.value!=null&&e.value!==0?"flex":"none"),a(),A("",e.value,"",e.unit)}}function X(n,m){n&1&&D(0)}function Y(n,m){if(n&1&&(f(0,"div",2)(1,"div",2),b(2,W,2,4,"div",3)(3,X,1,0,"ng-container",4),v()()),n&2){let e=d();s(e.cn(e.cx("value"),e.valueStyleClass)),c("width",e.value+"%")("display","flex")("background",e.color),r("pBind",e.ptm("value")),a(),s(e.cx("label")),r("pBind",e.ptm("label")),a(),r("ngIf",e.showValue&&!e.contentTemplate&&!e._contentTemplate),a(),r("ngTemplateOutlet",e.contentTemplate||e._contentTemplate)("ngTemplateOutletContext",N(15,U,e.value))}}function Z(n,m){if(n&1&&P(0,"div",2),n&2){let e=d();s(e.cn(e.cx("value"),e.valueStyleClass)),c("background",e.color),r("pBind",e.ptm("value"))}}var ee={root:({instance:n})=>["p-progressbar p-component",{"p-progressbar-determinate":n.mode=="determinate","p-progressbar-indeterminate":n.mode=="indeterminate"}],value:"p-progressbar-value",label:"p-progressbar-label"},J=(()=>{class n extends q{name="progressbar";style=$;classes=ee;static \u0275fac=(()=>{let e;return function(t){return(e||(e=g(n)))(t||n)}})();static \u0275prov=k({token:n,factory:n.\u0275fac})}return n})();var K=new x("PROGRESSBAR_INSTANCE"),ne=(()=>{class n extends H{$pcProgressBar=p(K,{optional:!0,skipSelf:!0})??void 0;bindDirectiveInstance=p(o,{self:!0});value;showValue=!0;styleClass;valueStyleClass;unit="%";mode="determinate";color;contentTemplate;onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]))}_componentStyle=p(J);templates;_contentTemplate;onAfterContentInit(){this.templates?.forEach(e=>{e.getType()==="content"?this._contentTemplate=e.template:this._contentTemplate=e.template})}static \u0275fac=(()=>{let e;return function(t){return(e||(e=g(n)))(t||n)}})();static \u0275cmp=w({type:n,selectors:[["p-progressBar"],["p-progressbar"],["p-progress-bar"]],contentQueries:function(i,t,C){if(i&1&&(y(C,L,4),y(C,z,4)),i&2){let l;h(l=_())&&(t.contentTemplate=l.first),h(l=_())&&(t.templates=l)}},hostVars:6,hostBindings:function(i,t){i&2&&(M("aria-valuemin",0)("aria-valuenow",t.value)("aria-valuemax",100)("aria-level",t.value+t.unit),s(t.cn(t.cx("root"),t.styleClass)))},inputs:{value:[2,"value","value",V],showValue:[2,"showValue","showValue",R],styleClass:"styleClass",valueStyleClass:"valueStyleClass",unit:"unit",mode:"mode",color:"color"},features:[F([J,{provide:K,useExisting:n},{provide:G,useExisting:n}]),S([o]),I],decls:2,vars:2,consts:[[3,"class","pBind","width","display","background",4,"ngIf"],[3,"class","pBind","background",4,"ngIf"],[3,"pBind"],[3,"display",4,"ngIf"],[4,"ngTemplateOutlet","ngTemplateOutletContext"]],template:function(i,t){i&1&&b(0,Y,4,17,"div",0)(1,Z,1,5,"div",1),i&2&&(r("ngIf",t.mode==="determinate"),a(),r("ngIf",t.mode==="indeterminate"))},dependencies:[Q,j,O,u,o],encapsulation:2,changeDetection:0})}return n})(),Ce=(()=>{class n{static \u0275fac=function(i){return new(i||n)};static \u0275mod=B({type:n});static \u0275inj=T({imports:[ne,u,u]})}return n})();export{ne as a,Ce as b};
