import{N as V,ba as $,ca as z,da as G,ea as v,ia as J,la as K,ma as L,na as T,oa as C}from"./chunk-RP2SIKJL.js";import{$ as g,Eb as i,Fb as u,Gb as _,Lb as M,Mb as x,Nb as h,Sb as y,Ta as r,Tb as q,Ub as b,Vb as c,W as Q,X as F,Xb as d,Yb as s,Z as S,dc as w,ec as f,fc as B,gc as I,hd as O,ib as k,jb as N,jd as H,mb as j,nb as R,ob as p,pd as P,qa as D,tc as A,ua as E}from"./chunk-4S52IWZL.js";var U=`
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
`;var Y=["header"],Z=["title"],ee=["subtitle"],te=["content"],ne=["footer"],ie=["*",[["p-header"]],[["p-footer"]]],ae=["*","p-header","p-footer"];function re(t,l){t&1&&h(0)}function oe(t,l){if(t&1&&(u(0,"div",1),b(1,1),p(2,re,1,0,"ng-container",2),_()),t&2){let e=y();f(e.cx("header")),i("pBind",e.ptm("header")),r(2),i("ngTemplateOutlet",e.headerTemplate||e._headerTemplate)}}function le(t,l){if(t&1&&(M(0),B(1),x()),t&2){let e=y(2);r(),I(e.header)}}function pe(t,l){t&1&&h(0)}function ce(t,l){if(t&1&&(u(0,"div",1),p(1,le,2,1,"ng-container",3)(2,pe,1,0,"ng-container",2),_()),t&2){let e=y();f(e.cx("title")),i("pBind",e.ptm("title")),r(),i("ngIf",e.header&&!e._titleTemplate&&!e.titleTemplate),r(),i("ngTemplateOutlet",e.titleTemplate||e._titleTemplate)}}function de(t,l){if(t&1&&(M(0),B(1),x()),t&2){let e=y(2);r(),I(e.subheader)}}function se(t,l){t&1&&h(0)}function me(t,l){if(t&1&&(u(0,"div",1),p(1,de,2,1,"ng-container",3)(2,se,1,0,"ng-container",2),_()),t&2){let e=y();f(e.cx("subtitle")),i("pBind",e.ptm("subtitle")),r(),i("ngIf",e.subheader&&!e._subtitleTemplate&&!e.subtitleTemplate),r(),i("ngTemplateOutlet",e.subtitleTemplate||e._subtitleTemplate)}}function fe(t,l){t&1&&h(0)}function ue(t,l){t&1&&h(0)}function _e(t,l){if(t&1&&(u(0,"div",1),b(1,2),p(2,ue,1,0,"ng-container",2),_()),t&2){let e=y();f(e.cx("footer")),i("pBind",e.ptm("footer")),r(2),i("ngTemplateOutlet",e.footerTemplate||e._footerTemplate)}}var ye=`
    ${U}

    .p-card {
        display: block;
    }
`,he={root:"p-card p-component",header:"p-card-header",body:"p-card-body",caption:"p-card-caption",title:"p-card-title",subtitle:"p-card-subtitle",content:"p-card-content",footer:"p-card-footer"},W=(()=>{class t extends J{name="card";style=ye;classes=he;static \u0275fac=(()=>{let e;return function(n){return(e||(e=E(t)))(n||t)}})();static \u0275prov=Q({token:t,factory:t.\u0275fac})}return t})();var X=new S("CARD_INSTANCE"),Te=(()=>{class t extends L{$pcCard=g(X,{optional:!0,skipSelf:!0})??void 0;bindDirectiveInstance=g(T,{self:!0});_componentStyle=g(W);onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]))}header;subheader;set style(e){V(this._style(),e)||(this._style.set(e),this.el?.nativeElement&&e&&Object.keys(e).forEach(o=>{this.el.nativeElement.style[o]=e[o]}))}get style(){return this._style()}styleClass;headerFacet;footerFacet;headerTemplate;titleTemplate;subtitleTemplate;contentTemplate;footerTemplate;_headerTemplate;_titleTemplate;_subtitleTemplate;_contentTemplate;_footerTemplate;_style=D(null);getBlockableElement(){return this.el.nativeElement.children[0]}templates;onAfterContentInit(){this.templates.forEach(e=>{switch(e.getType()){case"header":this._headerTemplate=e.template;break;case"title":this._titleTemplate=e.template;break;case"subtitle":this._subtitleTemplate=e.template;break;case"content":this._contentTemplate=e.template;break;case"footer":this._footerTemplate=e.template;break;default:this._contentTemplate=e.template;break}})}static \u0275fac=(()=>{let e;return function(n){return(e||(e=E(t)))(n||t)}})();static \u0275cmp=k({type:t,selectors:[["p-card"]],contentQueries:function(o,n,m){if(o&1&&(c(m,$,5),c(m,z,5),c(m,Y,4),c(m,Z,4),c(m,ee,4),c(m,te,4),c(m,ne,4),c(m,G,4)),o&2){let a;d(a=s())&&(n.headerFacet=a.first),d(a=s())&&(n.footerFacet=a.first),d(a=s())&&(n.headerTemplate=a.first),d(a=s())&&(n.titleTemplate=a.first),d(a=s())&&(n.subtitleTemplate=a.first),d(a=s())&&(n.contentTemplate=a.first),d(a=s())&&(n.footerTemplate=a.first),d(a=s())&&(n.templates=a)}},hostVars:4,hostBindings:function(o,n){o&2&&(w(n._style()),f(n.cn(n.cx("root"),n.styleClass)))},inputs:{header:"header",subheader:"subheader",style:"style",styleClass:"styleClass"},features:[A([W,{provide:X,useExisting:t},{provide:K,useExisting:t}]),R([T]),j],ngContentSelectors:ae,decls:8,vars:11,consts:[[3,"pBind","class",4,"ngIf"],[3,"pBind"],[4,"ngTemplateOutlet"],[4,"ngIf"]],template:function(o,n){o&1&&(q(ie),p(0,oe,3,4,"div",0),u(1,"div",1),p(2,ce,3,5,"div",0)(3,me,3,5,"div",0),u(4,"div",1),b(5),p(6,fe,1,0,"ng-container",2),_(),p(7,_e,3,4,"div",0),_()),o&2&&(i("ngIf",n.headerFacet||n.headerTemplate||n._headerTemplate),r(),f(n.cx("body")),i("pBind",n.ptm("body")),r(),i("ngIf",n.header||n.titleTemplate||n._titleTemplate),r(),i("ngIf",n.subheader||n.subtitleTemplate||n._subtitleTemplate),r(),f(n.cx("content")),i("pBind",n.ptm("content")),r(2),i("ngTemplateOutlet",n.contentTemplate||n._contentTemplate),r(),i("ngIf",n.footerFacet||n.footerTemplate||n._footerTemplate))},dependencies:[P,O,H,v,C,T],encapsulation:2,changeDetection:0})}return t})(),Oe=(()=>{class t{static \u0275fac=function(o){return new(o||t)};static \u0275mod=N({type:t});static \u0275inj=F({imports:[Te,v,C,v,C]})}return t})();export{Te as a,Oe as b};
