var W=Object.create;var y=Object.defineProperty;var Y=Object.getOwnPropertyDescriptor;var Z=Object.getOwnPropertyNames;var rr=Object.getPrototypeOf,er=Object.prototype.hasOwnProperty;var O=r=>y(r,"__esModule",{value:!0});var u=(r,e)=>()=>(e||r((e={exports:{}}).exports,e),e.exports),F=(r,e)=>{O(r);for(var t in e)y(r,t,{get:e[t],enumerable:!0})},tr=(r,e,t)=>{if(e&&typeof e=="object"||typeof e=="function")for(let n of Z(e))!er.call(r,n)&&n!=="default"&&y(r,n,{get:()=>e[n],enumerable:!(t=Y(e,n))||t.enumerable});return r},nr=r=>tr(O(y(r!=null?W(rr(r)):{},"default",r&&r.__esModule&&"default"in r?{get:()=>r.default,enumerable:!0}:{value:r,enumerable:!0})),r);var j=u((Lr,x)=>{"use strict";x.exports=r=>encodeURIComponent(r).replace(/[!'()*]/g,e=>`%${e.charCodeAt(0).toString(16).toUpperCase()}`)});var A=u((_r,C)=>{"use strict";var w="%[a-f0-9]{2}",S=new RegExp(w,"gi"),E=new RegExp("("+w+")+","gi");function p(r,e){try{return decodeURIComponent(r.join(""))}catch(a){}if(r.length===1)return r;e=e||1;var t=r.slice(0,e),n=r.slice(e);return Array.prototype.concat.call([],p(t),p(n))}function ar(r){try{return decodeURIComponent(r)}catch(n){for(var e=r.match(S),t=1;t<e.length;t++)r=p(e,t).join(""),e=r.match(S);return r}}function sr(r){for(var e={"%FE%FF":"\uFFFD\uFFFD","%FF%FE":"\uFFFD\uFFFD"},t=E.exec(r);t;){try{e[t[0]]=decodeURIComponent(t[0])}catch(c){var n=ar(t[0]);n!==t[0]&&(e[t[0]]=n)}t=E.exec(r)}e["%C2"]="\uFFFD";for(var a=Object.keys(e),i=0;i<a.length;i++){var s=a[i];r=r.replace(new RegExp(s,"g"),e[s])}return r}C.exports=function(r){if(typeof r!="string")throw new TypeError("Expected `encodedURI` to be of type `string`, got `"+typeof r+"`");try{return r=r.replace(/\+/g," "),decodeURIComponent(r)}catch(e){return sr(r)}}});var q=u((Tr,P)=>{"use strict";P.exports=(r,e)=>{if(!(typeof r=="string"&&typeof e=="string"))throw new TypeError("Expected the arguments to be of type `string`");if(e==="")return[r];let t=r.indexOf(e);return t===-1?[r]:[r.slice(0,t),r.slice(t+e.length)]}});var U=u((zr,N)=>{"use strict";N.exports=function(r,e){for(var t={},n=Object.keys(r),a=Array.isArray(e),i=0;i<n.length;i++){var s=n[i],c=r[s];(a?e.indexOf(s)!==-1:e(s,c,r))&&(t[s]=c)}return t}});var M=u(o=>{"use strict";var ir=j(),cr=A(),H=q(),fr=U(),or=r=>r==null;function ur(r){switch(r.arrayFormat){case"index":return e=>(t,n)=>{let a=t.length;return n===void 0||r.skipNull&&n===null||r.skipEmptyString&&n===""?t:n===null?[...t,[f(e,r),"[",a,"]"].join("")]:[...t,[f(e,r),"[",f(a,r),"]=",f(n,r)].join("")]};case"bracket":return e=>(t,n)=>n===void 0||r.skipNull&&n===null||r.skipEmptyString&&n===""?t:n===null?[...t,[f(e,r),"[]"].join("")]:[...t,[f(e,r),"[]=",f(n,r)].join("")];case"comma":case"separator":return e=>(t,n)=>n==null||n.length===0?t:t.length===0?[[f(e,r),"=",f(n,r)].join("")]:[[t,f(n,r)].join(r.arrayFormatSeparator)];default:return e=>(t,n)=>n===void 0||r.skipNull&&n===null||r.skipEmptyString&&n===""?t:n===null?[...t,f(e,r)]:[...t,[f(e,r),"=",f(n,r)].join("")]}}function lr(r){let e;switch(r.arrayFormat){case"index":return(t,n,a)=>{if(e=/\[(\d*)\]$/.exec(t),t=t.replace(/\[\d*\]$/,""),!e){a[t]=n;return}a[t]===void 0&&(a[t]={}),a[t][e[1]]=n};case"bracket":return(t,n,a)=>{if(e=/(\[\])$/.exec(t),t=t.replace(/\[\]$/,""),!e){a[t]=n;return}if(a[t]===void 0){a[t]=[n];return}a[t]=[].concat(a[t],n)};case"comma":case"separator":return(t,n,a)=>{let i=typeof n=="string"&&n.includes(r.arrayFormatSeparator),s=typeof n=="string"&&!i&&l(n,r).includes(r.arrayFormatSeparator);n=s?l(n,r):n;let c=i||s?n.split(r.arrayFormatSeparator).map(d=>l(d,r)):n===null?n:l(n,r);a[t]=c};default:return(t,n,a)=>{if(a[t]===void 0){a[t]=n;return}a[t]=[].concat(a[t],n)}}}function V(r){if(typeof r!="string"||r.length!==1)throw new TypeError("arrayFormatSeparator must be single character string")}function f(r,e){return e.encode?e.strict?ir(r):encodeURIComponent(r):r}function l(r,e){return e.decode?cr(r):r}function $(r){return Array.isArray(r)?r.sort():typeof r=="object"?$(Object.keys(r)).sort((e,t)=>Number(e)-Number(t)).map(e=>r[e]):r}function I(r){let e=r.indexOf("#");return e!==-1&&(r=r.slice(0,e)),r}function dr(r){let e="",t=r.indexOf("#");return t!==-1&&(e=r.slice(t)),e}function B(r){r=I(r);let e=r.indexOf("?");return e===-1?"":r.slice(e+1)}function R(r,e){return e.parseNumbers&&!Number.isNaN(Number(r))&&typeof r=="string"&&r.trim()!==""?r=Number(r):e.parseBooleans&&r!==null&&(r.toLowerCase()==="true"||r.toLowerCase()==="false")&&(r=r.toLowerCase()==="true"),r}function D(r,e){e=Object.assign({decode:!0,sort:!0,arrayFormat:"none",arrayFormatSeparator:",",parseNumbers:!1,parseBooleans:!1},e),V(e.arrayFormatSeparator);let t=lr(e),n=Object.create(null);if(typeof r!="string"||(r=r.trim().replace(/^[?#&]/,""),!r))return n;for(let a of r.split("&")){if(a==="")continue;let[i,s]=H(e.decode?a.replace(/\+/g," "):a,"=");s=s===void 0?null:["comma","separator"].includes(e.arrayFormat)?s:l(s,e),t(l(i,e),s,n)}for(let a of Object.keys(n)){let i=n[a];if(typeof i=="object"&&i!==null)for(let s of Object.keys(i))i[s]=R(i[s],e);else n[a]=R(i,e)}return e.sort===!1?n:(e.sort===!0?Object.keys(n).sort():Object.keys(n).sort(e.sort)).reduce((a,i)=>{let s=n[i];return Boolean(s)&&typeof s=="object"&&!Array.isArray(s)?a[i]=$(s):a[i]=s,a},Object.create(null))}o.extract=B;o.parse=D;o.stringify=(r,e)=>{if(!r)return"";e=Object.assign({encode:!0,strict:!0,arrayFormat:"none",arrayFormatSeparator:","},e),V(e.arrayFormatSeparator);let t=s=>e.skipNull&&or(r[s])||e.skipEmptyString&&r[s]==="",n=ur(e),a={};for(let s of Object.keys(r))t(s)||(a[s]=r[s]);let i=Object.keys(a);return e.sort!==!1&&i.sort(e.sort),i.map(s=>{let c=r[s];return c===void 0?"":c===null?f(s,e):Array.isArray(c)?c.reduce(n(s),[]).join("&"):f(s,e)+"="+f(c,e)}).filter(s=>s.length>0).join("&")};o.parseUrl=(r,e)=>{e=Object.assign({decode:!0},e);let[t,n]=H(r,"#");return Object.assign({url:t.split("?")[0]||"",query:D(B(r),e)},e&&e.parseFragmentIdentifier&&n?{fragmentIdentifier:l(n,e)}:{})};o.stringifyUrl=(r,e)=>{e=Object.assign({encode:!0,strict:!0},e);let t=I(r.url).split("?")[0]||"",n=o.extract(r.url),a=o.parse(n,{sort:!1}),i=Object.assign(a,r.query),s=o.stringify(i,e);s&&(s=`?${s}`);let c=dr(r.url);return r.fragmentIdentifier&&(c=`#${f(r.fragmentIdentifier,e)}`),`${t}${s}${c}`};o.pick=(r,e,t)=>{t=Object.assign({parseFragmentIdentifier:!0},t);let{url:n,query:a,fragmentIdentifier:i}=o.parseUrl(r,t);return o.stringifyUrl({url:n,query:fr(a,e),fragmentIdentifier:i},t)};o.exclude=(r,e,t)=>{let n=Array.isArray(e)?a=>!e.includes(a):(a,i)=>!e(a,i);return o.pick(r,n,t)}});var k=u((Gr,Q)=>{Q.exports=function(r,e){if(r instanceof RegExp)return{keys:!1,pattern:r};var t,n,a,i,s=[],c="",d=r.split("/");for(d[0]||d.shift();a=d.shift();)t=a[0],t==="*"?(s.push("wild"),c+="/(.*)"):t===":"?(n=a.indexOf("?",1),i=a.indexOf(".",1),s.push(a.substring(1,~n?n:~i?i:a.length)),c+=!!~n&&!~i?"(?:/([^/]+?))?":"/([^/]+?)",~i&&(c+=(~n?"?":"")+"\\"+a.substring(i))):c+="/"+a;return{keys:s,pattern:new RegExp("^"+c+(e?"(?=$|/)":"/?$"),"i")}}});var v=u(X=>{var mr=Object.create,m=Object.defineProperty,yr=Object.defineProperties,pr=Object.getOwnPropertyDescriptor,gr=Object.getOwnPropertyDescriptors,hr=Object.getOwnPropertyNames,L=Object.getOwnPropertySymbols,br=Object.getPrototypeOf,_=Object.prototype.hasOwnProperty,Or=Object.prototype.propertyIsEnumerable,T=(r,e,t)=>e in r?m(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t,Fr=(r,e)=>{for(var t in e||(e={}))_.call(e,t)&&T(r,t,e[t]);if(L)for(var t of L(e))Or.call(e,t)&&T(r,t,e[t]);return r},xr=(r,e)=>yr(r,gr(e)),z=r=>m(r,"__esModule",{value:!0}),jr=(r,e)=>{z(r);for(var t in e)m(r,t,{get:e[t],enumerable:!0})},wr=(r,e,t)=>{if(e&&typeof e=="object"||typeof e=="function")for(let n of hr(e))!_.call(r,n)&&n!=="default"&&m(r,n,{get:()=>e[n],enumerable:!(t=pr(e,n))||t.enumerable});return r},J=r=>wr(z(m(r!=null?mr(br(r)):{},"default",r&&r.__esModule&&"default"in r?{get:()=>r.default,enumerable:!0}:{value:r,enumerable:!0})),r);jr(X,{wrapHandler:()=>Ir});var Sr=J(M());function Er(r){let e=(0,Sr.parse)(r,{arrayFormat:"comma"}),t={},n={};for(let a of Object.keys(e)){let i=e[a];Array.isArray(i)?n[a]=i:i&&(t[a]=i)}return{queryStringParameters:t,multiValueQueryStringParameters:n}}var Cr=/image|audio|video|application\/pdf|application\/zip|applicaton\/octet-stream/i;function Ar(r){return Boolean(r)&&Cr.test(r)}function Pr(r){var e,t;let n=r.rawQuery||r.path.split("?")[1],{queryStringParameters:a,multiValueQueryStringParameters:i}=Er(n),s=(t=r.isBase64Encoded)!=null?t:Ar(((e=r==null?void 0:r.headers)==null?void 0:e["content-type"])||"");return{rawUrl:r.rawUrl||r.path,rawQuery:n,path:r.path,httpMethod:r.httpMethod||"GET",headers:r.headers||{},multiValueHeaders:r.multiValueHeaders||{},queryStringParameters:r.queryStringParameters||a,multiValueQueryStringParameters:r.multiValueQueryStringParameters||i,pathParameters:r.pathParameters||{},body:r.body||null,isBase64Encoded:s!=null?s:!1,requestContext:r.requestContext||{},resource:r.resource||""}}var qr=J(k());function Nr(r,e){let[t]=r.split("?"),n=(0,qr.default)(e),a=0,i={},s=n.pattern.exec(t)||[];for(;a<n.keys.length;)i[n.keys[a]]=s[++a];return i}function G(r){for(let e of Object.keys(r))r[e.toLowerCase()]=r[e]||"";return r}var g;(function(r){r.Html="text/html; charset=utf-8",r.Json="application/json; charset=utf-8",r.Xml="application/xml; charset=utf-8"})(g||(g={}));function Ur(r){return typeof r=="object"?JSON.stringify(r):r}function Hr(r,e){let t=e.statusCode||200,n=e.headers?G(e.headers):{};return t>299&&t<399||(n["content-type"]=r),{isBase64Encoded:e.isBase64Encoded||!1,statusCode:t,headers:n,multiValueHeaders:e.multiValueHeaders?G(e.multiValueHeaders):{},body:Ur(e.body||"")}}function Vr(r){return Hr(g.Html,r)}function $r(r){return typeof r=="string"?Vr({body:r}):xr(Fr({},r),{statusCode:r.statusCode||200})}function Ir(r){return async(e,t)=>{let n=Pr(e);return Object.keys(n.pathParameters||{}).length||(n.pathParameters=Nr(e.path,r.route)),$r(await r.handler(n,t))}}});F(exports,{config:()=>Mr,handler:()=>Qr,route:()=>Dr});var K=nr(v());var h={};F(h,{handler:()=>Rr,route:()=>Br});var Br="/api/*";function Rr(r){return{json:r}}var b=Object.assign({config:{}},h),Dr=b.route,Mr=b.config,Qr=(0,K.wrapHandler)(b);0&&(module.exports={config,handler,route});
