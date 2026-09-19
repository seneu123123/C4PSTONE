export interface PolicySection {
  id: string;
  heading: string;
  paragraphs: string[];
  bulletPoints?: string[];
}

export interface LegalDocument {
  id: string;
  title: string;
  subtitle: string;
  lastUpdated: string;
  standardReference: string;
  summary: string;
  sections: PolicySection[];
}

export const PRIVACY_POLICY: LegalDocument = {
  id: 'privacy',
  title: 'Data Privacy Policy',
  subtitle: 'In Compliance with Republic Act No. 10173 (Philippine Data Privacy Act of 2012) & ISO/IEC 27001:2022',
  lastUpdated: 'September 2026',
  standardReference: 'ISO/IEC 27001:2022 Information Security & RA 10173',
  summary: 'Holiday Travelers Travel & Tours Inc. is dedicated to safeguarding your personal data, passenger manifests, and travel history using industry-leading information security management systems.',
  sections: [
    {
      id: 'privacy-controller',
      heading: '1. Identification of the Data Controller',
      paragraphs: [
        'Holiday Travelers Travel & Tours Inc. (DOT Accreditation No. DOT-ACCR-RO7-2026-8819 / NCR-TO-2026), with registered corporate offices at Suite 402, Holiday Tower, Maxilom Avenue, Cebu City, Philippines, operates as the Data Controller responsible for your personal information.',
        'We have appointed a designated Data Protection Officer (DPO) registered with the National Privacy Commission (NPC) of the Republic of the Philippines to oversee compliance with ISO/IEC 27001 and RA 10173.'
      ],
      bulletPoints: [
        'Official DPO Email: dpo@holidaytravelers.ph',
        'Head Office Helpline: +63 (032) 412-8899',
        'Physical Inquiries: Suite 402, Holiday Tower, Maxilom Avenue, Cebu City'
      ]
    },
    {
      id: 'privacy-collected',
      heading: '2. Categories of Personal Data Collected',
      paragraphs: [
        'To facilitate legitimate flight expeditions, civil aviation clearances, hotel accommodations, and ticketing, we collect and process only the minimum necessary personal identifiable information (PII):'
      ],
      bulletPoints: [
        'Lead Traveler & Contact Details: Full legal name, email address, mobile contact number, nationality, and billing residential address.',
        'Flight & Tour Passenger Manifest Information: Full names of all travel companions, age, gender, government-issued valid ID/passport number (statutorily required by the Civil Aviation Authority of the Philippines [CAAP] and local municipal tourism offices prior to flight and tour departure).',
        'Emergency Contact Information: Name, relationship, and contact telephone number of an individual to be contacted in emergency medical or weather scenarios.',
        'Expedition Special Requirements: Dietary preferences, medical sensitivities, and mobility assistance requirements.',
        'Payment Transaction Metadata: Transaction reference IDs, payment method (e.g. GCash, Maya, Bank Transfer), and settlement timestamp. Note: We DO NOT store raw credit card CVV numbers or banking passwords; all card processing is tokenized through PCI-DSS Level 1 compliant gateway partners.'
      ]
    },
    {
      id: 'privacy-lawful-basis',
      heading: '3. Lawful Basis for Data Processing',
      paragraphs: [
        'Under Section 12 of Republic Act No. 10173 and ISO/IEC 27001 data protection principles, processing of your data is conducted strictly under the following lawful grounds:',
        'a) Contractual Necessity: To generate tour bookings, issue official itineraries, dispatch electronic vouchers, and coordinate hotel, airline, and transport allocations.',
        'b) Legal Compliance: To submit mandatory passenger manifests to the Civil Aviation Authority of the Philippines (CAAP), local municipal tourism offices, and protected environmental sanctuaries (e.g., El Nido Protected Area Management Board, Batanes Cultural Heritage Board).',
        'c) Vital Interests: To dispatch emergency medical rescue or disaster evacuation assistance in force majeure situations.',
        'd) Explicit Consent: To send optional seasonal expedition bulletins, client surveys, or publish guest review testimonials.'
      ]
    },
    {
      id: 'privacy-security-controls',
      heading: '4. Information Security & ISO/IEC 27001 Controls',
      paragraphs: [
        'Holiday Travelers Travel & Tours Inc. enforces rigorous technical, administrative, and physical safeguards in accordance with ISO/IEC 27001:2022 standards:'
      ],
      bulletPoints: [
        'Cryptographic Protection: End-to-end encryption for all data in transit using TLS 1.3 with SHA-256 cipher suites, and AES-256 encryption for data at rest.',
        'Strict Access Control: Role-based access control (RBAC) ensuring only authorized, vetted operations staff and tour concierges access passenger manifests on a strict need-to-know basis.',
        'Audit Logging & Threat Detection: Immutable system logging of all administrative access, preventing unauthorized inspection, tampering, or exfiltration.',
        'Vulnerability Management: Continuous automated scanning, strict rate limiting, and zero exposure of internal database credentials.'
      ]
    },
    {
      id: 'privacy-retention',
      heading: '5. Data Retention & Erasure Policy',
      paragraphs: [
        'We retain personal data only for as long as necessary to fulfill the operational tour agreement and satisfy Philippine statutory accounting and tax compliance (BIR requires commercial invoices to be retained for audit purposes).',
        'Passenger manifest copies submitted for flight and tour expeditions are archived in secure, encrypted storage and securely purged within twelve (12) months following the completion of the expedition, unless ongoing insurance claims require extended retention.'
      ]
    },
    {
      id: 'privacy-rights',
      heading: '6. Your Statutory Rights as a Data Subject',
      paragraphs: [
        'Under RA 10173 and international data privacy benchmarks, you are endowed with comprehensive rights regarding your personal information:'
      ],
      bulletPoints: [
        'Right to be Informed: To know why your data is gathered, how it is safeguarded, and who receives it.',
        'Right of Access: To obtain a verified digital copy of all personal records we maintain on file regarding your bookings.',
        'Right to Rectification: To dispute and correct any inaccuracies in your passenger manifest or contact details.',
        'Right to Erasure / Blocking: To request deletion of your data when it is no longer necessary for operational or legal mandates.',
        'Right to Data Portability: To receive an electronically readable structured copy of your profile and reservation records.',
        'Right to Lodge a Complaint: You may file formal grievances directly with the Philippine National Privacy Commission (privacy.gov.ph) or our internal DPO.'
      ]
    }
  ]
};

