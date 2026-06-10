import{ha as q,ia as m,ma as A,pa as P,qa as R}from"./chunk-LEZ7STAA.js";import{$b as s,Ab as i,Bb as f,Cb as y,Db as k,Gb as D,Hb as F,Ib as w,Ob as u,Oc as Q,Pb as S,Qb as j,Ra as a,Rb as v,Tb as _,U as b,Ub as C,V as h,Z as I,_c as N,ac as B,bc as z,bd as H,cb as p,db as x,fa as M,fd as O,gb as g,ib as c,kd as V,oc as E,ra as r}from"./chunk-MVGH6UWW.js";var G=`
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
`;var K=["icon"],L=["*"];function U(t,d){if(t&1&&k(0,"span",3),t&2){let e=u(2);s(e.cx("icon")),i("ngClass",e.icon)}}function W(t,d){if(t&1&&(F(0),c(1,U,1,3,"span",2),w()),t&2){let e=u();a(),i("ngIf",e.icon)}}function X(t,d){}function Y(t,d){t&1&&c(0,X,0,0,"ng-template")}function $(t,d){if(t&1&&(f(0,"span"),c(1,Y,1,0,null,4),y()),t&2){let e=u();s(e.cx("icon")),a(),i("ngTemplateOutlet",e.iconTemplate||e._iconTemplate)}}var tt={root:({instance:t})=>["p-tag p-component",{"p-tag-info":t.severity==="info","p-tag-success":t.severity==="success","p-tag-warn":t.severity==="warn","p-tag-danger":t.severity==="danger","p-tag-secondary":t.severity==="secondary","p-tag-contrast":t.severity==="contrast","p-tag-rounded":t.rounded}],icon:"p-tag-icon",label:"p-tag-label"},Z=(()=>{class t extends A{name="tag";theme=G;classes=tt;static \u0275fac=(()=>{let e;return function(n){return(e||(e=r(t)))(n||t)}})();static \u0275prov=b({token:t,factory:t.\u0275fac})}return t})();var et=(()=>{class t extends P{styleClass;severity;value;icon;rounded;iconTemplate;templates;_iconTemplate;_componentStyle=I(Z);ngAfterContentInit(){this.templates?.forEach(e=>{switch(e.getType()){case"icon":this._iconTemplate=e.template;break}})}static \u0275fac=(()=>{let e;return function(n){return(e||(e=r(t)))(n||t)}})();static \u0275cmp=p({type:t,selectors:[["p-tag"]],contentQueries:function(o,n,T){if(o&1&&(v(T,K,4),v(T,q,4)),o&2){let l;_(l=C())&&(n.iconTemplate=l.first),_(l=C())&&(n.templates=l)}},hostVars:2,hostBindings:function(o,n){o&2&&s(n.cn(n.cx("root"),n.styleClass))},inputs:{styleClass:"styleClass",severity:"severity",value:"value",icon:"icon",rounded:[2,"rounded","rounded",Q]},features:[E([Z]),g],ngContentSelectors:L,decls:5,vars:5,consts:[[4,"ngIf"],[3,"class",4,"ngIf"],[3,"class","ngClass",4,"ngIf"],[3,"ngClass"],[4,"ngTemplateOutlet"]],template:function(o,n){o&1&&(S(),j(0),c(1,W,2,1,"ng-container",0)(2,$,2,3,"span",1),f(3,"span"),B(4),y()),o&2&&(a(),i("ngIf",!n.iconTemplate&&!n._iconTemplate),a(),i("ngIf",n.iconTemplate||n._iconTemplate),a(),s(n.cx("label")),a(),z(n.value))},dependencies:[V,N,H,O,m],encapsulation:2,changeDetection:0})}return t})(),Ct=(()=>{class t{static \u0275fac=function(o){return new(o||t)};static \u0275mod=x({type:t});static \u0275inj=h({imports:[et,m,m]})}return t})();var nt=["data-p-icon","minus"],ht=(()=>{class t extends R{static \u0275fac=(()=>{let e;return function(n){return(e||(e=r(t)))(n||t)}})();static \u0275cmp=p({type:t,selectors:[["","data-p-icon","minus"]],features:[g],attrs:nt,decls:1,vars:0,consts:[["d","M13.2222 7.77778H0.777778C0.571498 7.77778 0.373667 7.69584 0.227806 7.54998C0.0819442 7.40412 0 7.20629 0 7.00001C0 6.79373 0.0819442 6.5959 0.227806 6.45003C0.373667 6.30417 0.571498 6.22223 0.777778 6.22223H13.2222C13.4285 6.22223 13.6263 6.30417 13.7722 6.45003C13.9181 6.5959 14 6.79373 14 7.00001C14 7.20629 13.9181 7.40412 13.7722 7.54998C13.6263 7.69584 13.4285 7.77778 13.2222 7.77778Z","fill","currentColor"]],template:function(o,n){o&1&&(M(),D(0,"path",0))},encapsulation:2})}return t})();export{ht as a,et as b,Ct as c};
