export type ExampleStatus = "ready" | "planned";

export type MrExample = {
    slug: string;
    title: string;
    marathiTitle: string;
    category: string;
    description: string;
    marathiDescription: string;
    code: string;
    output: string;
    status: ExampleStatus;
    note?: string;
};

export const examples: MrExample[] = [
    {
        slug: "types-and-variables",
        title: "Types & Variables",
        marathiTitle: "टाइप्स आणि व्हेरिएबल्स",
        category: "Foundations",
        description:
            "Bind values with explicit types, then let the machine do the rest.",
        marathiDescription:
            "स्पष्ट प्रकारांसह मूल्ये बांधा; पुढचे काम मशीन करू दे.",
        code: `// @anvaymayekar: https://github.com/anvaymayekar/custom-compiler

he ank marks = 92;                          // ank -> integer
he bhagank accuracy ahe 98.5;
// bhagank -> float | ahe -> immutable

he purnank credits ahe 21;
// purnank -> unsigned int

he akshar grade ahe 'A';                    // akshar -> character
he vidhan passed = khare;                   // vidhan -> boolean
/* true -> khare
   false -> khote */

te akshar username = "codepedia.io";
// te -> plural | he -> singular

leeh(username);                             // leeh() -> print()`,
        output: "codepedia.io",
        status: "ready",
    },
    {
        slug: "arithmetic-operators",
        title: "Arithmetic Operators",
        marathiTitle: "अंकगणिती ऑपरेटर्स",
        category: "Foundations",
        description:
            "The familiar arithmetic operators, expressed in Roman-script Marathi.",
        marathiDescription:
            "Roman-script Marathi मध्ये ओळखीचे अंकगणिती संकारक.",
        code: `// @anvaymayekar: https://github.com/anvaymayekar/custom-compiler

he ank a = 20;
he ank b = 6;

leeh(a + b);        // + -> addition
leeh(a - b);        // - -> subtraction
leeh(a * b);        // * -> multiplication
leeh(a / b);        // / -> division
leeh(a % b);        // % -> modulo`,
        output: "26\n14\n120\n3\n2",
        status: "ready",
    },
    {
        slug: "relational-operators",
        title: "Relational Operators",
        marathiTitle: "संबंधदर्शक ऑपरेटर्स",
        category: "Foundations",
        description: "Compare values and ask direct questions of your program.",
        marathiDescription:
            "मूल्यांची तुलना करून प्रोग्रामला थेट प्रश्न विचारा.",
        code: `// @anvaymayekar: https://github.com/anvaymayekar/custom-compiler

he ank a = 10;
he ank b = 20;

leeh(a == b);       // == -> equal
leeh(a != b);       // != -> not equal
leeh(a < b);        // < -> less than
leeh(a > b);        // > -> greater than
leeh(a <= b);       // <= -> less/equal
leeh(a >= b);       // >= -> greater/equal`,
        output: "khote\nkhare\nkhare\nkhote\nkhare\nkhote",
        status: "ready",
    },
    {
        slug: "logical-operators",
        title: "Logical Operators",
        marathiTitle: "तार्किक ऑपरेटर्स",
        category: "Foundations",
        description:
            "Combine truths with the small, readable vocabulary of .mr.",
        marathiDescription:
            "सत्य मूल्ये .mr च्या छोट्या, वाचनीय शब्दसंग्रहाने जोडा.",
        code: `// @anvaymayekar: https://github.com/anvaymayekar/custom-compiler

he vidhan a = khare;
he vidhan b = khote;

leeh(a ani b);      // ani -> logical AND
leeh(a va b);       // va -> logical OR
leeh(!a);           // ! -> logical NOT`,
        output: "khote\nkhare\nkhote",
        status: "ready",
    },
    {
        slug: "bitwise-operators",
        title: "Bitwise Operators",
        marathiTitle: "बिटवाइज ऑपरेटर्स",
        category: "Machine level",
        description: "Work close to the bits with and, or, xor and shifts.",
        marathiDescription: "and, or, xor आणि shifts ने बिट्सच्या जवळ काम करा.",
        code: `// @anvaymayekar: https://github.com/anvaymayekar/custom-compiler

he ank a = 12;
he ank b = 5;

leeh(a & b);        // & -> bitwise AND
leeh(a | b);        // | -> bitwise OR
leeh(a ^ b);        // ^ -> bitwise XOR
leeh(~a);           // ~ -> bitwise NOT
leeh(a << 1);       // << -> left shift
leeh(a >> 1);       // >> -> right shift`,
        output: "4\n13\n9\n-13\n24\n6",
        status: "ready",
    },
    {
        slug: "conditional-statements",
        title: "Conditional Statements",
        marathiTitle: "अटाधारित स्टेटमेंट्स",
        category: "Control flow",
        description: "Choose a path without losing the shape of the thought.",
        marathiDescription: "विचाराची रचना न गमावता योग्य मार्ग निवडा.",
        code: `// @anvaymayekar: https://github.com/anvaymayekar/custom-compiler

he bhagank temperature = 38.5;

jar (temperature >= 40.0) {
    leeh("Khup garam");
} nahitar (temperature >= 30.0) {
    leeh("Garam");
} anyatha {
    leeh("Samanya");
}`,
        output: "Garam",
        status: "ready",
    },
    {
        slug: "for-loop",
        title: "For Loop",
        marathiTitle: "फॉर लूप",
        category: "Control flow",
        description: "Repeat a known number of times, with a compact range.",
        marathiDescription:
            "ओळखीच्या संख्येइतक्या वेळा संक्षिप्त range सह पुन्हा करा.",
        code: `// @anvaymayekar: https://github.com/anvaymayekar/custom-compiler

he ank sum = 0;

pratyek (he ank i = 1; i <= 10; i++) {
    sum = sum + i;
}

leeh(sum);`,
        output: "55",
        status: "ready",
    },
    {
        slug: "while-loop",
        title: "While Loop",
        marathiTitle: "व्हाइल लूप",
        category: "Control flow",
        description: "Keep going while a condition remains true.",
        marathiDescription: "अट खरी असेपर्यंत काम चालू ठेवा.",
        code: `// @anvaymayekar: https://github.com/anvaymayekar/custom-compiler

he ank sum = 0;
he ank i = 0;

jovar (i < 10) {
    i++;
    jar (i % 2 == 0) {
        pudhe;
    }

    sum = sum + i;

    jar (sum > 15) {
        thamba;
    }
}

leeh(sum);`,
        output: "16",
        status: "ready",
    },
    {
        slug: "functions-and-arguments",
        title: "Functions & Arguments",
        marathiTitle: "कार्य आणि मूल्ये",
        category: "Functions",
        description:
            "Give a reusable idea a name and pass it the values it needs.",
        marathiDescription:
            "पुन्हा वापरता येणाऱ्या कल्पनेला नाव द्या आणि मूल्ये पाठवा.",
        code: `// @anvaymayekar: https://github.com/anvaymayekar/custom-compiler

he maze ank karya maximum(
    he ank a,
    he ank b
) {
    jar (a > b) {
        partav a;
    }

    partav b;
}

leeh(maximum(42, 27));`,
        output: "42",
        status: "ready",
    },
    {
        slug: "void-functions",
        title: "Void Functions",
        marathiTitle: "निरंक फंक्शन्स",
        category: "Functions",
        description: "A function can do useful work without returning a value.",
        marathiDescription: "मूल्य परत न करताही कार्य उपयुक्त काम करू शकते.",
        code: `// @anvaymayekar: https://github.com/anvaymayekar/custom-compiler

he nirank karya greet(
    te akshar name
) {
    leeh("Namaskar " + name);
}

greet("Anvay");`,
        output: "Namaskar Anvay",
        status: "ready",
        note: "The te parameter is intentional: it is part of the language example.",
    },
    {
        slug: "type-sizes",
        title: "Type Sizes",
        marathiTitle: "टाइप साइझेस",
        category: "Machine level",
        description: "See the memory footprint of the core numeric types.",
        marathiDescription:
            "मुख्य संख्यात्मक प्रकारांनी व्यापलेली memory पाहा.",
        code: `// @anvaymayekar: https://github.com/anvaymayekar/custom-compiler

he lahan ank small = 10;
he ank normal = 100;
he maha ank large = 1000;
he uch ank huge = 10000;

leeh(large);`,
        output: "1000",
        status: "ready",
    },
    {
        slug: "exit-code",
        title: "Exit Code",
        marathiTitle: "एक्झिट कोड",
        category: "Runtime",
        description: "Leave a native process with an explicit exit code.",
        marathiDescription:
            "स्पष्ट exit code सह native process मधून बाहेर पडा.",
        code: `// @anvaymayekar: https://github.com/anvaymayekar/custom-compiler

he ank status = 0;

jar (status == 0) {
    leeh("Yashasvi");

    /*
        shevti -> exit(code) | 0-255
        de facto (0)
    */

    shevti(101);
}

shevti(13);`,
        output: "",
        status: "ready",
    },
    {
        slug: "switch-statement",
        title: "Switch Statement",
        marathiTitle: "Switch विधान",
        category: "Control flow",
        description:
            "A branching form we are keeping visible while it is designed.",
        marathiDescription: "डिझाइन सुरू असताना दिसत ठेवलेले branching रूप.",
        code: `// @anvaymayekar: https://github.com/anvaymayekar/custom-compiler

he ank grade ahe 2;

paryay (grade) {                // paryay -> switch
    1:
        leeh("A");

    2:
        leeh("B");

    3:
        leeh("C");

    anyatha:
        leeh("Anolakhi");       // anyatha -> default
}`,
        output: "B",
        status: "ready",
    },
    {
        slug: "scope-size-levels",
        title: "Scope Size Levels",
        marathiTitle: "Scope आकार स्तर",
        category: "Language",
        description:
            "sarve can establish the default size level for declarations within a scope.",
        marathiDescription:
            "sarve scope मधील declarations साठी default size level निश्चित करू शकते.",
        code: `sarve lahan;

he ank x = 10;

sarve;
he ank y = 20;

sarve mahan;
he ank z = 30;

sarve uch;
he ank w = 40;`,
        output: "Each scope follows its selected size rule.",
        status: "planned",
    },

    {
        slug: "array-declaration",
        title: "Arrays",
        marathiTitle: "सरणी",
        category: "Data",
        description:
            "te declares a collection, such as a one-dimensional array.",
        marathiDescription:
            "te चा वापर एक-आयामी collection किंवा array साठी केला जातो.",
        code: `te ank marks = [85, 91, 78, 94, 88];

leeh(marks[0]);
leeh(marks[3]);`,
        output: "85\n94",
        status: "planned",
    },

    {
        slug: "array-assignment",
        title: "Array Element Assignment",
        marathiTitle: "सरणी घटक assignment",
        category: "Data",
        description:
            "Individual elements of an array can be accessed and assigned using an index.",
        marathiDescription:
            "Array मधील individual elements index वापरून access आणि assign करता येतात.",
        code: `te ank marks = [85, 91, 78, 94, 88];

marks[2] = 100;
leeh(marks[2]);`,
        output: "100",
        status: "planned",
    },

    {
        slug: "array-iteration",
        title: "Array Iteration",
        marathiTitle: "सरणी iteration",
        category: "Control flow",
        description: "Arrays can be traversed using a loop.",
        marathiDescription:
            "Loop वापरून array मधील प्रत्येक element traverse करता येतो.",
        code: `te ank marks = [85, 91, 78, 94, 88];

pratyek (marks) {
    leeh(marks);
}`,
        output: "85\n91\n78\n94\n88",
        status: "planned",
    },

    {
        slug: "struct-rachna",
        title: "Structures",
        marathiTitle: "रचना",
        category: "User-defined types",
        description:
            "rachna defines a structure that groups related data members together.",
        marathiDescription:
            "rachna संबंधित data members एकत्रित करण्यासाठी structure define करते.",
        code: `rachna Student {
    he ank roll;
    he akshar name;
    he bhagank percentage;
}

Student student;
student.roll = 30;
student.name = "Anvay";
student.percentage = 91.5;`,
        output: "Student structure created successfully.",
        status: "planned",
    },

    {
        slug: "enum-prakar",
        title: "Enumerations",
        marathiTitle: "प्रकार",
        category: "User-defined types",
        description:
            "prakar defines an enumeration containing a fixed set of named values.",
        marathiDescription:
            "prakar निश्चित named values असलेला enumeration define करते.",
        code: `prakar Grade {
    A,
    B,
    C,
    D
}

Grade grade = Grade.A;
leeh(grade);`,
        output: "A",
        status: "planned",
    },

    {
        slug: "class-varg",
        title: "Classes",
        marathiTitle: "वर्ग",
        category: "Object-oriented programming",
        description:
            "varg defines a class containing data and functions, with class members private by default.",
        marathiDescription:
            "varg data आणि functions असलेला class define करते. Class members default ने private असतात.",
        code: `varg Student {
    he ank roll;
    he akshar name;

    nirank karya() {
        leeh(name);
    }
}`,
        output: "Student class created successfully.",
        status: "planned",
    },

    {
        slug: "function-overloading",
        title: "Function Overloading",
        marathiTitle: "Function Overloading",
        category: "Functions",
        description:
            "Functions with the same name can be defined with different parameter signatures.",
        marathiDescription:
            "वेगवेगळ्या parameter signatures सह एकाच नावाची functions define करता येतात.",
        code: `ank karya(he ank a, he ank b) {
    partav a + b;
}

bhagank karya(he bhagank a, he bhagank b) {
    partav a + b;
}

leeh(karya(10, 20));
leeh(karya(10.5, 20.5));`,
        output: "30\n31.0",
        status: "planned",
    },

    {
        slug: "pointers",
        title: "Pointers",
        marathiTitle: "Pointers",
        category: "Memory",
        description:
            "Pointers provide direct access to memory addresses and indirect access to stored values.",
        marathiDescription:
            "Pointers memory addresses चा direct access आणि stored values चा indirect access देतात.",
        code: `he ank x = 10;
he ank* p = &x;

leeh(*p);`,
        output: "10",
        status: "planned",
    },

    {
        slug: "pointer-parameters",
        title: "Pointer Parameters",
        marathiTitle: "Pointer Parameters",
        category: "Functions",
        description:
            "Pointers can be passed to functions to allow indirect modification of values.",
        marathiDescription:
            "Value indirect पद्धतीने modify करण्यासाठी pointers functions मध्ये pass करता येतात.",
        code: `nirank karya(he ank* x) {
    *x = 100;
}

he ank value = 10;
karya(&value);
leeh(value);`,
        output: "100",
        status: "planned",
    },
];

export const readyExamples = examples.filter(
    (example) => example.status === "ready",
);

export function getExample(slug: string | null | undefined) {
    return (
        examples.find((example) => example.slug === slug) ?? readyExamples[0]
    );
}
