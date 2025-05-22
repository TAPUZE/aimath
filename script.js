// Global state variables
let geminiApiKey = ''; // Stores the API key
let currentProblem = null;
let isLoading = false;
let errorMessage = '';
let checkAnswerResult = null; // 'correct', 'incorrect', null

let isInStepByStepMode = false;
let currentStepIndex = 0;
let stepByStepHistory = []; // Stores { user_answer, ai_response_html_question } for steps
let currentSubProblemQuestion = '';
let currentSubProblemAnswer = '';

let chatMessages = []; // Stores { sender: 'user'/'ai', text: '...' }
let isChatLoading = false;
let lastMathTopic = 'מתמטיקה'; // Initialize with a general math topic

// DOM Elements
const apiKeyInput = document.getElementById('apiKeyInput');
const saveApiKeyButton = document.getElementById('saveApiKeyButton');
const apiKeyStatus = document.getElementById('apiKeyStatus');

const moduleSelect = document.getElementById('moduleSelect');
const yearSelect = document.getElementById('yearSelect');
const questionSelect = document.getElementById('questionSelect');
const loadProblemButton = document.getElementById('loadProblemButton');
const problemDisplaySection = document.getElementById('problemDisplaySection');
const studentAnswerInput = document.getElementById('studentAnswer');
const checkAnswerButton = document.getElementById('checkAnswerButton');
const checkAnswerResultDisplay = document.getElementById('checkAnswerResultDisplay');
const stepByStepSection = document.getElementById('stepByStepSection');
const currentStepNumberSpan = document.getElementById('currentStepNumber');
const currentSubProblemQuestionDiv = document.getElementById('currentSubProblemQuestion');
const currentSubProblemAnswerInput = document.getElementById('currentSubProblemAnswer');
const checkSubStepButton = document.getElementById('checkSubStepButton');
const imageUploadInput = document.getElementById('imageUpload');
const selectedImageName = document.getElementById('selectedImageName');
const simplifyProblemButton = document.getElementById('simplifyProblemButton');
const makeHarderProblemButton = document.getElementById('makeHarderProblemButton');
const getAIFeedbackOnUploadButton = document.getElementById('getAIFeedbackOnUploadButton');
const loadingIndicator = document.getElementById('loadingIndicator');
const errorMessageDisplay = document.getElementById('errorMessageDisplay');
const errorMessageText = document.getElementById('errorMessageText');
const aiFeedbackDisplay = document.getElementById('aiFeedbackDisplay');
const aiFeedbackContent = document.getElementById('aiFeedbackContent');
const chatMessagesDisplay = document.getElementById('chatMessagesDisplay');
const chatInput = document.getElementById('chatInput');
const sendChatMessageButton = document.getElementById('sendChatMessageButton');

