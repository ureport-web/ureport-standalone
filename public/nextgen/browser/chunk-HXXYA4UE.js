import{t as D}from"./chunk-DBGMCAYY.js";import{i as M}from"./chunk-XEH7Z6BM.js";import{P as b,ma as h,pa as y}from"./chunk-7YDSM7V4.js";import{Ec as l,Hc as u,Kb as x,Mc as p,T as s,U as c,Y as r,Zb as v,cb as g,db as d,fb as a,ma as f,mc as m,qa as o}from"./chunk-C2KL4RQS.js";var F=(()=>{class t extends y{modelValue=f(void 0);$filled=l(()=>b(this.modelValue()));writeModelValue(e){this.modelValue.set(e)}static \u0275fac=(()=>{let e;return function(n){return(e||(e=o(t)))(n||t)}})();static \u0275dir=d({type:t,features:[a]})}return t})();var I=`
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
`;var N=`
    ${I}

    /* For PrimeNG */
   .p-inputtext.ng-invalid.ng-dirty {
        border-color: dt('inputtext.invalid.border.color');
    }

    .p-inputtext.ng-invalid.ng-dirty::placeholder {
        color: dt('inputtext.invalid.placeholder.color');
    }
`,z={root:({instance:t})=>["p-inputtext p-component",{"p-filled":t.$filled(),"p-inputtext-sm":t.pSize==="small","p-inputtext-lg":t.pSize==="large","p-invalid":t.invalid(),"p-variant-filled":t.$variant()==="filled","p-inputtext-fluid":t.hasFluid}]},k=(()=>{class t extends h{name="inputtext";theme=N;classes=z;static \u0275fac=(()=>{let e;return function(n){return(e||(e=o(t)))(n||t)}})();static \u0275prov=s({token:t,factory:t.\u0275fac})}return t})();var U=(()=>{class t extends F{ngControl=r(D,{optional:!0,self:!0});pcFluid=r(M,{optional:!0,host:!0,skipSelf:!0});pSize;variant=u();fluid=u(void 0,{transform:p});invalid=u(void 0,{transform:p});$variant=l(()=>this.variant()||this.config.inputStyle()||this.config.inputVariant());_componentStyle=r(k);ngAfterViewInit(){super.ngAfterViewInit(),this.writeModelValue(this.ngControl?.value??this.el.nativeElement.value),this.cd.detectChanges()}ngDoCheck(){this.writeModelValue(this.ngControl?.value??this.el.nativeElement.value)}onInput(){this.writeModelValue(this.ngControl?.value??this.el.nativeElement.value)}get hasFluid(){return this.fluid()??!!this.pcFluid}static \u0275fac=(()=>{let e;return function(n){return(e||(e=o(t)))(n||t)}})();static \u0275dir=d({type:t,selectors:[["","pInputText",""]],hostVars:2,hostBindings:function(i,n){i&1&&x("input",function(w){return n.onInput(w)}),i&2&&v(n.cx("root"))},inputs:{pSize:"pSize",variant:[1,"variant"],fluid:[1,"fluid"],invalid:[1,"invalid"]},features:[m([k]),a]})}return t})(),W=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=g({type:t});static \u0275inj=c({})}return t})();export{F as a,U as b,W as c};
