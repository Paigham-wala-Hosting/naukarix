# Naukarix - Mobile App API Documentation (Flutter & React Native Ready)

यह दस्तावेज़ Naukarix के मोबाइल ऐप (Android / iOS) डेवलपर्स के लिए तैयार किया गया है। बैकएंड पूरी तरह **RESTful JSON Architecture** और **Laravel Sanctum Bearer Token Authentication** पर आधारित है।

---

## 📌 बेस यूआरएल (Base URL)
- **Local Dev**: `http://10.0.2.2:8000/api` (Android Emulator) या `http://127.0.0.1:8000/api` (iOS Simulator)
- **Production**: `https://api.naukarix.in/api`

### 🔑 आवश्यक हेडर (Headers)
```http
Accept: application/json
Content-Type: application/json
Authorization: Bearer <SANCTUM_TOKEN> (Protected Endpoints के लिए)
```

---

## 📱 1. मोबाइल ऐप विशिष्ट एंडपॉइंट्स (Mobile Specific Endpoints)

### A. ऐप कॉन्फ़िगरेशन व स्प्लैश स्क्रीन (Splash / App Config)
- **विधि**: `GET /api/app/config`
- **विवरण**: ऐप लॉन्च होते ही वर्जन चेक, फोर्स अपडेट, मेंटेनेंस मोड और सपोर्ट कॉन्टैक्ट प्राप्त करने के लिए।
- **रिस्पॉन्स**:
```json
{
  "success": true,
  "app_info": {
    "app_name": "Naukarix",
    "android_latest_version": "1.0.0",
    "android_min_version": "1.0.0",
    "force_update": false,
    "maintenance_mode": false,
    "contact_whatsapp": "919876543210",
    "contact_phone": "+91 98765 43210",
    "contact_email": "support@naukarix.in"
  }
}
```

### B. फास्ट होम स्क्रीन फीड (Mobile Home Screen in 1 API Call)
- **विधि**: `GET /api/app/home?city=Lucknow&state=Uttar Pradesh`
- **विवरण**: एक ही रिक्वेस्ट में मोबाइल बैनर्स, कैटेगरीज, नजदीकी नौकरियां और 8वीं/10वीं पास नौकरियां लोड करता है।
- **रिस्पॉन्स**:
```json
{
  "success": true,
  "data": {
    "banners": [
      {
        "id": 1,
        "title": "कॉल सेंटर व टेलीकॉलिंग में सीधी भर्ती",
        "subtitle": "₹14,000 से ₹22,000 महीना + इंसेंटिव",
        "image_url": "https://..."
      }
    ],
    "categories": [...],
    "nearby_jobs": [...],
    "entry_level_jobs": [...]
  }
}
```

---

## 🔐 2. प्रमाणीकरण (Authentication APIs)

### A. लॉगिन (Login)
- **विधि**: `POST /api/login`
- **बॉडी**:
```json
{
  "email": "rahul.sharma@gmail.com",
  "password": "candidate123"
}
```
- **सफल रिस्पॉन्स (200 OK)**:
```json
{
  "success": true,
  "token": "1|qXyZ...",
  "user": {
    "id": 4,
    "name": "Rahul Sharma",
    "email": "rahul.sharma@gmail.com",
    "role": "candidate",
    "phone": "+91 99887 76655",
    "current_city": "Lucknow"
  }
}
```
*(इस `token` को मोबाइल के `FlutterSecureStorage` या `AsyncStorage` में सुरक्षित रखें)*

### B. रजिस्ट्रेशन (Register)
- **विधि**: `POST /api/register`
- **बॉडी**:
```json
{
  "name": "Amit Kumar",
  "email": "amit@example.com",
  "password": "password123",
  "role": "candidate",
  "phone": "+919876543210"
}
```

### C. वर्तमान यूजर प्रोफाइल (Get Profile)
- **विधि**: `GET /api/me`
- **हेडर**: `Authorization: Bearer <TOKEN>`

---