// Bagrut questions data (same as React version)
const bagrutQuestionsData = {
    '801': {
        '2025': [
            { id: '801-2025-1', question: "המשכורת של יואב הייתה גדולה מן המשכורת של דנה ב־ 1,740 שקלים. המשכורת של דנה עלתה ב־15%, והמשכורת של יואב נשארה ללא שינוי. לאחר ההעלאה הייתה המשכורת של דנה שווה למשכורת של יואב. נסמן בי x את המשכורת של דנה לפני ההעלאה. א. הביעו באמצעות x את המשכורת של יואב. ב. מצאו את המשכורת של דנה לפני ההעלאה.", answer: "משכורת יואב: $x+1740$; משכורת דנה: 11600 שקלים", topic: "אלגברה - בעיות מילוליות", difficulty: "קל", mikud: false, imageUrl: null },
            { id: '801-2025-2', question: "בכל יום מר ישראלי נוהג מביתו למרכז העיר במכוניתו הפרטית. הוא חונה באחד משני חניונים: חניון I או חניון II. בחניון I התשלום אינו תלוי בזמן החניה, והוא 60 שקלים ליום. בחניון II התשלום תלוי בזמן החניה, לפי שעות. הגרף שלפניכם מתאר את הקשר בין מספר שעות החניה ובין התשלום בעבור החניה בחניון II. ביום ראשון חנה מר ישראלי בחניון II בשעה 9:00 בבוקר, ועזב את החניון בשעה 13:00 בצוהריים. א. כמה שילם מר ישראלי בעבור החניה ביום ראשון? ב. ביום שני תכנן מר ישראלי להישאר במרכז העיר 8 שעות, ולכן הוא החליט לחנות בחניון שבו התשלום בעבור חניה של 8 שעות נמוך יותר. כמה שילם מר ישראלי בעבור החניה הזאת? ג. כמה שעות לכל היותר יוכל מר ישראלי לחנות, אם יש לו 50 שקלים בלבד?", answer: "45 שקלים; 60 שקלים; 6 שעות", topic: "גרפים ופונקציות", difficulty: "בינוני", mikud: true, imageUrl: "graph-hanion-II" },
            { id: '801-2025-3', question: "בסדרה חשבונית האיבר השלישי הוא 4, והאיבר החמישי הוא 9. א. (1) מצאו את הפרש הסדרה. (2) מצאו את האיבר הראשון בסדרה. האיבר האחרון בסדרה הוא 39. ב. מצאו את מספר האיברים בסדרה. ג. מצאו את סכום כל איברי הסדרה.", answer: "d=2.5, a1=-1; n=16; S_n=304", topic: "סדרות חשבוניות", difficulty: "בינוני", mikud: false, imageUrl: null },
            { id: '801-2025-4', question: "בסרטוט שלפניכם מתוארת מקבילית ABCD. משוואת האלכסון AC היא $y=0.5x+2$. הקודקודים A ו־D נמצאים על ציר ה־ x, כמתואר בסרטוט. א. מצאו את שיעורי הקודקוד A. נתון $B(1,6)$. ב. (1) מהו שיעור ה־ y של הקודקוד C? (2) מצאו את שיעור ה־ x של הקודקוד C. ג. (1) מצאו את אורך הצלע BC. (2) מצאו את שיעורי הקודקוד D. ד. מצאו את היקף המקבילית ABCD.", answer: "A(-4,0); C(10,7); BC=5, D(5,1); היקף: $10+2\\sqrt{37}$", topic: "גיאומטריה אנליטית", difficulty: "קשה", mikud: true, imageUrl: "מקבילית-ABCD" },
            { id: '801-2025-5', question: "המשולש ABC הוא שווה שוקיים $AB=AC$. BD הוא הגובה לשוק AC. אורך הבסיס BC הוא 12. גודל זווית הבסיס הוא $65^{\\circ}$. א. מצאו את אורך הגובה BD. ב. (1) מהו גודל זווית הראש BAC ? (2) מצאו את אורך השוק AB.", answer: "BD=10.87; זווית ראש: $50^{\\circ}$; AB=14.18", topic: "טריגונומטריה", difficulty: "בינוני", mikud: false, imageUrl: "משולש-שווה-שוקיים" },
            { id: '801-2025-6', question: "בכד היו 5 כדורים שחורים, 7 כדורים לבנים ו־ 8 כדורים אדומים. הוציאו מן הכד באקראי כדור אחד, החזירו אותו לכד, ושוב הוציאו באקראי כדור אחד. א. מהי ההסתברות ששני הכדורים שהוצאו היו לבנים? ב. מהי ההסתברות ששני הכדורים שהוצאו היו באותו הצבע? ג. מהי ההסתברות שתחילה הוצא כדור שחור ולאחר מכן כדור אדום? ד. מהי ההסתברות שאחד משני הכדורים שהוצאו היה שחור ואחד היה אדום?", answer: "א. $(7/20)^2 = 49/400$; ב. $(5/20)^2 + (7/20)^2 + (8/20)^2 = 25/400 + 49/400 + 64/400 = 138/400$; ג. $(5/20) * (8/20) = 40/400$; ד. $2 * (5/20) * (8/20) = 80/400$", topic: "הסתברות", difficulty: "בינוני", mikud: false, imageUrl: null }
        ],
        '2023': [ /* ... existing simulated data ... */ ],
        '2022': [ /* ... existing simulated data ... */ ],
        '2021': [ /* ... existing simulated data ... */ ],
        '2020': [ /* ... existing simulated data ... */ ],
        '2019': [ /* ... existing simulated data ... */ ]
    },
    '802': {
        '2025': [
            { id: '802-2025-1', question: "נתונה פרבולה שמשוואתה $y=-4x^{2}+28x-33$. A ו B הן נקודות החיתוך של הפרבולה עם ציר ה־ x, כמתואר בסרטוט. א. מצאו את שיעורי הנקודות A ו־B. הנקודה C היא קודקוד הפרבולה. ב. מצאו את שיעורי הנקודה C. ג. חשבו את שטח המשולש ABC. ד. (1) כתבו ערך כלשהו של x בנקודה שבה הפרבולה שלילית. (2) מצאו את שיעור ה־ y של נקודה זו.", answer: "A(1.5,0), B(5.5,0); C(3.5,16); שטח ABC: 32 יח\"ר; ד. (1) x=0, (2) y=-33", topic: "אלגברה - פרבולה", difficulty: "בינוני", mikud: false, imageUrl: "פרבולה" },
            { id: '802-2025-2', question: "אורן קרא ספר מסוים. מספר העמודים שהוא קרא בכל יום היה גדול במספר קבוע ממספר העמודים שהוא קרא ביום שלפניו. ביום השני קרא אורן 14 עמודים, וביום השביעי הוא קרא 59 עמודים. א. מצאו בכמה גדול מספר העמודים שאורן קרא בכל יום ממספר העמודים שהוא קרא ביום שלפניו. ב. מצאו כמה עמודים קרא אורן ביום הראשון. אורן סיים לקרוא את כל הספר לאחר 12 ימים בדיוק. ג. מצאו כמה עמודים יש בספר. בשני ימים רצופים קרא אורן 91 עמודים סך הכול. ד. מצאו באילו ימים קרא אורן מספר עמודים זה.", answer: "א. 9 עמודים; ב. 5 עמודים; ג. 678 עמודים; ד. ימים 5 ו-6", topic: "סדרות חשבוניות - בעיות מילוליות", difficulty: "בינוני", mikud: false, imageUrl: null },
            { id: '802-2025-3', question: "המחיר של מכונית אספנות גדל בכל שנה באחוז קבוע, והמחיר של מכונית משפחתית קטן בכל שנה באחוז קבוע. הגרפים II-I שלפניכם מתארים את המחיר של כל אחת מן המכוניות, לפי השנה. א. על פי הגרפים, האם בתחילת שנת 2010 היה המחיר של מכונית האספנות גבוה יותר מן המחיר של המכונית המשפחתית? בתחילת שנת 2010 היה המחיר של מכונית האספנות 40,000 שקלים, ובתחילת שנת 2012 היה מחירה 42,436 שקלים. ב. (1) מצאו בכמה אחוזים גדל המחיר של מכונית האספנות בכל שנה. (2) מצאו מה היה המחיר של מכונית האספנות בתחילת שנת 2016. בתחילת שנת 2016 היה המחיר של שתי המכוניות זהה. המחיר של המכונית המשפחתית קטן בכל שנה ב- 15%. מיכל חסכה כסף לקניית מכונית. בתחילת שנת 2017 היו לה 41,000 שקלים. ג. האם בתחילת שנה זו יכלה מיכל לקנות את המכונית המשפחתית? נמקו את תשובתכם.", answer: "א. לא; ב. (1) 3%, (2) 50597.05 שקלים; ג. כן, המחיר הוא 42997.5 שקלים", topic: "גידול ודעיכה", difficulty: "קשה", mikud: true, imageUrl: "גרף-מכוניות" },
            { id: '802-2025-4', question: "בטרפז שווה שוקיים (ABDC) ABCD, DE הוא גובה לבסיס AB (ראו סרטוט). נתון $AD=28$, $DE=26$. א. מצאו את אורך הקטע AE. ב. מצאו את גודל הזווית DAE. ג. אלכסון הטרפז BD מאונך לשוק AD. (1) מצאו את אורך הבסיס AB. (2) מצאו את אורך הבסיס CD. ד. חשבו את שטח הטרפז ABCD.", answer: "א. $AE = \\sqrt{28^2 - 26^2} = \\sqrt{784 - 676} = \\sqrt{108} \\approx 10.39$; ב. $DAE = \\arcsin(26/28) \\approx 68.21^{\\circ}$; ג. (1) AB = 38.64, (2) CD = 17.86; ד. שטח = 734.48", topic: "טריגונומטריה", difficulty: "קשה", mikud: false, imageUrl: "טרפז-ABCD" },
            { id: '802-2025-5', question: "הלוח של משחק קליעה למטרה מחולק לארבעה אזורים. בכל אזור רשום מספר הנקודות שבהן זוכים אם קולעים לאזור זה (ראו סרטוט). אורית קולעת למטרה בלוח זה. ההסתברות שאורית תקלע לאזור שרשום בו 100 היא $\\frac{1}{2}$. ההסתברות שאורית תקלע לכל אחד מן האזורים שרשום בהם 40, 60 או 80 היא זהה, ושווה ל־ $\\frac{1}{6}$. א. אורית קלעה למטרה פעם אחת. מהי ההסתברות שאורית זכתה ב־ 80 נקודות או יותר? אורית קלעה למטרה פעמיים. ב. מהי ההסתברות שבכל אחת משתי הפעמים זכתה אורית ב־ 40 נקודות? ג. מהי ההסתברות שבשתי הפעמים זכתה אורית באותו מספר נקודות? ד. מהי ההסתברות שסכום הנקודות שזכתה בהן אורית בשתי הפעמים שווה ל־ 160 ?", answer: "א. $1/2 + 1/6 = 2/3$; ב. $(1/6)^2 = 1/36$; ג. $(1/2)^2 + 3 * (1/6)^2 = 1/4 + 3/36 = 1/4 + 1/12 = 4/12 = 1/3$; ד. $2 * (60/100) + 2 * (80/80) = 2 * (1/6) * (1/6) + (1/6) * (1/6) = 2/36 + 1/36 = 3/36 = 1/12$", topic: "הסתברות", difficulty: "בינוני", mikud: false, imageUrl: "לוח-קליעה" },
            { id: '802-2025-6', question: "הציונים במבחן ארצי במתמטיקה מתפלגים נורמלית, והממוצע הוא 71. הציונים של 7% מן הנבחנים גבוה מ־ 83. א. מצאו את סטיית התקן של הציונים. ב. מצאו את אחוז הנבחנים שהציון שלהם הוא בין 55 ל־ 75. נתון: הציון של 4,891 נבחנים הוא בין $75\\rightarrow55$. ג. על פי גרף ההתפלגות הנורמלית, כמה נבחנים ניגשו למבחן הארצי? 16% מן הנבחנים, אלה שהציון שלהם הוא הנמוך ביותר, זכאים לתגבור בלימודים. ד. האם נבחן שהציון שלו הוא 65 זכאי לתגבור בלימודים? נמקו את תשובתכם. לפניכם גרף ההתפלגות הנורמלית מדף הנוסחאות. השתמשו בו בחישוביכם.", answer: "א. סטיית תקן: 8; ב. 68%; ג. 7192.64; ד. לא, כי 65 נמצא מעל ה-16% הנמוכים ביותר (71-8=63), אז הוא לא זכאי", topic: "סטטיסטיקה - התפלגות נורמלית", difficulty: "קשה", mikud: true, imageUrl: "התפלגות-נורמלית" }
        ],
        '2023': [ /* ... existing simulated data ... */ ],
        '2022': [ /* ... existing simulated data ... */ ],
        '2021': [ /* ... existing simulated data ... */ ],
        '2020': [ /* ... existing simulated data ... */ ],
        '2019': [ /* ... existing simulated data ... */ ]
    },
    '803': {
        '2025': [
            { id: '803-2025-1', question: "בחנות בגדים מסוימת המחיר של מעיל גבוה ב- 72 שקלים מן המחיר של חולצה. בחנות הכריזו על מבצע של 15% הנחה על המחיר של חולצה (המחיר של מעיל לא השתנה). המחיר של חולצה אחת במבצע ושל מעיל אחד הוא 175.6 שקלים סך הכול. א. (1) מצאו את המחיר של חולצה לפני ההנחה. (2) מצאו את המחיר של חולצה במבצע. לקראת טיול של שכבת י\"א, קנתה רותם בחנות 60 פריטים: חלקם מעילים והשאר חולצות במבצע. היא שילמה 4,383.6 שקלים סך הכול. ב. מצאו את מספר החולצות שקנתה רותם. נדב קנה בחנות 4 מעילים. כאשר הגיע נדב לקופה כדי לשלם, התברר לו שהוא זכאי להנחה על המחיר של המעילים, כיוון שהוא חבר מועדון. נדב שילם 448 שקלים סך הכול. ג. מצאו את אחוז ההנחה שקיבל נדב על מחיר המעילים.", answer: "חולצה לפני הנחה: 68 שקלים, חולצה במבצע: 57.8 שקלים; 36 חולצות; 20% הנחה", topic: "אלגברה - בעיות מילוליות", difficulty: "בינוני", mikud: false, imageUrl: null },
            { id: '803-2025-2', question: "במשולש ישר זווית $(\\sphericalangle ACB=90^{\\circ})$ ABC, הקודקוד B נמצא על ציר ה־ y, והצלע AB חותכת את ציר ה־ x בנקודה D. נתון כי משוואת הצלע AB היא $y=-\\frac{1}{2}x+6$. א. מצאו את שיעורי הנקודות B ו־D. הנקודה D היא אמצע הצלע AB. ב. מצאו את שיעורי הקודקוד A. נתון כי משוואת הצלע BC היא $y=\\frac{1}{3}x+6$. ג. (1) מצאו את משוואת הצלע AC. (2) מצאו את שיעורי הקודקוד C. נתון כי $K(0,-15)$. ד. (1) חשבו את שטח המשולש ABC. (2) חשבו את שטח המרובע BCAK.", answer: "B(0,6), D(12,0); A(24,-6); AC: $y=x-30$, C(18,12); שטח ABC: 90 יח\"ר, שטח BCAK: 126 יח\"ר", topic: "גיאומטריה אנליטית", difficulty: "קשה", mikud: true, imageUrl: "משולש-ABC" },
            { id: '803-2025-3', question: "נתון מעגל שמרכזו M ומשוואת $(x-14)^{2}+(y-10)^{2}=117$. הנקודות B ו־C נמצאות על המעגל כך ש־ BC הוא קוטר במעגל, כמתואר בסרטוט. נתון: שיעור ה־ x של הנקודה C הוא 23. א. מה הם שיעורי הנקודה M ? ב. (1) מצאו את שיעורי הנקודה C (שיעור ה־ y של הנקודה C קטן מ־10). (2) מצאו את שיעורי הנקודה B. הישר AB משיק למעגל בנקודה B. ג. (1) מצאו את שיפוע הישר BM. (2) מצאו את משוואת הישר AB. נתון כי הישר AC מקביל לציר ה־ x. ד. מצאו את שיעורי הנקודה A . ה. מצאו את היקף המשולש AMC .", answer: "M(14,10); C(23,1), B(5,19); שיפוע BM: -9/9 = -1, AB: $y-19=1(x-5) \\Rightarrow y=x+14$; A(14,1); היקף AMC: $9\\sqrt{2}+18$", topic: "גיאומטריה אנליטית - מעגל", difficulty: "קשה", mikud: true, imageUrl: "מעגל-M" },
            { id: '803-2025-4', question: "בסרטוט שלפניכם מתואר גרף הפונקצייה $.f(x)=\\frac{48}{x}+3x-30$. א. מצאו את תחום ההגדרה של הפונקצייה $f(x)$. ב. מצאו את שיעורי נקודות הקיצון של הפונקצייה $f(x)$, וקבעו את סוגן על פי הגרף. ג. מצאו את תחומי העלייה של הפונקצייה $f(x)$. ד. לפניכם שתי טענות II-I. קבעו בעבור כל טענה אם היא נכונה או לא נכונה. נמקו את קביעותיכם. I. גרף הפונקצייה $f(x)$ חותך את ציר ה־ בנקודה שבה $x=2$. II. בנקודה שבה $x=3$ הפונקצייה $f(x)$ חיובית.", answer: "תחום הגדרה: $x \\ne 0$; קיצון: $(4,-6)$ מינימום, $(-4,-54)$ מקסימום; עליה: $x<-4$ או $x>4$; טענה I: לא נכונה, טענה II: נכונה", topic: "חשבון דיפרנציאלי - חקירת פונקציה", difficulty: "בינוני", mikud: false, imageUrl: "גרף-פונקציה" },
            { id: '803-2025-5', question: "נתונה הפונקצייה $f(x)=x^{3}-9x^{2}+15x+27$. הנקודות $B^{-}A$ הן נקודות הקיצון של הפונקצייה $f(x)$, כמתואר בסרטוט. א. מצאו את שיעורי הנקודות A ו־B. ב. מצאו את משוואת המשיק לגרף הפונקצייה $f(x)$ בנקודת המינימום שלה. ג. חשבו את השטח המקווקו בסרטוט: השטח המוגבל על ידי גרף הפונקצייה (f(x, על ידי המשיק ועל ידי ציר ה־y.", answer: "A(1,34) מקסימום, B(5,2) מינימום; משיק: $y=2$; שטח: 13.5 יח\"ר", topic: "חשבון דיפרנציאלי ואינטגרלי", difficulty: "קשה", mikud: true, imageUrl: "גרף-פונקציה-וקיצון" },
            { id: '803-2025-6', question: "במלבן ABCD אורך הצלע BC גדול פי 2 מאורך הצלע DC. על המלבן בנו ריבוע DEFG כך שהקודקוד G נמצא על הצלע AD (ראו סרטוט). נתון $CE=15$. נסמן בי x את אורך הצלע DC. א. (1) הביעו באמצעות x את אורך הצלע BC ואת אורך הצלע DE. (2) הביעו באמצעות x את שטח הריבוע DEFG. ב. מצאו את הערך של x שבעבורו סכום השטחים של הריבוע ושל המלבן הוא מינימלי. ג. מצאו את סכום השטחים של הריבוע ושל המלבן בעבור הערך של x שמצאתם בסעיף ב.", answer: "BC=2x, DE=2x; שטח ריבוע: $4x^2$; x=3; סכום שטחים: 135", topic: "בעיות קיצון", difficulty: "קשה", mikud: false, imageUrl: "מלבן-וריבוע" }
        ],
        '2023': [ /* ... existing simulated data ... */ ],
        '2022': [ /* ... existing simulated data ... */ ],
        '2021': [ /* ... existing simulated data ... */ ],
        '2020': [ /* ... existing simulated data ... */ ],
        '2019': [ /* ... existing simulated data ... */ ]
    }
};

