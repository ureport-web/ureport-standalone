import{ha as q,ia as g,ma as A,pa as P}from"./chunk-43D2A2M3.js";import{$b as S,Ab as f,Bb as I,Fb as M,Gb as w,Lc as B,Mb as l,Nb as D,Ob as F,Pb as m,Qa as o,Rb as y,Sb as _,T,U as b,Xc as Q,Y as C,Zb as c,_b as j,_c as E,bb as h,cb as k,cd as N,fb as x,hb as r,hd as O,lc as z,qa as p,yb as i,zb as u}from"./chunk-Z36KDTBG.js";var R=`
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
`;var H=["icon"],G=["*"];function J(t,s){if(t&1&&I(0,"span",3),t&2){let e=l(2);c(e.cx("icon")),i("ngClass",e.icon)}}function K(t,s){if(t&1&&(M(0),r(1,J,1,3,"span",2),w()),t&2){let e=l();o(),i("ngIf",e.icon)}}function L(t,s){}function U(t,s){t&1&&r(0,L,0,0,"ng-template")}function W(t,s){if(t&1&&(u(0,"span"),r(1,U,1,0,null,4),f()),t&2){let e=l();c(e.cx("icon")),o(),i("ngTemplateOutlet",e.iconTemplate||e._iconTemplate)}}var X={root:({instance:t})=>["p-tag p-component",{"p-tag-info":t.severity==="info","p-tag-success":t.severity==="success","p-tag-warn":t.severity==="warn","p-tag-danger":t.severity==="danger","p-tag-secondary":t.severity==="secondary","p-tag-contrast":t.severity==="contrast","p-tag-rounded":t.rounded}],icon:"p-tag-icon",label:"p-tag-label"},V=(()=>{class t extends A{name="tag";theme=R;classes=X;static \u0275fac=(()=>{let e;return function(n){return(e||(e=p(t)))(n||t)}})();static \u0275prov=T({token:t,factory:t.\u0275fac})}return t})();var Y=(()=>{class t extends P{styleClass;severity;value;icon;rounded;iconTemplate;templates;_iconTemplate;_componentStyle=C(V);ngAfterContentInit(){this.templates?.forEach(e=>{switch(e.getType()){case"icon":this._iconTemplate=e.template;break}})}static \u0275fac=(()=>{let e;return function(n){return(e||(e=p(t)))(n||t)}})();static \u0275cmp=h({type:t,selectors:[["p-tag"]],contentQueries:function(a,n,v){if(a&1&&(m(v,H,4),m(v,q,4)),a&2){let d;y(d=_())&&(n.iconTemplate=d.first),y(d=_())&&(n.templates=d)}},hostVars:2,hostBindings:function(a,n){a&2&&c(n.cn(n.cx("root"),n.styleClass))},inputs:{styleClass:"styleClass",severity:"severity",value:"value",icon:"icon",rounded:[2,"rounded","rounded",B]},features:[z([V]),x],ngContentSelectors:G,decls:5,vars:5,consts:[[4,"ngIf"],[3,"class",4,"ngIf"],[3,"class","ngClass",4,"ngIf"],[3,"ngClass"],[4,"ngTemplateOutlet"]],template:function(a,n){a&1&&(D(),F(0),r(1,K,2,1,"ng-container",0)(2,W,2,3,"span",1),u(3,"span"),j(4),f()),a&2&&(o(),i("ngIf",!n.iconTemplate&&!n._iconTemplate),o(),i("ngIf",n.iconTemplate||n._iconTemplate),o(),c(n.cx("label")),o(),S(n.value))},dependencies:[O,Q,E,N,g],encapsulation:2,changeDetection:0})}return t})(),mt=(()=>{class t{static \u0275fac=function(a){return new(a||t)};static \u0275mod=k({type:t});static \u0275inj=b({imports:[Y,g,g]})}return t})();export{Y as a,mt as b};
