// Comprehensive Numerology Report Generator
// Synthesizes all numerology numbers into a cohesive life guide

// Section 1: Who You Are (Executive Summary)
function generateExecutiveSummary(data) {
    const { lifePath, expression, heartDesire, personality, birthday, maturity } = data;

    let summary = {
        coreIdentity: '',
        primaryDrive: '',
        greatestStrengths: [],
        growthOpportunities: []
    };

    // Core Identity - synthesize Life Path + Expression
    const identityMap = {
        1: { core: 'natural-born leader', traits: 'independent, pioneering, and self-reliant' },
        2: { core: 'peacemaker and diplomat', traits: 'cooperative, sensitive, and harmonious' },
        3: { core: 'creative communicator', traits: 'expressive, optimistic, and artistic' },
        4: { core: 'builder and organizer', traits: 'practical, disciplined, and reliable' },
        5: { core: 'freedom seeker and adventurer', traits: 'adaptable, curious, and dynamic' },
        6: { core: 'nurturer and caretaker', traits: 'responsible, compassionate, and protective' },
        7: { core: 'seeker of truth', traits: 'analytical, spiritual, and introspective' },
        8: { core: 'powerhouse and achiever', traits: 'ambitious, authoritative, and successful' },
        9: { core: 'humanitarian visionary', traits: 'compassionate, wise, and selfless' },
        11: { core: 'spiritual messenger', traits: 'intuitive, inspirational, and enlightened' },
        22: { core: 'master builder', traits: 'visionary, practical, and transformational' },
        33: { core: 'master teacher', traits: 'nurturing, selfless, and healing' }
    };

    const lifePathReduced = lifePath > 9 && ![11, 22, 33].includes(lifePath) ?
        reduceToSingleDigit(lifePath) : lifePath;
    const expressionReduced = expression > 9 && ![11, 22, 33].includes(expression) ?
        reduceToSingleDigit(expression) : expression;

    const lifePathIdentity = identityMap[lifePathReduced] || identityMap[1];
    const expressionIdentity = identityMap[expressionReduced] || identityMap[1];

    summary.coreIdentity = `You are fundamentally a ${lifePathIdentity.core}, ${lifePathIdentity.traits}. ` +
        `Your natural way of expressing yourself in the world is as a ${expressionIdentity.core}, bringing ${expressionIdentity.traits} energy to everything you do.`;

    // Primary Drive - Heart's Desire
    const driveMap = {
        1: 'to lead, innovate, and achieve independence',
        2: 'to create harmony, support others, and build meaningful partnerships',
        3: 'to express yourself creatively and inspire joy in others',
        4: 'to build something lasting and create order from chaos',
        5: 'to experience freedom, variety, and adventure',
        6: 'to nurture, serve, and create a loving environment',
        7: 'to understand life\'s mysteries and grow spiritually',
        8: 'to achieve material success and wield influence',
        9: 'to serve humanity and make a meaningful difference',
        11: 'to inspire and enlighten others through your intuition',
        22: 'to manifest grand visions into reality',
        33: 'to uplift and heal through unconditional love'
    };

    const heartDesireReduced = heartDesire > 9 && ![11, 22, 33].includes(heartDesire) ?
        reduceToSingleDigit(heartDesire) : heartDesire;
    summary.primaryDrive = driveMap[heartDesireReduced] || driveMap[1];

    // Greatest Strengths - combine Life Path, Expression, and dominant Lo Shu numbers
    summary.greatestStrengths = identifyStrengths(data);

    // Growth Opportunities - from missing numbers and karmic lessons
    summary.growthOpportunities = identifyGrowthAreas(data);

    return summary;
}

// Section 2: Your Personality (Synthesized)
function generatePersonalityProfile(data) {
    const { lifePath, expression, heartDesire, personality, balance, hiddenPassion } = data;

    return {
        coreNature: synthesizeCoreNature(lifePath, expression, personality),
        emotionalNature: synthesizeEmotionalNature(heartDesire, balance, personality),
        thinkingStyle: synthesizeThinkingStyle(expression, lifePath, hiddenPassion),
        decisionMaking: synthesizeDecisionMaking(lifePath, balance, personality)
    };
}

