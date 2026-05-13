import{a as j}from"./chunk-CMUDZBGP.js";import{I as st,q as Q,u as at,y as rt}from"./chunk-DBGMCAYY.js";import{Q as N,R as E,ha as R,ia as C,ma as $,ra as lt}from"./chunk-7YDSM7V4.js";import{$b as nt,Ab as k,Ac as it,Bb as Z,Hb as w,Hc as L,Ib as tt,Kb as F,Mb as r,Mc as s,Nc as V,Pb as u,Qa as d,Rb as c,S as B,Sb as g,T as O,U as P,Y as M,Zb as p,_b as et,bb as S,ca as U,cb as H,da as Y,dd as A,fb as D,gb as J,hb as m,id as z,jb as x,mc as I,oc as q,pc as ot,qa as f,sb as h,tb as y,ub as _,wb as W,xb as X,yb as v,zb as T}from"./chunk-C2KL4RQS.js";var dt=`
    .p-togglebutton {
        display: inline-flex;
        cursor: pointer;
        user-select: none;
        overflow: hidden;
        position: relative;
        color: dt('togglebutton.color');
        background: dt('togglebutton.background');
        border: 1px solid dt('togglebutton.border.color');
        padding: dt('togglebutton.padding');
        font-size: 1rem;
        font-family: inherit;
        font-feature-settings: inherit;
        transition:
            background dt('togglebutton.transition.duration'),
            color dt('togglebutton.transition.duration'),
            border-color dt('togglebutton.transition.duration'),
            outline-color dt('togglebutton.transition.duration'),
            box-shadow dt('togglebutton.transition.duration');
        border-radius: dt('togglebutton.border.radius');
        outline-color: transparent;
        font-weight: dt('togglebutton.font.weight');
    }

    .p-togglebutton-content {
        display: inline-flex;
        flex: 1 1 auto;
        align-items: center;
        justify-content: center;
        gap: dt('togglebutton.gap');
        padding: dt('togglebutton.content.padding');
        background: transparent;
        border-radius: dt('togglebutton.content.border.radius');
        transition:
            background dt('togglebutton.transition.duration'),
            color dt('togglebutton.transition.duration'),
            border-color dt('togglebutton.transition.duration'),
            outline-color dt('togglebutton.transition.duration'),
            box-shadow dt('togglebutton.transition.duration');
    }

    .p-togglebutton:not(:disabled):not(.p-togglebutton-checked):hover {
        background: dt('togglebutton.hover.background');
        color: dt('togglebutton.hover.color');
    }

    .p-togglebutton.p-togglebutton-checked {
        background: dt('togglebutton.checked.background');
        border-color: dt('togglebutton.checked.border.color');
        color: dt('togglebutton.checked.color');
    }

    .p-togglebutton-checked .p-togglebutton-content {
        background: dt('togglebutton.content.checked.background');
        box-shadow: dt('togglebutton.content.checked.shadow');
    }

    .p-togglebutton:focus-visible {
        box-shadow: dt('togglebutton.focus.ring.shadow');
        outline: dt('togglebutton.focus.ring.width') dt('togglebutton.focus.ring.style') dt('togglebutton.focus.ring.color');
        outline-offset: dt('togglebutton.focus.ring.offset');
    }

    .p-togglebutton.p-invalid {
        border-color: dt('togglebutton.invalid.border.color');
    }

    .p-togglebutton:disabled {
        opacity: 1;
        cursor: default;
        background: dt('togglebutton.disabled.background');
        border-color: dt('togglebutton.disabled.border.color');
        color: dt('togglebutton.disabled.color');
    }

    .p-togglebutton-label,
    .p-togglebutton-icon {
        position: relative;
        transition: none;
    }

    .p-togglebutton-icon {
        color: dt('togglebutton.icon.color');
    }

    .p-togglebutton:not(:disabled):not(.p-togglebutton-checked):hover .p-togglebutton-icon {
        color: dt('togglebutton.icon.hover.color');
    }

    .p-togglebutton.p-togglebutton-checked .p-togglebutton-icon {
        color: dt('togglebutton.icon.checked.color');
    }

    .p-togglebutton:disabled .p-togglebutton-icon {
        color: dt('togglebutton.icon.disabled.color');
    }

    .p-togglebutton-sm {
        padding: dt('togglebutton.sm.padding');
        font-size: dt('togglebutton.sm.font.size');
    }

    .p-togglebutton-sm .p-togglebutton-content {
        padding: dt('togglebutton.content.sm.padding');
    }

    .p-togglebutton-lg {
        padding: dt('togglebutton.lg.padding');
        font-size: dt('togglebutton.lg.font.size');
    }

    .p-togglebutton-lg .p-togglebutton-content {
        padding: dt('togglebutton.content.lg.padding');
    }

    .p-togglebutton-fluid {
        width: 100%;
    }
`;var ht=["icon"],yt=["content"],ct=e=>({$implicit:e});function _t(e,a){e&1&&w(0)}function vt(e,a){if(e&1&&Z(0,"span"),e&2){let t=r(3);p(t.cn(t.cx("icon"),t.checked?t.onIcon:t.offIcon,t.iconPos==="left"?t.cx("iconLeft"):t.cx("iconRight"))),h("data-pc-section","icon")}}function Ct(e,a){if(e&1&&y(0,vt,1,3,"span",1),e&2){let t=r(2);_(t.onIcon||t.offIcon?0:-1)}}function xt(e,a){e&1&&w(0)}function Tt(e,a){if(e&1&&m(0,xt,1,0,"ng-container",0),e&2){let t=r(2);v("ngTemplateOutlet",t.iconTemplate||t._iconTemplate)("ngTemplateOutletContext",q(2,ct,t.checked))}}function kt(e,a){if(e&1&&(y(0,Ct,1,1)(1,Tt,1,4,"ng-container"),T(2,"span"),et(3),k()),e&2){let t=r();_(t.iconTemplate?1:0),d(2),p(t.cx("label")),h("data-pc-section","label"),d(),nt(t.checked?t.hasOnLabel?t.onLabel:"\xA0":t.hasOffLabel?t.offLabel:"\xA0")}}var wt=`
    ${dt}

    /* For PrimeNG (iconPos) */
    .p-togglebutton-icon-right {
        order: 1;
    }

    .p-togglebutton.ng-invalid.ng-dirty {
        border-color: dt('togglebutton.invalid.border.color');
    }
`,Lt={root:({instance:e})=>["p-togglebutton p-component",{"p-togglebutton-checked":e.checked,"p-invalid":e.invalid(),"p-disabled":e.$disabled(),"p-togglebutton-sm p-inputfield-sm":e.size==="small","p-togglebutton-lg p-inputfield-lg":e.size==="large","p-togglebutton-fluid":e.fluid()}],content:"p-togglebutton-content",icon:"p-togglebutton-icon",iconLeft:"p-togglebutton-icon-left",iconRight:"p-togglebutton-icon-right",label:"p-togglebutton-label"},ut=(()=>{class e extends ${name="togglebutton";theme=wt;classes=Lt;static \u0275fac=(()=>{let t;return function(o){return(t||(t=f(e)))(o||e)}})();static \u0275prov=O({token:e,factory:e.\u0275fac})}return e})();var Et={provide:Q,useExisting:B(()=>G),multi:!0},G=(()=>{class e extends j{onKeyDown(t){switch(t.code){case"Enter":this.toggle(t),t.preventDefault();break;case"Space":this.toggle(t),t.preventDefault();break}}toggle(t){!this.$disabled()&&!(this.allowEmpty===!1&&this.checked)&&(this.checked=!this.checked,this.writeModelValue(this.checked),this.onModelChange(this.checked),this.onModelTouched(),this.onChange.emit({originalEvent:t,checked:this.checked}),this.cd.markForCheck())}onLabel="Yes";offLabel="No";onIcon;offIcon;ariaLabel;ariaLabelledBy;styleClass;inputId;tabindex=0;iconPos="left";autofocus;size;allowEmpty;fluid=L(void 0,{transform:s});onChange=new x;iconTemplate;contentTemplate;templates;checked=!1;ngOnInit(){super.ngOnInit(),(this.checked===null||this.checked===void 0)&&(this.checked=!1)}_componentStyle=M(ut);onBlur(){this.onModelTouched()}get hasOnLabel(){return this.onLabel&&this.onLabel.length>0}get hasOffLabel(){return this.offLabel&&this.offLabel.length>0}get active(){return this.checked===!0}_iconTemplate;_contentTemplate;ngAfterContentInit(){this.templates.forEach(t=>{switch(t.getType()){case"icon":this._iconTemplate=t.template;break;case"content":this._contentTemplate=t.template;break;default:this._contentTemplate=t.template;break}})}writeControlValue(t,n){this.checked=t,n(t),this.cd.markForCheck()}static \u0275fac=(()=>{let t;return function(o){return(t||(t=f(e)))(o||e)}})();static \u0275cmp=S({type:e,selectors:[["p-toggleButton"],["p-togglebutton"],["p-toggle-button"]],contentQueries:function(n,o,i){if(n&1&&(u(i,ht,4),u(i,yt,4),u(i,R,4)),n&2){let l;c(l=g())&&(o.iconTemplate=l.first),c(l=g())&&(o.contentTemplate=l.first),c(l=g())&&(o.templates=l)}},hostVars:7,hostBindings:function(n,o){n&1&&F("keydown",function(l){return o.onKeyDown(l)})("click",function(l){return o.toggle(l)}),n&2&&(h("aria-labelledby",o.ariaLabelledBy)("aria-label",o.ariaLabel)("aria-pressed",o.checked?"true":"false")("role","button")("tabindex",o.tabindex!==void 0?o.tabindex:o.$disabled()?-1:0),p(o.cn(o.cx("root"),o.styleClass)))},inputs:{onLabel:"onLabel",offLabel:"offLabel",onIcon:"onIcon",offIcon:"offIcon",ariaLabel:"ariaLabel",ariaLabelledBy:"ariaLabelledBy",styleClass:"styleClass",inputId:"inputId",tabindex:[2,"tabindex","tabindex",V],iconPos:"iconPos",autofocus:[2,"autofocus","autofocus",s],size:"size",allowEmpty:"allowEmpty",fluid:[1,"fluid"]},outputs:{onChange:"onChange"},features:[I([Et,ut]),J([lt]),D],decls:3,vars:7,consts:[[4,"ngTemplateOutlet","ngTemplateOutletContext"],[3,"class"]],template:function(n,o){n&1&&(T(0,"span"),m(1,_t,1,0,"ng-container",0),y(2,kt,4,5),k()),n&2&&(p(o.cx("content")),d(),v("ngTemplateOutlet",o.contentTemplate||o._contentTemplate)("ngTemplateOutletContext",q(5,ct,o.checked)),d(),_(o.contentTemplate?-1:2))},dependencies:[z,A,C],encapsulation:2,changeDetection:0})}return e})();var gt=`
    .p-selectbutton {
        display: inline-flex;
        user-select: none;
        vertical-align: bottom;
        outline-color: transparent;
        border-radius: dt('selectbutton.border.radius');
    }

    .p-selectbutton .p-togglebutton {
        border-radius: 0;
        border-width: 1px 1px 1px 0;
    }

    .p-selectbutton .p-togglebutton:focus-visible {
        position: relative;
        z-index: 1;
    }

    .p-selectbutton .p-togglebutton:first-child {
        border-inline-start-width: 1px;
        border-start-start-radius: dt('selectbutton.border.radius');
        border-end-start-radius: dt('selectbutton.border.radius');
    }

    .p-selectbutton .p-togglebutton:last-child {
        border-start-end-radius: dt('selectbutton.border.radius');
        border-end-end-radius: dt('selectbutton.border.radius');
    }

    .p-selectbutton.p-invalid {
        outline: 1px solid dt('selectbutton.invalid.border.color');
        outline-offset: 0;
    }

    .p-selectbutton-fluid {
        width: 100%;
    }
    
    .p-selectbutton-fluid .p-togglebutton {
        flex: 1 1 0;
    }
`;var Bt=["item"],Ot=(e,a)=>({$implicit:e,index:a});function Mt(e,a){return this.getOptionLabel(a)}function St(e,a){e&1&&w(0)}function Dt(e,a){if(e&1&&m(0,St,1,0,"ng-container",3),e&2){let t=r(2),n=t.$implicit,o=t.$index,i=r();v("ngTemplateOutlet",i.itemTemplate||i._itemTemplate)("ngTemplateOutletContext",ot(2,Ot,n,o))}}function Ft(e,a){e&1&&m(0,Dt,1,5,"ng-template",null,0,it)}function It(e,a){if(e&1){let t=tt();T(0,"p-togglebutton",2),F("onChange",function(o){let i=U(t),l=i.$implicit,b=i.$index,K=r();return Y(K.onOptionSelect(o,l,b))}),y(1,Ft,2,0),k()}if(e&2){let t=a.$implicit,n=r();v("autofocus",n.autofocus)("styleClass",n.styleClass)("ngModel",n.isSelected(t))("onLabel",n.getOptionLabel(t))("offLabel",n.getOptionLabel(t))("disabled",n.$disabled()||n.isOptionDisabled(t))("allowEmpty",n.getAllowEmpty())("size",n.size())("fluid",n.fluid()),d(),_(n.itemTemplate||n._itemTemplate?1:-1)}}var Vt=`
    ${gt}

    /* For PrimeNG */
    .p-selectbutton.ng-invalid.ng-dirty {
        outline: 1px solid dt('selectbutton.invalid.border.color');
        outline-offset: 0;
    }
`,At={root:({instance:e})=>["p-selectbutton p-component",{"p-invalid":e.invalid(),"p-selectbutton-fluid":e.fluid()}]},pt=(()=>{class e extends ${name="selectbutton";theme=Vt;classes=At;static \u0275fac=(()=>{let t;return function(o){return(t||(t=f(e)))(o||e)}})();static \u0275prov=O({token:e,factory:e.\u0275fac})}return e})();var zt={provide:Q,useExisting:B(()=>bt),multi:!0},bt=(()=>{class e extends j{options;optionLabel;optionValue;optionDisabled;get unselectable(){return this._unselectable}_unselectable=!1;set unselectable(t){this._unselectable=t,this.allowEmpty=!t}tabindex=0;multiple;allowEmpty=!0;styleClass;ariaLabelledBy;dataKey;autofocus;size=L();fluid=L(void 0,{transform:s});onOptionClick=new x;onChange=new x;itemTemplate;_itemTemplate;get equalityKey(){return this.optionValue?null:this.dataKey}value;focusedIndex=0;_componentStyle=M(pt);getAllowEmpty(){return this.multiple?this.allowEmpty||this.value?.length!==1:this.allowEmpty}getOptionLabel(t){return this.optionLabel?N(t,this.optionLabel):t.label!=null?t.label:t}getOptionValue(t){return this.optionValue?N(t,this.optionValue):this.optionLabel||t.value===void 0?t:t.value}isOptionDisabled(t){return this.optionDisabled?N(t,this.optionDisabled):t.disabled!==void 0?t.disabled:!1}onOptionSelect(t,n,o){if(this.$disabled()||this.isOptionDisabled(n))return;let i=this.isSelected(n);if(i&&this.unselectable)return;let l=this.getOptionValue(n),b;if(this.multiple)i?b=this.value.filter(K=>!E(K,l,this.equalityKey||void 0)):b=this.value?[...this.value,l]:[l];else{if(i&&!this.allowEmpty)return;b=i?null:l}this.focusedIndex=o,this.value=b,this.writeModelValue(this.value),this.onModelChange(this.value),this.onChange.emit({originalEvent:t,value:this.value}),this.onOptionClick.emit({originalEvent:t,option:n,index:o})}changeTabIndexes(t,n){let o,i;for(let l=0;l<=this.el.nativeElement.children.length-1;l++)this.el.nativeElement.children[l].getAttribute("tabindex")==="0"&&(o={elem:this.el.nativeElement.children[l],index:l});n==="prev"?o.index===0?i=this.el.nativeElement.children.length-1:i=o.index-1:o.index===this.el.nativeElement.children.length-1?i=0:i=o.index+1,this.focusedIndex=i,this.el.nativeElement.children[i].focus()}onFocus(t,n){this.focusedIndex=n}onBlur(){this.onModelTouched()}removeOption(t){this.value=this.value.filter(n=>!E(n,this.getOptionValue(t),this.dataKey))}isSelected(t){let n=!1,o=this.getOptionValue(t);if(this.multiple){if(this.value&&Array.isArray(this.value)){for(let i of this.value)if(E(i,o,this.dataKey)){n=!0;break}}}else n=E(this.getOptionValue(t),this.value,this.equalityKey||void 0);return n}templates;ngAfterContentInit(){this.templates.forEach(t=>{switch(t.getType()){case"item":this._itemTemplate=t.template;break}})}writeControlValue(t,n){this.value=t,n(this.value),this.cd.markForCheck()}static \u0275fac=(()=>{let t;return function(o){return(t||(t=f(e)))(o||e)}})();static \u0275cmp=S({type:e,selectors:[["p-selectButton"],["p-selectbutton"],["p-select-button"]],contentQueries:function(n,o,i){if(n&1&&(u(i,Bt,4),u(i,R,4)),n&2){let l;c(l=g())&&(o.itemTemplate=l.first),c(l=g())&&(o.templates=l)}},hostVars:6,hostBindings:function(n,o){n&2&&(h("role","group")("aria-labelledby",o.ariaLabelledBy)("data-pc-section","root")("data-pc-name","selectbutton"),p(o.cx("root")))},inputs:{options:"options",optionLabel:"optionLabel",optionValue:"optionValue",optionDisabled:"optionDisabled",unselectable:[2,"unselectable","unselectable",s],tabindex:[2,"tabindex","tabindex",V],multiple:[2,"multiple","multiple",s],allowEmpty:[2,"allowEmpty","allowEmpty",s],styleClass:"styleClass",ariaLabelledBy:"ariaLabelledBy",dataKey:"dataKey",autofocus:[2,"autofocus","autofocus",s],size:[1,"size"],fluid:[1,"fluid"]},outputs:{onOptionClick:"onOptionClick",onChange:"onChange"},features:[I([zt,pt]),D],decls:2,vars:0,consts:[["content",""],[3,"autofocus","styleClass","ngModel","onLabel","offLabel","disabled","allowEmpty","size","fluid"],[3,"onChange","autofocus","styleClass","ngModel","onLabel","offLabel","disabled","allowEmpty","size","fluid"],[4,"ngTemplateOutlet","ngTemplateOutletContext"]],template:function(n,o){n&1&&W(0,It,2,10,"p-togglebutton",1,Mt,!0),n&2&&X(o.options)},dependencies:[G,st,at,rt,z,A,C],encapsulation:2,changeDetection:0})}return e})(),Te=(()=>{class e{static \u0275fac=function(n){return new(n||e)};static \u0275mod=H({type:e});static \u0275inj=P({imports:[bt,C,C]})}return e})();export{bt as a,Te as b};
