# HyperPay Integration Guide: Visa & Mastercard Mobile Payments

## Overview

**HyperPay** (operated by Gate2Play) is a leading payment gateway in the MENA region that provides secure payment processing for Visa and Mastercard transactions. The platform offers both web and mobile SDK integrations with comprehensive API support.

## Key Requirements for Backend Implementation

### 1. Merchant Account Setup
- **Contact**: yrahim@gate2play.com to set up merchant account
- **Timeline**: 14-20 working days for account approval
- **Supported Currencies**: SAR, AED, USD (with JOD and EGP in development)
- **Compliance**: PCI-DSS Level 1 certified, ISO27701 and ISO27001 certified

### 2. Essential Backend APIs

You need to implement **two primary endpoints** on your backend:

#### Endpoint 1: Generate Checkout ID
```
POST /checkout
```
**Purpose**: Create a payment session and return checkout ID to mobile app

**Required Parameters**:
- `amount`: Payment amount (e.g., "48.99")
- `currency`: Currency code (e.g., "EUR", "USD", "SAR")
- `paymentType`: Transaction type ("DB" for debit, "PA" for pre-authorization)

#### Endpoint 2: Payment Status Verification
```
GET /paymentStatus?resourcePath={resourcePath}
```
**Purpose**: Verify transaction completion and return payment result

## Mobile SDK Integration Architecture

### Supported Payment Brands
- **VISA**: Primary credit/debit card support
- **MASTER**: Mastercard credit/debit card support
- **MADA**: Local Saudi payment method
- **STC_PAY**: STC Pay wallet
- **APPLEPAY**: Apple Pay integration

### Integration Flow

1. **Mobile App** → Request checkout ID from your backend
2. **Your Backend** → Create checkout session with HyperPay API
3. **Mobile App** → Present payment UI using HyperPay SDK
4. **HyperPay SDK** → Process payment and return resource path
5. **Mobile App** → Send resource path to your backend for verification
6. **Your Backend** → Verify payment status with HyperPay API

## Backend Server Configuration

### API Endpoints

#### Test Environment
- **Base URL**: `https://test.oppwa.com/v1/`
- **Checkout Creation**: `https://test.oppwa.com/v1/checkouts`
- **Payment Status**: `https://test.oppwa.com/v1/checkouts/{checkoutId}/payment`
- **Payment Widget**: `https://test.oppwa.com/v1/paymentWidgets.js`
- **Demo Server**: `https://dev.hyperpay.com/hyperpay-demo/getcheckoutid.php`

#### Production Environment  
- **Base URL**: `https://eu-prod.oppwa.com/v1/` or `https://oppwa.com/v1/`
- **Checkout Creation**: `https://eu-prod.oppwa.com/v1/checkouts`
- **Payment Status**: `https://eu-prod.oppwa.com/v1/checkouts/{checkoutId}/payment`
- **Payment Widget**: `https://oppwa.com/v1/paymentWidgets.js`

### Authentication
- **Authorization Header**: `Bearer {ACCESS_TOKEN}`
- **Entity ID**: Required for all API calls
- **Access Token**: Base64 encoded credentials

## SDK Requirements for Mobile Platforms

## Mobile SDK Configuration Details

### Android Implementation

#### Required Dependencies (build.gradle)
```gradle
// App-level build.gradle
android {
    compileSdkVersion 33
    defaultConfig {
        minSdkVersion 21
        targetSdkVersion 33
    }
    buildFeatures {
        viewBinding true
    }
}

dependencies {
    implementation fileTree(dir: "libs", include: ["*.aar"])
    implementation "org.jetbrains.kotlin:kotlin-stdlib-jdk7:$kotlin_version"
    
    // For Development
    debugImplementation(name: "ipworks3ds_sdk", ext: 'aar')
    
    // For Production
    releaseImplementation(name: "ipworks3ds_sdk_deploy", ext: 'aar')
    
    implementation(name: "oppwa.mobile-release", ext: 'aar')
    implementation "com.google.android.material:material:1.6.1"
    implementation "androidx.appcompat:appcompat:1.5.1"
    implementation 'com.google.android.gms:play-services-wallet:19.1.0'
    implementation "androidx.browser:browser:1.4.0"
    implementation "com.google.code.gson:gson:2.8.9"
    implementation "androidx.lifecycle:lifecycle-viewmodel-ktx:2.5.1"
    implementation "androidx.webkit:webkit:1.4.0"
    implementation "androidx.fragment:fragment-ktx:1.4.1"
}
```

