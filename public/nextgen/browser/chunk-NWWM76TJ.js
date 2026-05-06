import{a as U}from"./chunk-EBHGBUHN.js";import{q as P}from"./chunk-JKKIBC7I.js";import{e as G}from"./chunk-K5YVB4OP.js";import{ha as N,ia as g,ma as $}from"./chunk-43D2A2M3.js";import{Ab as f,Gc as H,Hb as L,Ib as A,Kb as m,Lc as y,Mb as D,Mc as j,Pb as k,Qa as s,Qb as Q,Rb as a,S as v,Sb as c,T as _,U as C,Y as T,Yb as z,Zb as r,bb as V,ca as h,cb as S,cd as R,da as u,fb as M,hb as F,hd as q,jb as E,lc as O,nc as x,qa as p,sb as d,tb as B,ub as I,yb as w,zb as b}from"./chunk-Z36KDTBG.js";var W=`
    .p-toggleswitch {
        display: inline-block;
        width: dt('toggleswitch.width');
        height: dt('toggleswitch.height');
    }

    .p-toggleswitch-input {
        cursor: pointer;
        appearance: none;
        position: absolute;
        top: 0;
        inset-inline-start: 0;
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
        opacity: 0;
        z-index: 1;
        outline: 0 none;
        border-radius: dt('toggleswitch.border.radius');
    }

    .p-toggleswitch-slider {
        cursor: pointer;
        width: 100%;
        height: 100%;
        border-width: dt('toggleswitch.border.width');
        border-style: solid;
        border-color: dt('toggleswitch.border.color');
        background: dt('toggleswitch.background');
        transition:
            background dt('toggleswitch.transition.duration'),
            color dt('toggleswitch.transition.duration'),
            border-color dt('toggleswitch.transition.duration'),
            outline-color dt('toggleswitch.transition.duration'),
            box-shadow dt('toggleswitch.transition.duration');
        border-radius: dt('toggleswitch.border.radius');
        outline-color: transparent;
        box-shadow: dt('toggleswitch.shadow');
    }

    .p-toggleswitch-handle {
        position: absolute;
        top: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: dt('toggleswitch.handle.background');
        color: dt('toggleswitch.handle.color');
        width: dt('toggleswitch.handle.size');
        height: dt('toggleswitch.handle.size');
        inset-inline-start: dt('toggleswitch.gap');
        margin-block-start: calc(-1 * calc(dt('toggleswitch.handle.size') / 2));
        border-radius: dt('toggleswitch.handle.border.radius');
        transition:
            background dt('toggleswitch.transition.duration'),
            color dt('toggleswitch.transition.duration'),
            inset-inline-start dt('toggleswitch.slide.duration'),
            box-shadow dt('toggleswitch.slide.duration');
    }

    .p-toggleswitch.p-toggleswitch-checked .p-toggleswitch-slider {
        background: dt('toggleswitch.checked.background');
        border-color: dt('toggleswitch.checked.border.color');
    }

    .p-toggleswitch.p-toggleswitch-checked .p-toggleswitch-handle {
        background: dt('toggleswitch.handle.checked.background');
        color: dt('toggleswitch.handle.checked.color');
        inset-inline-start: calc(dt('toggleswitch.width') - calc(dt('toggleswitch.handle.size') + dt('toggleswitch.gap')));
    }

    .p-toggleswitch:not(.p-disabled):has(.p-toggleswitch-input:hover) .p-toggleswitch-slider {
        background: dt('toggleswitch.hover.background');
        border-color: dt('toggleswitch.hover.border.color');
    }

    .p-toggleswitch:not(.p-disabled):has(.p-toggleswitch-input:hover) .p-toggleswitch-handle {
        background: dt('toggleswitch.handle.hover.background');
        color: dt('toggleswitch.handle.hover.color');
    }

    .p-toggleswitch:not(.p-disabled):has(.p-toggleswitch-input:hover).p-toggleswitch-checked .p-toggleswitch-slider {
        background: dt('toggleswitch.checked.hover.background');
        border-color: dt('toggleswitch.checked.hover.border.color');
    }

    .p-toggleswitch:not(.p-disabled):has(.p-toggleswitch-input:hover).p-toggleswitch-checked .p-toggleswitch-handle {
        background: dt('toggleswitch.handle.checked.hover.background');
        color: dt('toggleswitch.handle.checked.hover.color');
    }

    .p-toggleswitch:not(.p-disabled):has(.p-toggleswitch-input:focus-visible) .p-toggleswitch-slider {
        box-shadow: dt('toggleswitch.focus.ring.shadow');
        outline: dt('toggleswitch.focus.ring.width') dt('toggleswitch.focus.ring.style') dt('toggleswitch.focus.ring.color');
        outline-offset: dt('toggleswitch.focus.ring.offset');
    }

    .p-toggleswitch.p-invalid > .p-toggleswitch-slider {
        border-color: dt('toggleswitch.invalid.border.color');
    }

    .p-toggleswitch.p-disabled {
        opacity: 1;
    }

    .p-toggleswitch.p-disabled .p-toggleswitch-slider {
        background: dt('toggleswitch.disabled.background');
    }

    .p-toggleswitch.p-disabled .p-toggleswitch-handle {
        background: dt('toggleswitch.handle.disabled.background');
    }
`;var Y=["handle"],Z=["input"],ee=t=>({checked:t});function te(t,X){t&1&&L(0)}function ie(t,X){if(t&1&&F(0,te,1,0,"ng-container",2),t&2){let i=D();w("ngTemplateOutlet",i.handleTemplate||i._handleTemplate)("ngTemplateOutletContext",x(2,ee,i.checked()))}}var ne=`
    ${W}

    p-toggleswitch.ng-invalid.ng-dirty > .p-toggleswitch-slider {
        border-color: dt('toggleswitch.invalid.border.color');
    }
`,oe={root:{position:"relative"}},le={root:({instance:t})=>["p-toggleswitch p-component",{"p-toggleswitch p-component":!0,"p-toggleswitch-checked":t.checked(),"p-disabled":t.$disabled(),"p-invalid":t.invalid()}],input:"p-toggleswitch-input",slider:"p-toggleswitch-slider",handle:"p-toggleswitch-handle"},J=(()=>{class t extends ${name="toggleswitch";theme=ne;classes=le;inlineStyles=oe;static \u0275fac=(()=>{let i;return function(e){return(i||(i=p(t)))(e||t)}})();static \u0275prov=_({token:t,factory:t.\u0275fac})}return t})();var re={provide:P,useExisting:v(()=>K),multi:!0},K=(()=>{class t extends U{styleClass;tabindex;inputId;readonly;trueValue=!0;falseValue=!1;ariaLabel;size=H();ariaLabelledBy;autofocus;onChange=new E;input;handleTemplate;_handleTemplate;focused=!1;_componentStyle=T(J);templates;onHostClick(i){this.onClick(i)}ngAfterContentInit(){this.templates.forEach(i=>{switch(i.getType()){case"handle":this._handleTemplate=i.template;break;default:this._handleTemplate=i.template;break}})}onClick(i){!this.$disabled()&&!this.readonly&&(this.writeModelValue(this.checked()?this.falseValue:this.trueValue),this.onModelChange(this.modelValue()),this.onChange.emit({originalEvent:i,checked:this.modelValue()}),this.input.nativeElement.focus())}onFocus(){this.focused=!0}onBlur(){this.focused=!1,this.onModelTouched()}checked(){return this.modelValue()===this.trueValue}writeControlValue(i,n){n(i),this.cd.markForCheck()}static \u0275fac=(()=>{let i;return function(e){return(i||(i=p(t)))(e||t)}})();static \u0275cmp=V({type:t,selectors:[["p-toggleswitch"],["p-toggleSwitch"],["p-toggle-switch"]],contentQueries:function(n,e,o){if(n&1&&(k(o,Y,4),k(o,N,4)),n&2){let l;a(l=c())&&(e.handleTemplate=l.first),a(l=c())&&(e.templates=l)}},viewQuery:function(n,e){if(n&1&&Q(Z,5),n&2){let o;a(o=c())&&(e.input=o.first)}},hostVars:6,hostBindings:function(n,e){n&1&&m("click",function(l){return e.onHostClick(l)}),n&2&&(d("data-pc-name","toggleswitch")("data-pc-section","root"),z(e.sx("root")),r(e.cn(e.cx("root"),e.styleClass)))},inputs:{styleClass:"styleClass",tabindex:[2,"tabindex","tabindex",j],inputId:"inputId",readonly:[2,"readonly","readonly",y],trueValue:"trueValue",falseValue:"falseValue",ariaLabel:"ariaLabel",size:[1,"size"],ariaLabelledBy:"ariaLabelledBy",autofocus:[2,"autofocus","autofocus",y]},outputs:{onChange:"onChange"},features:[O([re,J]),M],decls:5,vars:19,consts:[["input",""],["type","checkbox","role","switch",3,"focus","blur","checked","pAutoFocus"],[4,"ngTemplateOutlet","ngTemplateOutletContext"]],template:function(n,e){if(n&1){let o=A();b(0,"input",1,0),m("focus",function(){return h(o),u(e.onFocus())})("blur",function(){return h(o),u(e.onBlur())}),f(),b(2,"div")(3,"div"),B(4,ie,1,4,"ng-container"),f()()}n&2&&(r(e.cx("input")),w("checked",e.checked())("pAutoFocus",e.autofocus),d("id",e.inputId)("required",e.required()?"":void 0)("disabled",e.$disabled()?"":void 0)("aria-checked",e.checked())("aria-labelledby",e.ariaLabelledBy)("aria-label",e.ariaLabel)("name",e.name())("tabindex",e.tabindex)("data-pc-section","hiddenInput"),s(2),r(e.cx("slider")),d("data-pc-section","slider"),s(),r(e.cx("handle")),s(),I(e.handleTemplate||e._handleTemplate?4:-1))},dependencies:[q,R,G,g],encapsulation:2,changeDetection:0})}return t})(),Ee=(()=>{class t{static \u0275fac=function(n){return new(n||t)};static \u0275mod=S({type:t});static \u0275inj=C({imports:[K,g,g]})}return t})();export{K as a,Ee as b};
