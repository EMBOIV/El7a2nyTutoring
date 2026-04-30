"use strict";(()=>{var e={};e.id=654,e.ids=[654],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},6005:e=>{e.exports=require("node:crypto")},64725:(e,r,t)=>{t.r(r),t.d(r,{originalPathname:()=>h,patchFetch:()=>y,requestAsyncStorage:()=>g,routeModule:()=>c,serverHooks:()=>m,staticGenerationAsyncStorage:()=>x});var o={};t.r(o),t.d(o,{POST:()=>l});var s=t(49303),n=t(88716),a=t(60670),i=t(87070),p=t(82591);let u=/^[^\s@]+@[^\s@]+\.[^\s@]+$/,d=/^\+[1-9]\d{7,14}$/;async function l(e){try{let r=await e.json(),t=r.name?.trim(),o=r.email?.trim(),s=(r.phone??"").replace(/[\s()-]/g,"").trim();if(!t||!o||!u.test(o)||!s||!d.test(s))return i.NextResponse.json({error:"Name, valid email, and WhatsApp number with country code are required"},{status:400});let n=process.env.RESEND_API_KEY;if(!n)return i.NextResponse.json({success:!0});let a=new p.R(n),l=`
      <div style="font-family:Arial,sans-serif;line-height:1.7;color:#1B2A44;max-width:560px;margin:auto;">
        <div style="background:#1B2A44;padding:24px 32px;border-radius:12px 12px 0 0;">
          <h1 style="margin:0;color:#fff;font-size:22px;">El7a2ny Tutoring</h1>
          <p style="margin:4px 0 0;color:#F27405;font-size:13px;">IGCSE Expert Tutoring</p>
        </div>
        <div style="padding:32px;border:1px solid #E6E6E6;border-top:none;border-radius:0 0 12px 12px;">
          <h2 style="margin:0 0 12px;color:#1B2A44;">Welcome to El7a2ny! 🎓</h2>
          <p>Hi <strong>${t}</strong>,</p>
          <p>Your account has been created successfully. You can now book IGCSE tutoring sessions and track your progress from your dashboard.</p>
          <div style="background:#F8F8F8;border-left:4px solid #F27405;padding:16px 20px;border-radius:4px;margin:20px 0;">
            <p style="margin:0;font-weight:600;color:#1B2A44;">Next Steps</p>
            <p style="margin:8px 0 0;font-size:14px;color:#555;">Browse subjects → Choose your exam session → Book a tutoring session</p>
          </div>
          <p style="color:#555;font-size:13px;">If you have any questions, feel free to contact us.</p>
          <p style="margin-top:24px;">Best regards,<br/><strong>El7a2ny Tutoring Team</strong></p>
        </div>
      </div>`;return await a.emails.send({from:"El7a2ny Tutoring <onboarding@resend.dev>",to:o,subject:"Welcome to El7a2ny Tutoring! \uD83C\uDF93",html:l}),i.NextResponse.json({success:!0})}catch(e){return console.error("[SIGNUP EMAIL ERROR]",e),i.NextResponse.json({success:!0})}}let c=new s.AppRouteRouteModule({definition:{kind:n.x.APP_ROUTE,page:"/api/auth/signup/route",pathname:"/api/auth/signup",filename:"route",bundlePath:"app/api/auth/signup/route"},resolvedPagePath:"E:\\El7a2nyTutoring\\app\\api\\auth\\signup\\route.ts",nextConfigOutput:"",userland:o}),{requestAsyncStorage:g,staticGenerationAsyncStorage:x,serverHooks:m}=c,h="/api/auth/signup/route";function y(){return(0,a.patchFetch)({serverHooks:m,staticGenerationAsyncStorage:x})}}};var r=require("../../../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),o=r.X(0,[276,475],()=>t(64725));module.exports=o})();