#### AndroidManifest.xml Configuration
```xml
<application>
    <!-- HyperPay Required Services -->
    <receiver 
        android:name=".CheckoutBroadcastReceiver" 
        android:exported="false" />
    
    <service 
        android:name="com.oppwa.mobile.connect.service.ConnectService" 
        android:exported="false" />
    
    <activity 
        android:name="com.oppwa.mobile.connect.checkout.dialog.CheckoutActivity"
        android:configChanges="orientation"
        android:exported="false"
        android:launchMode="singleTop"
        android:theme="@style/Theme.Checkout.Light"
        android:windowSoftInputMode="adjustPan"
        tools:replace="android:theme,android:windowSoftInputMode" />
    
    <!-- URL Scheme for Payment Redirect -->
    <activity 
        android:name=".MainActivity"
        android:exported="true"
        android:launchMode="singleTop">
        <intent-filter>
            <action android:name="android.intent.action.VIEW" />
            <category android:name="android.intent.category.DEFAULT" />
            <category android:name="android.intent.category.BROWSABLE" />
            <data android:scheme="com.yourapp.package" />
        </intent-filter>
    </activity>
</application>
```

#### Android Payment Implementation
```kotlin
import com.oppwa.mobile.connect.checkout.meta.CheckoutSettings
import com.oppwa.mobile.connect.provider.Connect

class MainActivity : AppCompatActivity() {
    private val checkoutLauncher = registerForActivityResult(
        CheckoutActivityResultContract()
    ) { result -> handleCheckoutResult(result) }
    
    private fun startPayment(checkoutId: String) {
        val paymentBrands = hashSetOf("VISA", "MASTER")
        val checkoutSettings = CheckoutSettings(
            checkoutId, 
            paymentBrands, 
            Connect.ProviderMode.TEST
        )
        checkoutSettings.shopperResultUrl = "com.yourapp.package://result"
        
        checkoutLauncher.launch(checkoutSettings)
    }
    
    private fun handleCheckoutResult(result: CheckoutActivityResult) {
        if (result.isCanceled) {
            // User cancelled payment
            return
        }
        
        val resourcePath = result.resourcePath
        if (resourcePath != null) {
            // Send resourcePath to your backend for verification
            verifyPaymentStatus(resourcePath)
        }
    }
    
    override fun onNewIntent(intent: Intent?) {
        super.onNewIntent(intent)
        // Handle deep link redirect from payment
        if (intent?.scheme == "com.yourapp.package") {
            // Process payment result
        }
    }
}
```

### iOS Implementation

#### Required Frameworks
- `OPPWAMobile.xcframework`
- `ipworks3ds_sdk.xcframework` (development)
- `ipworks3ds_sdk_deploy.xcframework` (production)

#### Xcode Project Configuration
1. **Framework Integration**:
   - Drag frameworks to "Frameworks, Libraries, and Embedded Content"
   - Set "Embed & Sign" for both frameworks

2. **URL Scheme Setup**:
   - Target → Info → URL Types
   - Add URL Scheme: `com.yourapp.bundleid.payments`

3. **Info.plist Configuration**:
```xml
<key>LSApplicationQueriesSchemes</key>
<array>
    <string>com.yourapp.bundleid.payments</string>
</array>
```

