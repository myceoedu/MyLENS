export interface School {
  id: string;
  name: string;
  stateId: string;
  state: string;
  students: string[];
  videosSubmitted: number;
  points: number;
  rank: number;
  category: "national" | "state" | "participant";
}

export const schools: School[] = [
  // Johor
  { id: "smk-taman-pelangi", name: "SMK Taman Pelangi", stateId: "johor", state: "Johor", students: ["Amirul Hakim", "Nurul Izzati", "Haziq Danial", "Sofea Nabilah"], videosSubmitted: 5, points: 940, rank: 3, category: "national" },
  { id: "smk-bandar-baru-uda", name: "SMK Bandar Baru Uda", stateId: "johor", state: "Johor", students: ["Harith Farhan", "Liyana Zahir", "Naqib Amsyar", "Hana Syazwani"], videosSubmitted: 5, points: 810, rank: 8, category: "participant" },
  { id: "smk-dato-onn", name: "SMK Dato' Onn", stateId: "johor", state: "Johor", students: ["Faris Irfan", "Aisyah Marzuki", "Luqman Hakim", "Nur Amirah"], videosSubmitted: 5, points: 780, rank: 11, category: "participant" },
  { id: "smk-sultanah-engku-tun-aminah", name: "SMK Sultanah Engku Tun Aminah", stateId: "johor", state: "Johor", students: ["Azlan Arif", "Razana Idris", "Iman Batrisyia", "Syahmi Azizi"], videosSubmitted: 5, points: 760, rank: 14, category: "participant" },
  { id: "smk-kluang", name: "SMK Kluang", stateId: "johor", state: "Johor", students: ["Hazimah Rosli", "Imran Faiz", "Nurin Zahirah", "Asyraf Hafizuddin"], videosSubmitted: 5, points: 730, rank: 18, category: "participant" },

  // Kedah
  { id: "smk-alor-setar", name: "SMK Alor Setar", stateId: "kedah", state: "Kedah", students: ["Fadzillah Rauf", "Iqmal Hafeez", "Nurulain Syafiqah", "Harish Deva"], videosSubmitted: 5, points: 860, rank: 6, category: "state" },
  { id: "smk-langkawi", name: "SMK Langkawi", stateId: "kedah", state: "Kedah", students: ["Izham Firdaus", "Nur Ilyani", "Amsyar Zikri", "Adibah Husna"], videosSubmitted: 5, points: 820, rank: 7, category: "participant" },
  { id: "smk-kulim", name: "SMK Kulim", stateId: "kedah", state: "Kedah", students: ["Aryanna Hawa", "Zarif Izzuddin", "Nadia Syakirah", "Khairul Anwar"], videosSubmitted: 5, points: 770, rank: 12, category: "participant" },
  { id: "smk-sungai-petani", name: "SMK Sungai Petani", stateId: "kedah", state: "Kedah", students: ["Haiqal Adib", "Safiyyah Iman", "Daniyal Lutfi", "Irdina Athirah"], videosSubmitted: 4, points: 680, rank: 22, category: "participant" },
  { id: "smk-baling", name: "SMK Baling", stateId: "kedah", state: "Kedah", students: ["Nadhirah Razak", "Zulfadhli Haikal", "Aqilah Maisarah", "Izz Haziq"], videosSubmitted: 4, points: 640, rank: 26, category: "participant" },

  // Kelantan
  { id: "smk-kota-bharu", name: "SMK Kota Bharu", stateId: "kelantan", state: "Kelantan", students: ["Aminuddin Razi", "Qistina Radhwa", "Firdaus Ramli", "Nabilah Zulaikha"], videosSubmitted: 5, points: 800, rank: 9, category: "participant" },
  { id: "smk-pasir-mas", name: "SMK Pasir Mas", stateId: "kelantan", state: "Kelantan", students: ["Ainnur Husna", "Ridhwan Haziq", "Siti Farhana", "Luqmanul Hakim"], videosSubmitted: 5, points: 755, rank: 15, category: "participant" },
  { id: "smk-tanah-merah", name: "SMK Tanah Merah", stateId: "kelantan", state: "Kelantan", students: ["Hazwan Zaidi", "Nur Irdina", "Akmal Hakimi", "Syazreen Nadhirah"], videosSubmitted: 5, points: 720, rank: 19, category: "participant" },
  { id: "smk-gua-musang", name: "SMK Gua Musang", stateId: "kelantan", state: "Kelantan", students: ["Husaini Nasri", "Mardiah Ilyana", "Zikri Hafeez", "Faridah Athirah"], videosSubmitted: 4, points: 650, rank: 25, category: "participant" },
  { id: "smk-bachok", name: "SMK Bachok", stateId: "kelantan", state: "Kelantan", students: ["Aisyah Nazirah", "Farhan Zulkifli", "Naila Syafiqah", "Haziq Irfan"], videosSubmitted: 4, points: 620, rank: 28, category: "participant" },

  // Melaka
  { id: "smk-dato-jaapar", name: "SMK Dato' Jaapar", stateId: "melaka", state: "Melaka", students: ["Najwa Husna", "Iszam Farhan", "Suhailah Huda", "Afiq Danial"], videosSubmitted: 5, points: 890, rank: 5, category: "state" },
  { id: "smk-sultan-alauddin", name: "SMK Sultan Alauddin", stateId: "melaka", state: "Melaka", students: ["Aidil Adha", "Nur Izzahtul", "Syafiq Ridhwan", "Humairah Izzati"], videosSubmitted: 5, points: 830, rank: 6, category: "participant" },
  { id: "smk-bukit-beruang", name: "SMK Bukit Beruang", stateId: "melaka", state: "Melaka", students: ["Raihan Arif", "Safiah Kamilah", "Azrif Hakimie", "Anis Syahmina"], videosSubmitted: 5, points: 790, rank: 10, category: "participant" },
  { id: "smk-masjid-tanah", name: "SMK Masjid Tanah", stateId: "melaka", state: "Melaka", students: ["Afrina Husna", "Naqiyuddin Zaid", "Nurdiyana Fadzilah", "Ridzuan Azizi"], videosSubmitted: 4, points: 700, rank: 20, category: "participant" },
  { id: "smk-merlimau", name: "SMK Merlimau", stateId: "melaka", state: "Melaka", students: ["Hafeeza Nadzirah", "Anas Izzuan", "Irdina Maisarah", "Fitri Adha"], videosSubmitted: 4, points: 660, rank: 24, category: "participant" },

  // Penang
  { id: "smk-jit-sin", name: "SMK Jit Sin", stateId: "penang", state: "Pulau Pinang", students: ["Xavier Lim", "Priya Nair", "Ahmad Syahmi", "Mei Ling Tan"], videosSubmitted: 5, points: 960, rank: 2, category: "national" },
  { id: "smk-air-itam", name: "SMK Air Itam", stateId: "penang", state: "Pulau Pinang", students: ["Nurul Batrisyia", "Javen Ng", "Kavitha Pillai", "Hafizuddin Yusri"], videosSubmitted: 5, points: 900, rank: 4, category: "state" },
  { id: "smk-tanjung-bunga", name: "SMK Tanjung Bunga", stateId: "penang", state: "Pulau Pinang", students: ["Darren Ooi", "Siti Aisyah", "Harjinder Singh", "Lina Farhana"], videosSubmitted: 5, points: 850, rank: 6, category: "participant" },
  { id: "smk-permatang-pauh", name: "SMK Permatang Pauh", stateId: "penang", state: "Pulau Pinang", students: ["Izuddin Rafiq", "Soo Wen Xin", "Nadia Suhaila", "Azri Izzat"], videosSubmitted: 5, points: 810, rank: 8, category: "participant" },
  { id: "smk-balik-pulau", name: "SMK Balik Pulau", stateId: "penang", state: "Pulau Pinang", students: ["Nurhaziqah Ramli", "Ethan Yong", "Ainan Batrisyia", "Jazlan Fikri"], videosSubmitted: 5, points: 770, rank: 12, category: "participant" },

  // Selangor
  { id: "smk-damansara-jaya", name: "SMK Damansara Jaya", stateId: "selangor", state: "Selangor", students: ["Aisha Mya", "Darren Foong", "Zafran Haiqal", "Hannah Lee"], videosSubmitted: 5, points: 980, rank: 1, category: "national" },
  { id: "smk-subang-jaya", name: "SMK Subang Jaya", stateId: "selangor", state: "Selangor", students: ["Yusrina Rauf", "Marcus Tan", "Aliyah Zara", "Raqib Hafeez"], videosSubmitted: 5, points: 870, rank: 5, category: "participant" },
  { id: "smk-shah-alam", name: "SMK Shah Alam", stateId: "selangor", state: "Selangor", students: ["Fareeha Iman", "Leonard Khoo", "Anas Haiqal", "Natalia Hisham"], videosSubmitted: 5, points: 840, rank: 7, category: "participant" },
  { id: "smk-rawang", name: "SMK Rawang", stateId: "selangor", state: "Selangor", students: ["Ilham Firdaus", "Carrie Lim", "Zahirah Izzati", "Harith Muaz"], videosSubmitted: 5, points: 800, rank: 9, category: "participant" },
  { id: "smk-klang", name: "SMK Klang", stateId: "selangor", state: "Selangor", students: ["Azrif Hakim", "Dayana Nazrin", "Justin Ong", "Izzati Najwa"], videosSubmitted: 5, points: 760, rank: 13, category: "participant" },

  // Kuala Lumpur
  { id: "smk-bukit-bintang", name: "SMK Bukit Bintang", stateId: "kualalumpur", state: "W.P. Kuala Lumpur", students: ["Faris Aqil", "Joanna Chin", "Luqman Nul Hakim", "Tanvi Sharma"], videosSubmitted: 5, points: 950, rank: 3, category: "national" },
  { id: "smk-cheras", name: "SMK Cheras", stateId: "kualalumpur", state: "W.P. Kuala Lumpur", students: ["Zara Maisarah", "Wei Zhong", "Aqil Danial", "Prathiba Raj"], videosSubmitted: 5, points: 880, rank: 5, category: "state" },
  { id: "smk-wangsa-maju", name: "SMK Wangsa Maju", stateId: "kualalumpur", state: "W.P. Kuala Lumpur", students: ["Razif Hakim", "Clara Ng", "Amirah Husna", "Rizwan Arif"], videosSubmitted: 5, points: 840, rank: 7, category: "participant" },
  { id: "smk-setapak", name: "SMK Setapak", stateId: "kualalumpur", state: "W.P. Kuala Lumpur", students: ["Danial Irfan", "Alicia Lim", "Nurul Ain", "Harif Zulkifli"], videosSubmitted: 4, points: 710, rank: 19, category: "participant" },
  { id: "smk-kepong", name: "SMK Kepong", stateId: "kualalumpur", state: "W.P. Kuala Lumpur", students: ["Naqib Izzam", "Serene Goh", "Batrisyia Iman", "Zarith Sofea"], videosSubmitted: 4, points: 680, rank: 22, category: "participant" },

  // Sabah
  { id: "smk-kota-kinabalu", name: "SMK Kota Kinabalu", stateId: "sabah", state: "Sabah", students: ["Joshua Sinajin", "Nabilah Haszami", "Aidil Faizal", "Syafiqah Hamid"], videosSubmitted: 5, points: 910, rank: 4, category: "national" },
  { id: "smk-sandakan", name: "SMK Sandakan", stateId: "sabah", state: "Sabah", students: ["Arvin Muis", "Nurjannah Haris", "Rizal Fadzmi", "Azreen Sulaiman"], videosSubmitted: 5, points: 845, rank: 6, category: "participant" },
  { id: "smk-tawau", name: "SMK Tawau", stateId: "sabah", state: "Sabah", students: ["Iszam Hakimi", "Fazila Badrul", "Syaqir Amsyar", "Nadia Rafiqah"], videosSubmitted: 5, points: 810, rank: 8, category: "participant" },
  { id: "smk-keningau", name: "SMK Keningau", stateId: "sabah", state: "Sabah", students: ["Mujahid Faruq", "Christine Andau", "Asyraf Rusli", "Zafira Aina"], videosSubmitted: 4, points: 700, rank: 20, category: "participant" },
  { id: "smk-beaufort", name: "SMK Beaufort", stateId: "sabah", state: "Sabah", students: ["Amira Rohani", "Kevin Jikim", "Nabilah Razak", "Luqmanul Fariz"], videosSubmitted: 4, points: 660, rank: 24, category: "participant" },

  // Sarawak
  { id: "smk-kuching", name: "SMK Kuching", stateId: "sarawak", state: "Sarawak", students: ["Rayner Bong", "Norzahirah Said", "Adrian Ting", "Fatimah Azhar"], videosSubmitted: 5, points: 870, rank: 5, category: "state" },
  { id: "smk-miri", name: "SMK Miri", stateId: "sarawak", state: "Sarawak", students: ["Jasmine Ngau", "Mohd Hazwan", "Liyana Hamid", "Jayden Lau"], videosSubmitted: 5, points: 825, rank: 7, category: "participant" },
  { id: "smk-sibu", name: "SMK Sibu", stateId: "sarawak", state: "Sarawak", students: ["Hanafi Azmi", "Christy Sim", "Amzar Haiqal", "Shirley Soo"], videosSubmitted: 5, points: 785, rank: 11, category: "participant" },
  { id: "smk-bintulu", name: "SMK Bintulu", stateId: "sarawak", state: "Sarawak", students: ["Nancy Lim", "Ridhwan Zain", "Joanna Jais", "Irfan Adly"], videosSubmitted: 4, points: 670, rank: 23, category: "participant" },
  { id: "smk-sri-aman", name: "SMK Sri Aman", stateId: "sarawak", state: "Sarawak", students: ["Rafiq Izham", "Elina Chang", "Haiqal Danial", "Martha Entri"], videosSubmitted: 4, points: 630, rank: 27, category: "participant" },
];
