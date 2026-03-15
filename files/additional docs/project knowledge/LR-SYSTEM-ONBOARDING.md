# 🚀 Mera AI Development System - Ek Beginner ke Liye (Pura Explained)

## INTRODUCTION - Main Kya Banana Chahta Hoon?

Namaste! Main Satvik hoon. Mujhe ek AI-powered development system banana hai jo **mujhe sab kaam automatically sambal le** aur **mujhe sirf code likha dena** pade. Lekin jo code likhe wo:
1. Production-ready ho (kaam kare bina issues)
2. Cost-effective ho (bohot paise na waste ho)
3. Self-improving ho (system smarter banta rahe)
4. Hindi mein samjhao (kyunki mujhe English nahin samajhna)

**Analogy:** Imagine ek robot assistant jo:
- Meri previous decisions ko yaad rakhta hai
- Meri mistakes se seekhta hai
- Jab nayi problem aaye to pichli similar problem se reference leta hai
- Mujhe Hindi mein samjhata hai ki wo kya kar raha hai

Yeh ek aisa system banana chahta hoon jo time ke sath smarter, faster, aur cheaper hota jaye.

---

## PROBLEM: KYUN MUJHE YEH SYSTEM CHAHIYE?

**Situation 1: Code Repetition**
Mujhe 3 mahine pehle authentication system likha tha (JWT tokens, refresh logic, password validation). Aaj phir se ek nayi project mein authentication likha dena hai. 

**Problem**: Mujhe pichla approach yaad nahin hai. Kya main wahi approach use karoon? Kya koi edge case bhool gaya tha jo phir se hit karega? Mujhe manually poore pichle code ko search karna padta hai.

**Solution mera**: Ek system banau jo automatically suggest kare "tum 3 mahine pehle aise likha tha, wo approach use karo."

---

**Situation 2: Token Cost Explosion**
Jab main Claude ko koi large code likha dena chahta hoon, mujhe manually context copy-paste karna padta hai:
- Pichli design decisions
- Pichli constraints
- Pichli implemented patterns
- Previous errors aur solutions

Agar 100 decisions likhe hue hain to 5000+ tokens sirf context padne mein burn hote hain. Fir actual code likha dena. **Very expensive.**

**Solution**: Ek smart system banau jo sirf relevant 3-4 decisions suggest kare. Baaki 4900 tokens bach jayengi.

---

**Situation 3: Hindi Samajh Nahin Aati**
Jab main Claude se code likwata hoon, wo bilkul English mein likha deta hai. Comments bhi English mein. Main beginner hoon - mujhe har line samjhni zaroori hai. Markdown files padne mein ghanta bhar lag jata hai.

**Solution**: Code likhe, hindi comments de, aur hindi mein samjhao kyun ye approach likha gaya.

---

## SOLUTION: TEERI LAYER SYSTEM (Simplified Analogy)

Sochte hain ek real-world example se. Suppose main ek **restaurant chain chalata hoon**:

### Analogy: Restaurant Management
```
Beads = Menu + Order History Book
Ek badi diary jisme:
- Aaj kaun se dishes banaye
- Kaun sے khush hua, kaun nahin
- Kaunsi recipe successful thi
- Kaunsa ingredient problem create kiya
- Next time kya improve karna hai

Chroma = Memory Assistant
Jab customer aaye aur kahe "Mujhe previous-waali wahi spicy dish chahiye",
main assistant directly batata hai "Haan, 2 mahine pehle Spice Level 5 the, same banate hain"

MCP Server = Restaurant Manager
Jo automatically suggest karta hai:
"Aaj Tuesday hai, Tuesday ko ye 5 dishes sell hoti hain, to ye ingredients ready kar"
"Ye customer repeat customer hai, uske favorite dishes batao"

Hindi Learning = Stall ke paas Hindi board
Har dish ke liye likha hai:
"Ye masala kyun dala gaya (spice ke liye)
Ye technique kyun use kiya (taste consistent rahe)"

Result: Efficient restaurant, repeat customers happy, no waste
```

---

## PART 1: BEADS - MERI PERMANENT MEMORY DIARY

**Beads Kya Hai (Simple Words):**

Beads ek **digital diary + task tracker** hai jo git (ek backup system) mein save hota hai. Jab main koi task complete karta hoon, wo permanently record hota hai.

