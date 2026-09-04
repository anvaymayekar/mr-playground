import { ExternalLink, Github, Linkedin } from "lucide-react";
import { Shell } from "@/components/layout/Shell";
import { SectionEyebrow } from "@/components/shared/SectionEyebrow";

export default function AboutPage() {
    return (
        <Shell>
            <main className="mx-auto max-w-[1240px] px-5 py-16 lg:px-8 lg:py-24">
                {/* Hero Header Section with Large Logo */}
                <div className="relative grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                    <div className="animate-rise-in">
                        <SectionEyebrow>About / आमच्याबद्दल</SectionEyebrow>
                        <h1 className="text-5xl font-semibold leading-[.95] tracking-[-.07em] sm:text-7xl">
                            A language
                            <br />
                            <span className="text-primary">with a home.</span>
                        </h1>
                        <p className="mt-7 max-w-lg text-lg leading-8 text-muted-foreground">
                            .mr is my invitation: to bring Marathi closer to the
                            metal, one careful abstraction layer at a time.
                        </p>
                        <p className="marathi-font mt-2 max-w-lg text-base leading-7 text-foreground/70">
                            .mr हे माझे आमंत्रण आहे: संगणकाच्या गाभ्याशी मराठी
                            भाषेला एक-एक विचारपूर्वक थराने जोडण्याचे.
                        </p>
                    </div>

                    {/* Logo Focal Element */}
                    <div className="relative flex items-center justify-center lg:justify-end">
                        {/* Ambient Glow */}
                        <div className="pointer-events-none absolute h-64 w-64 rounded-full bg-primary/15 blur-3xl" />

                        <div className="relative flex flex-col items-center justify-center rounded-3xl border border-white/[0.08] bg-white/[0.02] p-8 backdrop-blur-xl shadow-2xl">
                            <img
                                src="/icon.svg"
                                alt=".mr Logo"
                                className="h-44 w-44 object-contain drop-shadow-[0_10px_35px_rgba(0,0,0,0.6)] sm:h-52 sm:w-52"
                            />
                            <div className="mt-6 flex items-center gap-3 font-mono text-xs text-muted-foreground">
                                <span className="h-2 w-2 rounded-full bg-primary" />
                                <span>.mr / Linux x86-64 NASM</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quote Block */}
                <div className="mt-16 rounded-2xl border border-border/80 bg-card/40 p-6 sm:p-8 backdrop-blur-sm lg:mt-20">
                    <div className="grid gap-6 lg:grid-cols-2 lg:gap-10">
                        <div className="border-l-2 border-primary/50 pl-5">
                            <p className="text-lg sm:text-xl font-medium leading-8 text-foreground/90 tracking-[-.02em]">
                                “A language is not only a tool for saying what
                                we know. It is a way of making new things
                                thinkable.”
                            </p>
                        </div>
                        <div className="border-l-2 border-primary/30 pl-5">
                            <p className="marathi-font text-lg sm:text-xl leading-8 text-foreground/80">
                                “भाषा ही केवळ आपण जे जाणतो ते सांगण्याचे साधन
                                नाही, तर नव्या कल्पनांचा विचार करण्याचे माध्यम
                                आहे.”
                            </p>
                        </div>
                    </div>
                </div>

                {/* The Project Section (Bilingual First-Person) */}
                <section className="mt-20 grid gap-8 border-t border-border pt-12 lg:grid-cols-[.7fr_1.3fr]">
                    <div>
                        <SectionEyebrow>The project / प्रकल्प</SectionEyebrow>
                        <h2 className="text-3xl font-medium tracking-[-.05em]">
                            Marathi, Understood by Machines
                        </h2>
                        <p className="marathi-font mt-2 text-base text-primary">
                            मराठी, संगणकासाठी.
                        </p>
                    </div>
                    <div className="grid gap-6 text-sm leading-7 text-muted-foreground md:grid-cols-2">
                        <div className="space-y-4">
                            <p>
                                I built .mr from scratch in C++20. Rather than
                                making a simple transpiler or a decorative skin,
                                I designed a complete native pipeline: a custom
                                tokenizer, recursive-descent parser, typed AST,
                                semantic scope validation, and direct Linux
                                x86-64 NASM assembly code generation.
                            </p>
                            <p>
                                My aim is simple: to make computers understand
                                Roman-script Marathi without sacrificing type
                                safety, low-level predictability, or direct
                                machine execution.
                            </p>
                        </div>
                        <div className="marathi-font space-y-4 text-foreground/75 border-l border-border/60 pl-5">
                            <p>
                                .mr हा कम्पायलर मी C++20 मध्ये पूर्णपणे
                                सुरुवातीपासून तयार केला आहे. हे केवळ इंग्रजीचे
                                वरवरचे भाषांतर नसून, यात कस्टम लेक्सर, पार्सर,
                                टाईप्ड AST, सिमेंटिक ॲनालिसिस आणि थेट Linux
                                x86-64 NASM असेंब्ली कोड जनरेशनचा समावेश आहे.
                            </p>
                            <p>
                                मराठी शब्दभांडार हे संगणकीय हार्डवेअरच्या तितकेच
                                जवळ असावे आणि विचार थेट मशीन कोडमध्ये रूपांतरीत
                                व्हावा, हा माझा यामागचा प्रामाणिक प्रयत्न आहे.
                            </p>
                        </div>
                    </div>
                </section>

                {/* The Maker Section (First-Person Bio & Credentials) */}
                <section className="mt-20 grid gap-8 border-t border-border pt-12 lg:grid-cols-[.82fr_1.18fr]">
                    <div>
                        <SectionEyebrow>The maker / निर्माता</SectionEyebrow>
                        <h2 className="text-3xl font-medium tracking-[-.05em]">
                            Anvay Mayekar
                        </h2>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Electronics and computer science student, builder,
                            and tinkerer.
                        </p>
                        <div className="mt-6 flex flex-wrap gap-2">
                            <a
                                href="https://anvaymayekar.vercel.app/"
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
                                data-testid="link-anvay-portfolio"
                            >
                                Portfolio <ExternalLink size={12} />
                            </a>
                            <a
                                href="https://github.com/anvaymayekar"
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
                                data-testid="link-anvay-github"
                            >
                                <Github size={13} /> GitHub{" "}
                                <ExternalLink size={12} />
                            </a>
                            <a
                                href="https://linkedin.com/in/anvay-mayekar"
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
                                data-testid="link-anvay-linkedin"
                            >
                                <Linkedin size={13} /> LinkedIn{" "}
                                <ExternalLink size={12} />
                            </a>
                        </div>
                    </div>

                    <div className="space-y-7">
                        <div className="space-y-4">
                            <p className="text-base sm:text-lg leading-8 text-foreground/90">
                                I like understanding things from the inside out.
                                My work moves naturally between systems,
                                compilers, robotics, electronics, and algorithms
                                — from building experiments to understanding the
                                low-level mechanics beneath them.
                            </p>
                            <p className="marathi-font text-sm leading-7 text-muted-foreground">
                                मला गोष्टींच्या मुळाशी जाऊन त्यांचे तंत्रज्ञान
                                समजून घेणे आवडते. सिस्टिम्स, कम्पायलर,
                                रोबोटिक्स, इलेक्ट्रॉनिक्स आणि अल्गोरिदम्सच्या
                                रचनेवर प्रत्यक्ष काम करणे आणि तंत्रज्ञान स्वतः
                                हातांनी उलगडणे हा माझ्या कामाचा केंद्रबिंदू आहे.
                            </p>
                        </div>

                        {/* Credentials Card */}
                        <div className="rounded-2xl border border-border bg-card p-6 lg:p-8 shadow-sm">
                            <div className="flex items-center justify-between border-b border-border pb-5">
                                <span className="font-mono text-xs text-primary">
                                    student / 2024—2028
                                </span>
                                <span className="rounded-full bg-primary/10 px-2.5 py-1 font-mono text-[10px] text-primary">
                                    9.0 CGPA
                                </span>
                            </div>
                            <dl className="grid gap-5 pt-6 sm:grid-cols-2">
                                <div>
                                    <dt className="text-xs text-muted-foreground">
                                        Institution
                                    </dt>
                                    <dd className="mt-1 text-sm font-medium">
                                        Shah &amp; Anchor Kutchhi Engineering
                                        College
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-xs text-muted-foreground">
                                        Degree
                                    </dt>
                                    <dd className="mt-1 text-sm font-medium">
                                        B.Tech Electronics &amp; Computer
                                        Science
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-xs text-muted-foreground">
                                        Minor
                                    </dt>
                                    <dd className="mt-1 text-sm font-medium">
                                        Robotics and Drone Technology
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-xs text-muted-foreground">
                                        Featured Project
                                    </dt>
                                    <dd className="mt-1 text-sm font-medium text-primary">
                                        .mr — Marathi, Understood by Machines
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </section>
            </main>
        </Shell>
    );
}