// Section 3: Your Natural Talents
function generateTalentsProfile(data) {
    const talents = [];
    const { expression, lifePath, hiddenPassion, birthday } = data;

    const talentMap = {
        1: ['Leadership', 'Innovation', 'Independence', 'Pioneering new paths'],
        2: ['Diplomacy', 'Mediation', 'Partnership building', 'Creating harmony'],
        3: ['Creative expression', 'Communication', 'Entertainment', 'Inspiring others'],
        4: ['Organization', 'System building', 'Project management', 'Detail work'],
        5: ['Adaptability', 'Marketing', 'Sales', 'Travel', 'Versatility'],
        6: ['Counseling', 'Healing', 'Teaching', 'Creating beauty', 'Nurturing'],
        7: ['Research', 'Analysis', 'Spiritual guidance', 'Strategic thinking'],
        8: ['Business management', 'Financial planning', 'Leadership', 'Authority'],
        9: ['Humanitarian work', 'Counseling', 'Art', 'Teaching', 'Philanthropy']
    };

    // Primary talents from Expression
    const expReduced = reduceToSingleDigit(expression);
    const primaryTalents = talentMap[expReduced] || [];

    primaryTalents.forEach(talent => {
        talents.push({
            name: talent,
            source: 'Expression Number',
            description: `This comes naturally to you and is a core part of how you express yourself in the world.`,
            maximize: `Focus on developing this through practice and seeking opportunities to use this skill.`
        });
    });

    return talents;
}

// Section 4: Your Inner World
function generateInnerWorld(data) {
    const { heartDesire, hiddenPassion, balance, subconscious } = data;

    return {
        deepestMotivation: analyzeDeepestMotivation(heartDesire),
        secretDesires: analyzeSecretDesires(hiddenPassion),
        fears: analyzeFears(balance, subconscious),
        purpose: analyzePurpose(heartDesire, data.lifePath)
    };
}

// Section 5: How Others See You
function generatePublicPersona(data) {
    const { personality, expression } = data;

    return {
        firstImpression: analyzeFirstImpression(personality),
        communicationStyle: analyzeCommunicationStyle(expression, personality),
        leadershipStyle: analyzeLeadershipStyle(data.lifePath, expression),
        socialEnergy: analyzeSocialEnergy(personality, data.heartDesire)
    };
}

// Section 6: Relationships
function generateRelationshipsProfile(data) {
    return {
        parents: analyzeRelationshipDynamics(data, 'parents'),
        romanticPartner: analyzeRelationshipDynamics(data, 'partner'),
        children: analyzeRelationshipDynamics(data, 'children'),
        friends: analyzeRelationshipDynamics(data, 'friends'),
        coworkers: analyzeRelationshipDynamics(data, 'coworkers'),
        idealPartnerQualities: identifyIdealPartnerQualities(data)
    };
}

// Section 7: Career & Professional Life
function generateCareerProfile(data) {
    const { lifePath, expression, birthday } = data;

    return {
        idealWorkStyle: determineWorkStyle(lifePath, expression),
        bestEnvironments: identifyBestEnvironments(lifePath, expression),
        leadershipApproach: analyzeLeadershipApproach(lifePath, expression),
        moneyMotivation: analyzeMoneyMotivation(data),
        idealCareers: identifyIdealCareers(lifePath, expression, birthday),
        careersToAvoid: identifyProblematicCareers(lifePath, expression)
    };
}

// Section 8: Wealth & Financial Habits
function generateWealthProfile(data) {
    const { lifePath, expression, birthday } = data;

    return {
        moneyMindset: analyzeMoneyMindset(lifePath, expression),
        savingHabits: analyzeSavingHabits(lifePath, birthday),
        riskTolerance: analyzeRiskTolerance(lifePath, expression),
        investmentStyle: analyzeInvestmentStyle(lifePath, expression),
        businessAbility: analyzeBusinessAbility(expression, lifePath),
        financialBlindSpots: identifyFinancialBlindSpots(lifePath, expression)
    };
}

