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
            "Executes a block of code if the specified condition evaluates to true.",
        marathi: "दिलेली अट खरी (khare) असेल तर हा कोड ब्लॉक चालवला जातो.",
        syntax: "jar (condition) {\n    // code\n}",
    },
    nahitar: {
        token: "nahitar",
        category: "Control Flow",
        english:
            "Executes a fallback block when the preceding 'jar' condition is false.",
        marathi: "आधीची 'jar' अट खोटी (khote) असल्यास हा ब्लॉक चालवला जातो.",
        syntax: "nahitar {\n    // code\n}",
    },
    anyatha: {
        token: "anyatha",
        category: "Control Flow",
        english:
            "Tests a subsequent condition if the previous 'jar' condition was false.",
        marathi: "पहिली अट खोटी असल्यास पुढची नवी अट तपासण्यासाठी वापरले जाते.",
        syntax: "anyatha jar (condition) {\n    // code\n}",
    },
    jovar: {
        token: "jovar",
        category: "Control Flow",
        english:
            "Repeats a block of code continuously as long as the condition remains true.",
        marathi: "जोपर्यंत अट खरी राहील तोपर्यंत हा लूप चालत राहील.",
        syntax: "jovar (condition) {\n    // code\n}",
    },
    pratyek: {
        token: "pratyek",
        category: "Control Flow",
        english:
            "Standard counting loop with initializer, condition, and increment.",
        marathi: "ठराविक फेऱ्यांसाठी मोजणी करणारा पुनरावृत्ती लूप.",
        syntax: "pratyek (he ank i = 0; i < 10; i++) {\n    // code\n}",
    },
    karya: {
        token: "karya",
        category: "Function",
        english:
            "Declares a callable function or subroutine in the source code.",
        marathi: "पुन्हा वापरता येण्याजोगे कार्य (function) घोषित करण्यासाठी.",
        syntax: "karya नाव(he ank x) {\n    partav x;\n}",
    },
    leeh: {
        token: "leeh",
        category: "Builtin",
        english:
            "Standard terminal output function that writes values to stdout.",
        marathi: "टर्मिनलवर आउटपुट किंवा मजकूर छापण्यासाठीचे मूलभूत विधान.",
        syntax: "leeh(value);",
    },
    shevti: {
        token: "shevti",
        category: "Builtin",
        english:
            "Terminates execution or marks cleanup at the end of execution.",
        marathi: "प्रोग्रामचा समारोप किंवा शेवट दर्शवण्यासाठी वापरले जाते.",
        syntax: "shevti;",
    },
    partav: {
        token: "partav",
        category: "Control Flow",
        english:
            "Returns a value from a function and yields control back to the caller.",
        marathi: "कार्यातून (function) मूल्य परत पाठवण्यासाठी.",
        syntax: "partav expression;",
    },
    thamba: {
        token: "thamba",
        category: "Control Flow",
        english:
            "Terminates the nearest enclosing loop or control construct immediately.",
        marathi: "चालू असलेला लूप ताबडतोब थांबवण्यासाठी.",
        syntax: "thamba;",
    },
    pudhe: {
        token: "pudhe",
        category: "Control Flow",
        english:
            "Skips the remainder of the current loop iteration and proceeds to the next.",
        marathi: "पुढील फेरीकडे जाण्यासाठी चालू फेरी वगळतो.",
        syntax: "pudhe;",
    },
    paryay: {
        token: "paryay",
        category: "Control Flow",
        english: "Multi-branch condition matching block (switch statement).",
        marathi: "अनेक पर्यायांमधून निवड करण्यासाठीचे विधान.",
        syntax: "paryay (value) {\n    // cases\n}",
    },
    ank: {
        token: "ank",
        category: "Data Type",
        english: "32-bit signed integer numeric type for whole numbers.",
        marathi: "पूर्णांक संख्या साठवण्यासाठीचा डेटा प्रकार.",
        syntax: "he ank x = 10;",
    },
    akshar: {
        token: "akshar",
        category: "Data Type",
        english: "Character or text string primitive type.",
        marathi: "अक्षर किंवा मजकूर साठवण्यासाठीचा प्रकार.",
        syntax: 'he akshar name = "Anvay";',
    },
    bhagank: {
        token: "bhagank",
        category: "Data Type",
        english: "Single-precision IEEE-754 floating-point decimal type.",
        marathi: "दशांश अपूर्णांक संख्यांसाठी वापरला जाणारा डेटा प्रकार.",
        syntax: "he bhagank pi = 3.14;",
    },
    purnank: {
        token: "purnank",
        category: "Data Type",
        english: "64-bit wide signed integer for large whole numbers.",
        marathi: "मोठ्या पूर्णांक संख्यांसाठी ६४-बिट डेटा प्रकार.",
        syntax: "he purnank big = 100000;",
    },
    vidhan: {
        token: "vidhan",
        category: "Data Type",
        english:
            "Boolean logic evaluation type holding either khare (true) or khote (false).",
        marathi: "सत्य (khare) किंवा असत्य (khote) दर्शवणारा तार्किक प्रकार.",
        syntax: "he vidhan check = khare;",
    },
    nirank: {
        token: "nirank",
        category: "Data Type",
        english:
            "Void type indicating the absence of any value or return value.",
        marathi: "काहीही मूल्य नसलेला शून्य प्रकार (Void).",
        syntax: "karya log(): nirank { ... }",
    },
    he: {
        token: "he",
        category: "Modifier",
        english:
            "Binding declaration specifier introducing a new local scope identifier.",
        marathi: "स्थानिक चल (variable) घोषित करण्यासाठीचा शब्द.",
        syntax: "he ank vay = 20;",
    },
    te: {
        token: "te",
        category: "Modifier",
        english: "Secondary immutable or constant assignment specifier.",
        marathi: "अचल किंवा निश्चित मूल्यासाठी वापरला जाणारा शब्द.",
        syntax: "te ank max = 100;",
    },
    khare: {
        token: "khare",
        category: "Boolean",
        english: "Literal representation for truthy boolean state (true).",
        marathi: "सत्य दर्शवणारे मूल्य.",
        syntax: "khare",
    },
    khote: {
        token: "khote",
        category: "Boolean",
        english: "Literal representation for falsy boolean state (false).",
        marathi: "असत्य दर्शवणारे मूल्य.",
        syntax: "khote",
    },
    ani: {
        token: "ani",
        category: "Operator",
        english:
            "Logical AND operator requiring both expressions to evaluate true.",
        marathi: "तार्किक 'आणि' (Logical AND) ऑपरेटर.",
        syntax: "cond1 ani cond2",
    },
    va: {
        token: "va",
        category: "Operator",
        english:
            "Logical OR operator requiring at least one expression to evaluate true.",
        marathi: "तार्किक 'किंवा' (Logical OR) ऑपरेटर.",
        syntax: "cond1 va cond2",
    },
};

