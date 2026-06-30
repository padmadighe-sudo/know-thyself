let numbersData = {};
let birthdayData = {};
let alphabetData = {};
let referenceData = [];
let karmicNumbersData = {};
let talismanData = [];
let loShuReferenceData = {};

// Load all data files
async function loadData() {
    try {
        console.log('Loading data files...');

        // Load Numbers.json
        const numbersResponse = await fetch('Data/Numbers.json');
        if (!numbersResponse.ok) {
            throw new Error(`Failed to load Numbers.json: ${numbersResponse.status} ${numbersResponse.statusText}`);
        }

        const numbers = await numbersResponse.json();
        console.log('Numbers.json loaded:', numbers.length, 'items');

        // Load BirthDay.json
        const birthdayResponse = await fetch('Data/BirthDay.json');
        if (!birthdayResponse.ok) {
            throw new Error(`Failed to load BirthDay.json: ${birthdayResponse.status} ${birthdayResponse.statusText}`);
        }
        const birthday = await birthdayResponse.json();
        console.log('BirthDay.json loaded:', birthday.length, 'items');

        // Load Alphabet.json
        const alphabetResponse = await fetch('Data/Alphabet.json');
        if (!alphabetResponse.ok) {
            throw new Error(`Failed to load Alphabet.json: ${alphabetResponse.status} ${alphabetResponse.statusText}`);
        }
        const alphabet = await alphabetResponse.json();
        console.log('Alphabet.json loaded:', alphabet.length, 'items');

        // Load Reference.json
        const referenceResponse = await fetch('Data/Reference.json');
        if (!referenceResponse.ok) {
            throw new Error(`Failed to load Reference.json: ${referenceResponse.status} ${referenceResponse.statusText}`);
        }
        referenceData = await referenceResponse.json();
        console.log('Reference.json loaded:', referenceData.length, 'items');

        // Load KarmicNumbers.json
        const karmicResponse = await fetch('Data/KarmicNumbers.json');
        if (!karmicResponse.ok) {
            throw new Error(`Failed to load KarmicNumbers.json: ${karmicResponse.status} ${karmicResponse.statusText}`);
        }
        const karmicNumbers = await karmicResponse.json();
        console.log('KarmicNumbers.json loaded:', karmicNumbers.length, 'items');

        // Load Talisman.json
        const talismanResponse = await fetch('Data/Talisman.json');
        if (!talismanResponse.ok) {
            throw new Error(`Failed to load Talisman.json: ${talismanResponse.status} ${talismanResponse.statusText}`);
        }
        talismanData = await talismanResponse.json();
        console.log('Talisman.json loaded:', talismanData.length, 'items');

        // Load lo_shu_reference.json
        const loShuResponse = await fetch('Data/lo_shu_reference.json');
        if (!loShuResponse.ok) {
            throw new Error(`Failed to load lo_shu_reference.json: ${loShuResponse.status} ${loShuResponse.statusText}`);
        }
        loShuReferenceData = await loShuResponse.json();
        console.log('lo_shu_reference.json loaded successfully');

        // Convert arrays to objects for easy lookup
        numbersData = {};
        numbers.forEach(item => {
            numbersData[item.Number] = item;
        });

        birthdayData = {};
        birthday.forEach(item => {
            birthdayData[item.Day] = item;
        });

        alphabetData = {};
        alphabet.forEach(item => {
            alphabetData[item.Letter] = item;
        });

        karmicNumbersData = {};
        karmicNumbers.forEach(item => {
            karmicNumbersData[item.Number] = item;
        });

        console.log('All data loaded successfully');
        console.log('Data Summary:', {
            numbers: Object.keys(numbersData).length,
            birthdays: Object.keys(birthdayData).length,
            alphabet: Object.keys(alphabetData).length,
            reference: referenceData.length,
            karmicNumbers: Object.keys(karmicNumbersData).length
        });
    } catch (error) {
        console.error('Error loading data:', error);
        console.error('Error details:', error.message);
        alert(`Error loading data files: ${error.message}\n\nPlease ensure:\n1. The server is running\n2. Data folder exists\n3. All JSON files are present`);
    }
}

// Helper function to get trait names from Reference.json
function getTraitNames(idsString) {
    if (!idsString || idsString === 'N/A') return 'N/A';

    const ids = idsString.split(',').map(id => parseInt(id.trim()));
    const traits = ids
        .map(id => {
            const ref = referenceData.find(item => item.Id === id && item.Type === 3);
            return ref ? ref.Name : null;
        })
        .filter(name => name !== null);

    return traits.length > 0 ? traits.join(', ') : 'N/A';
}

// Helper function to get color names from Reference.json (Type=1)
function getColorNames(idsString) {
    if (!idsString || idsString === 'N/A') return 'N/A';

    // Check if input is already color names (contains letters) or numeric IDs
    const firstItem = idsString.split(',')[0].trim();
    const isNumeric = /^\-?\d+$/.test(firstItem);

    if (!isNumeric) {
        // Already color names, just return them
        return idsString;
    }

    // Parse as numeric IDs and look up color names
    const ids = idsString.split(',').map(id => parseInt(id.trim())).filter(id => id > 0);
    const colors = ids
        .map(id => {
            const ref = referenceData.find(item => item.Id === id && item.Type === 1);
            return ref ? ref.Name : null;
        })
        .filter(name => name !== null);

    return colors.length > 0 ? colors.join(', ') : 'N/A';
}

// Helper function to get jewel/stone names from Reference.json (Type=0)
function getJewelNames(idsString) {
    if (!idsString || idsString === 'N/A') return 'N/A';

    const ids = idsString.split(',').map(id => parseInt(id.trim()));
    const jewels = ids
        .map(id => {
            const ref = referenceData.find(item => item.Id === id && item.Type === 0);
            return ref ? ref.Name : null;
        })
        .filter(name => name !== null);

    return jewels.length > 0 ? jewels.join(', ') : 'N/A';
}

// Numerology Calculations
const MASTER_NUMBERS = new Set([11, 22, 33]);

const LETTER_VALUES = {
    A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
    J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
    S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8
};

function sumDigitsOnce(n) {
    return Math.abs(n)
        .toString()
        .split("")
        .reduce((s, ch) => s + parseInt(ch || "0", 10), 0);
}

function reduceNumber(original, keepMasters = true) {
    const n0 = Math.abs(Math.trunc(original));
    if (keepMasters && MASTER_NUMBERS.has(n0)) {
        return { original: n0, singleDigit: n0, isMaster: true };
    }

    let curr = n0;
    while (curr > 9) {
        curr = sumDigitsOnce(curr);
        if (keepMasters && MASTER_NUMBERS.has(curr)) {
            return { original: n0, singleDigit: curr, isMaster: true };
        }
    }

    return { original: n0, singleDigit: curr, isMaster: false };
}

function calculateLifePath(dateStr) {
    // Parse DD/MM/YYYY format
    const parts = dateStr.split('/');
    const day = parseInt(parts[0]);
    const month = parseInt(parts[1]);
    const year = parseInt(parts[2]);

    // Add all individual digits together first
    const monthDigits = month.toString().split('').reduce((sum, d) => sum + parseInt(d), 0);
    const dayDigits = day.toString().split('').reduce((sum, d) => sum + parseInt(d), 0);
    const yearDigits = year.toString().split('').reduce((sum, d) => sum + parseInt(d), 0);

    let total = monthDigits + dayDigits + yearDigits;

    // Keep reducing until single digit or master number (11, 22, 33)
    while (total > 9 && total !== 11 && total !== 22 && total !== 33) {
        total = total.toString().split('').reduce((sum, d) => sum + parseInt(d), 0);
    }

    return total;
}

function lettersOnly(s) {
    return (s || "").toUpperCase().replace(/[^A-Z]/g, "");
}

function reduceKeepMasters(n) {
    if (MASTER_NUMBERS.has(n)) return n;
    while (n > 9) {
        n = n.toString().split("").reduce((s, ch) => s + parseInt(ch, 10), 0);
        if (MASTER_NUMBERS.has(n)) return n;
    }
    return n;
}

function calculateExpression(name) {
    const letters = lettersOnly(name);
    let sum = 0;
    for (const ch of letters) sum += LETTER_VALUES[ch] || 0;
    return reduceKeepMasters(sum);
}

function calculateHeartDesire(name) {
    const letters = lettersOnly(name);
    const vowels = new Set(["A", "E", "I", "O", "U", "Y"]);
    let sum = 0;
    for (const ch of letters) {
        if (vowels.has(ch)) sum += LETTER_VALUES[ch] || 0;
    }
    return reduceKeepMasters(sum);
}

function calculatePersonality(name) {
    const letters = lettersOnly(name);
    const vowels = new Set(["A", "E", "I", "O", "U", "Y"]);
    let sum = 0;
    for (const ch of letters) {
        if (!vowels.has(ch)) sum += LETTER_VALUES[ch] || 0;
    }
    return reduceKeepMasters(sum);
}

function calculateMaturity(lifePath, expression) {
    const sum = lifePath + expression;
    return reduceKeepMasters(sum);
}

function getBirthdayNumber(dateStr) {
    // Parse DD/MM/YYYY format
    const parts = dateStr.split('/');
    return parseInt(parts[0]);
}