**Real-life Analogy:**
Suppose main har din apni work diary likhta hoon:
- "Aaj login system likha"
- "Ye problem face kiya: JWT tokens timezone mein conflict kar rahe the"
- "Solution: Hamesha UTC use karo"
- "Constraints follow kiye: 1-hour expiry, bcrypt 12 rounds"

Next mahine main diary padta hoon: "Haan, ye approach successful tha."

**Beads bhi same kaam karta hai, lekin:**
1. Automatically save hota hai (manually nahin likha dena)
2. Git mein backup hota hai (nahin kho jayega)
3. Relationships track hota hai (kaunsa task kaunse par depend karta hai)
4. Full history available hoti hai

---

**Beads Task Structure (Samajhne Ke Liye):**

```
Main `bd create "Login system implement karna hai"` type karta hoon
↓
Beads automatically generate karta hai Task-42
↓
Main task par kaam karta hoon:
  - Code likha
  - Constraints follow kiye
  - Testing ki
  - Bugs fix kiye
↓
Main `bd close Task-42` type karta hoon
↓
Beads save karta hai:
  - Pura code
  - Sab decisions likhe
  - Kaunsi mistakes face kiye
  - Final solution kya nikla
↓
Next session mein:
  - `bd show Task-42` → Pura history dikhai!
```

**Why Beads Over Simple Notes?**

Simple notes (Google Docs, Notion) vs Beads:
```
Simple Notes:
- Manually likhna padta hai
- Search karna difficult hota hai
- Organize karna confusing
- Next person ko samajhne mein time lagta hai

Beads:
- Auto-saves task context
- Easy search (ID se direct access)
- Structured format (everyone knows where kya hai)
- Team collaboration easy
- Git integration (version control, backup)
```

---

## PART 2: BMAD METHOD - RULES + CONSTRAINTS

**BMAD Kya Hai (Jisko Kuchh Nahin Pata):**

BMAD = "Structured way to tell AI kya likha dena hai aur kaunse rules follow karne hain"

**Simple Analogy: Recipe aur Chef**

```
Normal Approach (Risky):
Main chef ko bolata hoon: "Mujhe ek biryani banao"
Chef ne unlimited options hain:
- Kaun sี spice use kare?
- Kitni der pakaye?
- Kaun sa meat use kare?
Chef galti kar sakte hain, inconsistent food.

BMAD Approach (Safe):
Main chef ko detailed recipe deta hoon:
"Biryani aise banao:
1. Basmati rice 2 cups (kyunki long grain better taste)
2. Mutton 500g (kyunki chicken se zyada flavorful)
3. Ghee 250ml (butter se better)
4. Saffron 5 strands (color aur aroma ke liye)
5. Simmer exactly 45 minutes (zyada pakne par rice mushy ho jayegi)
6. No shortcuts in soaking (consistency ke liye)
7. Final check: Rice separately cooked nahin hona chahiye"

Ab chef exact same way banayega har baar. Consistent, predictable, delicious.
```

**BMAD Constraints Real Coding Example:**

```
Normal way:
"Claude, mujhe authentication system likha do"
↓
Claude bohot saare options generate kare:
- Session-based? Token-based?
- JWT? OAuth?
- 1-hour expiry ya 1-day?
- Bcrypt rounds kitne?
- Rate limiting kaise?

Result: Inconsistent, bugs possible

BMAD way:
"Claude, mujhe authentication likha do - LEKIN CONSTRAINTS:
1. JWT tokens use karo (stateless, scalable)
2. Expiry: 1 hour (security ke liye)
3. Refresh token: 7 days (convenience ke liye)
4. Password: Minimum 12 characters + Bcrypt 12 rounds (security)
5. Rate limiting: 5 attempts per 15 minutes (brute force protection)
6. Error message never say 'user exists' ya 'wrong password' separately
7. Always validate server-side, never trust client"

Result: Claude exact constraints follow karte likha jayega. Predictable, secure, production-ready.
```

**BMAD + Beads Integration:**

