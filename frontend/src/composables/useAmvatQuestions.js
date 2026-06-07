// src/composables/useAmvatQuestions.js
// All 25 AMVAT questions separated from the Vue template to avoid apostrophe issues

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
    domain: '💪 Individual Empowerment',
    questions: [
      { id: 1, fil: 'Alam ko ang aking mga karapatan bilang isang babae at ina.', eng: 'I know my rights as a woman and mother.' },
      { id: 2, fil: 'Nahihirapan akong ipahayag ang aking mga opinyon at desisyon sa aking pamilya.', eng: 'I struggle to express my opinions and decisions in my family.' },
      { id: 3, fil: 'Naniniwala akong may kakayahan akong harapin ang mga hamon sa buhay.', eng: "I believe I have the ability to face life's challenges." },
      { id: 4, fil: 'Aktibo akong lumalahok sa mga programa at aktibidad sa aming komunidad.', eng: 'I actively participate in programs and activities in our community.' },
    ]
  },
  {
    page: 3,
    domain: '🤰 Reduced Repeated Pregnancies',
    questions: [
      { id: 5, fil: 'May kaalaman ako tungkol sa pamamaraan ng family planning na angkop para sa akin.', eng: 'I am knowledgeable about appropriate family planning methods for me.' },
      { id: 6, fil: 'Nagagamit ko ang mga serbisyong pangkalusugan para sa aking reproductive health.', eng: 'I can access health services for my reproductive health.' },
      { id: 7, fil: 'Kaya ko ang gumawa ng desisyon tungkol sa family planning nang walang pamimilit.', eng: 'I can make decisions about family planning without coercion.' },
      { id: 8, fil: 'Hindi ako sigurado sa mga paraan ng pag-iwas sa muling pagbubuntis.', eng: 'I am not sure about ways to prevent another pregnancy.' },
    ]
  },
  {
    page: 4,
    domain: '🏥 Health',
    questions: [
      { id: 9,  fil: 'Regular akong pumupunta sa health center para sa check-up ng aking anak.', eng: "I regularly visit the health center for my child's check-up." },
      { id: 10, fil: 'Natutustusan ko ang pangangailangan sa nutrisyon ng aking pamilya.', eng: 'I can meet the nutritional needs of my family.' },
      { id: 11, fil: 'Hindi sapat ang aking kaalaman tungkol sa nutrisyon na dapat natatanggap ng aking anak nang naaayon sa kanyang edad.', eng: "I lack sufficient knowledge about the appropriate nutrition for my child based on his/her age." },
      { id: 12, fil: 'Kaya kong kilalanin ang maagang palatandaan ng problema sa kalusugan sa aking sarili o anak at humingi ng tulong medikal.', eng: 'I am able to recognize early signs of a health problem in myself or my child and seek medical help.' },
    ]
  },
  {
    page: 5,
    domain: '📚 Education and Livelihood',
    questions: [
      { id: 13, fil: 'Madali kong maabot ang mga programang sumusuporta sa edukasyon at kabuhayan na bukas para sa mga adolescent mothers.', eng: 'I can easily access the programs that support education and livelihood that are open to adolescent mothers.' },
      { id: 14, fil: 'May sarili akong pinagkakakitaan o may matatag akong suportang pinansyal para sa pangangailangan ng aking anak.', eng: 'I have my own source of income or I have stable financial support for the needs of my child.' },
      { id: 15, fil: 'Kasalukuyan akong naka-enroll at nakakadalo sa aking pag-aaral nang regular.', eng: 'I am currently enrolled and attending my classes regularly.' },
      { id: 16, fil: 'Limitado ang aking mga kasanayan (skills) na makakatulong sa akin na makahanap ng mas magandang trabaho sa hinaharap.', eng: 'I have limited skills that would help me find a better job in the future.' },
    ]
  },
  {
    page: 6,
    domain: '🤝 Family and Community Support',
    questions: [
      { id: 17, fil: 'Nararamdaman ko na hindi ako sinusuportahan ng aking pamilya sa aking mga desisyon.', eng: 'I feel unsupported by my family in my decisions.' },
      { id: 18, fil: 'May malapit akong kaibigan o kapamilya na maaari kong kausapin tungkol sa aking mga problema.', eng: 'I have a close friend or family member I can talk to about my problems.' },
      { id: 19, fil: 'Nararamdaman ko na ako ay naiwan ng mag-isa sa aking mga responsibilidad bilang isang ina.', eng: 'I feel alone in my responsibilities as a mother.' },
      { id: 20, fil: 'Ang aming komunidad ay may mga programang nakakatulong sa mga adolescent mothers.', eng: 'Our community has programs that help adolescent mothers.' },
    ]
  },
  {
    page: 7,
    domain: '🧠 Mental Health',
    questions: [
      { id: 21, fil: 'Madalas akong maramdaman na stressed at overwhelmed sa aking mga responsibilidad bilang isang ina.', eng: 'I often feel stressed and overwhelmed by my responsibilities as a mother.' },
      { id: 22, fil: 'Hindi ko maisip ang positibong kinabukasan para sa aking sarili at aking anak.', eng: 'I cannot envision a positive future for myself and my child.' },
      { id: 23, fil: 'Kaya ko ang kontrolin ang aking emosyon kahit sa mahirap na sitwasyon.', eng: 'I can control my emotions even in difficult situations.' },
      { id: 24, fil: 'Madalas akong maramdaman na walang halaga ang aking sarili bilang isang ina.', eng: 'I often feel worthless as a mother.' },
      { id: 25, fil: 'Naniniwala ako na kaya kong mapabuti ang aking kalagayan at ng aking pamilya sa hinaharap.', eng: "I believe I can improve my situation and my family's future." },
    ]
  },
]
