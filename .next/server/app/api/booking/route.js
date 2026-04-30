"use strict";(()=>{var e={};e.id=324,e.ids=[324],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},6005:e=>{e.exports=require("node:crypto")},52732:(e,t,s)=>{s.r(t),s.d(t,{originalPathname:()=>y,patchFetch:()=>v,requestAsyncStorage:()=>f,routeModule:()=>m,serverHooks:()=>b,staticGenerationAsyncStorage:()=>h});var o={};s.r(o),s.d(o,{GET:()=>c,POST:()=>x});var r=s(49303),n=s(88716),i=s(60670),a=s(87070),d=s(82591);let p=/^[^\s@]+@[^\s@]+\.[^\s@]+$/,l=/^\+[1-9]\d{7,14}$/,u="El7a2ny Tutoring <onboarding@resend.dev>";function g(e){let t=e.map((e,t)=>`
    <tr style="background:${t%2==0?"#F8F8F8":"#fff"};">
      <td style="padding:10px 14px;font-weight:600;">${e.subject}</td>
      <td style="padding:10px 14px;">${e.session}</td>
      <td style="padding:10px 14px;">${e.examSession??"—"}</td>
    </tr>`).join("");return`
    <table style="width:100%;border-collapse:collapse;margin:20px 0;">
      <thead>
        <tr style="background:#1B2A44;">
          <th style="padding:10px 14px;text-align:left;color:#fff;font-size:13px;">Subject</th>
          <th style="padding:10px 14px;text-align:left;color:#fff;font-size:13px;">Level</th>
          <th style="padding:10px 14px;text-align:left;color:#fff;font-size:13px;">Exam Session</th>
        </tr>
      </thead>
      <tbody>${t}</tbody>
    </table>`}async function x(e){try{let t=await e.json(),s=t.name?.trim(),o=t.email?.trim(),r=(t.phone??"").replace(/[\s()-]/g,"").trim(),n=t.subjects;if(!s)return a.NextResponse.json({error:"Name is required"},{status:400});if(!o)return a.NextResponse.json({error:"Email is required"},{status:400});if(!p.test(o))return a.NextResponse.json({error:"Invalid email address"},{status:400});if(!r)return a.NextResponse.json({error:"WhatsApp phone number is required"},{status:400});if(!l.test(r))return a.NextResponse.json({error:"Phone must include country code, e.g. +201010294098"},{status:400});if(!n||0===n.length)return a.NextResponse.json({error:"At least one subject is required"},{status:400});if(n.some(e=>!e.subject||!e.session))return a.NextResponse.json({error:"Each subject must have a session"},{status:400});let i=process.env.RESEND_API_KEY;if(!i)return console.warn("[BOOKING] RESEND_API_KEY not set — booking logged only"),console.log("[BOOKING]",{name:s,email:o,phone:r,subjects:n}),a.NextResponse.json({success:!0,message:"Booking request received ✅"});let x=new d.R(i),c=n.map(e=>`${e.subject} (${e.session}${e.examSession?", "+e.examSession:""})`).join(", "),m=`
      <div style="font-family:Arial,sans-serif;line-height:1.7;color:#1B2A44;max-width:560px;margin:auto;">
        <div style="background:#1B2A44;padding:24px 32px;border-radius:12px 12px 0 0;">
          <h1 style="margin:0;color:#fff;font-size:22px;">El7a2ny Tutoring</h1>
          <p style="margin:4px 0 0;color:#F27405;font-size:13px;">IGCSE Expert Tutoring</p>
        </div>
        <div style="padding:32px;border:1px solid #E6E6E6;border-top:none;border-radius:0 0 12px 12px;">
          <h2 style="margin:0 0 12px;color:#1B2A44;">Booking Confirmed! ✅</h2>
          <p>Hello <strong>${s}</strong>,</p>
          <p>Your session request${n.length>1?"s have":" has"} been received. We will contact you shortly to confirm.</p>
          ${g(n)}
          <div style="background:#F8F8F8;border-left:4px solid #F27405;padding:14px 18px;border-radius:4px;margin:16px 0;">
            <p style="margin:0;font-size:13px;color:#555;">Need to reach us? Call <strong>01010294098</strong> or reply to this email.</p>
          </div>
          <p style="margin-top:24px;">Best regards,<br/><strong>El7a2ny Tutoring Team</strong></p>
        </div>
      </div>`,f=`
      <div style="font-family:Arial,sans-serif;line-height:1.7;color:#1B2A44;max-width:560px;margin:auto;">
        <div style="background:#F27405;padding:20px 32px;border-radius:12px 12px 0 0;">
          <h1 style="margin:0;color:#fff;font-size:20px;">New Booking Request${n.length>1?` (${n.length} subjects)`:""}</h1>
        </div>
        <div style="padding:32px;border:1px solid #E6E6E6;border-top:none;border-radius:0 0 12px 12px;">
          <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
            <tr style="background:#F8F8F8;"><td style="padding:10px 14px;font-weight:600;width:40%;">Student Name</td><td style="padding:10px 14px;">${s}</td></tr>
            <tr><td style="padding:10px 14px;font-weight:600;">Email</td><td style="padding:10px 14px;">${o}</td></tr>
            <tr style="background:#F8F8F8;"><td style="padding:10px 14px;font-weight:600;">WhatsApp</td><td style="padding:10px 14px;">${r}</td></tr>
          </table>
          ${g(n)}
        </div>
      </div>`;return await Promise.all([x.emails.send({from:u,to:o,subject:`Booking Confirmation — ${n.length} Subject${n.length>1?"s":""} | El7a2ny`,html:m}),x.emails.send({from:u,to:"ali.a.embaby@hotmail.com",subject:`New Booking: ${s} — ${c}`,html:f})]),a.NextResponse.json({success:!0,message:"Booking request sent successfully ✅"})}catch(e){return console.error("[BOOKING API ERROR]",e),a.NextResponse.json({error:"Failed to submit booking request"},{status:500})}}async function c(){return a.NextResponse.json({error:"Method not allowed"},{status:405})}let m=new r.AppRouteRouteModule({definition:{kind:n.x.APP_ROUTE,page:"/api/booking/route",pathname:"/api/booking",filename:"route",bundlePath:"app/api/booking/route"},resolvedPagePath:"E:\\El7a2nyTutoring\\app\\api\\booking\\route.ts",nextConfigOutput:"",userland:o}),{requestAsyncStorage:f,staticGenerationAsyncStorage:h,serverHooks:b}=m,y="/api/booking/route";function v(){return(0,i.patchFetch)({serverHooks:b,staticGenerationAsyncStorage:h})}}};var t=require("../../../webpack-runtime.js");t.C(e);var s=e=>t(t.s=e),o=t.X(0,[276,475],()=>s(52732));module.exports=o})();