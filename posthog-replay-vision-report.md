# PostHog Replay Vision Integration Report

**Project**: UniversityX (Astro)  
**PostHog Project ID**: `313017`  
**Host**: `https://us.i.posthog.com`  
**Status**: Configured & Ready  

---

## 1. Executive Summary

Replay Vision uses AI to watch user session recordings automatically so you don't have to review them manually. The AI monitors each new session recording, recognizes user struggle and intent patterns described in plain language, and converts them into queryable PostHog events (`$replay_vision_observation`) that feed directly into your dashboards, funnels, and alerts.

---

## 2. Session Replay Configuration

Session replay has been enabled and verified in [`src/components/posthog.astro`](file:///c:/Users/Damilare/Desktop/UniversityX-Astro/src/components/posthog.astro):

```astro
---
const apiKey = import.meta.env.PUBLIC_POSTHOG_KEY;
const apiHost = import.meta.env.PUBLIC_POSTHOG_HOST;
---
<script is:inline define:vars={{ apiKey, apiHost }}>
  !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys getNextSurveyStep onSessionId".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
  posthog.init(apiKey || '', {
    api_host: apiHost || 'https://us.i.posthog.com',
    person_profiles: 'identified_only',
    session_recording: {
      recordCrossOriginIframes: true,
      maskAllInputs: false,
      maskInputOptions: {
        password: true,
      },
    },
    enable_recording_console_log: true,
  })
</script>
```

### Key Settings Applied:
- **`session_recording.recordCrossOriginIframes: true`**: Captures embedded widgets and external dialogs.
- **`session_recording.maskAllInputs: false`**: Captures form interactions without masking standard fields, while strictly protecting sensitive inputs (`password: true`).
- **`enable_recording_console_log: true`**: Records browser console errors alongside visual replay so AI scanners can diagnose runtime exceptions.

---

## 3. Scanners Designed for UniversityX Key Flows

The following AI Vision scanners are tailored specifically for the key conversion funnels in UniversityX:

### Scanner 1: Workshop & Course Registration Friction
- **Type**: `monitor`
- **Component**: `src/components/WorkshopRegistrationForm.astro`, `src/pages/workshop/*`
- **Target Prompt**:  
  > *"Flag any session where a visitor begins filling out the workshop registration form (name, email, experience level, goals) or clicks the submit button, but experiences validation errors, hesitates repeatedly on an input field, encounters an unresponsive button, or exits without completing the registration."*
- **Observation Output**: Emits struggle score, abandoned field name, and whether an error modal was triggered.

### Scanner 2: Instructor & Partnership Application Abandonment
- **Type**: `monitor` / `scorer`
- **Component**: `src/components/ApplyToTeach.astro`, `src/components/ForBusinesses.astro`, `src/components/ForUniversities.astro`
- **Target Prompt**:  
  > *"Monitor sessions where users navigate to Teach with Us or Business/University partnership request forms. Detect form abandonment after typing, repeated editing of bio/proposal textareas, or unexpected page navigation before submitting the application."*
- **Observation Output**: Emits lead source type (`instructor`, `business`, `university`) and point of abandonment.

### Scanner 3: Course Curriculum & FAQ Dead-Ends
- **Type**: `classifier` / `dead_end`
- **Component**: `src/pages/course/*`, `src/components/FAQ.astro`
- **Target Prompt**:  
  > *"Identify sessions where a visitor scrolls back and forth across course modules or expands multiple FAQ accordion questions repeatedly without clicking 'Enroll', 'Join Waitlist', or 'Browse Courses', indicating confusion about prerequisites or course format."*
- **Observation Output**: Classifies user intent (`curriculum_evaluating`, `confused_prerequisites`, `bounced`).

### Scanner 4: UI Rage Clicks & Dead Click Monitor
- **Type**: `monitor`
- **Component**: Site-wide (`HeroSection.astro`, `Navbar.astro`, buttons)
- **Target Prompt**:  
  > *"Detect rapid repeated clicking on buttons, course cards, or unclickable elements where the user expects an immediate response or transition."*
- **Observation Output**: Captures selector, page URL, and click count.

---

## 4. Viewing and Managing Replay Vision in PostHog

1. **Session Replay Hub**:  
   [https://us.posthog.com/project/313017/replay](https://us.posthog.com/project/313017/replay)
2. **Replay Vision Scanners**:  
   Navigate to **Session Replay** → **Vision** in project `313017` to view active scanners and observation alerts.
3. **Core UniversityX Dashboard**:  
   [https://us.posthog.com/project/313017/dashboard/1276698](https://us.posthog.com/project/313017/dashboard/1276698)
