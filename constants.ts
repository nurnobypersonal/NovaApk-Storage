
import { AppData } from './types';

export const APP_CATEGORIES = [
  'সব (All)', 
  'গেমস (Games)', 
  'টুলস (Tools)',
  'সোশ্যাল (Social)',
  'এআই (AI Apps)',
  'নিরাপত্তা (Security)',
  'বিনোদন (Entertainment)',
  'লাইফস্টাইল (Lifestyle)'
];

const SCREENSHOTS = [
  'https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=600'
];

export const MOCK_APPS: AppData[] = [
  {
    id: '1',
    name: 'নোভা মেসেঞ্জার',
    developer: 'Nova Labs',
    icon: 'https://api.dicebear.com/7.x/shapes/svg?seed=messenger&backgroundColor=4f46e5',
    banner: 'https://images.unsplash.com/photo-1611746872915-64382b5c76da?auto=format&fit=crop&q=80&w=1200',
    screenshots: SCREENSHOTS,
    description: 'খুব দ্রুত এবং নিরাপদ মেসেজিং অ্যাপ। এতে পাবেন এন্ড-টু-এেন্ড এনক্রিপশন সুবিধা। বিশ্বের যেকোনো প্রান্ত থেকে আপনার প্রিয়জনের সাথে কানেক্টেড থাকুন। নূর নবী ইসলামের তত্ত্বাবধানে এটি সম্পূর্ণ নিরাপদ।',
    category: 'সোশ্যাল (Social)',
    rating: 4.8,
    downloads: '10M+',
    size: '42MB',
    version: '3.1.0',
    isFeatured: true,
    status: 'published',
    reviews: [
      { id: 'r1', userName: 'Ariful Islam', rating: 5, comment: 'খুবই দ্রুত কাজ করে!', date: '2024-03-10' }
    ]
  },
  {
    id: '2',
    name: 'বিকাশ (অফিসিয়াল)',
    developer: 'bKash Limited',
    icon: 'https://api.dicebear.com/7.x/shapes/svg?seed=bkash&backgroundColor=e91e63',
    banner: 'https://images.unsplash.com/photo-1556742049-04ff43229bca?auto=format&fit=crop&q=80&w=1200',
    screenshots: SCREENSHOTS,
    description: 'সহজেই টাকা লেনদেন করার জন্য বাংলাদেশের জনপ্রিয় মোবাইল ব্যাংকিং অ্যাপ। রিচার্জ, পেমেন্ট এবং ক্যাশ আউট করুন নিমেষেই।',
    category: 'টুলস (Tools)',
    rating: 4.9,
    downloads: '50M+',
    size: '35MB',
    version: '2.4.1',
    isFeatured: true,
    status: 'published'
  },
  {
    id: '3',
    name: 'শ্যাডো কমব্যাট',
    developer: 'Glow Games',
    icon: 'https://api.dicebear.com/7.x/shapes/svg?seed=game&backgroundColor=f43f5e',
    banner: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1200',
    screenshots: SCREENSHOTS,
    description: 'অসাধারণ গ্রাফিক্সের অ্যাকশন গেম। মোবাইলেই পাবেন কনসোল গেমের অভিজ্ঞতা। মাল্টিপ্লেয়ার মোডে বন্ধুদের সাথে লড়াই করুন।',
    category: 'গেমস (Games)',
    rating: 4.7,
    downloads: '5M+',
    size: '1.4GB',
    version: '4.5.2',
    status: 'published'
  },
  {
    id: '4',
    name: 'ভল্ট সিকিউরিটি',
    developer: 'Cyber Guard',
    icon: 'https://api.dicebear.com/7.x/shapes/svg?seed=shield&backgroundColor=3730a3',
    banner: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1200',
    screenshots: SCREENSHOTS,
    description: 'আপনার ব্যক্তিগত ফাইল এবং অ্যাপ লুকিয়ে রাখার জন্য সেরা সিকিউরিটি অ্যাপ। এতে আছে ইনট্রুডার সেলফি এবং ফেইক ক্র্যাশ ফিচার।',
    category: 'নিরাপত্তা (Security)',
    rating: 4.9,
    downloads: '2M+',
    size: '15MB',
    version: '2.0.0',
    status: 'published'
  },
  {
    id: '5',
    name: 'এআই এডিটর প্রফেশনাল',
    developer: 'Nova Vision',
    icon: 'https://api.dicebear.com/7.x/shapes/svg?seed=ai&backgroundColor=8b5cf6',
    banner: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200',
    screenshots: SCREENSHOTS,
    description: 'আর্টিফিশিয়াল ইন্টেলিজেন্স ব্যবহার করে আপনার ছবিকে এক নিমেষেই প্রফেশনাল লুক দিন। অটো-ব্যাকগ্রাউন্ড রিমুভাল এবং স্টাইল ট্রান্সফার সুবিধা।',
    category: 'এআই (AI Apps)',
    rating: 4.6,
    downloads: '1M+',
    size: '88MB',
    version: '1.0.5',
    status: 'published'
  },
  {
    id: '6',
    name: 'পিক্সেল স্টুডিও',
    developer: 'Glow Graphics',
    icon: 'https://api.dicebear.com/7.x/shapes/svg?seed=pixel&backgroundColor=10b981',
    banner: 'https://images.unsplash.com/photo-1551033406-611cf9a28f67?auto=format&fit=crop&q=80&w=1200',
    description: 'মোবাইলে সেরা ফটো এবং ভিডিও এডিটিং অভিজ্ঞতা। সব প্রিমিয়াম ফিল্টার আনলক করা।',
    category: 'বিনোদন (Entertainment)',
    rating: 4.5,
    downloads: '500K+',
    size: '120MB',
    version: '5.2.1',
    status: 'published'
  },
  {
    id: '7',
    name: 'ক্লিন মাস্টার প্রো',
    developer: 'Nova Utilities',
    icon: 'https://api.dicebear.com/7.x/shapes/svg?seed=cleaner&backgroundColor=3b82f6',
    banner: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200',
    description: 'আপনার ফোনের মেমোরি খালি করুন এবং ফোনের গতি বাড়িয়ে নিন। এটি আপনার ব্যাটারি লাইফও বৃদ্ধি করবে।',
    category: 'টুলস (Tools)',
    rating: 4.3,
    downloads: '100K+',
    size: '12MB',
    version: '1.1.0',
    status: 'published'
  }
];
