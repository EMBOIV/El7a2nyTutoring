"use strict";(()=>{var e={};e.id=324,e.ids=[324],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},6005:e=>{e.exports=require("node:crypto")},52732:(e,t,o)=>{o.r(t),o.d(t,{originalPathname:()=>h,patchFetch:()=>y,requestAsyncStorage:()=>m,routeModule:()=>c,serverHooks:()=>f,staticGenerationAsyncStorage:()=>b});var s={};o.r(s),o.d(s,{GET:()=>x,POST:()=>g});var r=o(49303),n=o(88716),i=o(60670),a=o(87070),d=o(82591);let p=/^[^\s@]+@[^\s@]+\.[^\s@]+$/,l="El7a2ny Tutoring <onboarding@resend.dev>";function u(e){let t=e.map((e,t)=>`
    <tr style="background:${t%2==0?"#F8F8F8":"#fff"};">
      <td style="padding:10px 14px;font-weight:600;">${e.subject}</td>
      <td style="padding:10px 14px;">${e.session}</td>
    </tr>`).join("");return`
    <table style="width:100%;border-collapse:collapse;margin:20px 0;">
      <thead>
        <tr style="background:#1B2A44;">
          <th style="padding:10px 14px;text-align:left;color:#fff;font-size:13px;">Subject</th>
          <th style="padding:10px 14px;text-align:left;color:#fff;font-size:13px;">Exam Session</th>
        </tr>
      </thead>
      <tbody>${t}</tbody>
    </table>`}async function g(e){try{let t=await e.json(),o=t.name?.trim(),s=t.email?.trim(),r=t.subjects;if(!o)return a.NextResponse.json({error:"Name is required"},{status:400});if(!s)return a.NextResponse.json({error:"Email is required"},{status:400});if(!p.test(s))return a.NextResponse.json({error:"Invalid email address"},{status:400});if(!r||0===r.length)return a.NextResponse.json({error:"At least one subject is required"},{status:400});if(r.some(e=>!e.subject||!e.session))return a.NextResponse.json({error:"Each subject must have a session"},{status:400});let n=process.env.RESEND_API_KEY;if(!n)return console.warn("[BOOKING] RESEND_API_KEY not set — booking logged only"),console.log("[BOOKING]",{name:o,email:s,subjects:r}),a.NextResponse.json({success:!0,message:"Booking request received ✅"});let i=new d.R(n),g=r.map(e=>`${e.subject} (${e.session})`).join(", "),x=`
      <div style="font-family:Arial,sans-serif;line-height:1.7;color:#1B2A44;max-width:560px;margin:auto;">
        <div style="background:#1B2A44;padding:24px 32px;border-radius:12px 12px 0 0;">
          <h1 style="margin:0;color:#fff;font-size:22px;">El7a2ny Tutoring</h1>
          <p style="margin:4px 0 0;color:#F27405;font-size:13px;">IGCSE Expert Tutoring</p>
        </div>
        <div style="padding:32px;border:1px solid #E6E6E6;border-top:none;border-radius:0 0 12px 12px;">
          <h2 style="margin:0 0 12px;color:#1B2A44;">Booking Confirmed! ✅</h2>
          <p>Hello <strong>${o}</strong>,</p>
          <p>Your session request${r.length>1?"s have":" has"} been received. We will contact you shortly to confirm.</p>
          ${u(r)}
          <div style="background:#F8F8F8;border-left:4px solid #F27405;padding:14px 18px;border-radius:4px;margin:16px 0;">
            <p style="margin:0;font-size:13px;color:#555;">Need to reach us? Call <strong>01010294098</strong> or reply to this email.</p>
          </div>
          <p style="margin-top:24px;">Best regards,<br/><strong>El7a2ny Tutoring Team</strong></p>
        </div>
      </div>`,c=`
      <div style="font-family:Arial,sans-serif;line-height:1.7;color:#1B2A44;max-width:560px;margin:auto;">
        <div style="background:#F27405;padding:20px 32px;border-radius:12px 12px 0 0;">
          <h1 style="margin:0;color:#fff;font-size:20px;">New Booking Request${r.length>1?` (${r.length} subjects)`:""}</h1>
        </div>
        <div style="padding:32px;border:1px solid #E6E6E6;border-top:none;border-radius:0 0 12px 12px;">
          <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
            <tr style="background:#F8F8F8;"><td style="padding:10px 14px;font-weight:600;width:40%;">Student Name</td><td style="padding:10px 14px;">${o}</td></tr>
            <tr><td style="padding:10px 14px;font-weight:600;">Email</td><td style="padding:10px 14px;">${s}</td></tr>
          </table>
          ${u(r)}
        </div>
      </div>`;return await Promise.all([i.emails.send({from:l,to:s,subject:`Booking Confirmation — ${r.length} Subject${r.length>1?"s":""} | El7a2ny`,html:x}),i.emails.send({from:l,to:"ali.a.embaby@hotmail.com",subject:`New Booking: ${o} — ${g}`,html:c})]),a.NextResponse.json({success:!0,message:"Booking request sent successfully ✅"})}catch(e){return console.error("[BOOKING API ERROR]",e),a.NextResponse.json({error:"Failed to submit booking request"},{status:500})}}async function x(){return a.NextResponse.json({error:"Method not allowed"},{status:405})}let c=new r.AppRouteRouteModule({definition:{kind:n.x.APP_ROUTE,page:"/api/booking/route",pathname:"/api/booking",filename:"route",bundlePath:"app/api/booking/route"},resolvedPagePath:"E:\\El7a2nyTutoring\\app\\api\\booking\\route.ts",nextConfigOutput:"",userland:s}),{requestAsyncStorage:m,staticGenerationAsyncStorage:b,serverHooks:f}=c,h="/api/booking/route";function y(){return(0,i.patchFetch)({serverHooks:f,staticGenerationAsyncStorage:b})}}};var t=require("../../../webpack-runtime.js");t.C(e);var o=e=>t(t.s=e),s=t.X(0,[276,972,591],()=>o(52732));module.exports=s})();