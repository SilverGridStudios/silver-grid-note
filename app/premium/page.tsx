'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Folder, Smile, CheckCircle2, Sparkles, Bold, Italic, Underline, Strikethrough, Link as LinkIcon, Heading1, Heading2, Edit3 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import Script from 'next/script';

export default function PremiumPage() {
  const router = useRouter();
  const [plan, setPlan] = useState<'yearly' | 'monthly'>('yearly');
  const [isIndia, setIsIndia] = useState(true);

  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setIsIndia(tz === 'Asia/Calcutta' || tz === 'Asia/Kolkata');
  }, []);

  const pricing = {
    IN: {
      yearly: { price: '₹1,500.00', original: '₹2,400.00', amount: 150000 },
      monthly: { price: '₹200.00', amount: 20000 }
    },
    US: {
      yearly: { price: '$18.00', original: '$30.00', amount: 1800 },
      monthly: { price: '$2.50', amount: 250 }
    }
  };

  const currentPricing = isIndia ? pricing.IN : pricing.US;

  const handleSubscribe = () => {
    if (isIndia) {
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_dummy',
        amount: currentPricing[plan].amount,
        currency: 'INR',
        name: 'Silver Grid Note',
        description: `Premium ${plan} subscription`,
        handler: function (response: any) {
          alert('Payment successful! ID: ' + response.razorpay_payment_id);
        },
        theme: { color: '#0d9488' }
      };
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } else {
      const url = plan === 'yearly'
        ? process.env.NEXT_PUBLIC_LS_YEARLY_URL || 'https://demo.lemonsqueezy.com/checkout/buy/yearly'
        : process.env.NEXT_PUBLIC_LS_MONTHLY_URL || 'https://demo.lemonsqueezy.com/checkout/buy/monthly';

      if ((window as any).LemonSqueezy) {
        (window as any).LemonSqueezy.Url.Open(url);
      } else {
        window.open(url, '_blank');
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-100 h-[100dvh] overflow-y-auto">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <Script src="https://assets.lemonsqueezy.com/lemon.js" strategy="lazyOnload" onLoad={() => {
        if ((window as any).createLemonSqueezy) {
          (window as any).createLemonSqueezy();
        }
      }} />
      {/* Header */}
      <div className="flex items-center gap-2 px-2 h-14 bg-gray-100 shadow-sm z-10 sticky top-0">
        <button 
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-200 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <div className="text-xl font-semibold text-gray-700">Premium</div>
      </div>

      <div className="p-4 flex flex-col gap-6 pb-12">
        {/* Pricing */}
        <div className="flex flex-col gap-4">
          <label className="flex items-center justify-between p-3 cursor-pointer">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                plan === 'yearly' ? "border-teal-600" : "border-gray-400"
              )}>
                {plan === 'yearly' && <div className="w-2.5 h-2.5 rounded-full bg-teal-600" />}
              </div>
              <span className="text-xl text-gray-800">Yearly</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-gray-400 line-through text-sm">{currentPricing.yearly.original}</span>
              <span className="text-xl text-gray-800">{currentPricing.yearly.price}</span>
            </div>
            <input 
              type="radio" 
              name="plan" 
              value="yearly" 
              checked={plan === 'yearly'} 
              onChange={() => setPlan('yearly')} 
              className="hidden" 
            />
          </label>

          <label className="flex items-center justify-between p-3 cursor-pointer">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                plan === 'monthly' ? "border-teal-600" : "border-gray-400"
              )}>
                {plan === 'monthly' && <div className="w-2.5 h-2.5 rounded-full bg-teal-600" />}
              </div>
              <span className="text-xl text-gray-800">Monthly</span>
            </div>
            <span className="text-xl text-gray-800">{currentPricing.monthly.price}</span>
            <input 
              type="radio" 
              name="plan" 
              value="monthly" 
              checked={plan === 'monthly'} 
              onChange={() => setPlan('monthly')} 
              className="hidden" 
            />
          </label>
        </div>

        <button 
          onClick={handleSubscribe}
          className="w-full bg-teal-600 text-white font-medium py-3 rounded-sm shadow-sm hover:bg-teal-700 transition-colors"
        >
          SUBSCRIBE
        </button>

        <div className="flex flex-col gap-2 text-center sm:text-left">
          <p className="text-blue-600 text-sm">Get started with a 10-day free trial.</p>
          <p className="text-gray-500 text-sm">
            {plan === 'yearly' ? `${currentPricing.yearly.price} will be charged every year.` : `${currentPricing.monthly.price} will be charged every month.`} You can cancel your subscription anytime.
          </p>
          <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-gray-500 underline">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>

        <div className="text-xl text-gray-800 mt-4">Premium Features</div>

        {/* Features List */}
        <div className="flex flex-col gap-8">
          
          {/* Folders */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 text-gray-800">
              <Folder className="w-5 h-5 text-gray-600" fill="currentColor" />
              <span className="text-lg">Folders</span>
            </div>
            <div className="flex flex-col gap-2 pl-8">
              <div className="bg-yellow-100 border border-yellow-200 rounded-sm p-3 flex justify-between items-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-16 h-2 bg-yellow-200 rounded-br-lg"></div>
                <div className="flex items-center gap-2 z-10">
                  <Folder className="w-5 h-5 text-gray-800" />
                  <span className="text-gray-800 text-lg">Folder</span>
                </div>
                <div className="bg-yellow-200 text-gray-800 px-3 py-0.5 rounded-full text-sm z-10">0</div>
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-sm p-3 flex justify-between items-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-16 h-2 bg-blue-100 rounded-br-lg"></div>
                <div className="flex items-center gap-2 z-10">
                  <Folder className="w-5 h-5 text-gray-800" />
                  <span className="text-gray-800 text-lg">Folder</span>
                </div>
                <div className="bg-blue-200 text-gray-800 px-3 py-0.5 rounded-full text-sm z-10">0</div>
              </div>
            </div>
          </div>

          {/* Text formatting */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 text-gray-800">
              <span className="text-xl font-serif font-bold text-gray-600 border-b-2 border-gray-600 leading-none">A</span>
              <span className="text-lg">Text formatting</span>
            </div>
            <div className="pl-8">
              <div className="bg-yellow-100 border border-yellow-200 rounded-sm p-3 flex items-center gap-4">
                <div className="flex flex-col gap-3 bg-white p-2 rounded-sm shadow-sm border border-gray-200">
                  <div className="flex items-center gap-4 border-b border-gray-100 pb-2">
                    <Heading1 className="w-4 h-4 text-gray-800" />
                    <Heading2 className="w-4 h-4 text-gray-800" />
                    <LinkIcon className="w-4 h-4 text-gray-800" />
                    <div className="bg-gray-100 p-1 rounded-sm">
                      <Edit3 className="w-4 h-4 text-red-500" />
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Bold className="w-4 h-4 text-gray-800" />
                    <Italic className="w-4 h-4 text-gray-800" />
                    <Underline className="w-4 h-4 text-gray-800" />
                    <Strikethrough className="w-4 h-4 text-gray-800" />
                  </div>
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  <div className="h-4 border-b border-yellow-300 w-full"></div>
                  <div className="h-4 border-b border-yellow-300 w-full"></div>
                  <div className="h-4 border-b border-yellow-300 w-3/4"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Icons */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 text-gray-800">
              <Smile className="w-5 h-5 text-gray-600" />
              <span className="text-lg">Icons</span>
            </div>
            <div className="pl-8">
              <div className="bg-white border border-gray-200 rounded-sm flex">
                {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day, i) => (
                  <div key={day} className="flex-1 border-r border-gray-100 last:border-none p-1 flex flex-col items-center h-20">
                    <span className={cn("text-[10px]", i === 0 ? "text-red-500" : i === 6 ? "text-blue-500" : "text-gray-500")}>{day}</span>
                    <span className={cn("text-sm mb-1", i === 0 ? "text-red-500" : i === 6 ? "text-blue-500" : "text-gray-700")}>{i + 1}</span>
                    {i === 1 && <div className="text-xl">⭐</div>}
                    {i === 3 && <div className="text-xl">❤️</div>}
                    {i === 6 && <div className="text-xl">🎂</div>}
                    {(i === 1 || i === 3 || i === 6) && <div className="w-1.5 h-1.5 bg-yellow-400 mt-auto mb-1"></div>}
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