function getFirstVowel(name) {
    const letters = lettersOnly(name);
    const vowels = new Set(["A", "E", "I", "O", "U", "Y"]);
    for (const ch of letters) {
        if (vowels.has(ch)) return ch;
    }
    return null;
}

function getCapstone(name) {
    const letters = lettersOnly(name);
    return letters.length > 0 ? letters[letters.length - 1] : null;
}

function getCornerstone(name) {
    const letters = lettersOnly(name);
    return letters.length > 0 ? letters[0] : null;
}

function calculateBalance(name) {
    // Balance number = first letter of first, middle, and last name
    const names = name.trim().split(/\s+/);
    let sum = 0;
    for (const n of names) {
        const first = lettersOnly(n)[0];
        if (first) sum += LETTER_VALUES[first] || 0;
    }
    return reduceKeepMasters(sum);
}

function calculateHiddenPassion(name) {
    // Count frequency of each number
    const letters = lettersOnly(name);
    const freq = {};
    for (const ch of letters) {
        const val = LETTER_VALUES[ch] || 0;
        freq[val] = (freq[val] || 0) + 1;
    }
    // Find number with highest frequency
    let maxCount = 0;
    let hiddenNumber = 1;
    for (const [num, count] of Object.entries(freq)) {
        if (count > maxCount) {
            maxCount = count;
            hiddenNumber = parseInt(num);
        }
    }
    return hiddenNumber;
}

function calculateRationalThought(expression, birthday) {
    const sum = expression + birthday;
    return reduceKeepMasters(sum);
}

function calculateSubconscious(name) {
    // Count how many different numbers are present
    const letters = lettersOnly(name);
    const unique = new Set();
    for (const ch of letters) {
        unique.add(LETTER_VALUES[ch] || 0);
    }
    return unique.size;
}

function calculateChallenge(dateStr) {
    // Parse DD/MM/YYYY format
    const parts = dateStr.split('/');
    const day = parseInt(parts[0]);
    const month = parseInt(parts[1]);
    const year = parseInt(parts[2]);

    const m = reduceNumber(month, false).singleDigit;
    const d = reduceNumber(day, false).singleDigit;
    const y = reduceNumber(year, false).singleDigit;

    // Main challenge is absolute difference between month and day
    return Math.abs(m - d);
}

// Detect karmic and master numbers in chart
function detectKarmicMasterNumbers(data) {
    const karmicDebt = [13, 14, 16, 19];
    const masterNumbers = [11, 22, 33];
    const detected = [];

    // Check all calculated numbers
    const numbersToCheck = [
        { value: data.lifePath, name: 'Life Path' },
        { value: data.expression, name: 'Expression' },
        { value: data.heartDesire, name: 'Heart\'s Desire' },
        { value: data.personality, name: 'Personality' },
        { value: data.birthday, name: 'Birthday' },
        { value: data.maturity, name: 'Maturity' }
    ];

    numbersToCheck.forEach(item => {
        if (karmicDebt.includes(item.value)) {
            detected.push({
                number: item.value,
                position: item.name,
                type: 'karmic',
                data: karmicNumbersData[item.value]
            });
        } else if (masterNumbers.includes(item.value)) {
            detected.push({
                number: item.value,
                position: item.name,
                type: 'master',
                data: karmicNumbersData[item.value]
            });
        }
    });

    return detected;
}

// Display karmic and master numbers
function displayKarmicMasterNumbers(detected) {
    const container = document.getElementById('karmic-master-content');
    const warningDiv = document.getElementById('karmic-warning');
    const warningContent = document.getElementById('karmic-warning-content');
    const noKarmicMsg = document.getElementById('no-karmic-message');

    if (detected.length === 0) {
        container.innerHTML = '';
        warningDiv.classList.add('hidden');
        noKarmicMsg.classList.remove('hidden');
        return;
    }

    noKarmicMsg.classList.add('hidden');
    warningDiv.classList.remove('hidden');

    // Build warning summary
    const karmicCount = detected.filter(d => d.type === 'karmic').length;
    const masterCount = detected.filter(d => d.type === 'master').length;
    let warningSummary = '';
    if (karmicCount > 0) warningSummary += `${karmicCount} Karmic Debt Number(s)`;
    if (masterCount > 0) {
        if (warningSummary) warningSummary += ' and ';
        warningSummary += `${masterCount} Master Number(s)`;
    }
    warningContent.innerHTML = `<p style="margin: 0;">${warningSummary} detected in your numerology chart. These carry special significance and lessons.</p>`;

    // Display each detected number
    container.innerHTML = detected.map(item => `
        <div class="advanced-item" style="border-left: 4px solid ${item.type === 'karmic' ? '#ef4444' : '#f59e0b'};">
            <h3>${item.data.Name} in ${item.position}</h3>
            <p class="section-desc"><strong>${item.data.Description}</strong></p>
            <p style="margin-top: 15px;"><strong>Key Themes:</strong> ${item.data.Keywords}</p>
            <p style="margin-top: 10px;"><strong>Life Lesson:</strong> ${item.data.Lesson}</p>
        </div>
    `).join('');
}

// Analyze numerology chart for overview
function analyzeChart(data) {
    // Reduce master numbers to single digits for frequency analysis
    const reduceToSingle = (num) => {
        while (num > 9) {
            num = num.toString().split('').reduce((sum, d) => sum + parseInt(d), 0);
        }
        return num;
    };

    // Collect all numbers in the chart with their reduced forms
    const coreNumbers = {
        'Life Path': reduceToSingle(data.lifePath),
        'Expression': reduceToSingle(data.expression),
        'Heart\'s Desire': reduceToSingle(data.heartDesire),
        'Personality': reduceToSingle(data.personality),
        'Birthday': reduceToSingle(data.birthday),
        'Maturity': reduceToSingle(data.maturity),
        'Balance': reduceToSingle(data.balance),
        'Hidden Passion': data.hiddenPassion,
        'Rational Thought': reduceToSingle(data.rationalThought),
        'Challenge': data.challenge
    };

    // Count frequency of each number (1-9)
    const frequency = {};
    for (let i = 1; i <= 9; i++) {
        frequency[i] = 0;
    }

    Object.values(coreNumbers).forEach(num => {
        if (num >= 1 && num <= 9) {
            frequency[num]++;
        }
    });

    // Find dominant numbers (appear 3+ times)
    const dominant = [];
    const strong = [];
    const present = [];
    const missing = [];

    for (let i = 1; i <= 9; i++) {
        if (frequency[i] >= 3) {
            dominant.push({ number: i, count: frequency[i] });
        } else if (frequency[i] === 2) {
            strong.push({ number: i, count: frequency[i] });
        } else if (frequency[i] === 1) {
            present.push({ number: i, count: frequency[i] });
        } else {
            missing.push(i);
        }
    }

    // Sort by frequency
    dominant.sort((a, b) => b.count - a.count);
    strong.sort((a, b) => b.count - a.count);

    // Detect conflicting numbers
    const conflicts = detectConflicts(coreNumbers);

    return {
        coreNumbers,
        frequency,
        dominant,
        strong,
        present,
        missing,
        conflicts
    };
}

