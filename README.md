# Naukarix (नौकरीएक्स) - All India Job Portal

**Naukarix** भारत का एक आधुनिक, प्रोफेशनल, तीव्र और SEO-Friendly ऑल इंडिया जॉब पोर्टल है, जिसे **Next.js 14**, **PHP 8.2 / Laravel 11**, और **MySQL** के साथ तैयार किया गया है।

---

## 🌟 प्रमुख विशेषताएं (Key Features)

1. **सरकारी एवं प्राइवेट नौकरियां (Govt & Private Recruitment)**:
   - **Sarkari Naukri**: SSC CGL, रेलवे RRB ALP, UP Police Constable, Bihar BPSC, State Bank of India (SBI PO), आदि।
   - **Private & Corporate**: Top IT, Full Stack Developer, Data Analyst Trainee, BPO / Customer Care, Digital Marketing, UI/UX Designer।
   - **आधिकारिक अधिसूचना व पोर्टल लिंक**: सरकारी भर्तियों के लिए आधिकारिक विज्ञप्ति (PDF) डाउनलोड तथा आधिकारिक सरकारी वेबसाइट पर सीधा आवेदन।

2. **फ्रेशर एवं वर्क फ्रॉम होम (Freshers & Work From Home)**:
   - **0-1 वर्ष अनुभव** वाले फ्रेशर्स के लिए विशेष फिल्टर और बैज।
   - **100% Work From Home (WFH)** व रिमोट जॉब्स के लिए समर्पित सेक्शन व फिल्टर।

3. **राज्यवार नौकरियां (State-wise Jobs)**:
   - उत्तर प्रदेश (UP), बिहार (BR), दिल्ली एनसीआर (DL), महाराष्ट्र (MH), राजस्थान (RJ), मध्य प्रदेश (MP), कर्नाटक (KA), हरियाणा (HR), पश्चिम बंगाल (WB), गुजरात (GJ), और संपूर्ण भारत (All India)।

4. **कैंडिडेट डैशबोर्ड (Candidate Dashboard)**:
   - **My Applications**: स्थिति ट्रैकिंग (`Applied`, `Under Review`, `Shortlisted`, `Selected`, `Rejected`)।
   - **Saved Jobs**: पसंदीदा नौकरियों को बुकमार्क करना।
   - **Resume Upload & Profile**: PDF/DOC रिज्यूमे अपलोड, स्किल्स, अनुभव, बायो और हेडलाइन संपादन।

5. **एम्प्लॉयर डैशबोर्ड (Employer / Recruiter Dashboard)**:
   - **Post a Job**: आसान फॉर्म में नई रिक्ति पोस्ट करना (वेतन, पद, अहर्ता, अंतिम तिथि आदि)।
   - **Manage Jobs**: पोस्ट की गई नौकरियों के व्यूज और आवेदनों की संख्या देखना।
   - **Applicant Reviewer**: उम्मीदवारों के रिज्यूमे डाउनलोड करना, स्थिति बदलना (Shortlist, Hire, Reject) और इंटरव्यू नोट्स जोड़ना।

6. **एडमिन पैनल (Admin Panel)**:
   - ऑल इंडिया पोर्टल स्टैटिस्टिक्स (कुल नौकरियां, सरकारी vs प्राइवेट अनुपात, पंजीकृत उम्मीदवार, नियोक्ता, कुल प्राप्त रेवेन्यू)।
   - नौकरियों का मॉडरेशन एवं Featured बैज टॉगल।
   - यूजर्स प्रबंधन (एक्टिव / सस्पेंड)।
   - वित्तीय लेनदेन और जीएसटी चालान (Invoices)।

7. **Google SEO & JobPosting Schema**:
   - Google Search Central के मानकों के अनुसार JSON-LD `JobPosting` स्ट्रक्चर्ड डेटा स्कीमा हर नौकरी के पेज में शामिल (`@context`, `@type`, `title`, `description`, `hiringOrganization`, `jobLocation`, `baseSalary`, `validThrough`)।
   - सर्च इंजनों (Google, Bing) के लिए स्वचालित क्रॉलिंग और इंडेक्सिंग।