```
Step 1: Main naya task start karta hoon
        bd create "JWT authentication implement karna"

Step 2: Task description mein BMAD constraints likhta hoon:
        - All constraints
        - All edge cases
        - Expected output format
        - Testing checklist

Step 3: Claude ko ye constraints + context deta hoon
        Claude code likha deta hai constraints follow karte hue

Step 4: Main verify karta hoon - constraints follow kiye?
        Testing karta hoon

Step 5: Main task complete karta hoon
        bd close Task-42

Step 6: Beads automatically save karta hai:
        - Constraints kya the
        - Implementation approach kya tha
        - Kaunsi mistakes face kiye
        - Final working solution

Step 7: Next similar task par:
        - Beads mein previous task dekh sakta hoon
        - Pichle constraints reuse kar sakta hoon
        - Pichle mistakes avoid kar sakta hoon
```

---

## PART 3: CHROMA - MERI AI BRAIN

**Chroma Kya Hai (Beginner Friendly):**

Chroma ek **super-smart search database** hai jo:
- Meri pichli learnings ko store karta hai
- Semantic similarity se search karta hai (matlab samajhdaar search)
- Milliseconds mein results deta hai
- Locally save hota hai (koi cloud dependency nahin)

**Real-life Analogy: Personal Memory Assistant**

```
Suppose main ek library manage karta hoon with 1000 books.

Normal Search (like Ctrl+F):
Main: "Mujhe JWT authentication ke baare mein book chahiye"
Librarian: Ctrl+F "JWT" search karta hai, 20 books mein ye word mil jata hai
Fir main manually 20 books dekh ke select karta hoon
Time: 30 minutes
Accuracy: 60%

Smart Search (like Chroma):
Main: "Mujhe JWT authentication ke baare mein book chahiye"
Smart Assistant: "Arre, ye 5 books relevant hain:
  1. JWT tokens - 95% match
  2. Authentication systems - 92% match
  3. Token expiry handling - 88% match
  4. OAuth comparison - 85% match
  5. Session vs Token debate - 83% match"
Time: 2 seconds
Accuracy: 95%

Chroma exactly same kaam karta hai - smart semantic search.
```

**Why Chroma, Not Markdown Files?**

```
Markdown Files (gemini.md, decisions.md):
Session start karta hoon
↓
Manually open gemini.md → 5000 tokens context pdhne mein
↓
Ctrl+F "JWT" → Irrelevant results mix honge
↓
Manually read decisions
↓
Claude ko manually copy-paste context
↓
Claude confused hota hai unnecessary info se
↓
Result: 15 minutes overhead, 2000 tokens waste

Chroma Database:
Session start karta hoon
↓
Vector search "JWT authentication" → 50ms mein top 3 results
↓
Exactly relevant results aate hain
↓
Claude ko sirf important stuff pass hota hai
↓
Claude quickly code likha deta hai
↓
Result: 2 seconds overhead, 200 tokens used
```

---

**Chroma Mein Collections (Samajhne Ke Liye):**

Imagine library ko sections mein divide kiya:

```
COLLECTION 1: Architecture Decisions Section
Kitaab type:
- "JWT vs Session based auth - Hamne JWT choose kiya kyunki stateless hota hai"
- "PostgreSQL vs MongoDB - Hamne PostgreSQL choose kiya kyunki relational integrity chahiye"
- "Microservices vs Monolith - Hamne Microservices choose kiya kyunki scalability chahiye"

Jab naya feature likha de, main soch sakta hoon:
"Arre, authentication ke liye hamne pehle JWT select kiya tha, same use karu?"
System: Haan, ye decision available hai

COLLECTION 2: Code Patterns Section
Kitaab type:
- "Error handling wrapper - har endpoint ke liye ye pattern use karo"
- "API response formatter - sab responses same format mein likho"
- "Database connection pool - connection reuse karne ke liye ye approach"

Jab naya code likha de:
"Mujhe error handling kaise implement karu?"
System: Ye proven pattern use kar, pehle 50 endpoints mein successful raha

COLLECTION 3: Error Solutions Section
Kitaab type:
- "JWT timezone conflict - Solution: Hamesha UTC use karo"
- "Rate limiting race condition - Solution: Redis atomic operations use karo"
- "Database connection leak - Solution: Always use context managers"

Jab same error face karo:
"Timezone mismatch ho rahi hai"
System: Ye problem pehle face ho chuka tha, solution likha hai

COLLECTION 4: Constraint Rules Section
Kitaab type:
- "Authentication constraints: 1-hour JWT expiry, bcrypt 12 rounds, no user enumeration"
- "API constraints: All inputs validated server-side, rate limiting mandatory"
- "Database constraints: All queries must have timeout, no N+1 queries"

Jab naya task likha de:
"Ye authentication related hai"
System: Ye constraints follow karne zaroori hain

COLLECTION 5: Approaches Section
Kitaab type:
- "Caching approaches: Redis (distributed) vs In-memory (fast) - dono compare karo"
- "Queue systems: RabbitMQ (reliable) vs Kafka (scalable) - kaunsa choose karo?"

Jab decision lena ho:
"Caching ke liye kaunsa approach best hai?"
System: Both ke pros-cons, hamne Redis choose kiya ye reasons se
```