// Detect conflicting numbers in the chart
function detectConflicts(coreNumbers) {
    // Define conflicting number pairs based on numerology principles
    const conflictingPairs = {
        1: { conflicts: [2, 6, 8], reason: 'Sun (1) conflicts with Moon (2), Venus (6), and Saturn (8)' },
        2: { conflicts: [1, 3, 5, 7, 8], reason: 'Moon (2) conflicts with Sun (1), Jupiter (3), Mercury (5), Ketu (7), and Saturn (8)' },
        3: { conflicts: [2, 4], reason: 'Jupiter (3) conflicts with Moon (2) and Uranus/Rahu (4)' },
        4: { conflicts: [1, 3, 5], reason: 'Uranus/Rahu (4) conflicts with Sun (1), Jupiter (3), and Mercury (5)' },
        5: { conflicts: [2, 4, 6, 9], reason: 'Mercury (5) conflicts with Moon (2), Uranus (4), Venus (6), and Mars (9)' },
        6: { conflicts: [1, 5], reason: 'Venus (6) conflicts with Sun (1) and Mercury (5)' },
        7: { conflicts: [1, 2], reason: 'Ketu/Neptune (7) conflicts with Sun (1) and Moon (2)' },
        8: { conflicts: [1, 2], reason: 'Saturn (8) conflicts with Sun (1) and Moon (2)' },
        9: { conflicts: [5], reason: 'Mars (9) conflicts with Mercury (5)' }
    };

    const remedies = {
        '1-2': 'Wear gold and pearl together, or alternate between them. Practice balancing independence with cooperation.',
        '1-6': 'Meditate on Sundays and Fridays. Balance self-focus with relationship harmony. Wear ruby and diamond on different hands.',
        '1-8': 'This is a challenging conflict. Chant mantras for Sun and Saturn. Wear ruby on right hand and blue sapphire on left hand (consult astrologer). Focus on patience and discipline.',
        '2-5': 'Donate to charities on Mondays and Wednesdays. Balance emotions with logic. Wear pearl and emerald separately.',
        '2-7': 'Meditate regularly to balance emotions and intuition. Spend time near water and in spiritual practices.',
        '2-8': 'Practice emotional resilience. This requires patience and inner strength. Seek guidance from elders.',
        '3-4': 'Donate on Thursdays. Balance optimism with practicality. Focus on grounding your expansive ideas.',
        '4-5': 'Balance structure with flexibility. Practice yoga. Create routines that allow for spontaneity.',
        '5-6': 'Balance freedom with commitment. Communicate openly in relationships. Wear emerald and diamond on different days.',
        '5-9': 'Channel restless energy into positive action. Practice patience. Balance movement with purpose.',
        '6-1': 'Same as 1-6. Balance personal goals with relationship needs.',
        '7-1': 'Same as 1-7. Balance ego with spiritual awareness. Spend time in solitude and self-reflection.',
        '7-2': 'Same as 2-7. Balance intuition with emotions through meditation and spiritual practices.',
        '8-1': 'Same as 1-8. This requires karmic work. Focus on humility and service.',
        '8-2': 'Same as 2-8. Develop emotional strength through discipline and structure.'
    };

    const conflictMap = {};
    const entries = Object.entries(coreNumbers);

    // Check each pair of numbers
    for (let i = 0; i < entries.length; i++) {
        for (let j = i + 1; j < entries.length; j++) {
            const [pos1, num1] = entries[i];
            const [pos2, num2] = entries[j];

            // Check if these numbers conflict
            if (conflictingPairs[num1]?.conflicts.includes(num2)) {
                // Create a consistent key for this conflict pair
                const sortedNums = [num1, num2].sort((a, b) => a - b);
                const conflictKey = `${sortedNums[0]}-${sortedNums[1]}`;

                if (!conflictMap[conflictKey]) {
                    const key1 = `${num1}-${num2}`;
                    const key2 = `${num2}-${num1}`;
                    const remedy = remedies[key1] || remedies[key2] || 'Practice balance and harmony in life. Consult a numerologist for personalized guidance.';

                    conflictMap[conflictKey] = {
                        num1: sortedNums[0],
                        num2: sortedNums[1],
                        reason: conflictingPairs[num1].reason,
                        remedy,
                        occurrences: []
                    };
                }

                // Add this occurrence
                conflictMap[conflictKey].occurrences.push({
                    positions: [pos1, pos2],
                    values: [num1, num2]
                });
            }
        }
    }

    // Convert map to array
    return Object.values(conflictMap);
}

