import { useEffect, useState, type ReactNode } from "react";
import { BookOpen, Terminal } from "lucide-react";
import { getExample } from "@/examples/registry";
import { cx } from "@/lib/format";
import { Shell } from "@/components/layout/Shell";
import { SectionEyebrow } from "@/components/shared/SectionEyebrow";
import { CodeBlock } from "@/components/shared/CodeBlock";

interface DocSectionItem {
    id: string;
    index: string;
    englishTitle: string;
    marathiTitle: string;
    token: string;
    subtitle: string;
    marathiSubtitle: string;
}

const docsSections: DocSectionItem[] = [
    {
        id: "what-is-mr",
        index: "00",
        englishTitle: "What is .mr?",
        marathiTitle: ".mr म्हणजे काय?",
        token: ".mr",
        subtitle: "A language with a point of view",
        marathiSubtitle: "मशीनला समजणारी मराठी",
    },
    {
        id: "installation",
        index: "01",
        englishTitle: "Installation & Toolchain",
        marathiTitle: "इन्स्टॉलेशन आणि टूलचेन",
        token: "setup",
        subtitle: "Building the native compiler",
        marathiSubtitle: "कम्पायलर सेट करणे",
    },
    {
        id: "first-program",
        index: "02",
        englishTitle: "Your first program",
        marathiTitle: "पहिला प्रोग्राम",
        token: "leeh",
        subtitle: "Speaking directly to stdout",
        marathiSubtitle: "पडद्यावर आउटपुट दाखवणे",
    },
    {
        id: "scalars-collections",
        index: "03",
        englishTitle: "Singular and plural bindings",
        marathiTitle: "एकवचन आणि अनेकवचन",
        token: "he & te",
        subtitle: "Scalars vs collections",
        marathiSubtitle: "एक मूल्य विरुद्ध संग्रह",
    },
    {
        id: "immutability-ahe",
        index: "04",
        englishTitle: "Truths that do not change",
        marathiTitle: "अपरिवर्तनीय मूल्ये",
        token: "ahe",
        subtitle: "Immutable constant bindings",
        marathiSubtitle: "स्थिर चलांची निर्मिती",
    },
    {
        id: "access-maze",
        index: "05",
        englishTitle: "Keeping things quiet",
        marathiTitle: "मर्यादित ॲक्सेस",
        token: "maze",
        subtitle: "Private, restricted scope",
        marathiSubtitle: "स्कोप मर्यादा आणि सुरक्षा",
    },
    {
        id: "size-modifiers",
        index: "06",
        englishTitle: "Scale and capacity",
        marathiTitle: "आकार आणि क्षमता",
        token: "lahan, maha, uch",
        subtitle: "Small, large, and ultra scaling",
        marathiSubtitle: "लहान, मोठे आणि अतिविशाल",
    },
    {
        id: "scope-sarve",
        index: "07",
        englishTitle: "A rule for the whole room",
        marathiTitle: "संपूर्ण स्कोपचा नियम",
        token: "sarve",
        subtitle: "Block-wide scope directives",
        marathiSubtitle: "ब्लॉकसाठी स्वतंत्र नियम",
    },
    {
        id: "type-ank",
        index: "08",
        englishTitle: "Signed integers",
        marathiTitle: "पूर्णांक संख्या",
        token: "ank",
        subtitle: "Whole numbers, positive or negative",
        marathiSubtitle: "धन आणि ऋण पूर्णांक",
    },
    {
        id: "type-akshar",
        index: "09",
        englishTitle: "Characters and words",
        marathiTitle: "अक्षर आणि शब्द",
        token: "akshar",
        subtitle: "Letters, phrases, and strings",
        marathiSubtitle: "वर्ण आणि मजकूर रचना",
    },
    {
        id: "type-bhagank",
        index: "10",
        englishTitle: "Fractions and precision",
        marathiTitle: "अपूर्णांक आणि दशांश",
        token: "bhagank",
        subtitle: "Floating-point numbers",
        marathiSubtitle: "दशांश अपूर्णांक मूल्ये",
    },
    {
        id: "type-purnank",
        index: "11",
        englishTitle: "Non-negative counting",
        marathiTitle: "ऋण नसलेली गणना",
        token: "purnank",
        subtitle: "Unsigned whole integers",
        marathiSubtitle: "केवळ धन पूर्णांक",
    },
    {
        id: "type-vidhan",
        index: "12",
        englishTitle: "Pure boolean truths",
        marathiTitle: "सत्य आणि असत्य",
        token: "vidhan",
        subtitle: "khare (true) and khote (false)",
        marathiSubtitle: "खरे किंवा खोटे तर्क",
    },
    {
        id: "type-nirank",
        index: "13",
        englishTitle: "Working without returning",
        marathiTitle: "शून्य रिटर्न प्रकार",
        token: "nirank",
        subtitle: "Void procedures and side effects",
        marathiSubtitle: "मूल्य परत न करणारी कार्ये",
    },
    {
        id: "operators-arithmetic",
        index: "14",
        englishTitle: "Arithmetic and changing state",
        marathiTitle: "अंकगणित आणि बदल",
        token: "+, -, *, /, %",
        subtitle: "Math and compound assignments",
        marathiSubtitle: "गणितीय संकारक व असाइनमेंट",
    },
    {
        id: "operators-relational",
        index: "15",
        englishTitle: "Asking questions of values",
        marathiTitle: "मूल्यांची तुलना आणि बिट्स",
        token: "==, !=, &, |",
        subtitle: "Relational checks and bitwise math",
        marathiSubtitle: "तुलना आणि बिट्सवरील प्रक्रिया",
    },
    {
        id: "words-ani-va",
        index: "16",
        englishTitle: "Words for logic",
        marathiTitle: "तार्किक जोडशब्द",
        token: "ani & va",
        subtitle: "Native logical AND & OR",
        marathiSubtitle: "मराठीतील AND आणि OR",
    },
    {
        id: "control-jar",
        index: "17",
        englishTitle: "Choosing a path",
        marathiTitle: "सशर्त मार्ग निवड",
        token: "jar",
        subtitle: "Primary if conditional",
        marathiSubtitle: "प्राथमिक अट तपासणी",
    },
    {
        id: "control-nahitar",
        index: "18",
        englishTitle: "Another possibility",
        marathiTitle: "पर्यायी अट",
        token: "nahitar",
        subtitle: "Mandatory condition else-if",
        marathiSubtitle: "कंसातील अनिवार्य पर्यायी अट",
    },
    {
        id: "control-anyatha",
        index: "19",
        englishTitle: "When nothing else matches",
        marathiTitle: "अंतिम पर्याय",
        token: "anyatha",
        subtitle: "Unconditional fallback else",
        marathiSubtitle: "बिनशर्त शेवटचा पर्याय",
    },
    {
        id: "loops-pratyek",
        index: "20",
        englishTitle: "Known iterations",
        marathiTitle: "ठरविक फेऱ्यांचे लूप",
        token: "pratyek",
        subtitle: "Traditional 3-part for loop",
        marathiSubtitle: "सुरूवात, अट आणि वाढ",
    },
    {
        id: "loops-jovar",
        index: "21",
        englishTitle: "Going as long as it holds",
        marathiTitle: "अट असेपर्यंत लूप",
        token: "jovar",
        subtitle: "Repeating while condition is khare",
        marathiSubtitle: "व्हाइल लूप पुनरावृत्ती",
    },
    {
        id: "jumps-thamba-pudhe",
        index: "22",
        englishTitle: "Breaking and stepping forward",
        marathiTitle: "थांबणे आणि पुढे जाणे",
        token: "thamba & pudhe",
        subtitle: "Loop break and continue",
        marathiSubtitle: "लूप थांबवणे व पुढची फेरी",
    },
    {
        id: "functions-karya",
        index: "23",
        englishTitle: "Giving ideas a name",
        marathiTitle: "कार्ये आणि परतावा",
        token: "karya & partav",
        subtitle: "Type-first functions and return",
        marathiSubtitle: "प्रकार आधी येणारी रचना",
    },
    {
        id: "exit-shevti",
        index: "24",
        englishTitle: "Leaving the machine",
        marathiTitle: "प्रक्रिया समाप्ती",
        token: "shevti",
        subtitle: "Explicit process exit status",
        marathiSubtitle: "थेट प्रोग्राम समाप्ती",
    },
    {
        id: "paryay-switch",
        index: "25",
        englishTitle: "Matching options",
        marathiTitle: "पर्यायांची निवड",
        token: "paryay",
        subtitle: "Multi-branch switch structure",
        marathiSubtitle: "केस मॅचिंग व anyatha: डीफॉल्ट",
    },
    {
        id: "planned-specs",
        index: "26",
        englishTitle: "On the horizon",
        marathiTitle: "नियोजित रचना",
        token: "rachna, varg, prakar",
        subtitle: "Upcoming structs, classes & enums",
        marathiSubtitle: "कम्पायलरच्या पुढच्या पायऱ्या",
    },
];