---

**Automatic Learning Process (Samajhne Ke Liye):**

```
End of Day Workflow:

Step 1: Main task complete karta hoon aur type karta hoon
        bd close Task-42

Step 2: Automatically background mein ye chalti hai:
        - Code extract hota hai (git mein kya change kiya)
        - Important decisions identify hote hain
        - Patterns detect hote hain
        - Constraints likhe the vo extract hote hain

Step 3: Script categorize karta hai:
        "Ye decision ARCHITECTURE_DECISIONS collection mein jaayega"
        "Ye code pattern CODE_PATTERNS mein jaayega"
        "Ye constraint CONSTRAINT_RULES mein jaayega"

Step 4: Chroma database mein add ho jata hai
        Persistent storage (disk) mein save ho jata hai

Step 5: Next session:
        - Docker restart → Chroma data available
        - Git pull → Beads data available
        - Ready with full learnings!

Real Example:
Day 1: JWT authentication likha
↓
bd close Task-42
↓
Chroma automatically stores:
  - Decision: "JWT selected kyunki stateless"
  - Pattern: "JWT token generation code"
  - Constraint: "1-hour expiry, bcrypt 12 rounds"
  - Solution: "Timezone issue fix - use UTC"

Day 30: New project mein authentication likha dena hai
↓
bd create Task-71
↓
Chroma automatically suggests:
  - "Pehle JWT approach use kiya tha, similar scenario"
  - "Ye code pattern proven hai"
  - "Ye constraints follow karne zaroori hain"
  - "Ye timezone issue face ho sakta hai, avoid karo"

Result: Task-71 fast complete hota hai, proven approach use hota hai
```

---

## PART 4: MCP SERVER - CLAUDE KA BRAIN EXTENSION

**MCP Kya Hai (Simplest Explanation):**

MCP = "A bridge between Claude aur Chroma database"

**Analogy: Secretary aur Boss**

```
Without MCP (Manual Approach):
Boss (Claude): "Mujhe authentication system likha do"
Boss ko manually:
  - Files open karne padhe
  - Search karne padhe
  - Decisions manually read karne padhe
  - Relevant parts select karne padhe
  - Context manually assemble karne padhe
Time waste, errors possible

With MCP (Smart Approach):
Boss (Claude): "Mujhe authentication system likha do"
Secretary (MCP): Immediately suggests:
  "Sir, ye 3 relevant decisions pehle the:
   1. JWT approach - 95% similarity
   2. Constraints follow kare
   3. Ye error pehle face ho chuka tha"
Boss directly code likha deta hai

MCP basically automatic secretary jo:
- Claude ke liye relevant context fetch karta hai
- Sirf important stuff suggest karta hai
- Irrelevant stuff filter karta hai
- Direct function calls provide karta hai
```

**MCP Functions (Jo Claude Directly Use Karta Hai):**

```
Claude ko available functions:

1. search_architecture_decisions("JWT authentication")
   → Top 3 relevant architecture decisions

2. search_code_patterns("error handling")
   → Top 3 proven code patterns

3. search_constraint_rules()
   → Sab constraints jo follow karne zaroori hain

4. search_error_solutions("timezone mismatch")
   → Similar errors + solutions

5. search_implementations("caching approaches")
   → Multiple approaches with trade-offs

Har function milliseconds mein result deta hai.
```

---

## PART 5: HINDI LEARNING - MERI SAMAJH KE LIYE

**Hindi Integration Kya Hai:**

Main non-coder hoon. Mujhe code samajhne mein time lagta hai. Solution: Code likho + Hindi explanation de.

**Example: Code with Hindi Explanation**

