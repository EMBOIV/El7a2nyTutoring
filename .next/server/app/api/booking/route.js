"use strict";(()=>{var e={};e.id=324,e.ids=[324],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},6005:e=>{e.exports=require("node:crypto")},52732:(e,t,o)=>{o.r(t),o.d(t,{originalPathname:()=>f,patchFetch:()=>h,requestAsyncStorage:()=>y,routeModule:()=>c,serverHooks:()=>b,staticGenerationAsyncStorage:()=>m});var r={};o.r(r),o.d(r,{GET:()=>x,POST:()=>g});var s=o(49303),n=o(88716),i=o(60670),d=o(87070),a=o(82591);let p=/^[^\s@]+@[^\s@]+\.[^\s@]+$/,l="01010294098",u="El7a2ny Tutoring <onboarding@resend.dev>";async function g(e){try{let t=await e.json(),o=t.subject?.trim(),r=t.session?.trim(),s=t.name?.trim(),n=t.email?.trim();if(!o)return d.NextResponse.json({error:"Subject is required"},{status:400});if(!r)return d.NextResponse.json({error:"Session is required"},{status:400});if(!s)return d.NextResponse.json({error:"Name is required"},{status:400});if(!n)return d.NextResponse.json({error:"Email is required"},{status:400});if(!p.test(n))return d.NextResponse.json({error:"Invalid email address"},{status:400});let i=process.env.RESEND_API_KEY;if(!i)return console.warn("[BOOKING] RESEND_API_KEY not set — booking logged only"),console.log("[BOOKING]",{name:s,email:n,subject:o,session:r}),d.NextResponse.json({success:!0,message:"Booking request received ✅"});let g=new a.R(i),x=`
      <div style="font-family:Arial,sans-serif;line-height:1.7;color:#1B2A44;max-width:560px;margin:auto;">
        <div style="background:#1B2A44;padding:24px 32px;border-radius:12px 12px 0 0;">
          <h1 style="margin:0;color:#fff;font-size:22px;">El7a2ny Tutoring</h1>
          <p style="margin:4px 0 0;color:#F27405;font-size:13px;">IGCSE Expert Tutoring</p>
        </div>
        <div style="padding:32px;border:1px solid #E6E6E6;border-top:none;border-radius:0 0 12px 12px;">
          <h2 style="margin:0 0 12px;color:#1B2A44;">Booking Confirmed! ✅</h2>
          <p>Hello <strong>${s}</strong>,</p>
          <p>Your session request has been received. We will contact you shortly to confirm your booking.</p>
          <table style="width:100%;border-collapse:collapse;margin:20px 0;">
            <tr style="background:#F8F8F8;"><td style="padding:10px 14px;font-weight:600;width:40%;">Subject</td><td style="padding:10px 14px;">${o}</td></tr>
            <tr><td style="padding:10px 14px;font-weight:600;">Exam Session</td><td style="padding:10px 14px;">${r}</td></tr>
            <tr style="background:#F8F8F8;"><td style="padding:10px 14px;font-weight:600;">Contact Phone</td><td style="padding:10px 14px;">${l}</td></tr>
          </table>
          <p style="color:#555;font-size:13px;">If you have any questions, reply to this email or call us at ${l}.</p>
          <p style="margin-top:24px;">Best regards,<br/><strong>El7a2ny Tutoring Team</strong></p>
        </div>
      </div>`,c=`
      <div style="font-family:Arial,sans-serif;line-height:1.7;color:#1B2A44;max-width:560px;margin:auto;">
        <div style="background:#F27405;padding:20px 32px;border-radius:12px 12px 0 0;">
          <h1 style="margin:0;color:#fff;font-size:20px;">New Booking Request</h1>
        </div>
        <div style="padding:32px;border:1px solid #E6E6E6;border-top:none;border-radius:0 0 12px 12px;">
          <table style="width:100%;border-collapse:collapse;">
            <tr style="background:#F8F8F8;"><td style="padding:10px 14px;font-weight:600;width:40%;">Student Name</td><td style="padding:10px 14px;">${s}</td></tr>
            <tr><td style="padding:10px 14px;font-weight:600;">Email</td><td style="padding:10px 14px;">${n}</td></tr>
            <tr style="background:#F8F8F8;"><td style="padding:10px 14px;font-weight:600;">Subject</td><td style="padding:10px 14px;">${o}</td></tr>
            <tr><td style="padding:10px 14px;font-weight:600;">Exam Session</td><td style="padding:10px 14px;">${r}</td></tr>
          </table>
        </div>
      </div>`;return await Promise.all([g.emails.send({from:u,to:n,subject:"Booking Confirmation - El7a2ny Tutoring",html:x}),g.emails.send({from:u,to:"ali.a.embaby@hotmail.com",subject:`New Booking: ${s} — ${o}`,html:c})]),d.NextResponse.json({success:!0,message:"Booking request sent successfully ✅"})}catch(e){return console.error("[BOOKING API ERROR]",e),d.NextResponse.json({error:"Failed to submit booking request"},{status:500})}}async function x(){return d.NextResponse.json({error:"Method not allowed"},{status:405})}let c=new s.AppRouteRouteModule({definition:{kind:n.x.APP_ROUTE,page:"/api/booking/route",pathname:"/api/booking",filename:"route",bundlePath:"app/api/booking/route"},resolvedPagePath:"E:\\El7a2nyTutoring\\app\\api\\booking\\route.ts",nextConfigOutput:"",userland:r}),{requestAsyncStorage:y,staticGenerationAsyncStorage:m,serverHooks:b}=c,f="/api/booking/route";function h(){return(0,i.patchFetch)({serverHooks:b,staticGenerationAsyncStorage:m})}}};var t=require("../../../webpack-runtime.js");t.C(e);var o=e=>t(t.s=e),r=t.X(0,[276,972,591],()=>o(52732));module.exports=r})();