#### iOS Payment Implementation
```swift
import OPPWAMobile

class PaymentViewController: UIViewController {
    var checkoutProvider: OPPCheckoutProvider?
    var paymentProvider: OPPPaymentProvider?
    
    func initializePayment() {
        paymentProvider = OPPPaymentProvider(mode: .test)
    }
    
    func startPayment(checkoutId: String) {
        let checkoutSettings = OPPCheckoutSettings()
        checkoutSettings.paymentBrands = ["VISA", "MASTER"]
        checkoutSettings.shopperResultURL = "com.yourapp.bundleid.payments://result"
        
        checkoutProvider = OPPCheckoutProvider(
            paymentProvider: paymentProvider!,
            checkoutID: checkoutId,
            settings: checkoutSettings
        )
        
        checkoutProvider?.presentCheckout(forSubmittingTransactionCompletionHandler: { 
            (transaction, error) in
            if let transaction = transaction {
                if transaction.type == .synchronous {
                    if let resourcePath = transaction.resourcePath {
                        // Send resourcePath to backend for verification
                        self.verifyPaymentStatus(resourcePath: resourcePath)
                    }
                } else {
                    // Handle asynchronous payment (redirects)
                }
            }
        }, cancelHandler: {
            // User cancelled payment
        })
    }
    
    // Handle URL scheme redirect
    func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey : Any] = [:]) -> Bool {
        if url.scheme == "com.yourapp.bundleid.payments" {
            // Process payment result
            return true
        }
        return false
    }
}

## Testing Configuration

### Test Card Numbers
Based on the documentation, HyperPay provides these test cards:

**Visa Test Cards**:
- **Success Response**: `4005550000000001` (05/17, CVV: 123)
- **Failure Response**: `4005550000000001` (05/18, CVV: 123)

**Additional Test Cards** (from Flutter documentation):
- **Test Card**: `5541805721646120` (12/2023, CVV: 123)

### Environment Configuration
```javascript
// Test Mode
mode: "CONNECTOR_TEST"
providerMode: OPPProviderMode.test

