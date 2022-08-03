var z=Object.create;var f=Object.defineProperty;var A=Object.getOwnPropertyDescriptor;var T=Object.getOwnPropertyNames;var _=Object.getPrototypeOf,I=Object.prototype.hasOwnProperty;var h=e=>f(e,"__esModule",{value:!0});var J=(e,t)=>{h(e);for(var i in t)f(e,i,{get:t[i],enumerable:!0})},U=(e,t,i)=>{if(t&&typeof t=="object"||typeof t=="function")for(let s of T(t))!I.call(e,s)&&s!=="default"&&f(e,s,{get:()=>t[s],enumerable:!(i=A(t,s))||i.enumerable});return e},u=e=>U(h(f(e!=null?z(_(e)):{},"default",e&&e.__esModule&&"default"in e?{get:()=>e.default,enumerable:!0}:{value:e,enumerable:!0})),e);J(exports,{default:()=>ie,generateRedirectsString:()=>R,getNetlifyConfig:()=>$,getUserConfiguredRedirects:()=>j,normalizeNetlifyRoute:()=>D,onPostBuild:()=>O,prestaRoutesToNetlifyRedirects:()=>C,toAbsolutePath:()=>b,toRelativePath:()=>te,validateAndNormalizeNetlifyConfig:()=>w});var d=u(require("assert")),a=u(require("fs-extra")),o=u(require("path")),N=u(require("toml")),m=u(require("netlify-redirect-parser")),v=u(require("filewatcher")),g=u(require("presta")),y=u(require("presta/utils/timer"));var B="@presta/adapter-netlify",E="0.5.2",G="Netlify adapter for Presta.",L="dist/index.js",H="dist/index.d.ts",K=["dist"],Q={build:"node scripts/build && tsc --emitDeclarationOnly",typecheck:"tsc --noEmit",test:"tap test.ts --ts --coverage-report=text-lcov --no-check-coverage"},V={type:"git",url:"git+ssh://git@github.com/sure-thing/presta.git"},W="estrattonbailey",X="MIT",Y={url:"https://github.com/sure-thing/presta/issues"},Z="https://github.com/sure-thing/presta#readme",x={"@presta/utils":"workspace:^0.1.2",filewatcher:"^3.0.1","fs-extra":"^9.0.1","netlify-redirect-parser":"^8.0.0",presta:"workspace:^0.45.0",toml:"^3.0.0"},ee={"@types/fs-extra":"^9.0.12","@types/node":"^18.6.3",typescript:"^4.7.4"},p={name:B,version:E,description:G,main:L,types:H,files:K,scripts:Q,repository:V,author:W,license:X,bugs:Y,homepage:Z,dependencies:x,devDependencies:ee};var r=`${p.name}@${p.version}`;function $(e){let t=a.default.readFileSync(e,"utf8"),i=(0,N.parse)(t);return JSON.parse(JSON.stringify(i))}function w(e){(0,d.default)(!!e,"Missing required netlify.toml config file"),(0,d.default)(!!e.build,"Missing required netlify.toml config: build");let t=b(process.cwd(),e.build.publish);(0,d.default)(!!t,"Missing required netlify.toml config: build.publish");let i=b(process.cwd(),e.build.functions);return{build:{publish:t,functions:i}}}function b(e,t){return t?o.default.join(e,t):void 0}function te(e,t){return o.default.relative(e,t)}function D(e){return e=e.replace(/^\*/,"/*"),e=e.replace(/^\/\//,"/"),e}function C(e){return Object.values(e).map(t=>({from:D(t.route),to:`/.netlify/functions/${o.default.basename(t.dest,".js")}`,status:200,force:!1,query:{},conditions:{},signed:void 0}))}function R(e){return e.map(t=>[t.from,t.to,`${t.status}${t.force?"!":""}`].join(" ")).join(`
`)}async function j(e){return[...await(0,m.parseFileRedirects)(o.default.join(process.cwd(),"_redirects")),...await(0,m.parseFileRedirects)(o.default.join(e,"_redirects"))].reduce((t,i)=>t.find(s=>s.from===i.from)?t:t.concat(i),[])}async function O(e,t){let{publish:i,functions:s}=e.build,l=(0,y.timer)(),c=t.getManifest(),S=await j(i),P=t.getStaticOutputDir(),F=t.getFunctionsOutputDir();if(Object.keys(c.statics).length&&(i===P?t.logger.debug(`${r} Netlify publish directory matches static output directory`):(a.default.copySync(t.getStaticOutputDir(),i),t.logger.debug(`${r} copying static files`))),Object.keys(c.functions).length)if(!s)t.logger.warn(`${r} detected built functions, but Netlify config does not specify an functions output directory.`);else{let M=C(t.getManifest().functions),k=S.concat(M),q=o.default.join(e.build.publish,"_redirects");a.default.outputFileSync(q,R(k),"utf8"),t.logger.debug(`${r} writing redirects`),s===F?t.logger.debug(`${r} Netlify functions directory matches functions output directory`):(a.default.copySync(t.getFunctionsOutputDir(),s),t.logger.debug(`${r} copying functions`))}t.logger.info(`${r} complete`,{duration:l()})}var ie=(0,g.createPlugin)(()=>e=>{let t=(0,y.timer)();e.logger.debug(`${r} initialized`);let i=o.default.join(e.cwd,"netlify.toml");if(a.default.existsSync(i))e.logger.debug(`${r} Netlify config found`);else{e.logger.debug(`${r} Netlify config not found, initializing defaults`);let l=o.default.relative(e.cwd,e.getStaticOutputDir()),c=o.default.relative(e.cwd,e.getFunctionsOutputDir());a.default.writeFileSync(i,`[build]
	command = 'npm run build'
	publish = '${l}'
	functions = '${c}'`,"utf8")}let s=w($(i));if(e.logger.info(`${r} initialized`,{duration:t()}),e.mode===g.Mode.Dev){let l=(0,v.default)();return l.add(i),l.on("change",()=>{e.logger.debug(`${r} Netlify config changed, requesting dev server restart`),e.restartDevServer()}),{name:r,cleanup(){l.removeAll()}}}else return e.events.on("buildComplete",()=>{e.logger.debug(`${r} received event buildComplete`),O(s,e)}),{name:r}});0&&(module.exports={generateRedirectsString,getNetlifyConfig,getUserConfiguredRedirects,normalizeNetlifyRoute,onPostBuild,prestaRoutesToNetlifyRedirects,toAbsolutePath,toRelativePath,validateAndNormalizeNetlifyConfig});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vaW5kZXgudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImltcG9ydCBhc3NlcnQgZnJvbSAnYXNzZXJ0J1xuaW1wb3J0IGZzIGZyb20gJ2ZzLWV4dHJhJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCB7IHBhcnNlIGFzIHRvbWwgfSBmcm9tICd0b21sJ1xuLy8gQHRzLWlnbm9yZVxuaW1wb3J0IHsgcGFyc2VGaWxlUmVkaXJlY3RzIH0gZnJvbSAnbmV0bGlmeS1yZWRpcmVjdC1wYXJzZXInXG4vLyBAdHMtaWdub3JlXG5pbXBvcnQgZmlsZXdhdGNoZXIgZnJvbSAnZmlsZXdhdGNoZXInXG5pbXBvcnQgeyBjcmVhdGVQbHVnaW4sIFBsdWdpbkNvbnRleHQsIE1hbmlmZXN0LCBNb2RlIH0gZnJvbSAncHJlc3RhJ1xuaW1wb3J0IHsgdGltZXIgfSBmcm9tICdwcmVzdGEvdXRpbHMvdGltZXInXG5cbmltcG9ydCBwa2cgZnJvbSAnLi9wYWNrYWdlLmpzb24nXG5cbi8vIFRPRE8gZG8gSSBuZWVkIG1vcmUgaGVyZT9cbmV4cG9ydCB0eXBlIE5ldGxpZnlDb25maWcgPSB7XG4gIGJ1aWxkOiB7XG4gICAgcHVibGlzaDogc3RyaW5nXG4gICAgZnVuY3Rpb25zPzogc3RyaW5nXG4gIH1cbn1cblxuZXhwb3J0IHR5cGUgTmV0bGlmeVJlZGlyZWN0ID0ge1xuICBmcm9tOiBzdHJpbmdcbiAgdG86IHN0cmluZ1xuICBzdGF0dXM6IG51bWJlclxuICBmb3JjZTogYm9vbGVhblxuICBxdWVyeTogeyBbcGFyYW06IHN0cmluZ106IHN0cmluZyB9XG4gIGNvbmRpdGlvbnM6IHsgW3BhcmFtOiBzdHJpbmddOiBzdHJpbmcgfVxuICBzaWduZWQ6IHN0cmluZyB8IHVuZGVmaW5lZFxufVxuXG5jb25zdCBQTFVHSU4gPSBgJHtwa2cubmFtZX1AJHtwa2cudmVyc2lvbn1gXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXROZXRsaWZ5Q29uZmlnKGNvbmZpZ0ZpbGVwYXRoOiBzdHJpbmcpOiBQYXJ0aWFsPE5ldGxpZnlDb25maWc+IHwgdW5kZWZpbmVkIHtcbiAgY29uc3QgcmF3ID0gZnMucmVhZEZpbGVTeW5jKGNvbmZpZ0ZpbGVwYXRoLCAndXRmOCcpXG4gIGNvbnN0IGpzb24gPSB0b21sKHJhdylcbiAgcmV0dXJuIEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoanNvbikpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZUFuZE5vcm1hbGl6ZU5ldGxpZnlDb25maWcoY29uZmlnPzogUGFydGlhbDxOZXRsaWZ5Q29uZmlnPik6IE5ldGxpZnlDb25maWcge1xuICBhc3NlcnQoISFjb25maWcsIGBNaXNzaW5nIHJlcXVpcmVkIG5ldGxpZnkudG9tbCBjb25maWcgZmlsZWApXG4gIGFzc2VydCghIWNvbmZpZy5idWlsZCwgYE1pc3NpbmcgcmVxdWlyZWQgbmV0bGlmeS50b21sIGNvbmZpZzogYnVpbGRgKVxuXG4gIGNvbnN0IHB1Ymxpc2ggPSB0b0Fic29sdXRlUGF0aChwcm9jZXNzLmN3ZCgpLCBjb25maWcuYnVpbGQucHVibGlzaClcblxuICBhc3NlcnQoISFwdWJsaXNoLCBgTWlzc2luZyByZXF1aXJlZCBuZXRsaWZ5LnRvbWwgY29uZmlnOiBidWlsZC5wdWJsaXNoYClcblxuICBjb25zdCBmdW5jdGlvbnMgPSB0b0Fic29sdXRlUGF0aChwcm9jZXNzLmN3ZCgpLCBjb25maWcuYnVpbGQuZnVuY3Rpb25zKVxuXG4gIHJldHVybiB7XG4gICAgYnVpbGQ6IHtcbiAgICAgIHB1Ymxpc2gsXG4gICAgICBmdW5jdGlvbnMsXG4gICAgfSxcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9BYnNvbHV0ZVBhdGgoY3dkOiBzdHJpbmcsIGZpbGU/OiBzdHJpbmcpIHtcbiAgcmV0dXJuIGZpbGUgPyBwYXRoLmpvaW4oY3dkLCBmaWxlKSA6IHVuZGVmaW5lZFxufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9SZWxhdGl2ZVBhdGgoY3dkOiBzdHJpbmcsIGZpbGVwYXRoOiBzdHJpbmcpIHtcbiAgcmV0dXJuIHBhdGgucmVsYXRpdmUoY3dkLCBmaWxlcGF0aClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGl6ZU5ldGxpZnlSb3V0ZShyb3V0ZTogc3RyaW5nKSB7XG4gIHJvdXRlID0gcm91dGUucmVwbGFjZSgvXlxcKi8sICcvKicpXG4gIHJvdXRlID0gcm91dGUucmVwbGFjZSgvXlxcL1xcLy8sICcvJylcbiAgcmV0dXJuIHJvdXRlXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwcmVzdGFSb3V0ZXNUb05ldGxpZnlSZWRpcmVjdHMoZmlsZXM6IE1hbmlmZXN0WydmdW5jdGlvbnMnXSk6IE5ldGxpZnlSZWRpcmVjdFtdIHtcbiAgcmV0dXJuIE9iamVjdC52YWx1ZXMoZmlsZXMpLm1hcCgoZmlsZSkgPT4gKHtcbiAgICBmcm9tOiBub3JtYWxpemVOZXRsaWZ5Um91dGUoZmlsZS5yb3V0ZSksXG4gICAgdG86IGAvLm5ldGxpZnkvZnVuY3Rpb25zLyR7cGF0aC5iYXNlbmFtZShmaWxlLmRlc3QsICcuanMnKX1gLFxuICAgIHN0YXR1czogMjAwLFxuICAgIGZvcmNlOiBmYWxzZSxcbiAgICBxdWVyeToge30sXG4gICAgY29uZGl0aW9uczoge30sXG4gICAgc2lnbmVkOiB1bmRlZmluZWQsXG4gIH0pKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2VuZXJhdGVSZWRpcmVjdHNTdHJpbmcocmVkaXJlY3RzOiBOZXRsaWZ5UmVkaXJlY3RbXSkge1xuICByZXR1cm4gcmVkaXJlY3RzLm1hcCgocikgPT4gW3IuZnJvbSwgci50bywgYCR7ci5zdGF0dXN9JHtyLmZvcmNlID8gJyEnIDogJyd9YF0uam9pbignICcpKS5qb2luKCdcXG4nKVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0VXNlckNvbmZpZ3VyZWRSZWRpcmVjdHMoZGlyOiBzdHJpbmcpIHtcbiAgcmV0dXJuIChcbiAgICBbXG4gICAgICAuLi4oYXdhaXQgcGFyc2VGaWxlUmVkaXJlY3RzKHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCAnX3JlZGlyZWN0cycpKSksXG4gICAgICAuLi4oYXdhaXQgcGFyc2VGaWxlUmVkaXJlY3RzKHBhdGguam9pbihkaXIsICdfcmVkaXJlY3RzJykpKSxcbiAgICBdIGFzIE5ldGxpZnlSZWRpcmVjdFtdXG4gICkucmVkdWNlKChyZWRpcmVjdHMsIHJlZGlyZWN0KSA9PiB7XG4gICAgaWYgKHJlZGlyZWN0cy5maW5kKChyKSA9PiByLmZyb20gPT09IHJlZGlyZWN0LmZyb20pKSByZXR1cm4gcmVkaXJlY3RzXG4gICAgcmV0dXJuIHJlZGlyZWN0cy5jb25jYXQocmVkaXJlY3QpXG4gIH0sIFtdIGFzIE5ldGxpZnlSZWRpcmVjdFtdKVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gb25Qb3N0QnVpbGQoY29uZmlnOiBOZXRsaWZ5Q29uZmlnLCBjdHg6IFBsdWdpbkNvbnRleHQpIHtcbiAgY29uc3QgeyBwdWJsaXNoOiBwdWJsaXNoRGlyLCBmdW5jdGlvbnM6IGZ1bmN0aW9uc0RpciB9ID0gY29uZmlnLmJ1aWxkXG4gIGNvbnN0IHRpbWUgPSB0aW1lcigpXG4gIGNvbnN0IG1hbmlmZXN0ID0gY3R4LmdldE1hbmlmZXN0KClcbiAgY29uc3QgdXNlckNvbmZpZ3VyZWRSZWRpcmVjdHMgPSBhd2FpdCBnZXRVc2VyQ29uZmlndXJlZFJlZGlyZWN0cyhwdWJsaXNoRGlyKVxuICBjb25zdCBzdGF0aWNPdXRwdXREaXIgPSBjdHguZ2V0U3RhdGljT3V0cHV0RGlyKClcbiAgY29uc3QgZnVuY3Rpb25zT3V0cHV0RGlyID0gY3R4LmdldEZ1bmN0aW9uc091dHB1dERpcigpXG5cbiAgaWYgKE9iamVjdC5rZXlzKG1hbmlmZXN0LnN0YXRpY3MpLmxlbmd0aCkge1xuICAgIGlmIChwdWJsaXNoRGlyID09PSBzdGF0aWNPdXRwdXREaXIpIHtcbiAgICAgIGN0eC5sb2dnZXIuZGVidWcoYCR7UExVR0lOfSBOZXRsaWZ5IHB1Ymxpc2ggZGlyZWN0b3J5IG1hdGNoZXMgc3RhdGljIG91dHB1dCBkaXJlY3RvcnlgKVxuICAgIH0gZWxzZSB7XG4gICAgICBmcy5jb3B5U3luYyhjdHguZ2V0U3RhdGljT3V0cHV0RGlyKCksIHB1Ymxpc2hEaXIpXG4gICAgICBjdHgubG9nZ2VyLmRlYnVnKGAke1BMVUdJTn0gY29weWluZyBzdGF0aWMgZmlsZXNgKVxuICAgIH1cbiAgfVxuXG4gIGlmIChPYmplY3Qua2V5cyhtYW5pZmVzdC5mdW5jdGlvbnMpLmxlbmd0aCkge1xuICAgIGlmICghZnVuY3Rpb25zRGlyKSB7XG4gICAgICBjdHgubG9nZ2VyLndhcm4oYCR7UExVR0lOfSBkZXRlY3RlZCBidWlsdCBmdW5jdGlvbnMsIGJ1dCBOZXRsaWZ5IGNvbmZpZyBkb2VzIG5vdCBzcGVjaWZ5IGFuIGZ1bmN0aW9ucyBvdXRwdXQgZGlyZWN0b3J5LmApXG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHByZXN0YVJlZGlyZWN0cyA9IHByZXN0YVJvdXRlc1RvTmV0bGlmeVJlZGlyZWN0cyhjdHguZ2V0TWFuaWZlc3QoKS5mdW5jdGlvbnMpXG4gICAgICBjb25zdCBjb21iaW5lZFJlZGlyZWN0cyA9IHVzZXJDb25maWd1cmVkUmVkaXJlY3RzLmNvbmNhdChwcmVzdGFSZWRpcmVjdHMpXG4gICAgICBjb25zdCByZWRpcmVjdHNGaWxlcGF0aCA9IHBhdGguam9pbihjb25maWcuYnVpbGQucHVibGlzaCwgJ19yZWRpcmVjdHMnKVxuXG4gICAgICAvLyBUT0RPIG92ZXJ3cml0ZXMsIHJpZ2h0P1xuICAgICAgZnMub3V0cHV0RmlsZVN5bmMocmVkaXJlY3RzRmlsZXBhdGgsIGdlbmVyYXRlUmVkaXJlY3RzU3RyaW5nKGNvbWJpbmVkUmVkaXJlY3RzKSwgJ3V0ZjgnKVxuICAgICAgY3R4LmxvZ2dlci5kZWJ1ZyhgJHtQTFVHSU59IHdyaXRpbmcgcmVkaXJlY3RzYClcblxuICAgICAgaWYgKGZ1bmN0aW9uc0RpciA9PT0gZnVuY3Rpb25zT3V0cHV0RGlyKSB7XG4gICAgICAgIGN0eC5sb2dnZXIuZGVidWcoYCR7UExVR0lOfSBOZXRsaWZ5IGZ1bmN0aW9ucyBkaXJlY3RvcnkgbWF0Y2hlcyBmdW5jdGlvbnMgb3V0cHV0IGRpcmVjdG9yeWApXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmcy5jb3B5U3luYyhjdHguZ2V0RnVuY3Rpb25zT3V0cHV0RGlyKCksIGZ1bmN0aW9uc0RpcilcbiAgICAgICAgY3R4LmxvZ2dlci5kZWJ1ZyhgJHtQTFVHSU59IGNvcHlpbmcgZnVuY3Rpb25zYClcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjdHgubG9nZ2VyLmluZm8oYCR7UExVR0lOfSBjb21wbGV0ZWAsIHsgZHVyYXRpb246IHRpbWUoKSB9KVxufVxuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVQbHVnaW4oKCkgPT4ge1xuICByZXR1cm4gKGN0eCkgPT4ge1xuICAgIGNvbnN0IHN0YXJ0dXBUaW1lID0gdGltZXIoKVxuXG4gICAgY3R4LmxvZ2dlci5kZWJ1ZyhgJHtQTFVHSU59IGluaXRpYWxpemVkYClcblxuICAgIGNvbnN0IG5ldGxpZnlDb25maWdGaWxlcGF0aCA9IHBhdGguam9pbihjdHguY3dkLCAnbmV0bGlmeS50b21sJylcblxuICAgIGlmICghZnMuZXhpc3RzU3luYyhuZXRsaWZ5Q29uZmlnRmlsZXBhdGgpKSB7XG4gICAgICBjdHgubG9nZ2VyLmRlYnVnKGAke1BMVUdJTn0gTmV0bGlmeSBjb25maWcgbm90IGZvdW5kLCBpbml0aWFsaXppbmcgZGVmYXVsdHNgKVxuXG4gICAgICBjb25zdCByZWxhdGl2ZVB1Ymxpc2hEaXIgPSBwYXRoLnJlbGF0aXZlKGN0eC5jd2QsIGN0eC5nZXRTdGF0aWNPdXRwdXREaXIoKSlcbiAgICAgIGNvbnN0IHJlbGF0aXZlRnVuY3Rpb25zRGlyID0gcGF0aC5yZWxhdGl2ZShjdHguY3dkLCBjdHguZ2V0RnVuY3Rpb25zT3V0cHV0RGlyKCkpXG5cbiAgICAgIGZzLndyaXRlRmlsZVN5bmMoXG4gICAgICAgIG5ldGxpZnlDb25maWdGaWxlcGF0aCxcbiAgICAgICAgYFtidWlsZF1cXG5cXHRjb21tYW5kID0gJ25wbSBydW4gYnVpbGQnXFxuXFx0cHVibGlzaCA9ICcke3JlbGF0aXZlUHVibGlzaERpcn0nXFxuXFx0ZnVuY3Rpb25zID0gJyR7cmVsYXRpdmVGdW5jdGlvbnNEaXJ9J2AsXG4gICAgICAgICd1dGY4J1xuICAgICAgKVxuICAgIH0gZWxzZSB7XG4gICAgICBjdHgubG9nZ2VyLmRlYnVnKGAke1BMVUdJTn0gTmV0bGlmeSBjb25maWcgZm91bmRgKVxuICAgIH1cblxuICAgIGNvbnN0IG5ldGxpZnlDb25maWcgPSB2YWxpZGF0ZUFuZE5vcm1hbGl6ZU5ldGxpZnlDb25maWcoZ2V0TmV0bGlmeUNvbmZpZyhuZXRsaWZ5Q29uZmlnRmlsZXBhdGgpKVxuXG4gICAgY3R4LmxvZ2dlci5pbmZvKGAke1BMVUdJTn0gaW5pdGlhbGl6ZWRgLCB7IGR1cmF0aW9uOiBzdGFydHVwVGltZSgpIH0pXG5cbiAgICBpZiAoY3R4Lm1vZGUgPT09IE1vZGUuRGV2KSB7XG4gICAgICBjb25zdCB3YXRjaGVyID0gZmlsZXdhdGNoZXIoKVxuICAgICAgd2F0Y2hlci5hZGQobmV0bGlmeUNvbmZpZ0ZpbGVwYXRoKVxuICAgICAgd2F0Y2hlci5vbignY2hhbmdlJywgKCkgPT4ge1xuICAgICAgICBjdHgubG9nZ2VyLmRlYnVnKGAke1BMVUdJTn0gTmV0bGlmeSBjb25maWcgY2hhbmdlZCwgcmVxdWVzdGluZyBkZXYgc2VydmVyIHJlc3RhcnRgKVxuICAgICAgICBjdHgucmVzdGFydERldlNlcnZlcigpXG4gICAgICB9KVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBuYW1lOiBQTFVHSU4sXG4gICAgICAgIGNsZWFudXAoKSB7XG4gICAgICAgICAgd2F0Y2hlci5yZW1vdmVBbGwoKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGN0eC5ldmVudHMub24oJ2J1aWxkQ29tcGxldGUnLCAoKSA9PiB7XG4gICAgICAgIGN0eC5sb2dnZXIuZGVidWcoYCR7UExVR0lOfSByZWNlaXZlZCBldmVudCBidWlsZENvbXBsZXRlYClcblxuICAgICAgICAvKiBjOCBpZ25vcmUgbmV4dCAqL1xuICAgICAgICBvblBvc3RCdWlsZChuZXRsaWZ5Q29uZmlnLCBjdHgpXG4gICAgICB9KVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBuYW1lOiBQTFVHSU4sXG4gICAgICB9XG4gICAgfVxuICB9XG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIm1sQkFBQSw4UkFBbUIscUJBQ25CLEVBQWUsdUJBQ2YsRUFBaUIsbUJBQ2pCLEVBQThCLG1CQUU5QixFQUFtQyxzQ0FFbkMsRUFBd0IsMEJBQ3hCLEVBQTRELHFCQUM1RCxFQUFzQixnNEJBc0J0QixHQUFNLEdBQVMsR0FBRyxFQUFJLFFBQVEsRUFBSSxVQUUzQixXQUEwQixFQUE0RCxDQUMzRixHQUFNLEdBQU0sVUFBRyxhQUFhLEVBQWdCLFFBQ3RDLEVBQU8sWUFBSyxHQUNsQixNQUFPLE1BQUssTUFBTSxLQUFLLFVBQVUsSUFHNUIsV0FBMkMsRUFBZ0QsQ0FDaEcsY0FBTyxDQUFDLENBQUMsRUFBUSw2Q0FDakIsY0FBTyxDQUFDLENBQUMsRUFBTyxNQUFPLCtDQUV2QixHQUFNLEdBQVUsRUFBZSxRQUFRLE1BQU8sRUFBTyxNQUFNLFNBRTNELGNBQU8sQ0FBQyxDQUFDLEVBQVMsdURBRWxCLEdBQU0sR0FBWSxFQUFlLFFBQVEsTUFBTyxFQUFPLE1BQU0sV0FFN0QsTUFBTyxDQUNMLE1BQU8sQ0FDTCxVQUNBLGNBS0MsV0FBd0IsRUFBYSxFQUFlLENBQ3pELE1BQU8sR0FBTyxVQUFLLEtBQUssRUFBSyxHQUFRLE9BR2hDLFlBQXdCLEVBQWEsRUFBa0IsQ0FDNUQsTUFBTyxXQUFLLFNBQVMsRUFBSyxHQUdyQixXQUErQixFQUFlLENBQ25ELFNBQVEsRUFBTSxRQUFRLE1BQU8sTUFDN0IsRUFBUSxFQUFNLFFBQVEsUUFBUyxLQUN4QixFQUdGLFdBQXdDLEVBQWlELENBQzlGLE1BQU8sUUFBTyxPQUFPLEdBQU8sSUFBSSxBQUFDLEdBQVUsRUFDekMsS0FBTSxFQUFzQixFQUFL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