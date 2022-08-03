"use strict";var g=Object.create;var n=Object.defineProperty;var q=Object.getOwnPropertyDescriptor;var w=Object.getOwnPropertyNames;var x=Object.getPrototypeOf,C=Object.prototype.hasOwnProperty;var H=(t,o)=>{for(var e in o)n(t,e,{get:o[e],enumerable:!0})},i=(t,o,e,s)=>{if(o&&typeof o=="object"||typeof o=="function")for(let r of w(o))!C.call(t,r)&&r!==e&&n(t,r,{get:()=>o[r],enumerable:!(s=q(o,r))||s.enumerable});return t};var a=(t,o,e)=>(e=t!=null?g(x(t)):{},i(o||!t||!t.__esModule?n(e,"default",{value:t,enumerable:!0}):e,t)),_=t=>i(n({},"__esModule",{value:!0}),t);var j={};H(j,{adapter:()=>b});module.exports=_(j);var p=a(require("path")),l=a(require("polka")),m=a(require("sirv")),f=require("presta/utils/requestToEvent"),c=require("presta/runtime/sendServerlessResponse");function b(t,o){let e=(0,m.default)(p.default.resolve(__dirname,t.staticOutputDir)),s=(0,l.default)().use(e);for(let r of Object.values(t.manifest.functions))s.all(r.route,async(u,d)=>{let v=await(0,f.requestToEvent)(u),{handler:h}=require(r.dest),O=await h(v,{});(0,c.sendServerlessResponse)(d,O)});s.listen(o.port,()=>{console.log(`presta server running on http://localhost:${o.port}`)})}0&&(module.exports={adapter});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vbGliL3J1bnRpbWUudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8qKlxuICogVEhJUyBJUyBQUk9EIENPREUsIEJFIENBUkVGVUwgV0hBVCBZT1UgQUREIFRPIFRISVMgRklMRVxuICovXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IHBvbGthIGZyb20gJ3BvbGthJ1xuaW1wb3J0IHNpcnYgZnJvbSAnc2lydidcbmltcG9ydCB7IEhhbmRsZXIgfSBmcm9tICdwcmVzdGEnXG5pbXBvcnQgeyByZXF1ZXN0VG9FdmVudCB9IGZyb20gJ3ByZXN0YS91dGlscy9yZXF1ZXN0VG9FdmVudCdcbmltcG9ydCB7IHNlbmRTZXJ2ZXJsZXNzUmVzcG9uc2UgfSBmcm9tICdwcmVzdGEvcnVudGltZS9zZW5kU2VydmVybGVzc1Jlc3BvbnNlJ1xuXG5pbXBvcnQgeyBPcHRpb25zLCBDb250ZXh0IH0gZnJvbSAnLi90eXBlcydcblxuZXhwb3J0IGZ1bmN0aW9uIGFkYXB0ZXIoY29udGV4dDogQ29udGV4dCwgb3B0aW9uczogT3B0aW9ucykge1xuICBjb25zdCBhc3NldHMgPSBzaXJ2KHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIGNvbnRleHQuc3RhdGljT3V0cHV0RGlyKSlcbiAgY29uc3QgYXBwID0gcG9sa2EoKS51c2UoYXNzZXRzKVxuXG4gIGZvciAoY29uc3QgZmlsZSBvZiBPYmplY3QudmFsdWVzKGNvbnRleHQubWFuaWZlc3QuZnVuY3Rpb25zKSkge1xuICAgIGFwcC5hbGwoZmlsZS5yb3V0ZSwgYXN5bmMgKHJlcSwgcmVzKSA9PiB7XG4gICAgICBjb25zdCBldmVudCA9IGF3YWl0IHJlcXVlc3RUb0V2ZW50KHJlcSlcbiAgICAgIGNvbnN0IHsgaGFuZGxlciB9ID0gcmVxdWlyZShmaWxlLmRlc3QpIGFzIHsgaGFuZGxlcjogSGFuZGxlciB9XG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGhhbmRsZXIoZXZlbnQsIHt9KVxuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgc2VuZFNlcnZlcmxlc3NSZXNwb25zZShyZXMsIHJlc3BvbnNlKVxuICAgIH0pXG4gIH1cblxuICBhcHAubGlzdGVuKG9wdGlvbnMucG9ydCwgKCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKGBwcmVzdGEgc2VydmVyIHJ1bm5pbmcgb24gaHR0cDovL2xvY2FsaG9zdDoke29wdGlvbnMucG9ydH1gKVxuICB9KVxufVxuIl0sCiAgIm1hcHBpbmdzIjogIjBqQkFBQSxJQUFBQSxFQUFBLEdBQUFDLEVBQUFELEVBQUEsYUFBQUUsSUFBQSxlQUFBQyxFQUFBSCxHQUdBLElBQUFJLEVBQWlCLG1CQUNqQkMsRUFBa0Isb0JBQ2xCQyxFQUFpQixtQkFFakJDLEVBQStCLHVDQUMvQkMsRUFBdUMsaURBSWhDLFNBQVNOLEVBQVFPLEVBQWtCQyxFQUFrQixDQUMxRCxJQUFNQyxLQUFTLEVBQUFDLFNBQUssRUFBQUMsUUFBSyxRQUFRLFVBQVdKLEVBQVEsZUFBZSxDQUFDLEVBQzlESyxLQUFNLEVBQUFDLFNBQU0sRUFBRSxJQUFJSixDQUFNLEVBRTlCLFFBQVdLLEtBQVEsT0FBTyxPQUFPUCxFQUFRLFNBQVMsU0FBUyxFQUN6REssRUFBSSxJQUFJRSxFQUFLLE1BQU8sTUFBT0MsRUFBS0MsSUFBUSxDQUN0QyxJQUFNQyxFQUFRLFFBQU0sa0JBQWVGLENBQUcsRUFDaEMsQ0FBRSxRQUFBRyxDQUFRLEVBQUksUUFBUUosRUFBSyxNQUUzQkssRUFBVyxNQUFNRCxFQUFRRCxFQUFPLENBQUMsQ0FBQyxLQUV4QywwQkFBdUJELEVBQUtHLENBQVEsQ0FDdEMsQ0FBQyxFQUdIUCxFQUFJLE9BQU9KLEVBQVEsS0FBTSxJQUFNLENBQzdCLFFBQVEsSUFBSSw2Q0FBNkNBLEVBQVEsTUFBTSxDQUN6RSxDQUFDLENBQ0giLAogICJuYW1lcyI6IFsicnVudGltZV9leHBvcnRzIiwgIl9fZXhwb3J0IiwgImFkYXB0ZXIiLCAiX190b0NvbW1vbkpTIiwgImltcG9ydF9wYXRoIiwgImltcG9ydF9wb2xrYSIsICJpbXBvcnRfc2lydiIsICJpbXBvcnRfcmVxdWVzdFRvRXZlbnQiLCAiaW1wb3J0X3NlbmRTZXJ2ZXJsZXNzUmVzcG9uc2UiLCAiY29udGV4dCIsICJvcHRpb25zIiwgImFzc2V0cyIsICJzaXJ2IiwgInBhdGgiLCAiYXBwIiwgInBvbGthIiwgImZpbGUiLCAicmVxIiwgInJlcyIsICJldmVudCIsICJoYW5kbGVyIiwgInJlc3BvbnNlIl0KfQo=