// Section 9: Health & Wellbeing
function generateHealthProfile(data) {
    return {
        energyPatterns: analyzeEnergyPatterns(data.lifePath, data.birthday),
        stressResponse: analyzeStressResponse(data.balance, data.challenge),
        lifestyleRecommendations: generateLifestyleRecommendations(data),
        burnoutRisk: analyzeBurnoutRisk(data)
    };
}

// Section 10: Life Lessons
function generateLifeLessons(data, loShuGrid) {
    const lessons = [];

    // From missing Lo Shu numbers
    if (loShuGrid && loShuGrid.missing) {
        loShuGrid.missing.forEach(num => {
            lessons.push(synthesizeLessonFromMissingNumber(num));
        });
    }

    // From challenge numbers
    if (data.challenge) {
        lessons.push(synthesizeLessonFromChallenge(data.challenge));
    }

    return lessons;
}

// Section 11: Strengths
function identifyStrengths(data) {
    const strengths = [];
    const { lifePath, expression, personality, hiddenPassion } = data;

    // Top strengths based on number combinations
    const strengthMatrix = {
        1: { primary: 'Leadership and Initiative', secondary: 'Independence and Self-reliance' },
        2: { primary: 'Diplomacy and Cooperation', secondary: 'Intuition and Sensitivity' },
        3: { primary: 'Creative Expression', secondary: 'Communication and Inspiration' },
        4: { primary: 'Organization and Structure', secondary: 'Reliability and Discipline' },
        5: { primary: 'Adaptability and Versatility', secondary: 'Freedom and Adventure' },
        6: { primary: 'Responsibility and Nurturing', secondary: 'Harmony and Service' },
        7: { primary: 'Analytical Thinking', secondary: 'Spiritual Awareness and Wisdom' },
        8: { primary: 'Business Acumen', secondary: 'Authority and Achievement' },
        9: { primary: 'Compassion and Wisdom', secondary: 'Humanitarian Vision' }
    };

    [lifePath, expression, personality].forEach(num => {
        const reduced = reduceToSingleDigit(num);
        if (strengthMatrix[reduced]) {
            if (!strengths.includes(strengthMatrix[reduced].primary)) {
                strengths.push(strengthMatrix[reduced].primary);
            }
            if (!strengths.includes(strengthMatrix[reduced].secondary)) {
                strengths.push(strengthMatrix[reduced].secondary);
            }
        }
    });

    return strengths.slice(0, 10);
}

// Section 12: Growth Opportunities
function identifyGrowthAreas(data) {
    const growthAreas = [];

    // Areas to develop based on number patterns
    const { lifePath, expression, challenge } = data;

    // Challenge numbers indicate growth areas
    if (challenge !== undefined) {
        const challengeGrowth = {
            0: 'Learning to handle choices confidently',
            1: 'Developing assertiveness and independence',
            2: 'Building patience and cooperation',
            3: 'Expressing yourself more freely',
            4: 'Creating structure and following through',
            5: 'Embracing change and flexibility',
            6: 'Taking responsibility and nurturing others',
            7: 'Trusting intuition and seeking deeper understanding',
            8: 'Handling power and material success wisely'
        };

        if (challengeGrowth[challenge]) {
            growthAreas.push(challengeGrowth[challenge]);
        }
    }

    return growthAreas;
}

// Helper Functions

function reduceToSingleDigit(num) {
    while (num > 9) {
        num = num.toString().split('').reduce((sum, d) => sum + parseInt(d), 0);
    }
    return num;
}

