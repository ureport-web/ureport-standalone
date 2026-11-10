import{a as ce}from"./chunk-7RHWIFO5.js";import{a as re}from"./chunk-3X6SFTQR.js";import{a as le}from"./chunk-B6W3EO6D.js";import{a as ae,d as de}from"./chunk-DMVIH3KL.js";import{N as Z,O as ee,da as ne,ea as y,ia as oe,la as te,na as u,oa as ie}from"./chunk-RP2SIKJL.js";import{$ as k,Eb as c,Fb as V,Gb as B,Hb as g,Kc as K,Lb as M,Mb as T,Nc as S,Ob as j,Qb as R,Sb as s,Ta as d,Tc as b,Uc as X,V as N,Vb as E,W as z,Wb as q,X as F,Xb as _,Ya as m,Yb as v,Z as D,dc as H,ec as l,ed as U,ga as x,ha as f,hd as J,ia as C,ib as O,jb as L,jd as W,mb as Q,nb as $,ob as p,pd as Y,qa as A,tc as G,ua as I,wb as w,wc as P}from"./chunk-4S52IWZL.js";var se=`
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
`;var ue=["icon"],ke=["input"],xe=(e,a)=>({checked:e,class:a});function fe(e,a){if(e&1&&g(0,"span",8),e&2){let o=s(3);l(o.cx("icon")),c("ngClass",o.checkboxIcon)("pBind",o.ptm("icon"))}}function me(e,a){if(e&1&&(C(),g(0,"svg",9)),e&2){let o=s(3);l(o.cx("icon")),c("pBind",o.ptm("icon"))}}function ge(e,a){if(e&1&&(M(0),p(1,fe,1,4,"span",6)(2,me,1,3,"svg",7),T()),e&2){let o=s(2);d(),c("ngIf",o.checkboxIcon),d(),c("ngIf",!o.checkboxIcon)}}function _e(e,a){if(e&1&&(C(),g(0,"svg",10)),e&2){let o=s(2);l(o.cx("icon")),c("pBind",o.ptm("icon"))}}function ve(e,a){if(e&1&&(M(0),p(1,ge,3,2,"ng-container",3)(2,_e,1,3,"svg",5),T()),e&2){let o=s();d(),c("ngIf",o.checked),d(),c("ngIf",o._indeterminate())}}function ye(e,a){}function Ce(e,a){e&1&&p(0,ye,0,0,"ng-template")}var Ie=`
    ${se}

    /* For PrimeNG */
    p-checkBox.ng-invalid.ng-dirty .p-checkbox-box,
    p-check-box.ng-invalid.ng-dirty .p-checkbox-box,
    p-checkbox.ng-invalid.ng-dirty .p-checkbox-box {
        border-color: dt('checkbox.invalid.border.color');
    }
`,we={root:({instance:e})=>["p-checkbox p-component",{"p-checkbox-checked p-highlight":e.checked,"p-disabled":e.$disabled(),"p-invalid":e.invalid(),"p-variant-filled":e.$variant()==="filled","p-checkbox-sm p-inputfield-sm":e.size()==="small","p-checkbox-lg p-inputfield-lg":e.size()==="large"}],box:"p-checkbox-box",input:"p-checkbox-input",icon:"p-checkbox-icon"},he=(()=>{class e extends oe{name="checkbox";style=Ie;classes=we;static \u0275fac=(()=>{let o;return function(n){return(o||(o=I(e)))(n||e)}})();static \u0275prov=z({token:e,factory:e.\u0275fac})}return e})();var pe=new D("CHECKBOX_INSTANCE"),Ve={provide:ae,useExisting:N(()=>be),multi:!0},be=(()=>{class e extends le{hostName="";value;binary;ariaLabelledBy;ariaLabel;tabindex;inputId;inputStyle;styleClass;inputClass;indeterminate=!1;formControl;checkboxIcon;readonly;autofocus;trueValue=!0;falseValue=!1;variant=S();size=S();onChange=new m;onFocus=new m;onBlur=new m;inputViewChild;get checked(){return this._indeterminate()?!1:this.binary?this.modelValue()===this.trueValue:ee(this.value,this.modelValue())}_indeterminate=A(void 0);checkboxIconTemplate;templates;_checkboxIconTemplate;focused=!1;_componentStyle=k(he);bindDirectiveInstance=k(u,{self:!0});$pcCheckbox=k(pe,{optional:!0,skipSelf:!0})??void 0;$variant=K(()=>this.variant()||this.config.inputStyle()||this.config.inputVariant());onAfterContentInit(){this.templates?.forEach(o=>{switch(o.getType()){case"icon":this._checkboxIconTemplate=o.template;break;case"checkboxicon":this._checkboxIconTemplate=o.template;break}})}onChanges(o){o.indeterminate&&this._indeterminate.set(o.indeterminate.currentValue)}onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]))}updateModel(o){let t,n=this.injector.get(de,null,{optional:!0,self:!0}),i=n&&!this.formControl?n.value:this.modelValue();this.binary?(t=this._indeterminate()?this.trueValue:this.checked?this.falseValue:this.trueValue,this.writeModelValue(t),this.onModelChange(t)):(this.checked||this._indeterminate()?t=i.filter(r=>!Z(r,this.value)):t=i?[...i,this.value]:[this.value],this.onModelChange(t),this.writeModelValue(t),this.formControl&&this.formControl.setValue(t)),this._indeterminate()&&this._indeterminate.set(!1),this.onChange.emit({checked:t,originalEvent:o})}handleChange(o){this.readonly||this.updateModel(o)}onInputFocus(o){this.focused=!0,this.onFocus.emit(o)}onInputBlur(o){this.focused=!1,this.onBlur.emit(o),this.onModelTouched()}focus(){this.inputViewChild?.nativeElement.focus()}writeControlValue(o,t){t(o),this.cd.markForCheck()}static \u0275fac=(()=>{let o;return function(n){return(o||(o=I(e)))(n||e)}})();static \u0275cmp=O({type:e,selectors:[["p-checkbox"],["p-checkBox"],["p-check-box"]],contentQueries:function(t,n,i){if(t&1&&(E(i,ue,4),E(i,ne,4)),t&2){let r;_(r=v())&&(n.checkboxIconTemplate=r.first),_(r=v())&&(n.templates=r)}},viewQuery:function(t,n){if(t&1&&q(ke,5),t&2){let i;_(i=v())&&(n.inputViewChild=i.first)}},hostVars:5,hostBindings:function(t,n){t&2&&(w("data-p-highlight",n.checked)("data-p-checked",n.checked)("data-p-disabled",n.$disabled()),l(n.cn(n.cx("root"),n.styleClass)))},inputs:{hostName:"hostName",value:"value",binary:[2,"binary","binary",b],ariaLabelledBy:"ariaLabelledBy",ariaLabel:"ariaLabel",tabindex:[2,"tabindex","tabindex",X],inputId:"inputId",inputStyle:"inputStyle",styleClass:"styleClass",inputClass:"inputClass",indeterminate:[2,"indeterminate","indeterminate",b],formControl:"formControl",checkboxIcon:"checkboxIcon",readonly:[2,"readonly","readonly",b],autofocus:[2,"autofocus","autofocus",b],trueValue:"trueValue",falseValue:"falseValue",variant:[1,"variant"],size:[1,"size"]},outputs:{onChange:"onChange",onFocus:"onFocus",onBlur:"onBlur"},features:[G([Ve,he,{provide:pe,useExisting:e},{provide:te,useExisting:e}]),$([u]),Q],decls:5,vars:24,consts:[["input",""],["type","checkbox",3,"focus","blur","change","checked","pBind"],[3,"pBind"],[4,"ngIf"],[4,"ngTemplateOutlet","ngTemplateOutletContext"],["data-p-icon","minus",3,"class","pBind",4,"ngIf"],[3,"class","ngClass","pBind",4,"ngIf"],["data-p-icon","check",3,"class","pBind",4,"ngIf"],[3,"ngClass","pBind"],["data-p-icon","check",3,"pBind"],["data-p-icon","minus",3,"pBind"]],template:function(t,n){if(t&1){let i=j();V(0,"input",1,0),R("focus",function(h){return x(i),f(n.onInputFocus(h))})("blur",function(h){return x(i),f(n.onInputBlur(h))})("change",function(h){return x(i),f(n.handleChange(h))}),B(),V(2,"div",2),p(3,ve,3,2,"ng-container",3)(4,Ce,1,0,null,4),B()}t&2&&(H(n.inputStyle),l(n.cn(n.cx("input"),n.inputClass)),c("checked",n.checked)("pBind",n.ptm("input")),w("id",n.inputId)("value",n.value)("name",n.name())("tabindex",n.tabindex)("required",n.required()?"":void 0)("readonly",n.readonly?"":void 0)("disabled",n.$disabled()?"":void 0)("aria-labelledby",n.ariaLabelledBy)("aria-label",n.ariaLabel),d(2),l(n.cx("box")),c("pBind",n.ptm("box")),d(),c("ngIf",!n.checkboxIconTemplate&&!n._checkboxIconTemplate),d(),c("ngTemplateOutlet",n.checkboxIconTemplate||n._checkboxIconTemplate)("ngTemplateOutletContext",P(21,xe,n.checked,n.cx("icon"))))},dependencies:[Y,U,J,W,y,ce,re,ie,u],encapsulation:2,changeDetection:0})}return e})(),Ze=(()=>{class e{static \u0275fac=function(t){return new(t||e)};static \u0275mod=L({type:e});static \u0275inj=F({imports:[be,y,y]})}return e})();export{be as a,Ze as b};
