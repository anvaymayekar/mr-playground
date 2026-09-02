export type MrCompletion = {
    token: string;
    label: string;
    description: string;
    marathi: string;
    insertText: string;
    category: string;
};

export const mrCompletions: MrCompletion[] = [
    // Modifiers

    {
        token: "he",
        label: "he",
        description: "Scalar / singular declaration",
        marathi: "एकच मूल्य घोषित करते",
        insertText: "he ${type} ${name} = ${value};",
        category: "modifier",
    },

    {
        token: "te",
        label: "te",
        description: "Collection / array declaration",
        marathi: "संग्रह किंवा अॅरे घोषित करते",
        insertText: "te ${type} ${name};",
        category: "modifier",
    },

    {
        token: "maze",
        label: "maze",
        description: "Private declaration",
        marathi: "खासगी घोषणा",
        insertText: "maze ",
        category: "modifier",
    },

    {
        token: "lahan",
        label: "lahan",
        description: "Small data size",
        marathi: "लहान आकार",
        insertText: "lahan ",
        category: "modifier",
    },

    {
        token: "maha",
        label: "maha",
        description: "Large data size",
        marathi: "मोठा आकार",
        insertText: "maha ",
        category: "modifier",
    },

    {
        token: "uch",
        label: "uch",
        description: "Ultra-large data size",
        marathi: "अतिशय मोठा आकार",
        insertText: "uch ",
        category: "modifier",
    },

    {
        token: "ahe",
        label: "ahe",
        description: "Immutable / constant declaration",
        marathi: "अपरिवर्तनीय मूल्य घोषित करते",
        insertText: "he ${type} ${name} ahe ${value};",
        category: "modifier",
    },

    // Types

    {
        token: "ank",
        label: "ank",
        description: "Integer type",
        marathi: "पूर्णांक प्रकार",
        insertText: "ank ${name} = ${value};",
        category: "type",
    },

    {
        token: "akshar",
        label: "akshar",
        description: "Character / string type",
        marathi: "अक्षर किंवा स्ट्रिंग प्रकार",
        insertText: 'akshar ${name} = "${value}";',
        category: "type",
    },

    {
        token: "bhagank",
        label: "bhagank",
        description: "Floating-point type",
        marathi: "दशांश संख्या प्रकार",
        insertText: "bhagank ${name} = ${value};",
        category: "type",
    },

    {
        token: "purnank",
        label: "purnank",
        description: "Unsigned integer type",
        marathi: "अचिन्हांकित पूर्णांक प्रकार",
        insertText: "purnank ${name} = ${value};",
        category: "type",
    },

    {
        token: "vidhan",
        label: "vidhan",
        description: "Boolean type",
        marathi: "बूलियन प्रकार",
        insertText: "vidhan ${name} = khare;",
        category: "type",
    },

    {
        token: "nirank",
        label: "nirank",
        description: "No-return / void type",
        marathi: "मूल्य परत न करणारा प्रकार",
        insertText: "nirank karya(${parameters}) {\n    ${body}\n}",
        category: "type",
    },

    // Conditions

    {
        token: "jar",
        label: "jar",
        description: "Run this block if the condition is true",
        marathi: "अट खरी असल्यास हा भाग चालवा",
        insertText: "jar (${condition}) {\n    ${body}\n}",
        category: "control",
    },

    {
        token: "nahitar",
        label: "nahitar",
        description: "Check another condition",
        marathi: "दुसरी अट तपासते",
        insertText: "nahitar (${condition}) {\n    ${body}\n}",
        category: "control",
    },

    {
        token: "anyatha",
        label: "anyatha",
        description: "Run this block otherwise",
        marathi: "अन्यथा हा भाग चालतो",
        insertText: "anyatha {\n    ${body}\n}",
        category: "control",
    },

    // Loops

    {
        token: "jovar",
        label: "jovar",
        description: "Repeat while the condition is true",
        marathi: "अट खरी असेपर्यंत पुन्हा चालते",
        insertText: "jovar (${condition}) {\n    ${body}\n}",
        category: "flow",
    },

    {
        token: "pratyek",
        label: "pratyek",
        description: "For loop",
        marathi: "ठरावीक पद्धतीने पुनरावृत्ती",
        insertText:
            "pratyek (${initialization}; ${condition}; ${increment}) {\n    ${body}\n}",
        category: "flow",
    },

    {
        token: "thamba",
        label: "thamba",
        description: "Break out of the current loop",
        marathi: "सध्याची पुनरावृत्ती थांबवते",
        insertText: "thamba;",
        category: "flow",
    },

    {
        token: "pudhe",
        label: "pudhe",
        description: "Continue to the next iteration",
        marathi: "पुढच्या पुनरावृत्तीकडे जाते",
        insertText: "pudhe;",
        category: "flow",
    },

    // Switch

    {
        token: "paryay",
        label: "paryay",
        description: "Choose between multiple alternatives",
        marathi: "अनेक पर्यायांपैकी एक निवडते",
        insertText: "paryay (${value}) {\n    ${body}\n}",
        category: "control",
    },

    // Functions

    {
        token: "karya",
        label: "karya",
        description: "Declare a function",
        marathi: "कार्य घोषित करते",
        insertText: "${returnType} karya(${parameters}) {\n    ${body}\n}",
        category: "function",
    },

    {
        token: "partav",
        label: "partav",
        description: "Return a value from a function",
        marathi: "कार्यातून मूल्य परत करते",
        insertText: "partav ${value};",
        category: "flow",
    },

    // Built-ins

    {
        token: "leeh",
        label: "leeh",
        description: "Print a value",
        marathi: "मूल्य उत्पादनात दाखवते",
        insertText: "leeh(${value});",
        category: "builtin",
    },

    {
        token: "shevti",
        label: "shevti",
        description: "Terminate program execution",
        marathi: "कार्यक्रम समाप्त करते",
        insertText: "shevti(${value});",
        category: "builtin",
    },

    // Boolean values

    {
        token: "khare",
        label: "khare",
        description: "Boolean true",
        marathi: "खरे बूलियन मूल्य",
        insertText: "khare",
        category: "constant",
    },

    {
        token: "khote",
        label: "khote",
        description: "Boolean false",
        marathi: "खोटे बूलियन मूल्य",
        insertText: "khote",
        category: "constant",
    },

    // Word operators

    {
        token: "ani",
        label: "ani",
        description: "Logical AND",
        marathi: "तार्किक आणि",
        insertText: "ani",
        category: "operator",
    },

    {
        token: "va",
        label: "va",
        description: "Logical OR",
        marathi: "तार्किक किंवा",
        insertText: "va",
        category: "operator",
    },
];