// Display overview analysis
function displayOverview(data, analysis) {
    // Summary section
    const summaryDiv = document.getElementById('overview-summary');
    const masterNumbers = [11, 22, 33];
    const hasMasterNumbers = [data.lifePath, data.expression, data.heartDesire, data.personality, data.maturity]
        .some(num => masterNumbers.includes(num));

    let summaryHTML = '<h3 style="margin-top: 0; color: #6b46c1;">Your Numerology Profile</h3>';
    summaryHTML += '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-top: 15px;">';

    const coreDisplay = [
        { label: 'Life Path', value: data.lifePath },
        { label: 'Expression', value: data.expression },
        { label: 'Heart\'s Desire', value: data.heartDesire },
        { label: 'Personality', value: data.personality },
        { label: 'Birthday', value: data.birthday },
        { label: 'Maturity', value: data.maturity }
    ];

    coreDisplay.forEach(item => {
        const isMaster = masterNumbers.includes(item.value);
        summaryHTML += `
            <div style="background: #f1f5f9; padding: 12px; border-radius: 8px; border-left: 3px solid ${isMaster ? '#f59e0b' : '#6b46c1'}; border: 1px solid #cbd5e1;">
                <div style="font-size: 0.85rem; color: #64748b; margin-bottom: 5px;">${item.label}</div>
                <div style="font-size: 1.5rem; font-weight: bold; color: ${isMaster ? '#ea580c' : '#6b46c1'};">${item.value}</div>
            </div>
        `;
    });
    summaryHTML += '</div>';

    if (hasMasterNumbers) {
        summaryHTML += `
            <div style="margin-top: 20px; padding: 15px; background: #fef3c7; border-radius: 8px; border-left: 3px solid #f59e0b; border: 1px solid #fcd34d;">
                <strong style="color: #b45309;">✨ You have Master Numbers in your chart!</strong>
                <p style="margin: 10px 0 0 0; font-size: 0.9rem; color: #78350f;">Master numbers carry higher spiritual vibration and greater potential, but also come with increased responsibility and challenges.</p>
            </div>
        `;
    }

    summaryDiv.innerHTML = summaryHTML;

    // Dominant numbers section
    const dominantDiv = document.getElementById('dominant-numbers');
    let dominantHTML = '';

    if (analysis.dominant.length > 0) {
        dominantHTML += '<h3 style="color: #ea580c; margin-bottom: 15px;">🔥 Dominant Numbers (Core Strengths)</h3>';
        dominantHTML += '<p style="margin-bottom: 20px; padding: 15px; background: #fef3c7; border-radius: 8px; border-left: 3px solid #f59e0b; color: #78350f; border: 1px solid #fcd34d;">Numbers appearing <strong>3 or more times</strong> indicate <strong>innate talents and natural abilities</strong> you already possess. These are your core strengths that define your personality and how you naturally approach life. However, an overabundance can also mean you need to learn balance - too much of any energy can become a weakness.</p>';
        analysis.dominant.forEach(item => {
            const numData = numbersData[item.number] || {};
            dominantHTML += `
                <div class="advanced-item" style="border-left: 4px solid #f59e0b;">
                    <h3>Number ${item.number} <span style="color: #f59e0b;">(appears ${item.count} times)</span></h3>
                    <p style="margin-bottom: 10px; color: #fbbf24; font-weight: 600;">⚡ This number dominates your chart - its influence is exceptionally strong in your life.</p>
                    ${numData.Overall ? `<p style="margin-top: 10px;">${numData.Overall}</p>` : ''}
                    ${numData.Planet ? `<p style="margin-top: 10px;"><strong>Ruling Planet:</strong> ${numData.Planet}</p>` : ''}
                </div>
            `;
        });
    }

    if (analysis.strong.length > 0) {
        dominantHTML += '<h3 style="color: #6b46c1; margin: 25px 0 15px 0;">💪 Strong Numbers (Significant Influence)</h3>';
        dominantHTML += '<p style="margin-bottom: 20px; padding: 15px; background: #e0e7ff; border-radius: 8px; border-left: 3px solid #6b46c1; color: #3730a3; border: 1px solid #c7d2fe;">Numbers appearing <strong>twice</strong> indicate <strong>developed abilities and familiar energies</strong> that you possess and express regularly. These traits come naturally to you and shape your personality and life experiences. You\'re comfortable working with these energies.</p>';
        analysis.strong.forEach(item => {
            const numData = numbersData[item.number] || {};
            dominantHTML += `
                <div class="advanced-item" style="border-left: 4px solid #60a5fa;">
                    <h3>Number ${item.number} <span style="color: #60a5fa;">(appears ${item.count} times)</span></h3>
                    ${numData.Overall ? `<p style="margin-top: 10px;">${numData.Overall}</p>` : '<p style="margin-top: 10px;">This number has a strong influence on your personality and life direction.</p>'}
                    ${numData.Planet ? `<p style="margin-top: 10px;"><strong>Ruling Planet:</strong> ${numData.Planet}</p>` : ''}
                </div>
            `;
        });
    }

    dominantDiv.innerHTML = dominantHTML || '<p style="text-align: center; color: #64748b; padding: 20px; background: #f1f5f9; border-radius: 8px;">Your numbers are well-balanced with no dominant patterns.</p>';

    // Missing numbers section with specific lessons
    const missingNumberLessons = {
        1: {
            quality: 'Independence & Leadership',
            lesson: 'You may need to develop self-confidence, assertiveness, and the courage to stand alone. Learn to take initiative and trust your own judgment without seeking constant approval from others.',
            challenge: 'Becoming more self-reliant and learning to lead rather than always follow.'
        },
        2: {
            quality: 'Cooperation & Diplomacy',
            lesson: 'You may need to develop patience, sensitivity to others, and the ability to work in partnership. Learn to be more cooperative, tactful, and considerate of different viewpoints.',
            challenge: 'Building harmonious relationships and learning the art of compromise and mediation.'
        },
        3: {
            quality: 'Creative Expression & Joy',
            lesson: 'You may need to develop your creative abilities, self-expression, and social skills. Learn to communicate your ideas more openly, embrace your artistic side, and find joy in life.',
            challenge: 'Expressing yourself creatively, developing optimism, and connecting with others through communication.'
        },
        4: {
            quality: 'Structure & Discipline',
            lesson: 'You may need to develop organization, discipline, and practical skills. Learn to build solid foundations, follow through on commitments, and pay attention to details.',
            challenge: 'Creating order in your life, developing work ethic, and building lasting structures.'
        },
        5: {
            quality: 'Freedom & Adaptability',
            lesson: 'You may need to develop flexibility, embrace change, and explore new experiences. Learn to be more adventurous, adaptable, and open to life\'s variety.',
            challenge: 'Breaking free from rigid patterns, embracing change, and finding balance between freedom and responsibility.'
        },
        6: {
            quality: 'Responsibility & Nurturing',
            lesson: 'You may need to develop a sense of responsibility toward family and community. Learn to be more nurturing, supportive, and caring for others\' needs.',
            challenge: 'Taking on domestic responsibilities, creating harmony in relationships, and learning to serve others.'
        },
        7: {
            quality: 'Inner Wisdom & Analysis',
            lesson: 'You may need to develop introspection, analytical thinking, and spiritual awareness. Learn to trust your intuition, seek deeper understanding, and value solitude for reflection.',
            challenge: 'Developing your inner life, seeking truth and wisdom, and learning to analyze before acting.'
        },
        8: {
            quality: 'Material Success & Power',
            lesson: 'You may need to develop business acumen, ambition, and the ability to manage material resources. Learn to be more confident in pursuing success and wielding authority responsibly.',
            challenge: 'Understanding material world dynamics, developing executive abilities, and balancing power with ethics.'
        },
        9: {
            quality: 'Compassion & Universal Love',
            lesson: 'You may need to develop compassion, humanitarian values, and the ability to let go. Learn to be more tolerant, forgiving, and concerned with the greater good of humanity.',
            challenge: 'Developing selflessness, completing cycles gracefully, and serving humanity with wisdom and compassion.'
        }
    };

    const missingDiv = document.getElementById('missing-numbers');
    if (analysis.missing.length > 0) {
        let missingHTML = '<h3 style="color: #64748b; margin-bottom: 15px;">🎯 Missing Numbers (Areas for Growth)</h3>';
        missingHTML += '<div style="background: #f8fafc; padding: 20px; border-radius: 10px; border: 1px solid #cbd5e1;">';
        missingHTML += `<p style="margin-bottom: 15px; color: #475569;">The following numbers are absent from your core chart: <strong style="color: #6b46c1;">${analysis.missing.join(', ')}</strong></p>`;
        missingHTML += '<div style="padding: 15px; background: #fef3c7; border-radius: 8px; border-left: 3px solid #f59e0b; margin-bottom: 20px; border: 1px solid #fcd34d;">';
        missingHTML += '<p style="margin: 0; color: #78350f;"><strong>What Missing Numbers Mean:</strong> These are qualities you <strong>do NOT naturally possess</strong> at birth. Instead, you\'ll <strong>experience life lessons</strong> that teach you these traits. Life will present situations that require you to develop these abilities. Think of them as your curriculum in the "school of life" - areas where you\'ll grow through challenges and experiences rather than natural talent.</p>';
        missingHTML += '</div>';

        missingHTML += '<div style="margin-top: 20px; display: grid; gap: 15px;">';
        analysis.missing.forEach(num => {
            const lesson = missingNumberLessons[num];
            if (lesson) {
                missingHTML += `
                    <div style="padding: 18px; background: #ffffff; border-radius: 8px; border-left: 4px solid #64748b; border: 1px solid #cbd5e1; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                        <div style="display: flex; align-items: center; margin-bottom: 12px;">
                            <div style="background: #e0e7ff; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 1.2rem; color: #6b46c1; margin-right: 12px;">
                                ${num}
                            </div>
                            <strong style="color: #1e293b; font-size: 1.1rem;">${lesson.quality}</strong>
                        </div>
                        <p style="margin: 10px 0; color: #475569; font-size: 0.95rem;"><strong style="color: #6b46c1;">Life Lesson:</strong> ${lesson.lesson}</p>
                        <p style="margin: 10px 0 0 0; color: #475569; font-size: 0.95rem;"><strong style="color: #ea580c;">Growth Challenge:</strong> ${lesson.challenge}</p>
                    </div>
                `;
            }
        });
        missingHTML += '</div></div>';
        missingDiv.innerHTML = missingHTML;
    } else {
        missingDiv.innerHTML = '<div style="background: #f0fdf4; padding: 20px; border-radius: 10px; text-align: center; border: 1px solid #bbf7d0;"><p style="color: #15803d; font-weight: bold;">✅ Complete Chart - All numbers 1-9 are present in your numerology profile!</p><p style="margin-top: 10px; color: #166534;">You have a well-rounded energy profile with access to all numerological vibrations.</p></div>';
    }

    // Conflicting numbers section
    const conflictingDiv = document.getElementById('conflicting-numbers');
    if (analysis.conflicts && analysis.conflicts.length > 0) {
        let conflictHTML = '<h3 style="color: #dc2626; margin-bottom: 15px;">⚠️ Conflicting Numbers & Remedies</h3>';
        conflictHTML += '<div style="background: #fef2f2; padding: 20px; border-radius: 10px; border: 1px solid #fecaca;">';
        conflictHTML += '<p style="margin-bottom: 15px; color: #7f1d1d;"><strong>Numbers in conflict:</strong> Your chart contains numbers that may create internal tensions or challenges. These conflicts aren\'t necessarily negative - they can drive growth and create dynamic energy. Below are remedies to harmonize these energies.</p>';

        conflictHTML += '<div style="margin-top: 20px; display: grid; gap: 15px;">';
        analysis.conflicts.forEach(conflict => {
            const occurrenceCount = conflict.occurrences.length;
            const occurrenceText = occurrenceCount > 1 ? `${occurrenceCount} times` : 'once';

            // Build list of all positions where this conflict occurs
            const positionsList = conflict.occurrences.map(occ => {
                return `<strong>${occ.positions[0]}</strong> (${occ.values[0]}) ⚡ <strong>${occ.positions[1]}</strong> (${occ.values[1]})`;
            }).join('<br>');

            conflictHTML += `
                <div style="padding: 18px; background: #ffffff; border-radius: 8px; border-left: 4px solid #dc2626; border: 1px solid #fecaca; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                    <div style="display: flex; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 10px;">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <div style="background: #fee2e2; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 1.2rem; color: #dc2626;">
                                ${conflict.num1}
                            </div>
                            <span style="color: #991b1b; font-weight: bold;">⚡</span>
                            <div style="background: #fee2e2; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 1.2rem; color: #dc2626;">
                                ${conflict.num2}
                            </div>
                        </div>
                        <div style="background: #fee2e2; padding: 6px 12px; border-radius: 20px; color: #991b1b; font-size: 0.85rem; font-weight: 600;">
                            Occurs ${occurrenceText}
                        </div>
                    </div>
                    <div style="margin: 12px 0; padding: 12px; background: #fef2f2; border-radius: 6px; border-left: 3px solid #fca5a5;">
                        <p style="margin: 0 0 8px 0; color: #7f1d1d; font-size: 0.85rem; font-weight: 600;">Conflict Positions:</p>
                        <div style="color: #991b1b; font-size: 0.9rem; line-height: 1.8;">
                            ${positionsList}
                        </div>
                    </div>
                    <p style="margin: 10px 0; color: #991b1b; font-size: 0.9rem; font-style: italic;">${conflict.reason}</p>
                    <div style="margin-top: 15px; padding: 15px; background: #ecfdf5; border-radius: 6px; border-left: 3px solid #10b981;">
                        <p style="margin: 0; color: #065f46;"><strong style="color: #047857;">🌿 Remedy:</strong> ${conflict.remedy}</p>
                    </div>
                </div>
            `;
        });
        conflictHTML += '</div></div>';
        conflictingDiv.innerHTML = conflictHTML;
    } else {
        conflictingDiv.innerHTML = '<div style="background: #f0fdf4; padding: 20px; border-radius: 10px; text-align: center; border: 1px solid #bbf7d0; margin-top: 20px;"><p style="color: #15803d; font-weight: bold;">✅ No Conflicting Numbers</p><p style="margin-top: 10px; color: #166534;">Your numbers are harmoniously aligned with no significant planetary conflicts.</p></div>';
    }
}

// Lo Shu Grid (Talisman) Functions
function calculateLoShuGrid(dateStr) {
    // The base Lo Shu grid positions (never changes)
    const baseGrid = [
        [4, 9, 2],
        [3, 5, 7],
        [8, 1, 6]
    ];

    // Extract all digits from the birthdate (DD/MM/YYYY format)
    const parts = dateStr.split('/');
    const day = parseInt(parts[0]);
    const month = parseInt(parts[1]);
    const year = parseInt(parts[2]);

    // Combine date parts into a string of digits
    const dateString = `${day.toString().padStart(2, '0')}${month.toString().padStart(2, '0')}${year}`;

    // Count frequency of each digit (1-9, ignore 0)
    const frequency = {};
    for (let i = 1; i <= 9; i++) {
        frequency[i] = 0;
    }

    for (const char of dateString) {
        const digit = parseInt(char);
        if (digit >= 1 && digit <= 9) {
            frequency[digit]++;
        }
    }

    // Identify missing and repeated numbers
    const missing = [];
    const repeated = [];
    const present = [];

    for (let i = 1; i <= 9; i++) {
        if (frequency[i] === 0) {
            missing.push(i);
        } else if (frequency[i] > 1) {
            repeated.push({ number: i, count: frequency[i] });
        } else {
            present.push(i);
        }
    }

    return {
        baseGrid,
        frequency,
        missing,
        repeated,
        present,
        dateString,
        day,
        month,
        year,
        type: 'birthdate'
    };
}

