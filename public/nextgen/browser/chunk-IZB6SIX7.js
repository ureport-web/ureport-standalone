import{a as re}from"./chunk-DMZ2J4OC.js";import{a as le}from"./chunk-K3OP2MTM.js";import{q as de,t as se}from"./chunk-VLCNFVFY.js";import{R as oe,S as ie,ha as ce,ia as u,ma as v,pa as E,qa as ae}from"./chunk-LEZ7STAA.js";import{$b as a,Ab as d,Bb as N,Cb as L,Db as z,Gb as H,Gc as W,Hb as O,Ib as P,Jc as A,Kb as U,Mb as K,Ob as g,Oc as w,Pb as B,Pc as Y,Qb as T,Ra as l,Rb as Q,Sb as X,T as q,Tb as S,U as b,Ub as j,V as f,Z as m,_b as Z,_c as ee,bd as ne,cb as p,da as F,db as k,ea as V,fa as I,fd as te,gb as h,ib as M,kb as D,kd as C,na as R,oc as y,qa as G,ra as c,rc as J,ub as x}from"./chunk-MVGH6UWW.js";var xe=["data-p-icon","check"],pe=(()=>{class e extends ae{static \u0275fac=(()=>{let t;return function(n){return(t||(t=c(e)))(n||e)}})();static \u0275cmp=p({type:e,selectors:[["","data-p-icon","check"]],features:[h],attrs:xe,decls:1,vars:0,consts:[["d","M4.86199 11.5948C4.78717 11.5923 4.71366 11.5745 4.64596 11.5426C4.57826 11.5107 4.51779 11.4652 4.46827 11.4091L0.753985 7.69483C0.683167 7.64891 0.623706 7.58751 0.580092 7.51525C0.536478 7.44299 0.509851 7.36177 0.502221 7.27771C0.49459 7.19366 0.506156 7.10897 0.536046 7.03004C0.565935 6.95111 0.613367 6.88 0.674759 6.82208C0.736151 6.76416 0.8099 6.72095 0.890436 6.69571C0.970973 6.67046 1.05619 6.66385 1.13966 6.67635C1.22313 6.68886 1.30266 6.72017 1.37226 6.76792C1.44186 6.81567 1.4997 6.8786 1.54141 6.95197L4.86199 10.2503L12.6397 2.49483C12.7444 2.42694 12.8689 2.39617 12.9932 2.40745C13.1174 2.41873 13.2343 2.47141 13.3251 2.55705C13.4159 2.64268 13.4753 2.75632 13.4938 2.87973C13.5123 3.00315 13.4888 3.1292 13.4271 3.23768L5.2557 11.4091C5.20618 11.4652 5.14571 11.5107 5.07801 11.5426C5.01031 11.5745 4.9368 11.5923 4.86199 11.5948Z","fill","currentColor"]],template:function(o,n){o&1&&(I(),H(0,"path",0))},encapsulation:2})}return e})();var he=`
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
`;var ge=["icon"],ye=["input"],Ce=(e,s)=>({checked:e,class:s});function ve(e,s){if(e&1&&z(0,"span",7),e&2){let t=g(3);a(t.cx("icon")),d("ngClass",t.checkboxIcon),x("data-pc-section","icon")}}function _e(e,s){if(e&1&&(I(),z(0,"svg",8)),e&2){let t=g(3);a(t.cx("icon")),x("data-pc-section","icon")}}function Ie(e,s){if(e&1&&(O(0),M(1,ve,1,4,"span",5)(2,_e,1,3,"svg",6),P()),e&2){let t=g(2);l(),d("ngIf",t.checkboxIcon),l(),d("ngIf",!t.checkboxIcon)}}function Me(e,s){if(e&1&&(I(),z(0,"svg",9)),e&2){let t=g(2);a(t.cx("icon")),x("data-pc-section","icon")}}function we(e,s){if(e&1&&(O(0),M(1,Ie,3,2,"ng-container",2)(2,Me,1,3,"svg",4),P()),e&2){let t=g();l(),d("ngIf",t.checked),l(),d("ngIf",t._indeterminate())}}function Fe(e,s){}function Ve(e,s){e&1&&M(0,Fe,0,0,"ng-template")}var De=`
    ${he}

    /* For PrimeNG */
    p-checkBox.ng-invalid.ng-dirty .p-checkbox-box,
    p-check-box.ng-invalid.ng-dirty .p-checkbox-box,
    p-checkbox.ng-invalid.ng-dirty .p-checkbox-box {
        border-color: dt('checkbox.invalid.border.color');
    }
`,ze={root:({instance:e})=>["p-checkbox p-component",{"p-checkbox-checked p-highlight":e.checked,"p-disabled":e.$disabled(),"p-invalid":e.invalid(),"p-variant-filled":e.$variant()==="filled","p-checkbox-sm p-inputfield-sm":e.size()==="small","p-checkbox-lg p-inputfield-lg":e.size()==="large"}],box:"p-checkbox-box",input:"p-checkbox-input",icon:"p-checkbox-icon"},ue=(()=>{class e extends v{name="checkbox";theme=De;classes=ze;static \u0275fac=(()=>{let t;return function(n){return(t||(t=c(e)))(n||e)}})();static \u0275prov=b({token:e,factory:e.\u0275fac})}return e})();var Be={provide:de,useExisting:q(()=>be),multi:!0},be=(()=>{class e extends le{value;binary;ariaLabelledBy;ariaLabel;tabindex;inputId;inputStyle;styleClass;inputClass;indeterminate=!1;formControl;checkboxIcon;readonly;autofocus;trueValue=!0;falseValue=!1;variant=A();size=A();onChange=new D;onFocus=new D;onBlur=new D;inputViewChild;get checked(){return this._indeterminate()?!1:this.binary?this.modelValue()===this.trueValue:ie(this.value,this.modelValue())}_indeterminate=R(void 0);checkboxIconTemplate;templates;_checkboxIconTemplate;focused=!1;_componentStyle=m(ue);$variant=W(()=>this.variant()||this.config.inputStyle()||this.config.inputVariant());ngAfterContentInit(){this.templates?.forEach(t=>{switch(t.getType()){case"icon":this._checkboxIconTemplate=t.template;break;case"checkboxicon":this._checkboxIconTemplate=t.template;break}})}ngOnChanges(t){super.ngOnChanges(t),t.indeterminate&&this._indeterminate.set(t.indeterminate.currentValue)}updateModel(t){let o,n=this.injector.get(se,null,{optional:!0,self:!0}),i=n&&!this.formControl?n.value:this.modelValue();this.binary?(o=this._indeterminate()?this.trueValue:this.checked?this.falseValue:this.trueValue,this.writeModelValue(o),this.onModelChange(o)):(this.checked||this._indeterminate()?o=i.filter(r=>!oe(r,this.value)):o=i?[...i,this.value]:[this.value],this.onModelChange(o),this.writeModelValue(o),this.formControl&&this.formControl.setValue(o)),this._indeterminate()&&this._indeterminate.set(!1),this.onChange.emit({checked:o,originalEvent:t})}handleChange(t){this.readonly||this.updateModel(t)}onInputFocus(t){this.focused=!0,this.onFocus.emit(t)}onInputBlur(t){this.focused=!1,this.onBlur.emit(t),this.onModelTouched()}focus(){this.inputViewChild?.nativeElement.focus()}writeControlValue(t,o){o(t),this.cd.markForCheck()}static \u0275fac=(()=>{let t;return function(n){return(t||(t=c(e)))(n||e)}})();static \u0275cmp=p({type:e,selectors:[["p-checkbox"],["p-checkBox"],["p-check-box"]],contentQueries:function(o,n,i){if(o&1&&(Q(i,ge,4),Q(i,ce,4)),o&2){let r;S(r=j())&&(n.checkboxIconTemplate=r.first),S(r=j())&&(n.templates=r)}},viewQuery:function(o,n){if(o&1&&X(ye,5),o&2){let i;S(i=j())&&(n.inputViewChild=i.first)}},hostVars:6,hostBindings:function(o,n){o&2&&(x("data-pc-name","checkbox")("data-p-highlight",n.checked)("data-p-checked",n.checked)("data-p-disabled",n.$disabled()),a(n.cn(n.cx("root"),n.styleClass)))},inputs:{value:"value",binary:[2,"binary","binary",w],ariaLabelledBy:"ariaLabelledBy",ariaLabel:"ariaLabel",tabindex:[2,"tabindex","tabindex",Y],inputId:"inputId",inputStyle:"inputStyle",styleClass:"styleClass",inputClass:"inputClass",indeterminate:[2,"indeterminate","indeterminate",w],formControl:"formControl",checkboxIcon:"checkboxIcon",readonly:[2,"readonly","readonly",w],autofocus:[2,"autofocus","autofocus",w],trueValue:"trueValue",falseValue:"falseValue",variant:[1,"variant"],size:[1,"size"]},outputs:{onChange:"onChange",onFocus:"onFocus",onBlur:"onBlur"},features:[y([Be,ue]),h,G],decls:5,vars:22,consts:[["input",""],["type","checkbox",3,"focus","blur","change","checked"],[4,"ngIf"],[4,"ngTemplateOutlet","ngTemplateOutletContext"],["data-p-icon","minus",3,"class",4,"ngIf"],[3,"class","ngClass",4,"ngIf"],["data-p-icon","check",3,"class",4,"ngIf"],[3,"ngClass"],["data-p-icon","check"],["data-p-icon","minus"]],template:function(o,n){if(o&1){let i=U();N(0,"input",1,0),K("focus",function(_){return F(i),V(n.onInputFocus(_))})("blur",function(_){return F(i),V(n.onInputBlur(_))})("change",function(_){return F(i),V(n.handleChange(_))}),L(),N(2,"div"),M(3,we,3,2,"ng-container",2)(4,Ve,1,0,null,3),L()}o&2&&(Z(n.inputStyle),a(n.cn(n.cx("input"),n.inputClass)),d("checked",n.checked),x("id",n.inputId)("value",n.value)("name",n.name())("tabindex",n.tabindex)("required",n.required()?"":void 0)("readonly",n.readonly?"":void 0)("disabled",n.$disabled()?"":void 0)("aria-labelledby",n.ariaLabelledBy)("aria-label",n.ariaLabel),l(2),a(n.cx("box")),l(),d("ngIf",!n.checkboxIconTemplate&&!n._checkboxIconTemplate),l(),d("ngTemplateOutlet",n.checkboxIconTemplate||n._checkboxIconTemplate)("ngTemplateOutletContext",J(19,Ce,n.checked,n.cx("icon"))))},dependencies:[C,ee,ne,te,u,pe,re],encapsulation:2,changeDetection:0})}return e})(),sn=(()=>{class e{static \u0275fac=function(o){return new(o||e)};static \u0275mod=k({type:e});static \u0275inj=f({imports:[be,u,u]})}return e})();var fe=`
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
`;var Te=["*"],Se={root:({instance:e})=>["p-iconfield",{"p-iconfield-left":e.iconPosition=="left","p-iconfield-right":e.iconPosition=="right"}]},me=(()=>{class e extends v{name="iconfield";theme=fe;classes=Se;static \u0275fac=(()=>{let t;return function(n){return(t||(t=c(e)))(n||e)}})();static \u0275prov=b({token:e,factory:e.\u0275fac})}return e})();var je=(()=>{class e extends E{iconPosition="left";styleClass;_componentStyle=m(me);static \u0275fac=(()=>{let t;return function(n){return(t||(t=c(e)))(n||e)}})();static \u0275cmp=p({type:e,selectors:[["p-iconfield"],["p-iconField"],["p-icon-field"]],hostVars:2,hostBindings:function(o,n){o&2&&a(n.cn(n.cx("root"),n.styleClass))},inputs:{iconPosition:"iconPosition",styleClass:"styleClass"},features:[y([me]),h],ngContentSelectors:Te,decls:1,vars:0,template:function(o,n){o&1&&(B(),T(0))},dependencies:[C],encapsulation:2,changeDetection:0})}return e})(),_n=(()=>{class e{static \u0275fac=function(o){return new(o||e)};static \u0275mod=k({type:e});static \u0275inj=f({imports:[je]})}return e})();var Ee=["*"],Ne={root:"p-inputicon"},ke=(()=>{class e extends v{name="inputicon";classes=Ne;static \u0275fac=(()=>{let t;return function(n){return(t||(t=c(e)))(n||e)}})();static \u0275prov=b({token:e,factory:e.\u0275fac})}return e})(),Le=(()=>{class e extends E{styleClass;_componentStyle=m(ke);static \u0275fac=(()=>{let t;return function(n){return(t||(t=c(e)))(n||e)}})();static \u0275cmp=p({type:e,selectors:[["p-inputicon"],["p-inputIcon"]],hostVars:2,hostBindings:function(o,n){o&2&&a(n.cn(n.cx("root"),n.styleClass))},inputs:{styleClass:"styleClass"},features:[y([ke]),h],ngContentSelectors:Ee,decls:1,vars:0,template:function(o,n){o&1&&(B(),T(0))},dependencies:[C,u],encapsulation:2,changeDetection:0})}return e})(),Nn=(()=>{class e{static \u0275fac=function(o){return new(o||e)};static \u0275mod=k({type:e});static \u0275inj=f({imports:[Le,u,u]})}return e})();export{pe as a,be as b,sn as c,je as d,_n as e,Le as f,Nn as g};