function synthesizeCoreNature(lifePath, expression, personality) {
    const traits = [];
    const lp = reduceToSingleDigit(lifePath);
    const exp = reduceToSingleDigit(expression);

    // Introvert vs Extrovert
    if ([1, 3, 5, 8].includes(lp)) traits.push('naturally extroverted');
    else if ([2, 4, 7].includes(lp)) traits.push('more introverted');
    else traits.push('ambivert, adapting to situations');

    // Analytical vs Emotional
    if ([4, 7, 8].includes(lp)) traits.push('analytical thinker');
    else if ([2, 6, 9].includes(lp)) traits.push('emotionally intelligent');
    else traits.push('balanced between logic and emotion');

    // Practical vs Imaginative
    if ([4, 8].includes(exp)) traits.push('practical and grounded');
    else if ([3, 5, 7].includes(exp)) traits.push('imaginative and creative');
    else traits.push('combines practicality with creativity');

    return `You are ${traits.join(', ')} by nature.`;
}

function synthesizeEmotionalNature(heartDesire, balance, personality) {
    const hd = reduceToSingleDigit(heartDesire);

    const emotionalProfiles = {
        1: 'You process emotions independently and prefer to work through feelings on your own.',
        2: 'You are highly sensitive to others\' emotions and naturally empathetic.',
        3: 'You express emotions openly and use creativity to process feelings.',
        4: 'You prefer to analyze emotions logically and may suppress feelings initially.',
        5: 'You experience emotions intensely but can detach when needed for perspective.',
        6: 'You feel deeply responsible for others\' emotional wellbeing.',
        7: 'You process emotions internally through reflection and spiritual practices.',
        8: 'You channel emotions into productive action and goal achievement.',
        9: 'You have deep compassion and can absorb others\' emotions easily.'
    };

    return emotionalProfiles[hd] || emotionalProfiles[1];
}

function synthesizeThinkingStyle(expression, lifePath, hiddenPassion) {
    const exp = reduceToSingleDigit(expression);
    const styles = [];

    if ([1, 8].includes(exp)) styles.push('Strategic and goal-oriented');
    if ([3, 5].includes(exp)) styles.push('Creative and innovative');
    if ([4, 7].includes(exp)) styles.push('Logical and methodical');
    if ([2, 6, 9].includes(exp)) styles.push('Holistic and intuitive');

    return styles.length > 0 ? styles.join(', ') + ' thinking style.' : 'Balanced thinking style.';
}

function synthesizeDecisionMaking(lifePath, balance, personality) {
    const lp = reduceToSingleDigit(lifePath);

    const decisionStyles = {
        1: 'You make decisions quickly and trust your instincts. You prefer to act fast rather than overanalyze.',
        2: 'You take time to consider all perspectives and seek input from others before deciding.',
        3: 'You make decisions based on what feels inspiring and allows for creative expression.',
        4: 'You prefer to gather data, create a plan, and make methodical, well-researched decisions.',
        5: 'You make decisions flexibly and can change course quickly when new information emerges.',
        6: 'You consider how decisions impact others and choose paths that serve the greater good.',
        7: 'You make decisions through careful analysis and intuitive insight, trusting your inner wisdom.',
        8: 'You make decisions strategically, always considering the bigger picture and long-term outcomes.',
        9: 'You make decisions based on your values and what serves the highest good for all involved.'
    };

    return decisionStyles[lp] || decisionStyles[1];
}

function analyzeDeepestMotivation(heartDesire) {
    const hd = reduceToSingleDigit(heartDesire);
    const motivations = {
        1: 'Your deepest motivation is to be recognized as unique, capable, and independent. You want to make your own mark.',
        2: 'Your deepest motivation is to create harmony, support others, and build meaningful connections.',
        3: 'Your deepest motivation is to express yourself creatively and bring joy and inspiration to others.',
        4: 'Your deepest motivation is to build something lasting and create security for yourself and loved ones.',
        5: 'Your deepest motivation is to experience freedom, adventure, and personal growth through varied experiences.',
        6: 'Your deepest motivation is to nurture, serve, and create a loving environment for your family and community.',
        7: 'Your deepest motivation is to understand life\'s deeper mysteries and grow spiritually.',
        8: 'Your deepest motivation is to achieve material success, recognition, and positions of influence.',
        9: 'Your deepest motivation is to serve humanity and leave a legacy of positive change.'
    };
    return motivations[hd] || motivations[1];
}

