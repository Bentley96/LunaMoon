// The clinic's policy page, as the existing site has it.
//
// A default, not the source of truth: ClinicPolicyPage asks WordPress for the
// page first and only falls back to this when it has no content. A policy is
// the one thing on the site most likely to need correcting in a hurry, and
// that shouldn't wait on a rebuild — but the page shouldn't sit empty in the
// meantime either, which is what it did before.
//
// Source: "Clinic Policy - Luna Moon Aesthetics", 17 September 2026.

export interface PolicySection {
  heading: string;
  /** One entry per paragraph. */
  body: string[];
}

export interface PolicyContent {
  title: string;
  /** The line the page opens with, above the sections. */
  intro: string;
  sections: PolicySection[];
}

/** Keyed by the page slug the route asks for. */
export const policies: Record<string, PolicyContent> = {
  'clinic-policy': {
    title: 'CLINIC POLICY',
    intro:
      'Please note that by booking a Beauty Aesthetics Skincare appointment you are accepting the terms and conditions of our Clinic policy.',
    sections: [
      {
        heading: 'FEEDBACK',
        body: [
          'Any feedback regarding your treatments is greatly appreciated. You can leave feedback via our Facebook page.',
        ],
      },
      {
        heading: 'ARRIVING AT THE CLINIC',
        body: [
          'If you are new to the Clinic please arrive 10 minutes before your appointment time. This will give you plenty of time to check in and fill out the Client Consultation Form. Arriving late will rob you of precious appointment minutes as each session will be finished exactly on time as a courtesy to the next client.',
          'We fully understand that sometimes being late is outside of your control. If you are running late, please contact the Clinic as soon as possible by phone to allow your therapist to advise the best course of action.',
          'We will always do our best to accommodate late arrivals (within 10 minutes after your appointment) by performing the most complete treatment possible in the time remaining.',
          'Unfortunately, arriving 10 minutes after the scheduled time of your appointment may result in the cancellation of your appointment, our cancellation policy will apply.',
          'We recommend that you plan ahead for your visit to our Clinic.',
          'We’ll be happy to answer any questions you may have about our location, parking, and travel options.',
        ],
      },
      {
        heading: 'BOOKING APPOINTMENTS VIA PHONE OR SOCIAL MEDIA',
        body: [
          'The preferred method of booking an appointment is online via our website, where the availability of each treatment can be found and your deposit can be paid to secure your booking. Bookings can also be made via our social media sites. Please note, booking an appointment via social media, the appointment will not be booked until the appointment time has been confirmed to the client by the Clinic and the deposit received. Being offered a time slot does not guarantee the space until the clinic has confirmed it with the client.',
          'We regret we cannot hold bookings with Facebook appointments until confirmation. Luna Moon Aesthetics runs on an appointment-based system and these go on a first-come-first-serve basis. We do not hold back any appointments for last minute calls, so we always advise you to book in advance to avoid disappointment. Remember that during the summer months and at Christmas time we do get extremely busy and appointments can go 2-3 weeks in advance (sometimes longer for late nights and weekends).',
          'SYMPTOMS OF COVID -19 – If you are experiencing any symptoms of Covid 19 which include high fever, continuous cough, loss of sense of smell and taste, please reschedule your appointment.',
        ],
      },
      {
        heading: 'CANCELLATIONS',
        body: [
          'Please understand that as a Clinic we run on an appointment basis. When a client cancels late or misses appointments this costs the Clinic financially. We do appreciate that things do crop up, so we do ask you to notify the Clinic as soon as possible. If you miss an appointment, we will contact you to notify you on the missed appointment. If you find it difficult to remember appointments then we do offer a text to remind service. But please note that it is still your responsibility to remember the appointment. If you have missed several appointments, we recommend that you ring the Clinic on the day that you wish to have the appointment, and we will do our best to fit you in. We do appreciate your custom, and also appreciate our time is precious.',
        ],
      },
      {
        heading: 'CANCELLATION POLICY',
        body: [
          'If you need to cancel your appointment, please call the Clinic at least 24 hours (48 duo and packages) in advance. We will work with you to re-schedule your appointment, but please note this could be several days later. Deposits will not be refunded for cancellations but appointments can be re-scheduled without incurring further costs.',
        ],
      },
    ],
  },
};