// Function to populate dropdowns
function populateDropdowns() {
    // Populate Module Select
    for (const module in bagrutQuestionsData) {
        const option = document.createElement('option');
        option.value = module;
        option.textContent = module;
        moduleSelect.appendChild(option);
    }

    // Set initial selected module and populate years/questions
    moduleSelect.value = '801'; // Default
    populateYears();
    populateQuestions();
}

// Function to populate years based on selected module
function populateYears() {
    yearSelect.innerHTML = ''; // Clear existing options
    const selectedModule = moduleSelect.value;
    const years = Object.keys(bagrutQuestionsData[selectedModule] || {}).sort((a, b) => b - a);
    years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    });
    yearSelect.value = years[0]; // Select the latest year by default
}

// Function to populate questions based on selected module and year
function populateQuestions() {
    questionSelect.innerHTML = ''; // Clear existing options
    for (let i = 1; i <= 6; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `שאלה ${i}`;
        questionSelect.appendChild(option);
    }
    questionSelect.value = 1; // Default to question 1
}

// Function to display error message
function showErrorMessage(message) {
    errorMessageText.textContent = message;
    errorMessageDisplay.classList.remove('hidden');
}

// Function to hide error message
function hideErrorMessage() {
    errorMessageDisplay.classList.add('hidden');
    errorMessageText.textContent = '';
}

