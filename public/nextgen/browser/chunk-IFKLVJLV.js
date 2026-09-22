import{a as oe}from"./chunk-74AJIU64.js";import{a as ne}from"./chunk-LPW3XZJD.js";import{a as ie}from"./chunk-OI5RRU57.js";import{a as te,d as ce}from"./chunk-HN2VYLXL.js";import{R as W,S as Y,ha as Z,ia as v,ma as ee}from"./chunk-MVAEEA3L.js";import{$b as l,$c as U,Ab as a,Bb as w,Cb as I,Db as g,Hb as V,Hc as H,Ib as M,Kb as j,Kc as z,Mb as A,Ob as s,Pc as p,Qc as P,Ra as d,Rb as T,Sb as $,T as B,Tb as m,U as F,Ub as _,V as S,Z as E,_b as q,cb as O,cd as K,da as k,db as L,ea as x,fa as y,gb as Q,gd as X,ib as u,kb as f,md as J,na as D,pc as R,qa as N,ra as C,sc as G,ub as h}from"./chunk-YBCNRLYA.js";var ae=`
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
`;var le=["icon"],he=["input"],se=(e,r)=>({checked:e,class:r});function be(e,r){if(e&1&&g(0,"span",7),e&2){let o=s(3);l(o.cx("icon")),a("ngClass",o.checkboxIcon),h("data-pc-section","icon")}}function ue(e,r){if(e&1&&(y(),g(0,"svg",8)),e&2){let o=s(3);l(o.cx("icon")),h("data-pc-section","icon")}}function pe(e,r){if(e&1&&(V(0),u(1,be,1,4,"span",5)(2,ue,1,3,"svg",6),M()),e&2){let o=s(2);d(),a("ngIf",o.checkboxIcon),d(),a("ngIf",!o.checkboxIcon)}}function ke(e,r){if(e&1&&(y(),g(0,"svg",9)),e&2){let o=s(2);l(o.cx("icon")),h("data-pc-section","icon")}}function xe(e,r){if(e&1&&(V(0),u(1,pe,3,2,"ng-container",2)(2,ke,1,3,"svg",4),M()),e&2){let o=s();d(),a("ngIf",o.checked),d(),a("ngIf",o._indeterminate())}}function fe(e,r){}function ge(e,r){e&1&&u(0,fe,0,0,"ng-template")}var me=`
    ${ae}

    /* For PrimeNG */
    p-checkBox.ng-invalid.ng-dirty .p-checkbox-box,
    p-check-box.ng-invalid.ng-dirty .p-checkbox-box,
    p-checkbox.ng-invalid.ng-dirty .p-checkbox-box {
        border-color: dt('checkbox.invalid.border.color');
    }
`,_e={root:({instance:e})=>["p-checkbox p-component",{"p-checkbox-checked p-highlight":e.checked,"p-disabled":e.$disabled(),"p-invalid":e.invalid(),"p-variant-filled":e.$variant()==="filled","p-checkbox-sm p-inputfield-sm":e.size()==="small","p-checkbox-lg p-inputfield-lg":e.size()==="large"}],box:"p-checkbox-box",input:"p-checkbox-input",icon:"p-checkbox-icon"},re=(()=>{class e extends ee{name="checkbox";theme=me;classes=_e;static \u0275fac=(()=>{let o;return function(n){return(o||(o=C(e)))(n||e)}})();static \u0275prov=F({token:e,factory:e.\u0275fac})}return e})();var ve={provide:te,useExisting:B(()=>de),multi:!0},de=(()=>{class e extends ie{value;binary;ariaLabelledBy;ariaLabel;tabindex;inputId;inputStyle;styleClass;inputClass;indeterminate=!1;formControl;checkboxIcon;readonly;autofocus;trueValue=!0;falseValue=!1;variant=z();size=z();onChange=new f;onFocus=new f;onBlur=new f;inputViewChild;get checked(){return this._indeterminate()?!1:this.binary?this.modelValue()===this.trueValue:Y(this.value,this.modelValue())}_indeterminate=D(void 0);checkboxIconTemplate;templates;_checkboxIconTemplate;focused=!1;_componentStyle=E(re);$variant=H(()=>this.variant()||this.config.inputStyle()||this.config.inputVariant());ngAfterContentInit(){this.templates?.forEach(o=>{switch(o.getType()){case"icon":this._checkboxIconTemplate=o.template;break;case"checkboxicon":this._checkboxIconTemplate=o.template;break}})}ngOnChanges(o){super.ngOnChanges(o),o.indeterminate&&this._indeterminate.set(o.indeterminate.currentValue)}updateModel(o){let t,n=this.injector.get(ce,null,{optional:!0,self:!0}),c=n&&!this.formControl?n.value:this.modelValue();this.binary?(t=this._indeterminate()?this.trueValue:this.checked?this.falseValue:this.trueValue,this.writeModelValue(t),this.onModelChange(t)):(this.checked||this._indeterminate()?t=c.filter(i=>!W(i,this.value)):t=c?[...c,this.value]:[this.value],this.onModelChange(t),this.writeModelValue(t),this.formControl&&this.formControl.setValue(t)),this._indeterminate()&&this._indeterminate.set(!1),this.onChange.emit({checked:t,originalEvent:o})}handleChange(o){this.readonly||this.updateModel(o)}onInputFocus(o){this.focused=!0,this.onFocus.emit(o)}onInputBlur(o){this.focused=!1,this.onBlur.emit(o),this.onModelTouched()}focus(){this.inputViewChild?.nativeElement.focus()}writeControlValue(o,t){t(o),this.cd.markForCheck()}static \u0275fac=(()=>{let o;return function(n){return(o||(o=C(e)))(n||e)}})();static \u0275cmp=O({type:e,selectors:[["p-checkbox"],["p-checkBox"],["p-check-box"]],contentQueries:function(t,n,c){if(t&1&&(T(c,le,4),T(c,Z,4)),t&2){let i;m(i=_())&&(n.checkboxIconTemplate=i.first),m(i=_())&&(n.templates=i)}},viewQuery:function(t,n){if(t&1&&$(he,5),t&2){let c;m(c=_())&&(n.inputViewChild=c.first)}},hostVars:6,hostBindings:function(t,n){t&2&&(h("data-pc-name","checkbox")("data-p-highlight",n.checked)("data-p-checked",n.checked)("data-p-disabled",n.$disabled()),l(n.cn(n.cx("root"),n.styleClass)))},inputs:{value:"value",binary:[2,"binary","binary",p],ariaLabelledBy:"ariaLabelledBy",ariaLabel:"ariaLabel",tabindex:[2,"tabindex","tabindex",P],inputId:"inputId",inputStyle:"inputStyle",styleClass:"styleClass",inputClass:"inputClass",indeterminate:[2,"indeterminate","indeterminate",p],formControl:"formControl",checkboxIcon:"checkboxIcon",readonly:[2,"readonly","readonly",p],autofocus:[2,"autofocus","autofocus",p],trueValue:"trueValue",falseValue:"falseValue",variant:[1,"variant"],size:[1,"size"]},outputs:{onChange:"onChange",onFocus:"onFocus",onBlur:"onBlur"},features:[R([ve,re]),Q,N],decls:5,vars:22,consts:[["input",""],["type","checkbox",3,"focus","blur","change","checked"],[4,"ngIf"],[4,"ngTemplateOutlet","ngTemplateOutletContext"],["data-p-icon","minus",3,"class",4,"ngIf"],[3,"class","ngClass",4,"ngIf"],["data-p-icon","check",3,"class",4,"ngIf"],[3,"ngClass"],["data-p-icon","check"],["data-p-icon","minus"]],template:function(t,n){if(t&1){let c=j();w(0,"input",1,0),A("focus",function(b){return k(c),x(n.onInputFocus(b))})("blur",function(b){return k(c),x(n.onInputBlur(b))})("change",function(b){return k(c),x(n.handleChange(b))}),I(),w(2,"div"),u(3,xe,3,2,"ng-container",2)(4,ge,1,0,null,3),I()}t&2&&(q(n.inputStyle),l(n.cn(n.cx("input"),n.inputClass)),a("checked",n.checked),h("id",n.inputId)("value",n.value)("name",n.name())("tabindex",n.tabindex)("required",n.required()?"":void 0)("readonly",n.readonly?"":void 0)("disabled",n.$disabled()?"":void 0)("aria-labelledby",n.ariaLabelledBy)("aria-label",n.ariaLabel),d(2),l(n.cx("box")),d(),a("ngIf",!n.checkboxIconTemplate&&!n._checkboxIconTemplate),d(),a("ngTemplateOutlet",n.checkboxIconTemplate||n._checkboxIconTemplate)("ngTemplateOutletContext",G(19,se,n.checked,n.cx("icon"))))},dependencies:[J,U,K,X,v,ne,oe],encapsulation:2,changeDetection:0})}return e})(),He=(()=>{class e{static \u0275fac=function(t){return new(t||e)};static \u0275mod=L({type:e});static \u0275inj=S({imports:[de,v,v]})}return e})();export{de as a,He as b};
