⏺ Step 01 — Load Session Context                                                                                                    
                                                                                                                                    
  Jab workflow shuru hota hai toh sabse pehle ye step chalta hai. Ye lr-config.yaml file padhta hai jismein tumhara naam,           
  professional summary, target role, target companies, skills list, aur integration credentials (Airtable, Postiz) saved hain. Har  
  field ko ek ek karke check karta hai — koi placeholder toh nahi reh gaya jaise [USER_NAME] ya ${AIRTABLE_WEBHOOK_URL}? Agar koi   
  bhi placeholder milta hai toh workflow turant rok deta hai aur batata hai ki kaunsa field incomplete hai. Ye isliye zaroori hai   
  kyunki agar session context galat load hua — jaise tumhara naam placeholder reh gaya — toh final resume mein literally [USER_NAME]
   print ho jaayega. Ye step sabka foundation hai, agar ye galat toh baaki 50 steps ka kaam bekaar.

  ---                                                                                                                               
  Step 01b — Resume If Interrupted
                                                                                                                                    
  Ye step check karta hai ki kya pichli baar kaam beech mein ruk gaya tha. Agar haan, toh Beads database query karta hai (bd list 
  --status=in_progress), last completed step dhundhta hai, aur tumhe do options deta hai — Continue (jahan ruke the wahan se aage   
  badho) ya Restart (fresh shuru karo). Ye isliye important hai kyunki resume generation 51 steps ka process hai — agar step 35 pe
  crash hua aur tumhe wapas step 01 se shuru karna pade toh 30+ minutes waste. Session resumption se tumhara time bachta hai aur koi
   kaam duplicate nahi hota. Ye step automatically detect karta hai state — tumhe manually yaad nahi rakhna padta ki kahan ruke the.

  ---
  Step 02 — Map JD to Signals
                                                                                                                                    
  Ye step JD (Job Description) ke har requirement ko tumhare career signals ke against match karta hai. Teen categories mein
  classify karta hai — Matched (tumhare paas ye skill hai aur evidence bhi hai), Partial (related skill hai but exact match nahi),  
  aur Unmatched (ye skill tumhare paas bilkul nahi hai). For example, agar JD mein likha hai "5+ years Go experience" aur tumhare 
  Vault mein 6 years Go ka project hai, toh ye Matched hai. Agar JD mein "C++ proficiency" hai aur tumhare paas sirf Rust hai, toh  
  ye Partial hai — related but not exact. Agar "Kubernetes at scale" maanga hai aur tumne kabhi Kubernetes use nahi kiya, toh     
  Unmatched. Ye mapping isliye zaroori hai kyunki iske bina system ko pata hi nahi ki tumhare paas kya hai aur kya nahi — aur bina
  iske targeting possible nahi.

  ---
  Step 03 — Keyword Extraction
                                                                                                                                    
  Ye step JD se ATS (Applicant Tracking System) keywords nikaalta hai. ATS woh software hai jo companies use karti hain resume
  filter karne ke liye — agar tumhare resume mein specific keywords nahi hain toh ATS automatically reject kar deta hai, human      
  recruiter tak resume pahunchta hi nahi. Ye step JD ka text parse karta hai, ontology database use karke related terms bhi identify
   karta hai (jaise "ML" likhne se "Machine Learning", "Deep Learning", "Neural Networks" bhi relevant hain), har keyword ko        
  frequency score deta hai (kitni baar JD mein mention hua), aur ranked list output karta hai. Important isliye hai kyunki roughly
  75% job applications ATS stage pe hi reject ho jaati hain — ye step ensure karta hai ki tumhara resume ATS ka filter pass kare.

  ---
  Step 04 — Competitive Moat
                                                                                                                                    
  Ye step ek unique question poochta hai — "100 aur log bhi ye same role ke liye apply kar rahe hain, toh TUM mein kya alag hai?"
  Tumhare signals analyse karke differentiators dhundhta hai jo typical applicants ke paas nahi honge. For example, agar tum Google 
  Backend role ke liye apply kar rahe ho aur tumne Spotify pe ML pipeline optimize kiya hai jo $2.1M save kiya — ye rare combination
   hai. Most Go developers ke paas ML + Infrastructure + cost optimization ka intersection nahi hoga. Ye step aise unique           
  intersections identify karta hai — "Go + ML + Cost Optimization" ya "Distributed Systems + Published Research + Open Source." Ye
  isliye critical hai kyunki resume mein agar same cheezein likhi hain jo har koi likhta hai ("Experienced in Go, worked on
  distributed systems") toh recruiter ka attention nahi milega. Moat = woh cheez jo sirf tumhare paas hai.

  ---
  Step 05 — Adversarial Review
                                                                                                                                    
  Ye step apne hi kaam ko challenge karta hai — jaise ek strict reviewer jo galtiyan dhundhe. Check karta hai: Kya koi claim
  evidence ke bina hai? (Hallucination check) Kya koi important JD requirement miss ho gaya mapping mein? (Coverage check) Kya koi  
  signal overblown hai — matlab 3-person project ko "led large-scale team" bol diya? (Exaggeration check) Kya koi contradiction hai
  — ek jagah "5 years experience" likha aur doosri jagah dates se 3 years nikalta hai? (Consistency check) Ye step isliye zaroori   
  hai kyunki AI systems overconfident ho sakte hain — claims bana dete hain jo fully backed nahi hain. Interview mein agar ek bhi 
  claim challenge ho gaya aur tum defend nahi kar sake, toh credibility khatam. Better hai yahan catch karo, interview se pehle.

  ---
  Step 06 — Final Output (JD Categorization)
                                                                                                                                    
  Ye step JD ke saare requirements ka final categorized output banata hai — har requirement ko ek tier assign karta hai. P0-Critical
   = must have, iske bina consider nahi karenge (jaise "10+ years backend"). P1-Important = strongly preferred, iske bina bhi chance
   hai but kam (jaise "Leadership experience"). P2-Nice-to-have = bonus, hoga toh acha but nahi bhi toh chalega (jaise "Published 
  papers"). P3-Deprecated = outdated tech jo JD mein nahi hai but industry mein exist karti hai. AI pehle JD language se            
  auto-classify karta hai — "Required" = P0, "Preferred" = P1, "Bonus" = P2 — fir user ko dikhata hai confirm karne ke liye (kyunki
  kabhi kabhi company "nice to have" likhti hai but actually woh dealbreaker hota hai). Ye output (jd_categorized_requirements.yaml)
   baaki 5+ phases use karti hain — ye pura workflow ka compass hai.

  ---
  Step 08 — Persona Score Init
                                                                                                                                    
  Ab asli analysis shuru hoti hai. Ye step tumhare Obsidian Vault (projects, achievements, skills files) padh ke tumhe exactly 10
  dimensions pe score karta hai. Har dimension ka score 0-10 scale pe hota hai with confidence score. Dimensions hain: (1) Technical
   Skill Match — tumhare tech stack ka JD se overlap, (2) Domain Expertise — industry relevance, (3) Experience Depth — years +   
  seniority progression, (4) Leadership & Mentoring — team size, mentoring, RFC leadership, (5) Impact Quantification — measurable  
  outcomes (revenue, latency, cost savings), (6) System Scale — kitne bade systems banaye/maintain kiye, (7) Education & Credentials
   — degrees, certifications, (8) Publications & OSS — papers, open source, (9) Communication & Influence — presentations,
  cross-team collaboration, (10) Cultural/Company Fit — values alignment. Ye isliye important hai kyunki ye tumhara honest "mirror"
  hai — JD ke against tum kahan khade ho, bina sugarcoating ke. Agar score low hai kisi dimension pe, toh woh gap hai jise address
  karna padega.

  ---
  Step 09 — Persona Weighting
                                                                                                                                    
  Raw scores equal weight ke hote hain — but reality mein har skill equally important nahi hoti kisi specific job ke liye. Ye step
  JD categorization (step-06 se) use karke scores adjust karta hai. Agar ek dimension "Critical" JD requirement se linked hai toh   
  uska weight 2.0x ho jaata hai. "Important" = 1.5x, "Nice-to-have" = 1.0x, "Deprecated" = -0.5x (negative kyunki outdated skills 
  mention karna harmful ho sakta hai). Fir saare weighted scores normalize karta hai 0-1 scale pe taaki apples-to-apples comparison 
  ho sake. Outlier detection bhi karta hai — agar ek score baaki sab se 3 standard deviations door hai toh flag karta hai review ke
  liye. Ye isliye zaroori hai kyunki Google ke liye "Distributed Systems expertise" ka weight bahut zyada hai but "Published papers"
   ka weight kam — dono 8/10 hain but ek zyada matter karta hai is specific role ke liye.

  ---
  Step 10 — Persona Validation
                              
  Ye step AI ke scores tumhe dikhata hai — top 3 strongest dimensions, bottom 3 weakest dimensions, aur overall readiness score. Fir
   explicitly poochta hai: "Ye scores sahi lag rahe hain? Koi dimension galat rated hai? Koi critical skill miss hui?" User ka      
  confirmation mandatory hai — skip nahi kar sakte. Agar user reject karta hai toh wapas step-08 pe jaata hai user ke corrections ke
   saath. Agar user new data provide karta hai ("ye project mention nahi hua") toh re-run hota hai. Ye isliye critical hai kyunki AI
   tumhare career ko outside-in dekhta hai — but tum inside-out jaante ho. Kabhi kabhi AI ek project ko low-impact samajhta hai but
  actually woh tumhare career ka turning point tha. User validation ensures ki scoring accurate hai before aage ka sab kaam isi
  foundation pe hota hai.

  ---
  Step 11 — Signal Query
                                                                                                                                    
  Ab system ko tumhare career data mein se specific achievements dhundhne hain. But randomly dhundhne se kuch nahi milega — targeted
   search chahiye. Ye step persona gaps ke basis pe search terms banata hai. Agar "Leadership" dimension pe score low hai, toh      
  search terms honge: "led team", "mentored", "managed", "RFC review", "architecture decision." Har search term ko weight milta hai
  — high confidence gap = high weight search term. Proximity constraints bhi set hote hain — recent experience ko preference,       
  relevant domain ko preference. Output ek structured signal_query.json hai jismein 10+ weighted search terms hain with constraints.
   Ye isliye zaroori hai kyunki Vault mein 12 projects, 47 achievements, 34 skills hain — sab scan karna inefficient hai. Targeted
  search se relevant signals jaldi milte hain aur quality better hoti hai.

  ---
  Step 12 — Signal Extract
                          
  Ye step actual mining karta hai — Obsidian Vault ke projects/, achievements/, aur skills/ folders mein jaake har file padhta hai
  aur signal query ke terms se match karta hai. Jab match milta hai toh ek "signal" extract karta hai with structured evidence:     
  Context (kab, kahan, kya role tha), Depth (solo work ya team, scope kitna bada, production ya prototype), Impact (quantified
  results — $, %, users, latency), Recency (kitne time pehle). Har signal ko relevance score milta hai based on query weights. For  
  example, "Kafka pipeline optimization at Spotify" match karega "distributed systems" + "performance optimization" queries ke    
  saath, evidence hoga "Senior ML Engineer, 2024, led 3-person team, 40% latency reduction, 1 year ago." Goal hai minimum 20 signals
   extract karna — agar 10 se kam milein toh user ko warn karta hai ki career data insufficient hai. Future mein ye Vault ke jagah
  ChromaDB ya NotebookLM se semantic search karega — abhi direct file read.

  ---
  Step 13 — Signal Rank
                                                                                                                                    
  20+ raw signals milne ke baad sab equal nahi hain — kuch zyada relevant hain, kuch kam. Ye step composite score calculate karta
  hai har signal ka: composite = query_weight × 0.6 + jd_fit_score × 0.4, normalized to 0-100. JD fit score ye dekhta hai ki signal 
  directly kisi JD requirement address karta hai ya nahi — Critical requirement address karne wala signal +3, Important +2,       
  Supporting +1, Outdated -1. Fir saare signals descending order mein sort karke top 20 select karta hai. Ties mein recency         
  tiebreaker hai — recent achievement jeetega. Output signal_ranked.yaml (full sorted list) aur signal_top_20.md (summary). Ye    
  isliye important hai kyunki resume mein jagah limited hai — single A4 page mein maximum 15-20 data points fit hote hain. Top 20
  signals = tumhare 20 best career moments jo is specific job ke liye most relevant hain.

  ---
  Step 13b — Signal Validate
                            
  Top 20 signals user ko dikhata hai — har signal ka title, evidence, JD relevance score, aur source file. User se poochta hai: "Ye
  signals accurately described hain? Koi critical signal missing hai? Koi signal hatana chahte ho?" User ka confirmation mandatory  
  hai. Agar user 50% se zyada signals reject karta hai toh wapas step-11 pe jaata hai (query se re-do). Agar user new signals
  manually add karta hai toh step-13 se re-rank hota hai. Final output signals_final_validated.yaml — ye locked signal set hai jo   
  aage ke phases use karenge. Ye step isliye critical hai kyunki in 20 signals pe poora resume build hoga — agar wrong signals    
  select ho gaye toh resume galat cheezein highlight karega. User best jaanta hai ki kaunsa achievement genuinely impressive tha aur
   kaunsa inflated — AI ko guide karna padta hai.

  ---
  Step 14 — Baseline Score
                                                                                                                                    
  Ab validated signals use karke har JD requirement pe tumhara actual readiness level score karta hai. Scale hai: Expert (80-100) =
  deep mastery, proven track record, multiple evidence points; Proficient (60-79) = solid skill, regular use, some evidence;        
  Intermediate (40-59) = exposure, developing skill, limited evidence; Beginner (20-39) = basic knowledge, theoretical            
  understanding; Missing (0-19) = no evidence found. Weighting bhi hoti hai — Critical requirements ka weight 2.0x, Important 1.5x, 
  Nice-to-have 1.0x. For example, agar "Go programming" ek Critical requirement hai aur tumhare paas 6 years expert Go hai with 3 
  signals, toh score 90 (Expert) × 2.0 weight. Output baseline_scores.yaml. Ye isliye zaroori hai kyunki persona scoring (Phase D)
  ne tumhe overall score diya — baseline scoring specific JD requirements pe granular score deta hai. Difference hai "overall 87%
  fit" vs "Go: 90, C++: 15, Leadership: 60."

  ---
  Step 15 — Baseline Gaps
                                                                                                                                    
  Ye step sabse important calculations karta hai — Gap = Required Score - Actual Score. Required Score JD tier se aata hai:
  P0-Critical requirement ke liye 80+ chahiye, P1-Important ke liye 60+, P2-Nice-to-have ke liye 40+. Toh agar tumhara "Leadership" 
  actual score 55 hai aur JD mein ye P1-Important hai (requires 60+), gap = 5 (Minor gap). Agar "C++ proficiency" actual score 10 
  hai aur P0-Critical hai (requires 80+), gap = 70 (Critical gap!). Gaps categorize hote hain: Critical (20+ gap) = serious         
  deficiency, Important (10-19) = noticeable weakness, Minor (1-9) = slight gap, No gap = meets or exceeds. Fir gaps rank hote hain
  impact, frequency (kitni baar JD mein mention hua), aur market rarity (ye skill kitni rare hai market mein) ke basis pe. Output
  gaps_analysis.yaml. Ye isliye critical hai kyunki resume mein gaps ko actively address karna padta hai — agar ignore karo toh
  interviewer zaroor poochega aur tum unprepared pakde jaoge.

  ---
  Step 16 — Baseline Compile
                                                                                                                                    
  Ye step saari scoring aur gap analysis ko ek comprehensive summary mein compile karta hai. Overall JD fit percentage calculate
  karta hai (0-100%), category-wise breakdown deta hai (Critical requirements pe 78% fit, Important pe 85%, Nice-to-have pe 90%),   
  top 3 strongest areas identify karta hai (jahan tum JD se exceed karte ho), bottom 3 weakest areas (jahan biggest gaps hain), aur
  har score ke saath confidence level bhi (high confidence = multiple signals ne confirm kiya, low confidence = sirf ek weak signal 
  se derive hua). Output baseline_compilation.yaml (structured data) + baseline_summary.md (human-readable summary). Ye isliye    
  zaroori hai kyunki aage Phase G (gap strategy) aur Phase H (inquisitor) ko ek clear picture chahiye — individual scores alag alag
  files mein bikhra hua data hai, compilation ek nazar mein situation samjha deta hai. Ye woh document hai jo tum khud padhoge aur
  socho ge "achha toh meri position ye hai."

  ---
  Step 17 — Gap Identification
                                                                                                                                    
  Ab gaps ka plan banana shuru hota hai. Ye step har gap ko ek remediation category mein daalta hai based on quantitative
  thresholds: Fillable (gap < 20 or P2 requirement pe) = ye gap quickly learn/demonstrate karke fill kar sakte ho, jaise ek         
  certification le lo ya ek side project karo. **Positioning** (gap 10-20 on P1) = gap real hai but existing skills ko reframe karke
   cover kar sakte ho — jaise C++ nahi hai but Go expertise ko "equivalent/better" position karo. **Compensation** (gap 20-30 on P1)
   = direct fix nahi hai but alternative strengths dikhao — jaise team leadership nahi hai but technical leadership (RFCs,        
  mentoring) dikhao. **Negotiation** (gap 20-40 on P0) = ye serious gap hai, interview mein proactively discuss karna hoga with a
  plan. **Dealbreaker** (gap > 40 on P0) = flag for review, is role ke liye ye gap too large ho sakta hai. Ye categorization isliye
  important hai kyunki har gap ka ilaaj alag hai — sab ko same tarike se address nahi kar sakte.

  ---
  Step 18 — Gap Taxonomy
                        
  Ye step har category ke liye specific remediation strategy develop karta hai — just category assign nahi karta but actual action
  plan banata hai. Fillable gap strategy: content mein learning initiative dikhao ("Currently completing AWS Solutions Architect    
  certification"), recent relevant project highlight karo, growth trajectory emphasize karo. Positioning gap strategy: existing
  skills ko JD language mein reframe karo, transferable skills ki narrative banao ("While my experience is in Go rather than C++,   
  both require systems-level thinking..."), comparison points identify karo. Compensation gap strategy: alternative strengths     
  identify karo jo same value deliver karti hain, "instead of X, I bring Y which achieves the same outcome" narrative banao.
  Negotiation gap strategy: honest acknowledgment + concrete plan prepare karo ("I don't have 10 years — I have 8, but here's why
  quality > quantity applies..."). Ye step isliye critical hai kyunki gap pehchanna easy hai — uska ilaaj decide karna hard hai. Ye
  step woh "how" define karta hai.

  ---
  Step 19 — Gap Prioritization
                                                                                                                                    
  Saare gaps ka remediation plan ban chuka — ab decide karna hai kaunsa gap pehle address karna hai. Ye step teen factors pe ranking
   karta hai: Impact (is gap ko fix karne se interview chances kitna improve honge? Critical requirement ka gap fix karna >         
  Nice-to-have ka), Effort (kitna mushkil hai fix karna? Positioning gap = easy reframe vs Fillable gap = actual learning needed),
  Timeline (resume submit karne se pehle fix ho sakta hai? Certification 2 weeks mein milegi vs 6 months ki experience gap). In teen
   factors ka composite score bana ke gaps prioritized list mein sort hote hain. Output gap_strategy.yaml — ye document Phase H   
  (Inquisitor) ko directly drive karta hai kyunki Inquisitor sirf high-priority gaps pe targeted questions poochta hai, low-priority
   ones skip karta hai. Ye isliye important hai kyunki time limited hai — sab gaps ek saath address nahi ho sakte, toh sabse
  impactful pehle.

  ---
  Step 20 — Inquisitor Prompt
                                                                                                                                    
  Ye step inquisitor ka starting point hai — system ka "career coach" persona activate hota hai. Gap strategy se top priority gaps
  uthata hai aur har ek ke liye precisely crafted question banata hai. Ye generic questions nahi hain jaise "Tell me about yourself"
   — ye targeted hain: agar leadership gap hai toh "Describe a situation where you influenced a technical decision without having 
  direct authority over the team — what was the outcome?" Agar scaling gap hai toh "Walk me through the most complex scaling        
  challenge you faced — what broke, what did you do, what was the quantified result?" Har question ke saath context hota hai (ye  
  question KYUN pooch rahe hain — kaunsa gap address karna hai), expected answer format (specific example chahiye, not abstract),
  aur follow-up strategy (agar answer vague ho toh kya probe karna hai). Output inquisitor_questions.yaml. Ye isliye critical hai
  kyunki question quality = answer quality = resume content quality. Generic sawaal se generic jawab milta hai, targeted sawaal se
  powerful positioning material milta hai.

  ---
  Step 21 — Inquisitor Dialogue
                                                                                                                                    
  Ye step sabse unique hai poore workflow mein — ye live interactive conversation hai, batch process nahi. System user se actually
  baat karta hai. Questions priority order mein present hota hai, user jawab deta hai, system jawab ki quality evaluate karta hai — 
  agar short ya vague hai toh follow-up probe karta hai: "Can you give me specific numbers?" ya "What was YOUR role specifically, 
  not the team's?" Adaptive hai — agar user ek question pe detailed rich answer deta hai toh system detect karta hai "yahan aur mine
   karna chahiye" aur deeper jaata hai. Agar user uncomfortable hai kisi topic pe toh gracefully move on karta hai. Conversation  
  flow manage karta hai — 5-7 questions typically, 15-30 minutes ka session. Ye isliye THE core differentiator hai kyunki koi aur
  resume tool ye nahi karta — koi aur tool user se intelligently baat nahi karta uske gaps ke baare mein. Ye essentially ek AI
  career coach interview hai. Isse jo content nikalta hai woh Vault mein nahi tha — ye NEW information hai jo sirf targeted
  conversation se mil sakti hai.

  ---
  Step 22 — Inquisitor Capture
                                                                                                                                    
  Dialogue ke dauran jo bhi user bolta hai woh verbatim record hota hai — koi editing nahi, koi paraphrasing nahi. Ye step
  structured format mein capture karta hai: har question ke saath uska answer, follow-up questions aur unke answers, aur saath mein 
  evidence tags — agar user ne koi number mention kiya ("saved $500K"), koi project name liya ("Project Atlas"), koi team size    
  bataya ("led 8 engineers") toh ye automatically tagged hota hai as extractable evidence. Capture ke saath confidence score bhi    
  assign hota hai — detailed specific answer = high confidence, vague abstract answer = low confidence. Low confidence answers flag
  hote hain as "needs more information." Ye isliye zaroori hai kyunki user ke apne words mein uski kahani = authentic content.
  AI-generated bullets se better hai user ka actual description — "I built this because our CTO challenged us to reduce costs by 40%
   in one quarter" jaisa real narrative AI imagine nahi kar sakta.

  ---
  Step 23 — Inquisitor Verification
                                   
  Capture ke baad system saare recorded responses user ko wapas dikhata hai — "maine ye capture kiya, ye sahi hai?" Har response ke
  saath extracted evidence bhi dikhata hai — "tumne ye numbers mention kiye: $500K savings, 8 engineers, 3 months timeline — ye sab 
  correct hai?" User ko chance milta hai corrections karne ka — "actually 6 engineers the, 8 nahi" ya "ye metric revenue tha,
  savings nahi." Verification mandatory hai — skip nahi kar sakte. Agar user koi response completely reject karta hai toh woh       
  discard hota hai. Agar user additional context add karna chahta hai toh add kar sakte hain. Final output verified_responses.yaml —
   ye locked dataset hai jo narrative aur content writing phases use karenge. Ye isliye critical hai kyunki galat capture = galat
  resume. Agar tumne "8 engineers" kaha aur system ne "18 engineers" capture kiya, toh resume mein exaggerated claim jaayega jo
  interview mein expose hoga. Double verification ensures accuracy.

  ---
  Step 24 — Narrative Arc
                         
  Ab sabse creative phase shuru hota hai — tumhare career ki story construct hona shuru hoti hai. Ye step validated signals (top 20)
   + inquisitor responses le ke ek 4-part narrative structure banata hai: Origin = tumne career kaise shuru kiya, kya motivate kiya,
   foundational skills kaise banaye ("Started building Python APIs at a 5-person startup, discovered passion for scale when first
  service hit 10K RPS"). Growth = kaise evolve hue, kya learning curves the, capabilities kaise develop huyi ("Moved to Spotify,    
  dove deep into distributed systems — learned to think in event streams, not request-response"). Mastery = peak achievements,    
  expert-level work, notable impact ("Achieved 99.98% uptime across 200 microservices, saved $2.1M in infrastructure costs"). Vision
   = aage kya karna hai, ye specific company/role kyun ("Ready to bring infrastructure expertise to Google-scale systems, excited
  about pushing Dataflow and Spanner to next level"). Ye isliye THE most important step hai kyunki story sells, bullet points don't.
   Recruiter 100 resumes padhta hai — jo resume ek compelling career trajectory dikhata hai woh yaad rehta hai.

  ---
  Step 25 — Narrative Mapping
                                                                                                                                    
  Story structure ban gayi — ab 20 validated signals ko story ke 4 sections mein physically place karna hai. Rules hain: har section
   mein minimum 3, maximum 7 signals. Highest-scoring signals Mastery section mein jaate hain (ye tumhare strongest moments hain).  
  Chronologically early signals Origin mein. Growth signals woh hain jo learning ya transition dikhate hain. Vision mein mostly   
  inquisitor responses se future-facing content jaata hai. Koi signal 2 sections mein nahi aa sakta — ek jagah best fit karo. Agar  
  koi signal clearly kisi section mein fit nahi karta toh "supporting evidence" ke roop mein rakho — directly mention nahi karenge
  but argument strengthen karega background mein. Ye step isliye important hai kyunki random signal placement se story incoherent
  lagti hai — agar tumhara 2024 ka achievement Origin section mein hai aur 2018 ka Growth mein, toh timeline sense nahi banegi.
  Mapping ensures narrative flow natural aur logical ho.

  ---
  Step 26 — Narrative Validation
                                                                                                                                    
  Narrative structure + signal mapping ready hai — ab isko enrich aur validate karna hai. Pehle inquisitor responses (step-23 se) se
   narrative enrich hoti hai — user ke apne words, specific examples, jo Vault mein nahi the woh story mein integrate hote hain. Fir
   flow check hota hai — Origin se Growth mein transition natural hai? Growth se Mastery mein jump logical hai? Vision realistic  
  hai? Koi contradiction toh nahi — ek jagah "deep IC focus" aur doosri jagah "managed 20 people"? Fir user ko complete narrative   
  outline dikhata hai aur mandatory confirmation leta hai — "ye tumhari story hai, sahi lagti hai?" User adjust kar sakta hai — "ye
  achievement zyada important hai, ise Mastery mein daalo" ya "Origin section mein ye mention mat karo." Output narrative_refined.md
   (human-readable polished narrative). Ye isliye zaroori hai kyunki ye narrative resume ka backbone hai — har bullet, har section
  isi story se derive hoga. Story galat toh resume directionless.

  ---
  Step 27 — Content Drafting
                                                                                                                                    
  Ab actual resume text likhna shuru hota hai. Narrative ke har section ke liye 3-5 power bullets draft hote hain. Har bullet ka
  format strict hai: [Action Verb] + [Specific Context] + [Quantified Impact] + [JD Keywords]. Example: "Engineered distributed data
   pipeline processing 2.3M events/sec across 12 Kafka clusters, reducing infrastructure costs by $2.1M annually while maintaining
  99.98% uptime." Rules: har bullet mein ek number MUST hai (%, $, users, RPS, latency, team size). Har bullet mein kam se kam 1 JD 
  keyword naturally fit hona chahiye. Har bullet ek validated signal se traceable hona chahiye — koi claim bina evidence ke nahi. 
  Koi bullet 2 lines se lamba nahi (A4 pe). Ye step isliye THE most craft-intensive hai kyunki in 15-20 bullets mein tumhara poora
  career summarize hona hai — har word matter karta hai. "Worked on systems" vs "Engineered planet-scale infrastructure serving 380M
   users" — same person, same experience, but second wala call milega.

  ---
  Step 28 — Content Refining
                                                                                                                                    
  First draft kabhi perfect nahi hota — ye step polish karta hai. Weak verbs → Strong verbs: "did" → "engineered", "helped" →
  "spearheaded", "was responsible for" → "owned." Missing quantifiers add karo: agar signal mein number hai but draft mein nahi     
  daala toh add karo — "reduced latency" → "reduced latency by 40% (from 250ms to 150ms)." Generic → Specific: "improved system   
  reliability" → "improved platform reliability from 99.94% to 99.98% uptime, preventing 3 critical production outages." JD keyword 
  density: naturally fit karo, stuff mat karo — agar JD mein "distributed systems" hai toh bullet mein organically aana chahiye,  
  forcefully nahi. Ye step 2-3 iterations kar sakta hai — har iteration mein bullets tighter, stronger, more impactful hote hain. Ye
   isliye zaroori hai kyunki recruiter ek bullet pe average 3 seconds spend karta hai — agar pehle 3 words weak hain toh aage
  padhega hi nahi.

  ---
  Step 29 — Content Formatting
                                                                                                                                    
  Polished bullets ready hain — ab unhe template ke specific sections mein map karna hai. Resume template ke sections hain:
  Professional Summary (2-3 sentences — Vision + Mastery ka distilled version, ye pehla cheez hai jo recruiter padhta hai),         
  Experience (role-wise grouped bullets — Company, Title, Duration, then bullets), Skills (categorized grid — Languages:          
  Go/Python/Rust, Frameworks: Kafka/Spark, Infrastructure: Kubernetes/Terraform), Education (compact — degree, university, year),   
  Beyond the Papers (portfolio narrative section — ye template ka unique feature hai). Har section ka content format template ke CSS
   expectations ke hisaab se hona chahiye — heading sizes, bullet indentation, skill grid layout. Ye step content ko "raw text" se
  "template-ready structured data" mein convert karta hai. Ye isliye important hai kyunki content formatting galat ho toh template
  mein inject karne pe layout break hoga — headings wrong size, bullets wrong indent, skills grid misaligned.

  ---
  Step 30 — Content Review
                                                                                                                                    
  Ship karne se pehle final content quality check. Checklist: ATS keyword coverage — JD ke P0 requirements ke 80%+ keywords resume
  mein present hain? Agar nahi toh missing keywords identify karo aur relevant bullets mein naturally fit karo. Factual accuracy —  
  har claim wapas validate karo signals se, koi exaggeration toh nahi creep in hua? Repetition check — same achievement 2 sections
  mein toh nahi aa gaya? Same verb 3 baar toh nahi use hua? Tone consistency — professional, confident, not arrogant. "I            
  single-handedly saved the company" = arrogant. "Led initiative that reduced costs by $2.1M" = confident. Word count — total     
  content A4 budget estimate ke andar hai? (Exact fitting Phase K mein hoga but rough estimate yahan check hota hai). Ye step isliye
   zaroori hai kyunki ye last chance hai content fix karne ka — iske baad layout aur styling hogi, content change karna expensive ho
   jaayega.

  ---
  Step 31 — Template Read
                                                                                                                                    
  Ab content se design ki taraf shift hota hai. Ye step Template CV HTML file (context/linkright/docs/Template CV & Portfolio/Satvik
   Jain - Portfolio & CV.html) aur uska CSS parse karta hai. Extract karta hai: Section hierarchy — kaunse sections hain (header,   
  summary, experience, skills, education, beyond-the-papers), unka order kya hai, nested structure kya hai. CSS properties — font 
  sizes (h1: 24px, body: 11px), grid layout (2-column skills, single-column experience), spacing values, color variables kaunse     
  defined hain. Print stylesheet — @media print rules kya hain, margins kya hain, page-break rules kya hain. Output               
  template_structure.yaml. Ye isliye zaroori hai kyunki template blindly use nahi kar sakte — pehle samajhna padta hai ki template
  ka DOM structure kya hai, CSS kaise kaam karta hai, kaunse CSS variables expect karta hai, fir usme content aur styling inject
  karenge.

  ---
  Step 32 — Layout Budget
                                                                                                                                    
  A4 page ka mathematical space budget calculate karta hai. A4 = 210mm × 297mm. Margins: top 15mm, bottom 15mm, left 20mm, right
  20mm. Usable area: 170mm × 267mm. Ab ye 267mm vertical space sections mein divide hota hai: Header + Name = ~25mm (fixed,         
  minimal), Professional Summary = ~20mm (2-3 lines at 11px), Experience = ~120mm (main content area — 4-5 roles with 3-4 bullets 
  each), Skills = ~30mm (categorized grid, 2 columns), Education = ~20mm (compact, 1-2 entries), Beyond the Papers = ~40mm          
  (portfolio section), Breathing Room = ~12mm (margins between sections). Output layout_budget.yaml. Ye isliye critical hai kyunki
  single page resume = 267mm mein sab fit karna hai. Agar budget galat calculate hua — experience ko 150mm de diya — toh education
  aur portfolio section ke liye jagah nahi bachegi.

  ---
  Step 33 — Content Measure
                                                                                                                                    
  Actual content kitna space lega ye precisely measure karta hai. Har section ke liye: word count (kitne words hain), line count (at
   template font size kitni lines banegi — 11px font, 170mm width pe roughly 15 words per line), estimated height in mm (lines ×    
  line-height × font-size). Fir compare karta hai layout budget se — Overflow (content height > budget height) ya Underflow (content
   height < budget height, too much white space). Section-wise report: "Experience: 135mm needed, 120mm budgeted — 15mm OVERFLOW.   
  Skills: 22mm needed, 30mm budgeted — 8mm UNDERFLOW." Output content_measurements.yaml. Ye step isliye important hai kyunki bina 
  measure kiye fitting guesswork hai — aur guesswork se ya page overflow karega (content cut jaayega) ya page empty lagega
  (unprofessional).

  ---
  Step 34 — Content Fit
                                                                                                                                    
  Ye step overflow aur underflow dono handle karta hai — content ko budget mein exactly fit karta hai. Overflow handling (zyada
  content, kam space): sabse pehle lowest-impact bullets remove karo (step-13 ki ranking se pata hai kaunsa signal least important  
  hai). Fir verbose bullets tighten karo (20 words → 15 words, meaning same). Fir similar bullets combine karo (2 separate bullets
  about latency reduction → 1 combined bullet). Last resort: section count reduce karo (3 bullets per role → 2). Underflow handling 
  (kam content, zyada space): next-ranked signals (21st, 22nd from step-13 ranking) se new bullets add karo. Professional Summary 
  expand karo (2 sentences → 3). Existing bullets mein more detail add karo. Ye iterative process hai — trim/add, remeasure, repeat
  until fit. Output content_fitted.yaml. Ye isliye THE most precision-demanding step hai — 1mm ka miscalculation page overflow kar
  sakta hai.

  ---
  Step 35 — One-Page Check
                                                                                                                                    
  Content fitting ke baad final single-page verification. Saare sections ka total height calculate karta hai — header + summary +
  experience + skills + education + beyond-the-papers + breathing room. Total ≤ 267mm? PASS — proceed. Total > 267mm? FAIL — wapas  
  step-34 pe aggressive trim. Ye step 2-3 iterations kar sakta hai until total exactly fits. Edge cases bhi handle karta hai: agar
  1-2mm overflow hai toh line-height subtly reduce karna (1.4 → 1.35) ya margins 0.5mm reduce karna — ye micro-adjustments reader ko
   visible nahi hote but space free karte hain. Agar 10mm+ overflow hai toh content changes zaroori hain. Ye step isliye          
  non-negotiable hai kyunki 2-page resume = instant disqualification for most senior individual contributor roles. Recruiter ke paas
   time nahi hai 2 pages padhne ka — single page pe conviction create karna hai.

  ---
  Step 36 — Layout Validate
                                                                                                                                    
  Final layout quality assurance. Print-ready check: resume ko browser se print karne pe sab sahi aata hai? @media print CSS rules
  correctly applied hain? Page break kahi wrong jagah toh nahi aa raha? Margins print pe correct hain? Screen-ready check: browser  
  mein open karne pe responsive hai? Zoom in/out pe layout break nahi hota? Font rendering: specified fonts load ho rahe hain? Kahi
  fallback font (Arial instead of Product Sans) toh nahi trigger ho raha? Section spacing: koi awkward gap toh nahi (2 sections ke  
  beech 30mm ka void)? Koi cramming toh nahi (bullets overlapping)? Visual balance: page overall balanced dikhta hai — top-heavy ya
  bottom-heavy nahi? Output layout_validation_report.yaml with pass/fail per check. Ye isliye zaroori hai kyunki screen pe sahi
  dikhta hai doesn't mean print pe sahi aayega — bahut baar CSS differences se printed resume mein text cut jaata hai ya margins
  galat aate hain.

  ---
  Step 37 — Brand Resolve
                                                                                                                                    
  Ab resume ka "look and feel" define hona shuru hota hai. Ye step target company ki brand identity determine karta hai. Sources:
  Phase A mein user ne colors specify kiye toh woh use karo. Nahi kiye toh company website se primary brand color extract karo      
  (Google = #4285F4 blue, Spotify = #1DB954 green, Amazon = #FF9900 orange). Known brand databases se secondary aur accent colors 
  bhi. Output: primary color, secondary color, accent color, background preference (light/dark), overall brand mood                 
  (corporate/tech/creative). Output brand_identity.yaml. Ye step isliye important hai kyunki resume ka color scheme company ki    
  visual language se match hona chahiye — Google ke liye blue-green theme, Spotify ke liye green-black, startup ke liye bold
  creative colors. Jab reviewer resume open kare toh subconsciously "ye humari company ka lagta hai" feel aaye — ye subliminal
  familiarity hire karne mein help karta hai.

  ---
  Step 38 — CSS Variables
                                                                                                                                    
  Brand identity ko Template CV ke CSS variable system mein map karta hai. Template expect karta hai specific CSS variable names:
  --color-primary, --color-accent, --color-highlight, --color-background, --color-text, --color-text-secondary, --color-border,     
  --color-section-bg. Ye step brand_identity.yaml se colors le ke har variable assign karta hai. Complementary colors bhi calculate
  karta hai — agar primary blue hai toh text color dark gray hona chahiye (readability ke liye), background white ya very light     
  blue, border subtle gray. Contrast ratios verify karta hai — text vs background ka contrast WCAG AA standard (4.5:1 minimum) meet
  karna chahiye. Output css_variables.yaml. Ye isliye technical bridge hai brand → template ke beech — template ko raw colors nahi
  chahiye, specific variable names chahiye CSS mein inject karne ke liye.

  ---
  Step 39 — Typography
                                                                                                                                    
  Font decisions karta hai — ye resume ki readability aur professional feel define karta hai. Font family: company ke aesthetic se
  match karo — Google ke liye Product Sans ya Roboto, Apple ke liye SF Pro, corporate ke liye Inter ya Source Sans. Heading font    
  alag ho sakta hai body font se (visual hierarchy ke liye). Font weights: headings bold (600-700), body regular (400), emphasis  
  medium (500). Font sizes: h1 (name) = 22-26px, h2 (section headers) = 14-16px, body (bullets) = 10.5-11.5px, caption (dates,      
  labels) = 9-10px. Line height: body text ke liye 1.35-1.5 (readability), headings ke liye 1.1-1.2 (tighter). Ye decisions isliye
  critical hain kyunki wrong font = unprofessional (Comic Sans pe senior engineer ka resume?). Wrong size = unreadable (8px body
  text) ya space waste (14px body text). Typography silently communicates "ye insaan detail pe dhyaan deta hai."

  ---
  Step 40 — Spacing
                                                                                                                                    
  Visual breathing room set karta hai — ye difference hai between cramped/chaotic resume aur clean/organized resume. Section 
  spacing: major sections ke beech 14-18px gap. Item spacing: bullets ke beech 6-8px. Line height: body text 1.4 (comfortable       
  reading). Page margins: 15-20mm all sides (standard professional). Padding: sections ke andar 10-14px. Visual hierarchy: primary
  sections (Experience) ko zyada space, secondary (Education) ko kam. Indentation: nested items ke liye consistent 12-16px indent.  
  Ye step isliye matter karta hai kyunki spacing "invisible design" hai — reader ko pata nahi chalta ki spacing achhi hai, but    
  IMMEDIATELY pata chalta hai jab spacing buri hai. Cramped resume = "ye insaan organized nahi hai." Too much space = "ye insaan ke
  paas dikhane ko kuch nahi hai." Perfect spacing = "ye professional hai."

  ---
  Step 41 — Style Compile
                                                                                                                                    
  Ye step sab kuch ek saath laata hai — content (Phase K se), CSS variables (step 38), typography (step 39), spacing (step 40), aur
  template HTML — sab inject karke final styled HTML+CSS file generate karta hai. Process: template HTML read karo, CSS variables   
  inject karo (:root { --color-primary: #4285F4; ... }), content har section mein insert karo (Professional Summary div mein summary
   text, Experience div mein role bullets...), typography aur spacing CSS rules apply karo, sab kuch ek single HTML file mein       
  compile karo (no external dependencies — CSS embedded). Filename: [Company]_[Role]_Resume_[Date].html. Ye THE critical assembly 
  step hai — agar yahan kuch galat hua (CSS variable miss, content wrong section mein, font not embedded) toh final output broken
  hoga. Ye woh moment hai jab "data + design = deliverable" banta hai.

  ---
  Step 42 — Style Validate
                                                                                                                                    
  Compiled styled resume ki visual quality assurance. Contrast ratios: har text element ka background ke against contrast 4.5:1+
  hai? (WCAG AA accessibility standard — low contrast = legally problematic for some companies + practically unreadable). Font      
  rendering: specified fonts actually load ho rahe hain? Fallback fonts trigger toh nahi hue? Font smoothing (antialiasing) sahi  
  hai? Color consistency: saare sections same brand palette use kar rahe hain? Kahi koi section mein different color toh nahi reh   
  gayi? Print check: @media print se output sahi aata hai? Colors print-friendly hain? (Very light colors print pe invisible ho   
  jaate hain). Responsive check: different screen sizes pe layout break toh nahi hota? Ye step isliye zaroori hai kyunki visually
  broken resume se achha hai koi resume na bhejna — broken layout communicates "ye insaan careless hai" which is exactly opposite of
   what you want.

  ---
  Step 43 — Quality Score
                                                                                                                                    
  Final quality gate ka pehla step — resume ko 10 dimensions pe score karta hai, har dimension 0-100. (1) Content Accuracy — saare
  claims factually correct aur signal-backed hain? Koi fabrication/exaggeration nahi? (2) JD Alignment — P0 keywords present hain?  
  Requirements addressed hain? (3) Evidence Quality — claims specific hain with numbers, not vague? (4) Writing Quality — clear,  
  concise, impactful? Strong verbs? (5) Visual Design — professional, brand-aligned, clean layout? (6) Completeness — saare key     
  achievements covered? Koi important signal miss toh nahi? (7) Positioning Clarity — reader instantly samajh jaata hai "ye insaan
  kya value laayega"? (8) Format Compliance — single page, A4, correct filename, embedded CSS? (9) Gap Coverage — Phase G ke major
  gaps address/mitigate hue resume mein? (10) Impact Projection — ye resume padhke reviewer interview lena chahega? Output
  quality_metrics.yaml. Ye THE most honest assessment hai — 10 lenses se resume evaluate hota hai.

  ---
  Step 44 — Quality Gate
                                                                                                                                    
  Ye step gatekeeper hai — decide karta hai resume ship-worthy hai ya rework chahiye. Rules strict hain: ANY dimension < 70% → flag
  that dimension with specific issue. Overall weighted score < 75% → MANDATORY rework loop — resume ship nahi hoga. Rework          
  intelligent routing karta hai — agar "Writing Quality" low hai toh Phase J (step 27) pe bhejta hai. "Visual Design" low toh Phase
  L (step 37). "Evidence Quality" low toh Phase E (step 11). "JD Alignment" low toh Phase B (step 03). Maximum 2 rework loops — agar
   2 baar fix karke bhi threshold nahi meet kar raha toh user ko escalate karta hai: "ye dimensions improve nahi ho pa rahe,      
  manually review karo." Ye isliye critical hai kyunki quality compromise nahi hoga — below threshold resume bhejne se achha hai
  delay karna. Ek mediocre resume = wasted opportunity at a company you care about.

  ---
  Step 45 — Portfolio Assemble
                                                                                                                                    
  Resume ke saath "Beyond the Papers" portfolio section integrate karta hai — ye Linkright template ka unique feature hai. Portfolio
   reference template (context/linkright/docs/Portfolio reference/) se format leta hai — ye ek Webflow-style personal narrative     
  section hai with visuals, stories, aur deeper context jo traditional resume mein nahi fit hota. Process: narrative (Phase I se) ke
   storytelling elements le ke portfolio format mein structure karo, dummy assets (25 images, JS, CSS from Portfolio reference/) use
   karo as placeholders for now, portfolio section ki styling resume ke theme se match karo (same colors, fonts). Ye section resume
  ke END mein aata hai as a "want to know more?" section — casual, personal, human. Ye isliye differentiator hai kyunki koi aur
  resume builder portfolio narrative section nahi deta — ye resume ko "document" se "experience" bana deta hai.

  ---
  Step 46 — Content Inject
                                                                                                                                    
  Final assembly verification — sab kuch sahi jagah inject hua hai? Check karta hai: All sections populated — koi div empty toh
  nahi? Summary mein text hai? Experience mein bullets hain? Skills grid filled hai? Beyond-the-Papers section mein content hai? CSS
   variables resolved — koi var(--undefined) toh nahi reh gayi? Saare variables actual values mein convert hue? Text encoding — koi
  broken character toh nahi? Special characters (ampersand, em-dash, quotes) properly encoded hain? Hindi/Unicode characters agar   
  hain toh render ho rahe hain? Asset links — portfolio section mein images/CSS/JS links valid hain? Broken images toh nahi? Ye step
   isliye important hai kyunki assembly mein subtle bugs creep in hote hain — ek missing closing tag, ek unresolved CSS variable, ek
   broken character — ye sab professional impression destroy karte hain.

  ---
  Step 47 — Render Final
                                                                                                                                    
  THE deliverable generate hota hai. Final HTML+CSS file render karta hai — complete, self-contained, single file. Filename format:
  [Company]_[Role]_Resume_[Date].html — example: Google_SeniorBackendEngineer_Resume_2026-03-09.html. Final checks: Valid HTML5 —   
  W3C validator pass kare. CSS embedded — no external stylesheet dependencies, sab inline/embedded. Single file — ek file share   
  karo, bas, kuch aur chahiye nahi. Browser render — Chrome aur Safari mein correctly render hota hai. File size reasonable —       
  typically 50-200KB (images embedded as base64 agar hain toh thoda bada). Ye step isliye the culmination hai — 50 steps ka output
  ye ek file hai. Agar ye file perfect hai toh sab perfect hai.

  ---
  Step 48 — File Storage
                                                                                                                                    
  Generated file ko correct location pe save karta hai. Location: /sync-artifacts/[Company]/[Date]/ — example:
  /sync-artifacts/Google/2026-03-09/. Auto-create karta hai directory agar exist nahi karti. Resume file ke saath saare intermediate
   artifacts bhi save karta hai — quality_metrics.yaml, gap_strategy.yaml, signals_final_validated.yaml, narrative_structure.yaml,
  etc. Ye isliye important hai reproducibility ke liye — agar 2 weeks baad same company ke liye resume update karna ho toh saare    
  intermediate data available hai, scratch se shuru nahi karna padega. Organized storage bhi hai — company-wise aur date-wise     
  separated, toh Google ke 3 different roles ke resumes alag alag folders mein honge. Location NEVER changes — ALWAYS
  sync-artifacts, no exceptions, no custom paths.

  ---
  Step 49 — User Review
                                                                                                                                    
  Final resume user ko dikhata hai review ke liye — ye mandatory hai, skip nahi ho sakta. Present karta hai: rendered resume ka
  preview (kaise dikhega), quality scores summary (10 dimensions ka snapshot), gap coverage report (kaunse gaps address hue, kaunse 
  nahi), file location aur filename. User se explicitly poochta hai: "Ye sahi hai? Kuch change karna hai?" Agar user changes chahta
  hai toh relevant phase pe route karta hai — content change = Phase J, design change = Phase L, major rework = Phase H se restart. 
  Agar user approve karta hai toh proceed to delivery. Ye isliye THE most important checkpoint hai kyunki end of the day ye TUMHARA
  resume hai — AI ne banaya but tumhe represent karega. Agar tum satisfy nahi ho toh ship nahi hona chahiye, chahe quality score 95%
   ho.

  ---
  Step 50 — Delivery Confirm
                                                                                                                                    
  Final handoff — clean summary of everything that was done. Report includes: ✅ Resume generated:
  Google_SeniorBackendEngineer_Resume_2026-03-09.html. ✅ Location: /sync-artifacts/Google/2026-03-09/. ✅ Quality score: 87/100    
  overall. ✅ JD alignment: 92%. ✅ Gaps addressed: 4/5 gaps mitigated. ✅ Artifacts saved: 12 intermediate files. 🔄 Suggested next
   steps: submit application, prepare for behavioral interview on leadership gap, review portfolio section. Session complete. Ye    
  step isliye zaroori hai kyunki clean closure important hai — user ko exactly pata ho ki kya mila, kahan hai, aur aage kya karna 
  hai. Ambiguity nahi honi chahiye — "resume ban gaya but kahan hai?" ya "quality score kya tha?" — sab ek jagah documented.