export interface MrCompletion {
    token: string;
    category:
        | "keyword"
        | "type"
        | "control"
        | "builtin"
        | "variable"
        | "function"
        | "param";
    insertText: string;
    cursorOffset?: number;
}

export const mrCompletions: MrCompletion[] = [
    {
        token: "jar",
        category: "control",
        insertText: "jar () {\n    \n}",
        cursorOffset: -7,
    },
    {
        token: "jar-nahitar",
        category: "control",
        insertText: "jar () {\n    \n} nahitar {\n    \n}",
        cursorOffset: -23,
    },
    {
        token: "nahitar",
        category: "control",
        insertText: "nahitar {\n    \n}",
        cursorOffset: -2,
    },
    {
        token: "anyatha",
        category: "control",
        insertText: "anyatha jar () {\n    \n}",
        cursorOffset: -7,
    },
    {
        token: "jovar",
        category: "control",
        insertText: "jovar () {\n    \n}",
        cursorOffset: -7,
    },
    {
        token: "pratyek",
        category: "control",
        insertText: "pratyek (he ank i = 0; i < 10; i++) {\n    \n}",
        cursorOffset: -2,
    },
    { token: "thamba", category: "control", insertText: "thamba;" },
    { token: "pudhe", category: "control", insertText: "pudhe;" },
    { token: "partav", category: "control", insertText: "partav " },
    {
        token: "paryay",
        category: "control",
        insertText: "paryay () {\n    \n}",
        cursorOffset: -7,
    },
    {
        token: "karya",
        category: "function",
        insertText: "karya fnName() {\n    \n}",
        cursorOffset: -12,
    },
    {
        token: "leeh",
        category: "builtin",
        insertText: "leeh();",
        cursorOffset: -2,
    },
    { token: "shevti", category: "builtin", insertText: "shevti;" },
    { token: "he", category: "keyword", insertText: "he " },
    { token: "te", category: "keyword", insertText: "te " },
    { token: "ank", category: "type", insertText: "ank " },
    { token: "akshar", category: "type", insertText: "akshar " },
    { token: "bhagank", category: "type", insertText: "bhagank " },
    { token: "purnank", category: "type", insertText: "purnank " },
    { token: "vidhan", category: "type", insertText: "vidhan " },
    { token: "nirank", category: "type", insertText: "nirank" },
    { token: "khare", category: "keyword", insertText: "khare" },
    { token: "khote", category: "keyword", insertText: "khote" },
];