export const TERMS_AND_CONDITIONS: LegalDocument = {
  id: 'terms',
  title: 'Terms & Conditions of Tour Operations',
  subtitle: 'Official Tour Agreement & Flight Expedition Contract',
  lastUpdated: 'September 2026',
  standardReference: 'DOT Administrative Order No. 2020-002 & Civil Code of the Philippines',
  summary: 'These terms constitute the legal contract governing all tour packages, chartered expeditions, hotel allocations, and airline/shuttle transfers operated by Holiday Travelers Travel & Tours Inc.',
  sections: [
    {
      id: 'terms-accreditation',
      heading: '1. Regulatory Accreditation & Authority',
      paragraphs: [
        'Holiday Travelers Travel & Tours Inc. is a duly accredited Philippine Tour Operator under the Department of Tourism (DOT Accreditation No. DOT-ACCR-RO7-2026-8819), holding valid municipal business permits, Civil Aviation Authority accredited airline and private transport partnerships, and comprehensive public liability insurance coverage.'
      ]
    },
    {
      id: 'terms-booking-deposit',
      heading: '2. Booking Confirmation & Downpayment Structure',
      paragraphs: [
        'A tour reservation is considered officially held and guaranteed only upon verification of the required downpayment deposit:'
      ],
      bulletPoints: [
        'Standard Downpayment: A 50% reservation deposit per passenger locks in expedition slots, hotel room allocations, airline seats, and chartered tour permits.',
        'Balance Settlement: The remaining 50% balance must be settled at least seven (7) business days prior to the scheduled travel date, or upon airport arrival check-in with our licensed tour guide.',
        'E-Voucher Issuance: Upon receipt of payment, our automated operations engine generates an official electronic voucher with a cryptographically verifiable Booking Reference Code (e.g. TT-2026-XXXX).'
      ]
    },
    {
      id: 'terms-manifest',
      heading: '3. Mandatory Passenger Manifest Compliance',
      paragraphs: [
        'All guests boarding chartered domestic flights, scheduled airline services, or executive land shuttles must provide accurate, verified legal names and valid ID/passport numbers.',
        'Failure to provide accurate manifest information may result in aviation security or airport authorities barring boarding. Holiday Travelers Travel & Tours Inc. shall not be held financially liable for boarding denials resulting from falsified manifest submissions.'
      ]
    },
    {
      id: 'terms-conservation',
      heading: '4. Eco-Tourism & Environmental Preservation Code',
      paragraphs: [
        'Our expeditions practice strict sustainable eco-tourism. All travelers agree to honor our preservation standards:'
      ],
      bulletPoints: [
        'Zero Single-Use Plastics: Single-use plastic beverage bottles and non-biodegradable food containers are prohibited on our flights, executive shuttles, and protected eco-sanctuaries.',
        'Eco-Sanctuary Protocols: Guests must not damage, harvest, or disrupt protected cultural sites and natural flora and fauna.',
        'Leave No Trace: All personal waste must be deposited into designated sorting bins for recycling disposal.'
      ]
    },
    {
      id: 'terms-force-majeure',
      heading: '5. Force Majeure & Severe Weather Operations',
      paragraphs: [
        'The safety of our passengers and crew is paramount. The Civil Aviation Authority of the Philippines (CAAP) and PAGASA issue official flight suspensions during severe weather, tropical storms, and typhoons.',
        'In the event of a government-mandated travel suspension or severe weather disturbance, Holiday Travelers Travel & Tours Inc. provides 100% complimentary date rebooking or a full refund as detailed in our Refund Policy.'
      ]
    }
  ]
};