function analyzeSecretDesires(hiddenPassion) {
    return `You secretly excel at and are drawn to activities involving the energy of number ${hiddenPassion}.`;
}

function analyzeFears(balance, subconscious) {
    return 'Common fears are revealed through your balance and challenge numbers, representing areas where you feel less confident.';
}

function analyzePurpose(heartDesire, lifePath) {
    return `Your life purpose combines your soul urge (${heartDesire}) with your life path (${lifePath}) to create a unique mission.`;
}

function analyzeFirstImpression(personality) {
    const p = reduceToSingleDigit(personality);
    const impressions = {
        1: 'People see you as confident, independent, and self-assured. You project leadership presence.',
        2: 'People see you as gentle, diplomatic, and approachable. You project warmth and cooperation.',
        3: 'People see you as charismatic, creative, and fun. You project enthusiasm and joy.',
        4: 'People see you as reliable, organized, and grounded. You project stability and practicality.',
        5: 'People see you as dynamic, adventurous, and versatile. You project energy and adaptability.',
        6: 'People see you as caring, responsible, and trustworthy. You project nurturing energy.',
        7: 'People see you as intellectual, mysterious, and refined. You project wisdom and depth.',
        8: 'People see you as powerful, successful, and authoritative. You project confidence and capability.',
        9: 'People see you as compassionate, wise, and idealistic. You project humanitarian values.'
    };
    return impressions[p] || impressions[1];
}

function analyzeCommunicationStyle(expression, personality) {
    const exp = reduceToSingleDigit(expression);
    const styles = {
        1: 'Direct and assertive communication. You get to the point quickly.',
        2: 'Gentle and diplomatic communication. You consider others\' feelings carefully.',
        3: 'Expressive and animated communication. You use humor and creativity.',
        4: 'Clear and structured communication. You prefer facts and details.',
        5: 'Versatile and engaging communication. You adapt your style to your audience.',
        6: 'Warm and supportive communication. You focus on connection and harmony.',
        7: 'Thoughtful and precise communication. You choose words carefully.',
        8: 'Authoritative and confident communication. You speak with conviction.',
        9: 'Compassionate and inspirational communication. You speak to hearts and minds.'
    };
    return styles[exp] || styles[1];
}

function analyzeLeadershipStyle(lifePath, expression) {
    const lp = reduceToSingleDigit(lifePath);
    const styles = {
        1: 'You lead by example, pioneering new directions and inspiring through your courage.',
        2: 'You lead through collaboration, building consensus and supporting team harmony.',
        3: 'You lead through inspiration, creativity, and keeping morale high.',
        4: 'You lead through organization, creating systems and processes that work.',
        5: 'You lead through vision, encouraging innovation and embracing change.',
        6: 'You lead through service, putting team wellbeing first and creating supportive environments.',
        7: 'You lead through expertise, providing strategic direction and wise counsel.',
        8: 'You lead through authority, making bold decisions and driving results.',
        9: 'You lead through values, inspiring others toward meaningful purpose.'
    };
    return styles[lp] || styles[1];
}

function analyzeSocialEnergy(personality, heartDesire) {
    return 'Your social energy is determined by your personality number and how it interacts with your heart\'s desire.';
}

