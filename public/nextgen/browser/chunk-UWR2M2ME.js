import{ha as E,ia as c,ma as N,pa as A}from"./chunk-MVAEEA3L.js";import{$b as o,Ab as s,Bb as b,Cb as f,Db as M,Jb as B,Ob as p,Pc as V,Qc as j,Ra as r,Rb as v,Tb as y,U as C,Ub as h,V as k,Yb as d,Z as x,ac as P,cb as w,cd as Q,db as T,dc as S,gb as I,gd as O,ib as g,md as z,pc as F,ra as m,rc as D,ub as a}from"./chunk-YBCNRLYA.js";var q=`
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
`;var H=["content"],$=n=>({$implicit:n});function G(n,u){if(n&1&&(b(0,"div"),P(1),f()),n&2){let e=p(2);d("display",e.value!=null&&e.value!==0?"flex":"none"),a("data-pc-section","label"),r(),S("",e.value,"",e.unit)}}function J(n,u){n&1&&B(0)}function K(n,u){if(n&1&&(b(0,"div")(1,"div"),g(2,G,2,5,"div",2)(3,J,1,0,"ng-container",3),f()()),n&2){let e=p();o(e.cn(e.cx("value"),e.valueStyleClass)),d("width",e.value+"%")("display","flex")("background",e.color),a("data-pc-section","value"),r(),o(e.cx("label")),r(),s("ngIf",e.showValue&&!e.contentTemplate&&!e._contentTemplate),r(),s("ngTemplateOutlet",e.contentTemplate||e._contentTemplate)("ngTemplateOutletContext",D(14,$,e.value))}}function L(n,u){if(n&1&&M(0,"div"),n&2){let e=p();o(e.cn(e.cx("value"),e.valueStyleClass)),d("background",e.color),a("data-pc-section","value")}}var U={root:({instance:n})=>["p-progressbar p-component",{"p-progressbar-determinate":n.mode=="determinate","p-progressbar-indeterminate":n.mode=="indeterminate"}],value:"p-progressbar-value",label:"p-progressbar-label"},R=(()=>{class n extends N{name="progressbar";theme=q;classes=U;static \u0275fac=(()=>{let e;return function(t){return(e||(e=m(n)))(t||n)}})();static \u0275prov=C({token:n,factory:n.\u0275fac})}return n})();var W=(()=>{class n extends A{value;showValue=!0;styleClass;valueStyleClass;unit="%";mode="determinate";color;contentTemplate;_componentStyle=x(R);templates;_contentTemplate;ngAfterContentInit(){this.templates?.forEach(e=>{switch(e.getType()){case"content":this._contentTemplate=e.template;break;default:this._contentTemplate=e.template}})}static \u0275fac=(()=>{let e;return function(t){return(e||(e=m(n)))(t||n)}})();static \u0275cmp=w({type:n,selectors:[["p-progressBar"],["p-progressbar"],["p-progress-bar"]],contentQueries:function(i,t,_){if(i&1&&(v(_,H,4),v(_,E,4)),i&2){let l;y(l=h())&&(t.contentTemplate=l.first),y(l=h())&&(t.templates=l)}},hostVars:8,hostBindings:function(i,t){i&2&&(a("aria-valuemin",0)("aria-valuenow",t.value)("aria-valuemax",100)("data-pc-name","progressbar")("data-pc-section","root")("aria-level",t.value+t.unit),o(t.cn(t.cx("root"),t.styleClass)))},inputs:{value:[2,"value","value",j],showValue:[2,"showValue","showValue",V],styleClass:"styleClass",valueStyleClass:"valueStyleClass",unit:"unit",mode:"mode",color:"color"},features:[F([R]),I],decls:2,vars:2,consts:[[3,"class","width","display","background",4,"ngIf"],[3,"class","background",4,"ngIf"],[3,"display",4,"ngIf"],[4,"ngTemplateOutlet","ngTemplateOutletContext"]],template:function(i,t){i&1&&g(0,K,4,16,"div",0)(1,L,1,5,"div",1),i&2&&(s("ngIf",t.mode==="determinate"),r(),s("ngIf",t.mode==="indeterminate"))},dependencies:[z,Q,O,c],encapsulation:2,changeDetection:0})}return n})(),ge=(()=>{class n{static \u0275fac=function(i){return new(i||n)};static \u0275mod=T({type:n});static \u0275inj=k({imports:[W,c,c]})}return n})();export{W as a,ge as b};