export const REFUND_POLICY: LegalDocument = {
  id: 'refund',
  title: 'Refund & Cancellation Policy',
  subtitle: 'Consumer Protection and Air Travel Refund Guidelines',
  lastUpdated: 'September 2026',
  standardReference: 'DTI-DOT Joint Administrative Order on Consumer Rights in Travel Services',
  summary: 'Transparent, fair, and consumer-centric refund rules guaranteeing peace of mind when reserving expeditions with Holiday Travelers Travel & Tours Inc.',
  sections: [
    {
      id: 'refund-schedule',
      heading: '1. Standard Cancellation & Refund Tier Schedule',
      paragraphs: [
        'Guests wishing to cancel or modify an existing reservation must notify us in writing via email (bookings@holidaytravelers.ph) or via the Self-Service Booking Tracker. Refunds are processed according to the following schedule:'
      ],
      bulletPoints: [
        '14 or more days prior to departure: 100% Full Refund of all payments made, or free rebooking to any available future date within 12 months with zero administrative penalty.',
        '7 to 13 days prior to departure: 70% Refund of total tour price, or complimentary single-instance date reschedule.',
        '3 to 6 days prior to departure: 50% Refund of total tour price to cover non-refundable pre-allocated hotel room blocks and private transport holding guarantees.',
        'Less than 72 hours prior to departure / No-Show: Non-refundable due to committed flight seat reservations and advance guide allocations. Date modifications may be evaluated on a compassionate case-by-case basis.'
      ]
    },
    {
      id: 'refund-weather',
      heading: '2. Severe Weather & Flight Suspension Advisories',
      paragraphs: [
        'If an expedition is cancelled by Holiday Travelers Travel & Tours Inc. or suspended due to official Civil Aviation Authority (CAAP) flight groundings, typhoon signals, or airport closures:',
        'The guest is entitled to either:'
      ],
      bulletPoints: [
        'Option A: 100% Full Monetary Refund of all payments made, with zero deduction of processing or convenience fees.',
        'Option B: Priority Date Reschedule with open travel validity for up to eighteen (18) months from the cancelled date.',
        'Option C: Conversion into transferable Archipelago Travel Credits with an added 10% complimentary bonus credit.'
      ]
    },
    {
      id: 'refund-turnaround',
      heading: '3. Refund Disbursement Timelines & Channels',
      paragraphs: [
        'Approved refunds are disbursed directly to the original payment channel utilized during booking:'
      ],
      bulletPoints: [
        'GCash & Maya e-Wallets: Credited within 24 to 48 business hours following verification.',
        'Online Bank Transfers (BDO / BPI): Credited within 3 to 5 business days.',
        'Credit / Debit Cards (Visa / Mastercard): Processed within 5 to 7 business days, subject to the cardholder\'s issuing bank billing cycle.'
      ]
    }
  ]
};

export const COOKIE_POLICY: LegalDocument = {
  id: 'cookies',
  title: 'Cookie & Storage Policy',
  subtitle: 'Telemetry, Local State & Cookie Consent Management',
  lastUpdated: 'September 2026',
  standardReference: 'ISO/IEC 27001:2022 Privacy Protection & ePrivacy Directive',
  summary: 'We respect your digital privacy. We only deploy essential functional cookies and grant you complete granular control over optional telemetry and analytics.',
  sections: [
    {
      id: 'cookie-explanation',
      heading: '1. What Are Cookies and Local Storage?',
      paragraphs: [
        'Cookies and browser Local Storage items are small text-based data snippets saved on your device to maintain your active tour booking session, remember currency choices, and preserve security authentication state.'
      ]
    },
    {
      id: 'cookie-categories',
      heading: '2. Categories of Storage Employed',
      paragraphs: [
        'We categorize our cookies and client storage mechanisms into three distinct tiers:'
      ],
      bulletPoints: [
        'Tier 1 — Strictly Essential (Mandatory): Required for core operations, security tokens, anti-CSRF protection, maintaining the active passenger manifest in your checkout wizard, and storing your cookie consent preference. These cannot be disabled.',
        'Tier 2 — Performance & Analytics (Optional): Anonymized telemetry evaluating page load speeds, popular expedition views, and booking funnel usability. We DO NOT track your browsing across external websites.',
        'Tier 3 — Preferences & Personalization (Optional): Preserves UI density settings, custom color palettes, and temperature units (°C/°F) in our Global Weather Radar.'
      ]
    },
    {
      id: 'cookie-management',
      heading: '3. Managing Your Preferences',
      paragraphs: [
        'You have the legal right to accept or reject non-essential cookies at any time. You can modify your stored choices by clicking "Cookie Preferences" in our website footer or by clearing your browser cache.'
      ]
    }
  ]
};