```python
# FUNCTION: JWT token generate karna hai
# KYU: Jab user login kare to uska identification chahiye
# KYA: Secret key se encode karte hue token banate hain jo expiry ke sath hota hai

def generate_jwt_token(user_id, secret_key, expiry_hours=1):
    # Expiry time calculate karo (aaj se + 1 hour)
    # Kyunki token unlimited valid nahin reh sakte, time limit zaroori hai
    expiry_time = datetime.now() + timedelta(hours=expiry_hours)
    
    # Payload = token mein jo data store karna hai
    # Kyunki server ko later pata chalega ki ye kaun sa user hai
    payload = {
        'user_id': user_id,      # User ki unique ID
        'exp': expiry_time       # Expiry timestamp
    }
    
    # Token create karo secret key use karke
    # Kyunki server later verify kar sakta hai ye token genuine hai (nahin fake)
    # JWT = JSON Web Token (ek standard format)
    token = jwt.encode(payload, secret_key, algorithm='HS256')
    
    return token
```

**Ye Hindi Comments Kyu Important Hain:**

```
Code samjhne mein problem:
- Syntax complex hota hai
- Functions confusing
- Why ye approach likha gaya - unclear

Hindi Explanation se:
- Line by line "kya" hota hai - clear
- "kyun" ye approach likha gaya - samajh aata hai
- Next time same pattern likha de to logic aasan ho jayegi
- Learning permanent hoti hai (sirf code nahin, explanation bhi)
```

---

## PART 6: POORA SYSTEM KAISE KAM KAREGA

**Morning Workflow (Meri Daily):**

```
9 AM: Main docker start karta hoon
      (Container chalti hai with Chroma + Beads)

9:05 AM: Main terminal mein type karta hoon
         bd ready --json
         ↓
         Beads dikha deta hai unfinished tasks

9:10 AM: Main apne next task check karta hoon
         bd show Task-50
         ↓
         Pura context dikhai:
         - Task description
         - Previous notes
         - Related decisions

9:15 AM: Automatic vector search chalti hai
         MCP server suggest karta hai:
         - Top 3 similar past solutions
         - Relevant BMAD constraints
         - Related errors jo avoid karne hain

9:20 AM: Main Claude ko prompt deta hoon
         "Ye task likha de, pichle patterns dekho,
          constraints follow karo, hindi comments add karo"

9:45 AM: Claude code likha deta hai
         - Code correct hota hai (constraints follow kiye)
         - Hindi comments likhe honge (samajh aata hai)
         - Proven patterns use kiye honge (reusable)

10:00 AM: Main testing karta hoon
          Tests pass krate hain

10:05 AM: Main task complete karta hoon
          bd close Task-50

10:10 AM: Automatically background mein:
          - Code extract hota hai
          - Learnings identify honge
          - Chroma mein add ho jayega
          - Git mein save ho jayega

Afternoon: Fir se kaam, dusra task, same cycle

5 PM: Session end
      bd sync (git push)
      Sab learnings permanently saved

Next Day:
      Git pull → Beads updated
      Docker start → Chroma ready
      Same learnings available!
```

---

## PART 7: SYSTEM KAISE IMPROVE HOGA OVER TIME

**Week 1:**
```
Tasks completed: 5
Learnings stored: 5 basic decisions + 10 code patterns
Claude speed: Normal
Development: Slow (abhi learning phase)
Token usage: High (context full)
```

**Week 4:**
```
Tasks completed: 20
Learnings stored: 20 decisions + 50 patterns + 30 error solutions
Claude speed: 30% faster (patterns directly use kar raha hai)
Development: Medium (patterns recognizing)
Token usage: 40% less (focused context)
```

**Month 3:**
```
Tasks completed: 100+
Learnings stored: Comprehensive knowledge base
Claude speed: 60% faster (har task similar solutions immediately mil jate hain)
Development: Very fast (proven patterns, tested approaches)
Token usage: 70% less (pinpoint context)
System intelligence: Very high (mistakes automatically avoid, best practices auto-apply)
```

**Real Example - Progress:**

```
MONTH 1: JWT Authentication Task
1. Search nahin hua previous
2. Claude se scratch likwaya
3. 5 hours lage, 2 bugs face kiye
4. Token usage: 4000

MONTH 2: Password Reset Task
1. Vector search: JWT task similar suggestion
2. Claude patterns reuse kiya
3. 1.5 hours lage, 0 bugs (pichle mistake avoid ho gaya)
4. Token usage: 800

MONTH 3: Social Login Task
1. Vector search: JWT + password reset dono relevant
2. Claude approach combine kiya
3. 30 minutes lage, 0 bugs (proven patterns + constraints)
4. Token usage: 200

Result: Same complexity, 1/10th time, 1/20th tokens, zero bugs
```