function analyzeRelationshipDynamics(data, relationshipType) {
    const lp = reduceToSingleDigit(data.lifePath);

    const dynamics = {
        parents: `Your relationship with parents is influenced by your need for ${lp === 1 ? 'independence' : lp === 2 ? 'harmony' : 'understanding'}.`,
        partner: `In romantic relationships, you seek ${lp === 1 ? 'independence within partnership' : lp === 2 ? 'deep emotional connection' : 'mutual growth'}.`,
        children: `With children, you naturally ${lp === 6 ? 'nurture and protect' : lp === 1 ? 'encourage independence' : 'support their growth'}.`,
        friends: `In friendships, you value ${lp === 3 ? 'fun and creativity' : lp === 7 ? 'depth and authenticity' : 'loyalty and trust'}.`,
        coworkers: `With coworkers, you prefer ${lp === 8 ? 'professional efficiency' : lp === 2 ? 'collaborative teamwork' : 'mutual respect'}.`
    };

    return {
        dynamics: dynamics[relationshipType] || '',
        loveLanguage: 'Determined by your expression and heart\'s desire numbers.',
        conflictStyle: 'Shown through your challenge and balance numbers.',
        strengths: ['Connection', 'Understanding', 'Support'],
        improvements: ['Communication', 'Boundaries', 'Patience']
    };
}

function identifyIdealPartnerQualities(data) {
    const hd = reduceToSingleDigit(data.heartDesire);
    const qualities = {
        1: ['Independent', 'Confident', 'Respectful of boundaries'],
        2: ['Sensitive', 'Patient', 'Emotionally available'],
        3: ['Creative', 'Fun-loving', 'Supportive of expression'],
        4: ['Reliable', 'Practical', 'Committed'],
        5: ['Adventurous', 'Flexible', 'Open-minded'],
        6: ['Caring', 'Family-oriented', 'Responsible'],
        7: ['Intelligent', 'Spiritual', 'Deep thinker'],
        8: ['Ambitious', 'Confident', 'Financially stable'],
        9: ['Compassionate', 'Idealistic', 'Humanitarian']
    };
    return qualities[hd] || qualities[1];
}

function determineWorkStyle(lifePath, expression) {
    const lp = reduceToSingleDigit(lifePath);
    const styles = {
        1: 'You work best independently with autonomy and decision-making power.',
        2: 'You thrive in collaborative environments where teamwork is valued.',
        3: 'You excel in creative fields that allow self-expression and variety.',
        4: 'You prefer structured environments with clear processes and expectations.',
        5: 'You need variety, flexibility, and freedom in your work.',
        6: 'You flourish in service-oriented roles where you can help others.',
        7: 'You work best in quiet, focused environments that allow deep thinking.',
        8: 'You thrive in leadership positions with clear goals and measurable results.',
        9: 'You excel in meaningful work that serves a greater purpose.'
    };
    return styles[lp] || styles[1];
}

function identifyBestEnvironments(lifePath, expression) {
    return ['Fast-paced corporate', 'Creative studio', 'Nonprofit organization', 'Entrepreneurial', 'Remote/flexible'];
}

function analyzeLeadershipApproach(lifePath, expression) {
    return 'Your leadership approach combines your life path\'s natural direction with your expression\'s communication style.';
}

function analyzeMoneyMotivation(data) {
    const lp = reduceToSingleDigit(data.lifePath);
    const motivations = {
        1: 'You\'re motivated by financial independence and being in control of your income.',
        2: 'You value financial security that allows you to help and support others.',
        3: 'Money is a tool for creative expression and enjoying life\'s pleasures.',
        4: 'You\'re driven to build lasting financial security through careful planning.',
        5: 'Money represents freedom and the ability to explore new experiences.',
        6: 'Financial success means being able to provide for and protect your loved ones.',
        7: 'You view money as necessary but not the primary measure of success.',
        8: 'You\'re highly motivated by financial achievement and material success.',
        9: 'Money is a means to serve others and support causes you believe in.'
    };
    return motivations[lp] || motivations[1];
}

