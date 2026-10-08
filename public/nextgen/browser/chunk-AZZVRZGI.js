import{a as F}from"./chunk-OKL7JSA6.js";import{a as _}from"./chunk-6P5QRVAW.js";import{a as T}from"./chunk-XJHAQDGV.js";import{a as N}from"./chunk-A3N5V3KC.js";import{d as U}from"./chunk-FFQC2BFC.js";import{ja as V,va as j}from"./chunk-33LTLFKZ.js";import{Ec as L,Hc as v,Mc as x,Nb as O,V as k,W as w,_ as h,ac as P,eb as A,fb as D,hb as B,lb as E,mc as R,sa as I}from"./chunk-TCKZT7DO.js";import{e as y}from"./chunk-EQDQRRRY.js";var $=y(T()),S=class t{constructor(){}static analyze(a,e){e&&a.notPass()&&a.setAssignment(t.findMatch(a,e))}static normalize(a){return a&&a.replace(/\d+ × /g,"")}static findMatch(a,e){let u=a.getUID?.(),i=t.normalize(a.getToken()),n=t.normalize(a.getStackTrace?.()),g=t.normalize(a.getFailureMessage?.());return(0,$.find)(e,l=>{if(u&&l.uid&&l.uid!==u)return!1;let f=t.normalize(l.failure?.token),c=t.normalize(l.failure?.stack_trace),o=t.normalize(l.failure?.error_message);return i&&f&&f===i||n&&c&&c===n?!0:!!(o&&o===g)})}};var s=y(T());var m=y(T());var b=class t{constructor(){}static analyze(a,e,u,i){(0,m.isUndefined)(a)||(e&&a.notPass()&&t.analyzeInvestigated(e,a,i),!a.isInvestigated()&&u&&t.analyzeOutages(u,a))}static isTTLValid(a,e,u){return _.fromJSDate(new Date(e)).plus({days:u}).toMillis()>_.fromJSDate(new Date(a.start_time)).toMillis()}static analyzeInvestigated(a,e,u){let i;if(a){if(i=(0,m.find)((0,m.sortBy)(a,[n=>n.is_auto_triaged?1:0,n=>n.create_at]),n=>{if(n.is_auto_triaged&&n.configuration?.ttl>0&&!this.isTTLValid(e,n.getCreatedAt(),n.configuration.ttl)||n.hasCustomizeState()&&n.getCustomizeStateTTL()!==void 0&&n.getCustomizeStateTTL()!==null&&!this.isTTLValid(e,n.getCreatedAt(),n.getCustomizeStateTTL()))return!1;if(n.isApplySimilarity())return e.getFailureMessage()&&n.getFailureMessage()?F.compare(n.getFailureMessage(),e.getFailureMessage(),n.getSimilarity()):e.getStackTrace()&&n.getStackTrace()?F.compareStackTraces(n.getStackTrace(),e.getStackTrace(),n.getSimilarity()):!1;{let g=n.configuration?.compare_by;return g==="COMPARE_BY_TOKEN"?!!(e.getToken()&&n.getToken()&&n.getToken()===e.getToken()):g==="COMPARE_BY_FAILURE_MESSAGE"?!!(e.getFailureMessage()&&n.getFailureMessage()&&n.getFailureMessage()===e.getFailureMessage()):g==="COMPARE_BY_STACK_TRACE"?!!(e.getStackTrace()&&n.getStackTrace()&&n.getStackTrace()===e.getStackTrace()):g==="COMPARE_BY_MIXED"?e.getToken()&&n.getToken()?n.getToken()===e.getToken():e.getStackTrace()&&n.getStackTrace()?n.getStackTrace()===e.getStackTrace():!1:e.getToken()&&n.getToken()?n.getToken()===e.getToken():e.getFailureMessage()&&n.getFailureMessage()&&n.getFailureMessage()===e.getFailureMessage()?!0:e.getStackTrace()&&n.getStackTrace()?n.getStackTrace()===e.getStackTrace():!1}}),i!==void 0){if(i.is_auto_triaged&&i.configuration?.ttl>0&&!this.isTTLValid(e,i.getCreatedAt(),i.configuration.ttl)){e.old_status=e.status,e.setInvestigatedTest(void 0);return}if(i.hasCustomizeState()){let n=i.getCustomizeStateTTL();if(n!=null&&!this.isTTLValid(e,i.getCreatedAt(),n)){e.old_status=e.status,e.setInvestigatedTest(void 0);return}}e.old_status=e.status,e.setInvestigatedTest(i,{product:u.getProduct(),type:u.getType()})}else e.old_status=e.status,e.setInvestigatedTest(void 0);return}}static analyzeOutages(a,e){let u;if(!e.isRerunPass()){for(let i of a){if(i.getPattern()==="UREPORT_ALL_APPLY"){e.setAsOutage(i);return}if(!i.isTestExcept(e)){if(i.search_type.toLocaleUpperCase()==="REGEX"){if(new RegExp(i.pattern,i.option).test(e.getFailureMessage())||new RegExp(i.pattern,i.option).test(e.getStackTrace())){u=i;break}}else if(e.getStackTrace()===i.getPattern()||e.getFailureMessage()===i.getPattern()){u=i;break}}}if(u){e.old_status=e.status,e.setAsOutage(u);return}}}};var C=y(T()),z=class{constructor(){}static analyze(a,e){a.tags=e.getTags(),a.teams=e.getTeams(),a.components=e.getComponents(),(0,C.isUndefined)(a.getFile())&&e.file&&a.setFile(e.file),(0,C.isUndefined)(a.getPath())&&e.path&&a.setPath(e.path),!a.hasBrowserInfo()&&e.getBrowser()&&a.setBrowserInfo(e.getBrowser()),!a.getDeviceInfo()&&e.getDevice()&&a.setDeviceInfo(e.getDevice()),e.customs&&(a.customRelation=e.customs),a.mapInfoToRelation()}};var H=class{constructor(){}static analyze(a,e,u,i,n,g){let l=[],f=[],c={},o=[];for(let r of e){a?.type&&(r._testType=a.type);let M=r.getOrigUID();o.push(...r.getInfoKeys()),i[M]!==void 0&&!(0,s.isEmpty)(i[M])?z.analyze(r,i[M][0]):r.mapInfoToRelation(),b.analyze(r,u[r.getUID()],n,a),g!==void 0&&S.analyze(r,g[r.getUID()]),r.isInvestigated()&&(r.isOutage()?f.push(r):l.push(r)),r.isAssigned()&&((0,s.has)(c,r.getAssignee())?c[r.getAssignee()].tests.push(r):c[r.getAssignee()]={id:r.getAssigneeId(),tests:[r]}),r.setBuildFilter(a)}let d=(0,s.chain)(e).reject(r=>r.isPass()||r.isRerunPass()).groupBy(r=>r.getFailureMessage()).value(),p=(0,s.chain)(d).keys().filter(r=>d[r].length>1).sortBy(r=>d[r].length).reverse().value();return{inv_test_collector:{investigated_tests:l,outages:f,type_outage:(0,s.groupBy)(f,r=>r.getInvestigated().caused_by),type_investigated:(0,s.chain)(l).filter(r=>!r.getInvestigated().getCustomizeState()).groupBy(r=>r.getInvestigated().caused_by).value(),by_customize_state:(0,s.chain)(l).filter(r=>r.getInvestigated().getCustomizeState()).groupBy(r=>r.getInvestigated().getCustomizeState().label).value(),most_fail_reason:{key:p,data:d},assignment_map:c,intest_relations:(0,s.uniq)(o).length>0?(0,s.uniq)(o):void 0}}}static analyzeRelationsAttributes(a){let e=[],u=new Set,i=new Set,n=new Set,g=new Set,l={tags:[],teams:[],components:[],path:[],custom:{}},f=o=>typeof o=="string"?{name:o}:o,c=(o,d,p)=>{let r=f(p);r?.name&&!d.has(r.name)&&(d.add(r.name),o.push(r))};for(let o of(0,s.flatten)((0,s.values)(a))){if(o.tags)for(let d of o.tags)c(l.tags,u,d);if(o.teams)for(let d of o.teams)c(l.teams,i,d);if(o.components)for(let d of o.components)c(l.components,n,d);o.path&&!g.has(o.path)&&(g.add(o.path),l.path.push(o.path)),o.customs&&e.push(o.customs)}l.tags=(0,s.sortBy)(l.tags,o=>o.name),l.teams=(0,s.sortBy)(l.teams,o=>o.name),l.components=(0,s.sortBy)(l.components,o=>o.name),l.path=(0,s.sortBy)(l.path);for(let o of(0,s.chain)(e).flatten().value())(0,s.each)((0,s.keys)(o),d=>{(0,s.has)(l.custom,d)?l.custom[d].push(o[d]):l.custom[d]=[o[d]]});return(0,s.each)((0,s.keys)(l.custom),o=>{let d=(0,s.chain)(l.custom[o]).flatten().uniq().filter(p=>!(0,s.isEmpty)(p)).sortBy().value();l.custom[o]=d,l[o]=(0,s.map)(d,p=>({name:p}))}),l}};function Y(t){let a=[t.product,t.type,t.version,t.team,t.browser,t.device,t.platform,t.platform_version,t.stage].filter(Boolean).join(" "),e=t.extras?Object.keys(t.extras).sort().map(u=>`${u}:${t.extras[u]}`).join(" "):"";return e?`${a} ${e}`:a}function oe(t,a){return Y(t).localeCompare(Y(a))}var K=`
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
`;var G=`
    ${K}

    /* For PrimeNG */
    .p-textarea.ng-invalid.ng-dirty {
        border-color: dt('textarea.invalid.border.color');
    }
    .p-textarea.ng-invalid.ng-dirty::placeholder {
        color: dt('textarea.invalid.placeholder.color');
    }
`,J={root:({instance:t})=>["p-textarea p-component",{"p-filled":t.$filled(),"p-textarea-resizable ":t.autoResize,"p-variant-filled":t.$variant()==="filled","p-textarea-fluid":t.hasFluid,"p-inputfield-sm p-textarea-sm":t.pSize==="small","p-textarea-lg p-inputfield-lg":t.pSize==="large","p-invalid":t.invalid()}]},q=(()=>{class t extends V{name="textarea";theme=G;classes=J;static \u0275fac=(()=>{let e;return function(i){return(e||(e=I(t)))(i||t)}})();static \u0275prov=k({token:t,factory:t.\u0275fac})}return t})();var be=(()=>{class t extends N{autoResize;pSize;variant=v();fluid=v(void 0,{transform:x});invalid=v(void 0,{transform:x});$variant=L(()=>this.variant()||this.config.inputStyle()||this.config.inputVariant());onResize=new E;ngControlSubscription;_componentStyle=h(q);ngControl=h(U,{optional:!0,self:!0});pcFluid=h(j,{optional:!0,host:!0,skipSelf:!0});get hasFluid(){return this.fluid()??!!this.pcFluid}ngOnInit(){super.ngOnInit(),this.ngControl&&(this.ngControlSubscription=this.ngControl.valueChanges.subscribe(()=>{this.updateState()}))}ngAfterViewInit(){super.ngAfterViewInit(),this.autoResize&&this.resize(),this.cd.detectChanges()}ngAfterViewChecked(){this.autoResize&&this.resize(),this.writeModelValue(this.ngControl?.value??this.el.nativeElement.value)}onInput(e){this.writeModelValue(e.target?.value),this.updateState()}resize(e){this.el.nativeElement.style.height="auto",this.el.nativeElement.style.height=this.el.nativeElement.scrollHeight+"px",parseFloat(this.el.nativeElement.style.height)>=parseFloat(this.el.nativeElement.style.maxHeight)?(this.el.nativeElement.style.overflowY="scroll",this.el.nativeElement.style.height=this.el.nativeElement.style.maxHeight):this.el.nativeElement.style.overflow="hidden",this.onResize.emit(e||{})}updateState(){this.autoResize&&this.resize()}ngOnDestroy(){this.ngControlSubscription&&this.ngControlSubscription.unsubscribe(),super.ngOnDestroy()}static \u0275fac=(()=>{let e;return function(i){return(e||(e=I(t)))(i||t)}})();static \u0275dir=D({type:t,selectors:[["","pTextarea",""],["","pInputTextarea",""]],hostVars:2,hostBindings:function(u,i){u&1&&O("input",function(g){return i.onInput(g)}),u&2&&P(i.cx("root"))},inputs:{autoResize:[2,"autoResize","autoResize",x],pSize:"pSize",variant:[1,"variant"],fluid:[1,"fluid"],invalid:[1,"invalid"]},outputs:{onResize:"onResize"},features:[R([q]),B]})}return t})(),ze=(()=>{class t{static \u0275fac=function(u){return new(u||t)};static \u0275mod=A({type:t});static \u0275inj=w({})}return t})();export{S as a,b,H as c,Y as d,oe as e,be as f,ze as g};