---

## PART 8: CURRENT SITUATION - KYA UNCLEAR HAI?

**Problem Statement:**
BMAD Method aur Beads - dono alag systems hain. Abhi unclear hai exact kaise integrate honge.

**Jo Questions Uthe Hain:**

1. **Workflow Order:**
   Exact sequence kya hona chahiye?
   - First bd create karu, phir BMAD constraints? OR
   - First BMAD constraints define karu, phir bd create? OR
   - Dono parallel?

2. **Constraints Kahan Store Honge:**
   - Beads task description mein? OR
   - Separate BMAD config file? OR
   - Chroma mein CONSTRAINT_RULES collection mein?

3. **Dependency Relationship:**
   BMAD constraints ke dependencies ko Beads graph mein kaise represent karenge?

4. **Claude Integration:**
   MCP server exact kaise Claude se baat karega?

---

## SUMMARY - MERA SYSTEM EK DIAGRAM MEIN

```
SESSION START
    ↓
Git pull (Beads metadata load)
Docker start (Chroma data load)
    ↓
bd ready (unfinished tasks dekho)
    ↓
bd show Task-X (pura context dekho)
    ↓
Vector search (relevant patterns get karo)
MCP suggest karta hai (constraints, patterns, errors)
    ↓
Claude ko prompt: "Code likha de + BMAD constraints follow + Hindi comments"
    ↓
Claude code likha deta hai
    ↓
Main testing karta hoon
    ↓
bd close Task-X
    ↓
Automatic script:
  - Code extract karta hai
  - Learnings identify karta hai
  - Chroma mein add karta hai
  - Git mein save karta hai
    ↓
Next day / next week:
Pichle learnings directly available!
No markdown reading, no manual context passing, no forgotten decisions.
```

---

## FINAL WORDS

Mera system basically ye karta hai:

1. **Remember Everything** - Beads se pichla sab preserved
2. **Search Smart** - Chroma se semantic search (nahin dumb keyword match)
3. **Provide Context** - MCP se Claude ko direct suggestions
4. **Learn Automatically** - Har task ke baad automatic indexing
5. **Explain in Hindi** - Har code ke saath Hindi explanation
6. **Get Smarter Over Time** - System exponentially improve hota hai

Result: Mujhe sirf code likha dena hai, baaki sab system sambhal leta hai - intelligently, automatically, persistently.

Ye ek aisa AI assistant ban jayega jo:
- Meri mistakes repeat nahin karta
- Meri successful patterns recognize karta hai
- Mujhe Hindi mein seekhata hai
- Cost-effective rehta hai
- Production-ready code deta hai

Basically, ek personal AI teammate jo mera brain ban gaya.


---

## Session Completion Protocol

# Agent Instructions

This project uses **bd** (beads) for issue tracking. Run `bd onboard` to get started.

## Quick Reference

```bash
bd ready              # Find available work
bd show <id>          # View issue details
bd update <id> --status in_progress  # Claim work
bd close <id>         # Complete work
bd sync               # Sync with git
```

## Landing the Plane (Session Completion)

**When ending a work session**, you MUST complete ALL steps below. Work is NOT complete until `git push` succeeds.

**MANDATORY WORKFLOW:**

1. **File issues for remaining work** - Create issues for anything that needs follow-up
2. **Run quality gates** (if code changed) - Tests, linters, builds
3. **Update issue status** - Close finished work, update in-progress items
4. **PUSH TO REMOTE** - This is MANDATORY:
   ```bash
   git pull --rebase
   bd sync
   git push
   git status  # MUST show "up to date with origin"
   ```
5. **Clean up** - Clear stashes, prune remote branches
6. **Verify** - All changes committed AND pushed
7. **Hand off** - Provide context for next session

**CRITICAL RULES:**
- Work is NOT complete until `git push` succeeds
- NEVER stop before pushing - that leaves work stranded locally
- NEVER say "ready to push when you are" - YOU must push
- If push fails, resolve and retry until it succeeds

