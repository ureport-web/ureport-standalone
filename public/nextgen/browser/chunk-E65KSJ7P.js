import{da as V,ea as u,ia as q,la as G,ma as H,na as s}from"./chunk-RP2SIKJL.js";import{$ as l,Eb as a,Fb as m,Gb as y,Hb as w,Lb as D,Mb as N,Sb as g,Ta as i,Tb as S,Tc as z,Ub as E,Vb as v,W as C,X as h,Xb as _,Yb as T,Z as I,ec as c,ed as Q,fc as A,gc as F,hd as O,ib as k,jb as x,jd as P,mb as B,nb as M,ob as r,pd as R,tc as j,ua as f}from"./chunk-4S52IWZL.js";var $=`
    .p-tag {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: dt('tag.primary.background');
        color: dt('tag.primary.color');
        font-size: dt('tag.font.size');
        font-weight: dt('tag.font.weight');
        padding: dt('tag.padding');
        border-radius: dt('tag.border.radius');
        gap: dt('tag.gap');
    }

    .p-tag-icon {
        font-size: dt('tag.icon.size');
        width: dt('tag.icon.size');
        height: dt('tag.icon.size');
    }

    .p-tag-rounded {
        border-radius: dt('tag.rounded.border.radius');
    }

    .p-tag-success {
        background: dt('tag.success.background');
        color: dt('tag.success.color');
    }

    .p-tag-info {
        background: dt('tag.info.background');
        color: dt('tag.info.color');
    }

    .p-tag-warn {
        background: dt('tag.warn.background');
        color: dt('tag.warn.color');
    }

    .p-tag-danger {
        background: dt('tag.danger.background');
        color: dt('tag.danger.color');
    }

    .p-tag-secondary {
        background: dt('tag.secondary.background');
        color: dt('tag.secondary.color');
    }

    .p-tag-contrast {
        background: dt('tag.contrast.background');
        color: dt('tag.contrast.color');
    }
`;var L=["icon"],U=["*"];function W(t,d){if(t&1&&w(0,"span",4),t&2){let e=g(2);c(e.cx("icon")),a("ngClass",e.icon)("pBind",e.ptm("icon"))}}function X(t,d){if(t&1&&(D(0),r(1,W,1,4,"span",3),N()),t&2){let e=g();i(),a("ngIf",e.icon)}}function Y(t,d){}function Z(t,d){t&1&&r(0,Y,0,0,"ng-template")}function tt(t,d){if(t&1&&(m(0,"span",2),r(1,Z,1,0,null,5),y()),t&2){let e=g();c(e.cx("icon")),a("pBind",e.ptm("icon")),i(),a("ngTemplateOutlet",e.iconTemplate||e._iconTemplate)}}var et={root:({instance:t})=>["p-tag p-component",{"p-tag-info":t.severity==="info","p-tag-success":t.severity==="success","p-tag-warn":t.severity==="warn","p-tag-danger":t.severity==="danger","p-tag-secondary":t.severity==="secondary","p-tag-contrast":t.severity==="contrast","p-tag-rounded":t.rounded}],icon:"p-tag-icon",label:"p-tag-label"},J=(()=>{class t extends q{name="tag";style=$;classes=et;static \u0275fac=(()=>{let e;return function(n){return(e||(e=f(t)))(n||t)}})();static \u0275prov=C({token:t,factory:t.\u0275fac})}return t})();var K=new I("TAG_INSTANCE"),nt=(()=>{class t extends H{$pcTag=l(K,{optional:!0,skipSelf:!0})??void 0;bindDirectiveInstance=l(s,{self:!0});onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]))}styleClass;severity;value;icon;rounded;iconTemplate;templates;_iconTemplate;_componentStyle=l(J);onAfterContentInit(){this.templates?.forEach(e=>{e.getType()==="icon"&&(this._iconTemplate=e.template)})}static \u0275fac=(()=>{let e;return function(n){return(e||(e=f(t)))(n||t)}})();static \u0275cmp=k({type:t,selectors:[["p-tag"]],contentQueries:function(o,n,b){if(o&1&&(v(b,L,4),v(b,V,4)),o&2){let p;_(p=T())&&(n.iconTemplate=p.first),_(p=T())&&(n.templates=p)}},hostVars:2,hostBindings:function(o,n){o&2&&c(n.cn(n.cx("root"),n.styleClass))},inputs:{styleClass:"styleClass",severity:"severity",value:"value",icon:"icon",rounded:[2,"rounded","rounded",z]},features:[j([J,{provide:K,useExisting:t},{provide:G,useExisting:t}]),M([s]),B],ngContentSelectors:U,decls:5,vars:6,consts:[[4,"ngIf"],[3,"class","pBind",4,"ngIf"],[3,"pBind"],[3,"class","ngClass","pBind",4,"ngIf"],[3,"ngClass","pBind"],[4,"ngTemplateOutlet"]],template:function(o,n){o&1&&(S(),E(0),r(1,X,2,1,"ng-container",0)(2,tt,2,4,"span",1),m(3,"span",2),A(4),y()),o&2&&(i(),a("ngIf",!n.iconTemplate&&!n._iconTemplate),i(),a("ngIf",n.iconTemplate||n._iconTemplate),i(),c(n.cx("label")),a("pBind",n.ptm("label")),i(),F(n.value))},dependencies:[R,Q,O,P,u,s],encapsulation:2,changeDetection:0})}return t})(),ht=(()=>{class t{static \u0275fac=function(o){return new(o||t)};static \u0275mod=x({type:t});static \u0275inj=h({imports:[nt,u,u]})}return t})();export{nt as a,ht as b};