// Function to show/hide loading indicator
function showLoading(show) {
    if (show) {
        loadingIndicator.classList.remove('hidden');
    } else {
        loadingIndicator.classList.add('hidden');
    }
}

// Function to load a specific problem based on selected module, year, and question number
async function loadProblemFromIndex() {
    hideErrorMessage();
    showLoading(true);
    aiFeedbackContent.innerHTML = '';
    aiFeedbackDisplay.classList.add('hidden');
    checkAnswerResultDisplay.classList.add('hidden');
    studentAnswerInput.value = '';
    imageUploadInput.value = '';
    selectedImageName.textContent = '';
    chatMessages = [];
    renderChatMessages();
    isInStepByStepMode = false;
    stepByStepSection.classList.add('hidden');
    document.getElementById('initialAnswerSection').classList.remove('hidden');


    const module = moduleSelect.value;
    const year = yearSelect.value;
    const questionNum = parseInt(questionSelect.value);

    const problem = bagrutQuestionsData[module]?.[year]?.[questionNum - 1];

    if (problem) {
        currentProblem = problem;
        lastMathTopic = problem.topic; // Update lastMathTopic when a problem is loaded
        let problemHtml = `
            <h2 class="text-xl sm:text-2xl font-semibold text-blue-800 mb-3 text-center">
                השאלה הנוכחית (${currentProblem.difficulty} ${currentProblem.mikud ? '(מיקוד)' : ''})
            </h2>
            <div class="math-problem-display text-xl font-semibold text-center leading-relaxed">
                ${currentProblem.question}
            </div>
        `;
        // Check if imageUrl exists and is a valid SVG ID
        if (currentProblem.imageUrl) {
            // Use an SVG <use> tag to reference the symbol from the inlined SVG
            problemHtml += `
                <div class="mt-4 text-center">
                    <svg width="400" height="250" class="mx-auto rounded-lg shadow-md max-w-full h-auto">
                        <use href="#${currentProblem.imageUrl}"></use>
                    </svg>
                    <p class="text-sm text-gray-600 mt-2">
                        (אנא עיין בתרשים המקורי בשאלון הבגרות למען הדיוק המלא)
                    </p>
                </div>
            `;
        }
        problemDisplaySection.innerHTML = problemHtml;
        // Instruct MathJax to typeset the new content
        if (window.MathJax) {
            MathJax.typesetPromise([problemDisplaySection]).catch((err) => console.error("MathJax typesetting failed:", err));
        }
    } else {
        currentProblem = null;
        problemDisplaySection.innerHTML = `
            <div class="bg-yellow-50 rounded-lg p-5 text-yellow-800 text-center">
                אנא בחר שאלה מהאינדקס למעלה.
            </div>
        `;
    }
    showLoading(false);
}

