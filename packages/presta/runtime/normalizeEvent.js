var c=Object.create;var i=Object.defineProperty;var y=Object.getOwnPropertyDescriptor;var d=Object.getOwnPropertyNames;var P=Object.getPrototypeOf,g=Object.prototype.hasOwnProperty;var m=r=>i(r,"__esModule",{value:!0});var h=(r,a)=>{m(r);for(var t in a)i(r,t,{get:a[t],enumerable:!0})},f=(r,a,t)=>{if(a&&typeof a=="object"||typeof a=="function")for(let e of d(a))!g.call(r,e)&&e!=="default"&&i(r,e,{get:()=>a[e],enumerable:!(t=y(a,e))||t.enumerable});return r},E=r=>f(m(i(r!=null?c(P(r)):{},"default",r&&r.__esModule&&"default"in r?{get:()=>r.default,enumerable:!0}:{value:r,enumerable:!0})),r);h(exports,{normalizeEvent:()=>Q});var p=E(require("query-string"));function n(r){let a=(0,p.parse)(r,{arrayFormat:"comma"}),t={},e={};for(let s of Object.keys(a)){let o=a[s];Array.isArray(o)?e[s]=o:o&&(t[s]=o)}return{queryStringParameters:t,multiValueQueryStringParameters:e}}var S=/image|audio|video|application\/pdf|application\/zip|applicaton\/octet-stream/i;function l(r){return Boolean(r)&&S.test(r)}function Q(r){var o,u;let a=r.rawQuery||r.path.split("?")[1],{queryStringParameters:t,multiValueQueryStringParameters:e}=n(a),s=(u=r.isBase64Encoded)!=null?u:l(((o=r==null?void 0:r.headers)==null?void 0:o["content-type"])||"");return{rawUrl:r.rawUrl||r.path,rawQuery:a,path:r.path,httpMethod:r.httpMethod||"GET",headers:r.headers||{},multiValueHeaders:r.multiValueHeaders||{},queryStringParameters:r.queryStringParameters||t,multiValueQueryStringParameters:r.multiValueQueryStringParameters||e,pathParameters:r.pathParameters||{},body:r.body||null,isBase64Encoded:s!=null?s:!1,requestContext:r.requestContext||{},resource:r.resource||""}}0&&(module.exports={normalizeEvent});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vbGliL3J1bnRpbWUvbm9ybWFsaXplRXZlbnQudHMiLCAiLi4vbGliL3J1bnRpbWUvcGFyc2VRdWVyeVN0cmluZ1BhcmFtZXRlcnMudHMiLCAiLi4vbGliL3J1bnRpbWUvaXNCYXNlNjRFbmNvZGVkQ29udGVudFR5cGUudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImltcG9ydCB7IHBhcnNlUXVlcnlTdHJpbmdQYXJhbWV0ZXJzIH0gZnJvbSAnLi9wYXJzZVF1ZXJ5U3RyaW5nUGFyYW1ldGVycydcbmltcG9ydCB7IGlzQmFzZTY0RW5jb2RlZENvbnRlbnRUeXBlIH0gZnJvbSAnLi9pc0Jhc2U2NEVuY29kZWRDb250ZW50VHlwZSdcbmltcG9ydCB7IEV2ZW50IH0gZnJvbSAnLi4vJ1xuXG4vKipcbiAqIFRha2VzIGEgYFBhcnRpYWw8RXZlbnQ+YCBhbmQgcmV0dXJucyBgRXZlbnRgLiBSZXF1aXJlcyBhdCBsZWFzdCBhbiBgZXZlbnQucGF0aGAgcHJvcGVydHkuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemVFdmVudChldmVudDogUGljazxFdmVudCwgJ3BhdGgnPiAmIFBhcnRpYWw8T21pdDxFdmVudCwgJ3BhdGgnPj4pOiBFdmVudCB7XG4gIGNvbnN0IHJhd1F1ZXJ5ID0gZXZlbnQucmF3UXVlcnkgfHwgZXZlbnQucGF0aC5zcGxpdCgnPycpWzFdXG4gIGNvbnN0IHsgcXVlcnlTdHJpbmdQYXJhbWV0ZXJzLCBtdWx0aVZhbHVlUXVlcnlTdHJpbmdQYXJhbWV0ZXJzIH0gPSBwYXJzZVF1ZXJ5U3RyaW5nUGFyYW1ldGVycyhyYXdRdWVyeSlcbiAgY29uc3QgaXNCYXNlNjRFbmNvZGVkID0gZXZlbnQuaXNCYXNlNjRFbmNvZGVkID8/IGlzQmFzZTY0RW5jb2RlZENvbnRlbnRUeXBlKGV2ZW50Py5oZWFkZXJzPy5bJ2NvbnRlbnQtdHlwZSddIHx8ICcnKVxuXG4gIHJldHVybiB7XG4gICAgcmF3VXJsOiBldmVudC5yYXdVcmwgfHwgZXZlbnQucGF0aCxcbiAgICByYXdRdWVyeSxcbiAgICBwYXRoOiBldmVudC5wYXRoLFxuICAgIGh0dHBNZXRob2Q6IGV2ZW50Lmh0dHBNZXRob2QgfHwgJ0dFVCcsXG4gICAgaGVhZGVyczogZXZlbnQuaGVhZGVycyB8fCB7fSxcbiAgICBtdWx0aVZhbHVlSGVhZGVyczogZXZlbnQubXVsdGlWYWx1ZUhlYWRlcnMgfHwge30sXG4gICAgcXVlcnlTdHJpbmdQYXJhbWV0ZXJzOiBldmVudC5xdWVyeVN0cmluZ1BhcmFtZXRlcnMgfHwgcXVlcnlTdHJpbmdQYXJhbWV0ZXJzLFxuICAgIG11bHRpVmFsdWVRdWVyeVN0cmluZ1BhcmFtZXRlcnM6IGV2ZW50Lm11bHRpVmFsdWVRdWVyeVN0cmluZ1BhcmFtZXRlcnMgfHwgbXVsdGlWYWx1ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVycyxcbiAgICBwYXRoUGFyYW1ldGVyczogZXZlbnQucGF0aFBhcmFtZXRlcnMgfHwge30sXG4gICAgYm9keTogZXZlbnQuYm9keSB8fCBudWxsLFxuICAgIGlzQmFzZTY0RW5jb2RlZDogaXNCYXNlNjRFbmNvZGVkID8/IGZhbHNlLFxuICAgIHJlcXVlc3RDb250ZXh0OiBldmVudC5yZXF1ZXN0Q29udGV4dCB8fCB7fSxcbiAgICByZXNvdXJjZTogZXZlbnQucmVzb3VyY2UgfHwgJycsXG4gIH1cbn1cbiIsICJpbXBvcnQgeyBwYXJzZSBhcyBwYXJzZVF1ZXJ5IH0gZnJvbSAncXVlcnktc3RyaW5nJ1xuaW1wb3J0IHsgUGFyYW1zLCBNdWx0aVZhbHVlUGFyYW1zIH0gZnJvbSAnbGFtYmRhLXR5cGVzJ1xuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VRdWVyeVN0cmluZ1BhcmFtZXRlcnMocXVlcnk6IHN0cmluZykge1xuICBjb25zdCBwYXJhbXMgPSBwYXJzZVF1ZXJ5KHF1ZXJ5LCB7IGFycmF5Rm9ybWF0OiAnY29tbWEnIH0pXG5cbiAgY29uc3QgcXVlcnlTdHJpbmdQYXJhbWV0ZXJzOiBQYXJhbXMgPSB7fVxuICBjb25zdCBtdWx0aVZhbHVlUXVlcnlTdHJpbmdQYXJhbWV0ZXJzOiBNdWx0aVZhbHVlUGFyYW1zID0ge31cblxuICBmb3IgKGNvbnN0IHBhcmFtIG9mIE9iamVjdC5rZXlzKHBhcmFtcykpIHtcbiAgICBjb25zdCB2YWx1ZSA9IHBhcmFtc1twYXJhbV1cbiAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgIG11bHRpVmFsdWVRdWVyeVN0cmluZ1BhcmFtZXRlcnNbcGFyYW1dID0gdmFsdWVcbiAgICB9IGVsc2UgaWYgKHZhbHVlKSB7XG4gICAgICBxdWVyeVN0cmluZ1BhcmFtZXRlcnNbcGFyYW1dID0gdmFsdWVcbiAgICB9XG4gIH1cblxuICByZXR1cm4geyBxdWVyeVN0cmluZ1BhcmFtZXRlcnMsIG11bHRpVmFsdWVRdWVyeVN0cmluZ1BhcmFtZXRlcnMgfVxufVxuIiwgIi8vIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL25ldGxpZnkvY2xpL2Jsb2IvMjdiYjdiOWIzMGQ0NjVhYmU4NmY4N2Y0Mjc0ZGQ3YTcxYjFiMDAzYi9zcmMvdXRpbHMvc2VydmUtZnVuY3Rpb25zLmpzI0wxNjdcbmNvbnN0IEJBU0VfNjRfTUlNRV9SRUdFWFAgPSAvaW1hZ2V8YXVkaW98dmlkZW98YXBwbGljYXRpb25cXC9wZGZ8YXBwbGljYXRpb25cXC96aXB8YXBwbGljYXRvblxcL29jdGV0LXN0cmVhbS9pXG5cbmV4cG9ydCBmdW5jdGlvbiBpc0Jhc2U2NEVuY29kZWRDb250ZW50VHlwZShjb250ZW50VHlwZTogc3RyaW5nKSB7XG4gIHJldHVybiBCb29sZWFuKGNvbnRlbnRUeXBlKSAmJiBCQVNFXzY0X01JTUVfUkVHRVhQLnRlc3QoY29udGVudFR5cGUpXG59XG4iXSwKICAibWFwcGluZ3MiOiAibWxCQUFBLGtDQ0FBLE1BQW9DLDJCQUc3QixXQUFvQyxFQUFlLENBQ3hELEdBQU0sR0FBUyxZQUFXLEVBQU8sQ0FBRSxZQUFhLFVBRTFDLEVBQWdDLEdBQ2hDLEVBQW9ELEdBRTFELE9BQVcsS0FBUyxRQUFPLEtBQUssR0FBUyxDQUN2QyxHQUFNLEdBQVEsRUFBTyxHQUNyQixBQUFJLE1BQU0sUUFBUSxHQUNoQixFQUFnQyxHQUFTLEVBQ2hDLEdBQ1QsR0FBc0IsR0FBUyxHQUluQyxNQUFPLENBQUUsd0JBQXVCLG1DQ2pCbEMsR0FBTSxHQUFzQixnRkFFckIsV0FBb0MsRUFBcUIsQ0FDOUQsTUFBTyxTQUFRLElBQWdCLEVBQW9CLEtBQUssR0ZHbkQsV0FBd0IsRUFBa0UsQ0FQakcsUUFRRSxHQUFNLEdBQVcsRUFBTSxVQUFZLEVBQU0sS0FBSyxNQUFNLEtBQUssR0FDbkQsQ0FBRSx3QkFBdUIsbUNBQW9DLEVBQTJCLEdBQ3hGLEVBQWtCLEtBQU0sa0JBQU4sT0FBeUIsRUFBMkIscUJBQU8sVUFBUCxjQUFpQixrQkFBbUIsSUFFaEgsTUFBTyxDQUNMLE9BQVEsRUFBTSxRQUFVLEVBQU0sS0FDOUIsV0FDQSxLQUFNLEVBQU0sS0FDWixXQUFZLEVBQU0sWUFBYyxNQUNoQyxRQUFTLEVBQU0sU0FBVyxHQUMxQixrQkFBbUIsRUFBTSxtQkFBcUIsR0FDOUMsc0JBQXVCLEVBQU0sdUJBQXlCLEVBQ3RELGdDQUFpQyxFQUFNLGlDQUFtQyxFQUMxRSxlQUFnQixFQUFNLGdCQUFrQixHQUN4QyxLQUFNLEVBQU0sTUFBUSxLQUNwQixnQkFBaUIsVUFBbUIsR0FDcEMsZUFBZ0IsRUFBTSxnQkFBa0IsR0FDeEMsU0FBVSxFQUFNLFVBQVkiLAogICJuYW1lcyI6IFtdCn0K