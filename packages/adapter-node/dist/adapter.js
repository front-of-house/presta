"use strict";var g=Object.create;var n=Object.defineProperty;var k=Object.getOwnPropertyDescriptor;var F=Object.getOwnPropertyNames;var O=Object.getPrototypeOf,q=Object.prototype.hasOwnProperty;var w=(o,t)=>{for(var e in t)n(o,e,{get:t[e],enumerable:!0})},l=(o,t,e,s)=>{if(t&&typeof t=="object"||typeof t=="function")for(let r of F(t))!q.call(o,r)&&r!==e&&n(o,r,{get:()=>t[r],enumerable:!(s=k(t,r))||s.enumerable});return o};var a=(o,t,e)=>(e=o!=null?g(O(o)):{},l(t||!o||!o.__esModule?n(e,"default",{value:o,enumerable:!0}):e,o)),B=o=>l(n({},"__esModule",{value:!0}),o);var x={};w(x,{adapter:()=>_});module.exports=B(x);var m=a(require("path")),p=a(require("polka")),c=a(require("sirv")),f=require("@presta/utils/requestToEvent"),d=require("@presta/utils/sendServerlessResponse"),u=require("presta");function _(o,t){let e=(0,c.default)(m.default.resolve(__dirname,o.staticOutput)),s=(0,p.default)().use(e),r=(0,u.getDynamicFilesFromManifest)(o.manifest);for(let i of r)s.all(i.route,async(v,h)=>{let y=await(0,f.requestToEvent)(v),{handler:H}=require(i.dest),P=await H(y,{});(0,d.sendServerlessResponse)(h,P)});s.listen(t.port,()=>{console.log(`presta server running on http://localhost:${t.port}`)})}0&&(module.exports={adapter});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vbGliL2FkYXB0ZXIudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8qKlxuICogVEhJUyBJUyBQUk9EIENPREUsIEJFIENBUkVGVUwgV0hBVCBZT1UgQUREIFRPIFRISVMgRklMRVxuICovXG5cbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgcG9sa2EgZnJvbSAncG9sa2EnXG5pbXBvcnQgc2lydiBmcm9tICdzaXJ2J1xuaW1wb3J0IHsgSGFuZGxlciB9IGZyb20gJ2xhbWJkYS10eXBlcydcbmltcG9ydCB7IHJlcXVlc3RUb0V2ZW50IH0gZnJvbSAnQHByZXN0YS91dGlscy9yZXF1ZXN0VG9FdmVudCdcbmltcG9ydCB7IHNlbmRTZXJ2ZXJsZXNzUmVzcG9uc2UgfSBmcm9tICdAcHJlc3RhL3V0aWxzL3NlbmRTZXJ2ZXJsZXNzUmVzcG9uc2UnXG5pbXBvcnQgeyBIb29rUG9zdEJ1aWxkUGF5bG9hZCwgZ2V0RHluYW1pY0ZpbGVzRnJvbU1hbmlmZXN0IH0gZnJvbSAncHJlc3RhJ1xuXG5pbXBvcnQgeyBPcHRpb25zIH0gZnJvbSAnLi90eXBlcydcblxuZXhwb3J0IGZ1bmN0aW9uIGFkYXB0ZXIocHJvcHM6IEhvb2tQb3N0QnVpbGRQYXlsb2FkLCBvcHRpb25zOiBPcHRpb25zKSB7XG4gIGNvbnN0IGFzc2V0cyA9IHNpcnYocGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgcHJvcHMuc3RhdGljT3V0cHV0KSlcbiAgY29uc3QgYXBwID0gcG9sa2EoKS51c2UoYXNzZXRzKVxuICBjb25zdCBkeW5hbWljRmlsZXMgPSBnZXREeW5hbWljRmlsZXNGcm9tTWFuaWZlc3QocHJvcHMubWFuaWZlc3QpXG5cbiAgZm9yIChjb25zdCBmaWxlIG9mIGR5bmFtaWNGaWxlcykge1xuICAgIGFwcC5hbGwoZmlsZS5yb3V0ZSwgYXN5bmMgKHJlcSwgcmVzKSA9PiB7XG4gICAgICBjb25zdCBldmVudCA9IGF3YWl0IHJlcXVlc3RUb0V2ZW50KHJlcSlcbiAgICAgIGNvbnN0IHsgaGFuZGxlciB9ID0gcmVxdWlyZShmaWxlLmRlc3QpIGFzIHsgaGFuZGxlcjogSGFuZGxlciB9XG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGhhbmRsZXIoZXZlbnQsIHt9KVxuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgc2VuZFNlcnZlcmxlc3NSZXNwb25zZShyZXMsIHJlc3BvbnNlKVxuICAgIH0pXG4gIH1cblxuICBhcHAubGlzdGVuKG9wdGlvbnMucG9ydCwgKCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKGBwcmVzdGEgc2VydmVyIHJ1bm5pbmcgb24gaHR0cDovL2xvY2FsaG9zdDoke29wdGlvbnMucG9ydH1gKVxuICB9KVxufVxuIl0sCiAgIm1hcHBpbmdzIjogIjBqQkFBQSxJQUFBQSxFQUFBLEdBQUFDLEVBQUFELEVBQUEsYUFBQUUsSUFBQSxlQUFBQyxFQUFBSCxHQUlBLElBQUFJLEVBQWlCLG1CQUNqQkMsRUFBa0Isb0JBQ2xCQyxFQUFpQixtQkFFakJDLEVBQStCLHdDQUMvQkMsRUFBdUMsZ0RBQ3ZDQyxFQUFrRSxrQkFJM0QsU0FBU1AsRUFBUVEsRUFBNkJDLEVBQWtCLENBQ3JFLElBQU1DLEtBQVMsRUFBQUMsU0FBSyxFQUFBQyxRQUFLLFFBQVEsVUFBV0osRUFBTSxZQUFZLENBQUMsRUFDekRLLEtBQU0sRUFBQUMsU0FBTSxFQUFFLElBQUlKLENBQU0sRUFDeEJLLEtBQWUsK0JBQTRCUCxFQUFNLFFBQVEsRUFFL0QsUUFBV1EsS0FBUUQsRUFDakJGLEVBQUksSUFBSUcsRUFBSyxNQUFPLE1BQU9DLEVBQUtDLElBQVEsQ0FDdEMsSUFBTUMsRUFBUSxRQUFNLGtCQUFlRixDQUFHLEVBQ2hDLENBQUUsUUFBQUcsQ0FBUSxFQUFJLFFBQVFKLEVBQUssTUFFM0JLLEVBQVcsTUFBTUQsRUFBUUQsRUFBTyxDQUFDLENBQUMsS0FFeEMsMEJBQXVCRCxFQUFLRyxDQUFRLENBQ3RDLENBQUMsRUFHSFIsRUFBSSxPQUFPSixFQUFRLEtBQU0sSUFBTSxDQUM3QixRQUFRLElBQUksNkNBQTZDQSxFQUFRLE1BQU0sQ0FDekUsQ0FBQyxDQUNIIiwKICAibmFtZXMiOiBbImFkYXB0ZXJfZXhwb3J0cyIsICJfX2V4cG9ydCIsICJhZGFwdGVyIiwgIl9fdG9Db21tb25KUyIsICJpbXBvcnRfcGF0aCIsICJpbXBvcnRfcG9sa2EiLCAiaW1wb3J0X3NpcnYiLCAiaW1wb3J0X3JlcXVlc3RUb0V2ZW50IiwgImltcG9ydF9zZW5kU2VydmVybGVzc1Jlc3BvbnNlIiwgImltcG9ydF9wcmVzdGEiLCAicHJvcHMiLCAib3B0aW9ucyIsICJhc3NldHMiLCAic2lydiIsICJwYXRoIiwgImFwcCIsICJwb2xrYSIsICJkeW5hbWljRmlsZXMiLCAiZmlsZSIsICJyZXEiLCAicmVzIiwgImV2ZW50IiwgImhhbmRsZXIiLCAicmVzcG9uc2UiXQp9Cg==
