'use client';

import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  Send, 
  CheckCircle2, 
  User as UserIcon, 
  GraduationCap, 
  Briefcase, 
  Languages, 
  Phone, 
  MapPin, 
  Sparkles,
  FileCheck
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { JobListing, api } from '@/lib/api';

interface QuickBiodataModalProps {
  isOpen: boolean;
  onClose: () => void;
  job?: JobListing | null;
  onApplicationSuccess?: () => void;
}

export default function QuickBiodataModal({
  isOpen,
  onClose,
  job,
  onApplicationSuccess,
}: QuickBiodataModalProps) {
  const { language } = useLanguage();
  const { user } = useAuth();

  const [step, setStep] = useState<'form' | 'preview'>('form');

  // Form Fields
  const [fullName, setFullName] = useState(user?.name || '');
  const [fatherName, setFatherName] = useState('');
  const [dob, setDob] = useState('2000-01-01');
  const [gender, setGender] = useState('पुरुष (Male)');
  const [maritalStatus, setMaritalStatus] = useState('अविवाहित (Single)');
  const [phone, setPhone] = useState(user?.phone || '');
  const [altPhone, setAltPhone] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState(user?.current_city || '');
  const [state, setState] = useState(user?.state || '');
  const [pincode, setPincode] = useState('');

  // Education
  const [qualification, setQualification] = useState('10वीं पास (10th Pass)');
  const [schoolBoard, setSchoolBoard] = useState('');
  const [passingYear, setPassingYear] = useState('2022');
  const [percentage, setPercentage] = useState('');

  // Experience & Skills
  const [expType, setExpType] = useState<'fresher' | 'experienced'>('fresher');
  const [previousRole, setPreviousRole] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [experienceDuration, setExperienceDuration] = useState('1 Year');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([
    'हिंदी बातचीत (Good Hindi Communication)',
    'कॉल रिसीव करना (Call Handling)'
  ]);
  const [otherSkills, setOtherSkills] = useState('');
  const [languagesKnown, setLanguagesKnown] = useState('हिंदी (Hindi), बुनियादी अंग्रेजी (Basic English)');

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const quickSkillsList = [
    'कॉल सेंटर / टेलीकॉलिंग (Telecalling)',
    'दुकान / रिटेल सेल्स (Retail & Sales)',
    'कंप्यूटर व टाइपिंग (Computer & Typing)',
    'ड्राइविंग (2/4 Wheeler License)',
    'डिलीवरी बॉय (Delivery Partner)',
    'होटल / रेस्टोरेंट सर्विस (Hotel & Waiter)',
    'सिक्योरिटी गार्ड (Security Guard)',
    'ऑफिस बॉय / हेल्पर (Peon / Helper)',
    'बिलिंग व कैशियर (Billing & Cashier)',
    'इलेक्ट्रीशियन / प्लंबर (Electrician/Plumber)'
  ];

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handlePrintOrDownload = () => {
    window.print();
  };

  const generateBiodataText = () => {
    return `
=========================================
            BIODATA / RESUME
=========================================
Name: ${fullName}
Father's Name: ${fatherName || 'N/A'}
Date of Birth: ${dob} | Gender: ${gender}
Marital Status: ${maritalStatus}
Contact: ${phone} ${altPhone ? `| Alt: ${altPhone}` : ''}
Email: ${email || 'N/A'}
Address: ${address ? `${address}, ` : ''}${city}, ${state} ${pincode ? `- ${pincode}` : ''}

-----------------------------------------
ACADEMIC QUALIFICATION
-----------------------------------------
Highest Level: ${qualification}
Board / School: ${schoolBoard || 'State Board'}
Passing Year: ${passingYear} | Marks/Grade: ${percentage || 'Passed'}

-----------------------------------------
WORK EXPERIENCE & SKILLS
-----------------------------------------
Experience: ${expType === 'fresher' ? 'Fresher (नई शुरुआत)' : `${previousRole} at ${companyName} (${experienceDuration})`}
Key Skills: ${selectedSkills.join(', ')} ${otherSkills ? `| ${otherSkills}` : ''}
Languages: ${languagesKnown}

Declaration: I hereby declare that the above information is true and correct to the best of my knowledge.
    `.trim();
  };

  const handleSubmitDirectApplication = async () => {
    if (!job) return;
    if (!fullName || !phone) {
      setError(language === 'hi' ? 'कृपया अपना नाम और मोबाइल नंबर भरें।' : 'Please enter your Name and Mobile number.');
      return;
    }

    setSubmitting(true);
    setError(null);

    const biodataSummary = generateBiodataText();

    try {
      await api.applyJob(job.id, {
        full_name: fullName,
        email: email || `${phone.replace(/\D/g, '') || 'candidate'}@naukarix.in`,
        phone: phone,
        current_city: city || 'India',
        total_experience: expType === 'fresher' ? 0 : 1,
        cover_letter: biodataSummary,
        resume_url: 'AUTO_GENERATED_BIODATA',
      });

      setSubmitted(true);
      if (onApplicationSuccess) {
        onApplicationSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'Application submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-yellow-200" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
                  1-Minute Quick Builder
                </span>
                <span className="text-[11px] text-orange-100">
                  {language === 'hi' ? 'बिना रिज्यूमे सीधा आवेदन' : 'Instant Biodata'}
                </span>
              </div>
              <h2 className="text-lg font-black mt-0.5">
                {language === 'hi' ? 'फ्री बायोडाटा व रिज्यूमे फॉर्म' : 'Instant Bio-Data / Resume Maker'}
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setStep(step === 'form' ? 'preview' : 'form')}
              className="bg-white text-orange-700 font-bold px-3 py-1.5 rounded-xl text-xs hover:bg-orange-50 transition shadow-xs"
            >
              {step === 'form' 
                ? (language === 'hi' ? '👀 रिज्यूमे देखें' : '👀 View Resume') 
                : (language === 'hi' ? '✏️ फॉर्म एडिट करें' : '✏️ Edit Form')}
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">

          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-slate-900">
                {language === 'hi' ? 'बधाई! आपका बायोडाटा सफलतापूर्वक सबमिट हो गया' : 'Success! Your Biodata Has Been Submitted'}
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                {language === 'hi'
                  ? `आपकी अर्जी "${job?.title}" के लिए नियोक्ता को भेज दी गई है। आप इसे भविष्य के लिए डाउनलोड भी कर सकते हैं।`
                  : `Your details have been submitted to ${job?.company_name}. You can also download or print this biodata for other interviews.`}
              </p>
              <div className="flex items-center justify-center space-x-3 pt-3">
                <button
                  onClick={() => setStep('preview')}
                  className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-md flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>{language === 'hi' ? 'बायोडाटा डाउनलोड / प्रिंट करें' : 'Download / Print Biodata'}</span>
                </button>
                <button
                  onClick={onClose}
                  className="border border-slate-300 text-slate-700 font-bold px-6 py-2.5 rounded-xl text-xs hover:bg-slate-50"
                >
                  {language === 'hi' ? 'बंद करें' : 'Close'}
                </button>
              </div>
            </div>
          ) : step === 'form' ? (
            <div className="space-y-6 text-xs">
              
              {/* Job notice context */}
              {job && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-amber-700">Applying for:</span>
                    <p className="font-black text-slate-900 text-sm">{job.title}</p>
                    <p className="text-[11px] text-slate-500">{job.company_name} • {job.location_display}</p>
                  </div>
                  <span className="px-2.5 py-1 bg-amber-200 text-amber-900 rounded-full font-bold text-[10px]">
                    No Resume Needed
                  </span>
                </div>
              )}

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl font-bold">
                  {error}
                </div>
              )}

              {/* SECTION 1: PERSONAL INFORMATION */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-900 flex items-center space-x-2 text-sm">
                  <UserIcon className="w-4 h-4 text-orange-600" />
                  <span>1. {language === 'hi' ? 'व्यक्तिगत विवरण (Personal Details)' : 'Personal Details'}</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      {language === 'hi' ? 'पूरा नाम (Full Name)' : 'Full Name'} *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="उदा. राहुल कुमार शर्मा"
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      {language === 'hi' ? 'पिता का नाम (Father\'s Name)' : 'Father\'s Name'}
                    </label>
                    <input
                      type="text"
                      value={fatherName}
                      onChange={(e) => setFatherName(e.target.value)}
                      placeholder="उदा. श्री रमेश शर्मा"
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      {language === 'hi' ? 'मोबाइल नंबर (WhatsApp)' : 'Mobile / WhatsApp'} *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="9876543210"
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      {language === 'hi' ? 'वैकल्पिक नंबर (Alternate Phone)' : 'Alternate Phone'}
                    </label>
                    <input
                      type="tel"
                      value={altPhone}
                      onChange={(e) => setAltPhone(e.target.value)}
                      placeholder="9876500000"
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      {language === 'hi' ? 'जन्म तिथि (Date of Birth)' : 'Date of Birth'}
                    </label>
                    <input
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      {language === 'hi' ? 'लिंग (Gender)' : 'Gender'}
                    </label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 outline-hidden"
                    >
                      <option value="पुरुष (Male)">पुरुष (Male)</option>
                      <option value="महिला (Female)">महिला (Female)</option>
                      <option value="अन्य (Other)">अन्य (Other)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      {language === 'hi' ? 'शहर / जिला (City)' : 'City / District'} *
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Lucknow / Varanasi"
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      {language === 'hi' ? 'राज्य (State)' : 'State'}
                    </label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="Uttar Pradesh"
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      {language === 'hi' ? 'पिनकोड (PIN)' : 'PIN Code'}
                    </label>
                    <input
                      type="text"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="226001"
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    {language === 'hi' ? 'पूरा स्थानीय पता (Full Address)' : 'Full Address'}
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="मकान नं, गली/मोहल्ला, लैंडमार्क"
                    className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 outline-hidden"
                  />
                </div>
              </div>

              {/* SECTION 2: EDUCATION */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-900 flex items-center space-x-2 text-sm">
                  <GraduationCap className="w-4 h-4 text-orange-600" />
                  <span>2. {language === 'hi' ? 'शैक्षणिक योग्यता (Education)' : 'Education Qualification'}</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      {language === 'hi' ? 'उच्चतम योग्यता (Highest Qualification)' : 'Highest Level'} *
                    </label>
                    <select
                      value={qualification}
                      onChange={(e) => setQualification(e.target.value)}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 outline-hidden font-bold"
                    >
                      <option value="8वीं पास (8th Pass)">8वीं पास (8th Pass)</option>
                      <option value="10वीं पास (10th Pass / High School)">10वीं पास (10th Pass / High School)</option>
                      <option value="12वीं पास (12th Pass / Intermediate)">12वीं पास (12th Pass / Intermediate)</option>
                      <option value="ITI / डिप्लोमा (ITI / Diploma)">ITI / डिप्लोमा (ITI / Diploma)</option>
                      <option value="स्नातक (Graduate - BA/BCom/BSc/etc)">स्नातक (Graduate - BA/BCom/BSc/etc)</option>
                      <option value="परास्नातक (Post Graduate - MA/MCom/etc)">परास्नातक (Post Graduate)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      {language === 'hi' ? 'बोर्ड या स्कूल / कॉलेज का नाम' : 'Board or School/College'}
                    </label>
                    <input
                      type="text"
                      value={schoolBoard}
                      onChange={(e) => setSchoolBoard(e.target.value)}
                      placeholder="उदा. UP Board / CBSE / Local School"
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      {language === 'hi' ? 'उत्तीर्ण वर्ष (Passing Year)' : 'Passing Year'}
                    </label>
                    <input
                      type="text"
                      value={passingYear}
                      onChange={(e) => setPassingYear(e.target.value)}
                      placeholder="2022"
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      {language === 'hi' ? 'प्रतिशत / ग्रेड (Percentage / Grade)' : 'Percentage / Grade'}
                    </label>
                    <input
                      type="text"
                      value={percentage}
                      onChange={(e) => setPercentage(e.target.value)}
                      placeholder="65% / 1st Division"
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: WORK EXPERIENCE & SKILLS */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-900 flex items-center space-x-2 text-sm">
                  <Briefcase className="w-4 h-4 text-orange-600" />
                  <span>3. {language === 'hi' ? 'कार्य अनुभव व हुनर (Experience & Skills)' : 'Experience & Skills'}</span>
                </h4>

                <div className="flex items-center space-x-4 mb-2">
                  <label className="flex items-center space-x-2 cursor-pointer font-bold text-slate-800">
                    <input
                      type="radio"
                      name="expType"
                      checked={expType === 'fresher'}
                      onChange={() => setExpType('fresher')}
                      className="text-orange-600 focus:ring-orange-500"
                    />
                    <span>{language === 'hi' ? 'मैं फ्रेशर हूँ (Fresher - पहली नौकरी)' : 'Fresher (Looking for 1st Job)'}</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer font-bold text-slate-800">
                    <input
                      type="radio"
                      name="expType"
                      checked={expType === 'experienced'}
                      onChange={() => setExpType('experienced')}
                      className="text-orange-600 focus:ring-orange-500"
                    />
                    <span>{language === 'hi' ? 'मुझे पहले का अनुभव है (Experienced)' : 'Experienced'}</span>
                  </label>
                </div>

                {expType === 'experienced' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-white rounded-xl border border-slate-200">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">
                        {language === 'hi' ? 'पिछला पद / काम' : 'Previous Job Role'}
                      </label>
                      <input
                        type="text"
                        value={previousRole}
                        onChange={(e) => setPreviousRole(e.target.value)}
                        placeholder="Telecaller / Sales / Delivery"
                        className="w-full px-3 py-2 bg-slate-50 rounded-lg border border-slate-300 outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1">
                        {language === 'hi' ? 'कंपनी / दुकान का नाम' : 'Company or Store Name'}
                      </label>
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Sharma Store / Zomato"
                        className="w-full px-3 py-2 bg-slate-50 rounded-lg border border-slate-300 outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1">
                        {language === 'hi' ? 'कितना समय काम किया' : 'Duration'}
                      </label>
                      <input
                        type="text"
                        value={experienceDuration}
                        onChange={(e) => setExperienceDuration(e.target.value)}
                        placeholder="6 Months / 1 Year"
                        className="w-full px-3 py-2 bg-slate-50 rounded-lg border border-slate-300 outline-hidden"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">
                    {language === 'hi' ? 'आप क्या-क्या काम कर सकते हैं? (चुनें):' : 'Select What Work You Can Do:'}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {quickSkillsList.map((skill) => {
                      const active = selectedSkills.includes(skill);
                      return (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => toggleSkill(skill)}
                          className={`px-3 py-1.5 rounded-xl font-bold transition text-xs flex items-center space-x-1.5 ${
                            active
                              ? 'bg-orange-600 text-white shadow-xs'
                              : 'bg-white text-slate-700 border border-slate-200 hover:border-orange-300'
                          }`}
                        >
                          <span>{skill}</span>
                          {active && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      {language === 'hi' ? 'अन्य कोई हुनर (Other Skills)' : 'Other Skills'}
                    </label>
                    <input
                      type="text"
                      value={otherSkills}
                      onChange={(e) => setOtherSkills(e.target.value)}
                      placeholder="उदा. फोटोशॉप, हिंदी टाइपिंग, गाड़ी मैकेनिक"
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      {language === 'hi' ? 'भाषा ज्ञान (Languages Known)' : 'Languages Known'}
                    </label>
                    <input
                      type="text"
                      value={languagesKnown}
                      onChange={(e) => setLanguagesKnown(e.target.value)}
                      placeholder="हिंदी, अंग्रेजी, भोजपुरी"
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setStep('preview')}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl border-2 border-orange-600 text-orange-600 hover:bg-orange-50 font-black transition flex items-center justify-center space-x-2 text-xs"
                >
                  <Printer className="w-4 h-4" />
                  <span>{language === 'hi' ? 'बायोडाटा प्रीव्यू व प्रिंट / PDF' : 'Preview & Print / PDF'}</span>
                </button>

                {job ? (
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={handleSubmitDirectApplication}
                    className="w-full sm:w-auto px-8 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black transition shadow-lg flex items-center justify-center space-x-2 text-xs"
                  >
                    <Send className="w-4 h-4" />
                    <span>
                      {submitting 
                        ? (language === 'hi' ? 'सबमिट हो रहा है...' : 'Submitting...')
                        : (language === 'hi' ? '🚀 यह बायोडाटा जमा करें और आवेदन करें' : '🚀 Submit Biodata & Apply Now')}
                    </span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setStep('preview')}
                    className="w-full sm:w-auto px-8 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black transition shadow-lg flex items-center justify-center space-x-2 text-xs"
                  >
                    <Download className="w-4 h-4" />
                    <span>{language === 'hi' ? 'बायोडाटा तैयार है (डाउनलोड करें)' : 'Download Biodata PDF'}</span>
                  </button>
                )}
              </div>

            </div>
          ) : (
            /* PREVIEW SCREEN (A4 Printable Bio-Data Sheet) */
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-slate-100 p-3 rounded-xl border border-slate-200">
                <p className="text-xs text-slate-600 font-bold">
                  {language === 'hi' ? 'यह आपका तैयार बायोडाटा है। आप इसे सीधे प्रिंट या PDF में सुरक्षित कर सकते हैं।' : 'This is your ready-to-use Biodata. You can print or save as PDF.'}
                </p>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handlePrintOrDownload}
                    className="bg-orange-600 text-white px-4 py-2 rounded-xl font-bold text-xs flex items-center space-x-1.5 shadow-md hover:bg-orange-700"
                  >
                    <Printer className="w-4 h-4" />
                    <span>{language === 'hi' ? 'प्रिंट / सेव PDF' : 'Print / Save PDF'}</span>
                  </button>
                </div>
              </div>

              {/* Printable Document Box */}
              <div id="biodata-print-sheet" className="bg-white border-2 border-slate-800 p-8 rounded-lg shadow-sm text-slate-900 font-sans max-w-2xl mx-auto space-y-6">
                
                {/* Header */}
                <div className="text-center border-b-2 border-slate-800 pb-4">
                  <h1 className="text-2xl font-black uppercase tracking-wider">BIO-DATA / RESUME</h1>
                  <p className="text-sm font-bold text-slate-700 mt-1">{fullName || 'Candidate Name'}</p>
                  <p className="text-xs text-slate-600">
                    Phone: {phone || 'N/A'} {altPhone ? `| Alt: ${altPhone}` : ''} | Email: {email || 'N/A'}
                  </p>
                  <p className="text-xs text-slate-600">
                    {address ? `${address}, ` : ''}{city || 'City'}, {state || 'State'} {pincode ? `- ${pincode}` : ''}
                  </p>
                </div>

                {/* Personal Information */}
                <div>
                  <h2 className="text-xs font-black uppercase bg-slate-200 px-3 py-1 border border-slate-400 mb-2">
                    1. PERSONAL DETAILS (व्यक्तिगत विवरण)
                  </h2>
                  <div className="grid grid-cols-2 gap-y-1.5 gap-x-4 text-xs">
                    <div><span className="font-bold">Father's Name:</span> {fatherName || 'N/A'}</div>
                    <div><span className="font-bold">Date of Birth:</span> {dob}</div>
                    <div><span className="font-bold">Gender:</span> {gender}</div>
                    <div><span className="font-bold">Marital Status:</span> {maritalStatus}</div>
                    <div><span className="font-bold">Nationality:</span> Indian (भारतीय)</div>
                    <div><span className="font-bold">Languages Known:</span> {languagesKnown}</div>
                  </div>
                </div>

                {/* Educational Qualifications */}
                <div>
                  <h2 className="text-xs font-black uppercase bg-slate-200 px-3 py-1 border border-slate-400 mb-2">
                    2. EDUCATIONAL QUALIFICATION (शैक्षणिक योग्यता)
                  </h2>
                  <table className="w-full border-collapse border border-slate-400 text-xs text-left">
                    <thead>
                      <tr className="bg-slate-100">
                        <th className="border border-slate-400 px-2 py-1">Examination / Degree</th>
                        <th className="border border-slate-400 px-2 py-1">Board / School</th>
                        <th className="border border-slate-400 px-2 py-1">Year</th>
                        <th className="border border-slate-400 px-2 py-1">Percentage / Div</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-slate-400 px-2 py-1 font-bold">{qualification}</td>
                        <td className="border border-slate-400 px-2 py-1">{schoolBoard || 'State Board'}</td>
                        <td className="border border-slate-400 px-2 py-1">{passingYear}</td>
                        <td className="border border-slate-400 px-2 py-1">{percentage || 'Passed'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Experience & Skills */}
                <div>
                  <h2 className="text-xs font-black uppercase bg-slate-200 px-3 py-1 border border-slate-400 mb-2">
                    3. WORK EXPERIENCE & SKILLS (कार्य अनुभव व हुनर)
                  </h2>
                  <div className="text-xs space-y-2">
                    <div>
                      <span className="font-bold">Experience Status: </span>
                      {expType === 'fresher' 
                        ? 'Fresher (Seeking entry-level opportunity)' 
                        : `${previousRole} at ${companyName} (${experienceDuration})`}
                    </div>
                    <div>
                      <span className="font-bold">Key Skills & Capabilities: </span>
                      <span>{selectedSkills.join(', ')} {otherSkills ? `| ${otherSkills}` : ''}</span>
                    </div>
                  </div>
                </div>

                {/* Declaration */}
                <div className="pt-4 border-t border-slate-300 text-xs">
                  <p className="italic text-slate-700">
                    "I hereby declare that all the information provided in this Bio-data is true, complete and correct to the best of my knowledge and belief."
                  </p>
                  <div className="flex justify-between items-end mt-8 pt-4">
                    <div>
                      <p>Date: {new Date().toLocaleDateString('en-IN')}</p>
                      <p>Place: {city || 'India'}</p>
                    </div>
                    <div className="text-center">
                      <div className="w-36 border-b border-slate-800 mb-1"></div>
                      <p className="font-bold">Signature / हस्ताक्षर</p>
                      <p className="text-[11px] text-slate-600">({fullName || 'Applicant'})</p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Bottom apply trigger if opened in job context */}
              {job && (
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-2xl flex items-center justify-between">
                  <div>
                    <p className="text-xs font-black text-slate-900">
                      {language === 'hi' ? 'क्या आप इस बायोडाटा के साथ सीधे आवेदन करना चाहते हैं?' : 'Apply directly to this job with this biodata?'}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {job.title} • {job.company_name}
                    </p>
                  </div>
                  <button
                    onClick={handleSubmitDirectApplication}
                    disabled={submitting}
                    className="bg-orange-600 hover:bg-orange-700 text-white font-black px-6 py-2.5 rounded-xl text-xs shadow-md transition flex items-center space-x-1.5"
                  >
                    <Send className="w-4 h-4" />
                    <span>{submitting ? 'Submitting...' : (language === 'hi' ? 'आवेदन सबमिट करें' : 'Submit Application')}</span>
                  </button>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