export default function DocsPage() {
    const [marathi, setMarathi] = useState(false);
    const [activeSection, setActiveSection] = useState("what-is-mr");

    // Scroll spy: tracks which chapter header is currently visible
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            {
                rootMargin: "-12% 0px -75% 0px",
                threshold: 0,
            },
        );

        docsSections.forEach((s) => {
            const el = document.getElementById(s.id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    const scrollToSection = (
        e: React.MouseEvent<HTMLAnchorElement>,
        id: string,
    ) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            const y =
                element.getBoundingClientRect().top + window.pageYOffset - 96;
            window.scrollTo({ top: y, behavior: "smooth" });
            setActiveSection(id);
        }
    };

    return (
        <Shell>
            <main className="mx-auto grid max-w-[1280px] min-w-0 w-full gap-8 px-4 sm:px-6 py-12 lg:grid-cols-[270px_minmax(0,1fr)] lg:gap-12 lg:px-8 lg:py-20">
                {/* Sticky Left Sidebar Navigation */}
                {/* Clean, Non-Glitched Sidebar */}
                <aside className="w-full min-w-0 lg:sticky lg:top-24 lg:h-[calc(100vh-7.5rem)] lg:flex lg:flex-col">
                    <div className="shrink-0 mb-4">
                        <SectionEyebrow>Docs / प्रलेखन</SectionEyebrow>
                        {/* Language Switcher */}
                        <div className="flex w-full rounded-lg border border-border bg-card p-1 shadow-sm">
                            <button
                                onClick={() => setMarathi(false)}
                                className={cx(
                                    "flex-1 rounded-md px-3 py-1.5 text-xs transition-colors",
                                    !marathi
                                        ? "bg-secondary text-foreground font-medium shadow-sm"
                                        : "text-muted-foreground hover:text-foreground",
                                )}
                                data-testid="button-docs-english"
                            >
                                English
                            </button>
                            <button
                                onClick={() => setMarathi(true)}
                                className={cx(
                                    "flex-1 rounded-md px-3 py-1.5 text-xs transition-colors",
                                    marathi
                                        ? "bg-secondary text-foreground font-medium shadow-sm"
                                        : "text-muted-foreground hover:text-foreground",
                                )}
                                data-testid="button-docs-marathi"
                            >
                                मराठी
                            </button>
                        </div>
                    </div>

                    {/* Desktop Sidebar with Native Isolation */}
                    <nav
                        className="hidden flex-1 overflow-y-auto pr-2 space-y-1 thin-scroll lg:block"
                        style={{ overscrollBehavior: "contain" }}
                    >
                        {docsSections.map((sec) => {
                            const isActive = activeSection === sec.id;
                            return (
                                <a
                                    key={sec.id}
                                    id={`nav-link-${sec.id}`}
                                    href={`#${sec.id}`}
                                    onClick={(e) => scrollToSection(e, sec.id)}
                                    className={cx(
                                        "group relative flex items-start gap-2.5 rounded-lg px-3 py-2 transition-all text-left",
                                        isActive
                                            ? "bg-primary/10 border border-primary/25 shadow-sm"
                                            : "hover:bg-secondary/60 border border-transparent",
                                    )}
                                    data-testid={`link-docs-${sec.id}`}
                                >
                                    {/* Number Tag */}
                                    <span
                                        className={cx(
                                            "mt-0.5 font-mono text-[10px] select-none",
                                            isActive
                                                ? "text-primary font-bold"
                                                : "text-muted-foreground/45 group-hover:text-muted-foreground",
                                        )}
                                    >
                                        {sec.index}
                                    </span>

                                    {/* Two-Line Title/Subtitle Hierarchy */}
                                    <div className="min-w-0 flex-1">
                                        <div
                                            className={cx(
                                                "font-mono text-xs font-semibold leading-4 truncate transition-colors",
                                                isActive
                                                    ? "text-primary"
                                                    : "text-foreground/90 group-hover:text-foreground",
                                            )}
                                        >
                                            {sec.token}
                                        </div>
                                        <div
                                            className={cx(
                                                "text-[10px] leading-tight truncate mt-0.5 transition-colors",
                                                isActive
                                                    ? "text-primary/75"
                                                    : "text-muted-foreground/70 group-hover:text-muted-foreground",
                                            )}
                                        >
                                            {marathi
                                                ? sec.marathiSubtitle
                                                : sec.subtitle}
                                        </div>
                                    </div>

                                    {/* Active Refraction Dot */}
                                    {isActive && (
                                        <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0 self-center" />
                                    )}
                                </a>
                            );
                        })}
                    </nav>

                    {/* Mobile Horizontal Quick-Rail */}
                    <nav className="thin-scroll flex gap-2 overflow-x-auto pb-2 lg:hidden">
                        {docsSections.map((sec) => {
                            const isActive = activeSection === sec.id;
                            return (
                                <a
                                    key={sec.id}
                                    href={`#${sec.id}`}
                                    onClick={(e) => scrollToSection(e, sec.id)}
                                    className={cx(
                                        "shrink-0 rounded-lg border px-3 py-1.5 font-mono text-xs transition-colors",
                                        isActive
                                            ? "border-primary/80 bg-primary/15 text-primary font-semibold"
                                            : "border-border/70 bg-card text-muted-foreground hover:text-foreground",
                                    )}
                                >
                                    {sec.token}
                                </a>
                            );
                        })}
                    </nav>
                </aside>

                {/* Article Content Column */}
                {/* Article Content Column */}
                <article className="min-w-0 w-full max-w-3xl overflow-hidden">
                    {/* Header Banner */}
                    <div className="mb-10 border-b border-border pb-8">
                        <div className="mb-3 flex items-center gap-2 font-mono text-xs text-primary">
                            <BookOpen size={14} /> language notes / master
                            specification
                        </div>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-.065em] break-words">
                            {marathi
                                ? "मशीनला समजणारी मराठी."
                                : "A language with a point of view."}
                        </h1>
                        <p className="mt-4 max-w-xl text-base sm:text-lg leading-7 text-muted-foreground">
                            {marathi
                                ? ".mr भाषेचे अधिकृत नियम, टोकन्स, प्रत्येक डेटा प्रकार आणि Linux x86-64 NASM असेंब्लीपर्यंतचा सविस्तर अभ्यास."
                                : "The exhaustive specification for .mr — individual token grammar, primitive numeric representations, storage qualifiers, and native compilation."}
                        </p>
                    </div>

                    {/* 1. What is .mr? */}
                    <DocSection
                        id="what-is-mr"
                        index="00"
                        token=".mr"
                        englishTitle="What is .mr?"
                        marathiTitle=".mr म्हणजे काय?"
                    >
                        <p>
                            {marathi
                                ? ".mr ही एक मूळ, सिस्टीम-स्तरीय प्रोग्रामिंग भाषा आहे जी थेट Linux x86-64 मशीन कोडमध्ये compile होते. ती केवळ वरवरचे भाषांतर नाही. स्त्रोत कोड आंतरराष्ट्रीय कीबोर्डवर सहज लिहिता यावा म्हणून Roman-script Marathi मध्ये ठेवला आहे."
                                : ".mr is a serious native programming language compiled directly to Linux x86-64 NASM assembly. Its design goal is Marathi as an authentic programming language vocabulary with coherent grammar, structured syntax, and direct hardware mapping."}
                        </p>
                        <div className="my-5 grid grid-cols-1 sm:grid-cols-3 gap-3 min-w-0 w-full">
                            {[
                                [
                                    "Tokenizer / Lexer",
                                    marathi
                                        ? "शब्दांचे टोकन्स"
                                        : "source into tokens",
                                ],
                                [
                                    "Parser & AST",
                                    marathi
                                        ? "रचना आणि झाड"
                                        : "tokens into typed AST",
                                ],
                                [
                                    "NASM Codegen",
                                    marathi
                                        ? "थेट x86-64 कोड"
                                        : "AST into assembly",
                                ],
                            ].map(([title, copy]) => (
                                <div
                                    key={title}
                                    className="rounded-xl border border-border bg-card p-4 min-w-0"
                                >
                                    <span className="font-mono text-[10px] text-primary font-semibold">
                                        {title}
                                    </span>
                                    <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
                                        {copy}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </DocSection>
                    {/* Installation & Toolchain */}
                    <DocSection
                        id="installation"
                        index="01"
                        token="setup"
                        englishTitle="Installation & Toolchain"
                        marathiTitle="इन्स्टॉलेशन आणि टूलचेन"
                    >
                        <p>
                            {marathi
                                ? ".mr चा कम्पायलर CMake, C++20 आणि Netwide Assembler (NASM) वापरून थेट Linux x86-64 साठी तयार होतो. Windows वापरकर्त्यांसाठी WSL2 (Ubuntu) वापरणे अनिवार्य आहे, कारण तयार होणारी एक्झिक्युटेबल फाईल नेटिव्ह ELF64 बायनरी असते."
                                : "The .mr toolchain is built with modern CMake and C++20, targeting Linux x86-64 NASM. Because the compiler outputs native Linux ELF64 executables, Windows users must run inside WSL2."}
                        </p>

                        {/* Prerequisites Pill Cards */}
                        <div className="my-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="rounded-xl border border-border bg-card p-3.5">
                                <span className="font-mono text-xs font-bold text-primary">
                                    Toolchain
                                </span>
                                <p className="mt-1 text-xs text-muted-foreground leading-5">
                                    {marathi
                                        ? "build-essential (g++ C++20) & cmake"
                                        : "build-essential (g++ C++20) & CMake"}
                                </p>
                            </div>
                            <div className="rounded-xl border border-border bg-card p-3.5">
                                <span className="font-mono text-xs font-bold text-primary">
                                    Assembler
                                </span>
                                <p className="mt-1 text-xs text-muted-foreground leading-5">
                                    {marathi
                                        ? "Netwide Assembler (NASM)"
                                        : "Netwide Assembler (NASM)"}
                                </p>
                            </div>
                            <div className="rounded-xl border border-border bg-card p-3.5">
                                <span className="font-mono text-xs font-bold text-primary">
                                    Environment
                                </span>
                                <p className="mt-1 text-xs text-muted-foreground leading-5">
                                    {marathi
                                        ? "Ubuntu / Debian किंवा Windows WSL2"
                                        : "Ubuntu / Debian or Windows WSL2"}
                                </p>
                            </div>
                        </div>

                        {/* Windows WSL Note */}
                        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-xs sm:text-sm">
                            <div className="flex items-center gap-2 font-mono text-xs font-semibold text-primary">
                                <Terminal size={14} />
                                {marathi
                                    ? "Windows वापरकर्त्यांसाठी (WSL2 सेटअप)"
                                    : "Windows Users — WSL2 Setup"}
                            </div>
                            <p className="mt-2 text-xs leading-6 text-muted-foreground">
                                {marathi
                                    ? "Windows वर PowerShell ॲडमिनिस्ट्रेटर म्हणून उघडा आणि `wsl --install` चालवून संगणक रीस्टार्ट करा. त्यानंतर Ubuntu टर्मिनल उघडून खालील कमांड्स द्या."
                                    : "Open PowerShell as Administrator, run `wsl --install`, and restart your PC. Once Ubuntu launches, run the commands below directly inside the WSL terminal."}
                            </p>
                        </div>

                        {/* Build Steps Terminal Block */}
                        <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl shadow-2xl">
                            <div className="flex items-center justify-between border-b border-white/[0.06] bg-white/[0.02] px-4 py-2.5">
                                <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground/80">
                                    <Terminal
                                        size={13}
                                        className="text-primary"
                                    />
                                    <span>bash — clone, build &amp; run</span>
                                </div>
                                <span className="font-mono text-[10px] text-primary/80">
                                    linux-x86_64
                                </span>
                            </div>
                            <pre className="overflow-x-auto p-4 font-mono text-xs leading-6 text-[#c5d1ee] whitespace-pre drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                                {`# 1. Install prerequisites (Ubuntu / WSL2)
sudo apt update
sudo apt install -y build-essential cmake nasm git

# 2. Clone the official repository and enter the directory
git clone https://github.com/anvaymayekar/custom-compiler.git
cd custom-compiler

# (Optional) If you already have the repo, pull the latest updates
git pull origin main

# 3. Configure and build the compiler with CMake
cmake -S . -B build/
cmake --build build

# This outputs:
#   build/compiler        -> The .mr native compiler binary
#   build/tests/mr_tests  -> The unit test suite

# 4. Compile a .mr source file
./build/compiler source.mr

# 5. Run the produced native executable
./out

# 6. Inspect the process exit code (from shevti)
echo $?`}
                            </pre>
                        </div>

                        {/* Pipeline Execution Details */}
                        <div className="space-y-2 text-xs leading-6 text-muted-foreground pt-1">
                            <p>
                                <strong className="text-foreground font-mono">
                                    git clone ... / git pull
                                </strong>{" "}
                                :{" "}
                                {marathi
                                    ? "GitHub वरून custom-compiler चा सोर्स कोड स्थानिक मशीनवर आणतो आणि नवीनतम अपडेट्स synchronise करतो."
                                    : "Clones the custom-compiler repository locally or syncs the latest commits from the main branch."}
                            </p>
                            <p>
                                <strong className="text-foreground font-mono">
                                    ./build/compiler source.mr
                                </strong>{" "}
                                :{" "}
                                {marathi
                                    ? "सोर्स कोडचे टोकन्स, पार्सिंग, आणि सिमेंटिक चेकिंग करून x86-64 असेंब्ली कोड तयार करतो आणि NASM द्वारे थेट `./out` ही बायनरी बनवतो."
                                    : "Runs lexing, parsing, semantic verification, emits x86-64 NASM assembly, and links the final `./out` ELF64 binary."}
                            </p>
                            <p>
                                <strong className="text-foreground font-mono">
                                    echo $?
                                </strong>{" "}
                                :{" "}
                                {marathi
                                    ? "प्रोग्रामचा एक्झिट स्टेटस दाखवतो. .mr मधील `shevti(code)` द्वारे दिलेला एक्झिट कोड येथे तपासता येतो."
                                    : "Prints the process termination code, allowing you to directly inspect the exit value returned by `shevti(code)`."}
                            </p>
                        </div>
                    </DocSection>
                    {/* 2. Your first program */}
                    <DocSection
                        id="first-program"
                        index="02"
                        token="leeh"
                        englishTitle="Your first program"
                        marathiTitle="पहिला प्रोग्राम"
                    >
                        <p>
                            {marathi
                                ? "leeh हे .mr मधील आउटपुटसाठीचे मूलभूत विधान आहे. मजकूर, चल किंवा थेट गणिती मांडणी पडद्यावर दाखवण्यासाठी leeh वापरले जाते."
                                : "Start with the simplest interaction. `leeh` is the language's built-in output statement, accepting strings, variable bindings, or compound arithmetic expressions."}
                        </p>
                        <CodeBlock
                            example={{
                                slug: "types-and-variables",
                                title: "first_program.mr",
                                marathiTitle: "पहिला प्रोग्राम",
                                category: "Foundations",
                                description:
                                    "Hello world and basic output statement in .mr",
                                marathiDescription:
                                    "पहिला leeh आउटपुट प्रोग्राम",
                                code: `leeh("Namaskar, .mr!");\n\nhe ank year = 2026;\nleeh(year);`,
                                output: "Namaskar, .mr!\n2026",
                                status: "ready",
                            }}
                        />
                    </DocSection>

                    {/* 3. he & te */}
                    <DocSection
                        id="scalars-collections"
                        index="03"
                        token="he & te"
                        englishTitle="Singular and plural bindings"
                        marathiTitle="एकवचन आणि अनेकवचन"
                    >
                        <p>
                            {marathi
                                ? ".mr मध्ये चलांची घोषणा करताना मूल्याच्या स्वरूपावर आधारलेला मूलभूत फरक केला जातो. 'he' हा एका सुट्या मूल्यासाठी (Scalar) वापरला जातो, तर 'te' हा मूल्यांच्या संग्रहासाठी (Collection/Array) वापरला जातो. (te चा अर्थ immutable असा होत नाही)."
                                : ".mr differentiates storage multiplicity at declaration time. `he` denotes an individual scalar value, while `te` denotes an array or collection binding. Crucially, `te` does NOT mean constant or immutable."}
                        </p>
                        <CodeBlock example={getExample("array-declaration")} />
                    </DocSection>

                    {/* 4. ahe */}
                    <DocSection
                        id="immutability-ahe"
                        index="04"
                        token="ahe"
                        englishTitle="Truths that do not change"
                        marathiTitle="अपरिवर्तनीय मूल्ये"
                    >
                        <p>
                            {marathi
                                ? "'ahe' हा कीवर्ड अपरिवर्तनीय (constant / immutable) चलांसाठी वापरला जातो. एकदा मूल्य नियुक्त केल्यानंतर ते पुन्हा बदलता येत नाही. 'ahe' आणि 'te' मध्ये गल्लत करू नये."
                                : "`ahe` represents an immutable / constant declaration in .mr. Once assigned, its value cannot subsequently be overwritten or reassigned. Never confuse `ahe` with `te`."}
                        </p>
                        <CodeBlock
                            example={getExample("types-and-variables")}
                        />
                    </DocSection>

                    {/* 5. maze */}
                    <DocSection
                        id="access-maze"
                        index="05"
                        token="maze"
                        englishTitle="Keeping things quiet"
                        marathiTitle="मर्यादित ॲक्सेस"
                    >
                        <p>
                            {marathi
                                ? "'maze' हा प्रायव्हेट किंवा प्रतिबंधित स्कोपचा ॲक्सेस मॉडिफायर आहे. हा डेटा प्रकार नसून केवळ ॲक्सेस लेव्हल नियंत्रित करतो."
                                : "`maze` represents private / access-restricted scope modifier. It is an access modifier analogous to private visibility, never a data type."}
                        </p>
                        <CodeBlock
                            example={getExample("functions-and-arguments")}
                        />
                    </DocSection>

                    {/* 6. lahan, maha, uch */}
                    <DocSection
                        id="size-modifiers"
                        index="06"
                        token="lahan, maha, uch"
                        englishTitle="Scale and capacity"
                        marathiTitle="आकार आणि क्षमता"
                    >
                        <p>
                            {marathi
                                ? "डेटा प्रकाराच्या आकाराचे प्रमाण दर्शवण्यासाठी .mr मध्ये तीन स्वतंत्र मॉडिफायर्स आहेत: 'lahan' (लहान/small), 'maha' (मोठे/large), आणि 'uch' (अतिविशाल/ultra scale)."
                                : "The language provides dedicated scale modifiers to adjust the storage capacity of types: `lahan` (small), `maha` (large), and `uch` (ultra scale)."}
                        </p>
                        <CodeBlock example={getExample("type-sizes")} />
                    </DocSection>

                    {/* 7. sarve */}
                    <DocSection
                        id="scope-sarve"
                        index="07"
                        token="sarve"
                        englishTitle="A rule for the whole room"
                        marathiTitle="संपूर्ण स्कोपचा नियम"
                    >
                        <p>
                            {marathi
                                ? "'sarve' हा सामान्य चल मॉडिफायर नसून संपूर्ण स्कोपसाठीचा स्वतंत्र नियम आहे. तो ब्लॉकच्या वर लिहिला जातो आणि पुढील संपूर्ण ब्लॉकला लागू होतो. कंसात लिहू नये."
                                : "`sarve` is a standalone scope-level directive. It is written directly above a block without parentheses and applies uniformly across the entire following scope."}
                        </p>
                        <CodeBlock example={getExample("scope-size-levels")} />
                    </DocSection>

                    {/* 8. ank */}
                    <DocSection
                        id="type-ank"
                        index="08"
                        token="ank"
                        englishTitle="Signed integers"
                        marathiTitle="पूर्णांक संख्या"
                    >
                        <p>
                            {marathi
                                ? "'ank' हा .mr मधील मूलभूत स्वाक्षरीयुक्त पूर्णांक प्रकार (Signed Integer) आहे. तो धन व ऋण दोन्ही संख्या साठवू शकतो."
                                : "`ank` represents the standard signed integer numeric type in .mr, backed by machine registers for integer arithmetic."}
                        </p>
                        <CodeBlock
                            example={getExample("arithmetic-operators")}
                        />
                    </DocSection>

                    {/* 9. akshar */}
                    <DocSection
                        id="type-akshar"
                        index="09"
                        token="akshar"
                        englishTitle="Characters and words"
                        marathiTitle="अक्षर आणि शब्द"
                    >
                        <p>
                            {marathi
                                ? "'akshar' हा एकल वर्ण (Character) तसेच मजकूर (Text / String) साठवण्यासाठीचा मूलभूत डेटा प्रकार आहे."
                                : "`akshar` is the character and text-oriented type. It handles individual character literals ('A') as well as complete string literals (\"Anvay\")."}
                        </p>
                        <CodeBlock example={getExample("void-functions")} />
                    </DocSection>

                    {/* 10. bhagank */}
                    <DocSection
                        id="type-bhagank"
                        index="10"
                        token="bhagank"
                        englishTitle="Fractions and precision"
                        marathiTitle="अपूर्णांक आणि दशांश"
                    >
                        <p>
                            {marathi
                                ? "'bhagank' हा दशांश चिन्हांकित अपूर्णांक संख्यांसाठीचा (Floating-point) प्रकार आहे."
                                : "`bhagank` denotes the fractional / floating-point numeric type, designed for values with decimal components."}
                        </p>
                        <CodeBlock
                            example={getExample("conditional-statements")}
                        />
                    </DocSection>

                    {/* 11. purnank */}
                    <DocSection
                        id="type-purnank"
                        index="11"
                        token="purnank"
                        englishTitle="Non-negative counting"
                        marathiTitle="ऋण नसलेली गणना"
                    >
                        <p>
                            {marathi
                                ? "'purnank' हा केवळ ऋण नसलेल्या धन पूर्णांक संख्यांसाठी (Unsigned integer) वापरला जाणारा डेटा प्रकार आहे."
                                : "`purnank` represents the non-negative / unsigned whole-number integer type, intended for non-negative indices and memory measurements."}
                        </p>
                        <CodeBlock
                            example={getExample("types-and-variables")}
                        />
                    </DocSection>

                    {/* 12. vidhan */}
                    <DocSection
                        id="type-vidhan"
                        index="12"
                        token="vidhan"
                        englishTitle="Pure boolean truths"
                        marathiTitle="सत्य आणि असत्य"
                    >
                        <p>
                            {marathi
                                ? "'vidhan' हा बुलियन डेटा प्रकार आहे. या प्रकारामध्ये केवळ दोनच लिटरल्स वैध असतात: 'khare' (true) आणि 'khote' (false)."
                                : "`vidhan` is the boolean type. It accepts strictly two boolean literals: `khare` (true) and `khote` (false)."}
                        </p>
                        <CodeBlock example={getExample("logical-operators")} />
                    </DocSection>

                    {/* 13. nirank */}
                    <DocSection
                        id="type-nirank"
                        index="13"
                        token="nirank"
                        englishTitle="Working without returning"
                        marathiTitle="शून्य रिटर्न प्रकार"
                    >
                        <p>
                            {marathi
                                ? "'nirank' हा मूल्य नसलेला (Void) प्रकार आहे. ज्या कार्यांमधून (functions) कोणतेही मूल्य परत पाठवायचे नसते, तिथे nirank वापरला जातो."
                                : "`nirank` represents the void / no-return-value type. It is designated for functions that execute side effects without returning data to the caller."}
                        </p>
                        <CodeBlock example={getExample("void-functions")} />
                    </DocSection>

                    {/* 14. Arithmetic */}
                    <DocSection
                        id="operators-arithmetic"
                        index="14"
                        token="+,-,*,/,%"
                        englishTitle="Arithmetic and changing state"
                        marathiTitle="अंकगणित आणि बदल"
                    >
                        <p>
                            {marathi
                                ? "मूलभूत अंकगणिती संकारक (+, -, *, /, %) तसेच चक्रवाढ असाइनमेंट (+=, -=, *=, /=, %=) पूर्णपणे समर्थित आहेत."
                                : ".mr supports full mathematical operator precedence alongside standard compound assignments."}
                        </p>
                        <CodeBlock
                            example={getExample("arithmetic-operators")}
                        />
                    </DocSection>

                    {/* 15. Relational & Bitwise */}
                    <DocSection
                        id="operators-relational"
                        index="15"
                        token="==,!=,&,|"
                        englishTitle="Asking questions of values"
                        marathiTitle="मूल्यांची तुलना आणि बिट्स"
                    >
                        <p>
                            {marathi
                                ? "मूल्यांची तुलना करण्यासाठी (==, !=, <, >, <=, >=) आणि थेट बिट्सवर प्रक्रिया करण्यासाठी (&, |, ^, ~, <<, >>) ऑपरेटर्स उपलब्ध आहेत."
                                : "Comparison and low-level bitwise operations are distinct expressions inside the compiler pipeline."}
                        </p>
                        <CodeBlock
                            example={getExample("relational-operators")}
                        />
                        <div className="mt-4">
                            <CodeBlock
                                example={getExample("bitwise-operators")}
                            />
                        </div>
                    </DocSection>

                    {/* 16. ani & va */}
                    <DocSection
                        id="words-ani-va"
                        index="16"
                        token="ani & va"
                        englishTitle="Words for logic"
                        marathiTitle="तार्किक जोडशब्द"
                    >
                        <p>
                            {marathi
                                ? "तार्किक संबंधांसाठी .mr मध्ये इंग्रजी प्रतीकांऐवजी अस्सल मराठी शब्द वापरले जातात: 'ani' म्हणजे Logical AND, आणि 'va' म्हणजे Logical OR."
                                : "Boolean conjunction and disjunction use dedicated Marathi words: `ani` stands for logical AND (`&&`), and `va` stands for logical OR (`||`)."}
                        </p>
                        <CodeBlock example={getExample("logical-operators")} />
                    </DocSection>

                    {/* 17. jar */}
                    <DocSection
                        id="control-jar"
                        index="17"
                        token="jar"
                        englishTitle="Choosing a path"
                        marathiTitle="सशर्त मार्ग निवड"
                    >
                        <p>
                            {marathi
                                ? "'jar' म्हणजे 'if'. अट नेहमी कंसात असावी लागते. कंसाशिवाय jar लिहू नये."
                                : "`jar` defines the initial conditional branch (`if`). The condition must strictly reside inside parentheses."}
                        </p>
                        <CodeBlock
                            example={getExample("conditional-statements")}
                        />
                    </DocSection>

                    {/* 18. nahitar */}
                    <DocSection
                        id="control-nahitar"
                        index="18"
                        token="nahitar"
                        englishTitle="Another possibility"
                        marathiTitle="पर्यायी अट"
                    >
                        <p>
                            {marathi
                                ? "'nahitar' म्हणजे 'else if'. यासाठी अट असणे बंधनकारक आहे. हे अंतिम else नसून पर्यायी अट तपासणीसाठी आहे."
                                : "`nahitar` represents `else if`. It is NOT unconditional else; it MUST always take a parenthesized condition."}
                        </p>
                        <CodeBlock
                            example={getExample("conditional-statements")}
                        />
                    </DocSection>

                    {/* 19. anyatha */}
                    <DocSection
                        id="control-anyatha"
                        index="19"
                        token="anyatha"
                        englishTitle="When nothing else matches"
                        marathiTitle="अंतिम पर्याय"
                    >
                        <p>
                            {marathi
                                ? "'anyatha' म्हणजे बिनशर्त 'else'. याच्यासमोर कोणतीही अट किंवा कंस लिहू नयेत."
                                : "`anyatha` represents unconditional fallback (`else`). It NEVER takes a condition or parentheses."}
                        </p>
                        <CodeBlock
                            example={getExample("conditional-statements")}
                        />
                    </DocSection>

                    {/* 20. pratyek */}
                    <DocSection
                        id="loops-pratyek"
                        index="20"
                        token="pratyek"
                        englishTitle="Known iterations"
                        marathiTitle="ठरविक फेऱ्यांचे लूप"
                    >
                        <p>
                            {marathi
                                ? "'pratyek' हा पारंपारिक तीन-भागांचा फॉर लूप दर्शवतो: सुरूवात; अट; आणि वाढ किंवा घट."
                                : "`pratyek` defines the traditional 3-part loop: initialization, condition, and step increment/decrement."}
                        </p>
                        <CodeBlock example={getExample("for-loop")} />
                    </DocSection>

                    {/* 21. jovar */}
                    <DocSection
                        id="loops-jovar"
                        index="21"
                        token="jovar"
                        englishTitle="Going as long as it holds"
                        marathiTitle="अट असेपर्यंत लूप"
                    >
                        <p>
                            {marathi
                                ? "'jovar' हा व्हाइल लूप आहे. जोपर्यंत कंसामधील अट सत्य (khare) असते, तोपर्यंत हा लूप चालतो."
                                : "`jovar` defines a while loop that continues iterating as long as its condition evaluates to `khare`."}
                        </p>
                        <CodeBlock example={getExample("while-loop")} />
                    </DocSection>

                    {/* 22. thamba & pudhe */}
                    <DocSection
                        id="jumps-thamba-pudhe"
                        index="22"
                        token="thamba & pudhe"
                        englishTitle="Breaking and stepping forward"
                        marathiTitle="थांबणे आणि पुढे जाणे"
                    >
                        <p>
                            {marathi
                                ? "लूपमधून तात्काळ बाहेर पडण्यासाठी 'thamba' (break) आणि उर्वरित कोड वगळून पुढील फेरीत जाण्यासाठी 'pudhe' (continue) वापरतात."
                                : "Loop flow is intercepted using `thamba` (break early from loop) and `pudhe` (skip to next iteration)."}
                        </p>
                        <CodeBlock example={getExample("while-loop")} />
                    </DocSection>

                    {/* 23. karya & partav */}
                    <DocSection
                        id="functions-karya"
                        index="23"
                        token="karya & partav"
                        englishTitle="Giving ideas a name"
                        marathiTitle="कार्ये आणि परतावा"
                    >
                        <p>
                            {marathi
                                ? ".mr मध्ये फंक्शन तयार करताना return प्रकार नेहमी 'karya' शब्दाच्या आधी येतो. फंक्शनमधून मूल्य परत पाठवण्यासाठी 'partav' वापरतात."
                                : "In .mr, the return type is placed strictly BEFORE the `karya` declaration keyword. Return expressions use `partav`."}
                        </p>
                        <CodeBlock
                            example={getExample("functions-and-arguments")}
                        />
                    </DocSection>

                    {/* 24. shevti */}
                    <DocSection
                        id="exit-shevti"
                        index="24"
                        token="shevti"
                        englishTitle="Leaving the machine"
                        marathiTitle="प्रक्रिया समाप्ती"
                    >
                        <p>
                            {marathi
                                ? "'shevti' हा फंक्शनमधून परत येण्यासाठी नसून संपूर्ण प्रोग्राम व प्रक्रिया (Exit process) बंद करण्यासाठी वापरला जातो. partav आणि shevti वेगळे आहेत."
                                : "`shevti` explicitly terminates the executable process with an exit status. Never confuse `partav` (return from function) with `shevti` (program termination)."}
                        </p>
                        <CodeBlock example={getExample("exit-code")} />
                    </DocSection>

                    {/* 25. paryay */}
                    <DocSection
                        id="paryay-switch"
                        index="25"
                        token="paryay"
                        englishTitle="Matching options"
                        marathiTitle="पर्यायांची निवड"
                    >
                        <p>
                            {marathi
                                ? "मल्टी-केस मॅचिंगसाठी 'paryay' वापरले जाते. यामध्ये डीफॉल्ट पर्यायासाठी 'anyatha:' हे लेबल वापरले जाते."
                                : "`paryay` provides multi-case matching where `anyatha:` serves as the fallback default label."}
                        </p>
                        <CodeBlock example={getExample("switch-statement")} />
                    </DocSection>

                    {/* 26. Planned Specifications */}
                    <DocSection
                        id="planned-specs"
                        index="26"
                        token="rachna, varg, prakar"
                        englishTitle="On the horizon"
                        marathiTitle="नियोजित रचना"
                    >
                        <p>
                            {marathi
                                ? "खालील कीवर्ड्स .mr भाषेच्या व्याकरण शब्दकोशात राखीव आहेत आणि आगामी आवृत्तीत उपलब्ध केले जातील:"
                                : "The following structures are formally reserved in the language grammar and scheduled for implementation:"}
                        </p>
                        <div className="mt-4 space-y-4">
                            <div>
                                <h4 className="font-mono text-xs text-primary font-bold mb-1">
                                    rachna (Structures)
                                </h4>
                                <CodeBlock
                                    example={getExample("struct-rachna")}
                                />
                            </div>
                            <div>
                                <h4 className="font-mono text-xs text-primary font-bold mb-1">
                                    varg (Classes)
                                </h4>
                                <CodeBlock example={getExample("class-varg")} />
                            </div>
                            <div>
                                <h4 className="font-mono text-xs text-primary font-bold mb-1">
                                    prakar (Enumerations)
                                </h4>
                                <CodeBlock
                                    example={getExample("enum-prakar")}
                                />
                            </div>
                            <div>
                                <h4 className="font-mono text-xs text-primary font-bold mb-1">
                                    Pointers
                                </h4>
                                <CodeBlock example={getExample("pointers")} />
                            </div>
                        </div>
                    </DocSection>
                </article>
            </main>
        </Shell>
    );
}

function DocSection({
    id,
    index,
    englishTitle,
    marathiTitle,
    token,
    children,
}: {
    id: string;
    index: string;
    englishTitle: string;
    marathiTitle: string;
    token: string;
    children: ReactNode;
}) {
    return (
        <section
            id={id}
            className="scroll-mt-24 border-b border-border/80 py-10 sm:py-12 first:pt-0 last:border-0 min-w-0 w-full overflow-hidden"
        >
            {/* Metadata Pill */}
            <div className="mb-3 flex items-center gap-2">
                <span className="font-mono text-[11px] font-semibold text-primary">
                    {index}
                </span>
                <span className="h-1 w-1 rounded-full bg-border" />
                <span className="rounded border border-primary/25 bg-primary/5 px-2 py-0.5 font-mono text-[11px] font-medium text-primary">
                    {token}
                </span>
            </div>

            {/* Bilingual Header */}
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-[-.04em] text-foreground flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span>{englishTitle}</span>
                <span className="text-muted-foreground/40 font-light select-none">
                    /
                </span>
                <span className="marathi-font text-xl sm:text-2xl font-semibold text-muted-foreground">
                    {marathiTitle}
                </span>
            </h2>

            {/* Content Body */}
            <div className="mt-5 space-y-4 text-sm leading-7 text-muted-foreground min-w-0 w-full">
                {children}
            </div>
        </section>
    );
}

