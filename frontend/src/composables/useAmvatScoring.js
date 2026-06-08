// src/composables/useAmvatScoring.js
// Scoring logic matching the original AMVAT app exactly

export function useAmvatScoring() {

  const RAW_MAP     = { '1': 0, '2': 1, '3': 2, '4': 3, '5': 4 }
  const REVERSE_MAP = { '1': 4, '2': 3, '3': 2, '4': 1, '5': 0 }

  const norm = (v) => RAW_MAP[String(v)] ?? 0
  const rev  = (v) => REVERSE_MAP[String(v)] ?? 0

  // Domain → question assignments & coding direction (true=normal, false=reverse)
  const DOMAIN_QUESTIONS = {
    empowerment:  [['q1',true], ['q2',false],['q3',true], ['q4',true]],
    pregnancy:    [['q5',true], ['q6',true], ['q7',true], ['q8',false]],
    health:       [['q9',true], ['q10',true],['q11',false],['q12',true]],
    education:    [['q13',true],['q14',true],['q15',true],['q16',false]],
    support:      [['q17',false],['q18',true],['q19',false],['q20',true]],
    mentalhealth: [['q21',false],['q22',false],['q23',true],['q24',false],['q25',true]],
  }

  function scoreDomain(domain, responses) {
    return DOMAIN_QUESTIONS[domain].reduce((sum, [q, normal]) => {
      const val = responses[q]
      return sum + (normal ? norm(val) : rev(val))
    }, 0)
  }

  function interpretDomain(score, domain) {
    const texts = {
      empowerment: {
        low:  'Limitado ang kaalaman, posibleng vulnerable sa abuse o exploitation.',
        mod:  'May kaalaman ngunit kailangan pa ng pagpapalakas.',
        high: 'Malinaw na nauunawaan at naipapakita ang empowerment at karapatan.',
      },
      pregnancy: {
        low:  'Kinakailangan ng masinsinang counseling at guidance.',
        mod:  'May kaalaman ngunit kailangan pa ng dagdag na suporta.',
        high: 'Malinaw ang kaalaman at kakayahan sa pag-iwas sa panibagong pagbubuntis.',
      },
      health: {
        low:  'Mataas ang panganib sa kalusugan, kailangan ng close monitoring.',
        mod:  'May potensyal ngunit kailangan pang palakasin.',
        high: 'Aktibo at mahusay sa paggamit ng health services at gawi para sa kalusugan.',
      },
      education: {
        low:  'Posibleng walang malinaw na plano, nangangailangan ng mentoring.',
        mod:  'Nangangailangan ng guidance at access sa opportunities.',
        high: 'May malinaw na plano at motibasyon para sa edukasyon at kabuhayan.',
      },
      support: {
        low:  'Kulang ang suporta, maaaring makaranas ng isolation.',
        mod:  'May suporta ngunit hindi laging sapat.',
        high: 'Malakas ang suporta mula sa pamilya at komunidad.',
      },
    }
    const mhTexts = {
      low:  'Mababa ang kakayahan sa pag-regulate ng emosyon, mababa ang self-esteem, o kulang ang coping skills.',
      mod:  'Katamtaman ang emotional stability, may pangangailangan pa ng psychosocial support.',
      high: 'Maayos ang pag-iisip, matatag sa emosyon, at may positibong pananaw sa sarili at sa hinaharap.',
    }

    if (domain === 'mentalhealth') {
      if (score <= 10) return mhTexts.low
      if (score <= 15) return mhTexts.mod
      return mhTexts.high
    }
    const t = texts[domain]
    if (score <= 8)  return t.low
    if (score <= 12) return t.mod
    return t.high
  }

  function calcDeductions(profile) {
    const d = {}
    d.childDisability  = profile.child_disability  === 'Oo' ? -8 : 0
    d.motherDisability = profile.mother_disability === 'Oo' ? -7 : 0

    const lp = profile.living_parents
    if      (lp === 'Both parents are deceased')                               d.livingParents = -6
    else if (lp === 'Solo parent or living with guardian only')                d.livingParents = -4
    else if (lp === 'Both parents alive but not living with them')             d.livingParents = -2
    else                                                                        d.livingParents = 0

    d.violence = profile.violence === 'Oo' ? -9 : 0

    const a = profile.age
    if      (a === '9-12 yrs old')  d.age = -5
    else if (a === '13-14 yrs old') d.age = -3.75
    else if (a === '15-17 yrs old') d.age = -2.5
    else if (a === '18-19 yrs old') d.age = -1.25
    else                             d.age = 0

    d.incomeSource    = profile.income_source    === 'Hindi' ? -3 : 0
    d.educationSkills = profile.education_skills === 'Hindi' ? -2 : 0

    const total = Object.values(d).reduce((s, v) => s + v, 0)
    return { deductions: d, totalDeduction: total }
  }

  function getOverallInterpretation(score) {
    if (score >= 68) return 'High - Strong overall capacity and support'
    if (score >= 34) return 'Moderate - Moderate capacity, some areas still need strengthening'
    return 'Low - Low overall capacity, high need for intensive intervention'
  }

  function calculate(responses, profile) {
    const domains = {}
    for (const domain of Object.keys(DOMAIN_QUESTIONS)) {
      const score = scoreDomain(domain, responses)
      domains[domain] = {
        score,
        interpretation: interpretDomain(score, domain),
      }
    }

    const subtotal = Object.values(domains).reduce((s, d) => s + d.score, 0)
    const { deductions, totalDeduction } = calcDeductions(profile)
    const totalScore = subtotal + totalDeduction

    return {
      ...domains,
      subtotal,
      deductions,
      totalDeduction,
      total: {
        score: totalScore,
        interpretation: getOverallInterpretation(totalScore),
      },
    }
  }

  return { calculate, DOMAIN_QUESTIONS }
}
