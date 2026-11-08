/* =====================================================================
   PENGATURAN SUARA (VOICE)  —  file ini bisa kamu ubah sendiri
   ---------------------------------------------------------------------
   Cara mengganti suara dengan rekamanmu:
     1. Taruh file audio (.mp3 / .wav / .ogg) di folder  assets/audio/
     2. Tulis nama filenya di bagian  file:'...'  di bawah ini
        (contoh: file:'q13_b.mp3').
     3. Kalau file kosong ('') atau filenya tidak ditemukan, game memakai
        suara komputer/HP (bahasa Indonesia) yang membacakan  text:'...'

   Mau mengubah kalimat yang dibacakan? Ubah saja isi text:'...'.
   Mau mematikan semua suara?  ubah suaraAktif menjadi false.
   ===================================================================== */
const VOICE_SETTINGS = {
  suaraAktif: true,
  bahasa: 'id-ID',     // bahasa suara komputer
  kecepatan: 0.9       // 0.5 (lambat) ... 1.5 (cepat)
};

const VOICE = {
  /* ---- umum ---- */
  benar:   { file: 'benar.mp3',   text: 'Benar sekali!' },
  salah:   { file: 'salah.mp3',   text: 'Belum tepat, coba lagi ya!' },
  selesai: { file: 'selesai.mp3', text: 'Hebat! Semuanya benar' },
  hasil:   { file: 'hasil.mp3',   text: 'Selamat! Skormu {skor} dari {maks}' },

  /* ---- Slide 8: pasangkan nama bagian bunga ---- */
  s8_start: { file: 's8_start.mp3', text: 'Pasangkan nama bagian bunga dengan gambar yang tepat' },
  s8_ks:    { file: 's8_ks.mp3',    text: 'Kepala sari: tempat serbuk sari' },
  s8_kp:    { file: 's8_kp.mp3',    text: 'Kepala putik: menerima serbuk sari' },
  s8_mb:    { file: 's8_mb.mp3',    text: 'Mahkota bunga: menarik serangga' },
  s8_ss:    { file: 's8_ss.mp3',    text: 'Serbuk sari: sel kelamin jantan' },

  /* ---- Slide 9: bantu lebah ---- */
  s9_start: { file: 's9_start.mp3', text: 'Bantu lebah memindahkan serbuk sari' },
  s9_ambil: { file: 's9_ambil.mp3', text: 'Serbuk sari menempel di tubuh lebah' },
  s9_jatuh: { file: 's9_jatuh.mp3', text: 'Penyerbukan berhasil! Serbuk sari jatuh ke kepala putik' },

  /* ---- Slide 10: pasangkan penyerbuk ---- */
  s10_start:   { file: 's10_start.mp3',   text: 'Pasangkan gambar dengan penyerbuk yang tepat' },
  s10_air:     { file: 's10_air.mp3',     text: 'Air membantu penyerbukan pada tumbuhan air' },
  s10_hewan:   { file: 's10_hewan.mp3',   text: 'Hewan seperti lebah membantu penyerbukan' },
  s10_angin:   { file: 's10_angin.mp3',   text: 'Angin menerbangkan serbuk sari' },
  s10_manusia: { file: 's10_manusia.mp3', text: 'Manusia bisa membantu penyerbukan buatan' },

  /* ---- Kuis dan latihan ---- */
  q11:       { file: '', text: 'Pilih jawaban yang benar.' },
  q11_benar: { file: '', text: 'Benar! Jawabanmu tepat.' },
  q12:       { file: '', text: 'Pilih gambar yang benar.' },
  q12_benar: { file: '', text: 'Benar! Jawabanmu tepat.' },
  q13:       { file: '', text: 'Pilih jawaban yang benar. Tekan tombol suara untuk mendengarkan pilihan.' },
  q13_a:     { file: '', text: 'Putik' },
  q13_b:     { file: '', text: 'Benang sari' },
  q13_c:     { file: '', text: 'Mahkota bunga' },
  s14_start: { file: '', text: 'Pasangkan nama dengan bagian bunga yang tepat.' },
  s14_bs:    { file: '', text: 'Benang sari' },
  s14_pt:    { file: '', text: 'Putik' },
  s14_nk:    { file: '', text: 'Nektar' },
  s15_start: { file: '', text: 'Tarik garis dari gambar ke jawaban yang tepat.' },
  s15_silang:{ file: '', text: 'Penyerbukan silang' },
  s15_sendiri:{ file: '', text: 'Penyerbukan sendiri' }
};