// Calculate Lo Shu Grid from name
function calculateLoShuGridFromName(name) {
    const baseGrid = [
        [4, 9, 2],
        [3, 5, 7],
        [8, 1, 6]
    ];

    // Convert name to numbers
    const letters = lettersOnly(name);
    const nameNumbers = [];
    for (const ch of letters) {
        const val = LETTER_VALUES[ch] || 0;
        if (val >= 1 && val <= 9) {
            nameNumbers.push(val);
        }
    }

    // Count frequency of each digit (1-9)
    const frequency = {};
    for (let i = 1; i <= 9; i++) {
        frequency[i] = 0;
    }

    for (const num of nameNumbers) {
        frequency[num]++;
    }

    // Identify missing and repeated numbers
    const missing = [];
    const repeated = [];
    const present = [];

    for (let i = 1; i <= 9; i++) {
        if (frequency[i] === 0) {
            missing.push(i);
        } else if (frequency[i] > 1) {
            repeated.push({ number: i, count: frequency[i] });
        } else {
            present.push(i);
        }
    }

    return {
        baseGrid,
        frequency,
        missing,
        repeated,
        present,
        nameString: nameNumbers.join(''),
        nameNumbers,
        type: 'name'
    };
}

// Calculate Combined Lo Shu Grid (Birth Date + Name)
function calculateLoShuGridCombined(dateStr, name) {
    const baseGrid = [
        [4, 9, 2],
        [3, 5, 7],
        [8, 1, 6]
    ];

    // Get birth date digits (DD/MM/YYYY format)
    const parts = dateStr.split('/');
    const day = parseInt(parts[0]);
    const month = parseInt(parts[1]);
    const year = parseInt(parts[2]);
    const dateString = `${day.toString().padStart(2, '0')}${month.toString().padStart(2, '0')}${year}`;

    // Get name numbers
    const letters = lettersOnly(name);
    const nameNumbers = [];
    for (const ch of letters) {
        const val = LETTER_VALUES[ch] || 0;
        if (val >= 1 && val <= 9) {
            nameNumbers.push(val);
        }
    }

    // Combine date and name digits
    const combinedString = dateString + nameNumbers.join('');

    // Count frequency of each digit (1-9, ignore 0)
    const frequency = {};
    for (let i = 1; i <= 9; i++) {
        frequency[i] = 0;
    }

    for (const char of combinedString) {
        const digit = parseInt(char);
        if (digit >= 1 && digit <= 9) {
            frequency[digit]++;
        }
    }

    // Identify missing and repeated numbers
    const missing = [];
    const repeated = [];
    const present = [];

    for (let i = 1; i <= 9; i++) {
        if (frequency[i] === 0) {
            missing.push(i);
        } else if (frequency[i] > 1) {
            repeated.push({ number: i, count: frequency[i] });
        } else {
            present.push(i);
        }
    }

    return {
        baseGrid,
        frequency,
        missing,
        repeated,
        present,
        combinedString,
        dateString,
        nameNumbers,
        type: 'combined'
    };
}

// Detect planes and arrows in Lo Shu grid using reference data
function detectPlanesAndArrows(frequency) {
    const arrows = [];

    if (!loShuReferenceData.arrows) {
        console.warn('Lo Shu reference data not loaded');
        return arrows;
    }

    // Check each arrow from reference data
    const arrowDefinitions = {
        '2-5-8': { numbers: [2, 5, 8], type: 'strength' },
        '4-5-6': { numbers: [4, 5, 6], type: 'strength' },
        '3-5-7': { numbers: [3, 5, 7], type: 'strength' },
        '4-9-2': { numbers: [4, 9, 2], type: 'strength' },
        '8-1-6': { numbers: [8, 1, 6], type: 'strength' },
        '4-3-8': { numbers: [4, 3, 8], type: 'strength' },
        '9-5-1': { numbers: [9, 5, 1], type: 'strength' },
        '2-7-6': { numbers: [2, 7, 6], type: 'strength' }
    };

    // Check each arrow
    Object.keys(arrowDefinitions).forEach(key => {
        const arrow = arrowDefinitions[key];
        const refData = loShuReferenceData.arrows[key];

        if (!refData) return;

        const hasAll = arrow.numbers.every(num => frequency[num] > 0);
        const hasNone = arrow.numbers.every(num => frequency[num] === 0);

        if (hasAll) {
            // Arrow of strength present
            arrows.push({
                name: `Arrow of ${refData.strength}`,
                numbers: arrow.numbers,
                strength: refData.strength,
                weakness: refData.weakness,
                isActive: true,
                isWeakness: false,
                key: key
            });
        } else if (hasNone) {
            // Arrow of weakness (all numbers missing)
            arrows.push({
                name: `Arrow of ${refData.weakness}`,
                numbers: arrow.numbers,
                strength: refData.strength,
                weakness: refData.weakness,
                isActive: true,
                isWeakness: true,
                key: key
            });
        }
    });

    return arrows;
}

// Helper function to generate a single Lo Shu Grid HTML
function generateLoShuGridHTML(gridData, title, description) {
    let gridHTML = `<h3 style="color: #a78bfa; margin-top: 30px;">${title}</h3>`;
    gridHTML += `<p style="color: #cbd5e1; margin-bottom: 20px;">${description}</p>`;

    gridHTML += '<div class="loshu-grid-container">';
    gridHTML += '<div class="loshu-grid">';

    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            const number = gridData.baseGrid[row][col];
            const count = gridData.frequency[number];
            const hasDot = count > 0;
            const dotCount = count;

            gridHTML += `<div class="loshu-cell ${hasDot ? 'has-number' : 'missing-number'}">`;
            gridHTML += `<div class="loshu-cell-number">${number}</div>`;

            if (hasDot) {
                gridHTML += '<div class="loshu-dots">';
                for (let i = 0; i < dotCount; i++) {
                    gridHTML += '<span class="loshu-dot">●</span>';
                }
                gridHTML += `</div>`;
                gridHTML += `<div class="loshu-count">${dotCount > 1 ? `(${dotCount}x)` : ''}</div>`;
            }

            gridHTML += '</div>';
        }
    }

    gridHTML += '</div></div>';

    // Add legend
    gridHTML += '<div class="loshu-legend">';
    gridHTML += '<div class="loshu-legend-item"><span class="loshu-legend-symbol has-number">●</span> Number appears</div>';
    gridHTML += '<div class="loshu-legend-item"><span class="loshu-legend-symbol missing-number">○</span> Number is missing</div>';
    gridHTML += '<div class="loshu-legend-item"><strong>Multiple dots</strong> = Number appears multiple times (stronger influence)</div>';
    gridHTML += '</div>';

    return gridHTML;
}

