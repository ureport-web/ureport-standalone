import{d as F}from"./chunk-DMVIH3KL.js";import{L as D,ia as M,la as N,ma as T,na as p,xa as k}from"./chunk-RP2SIKJL.js";import{$ as o,Kc as l,Lc as I,Nc as r,Qb as h,Tc as s,W as c,X as f,Z as x,ec as b,jb as v,kb as a,mb as u,nb as m,qa as g,tc as y,ua as d}from"./chunk-4S52IWZL.js";var w=(()=>{class t extends T{modelValue=g(void 0);$filled=l(()=>D(this.modelValue()));writeModelValue(e){this.modelValue.set(e)}static \u0275fac=(()=>{let e;return function(i){return(e||(e=d(t)))(i||t)}})();static \u0275dir=a({type:t,features:[u]})}return t})();var S=`
    .p-inputtext {
        font-family: inherit;
        font-feature-settings: inherit;
        font-size: 1rem;
        color: dt('inputtext.color');
        background: dt('inputtext.background');
        padding-block: dt('inputtext.padding.y');
        padding-inline: dt('inputtext.padding.x');
        border: 1px solid dt('inputtext.border.color');
        transition:
            background dt('inputtext.transition.duration'),
            color dt('inputtext.transition.duration'),
            border-color dt('inputtext.transition.duration'),
            outline-color dt('inputtext.transition.duration'),
            box-shadow dt('inputtext.transition.duration');
        appearance: none;
        border-radius: dt('inputtext.border.radius');
        outline-color: transparent;
        box-shadow: dt('inputtext.shadow');
    }

    .p-inputtext:enabled:hover {
        border-color: dt('inputtext.hover.border.color');
    }

    .p-inputtext:enabled:focus {
        border-color: dt('inputtext.focus.border.color');
        box-shadow: dt('inputtext.focus.ring.shadow');
        outline: dt('inputtext.focus.ring.width') dt('inputtext.focus.ring.style') dt('inputtext.focus.ring.color');
        outline-offset: dt('inputtext.focus.ring.offset');
    }

    .p-inputtext.p-invalid {
        border-color: dt('inputtext.invalid.border.color');
    }

    .p-inputtext.p-variant-filled {
        background: dt('inputtext.filled.background');
    }

    .p-inputtext.p-variant-filled:enabled:hover {
        background: dt('inputtext.filled.hover.background');
    }

    .p-inputtext.p-variant-filled:enabled:focus {
        background: dt('inputtext.filled.focus.background');
    }

    .p-inputtext:disabled {
        opacity: 1;
        background: dt('inputtext.disabled.background');
        color: dt('inputtext.disabled.color');
    }

    .p-inputtext::placeholder {
        color: dt('inputtext.placeholder.color');
    }

    .p-inputtext.p-invalid::placeholder {
        color: dt('inputtext.invalid.placeholder.color');
    }

    .p-inputtext-sm {
        font-size: dt('inputtext.sm.font.size');
        padding-block: dt('inputtext.sm.padding.y');
        padding-inline: dt('inputtext.sm.padding.x');
    }

    .p-inputtext-lg {
        font-size: dt('inputtext.lg.font.size');
        padding-block: dt('inputtext.lg.padding.y');
        padding-inline: dt('inputtext.lg.padding.x');
    }

    .p-inputtext-fluid {
        width: 100%;
    }
`;var z=`
    ${S}

    /* For PrimeNG */
   .p-inputtext.ng-invalid.ng-dirty {
        border-color: dt('inputtext.invalid.border.color');
    }

    .p-inputtext.ng-invalid.ng-dirty::placeholder {
        color: dt('inputtext.invalid.placeholder.color');
    }
`,A={root:({instance:t})=>["p-inputtext p-component",{"p-filled":t.$filled(),"p-inputtext-sm":t.pSize==="small","p-inputtext-lg":t.pSize==="large","p-invalid":t.invalid(),"p-variant-filled":t.$variant()==="filled","p-inputtext-fluid":t.hasFluid}]},C=(()=>{class t extends M{name="inputtext";style=z;classes=A;static \u0275fac=(()=>{let e;return function(i){return(e||(e=d(t)))(i||t)}})();static \u0275prov=c({token:t,factory:t.\u0275fac})}return t})();var E=new x("INPUTTEXT_INSTANCE"),it=(()=>{class t extends w{hostName="";ptInputText=r();bindDirectiveInstance=o(p,{self:!0});$pcInputText=o(E,{optional:!0,skipSelf:!0})??void 0;ngControl=o(F,{optional:!0,self:!0});pcFluid=o(k,{optional:!0,host:!0,skipSelf:!0});pSize;variant=r();fluid=r(void 0,{transform:s});invalid=r(void 0,{transform:s});$variant=l(()=>this.variant()||this.config.inputStyle()||this.config.inputVariant());_componentStyle=o(C);constructor(){super(),I(()=>{this.ptInputText()&&this.directivePT.set(this.ptInputText())})}onAfterViewInit(){this.writeModelValue(this.ngControl?.value??this.el.nativeElement.value),this.cd.detectChanges()}onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptm("root"))}onDoCheck(){this.writeModelValue(this.ngControl?.value??this.el.nativeElement.value)}onInput(){this.writeModelValue(this.ngControl?.value??this.el.nativeElement.value)}get hasFluid(){return this.fluid()??!!this.pcFluid}static \u0275fac=function(n){return new(n||t)};static \u0275dir=a({type:t,selectors:[["","pInputText",""]],hostVars:2,hostBindings:function(n,i){n&1&&h("input",function(V){return i.onInput(V)}),n&2&&b(i.cx("root"))},inputs:{hostName:"hostName",ptInputText:[1,"ptInputText"],pSize:"pSize",variant:[1,"variant"],fluid:[1,"fluid"],invalid:[1,"invalid"]},features:[y([C,{provide:E,useExisting:t},{provide:N,useExisting:t}]),m([p]),u]})}return t})(),ot=(()=>{class t{static \u0275fac=function(n){return new(n||t)};static \u0275mod=v({type:t});static \u0275inj=f({})}return t})();export{w as a,it as b,ot as c};
