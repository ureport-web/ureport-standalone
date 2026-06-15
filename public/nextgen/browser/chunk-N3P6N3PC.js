import{a as z}from"./chunk-PQQ6TVOD.js";import{a as b}from"./chunk-6P5QRVAW.js";import{a as y}from"./chunk-XJHAQDGV.js";import{V as F,db as I}from"./chunk-MVGH6UWW.js";import{e as h}from"./chunk-EQDQRRRY.js";var i=h(y());var _=h(y()),v=class u{constructor(){}static analyze(n,e){e&&n.notPass()&&u.analyzeAssignment(e,n)}static analyzeAssignment(n,e){let l;l=(0,_.find)(n,o=>{let a=o.failure?.token,g=o.failure?.stack_trace,s=o.failure?.error_message;return e.getToken()&&a?a===e.getToken():e.getStackTrace()&&g?g===e.getStackTrace():s===e.getFailureMessage()}),e.setAssignment(l)}};var p=h(y());var x=class u{constructor(){}static analyze(n,e,l,o){(0,p.isUndefined)(n)||(e&&n.notPass()&&u.analyzeInvestigated(e,n,o),!n.isInvestigated()&&l&&u.analyzeOutages(l,n))}static isTTLValid(n,e,l){return b.fromJSDate(new Date(e)).plus({days:l}).toMillis()>b.fromJSDate(new Date(n.start_time)).toMillis()}static analyzeInvestigated(n,e,l){let o;if(n){if(o=(0,p.find)((0,p.sortBy)(n,a=>a.create_at),a=>{if(a.hasCustomizeState()&&a.getCustomizeStateTTL()!==void 0&&a.getCustomizeStateTTL()!==null&&!this.isTTLValid(e,a.getCreatedAt(),a.getCustomizeStateTTL()))return!1;if(a.isApplySimilarity())return e.getFailureMessage()&&a.getFailureMessage()?z.compare(a.getFailureMessage(),e.getFailureMessage(),a.getSimilarity()):e.getStackTrace()&&a.getStackTrace()?z.compareStackTraces(a.getStackTrace(),e.getStackTrace(),a.getSimilarity()):!1;{let g=a.configuration?.compare_by;return g==="COMPARE_BY_TOKEN"?!!(e.getToken()&&a.getToken()&&a.getToken()===e.getToken()):g==="COMPARE_BY_FAILURE_MESSAGE"?!!(e.getFailureMessage()&&a.getFailureMessage()&&a.getFailureMessage()===e.getFailureMessage()):g==="COMPARE_BY_STACK_TRACE"?!!(e.getStackTrace()&&a.getStackTrace()&&a.getStackTrace()===e.getStackTrace()):g==="COMPARE_BY_MIXED"?e.getToken()&&a.getToken()?a.getToken()===e.getToken():e.getStackTrace()&&a.getStackTrace()?a.getStackTrace()===e.getStackTrace():!1:e.getToken()&&a.getToken()?a.getToken()===e.getToken():e.getFailureMessage()&&a.getFailureMessage()&&a.getFailureMessage()===e.getFailureMessage()?!0:e.getStackTrace()&&a.getStackTrace()?a.getStackTrace()===e.getStackTrace():!1}}),o!==void 0)if(o.hasCustomizeState()){let a=o.getCustomizeStateTTL();(a==null||this.isTTLValid(e,o.getCreatedAt(),a))&&(e.old_status=e.status,e.setInvestigatedTest(o,{product:l.getProduct(),type:l.getType()}))}else e.old_status=e.status,e.setInvestigatedTest(o,{product:l.getProduct(),type:l.getType()});else e.old_status=e.status,e.setInvestigatedTest(void 0);return}}static analyzeOutages(n,e){let l;if(!e.isRerunPass()){for(let o of n){if(o.getPattern()==="UREPORT_ALL_APPLY"){e.setAsOutage(o);return}if(!o.isTestExcept(e)){if(o.search_type.toLocaleUpperCase()==="REGEX"){if(new RegExp(o.pattern,o.option).test(e.getFailureMessage())||new RegExp(o.pattern,o.option).test(e.getStackTrace())){l=o;break}}else if(e.getStackTrace()===o.getPattern()||e.getFailureMessage()===o.getPattern()){l=o;break}}}if(l){e.old_status=e.status,e.setAsOutage(l);return}}}};var M=h(y()),T=class{constructor(){}static analyze(n,e){n.tags=e.getTags(),n.teams=e.getTeams(),n.components=e.getComponents(),(0,M.isUndefined)(n.getFile())&&e.file&&n.setFile(e.file),(0,M.isUndefined)(n.getPath())&&e.path&&n.setPath(e.path),!n.hasBrowserInfo()&&e.getBrowser()&&n.setBrowserInfo(e.getBrowser()),!n.getDeviceInfo()&&e.getDevice()&&n.setDeviceInfo(e.getDevice()),e.customs&&(n.customRelation=e.customs),n.mapInfoToRelation()}};var k=class{constructor(){}static analyze(n,e,l,o,a,g){let s=[],m=[],c={},r=[];for(let t of e){n?.type&&(t._testType=n.type);let S=t.getOrigUID();r.push(...t.getInfoKeys()),o[S]!==void 0&&!(0,i.isEmpty)(o[S])?T.analyze(t,o[S][0]):t.mapInfoToRelation(),x.analyze(t,l[t.getUID()],a,n),g!==void 0&&v.analyze(t,g[t.getUID()]),t.isInvestigated()&&(t.isOutage()?m.push(t):s.push(t)),t.isAssigned()&&((0,i.has)(c,t.getAssignee())?c[t.getAssignee()].tests.push(t):c[t.getAssignee()]={id:t.getAssigneeId(),tests:[t]}),t.setBuildFilter(n)}let d=(0,i.chain)(e).reject(t=>t.isPass()||t.isRerunPass()).groupBy(t=>t.getFailureMessage()).value(),f=(0,i.chain)(d).keys().filter(t=>d[t].length>1).sortBy(t=>d[t].length).reverse().value();return{inv_test_collector:{investigated_tests:s,outages:m,type_outage:(0,i.groupBy)(m,t=>t.getInvestigated().caused_by),type_investigated:(0,i.chain)(s).filter(t=>!t.getInvestigated().getCustomizeState()).groupBy(t=>t.getInvestigated().caused_by).value(),by_customize_state:(0,i.chain)(s).filter(t=>t.getInvestigated().getCustomizeState()).groupBy(t=>t.getInvestigated().getCustomizeState().label).value(),most_fail_reason:{key:f,data:d},assignment_map:c,intest_relations:(0,i.uniq)(r).length>0?(0,i.uniq)(r):void 0}}}static analyzeRelationsAttributes(n){let e=[],l=new Set,o=new Set,a=new Set,g=new Set,s={tags:[],teams:[],components:[],path:[],custom:{}},m=r=>typeof r=="string"?{name:r}:r,c=(r,d,f)=>{let t=m(f);t?.name&&!d.has(t.name)&&(d.add(t.name),r.push(t))};for(let r of(0,i.flatten)((0,i.values)(n))){if(r.tags)for(let d of r.tags)c(s.tags,l,d);if(r.teams)for(let d of r.teams)c(s.teams,o,d);if(r.components)for(let d of r.components)c(s.components,a,d);r.path&&!g.has(r.path)&&(g.add(r.path),s.path.push(r.path)),r.customs&&e.push(r.customs)}s.tags=(0,i.sortBy)(s.tags,r=>r.name),s.teams=(0,i.sortBy)(s.teams,r=>r.name),s.components=(0,i.sortBy)(s.components,r=>r.name),s.path=(0,i.sortBy)(s.path);for(let r of(0,i.chain)(e).flatten().value())(0,i.each)((0,i.keys)(r),d=>{(0,i.has)(s.custom,d)?s.custom[d].push(r[d]):s.custom[d]=[r[d]]});return(0,i.each)((0,i.keys)(s.custom),r=>{let d=(0,i.chain)(s.custom[r]).flatten().uniq().filter(f=>!(0,i.isEmpty)(f)).sortBy().value();s.custom[r]=d,s[r]=(0,i.map)(d,f=>({name:f}))}),s}};var C=`
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
    ${C}

    /* For PrimeNG */
    .p-textarea.ng-invalid.ng-dirty {
        border-color: dt('textarea.invalid.border.color');
    }
    .p-textarea.ng-invalid.ng-dirty::placeholder {
        color: dt('textarea.invalid.placeholder.color');
    }
`;var Q=(()=>{class u{static \u0275fac=function(l){return new(l||u)};static \u0275mod=I({type:u});static \u0275inj=F({})}return u})();export{v as a,x as b,k as c,Q as d};
