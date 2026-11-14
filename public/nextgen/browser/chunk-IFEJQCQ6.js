import{ea as a,ia as N,la as E,ma as C,na as i}from"./chunk-RP2SIKJL.js";import{$ as s,Eb as c,Fb as b,Gb as S,Hb as D,Ta as u,W as d,X as f,Z as m,bc as I,ec as o,ia as g,ib as y,jb as h,mb as k,nb as v,pd as B,tc as M,ua as p,wb as l}from"./chunk-4S52IWZL.js";var F=`
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
`;var R={root:()=>["p-progressspinner"],spin:"p-progressspinner-spin",circle:"p-progressspinner-circle"},w=(()=>{class e extends N{name="progressspinner";style=F;classes=R;static \u0275fac=(()=>{let r;return function(n){return(r||(r=p(e)))(n||e)}})();static \u0275prov=d({token:e,factory:e.\u0275fac})}return e})();var P=new m("PROGRESSSPINNER_INSTANCE"),j=(()=>{class e extends C{$pcProgressSpinner=s(P,{optional:!0,skipSelf:!0})??void 0;bindDirectiveInstance=s(i,{self:!0});styleClass;strokeWidth="2";fill="none";animationDuration="2s";ariaLabel;onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]))}_componentStyle=s(w);static \u0275fac=(()=>{let r;return function(n){return(r||(r=p(e)))(n||e)}})();static \u0275cmp=y({type:e,selectors:[["p-progressSpinner"],["p-progress-spinner"],["p-progressspinner"]],hostVars:5,hostBindings:function(t,n){t&2&&(l("aria-label",n.ariaLabel)("role","progressbar")("aria-busy",!0),o(n.cn(n.cx("root"),n.styleClass)))},inputs:{styleClass:"styleClass",strokeWidth:"strokeWidth",fill:"fill",animationDuration:"animationDuration",ariaLabel:"ariaLabel"},features:[M([w,{provide:P,useExisting:e},{provide:E,useExisting:e}]),v([i]),k],decls:2,vars:10,consts:[["viewBox","25 25 50 50",3,"pBind"],["cx","50","cy","50","r","20","stroke-miterlimit","10",3,"pBind"]],template:function(t,n){t&1&&(g(),b(0,"svg",0),D(1,"circle",1),S()),t&2&&(o(n.cx("spin")),I("animation-duration",n.animationDuration),c("pBind",n.ptm("spin")),u(),o(n.cx("circle")),c("pBind",n.ptm("circle")),l("fill",n.fill)("stroke-width",n.strokeWidth))},dependencies:[B,a,i],encapsulation:2,changeDetection:0})}return e})(),X=(()=>{class e{static \u0275fac=function(t){return new(t||e)};static \u0275mod=h({type:e});static \u0275inj=f({imports:[j,a,a]})}return e})();export{j as a,X as b};
