// formatMrCode used to be duplicated here (and diverged from
// formatter.ts — 4-space vs 2-space indent). formatter.ts is now the
// single source of truth; re-exported here so existing imports of
// formatMrCode from "@/editor/completions" keep working unchanged.
export { formatMrCode } from "./formatter";

export interface TokenDoc {
    token: string;
    category: string;
    english: string;
    marathi: string;
    syntax: string;
}

export const tokenDocs: Record<string, TokenDoc> = {
    jar: {
        token: "jar",
        category: "Control Flow",
        english:
            "Executes a block of code when the specified condition evaluates to true.",
        marathi: "दिलेली अट खरी (khare) असल्यास हा कोड ब्लॉक चालवला जातो.",
        syntax: `jar (condition) {
    // code
}`,
    },

    nahitar: {
        token: "nahitar",
        category: "Control Flow",
        english:
            "Tests another condition when the preceding jar condition is false.",
        marathi: "आधीची jar अट खोटी असल्यास पुढील अट तपासण्यासाठी वापरले जाते.",
        syntax: `nahitar (condition) {
    // code
}`,
    },

    anyatha: {
        token: "anyatha",
        category: "Control Flow",
        english:
            "Executes a fallback block when all preceding conditions are false.",
        marathi:
            "आधीच्या सर्व अटी खोट्या असल्यास हा पर्यायी कोड ब्लॉक चालवला जातो.",
        syntax: `anyatha {
    // code
}`,
    },

    jovar: {
        token: "jovar",
        category: "Control Flow",
        english:
            "Repeats a block of code as long as the specified condition remains true.",
        marathi: "जोपर्यंत अट खरी राहील तोपर्यंत हा लूप चालत राहतो.",
        syntax: `jovar (condition) {
    // code
}`,
    },

    pratyek: {
        token: "pratyek",
        category: "Control Flow",
        english:
            "Creates a counting loop with an initializer, condition, and increment expression.",
        marathi:
            "Initializer, condition आणि increment वापरून ठराविक फेऱ्यांसाठी loop चालवतो.",
        syntax: `pratyek (he ank i = 0; i < 10; i++) {
    // code
}`,
    },

    thamba: {
        token: "thamba",
        category: "Control Flow",
        english: "Immediately terminates the nearest enclosing loop.",
        marathi: "सर्वात जवळचा चालू loop ताबडतोब थांबवण्यासाठी वापरले जाते.",
        syntax: "thamba;",
    },

    pudhe: {
        token: "pudhe",
        category: "Control Flow",
        english:
            "Skips the remainder of the current loop iteration and continues with the next iteration.",
        marathi:
            "चालू फेरीतील उर्वरित code वगळून पुढील फेरीकडे जाण्यासाठी वापरले जाते.",
        syntax: "pudhe;",
    },

    partav: {
        token: "partav",
        category: "Control Flow",
        english: "Returns a value from a function to its caller.",
        marathi: "Function मधून मूल्य परत पाठवण्यासाठी वापरले जाते.",
        syntax: "partav expression;",
    },

    paryay: {
        token: "paryay",
        category: "Control Flow",
        english: "Creates a multi-branch selection block based on a value.",
        marathi:
            "एखाद्या मूल्यावर आधारित अनेक पर्यायांमधून निवड करण्यासाठी वापरले जाते.",
        syntax: `paryay (value) {
    // cases
}`,
    },

    karya: {
        token: "karya",
        category: "Function",
        english: "Marks a function declaration.",
        marathi: "Function घोषित करण्यासाठी वापरला जाणारा शब्द.",
        syntax: `ank karya(he ank x) {
    partav x;
}`,
    },

    leeh: {
        token: "leeh",
        category: "Builtin",
        english: "Writes a value or expression to standard output.",
        marathi: "टर्मिनलवर मूल्य किंवा मजकूर आउटपुट करण्यासाठी वापरले जाते.",
        syntax: "leeh(value);",
    },

    shevti: {
        token: "shevti",
        category: "Builtin",
        english: "Terminates program execution.",
        marathi: "प्रोग्रामची अंमलबजावणी समाप्त करण्यासाठी वापरले जाते.",
        syntax: "shevti;",
    },

    ank: {
        token: "ank",
        category: "Data Type",
        english: "Signed integer data type for whole numbers.",
        marathi: "पूर्णांक संख्या साठवण्यासाठी वापरला जाणारा डेटा प्रकार.",
        syntax: "he ank x = 10;",
    },

    akshar: {
        token: "akshar",
        category: "Data Type",
        english: "Character or text data type.",
        marathi: "अक्षर किंवा मजकूर साठवण्यासाठी वापरला जाणारा डेटा प्रकार.",
        syntax: `he akshar name = "Anvay";`,
    },

    bhagank: {
        token: "bhagank",
        category: "Data Type",
        english: "Floating-point data type for decimal values.",
        marathi:
            "दशांश किंवा अपूर्णांक संख्या साठवण्यासाठी वापरला जाणारा डेटा प्रकार.",
        syntax: "he bhagank pi = 3.14;",
    },

    purnank: {
        token: "purnank",
        category: "Data Type",
        english: "Wide integer data type for whole numbers.",
        marathi: "मोठ्या पूर्णांक संख्यांसाठी वापरला जाणारा डेटा प्रकार.",
        syntax: "he purnank big = 100000;",
    },

    vidhan: {
        token: "vidhan",
        category: "Data Type",
        english: "Boolean data type that can hold khare or khote.",
        marathi: "khare किंवा khote मूल्य धारण करणारा तार्किक डेटा प्रकार.",
        syntax: "he vidhan check = khare;",
    },

    nirank: {
        token: "nirank",
        category: "Data Type",
        english:
            "Void return type indicating that a function does not return a value.",
        marathi:
            "Function कोणतेही मूल्य परत करत नाही हे दर्शवणारा void प्रकार.",
        syntax: `nirank karya(he akshar s) {
    // code
}`,
    },

    he: {
        token: "he",
        category: "Modifier",
        english: "Introduces a scalar declaration or scalar parameter.",
        marathi: "Scalar चल किंवा parameter घोषित करण्यासाठी वापरले जाते.",
        syntax: "he ank x = 10;",
    },

    te: {
        token: "te",
        category: "Modifier",
        english: "Introduces a collection or array declaration or parameter.",
        marathi: "Collection किंवा array घोषित करण्यासाठी वापरले जाते.",
        syntax: "te ank marks = [85, 91, 78];",
    },

    ahe: {
        token: "ahe",
        category: "Modifier",
        english: "Marks a declaration as immutable.",
        marathi: "Declaration मधील मूल्य immutable करण्यासाठी वापरले जाते.",
        syntax: "ahe he ank x = 10;",
    },

    maze: {
        token: "maze",
        category: "Modifier",
        english: "Marks a member or declaration as private where applicable.",
        marathi:
            "लागू असलेल्या scope मध्ये member किंवा declaration private करण्यासाठी वापरले जाते.",
        syntax: "maze he ank x = 10;",
    },

    lahan: {
        token: "lahan",
        category: "Size Modifier",
        english: "Specifies the small size level.",
        marathi: "लहान आकाराचा स्तर दर्शवण्यासाठी वापरले जाते.",
        syntax: "lahan",
    },

    maha: {
        token: "maha",
        category: "Size Modifier",
        english: "Specifies the large size level.",
        marathi: "मोठ्या आकाराचा स्तर दर्शवण्यासाठी वापरले जाते.",
        syntax: "maha",
    },

    uch: {
        token: "uch",
        category: "Size Modifier",
        english: "Specifies the ultra size level.",
        marathi: "अत्युच्च आकाराचा स्तर दर्शवण्यासाठी वापरले जाते.",
        syntax: "uch",
    },

    sarve: {
        token: "sarve",
        category: "Scope Rule",
        english: "Establishes a rule for the entire scope in which it appears.",
        marathi:
            "ज्या scope मध्ये ते वापरले जाते त्या संपूर्ण scope साठी नियम निश्चित करते.",
        syntax: "sarve uch;",
    },

    khare: {
        token: "khare",
        category: "Boolean",
        english: "Boolean literal representing true.",
        marathi: "सत्य दर्शवणारे boolean मूल्य.",
        syntax: "khare",
    },

    khote: {
        token: "khote",
        category: "Boolean",
        english: "Boolean literal representing false.",
        marathi: "असत्य दर्शवणारे boolean मूल्य.",
        syntax: "khote",
    },

    ani: {
        token: "ani",
        category: "Operator",
        english:
            "Logical AND operator. Both expressions must evaluate to true.",
        marathi:
            "दोन्ही expressions खरे असणे आवश्यक असलेला तार्किक आणि (AND) operator.",
        syntax: "cond1 ani cond2",
    },

    va: {
        token: "va",
        category: "Operator",
        english:
            "Logical OR operator. At least one expression must evaluate to true.",
        marathi:
            "कमीतकमी एक expression खरे असणे आवश्यक असलेला तार्किक किंवा (OR) operator.",
        syntax: "cond1 va cond2",
    },

    // Planned / To be implemented

    prakar: {
        token: "prakar",
        category: "Declaration — Planned",
        english:
            "Planned keyword for defining enumerated types. This feature is not yet implemented.",
        marathi:
            "Enumeration type घोषित करण्यासाठी नियोजित शब्द. हे feature अद्याप implement केलेले नाही.",
        syntax: "Planned — syntax to be finalized.",
    },

    rachna: {
        token: "rachna",
        category: "Declaration — Planned",
        english:
            "Planned keyword for defining structures. This feature is not yet implemented.",
        marathi:
            "Structure घोषित करण्यासाठी नियोजित शब्द. हे feature अद्याप implement केलेले नाही.",
        syntax: "Planned — syntax to be finalized.",
    },

    varg: {
        token: "varg",
        category: "Declaration — Planned",
        english:
            "Planned keyword for defining classes. This feature is not yet implemented.",
        marathi:
            "Class घोषित करण्यासाठी नियोजित शब्द. हे feature अद्याप implement केलेले नाही.",
        syntax: "Planned — syntax to be finalized.",
    },
};

