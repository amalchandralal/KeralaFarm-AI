# AgroVision AI - Test Cases

| ID | Feature Area | Test Steps | Expected Result | Priority |
|---|---|---|---|---|
| **TC-AUTH-01** | Authentication | Navigate to /login. Enter valid email and password. Click Sign In. | User is redirected to /dashboard. "Welcome back" header displays user's name. | High |
| **TC-AUTH-02** | Authentication | Navigate to /login. Enter unregistered email and wrong password. Click Sign In. | Red error banner displays specific message like "No account found" or "Incorrect password". | High |
| **TC-AUTH-03** | Authentication | Navigate to /register. Click Create Account with empty fields. Then fill invalid email format. Then enter password < 6 chars. | Each validation triggers specific error message. Form does not submit. | Medium |
| **TC-SCAN-01** | Crop Diagnostics | Navigate to /scan. Upload a valid leaf/plant JPEG image. Click Analyze Image. | AI processes image and returns disease name, confidence percentage bar, treatment plan. | High |
| **TC-SCAN-02** | Crop Diagnostics | Navigate to /scan. Attempt to upload a .txt file (non-image). | File is rejected with error message OR the upload area remains showing no preview. | Medium |
| **TC-TRACK-01** | Market Pricing | Navigate to /tracker. Click "Market Prices" tab. Select a state from dropdown. | Commodity table populates with crop names, prices, and market locations. | Medium |
| **TC-GIS-01** | GIS Finder | Navigate to /places. Type "Thrissur" in search bar. Submit search. | Place cards list displays Krishi Bhavan offices. Map renders with marker pins. | Medium |
| **TC-VOICE-01** | Voice Assistant | Navigate to /voice. Observe the voice assistant widget. | AI welcome message visible. Microphone button, text input, and send button are functional. | Medium |
| **TC-API-01** | API Validation | Send POST /api/detect-disease with valid image as multipart form data. | HTTP 200. JSON body contains disease_name (string), confidence_level (number), suggested_treatment (string). | High |
| **TC-DB-01** | Database Validation | POST /api/register with unique test email. Query MongoDB users collection. | HTTP 201. User document exists in DB with correct name, email. Password is hashed (not plaintext). Test user deleted after assertion. | High |