## 💼 3. नौकरियां खोजना एवं फिल्टर (Jobs & Search APIs)

### A. नौकरियों की सूची व स्मार्ट फिल्टर (List Jobs)
- **विधि**: `GET /api/jobs`
- **क्वेरी पैरामीटर्स**:
  - `q`: खोज कीवर्ड (उदा: `telecaller`, `waiter`, `driver`)
  - `city`: शहर का नाम (उदा: `Lucknow`, `Patna`, `Delhi`)
  - `state`: राज्य (उदा: `uttar-pradesh`, `bihar`)
  - `sector`: `private` या `government`
  - `category`: श्रेणी स्लग (उदा: `call-center-bpo`, `hotel-hospitality`)
  - `qualification`: `8th_pass`, `10th_pass`, `12th_pass`, `any_graduate`
  - `work_mode`: `remote` (WFH), `on-site`, `hybrid`
  - `is_fresher`: `true` (केवल फ्रेशर्स के लिए)
  - `sort`: `latest`, `salary_high`, `deadline`
  - `page`: पेज संख्या (Pagination)

### B. नौकरी का पूरा विवरण (Job Details)
- **विधि**: `GET /api/jobs/{slug_or_id}`
- **रिस्पॉन्स**: जॉब विवरण, कंपनी जानकारी, WhatsApp/फोन नंबर, और सम्बन्धित नौकरियां (Related Jobs)।

---

## 📝 4. आवेदन एवं रिज्यूमे (Apply & Resume APIs)

### A. नौकरी के लिए आवेदन (Apply Now)
- **विधि**: `POST /api/jobs/{id}/apply`
- **बॉडी** (Multipart Form Data या JSON):
```json
{
  "full_name": "Rahul Sharma",
  "email": "rahul@gmail.com",
  "phone": "+919876543210",
  "current_city": "Lucknow",
  "total_experience": 1.0,
  "current_ctc": "₹12,000",
  "expected_ctc": "₹16,000",
  "cover_letter": "I want to apply"
}
```

### B. रिज्यूमे अपलोड (Upload Resume PDF)
- **विधि**: `POST /api/upload-resume`
- **हेडर**: `Authorization: Bearer <TOKEN>`, `Content-Type: multipart/form-data`
- **बॉडी**: `resume`: (File, Max 10MB, PDF/DOC)

### C. मेरी अर्जियां (My Applications)
- **विधि**: `GET /api/candidate/applications`
- **हेडर**: `Authorization: Bearer <TOKEN>`
- **रिस्पॉन्स**: आवेदन की वर्तमान स्थिति (`applied`, `in_review`, `shortlisted`, `selected`, `rejected`)।

### D. सेव की गई नौकरियां (Saved / Bookmarks)
- **विधि**: `POST /api/jobs/{id}/save` (Toggle bookmark)
- **विधि**: `GET /api/candidate/saved-jobs`

---

## 🔔 5. जॉब अलर्ट्स (Job Alerts Subscription)
- **विधि**: `POST /api/job-alerts`
- **बॉडी**:
```json
{
  "email": "user@gmail.com",
  "phone": "+919876543210",
  "keyword": "Call Center",
  "sector": "private"
}
```

---

## 💡 Flutter / Dart उदाहरण कोड (Example Implementation)

```dart
import 'dart:convert';
import 'package:http/http.dart' as http;

class NaukarixApiService {
  static const String baseUrl = 'http://10.0.2.2:8000/api'; // Android Emulator
  
  // 1. Fetch Fast Home Feed
  Future<Map<String, dynamic>> getHomeFeed(String city) async {
    final response = await http.get(Uri.parse('$baseUrl/app/home?city=$city'));
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to load home feed');
    }
  }

  // 2. Candidate Login
  Future<String?> login(String email, String password) async {
    final response = await http.post(
      Uri.parse('$baseUrl/login'),
      headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
      body: jsonEncode({'email': email, 'password': password}),
    );
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return data['token']; // Store this Bearer token
    }
    return null;
  }
}
```