// Live Mode
mode: "LIVE" 
providerMode: OPPProviderMode.live
```

## Backend Implementation Steps

### Step 1: Credentials Setup
After merchant account approval, you'll receive:
- **Entity ID**: Unique merchant identifier
- **Access Token**: API authentication token
- **Channel/Sender**: Specific payment channel configuration
- **Login/Password**: Account credentials

## Complete API Implementation

### 1. Checkout Creation API

#### Endpoint
```http
POST https://test.oppwa.com/v1/checkouts
Content-Type: application/x-www-form-urlencoded
Authorization: Bearer {ACCESS_TOKEN}
```

#### Required Parameters
```
entityId={YOUR_ENTITY_ID}
amount=92.00
currency=EUR
paymentType=DB
merchantTransactionId=Order-123
customer.email=john@example.com
customer.givenName=John
customer.surname=Doe
customer.ip=123.123.123.123
billing.city=City
billing.country=US
billing.street1=Street Address
```

#### Optional Parameters for Enhanced Security
```
customParameters[3DS2_enrolled]=true
customer.mobile=9665xxxxxxxx
billing.state=State
billing.postcode=12345
descriptor=Store Name - Product Description
shopperResultUrl=com.yourapp.package://result
createRegistration=true  // For tokenization
recurringType=INITIAL    // For recurring payments
```

#### Response Format
```json
{
  "id": "CHECKOUT_ID_HERE",
  "result": {
    "code": "000.200.100",
    "description": "successfully created checkout"
  },
  "script_url": "https://test.oppwa.com/v1/paymentWidgets.js?checkoutId=CHECKOUT_ID",
  "buildNumber": "...",
  "timestamp": "2025-01-20 10:30:45+0000",
  "ndc": "NDC_VALUE"
}
```

### 2. Payment Status API

#### Endpoint
```http
GET https://test.oppwa.com/v1/checkouts/{checkoutId}/payment?entityId={ENTITY_ID}
Authorization: Bearer {ACCESS_TOKEN}
```

#### Alternative Status Check (Using Resource Path)
```http
GET https://test.oppwa.com/{resourcePath}?entityId={ENTITY_ID}
Authorization: Bearer {ACCESS_TOKEN}
```

#### Success Response
```json
{
  "id": "8ac7a4a08e10b158018e1486506e0397",
  "paymentType": "DB",
  "paymentBrand": "VISA",
  "amount": "92.00",
  "currency": "EUR",
  "descriptor": "Store Name",
  "merchantTransactionId": "Order-123",
  "result": {
    "code": "000.000.000",
    "description": "Transaction succeeded"
  },
  "resultDetails": {
    "ExtendedDescription": "Successfully processed",
    "AuthCode": "f2e7a815c3",
    "clearingInstituteName": "BANK_NAME"
  },
  "card": {
    "bin": "420000",
    "last4Digits": "0000",
    "holder": "John Doe",
    "expiryMonth": "05",
    "expiryYear": "2025"
  },
  "customParameters": {},
  "risk": {},
  "buildNumber": "...",
  "timestamp": "2025-01-20 10:35:22+0000",
  "ndc": "NDC_VALUE"
}
```

### 3. Result Code Interpretation

#### Success Codes
- `000.000.000` - Transaction succeeded
- `000.100.1xx` - Transaction succeeded (various sub-codes)

#### Pending Codes  
- `000.200.000` - Transaction pending
- `800.400.5xx` - Transaction pending (asynchronous)

#### Failure Codes
- `100.4xx.xxx` - Transaction declined
- `800.1xx.xxx` - System/communication error
- `900.4xx.xxx` - Risk management declined

## Security Considerations

### Mobile App Security
1. **URL Scheme Configuration**: Must match bundle ID + ".payments"
2. **Third-party Keyboards**: Recommended to disable for security
3. **Deep Linking**: Proper handling of shopper result URLs
4. **3DS Authentication**: Built-in 3D Secure support

### Backend Security
1. **PCI Compliance**: Follow PCI-DSS requirements
2. **API Authentication**: Secure token-based authentication
3. **Transaction Validation**: Verify payment details against order information
4. **Error Handling**: Comprehensive error response handling

## Payment Flow Implementation

### Synchronous Payments (Visa/Mastercard)
1. Generate checkout ID
2. Present payment form
3. Process payment immediately
4. Return transaction result
5. Verify status on backend

### Asynchronous Payments (Some local methods)
1. Generate checkout ID
2. Present payment form
3. Redirect to external payment provider
4. Handle callback via URL scheme
5. Verify final status

## Error Handling

### Common Error Codes
- **3000**: Bad request (400) - Check API parameters
- **Transaction Errors**: Specific transaction-related issues
- **Network Errors**: Connectivity and timeout handling

### Best Practices
1. **Comprehensive Logging**: Log all API calls and responses
2. **Retry Logic**: Implement appropriate retry mechanisms
3. **User Feedback**: Clear error messages for users
4. **Fallback Options**: Alternative payment methods

## Production Deployment

### Pre-Production Checklist
1. ✅ Test all payment scenarios (success/failure)
2. ✅ Verify 3DS authentication flow
3. ✅ Test URL scheme handling
4. ✅ Validate all error scenarios
5. ✅ Security penetration testing

### Go-Live Process
1. **Contact Account Manager**: Request live credentials
2. **Update Configuration**: Switch from test to live mode
3. **Update SDK Files**: Use production AAR/framework files
4. **SSL Certificate**: Ensure valid SSL on backend
5. **Monitor Transactions**: Set up real-time monitoring

## Support and Resources

### Official Documentation
- **Primary Docs**: `https://hyperpay.docs.oppwa.com/`
- **Mobile SDK**: First integration guide available
- **API Reference**: Comprehensive API documentation

### Contact Information
- **Account Setup**: yrahim@gate2play.com
- **Technical Support**: HyperPay technical team
- **Customer Support**: 24/7 support available

