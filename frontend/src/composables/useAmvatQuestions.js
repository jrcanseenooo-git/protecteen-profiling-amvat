// src/composables/useAmvatQuestions.js
// EXACT question text from the original AMVAT app

export const LIKERT_OPTS = [
  { val: 1, label: 'Lubos na Hindi' },
  { val: 2, label: 'Hindi Sumasang-ayon' },
  { val: 3, label: 'Neutral' },
  { val: 4, label: 'Sumasang-ayon' },
  { val: 5, label: 'Lubos na Sumasang-ayon' },
]

export const QUESTION_PAGES = [
  {
    page: 2,
    domain: 'Individual Empowerment (Child\'s Rights and Laws)',
    questions: [
      {
        id: 1,
        fil: 'Kaya kong ipaliwanag ang aking mga karapatan bilang bata at adolescent mother, kabilang ang pagbabawal ng maagang pagpapakasal or child marriage/union.',
        eng: 'I am able to explain my rights as a minor and adolescent mother, including the law against child marriage or union.',
        bullets: null
      },
      {
        id: 2,
        fil: 'Hindi ko nakikita na ang pagrespeto sa mga karapatan ko at ng anak ko ay magbibigay ng kasiguraduhan para sa aming magandang kinabukasan.',
        eng: "I do not see that respecting my and my child's rights will lead to a secure and better future for us.",
        bullets: null
      },
      {
        id: 3,
        fil: 'Alam ko kung saan makakalapit para humingi ng tulong kung malalabag ang aking karapatan o ng aking anak.',
        eng: "I know where to seek help if my or my child's rights are violated.",
        bullets: null
      },
      {
        id: 4,
        fil: 'Nakikibahagi ako sa mga diskusyon at pagpupulong tungkol sa mga isyu ng mga batang ina, mula sa mga simpleng talakayan sa barangay hanggang sa pormal na forum ng lokal na pamahalaan.',
        eng: 'I am involved in discussions and gatherings regarding the challenges faced by adolescent mothers, ranging from informal talks at the barangay level to formal consultations held by the local government.',
        bullets: null
      },
    ]
  },
  {
    page: 3,
    domain: 'ASRH Education and Family Planning',
    questions: [
      {
        id: 5,
        fil: 'Nakakakuha ako ng impormasyon tungkol sa kalusugan ng mga kabataan at pagpaplano ng pamilya mula sa gobyerno at iba pang ahensya.',
        eng: 'I am getting information about adolescent sexual and reproductive health and/or family planning from the government and other agencies.',
        bullets: null
      },
      {
        id: 6,
        fil: 'Madali para sa akin ang makakuha ng mga libreng serbisyo at produkto sa pagpaplano ng pamilya, tulad ng condom, pills, injectables, at counseling para sa mga adolescent mothers.',
        eng: 'It is easy for me to get free family planning services and products, such as condoms, pills, injectables, and counseling for adolescent mothers.',
        bullets: null
      },
      {
        id: 7,
        fil: 'Kasalukuyan akong gumagamit ng isa o higit pa na family planning method.',
        eng: 'I am currently using at least one family planning method.',
        bullets: null
      },
      {
        id: 8,
        fil: 'Sapat na ang isang taong pagitan mula sa panganganak upang maging handa ako para sa susunod na pagbubuntis.',
        eng: 'A one-year interval after giving birth is sufficient for me to be ready for the next pregnancy.',
        bullets: null
      },
    ]
  },
  {
    page: 4,
    domain: 'Health (Immunization, Health Checkups, Nutrition)',
    questions: [
      {
        id: 9,
        fil: 'Kumpleto ang aking anak sa mga bakuna at check-up para sa kanyang edad ayon sa polisiya ng Department of Health (DOH). Kabilang dito ang mga sumusunod:',
        eng: 'My child is complete with all the recommended vaccinations and check-ups appropriate for their age in accordance with the Department of Health (DOH) policy. These include the following:',
        bullets: ['BCG', 'Hepatitis B', 'Pentavalent Vaccine (DPT-Hep B-HB)', 'Oral Polio Vaccine (OPV)', 'Inactivated Polio Vaccine (IPV)', 'Pneumococcal Conjugate Vaccine (PCV)', 'Measles, Mumps, Rubella (MMR)']
      },
      {
        id: 10,
        fil: 'Madali akong nakaka-access sa libreng health check-up at iba pang health services kapag kinakailangan, para sa akin at sa aking anak.',
        eng: 'I can easily access free health check-ups and other health services whenever necessary, both for myself and for my child.',
        bullets: null
      },
      {
        id: 11,
        fil: 'Hindi sapat ang aking kaalaman tungkol sa nutrisyon na dapat natatanggap ng aking anak nang naaayon sa kanyang edad.',
        eng: 'I lack sufficient knowledge about the appropriate nutrition for my child based on his/her age.',
        bullets: null
      },
      {
        id: 12,
        fil: 'Kaya kong kilalanin ang maagang palatandaan ng problema sa kalusugan sa aking sarili o anak at humingi ng tulong medikal.',
        eng: 'I am able to recognize early signs of a health problem in myself or my child and seek medical help.',
        bullets: null
      },
    ]
  },
  {
    page: 5,
    domain: 'Education and Livelihood',
    questions: [
      {
        id: 13,
        fil: 'Madali kong maabot ang mga programang sumusuporta sa edukasyon at kabuhayan na bukas para sa mga adolescent mothers.',
        eng: 'I can easily access the programs that support education and livelihood that are open to adolescent mothers.',
        bullets: null
      },
      {
        id: 14,
        fil: 'May sarili akong pinagkakakitaan o may matatag akong suportang pinansyal para sa pangangailangan ng aking anak.',
        eng: 'I have my own source of income or I have stable financial support for the needs of my child.',
        bullets: null
      },
      {
        id: 15,
        fil: 'Kasalukuyan akong naka-enroll at nakakadalo sa aking pag-aaral nang regular.',
        eng: 'I am currently enrolled and attending my classes regularly.',
        bullets: null
      },
      {
        id: 16,
        fil: 'Limitado ang aking mga kasanayan (skills) na makakatulong sa akin na makahanap ng mas magandang trabaho sa hinaharap.',
        eng: 'I have limited skills that would help me find a better job in the future.',
        bullets: null
      },
    ]
  },
  {
    page: 6,
    domain: 'Family and Community Support',
    questions: [
      {
        id: 17,
        fil: 'Wala akong natatanggap na tulong mula sa aking pamilya sa pag-aalaga ng aking anak, tulad ng pinansyal na suporta, pagbabantay, gawaing bahay, at emosyonal na gabay.',
        eng: 'I do not receive any help from my family in taking care of my child, such as financial support, childcare, household chores, or emotional guidance.',
        bullets: null
      },
      {
        id: 18,
        fil: 'Sinuportahan ng ama ng aking anak ang pagpapalaki at pagtustos sa pangangailangan ng bata.',
        eng: 'The father of my child supports the child-rearing and provides financial sustenance for the child.',
        bullets: null
      },
      {
        id: 19,
        fil: 'Nahihiya akong humingi ng tulong o magtanong tungkol sa aking kalusugan sa mga lokal na health worker.',
        eng: 'I feel embarrassed to seek help or ask questions about my health from local health workers.',
        bullets: null
      },
      {
        id: 20,
        fil: 'Hindi ko nararanasan ang panghuhusga o negatibong pagtingin mula sa aking komunidad bilang isang adolescent mother.',
        eng: 'I do not experience judgment or negative views from my community as an adolescent mother.',
        bullets: null
      },
    ]
  },
  {
    page: 7,
    domain: 'Mental Health',
    questions: [
      {
        id: 21,
        fil: 'Madalas kong nararamdaman ang takot o pag-aalala na baka hindi ko magampanan nang maayos ang aking tungkulin bilang ina.',
        eng: 'I often feel fear or excessive worry that I might not fulfill my role as a mother properly.',
        bullets: null
      },
      {
        id: 22,
        fil: 'Madalas kong nararamdaman na nahihiya ako o nag-iisa at walang makaintindi sa aking pinagdadaanan.',
        eng: 'I often feel ashamed or alone and that no one understands what I am going through.',
        bullets: null
      },
      {
        id: 23,
        fil: 'Mayroon akong sapat na oras para magpahinga at alagaan ang sarili ko.',
        eng: 'I have enough time to rest and take care of myself.',
        bullets: null
      },
      {
        id: 24,
        fil: 'May mga pagkakataon na naiisip kong sana ay naiiba ang naging takbo ng aking buhay at wala akong pag-asa sa hinaharap.',
        eng: 'There are times when I think that the course of my life could have been different and I feel hopeless about the future.',
        bullets: null
      },
      {
        id: 25,
        fil: 'Sa pangkalahatan, nararamdaman kong masaya at kalmado ako sa takbo ng buhay ko ngayon.',
        eng: 'Overall, I feel happy and calm with the direction of my life now.',
        bullets: null
      },
    ]
  },
]
