import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Compass, 
  ArrowRight, 
  CreditCard, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  HelpCircle,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  PhoneCall,
  CheckCircle2,
  Luggage,
  Sun,
  Flame,
  FileCheck2
} from 'lucide-react';
import { TourPackage } from '../../types';

interface ConciergeMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  recommendedPackageId?: string;
  detailsList?: string[];
  quickAction?: {
    label: string;
    action: () => void;
  };
}

interface FaqKnowledgeItem {
  id: string;
  question: string;
  category: 'booking' | 'packages' | 'payment' | 'safety' | 'policies';
  badge: string;
  answer: string;
  keyPoints?: string[];
  recommendedPackageId?: string;
  keywords: string[];
}

const FAQ_KNOWLEDGE_BASE: FaqKnowledgeItem[] = [
  // PAYMENT & DOWNPAYMENT
  {
    id: 'faq-downpayment',
    question: 'How does the 50% downpayment policy work?',
    category: 'payment',
    badge: '50% Downpayment',
    answer: 'You only need to settle a 50% reservation deposit today to lock in your tour dates, hotel rooms, airline tickets, and tour permits.',
    keyPoints: [
      'Remaining 50% balance is payable 7 days prior to departure or during arrival check-in.',
      'Instant electronic receipt and BIR-compliant invoice generated.',
      'No hidden service surcharges.'
    ],
    keywords: ['downpayment', 'deposit', '50%', 'half', 'installment', 'terms', 'pay later']
  },
  {
    id: 'faq-payment-methods',
    question: 'What payment methods do you accept?',
    category: 'payment',
    badge: 'Payment Gateways',
    answer: 'We support all major verified Philippine and international payment channels with zero convenience markups.',
    keyPoints: [
      'GCash (Instant QR code verification)',
      'Maya (Instant digital wallet checkout)',
      'BDO & BPI Online Bank Transfers',
      'Major Credit / Debit Cards (Visa & Mastercard)'
    ],
    keywords: ['payment', 'methods', 'gcash', 'maya', 'credit card', 'bdo', 'bpi', 'bank transfer']
  },
  {
    id: 'faq-refunds',
    question: 'What is your cancellation and refund policy?',
    category: 'policies',
    badge: 'Refund Guarantee',
    answer: 'We provide customer-friendly cancellation guarantees in compliance with DOT and DTI guidelines.',
    keyPoints: [
      '100% full refund or free rebooking if cancelled 14+ days before departure.',
      '70% refund if cancelled 7 to 13 days before departure.',
      '100% full refund or free reschedule in cases of severe typhoon or flight suspension advisories.'
    ],
    keywords: ['cancellation', 'refund', 'cancel', 'rebook', 'typhoon', 'weather', 'policy']
  },

  // PACKAGES & DESTINATIONS
  {
    id: 'faq-elnido',
    question: 'What is included in the El Nido Island Hopping Expedition?',
    category: 'packages',
    badge: 'Palawan Highlight',
    answer: 'Our El Nido 4D3N Expedition (₱18,500/pax) is an all-inclusive tropical escape to Palawan’s premier lagoons.',
    keyPoints: [
      'Guided island lagoon tours with roundtrip airport transfers (Big Lagoon & Secret Lagoon)',
      '4D3N boutique beachfront resort accommodation',
      'Daily buffet island grilled seafood lunches & hydration',
      'DOT-certified local guides, kayak rentals, & ETDF eco-permits included'
    ],
    recommendedPackageId: 'pkg-1',
    keywords: ['el nido', 'palawan', 'big lagoon', 'secret lagoon', 'island hopping', 'elnido']
  },
  {
    id: 'faq-batanes',
    question: 'What makes the Batanes Heritage Discovery unique?',
    category: 'packages',
    badge: 'Cultural Expedition',
    answer: 'Batanes (₱28,900/pax) is a serene 5D4N cultural journey through rolling hills, stone houses, and Pacific cliffs.',
    keyPoints: [
      'Authentic Ivatan heritage stone house homestay lodging',
      'Sabtang Island & Marlboro Hills private 4x4 transport',
      'Certified Ivatan cultural guides and daily organic culinary feasts',
      'Best travel window: December to May (cool & dry weather)'
    ],
    recommendedPackageId: 'pkg-2',
    keywords: ['batanes', 'ivatan', 'sabtang', 'marlboro', 'basco', 'stone house', 'northern']
  },
  {
    id: 'faq-cebu',
    question: 'What is included in the Cebu Whale Shark & Canyoneering tour?',
    category: 'packages',
    badge: 'Adrenaline Tour',
    answer: 'Cebu Adventure (₱14,200/pax) combines the gentle giants of Oslob with the thrilling turquoise waterfalls of Kawasan.',
    keyPoints: [
      'Ethical Oslob whale shark snorkeling encounter passes',
      'Kawasan Falls full canyoneering with 2 rescue marshals per group',
      'Certified expedition safety vests, helmets, and aqua shoes',
      'Air-conditioned private van transfers throughout Cebu'
    ],
    recommendedPackageId: 'pkg-3',
    keywords: ['cebu', 'canyoneering', 'kawasan', 'oslob', 'whale shark', 'waterfall', 'cliff jump']
  },
  {
    id: 'faq-coron',
    question: 'What does the Coron Sunken Shipwrecks package cover?',
    category: 'packages',
    badge: 'Diving & Snorkel',
    answer: 'Coron (₱16,800/pax) is a 4D3N underwater dream featuring WWII shipwrecks, Kayangan Lake, and Twin Lagoon.',
    keyPoints: [
      'Exclusive scenic tour to Kayangan Lake & Barracuda Lake',
      'Snorkeling gear & guides at Skeleton Wreck & Lusong Gunboat',
      'Town tour: Mt. Tapyas panoramic trek & Maquinit Hot Springs',
      'All tourism entrance & preservation permits included'
    ],
    recommendedPackageId: 'pkg-4',
    keywords: ['coron', 'shipwreck', 'kayangan', 'barracuda', 'twin lagoon', 'maquinit', 'tapyas']
  },
  {
    id: 'faq-siargao',
    question: 'Is the Siargao Cloud 9 tour suitable for non-surfers?',
    category: 'packages',
    badge: 'Island Lifestyle',
    answer: 'Yes! Siargao (₱12,500/pax) offers much more than surfing—it is an island lifestyle journey.',
    keyPoints: [
      'Sugba Lagoon paddleboarding & Magpupungko Tidal Rock Pools',
      'Tri-island exploration to Naked, Daku, and Guyam Islands',
      'Beginner surf coaching with certified academy instructors at Cloud 9',
      'Eco-resort accommodation with daily smoothie & breakfast bowls'
    ],
    recommendedPackageId: 'pkg-5',
    keywords: ['siargao', 'surf', 'cloud 9', 'sugba lagoon', 'magpupungko', 'guyam', 'daku']
  },

  // BOOKING & MANIFEST
  {
    id: 'faq-fees-included',
    question: 'Are environmental, terminal, and entrance fees included in the price?',
    category: 'booking',
    badge: 'All-Inclusive',
    answer: 'Yes, 100%! Unlike cheap street tours that surprise you with on-the-spot cash fees, Holiday Travelers handles everything.',
    keyPoints: [
      'All municipal environmental user fees (ETDF) included.',
      'Airport terminal and tourism fees included.',
      'Protected eco-sanctuary conservation tickets included.'
    ],
    keywords: ['fees', 'environmental', 'terminal', 'port', 'hidden', 'extra', 'etdf']
  },
  {
    id: 'faq-voucher-manifest',
    question: 'When do I receive my official Travel Voucher and Passenger Manifest pass?',
    category: 'booking',
    badge: 'Instant QR Voucher',
    answer: 'Your official voucher is generated immediately upon receiving your 50% deposit or full payment.',
    keyPoints: [
      'Includes a scannable dynamic QR verification code.',
      'Registered under DOT Passenger Safety Manifest.',
      'Can be saved to Apple/Google Wallet or printed as PDF.'
    ],
    keywords: ['voucher', 'manifest', 'receipt', 'qr code', 'ticket', 'confirmation']
  },
  {
    id: 'faq-group-discounts',
    question: 'Do you offer group discounts for family or corporate bookings?',
    category: 'booking',
    badge: 'Group Perks',
    answer: 'Yes! We offer tiered volume discounts for travel groups:',
    keyPoints: [
      '5–9 Passengers: 5% automatic group discount',
      '10–19 Passengers: 10% group discount + dedicated private transfer',
      '20+ Passengers / Corporate: Customized charter rates & event team'
    ],
    keywords: ['group', 'discount', 'family', 'corporate', 'team building', 'barkada', 'bulk']
  },

  // SAFETY & PACKING
  {
    id: 'faq-packing',
    question: 'What essential items should I pack for Philippine expeditions?',
    category: 'safety',
    badge: 'Packing Essentials',
    answer: 'To make the most of your expeditions, we suggest packing the following gear:',
    keyPoints: [
      'Dry bag (10L–20L) & waterproof phone pouch',
      'Reef-safe biodegradable sunscreen & sunglasses',
      'Aqua shoes / comfortable walking shoes',
      'Quick-dry microfiber towel and light resort wear'
    ],
    keywords: ['pack', 'packing', 'bring', 'clothes', 'dry bag', 'sunscreen', 'aqua shoes', 'gear']
  },
  {
    id: 'faq-safety-standards',
    question: 'What health, emergency, and aviation safety standards do you follow?',
    category: 'safety',
    badge: 'DOT Accredited',
    answer: 'Safety is our absolute highest priority on every single Philippine expedition.',
    keyPoints: [
      'DOT-Accredited Tour Operator Accreditation: #DOT-NCR-TO-2026-889',
      'Comprehensive Passenger Travel & Flight Insurance on all bookings',
      'Certified Red Cross Wilderness First Aid responders on board',
      'Daily aviation & weather clearance compliance monitoring'
    ],
    keywords: ['safety', 'emergency', 'insurance', 'flight', 'dot', 'first aid', 'rescue', 'medical']
  }
];