### GitHub Resources
Multiple community implementations available for different frameworks:
- React Native implementations
- Flutter plugins
- Native Android/iOS examples

## Complete Implementation Flow

### Phase 1: Backend Setup & Integration

#### Step 1: Merchant Account & Credentials
1. **Contact HyperPay**: Email yrahim@gate2play.com
2. **Account Approval**: 14-20 working days processing time
3. **Receive Credentials**:
   - Entity ID (for each payment method)
   - Access Token (Bearer token for API authentication)
   - Channel/Sender configurations
   - Test and Live environment URLs

#### Step 2: Backend API Development

**Endpoint 1: Create Checkout Session**
```http
POST /api/payment/checkout
```
**Backend Implementation**:
```javascript
// Node.js/Express example
app.post('/api/payment/checkout', async (req, res) => {
    const { amount, currency, customerInfo } = req.body;
    
    const checkoutData = {
        entityId: process.env.HYPERPAY_ENTITY_ID,
        amount: amount,
        currency: currency,
        paymentType: 'DB',
        merchantTransactionId: generateUniqueId(),
        'customer.email': customerInfo.email,
        'customer.givenName': customerInfo.firstName,
        'customer.surname': customerInfo.lastName,
        'customer.ip': req.ip,
        'billing.city': customerInfo.city,
        'billing.country': customerInfo.country,
        'billing.street1': customerInfo.address,
        'customParameters[3DS2_enrolled]': 'true'
    };
    
    try {
        const response = await axios.post(
            'https://test.oppwa.com/v1/checkouts',
            new URLSearchParams(checkoutData),
            {
                headers: {
                    'Authorization': `Bearer ${process.env.HYPERPAY_ACCESS_TOKEN}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );
        
        res.json({
            success: true,
            checkoutId: response.data.id,
            scriptUrl: response.data.script_url
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.response.data
        });
    }
});
```

**Endpoint 2: Verify Payment Status**
```http
GET /api/payment/status/:resourcePath
```
**Backend Implementation**:
```javascript
app.get('/api/payment/status/:resourcePath', async (req, res) => {
    const { resourcePath } = req.params;
    
    try {
        const response = await axios.get(
            `https://test.oppwa.com${resourcePath}?entityId=${process.env.HYPERPAY_ENTITY_ID}`,
            {
                headers: {
                    'Authorization': `Bearer ${process.env.HYPERPAY_ACCESS_TOKEN}`
                }
            }
        );
        
        const resultCode = response.data.result.code;
        const isSuccess = resultCode.startsWith('000.000.') || 
                         resultCode.startsWith('000.100.');
        
        res.json({
            success: isSuccess,
            resultCode: resultCode,
            description: response.data.result.description,
            paymentData: response.data
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.response.data
        });
    }
});
```

### Phase 2: Mobile SDK Integration

#### Step 3: Android SDK Integration

**Required Files** (Obtained from HyperPay):
- `oppwa.mobile-{version}-release.aar`
- `ipworks3ds_sdk.aar` (development)
- `ipworks3ds_sdk_deploy.aar` (production)

**Integration Steps**:
1. Place AAR files in `android/app/libs/` folder
2. Update `build.gradle` with dependencies
3. Configure `AndroidManifest.xml`
4. Implement payment activity

**Complete Android Payment Class**:
```kotlin
class PaymentManager {
    fun requestCheckoutId(amount: Double, currency: String): String? {
        // Call your backend API
        val response = apiService.createCheckout(amount, currency)
        return response.checkoutId
    }
    
    fun startPayment(checkoutId: String) {
        val paymentBrands = hashSetOf("VISA", "MASTER")
        val checkoutSettings = CheckoutSettings(
            checkoutId,
            paymentBrands,
            Connect.ProviderMode.TEST // Change to LIVE for production
        )
        checkoutSettings.shopperResultUrl = "com.yourapp.package://result"
        
        checkoutLauncher.launch(checkoutSettings)
    }
    
