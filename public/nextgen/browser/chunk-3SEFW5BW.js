import{ia as i,ma as b,pa as v}from"./chunk-SWLD4EZT.js";import{T as l,U as d,Y as c,Yb as h,Zb as y,bb as p,cb as m,fb as f,fd as k,lc as g,qa as s,sb as u}from"./chunk-VN72LZYD.js";import{a,b as r}from"./chunk-EQDQRRRY.js";var S=`
    .p-skeleton {
        display: block;
        overflow: hidden;
        background: dt('skeleton.background');
        border-radius: dt('skeleton.border.radius');
    }

    .p-skeleton::after {
        content: '';
        animation: p-skeleton-animation 1.2s infinite;
        height: 100%;
        left: 0;
        position: absolute;
        right: 0;
        top: 0;
        transform: translateX(-100%);
        z-index: 1;
        background: linear-gradient(90deg, rgba(255, 255, 255, 0), dt('skeleton.animation.background'), rgba(255, 255, 255, 0));
    }

    [dir='rtl'] .p-skeleton::after {
        animation-name: p-skeleton-animation-rtl;
    }

    .p-skeleton-circle {
        border-radius: 50%;
    }

    .p-skeleton-animation-none::after {
        animation: none;
    }

    @keyframes p-skeleton-animation {
        from {
            transform: translateX(-100%);
        }
        to {
            transform: translateX(100%);
        }
    }

    @keyframes p-skeleton-animation-rtl {
        from {
            transform: translateX(100%);
        }
        to {
            transform: translateX(-100%);
        }
    }
`;var w={root:{position:"relative"}},C={root:({instance:e})=>["p-skeleton p-component",{"p-skeleton-circle":e.shape==="circle","p-skeleton-animation-none":e.animation==="none"}]},M=(()=>{class e extends b{name="skeleton";theme=S;classes=C;inlineStyles=w;static \u0275fac=(()=>{let n;return function(o){return(n||(n=s(e)))(o||e)}})();static \u0275prov=l({token:e,factory:e.\u0275fac})}return e})();var D=(()=>{class e extends v{styleClass;shape="rectangle";animation="wave";borderRadius;size;width="100%";height="1rem";_componentStyle=c(M);get containerStyle(){let n=this._componentStyle?.inlineStyles.root,t;return this.size?t=r(a({},n),{width:this.size,height:this.size,borderRadius:this.borderRadius}):t=r(a({},n),{width:this.width,height:this.height,borderRadius:this.borderRadius}),t}static \u0275fac=(()=>{let n;return function(o){return(n||(n=s(e)))(o||e)}})();static \u0275cmp=p({type:e,selectors:[["p-skeleton"]],hostVars:7,hostBindings:function(t,o){t&2&&(u("aria-hidden",!0)("data-pc-name","skeleton")("data-pc-section","root"),h(o.containerStyle),y(o.cn(o.cx("root"),o.styleClass)))},inputs:{styleClass:"styleClass",shape:"shape",animation:"animation",borderRadius:"borderRadius",size:"size",width:"width",height:"height"},features:[g([M]),f],decls:0,vars:0,template:function(t,o){},dependencies:[k,i],encapsulation:2,changeDetection:0})}return e})(),q=(()=>{class e{static \u0275fac=function(t){return new(t||e)};static \u0275mod=m({type:e});static \u0275inj=d({imports:[D,i,i]})}return e})();export{D as a,q as b};