function identifyIdealCareers(lifePath, expression, birthday) {
    const lp = reduceToSingleDigit(lifePath);
    const careers = {
        1: ['Entrepreneur', 'Executive', 'Consultant', 'Sales Leader'],
        2: ['Mediator', 'Counselor', 'Diplomat', 'HR Professional'],
        3: ['Artist', 'Writer', 'Entertainer', 'Marketing Professional'],
        4: ['Project Manager', 'Engineer', 'Accountant', 'Operations Manager'],
        5: ['Travel Industry', 'Sales', 'Marketing', 'Public Relations'],
        6: ['Teacher', 'Nurse', 'Interior Designer', 'Social Worker'],
        7: ['Researcher', 'Analyst', 'Spiritual Advisor', 'Scientist'],
        8: ['Business Owner', 'Financial Advisor', 'Real Estate', 'Executive'],
        9: ['Nonprofit Leader', 'Teacher', 'Counselor', 'Artist', 'Healer']
    };
    return careers[lp] || careers[1];
}

function identifyProblematicCareers(lifePath, expression) {
    return ['Careers requiring constant supervision', 'Highly repetitive work', 'Fields misaligned with values'];
}

function analyzeMoneyMindset(lifePath, expression) {
    return 'Your money mindset is shaped by your life path and expression numbers, influencing how you view and handle finances.';
}

function analyzeSavingHabits(lifePath, birthday) {
    const lp = reduceToSingleDigit(lifePath);
    const habits = {
        1: 'You save when it supports your independence goals.',
        2: 'You save for security and to help others when needed.',
        3: 'Saving can be challenging as you prefer to enjoy money now.',
        4: 'You\'re naturally disciplined about saving and planning.',
        5: 'You save when motivated but can be inconsistent.',
        6: 'You save to provide for family and loved ones.',
        7: 'You save strategically, preferring quality investments.',
        8: 'You\'re excellent at accumulating wealth through smart planning.',
        9: 'You save enough for needs but readily share abundance.'
    };
    return habits[lp] || habits[1];
}

function analyzeRiskTolerance(lifePath, expression) {
    const lp = reduceToSingleDigit(lifePath);
    const tolerance = {
        1: 'High risk tolerance - you\'re willing to take calculated risks.',
        2: 'Low to moderate risk tolerance - you prefer security.',
        3: 'Moderate risk tolerance - you\'ll take risks for creative ventures.',
        4: 'Low risk tolerance - you prefer safe, proven approaches.',
        5: 'High risk tolerance - you embrace change and uncertainty.',
        6: 'Low to moderate risk tolerance - family security comes first.',
        7: 'Moderate risk tolerance - you research thoroughly before risking.',
        8: 'Moderate to high risk tolerance - you take calculated risks for big rewards.',
        9: 'Moderate risk tolerance - you balance idealism with practicality.'
    };
    return tolerance[lp] || tolerance[1];
}

function analyzeInvestmentStyle(lifePath, expression) {
    return 'Your investment style reflects your approach to risk and long-term planning.';
}

function analyzeBusinessAbility(expression, lifePath) {
    const exp = reduceToSingleDigit(expression);
    const abilities = {
        1: 'Strong entrepreneurial ability - you\'re a natural self-starter.',
        2: 'Better in partnerships - you excel at building business relationships.',
        3: 'Creative business ability - marketing and branding are your strengths.',
        4: 'Excellent at business operations and systems.',
        5: 'Great at sales, marketing, and adapting to market changes.',
        6: 'Strong in service-based businesses and building loyal customers.',
        7: 'Excellent as consultant or specialized expert.',
        8: 'Outstanding business acumen - natural executive ability.',
        9: 'Best in businesses serving a social cause or purpose.'
    };
    return abilities[exp] || abilities[1];
}

function identifyFinancialBlindSpots(lifePath, expression) {
    const lp = reduceToSingleDigit(lifePath);
    const blindspots = {
        1: 'May overspend on status symbols or take excessive risks.',
        2: 'May avoid financial confrontation or let others take advantage.',
        3: 'May struggle with budgeting and impulse spending.',
        4: 'May be too conservative and miss growth opportunities.',
        5: 'May change financial plans too frequently.',
        6: 'May give too much financial support to others.',
        7: 'May neglect financial planning while focused on other pursuits.',
        8: 'May become too focused on money at expense of relationships.',
        9: 'May be too idealistic about money or give away too much.'
    };
    return blindspots[lp] || blindspots[1];
}

