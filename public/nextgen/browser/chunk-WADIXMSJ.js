import{fa as i,ja as D,ma as F}from"./chunk-BOZ5JNAH.js";import{Cb as y,Db as h,Eb as k,Sa as f,V as p,W as c,Zb as v,_ as l,ac as o,db as g,eb as m,ga as d,hb as u,kd as M,pc as b,sa as a,vb as s}from"./chunk-K2KWOMQT.js";var S=`
    .p-progressspinner {
        position: relative;
        margin: 0 auto;
        width: 100px;
        height: 100px;
        display: inline-block;
    }

    .p-progressspinner::before {
        content: '';
        display: block;
        padding-top: 100%;
    }

    .p-progressspinner-spin {
        height: 100%;
        transform-origin: center center;
        width: 100%;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        animation: p-progressspinner-rotate 2s linear infinite;
    }

    .p-progressspinner-circle {
        stroke-dasharray: 89, 200;
        stroke-dashoffset: 0;
        stroke: dt('progressspinner.colorOne');
        animation:
            p-progressspinner-dash 1.5s ease-in-out infinite,
            p-progressspinner-color 6s ease-in-out infinite;
        stroke-linecap: round;
    }

    @keyframes p-progressspinner-rotate {
        100% {
            transform: rotate(360deg);
        }
    }
    @keyframes p-progressspinner-dash {
        0% {
            stroke-dasharray: 1, 200;
            stroke-dashoffset: 0;
        }
        50% {
            stroke-dasharray: 89, 200;
            stroke-dashoffset: -35px;
        }
        100% {
            stroke-dasharray: 89, 200;
            stroke-dashoffset: -124px;
        }
    }
    @keyframes p-progressspinner-color {
        100%,
        0% {
            stroke: dt('progressspinner.color.one');
        }
        40% {
            stroke: dt('progressspinner.color.two');
        }
        66% {
            stroke: dt('progressspinner.color.three');
        }
        80%,
        90% {
            stroke: dt('progressspinner.color.four');
        }
    }
`;var B={root:()=>["p-progressspinner"],spin:"p-progressspinner-spin",circle:"p-progressspinner-circle"},w=(()=>{class e extends D{name="progressspinner";theme=S;classes=B;static \u0275fac=(()=>{let r;return function(n){return(r||(r=a(e)))(n||e)}})();static \u0275prov=p({token:e,factory:e.\u0275fac})}return e})();var C=(()=>{class e extends F{styleClass;strokeWidth="2";fill="none";animationDuration="2s";ariaLabel;_componentStyle=l(w);static \u0275fac=(()=>{let r;return function(n){return(r||(r=a(e)))(n||e)}})();static \u0275cmp=g({type:e,selectors:[["p-progressSpinner"],["p-progress-spinner"],["p-progressspinner"]],hostVars:7,hostBindings:function(t,n){t&2&&(s("aria-label",n.ariaLabel)("role","progressbar")("data-pc-name","progressspinner")("data-pc-section","root")("aria-busy",!0),o(n.cn(n.cx("root"),n.styleClass)))},inputs:{styleClass:"styleClass",strokeWidth:"strokeWidth",fill:"fill",animationDuration:"animationDuration",ariaLabel:"ariaLabel"},features:[b([w]),u],decls:2,vars:9,consts:[["viewBox","25 25 50 50"],["cx","50","cy","50","r","20","stroke-miterlimit","10"]],template:function(t,n){t&1&&(d(),y(0,"svg",0),k(1,"circle",1),h()),t&2&&(o(n.cx("spin")),v("animation-duration",n.animationDuration),s("data-pc-section","root"),f(),o(n.cx("circle")),s("fill",n.fill)("stroke-width",n.strokeWidth))},dependencies:[M,i],encapsulation:2,changeDetection:0})}return e})(),z=(()=>{class e{static \u0275fac=function(t){return new(t||e)};static \u0275mod=m({type:e});static \u0275inj=c({imports:[C,i,i]})}return e})();export{C as a,z as b};