// Display all three Lo Shu Grids with reference data
function displayLoShuGrids(gridBirthdate, arrowsBirthdate, gridName, arrowsName, gridCombined, arrowsCombined) {
    const container = document.getElementById('loshu-grid-visual');
    const interpretationDiv = document.getElementById('loshu-interpretation');
    const planesDiv = document.getElementById('loshu-planes');

    // Generate all three grids
    let allGridsHTML = '';

    // 1. Birth Date Grid
    allGridsHTML += generateLoShuGridHTML(
        gridBirthdate,
        '🎂 Lo Shu Grid: Birth Date',
        `Based on your birth date: ${gridBirthdate.day.toString().padStart(2, '0')}-${gridBirthdate.month.toString().padStart(2, '0')}-${gridBirthdate.year}`
    );

    // 2. Name Grid
    allGridsHTML += '<div style="margin-top: 40px;"></div>';
    allGridsHTML += generateLoShuGridHTML(
        gridName,
        '📝 Lo Shu Grid: Name',
        `Based on the numerological values of your name letters`
    );

    // 3. Combined Grid
    allGridsHTML += '<div style="margin-top: 40px;"></div>';
    allGridsHTML += generateLoShuGridHTML(
        gridCombined,
        '🌟 Lo Shu Grid: Combined (Birth Date + Name)',
        'Your complete numerological blueprint combining birth date and name energies'
    );

    container.innerHTML = allGridsHTML;

    // Display interpretation with detailed number meanings from reference data
    let interpretationHTML = '<h3 style="color: #a78bfa; margin-top: 30px;">📊 Comprehensive Number Analysis</h3>';
    interpretationHTML += '<p style="color: #cbd5e1; margin-bottom: 20px;">Analysis based on your combined Lo Shu Grid (Birth Date + Name)</p>';

    // Display detailed interpretations for each number using lo_shu_reference.json
    if (loShuReferenceData.numbers) {
        for (let i = 1; i <= 9; i++) {
            const count = gridCombined.frequency[i];
            const numRef = loShuReferenceData.numbers[i.toString()];

            if (!numRef) continue;

            if (count > 0) {
                // Number is present
                let interpretation = '';
                if (count === 1) {
                    interpretation = numRef.present['1'] || 'Balanced presence';
                } else if (count === 2) {
                    interpretation = numRef.present['2'] || 'Strong presence';
                } else if (count === 3) {
                    interpretation = numRef.present['3'] || 'Very strong presence';
                } else if (count === 4) {
                    interpretation = numRef.present['4'] || numRef.present['4+'] || 'Overwhelming presence';
                } else {
                    interpretation = numRef.present['5+'] || numRef.present['4+'] || 'Extremely strong presence';
                }

                interpretationHTML += `
                    <div style="background: #1a3a1a; padding: 15px; border-radius: 8px; border-left: 3px solid #10b981; margin-bottom: 12px; color: #e8f5e9;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                            <div style="background: #10b981; width: 35px; height: 35px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; color: white;">
                                ${i}
                            </div>
                            <div>
                                <strong style="color: #6ee7b7; font-size: 1.1rem;">${numRef.title}</strong>
                                <div style="color: #86efac; font-size: 0.85rem;">Present ${count} time${count > 1 ? 's' : ''}</div>
                            </div>
                        </div>
                        <p style="color: #d1fae5; margin: 8px 0 0 0; font-size: 0.95rem;">${interpretation}</p>
                    </div>
                `;
            } else {
                // Number is missing
                interpretationHTML += `
                    <div style="background: #3a1a1a; padding: 15px; border-radius: 8px; border-left: 3px solid #ef4444; margin-bottom: 12px; color: #fecaca;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                            <div style="background: #7f1d1d; width: 35px; height: 35px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #fca5a5; border: 2px dashed #ef4444;">
                                ${i}
                            </div>
                            <div>
                                <strong style="color: #fca5a5; font-size: 1.1rem;">${numRef.title}</strong>
                                <div style="color: #fecaca; font-size: 0.85rem;">Missing - Life Lesson</div>
                            </div>
                        </div>
                        <p style="color: #fecaca; margin: 8px 0 0 0; font-size: 0.95rem;">⚠️ ${numRef.missing}</p>
                    </div>
                `;
            }
        }
    }

    interpretationDiv.innerHTML = interpretationHTML;

    // Display arrows using reference data
    if (arrowsCombined.length > 0) {
        let arrowsHTML = '<h3 style="margin-top: 30px; color: #a78bfa;">⚡ Active Arrows in Your Combined Grid</h3>';
        arrowsHTML += '<p style="color: #cbd5e1; margin-bottom: 20px;">Arrows are formed when three specific numbers align (or are all missing) in your combined numerological profile. They reveal special patterns in your personality.</p>';

        const strengths = arrowsCombined.filter(a => !a.isWeakness);
        const weaknesses = arrowsCombined.filter(a => a.isWeakness);

        if (strengths.length > 0) {
            arrowsHTML += '<div style="margin-bottom: 25px;">';
            arrowsHTML += '<h4 style="color: #10b981; font-size: 1.2rem;">✨ Arrows of Strength (Present)</h4>';
            arrowsHTML += '<p style="color: #a7f3d0; margin-bottom: 15px; font-size: 0.9rem;">These arrows are active because all their numbers appear in your birth date.</p>';
            strengths.forEach(arrow => {
                arrowsHTML += `
                    <div class="advanced-item" style="border-left: 4px solid #10b981; background: #0f2f1f;">
                        <h3 style="color: #6ee7b7;">${arrow.name}</h3>
                        <p style="color: #d1fae5;"><strong>Numbers:</strong> ${arrow.numbers.join(' - ')}</p>
                        <div style="margin-top: 15px; padding: 15px; background: #1a3a1a; border-radius: 6px; border: 1px solid #10b981;">
                            <p style="margin: 0; color: #6ee7b7; font-size: 0.95rem;"><strong>✓ Your Strength:</strong> ${arrow.strength}</p>
                        </div>
                        <div style="margin-top: 10px; padding: 15px; background: #3a2a1a; border-radius: 6px; border: 1px solid #fbbf24;">
                            <p style="margin: 0; color: #fcd34d; font-size: 0.95rem;"><strong>⚠ Watch Out For:</strong> ${arrow.weakness}</p>
                        </div>
                    </div>
                `;
            });
            arrowsHTML += '</div>';
        }

        if (weaknesses.length > 0) {
            arrowsHTML += '<div>';
            arrowsHTML += '<h4 style="color: #ef4444; font-size: 1.2rem;">🎯 Arrows of Challenge (Missing)</h4>';
            arrowsHTML += '<p style="color: #fecaca; margin-bottom: 15px; font-size: 0.9rem;">These arrows appear when ALL their numbers are missing from your birth date. They represent areas for growth and development.</p>';
            weaknesses.forEach(arrow => {
                arrowsHTML += `
                    <div class="advanced-item" style="border-left: 4px solid #ef4444; background: #2f0f0f;">
                        <h3 style="color: #fca5a5;">${arrow.name}</h3>
                        <p style="color: #fecaca;"><strong>Missing Numbers:</strong> ${arrow.numbers.join(' - ')}</p>
                        <div style="margin-top: 15px; padding: 15px; background: #3a1a1a; border-radius: 6px; border: 1px solid #ef4444;">
                            <p style="margin: 0; color: #fca5a5; font-size: 0.95rem;"><strong>⚠ Challenge:</strong> You may experience ${arrow.weakness.toLowerCase()}</p>
                        </div>
                        <div style="margin-top: 10px; padding: 15px; background: #1a3a2a; border-radius: 6px; border: 1px solid #10b981;">
                            <p style="margin: 0; color: #6ee7b7; font-size: 0.95rem;"><strong>💪 Growth Path:</strong> Develop ${arrow.strength.toLowerCase()}</p>
                        </div>
                    </div>
                `;
            });
            arrowsHTML += '</div>';
        }

        planesDiv.innerHTML = arrowsHTML;
    } else {
        planesDiv.innerHTML = '<div style="text-align: center; padding: 30px; background: #1a2332; border-radius: 10px; border: 1px solid #334155;"><p style="color: #94a3b8; font-size: 1.1rem;">No complete arrows detected in your grid.</p><p style="color: #64748b; font-size: 0.9rem; margin-top: 10px;">This means your numbers are distributed without forming the specific arrow patterns.</p></div>';
    }
}

// UI Functions
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            if (!targetTab) return;

            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

function formatText(text) {
    if (!text) return '';
    // Convert newlines to paragraphs
    return text.split(/\r\n|\r|\n/)
        .filter(p => p.trim())
        .map(p => `<p>${p.trim()}</p>`)
        .join('');
}