interface AiCustomerConciergeProps {
  packages: TourPackage[];
  onSelectPackage: (pkg: TourPackage) => void;
}

export const AiCustomerConcierge: React.FC<AiCustomerConciergeProps> = ({
  packages,
  onSelectPackage
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'all' | 'packages' | 'payment' | 'booking' | 'safety' | 'policies'>('all');
  const [showFaqDrawer, setShowFaqDrawer] = useState(false);
  
  const [messages, setMessages] = useState<ConciergeMessage[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: 'Mabuhay! I am your AI Travel Concierge for Holiday Travelers Travel & Tours Inc. Feel free to ask any questions about our 50% downpayment policy, tour package inclusions, flights, hotels, shuttle logistics, or book directly below.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      detailsList: [
        '🔒 Flexible 50% downpayment option',
        '✈️ Airline, hotel & shuttle coordination',
        '⚡ Instant booking confirmation & QR vouchers'
      ]
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto scroll smoothly to the very bottom whenever a new message appears or typing state changes
  const scrollToBottom = (delay = 50) => {
    setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    }, delay);
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom(100);
    }
  }, [messages, isOpen, isTyping]);

  const handleAskQuestion = (questionText: string, matchedFaq?: FaqKnowledgeItem) => {
    const userMsg: ConciergeMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: questionText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Append user message and close the questions drawer so the answer takes full visibility!
    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setShowFaqDrawer(false); // Collapses the questions accordion automatically
    setIsTyping(true);
    scrollToBottom(50);

    setTimeout(() => {
      let replyText = '';
      let keyPoints: string[] | undefined = undefined;
      let targetPkgId: string | undefined = undefined;

      if (matchedFaq) {
        replyText = matchedFaq.answer;
        keyPoints = matchedFaq.keyPoints;
        targetPkgId = matchedFaq.recommendedPackageId;
      } else {
        // Intelligent keyword scoring
        const lowerQ = questionText.toLowerCase();
        const found = FAQ_KNOWLEDGE_BASE.find(item => 
          item.question.toLowerCase().includes(lowerQ) ||
          item.keywords.some(k => lowerQ.includes(k)) ||
          lowerQ.includes(item.category)
        );

        if (found) {
          replyText = found.answer;
          keyPoints = found.keyPoints;
          targetPkgId = found.recommendedPackageId;
        } else if (lowerQ.includes('el nido') || lowerQ.includes('palawan')) {
          replyText = 'Our El Nido Archipelago Expedition (₱18,500/pax) features Big Lagoon, Secret Lagoon, 4D3N boutique resort accommodation, and private boat transfers.';
          targetPkgId = 'pkg-1';
        } else if (lowerQ.includes('batanes')) {
          replyText = 'Batanes Heritage Discovery (₱28,900/pax) is a 5D4N trip featuring Ivatan culture, Basco lighthouse, Sabtang Island, and daily organic feasts.';
          targetPkgId = 'pkg-2';
        } else if (lowerQ.includes('cebu') || lowerQ.includes('canyoneering')) {
          replyText = 'Cebu Highlights & Kawasan Canyoneering (₱14,200/pax) is a 3D2N thrill with whale shark encounters and full safety gears.';
          targetPkgId = 'pkg-3';
        } else if (lowerQ.includes('coron')) {
          replyText = 'Coron Island & Sunken Shipwrecks (₱16,800/pax) is a 4D3N snorkeling & shipwreck diving wonder with Kayangan Lake passes.';
          targetPkgId = 'pkg-4';
        } else if (lowerQ.includes('siargao')) {
          replyText = 'Siargao Cloud 9 & Pacific Swell (₱12,500/pax) includes 3D2N surf resort lodging, Magpupungko Rock Pools, and Sugba Lagoon tours.';
          targetPkgId = 'pkg-5';
        } else if (lowerQ.includes('passport') || lowerQ.includes('dfa')) {
          replyText = 'Holiday Travelers Inc. provides expedited passport assistance with appointments scheduled quickly and turnaround in as fast as 5 business days for both renewal and first-time applicants.';
          keyPoints = [
            'Turnaround: as fast as 5 days for expedited processing',
            'Document pre-validation and DFA appointment booking',
            'Inquire directly: 0916 525 3517 or holidaytravelersinc2022@gmail.com'
          ];
        } else if (lowerQ.includes('visa') || lowerQ.includes('hong kong') || lowerQ.includes('japan') || lowerQ.includes('korea')) {
          replyText = 'We provide complete visa processing services for Hong Kong, Japan, South Korea, Schengen, USA, Canada, and Australia with high approval track records.';
          keyPoints = [
            'Complete requirements assessment and checklist',
            'Embassy appointment filing and mock interview coaching',
            'Specialist contact: 0916 525 3517'
          ];
        } else if (lowerQ.includes('address') || lowerQ.includes('office') || lowerQ.includes('location') || lowerQ.includes('where are you')) {
          replyText = 'Our main office is located in Ortigas Center, Pasig City: Unit 1101 City & Land Mega Plaza Inc., ADB Ave., Corner Garnet Rd., Ortigas Center, San Antonio, Pasig City, Philippines, 1605.';
          keyPoints = [
            'Address: Unit 1101 City & Land Mega Plaza Inc., ADB Ave. cor. Garnet Rd., Ortigas, Pasig',
            'Phone: 0916 525 3517',
            'Email: holidaytravelersinc2022@gmail.com'
          ];
        } else if (lowerQ.includes('contact') || lowerQ.includes('number') || lowerQ.includes('call') || lowerQ.includes('phone') || lowerQ.includes('email')) {
          replyText = 'You can reach Holiday Travelers Inc. directly via mobile/WhatsApp/Viber at 0916 525 3517 or email us at holidaytravelersinc2022@gmail.com.';
          keyPoints = [
            'Direct Mobile / WhatsApp: 0916 525 3517',
            'Direct Email: holidaytravelersinc2022@gmail.com',
            'Office: Unit 1101 City & Land Mega Plaza Inc., ADB Ave., Ortigas Center, Pasig City'
          ];
        } else {
          replyText = `Thank you for asking! For "${questionText}", our reservations team at Holiday Travelers Inc. can customize your exact itinerary with flexible 50% downpayment terms. Feel free to browse our pre-configured tour packages or contact us at 0916 525 3517.`;
          keyPoints = [
            'Accredited travel agency with full passenger insurance & environmental passes.',
            'Reserve with only 50% deposit today; settle balance prior to tour.',
            'Instant digital receipt, BIR-compliant invoices, and QR passenger voucher.'
          ];
        }
      }

      const targetPkg = targetPkgId ? packages.find(p => p.id === targetPkgId) : undefined;

      const aiMsg: ConciergeMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        detailsList: keyPoints,
        recommendedPackageId: targetPkgId,
        quickAction: targetPkg ? {
          label: `Book ${targetPkg.title} (₱${targetPkg.price.toLocaleString()})`,
          action: () => {
            setIsOpen(false);
            onSelectPackage(targetPkg);
          }
        } : undefined
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
      scrollToBottom(80);
    }, 500);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;
    handleAskQuestion(inputQuery.trim());
  };

  const filteredFaqs = activeCategory === 'all' 
    ? FAQ_KNOWLEDGE_BASE 
    : FAQ_KNOWLEDGE_BASE.filter(f => f.category === activeCategory);

  return (
    <>
      {/* Floating Launcher Button */}
      <div className="fixed bottom-6 right-6 z-40">
        {!isOpen && (
          <button
            onClick={() => {
              setIsOpen(true);
              setShowFaqDrawer(false);
            }}
            className="group relative flex items-center gap-3 px-5 py-3.5 rounded-full bg-[#0B1014] hover:bg-[#111820] text-ivory border border-sunset-coral/50 shadow-2xl shadow-sunset-coral/30 hover:shadow-sunset-coral/50 hover:scale-105 active:scale-95 transition-all duration-300"
            id="ai-concierge-launcher"
          >
            <div className="w-8 h-8 rounded-full bg-sunset-coral flex items-center justify-center text-white shadow-md shadow-sunset-coral/40 group-hover:rotate-12 transition-transform">
              <Bot className="w-4 h-4" />
            </div>
            <div className="text-left pr-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-semibold text-ivory tracking-wide">
                  Holiday Concierge AI
                </span>
              </div>
              <span className="text-[10px] text-sand-muted block font-light">
                Ask 50% deposit, tours & policies
              </span>
            </div>
          </button>
        )}
      </div>

      {/* Floating Chat Modal Box */}
      {isOpen && (
        <div className="fixed bottom-4 sm:bottom-6 right-3 sm:right-6 z-50 w-[calc(100vw-1.5rem)] sm:w-[440px] max-h-[660px] h-[86vh] bg-[#070B0E] border border-white/15 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-fade-in backdrop-blur-2xl">
          {/* Header */}
          <div className="p-4 bg-[#0B1014] border-b border-white/[0.08] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-sunset-coral/20 border border-sunset-coral/40 flex items-center justify-center text-sunset-coral shadow-inner">
                <Compass className="w-5 h-5 animate-spin-slow" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-ivory">
                    Holiday Concierge AI
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-mono uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    Online 24/7
                  </span>
                </div>
                <p className="text-[11px] text-sand-muted font-light">
                  Holiday Travelers Travel & Tours Inc.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  setMessages([
                    {
                      id: `welcome-${Date.now()}`,
                      sender: 'ai',
                      text: 'Chat history cleared. How can I help you explore the Philippines today?',
                      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    }
                  ]);
                  setShowFaqDrawer(false);
                }}
                title="Restart Chat"
                className="p-2 text-sand-muted hover:text-white rounded-full bg-white/[0.04] hover:bg-white/[0.08] transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-sand-muted hover:text-white rounded-full bg-white/[0.04] hover:bg-white/[0.08] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick FAQ Toggle Banner */}
          <div className="bg-[#0D141A] border-b border-white/[0.08] px-3.5 py-2.5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 text-[11px] text-sand-muted">
              <HelpCircle className="w-3.5 h-3.5 text-sunset-coral" />
              <span>Explore Frequent Questions ({FAQ_KNOWLEDGE_BASE.length} topics)</span>
            </div>
            <button
              onClick={() => setShowFaqDrawer(!showFaqDrawer)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-sunset-coral/15 hover:bg-sunset-coral/25 border border-sunset-coral/30 text-sunset-coral text-[11px] font-medium transition-all"
            >
              <span>{showFaqDrawer ? 'Hide Topics' : 'Browse Topics'}</span>
              {showFaqDrawer ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>

          {/* Collapsible FAQ Topics Drawer (Closes when a question is picked so answer is immediately visible) */}
          {showFaqDrawer && (
            <div className="bg-[#0B1014] border-b border-white/[0.1] max-h-56 overflow-y-auto p-3 space-y-2.5 animate-fade-in shrink-0">
              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px]">
                {(['all', 'packages', 'payment', 'booking', 'safety', 'policies'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-2.5 py-1 rounded-full capitalize whitespace-nowrap transition-all ${
                      activeCategory === cat
                        ? 'bg-sunset-coral text-white font-medium shadow-sm'
                        : 'text-sand-muted hover:text-ivory bg-white/[0.04]'
                    }`}
                  >
                    {cat === 'all' ? 'All Questions' : cat}
                  </button>
                ))}
              </div>

              {/* Filtered Question Buttons */}
              <div className="grid grid-cols-1 gap-1.5">
                {filteredFaqs.map((faq) => (
                  <button
                    key={faq.id}
                    onClick={() => handleAskQuestion(faq.question, faq)}
                    className="p-2 rounded-xl bg-white/[0.03] hover:bg-sunset-coral/15 border border-white/[0.06] hover:border-sunset-coral/40 text-left text-[11px] text-ivory/90 hover:text-white transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2 pr-2">
                      <span className="px-1.5 py-0.5 text-[9px] font-mono rounded bg-white/[0.06] text-sand-muted group-hover:text-sunset-coral">
                        {faq.badge}
                      </span>
                      <span className="line-clamp-1">{faq.question}</span>
                    </div>
                    <ArrowRight className="w-3 h-3 text-sand-muted group-hover:text-sunset-coral group-hover:translate-x-0.5 transition-all shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages Scroll Area */}
          <div 
            ref={chatContainerRef}
            className="flex-1 p-4 overflow-y-auto space-y-4 text-xs font-sans-body bg-[#070B0E]"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-xl bg-sunset-coral/20 border border-sunset-coral/40 flex items-center justify-center text-sunset-coral shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[88%] rounded-2xl p-3.5 space-y-2.5 leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-sunset-coral text-white rounded-br-none shadow-md shadow-sunset-coral/20'
                      : 'bg-[#0E151B] text-ivory/95 border border-white/[0.08] rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-line text-[12px]">{msg.text}</p>

                  {/* Structured Key Points list if available */}
                  {msg.detailsList && msg.detailsList.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-white/10">
                      {msg.detailsList.map((point, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-[11px] text-ivory/85">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{point}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Direct Package Booking Action Button */}
                  {msg.quickAction && (
                    <div className="pt-2 border-t border-white/10">
                      <button
                        onClick={msg.quickAction.action}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-sunset-coral text-white text-[11px] font-semibold tracking-wide shadow-md hover:brightness-110 active:scale-95 transition-all"
                      >
                        <span>{msg.quickAction.label}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  <span className={`text-[9px] block text-right ${msg.sender === 'user' ? 'text-white/70' : 'text-sand-muted'}`}>
                    {msg.timestamp}
                  </span>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-ivory shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-sand-muted text-xs pl-1 animate-pulse">
                <div className="w-6 h-6 rounded-xl bg-sunset-coral/20 flex items-center justify-center text-sunset-coral">
                  <Sparkles className="w-3 h-3" />
                </div>
                <span>Island Concierge is retrieving policy information...</span>
              </div>
            )}

            {/* Quick Suggestion Chips at the bottom of the conversation */}
            {!showFaqDrawer && (
              <div className="pt-2">
                <p className="text-[10px] uppercase font-mono text-sand-muted tracking-wider mb-2">
                  Suggested inquiries:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => handleAskQuestion('How does the 50% downpayment policy work?', FAQ_KNOWLEDGE_BASE[0])}
                    className="px-2.5 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-sunset-coral/40 text-[10px] text-ivory/80 hover:text-white transition-all"
                  >
                    💳 50% Downpayment Policy
                  </button>
                  <button
                    onClick={() => handleAskQuestion('What is included in the El Nido Island Hopping Expedition?', FAQ_KNOWLEDGE_BASE[3])}
                    className="px-2.5 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-sunset-coral/40 text-[10px] text-ivory/80 hover:text-white transition-all"
                  >
                    🏝️ El Nido Inclusions
                  </button>
                  <button
                    onClick={() => handleAskQuestion('Are environmental, terminal, and entrance fees included in the price?', FAQ_KNOWLEDGE_BASE[8])}
                    className="px-2.5 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-sunset-coral/40 text-[10px] text-ivory/80 hover:text-white transition-all"
                  >
                    🎫 Environmental & Port Fees
                  </button>
                  <button
                    onClick={() => handleAskQuestion('What essential items should I pack for Philippine island hopping?', FAQ_KNOWLEDGE_BASE[11])}
                    className="px-2.5 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-sunset-coral/40 text-[10px] text-ivory/80 hover:text-white transition-all"
                  >
                    🎒 Packing Essentials
                  </button>
                  <button
                    onClick={() => setShowFaqDrawer(true)}
                    className="px-2.5 py-1 rounded-full bg-sunset-coral/15 border border-sunset-coral/30 text-[10px] text-sunset-coral hover:bg-sunset-coral/25 transition-all"
                  >
                    + View All {FAQ_KNOWLEDGE_BASE.length} Topics
                  </button>
                </div>
              </div>
            )}

            {/* Invisible anchor strictly at the bottom for smooth scrolling */}
            <div ref={messagesEndRef} className="h-2" />
          </div>

          {/* Chat Input Footer */}
          <form
            onSubmit={handleCustomSubmit}
            className="p-3 bg-[#0B1014] border-t border-white/[0.08] flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask anything (e.g. 50% deposit, Batanes, refunds)..."
              className="flex-1 bg-[#070B0E] border border-white/[0.1] rounded-full px-4 py-2.5 text-xs text-ivory placeholder-sand-muted focus:outline-none focus:border-sunset-coral"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim()}
              className="w-9 h-9 rounded-full bg-sunset-coral hover:bg-[#ff765b] disabled:opacity-40 text-white flex items-center justify-center shadow-md transition-all shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
