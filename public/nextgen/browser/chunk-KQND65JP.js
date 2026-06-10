import{a as de}from"./chunk-K3OP2MTM.js";import{c as H}from"./chunk-4Q3JVAKG.js";import{c as W,d as R,f as z,h as O,q as ce}from"./chunk-VLCNFVFY.js";import{a as re,d as ae,e as le,f as se}from"./chunk-YCUITUNU.js";import{I as ie,a as J,ea as ne,ia as S,ja as F,l as ee,ma as oe,o as te}from"./chunk-LEZ7STAA.js";import{$b as u,Ab as k,Bb as m,Cb as C,Db as L,Gc as Q,Jc as Y,Kb as I,Mb as g,Ob as r,Oc as M,Ra as f,Sb as v,T as A,Tb as b,U as V,Ub as x,V as w,Xa as $,Yb as j,Z as P,bd as Z,cb as X,da as a,db as y,ea as l,gb as E,ib as N,kb as _,kd as q,oc as B,od as K,qc as G,ra as T,rc as U,ub as h}from"./chunk-MVGH6UWW.js";var ue=`
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
`;var Ee=`
    ${ue}

    /* For PrimeNG */
    .p-textarea.ng-invalid.ng-dirty {
        border-color: dt('textarea.invalid.border.color');
    }
    .p-textarea.ng-invalid.ng-dirty::placeholder {
        color: dt('textarea.invalid.placeholder.color');
    }
`;var Le=(()=>{class o{static \u0275fac=function(t){return new(t||o)};static \u0275mod=y({type:o});static \u0275inj=w({})}return o})();var he=`
    .p-colorpicker {
        display: inline-block;
        position: relative;
    }

    .p-colorpicker-dragging {
        cursor: pointer;
    }

    .p-colorpicker-preview {
        width: dt('colorpicker.preview.width');
        height: dt('colorpicker.preview.height');
        padding: 0;
        border: 0 none;
        border-radius: dt('colorpicker.preview.border.radius');
        transition:
            background dt('colorpicker.transition.duration'),
            color dt('colorpicker.transition.duration'),
            border-color dt('colorpicker.transition.duration'),
            outline-color dt('colorpicker.transition.duration'),
            box-shadow dt('colorpicker.transition.duration');
        outline-color: transparent;
        cursor: pointer;
    }

    .p-colorpicker-preview:enabled:focus-visible {
        border-color: dt('colorpicker.preview.focus.border.color');
        box-shadow: dt('colorpicker.preview.focus.ring.shadow');
        outline: dt('colorpicker.preview.focus.ring.width') dt('colorpicker.preview.focus.ring.style') dt('colorpicker.preview.focus.ring.color');
        outline-offset: dt('colorpicker.preview.focus.ring.offset');
    }

    .p-colorpicker-panel {
        background: dt('colorpicker.panel.background');
        border: 1px solid dt('colorpicker.panel.border.color');
        border-radius: dt('colorpicker.panel.border.radius');
        box-shadow: dt('colorpicker.panel.shadow');
        width: 193px;
        height: 166px;
        position: absolute;
        top: 0;
        left: 0;
    }

    .p-colorpicker-panel-inline {
        box-shadow: none;
        position: static;
    }

    .p-colorpicker-content {
        position: relative;
    }

    .p-colorpicker-color-selector {
        width: 150px;
        height: 150px;
        inset-block-start: 8px;
        inset-inline-start: 8px;
        position: absolute;
    }

    .p-colorpicker-color-background {
        width: 100%;
        height: 100%;
        background: linear-gradient(to top, #000 0%, rgba(0, 0, 0, 0) 100%), linear-gradient(to right, #fff 0%, rgba(255, 255, 255, 0) 100%);
    }

    .p-colorpicker-color-handle {
        position: absolute;
        inset-block-start: 0px;
        inset-inline-start: 150px;
        border-radius: 100%;
        width: 10px;
        height: 10px;
        border-width: 1px;
        border-style: solid;
        margin: -5px 0 0 -5px;
        cursor: pointer;
        opacity: 0.85;
        border-color: dt('colorpicker.handle.color');
    }

    .p-colorpicker-hue {
        width: 17px;
        height: 150px;
        inset-block-start: 8px;
        inset-inline-start: 167px;
        position: absolute;
        opacity: 0.85;
        background: linear-gradient(0deg, red 0, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, red);
    }

    .p-colorpicker-hue-handle {
        position: absolute;
        inset-block-start: 150px;
        inset-inline-start: 0px;
        width: 21px;
        margin-inline-start: -2px;
        margin-block-start: -5px;
        height: 10px;
        border-width: 2px;
        border-style: solid;
        opacity: 0.85;
        cursor: pointer;
        border-color: dt('colorpicker.handle.color');
    }
`;var ve=["input"],be=["colorSelector"],xe=["colorHandle"],ke=["hue"],we=["hueHandle"],ye=(o,D)=>({showTransitionParams:o,hideTransitionParams:D}),_e=o=>({value:"visible",params:o});function Ce(o,D){if(o&1){let e=I();m(0,"input",7,0),g("click",function(){a(e);let i=r();return l(i.onInputClick())})("keydown",function(i){a(e);let n=r();return l(n.onInputKeydown(i))})("focus",function(){a(e);let i=r();return l(i.onInputFocus())}),C()}if(o&2){let e=r();u(e.cx("preview")),j("background-color",e.inputBgColor),k("pAutoFocus",e.autofocus),h("tabindex",e.tabindex)("disabled",e.$disabled()?"":void 0)("id",e.inputId)("data-pc-section","input")("aria-label",e.ariaLabel)}}function Me(o,D){if(o&1){let e=I();m(0,"div",8),g("click",function(i){a(e);let n=r();return l(n.onOverlayClick(i))})("@overlayAnimation.start",function(i){a(e);let n=r();return l(n.onOverlayAnimationStart(i))})("@overlayAnimation.done",function(i){a(e);let n=r();return l(n.onOverlayAnimationEnd(i))}),m(1,"div")(2,"div",9,1),g("touchstart",function(i){a(e);let n=r();return l(n.onColorDragStart(i))})("touchmove",function(i){a(e);let n=r();return l(n.onDrag(i))})("touchend",function(){a(e);let i=r();return l(i.onDragEnd())})("mousedown",function(i){a(e);let n=r();return l(n.onColorMousedown(i))}),m(4,"div"),L(5,"div",null,2),C()(),m(7,"div",10,3),g("mousedown",function(i){a(e);let n=r();return l(n.onHueMousedown(i))})("touchstart",function(i){a(e);let n=r();return l(n.onHueDragStart(i))})("touchmove",function(i){a(e);let n=r();return l(n.onDrag(i))})("touchend",function(){a(e);let i=r();return l(i.onDragEnd())}),L(9,"div",null,4),C()()()}if(o&2){let e=r();u(e.cx("panel")),k("@overlayAnimation",G(26,_e,U(23,ye,e.showTransitionOptions,e.hideTransitionOptions)))("@.disabled",e.inline===!0),h("data-pc-section","panel"),f(),u(e.cx("content")),h("data-pc-section","content"),f(),u(e.cx("colorSelector")),h("data-pc-section","selector"),f(2),u(e.cx("colorBackground")),h("data-pc-section","color"),f(),u(e.cx("colorHandle")),h("data-pc-section","colorHandle"),f(2),u(e.cx("hue")),h("data-pc-section","hue"),f(2),u(e.cx("hueHandle")),h("data-pc-section","hueHandle")}}var Se={root:({instance:o})=>["p-colorpicker p-component",{"p-colorpicker-overlay":!o.inline,"p-colorpicker-dragging":o.colorDragging||o.hueDragging}],preview:({instance:o})=>["p-colorpicker-preview",{"p-disabled":o.$disabled()}],panel:({instance:o})=>["p-colorpicker-panel",{"p-colorpicker-panel-inline":o.inline,"p-disabled":o.$disabled()}],content:"p-colorpicker-content",colorSelector:"p-colorpicker-color-selector",colorBackground:"p-colorpicker-color-background",colorHandle:"p-colorpicker-color-handle",hue:"p-colorpicker-hue",hueHandle:"p-colorpicker-hue-handle"},pe=(()=>{class o extends oe{name="colorpicker";theme=he;classes=Se;static \u0275fac=(()=>{let e;return function(i){return(e||(e=T(o)))(i||o)}})();static \u0275prov=V({token:o,factory:o.\u0275fac})}return o})();var He={provide:ce,useExisting:A(()=>fe),multi:!0},fe=(()=>{class o extends de{overlayService;styleClass;inline;format="hex";tabindex;inputId;autoZIndex=!0;showTransitionOptions=".12s cubic-bezier(0, 0, 0.2, 1)";hideTransitionOptions=".1s linear";autofocus;defaultColor="ff0000";appendTo=Y(void 0);onChange=new _;onShow=new _;onHide=new _;inputViewChild;$appendTo=Q(()=>this.appendTo()||this.config.overlayAppendTo());value={h:0,s:100,b:100};inputBgColor;shown;overlayVisible;documentClickListener;documentResizeListener;documentMousemoveListener;documentMouseupListener;documentHueMoveListener;scrollHandler;selfClick;colorDragging;hueDragging;overlay;colorSelectorViewChild;colorHandleViewChild;hueViewChild;hueHandleViewChild;_componentStyle=P(pe);constructor(e){super(),this.overlayService=e}set colorSelector(e){this.colorSelectorViewChild=e}set colorHandle(e){this.colorHandleViewChild=e}set hue(e){this.hueViewChild=e}set hueHandle(e){this.hueHandleViewChild=e}get ariaLabel(){return this.config?.getTranslation(F.ARIA)[F.SELECT_COLOR]}onHueMousedown(e){this.$disabled()||(this.bindDocumentMousemoveListener(),this.bindDocumentMouseupListener(),this.hueDragging=!0,this.pickHue(e))}onHueDragStart(e){this.$disabled()||(this.hueDragging=!0,this.pickHue(e,e.changedTouches[0]))}onColorDragStart(e){this.$disabled()||(this.colorDragging=!0,this.pickColor(e,e.changedTouches[0]))}pickHue(e,t){let i=t?t.pageY:e.pageY,n=this.hueViewChild?.nativeElement.getBoundingClientRect().top+(this.document.defaultView.pageYOffset||this.document.documentElement.scrollTop||this.document.body.scrollTop||0);this.value=this.validateHSB({h:Math.floor(360*(150-Math.max(0,Math.min(150,i-n)))/150),s:this.value.s,b:this.value.b}),this.updateColorSelector(),this.updateUI(),this.updateModel(),this.onChange.emit({originalEvent:e,value:this.getValueToUpdate()})}onColorMousedown(e){this.$disabled()||(this.bindDocumentMousemoveListener(),this.bindDocumentMouseupListener(),this.colorDragging=!0,this.pickColor(e))}onDrag(e){this.colorDragging&&(this.pickColor(e,e.changedTouches[0]),e.preventDefault()),this.hueDragging&&(this.pickHue(e,e.changedTouches[0]),e.preventDefault())}onDragEnd(){this.colorDragging=!1,this.hueDragging=!1,this.unbindDocumentMousemoveListener(),this.unbindDocumentMouseupListener()}pickColor(e,t){let i=t?t.pageX:e.pageX,n=t?t.pageY:e.pageY,s=this.colorSelectorViewChild?.nativeElement.getBoundingClientRect(),c=s.top+(this.document.defaultView.pageYOffset||this.document.documentElement.scrollTop||this.document.body.scrollTop||0),d=s.left+this.document.body.scrollLeft,p=Math.floor(100*Math.max(0,Math.min(150,i-d))/150),me=Math.floor(100*(150-Math.max(0,Math.min(150,n-c)))/150);this.value=this.validateHSB({h:this.value.h,s:p,b:me}),this.updateUI(),this.updateModel(),this.onChange.emit({originalEvent:e,value:this.getValueToUpdate()})}getValueToUpdate(){let e;switch(this.format){case"hex":e="#"+this.HSBtoHEX(this.value);break;case"rgb":e=this.HSBtoRGB(this.value);break;case"hsb":e=this.value;break}return e}updateModel(){this.onModelChange(this.getValueToUpdate()),this.cd.markForCheck()}updateColorSelector(){if(this.colorSelectorViewChild){let e={};e.s=100,e.b=100,e.h=this.value.h,this.colorSelectorViewChild.nativeElement.style.backgroundColor="#"+this.HSBtoHEX(e)}}updateUI(){this.colorHandleViewChild&&this.hueHandleViewChild?.nativeElement&&(this.colorHandleViewChild.nativeElement.style.left=Math.floor(150*this.value.s/100)+"px",this.colorHandleViewChild.nativeElement.style.top=Math.floor(150*(100-this.value.b)/100)+"px",this.hueHandleViewChild.nativeElement.style.top=Math.floor(150-150*this.value.h/360)+"px"),this.inputBgColor="#"+this.HSBtoHEX(this.value)}onInputFocus(){this.onModelTouched()}show(){this.overlayVisible=!0,this.cd.markForCheck()}onOverlayAnimationStart(e){switch(e.toState){case"visible":this.inline||(this.overlay=e.element,this.attrSelector&&this.overlay?.setAttribute(this.attrSelector,""),this.appendOverlay(),this.autoZIndex&&H.set("overlay",this.overlay,this.config.zIndex.overlay),this.alignOverlay(),this.bindDocumentClickListener(),this.bindDocumentResizeListener(),this.bindScrollListener(),this.updateColorSelector(),this.updateUI());break;case"void":this.onOverlayHide();break}}onOverlayAnimationEnd(e){switch(e.toState){case"visible":this.inline||this.onShow.emit({});break;case"void":this.autoZIndex&&H.clear(e.element),this.onHide.emit({});break}}appendOverlay(){re.appendOverlay(this.overlay,this.$appendTo()==="body"?this.document.body:this.$appendTo(),this.$appendTo())}restoreOverlayAppend(){this.overlay&&this.$appendTo()!=="self"&&this.renderer.appendChild(this.inputViewChild?.nativeElement,this.overlay)}alignOverlay(){this.$appendTo()==="self"?te(this.overlay,this.inputViewChild?.nativeElement):ee(this.overlay,this.inputViewChild?.nativeElement)}hide(){this.overlayVisible=!1,this.cd.markForCheck()}onInputClick(){this.selfClick=!0,this.togglePanel()}togglePanel(){this.overlayVisible?this.hide():this.show()}onInputKeydown(e){switch(e.code){case"Space":this.togglePanel(),e.preventDefault();break;case"Escape":case"Tab":this.hide();break;default:break}}onOverlayClick(e){this.overlayService.add({originalEvent:e,target:this.el.nativeElement}),this.selfClick=!0}bindDocumentClickListener(){if(!this.documentClickListener){let e=this.el?this.el.nativeElement.ownerDocument:"document";this.documentClickListener=this.renderer.listen(e,"click",()=>{this.selfClick||(this.overlayVisible=!1,this.unbindDocumentClickListener()),this.selfClick=!1,this.cd.markForCheck()})}}unbindDocumentClickListener(){this.documentClickListener&&(this.documentClickListener(),this.documentClickListener=null)}bindDocumentMousemoveListener(){if(!this.documentMousemoveListener){let e=this.el?this.el.nativeElement.ownerDocument:"document";this.documentMousemoveListener=this.renderer.listen(e,"mousemove",t=>{this.colorDragging&&this.pickColor(t),this.hueDragging&&this.pickHue(t)})}}unbindDocumentMousemoveListener(){this.documentMousemoveListener&&(this.documentMousemoveListener(),this.documentMousemoveListener=null)}bindDocumentMouseupListener(){if(!this.documentMouseupListener){let e=this.el?this.el.nativeElement.ownerDocument:"document";this.documentMouseupListener=this.renderer.listen(e,"mouseup",()=>{this.colorDragging=!1,this.hueDragging=!1,this.unbindDocumentMousemoveListener(),this.unbindDocumentMouseupListener()})}}unbindDocumentMouseupListener(){this.documentMouseupListener&&(this.documentMouseupListener(),this.documentMouseupListener=null)}bindDocumentResizeListener(){K(this.platformId)&&(this.documentResizeListener=this.renderer.listen(this.document.defaultView,"resize",this.onWindowResize.bind(this)))}unbindDocumentResizeListener(){this.documentResizeListener&&(this.documentResizeListener(),this.documentResizeListener=null)}onWindowResize(){this.overlayVisible&&!ie()&&this.hide()}bindScrollListener(){this.scrollHandler||(this.scrollHandler=new ae(this.el?.nativeElement,()=>{this.overlayVisible&&this.hide()})),this.scrollHandler.bindScrollListener()}unbindScrollListener(){this.scrollHandler&&this.scrollHandler.unbindScrollListener()}validateHSB(e){return{h:Math.min(360,Math.max(0,e.h)),s:Math.min(100,Math.max(0,e.s)),b:Math.min(100,Math.max(0,e.b))}}validateRGB(e){return{r:Math.min(255,Math.max(0,e.r)),g:Math.min(255,Math.max(0,e.g)),b:Math.min(255,Math.max(0,e.b))}}validateHEX(e){var t=6-e.length;if(t>0){for(var i=[],n=0;n<t;n++)i.push("0");i.push(e),e=i.join("")}return e}HEXtoRGB(e){let t=parseInt(e.indexOf("#")>-1?e.substring(1):e,16);return{r:t>>16,g:(t&65280)>>8,b:t&255}}HEXtoHSB(e){return this.RGBtoHSB(this.HEXtoRGB(e))}RGBtoHSB(e){var t={h:0,s:0,b:0},i=Math.min(e.r,e.g,e.b),n=Math.max(e.r,e.g,e.b),s=n-i;return t.b=n,t.s=n!=0?255*s/n:0,t.s!=0?e.r==n?t.h=(e.g-e.b)/s:e.g==n?t.h=2+(e.b-e.r)/s:t.h=4+(e.r-e.g)/s:t.h=-1,t.h*=60,t.h<0&&(t.h+=360),t.s*=100/255,t.b*=100/255,t}HSBtoRGB(e){var t={r:0,g:0,b:0};let i=e.h,n=e.s*255/100,s=e.b*255/100;if(n==0)t={r:s,g:s,b:s};else{let c=s,d=(255-n)*s/255,p=(c-d)*(i%60)/60;i==360&&(i=0),i<60?(t.r=c,t.b=d,t.g=d+p):i<120?(t.g=c,t.b=d,t.r=c-p):i<180?(t.g=c,t.r=d,t.b=d+p):i<240?(t.b=c,t.r=d,t.g=c-p):i<300?(t.b=c,t.g=d,t.r=d+p):i<360?(t.r=c,t.g=d,t.b=c-p):(t.r=0,t.g=0,t.b=0)}return{r:Math.round(t.r),g:Math.round(t.g),b:Math.round(t.b)}}RGBtoHEX(e){var t=[e.r.toString(16),e.g.toString(16),e.b.toString(16)];for(var i in t)t[i].length==1&&(t[i]="0"+t[i]);return t.join("")}HSBtoHEX(e){return this.RGBtoHEX(this.HSBtoRGB(e))}onOverlayHide(){this.unbindScrollListener(),this.unbindDocumentResizeListener(),this.unbindDocumentClickListener(),this.overlay=null}ngAfterViewInit(){this.inline&&(this.updateColorSelector(),this.updateUI())}writeControlValue(e){if(e)switch(this.format){case"hex":this.value=this.HEXtoHSB(e);break;case"rgb":this.value=this.RGBtoHSB(e);break;case"hsb":this.value=e;break}else this.value=this.HEXtoHSB(this.defaultColor);this.updateColorSelector(),this.updateUI(),this.cd.markForCheck()}ngOnDestroy(){this.scrollHandler&&(this.scrollHandler.destroy(),this.scrollHandler=null),this.overlay&&this.autoZIndex&&H.clear(this.overlay),this.restoreOverlayAppend(),this.onOverlayHide()}cn=J;static \u0275fac=function(t){return new(t||o)($(ne))};static \u0275cmp=X({type:o,selectors:[["p-colorPicker"],["p-colorpicker"],["p-color-picker"]],viewQuery:function(t,i){if(t&1&&(v(ve,5),v(be,5),v(xe,5),v(ke,5),v(we,5)),t&2){let n;b(n=x())&&(i.inputViewChild=n.first),b(n=x())&&(i.colorSelector=n.first),b(n=x())&&(i.colorHandle=n.first),b(n=x())&&(i.hue=n.first),b(n=x())&&(i.hueHandle=n.first)}},hostVars:4,hostBindings:function(t,i){t&2&&(h("data-pc-name","colorpicker")("data-pc-section","root"),u(i.cn(i.cx("root"),i.styleClass)))},inputs:{styleClass:"styleClass",inline:[2,"inline","inline",M],format:"format",tabindex:"tabindex",inputId:"inputId",autoZIndex:[2,"autoZIndex","autoZIndex",M],showTransitionOptions:"showTransitionOptions",hideTransitionOptions:"hideTransitionOptions",autofocus:[2,"autofocus","autofocus",M],defaultColor:"defaultColor",appendTo:[1,"appendTo"]},outputs:{onChange:"onChange",onShow:"onShow",onHide:"onHide"},features:[B([He,pe]),E],decls:2,vars:2,consts:[["input",""],["colorSelector",""],["colorHandle",""],["hue",""],["hueHandle",""],["type","text","readonly","",3,"class","backgroundColor","pAutoFocus","click","keydown","focus",4,"ngIf"],[3,"class","click",4,"ngIf"],["type","text","readonly","",3,"click","keydown","focus","pAutoFocus"],[3,"click"],[3,"touchstart","touchmove","touchend","mousedown"],[3,"mousedown","touchstart","touchmove","touchend"]],template:function(t,i){t&1&&N(0,Ce,2,10,"input",5)(1,Me,11,28,"div",6),t&2&&(k("ngIf",!i.inline),f(),k("ngIf",i.inline||i.overlayVisible))},dependencies:[q,Z,se,le,S],encapsulation:2,data:{animation:[W("overlayAnimation",[O(":enter",[z({opacity:0,transform:"scaleY(0.8)"}),R("{{showTransitionParams}}")]),O(":leave",[R("{{hideTransitionParams}}",z({opacity:0}))])])]},changeDetection:0})}return o})(),ot=(()=>{class o{static \u0275fac=function(t){return new(t||o)};static \u0275mod=y({type:o});static \u0275inj=w({imports:[fe,S,S]})}return o})();export{Le as a,fe as b,ot as c};
