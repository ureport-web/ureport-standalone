import{R as z,fa as H,ga as P,ha as V,ia as g,ma as A,pa as $}from"./chunk-SWLD4EZT.js";import{$b as x,Ab as _,Fb as v,Gb as C,Hb as h,Mb as y,Nb as q,Ob as T,Pb as d,Qa as i,Rb as p,Sb as s,T as Q,U as F,Y as S,Yb as R,Zb as f,_b as M,_c as B,ad as O,bb as I,cb as k,fb as D,fd as N,hb as c,lc as w,ma as E,qa as b,sb as j,yb as r,zb as u}from"./chunk-VN72LZYD.js";var G=`
    .p-card {
        background: dt('card.background');
        color: dt('card.color');
        box-shadow: dt('card.shadow');
        border-radius: dt('card.border.radius');
        display: flex;
        flex-direction: column;
    }

    .p-card-caption {
        display: flex;
        flex-direction: column;
        gap: dt('card.caption.gap');
    }

    .p-card-body {
        padding: dt('card.body.padding');
        display: flex;
        flex-direction: column;
        gap: dt('card.body.gap');
    }

    .p-card-title {
        font-size: dt('card.title.font.size');
        font-weight: dt('card.title.font.weight');
    }

    .p-card-subtitle {
        color: dt('card.subtitle.color');
    }
`;var K=["header"],L=["title"],U=["subtitle"],W=["content"],X=["footer"],Y=["*",[["p-header"]],[["p-footer"]]],Z=["*","p-header","p-footer"];function ee(t,l){t&1&&h(0)}function te(t,l){if(t&1&&(u(0,"div"),T(1,1),c(2,ee,1,0,"ng-container",1),_()),t&2){let e=y();f(e.cx("header")),i(2),r("ngTemplateOutlet",e.headerTemplate||e._headerTemplate)}}function ne(t,l){if(t&1&&(v(0),M(1),C()),t&2){let e=y(2);i(),x(e.header)}}function ae(t,l){t&1&&h(0)}function ie(t,l){if(t&1&&(u(0,"div"),c(1,ne,2,1,"ng-container",2)(2,ae,1,0,"ng-container",1),_()),t&2){let e=y();f(e.cx("title")),i(),r("ngIf",e.header&&!e._titleTemplate&&!e.titleTemplate),i(),r("ngTemplateOutlet",e.titleTemplate||e._titleTemplate)}}function re(t,l){if(t&1&&(v(0),M(1),C()),t&2){let e=y(2);i(),x(e.subheader)}}function oe(t,l){t&1&&h(0)}function le(t,l){if(t&1&&(u(0,"div"),c(1,re,2,1,"ng-container",2)(2,oe,1,0,"ng-container",1),_()),t&2){let e=y();f(e.cx("subtitle")),i(),r("ngIf",e.subheader&&!e._subtitleTemplate&&!e.subtitleTemplate),i(),r("ngTemplateOutlet",e.subtitleTemplate||e._subtitleTemplate)}}function ce(t,l){t&1&&h(0)}function de(t,l){t&1&&h(0)}function pe(t,l){if(t&1&&(u(0,"div"),T(1,2),c(2,de,1,0,"ng-container",1),_()),t&2){let e=y();f(e.cx("footer")),i(2),r("ngTemplateOutlet",e.footerTemplate||e._footerTemplate)}}var se=`
    ${G}

    .p-card {
        display: block;
    }
`,me={root:"p-card p-component",header:"p-card-header",body:"p-card-body",caption:"p-card-caption",title:"p-card-title",subtitle:"p-card-subtitle",content:"p-card-content",footer:"p-card-footer"},J=(()=>{class t extends A{name="card";theme=se;classes=me;static \u0275fac=(()=>{let e;return function(n){return(e||(e=b(t)))(n||t)}})();static \u0275prov=Q({token:t,factory:t.\u0275fac})}return t})();var fe=(()=>{class t extends ${header;subheader;set style(e){z(this._style(),e)||this._style.set(e)}styleClass;headerFacet;footerFacet;headerTemplate;titleTemplate;subtitleTemplate;contentTemplate;footerTemplate;_headerTemplate;_titleTemplate;_subtitleTemplate;_contentTemplate;_footerTemplate;_style=E(null);_componentStyle=S(J);getBlockableElement(){return this.el.nativeElement.children[0]}templates;ngAfterContentInit(){this.templates.forEach(e=>{switch(e.getType()){case"header":this._headerTemplate=e.template;break;case"title":this._titleTemplate=e.template;break;case"subtitle":this._subtitleTemplate=e.template;break;case"content":this._contentTemplate=e.template;break;case"footer":this._footerTemplate=e.template;break;default:this._contentTemplate=e.template;break}})}static \u0275fac=(()=>{let e;return function(n){return(e||(e=b(t)))(n||t)}})();static \u0275cmp=I({type:t,selectors:[["p-card"]],contentQueries:function(o,n,m){if(o&1&&(d(m,H,5),d(m,P,5),d(m,K,4),d(m,L,4),d(m,U,4),d(m,W,4),d(m,X,4),d(m,V,4)),o&2){let a;p(a=s())&&(n.headerFacet=a.first),p(a=s())&&(n.footerFacet=a.first),p(a=s())&&(n.headerTemplate=a.first),p(a=s())&&(n.titleTemplate=a.first),p(a=s())&&(n.subtitleTemplate=a.first),p(a=s())&&(n.contentTemplate=a.first),p(a=s())&&(n.footerTemplate=a.first),p(a=s())&&(n.templates=a)}},hostVars:5,hostBindings:function(o,n){o&2&&(j("data-pc-name","card"),R(n._style()),f(n.cn(n.cx("root"),n.styleClass)))},inputs:{header:"header",subheader:"subheader",style:"style",styleClass:"styleClass"},features:[w([J]),D],ngContentSelectors:Z,decls:8,vars:9,consts:[[3,"class",4,"ngIf"],[4,"ngTemplateOutlet"],[4,"ngIf"]],template:function(o,n){o&1&&(q(Y),c(0,te,3,3,"div",0),u(1,"div"),c(2,ie,3,4,"div",0)(3,le,3,4,"div",0),u(4,"div"),T(5),c(6,ce,1,0,"ng-container",1),_(),c(7,pe,3,3,"div",0),_()),o&2&&(r("ngIf",n.headerFacet||n.headerTemplate||n._headerTemplate),i(),f(n.cx("body")),i(),r("ngIf",n.header||n.titleTemplate||n._titleTemplate),i(),r("ngIf",n.subheader||n.subtitleTemplate||n._subtitleTemplate),i(),f(n.cx("content")),i(2),r("ngTemplateOutlet",n.contentTemplate||n._contentTemplate),i(),r("ngIf",n.footerFacet||n.footerTemplate||n._footerTemplate))},dependencies:[N,B,O,g],encapsulation:2,changeDetection:0})}return t})(),je=(()=>{class t{static \u0275fac=function(o){return new(o||t)};static \u0275mod=k({type:t});static \u0275inj=F({imports:[fe,g,g]})}return t})();export{fe as a,je as b};