export function extractDynamicSymbols(code: string): MrCompletion[] {
    const list: MrCompletion[] = [];
    const seen = new Set<string>();

    const fnMatch = /karya\s+([A-Za-z_][A-Za-z0-9_]*)\s*\(([^)]*)\)/g;
    let m: RegExpExecArray | null;
    while ((m = fnMatch.exec(code)) !== null) {
        const fnName = m[1];
        if (!seen.has(fnName)) {
            seen.add(fnName);
            list.push({
                token: fnName,
                category: "function",
                insertText: `${fnName}()`,
                cursorOffset: -1,
            });
        }
        const params = m[2].split(",");
        for (const p of params) {
            const trimmed = p.trim().split(/\s+/).pop();
            if (
                trimmed &&
                /^[A-Za-z_][A-Za-z0-9_]*$/.test(trimmed) &&
                !seen.has(trimmed)
            ) {
                seen.add(trimmed);
                list.push({
                    token: trimmed,
                    category: "param",
                    insertText: trimmed,
                });
            }
        }
    }

    const varMatch =
        /(?:he|te)?\s*(?:ank|akshar|bhagank|purnank|vidhan|nirank)?\s+([A-Za-z_][A-Za-z0-9_]*)\s*(?:=|;)/g;
    while ((m = varMatch.exec(code)) !== null) {
        const name = m[1];
        if (
            name &&
            !seen.has(name) &&
            !mrCompletions.some((c) => c.token === name)
        ) {
            seen.add(name);
            list.push({ token: name, category: "variable", insertText: name });
        }
    }
    return list;
}

export function formatMrCode(source: string): string {
    const lines = source.split("\n");
    let indent = 0;
    const tab = "    ";
    let inComment = false;

    return lines
        .map((lineRaw) => {
            const line = lineRaw.trim();
            if (!line) return "";

            if (inComment) {
                if (line.includes("*/")) inComment = false;
                return `${tab.repeat(indent)}${line}`;
            }
            if (line.startsWith("/*") && !line.includes("*/")) {
                inComment = true;
                return `${tab.repeat(indent)}${line}`;
            }

            if (line.startsWith("}") || line.startsWith("]")) {
                indent = Math.max(0, indent - 1);
            }
            const currentIndent = indent;

            let opens = 0;
            let closes = 0;
            let inStr = false;
            let quote = "";
            for (let i = 0; i < line.length; i++) {
                const c = line[i];
                if ((c === '"' || c === "'") && line[i - 1] !== "\\") {
                    if (!inStr) {
                        inStr = true;
                        quote = c;
                    } else if (quote === c) {
                        inStr = false;
                    }
                }
                if (!inStr) {
                    if (c === "{" || c === "[") opens++;
                    if (c === "}" || c === "]") closes++;
                }
            }

            if (line.startsWith("}") || line.startsWith("]")) {
                indent = Math.max(0, currentIndent + opens);
            } else {
                indent = Math.max(0, indent + opens - closes);
            }

            return `${tab.repeat(currentIndent)}${line}`;
        })
        .join("\n");
}
