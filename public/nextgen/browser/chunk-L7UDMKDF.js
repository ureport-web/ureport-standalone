import{a as F}from"./chunk-QP54DIIJ.js";import{a as I}from"./chunk-6P5QRVAW.js";import{a as x}from"./chunk-XJHAQDGV.js";import{a as j}from"./chunk-7GKKY7JR.js";import{d as U}from"./chunk-HN2VYLXL.js";import{i as N}from"./chunk-G57LYJA7.js";import{ma as V}from"./chunk-MVAEEA3L.js";import{$b as P,Hc as L,Kc as v,Mb as O,Pc as T,U as k,V as A,Z as y,db as w,eb as D,gb as E,kb as B,pc as R,ra as _}from"./chunk-YBCNRLYA.js";import{e as h}from"./chunk-EQDQRRRY.js";var o=h(x());var H=h(x()),S=class s{constructor(){}static analyze(i,e){e&&i.notPass()&&s.analyzeAssignment(e,i)}static analyzeAssignment(i,e){let d;d=(0,H.find)(i,n=>{let t=n.failure?.token,g=n.failure?.stack_trace,l=n.failure?.error_message;return e.getToken()&&t?t===e.getToken():e.getStackTrace()&&g?g===e.getStackTrace():l===e.getFailureMessage()}),e.setAssignment(d)}};var p=h(x());var b=class s{constructor(){}static analyze(i,e,d,n){(0,p.isUndefined)(i)||(e&&i.notPass()&&s.analyzeInvestigated(e,i,n),!i.isInvestigated()&&d&&s.analyzeOutages(d,i))}static isTTLValid(i,e,d){return I.fromJSDate(new Date(e)).plus({days:d}).toMillis()>I.fromJSDate(new Date(i.start_time)).toMillis()}static analyzeInvestigated(i,e,d){let n;if(i){if(n=(0,p.find)((0,p.sortBy)(i,[t=>t.is_auto_triaged?1:0,t=>t.create_at]),t=>{if(t.is_auto_triaged&&t.configuration?.ttl>0&&!this.isTTLValid(e,t.getCreatedAt(),t.configuration.ttl)||t.hasCustomizeState()&&t.getCustomizeStateTTL()!==void 0&&t.getCustomizeStateTTL()!==null&&!this.isTTLValid(e,t.getCreatedAt(),t.getCustomizeStateTTL()))return!1;if(t.isApplySimilarity())return e.getFailureMessage()&&t.getFailureMessage()?F.compare(t.getFailureMessage(),e.getFailureMessage(),t.getSimilarity()):e.getStackTrace()&&t.getStackTrace()?F.compareStackTraces(t.getStackTrace(),e.getStackTrace(),t.getSimilarity()):!1;{let g=t.configuration?.compare_by;return g==="COMPARE_BY_TOKEN"?!!(e.getToken()&&t.getToken()&&t.getToken()===e.getToken()):g==="COMPARE_BY_FAILURE_MESSAGE"?!!(e.getFailureMessage()&&t.getFailureMessage()&&t.getFailureMessage()===e.getFailureMessage()):g==="COMPARE_BY_STACK_TRACE"?!!(e.getStackTrace()&&t.getStackTrace()&&t.getStackTrace()===e.getStackTrace()):g==="COMPARE_BY_MIXED"?e.getToken()&&t.getToken()?t.getToken()===e.getToken():e.getStackTrace()&&t.getStackTrace()?t.getStackTrace()===e.getStackTrace():!1:e.getToken()&&t.getToken()?t.getToken()===e.getToken():e.getFailureMessage()&&t.getFailureMessage()&&t.getFailureMessage()===e.getFailureMessage()?!0:e.getStackTrace()&&t.getStackTrace()?t.getStackTrace()===e.getStackTrace():!1}}),n!==void 0){if(n.is_auto_triaged&&n.configuration?.ttl>0&&!this.isTTLValid(e,n.getCreatedAt(),n.configuration.ttl)){e.old_status=e.status,e.setInvestigatedTest(void 0);return}if(n.hasCustomizeState()){let t=n.getCustomizeStateTTL();if(t!=null&&!this.isTTLValid(e,n.getCreatedAt(),t)){e.old_status=e.status,e.setInvestigatedTest(void 0);return}}e.old_status=e.status,e.setInvestigatedTest(n,{product:d.getProduct(),type:d.getType()})}else e.old_status=e.status,e.setInvestigatedTest(void 0);return}}static analyzeOutages(i,e){let d;if(!e.isRerunPass()){for(let n of i){if(n.getPattern()==="UREPORT_ALL_APPLY"){e.setAsOutage(n);return}if(!n.isTestExcept(e)){if(n.search_type.toLocaleUpperCase()==="REGEX"){if(new RegExp(n.pattern,n.option).test(e.getFailureMessage())||new RegExp(n.pattern,n.option).test(e.getStackTrace())){d=n;break}}else if(e.getStackTrace()===n.getPattern()||e.getFailureMessage()===n.getPattern()){d=n;break}}}if(d){e.old_status=e.status,e.setAsOutage(d);return}}}};var C=h(x()),z=class{constructor(){}static analyze(i,e){i.tags=e.getTags(),i.teams=e.getTeams(),i.components=e.getComponents(),(0,C.isUndefined)(i.getFile())&&e.file&&i.setFile(e.file),(0,C.isUndefined)(i.getPath())&&e.path&&i.setPath(e.path),!i.hasBrowserInfo()&&e.getBrowser()&&i.setBrowserInfo(e.getBrowser()),!i.getDeviceInfo()&&e.getDevice()&&i.setDeviceInfo(e.getDevice()),e.customs&&(i.customRelation=e.customs),i.mapInfoToRelation()}};var Y=class{constructor(){}static analyze(i,e,d,n,t,g){let l=[],m=[],c={},r=[];for(let a of e){i?.type&&(a._testType=i.type);let M=a.getOrigUID();r.push(...a.getInfoKeys()),n[M]!==void 0&&!(0,o.isEmpty)(n[M])?z.analyze(a,n[M][0]):a.mapInfoToRelation(),b.analyze(a,d[a.getUID()],t,i),g!==void 0&&S.analyze(a,g[a.getUID()]),a.isInvestigated()&&(a.isOutage()?m.push(a):l.push(a)),a.isAssigned()&&((0,o.has)(c,a.getAssignee())?c[a.getAssignee()].tests.push(a):c[a.getAssignee()]={id:a.getAssigneeId(),tests:[a]}),a.setBuildFilter(i)}let u=(0,o.chain)(e).reject(a=>a.isPass()||a.isRerunPass()).groupBy(a=>a.getFailureMessage()).value(),f=(0,o.chain)(u).keys().filter(a=>u[a].length>1).sortBy(a=>u[a].length).reverse().value();return{inv_test_collector:{investigated_tests:l,outages:m,type_outage:(0,o.groupBy)(m,a=>a.getInvestigated().caused_by),type_investigated:(0,o.chain)(l).filter(a=>!a.getInvestigated().getCustomizeState()).groupBy(a=>a.getInvestigated().caused_by).value(),by_customize_state:(0,o.chain)(l).filter(a=>a.getInvestigated().getCustomizeState()).groupBy(a=>a.getInvestigated().getCustomizeState().label).value(),most_fail_reason:{key:f,data:u},assignment_map:c,intest_relations:(0,o.uniq)(r).length>0?(0,o.uniq)(r):void 0}}}static analyzeRelationsAttributes(i){let e=[],d=new Set,n=new Set,t=new Set,g=new Set,l={tags:[],teams:[],components:[],path:[],custom:{}},m=r=>typeof r=="string"?{name:r}:r,c=(r,u,f)=>{let a=m(f);a?.name&&!u.has(a.name)&&(u.add(a.name),r.push(a))};for(let r of(0,o.flatten)((0,o.values)(i))){if(r.tags)for(let u of r.tags)c(l.tags,d,u);if(r.teams)for(let u of r.teams)c(l.teams,n,u);if(r.components)for(let u of r.components)c(l.components,t,u);r.path&&!g.has(r.path)&&(g.add(r.path),l.path.push(r.path)),r.customs&&e.push(r.customs)}l.tags=(0,o.sortBy)(l.tags,r=>r.name),l.teams=(0,o.sortBy)(l.teams,r=>r.name),l.components=(0,o.sortBy)(l.components,r=>r.name),l.path=(0,o.sortBy)(l.path);for(let r of(0,o.chain)(e).flatten().value())(0,o.each)((0,o.keys)(r),u=>{(0,o.has)(l.custom,u)?l.custom[u].push(r[u]):l.custom[u]=[r[u]]});return(0,o.each)((0,o.keys)(l.custom),r=>{let u=(0,o.chain)(l.custom[r]).flatten().uniq().filter(f=>!(0,o.isEmpty)(f)).sortBy().value();l.custom[r]=u,l[r]=(0,o.map)(u,f=>({name:f}))}),l}};var $=`
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
    ${$}

    /* For PrimeNG */
    .p-textarea.ng-invalid.ng-dirty {
        border-color: dt('textarea.invalid.border.color');
    }
    .p-textarea.ng-invalid.ng-dirty::placeholder {
        color: dt('textarea.invalid.placeholder.color');
    }
`,K={root:({instance:s})=>["p-textarea p-component",{"p-filled":s.$filled(),"p-textarea-resizable ":s.autoResize,"p-variant-filled":s.$variant()==="filled","p-textarea-fluid":s.hasFluid,"p-inputfield-sm p-textarea-sm":s.pSize==="small","p-textarea-lg p-inputfield-lg":s.pSize==="large","p-invalid":s.invalid()}]},q=(()=>{class s extends V{name="textarea";theme=G;classes=K;static \u0275fac=(()=>{let e;return function(n){return(e||(e=_(s)))(n||s)}})();static \u0275prov=k({token:s,factory:s.\u0275fac})}return s})();var Te=(()=>{class s extends j{autoResize;pSize;variant=v();fluid=v(void 0,{transform:T});invalid=v(void 0,{transform:T});$variant=L(()=>this.variant()||this.config.inputStyle()||this.config.inputVariant());onResize=new B;ngControlSubscription;_componentStyle=y(q);ngControl=y(U,{optional:!0,self:!0});pcFluid=y(N,{optional:!0,host:!0,skipSelf:!0});get hasFluid(){return this.fluid()??!!this.pcFluid}ngOnInit(){super.ngOnInit(),this.ngControl&&(this.ngControlSubscription=this.ngControl.valueChanges.subscribe(()=>{this.updateState()}))}ngAfterViewInit(){super.ngAfterViewInit(),this.autoResize&&this.resize(),this.cd.detectChanges()}ngAfterViewChecked(){this.autoResize&&this.resize(),this.writeModelValue(this.ngControl?.value??this.el.nativeElement.value)}onInput(e){this.writeModelValue(e.target?.value),this.updateState()}resize(e){this.el.nativeElement.style.height="auto",this.el.nativeElement.style.height=this.el.nativeElement.scrollHeight+"px",parseFloat(this.el.nativeElement.style.height)>=parseFloat(this.el.nativeElement.style.maxHeight)?(this.el.nativeElement.style.overflowY="scroll",this.el.nativeElement.style.height=this.el.nativeElement.style.maxHeight):this.el.nativeElement.style.overflow="hidden",this.onResize.emit(e||{})}updateState(){this.autoResize&&this.resize()}ngOnDestroy(){this.ngControlSubscription&&this.ngControlSubscription.unsubscribe(),super.ngOnDestroy()}static \u0275fac=(()=>{let e;return function(n){return(e||(e=_(s)))(n||s)}})();static \u0275dir=D({type:s,selectors:[["","pTextarea",""],["","pInputTextarea",""]],hostVars:2,hostBindings:function(d,n){d&1&&O("input",function(g){return n.onInput(g)}),d&2&&P(n.cx("root"))},inputs:{autoResize:[2,"autoResize","autoResize",T],pSize:"pSize",variant:[1,"variant"],fluid:[1,"fluid"],invalid:[1,"invalid"]},outputs:{onResize:"onResize"},features:[R([q]),E]})}return s})(),xe=(()=>{class s{static \u0275fac=function(d){return new(d||s)};static \u0275mod=w({type:s});static \u0275inj=A({})}return s})();export{S as a,b,Y as c,Te as d,xe as e};
