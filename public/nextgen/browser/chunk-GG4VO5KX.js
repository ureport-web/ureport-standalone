import{a as de}from"./chunk-6IEKC2SE.js";import{c as W,d as D,f as T,h as L,s as M,u as ce}from"./chunk-MK5QWF4G.js";import{a as re,d as se,e as le,f as ae}from"./chunk-2DDACFH7.js";import{I as ie,a as J,ea as oe,ia as x,ja as E,l as ee,ma as ne,o as te}from"./chunk-SWLD4EZT.js";import{Ab as y,Bb as S,Dc as j,Gc as Z,Ib as V,Kb as w,Lc as C,Mb as r,Qa as m,Qb as v,Rb as g,S as I,Sb as b,T as B,U as O,Wa as A,Wb as U,Y as R,Zb as h,_c as N,bb as F,ca as s,cb as X,da as l,fb as $,fd as q,hb as z,jb as _,jd as K,lc as G,nc as Q,oc as Y,qa as P,sb as u,yb as k,zb as f}from"./chunk-VN72LZYD.js";var ue=`
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
`;var fe=["input"],ve=["colorSelector"],ge=["colorHandle"],be=["hue"],ke=["hueHandle"],we=(n,H)=>({showTransitionParams:n,hideTransitionParams:H}),_e=n=>({value:"visible",params:n});function ye(n,H){if(n&1){let e=V();f(0,"input",7,0),w("click",function(){s(e);let i=r();return l(i.onInputClick())})("keydown",function(i){s(e);let o=r();return l(o.onInputKeydown(i))})("focus",function(){s(e);let i=r();return l(i.onInputFocus())}),y()}if(n&2){let e=r();h(e.cx("preview")),U("background-color",e.inputBgColor),k("pAutoFocus",e.autofocus),u("tabindex",e.tabindex)("disabled",e.$disabled()?"":void 0)("id",e.inputId)("data-pc-section","input")("aria-label",e.ariaLabel)}}function Ce(n,H){if(n&1){let e=V();f(0,"div",8),w("click",function(i){s(e);let o=r();return l(o.onOverlayClick(i))})("@overlayAnimation.start",function(i){s(e);let o=r();return l(o.onOverlayAnimationStart(i))})("@overlayAnimation.done",function(i){s(e);let o=r();return l(o.onOverlayAnimationEnd(i))}),f(1,"div")(2,"div",9,1),w("touchstart",function(i){s(e);let o=r();return l(o.onColorDragStart(i))})("touchmove",function(i){s(e);let o=r();return l(o.onDrag(i))})("touchend",function(){s(e);let i=r();return l(i.onDragEnd())})("mousedown",function(i){s(e);let o=r();return l(o.onColorMousedown(i))}),f(4,"div"),S(5,"div",null,2),y()(),f(7,"div",10,3),w("mousedown",function(i){s(e);let o=r();return l(o.onHueMousedown(i))})("touchstart",function(i){s(e);let o=r();return l(o.onHueDragStart(i))})("touchmove",function(i){s(e);let o=r();return l(o.onDrag(i))})("touchend",function(){s(e);let i=r();return l(i.onDragEnd())}),S(9,"div",null,4),y()()()}if(n&2){let e=r();h(e.cx("panel")),k("@overlayAnimation",Q(26,_e,Y(23,we,e.showTransitionOptions,e.hideTransitionOptions)))("@.disabled",e.inline===!0),u("data-pc-section","panel"),m(),h(e.cx("content")),u("data-pc-section","content"),m(),h(e.cx("colorSelector")),u("data-pc-section","selector"),m(2),h(e.cx("colorBackground")),u("data-pc-section","color"),m(),h(e.cx("colorHandle")),u("data-pc-section","colorHandle"),m(2),h(e.cx("hue")),u("data-pc-section","hue"),m(2),h(e.cx("hueHandle")),u("data-pc-section","hueHandle")}}var xe={root:({instance:n})=>["p-colorpicker p-component",{"p-colorpicker-overlay":!n.inline,"p-colorpicker-dragging":n.colorDragging||n.hueDragging}],preview:({instance:n})=>["p-colorpicker-preview",{"p-disabled":n.$disabled()}],panel:({instance:n})=>["p-colorpicker-panel",{"p-colorpicker-panel-inline":n.inline,"p-disabled":n.$disabled()}],content:"p-colorpicker-content",colorSelector:"p-colorpicker-color-selector",colorBackground:"p-colorpicker-color-background",colorHandle:"p-colorpicker-color-handle",hue:"p-colorpicker-hue",hueHandle:"p-colorpicker-hue-handle"},he=(()=>{class n extends ne{name="colorpicker";theme=ue;classes=xe;static \u0275fac=(()=>{let e;return function(i){return(e||(e=P(n)))(i||n)}})();static \u0275prov=B({token:n,factory:n.\u0275fac})}return n})();var Me={provide:ce,useExisting:I(()=>pe),multi:!0},pe=(()=>{class n extends de{overlayService;styleClass;inline;format="hex";tabindex;inputId;autoZIndex=!0;showTransitionOptions=".12s cubic-bezier(0, 0, 0.2, 1)";hideTransitionOptions=".1s linear";autofocus;defaultColor="ff0000";appendTo=Z(void 0);onChange=new _;onShow=new _;onHide=new _;inputViewChild;$appendTo=j(()=>this.appendTo()||this.config.overlayAppendTo());value={h:0,s:100,b:100};inputBgColor;shown;overlayVisible;documentClickListener;documentResizeListener;documentMousemoveListener;documentMouseupListener;documentHueMoveListener;scrollHandler;selfClick;colorDragging;hueDragging;overlay;colorSelectorViewChild;colorHandleViewChild;hueViewChild;hueHandleViewChild;_componentStyle=R(he);constructor(e){super(),this.overlayService=e}set colorSelector(e){this.colorSelectorViewChild=e}set colorHandle(e){this.colorHandleViewChild=e}set hue(e){this.hueViewChild=e}set hueHandle(e){this.hueHandleViewChild=e}get ariaLabel(){return this.config?.getTranslation(E.ARIA)[E.SELECT_COLOR]}onHueMousedown(e){this.$disabled()||(this.bindDocumentMousemoveListener(),this.bindDocumentMouseupListener(),this.hueDragging=!0,this.pickHue(e))}onHueDragStart(e){this.$disabled()||(this.hueDragging=!0,this.pickHue(e,e.changedTouches[0]))}onColorDragStart(e){this.$disabled()||(this.colorDragging=!0,this.pickColor(e,e.changedTouches[0]))}pickHue(e,t){let i=t?t.pageY:e.pageY,o=this.hueViewChild?.nativeElement.getBoundingClientRect().top+(this.document.defaultView.pageYOffset||this.document.documentElement.scrollTop||this.document.body.scrollTop||0);this.value=this.validateHSB({h:Math.floor(360*(150-Math.max(0,Math.min(150,i-o)))/150),s:this.value.s,b:this.value.b}),this.updateColorSelector(),this.updateUI(),this.updateModel(),this.onChange.emit({originalEvent:e,value:this.getValueToUpdate()})}onColorMousedown(e){this.$disabled()||(this.bindDocumentMousemoveListener(),this.bindDocumentMouseupListener(),this.colorDragging=!0,this.pickColor(e))}onDrag(e){this.colorDragging&&(this.pickColor(e,e.changedTouches[0]),e.preventDefault()),this.hueDragging&&(this.pickHue(e,e.changedTouches[0]),e.preventDefault())}onDragEnd(){this.colorDragging=!1,this.hueDragging=!1,this.unbindDocumentMousemoveListener(),this.unbindDocumentMouseupListener()}pickColor(e,t){let i=t?t.pageX:e.pageX,o=t?t.pageY:e.pageY,a=this.colorSelectorViewChild?.nativeElement.getBoundingClientRect(),c=a.top+(this.document.defaultView.pageYOffset||this.document.documentElement.scrollTop||this.document.body.scrollTop||0),d=a.left+this.document.body.scrollLeft,p=Math.floor(100*Math.max(0,Math.min(150,i-d))/150),me=Math.floor(100*(150-Math.max(0,Math.min(150,o-c)))/150);this.value=this.validateHSB({h:this.value.h,s:p,b:me}),this.updateUI(),this.updateModel(),this.onChange.emit({originalEvent:e,value:this.getValueToUpdate()})}getValueToUpdate(){let e;switch(this.format){case"hex":e="#"+this.HSBtoHEX(this.value);break;case"rgb":e=this.HSBtoRGB(this.value);break;case"hsb":e=this.value;break}return e}updateModel(){this.onModelChange(this.getValueToUpdate()),this.cd.markForCheck()}updateColorSelector(){if(this.colorSelectorViewChild){let e={};e.s=100,e.b=100,e.h=this.value.h,this.colorSelectorViewChild.nativeElement.style.backgroundColor="#"+this.HSBtoHEX(e)}}updateUI(){this.colorHandleViewChild&&this.hueHandleViewChild?.nativeElement&&(this.colorHandleViewChild.nativeElement.style.left=Math.floor(150*this.value.s/100)+"px",this.colorHandleViewChild.nativeElement.style.top=Math.floor(150*(100-this.value.b)/100)+"px",this.hueHandleViewChild.nativeElement.style.top=Math.floor(150-150*this.value.h/360)+"px"),this.inputBgColor="#"+this.HSBtoHEX(this.value)}onInputFocus(){this.onModelTouched()}show(){this.overlayVisible=!0,this.cd.markForCheck()}onOverlayAnimationStart(e){switch(e.toState){case"visible":this.inline||(this.overlay=e.element,this.attrSelector&&this.overlay?.setAttribute(this.attrSelector,""),this.appendOverlay(),this.autoZIndex&&M.set("overlay",this.overlay,this.config.zIndex.overlay),this.alignOverlay(),this.bindDocumentClickListener(),this.bindDocumentResizeListener(),this.bindScrollListener(),this.updateColorSelector(),this.updateUI());break;case"void":this.onOverlayHide();break}}onOverlayAnimationEnd(e){switch(e.toState){case"visible":this.inline||this.onShow.emit({});break;case"void":this.autoZIndex&&M.clear(e.element),this.onHide.emit({});break}}appendOverlay(){re.appendOverlay(this.overlay,this.$appendTo()==="body"?this.document.body:this.$appendTo(),this.$appendTo())}restoreOverlayAppend(){this.overlay&&this.$appendTo()!=="self"&&this.renderer.appendChild(this.inputViewChild?.nativeElement,this.overlay)}alignOverlay(){this.$appendTo()==="self"?te(this.overlay,this.inputViewChild?.nativeElement):ee(this.overlay,this.inputViewChild?.nativeElement)}hide(){this.overlayVisible=!1,this.cd.markForCheck()}onInputClick(){this.selfClick=!0,this.togglePanel()}togglePanel(){this.overlayVisible?this.hide():this.show()}onInputKeydown(e){switch(e.code){case"Space":this.togglePanel(),e.preventDefault();break;case"Escape":case"Tab":this.hide();break;default:break}}onOverlayClick(e){this.overlayService.add({originalEvent:e,target:this.el.nativeElement}),this.selfClick=!0}bindDocumentClickListener(){if(!this.documentClickListener){let e=this.el?this.el.nativeElement.ownerDocument:"document";this.documentClickListener=this.renderer.listen(e,"click",()=>{this.selfClick||(this.overlayVisible=!1,this.unbindDocumentClickListener()),this.selfClick=!1,this.cd.markForCheck()})}}unbindDocumentClickListener(){this.documentClickListener&&(this.documentClickListener(),this.documentClickListener=null)}bindDocumentMousemoveListener(){if(!this.documentMousemoveListener){let e=this.el?this.el.nativeElement.ownerDocument:"document";this.documentMousemoveListener=this.renderer.listen(e,"mousemove",t=>{this.colorDragging&&this.pickColor(t),this.hueDragging&&this.pickHue(t)})}}unbindDocumentMousemoveListener(){this.documentMousemoveListener&&(this.documentMousemoveListener(),this.documentMousemoveListener=null)}bindDocumentMouseupListener(){if(!this.documentMouseupListener){let e=this.el?this.el.nativeElement.ownerDocument:"document";this.documentMouseupListener=this.renderer.listen(e,"mouseup",()=>{this.colorDragging=!1,this.hueDragging=!1,this.unbindDocumentMousemoveListener(),this.unbindDocumentMouseupListener()})}}unbindDocumentMouseupListener(){this.documentMouseupListener&&(this.documentMouseupListener(),this.documentMouseupListener=null)}bindDocumentResizeListener(){K(this.platformId)&&(this.documentResizeListener=this.renderer.listen(this.document.defaultView,"resize",this.onWindowResize.bind(this)))}unbindDocumentResizeListener(){this.documentResizeListener&&(this.documentResizeListener(),this.documentResizeListener=null)}onWindowResize(){this.overlayVisible&&!ie()&&this.hide()}bindScrollListener(){this.scrollHandler||(this.scrollHandler=new se(this.el?.nativeElement,()=>{this.overlayVisible&&this.hide()})),this.scrollHandler.bindScrollListener()}unbindScrollListener(){this.scrollHandler&&this.scrollHandler.unbindScrollListener()}validateHSB(e){return{h:Math.min(360,Math.max(0,e.h)),s:Math.min(100,Math.max(0,e.s)),b:Math.min(100,Math.max(0,e.b))}}validateRGB(e){return{r:Math.min(255,Math.max(0,e.r)),g:Math.min(255,Math.max(0,e.g)),b:Math.min(255,Math.max(0,e.b))}}validateHEX(e){var t=6-e.length;if(t>0){for(var i=[],o=0;o<t;o++)i.push("0");i.push(e),e=i.join("")}return e}HEXtoRGB(e){let t=parseInt(e.indexOf("#")>-1?e.substring(1):e,16);return{r:t>>16,g:(t&65280)>>8,b:t&255}}HEXtoHSB(e){return this.RGBtoHSB(this.HEXtoRGB(e))}RGBtoHSB(e){var t={h:0,s:0,b:0},i=Math.min(e.r,e.g,e.b),o=Math.max(e.r,e.g,e.b),a=o-i;return t.b=o,t.s=o!=0?255*a/o:0,t.s!=0?e.r==o?t.h=(e.g-e.b)/a:e.g==o?t.h=2+(e.b-e.r)/a:t.h=4+(e.r-e.g)/a:t.h=-1,t.h*=60,t.h<0&&(t.h+=360),t.s*=100/255,t.b*=100/255,t}HSBtoRGB(e){var t={r:0,g:0,b:0};let i=e.h,o=e.s*255/100,a=e.b*255/100;if(o==0)t={r:a,g:a,b:a};else{let c=a,d=(255-o)*a/255,p=(c-d)*(i%60)/60;i==360&&(i=0),i<60?(t.r=c,t.b=d,t.g=d+p):i<120?(t.g=c,t.b=d,t.r=c-p):i<180?(t.g=c,t.r=d,t.b=d+p):i<240?(t.b=c,t.r=d,t.g=c-p):i<300?(t.b=c,t.g=d,t.r=d+p):i<360?(t.r=c,t.g=d,t.b=c-p):(t.r=0,t.g=0,t.b=0)}return{r:Math.round(t.r),g:Math.round(t.g),b:Math.round(t.b)}}RGBtoHEX(e){var t=[e.r.toString(16),e.g.toString(16),e.b.toString(16)];for(var i in t)t[i].length==1&&(t[i]="0"+t[i]);return t.join("")}HSBtoHEX(e){return this.RGBtoHEX(this.HSBtoRGB(e))}onOverlayHide(){this.unbindScrollListener(),this.unbindDocumentResizeListener(),this.unbindDocumentClickListener(),this.overlay=null}ngAfterViewInit(){this.inline&&(this.updateColorSelector(),this.updateUI())}writeControlValue(e){if(e)switch(this.format){case"hex":this.value=this.HEXtoHSB(e);break;case"rgb":this.value=this.RGBtoHSB(e);break;case"hsb":this.value=e;break}else this.value=this.HEXtoHSB(this.defaultColor);this.updateColorSelector(),this.updateUI(),this.cd.markForCheck()}ngOnDestroy(){this.scrollHandler&&(this.scrollHandler.destroy(),this.scrollHandler=null),this.overlay&&this.autoZIndex&&M.clear(this.overlay),this.restoreOverlayAppend(),this.onOverlayHide()}cn=J;static \u0275fac=function(t){return new(t||n)(A(oe))};static \u0275cmp=F({type:n,selectors:[["p-colorPicker"],["p-colorpicker"],["p-color-picker"]],viewQuery:function(t,i){if(t&1&&(v(fe,5),v(ve,5),v(ge,5),v(be,5),v(ke,5)),t&2){let o;g(o=b())&&(i.inputViewChild=o.first),g(o=b())&&(i.colorSelector=o.first),g(o=b())&&(i.colorHandle=o.first),g(o=b())&&(i.hue=o.first),g(o=b())&&(i.hueHandle=o.first)}},hostVars:4,hostBindings:function(t,i){t&2&&(u("data-pc-name","colorpicker")("data-pc-section","root"),h(i.cn(i.cx("root"),i.styleClass)))},inputs:{styleClass:"styleClass",inline:[2,"inline","inline",C],format:"format",tabindex:"tabindex",inputId:"inputId",autoZIndex:[2,"autoZIndex","autoZIndex",C],showTransitionOptions:"showTransitionOptions",hideTransitionOptions:"hideTransitionOptions",autofocus:[2,"autofocus","autofocus",C],defaultColor:"defaultColor",appendTo:[1,"appendTo"]},outputs:{onChange:"onChange",onShow:"onShow",onHide:"onHide"},features:[G([Me,he]),$],decls:2,vars:2,consts:[["input",""],["colorSelector",""],["colorHandle",""],["hue",""],["hueHandle",""],["type","text","readonly","",3,"class","backgroundColor","pAutoFocus","click","keydown","focus",4,"ngIf"],[3,"class","click",4,"ngIf"],["type","text","readonly","",3,"click","keydown","focus","pAutoFocus"],[3,"click"],[3,"touchstart","touchmove","touchend","mousedown"],[3,"mousedown","touchstart","touchmove","touchend"]],template:function(t,i){t&1&&z(0,ye,2,10,"input",5)(1,Ce,11,28,"div",6),t&2&&(k("ngIf",!i.inline),m(),k("ngIf",i.inline||i.overlayVisible))},dependencies:[q,N,ae,le,x],encapsulation:2,data:{animation:[W("overlayAnimation",[L(":enter",[T({opacity:0,transform:"scaleY(0.8)"}),D("{{showTransitionParams}}")]),L(":leave",[D("{{hideTransitionParams}}",T({opacity:0}))])])]},changeDetection:0})}return n})(),Ke=(()=>{class n{static \u0275fac=function(t){return new(t||n)};static \u0275mod=X({type:n});static \u0275inj=O({imports:[pe,x,x]})}return n})();export{pe as a,Ke as b};