export interface MrCompletion {
    token: string;
    category:
        | "keyword"
        | "modifier"
        | "size-modifier"
        | "scope-rule"
        | "type"
        | "declaration"
        | "control"
        | "builtin"
        | "boolean"
        | "operator"
        | "variable"
        | "function"
        | "param";
    insertText: string;
    cursorOffset?: number;
}

export const mrCompletions: MrCompletion[] = [
    // Control flow

    {
        token: "jar",
        category: "control",
        insertText: `jar () {
    
}`,
        cursorOffset: -9,
    },

    {
        token: "nahitar",
        category: "control",
        insertText: `nahitar () {
    
}`,
        cursorOffset: -9,
    },

    {
        token: "anyatha",
        category: "control",
        insertText: `anyatha {
    
}`,
        cursorOffset: -5,
    },

    {
        token: "jar-nahitar",
        category: "control",
        insertText: `jar () {
    
} nahitar () {
    
}`,
        cursorOffset: -21,
    },

    {
        token: "jar-nahitar-anyatha",
        category: "control",
        insertText: `jar () {
    
} nahitar () {
    
} anyatha {
    
}`,
        cursorOffset: -11,
    },

    {
        token: "jovar",
        category: "control",
        insertText: `jovar () {
    
}`,
        cursorOffset: -9,
    },

    {
        token: "pratyek",
        category: "control",
        insertText: `pratyek (he ank i = 0; i < 10; i++) {
    
}`,
        cursorOffset: -5,
    },

    {
        token: "thamba",
        category: "control",
        insertText: "thamba;",
    },

    {
        token: "pudhe",
        category: "control",
        insertText: "pudhe;",
    },

    {
        token: "partav",
        category: "control",
        insertText: "partav ",
    },

    {
        token: "paryay",
        category: "control",
        insertText: `paryay () {
    
}`,
        cursorOffset: -9,
    },

    // Functions / builtins

    {
        token: "karya",
        category: "function",
        insertText: "karya(",
    },

    {
        token: "leeh",
        category: "builtin",
        insertText: "leeh();",
        cursorOffset: -2,
    },

    {
        token: "shevti",
        category: "builtin",
        insertText: "shevti;",
    },

    // Modifiers

    {
        token: "he",
        category: "modifier",
        insertText: "he ",
    },

    {
        token: "te",
        category: "modifier",
        insertText: "te ",
    },

    {
        token: "ahe",
        category: "modifier",
        insertText: "ahe ",
    },

    {
        token: "maze",
        category: "modifier",
        insertText: "maze ",
    },

    // Size modifiers

    {
        token: "lahan",
        category: "size-modifier",
        insertText: "lahan ",
    },

    {
        token: "maha",
        category: "size-modifier",
        insertText: "maha ",
    },

    {
        token: "uch",
        category: "size-modifier",
        insertText: "uch ",
    },

    // Scope rule

    {
        token: "sarve",
        category: "scope-rule",
        insertText: "sarve ",
    },

    // Types

    {
        token: "ank",
        category: "type",
        insertText: "ank ",
    },

    {
        token: "akshar",
        category: "type",
        insertText: "akshar ",
    },

    {
        token: "bhagank",
        category: "type",
        insertText: "bhagank ",
    },

    {
        token: "purnank",
        category: "type",
        insertText: "purnank ",
    },

    {
        token: "vidhan",
        category: "type",
        insertText: "vidhan ",
    },

    {
        token: "nirank",
        category: "type",
        insertText: "nirank ",
    },

    // Boolean literals

    {
        token: "khare",
        category: "boolean",
        insertText: "khare",
    },

    {
        token: "khote",
        category: "boolean",
        insertText: "khote",
    },

    // Word operators

    {
        token: "ani",
        category: "operator",
        insertText: "ani ",
    },

    {
        token: "va",
        category: "operator",
        insertText: "va ",
    },

    // Planned declarations
    // These are intentionally simple because their final syntax
    // has not yet been implemented/finalized.

    {
        token: "prakar",
        category: "declaration",
        insertText: "prakar ",
    },

    {
        token: "rachna",
        category: "declaration",
        insertText: "rachna ",
    },

    {
        token: "varg",
        category: "declaration",
        insertText: "varg ",
    },
];

