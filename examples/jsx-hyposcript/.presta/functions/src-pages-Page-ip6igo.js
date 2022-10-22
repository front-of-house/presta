var We=Object.create;var O=Object.defineProperty,Ze=Object.defineProperties,er=Object.getOwnPropertyDescriptor,rr=Object.getOwnPropertyDescriptors,tr=Object.getOwnPropertyNames,V=Object.getOwnPropertySymbols,nr=Object.getPrototypeOf,B=Object.prototype.hasOwnProperty,ar=Object.prototype.propertyIsEnumerable;var D=(e,r,t)=>r in e?O(e,r,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[r]=t,P=(e,r)=>{for(var t in r||(r={}))B.call(r,t)&&D(e,t,r[t]);if(V)for(var t of V(r))ar.call(r,t)&&D(e,t,r[t]);return e},A=(e,r)=>Ze(e,rr(r)),R=e=>O(e,"__esModule",{value:!0});var u=(e,r)=>()=>(r||e((r={exports:{}}).exports,r),r.exports),L=(e,r)=>{R(e);for(var t in r)O(e,t,{get:r[t],enumerable:!0})},or=(e,r,t)=>{if(r&&typeof r=="object"||typeof r=="function")for(let n of tr(r))!B.call(e,n)&&n!=="default"&&O(e,n,{get:()=>r[n],enumerable:!(t=er(r,n))||t.enumerable});return e},m=e=>or(R(O(e!=null?We(nr(e)):{},"default",e&&e.__esModule&&"default"in e?{get:()=>e.default,enumerable:!0}:{value:e,enumerable:!0})),e);var J=u((vt,Q)=>{"use strict";Q.exports=e=>encodeURIComponent(e).replace(/[!'()*]/g,r=>`%${r.charCodeAt(0).toString(16).toUpperCase()}`)});var K=u((St,Y)=>{"use strict";var z="%[a-f0-9]{2}",G=new RegExp(z,"gi"),X=new RegExp("("+z+")+","gi");function $(e,r){try{return decodeURIComponent(e.join(""))}catch(a){}if(e.length===1)return e;r=r||1;var t=e.slice(0,r),n=e.slice(r);return Array.prototype.concat.call([],$(t),$(n))}function ir(e){try{return decodeURIComponent(e)}catch(n){for(var r=e.match(G),t=1;t<r.length;t++)e=$(r,t).join(""),r=e.match(G);return e}}function sr(e){for(var r={"%FE%FF":"\uFFFD\uFFFD","%FF%FE":"\uFFFD\uFFFD"},t=X.exec(e);t;){try{r[t[0]]=decodeURIComponent(t[0])}catch(s){var n=ir(t[0]);n!==t[0]&&(r[t[0]]=n)}t=X.exec(e)}r["%C2"]="\uFFFD";for(var a=Object.keys(r),i=0;i<a.length;i++){var o=a[i];e=e.replace(new RegExp(o,"g"),r[o])}return e}Y.exports=function(e){if(typeof e!="string")throw new TypeError("Expected `encodedURI` to be of type `string`, got `"+typeof e+"`");try{return e=e.replace(/\+/g," "),decodeURIComponent(e)}catch(r){return sr(e)}}});var Z=u((Et,W)=>{"use strict";W.exports=(e,r)=>{if(!(typeof e=="string"&&typeof r=="string"))throw new TypeError("Expected the arguments to be of type `string`");if(r==="")return[e];let t=e.indexOf(r);return t===-1?[e]:[e.slice(0,t),e.slice(t+r.length)]}});var re=u((Pt,ee)=>{"use strict";ee.exports=function(e,r){for(var t={},n=Object.keys(e),a=Array.isArray(r),i=0;i<n.length;i++){var o=n[i],s=e[o];(a?r.indexOf(o)!==-1:r(o,s,e))&&(t[o]=s)}return t}});var le=u(f=>{"use strict";var cr=J(),lr=K(),te=Z(),fr=re(),ur=e=>e==null;function mr(e){switch(e.arrayFormat){case"index":return r=>(t,n)=>{let a=t.length;return n===void 0||e.skipNull&&n===null||e.skipEmptyString&&n===""?t:n===null?[...t,[c(r,e),"[",a,"]"].join("")]:[...t,[c(r,e),"[",c(a,e),"]=",c(n,e)].join("")]};case"bracket":return r=>(t,n)=>n===void 0||e.skipNull&&n===null||e.skipEmptyString&&n===""?t:n===null?[...t,[c(r,e),"[]"].join("")]:[...t,[c(r,e),"[]=",c(n,e)].join("")];case"comma":case"separator":return r=>(t,n)=>n==null||n.length===0?t:t.length===0?[[c(r,e),"=",c(n,e)].join("")]:[[t,c(n,e)].join(e.arrayFormatSeparator)];default:return r=>(t,n)=>n===void 0||e.skipNull&&n===null||e.skipEmptyString&&n===""?t:n===null?[...t,c(r,e)]:[...t,[c(r,e),"=",c(n,e)].join("")]}}function pr(e){let r;switch(e.arrayFormat){case"index":return(t,n,a)=>{if(r=/\[(\d*)\]$/.exec(t),t=t.replace(/\[\d*\]$/,""),!r){a[t]=n;return}a[t]===void 0&&(a[t]={}),a[t][r[1]]=n};case"bracket":return(t,n,a)=>{if(r=/(\[\])$/.exec(t),t=t.replace(/\[\]$/,""),!r){a[t]=n;return}if(a[t]===void 0){a[t]=[n];return}a[t]=[].concat(a[t],n)};case"comma":case"separator":return(t,n,a)=>{let i=typeof n=="string"&&n.includes(e.arrayFormatSeparator),o=typeof n=="string"&&!i&&h(n,e).includes(e.arrayFormatSeparator);n=o?h(n,e):n;let s=i||o?n.split(e.arrayFormatSeparator).map(p=>h(p,e)):n===null?n:h(n,e);a[t]=s};default:return(t,n,a)=>{if(a[t]===void 0){a[t]=n;return}a[t]=[].concat(a[t],n)}}}function ne(e){if(typeof e!="string"||e.length!==1)throw new TypeError("arrayFormatSeparator must be single character string")}function c(e,r){return r.encode?r.strict?cr(e):encodeURIComponent(e):e}function h(e,r){return r.decode?lr(e):e}function ae(e){return Array.isArray(e)?e.sort():typeof e=="object"?ae(Object.keys(e)).sort((r,t)=>Number(r)-Number(t)).map(r=>e[r]):e}function oe(e){let r=e.indexOf("#");return r!==-1&&(e=e.slice(0,r)),e}function dr(e){let r="",t=e.indexOf("#");return t!==-1&&(r=e.slice(t)),r}function ie(e){e=oe(e);let r=e.indexOf("?");return r===-1?"":e.slice(r+1)}function se(e,r){return r.parseNumbers&&!Number.isNaN(Number(e))&&typeof e=="string"&&e.trim()!==""?e=Number(e):r.parseBooleans&&e!==null&&(e.toLowerCase()==="true"||e.toLowerCase()==="false")&&(e=e.toLowerCase()==="true"),e}function ce(e,r){r=Object.assign({decode:!0,sort:!0,arrayFormat:"none",arrayFormatSeparator:",",parseNumbers:!1,parseBooleans:!1},r),ne(r.arrayFormatSeparator);let t=pr(r),n=Object.create(null);if(typeof e!="string"||(e=e.trim().replace(/^[?#&]/,""),!e))return n;for(let a of e.split("&")){if(a==="")continue;let[i,o]=te(r.decode?a.replace(/\+/g," "):a,"=");o=o===void 0?null:["comma","separator"].includes(r.arrayFormat)?o:h(o,r),t(h(i,r),o,n)}for(let a of Object.keys(n)){let i=n[a];if(typeof i=="object"&&i!==null)for(let o of Object.keys(i))i[o]=se(i[o],r);else n[a]=se(i,r)}return r.sort===!1?n:(r.sort===!0?Object.keys(n).sort():Object.keys(n).sort(r.sort)).reduce((a,i)=>{let o=n[i];return Boolean(o)&&typeof o=="object"&&!Array.isArray(o)?a[i]=ae(o):a[i]=o,a},Object.create(null))}f.extract=ie;f.parse=ce;f.stringify=(e,r)=>{if(!e)return"";r=Object.assign({encode:!0,strict:!0,arrayFormat:"none",arrayFormatSeparator:","},r),ne(r.arrayFormatSeparator);let t=o=>r.skipNull&&ur(e[o])||r.skipEmptyString&&e[o]==="",n=mr(r),a={};for(let o of Object.keys(e))t(o)||(a[o]=e[o]);let i=Object.keys(a);return r.sort!==!1&&i.sort(r.sort),i.map(o=>{let s=e[o];return s===void 0?"":s===null?c(o,r):Array.isArray(s)?s.reduce(n(o),[]).join("&"):c(o,r)+"="+c(s,r)}).filter(o=>o.length>0).join("&")};f.parseUrl=(e,r)=>{r=Object.assign({decode:!0},r);let[t,n]=te(e,"#");return Object.assign({url:t.split("?")[0]||"",query:ce(ie(e),r)},r&&r.parseFragmentIdentifier&&n?{fragmentIdentifier:h(n,r)}:{})};f.stringifyUrl=(e,r)=>{r=Object.assign({encode:!0,strict:!0},r);let t=oe(e.url).split("?")[0]||"",n=f.extract(e.url),a=f.parse(n,{sort:!1}),i=Object.assign(a,e.query),o=f.stringify(i,r);o&&(o=`?${o}`);let s=dr(e.url);return e.fragmentIdentifier&&(s=`#${c(e.fragmentIdentifier,r)}`),`${t}${o}${s}`};f.pick=(e,r,t)=>{t=Object.assign({parseFragmentIdentifier:!0},t);let{url:n,query:a,fragmentIdentifier:i}=f.parseUrl(e,t);return f.stringifyUrl({url:n,query:fr(a,r),fragmentIdentifier:i},t)};f.exclude=(e,r,t)=>{let n=Array.isArray(r)?a=>!r.includes(a):(a,i)=>!r(a,i);return f.pick(e,n,t)}});var ue=u(($t,fe)=>{fe.exports=function(e,r){if(e instanceof RegExp)return{keys:!1,pattern:e};var t,n,a,i,o=[],s="",p=e.split("/");for(p[0]||p.shift();a=p.shift();)t=a[0],t==="*"?(o.push("wild"),s+="/(.*)"):t===":"?(n=a.indexOf("?",1),i=a.indexOf(".",1),o.push(a.substring(1,~n?n:~i?i:a.length)),s+=!!~n&&!~i?"(?:/([^/]+?))?":"/([^/]+?)",~i&&(s+=(~n?"?":"")+"\\"+a.substring(i))):s+="/"+a;return{keys:o,pattern:new RegExp("^"+s+(r?"(?=$|/)":"/?$"),"i")}}});var Oe=u(ge=>{var yr=Object.create,j=Object.defineProperty,hr=Object.defineProperties,br=Object.getOwnPropertyDescriptor,gr=Object.getOwnPropertyDescriptors,Or=Object.getOwnPropertyNames,me=Object.getOwnPropertySymbols,jr=Object.getPrototypeOf,pe=Object.prototype.hasOwnProperty,xr=Object.prototype.propertyIsEnumerable,de=(e,r,t)=>r in e?j(e,r,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[r]=t,wr=(e,r)=>{for(var t in r||(r={}))pe.call(r,t)&&de(e,t,r[t]);if(me)for(var t of me(r))xr.call(r,t)&&de(e,t,r[t]);return e},Fr=(e,r)=>hr(e,gr(r)),ye=e=>j(e,"__esModule",{value:!0}),vr=(e,r)=>{ye(e);for(var t in r)j(e,t,{get:r[t],enumerable:!0})},Sr=(e,r,t)=>{if(r&&typeof r=="object"||typeof r=="function")for(let n of Or(r))!pe.call(e,n)&&n!=="default"&&j(e,n,{get:()=>r[n],enumerable:!(t=br(r,n))||t.enumerable});return e},he=e=>Sr(ye(j(e!=null?yr(jr(e)):{},"default",e&&e.__esModule&&"default"in e?{get:()=>e.default,enumerable:!0}:{value:e,enumerable:!0})),e);vr(ge,{wrapHandler:()=>Ir});var Er=he(le());function Pr(e){let r=(0,Er.parse)(e,{arrayFormat:"comma"}),t={},n={};for(let a of Object.keys(r)){let i=r[a];Array.isArray(i)?n[a]=i:i&&(t[a]=i)}return{queryStringParameters:t,multiValueQueryStringParameters:n}}var Ar=/image|audio|video|application\/pdf|application\/zip|applicaton\/octet-stream/i;function $r(e){return Boolean(e)&&Ar.test(e)}function Cr(e){var r,t;let n=e.rawQuery||e.path.split("?")[1],{queryStringParameters:a,multiValueQueryStringParameters:i}=Pr(n),o=(t=e.isBase64Encoded)!=null?t:$r(((r=e==null?void 0:e.headers)==null?void 0:r["content-type"])||"");return{rawUrl:e.rawUrl||e.path,rawQuery:n,path:e.path,httpMethod:e.httpMethod||"GET",headers:e.headers||{},multiValueHeaders:e.multiValueHeaders||{},queryStringParameters:e.queryStringParameters||a,multiValueQueryStringParameters:e.multiValueQueryStringParameters||i,pathParameters:e.pathParameters||{},body:e.body||null,isBase64Encoded:o!=null?o:!1,requestContext:e.requestContext||{},resource:e.resource||""}}var Mr=he(ue());function Hr(e,r){let[t]=e.split("?"),n=(0,Mr.default)(r),a=0,i={},o=n.pattern.exec(t)||[];for(;a<n.keys.length;)i[n.keys[a]]=o[++a];return i}function be(e){for(let r of Object.keys(e))e[r.toLowerCase()]=e[r]||"";return e}var C;(function(e){e.Html="text/html; charset=utf-8",e.Json="application/json; charset=utf-8",e.Xml="application/xml; charset=utf-8"})(C||(C={}));function Nr(e){return typeof e=="object"?JSON.stringify(e):e}function Ur(e,r){let t=r.statusCode||200,n=r.headers?be(r.headers):{};return t>299&&t<399||(n["content-type"]=e),{isBase64Encoded:r.isBase64Encoded||!1,statusCode:t,headers:n,multiValueHeaders:r.multiValueHeaders?be(r.multiValueHeaders):{},body:Nr(r.body||"")}}function qr(e){return Ur(C.Html,e)}function Tr(e){return typeof e=="string"?qr({body:e}):Fr(wr({},e),{statusCode:e.statusCode||200})}function Ir(e){return async(r,t)=>{let n=Cr(r);return Object.keys(n.pathParameters||{}).length||(n.pathParameters=Hr(r.path,e.route)),Tr(await e.handler(n,t))}}});var Se=u(ve=>{var M=Object.defineProperty,kr=Object.defineProperties,_r=Object.getOwnPropertyDescriptors,je=Object.getOwnPropertySymbols,Vr=Object.prototype.hasOwnProperty,Br=Object.prototype.propertyIsEnumerable,xe=(e,r,t)=>r in e?M(e,r,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[r]=t,Dr=(e,r)=>{for(var t in r||(r={}))Vr.call(r,t)&&xe(e,t,r[t]);if(je)for(var t of je(r))Br.call(r,t)&&xe(e,t,r[t]);return e},Rr=(e,r)=>kr(e,_r(r)),Lr=e=>M(e,"__esModule",{value:!0}),Qr=(e,r)=>{Lr(e);for(var t in r)M(e,t,{get:r[t],enumerable:!0})};Qr(ve,{html:()=>Jr,json:()=>zr,xml:()=>Gr});function we(e){for(let r of Object.keys(e))e[r.toLowerCase()]=e[r]||"";return e}var x;(function(e){e.Html="text/html; charset=utf-8",e.Json="application/json; charset=utf-8",e.Xml="application/xml; charset=utf-8"})(x||(x={}));function Fe(e){return typeof e=="object"?JSON.stringify(e):e}function H(e,r){let t=r.statusCode||200,n=r.headers?we(r.headers):{};return t>299&&t<399||(n["content-type"]=e),{isBase64Encoded:r.isBase64Encoded||!1,statusCode:t,headers:n,multiValueHeaders:r.multiValueHeaders?we(r.multiValueHeaders):{},body:Fe(r.body||"")}}function Jr(e){return H(x.Html,e)}function zr(e){return H(x.Json,Rr(Dr({},e),{body:Fe(e.body)}))}function Gr(e){return H(x.Xml,e)}});var $e=u((Ht,Ae)=>{"use strict";var Xr=function(r){return Yr(r)&&!Kr(r)};function Yr(e){return!!e&&typeof e=="object"}function Kr(e){var r=Object.prototype.toString.call(e);return r==="[object RegExp]"||r==="[object Date]"||et(e)}var Wr=typeof Symbol=="function"&&Symbol.for,Zr=Wr?Symbol.for("react.element"):60103;function et(e){return e.$$typeof===Zr}function rt(e){return Array.isArray(e)?[]:{}}function w(e,r){return r.clone!==!1&&r.isMergeableObject(e)?g(rt(e),e,r):e}function tt(e,r,t){return e.concat(r).map(function(n){return w(n,t)})}function nt(e,r){if(!r.customMerge)return g;var t=r.customMerge(e);return typeof t=="function"?t:g}function at(e){return Object.getOwnPropertySymbols?Object.getOwnPropertySymbols(e).filter(function(r){return e.propertyIsEnumerable(r)}):[]}function Ee(e){return Object.keys(e).concat(at(e))}function Pe(e,r){try{return r in e}catch(t){return!1}}function ot(e,r){return Pe(e,r)&&!(Object.hasOwnProperty.call(e,r)&&Object.propertyIsEnumerable.call(e,r))}function it(e,r,t){var n={};return t.isMergeableObject(e)&&Ee(e).forEach(function(a){n[a]=w(e[a],t)}),Ee(r).forEach(function(a){ot(e,a)||(Pe(e,a)&&t.isMergeableObject(r[a])?n[a]=nt(a,t)(e[a],r[a],t):n[a]=w(r[a],t))}),n}function g(e,r,t){t=t||{},t.arrayMerge=t.arrayMerge||tt,t.isMergeableObject=t.isMergeableObject||Xr,t.cloneUnlessOtherwiseSpecified=w;var n=Array.isArray(r),a=Array.isArray(e),i=n===a;return i?n?t.arrayMerge(e,r,t):it(e,r,t):w(r,t)}g.all=function(r,t){if(!Array.isArray(r))throw new Error("first argument should be an array");return r.reduce(function(n,a){return g(n,a,t)},{})};var st=g;Ae.exports=st});var ke=u(Ie=>{var ct=Object.create,F=Object.defineProperty,lt=Object.getOwnPropertyDescriptor,ft=Object.getOwnPropertyNames,v=Object.getOwnPropertySymbols,ut=Object.getPrototypeOf,N=Object.prototype.hasOwnProperty,Ce=Object.prototype.propertyIsEnumerable,Me=(e,r,t)=>r in e?F(e,r,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[r]=t,He=(e,r)=>{for(var t in r||(r={}))N.call(r,t)&&Me(e,t,r[t]);if(v)for(var t of v(r))Ce.call(r,t)&&Me(e,t,r[t]);return e},Ne=e=>F(e,"__esModule",{value:!0}),mt=(e,r)=>{var t={};for(var n in e)N.call(e,n)&&r.indexOf(n)<0&&(t[n]=e[n]);if(e!=null&&v)for(var n of v(e))r.indexOf(n)<0&&Ce.call(e,n)&&(t[n]=e[n]);return t},pt=(e,r)=>{Ne(e);for(var t in r)F(e,t,{get:r[t],enumerable:!0})},dt=(e,r,t)=>{if(r&&typeof r=="object"||typeof r=="function")for(let n of ft(r))!N.call(e,n)&&n!=="default"&&F(e,n,{get:()=>r[n],enumerable:!(t=lt(r,n))||t.enumerable});return e},yt=e=>dt(Ne(F(e!=null?ct(ut(e)):{},"default",e&&e.__esModule&&"default"in e?{get:()=>e.default,enumerable:!0}:{value:e,enumerable:!0})),e);pt(Ie,{createFootTags:()=>Te,createHeadTags:()=>qe,filterUnique:()=>b,html:()=>bt,prefixToObjects:()=>q,pruneEmpty:()=>U,tag:()=>d});var Ue=yt($e()),ht={title:"Presta",description:"",image:"",url:"",og:{},twitter:{},meta:[{charset:"UTF-8"},{name:"viewport",content:"width=device-width,initial-scale=1"}],link:[],script:[],style:[]};function U(e){let r={};for(let t of Object.keys(e))e[t]&&(r[t]=e[t]);return r}function b(e){let r=[];e:for(let t of e.reverse()){for(let n of r)if(typeof t=="string"||typeof n=="string"){if(t===n)continue e}else if(t.name&&t.name===n.name||t.src&&t.src===n.src||t.href&&t.href===n.href)continue e;r.push(t)}return r.reverse()}function d(e){return r=>{if(typeof r=="string")return r;let t=Object.keys(r).filter(a=>a!=="children").map(a=>`${a}="${r[a]}"`).join(" "),n=t?" "+t:"";return/script|style/.test(e)?`<${e}${n}>${r.children||""}</${e}>`:`<${e}${n} />`}}function q(e,r){return Object.keys(r).map(t=>({[e==="og"?"property":"name"]:`${e}:${t}`,content:r[t]}))}function qe(e={}){let r=(0,Ue.default)(ht,e),{title:t,description:n,image:a,url:i}=r,o=mt(r,["title","description","image","url"]),s=o.meta?b(o.meta):[],p=o.link?b(o.link):[],l=o.script?b(o.script):[],y=o.style?b(o.style):[],Xe=U(He({title:t,description:n,url:i,image:a},o.og||{})),Ye=U(He({title:t,description:n,url:i,image:a},o.twitter||{})),Ke=[s.concat(n?{name:"description",content:n}:[]).map(d("meta")),q("og",Xe).map(d("meta")),q("twitter",Ye).map(d("meta")),p.map(d("link")),l.map(d("script")),y.map(d("style"))].flat(2);return`<title>${t}</title>${Ke.join("")}`}function Te(e={}){let r=(0,Ue.default)({script:[],style:[]},e),t=b(r.script),n=b(r.style);return[t.map(d("script")),n.map(d("style"))].flat().join("")}function bt({body:e="",head:r={},foot:t={},htmlAttributes:n={},bodyAttributes:a={}}){r.link||(r.link=[]),r.link.find(l=>typeof l=="object"?l.rel==="icon":/rel="icon/.test(l))||(r.link.push({rel:"icon",type:"image/png",href:"https://presta.run/favicon.png"}),r.link.push({rel:"icon",type:"image/svg",href:"https://presta.run/favicon.svg"})),r.meta||(r.meta=[]),r.meta&&(r.meta.find(l=>!!l.charset)||r.meta.push({charset:"UTF-8"}),r.meta.find(l=>typeof l=="object"?l.name==="viewport":/name="viewport/.test(l))||r.meta.push({name:"viewport",content:"width=device-width,initial-scale=1"}));let i=qe(r),o=Te(t),s=Object.keys(n).reduce((l,y)=>l+=` ${y}="${n[y]}"`,""),p=Object.keys(a).reduce((l,y)=>l+=` ${y}="${a[y]}"`,"");return`<!DOCTYPE html><html${s}><head><!-- built with presta https://npm.im/presta -->${i}</head><body${p}>${e}${o}</body></html>`}});L(exports,{config:()=>xt,handler:()=>wt,route:()=>jt});var Ge=m(Oe());var k={};L(k,{handler:()=>Ot,route:()=>gt});var E=m(require("hyposcript")),Qe=m(Se()),Je=m(ke()),ze=m(require("hypobox"));var _e=m(require("hypobox")),Ve=m(require("hypostyle")),Be=m(require("hypostyle/presets")),S=(0,Ve.hypostyle)(A(P({},Be),{tokens:A(P({},Be.tokens),{fontFamily:{sans:"sans-serif"}})}));(0,_e.configure)(S);var De=S.createGlobal({"html, body":{p:0,m:0},".active":{c:"tomato"}});var Re=[{rel:"stylesheet",href:"https://unpkg.com/svbstrate@5.1.0/svbstrate.css"}];var T=m(require("hyposcript")),I=m(require("hypobox"));function Le({currentPath:e}={}){return(0,T.h)(I.Box,{pb:6,f:!0,aic:!0},[{href:"/",title:"Home"},{href:"/about",title:"About"},{href:"/contact",title:"Contact"},{href:"/some-page",title:"Some Page"},{href:"/not/found",title:"404"}].map(r=>(0,T.h)(I.Box,{as:"a",href:r.href,mr:4,className:e===r.href?"active":""},r.title)).join(""))}var gt="/:slug?";function Ot(e){let r=(0,E.h)(ze.Box,{p:10},(0,E.h)(Le,{currentPath:e.path}),(0,E.h)("h1",null,"Dynamic page: ",e.path)),t=S.flush();return(0,Qe.html)({multiValueHeaders:{"set-cookie":["presta_example=1","presta_example_2=1"]},body:(0,Je.html)({head:{link:Re,style:[{children:De},{children:t}]},body:r})})}var _=Object.assign({config:{}},k),jt=_.route,xt=_.config,wt=(0,Ge.wrapHandler)(_);0&&(module.exports={config,handler,route});