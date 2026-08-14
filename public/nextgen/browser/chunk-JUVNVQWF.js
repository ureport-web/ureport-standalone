import{a as ie}from"./chunk-TOOBAN2B.js";import{a as ce}from"./chunk-ZQAL63YE.js";import{a as de}from"./chunk-XPCFMQKX.js";import{a as ae,d as re}from"./chunk-R5JLPY2G.js";import{R as ne,S as te,ha as oe,ia as p,ma as C,pa as j}from"./chunk-2RNUAYGM.js";import{$b as c,$c as Y,Ab as d,Bb as N,Cb as O,Db as z,Hb as L,Hc as J,Ib as P,Kb as H,Kc as A,Mb as G,Ob as g,Pb as D,Pc as M,Qb as B,Qc as W,Ra as l,Rb as Q,Sb as U,T as $,Tb as T,U as h,Ub as S,V as u,Z as b,_b as K,cb as f,cd as Z,da as w,db as m,ea as F,fa as E,gb as k,gd as ee,ib as I,kb as V,ld as v,na as q,pc as y,qa as R,ra as r,sc as X,ub as x}from"./chunk-TNSOJGLR.js";var se=`
    .p-checkbox {
        position: relative;
        display: inline-flex;
        user-select: none;
        vertical-align: bottom;
        width: dt('checkbox.width');
        height: dt('checkbox.height');
    }

    .p-checkbox-input {
        cursor: pointer;
        appearance: none;
        position: absolute;
        inset-block-start: 0;
        inset-inline-start: 0;
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
        opacity: 0;
        z-index: 1;
        outline: 0 none;
        border: 1px solid transparent;
        border-radius: dt('checkbox.border.radius');
    }

    .p-checkbox-box {
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: dt('checkbox.border.radius');
        border: 1px solid dt('checkbox.border.color');
        background: dt('checkbox.background');
        width: dt('checkbox.width');
        height: dt('checkbox.height');
        transition:
            background dt('checkbox.transition.duration'),
            color dt('checkbox.transition.duration'),
            border-color dt('checkbox.transition.duration'),
            box-shadow dt('checkbox.transition.duration'),
            outline-color dt('checkbox.transition.duration');
        outline-color: transparent;
        box-shadow: dt('checkbox.shadow');
    }

    .p-checkbox-icon {
        transition-duration: dt('checkbox.transition.duration');
        color: dt('checkbox.icon.color');
        font-size: dt('checkbox.icon.size');
        width: dt('checkbox.icon.size');
        height: dt('checkbox.icon.size');
    }

    .p-checkbox:not(.p-disabled):has(.p-checkbox-input:hover) .p-checkbox-box {
        border-color: dt('checkbox.hover.border.color');
    }

    .p-checkbox-checked .p-checkbox-box {
        border-color: dt('checkbox.checked.border.color');
        background: dt('checkbox.checked.background');
    }

    .p-checkbox-checked .p-checkbox-icon {
        color: dt('checkbox.icon.checked.color');
    }

    .p-checkbox-checked:not(.p-disabled):has(.p-checkbox-input:hover) .p-checkbox-box {
        background: dt('checkbox.checked.hover.background');
        border-color: dt('checkbox.checked.hover.border.color');
    }

    .p-checkbox-checked:not(.p-disabled):has(.p-checkbox-input:hover) .p-checkbox-icon {
        color: dt('checkbox.icon.checked.hover.color');
    }

    .p-checkbox:not(.p-disabled):has(.p-checkbox-input:focus-visible) .p-checkbox-box {
        border-color: dt('checkbox.focus.border.color');
        box-shadow: dt('checkbox.focus.ring.shadow');
        outline: dt('checkbox.focus.ring.width') dt('checkbox.focus.ring.style') dt('checkbox.focus.ring.color');
        outline-offset: dt('checkbox.focus.ring.offset');
    }

    .p-checkbox-checked:not(.p-disabled):has(.p-checkbox-input:focus-visible) .p-checkbox-box {
        border-color: dt('checkbox.checked.focus.border.color');
    }

    .p-checkbox.p-invalid > .p-checkbox-box {
        border-color: dt('checkbox.invalid.border.color');
    }

    .p-checkbox.p-variant-filled .p-checkbox-box {
        background: dt('checkbox.filled.background');
    }

    .p-checkbox-checked.p-variant-filled .p-checkbox-box {
        background: dt('checkbox.checked.background');
    }

    .p-checkbox-checked.p-variant-filled:not(.p-disabled):has(.p-checkbox-input:hover) .p-checkbox-box {
        background: dt('checkbox.checked.hover.background');
    }

    .p-checkbox.p-disabled {
        opacity: 1;
    }

    .p-checkbox.p-disabled .p-checkbox-box {
        background: dt('checkbox.disabled.background');
        border-color: dt('checkbox.checked.disabled.border.color');
    }

    .p-checkbox.p-disabled .p-checkbox-box .p-checkbox-icon {
        color: dt('checkbox.icon.disabled.color');
    }

    .p-checkbox-sm,
    .p-checkbox-sm .p-checkbox-box {
        width: dt('checkbox.sm.width');
        height: dt('checkbox.sm.height');
    }

    .p-checkbox-sm .p-checkbox-icon {
        font-size: dt('checkbox.icon.sm.size');
        width: dt('checkbox.icon.sm.size');
        height: dt('checkbox.icon.sm.size');
    }

    .p-checkbox-lg,
    .p-checkbox-lg .p-checkbox-box {
        width: dt('checkbox.lg.width');
        height: dt('checkbox.lg.height');
    }

    .p-checkbox-lg .p-checkbox-icon {
        font-size: dt('checkbox.icon.lg.size');
        width: dt('checkbox.icon.lg.size');
        height: dt('checkbox.icon.lg.size');
    }
`;var me=["icon"],ke=["input"],xe=(e,s)=>({checked:e,class:s});function ge(e,s){if(e&1&&z(0,"span",7),e&2){let t=g(3);c(t.cx("icon")),d("ngClass",t.checkboxIcon),x("data-pc-section","icon")}}function ye(e,s){if(e&1&&(E(),z(0,"svg",8)),e&2){let t=g(3);c(t.cx("icon")),x("data-pc-section","icon")}}function ve(e,s){if(e&1&&(L(0),I(1,ge,1,4,"span",5)(2,ye,1,3,"svg",6),P()),e&2){let t=g(2);l(),d("ngIf",t.checkboxIcon),l(),d("ngIf",!t.checkboxIcon)}}function Ce(e,s){if(e&1&&(E(),z(0,"svg",9)),e&2){let t=g(2);c(t.cx("icon")),x("data-pc-section","icon")}}function _e(e,s){if(e&1&&(L(0),I(1,ve,3,2,"ng-container",2)(2,Ce,1,3,"svg",4),P()),e&2){let t=g();l(),d("ngIf",t.checked),l(),d("ngIf",t._indeterminate())}}function Ie(e,s){}function Me(e,s){e&1&&I(0,Ie,0,0,"ng-template")}var we=`
    ${se}

    /* For PrimeNG */
    p-checkBox.ng-invalid.ng-dirty .p-checkbox-box,
    p-check-box.ng-invalid.ng-dirty .p-checkbox-box,
    p-checkbox.ng-invalid.ng-dirty .p-checkbox-box {
        border-color: dt('checkbox.invalid.border.color');
    }
`,Fe={root:({instance:e})=>["p-checkbox p-component",{"p-checkbox-checked p-highlight":e.checked,"p-disabled":e.$disabled(),"p-invalid":e.invalid(),"p-variant-filled":e.$variant()==="filled","p-checkbox-sm p-inputfield-sm":e.size()==="small","p-checkbox-lg p-inputfield-lg":e.size()==="large"}],box:"p-checkbox-box",input:"p-checkbox-input",icon:"p-checkbox-icon"},le=(()=>{class e extends C{name="checkbox";theme=we;classes=Fe;static \u0275fac=(()=>{let t;return function(n){return(t||(t=r(e)))(n||e)}})();static \u0275prov=h({token:e,factory:e.\u0275fac})}return e})();var Ve={provide:ae,useExisting:$(()=>he),multi:!0},he=(()=>{class e extends de{value;binary;ariaLabelledBy;ariaLabel;tabindex;inputId;inputStyle;styleClass;inputClass;indeterminate=!1;formControl;checkboxIcon;readonly;autofocus;trueValue=!0;falseValue=!1;variant=A();size=A();onChange=new V;onFocus=new V;onBlur=new V;inputViewChild;get checked(){return this._indeterminate()?!1:this.binary?this.modelValue()===this.trueValue:te(this.value,this.modelValue())}_indeterminate=q(void 0);checkboxIconTemplate;templates;_checkboxIconTemplate;focused=!1;_componentStyle=b(le);$variant=J(()=>this.variant()||this.config.inputStyle()||this.config.inputVariant());ngAfterContentInit(){this.templates?.forEach(t=>{switch(t.getType()){case"icon":this._checkboxIconTemplate=t.template;break;case"checkboxicon":this._checkboxIconTemplate=t.template;break}})}ngOnChanges(t){super.ngOnChanges(t),t.indeterminate&&this._indeterminate.set(t.indeterminate.currentValue)}updateModel(t){let o,n=this.injector.get(re,null,{optional:!0,self:!0}),i=n&&!this.formControl?n.value:this.modelValue();this.binary?(o=this._indeterminate()?this.trueValue:this.checked?this.falseValue:this.trueValue,this.writeModelValue(o),this.onModelChange(o)):(this.checked||this._indeterminate()?o=i.filter(a=>!ne(a,this.value)):o=i?[...i,this.value]:[this.value],this.onModelChange(o),this.writeModelValue(o),this.formControl&&this.formControl.setValue(o)),this._indeterminate()&&this._indeterminate.set(!1),this.onChange.emit({checked:o,originalEvent:t})}handleChange(t){this.readonly||this.updateModel(t)}onInputFocus(t){this.focused=!0,this.onFocus.emit(t)}onInputBlur(t){this.focused=!1,this.onBlur.emit(t),this.onModelTouched()}focus(){this.inputViewChild?.nativeElement.focus()}writeControlValue(t,o){o(t),this.cd.markForCheck()}static \u0275fac=(()=>{let t;return function(n){return(t||(t=r(e)))(n||e)}})();static \u0275cmp=f({type:e,selectors:[["p-checkbox"],["p-checkBox"],["p-check-box"]],contentQueries:function(o,n,i){if(o&1&&(Q(i,me,4),Q(i,oe,4)),o&2){let a;T(a=S())&&(n.checkboxIconTemplate=a.first),T(a=S())&&(n.templates=a)}},viewQuery:function(o,n){if(o&1&&U(ke,5),o&2){let i;T(i=S())&&(n.inputViewChild=i.first)}},hostVars:6,hostBindings:function(o,n){o&2&&(x("data-pc-name","checkbox")("data-p-highlight",n.checked)("data-p-checked",n.checked)("data-p-disabled",n.$disabled()),c(n.cn(n.cx("root"),n.styleClass)))},inputs:{value:"value",binary:[2,"binary","binary",M],ariaLabelledBy:"ariaLabelledBy",ariaLabel:"ariaLabel",tabindex:[2,"tabindex","tabindex",W],inputId:"inputId",inputStyle:"inputStyle",styleClass:"styleClass",inputClass:"inputClass",indeterminate:[2,"indeterminate","indeterminate",M],formControl:"formControl",checkboxIcon:"checkboxIcon",readonly:[2,"readonly","readonly",M],autofocus:[2,"autofocus","autofocus",M],trueValue:"trueValue",falseValue:"falseValue",variant:[1,"variant"],size:[1,"size"]},outputs:{onChange:"onChange",onFocus:"onFocus",onBlur:"onBlur"},features:[y([Ve,le]),k,R],decls:5,vars:22,consts:[["input",""],["type","checkbox",3,"focus","blur","change","checked"],[4,"ngIf"],[4,"ngTemplateOutlet","ngTemplateOutletContext"],["data-p-icon","minus",3,"class",4,"ngIf"],[3,"class","ngClass",4,"ngIf"],["data-p-icon","check",3,"class",4,"ngIf"],[3,"ngClass"],["data-p-icon","check"],["data-p-icon","minus"]],template:function(o,n){if(o&1){let i=H();N(0,"input",1,0),G("focus",function(_){return w(i),F(n.onInputFocus(_))})("blur",function(_){return w(i),F(n.onInputBlur(_))})("change",function(_){return w(i),F(n.handleChange(_))}),O(),N(2,"div"),I(3,_e,3,2,"ng-container",2)(4,Me,1,0,null,3),O()}o&2&&(K(n.inputStyle),c(n.cn(n.cx("input"),n.inputClass)),d("checked",n.checked),x("id",n.inputId)("value",n.value)("name",n.name())("tabindex",n.tabindex)("required",n.required()?"":void 0)("readonly",n.readonly?"":void 0)("disabled",n.$disabled()?"":void 0)("aria-labelledby",n.ariaLabelledBy)("aria-label",n.ariaLabel),l(2),c(n.cx("box")),l(),d("ngIf",!n.checkboxIconTemplate&&!n._checkboxIconTemplate),l(),d("ngTemplateOutlet",n.checkboxIconTemplate||n._checkboxIconTemplate)("ngTemplateOutletContext",X(19,xe,n.checked,n.cx("icon"))))},dependencies:[v,Y,Z,ee,p,ie,ce],encapsulation:2,changeDetection:0})}return e})(),on=(()=>{class e{static \u0275fac=function(o){return new(o||e)};static \u0275mod=m({type:e});static \u0275inj=u({imports:[he,p,p]})}return e})();var ue=`
    .p-iconfield {
        position: relative;
        display: block;
    }

    .p-inputicon {
        position: absolute;
        top: 50%;
        margin-top: calc(-1 * (dt('icon.size') / 2));
        color: dt('iconfield.icon.color');
        line-height: 1;
        z-index: 1;
    }

    .p-iconfield .p-inputicon:first-child {
        inset-inline-start: dt('form.field.padding.x');
    }

    .p-iconfield .p-inputicon:last-child {
        inset-inline-end: dt('form.field.padding.x');
    }

    .p-iconfield .p-inputtext:not(:first-child),
    .p-iconfield .p-inputwrapper:not(:first-child) .p-inputtext {
        padding-inline-start: calc((dt('form.field.padding.x') * 2) + dt('icon.size'));
    }

    .p-iconfield .p-inputtext:not(:last-child) {
        padding-inline-end: calc((dt('form.field.padding.x') * 2) + dt('icon.size'));
    }

    .p-iconfield:has(.p-inputfield-sm) .p-inputicon {
        font-size: dt('form.field.sm.font.size');
        width: dt('form.field.sm.font.size');
        height: dt('form.field.sm.font.size');
        margin-top: calc(-1 * (dt('form.field.sm.font.size') / 2));
    }

    .p-iconfield:has(.p-inputfield-lg) .p-inputicon {
        font-size: dt('form.field.lg.font.size');
        width: dt('form.field.lg.font.size');
        height: dt('form.field.lg.font.size');
        margin-top: calc(-1 * (dt('form.field.lg.font.size') / 2));
    }
`;var ze=["*"],De={root:({instance:e})=>["p-iconfield",{"p-iconfield-left":e.iconPosition=="left","p-iconfield-right":e.iconPosition=="right"}]},be=(()=>{class e extends C{name="iconfield";theme=ue;classes=De;static \u0275fac=(()=>{let t;return function(n){return(t||(t=r(e)))(n||e)}})();static \u0275prov=h({token:e,factory:e.\u0275fac})}return e})();var Be=(()=>{class e extends j{iconPosition="left";styleClass;_componentStyle=b(be);static \u0275fac=(()=>{let t;return function(n){return(t||(t=r(e)))(n||e)}})();static \u0275cmp=f({type:e,selectors:[["p-iconfield"],["p-iconField"],["p-icon-field"]],hostVars:2,hostBindings:function(o,n){o&2&&c(n.cn(n.cx("root"),n.styleClass))},inputs:{iconPosition:"iconPosition",styleClass:"styleClass"},features:[y([be]),k],ngContentSelectors:ze,decls:1,vars:0,template:function(o,n){o&1&&(D(),B(0))},dependencies:[v],encapsulation:2,changeDetection:0})}return e})(),xn=(()=>{class e{static \u0275fac=function(o){return new(o||e)};static \u0275mod=m({type:e});static \u0275inj=u({imports:[Be]})}return e})();var Te=["*"],Se={root:"p-inputicon"},fe=(()=>{class e extends C{name="inputicon";classes=Se;static \u0275fac=(()=>{let t;return function(n){return(t||(t=r(e)))(n||e)}})();static \u0275prov=h({token:e,factory:e.\u0275fac})}return e})(),je=(()=>{class e extends j{styleClass;_componentStyle=b(fe);static \u0275fac=(()=>{let t;return function(n){return(t||(t=r(e)))(n||e)}})();static \u0275cmp=f({type:e,selectors:[["p-inputicon"],["p-inputIcon"]],hostVars:2,hostBindings:function(o,n){o&2&&c(n.cn(n.cx("root"),n.styleClass))},inputs:{styleClass:"styleClass"},features:[y([fe]),k],ngContentSelectors:Te,decls:1,vars:0,template:function(o,n){o&1&&(D(),B(0))},dependencies:[v,p],encapsulation:2,changeDetection:0})}return e})(),Bn=(()=>{class e{static \u0275fac=function(o){return new(o||e)};static \u0275mod=m({type:e});static \u0275inj=u({imports:[je,p,p]})}return e})();export{he as a,on as b,Be as c,xn as d,je as e,Bn as f};
