import{c as pe,d as ue}from"./chunk-IRG7FGLH.js";import{c as de,d as V,f as $,g as L,h as U,t as M}from"./chunk-Y2XKIJAD.js";import{Z as se,ia as T,ma as le,pa as F,ra as he,u as y,v as Q,w as P}from"./chunk-43D2A2M3.js";import{Ab as ee,Bb as C,Dc as p,Fb as K,Gb as S,Gc as E,Ic as j,Kb as O,Mb as l,Nb as x,Ob as H,Pb as ne,Qa as f,Rb as oe,S as g,Sb as te,T as q,U as G,Wb as ie,Xc as ae,Y as r,Zb as d,_c as ce,bb as _,cb as z,cd as re,ea as N,fb as A,gb as J,hb as v,hd as D,jb as B,lc as w,ma as W,nc as b,qa as m,sb as u,tb as X,ub as Y,yb as a,zb as Z}from"./chunk-Z36KDTBG.js";var fe=`
    .p-accordionpanel {
        display: flex;
        flex-direction: column;
        border-style: solid;
        border-width: dt('accordion.panel.border.width');
        border-color: dt('accordion.panel.border.color');
    }

    .p-accordionheader {
        all: unset;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: dt('accordion.header.padding');
        color: dt('accordion.header.color');
        background: dt('accordion.header.background');
        border-style: solid;
        border-width: dt('accordion.header.border.width');
        border-color: dt('accordion.header.border.color');
        font-weight: dt('accordion.header.font.weight');
        border-radius: dt('accordion.header.border.radius');
        transition:
            background dt('accordion.transition.duration'),
            color dt('accordion.transition.duration'),
            outline-color dt('accordion.transition.duration'),
            box-shadow dt('accordion.transition.duration');
        outline-color: transparent;
    }

    .p-accordionpanel:first-child > .p-accordionheader {
        border-width: dt('accordion.header.first.border.width');
        border-start-start-radius: dt('accordion.header.first.top.border.radius');
        border-start-end-radius: dt('accordion.header.first.top.border.radius');
    }

    .p-accordionpanel:last-child > .p-accordionheader {
        border-end-start-radius: dt('accordion.header.last.bottom.border.radius');
        border-end-end-radius: dt('accordion.header.last.bottom.border.radius');
    }

    .p-accordionpanel:last-child.p-accordionpanel-active > .p-accordionheader {
        border-end-start-radius: dt('accordion.header.last.active.bottom.border.radius');
        border-end-end-radius: dt('accordion.header.last.active.bottom.border.radius');
    }

    .p-accordionheader-toggle-icon {
        color: dt('accordion.header.toggle.icon.color');
    }

    .p-accordionpanel:not(.p-disabled) .p-accordionheader:focus-visible {
        box-shadow: dt('accordion.header.focus.ring.shadow');
        outline: dt('accordion.header.focus.ring.width') dt('accordion.header.focus.ring.style') dt('accordion.header.focus.ring.color');
        outline-offset: dt('accordion.header.focus.ring.offset');
    }

    .p-accordionpanel:not(.p-accordionpanel-active):not(.p-disabled) > .p-accordionheader:hover {
        background: dt('accordion.header.hover.background');
        color: dt('accordion.header.hover.color');
    }

    .p-accordionpanel:not(.p-accordionpanel-active):not(.p-disabled) .p-accordionheader:hover .p-accordionheader-toggle-icon {
        color: dt('accordion.header.toggle.icon.hover.color');
    }

    .p-accordionpanel:not(.p-disabled).p-accordionpanel-active > .p-accordionheader {
        background: dt('accordion.header.active.background');
        color: dt('accordion.header.active.color');
    }

    .p-accordionpanel:not(.p-disabled).p-accordionpanel-active > .p-accordionheader .p-accordionheader-toggle-icon {
        color: dt('accordion.header.toggle.icon.active.color');
    }

    .p-accordionpanel:not(.p-disabled).p-accordionpanel-active > .p-accordionheader:hover {
        background: dt('accordion.header.active.hover.background');
        color: dt('accordion.header.active.hover.color');
    }

    .p-accordionpanel:not(.p-disabled).p-accordionpanel-active > .p-accordionheader:hover .p-accordionheader-toggle-icon {
        color: dt('accordion.header.toggle.icon.active.hover.color');
    }

    .p-accordioncontent-content {
        border-style: solid;
        border-width: dt('accordion.content.border.width');
        border-color: dt('accordion.content.border.color');
        background-color: dt('accordion.content.background');
        color: dt('accordion.content.color');
        padding: dt('accordion.content.padding');
    }
`;var I=["*"],me=["toggleicon"],ve=n=>({active:n});function be(n,s){}function ye(n,s){n&1&&v(0,be,0,0,"ng-template")}function _e(n,s){if(n&1&&v(0,ye,1,0,null,0),n&2){let e=l();a("ngTemplateOutlet",e.toggleicon)("ngTemplateOutletContext",b(2,ve,e.active()))}}function Ae(n,s){if(n&1&&C(0,"span",4),n&2){let e=l(3);d(e.pcAccordion.collapseIcon),a("ngClass",e.pcAccordion.iconClass),u("aria-hidden",!0)}}function Ce(n,s){if(n&1&&(N(),C(0,"svg",5)),n&2){let e=l(3);d(e.pcAccordion.iconClass),u("aria-hidden",!0)}}function xe(n,s){if(n&1&&(K(0),v(1,Ae,1,4,"span",2)(2,Ce,1,3,"svg",3),S()),n&2){let e=l(2);f(),a("ngIf",e.pcAccordion.collapseIcon),f(),a("ngIf",!e.pcAccordion.collapseIcon)}}function He(n,s){if(n&1&&C(0,"span",4),n&2){let e=l(3);d(e.pcAccordion.expandIcon),a("ngClass",e.pcAccordion.iconClass),u("aria-hidden",!0)}}function we(n,s){if(n&1&&(N(),C(0,"svg",7)),n&2){let e=l(3);d(e.pcAccordion.iconClass),u("aria-hidden",!0)}}function De(n,s){if(n&1&&(K(0),v(1,He,1,4,"span",2)(2,we,1,3,"svg",6),S()),n&2){let e=l(2);f(),a("ngIf",e.pcAccordion.expandIcon),f(),a("ngIf",!e.pcAccordion.expandIcon)}}function Pe(n,s){if(n&1&&v(0,xe,3,2,"ng-container",1)(1,De,3,2,"ng-container",1),n&2){let e=l();a("ngIf",e.active()),f(),a("ngIf",!e.active())}}var ge=n=>({transitionParams:n}),Fe=n=>({value:"visible",params:n}),Ee=n=>({value:"hidden",params:n}),Te=`
    ${fe}

    /*For PrimeNG*/
    .p-accordionpanel:not(.p-accordionpanel-active) > .p-accordioncontent,
    .p-accordioncontent-content.ng-animating {
        overflow: hidden;
    }

    .p-accordionheader-toggle-icon.icon-start {
        order: -1;
    }

    .p-accordionheader:has(.p-accordionheader-toggle-icon.icon-start) {
        justify-content: flex-start;
        gap: dt('accordion.header.padding');
    }

    .p-accordioncontent.ng-animating {
        overflow: hidden;
    }

    .p-accordionheader.p-ripple {
        overflow: hidden;
        position: relative;
    }
`,Me={root:"p-accordion p-component",panel:({instance:n})=>["p-accordionpanel",{"p-accordionpanel-active":n.active(),"p-disabled":n.disabled()}],header:"p-accordionheader",toggleicon:"p-accordionheader-toggle-icon",contentContainer:"p-accordioncontent",content:"p-accordioncontent-content"},h=(()=>{class n extends le{name="accordion";theme=Te;classes=Me;static \u0275fac=(()=>{let e;return function(t){return(e||(e=m(n)))(t||n)}})();static \u0275prov=q({token:n,factory:n.\u0275fac})}return n})();var R=(()=>{class n extends F{pcAccordion=r(g(()=>k));value=j(void 0);disabled=E(!1,{transform:e=>M(e)});active=p(()=>this.pcAccordion.multiple()?this.valueEquals(this.pcAccordion.value(),this.value()):this.pcAccordion.value()===this.value());valueEquals(e,o){return Array.isArray(e)?e.includes(o):e===o}_componentStyle=r(h);static \u0275fac=(()=>{let e;return function(t){return(e||(e=m(n)))(t||n)}})();static \u0275cmp=_({type:n,selectors:[["p-accordion-panel"],["p-accordionpanel"]],hostVars:5,hostBindings:function(o,t){o&2&&(u("data-pc-name","accordionpanel")("data-p-disabled",t.disabled())("data-p-active",t.active()),d(t.cx("panel")))},inputs:{value:[1,"value"],disabled:[1,"disabled"]},outputs:{value:"valueChange"},features:[w([h]),A],ngContentSelectors:I,decls:1,vars:0,template:function(o,t){o&1&&(x(),H(0))},dependencies:[D],encapsulation:2,changeDetection:0})}return n})(),Ie=(()=>{class n extends F{pcAccordion=r(g(()=>k));pcAccordionPanel=r(g(()=>R));id=p(()=>`${this.pcAccordion.id()}_accordionheader_${this.pcAccordionPanel.value()}`);active=p(()=>this.pcAccordionPanel.active());disabled=p(()=>this.pcAccordionPanel.disabled());ariaControls=p(()=>`${this.pcAccordion.id()}_accordioncontent_${this.pcAccordionPanel.value()}`);toggleicon;onClick(e){if(this.disabled())return;let o=this.active();this.changeActiveValue();let t=this.active(),i=this.pcAccordionPanel.value();!o&&t?this.pcAccordion.onOpen.emit({originalEvent:e,index:i}):o&&!t&&this.pcAccordion.onClose.emit({originalEvent:e,index:i})}onFocus(){!this.disabled()&&this.pcAccordion.selectOnFocus()&&this.changeActiveValue()}onKeydown(e){switch(e.code){case"ArrowDown":this.arrowDownKey(e);break;case"ArrowUp":this.arrowUpKey(e);break;case"Home":this.onHomeKey(e);break;case"End":this.onEndKey(e);break;case"Enter":case"Space":case"NumpadEnter":this.onEnterKey(e);break;default:break}}_componentStyle=r(h);changeActiveValue(){this.pcAccordion.updateValue(this.pcAccordionPanel.value())}findPanel(e){return e?.closest('[data-pc-name="accordionpanel"]')}findHeader(e){return y(e,'[data-pc-name="accordionheader"]')}findNextPanel(e,o=!1){let t=o?e:e.nextElementSibling;return t?P(t,"data-p-disabled")?this.findNextPanel(t):this.findHeader(t):null}findPrevPanel(e,o=!1){let t=o?e:e.previousElementSibling;return t?P(t,"data-p-disabled")?this.findPrevPanel(t):this.findHeader(t):null}findFirstPanel(){return this.findNextPanel(this.pcAccordion.el.nativeElement.firstElementChild,!0)}findLastPanel(){return this.findPrevPanel(this.pcAccordion.el.nativeElement.lastElementChild,!0)}changeFocusedPanel(e,o){Q(o)}arrowDownKey(e){let o=this.findNextPanel(this.findPanel(e.currentTarget));o?this.changeFocusedPanel(e,o):this.onHomeKey(e),e.preventDefault()}arrowUpKey(e){let o=this.findPrevPanel(this.findPanel(e.currentTarget));o?this.changeFocusedPanel(e,o):this.onEndKey(e),e.preventDefault()}onHomeKey(e){let o=this.findFirstPanel();this.changeFocusedPanel(e,o),e.preventDefault()}onEndKey(e){let o=this.findLastPanel();this.changeFocusedPanel(e,o),e.preventDefault()}onEnterKey(e){this.disabled()||this.changeActiveValue(),e.preventDefault()}static \u0275fac=(()=>{let e;return function(t){return(e||(e=m(n)))(t||n)}})();static \u0275cmp=_({type:n,selectors:[["p-accordion-header"],["p-accordionheader"]],contentQueries:function(o,t,i){if(o&1&&ne(i,me,5),o&2){let c;oe(c=te())&&(t.toggleicon=c.first)}},hostVars:13,hostBindings:function(o,t){o&1&&O("click",function(c){return t.onClick(c)})("focus",function(c){return t.onFocus(c)})("keydown",function(c){return t.onKeydown(c)}),o&2&&(u("id",t.id())("aria-expanded",t.active())("aria-controls",t.ariaControls())("aria-disabled",t.disabled())("role","button")("tabindex",t.disabled()?"-1":"0")("data-p-active",t.active())("data-p-disabled",t.disabled())("data-pc-name","accordionheader"),d(t.cx("header")),ie("user-select","none"))},features:[w([h]),J([he]),A],ngContentSelectors:I,decls:3,vars:1,consts:[[4,"ngTemplateOutlet","ngTemplateOutletContext"],[4,"ngIf"],[3,"class","ngClass",4,"ngIf"],["data-p-icon","chevron-up",3,"class",4,"ngIf"],[3,"ngClass"],["data-p-icon","chevron-up"],["data-p-icon","chevron-down",3,"class",4,"ngIf"],["data-p-icon","chevron-down"]],template:function(o,t){o&1&&(x(),H(0),X(1,_e,1,4)(2,Pe,2,2)),o&2&&(f(),Y(t.toggleicon?1:2))},dependencies:[D,ae,ce,re,pe,ue],encapsulation:2,changeDetection:0})}return n})(),ke=(()=>{class n extends F{pcAccordion=r(g(()=>k));pcAccordionPanel=r(g(()=>R));active=p(()=>this.pcAccordionPanel.active());ariaLabelledby=p(()=>`${this.pcAccordion.id()}_accordionheader_${this.pcAccordionPanel.value()}`);id=p(()=>`${this.pcAccordion.id()}_accordioncontent_${this.pcAccordionPanel.value()}`);_componentStyle=r(h);static \u0275fac=(()=>{let e;return function(t){return(e||(e=m(n)))(t||n)}})();static \u0275cmp=_({type:n,selectors:[["p-accordion-content"],["p-accordioncontent"]],hostVars:7,hostBindings:function(o,t){o&2&&(u("id",t.id())("role","region")("data-pc-name","accordioncontent")("data-p-active",t.active())("aria-labelledby",t.ariaLabelledby()),d(t.cx("contentContainer")))},features:[w([h]),A],ngContentSelectors:I,decls:2,vars:11,template:function(o,t){o&1&&(x(),Z(0,"div"),H(1),ee()),o&2&&(d(t.cx("content")),a("@content",t.active()?b(5,Fe,b(3,ge,t.pcAccordion.transitionOptions)):b(9,Ee,b(7,ge,t.pcAccordion.transitionOptions))))},dependencies:[D],encapsulation:2,data:{animation:[de("content",[L("hidden",$({height:"0",paddingBlockStart:"0",paddingBlockEnd:"0",borderBlockStartWidth:"0",borderBlockEndWidth:"0",visibility:"hidden"})),L("visible",$({height:"*"})),U("visible <=> hidden",[V("{{transitionParams}}")]),U("void => *",V(0))])]},changeDetection:0})}return n})(),k=(()=>{class n extends F{value=j(void 0);multiple=E(!1,{transform:e=>M(e)});styleClass;expandIcon;collapseIcon;selectOnFocus=E(!1,{transform:e=>M(e)});transitionOptions="400ms cubic-bezier(0.86, 0, 0.07, 1)";onClose=new B;onOpen=new B;id=W(se("pn_id_"));_componentStyle=r(h);onKeydown(e){switch(e.code){case"ArrowDown":this.onTabArrowDownKey(e);break;case"ArrowUp":this.onTabArrowUpKey(e);break;case"Home":e.shiftKey||this.onTabHomeKey(e);break;case"End":e.shiftKey||this.onTabEndKey(e);break}}onTabArrowDownKey(e){let o=this.findNextHeaderAction(e.target.parentElement);o?this.changeFocusedTab(o):this.onTabHomeKey(e),e.preventDefault()}onTabArrowUpKey(e){let o=this.findPrevHeaderAction(e.target.parentElement);o?this.changeFocusedTab(o):this.onTabEndKey(e),e.preventDefault()}onTabHomeKey(e){let o=this.findFirstHeaderAction();this.changeFocusedTab(o),e.preventDefault()}changeFocusedTab(e){e&&Q(e)}findNextHeaderAction(e,o=!1){let t=o?e:e.nextElementSibling,i=y(t,'[data-pc-section="accordionheader"]');return i?P(i,"data-p-disabled")?this.findNextHeaderAction(i.parentElement):y(i.parentElement,'[data-pc-section="accordionheader"]'):null}findPrevHeaderAction(e,o=!1){let t=o?e:e.previousElementSibling,i=y(t,'[data-pc-section="accordionheader"]');return i?P(i,"data-p-disabled")?this.findPrevHeaderAction(i.parentElement):y(i.parentElement,'[data-pc-section="accordionheader"]'):null}findFirstHeaderAction(){let e=this.el.nativeElement.firstElementChild;return this.findNextHeaderAction(e,!0)}findLastHeaderAction(){let e=this.el.nativeElement.lastElementChild;return this.findPrevHeaderAction(e,!0)}onTabEndKey(e){let o=this.findLastHeaderAction();this.changeFocusedTab(o),e.preventDefault()}getBlockableElement(){return this.el.nativeElement.children[0]}updateValue(e){let o=this.value();if(this.multiple()){let t=Array.isArray(o)?[...o]:[],i=t.indexOf(e);i!==-1?t.splice(i,1):t.push(e),this.value.set(t)}else o===e?this.value.set(void 0):this.value.set(e)}static \u0275fac=(()=>{let e;return function(t){return(e||(e=m(n)))(t||n)}})();static \u0275cmp=_({type:n,selectors:[["p-accordion"]],hostVars:2,hostBindings:function(o,t){o&1&&O("keydown",function(c){return t.onKeydown(c)}),o&2&&d(t.cn(t.cx("root"),t.styleClass))},inputs:{value:[1,"value"],multiple:[1,"multiple"],styleClass:"styleClass",expandIcon:"expandIcon",collapseIcon:"collapseIcon",selectOnFocus:[1,"selectOnFocus"],transitionOptions:"transitionOptions"},outputs:{value:"valueChange",onClose:"onClose",onOpen:"onOpen"},features:[w([h]),A],ngContentSelectors:I,decls:1,vars:0,template:function(o,t){o&1&&(x(),H(0))},dependencies:[D,T],encapsulation:2,changeDetection:0})}return n})(),tn=(()=>{class n{static \u0275fac=function(o){return new(o||n)};static \u0275mod=z({type:n});static \u0275inj=G({imports:[k,T,R,Ie,ke,T]})}return n})();export{R as a,Ie as b,ke as c,k as d,tn as e};