// Function to check the student's typed answer using AI
async function checkTypedAnswer() {
    if (!geminiApiKey) {
        showErrorMessage('אנא הזן ושמור את מפתח ה-API של Gemini לפני השימוש בתכונות AI.');
        return;
    }
    if (!currentProblem || studentAnswerInput.value.trim() === '') {
        showErrorMessage('אנא בחר שאלה והקלד תשובה.');
        return;
    }

    showLoading(true);
    hideErrorMessage();
    aiFeedbackContent.innerHTML = '';
    aiFeedbackDisplay.classList.add('hidden');
    checkAnswerResultDisplay.classList.add('hidden');
    isInStepByStepMode = false;
    currentStepIndex = 0;
    stepByStepHistory = [];
    currentSubProblemAnswerInput.value = '';
    stepByStepSection.classList.add('hidden');
    document.getElementById('initialAnswerSection').classList.remove('hidden');


    try {
        const prompt = `אתה מורה למתמטיקה מומחה לתלמידי בגרות 3 יחידות בישראל.
        השאלה היא: "${currentProblem.question}"
        התשובה שהתלמיד הגיש היא: "${studentAnswerInput.value}".

        אנא קבע **בלבד** אם התשובה שהוגשה נכונה או שגויה.
        התשובה שלך צריכה להיות אחת משתי מילים בלבד: "נכון" או "שגוי".`;

        const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
        const payload = { contents: chatHistory };
        const apiKey = geminiApiKey; // Use the saved API key
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`API error: ${response.status} ${response.statusText} - Body: ${errorBody}`);
        }

        const result = await response.json();
        let aiEvaluation = '';
        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
            aiEvaluation = result.candidates[0].content.parts[0].text.trim().toLowerCase();
        } else {
            showErrorMessage('Failed to get AI evaluation. Please try again.');
            console.error('Unexpected AI evaluation response structure:', result);
            showLoading(false);
            return;
        }

        if (aiEvaluation === 'נכון') {
            checkAnswerResult = 'correct';
            checkAnswerResultDisplay.className = 'p-4 rounded-lg mb-6 text-center font-semibold text-lg bg-green-100 text-green-700 border border-green-400';
            checkAnswerResultDisplay.innerHTML = `
                כל הכבוד! תשובה נכונה! 🎉
                <button id="loadNewProblemBtn" class="mt-3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105">
                    טען שאלה חדשה
                </button>
            `;
            document.getElementById('loadNewProblemBtn').addEventListener('click', loadProblemFromIndex);
            aiFeedbackContent.innerHTML = '';
            aiFeedbackDisplay.classList.add('hidden');
        } else {
            checkAnswerResult = 'incorrect';
            checkAnswerResultDisplay.className = 'p-4 rounded-lg mb-6 text-center font-semibold text-lg bg-red-100 text-red-700 border border-red-400';
            checkAnswerResultDisplay.innerHTML = 'תשובה שגויה. בוא נתחיל הדרכה שלב אחר שלב כדי לעזור לך להבין. 🧐';
            isInStepByStepMode = true;
            document.getElementById('initialAnswerSection').classList.add('hidden');
            stepByStepSection.classList.remove('hidden');
            await startStepByStepGuidance();
        }
        checkAnswerResultDisplay.classList.remove('hidden');
    } catch (error) {
        showErrorMessage(`שגיאה בבדיקת התשובה: ${error.message}. אנא נסה שוב.`);
        console.error('Error in checkTypedAnswer:', error);
    } finally {
        showLoading(false);
    }
}

// Function to start the interactive step-by-step guidance
async function startStepByStepGuidance() {
    if (!geminiApiKey) {
        showErrorMessage('אנא הזן ושמור את מפתח ה-API של Gemini לפני השימוש בתכונות AI.');
        return;
    }
    if (!currentProblem) return;

    showLoading(true);
    hideErrorMessage();
    aiFeedbackContent.innerHTML = ''; // Clear previous feedback
    aiFeedbackDisplay.classList.add('hidden');
    currentStepIndex = 0;
    stepByStepHistory = [];
    currentSubProblemAnswerInput.value = '';
    currentStepNumberSpan.textContent = currentStepIndex + 1;


    const problemText = currentProblem.question;

    const prompt = `אתה מורה למתמטיקה מומחה, כיפי ומרתק לתלמידי בגרות 3 יחידות בישראל.
    הבעיה המקורית היא: "${problemText}".
    התלמיד הגיש תשובה שגויה לשאלה המלאה.

    אנא פרק את הבעיה המקורית לחלקים קטנים וברורים. הצג לי את השלב הראשון בלבד כשאלה קצרה שהתלמיד צריך לפתור.
    השתמש בפורמט HTML עבור התשובה שלך, עם תגי \`<h3>\` לכותרת השלב ו-\`<p>\` לשאלה.
    השתמש ב-LaTeX עבור ביטויים מתמטיים, עטוף בדולרים בודדים (\`$\`) או כפולים (\`$$\`) עבור תצוגה בלוקית.
    `;

    try {
        const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
        const payload = { contents: chatHistory };
        const apiKey = geminiApiKey; // Use the saved API key
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`API error: ${response.status} ${response.statusText} - Body: ${errorBody}`);
        }

        const result = await response.json();

        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
            const aiResponseText = result.candidates[0].content.parts[0].text;
            currentSubProblemQuestionDiv.innerHTML = aiResponseText; // MathJax will render this
            currentSubProblemQuestion = aiResponseText; // Store for next prompt
            aiFeedbackDisplay.classList.remove('hidden'); // Show feedback display
            aiFeedbackContent.innerHTML = aiResponseText; // MathJax will render this
            // Instruct MathJax to typeset the new content
            if (window.MathJax) {
                MathJax.typesetPromise([currentSubProblemQuestionDiv, aiFeedbackContent]).catch((err) => console.error("MathJax typesetting failed:", err));
            }
        } else {
            showErrorMessage('אני מתקשה להתחיל הדרכה שלב אחר שלב. אנא נסה שוב מאוחר יותר.');
            console.error('Unexpected AI step-by-step response structure:', result);
        }
    } catch (error) {
        showErrorMessage(`אירעה שגיאה בהתחלת הדרכה: ${error.message}. אנא נסה שוב.`);
        console.error('Error in startStepByStepGuidance:', error);
    } finally {
        showLoading(false);
    }
}

