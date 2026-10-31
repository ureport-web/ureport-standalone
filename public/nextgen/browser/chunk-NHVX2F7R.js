import{a as P}from"./chunk-JHLT2AQK.js";import{a as K,e as at,i as rt,s as st}from"./chunk-Z75BA7OF.js";import{N as $,O as E,ea as Q,fa as d,ja as j,ya as lt}from"./chunk-PDM76P6X.js";import{Ab as X,Bb as C,Cb as T,Db as k,Dc as it,Eb as Z,Kb as w,Kc as L,Lb as tt,Nb as V,Pb as r,Pc as s,Qc as z,Sa as u,Sb as c,U as B,Ub as g,V as O,Vb as p,W as M,_ as S,ac as b,bc as et,cc as nt,db as D,ea as U,eb as F,ed as N,fa as Y,hb as I,ib as J,jb as h,kd as R,lb as x,pc as A,rc as G,sa as m,sc as ot,vb as y,wb as _,xb as v,zb as W}from"./chunk-OLNYQ364.js";var dt=`
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
`;var ht=["icon"],yt=["content"],ct=e=>({$implicit:e});function _t(e,a){e&1&&w(0)}function vt(e,a){if(e&1&&Z(0,"span"),e&2){let t=r(3);b(t.cn(t.cx("icon"),t.checked?t.onIcon:t.offIcon,t.iconPos==="left"?t.cx("iconLeft"):t.cx("iconRight"))),y("data-pc-section","icon")}}function Ct(e,a){if(e&1&&_(0,vt,1,3,"span",1),e&2){let t=r(2);v(t.onIcon||t.offIcon?0:-1)}}function xt(e,a){e&1&&w(0)}function Tt(e,a){if(e&1&&h(0,xt,1,0,"ng-container",0),e&2){let t=r(2);C("ngTemplateOutlet",t.iconTemplate||t._iconTemplate)("ngTemplateOutletContext",G(2,ct,t.checked))}}function kt(e,a){if(e&1&&(_(0,Ct,1,1)(1,Tt,1,4,"ng-container"),T(2,"span"),et(3),k()),e&2){let t=r();v(t.iconTemplate?1:0),u(2),b(t.cx("label")),y("data-pc-section","label"),u(),nt(t.checked?t.hasOnLabel?t.onLabel:"\xA0":t.hasOffLabel?t.offLabel:"\xA0")}}var wt=`
    ${dt}

    /* For PrimeNG (iconPos) */
    .p-togglebutton-icon-right {
        order: 1;
    }

    .p-togglebutton.ng-invalid.ng-dirty {
        border-color: dt('togglebutton.invalid.border.color');
    }
`,Lt={root:({instance:e})=>["p-togglebutton p-component",{"p-togglebutton-checked":e.checked,"p-invalid":e.invalid(),"p-disabled":e.$disabled(),"p-togglebutton-sm p-inputfield-sm":e.size==="small","p-togglebutton-lg p-inputfield-lg":e.size==="large","p-togglebutton-fluid":e.fluid()}],content:"p-togglebutton-content",icon:"p-togglebutton-icon",iconLeft:"p-togglebutton-icon-left",iconRight:"p-togglebutton-icon-right",label:"p-togglebutton-label"},ut=(()=>{class e extends j{name="togglebutton";theme=wt;classes=Lt;static \u0275fac=(()=>{let t;return function(o){return(t||(t=m(e)))(o||e)}})();static \u0275prov=O({token:e,factory:e.\u0275fac})}return e})();var Et={provide:K,useExisting:B(()=>H),multi:!0},H=(()=>{class e extends P{onKeyDown(t){switch(t.code){case"Enter":this.toggle(t),t.preventDefault();break;case"Space":this.toggle(t),t.preventDefault();break}}toggle(t){!this.$disabled()&&!(this.allowEmpty===!1&&this.checked)&&(this.checked=!this.checked,this.writeModelValue(this.checked),this.onModelChange(this.checked),this.onModelTouched(),this.onChange.emit({originalEvent:t,checked:this.checked}),this.cd.markForCheck())}onLabel="Yes";offLabel="No";onIcon;offIcon;ariaLabel;ariaLabelledBy;styleClass;inputId;tabindex=0;iconPos="left";autofocus;size;allowEmpty;fluid=L(void 0,{transform:s});onChange=new x;iconTemplate;contentTemplate;templates;checked=!1;ngOnInit(){super.ngOnInit(),(this.checked===null||this.checked===void 0)&&(this.checked=!1)}_componentStyle=S(ut);onBlur(){this.onModelTouched()}get hasOnLabel(){return this.onLabel&&this.onLabel.length>0}get hasOffLabel(){return this.offLabel&&this.offLabel.length>0}get active(){return this.checked===!0}_iconTemplate;_contentTemplate;ngAfterContentInit(){this.templates.forEach(t=>{switch(t.getType()){case"icon":this._iconTemplate=t.template;break;case"content":this._contentTemplate=t.template;break;default:this._contentTemplate=t.template;break}})}writeControlValue(t,n){this.checked=t,n(t),this.cd.markForCheck()}static \u0275fac=(()=>{let t;return function(o){return(t||(t=m(e)))(o||e)}})();static \u0275cmp=D({type:e,selectors:[["p-toggleButton"],["p-togglebutton"],["p-toggle-button"]],contentQueries:function(n,o,i){if(n&1&&(c(i,ht,4),c(i,yt,4),c(i,Q,4)),n&2){let l;g(l=p())&&(o.iconTemplate=l.first),g(l=p())&&(o.contentTemplate=l.first),g(l=p())&&(o.templates=l)}},hostVars:7,hostBindings:function(n,o){n&1&&V("keydown",function(l){return o.onKeyDown(l)})("click",function(l){return o.toggle(l)}),n&2&&(y("aria-labelledby",o.ariaLabelledBy)("aria-label",o.ariaLabel)("aria-pressed",o.checked?"true":"false")("role","button")("tabindex",o.tabindex!==void 0?o.tabindex:o.$disabled()?-1:0),b(o.cn(o.cx("root"),o.styleClass)))},inputs:{onLabel:"onLabel",offLabel:"offLabel",onIcon:"onIcon",offIcon:"offIcon",ariaLabel:"ariaLabel",ariaLabelledBy:"ariaLabelledBy",styleClass:"styleClass",inputId:"inputId",tabindex:[2,"tabindex","tabindex",z],iconPos:"iconPos",autofocus:[2,"autofocus","autofocus",s],size:"size",allowEmpty:"allowEmpty",fluid:[1,"fluid"]},outputs:{onChange:"onChange"},features:[A([Et,ut]),J([lt]),I],decls:3,vars:7,consts:[[4,"ngTemplateOutlet","ngTemplateOutletContext"],[3,"class"]],template:function(n,o){n&1&&(T(0,"span"),h(1,_t,1,0,"ng-container",0),_(2,kt,4,5),k()),n&2&&(b(o.cx("content")),u(),C("ngTemplateOutlet",o.contentTemplate||o._contentTemplate)("ngTemplateOutletContext",G(5,ct,o.checked)),u(),v(o.contentTemplate?-1:2))},dependencies:[R,N,d],encapsulation:2,changeDetection:0})}return e})(),ne=(()=>{class e{static \u0275fac=function(n){return new(n||e)};static \u0275mod=F({type:e});static \u0275inj=M({imports:[H,d,d]})}return e})();var gt=`
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
`;var Bt=["item"],Ot=(e,a)=>({$implicit:e,index:a});function Mt(e,a){return this.getOptionLabel(a)}function St(e,a){e&1&&w(0)}function Dt(e,a){if(e&1&&h(0,St,1,0,"ng-container",3),e&2){let t=r(2),n=t.$implicit,o=t.$index,i=r();C("ngTemplateOutlet",i.itemTemplate||i._itemTemplate)("ngTemplateOutletContext",ot(2,Ot,n,o))}}function Ft(e,a){e&1&&h(0,Dt,1,5,"ng-template",null,0,it)}function It(e,a){if(e&1){let t=tt();T(0,"p-togglebutton",2),V("onChange",function(o){let i=U(t),l=i.$implicit,f=i.$index,q=r();return Y(q.onOptionSelect(o,l,f))}),_(1,Ft,2,0),k()}if(e&2){let t=a.$implicit,n=r();C("autofocus",n.autofocus)("styleClass",n.styleClass)("ngModel",n.isSelected(t))("onLabel",n.getOptionLabel(t))("offLabel",n.getOptionLabel(t))("disabled",n.$disabled()||n.isOptionDisabled(t))("allowEmpty",n.getAllowEmpty())("size",n.size())("fluid",n.fluid()),u(),v(n.itemTemplate||n._itemTemplate?1:-1)}}var Vt=`
    ${gt}

    /* For PrimeNG */
    .p-selectbutton.ng-invalid.ng-dirty {
        outline: 1px solid dt('selectbutton.invalid.border.color');
        outline-offset: 0;
    }
`,At={root:({instance:e})=>["p-selectbutton p-component",{"p-invalid":e.invalid(),"p-selectbutton-fluid":e.fluid()}]},pt=(()=>{class e extends j{name="selectbutton";theme=Vt;classes=At;static \u0275fac=(()=>{let t;return function(o){return(t||(t=m(e)))(o||e)}})();static \u0275prov=O({token:e,factory:e.\u0275fac})}return e})();var zt={provide:K,useExisting:B(()=>bt),multi:!0},bt=(()=>{class e extends P{options;optionLabel;optionValue;optionDisabled;get unselectable(){return this._unselectable}_unselectable=!1;set unselectable(t){this._unselectable=t,this.allowEmpty=!t}tabindex=0;multiple;allowEmpty=!0;styleClass;ariaLabelledBy;dataKey;autofocus;size=L();fluid=L(void 0,{transform:s});onOptionClick=new x;onChange=new x;itemTemplate;_itemTemplate;get equalityKey(){return this.optionValue?null:this.dataKey}value;focusedIndex=0;_componentStyle=S(pt);getAllowEmpty(){return this.multiple?this.allowEmpty||this.value?.length!==1:this.allowEmpty}getOptionLabel(t){return this.optionLabel?$(t,this.optionLabel):t.label!=null?t.label:t}getOptionValue(t){return this.optionValue?$(t,this.optionValue):this.optionLabel||t.value===void 0?t:t.value}isOptionDisabled(t){return this.optionDisabled?$(t,this.optionDisabled):t.disabled!==void 0?t.disabled:!1}onOptionSelect(t,n,o){if(this.$disabled()||this.isOptionDisabled(n))return;let i=this.isSelected(n);if(i&&this.unselectable)return;let l=this.getOptionValue(n),f;if(this.multiple)i?f=this.value.filter(q=>!E(q,l,this.equalityKey||void 0)):f=this.value?[...this.value,l]:[l];else{if(i&&!this.allowEmpty)return;f=i?null:l}this.focusedIndex=o,this.value=f,this.writeModelValue(this.value),this.onModelChange(this.value),this.onChange.emit({originalEvent:t,value:this.value}),this.onOptionClick.emit({originalEvent:t,option:n,index:o})}changeTabIndexes(t,n){let o,i;for(let l=0;l<=this.el.nativeElement.children.length-1;l++)this.el.nativeElement.children[l].getAttribute("tabindex")==="0"&&(o={elem:this.el.nativeElement.children[l],index:l});n==="prev"?o.index===0?i=this.el.nativeElement.children.length-1:i=o.index-1:o.index===this.el.nativeElement.children.length-1?i=0:i=o.index+1,this.focusedIndex=i,this.el.nativeElement.children[i].focus()}onFocus(t,n){this.focusedIndex=n}onBlur(){this.onModelTouched()}removeOption(t){this.value=this.value.filter(n=>!E(n,this.getOptionValue(t),this.dataKey))}isSelected(t){let n=!1,o=this.getOptionValue(t);if(this.multiple){if(this.value&&Array.isArray(this.value)){for(let i of this.value)if(E(i,o,this.dataKey)){n=!0;break}}}else n=E(this.getOptionValue(t),this.value,this.equalityKey||void 0);return n}templates;ngAfterContentInit(){this.templates.forEach(t=>{switch(t.getType()){case"item":this._itemTemplate=t.template;break}})}writeControlValue(t,n){this.value=t,n(this.value),this.cd.markForCheck()}static \u0275fac=(()=>{let t;return function(o){return(t||(t=m(e)))(o||e)}})();static \u0275cmp=D({type:e,selectors:[["p-selectButton"],["p-selectbutton"],["p-select-button"]],contentQueries:function(n,o,i){if(n&1&&(c(i,Bt,4),c(i,Q,4)),n&2){let l;g(l=p())&&(o.itemTemplate=l.first),g(l=p())&&(o.templates=l)}},hostVars:6,hostBindings:function(n,o){n&2&&(y("role","group")("aria-labelledby",o.ariaLabelledBy)("data-pc-section","root")("data-pc-name","selectbutton"),b(o.cx("root")))},inputs:{options:"options",optionLabel:"optionLabel",optionValue:"optionValue",optionDisabled:"optionDisabled",unselectable:[2,"unselectable","unselectable",s],tabindex:[2,"tabindex","tabindex",z],multiple:[2,"multiple","multiple",s],allowEmpty:[2,"allowEmpty","allowEmpty",s],styleClass:"styleClass",ariaLabelledBy:"ariaLabelledBy",dataKey:"dataKey",autofocus:[2,"autofocus","autofocus",s],size:[1,"size"],fluid:[1,"fluid"]},outputs:{onOptionClick:"onOptionClick",onChange:"onChange"},features:[A([zt,pt]),I],decls:2,vars:0,consts:[["content",""],[3,"autofocus","styleClass","ngModel","onLabel","offLabel","disabled","allowEmpty","size","fluid"],[3,"onChange","autofocus","styleClass","ngModel","onLabel","offLabel","disabled","allowEmpty","size","fluid"],[4,"ngTemplateOutlet","ngTemplateOutletContext"]],template:function(n,o){n&1&&W(0,It,2,10,"p-togglebutton",1,Mt,!0),n&2&&X(o.options)},dependencies:[H,st,at,rt,R,N,d],encapsulation:2,changeDetection:0})}return e})(),ke=(()=>{class e{static \u0275fac=function(n){return new(n||e)};static \u0275mod=F({type:e});static \u0275inj=M({imports:[bt,d,d]})}return e})();export{H as a,ne as b,bt as c,ke as d};