function analyzeEnergyPatterns(lifePath, birthday) {
    return 'Your energy ebbs and flows in predictable patterns based on your numbers.';
}

function analyzeStressResponse(balance, challenge) {
    return 'Your stress response is shown through your balance number - how you handle crisis situations.';
}

function generateLifestyleRecommendations(data) {
    return [
        'Regular exercise suited to your energy type',
        'Adequate rest and recovery time',
        'Nutrition that supports your metabolic type',
        'Stress management practices',
        'Social connection balanced with alone time'
    ];
}

function analyzeBurnoutRisk(data) {
    const lp = reduceToSingleDigit(data.lifePath);
    const risks = {
        1: 'Moderate risk - may burn out from excessive independence and isolation.',
        2: 'High risk - may burn out from over-giving and neglecting self-care.',
        3: 'Moderate risk - may burn out from overcommitment to social activities.',
        4: 'Moderate to high risk - may burn out from overwork and rigidity.',
        5: 'Moderate risk - may burn out from constant stimulation and change.',
        6: 'High risk - may burn out from excessive caretaking and responsibility.',
        7: 'Low to moderate risk - naturally manages energy through solitude.',
        8: 'High risk - may burn out from relentless drive for success.',
        9: 'High risk - may burn out from taking on world\'s problems.'
    };
    return risks[lp] || risks[5];
}

function synthesizeLessonFromMissingNumber(num) {
    const lessons = {
        1: 'One recurring lesson throughout your life is developing self-confidence and independence. As you strengthen your ability to stand alone and trust yourself, many other areas naturally improve.',
        2: 'A key life lesson is learning patience, cooperation, and sensitivity to others. As you develop these diplomatic skills, relationships and partnerships flourish.',
        3: 'Your life invites you to develop creative self-expression and communication. As you learn to express yourself more freely and joyfully, doors open naturally.',
        4: 'Life will teach you the value of structure, discipline, and follow-through. As you develop these practical skills, you build lasting foundations for success.',
        5: 'You\'re learning to embrace change, freedom, and flexibility. As you release rigidity and welcome new experiences, life becomes more abundant.',
        6: 'A central lesson is developing responsibility, nurturing abilities, and creating harmony. As you strengthen these qualities, family and community connections deepen.',
        7: 'Life guides you toward developing introspection, spiritual awareness, and analytical thinking. As you cultivate inner wisdom, clarity emerges.',
        8: 'Your journey involves learning about material success, authority, and power. As you develop business acumen and leadership, prosperity follows.',
        9: 'You\'re learning compassion, wisdom, and letting go. As you develop these humanitarian qualities, your life gains greater meaning and purpose.'
    };
    return lessons[num] || 'This missing number represents an important area for growth in your life.';
}

function synthesizeLessonFromChallenge(challenge) {
    const lessons = {
        0: 'Your challenge is learning to make clear choices without being overwhelmed by options.',
        1: 'Your challenge involves developing self-confidence and assertiveness without aggression.',
        2: 'Your challenge is finding balance between independence and cooperation.',
        3: 'Your challenge involves authentic self-expression while managing scattered energy.',
        4: 'Your challenge is creating structure without becoming rigid or limited.',
        5: 'Your challenge involves embracing change while maintaining some stability.',
        6: 'Your challenge is balancing responsibility to others with self-care.',
        7: 'Your challenge involves trusting intuition while staying grounded.',
        8: 'Your challenge is handling power and success without becoming controlling.'
    };
    return lessons[challenge] || 'Your challenge number reveals an important area of growth.';
}

// Export functions for use in main app
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        generateExecutiveSummary,
        generatePersonalityProfile,
        generateTalentsProfile,
        generateInnerWorld,
        generatePublicPersona,
        generateRelationshipsProfile,
        generateCareerProfile,
        generateWealthProfile,
        generateHealthProfile,
        generateLifeLessons,
        identifyStrengths,
        identifyGrowthAreas
    };
}
