import{ia as z,ma as M,pa as x}from"./chunk-7YDSM7V4.js";import{Ab as u,Nb as f,Ob as y,T as d,U as l,Y as a,Yb as m,Zb as o,bb as p,cb as s,fb as c,id as b,mc as h,qa as r,sb as v,zb as g}from"./chunk-C2KL4RQS.js";var D=`
    .p-divider-horizontal {
        display: flex;
        width: 100%;
        position: relative;
        align-items: center;
        margin: dt('divider.horizontal.margin');
        padding: dt('divider.horizontal.padding');
    }

    .p-divider-horizontal:before {
        position: absolute;
        display: block;
        inset-block-start: 50%;
        inset-inline-start: 0;
        width: 100%;
        content: '';
        border-block-start: 1px solid dt('divider.border.color');
    }

    .p-divider-horizontal .p-divider-content {
        padding: dt('divider.horizontal.content.padding');
    }

    .p-divider-vertical {
        min-height: 100%;
        display: flex;
        position: relative;
        justify-content: center;
        margin: dt('divider.vertical.margin');
        padding: dt('divider.vertical.padding');
    }

    .p-divider-vertical:before {
        position: absolute;
        display: block;
        inset-block-start: 0;
        inset-inline-start: 50%;
        height: 100%;
        content: '';
        border-inline-start: 1px solid dt('divider.border.color');
    }

    .p-divider.p-divider-vertical .p-divider-content {
        padding: dt('divider.vertical.content.padding');
    }

    .p-divider-content {
        z-index: 1;
        background: dt('divider.content.background');
        color: dt('divider.content.color');
    }

    .p-divider-solid.p-divider-horizontal:before {
        border-block-start-style: solid;
    }

    .p-divider-solid.p-divider-vertical:before {
        border-inline-start-style: solid;
    }

    .p-divider-dashed.p-divider-horizontal:before {
        border-block-start-style: dashed;
    }

    .p-divider-dashed.p-divider-vertical:before {
        border-inline-start-style: dashed;
    }

    .p-divider-dotted.p-divider-horizontal:before {
        border-block-start-style: dotted;
    }

    .p-divider-dotted.p-divider-vertical:before {
        border-inline-start-style: dotted;
    }

    .p-divider-left:dir(rtl),
    .p-divider-right:dir(rtl) {
        flex-direction: row-reverse;
    }
`;var C=["*"],j={root:({instance:e})=>({justifyContent:e.layout==="horizontal"?e.align==="center"||e.align==null?"center":e.align==="left"?"flex-start":e.align==="right"?"flex-end":null:null,alignItems:e.layout==="vertical"?e.align==="center"||e.align==null?"center":e.align==="top"?"flex-start":e.align==="bottom"?"flex-end":null:null})},F={root:({instance:e})=>["p-divider p-component","p-divider-"+e.layout,"p-divider-"+e.type,{"p-divider-left":e.layout==="horizontal"&&(!e.align||e.align==="left")},{"p-divider-center":e.layout==="horizontal"&&e.align==="center"},{"p-divider-right":e.layout==="horizontal"&&e.align==="right"},{"p-divider-top":e.layout==="vertical"&&e.align==="top"},{"p-divider-center":e.layout==="vertical"&&(!e.align||e.align==="center")},{"p-divider-bottom":e.layout==="vertical"&&e.align==="bottom"}],content:"p-divider-content"},k=(()=>{class e extends M{name="divider";theme=D;classes=F;inlineStyles=j;static \u0275fac=(()=>{let i;return function(t){return(i||(i=r(e)))(t||e)}})();static \u0275prov=d({token:e,factory:e.\u0275fac})}return e})();var I=(()=>{class e extends x{styleClass;layout="horizontal";type="solid";align;_componentStyle=a(k);static \u0275fac=(()=>{let i;return function(t){return(i||(i=r(e)))(t||e)}})();static \u0275cmp=p({type:e,selectors:[["p-divider"]],hostAttrs:["data-pc-name","divider","role","separator"],hostVars:5,hostBindings:function(n,t){n&2&&(v("aria-orientation",t.layout),m(t.sx("root")),o(t.cn(t.cx("root"),t.styleClass)))},inputs:{styleClass:"styleClass",layout:"layout",type:"type",align:"align"},features:[h([k]),c],ngContentSelectors:C,decls:2,vars:2,template:function(n,t){n&1&&(f(),g(0,"div"),y(1),u()),n&2&&o(t.cx("content"))},dependencies:[b,z],encapsulation:2,changeDetection:0})}return e})(),L=(()=>{class e{static \u0275fac=function(n){return new(n||e)};static \u0275mod=s({type:e});static \u0275inj=l({imports:[I]})}return e})();export{I as a,L as b};