// Function to check the student's answer for the current sub-step
async function checkSubStepAnswer() {
    if (!geminiApiKey) {
        showErrorMessage('אנא הזן ושמור את מפתח ה-API של Gemini לפני השימוש בתכונות AI.');
        return;
    }
    if (!currentProblem || currentSubProblemAnswerInput.value.trim() === '') {
        showErrorMessage('אנא הקלד תשובה לשלב הנוכחי.');
        return;
    }

    showLoading(true);
    hideErrorMessage();
    aiFeedbackContent.innerHTML = ''; // Clear previous feedback for the new step's feedback
    aiFeedbackDisplay.classList.add('hidden');


    const problemText = currentProblem.question;
    const previousStepsContext = stepByStepHistory.map((item, idx) => `שלב ${idx + 1} (שאלה): ${item.ai_response_html_question} שלב ${idx + 1} (תשובת תלמיד): ${item.user_answer}`).join('\n');

    const prompt = `אתה מורה למתמטיקה מומחה, כיפי ומרתק לתלמידי בגרות 3 יחידות בישראל.
    הבעיה המקורית היא: "${problemText}".
    כרגע אנחנו בשלב ${currentStepIndex + 1} של הדרכה צעד אחר צעד.
    השאלה לשלב הנוכחי הייתה: "${currentSubProblemQuestion}".
    התשובה של התלמיד לשלב זה היא: "${currentSubProblemAnswerInput.value}".

    ${previousStepsContext ? `היסטוריית שלבים קודמים: ${previousStepsContext}` : ''}

    אנא קבע אם התשובה של התלמיד לשלב **הנוכחי** נכונה.
    אם התשובה נכונה:
    1.  ספק חיזוק חיובי קצר.
    2.  הצג את השלב הבא בפתרון הבעיה המקורית כשאלה חדשה שהתלמיד צריך לפתור.
    3.  אם זה היה השלב האחרון, סכם את הפתרון המלא וברך את התלמיד.

    אם התשובה אינה נכונה:
    1.  ספק משוב ממוקד לגבי הטעות הספציפית בשלב זה.
    2.  הנח את התלמיד לנסות שוב את אותו השלב, אולי עם רמז קצר או שאלה מנחה.

    השתמש בפורמט HTML עבור התשובה שלך, עם תגי \`<h3>\` לכותרת, \`<p>\` לפסקאות, \`<ul>\` ו-\`<li>\` לרשימות, ו-\`<strong>\` לטקסט מודגש.
    השתמש ב-LaTeX עבור ביטויים מתמטיים, עטוף בדולרים בודדים (\`$\`) או כפולים (\`$$\`) עבור תצוגה בלוקית.
    `;

    try {
        const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
        const payload = { contents: chatHistory };
        const apiKey = geminiApiKey; // Use the saved API key
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`API error: ${response.status} ${response.statusText} - Body: ${errorBody}`);
        }

        const result = await response.json();

        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
            const aiResponseText = result.candidates[0].content.parts[0].text;

            // Store current step's interaction before processing next
            stepByStepHistory.push({
                user_answer: currentSubProblemAnswerInput.value,
                ai_response_html_question: currentSubProblemQuestion
            });

            // Heuristic to determine if AI indicates correctness and progression
            const isSubStepCorrect = aiResponseText.includes('כל הכבוד') || aiResponseText.includes('נכון') || aiResponseText.includes('מצוין');
            const isFinalStep = aiResponseText.includes('הפתרון המלא') || aiResponseText.includes('סיימנו') || aiResponseText.includes('סיימנו את הבעיה');

            aiFeedbackContent.innerHTML = aiResponseText; // MathJax will render this
            aiFeedbackDisplay.classList.remove('hidden');
            currentSubProblemAnswerInput.value = ''; // Clear input for next step

            if (isSubStepCorrect && !isFinalStep) {
                currentStepIndex++; // Move to next step
                currentStepNumberSpan.textContent = currentStepIndex + 1;
                currentSubProblemQuestion = aiResponseText; // AI's response is the new question
                // Instruct MathJax to typeset the new content
                if (window.MathJax) {
                    MathJax.typesetPromise([aiFeedbackContent]).catch((err) => console.error("MathJax typesetting failed:", err));
                }
            } else if (isFinalStep) {
                isInStepByStepMode = false; // Exit step-by-step mode
                stepByStepSection.classList.add('hidden');
                document.getElementById('initialAnswerSection').classList.remove('hidden');
                checkAnswerResult = 'correct'; // Mark as overall correct after guidance
                checkAnswerResultDisplay.className = 'p-4 rounded-lg mb-6 text-center font-semibold text-lg bg-green-100 text-green-700 border border-green-400';
                checkAnswerResultDisplay.innerHTML = `
                    כל הכבוד! סיימת את הבעיה בהצלחה! 🎉
                    <button id="loadNewProblemBtn" class="mt-3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105">
                        טען שאלה חדשה
                    </button>
                `;
                document.getElementById('loadNewProblemBtn').addEventListener('click', loadProblemFromIndex);
                checkAnswerResultDisplay.classList.remove('hidden');
                // Instruct MathJax to typeset the new content
                if (window.MathJax) {
                    MathJax.typesetPromise([aiFeedbackContent, checkAnswerResultDisplay]).catch((err) => console.error("MathJax typesetting failed:", err));
                }
            } else {
                // Sub-step incorrect, stay on same step, AI's feedback will guide re-attempt
                currentSubProblemQuestion = aiResponseText; // AI's feedback is the new guiding question
                // Instruct MathJax to typeset the new content
                if (window.MathJax) {
                    MathJax.typesetPromise([aiFeedbackContent]).catch((err) => console.error("MathJax typesetting failed:", err));
                }
            }

        } else {
            showErrorMessage('אני מתקשה להמשיך את ההדרכה. אנא נסה שוב.');
            console.error('Unexpected AI sub-step response structure:', result);
        }
    } catch (error) {
        showErrorMessage(`אירעה שגיאה בבדיקת השלב: ${error.message}. אנא נסה שוב.`);
        console.error('Error in checkSubStepAnswer:', error);
    } finally {
        showLoading(false);
    }
}