function displayResults(data) {
    // Show results section
    document.getElementById('results').classList.remove('hidden');

    // Display summary - show master numbers with their reduced form
    const masterNumbers = [11, 22, 33];
    const formatNumber = (num) => {
        if (masterNumbers.includes(num)) {
            const reduced = num.toString().split('').reduce((sum, d) => sum + parseInt(d), 0);
            return `${num}/${reduced}`;
        }
        return num;
    };

    // Helper function to get number data with fallback to reduced form for master numbers
    const getNumberData = (num) => {
        if (numbersData[num]) {
            return numbersData[num];
        }
        // If master number data not found, fall back to reduced form
        if (masterNumbers.includes(num)) {
            const reduced = num.toString().split('').reduce((sum, d) => sum + parseInt(d), 0);
            return numbersData[reduced] || {};
        }
        return {};
    };

    document.getElementById('result-name').textContent = data.name;
    document.getElementById('result-dob').textContent = `Born: ${data.birthdate}`;
    document.getElementById('life-path-num').textContent = formatNumber(data.lifePath);
    document.getElementById('expression-num').textContent = formatNumber(data.expression);
    document.getElementById('heart-desire-num').textContent = formatNumber(data.heartDesire);
    document.getElementById('personality-num').textContent = formatNumber(data.personality);
    document.getElementById('birthday-num').textContent = data.birthday;
    document.getElementById('maturity-num').textContent = formatNumber(data.maturity);

    // Get interpretations from data with fallback to reduced numbers
    const lifePathData = getNumberData(data.lifePath);
    const expressionData = getNumberData(data.expression);
    const heartDesireData = getNumberData(data.heartDesire);
    const personalityData = getNumberData(data.personality);
    const birthdayInfo = birthdayData[data.birthday] || {};
    const maturityData = getNumberData(data.maturity);

    // Destiny (Expression) Tab
    document.getElementById('destiny-content').innerHTML = formatText(expressionData.Destiny || 'No interpretation available.');

    // Life Path Tab
    document.getElementById('lifepath-content').innerHTML = formatText(lifePathData.LifePath || 'No interpretation available.');

    // Birthday Tab
    document.getElementById('birthday-content').innerHTML = formatText(birthdayInfo.Traits || 'No interpretation available.');

    // Personality Tab
    document.getElementById('personality-content').innerHTML = formatText(personalityData.Personality || 'No interpretation available.');

    // Heart Desire Tab
    document.getElementById('heartdesire-content').innerHTML = formatText(heartDesireData.HeartDesire || 'No interpretation available.');

    // Advanced Tab
    document.getElementById('maturity-content').innerHTML = formatText(maturityData.Maturity || 'No interpretation available.');
    document.getElementById('rational-content').innerHTML = formatText(getNumberData(data.rationalThought).RationalThoughtNumber || 'No interpretation available.');
    document.getElementById('balance-content').innerHTML = formatText(getNumberData(data.balance).BalanceNumber || 'No interpretation available.');
    document.getElementById('hidden-content').innerHTML = formatText(getNumberData(data.hiddenPassion).HiddenPassionNumber || 'No interpretation available.');
    document.getElementById('subconscious-content').innerHTML = `<p>Your Subconscious Self number is ${data.subconscious}. ${formatText(getNumberData(data.subconscious).SubconciousSelfNumber || '')}</p>`;
    document.getElementById('challenge-content').innerHTML = formatText(getNumberData(data.challenge).Challenge || 'No interpretation available.');

    // Guidance Tab
    // Convert trait IDs to actual trait names using Reference.json
    const positiveTraits = getTraitNames(lifePathData.Positive);
    const negativeTraits = getTraitNames(lifePathData.Negative);
    document.getElementById('positive-content').innerHTML = formatText(positiveTraits);
    document.getElementById('negative-content').innerHTML = formatText(negativeTraits);
    document.getElementById('planet-content').innerHTML = `<p>${lifePathData.Planet || 'N/A'}</p>`;
    document.getElementById('finance-content').innerHTML = formatText(lifePathData.Finance || 'N/A');
    document.getElementById('vocation-content').innerHTML = formatText(lifePathData.Vocation || 'N/A');
    document.getElementById('health-content').innerHTML = formatText(lifePathData.Health || 'N/A');
    document.getElementById('luckydays-content').innerHTML = `<p>${lifePathData.LuckyDays || 'N/A'}</p>`;
    document.getElementById('luckycolors-content').innerHTML = `<p>${getColorNames(lifePathData.LuckyColors)}</p>`;
    document.getElementById('luckystones-content').innerHTML = `<p>${lifePathData.LuckyStones || 'N/A'}</p>`;
    document.getElementById('importantyears-content').innerHTML = `<p>${lifePathData.ImportantYears || 'N/A'}</p>`;
    document.getElementById('friendly-content').innerHTML = `<p>${lifePathData.FriendlyNumbers || 'N/A'}</p>`;
    document.getElementById('attraction-content').innerHTML = `<p>${lifePathData.Attraction || 'N/A'}</p>`;

    // Detect and display karmic/master numbers
    const karmicMasterDetected = detectKarmicMasterNumbers(data);
    displayKarmicMasterNumbers(karmicMasterDetected);

    // Generate and display overview analysis
    const chartAnalysis = analyzeChart(data);
    displayOverview(data, chartAnalysis);

    // Calculate and display Lo Shu Grids (Birth Date, Name, and Combined)
    const loShuGridBirthdate = calculateLoShuGrid(data.birthdate);
    const arrowsBirthdate = detectPlanesAndArrows(loShuGridBirthdate.frequency);

    const loShuGridName = calculateLoShuGridFromName(data.name);
    const arrowsName = detectPlanesAndArrows(loShuGridName.frequency);

    const loShuGridCombined = calculateLoShuGridCombined(data.birthdate, data.name);
    const arrowsCombined = detectPlanesAndArrows(loShuGridCombined.frequency);

    displayLoShuGrids(loShuGridBirthdate, arrowsBirthdate, loShuGridName, arrowsName, loShuGridCombined, arrowsCombined);

    // Generate and display comprehensive report
    displayComprehensiveReport(data, loShuGridCombined);

    // Scroll to results
    document.getElementById('results').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Display Comprehensive Report
function displayComprehensiveReport(data, loShuGrid) {
    const container = document.getElementById('comprehensive-report-content');
    if (!container) return;

    let reportHTML = '';

    // Section 1: Who You Are (Executive Summary)
    const executiveSummary = generateExecutiveSummary(data);
    reportHTML += `
        <div class="report-section" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 12px; margin-bottom: 30px;">
            <h2 style="color: white; margin-top: 0; font-size: 2rem;">👤 Who You Are</h2>
            <p style="font-size: 0.95rem; opacity: 0.95; margin-bottom: 25px;">Your Core Identity & Life Purpose</p>
            
            <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="color: #ffd700; margin-top: 0; font-size: 1.3rem;">Your Core Identity</h3>
                <p style="font-size: 1.05rem; line-height: 1.7;">${executiveSummary.coreIdentity}</p>
            </div>

            <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="color: #ffd700; margin-top: 0; font-size: 1.3rem;">What Drives You</h3>
                <p style="font-size: 1.05rem; line-height: 1.7;">Deep within, you are driven ${executiveSummary.primaryDrive}.</p>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
                <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px;">
                    <h3 style="color: #90EE90; margin-top: 0; font-size: 1.2rem;">✨ Greatest Strengths</h3>
                    <ul style="margin: 10px 0; padding-left: 20px; line-height: 1.8;">
                        ${executiveSummary.greatestStrengths.map(s => `<li>${s}</li>`).join('')}
                    </ul>
                </div>
                <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px;">
                    <h3 style="color: #FFB6C1; margin-top: 0; font-size: 1.2rem;">🎯 Growth Opportunities</h3>
                    <ul style="margin: 10px 0; padding-left: 20px; line-height: 1.8;">
                        ${executiveSummary.growthOpportunities.map(g => `<li>${g}</li>`).join('')}
                    </ul>
                </div>
            </div>
        </div>
    `;

    // Section 2: Your Personality
    const personality = generatePersonalityProfile(data);
    reportHTML += `
        <div class="report-section" style="background: #1e293b; padding: 25px; border-radius: 12px; margin-bottom: 25px; border-left: 5px solid #3b82f6;">
            <h2 style="color: #60a5fa; margin-top: 0;">🧠 Your Personality</h2>
            
            <div style="margin: 20px 0;">
                <h3 style="color: #93c5fd;">Core Nature</h3>
                <p style="color: #cbd5e1; line-height: 1.7;">${personality.coreNature}</p>
            </div>

            <div style="margin: 20px 0;">
                <h3 style="color: #93c5fd;">Emotional Nature</h3>
                <p style="color: #cbd5e1; line-height: 1.7;">${personality.emotionalNature}</p>
            </div>

            <div style="margin: 20px 0;">
                <h3 style="color: #93c5fd;">Thinking Style</h3>
                <p style="color: #cbd5e1; line-height: 1.7;">${personality.thinkingStyle}</p>
            </div>

            <div style="margin: 20px 0;">
                <h3 style="color: #93c5fd;">Decision Making</h3>
                <p style="color: #cbd5e1; line-height: 1.7;">${personality.decisionMaking}</p>
            </div>
        </div>
    `;

    // Section 3: Your Natural Talents
    const talents = generateTalentsProfile(data);
    reportHTML += `
        <div class="report-section" style="background: #1e293b; padding: 25px; border-radius: 12px; margin-bottom: 25px; border-left: 5px solid #10b981;">
            <h2 style="color: #34d399; margin-top: 0;">🌟 Your Natural Talents</h2>
            <p style="color: #94a3b8; margin-bottom: 20px;">You naturally excel at:</p>
            
            <div style="display: grid; gap: 15px;">
                ${talents.slice(0, 6).map(talent => `
                    <div style="background: rgba(16, 185, 129, 0.1); padding: 15px; border-radius: 8px; border-left: 3px solid #10b981;">
                        <h3 style="color: #6ee7b7; margin-top: 0; font-size: 1.1rem;">✓ ${talent.name}</h3>
                        <p style="color: #cbd5e1; margin: 8px 0; font-size: 0.95rem;">${talent.description}</p>
                        <p style="color: #94a3b8; margin: 8px 0; font-size: 0.9rem;"><strong style="color: #10b981;">Maximize:</strong> ${talent.maximize}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    // Section 4: Your Inner World
    const innerWorld = generateInnerWorld(data);
    reportHTML += `
        <div class="report-section" style="background: #1e293b; padding: 25px; border-radius: 12px; margin-bottom: 25px; border-left: 5px solid #8b5cf6;">
            <h2 style="color: #a78bfa; margin-top: 0;">💭 Your Inner World</h2>
            
            <div style="margin: 20px 0;">
                <h3 style="color: #c4b5fd;">What Truly Motivates You</h3>
                <p style="color: #cbd5e1; line-height: 1.7;">${innerWorld.deepestMotivation}</p>
            </div>

            <div style="margin: 20px 0;">
                <h3 style="color: #c4b5fd;">Your Purpose</h3>
                <p style="color: #cbd5e1; line-height: 1.7;">${innerWorld.purpose}</p>
            </div>
        </div>
    `;

    // Section 5: How Others See You
    const publicPersona = generatePublicPersona(data);
    reportHTML += `
        <div class="report-section" style="background: #1e293b; padding: 25px; border-radius: 12px; margin-bottom: 25px; border-left: 5px solid #f59e0b;">
            <h2 style="color: #fbbf24; margin-top: 0;">👥 How Others See You</h2>
            
            <div style="margin: 20px 0;">
                <h3 style="color: #fcd34d;">First Impression</h3>
                <p style="color: #cbd5e1; line-height: 1.7;">${publicPersona.firstImpression}</p>
            </div>

            <div style="margin: 20px 0;">
                <h3 style="color: #fcd34d;">Communication Style</h3>
                <p style="color: #cbd5e1; line-height: 1.7;">${publicPersona.communicationStyle}</p>
            </div>

            <div style="margin: 20px 0;">
                <h3 style="color: #fcd34d;">Leadership Style</h3>
                <p style="color: #cbd5e1; line-height: 1.7;">${publicPersona.leadershipStyle}</p>
            </div>
        </div>
    `;

    // Section 6: Relationships
    const relationships = generateRelationshipsProfile(data);
    reportHTML += `
        <div class="report-section" style="background: #1e293b; padding: 25px; border-radius: 12px; margin-bottom: 25px; border-left: 5px solid #ec4899;">
            <h2 style="color: #f472b6; margin-top: 0;">❤️ Relationships</h2>
            
            <div style="margin: 20px 0;">
                <h3 style="color: #fbcfe8;">Romantic Partnerships</h3>
                <p style="color: #cbd5e1; line-height: 1.7;">${relationships.romanticPartner.dynamics}</p>
                <div style="margin-top: 12px;">
                    <strong style="color: #f472b6;">Ideal Partner Qualities:</strong>
                    <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px;">
                        ${relationships.idealPartnerQualities.map(q => `
                            <span style="background: rgba(236, 72, 153, 0.2); padding: 6px 12px; border-radius: 20px; color: #fbcfe8; font-size: 0.9rem;">${q}</span>
                        `).join('')}
                    </div>
                </div>
            </div>

            <div style="margin: 20px 0;">
                <h3 style="color: #fbcfe8;">Friendships</h3>
                <p style="color: #cbd5e1; line-height: 1.7;">${relationships.friends.dynamics}</p>
            </div>

            <div style="margin: 20px 0;">
                <h3 style="color: #fbcfe8;">Professional Relationships</h3>
                <p style="color: #cbd5e1; line-height: 1.7;">${relationships.coworkers.dynamics}</p>
            </div>
        </div>
    `;

    // Section 7: Career & Professional Life
    const career = generateCareerProfile(data);
    reportHTML += `
        <div class="report-section" style="background: #1e293b; padding: 25px; border-radius: 12px; margin-bottom: 25px; border-left: 5px solid #06b6d4;">
            <h2 style="color: #22d3ee; margin-top: 0;">💼 Career & Professional Life</h2>
            
            <div style="margin: 20px 0;">
                <h3 style="color: #67e8f9;">Your Ideal Work Style</h3>
                <p style="color: #cbd5e1; line-height: 1.7;">${career.idealWorkStyle}</p>
            </div>

            <div style="margin: 20px 0;">
                <h3 style="color: #67e8f9;">Money Motivation</h3>
                <p style="color: #cbd5e1; line-height: 1.7;">${career.moneyMotivation}</p>
            </div>

            <div style="margin: 20px 0;">
                <h3 style="color: #67e8f9;">Ideal Careers</h3>
                <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px;">
                    ${career.idealCareers.map(c => `
                        <span style="background: rgba(6, 182, 212, 0.2); padding: 8px 16px; border-radius: 20px; color: #a5f3fc; font-size: 0.95rem;">${c}</span>
                    `).join('')}
                </div>
            </div>
        </div>
    `;

    // Section 8: Wealth & Financial Habits
    const wealth = generateWealthProfile(data);
    reportHTML += `
        <div class="report-section" style="background: #1e293b; padding: 25px; border-radius: 12px; margin-bottom: 25px; border-left: 5px solid #84cc16;">
            <h2 style="color: #a3e635; margin-top: 0;">💰 Wealth & Financial Habits</h2>
            
            <div style="margin: 20px 0;">
                <h3 style="color: #bef264;">Money Mindset</h3>
                <p style="color: #cbd5e1; line-height: 1.7;">${wealth.moneyMindset}</p>
            </div>

            <div style="margin: 20px 0;">
                <h3 style="color: #bef264;">Saving Habits</h3>
                <p style="color: #cbd5e1; line-height: 1.7;">${wealth.savingHabits}</p>
            </div>

            <div style="margin: 20px 0;">
                <h3 style="color: #bef264;">Risk Tolerance</h3>
                <p style="color: #cbd5e1; line-height: 1.7;">${wealth.riskTolerance}</p>
            </div>

            <div style="margin: 20px 0;">
                <h3 style="color: #bef264;">Business Ability</h3>
                <p style="color: #cbd5e1; line-height: 1.7;">${wealth.businessAbility}</p>
            </div>

            <div style="margin: 20px 0; background: rgba(239, 68, 68, 0.1); padding: 15px; border-radius: 8px; border-left: 3px solid #ef4444;">
                <h3 style="color: #fca5a5; margin-top: 0;">⚠️ Financial Blind Spots</h3>
                <p style="color: #fecaca; line-height: 1.7;">${wealth.financialBlindSpots}</p>
            </div>
        </div>
    `;

    // Section 9: Health & Wellbeing
    const health = generateHealthProfile(data);
    reportHTML += `
        <div class="report-section" style="background: #1e293b; padding: 25px; border-radius: 12px; margin-bottom: 25px; border-left: 5px solid #14b8a6;">
            <h2 style="color: #2dd4bf; margin-top: 0;">🏥 Health & Wellbeing</h2>
            <p style="color: #94a3b8; font-size: 0.9rem; margin-bottom: 15px;"><em>Note: This is not medical advice. Consult healthcare professionals for health concerns.</em></p>
            
            <div style="margin: 20px 0;">
                <h3 style="color: #5eead4;">Stress Response</h3>
                <p style="color: #cbd5e1; line-height: 1.7;">${health.stressResponse}</p>
            </div>

            <div style="margin: 20px 0;">
                <h3 style="color: #5eead4;">Burnout Risk</h3>
                <p style="color: #cbd5e1; line-height: 1.7;">${health.burnoutRisk}</p>
            </div>

            <div style="margin: 20px 0;">
                <h3 style="color: #5eead4;">Lifestyle Recommendations</h3>
                <ul style="color: #cbd5e1; line-height: 1.8; margin: 10px 0; padding-left: 20px;">
                    ${health.lifestyleRecommendations.map(r => `<li>${r}</li>`).join('')}
                </ul>
            </div>
        </div>
    `;

    // Section 10: Life Lessons
    const lifeLessons = generateLifeLessons(data, loShuGrid);
    if (lifeLessons.length > 0) {
        reportHTML += `
            <div class="report-section" style="background: #1e293b; padding: 25px; border-radius: 12px; margin-bottom: 25px; border-left: 5px solid #f97316;">
                <h2 style="color: #fb923c; margin-top: 0;">📚 Life Lessons</h2>
                <p style="color: #94a3b8; margin-bottom: 20px;">Key themes and lessons that will recur throughout your life journey:</p>
                
                <div style="display: grid; gap: 15px;">
                    ${lifeLessons.map(lesson => `
                        <div style="background: rgba(249, 115, 22, 0.1); padding: 15px; border-radius: 8px; border-left: 3px solid #f97316;">
                            <p style="color: #fed7aa; line-height: 1.7; margin: 0;">${lesson}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // Section 11 & 12: Strengths and Growth Opportunities Combined
    const strengths = identifyStrengths(data);
    const growthAreas = identifyGrowthAreas(data);
    reportHTML += `
        <div class="report-section" style="background: #1e293b; padding: 25px; border-radius: 12px; margin-bottom: 25px; border-left: 5px solid #6366f1;">
            <h2 style="color: #818cf8; margin-top: 0;">⚖️ Strengths & Growth Areas</h2>
            
            <div style="margin: 20px 0;">
                <h3 style="color: #a5b4fc;">💪 Your Top Strengths</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; margin-top: 12px;">
                    ${strengths.map(s => `
                        <div style="background: rgba(99, 102, 241, 0.2); padding: 12px; border-radius: 8px; text-align: center; color: #c7d2fe; font-size: 0.95rem;">
                            ${s}
                        </div>
                    `).join('')}
                </div>
            </div>

            ${growthAreas.length > 0 ? `
                <div style="margin: 20px 0;">
                    <h3 style="color: #a5b4fc;">🎯 Growth Opportunities</h3>
                    <div style="display: grid; gap: 12px; margin-top: 12px;">
                        ${growthAreas.map(g => `
                            <div style="background: rgba(251, 191, 36, 0.1); padding: 12px; border-radius: 8px; border-left: 3px solid #fbbf24;">
                                <p style="color: #fde68a; margin: 0; line-height: 1.6;">${g}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
        </div>
    `;

    container.innerHTML = reportHTML;
}

function handleSubmit(event) {
    event.preventDefault();

    const name = document.getElementById('fullname').value.trim();
    const birthdate = document.getElementById('birthdate').value;

    if (!name || !birthdate) {
        alert('Please enter both name and birth date');
        return;
    }

    // Calculate all numbers
    const lifePath = calculateLifePath(birthdate);
    const expression = calculateExpression(name);
    const heartDesire = calculateHeartDesire(name);
    const personality = calculatePersonality(name);
    const birthday = getBirthdayNumber(birthdate);
    const maturity = calculateMaturity(lifePath, expression);
    const balance = calculateBalance(name);
    const hiddenPassion = calculateHiddenPassion(name);
    const rationalThought = calculateRationalThought(expression, birthday);
    const subconscious = calculateSubconscious(name);
    const challenge = calculateChallenge(birthdate);

    const results = {
        name,
        birthdate,
        lifePath,
        expression,
        heartDesire,
        personality,
        birthday,
        maturity,
        balance,
        hiddenPassion,
        rationalThought,
        subconscious,
        challenge
    };

    console.log('Calculation Results:', results);
    displayResults(results);
}

// Initialize app
async function init() {
    await loadData();
    initTabs();

    document.getElementById('numerology-form').addEventListener('submit', handleSubmit);

    console.log('Know Yourself 2 initialized');
}

// Start app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
