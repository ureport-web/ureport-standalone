import{a as F}from"./chunk-GM6LEXQL.js";import{d as k}from"./chunk-DMVIH3KL.js";import{ia as z,la as E,na as d,xa as S}from"./chunk-RP2SIKJL.js";import{$ as a,Kc as y,Nc as r,Qb as v,Tc as o,W as s,X as u,Ya as c,Z as p,ec as b,jb as f,kb as g,mb as h,nb as x,tc as m,ua as l}from"./chunk-4S52IWZL.js";var I=`
    .p-textarea {
        font-family: inherit;
        font-feature-settings: inherit;
        font-size: 1rem;
        color: dt('textarea.color');
        background: dt('textarea.background');
        padding-block: dt('textarea.padding.y');
        padding-inline: dt('textarea.padding.x');
        border: 1px solid dt('textarea.border.color');
        transition:
            background dt('textarea.transition.duration'),
            color dt('textarea.transition.duration'),
            border-color dt('textarea.transition.duration'),
            outline-color dt('textarea.transition.duration'),
            box-shadow dt('textarea.transition.duration');
        appearance: none;
        border-radius: dt('textarea.border.radius');
        outline-color: transparent;
        box-shadow: dt('textarea.shadow');
    }

    .p-textarea:enabled:hover {
        border-color: dt('textarea.hover.border.color');
    }

    .p-textarea:enabled:focus {
        border-color: dt('textarea.focus.border.color');
        box-shadow: dt('textarea.focus.ring.shadow');
        outline: dt('textarea.focus.ring.width') dt('textarea.focus.ring.style') dt('textarea.focus.ring.color');
        outline-offset: dt('textarea.focus.ring.offset');
    }

    .p-textarea.p-invalid {
        border-color: dt('textarea.invalid.border.color');
    }

    .p-textarea.p-variant-filled {
        background: dt('textarea.filled.background');
    }

    .p-textarea.p-variant-filled:enabled:hover {
        background: dt('textarea.filled.hover.background');
    }

    .p-textarea.p-variant-filled:enabled:focus {
        background: dt('textarea.filled.focus.background');
    }

    .p-textarea:disabled {
        opacity: 1;
        background: dt('textarea.disabled.background');
        color: dt('textarea.disabled.color');
    }

    .p-textarea::placeholder {
        color: dt('textarea.placeholder.color');
    }

    .p-textarea.p-invalid::placeholder {
        color: dt('textarea.invalid.placeholder.color');
    }

    .p-textarea-fluid {
        width: 100%;
    }

    .p-textarea-resizable {
        overflow: hidden;
        resize: none;
    }

    .p-textarea-sm {
        font-size: dt('textarea.sm.font.size');
        padding-block: dt('textarea.sm.padding.y');
        padding-inline: dt('textarea.sm.padding.x');
    }

    .p-textarea-lg {
        font-size: dt('textarea.lg.font.size');
        padding-block: dt('textarea.lg.padding.y');
        padding-inline: dt('textarea.lg.padding.x');
    }
`;var C=`
    ${I}

    /* For PrimeNG */
    .p-textarea.ng-invalid.ng-dirty {
        border-color: dt('textarea.invalid.border.color');
    }
    .p-textarea.ng-invalid.ng-dirty::placeholder {
        color: dt('textarea.invalid.placeholder.color');
    }
`,N={root:({instance:e})=>["p-textarea p-component",{"p-filled":e.$filled(),"p-textarea-resizable ":e.autoResize,"p-variant-filled":e.$variant()==="filled","p-textarea-fluid":e.hasFluid,"p-inputfield-sm p-textarea-sm":e.pSize==="small","p-textarea-lg p-inputfield-lg":e.pSize==="large","p-invalid":e.invalid()}]},w=(()=>{class e extends z{name="textarea";style=C;classes=N;static \u0275fac=(()=>{let t;return function(i){return(t||(t=l(e)))(i||e)}})();static \u0275prov=s({token:e,factory:e.\u0275fac})}return e})();var D=new p("TEXTAREA_INSTANCE"),Q=(()=>{class e extends F{bindDirectiveInstance=a(d,{self:!0});$pcTextarea=a(D,{optional:!0,skipSelf:!0})??void 0;autoResize;pSize;variant=r();fluid=r(void 0,{transform:o});invalid=r(void 0,{transform:o});$variant=y(()=>this.variant()||this.config.inputStyle()||this.config.inputVariant());onResize=new c;ngControlSubscription;_componentStyle=a(w);ngControl=a(k,{optional:!0,self:!0});pcFluid=a(S,{optional:!0,host:!0,skipSelf:!0});get hasFluid(){return this.fluid()??!!this.pcFluid}onInit(){this.ngControl&&(this.ngControlSubscription=this.ngControl.valueChanges.subscribe(()=>{this.updateState()}))}onAfterViewInit(){this.autoResize&&this.resize(),this.cd.detectChanges()}onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"])),this.autoResize&&this.resize(),this.writeModelValue(this.ngControl?.value??this.el.nativeElement.value)}onInput(t){this.writeModelValue(t.target?.value),this.updateState()}resize(t){this.el.nativeElement.style.height="auto",this.el.nativeElement.style.height=this.el.nativeElement.scrollHeight+"px",parseFloat(this.el.nativeElement.style.height)>=parseFloat(this.el.nativeElement.style.maxHeight)?(this.el.nativeElement.style.overflowY="scroll",this.el.nativeElement.style.height=this.el.nativeElement.style.maxHeight):this.el.nativeElement.style.overflow="hidden",this.onResize.emit(t||{})}updateState(){this.autoResize&&this.resize()}onDestroy(){this.ngControlSubscription&&this.ngControlSubscription.unsubscribe()}static \u0275fac=(()=>{let t;return function(i){return(t||(t=l(e)))(i||e)}})();static \u0275dir=g({type:e,selectors:[["","pTextarea",""],["","pInputTextarea",""]],hostVars:2,hostBindings:function(n,i){n&1&&v("input",function(M){return i.onInput(M)}),n&2&&b(i.cx("root"))},inputs:{autoResize:[2,"autoResize","autoResize",o],pSize:"pSize",variant:[1,"variant"],fluid:[1,"fluid"],invalid:[1,"invalid"]},outputs:{onResize:"onResize"},features:[m([w,{provide:D,useExisting:e},{provide:E,useExisting:e}]),x([d]),h]})}return e})(),U=(()=>{class e{static \u0275fac=function(n){return new(n||e)};static \u0275mod=f({type:e});static \u0275inj=u({})}return e})();export{Q as a,U as b};