8. **द्विभाषी सहायता (Bilingual Hindi & English)**:
   - हेडर में एक क्लिक से **English** और **हिन्दी** के बीच स्विच करने की सुविधा।

9. **पेड जॉब पोस्टिंग व सुरक्षित पेमेंट गेटवे (Paid Posting & Payment Gateway)**:
   - **Starter Plan** (₹0 - 1 मुफ्त जॉब पोस्ट)।
   - **Recruiter Pro** (₹1,499 - 5 जॉब पोस्ट्स, Featured बैज, उम्मीदवारों के संपर्क विवरण)।
   - **Enterprise VIP** (₹4,999 - अनलिमिटेड पोस्ट्स, टॉप प्रायोरिटी, सोशल मीडिया बूस्ट)।
   - Razorpay, UPI (Google Pay, PhonePe, Paytm), क्रेडिट/डेबिट कार्ड्स और नेटबैंकिंग का सुरक्षित चेकआउट फ्लो और इनवॉइस जनरेशन।

10. **मुफ्त जॉब अलर्ट (Free Job Alerts)**:
    - उम्मीदवार अपनी पसंद के राज्य, विषय और क्षेत्र के अनुसार WhatsApp और Email पर सीधे अपडेट प्राप्त कर सकते हैं।

---

## 🛠️ तकनीकी संरचना (Tech Stack)

| भाग | तकनीक | विवरण |
|---|---|---|
| **Frontend** | **Next.js 14** (App Router) | React, TypeScript, Tailwind CSS, Lucide Icons, Canvas Confetti |
| **Backend** | **Laravel 11** | RESTful JSON API, Sanctum Auth, Eloquent ORM, CORS Middleware |
| **Database** | **MySQL** (`naukarix_db`) | 12 माइग्रेशन्स, रिलेशनल डेटा मॉडल, ऑथेंटिक इंडियन जॉब सीडर |
| **SEO** | **Schema.org** | Google `JobPosting` JSON-LD Structured Data Schema |
| **Payments** | **Razorpay / UPI** | ऑर्डर निर्माण, हस्ताक्षर सत्यापन, लेनदेन लेजर एवं इनवॉइसिंग |

---

## 🚀 चलाने के निर्देश (How to Run)

### 1. बैकएंड (Laravel API):
```powershell
cd e:\project\naukarix\backend
php artisan serve --host=127.0.0.1 --port=8000
```
- **API Base URL**: `http://127.0.0.1:8000/api`

### 2. फ्रंटएंड (Next.js):
```powershell
cd e:\project\naukarix\frontend
npm run start -- -p 3000
# या डेवलपमेंट मोड के लिए:
# npm run dev
```
- **वेबसाइट URL**: `http://localhost:3000`

---

## 🔑 डेमो लॉगिन खाते (Demo Test Accounts)

| रोल (Role) | ईमेल (Email) | पासवर्ड (Password) | विवरण |
|---|---|---|---|
| **कैंडिडेट (Candidate)** | `rahul.sharma@gmail.com` | `candidate123` | राहुल शर्मा (सॉफ्टवेयर डेवलपर - लखनऊ) |
| **नियोक्ता (Employer)** | `hr@infosys.com` | `employer123` | अनन्या शर्मा (इन्फोसिस रिक्रूटर - बेंगलुरु) |
| **एडमिन (Admin)** | `admin@naukarix.in` | `admin123` | नौकरीएक्स पोर्टल एडमिनिस्ट्रेटर |

> *नोट: लॉगिन पेज (`/auth/login`) पर **1-Click Demo Login** बटन भी उपलब्ध हैं, जिससे बिना टाइप किए तुरंत कैंडिडेट, रिक्रूटर या एडमिन पैनल में प्रवेश किया जा सकता है।*