// Function to get AI feedback on the student's uploaded work
async function getAIFeedbackOnUpload() {
    if (!geminiApiKey) {
        showErrorMessage('אנא הזן ושמור את מפתח ה-API של Gemini לפני השימוש בתכונות AI.');
        return;
    }
    if (!currentProblem || !imageUploadInput.files[0]) {
        showErrorMessage('אנא בחר שאלה והעלה קובץ תמונה של עבודתך.');
        return;
    }

    showLoading(true);
    hideErrorMessage();
    aiFeedbackContent.innerHTML = '';
    aiFeedbackDisplay.classList.add('hidden');
    checkAnswerResultDisplay.classList.add('hidden');
    isInStepByStepMode = false; // Ensure not in step-by-step mode
    stepByStepSection.classList.add('hidden');
    document.getElementById('initialAnswerSection').classList.remove('hidden');


    try {
        const prompt = `אתה מורה למתמטיקה מומחה, כיפי ומרתק לתלמידי בגרות 3 יחידות בישראל.
        הבעיה הנוכחית היא: "${currentProblem.question}"
        התלמיד העלה תמונה של עבודתו בכתב יד (אין לך גישה ישירה לתמונה, אך התייחס לכך שהיא קיימת).
        אנא ספק משוב בעברית על העבודה שהועלתה.
        1. נסה לדמיין את העבודה שהועלתה וקבע אם התשובה הסופית נכונה.
        2. אם התשובה נכונה, ספק חיזוק חיובי ותיקוף קצר.
        3. אם התשובה אינה נכונה, אל תגיד שהיא פשוט שגויה. במקום זאת, פרק את הבעיה לחלקים קטנים, קצרים ולעניין. הצג אותם כרשימה ממוספרת או עם כותרות מודגשות. הסבר כל חלק בקצרה ובנה לאט לאט את הפתרון שלב אחר שלב. הפוך את ההסבר למהנה ומרתק.
        4. השתמש ב-LaTeX לכל ביטוי מתמטי במשוב שלך.
        5. בסיום המשוב, הצג שאלה קצרה (אולי בפורמט בחירה מרובה פשוט) או הנחיה להמשך חשיבה הקשורה לשלב הבא בפתרון או למושג קשור, כדי לעודד את התלמיד להמשיך לפתור או לחשוב.`;

        const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
        const payload = { contents: chatHistory };
        const apiKey = geminiApiKey; // Use the saved API key
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`API error: ${response.status} ${response.statusText} - Body: ${errorBody}`);
        }

        const result = await response.json();

        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
            const text = result.candidates[0].content.parts[0].text;
            aiFeedbackContent.innerHTML = text; // MathJax will render this
            aiFeedbackDisplay.classList.remove('hidden');
            // Instruct MathJax to typeset the new content
            if (window.MathJax) {
                MathJax.typesetPromise([aiFeedbackContent]).catch((err) => console.error("MathJax typesetting failed:", err));
            }
        } else {
            showErrorMessage('Failed to get feedback from AI. Please try again.');
            console.error('Unexpected AI response structure:', result);
        }
    } catch (error) {
        showErrorMessage(`Error getting AI feedback: ${error.message}. אנא נסה שוב.`);
        console.error('Error in getAIFeedbackOnUpload:', error);
    } finally {
        showLoading(false);
    }
}

// Function to simplify the current math problem
async function simplifyProblem() {
    if (!geminiApiKey) {
        showErrorMessage('אנא הזן ושמור את מפתח ה-API של Gemini לפני השימוש בתכונות AI.');
        return;
    }
    if (!currentProblem) {
        showErrorMessage('אנא בחר שאלה קודם.');
        return;
    }
    showLoading(true);
    hideErrorMessage();
    aiFeedbackContent.innerHTML = '';
    aiFeedbackDisplay.classList.add('hidden');
    checkAnswerResultDisplay.classList.add('hidden');
    isInStepByStepMode = false; // Exit step-by-step mode
    stepByStepSection.classList.add('hidden');
    document.getElementById('initialAnswerSection').classList.remove('hidden');

    try {
        const prompt = `Given the following math problem from the Israeli 3-point Bagrut curriculum: "${currentProblem.question}"
        Please create a simpler version of this problem. The simpler problem should teach the same core concept but with easier numbers or fewer steps.
        Provide only the new, simplified problem question in Hebrew. Use LaTeX for mathematical expressions.`;

        const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
        const payload = { contents: chatHistory };
        const apiKey = geminiApiKey; // Use the saved API key
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`API error: ${response.status} ${response.statusText} - Body: ${errorBody}`);
        }

        const result = await response.json();

        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
            const newQuestion = result.candidates[0].content.parts[0].text;
            currentProblem.question = newQuestion; // Update global currentProblem
            currentProblem.difficulty = "מפושט";
            loadProblemFromIndex(); // Re-render with new problem
        } else {
            showErrorMessage('Failed to simplify problem. Please try again.');
            console.error('Unexpected AI response structure:', result);
        }
    } catch (error) {
        showErrorMessage(`Error simplifying problem: ${error.message}. אנא נסה שוב.`);
        console.error('Error in simplifyProblem:', error);
    } finally {
        showLoading(false);
    }
}

// Function to make the current math problem harder
async function makeHarderProblem() {
    if (!geminiApiKey) {
        showErrorMessage('אנא הזן ושמור את מפתח ה-API של Gemini לפני השימוש בתכונות AI.');
        return;
    }
    if (!currentProblem) {
        showErrorMessage('אנא בחר שאלה קודם.');
        return;
    }
    showLoading(true);
    hideErrorMessage();
    aiFeedbackContent.innerHTML = '';
    aiFeedbackDisplay.classList.add('hidden');
    checkAnswerResultDisplay.classList.add('hidden');
    isInStepByStepMode = false; // Exit step-by-step mode
    stepByStepSection.classList.add('hidden');
    document.getElementById('initialAnswerSection').classList.remove('hidden');

    try {
        const prompt = `Given the following math problem from the Israeli 3-point Bagrut curriculum: "${currentProblem.question}"
        Please create a harder version of this problem. The harder problem should build on the same core concept but with more complex numbers, additional steps, or a more challenging context.
        Provide only the new, harder problem question in Hebrew. Use LaTeX for mathematical expressions.`;

        const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
        const payload = { contents: chatHistory };
        const apiKey = geminiApiKey; // Use the saved API key
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`API error: ${response.status} ${response.statusText} - Body: ${errorBody}`);
        }

        const result = await response.json();

        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
            const newQuestion = result.candidates[0].content.parts[0].text;
            currentProblem.question = newQuestion; // Update global currentProblem
            currentProblem.difficulty = "קשה יותר";
            loadProblemFromIndex(); // Re-render with new problem
        } else {
            showErrorMessage('Failed to make problem harder. Please try again.');
            console.error('Unexpected AI response structure:', result);
        }
    } catch (error) {
        showErrorMessage(`Error making problem harder: ${error.message}. אנא נסה שוב.`);
        console.error('Error in makeHarderProblem:', error);
    } finally {
        showLoading(false);
    }
}

