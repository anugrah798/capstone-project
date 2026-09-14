import {
    createContext,
    useContext,
    useState,
} from "react";

const LanguageContext = createContext();

const translations = {
    en: {},

    ml: {
        Home: "ഹോം",
        Forecast: "പ്രവചനം",
        "Weather Map": "കാലാവസ്ഥാ മാപ്പ്",
        Favorites: "പ്രിയപ്പെട്ടവ",
        History: "ചരിത്രം",
        Alerts: "അലേർട്ടുകൾ",
        Assistant: "അസിസ്റ്റന്റ്",
        Profile: "പ്രൊഫൈൽ",
        Settings: "ക്രമീകരണങ്ങൾ",
        Logout: "ലോഗൗട്ട്",

        PREFERENCES: "മുൻഗണനകൾ",
        "Customize your SkySense AI experience.":
            "നിങ്ങളുടെ SkySense AI അനുഭവം ക്രമീകരിക്കുക.",

        Appearance: "രൂപഭാവം",
        "Choose how SkySense AI looks.":
            "SkySense AI എങ്ങനെ കാണണമെന്ന് തിരഞ്ഞെടുക്കുക.",
        "Dark Mode": "ഡാർക്ക് മോഡ്",
        "Light Mode": "ലൈറ്റ് മോഡ്",
        "Dark dashboard theme is enabled.":
            "ഡാർക്ക് ഡാഷ്ബോർഡ് തീം പ്രവർത്തനക്ഷമമാണ്.",

        "Weather Units": "കാലാവസ്ഥാ യൂണിറ്റുകൾ",
        "Select the units used throughout the weather dashboard.":
            "കാലാവസ്ഥാ ഡാഷ്ബോർഡിൽ ഉപയോഗിക്കുന്ന യൂണിറ്റുകൾ തിരഞ്ഞെടുക്കുക.",
        Temperature: "താപനില",
        "Wind Speed": "കാറ്റിന്റെ വേഗത",
        Rain: "മഴ",
        Pressure: "മർദ്ദം",

        "Region & Language": "പ്രദേശം & ഭാഷ",
        "Set your preferred region and language.":
            "നിങ്ങളുടെ ഇഷ്ടപ്പെട്ട പ്രദേശവും ഭാഷയും തിരഞ്ഞെടുക്കുക.",
        "Country / Region": "രാജ്യം / പ്രദേശം",
        Language: "ഭാഷ",

        "Weather Alert Preferences":
            "കാലാവസ്ഥാ അലേർട്ട് മുൻഗണനകൾ",
        "Choose which weather alerts you want to receive.":
            "നിങ്ങൾക്ക് ലഭിക്കേണ്ട കാലാവസ്ഥാ അലേർട്ടുകൾ തിരഞ്ഞെടുക്കുക.",
        "Rain Alerts": "മഴ അലേർട്ടുകൾ",
        "Temperature Alerts": "താപനില അലേർട്ടുകൾ",
        "UV Alerts": "UV അലേർട്ടുകൾ",
        "Strong Wind Alerts": "ശക്തമായ കാറ്റ് അലേർട്ടുകൾ",
        "Thunderstorm Alerts": "ഇടിമിന്നൽ അലേർട്ടുകൾ",

        "App & Support": "ആപ്പ് & സഹായം",
        "Explore, share and learn more about SkySense AI.":
            "SkySense AI-യെ കുറിച്ച് അറിയുകയും പങ്കിടുകയും ചെയ്യുക.",
        "Share SkySense AI": "SkySense AI പങ്കിടുക",
        "Share the app with your friends":
            "ആപ്പ് നിങ്ങളുടെ സുഹൃത്തുക്കളുമായി പങ്കിടുക",
        "Rate SkySense AI": "SkySense AI റേറ്റ് ചെയ്യുക",
        "Tell us how you like the app":
            "ആപ്പ് നിങ്ങൾക്ക് എങ്ങനെ ഇഷ്ടപ്പെട്ടു എന്ന് അറിയിക്കുക",
        "About SkySense AI": "SkySense AI-യെ കുറിച്ച്",
        "Learn about this weather platform":
            "ഈ കാലാവസ്ഥാ പ്ലാറ്റ്‌ഫോമിനെക്കുറിച്ച് അറിയുക",
        "About Us": "ഞങ്ങളെക്കുറിച്ച്",
        "Learn more about the project":
            "പ്രോജക്ടിനെക്കുറിച്ച് കൂടുതൽ അറിയുക",
        "Terms of Use": "ഉപയോഗ നിബന്ധനകൾ",
        "Usage guidelines for SkySense AI":
            "SkySense AI ഉപയോഗത്തിനുള്ള മാർഗ്ഗനിർദ്ദേശങ്ങൾ",
        "Privacy Policy": "സ്വകാര്യതാ നയം",
        "How your information is handled":
            "നിങ്ങളുടെ വിവരങ്ങൾ എങ്ങനെ കൈകാര്യം ചെയ്യുന്നു",
        Version: "പതിപ്പ്",
        Platform: "പ്ലാറ്റ്‌ഫോം",
        "Weather Intelligence Platform":
            "കാലാവസ്ഥാ ബുദ്ധിമത്ത പ്ലാറ്റ്‌ഫോം",
    },

    hi: {
        Home: "होम",
        Forecast: "पूर्वानुमान",
        "Weather Map": "मौसम मानचित्र",
        Favorites: "पसंदीदा",
        History: "इतिहास",
        Alerts: "अलर्ट",
        Assistant: "सहायक",
        Profile: "प्रोफ़ाइल",
        Settings: "सेटिंग्स",
        Logout: "लॉग आउट",

        PREFERENCES: "प्राथमिकताएँ",
        "Customize your SkySense AI experience.":
            "अपने SkySense AI अनुभव को अनुकूलित करें।",

        Appearance: "दिखावट",
        "Choose how SkySense AI looks.":
            "SkySense AI का स्वरूप चुनें।",
        "Dark Mode": "डार्क मोड",
        "Light Mode": "लाइट मोड",
        "Dark dashboard theme is enabled.":
            "डार्क डैशबोर्ड थीम सक्षम है।",

        "Weather Units": "मौसम इकाइयाँ",
        "Select the units used throughout the weather dashboard.":
            "मौसम डैशबोर्ड में उपयोग की जाने वाली इकाइयाँ चुनें।",
        Temperature: "तापमान",
        "Wind Speed": "हवा की गति",
        Rain: "वर्षा",
        Pressure: "वायुदाब",

        "Region & Language": "क्षेत्र और भाषा",
        "Set your preferred region and language.":
            "अपना पसंदीदा क्षेत्र और भाषा चुनें।",
        "Country / Region": "देश / क्षेत्र",
        Language: "भाषा",

        "Weather Alert Preferences":
            "मौसम अलर्ट प्राथमिकताएँ",
        "Choose which weather alerts you want to receive.":
            "चुनें कि आप कौन से मौसम अलर्ट प्राप्त करना चाहते हैं।",
        "Rain Alerts": "वर्षा अलर्ट",
        "Temperature Alerts": "तापमान अलर्ट",
        "UV Alerts": "UV अलर्ट",
        "Strong Wind Alerts": "तेज़ हवा अलर्ट",
        "Thunderstorm Alerts": "आंधी-तूफान अलर्ट",

        "App & Support": "ऐप और सहायता",
        "Explore, share and learn more about SkySense AI.":
            "SkySense AI के बारे में जानें और साझा करें।",
        "Share SkySense AI": "SkySense AI साझा करें",
        "Share the app with your friends":
            "ऐप को अपने दोस्तों के साथ साझा करें",
        "Rate SkySense AI": "SkySense AI को रेट करें",
        "Tell us how you like the app":
            "हमें बताएं कि आपको ऐप कैसा लगा",
        "About SkySense AI": "SkySense AI के बारे में",
        "Learn about this weather platform":
            "इस मौसम प्लेटफ़ॉर्म के बारे में जानें",
        "About Us": "हमारे बारे में",
        "Learn more about the project":
            "प्रोजेक्ट के बारे में अधिक जानें",
        "Terms of Use": "उपयोग की शर्तें",
        "Usage guidelines for SkySense AI":
            "SkySense AI के उपयोग के दिशानिर्देश",
        "Privacy Policy": "गोपनीयता नीति",
        "How your information is handled":
            "आपकी जानकारी कैसे संभाली जाती है",
        Version: "संस्करण",
        Platform: "प्लेटफ़ॉर्म",
        "Weather Intelligence Platform":
            "मौसम बुद्धिमत्ता प्लेटफ़ॉर्म",
    },

    ta: {
        Home: "முகப்பு",
        Forecast: "முன்னறிவிப்பு",
        "Weather Map": "வானிலை வரைபடம்",
        Favorites: "பிடித்தவை",
        History: "வரலாறு",
        Alerts: "எச்சரிக்கைகள்",
        Assistant: "உதவியாளர்",
        Profile: "சுயவிவரம்",
        Settings: "அமைப்புகள்",
        Logout: "வெளியேறு",

        PREFERENCES: "விருப்பத்தேர்வுகள்",
        "Customize your SkySense AI experience.":
            "உங்கள் SkySense AI அனுபவத்தைத் தனிப்பயனாக்குங்கள்.",
        Appearance: "தோற்றம்",
        "Choose how SkySense AI looks.":
            "SkySense AI எப்படி தோன்ற வேண்டும் என்பதைத் தேர்ந்தெடுக்கவும்.",
        "Dark Mode": "டார்க் மோட்",

        "Weather Units": "வானிலை அலகுகள்",
        Temperature: "வெப்பநிலை",
        "Wind Speed": "காற்றின் வேகம்",
        Rain: "மழை",
        Pressure: "காற்றழுத்தம்",

        "Region & Language": "பகுதி & மொழி",
        "Set your preferred region and language.":
            "உங்கள் விருப்பமான பகுதி மற்றும் மொழியைத் தேர்ந்தெடுக்கவும்.",
        "Country / Region": "நாடு / பகுதி",
        Language: "மொழி",

        "Weather Alert Preferences":
            "வானிலை எச்சரிக்கை விருப்பங்கள்",
        "Rain Alerts": "மழை எச்சரிக்கைகள்",
        "Temperature Alerts": "வெப்பநிலை எச்சரிக்கைகள்",
        "UV Alerts": "UV எச்சரிக்கைகள்",
        "Strong Wind Alerts": "பலத்த காற்று எச்சரிக்கைகள்",
        "Thunderstorm Alerts":
            "இடியுடன் கூடிய மழை எச்சரிக்கைகள்",

        "App & Support": "ஆப் & உதவி",
        "Share SkySense AI": "SkySense AI பகிரவும்",
        "Share the app with your friends":
            "ஆப்பை உங்கள் நண்பர்களுடன் பகிரவும்",
        "Rate SkySense AI": "SkySense AI-ஐ மதிப்பிடவும்",
        "About SkySense AI": "SkySense AI பற்றி",
        "About Us": "எங்களைப் பற்றி",
        "Terms of Use": "பயன்பாட்டு விதிமுறைகள்",
        "Privacy Policy": "தனியுரிமைக் கொள்கை",
    },

    te: {
        Home: "హోమ్",
        Forecast: "వాతావరణ అంచనా",
        "Weather Map": "వాతావరణ మ్యాప్",
        Favorites: "ఇష్టమైనవి",
        History: "చరిత్ర",
        Alerts: "హెచ్చరికలు",
        Assistant: "సహాయకుడు",
        Profile: "ప్రొఫైల్",
        Settings: "సెట్టింగ్‌లు",
        Logout: "లాగ్ అవుట్",

        PREFERENCES: "ప్రాధాన్యతలు",
        "Customize your SkySense AI experience.":
            "మీ SkySense AI అనుభవాన్ని అనుకూలీకరించండి.",
        Appearance: "రూపం",
        "Dark Mode": "డార్క్ మోడ్",

        "Weather Units": "వాతావరణ యూనిట్లు",
        Temperature: "ఉష్ణోగ్రత",
        "Wind Speed": "గాలి వేగం",
        Rain: "వర్షం",
        Pressure: "వాయు పీడనం",

        "Region & Language": "ప్రాంతం & భాష",
        "Country / Region": "దేశం / ప్రాంతం",
        Language: "భాష",

        "Weather Alert Preferences":
            "వాతావరణ హెచ్చరిక ప్రాధాన్యతలు",
        "Rain Alerts": "వర్ష హెచ్చరికలు",
        "Temperature Alerts": "ఉష్ణోగ్రత హెచ్చరికలు",
        "UV Alerts": "UV హెచ్చరికలు",
        "Strong Wind Alerts": "బలమైన గాలి హెచ్చరికలు",
        "Thunderstorm Alerts":
            "ఉరుములతో కూడిన వర్ష హెచ్చరికలు",

        "App & Support": "యాప్ & సహాయం",
        "Share SkySense AI": "SkySense AI షేర్ చేయండి",
        "Share the app with your friends":
            "యాప్‌ను మీ స్నేహితులతో షేర్ చేయండి",
        "Rate SkySense AI": "SkySense AIకి రేటింగ్ ఇవ్వండి",
        "About SkySense AI": "SkySense AI గురించి",
        "About Us": "మా గురించి",
        "Terms of Use": "వినియోగ నిబంధనలు",
        "Privacy Policy": "గోప్యతా విధానం",
    },
};

export function LanguageProvider({ children }) {
    const [language, setLanguageState] = useState(
        localStorage.getItem("language") || "en"
    );

    function setLanguage(value) {
        setLanguageState(value);
        localStorage.setItem("language", value);
    }

    function t(text) {
        return translations[language]?.[text] || text;
    }

    return (
        <LanguageContext.Provider
            value={{
                language,
                setLanguage,
                t,
            }}
        >
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    return useContext(LanguageContext);
}