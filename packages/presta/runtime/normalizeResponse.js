var s=Object.defineProperty,c=Object.defineProperties;var f=Object.getOwnPropertyDescriptors;var d=Object.getOwnPropertySymbols;var p=Object.prototype.hasOwnProperty,R=Object.prototype.propertyIsEnumerable;var l=(e,t,a)=>t in e?s(e,t,{enumerable:!0,configurable:!0,writable:!0,value:a}):e[t]=a,r=(e,t)=>{for(var a in t||(t={}))p.call(t,a)&&l(e,a,t[a]);if(d)for(var a of d(t))R.call(t,a)&&l(e,a,t[a]);return e},i=(e,t)=>c(e,f(t)),b=e=>s(e,"__esModule",{value:!0});var y=(e,t)=>{b(e);for(var a in t)s(e,a,{get:t[a],enumerable:!0})};y(exports,{normalizeResponse:()=>L});function m(e){for(let t of Object.keys(e))e[t.toLowerCase()]=e[t]||"";return e}var n;(function(o){o.Html="text/html; charset=utf-8",o.Json="application/json; charset=utf-8",o.Xml="application/xml; charset=utf-8"})(n||(n={}));function h(e){return typeof e=="object"?JSON.stringify(e):e}function x(e,t){let a=t.statusCode||200,o=t.headers?m(t.headers):{};return a>299&&a<399||(o["content-type"]=e),{isBase64Encoded:t.isBase64Encoded||!1,statusCode:a,headers:o,multiValueHeaders:t.multiValueHeaders?m(t.multiValueHeaders):{},body:h(t.body||"")}}function u(e){return x(n.Html,e)}function L(e){return typeof e=="string"?u({body:e}):i(r({},e),{statusCode:e.statusCode||200})}0&&(module.exports={normalizeResponse});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vbGliL3J1bnRpbWUvbm9ybWFsaXplUmVzcG9uc2UudHMiLCAiLi4vbGliL3J1bnRpbWUvbm9ybWFsaXplUmVzcG9uc2VIZWFkZXJzLnRzIiwgIi4uL2xpYi9zZXJpYWxpemUudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImltcG9ydCB7IFJlc3BvbnNlIGFzIExhbWJkYVJlc3BvbnNlIH0gZnJvbSAnbGFtYmRhLXR5cGVzJ1xuXG5pbXBvcnQgeyBodG1sIH0gZnJvbSAnLi4vc2VyaWFsaXplJ1xuaW1wb3J0IHR5cGUgeyBSZXNwb25zZSB9IGZyb20gJy4uL2NvcmUnXG5cbmV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemVSZXNwb25zZShyZXNwb25zZTogUmVzcG9uc2UgfCBzdHJpbmcpOiBMYW1iZGFSZXNwb25zZSB7XG4gIHJldHVybiB0eXBlb2YgcmVzcG9uc2UgPT09ICdzdHJpbmcnXG4gICAgPyBodG1sKHsgYm9keTogcmVzcG9uc2UgfSlcbiAgICA6IHtcbiAgICAgICAgLi4ucmVzcG9uc2UsXG4gICAgICAgIHN0YXR1c0NvZGU6IHJlc3BvbnNlLnN0YXR1c0NvZGUgfHwgMjAwLFxuICAgICAgfVxufVxuIiwgImltcG9ydCB7IFBhcmFtcyB9IGZyb20gJ2xhbWJkYS10eXBlcydcblxuZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGl6ZVJlc3BvbnNlSGVhZGVyczxUID0gUGFyYW1zPihyZXNwb25zZUhlYWRlcnM6IFQpOiBUIHtcbiAgZm9yIChjb25zdCBoZWFkZXIgb2YgT2JqZWN0LmtleXMocmVzcG9uc2VIZWFkZXJzKSkge1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICByZXNwb25zZUhlYWRlcnNbaGVhZGVyLnRvTG93ZXJDYXNlKCldID0gcmVzcG9uc2VIZWFkZXJzW2hlYWRlcl0gfHwgJydcbiAgfVxuXG4gIHJldHVybiByZXNwb25zZUhlYWRlcnNcbn1cbiIsICIvKipcbiAqIFRoaXMgaXMgcHJvZHVjdGlvbiBjb2RlLCBzbyBiZSBjYXJlZnVsIHdoYXQgeW91IGFkZCB0byB0aGlzIGZpbGUgYmVjYXVzZSB3ZVxuICogd2FudCB0byBrZWVwIGl0IHNtYWxsLlxuICpcbiAqIFRoaXMgZmlsZSBpcyB1c2VkIGluIGNvbXBpbGVkIFByZXN0YSBmdW5jdGlvbnMgdG8gc2VyaWFsaXplIG91dHB1dC5cbiAqL1xuaW1wb3J0IHsgUmVzcG9uc2UgYXMgTGFtYmRhUmVzcG9uc2UgfSBmcm9tICdsYW1iZGEtdHlwZXMnXG5pbXBvcnQgeyBub3JtYWxpemVSZXNwb25zZUhlYWRlcnMgfSBmcm9tICcuL3J1bnRpbWUvbm9ybWFsaXplUmVzcG9uc2VIZWFkZXJzJ1xuXG5pbXBvcnQgeyBSZXNwb25zZSB9IGZyb20gJy4vY29yZSdcblxuZW51bSBDb250ZW50VHlwZSB7XG4gIEh0bWwgPSAndGV4dC9odG1sOyBjaGFyc2V0PXV0Zi04JyxcbiAgSnNvbiA9ICdhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04JyxcbiAgWG1sID0gJ2FwcGxpY2F0aW9uL3htbDsgY2hhcnNldD11dGYtOCcsXG59XG5cbmZ1bmN0aW9uIHN0cmluZ2lmeU9iamVjdChvYmo6IG9iamVjdCB8IHN0cmluZykge1xuICByZXR1cm4gdHlwZW9mIG9iaiA9PT0gJ29iamVjdCcgPyBKU09OLnN0cmluZ2lmeShvYmopIDogb2JqXG59XG5cbmZ1bmN0aW9uIGJhc2UoY29udGVudFR5cGU6IENvbnRlbnRUeXBlLCByZXNwb25zZTogUGFydGlhbDxSZXNwb25zZT4pOiBMYW1iZGFSZXNwb25zZSB7XG4gIGNvbnN0IHN0YXR1c0NvZGUgPSByZXNwb25zZS5zdGF0dXNDb2RlIHx8IDIwMFxuICBjb25zdCBub3JtYWxpemVkSGVhZGVycyA9IHJlc3BvbnNlLmhlYWRlcnMgPyBub3JtYWxpemVSZXNwb25zZUhlYWRlcnMocmVzcG9uc2UuaGVhZGVycykgOiB7fVxuICBjb25zdCByZWRpciA9IHN0YXR1c0NvZGUgPiAyOTkgJiYgc3RhdHVzQ29kZSA8IDM5OVxuXG4gIGlmICghcmVkaXIpIHtcbiAgICBub3JtYWxpemVkSGVhZGVyc1snY29udGVudC10eXBlJ10gPSBjb250ZW50VHlwZVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBpc0Jhc2U2NEVuY29kZWQ6IHJlc3BvbnNlLmlzQmFzZTY0RW5jb2RlZCB8fCBmYWxzZSxcbiAgICBzdGF0dXNDb2RlLFxuICAgIGhlYWRlcnM6IG5vcm1hbGl6ZWRIZWFkZXJzLFxuICAgIG11bHRpVmFsdWVIZWFkZXJzOiByZXNwb25zZS5tdWx0aVZhbHVlSGVhZGVycyA/IG5vcm1hbGl6ZVJlc3BvbnNlSGVhZGVycyhyZXNwb25zZS5tdWx0aVZhbHVlSGVhZGVycykgOiB7fSxcbiAgICBib2R5OiBzdHJpbmdpZnlPYmplY3QocmVzcG9uc2UuYm9keSB8fCAnJyksXG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGh0bWwocmVzcG9uc2U6IFBhcnRpYWw8UmVzcG9uc2U+KTogTGFtYmRhUmVzcG9uc2Uge1xuICByZXR1cm4gYmFzZShDb250ZW50VHlwZS5IdG1sLCByZXNwb25zZSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGpzb24ocmVzcG9uc2U6IE9taXQ8UGFydGlhbDxSZXNwb25zZT4sICdib2R5Jz4gJiB7IGJvZHk6IFJlY29yZDxzdHJpbmcsIHVua25vd24+IH0pOiBMYW1iZGFSZXNwb25zZSB7XG4gIHJldHVybiBiYXNlKENvbnRlbnRUeXBlLkpzb24sIHsgLi4ucmVzcG9uc2UsIGJvZHk6IHN0cmluZ2lmeU9iamVjdChyZXNwb25zZS5ib2R5KSB9KVxufVxuXG5leHBvcnQgZnVuY3Rpb24geG1sKHJlc3BvbnNlOiBQYXJ0aWFsPFJlc3BvbnNlPik6IExhbWJkYVJlc3BvbnNlIHtcbiAgcmV0dXJuIGJhc2UoQ29udGVudFR5cGUuWG1sLCByZXNwb25zZSlcbn1cbiJdLAogICJtYXBwaW5ncyI6ICJraEJBQUEscUNDRU8sV0FBOEMsRUFBdUIsQ0FDMUUsT0FBVyxLQUFVLFFBQU8sS0FBSyxHQUUvQixFQUFnQixFQUFPLGVBQWlCLEVBQWdCLElBQVcsR0FHckUsTUFBTyxHQ0dULEdBQUssR0FBTCxVQUFLLEVBQUwsQ0FDRSxPQUFPLDJCQUNQLE9BQU8sa0NBQ1AsTUFBTSxtQ0FISCxXQU1MLFdBQXlCLEVBQXNCLENBQzdDLE1BQU8sT0FBTyxJQUFRLFNBQVcsS0FBSyxVQUFVLEdBQU8sRUFHekQsV0FBYyxFQUEwQixFQUE2QyxDQUNuRixHQUFNLEdBQWEsRUFBUyxZQUFjLElBQ3BDLEVBQW9CLEVBQVMsUUFBVSxFQUF5QixFQUFTLFNBQVcsR0FHMUYsTUFBSyxBQUZTLEdBQWEsS0FBTyxFQUFhLEtBRzdDLEdBQWtCLGdCQUFrQixHQUcvQixDQUNMLGdCQUFpQixFQUFTLGlCQUFtQixHQUM3QyxhQUNBLFFBQVMsRUFDVCxrQkFBbUIsRUFBUyxrQkFBb0IsRUFBeUIsRUFBUyxtQkFBcUIsR0FDdkcsS0FBTSxFQUFnQixFQUFTLE1BQVEsS0FJcEMsV0FBYyxFQUE2QyxDQUNoRSxNQUFPLEdBQUssRUFBWSxLQUFNLEdGbkN6QixXQUEyQixFQUE2QyxDQUM3RSxNQUFPLE9BQU8sSUFBYSxTQUN2QixFQUFLLENBQUUsS0FBTSxJQUNiLE9BQ0ssR0FETCxDQUVFLFdBQVksRUFBUyxZQUFjIiwKICAibmFtZXMiOiBbXQp9Cg==