    fun verifyPaymentStatus(resourcePath: String) {
        // Call your backend to verify payment
        apiService.verifyPayment(resourcePath)
    }
}
```

#### Step 4: iOS SDK Integration

**Integration Steps**:
1. Add frameworks to Xcode project
2. Configure URL scheme in Info.plist
3. Set up bridging header for Objective-C
4. Implement payment controller

**Complete iOS Payment Class**:
```swift
class PaymentManager: NSObject {
    var checkoutProvider: OPPCheckoutProvider?
    let paymentProvider = OPPPaymentProvider(mode: .test)
    
    func requestCheckoutId(amount: String, currency: String, completion: @escaping (String?) -> Void) {
        // Call your backend API
        APIService.shared.createCheckout(amount: amount, currency: currency) { checkoutId in
            completion(checkoutId)
        }
    }
    
    func startPayment(checkoutId: String, from viewController: UIViewController) {
        let checkoutSettings = OPPCheckoutSettings()
        checkoutSettings.paymentBrands = ["VISA", "MASTER"]
        checkoutSettings.shopperResultURL = "com.yourapp.bundleid.payments://result"
        
        checkoutProvider = OPPCheckoutProvider(
            paymentProvider: paymentProvider,
            checkoutID: checkoutId,
            settings: checkoutSettings
        )
        
        checkoutProvider?.presentCheckout(forSubmittingTransactionCompletionHandler: { 
            (transaction, error) in
            if let transaction = transaction, transaction.type == .synchronous {
                if let resourcePath = transaction.resourcePath {
                    self.verifyPaymentStatus(resourcePath: resourcePath)
                }
            }
        }, cancelHandler: {
            // Handle cancellation
        })
    }
    
    func verifyPaymentStatus(resourcePath: String) {
        APIService.shared.verifyPayment(resourcePath: resourcePath) { result in
            // Handle payment verification result
        }
    }
}
```

### Phase 3: Security & Production Setup

#### Step 5: Security Implementation

**Mobile Security**:
```swift
// iOS: Disable third-party keyboards
func application(_ application: UIApplication, shouldAllowExtensionPointIdentifier extensionPointIdentifier: UIApplicationExtensionPointIdentifier) -> Bool {
    if extensionPointIdentifier == UIApplicationExtensionPointIdentifier.keyboard {
        return false
    }
    return true
}
```

**Backend Security**:
- Validate all payment responses against original order data
- Implement proper error handling and logging
- Use HTTPS for all API communications
- Store sensitive credentials securely (environment variables)

#### Step 6: Testing Protocol

**Test Card Numbers**:
- **Visa Success**: `4005550000000001` (05/17, CVV: 123)
- **Visa Failure**: `4005550000000001` (05/18, CVV: 123)
- **Test Card**: `5541805721646120` (12/2023, CVV: 123)

**Testing Checklist**:
1. ✅ Successful payment flow
2. ✅ Failed payment handling
3. ✅ Network error scenarios
4. ✅ 3DS authentication
5. ✅ Deep link handling
6. ✅ Payment cancellation
7. ✅ Status verification accuracy

#### Step 7: Production Deployment

**Go-Live Process**:
1. **Request Live Credentials**: Contact account manager
2. **Update Configuration**:
   ```kotlin
   // Android
   Connect.ProviderMode.LIVE
   
   // iOS  
   OPPProviderMode.live
   ```
3. **Update API URLs**: Switch to production endpoints
4. **Deploy Production AAR/Frameworks**: Use `ipworks3ds_sdk_deploy`
5. **SSL Verification**: Enable SSL verification in production

## Conclusion

HyperPay offers a robust, secure payment solution specifically designed for the MENA region with strong support for international cards (Visa/Mastercard) and local payment methods. The platform's PCI compliance and comprehensive SDK support make it suitable for enterprise-level mobile payment implementations.

**Key Success Factors**:
1. Proper backend API implementation
2. Secure mobile SDK integration
3. Comprehensive testing with provided test cards
4. Following security best practices
5. Proper error handling and user experience