export function extractDynamicSymbols(code: string): MrCompletion[] {
    const list: MrCompletion[] = [];
    const seen = new Set<string>();

    /*
     * Function and parameter extraction should follow the
     * actual .mr grammar rather than treating `karya` as if
     * the function name always comes immediately after it.
     *
     * Dynamic function extraction can be expanded when the
     * final named-function grammar is established.
     */

    const paramMatch =
        /\b(?:he|te)\s+(?:ank|akshar|bhagank|purnank|vidhan|nirank)\s+([A-Za-z_][A-Za-z0-9_]*)\b/g;

    let m: RegExpExecArray | null;

    while ((m = paramMatch.exec(code)) !== null) {
        const name = m[1];

        if (
            name &&
            !seen.has(name) &&
            !mrCompletions.some((c) => c.token === name)
        ) {
            seen.add(name);

            list.push({
                token: name,
                category: "param",
                insertText: name,
            });
        }
    }

    /*
     * Scalar and collection variable declarations.
     *
     * Supports forms such as:
     *
     * he ank x = 10;
     * he bhagank percentage = 91.5;
     * te ank marks = [85, 91, 78];
     *
     * Modifiers may appear before the declaration.
     */

    const varMatch =
        /\b(?:(?:ahe|maze|lahan|maha|uch)\s+)*(?:he|te)\s+(?:ank|akshar|bhagank|purnank|vidhan|nirank)\s+([A-Za-z_][A-Za-z0-9_]*)\s*(?:=|;)/g;

    while ((m = varMatch.exec(code)) !== null) {
        const name = m[1];

        if (
            name &&
            !seen.has(name) &&
            !mrCompletions.some((c) => c.token === name)
        ) {
            seen.add(name);

            list.push({
                token: name,
                category: "variable",
                insertText: name,
            });
        }
    }

    return list;
}