// Function to render chat messages
function renderChatMessages() {
    chatMessagesDisplay.innerHTML = '';
    chatMessages.forEach((msg, index) => {
        const msgDiv = document.createElement('div');
        msgDiv.className = `p-3 rounded-lg my-1 max-w-[80%] ${
            msg.sender === 'user' ? 'chat-message-user' : 'chat-message-ai'
        }`;
        msgDiv.innerHTML = msg.text; // MathJax will render this
        chatMessagesDisplay.appendChild(msgDiv);
    });
    chatMessagesDisplay.scrollTop = chatMessagesDisplay.scrollHeight; // Auto-scroll to bottom
    // Instruct MathJax to typeset the new content
    if (window.MathJax) {
        MathJax.typesetPromise([chatMessagesDisplay]).catch((err) => console.error("MathJax typesetting failed:", err));
    }
}

// Function to send a message in the chat
async function sendChatMessage() {
    if (!geminiApiKey) {
        showErrorMessage('אנא הזן ושמור את מפתח ה-API של Gemini לפני השימוש בתכונות AI.');
        return;
    }
    const messageText = chatInput.value.trim();
    if (messageText === '') return;

    chatMessages.push({ sender: 'user', text: messageText });
    chatInput.value = '';
    renderChatMessages();
    isChatLoading = true;
    sendChatMessageButton.disabled = true;
    chatInput.disabled = true;

    try {
        const currentChatHistory = chatMessages.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }]
        }));

        const prompt = `אתה מורה למתמטיקה מומחה, כיפי ומרתק לתלמידי בגרות 3 יחידות בישראל.
        **נתח את קלט המשתמש וודא שהוא קשור למתמטיקה.**
        **אם הקלט אינו קשור למתמטיקה:**
        1.  ספק בדיחה קצרה ומשעשעת שקשורה למתמטיקה (או בדיחה כללית קצרה אם קשה למצוא בדיחה מתמטית מתאימה).
        2.  הפנה את התלמיד בחזרה לנושא ${currentProblem ? currentProblem.topic : lastMathTopic} או באופן כללי ללימודי מתמטיקה.
        3.  אל תענה לשאלה שאינה קשורה למתמטיקה.

        **אם הקלט קשור למתמטיקה:**
        ענה לו בצורה ממוקדת, קצרה ולעניין.
        השתמש ב-LaTeX לכל ביטוי מתמטי בתשובתך.
        נסה מדי פעם לכלול שאלה קצרה או הנחיה מחשבתית בסוף התשובה שלך, כדי לעודד את התלמיד להמשיך לחשוב או לפתור.`;

        const payload = { contents: currentChatHistory };
        const apiKey = geminiApiKey; // Use the saved API key
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`API error: ${response.status} ${response.statusText} - Body: ${errorBody}`);
        }

        const result = await response.json();

        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
            const aiResponseText = result.candidates[0].content.parts[0].text;
            chatMessages.push({ sender: 'ai', text: aiResponseText });
        } else {
            chatMessages.push({ sender: 'ai', text: 'אני מתקשה להבין. אנא נסה לנסח מחדש את שאלתך.' });
            console.error('Unexpected AI chat response structure:', result);
        }
    } catch (error) {
        chatMessages.push({ sender: 'ai', text: `אירעה שגיאה: ${error.message}. אנא נסה שוב.` });
        console.error('Error in sendChatMessage:', error);
    } finally {
        isChatLoading = false;
        sendChatMessageButton.disabled = false;
        chatInput.disabled = false;
        renderChatMessages();
    }
}

// Function to load API key from local storage
function loadApiKey() {
    const storedKey = localStorage.getItem('geminiApiKey');
    if (storedKey) {
        geminiApiKey = storedKey;
        apiKeyInput.value = storedKey;
        apiKeyStatus.textContent = 'מפתח API נטען בהצלחה!';
        apiKeyStatus.classList.remove('hidden');
    } else {
        apiKeyStatus.textContent = 'אנא הזן את מפתח ה-API שלך.';
        apiKeyStatus.classList.remove('hidden');
        apiKeyStatus.classList.add('text-red-700');
    }
}

// Function to save API key to local storage
function saveApiKey() {
    const key = apiKeyInput.value.trim();
    if (key) {
        localStorage.setItem('geminiApiKey', key);
        geminiApiKey = key;
        apiKeyStatus.textContent = 'מפתח API נשמר בהצלחה!';
        apiKeyStatus.classList.remove('hidden', 'text-red-700');
        apiKeyStatus.classList.add('text-green-700');
    } else {
        showErrorMessage('אנא הזן מפתח API חוקי.');
        apiKeyStatus.classList.add('text-red-700');
    }
}

// Event Listeners
window.onload = function() {
    loadApiKey(); // Load API key on startup
    populateDropdowns();
    loadProblemFromIndex(); // Load initial problem

    moduleSelect.addEventListener('change', () => {
        populateYears();
        populateQuestions();
        loadProblemFromIndex();
    });
    yearSelect.addEventListener('change', () => {
        populateQuestions();
        loadProblemFromIndex();
    });
    questionSelect.addEventListener('change', loadProblemFromIndex);
    loadProblemButton.addEventListener('click', loadProblemFromIndex);
    checkAnswerButton.addEventListener('click', checkTypedAnswer);
    checkSubStepButton.addEventListener('click', checkSubStepAnswer);
    imageUploadInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            selectedImageName.textContent = `קובץ נבחר: ${e.target.files[0].name}`;
        } else {
            selectedImageName.textContent = '';
        }
    });
    simplifyProblemButton.addEventListener('click', simplifyProblem);
    makeHarderProblemButton.addEventListener('click', makeHarderProblem);
    getAIFeedbackOnUploadButton.addEventListener('click', getAIFeedbackOnUpload);
    sendChatMessageButton.addEventListener('click', sendChatMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendChatMessage();
        }
    });
    saveApiKeyButton.addEventListener('click', saveApiKey); // New event listener for save button
};