export const CYBERSECURITY_STATEMENT: LegalDocument = {
  id: 'security-iso27001',
  title: 'Cybersecurity & ISO/IEC 27001 Statement',
  subtitle: 'Enterprise Information Security Management Architecture',
  lastUpdated: 'September 2026',
  standardReference: 'ISO/IEC 27001:2022 ISMS Standard Conformance',
  summary: 'Holiday Travelers Travel & Tours Inc. adheres to the ISO/IEC 27001 standard for Information Security Management Systems, ensuring comprehensive defense-in-depth across our digital infrastructure.',
  sections: [
    {
      id: 'iso27001-scope',
      heading: '1. Scope of Information Security Management',
      paragraphs: [
        'Our security governance architecture covers all customer-facing booking portals, passenger manifest repositories, tour operations management engines, and backend API communication pipelines.'
      ],
      bulletPoints: [
        'A.5 Information Security Policies: Formally reviewed access control and incident response procedures.',
        'A.8 Technological Controls: Modern endpoint security, cryptographically signed token authentication, and secure proxy architectures preventing client-side secret exposure.',
        'A.9 Access Control: Zero-trust staff authentication, single-tenant session handling, and granular operational privilege levels.'
      ]
    },
    {
      id: 'iso27001-threat-mitigation',
      heading: '2. Threat Mitigation & Defensive Architecture',
      paragraphs: [
        'Our application is built to actively resist modern OWASP Top 10 vulnerabilities:'
      ],
      bulletPoints: [
        'Cross-Site Scripting (XSS) Prevention: Strict Content Security Policy (CSP), automated output encoding, and zero unsanitized HTML evaluation.',
        'Third-Party Embed Sanitization: All external photographic assets and weather APIs enforce no-referrer directives (referrerPolicy="no-referrer") and secure sandbox boundaries.',
        'Rate Limiting & DDoS Shielding: Enterprise throttling on API endpoints preventing credential brute-forcing and automated denial-of-service disruptions.'
      ]
    }
  ]
};

export const ACCESSIBILITY_STATEMENT: LegalDocument = {
  id: 'accessibility-iso40500',
  title: 'Web Accessibility Statement (ISO/IEC 40500)',
  subtitle: 'Commitment to Universal Digital Inclusion (WCAG 2.1 Level AA)',
  lastUpdated: 'September 2026',
  standardReference: 'ISO/IEC 40500:2012 / W3C WCAG 2.1 Level AA',
  summary: 'We believe that travel and digital access belong to everyone. Our portal is engineered and tested to adhere strictly to ISO/IEC 40500 (Web Content Accessibility Guidelines WCAG 2.1 Level AA).',
  sections: [
    {
      id: 'iso40500-principles',
      heading: '1. Core Accessibility Principles in Our System',
      paragraphs: [
        'Our portal satisfies the four foundational pillars of digital accessibility:'
      ],
      bulletPoints: [
        'Perceivable: All imagery features descriptive alt text or aria-hidden decorative attributes. High contrast color palettes exceed the 4.5:1 ratio threshold for body text.',
        'Operable: The complete portal is 100% navigable via keyboard. Includes a dedicated "Skip to Main Content" bypass link, visible focus rings, and full Escape-key modal closure.',
        'Understandable: Clear, unambiguous form labels, inline validation feedback, and distinct confirmation steps prior to financial commitments.',
        'Robust: Semantic HTML5 landmark markup (header, main, nav, section, footer) and ARIA attributes (role="dialog", aria-modal="true", aria-expanded) verified with screen readers.'
      ]
    },
    {
      id: 'iso40500-feedback',
      heading: '2. Accessibility Inquiries & Accommodations',
      paragraphs: [
        'If you encounter any digital barrier or require custom itinerary accommodations, please reach out directly to our accessibility team at accessibility@holidaytravelers.ph. We provide assisted phone booking and audio-compatible itinerary files.'
      ]
    }
  ]
};

export const ALL_POLICIES = {
  privacy: PRIVACY_POLICY,
  terms: TERMS_AND_CONDITIONS,
  refund: REFUND_POLICY,
  cookies: COOKIE_POLICY,
  'security-iso27001': CYBERSECURITY_STATEMENT,
  'accessibility-iso40500': ACCESSIBILITY_STATEMENT
};
