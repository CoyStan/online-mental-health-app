import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database with Thrive 5 Framework...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@thrive5.org' },
    update: {},
    create: {
      email: 'admin@thrive5.org',
      password: adminPassword,
      name: 'Admin',
      role: 'admin',
      surveyCompleted: true,
    },
  })
  console.log('👤 Created admin user:', admin.email)

  // Create demo user
  const userPassword = await bcrypt.hash('demo123', 10)
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      password: userPassword,
      name: 'Maria',
      role: 'user',
      stage: 'newborn',
      surveyCompleted: false,
    },
  })
  console.log('👤 Created demo user:', demoUser.email)

  // ========================================
  // THRIVE 5 CATEGORIES (Based on WashU Research)
  // ========================================
  const categories = [
    {
      id: 'environmental-stimulation',
      name: 'Environmental Stimulation',
      description: 'Based on WashU research, environmental stimulation includes talking to your baby, eye contact, responding to their cues, and exposing them to interesting sounds, colors, and textures. This builds their brain even when resources are limited.',
      icon: 'sparkles',
      color: '#82aa82',
      order: 1,
    },
    {
      id: 'nutrition',
      name: 'Nutrition',
      description: 'Research shows that nutrition - whether breastfeeding, formula, or combination - supports brain development. This includes feeding your baby AND yourself. No judgment here, just practical support for your situation.',
      icon: 'heart',
      color: '#ff9e73',
      order: 2,
    },
    {
      id: 'neighborhood-safety',
      name: 'Neighborhood Safety',
      description: 'The research acknowledges that many families live in unsafe environments. This section provides coping strategies when your neighborhood isn\'t safe, ways to protect your baby\'s development despite stress, and resources when you need help.',
      icon: 'shield',
      color: '#7dd3fc',
      order: 3,
    },
    {
      id: 'positive-caregiving',
      name: 'Positive Caregiving',
      description: 'Positive caregiving means bonding, responding to your baby\'s signals, and being emotionally present. The research shows this matters more than having a perfect nursery or expensive toys. You already have what your baby needs most: you.',
      icon: 'hands',
      color: '#ffb3c4',
      order: 4,
    },
    {
      id: 'sleep-circadian-rhythms',
      name: 'Sleep & Circadian Rhythms',
      description: 'Regular sleep patterns help your baby\'s brain develop. This section covers realistic sleep strategies for different living situations, managing sleep when you work irregular hours, and taking care of YOUR sleep too.',
      icon: 'moon',
      color: '#d6c4ff',
      order: 5,
    },
  ]

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { id: cat.id },
      update: cat,
      create: cat,
    })
    console.log('📁 Created category:', cat.name)
  }

  // ========================================
  // TRACKS AND CONTENT FOR EACH CATEGORY
  // ========================================

  // ENVIRONMENTAL STIMULATION TRACKS
  const envStimTracks = [
    {
      title: 'Why Talking to Your Baby Matters',
      description: 'Even if they can\'t talk back, your voice builds their brain',
      order: 1,
      positionX: 80,
      positionY: 80,
      contents: [
        {
          title: 'The Science of Baby Talk',
          contentType: 'article',
          body: `# Why Your Voice is Your Baby's Favorite Sound

Research from Washington University shows that babies who hear more words develop stronger brain connections. But here's what's amazing: **it doesn't matter what language you speak, how much education you have, or if you use "fancy" words.**

## What the Research Found

Scientists studied babies' brains and found that simply hearing their caregiver's voice:
- Strengthens connections in the brain
- Helps them learn language faster
- Makes them feel safe and loved
- Builds their ability to learn later in life

## You Don't Need to Be Perfect

You might think: "But I don't know what to say" or "I feel silly talking to someone who can't answer."

That's completely normal. Here's the truth: **your baby doesn't care if you say the "right" things.** They just want to hear YOU.

> "My baby heard more words in Spanish from me doing dishes and telling her about my day than from any fancy toy." - A mom in our program

## What Counts as "Talking"

All of these count:
- Describing what you're doing ("Now I'm changing your diaper...")
- Singing songs (any songs, even made-up ones)
- Reading signs out loud when you're outside
- Telling them about your day
- Talking on the phone near them
- Speaking in your native language

**The most important thing is that they hear YOUR voice regularly.**`,
          order: 1,
        },
        {
          title: 'Practical Ways to Talk More',
          contentType: 'exercise',
          body: `# Simple Ways to Add More Words to Your Day

You don't need special time or equipment. Try these:

## The Narration Technique

Just describe what you're doing:
- "I'm putting on your shirt. One arm... two arms... over your head!"
- "Look, I'm washing the dishes. The water is warm. Splash splash!"
- "We're walking to the bus stop. I see a dog. Do you see the dog?"

## When You're Busy

Even when you're doing other things:
- Keep baby nearby in a safe spot while you cook or clean
- Talk about what you're doing
- Sing while you work
- Name objects as you use them

## On Your Phone

If you talk or video chat with family:
- Hold baby so they can see the screen
- Let them hear the conversation
- Tell the person about what baby did today

## No Books? No Problem

You don't need children's books:
- Read junk mail out loud
- Look at magazines or phones together
- Make up stories about pictures anywhere
- Tell them about photos of family

## Your Action Step

**Try this today:** For 5 minutes, describe everything you're doing out loud to your baby. It might feel weird at first, but your baby will love it.`,
          order: 2,
        },
        {
          title: 'When Talking Feels Hard',
          contentType: 'article',
          body: `# It's Okay If This Feels Difficult

Some days, talking to your baby might feel impossible. That's real, and it's okay.

## Why It Might Be Hard

- **You're exhausted** - Sleep deprivation makes everything harder
- **You're stressed** - Worry takes up mental space
- **You have depression** - This is common and treatable
- **You're alone a lot** - Isolation makes talking feel strange
- **Multiple kids** - Hard to focus on one when others need you
- **You're working** - Not much time together

## What You Can Do

**On hard days:**
- Even a few minutes counts
- Singing is easier than talking for some people
- Having TV or music on is better than silence
- Ask someone else to talk to baby when they visit

**If it's more than just a bad day:**
- Feeling disconnected from baby for weeks could be postpartum depression
- This is NOT your fault
- It's treatable and common
- Talk to a doctor or call a helpline

## Crisis Resources

If you're struggling:
- Postpartum Support International: 1-800-944-4773
- Text HOME to 741741 for the Crisis Text Line
- Your baby's doctor can help connect you to support

## Remember

Some talking is better than no talking. Perfect doesn't exist. You're doing your best, and that matters.`,
          order: 3,
        },
      ],
    },
    {
      title: 'Eye Contact & Face Time',
      description: 'Your face is the most interesting thing to your baby',
      order: 2,
      positionX: 250,
      positionY: 140,
      contents: [
        {
          title: 'Why Babies Love Faces',
          contentType: 'article',
          body: `# Your Face is Your Baby's Favorite "Toy"

Newborn babies can only see about 8-12 inches away - exactly the distance from your arms to your face when you hold them. Nature designed it this way!

## The Brain Science

When your baby looks at your face:
- Their brain releases bonding chemicals
- They learn to recognize emotions
- They practice back-and-forth communication
- Neural connections strengthen

## What "Serve and Return" Means

Researchers call it "serve and return" - like a gentle tennis game:
1. Baby makes a sound or expression (they "serve")
2. You respond with your face or voice (you "return")
3. Baby responds to you
4. This back-and-forth builds their brain

**Example:**
- Baby coos → You smile and say "Hi sweetie!" → Baby kicks their legs → You laugh and say "You're so happy!"

## You're Already Doing This

When you:
- Look at your baby while feeding
- Make faces at them
- Respond when they make sounds
- Smile when they smile

...you're building their brain.`,
          order: 1,
        },
        {
          title: 'Making Face Time Work for You',
          contentType: 'exercise',
          body: `# Fitting in Face Time

You don't need hours - just small moments throughout the day.

## Best Times for Face Time

- **Diaper changes** - Baby is right there, looking up at you
- **Feeding** - Whether breast or bottle, look at baby sometimes
- **After waking** - Babies are often alert and ready to engage
- **Bath time** - Natural opportunity for interaction

## Quick Face Games

Try these for just 1-2 minutes:
- Stick out your tongue (babies love copying this!)
- Make big surprised eyes
- Sing with exaggerated expressions
- Play peek-a-boo

## When You're Tired

It's okay if you can't always be "on." Here's what helps:
- Even brief moments of connection count
- Put baby where they can see faces (in a bouncer facing you)
- Let siblings or visitors do face time too
- A few genuine moments beat forced hours

## Today's Practice

**Do this once today:**
During a diaper change, spend 30 seconds just looking at your baby and responding to their expressions.`,
          order: 2,
        },
      ],
    },
    {
      title: 'Stimulation Without Expensive Toys',
      description: 'Everything in your home can help your baby learn',
      order: 3,
      positionX: 420,
      positionY: 100,
      contents: [
        {
          title: 'Your Home is Full of Learning',
          contentType: 'article',
          body: `# You Don't Need Expensive Toys

Those fancy "educational" toys? Research shows babies learn just as well from everyday household items.

## What Babies Actually Need

They need things that are:
- **Different textures** - Smooth, rough, soft, bumpy
- **Different sounds** - Crinkly, rattling, quiet, loud
- **Safe to mouth** - Everything goes in their mouth!
- **Interesting to look at** - Contrasts, patterns, faces

## Free "Toys" in Your Home

**Kitchen:**
- Wooden spoons (bang on pots!)
- Plastic containers with lids
- Measuring cups to stack
- Clean empty bottles with dried beans inside (tape lid securely!)

**Bathroom:**
- Clean washcloths with different textures
- Plastic cups for bath

**Around the house:**
- Crinkly paper or empty chip bags (supervised only)
- Cardboard boxes
- Fabric scraps
- Empty tissue boxes

**Outside:**
- Leaves to look at
- Grass to touch
- Water to splash
- Sticks to hold

## Safety First

Always supervise! Babies put everything in their mouths. Make sure items:
- Are too big to swallow
- Have no small parts that could come off
- Are clean
- Have no sharp edges`,
          order: 1,
        },
        {
          title: 'DIY Baby Activities',
          contentType: 'exercise',
          body: `# 5 Free Activities You Can Do Today

## 1. Sensory Bag
Put hair gel and small toys in a ziplock bag, tape it to the floor for tummy time. Baby can squish it!

## 2. Treasure Basket
Fill a bowl or basket with safe household objects. Let baby explore different textures and shapes.

## 3. Mirror Play
Hold baby up to a mirror. They love seeing faces - even their own!

## 4. Nature Walk
Take baby outside. Let them feel leaves, see birds, hear sounds.

## 5. Music Time
Play music and move baby's arms and legs to the beat. Sing along.

## This Week's Challenge

Make one "toy" from household items. Notice how your baby explores it.

**Remember:** Your attention is worth more than any toy. Playing together matters more than what you play with.`,
          order: 2,
        },
      ],
    },
  ]

  // NUTRITION TRACKS
  const nutritionTracks = [
    {
      title: 'Feeding Your Baby: No Judgment',
      description: 'Breast, bottle, or both - fed is best',
      order: 1,
      positionX: 80,
      positionY: 80,
      contents: [
        {
          title: 'You Choose How to Feed',
          contentType: 'article',
          body: `# Fed Is Best: Your Choice Matters

Whether you breastfeed, formula feed, or do a combination, you are giving your baby what they need to grow.

## What the Research Really Says

Yes, breast milk has benefits. But formula is also nutritionally complete. What matters most is:
- That your baby is fed
- That feeding time includes connection (eye contact, talking)
- That YOU are healthy enough to care for your baby

## When Breastfeeding Isn't Possible

Many things can make breastfeeding difficult or impossible:
- Work schedules that don't allow pumping
- Medical conditions
- Medications you need to take
- Previous trauma or discomfort
- Low supply despite trying everything
- Mental health needs
- Adoption or surrogacy

**None of these make you a bad mother.**

## Formula Feeding Facts

Modern formula is:
- Nutritionally complete
- Safe and regulated
- Sometimes the best choice for your family
- Nothing to feel guilty about

## Combination Feeding

Many moms do both! You might:
- Breastfeed when you're home, formula when at work
- Give formula at night so you can sleep
- Supplement when supply is low

This is completely valid.`,
          order: 1,
        },
        {
          title: 'Reading Baby\'s Hunger Cues',
          contentType: 'exercise',
          body: `# Knowing When Baby is Hungry

Crying is a LATE hunger sign. Look for earlier cues:

## Early Hunger Signs
- Smacking lips
- Sucking on hands or fist
- Turning head looking for breast/bottle
- Opening mouth
- Becoming more alert

## Active Hunger Signs
- Rooting (turning toward touch on cheek)
- Trying to get in feeding position
- Fussing
- Faster breathing

## Late Signs (Try Not to Wait This Long)
- Crying
- Agitated movements
- Turning red

## How Often?

Newborns: 8-12 times per day (every 2-3 hours)
1-3 months: Every 3-4 hours
3-6 months: May start longer stretches

But every baby is different. Feed when hungry, not by the clock.

## Today's Observation

Watch for one early hunger cue before your next feeding.`,
          order: 2,
        },
      ],
    },
    {
      title: 'Breastfeeding When Life is Hard',
      description: 'Real solutions for working moms and tough situations',
      order: 2,
      positionX: 250,
      positionY: 150,
      contents: [
        {
          title: 'Pumping When You Work',
          contentType: 'article',
          body: `# Breastfeeding and Work: Real Talk

If you want to keep breastfeeding while working, you have rights - and options.

## Your Legal Rights

In many states/countries, employers must provide:
- Reasonable break time to pump
- A private space (not a bathroom)
- Time as needed for the first year

## When Your Job Doesn't Cooperate

Reality: Some jobs make pumping nearly impossible. You might:
- Work jobs with no breaks
- Have no private space
- Face pressure from bosses or coworkers
- Work multiple jobs

**Options if you can't pump at work:**
- Nurse when you're home, formula when away
- Nurse mornings and nights only
- Gradually wean if needed
- Know that ANY breastfeeding has benefits

## Making It Work If You Can

- Hand expression is faster than pumping sometimes
- Pumping bras let you pump hands-free
- Cooler bags keep milk safe for hours
- Some moms pump in cars during breaks

## It's Okay to Stop

If breastfeeding is making you miserable, stressed, or affecting your mental health, stopping is a valid choice. Your wellbeing matters too.`,
          order: 1,
        },
        {
          title: 'When Supply is Low',
          contentType: 'article',
          body: `# Struggling with Milk Supply

Low supply is common and often NOT your fault.

## Things That Can Reduce Supply
- Stress (and who isn't stressed?)
- Not eating enough
- Dehydration
- Certain medications
- Hormonal issues
- Previous breast surgery
- Baby's latch issues

## Things That DON'T Determine Supply
- Breast size
- Being a first-time mom
- Your mother's experience
- Your diet (within reason)

## What Might Help
- Feeding/pumping more often
- Drinking more water
- Eating enough (even when busy)
- Getting rest when possible
- Working with a lactation consultant (often free at hospitals)

## When to Supplement

If baby isn't gaining weight, supplementing isn't failure - it's feeding your baby. You can:
- Supplement with formula and keep nursing
- Use donor milk if available
- Switch to formula completely

## The Truth

Some bodies don't produce enough milk despite doing everything "right." This is not your fault. Your worth as a mother has nothing to do with your milk supply.`,
          order: 2,
        },
      ],
    },
    {
      title: 'Feeding Yourself Too',
      description: 'You can\'t pour from an empty cup',
      order: 3,
      positionX: 400,
      positionY: 90,
      contents: [
        {
          title: 'Eating When You\'re Overwhelmed',
          contentType: 'article',
          body: `# Taking Care of Your Nutrition

When you're exhausted and overwhelmed, eating well can feel impossible. Let's make it realistic.

## The Minimum That Helps

You don't need perfect meals. Aim for:
- **Eating something** every few hours
- **Drinking water** (keep a bottle nearby)
- **Protein** when you can (peanut butter counts!)

## Easy Foods When You're Exhausted

- Cheese and crackers
- Peanut butter on anything
- Yogurt
- Bananas (nature's fast food)
- Nuts or trail mix
- Hard boiled eggs (make a batch)
- Leftovers straight from the container

## When Money is Tight

- WIC provides food for pregnant/nursing moms and babies
- Food banks don't require proof of income
- SNAP benefits go further with planning
- Dollar stores have nutritious options

## When Time is Tight

- Accept food when people offer to help
- Batch cook when you have a good moment
- Frozen vegetables are just as nutritious
- Canned beans are cheap protein

## If You're Not Eating

Sometimes not eating is a sign of depression or anxiety. If you:
- Have no appetite for days
- Feel too overwhelmed to eat
- Are losing weight rapidly

Please talk to a healthcare provider. This is treatable.`,
          order: 1,
        },
      ],
    },
  ]

  // NEIGHBORHOOD SAFETY TRACKS
  const safetyTracks = [
    {
      title: 'When Your Neighborhood Isn\'t Safe',
      description: 'Protecting your baby\'s development despite stress',
      order: 1,
      positionX: 80,
      positionY: 80,
      contents: [
        {
          title: 'The Reality of Unsafe Environments',
          contentType: 'article',
          body: `# You're Not Alone in This

If you live somewhere that doesn't feel safe, this section is for you. No judgment, just support.

## What Research Shows

Living in an unsafe environment creates chronic stress - the kind that's always there in the background. This stress affects:
- Your sleep
- Your health
- Your ability to relax
- Your sense of security

## The Good News

Here's what's powerful about the Thrive 5 research: **even when families faced significant adversity, babies could still thrive when caregivers could provide the 5 factors.**

Your love, attention, and care can buffer your baby from stress they can't understand.

## What You Might Be Feeling

- Constant alertness (always listening, watching)
- Fear going outside
- Worry about your other children
- Anger that you're in this situation
- Guilt that you can't provide "better"
- Exhaustion from the mental load

All of these are normal responses to an abnormal situation.

## This Is Not Your Fault

Your neighborhood situation is often outside your control. You might be:
- Unable to afford safer housing
- Stuck due to family, work, or other commitments
- On waitlists for better housing
- Doing the best you can with what's available

**You are not failing your baby.**`,
          order: 1,
        },
        {
          title: 'Creating Safety Within Unsafe Spaces',
          contentType: 'exercise',
          body: `# What You CAN Control

You may not be able to change your neighborhood, but you can create pockets of safety and calm.

## Your Home as Refuge

Even in a small or shared space:
- Create a calm corner with soft items
- Use music or white noise to mask outside sounds
- Have routines that signal "we're safe right now"
- Make baby's sleep area as peaceful as possible

## When You Must Go Outside

- Know the safer times of day in your area
- Find the safer routes
- Know your neighbors who might help
- Have a plan if something happens

## Managing Your Stress So Baby Feels Calm

Babies pick up on your stress through your:
- Muscle tension when you hold them
- Tone of voice
- Facial expressions
- Breathing patterns

When you feel scared:
1. Take three slow breaths
2. Consciously relax your shoulders
3. Speak softly to baby
4. Remember: right now, in this moment, you are safe

## Building Support Networks

- Connect with other moms in your area
- Know community resources (churches, community centers)
- Have phone numbers for emergencies ready
- Accept help when offered

## Today's Practice

Identify one small thing you can do to make your home feel calmer.`,
          order: 2,
        },
      ],
    },
    {
      title: 'Coping with Constant Stress',
      description: 'Taking care of yourself when fear is always there',
      order: 2,
      positionX: 260,
      positionY: 160,
      contents: [
        {
          title: 'Managing Chronic Stress',
          contentType: 'article',
          body: `# When Stress Never Goes Away

Acute stress comes and goes. Chronic stress - the kind from living in unsafe conditions - stays. Here's how to cope.

## Signs You're Carrying Chronic Stress

- Always tired but can't sleep well
- Startling easily
- Difficulty relaxing even in safe moments
- Headaches or body aches
- Irritability (shorter temper than usual)
- Difficulty concentrating
- Feeling numb or disconnected

## Quick Calming Techniques

**5-4-3-2-1 Grounding:**
Name 5 things you see, 4 you hear, 3 you can touch, 2 you smell, 1 you taste.

**Box Breathing:**
Breathe in 4 counts, hold 4, out 4, hold 4. Repeat.

**Cold Water:**
Splash cold water on your face or hold ice. This activates your calm-down system.

## Building Tiny Moments of Peace

You may not get hours of relaxation, but you can find minutes:
- During baby's feeding
- When baby sleeps (even briefly)
- In the shower
- While waiting

## It's Not Weakness to Struggle

Chronic stress changes your brain and body. Struggling to cope isn't weakness - it's your body responding to a hard situation.`,
          order: 1,
        },
        {
          title: 'When You Need More Help',
          contentType: 'article',
          body: `# Resources for Hard Situations

## Domestic Violence

If the danger is in your home:
- National Domestic Violence Hotline: 1-800-799-7233
- Text START to 88788
- Chat at thehotline.org

They can help you plan for safety, even if you're not ready to leave.

## Community Violence

If your neighborhood is unsafe:
- Your local community center may have resources
- Some areas have violence intervention programs
- Schools sometimes offer family support

## Housing Crisis

If you need to leave:
- 211 connects you to local resources
- Homeless shelters often have family programs
- HUD has emergency housing assistance

## Mental Health Crisis

If you're not coping:
- 988 Suicide and Crisis Lifeline (call or text)
- Crisis Text Line: Text HOME to 741741
- Postpartum Support International: 1-800-944-4773

## Immigration Concerns

Help is available regardless of status:
- Many organizations don't ask about immigration
- Know your rights if you need emergency services
- Immigrant-specific helplines exist in many languages

## Remember

Asking for help is strength, not weakness. You deserve support.`,
          order: 2,
        },
      ],
    },
  ]

  // POSITIVE CAREGIVING TRACKS
  const caregivingTracks = [
    {
      title: 'Bonding With Your Baby',
      description: 'Building connection in everyday moments',
      order: 1,
      positionX: 80,
      positionY: 80,
      contents: [
        {
          title: 'What Bonding Really Means',
          contentType: 'article',
          body: `# Bonding: It's Not What Movies Show

Movies show instant bonding - mother sees baby, falls in love, lives happily ever after. Reality is often different.

## The Truth About Bonding

Bonding often:
- Takes time (days, weeks, even months)
- Feels different than expected
- Grows through ordinary moments
- Isn't ruined by difficulties

## Signs of Bonding

Even if you don't feel that "overwhelming love" yet, bonding might look like:
- Responding when baby cries
- Checking on them when they're quiet
- Learning what their different cries mean
- Feeling protective
- Missing them when apart

## When Bonding Feels Hard

It's harder to bond when you're:
- Exhausted
- Depressed or anxious
- Dealing with trauma from birth
- Stressed about survival needs
- Missing support

**This doesn't mean you're a bad mother.**

## Building Bond Through Care

Every diaper change, every feeding, every time you respond to your baby - these ARE bonding. You don't need special activities. Care IS connection.`,
          order: 1,
        },
        {
          title: 'Simple Bonding Activities',
          contentType: 'exercise',
          body: `# Bonding Doesn't Need to Be Complicated

## During Feeding
- Look at baby's face
- Stroke their hand or cheek
- Hum or talk softly
- Put away your phone sometimes (not always - it's okay to scroll)

## During Diaper Changes
- Make eye contact
- Play "this little piggy" with toes
- Talk about what you're doing
- Smile and make faces

## Skin-to-Skin
- Hold baby on your bare chest
- Cover both of you with a blanket
- Works for dads and partners too
- 10 minutes counts

## Baby Wearing
- If you have a carrier or wrap
- Keeps baby close while you do other things
- Baby hears your heartbeat
- DIY options exist if you can't buy one

## This Week's Goal

Pick ONE bonding activity to try during routine care.`,
          order: 2,
        },
      ],
    },
    {
      title: 'Responding to Your Baby',
      description: 'You don\'t have to be perfect, just present',
      order: 2,
      positionX: 260,
      positionY: 150,
      contents: [
        {
          title: 'Good Enough Is Good Enough',
          contentType: 'article',
          body: `# The "Good Enough" Mother

A famous psychologist named Winnicott discovered that babies don't need perfect mothers. They need "good enough" mothers.

## What "Good Enough" Means

- You don't respond perfectly every time
- You sometimes misread cues
- You get frustrated
- You meet needs most of the time
- You repair when things go wrong

## Why Perfect Would Actually Be Bad

If you responded perfectly to every need instantly, your baby would never learn:
- How to wait (even briefly)
- That frustration is survivable
- How to self-soothe a little
- That relationships include repair

## Responding "Enough"

Research shows responding about 30-50% of the time sensitively is enough for secure attachment. That means:
- You CAN miss cues sometimes
- You CAN be distracted sometimes
- You CAN be imperfect

## When You Lose Your Temper

All parents get frustrated. What matters:
1. Don't hurt baby
2. Put baby in safe place if you need to walk away
3. Come back and repair - hold them, speak softly
4. Forgive yourself

Repair teaches babies that relationships survive difficulties.`,
          order: 1,
        },
      ],
    },
    {
      title: 'When You\'re Doing It Alone',
      description: 'Single parenting, absent partners, and lack of support',
      order: 3,
      positionX: 430,
      positionY: 100,
      contents: [
        {
          title: 'Parenting Without Support',
          contentType: 'article',
          body: `# When You're the Only One

Maybe your partner is absent, or works all the time, or doesn't help. Maybe you chose single parenthood, or didn't choose it. Either way, doing this alone is hard.

## What You're Managing

- All night wakings
- All feedings
- All decisions
- All worry
- Work (possibly)
- Household (definitely)
- Your own needs (barely)

## It's Okay to Feel:
- Angry that others don't help
- Jealous of supported moms
- Exhausted beyond words
- Lonely
- Resentful
- Like you're failing (you're not)

## Survival Strategies

**Lower standards:**
- House can be messy
- Dishes can wait
- "Good enough" is enough

**Find micro-support:**
- Online mom groups
- Text friends even if you can't see them
- Accept ANY help offered

**Prioritize sleep:**
- Sleep when baby sleeps (even if just sometimes)
- Safe co-sleeping if that's what keeps you sane (look up guidelines)
- Nap over cleaning

**Create village where you can:**
- Neighbors, church members, community
- Trade babysitting with another mom
- Online communities count

## You're Enough

Single parents raise amazing children. You being present, trying your best, loving your baby - that's enough.`,
          order: 1,
        },
      ],
    },
  ]

  // SLEEP TRACKS
  const sleepTracks = [
    {
      title: 'Baby Sleep Basics',
      description: 'What to actually expect (not what books say)',
      order: 1,
      positionX: 80,
      positionY: 80,
      contents: [
        {
          title: 'Realistic Sleep Expectations',
          contentType: 'article',
          body: `# What Baby Sleep Actually Looks Like

Those books that promise 12-hour nights by 8 weeks? Most babies didn't read them.

## Normal Newborn Sleep (0-3 months)
- Sleep 14-17 hours total
- In chunks of 2-4 hours
- No day/night sense yet
- Needs feeding overnight - this is normal

## 3-6 Months
- May have ONE longer stretch (4-6 hours)
- Still waking 1-3 times typically
- Starting to develop patterns

## 6-12 Months
- Some babies sleep through (6+ hours)
- Many still wake once or twice
- Sleep regressions are real (4 months, 8 months)

## What "Sleeping Through" Actually Means

When experts say "sleeping through the night" they mean 5-6 hours. Not 12 hours. Five hours straight is considered success!

## Why Your Baby Might Wake More

- Growth spurts
- Teething
- Learning new skills
- Illness
- Changes in routine
- Just being a baby

All normal. Not your fault. Not permanent.`,
          order: 1,
        },
        {
          title: 'Creating Sleep Routines',
          contentType: 'exercise',
          body: `# Building a Simple Sleep Routine

You don't need elaborate rituals. Simple and consistent works.

## A Basic Bedtime Routine (15-30 minutes)

1. **Dim lights** - signals brain it's night
2. **Change diaper/clothes** - into sleep outfit
3. **Feeding** - breast or bottle
4. **One calm activity** - song, story, cuddles
5. **Into sleep space** - drowsy but awake (if possible)

## Making It Work in Real Life

**Small spaces:**
- Use lighting (dim for sleep, bright for wake)
- White noise can create "sleep zone"
- Consistent signals matter more than separate rooms

**Multiple kids:**
- Older kids can be part of routine
- Doesn't have to be silent
- Baby adapts to household sounds

**Irregular schedule:**
- Pick what you CAN control
- Even partial routine helps
- It's okay if bedtime varies

## Today's Step

Pick one thing to do consistently before sleep (even just a song).`,
          order: 2,
        },
      ],
    },
    {
      title: 'Sleep in Small Spaces',
      description: 'When you don\'t have a nursery',
      order: 2,
      positionX: 260,
      positionY: 150,
      contents: [
        {
          title: 'Making Sleep Work Anywhere',
          contentType: 'article',
          body: `# No Nursery? No Problem

Instagram nurseries are nice. But babies don't need them.

## Safe Sleep Without a Crib

AAP recommends:
- Firm, flat surface
- No loose bedding, pillows, or toys
- Baby on back
- Nothing covering face

This can be:
- A bassinet
- A pack-n-play
- A firm mattress on the floor (properly set up)
- A drawer (yes, really - lined with firm padding)

## Room Sharing

Actually, room sharing for the first 6-12 months is RECOMMENDED. It:
- Reduces SIDS risk
- Makes night feeding easier
- Helps you respond quickly

## When You Share a Bed

If you're bed-sharing (we know many families do):
- No alcohol, drugs, or smoking
- Firm mattress, no soft bedding
- No gaps where baby can get trapped
- Baby on back
- No other children or pets in bed
- Some parents are higher risk (very tired, on medications, overweight)

Look up the "Safe Sleep Seven" for more guidance.

## One-Room Living

- Use corners or dividers for "zones"
- White noise helps baby sleep through household sounds
- Blackout curtains or sheets over windows
- Baby will adapt to your life`,
          order: 1,
        },
      ],
    },
    {
      title: 'Your Sleep Matters Too',
      description: 'Taking care of exhausted you',
      order: 3,
      positionX: 420,
      positionY: 90,
      contents: [
        {
          title: 'Sleep Deprivation is Serious',
          contentType: 'article',
          body: `# The Truth About Parent Sleep Deprivation

Sleep deprivation isn't just tiredness. It affects:
- Your mood (hello, irritability)
- Your memory
- Your ability to cope with stress
- Your relationship
- Your physical health
- Your mental health

## Why It's So Hard

- Babies need you at night
- You might be the only one doing night duty
- Anxiety keeps you awake even when baby sleeps
- You're "touched out" and can't relax
- Work doesn't care that you were up all night

## Survival Strategies

**Maximize what sleep you get:**
- Sleep when baby sleeps (at least sometimes)
- Go to bed earlier
- Take turns with partner if possible
- Say no to non-essential things

**Make nights easier:**
- Set up changing and feeding supplies in advance
- Use night lights (not bright lights)
- Keep interactions calm and quiet
- Try not to fully wake up

**Get help:**
- Anyone who can take a night shift
- Sleep when someone else watches baby
- It's okay to pay for help if you can

## Warning Signs You Need More Help

- Can't function during the day
- Falling asleep while driving or holding baby
- Feeling like you might hurt yourself or baby
- Intense anxiety or hopelessness

Please talk to a doctor. Sleep deprivation + postpartum hormones can become dangerous.`,
          order: 1,
        },
      ],
    },
  ]

  // Create all tracks and content
  const allTracksData = [
    { categoryId: 'environmental-stimulation', tracks: envStimTracks },
    { categoryId: 'nutrition', tracks: nutritionTracks },
    { categoryId: 'neighborhood-safety', tracks: safetyTracks },
    { categoryId: 'positive-caregiving', tracks: caregivingTracks },
    { categoryId: 'sleep-circadian-rhythms', tracks: sleepTracks },
  ]

  for (const categoryData of allTracksData) {
    for (const trackData of categoryData.tracks) {
      const { contents, ...trackInfo } = trackData
      const track = await prisma.track.create({
        data: {
          ...trackInfo,
          categoryId: categoryData.categoryId,
        },
      })
      console.log('🎯 Created track:', track.title)

      for (const content of contents) {
        await prisma.content.create({
          data: {
            ...content,
            trackId: track.id,
          },
        })
      }
    }
  }

  // ========================================
  // SURVEY QUESTIONS (Assessing Each Thrive Factor)
  // ========================================
  const surveyQuestions = [
    // Background questions
    { question: "What stage are you in?", type: "multiChoice", options: JSON.stringify(["Pregnant - First Trimester", "Pregnant - Second Trimester", "Pregnant - Third Trimester", "Baby is 0-3 months", "Baby is 3-6 months", "Baby is 6-12 months", "Baby is over 12 months"]), category: "background", order: 1 },

    // Environmental Stimulation
    { question: "How often do you talk, sing, or read to your baby?", type: "scale", category: "stimulation", order: 2 },
    { question: "Do you have access to toys, books, or interesting objects for your baby?", type: "scale", category: "stimulation", order: 3 },
    { question: "How confident do you feel engaging and playing with your baby?", type: "scale", category: "stimulation", order: 4 },

    // Nutrition
    { question: "How are you currently feeding your baby?", type: "multiChoice", options: JSON.stringify(["Breastfeeding only", "Formula only", "Combination of both", "Started solid foods", "Still pregnant"]), category: "nutrition", order: 5 },
    { question: "Do you have concerns about feeding yourself or your baby?", type: "scale", category: "nutrition", order: 6 },
    { question: "Are you able to eat regular meals yourself?", type: "scale", category: "nutrition", order: 7 },

    // Neighborhood Safety
    { question: "How safe do you feel in your neighborhood?", type: "scale", category: "safety", order: 8 },
    { question: "Does worry about safety affect your daily routines?", type: "scale", category: "safety", order: 9 },

    // Positive Caregiving
    { question: "How connected do you feel to your baby?", type: "scale", category: "caregiving", order: 10 },
    { question: "How confident do you feel as a mother?", type: "scale", category: "caregiving", order: 11 },
    { question: "Do you have support from family, friends, or a partner?", type: "scale", category: "caregiving", order: 12 },

    // Sleep
    { question: "Does your baby have any regular sleep patterns?", type: "scale", category: "sleep", order: 13 },
    { question: "How many hours of sleep are YOU getting in a 24-hour period?", type: "multiChoice", options: JSON.stringify(["Less than 4 hours", "4-5 hours", "5-6 hours", "6-7 hours", "7+ hours"]), category: "sleep", order: 14 },
    { question: "Do you have a quiet, dark space for baby to sleep?", type: "scale", category: "sleep", order: 15 },

    // General wellbeing
    { question: "Overall, how are you feeling about your journey as a mother?", type: "scale", category: "wellbeing", order: 16 },
  ]

  for (const q of surveyQuestions) {
    await prisma.surveyQuestion.create({ data: q })
    console.log('❓ Created question:', q.question.substring(0, 50) + '...')
  }

  console.log('✅ Seeding complete with Thrive 5 Framework!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
