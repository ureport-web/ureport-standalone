import{a as z}from"./chunk-JGERR76V.js";import{a as b}from"./chunk-6P5QRVAW.js";import{a as y}from"./chunk-XJHAQDGV.js";import{V as _,db as I}from"./chunk-TNSOJGLR.js";import{e as h}from"./chunk-EQDQRRRY.js";var o=h(y());var F=h(y()),v=class g{constructor(){}static analyze(n,e){e&&n.notPass()&&g.analyzeAssignment(e,n)}static analyzeAssignment(n,e){let d;d=(0,F.find)(n,r=>{let t=r.failure?.token,u=r.failure?.stack_trace,s=r.failure?.error_message;return e.getToken()&&t?t===e.getToken():e.getStackTrace()&&u?u===e.getStackTrace():s===e.getFailureMessage()}),e.setAssignment(d)}};var p=h(y());var T=class g{constructor(){}static analyze(n,e,d,r){(0,p.isUndefined)(n)||(e&&n.notPass()&&g.analyzeInvestigated(e,n,r),!n.isInvestigated()&&d&&g.analyzeOutages(d,n))}static isTTLValid(n,e,d){return b.fromJSDate(new Date(e)).plus({days:d}).toMillis()>b.fromJSDate(new Date(n.start_time)).toMillis()}static analyzeInvestigated(n,e,d){let r;if(n){if(r=(0,p.find)((0,p.sortBy)(n,[t=>t.is_auto_triaged?1:0,t=>t.create_at]),t=>{if(t.is_auto_triaged&&t.configuration?.ttl>0&&!this.isTTLValid(e,t.getCreatedAt(),t.configuration.ttl)||t.hasCustomizeState()&&t.getCustomizeStateTTL()!==void 0&&t.getCustomizeStateTTL()!==null&&!this.isTTLValid(e,t.getCreatedAt(),t.getCustomizeStateTTL()))return!1;if(t.isApplySimilarity())return e.getFailureMessage()&&t.getFailureMessage()?z.compare(t.getFailureMessage(),e.getFailureMessage(),t.getSimilarity()):e.getStackTrace()&&t.getStackTrace()?z.compareStackTraces(t.getStackTrace(),e.getStackTrace(),t.getSimilarity()):!1;{let u=t.configuration?.compare_by;return u==="COMPARE_BY_TOKEN"?!!(e.getToken()&&t.getToken()&&t.getToken()===e.getToken()):u==="COMPARE_BY_FAILURE_MESSAGE"?!!(e.getFailureMessage()&&t.getFailureMessage()&&t.getFailureMessage()===e.getFailureMessage()):u==="COMPARE_BY_STACK_TRACE"?!!(e.getStackTrace()&&t.getStackTrace()&&t.getStackTrace()===e.getStackTrace()):u==="COMPARE_BY_MIXED"?e.getToken()&&t.getToken()?t.getToken()===e.getToken():e.getStackTrace()&&t.getStackTrace()?t.getStackTrace()===e.getStackTrace():!1:e.getToken()&&t.getToken()?t.getToken()===e.getToken():e.getFailureMessage()&&t.getFailureMessage()&&t.getFailureMessage()===e.getFailureMessage()?!0:e.getStackTrace()&&t.getStackTrace()?t.getStackTrace()===e.getStackTrace():!1}}),r!==void 0){if(r.is_auto_triaged&&r.configuration?.ttl>0&&!this.isTTLValid(e,r.getCreatedAt(),r.configuration.ttl)){e.old_status=e.status,e.setInvestigatedTest(void 0);return}if(r.hasCustomizeState()){let t=r.getCustomizeStateTTL();if(t!=null&&!this.isTTLValid(e,r.getCreatedAt(),t)){e.old_status=e.status,e.setInvestigatedTest(void 0);return}}e.old_status=e.status,e.setInvestigatedTest(r,{product:d.getProduct(),type:d.getType()})}else e.old_status=e.status,e.setInvestigatedTest(void 0);return}}static analyzeOutages(n,e){let d;if(!e.isRerunPass()){for(let r of n){if(r.getPattern()==="UREPORT_ALL_APPLY"){e.setAsOutage(r);return}if(!r.isTestExcept(e)){if(r.search_type.toLocaleUpperCase()==="REGEX"){if(new RegExp(r.pattern,r.option).test(e.getFailureMessage())||new RegExp(r.pattern,r.option).test(e.getStackTrace())){d=r;break}}else if(e.getStackTrace()===r.getPattern()||e.getFailureMessage()===r.getPattern()){d=r;break}}}if(d){e.old_status=e.status,e.setAsOutage(d);return}}}};var M=h(y()),x=class{constructor(){}static analyze(n,e){n.tags=e.getTags(),n.teams=e.getTeams(),n.components=e.getComponents(),(0,M.isUndefined)(n.getFile())&&e.file&&n.setFile(e.file),(0,M.isUndefined)(n.getPath())&&e.path&&n.setPath(e.path),!n.hasBrowserInfo()&&e.getBrowser()&&n.setBrowserInfo(e.getBrowser()),!n.getDeviceInfo()&&e.getDevice()&&n.setDeviceInfo(e.getDevice()),e.customs&&(n.customRelation=e.customs),n.mapInfoToRelation()}};var C=class{constructor(){}static analyze(n,e,d,r,t,u){let s=[],m=[],c={},i=[];for(let a of e){n?.type&&(a._testType=n.type);let S=a.getOrigUID();i.push(...a.getInfoKeys()),r[S]!==void 0&&!(0,o.isEmpty)(r[S])?x.analyze(a,r[S][0]):a.mapInfoToRelation(),T.analyze(a,d[a.getUID()],t,n),u!==void 0&&v.analyze(a,u[a.getUID()]),a.isInvestigated()&&(a.isOutage()?m.push(a):s.push(a)),a.isAssigned()&&((0,o.has)(c,a.getAssignee())?c[a.getAssignee()].tests.push(a):c[a.getAssignee()]={id:a.getAssigneeId(),tests:[a]}),a.setBuildFilter(n)}let l=(0,o.chain)(e).reject(a=>a.isPass()||a.isRerunPass()).groupBy(a=>a.getFailureMessage()).value(),f=(0,o.chain)(l).keys().filter(a=>l[a].length>1).sortBy(a=>l[a].length).reverse().value();return{inv_test_collector:{investigated_tests:s,outages:m,type_outage:(0,o.groupBy)(m,a=>a.getInvestigated().caused_by),type_investigated:(0,o.chain)(s).filter(a=>!a.getInvestigated().getCustomizeState()).groupBy(a=>a.getInvestigated().caused_by).value(),by_customize_state:(0,o.chain)(s).filter(a=>a.getInvestigated().getCustomizeState()).groupBy(a=>a.getInvestigated().getCustomizeState().label).value(),most_fail_reason:{key:f,data:l},assignment_map:c,intest_relations:(0,o.uniq)(i).length>0?(0,o.uniq)(i):void 0}}}static analyzeRelationsAttributes(n){let e=[],d=new Set,r=new Set,t=new Set,u=new Set,s={tags:[],teams:[],components:[],path:[],custom:{}},m=i=>typeof i=="string"?{name:i}:i,c=(i,l,f)=>{let a=m(f);a?.name&&!l.has(a.name)&&(l.add(a.name),i.push(a))};for(let i of(0,o.flatten)((0,o.values)(n))){if(i.tags)for(let l of i.tags)c(s.tags,d,l);if(i.teams)for(let l of i.teams)c(s.teams,r,l);if(i.components)for(let l of i.components)c(s.components,t,l);i.path&&!u.has(i.path)&&(u.add(i.path),s.path.push(i.path)),i.customs&&e.push(i.customs)}s.tags=(0,o.sortBy)(s.tags,i=>i.name),s.teams=(0,o.sortBy)(s.teams,i=>i.name),s.components=(0,o.sortBy)(s.components,i=>i.name),s.path=(0,o.sortBy)(s.path);for(let i of(0,o.chain)(e).flatten().value())(0,o.each)((0,o.keys)(i),l=>{(0,o.has)(s.custom,l)?s.custom[l].push(i[l]):s.custom[l]=[i[l]]});return(0,o.each)((0,o.keys)(s.custom),i=>{let l=(0,o.chain)(s.custom[i]).flatten().uniq().filter(f=>!(0,o.isEmpty)(f)).sortBy().value();s.custom[i]=l,s[i]=(0,o.map)(l,f=>({name:f}))}),s}};var k=`
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
`;var X=`
    ${k}

    /* For PrimeNG */
    .p-textarea.ng-invalid.ng-dirty {
        border-color: dt('textarea.invalid.border.color');
    }
    .p-textarea.ng-invalid.ng-dirty::placeholder {
        color: dt('textarea.invalid.placeholder.color');
    }
`;var Q=(()=>{class g{static \u0275fac=function(d){return new(d||g)};static \u0275mod=I({type:g});static \u0275inj=_({})}return g})();export{v as a,T as b,C as c,Q as d};
