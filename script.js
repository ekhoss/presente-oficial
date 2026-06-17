/* ============================================
   VALENTINE SCRAPBOOK — script.js
   ============================================ */

/* ============================================
   ★ CONFIGURAÇÕES — EDITE AQUI ★
   ============================================ */

/*
  PLAYLIST DE MÚSICAS
  Para usar arquivos de áudio reais:
    { title: "Nome da Música", artist: "Artista", src: "musica.mp3" }
  Coloque os arquivos .mp3 na mesma pasta do index.html
  Para músicas sem arquivo (só nome), deixe src: "" ou remova o campo src
*/
const PLAYLIST = [
  { title: "verybody Wants To Rule The World",         artist: "13 Tears for Fears",    src: "https://raw.githubusercontent.com/ekhoss/ARQUIVOS-PRESENTE/main/13%20Tears%20for%20Fears%20-%20Everybody%20Wants%20To%20Rule%20The%20World.mp3" },
  { title: "All My Love",           artist: "Led Zeppelin",  src: "https://raw.githubusercontent.com/ekhoss/ARQUIVOS-PRESENTE/main/06%20Led%20Zeppelin%20-%20All%20My%20Love%20%281990%20Remaster%29.mp3" },
  { title: "Back to the Old House",       artist: "The Smiths",   src: "https://raw.githubusercontent.com/ekhoss/ARQUIVOS-PRESENTE/main/18%20The%20Smiths%20-%20Back%20to%20the%20Old%20House%20%282011%20Remaster%29.mp3" },
  { title: "Beginning Middle End",artist: "Leah Nobel",src: "https://raw.githubusercontent.com/ekhoss/ARQUIVOS-PRESENTE/main/Leah%20Nobel%20-%20Beginning%20Middle%20End%20%28Always%20and%20Forever%20Mix%20Fr.mp3" },
  { title: "No. 1 Party Anthem", artist: "Arctic Monkeys",          src: "https://raw.githubusercontent.com/ekhoss/ARQUIVOS-PRESENTE/main/06%20Arctic%20Monkeys%20-%20No.%201%20Party%20Anthem.mp3" },
  { title: "Lovers",artist: "Anna Of The North",src: "https://raw.githubusercontent.com/ekhoss/ARQUIVOS-PRESENTE/main/03%20Anna%20Of%20The%20North%20-%20Lovers.mp3" },
  { title: "Mystery of Love ",         artist: "Sufjan Stevens",    src: "https://cdn.jsdelivr.net/gh/ekhoss/ARQUIVOS-PRESENTE@main/Sufjan%20Stevens%20-%20Mystery%20of%20Love%20%281%29.mp3" },
  { title: "Baby I m Yours", artist: "Arctic Monkeys",          src: "https://raw.githubusercontent.com/ekhoss/ARQUIVOS-PRESENTE/main/Arctic%20Monkeys%20-%20Baby%20I%20m%20Yours.mp3" },
  { title: "Opera House",         artist: "Cigarettes After Sex",    src: "https://raw.githubusercontent.com/ekhoss/ARQUIVOS-PRESENTE/main/Cigarettes%20After%20Sex%20-%20Opera%20House.mp3" },
  { title: "Cassandra",         artist: "Cos Sylvan",    src: "https://raw.githubusercontent.com/ekhoss/ARQUIVOS-PRESENTE/main/Cos%20Sylvan%20-%20Cassandra.mp3" },
  { title: "Lovers Rock",         artist: "TV Girl",    src: "https://raw.githubusercontent.com/ekhoss/ARQUIVOS-PRESENTE/main/TV%20Girl%20-%20Lovers%20Rock.mp3" },
  { title: "Sky Is Falling",         artist: "Bones Shredder",    src: "https://raw.githubusercontent.com/ekhoss/ARQUIVOS-PRESENTE/main/Bones%20Shredder%20-%20Sky%20Is%20Falling.mp3" },
  { title: "Pulling Teeth",         artist: "Bones Shredder",    src: "https://raw.githubusercontent.com/ekhoss/ARQUIVOS-PRESENTE/main/Bones%20Shredder%20-%20Pulling%20Teeth.mp3" },
  { title: "Death with Dignity",         artist: "Sufjan Stevens",    src: "https://cdn.jsdelivr.net/gh/ekhoss/ARQUIVOS-PRESENTE@main/01%20Sufjan%20Stevens%20-%20Death%20with%20Dignity.mp3" },
  { title: "Futile Devices (Doveman Remix)",         artist: "Sufjan Stevens",    src: "https://cdn.jsdelivr.net/gh/ekhoss/ARQUIVOS-PRESENTE@main/09%20Sufjan%20Stevens%20-%20Futile%20Devices%20%28Doveman%20Remix%29.mp3" },
  { title: "Romantic Flight",         artist: "John Powell",    src: "https://cdn.jsdelivr.net/gh/ekhoss/ARQUIVOS-PRESENTE@main/John%20Powell%20-%20Romantic%20Flight.mp3" },
  { title: "The End!",         artist: "Eu espero que você tenha gostado",    src: "https://cdn.jsdelivr.net/gh/ekhoss/ARQUIVOS-PRESENTE@main/WhatsApp%20Audio%202026-06-15%20at%2021.00.19.mpeg" },
  { title: "",         artist: "",    src: "" },

];

const LETTER_DATES = [
  { date: "2026-06-16", label: "16/06" },
  { date: "2026-06-17", label: "17/06" },
  { date: "2026-06-18", label: "18/06" },
  { date: "2026-06-19", label: "19/06" },
  { date: "2026-06-20", label: "20/06" }
];

const today = new Date();
today.setHours(0, 0, 0, 0);

const nextLetter =
  LETTER_DATES.find(letter => new Date(letter.date) >= today) ||
  LETTER_DATES[LETTER_DATES.length - 1];

const NEXT_LETTER_DATE = nextLetter.date;
const NEXT_LETTER_LABEL = nextLetter.label;

/* ============================================
   INICIALIZAÇÃO
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initPlaylist();
  initCountdown();
  updateNextLetterLabel();
  unlockLetters();
});

/* ============================================
   PLAYER DE MÚSICA
   ============================================ */

let currentSong   = 0;
let audio         = new Audio();
let isPlaying     = false;
let isMuted       = false;
let progressTimer = null;

function initPlaylist() {
  const ul = document.getElementById('playlistItems');
  if (!ul) return;

  ul.innerHTML = '';
  PLAYLIST.forEach((song, i) => {
    const li = document.createElement('li');
    li.textContent = `${song.title} — ${song.artist}`;
    li.dataset.index = i;
    if (i === currentSong) li.classList.add('active');
    li.addEventListener('click', () => {
      currentSong = i;
      loadSong(currentSong);
      playSong();
    });
    ul.appendChild(li);
  });

  loadSong(currentSong);
}

function loadSong(index) {
  const song = PLAYLIST[index];
  if (!song) return;

  document.getElementById('musicTitle').textContent  = song.title;
  document.getElementById('musicArtist').textContent = song.artist;

  // Update active in playlist
  document.querySelectorAll('#playlistItems li').forEach((li, i) => {
    li.classList.toggle('active', i === index);
  });

  if (song.src) {
    audio.src = song.src;
    audio.load();
    audio.ontimeupdate   = updateProgress;
    audio.onloadedmetadata = updateTotalTime;
    audio.onended        = nextSong;
  } else {
    // No audio file — just show info
    audio.src = '';
    document.getElementById('timeCurrent').textContent = '0:00';
    document.getElementById('timeTotal').textContent   = '0:00';
    document.getElementById('progressFill').style.width = '0%';
  }
}

function playSong() {
  if (!PLAYLIST[currentSong].src) return; // No file, skip
  audio.play().then(() => {
    isPlaying = true;
    updatePlayBtn();
  }).catch(() => {
    // Browser blocked autoplay — that's OK
    isPlaying = false;
    updatePlayBtn();
  });
}

function togglePlay() {
  if (!PLAYLIST[currentSong].src) {
    // No audio file loaded — show hint
    alert('Para ouvir músicas, adicione arquivos .mp3 e configure o campo src no script.js ♪');
    return;
  }
  if (isPlaying) {
    audio.pause();
    isPlaying = false;
  } else {
    audio.play().then(() => { isPlaying = true; updatePlayBtn(); });
    return;
  }
  updatePlayBtn();
}

function updatePlayBtn() {
  const btn = document.getElementById('playBtn');
  if (btn) btn.textContent = isPlaying ? '⏸' : '▶';
}

function nextSong() {
  currentSong = (currentSong + 1) % PLAYLIST.length;
  loadSong(currentSong);
  if (isPlaying) playSong();
}

function prevSong() {
  currentSong = (currentSong - 1 + PLAYLIST.length) % PLAYLIST.length;
  loadSong(currentSong);
  if (isPlaying) playSong();
}

function toggleMute() {
  isMuted = !isMuted;
  audio.muted = isMuted;
  const btn = document.getElementById('muteBtn');
  if (btn) btn.textContent = isMuted ? '🔇' : '🔊';
}

function updateProgress() {
  if (!audio.duration) return;
  const pct = (audio.currentTime / audio.duration) * 100;
  document.getElementById('progressFill').style.width = pct + '%';
  document.getElementById('timeCurrent').textContent  = formatTime(audio.currentTime);
}

function updateTotalTime() {
  document.getElementById('timeTotal').textContent = formatTime(audio.duration);
}

function seekAudio(e) {
  if (!audio.duration) return;
  const bar  = document.getElementById('progressBar');
  const rect = bar.getBoundingClientRect();
  const pct  = (e.clientX - rect.left) / rect.width;
  audio.currentTime = pct * audio.duration;
}

function formatTime(secs) {
  if (isNaN(secs)) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2,'0')}`;
}

function togglePlaylistPanel() {
  const panel = document.getElementById('playlistPanel');
  panel.classList.toggle('open');
}

/* ============================================
   CONTADOR REGRESSIVO
   ============================================ */

function initCountdown() {
  updateCountdown();
  setInterval(updateCountdown, 1000);
}

function updateCountdown() {
  const target = new Date(NEXT_LETTER_DATE + 'T00:00:00');
  const now    = new Date();
  const diff   = target - now;

  if (diff <= 0) {
    // Date reached — show zeros
    setCountdownDisplay(0, 0, 0, 0);
    return;
  }

  const days  = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins  = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const secs  = Math.floor((diff % (1000 * 60)) / 1000);

  setCountdownDisplay(days, hours, mins, secs);
}

function setCountdownDisplay(d, h, m, s) {
  const pad = (n) => String(n).padStart(2, '0');
  document.getElementById('cdDays').textContent  = pad(d);
  document.getElementById('cdHours').textContent = pad(h);
  document.getElementById('cdMins').textContent  = pad(m);
  document.getElementById('cdSecs').textContent  = pad(s);
}

function updateNextLetterLabel() {
  const el = document.getElementById('nextLetterDate');
  if (el) el.textContent = NEXT_LETTER_LABEL;
}

function unlockLetters() {
  const cards = document.querySelectorAll('.letter-card');

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  cards.forEach(card => {
    const dateText = card.dataset.date;

    if (!dateText) return;

    const [day, month] = dateText.split('/');

    const letterDate = new Date(
      today.getFullYear(),
      parseInt(month) - 1,
      parseInt(day)
    );

    if (today >= letterDate) {
      card.classList.remove('locked');
      card.classList.add('available');

      card.setAttribute('onclick', 'openLetter(this)');

      const icon = card.querySelector('.letter-icon');
      if (icon) {
        icon.className = 'letter-icon envelope';
        icon.innerHTML = `
          <div class="env-body"></div>
          <div class="env-flap"></div>
          <div class="env-heart">♥</div>
        `;
      }

      const badge = card.querySelector('.badge-locked');
      if (badge) {
        badge.className = 'btn-open';
        badge.textContent = 'Abrir agora';
      }
    }
  });
}

/* ============================================
   CARTAS — ABRIR COM ANIMAÇÃO
   ============================================ */

function openLetter(card) {
  if (card.classList.contains('locked')) return;

  const title   = card.dataset.title   || 'Carta';
  const date    = card.dataset.date    || '';
  const content = card.dataset.content || '';

  // Fill modal content
  document.getElementById('modalTitle').textContent   = title;
  document.getElementById('modalDate').textContent    = 'Para abrir em ' + date;
  document.getElementById('modalContent').textContent = content;

  // Show overlay
  const overlay = document.getElementById('letterModal');
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  // Reset state
  const flap   = document.getElementById('modalFlap');
  const heart  = document.querySelector('.modal-env-heart');
  const letter = document.getElementById('modalLetter');
  const env    = document.querySelector('.modal-env-wrapper');

  flap.classList.remove('open');
  heart.classList.remove('hidden');
  letter.classList.remove('open');
  env.classList.remove('opened');

  // Animation sequence:
  // 1. Flap opens (rotateX)
  // 2. Heart fades
  // 3. Letter slides up out of envelope
  // 4. Envelope moves up slightly

  setTimeout(() => {
    flap.classList.add('open');
    heart.classList.add('hidden');
  }, 200);

  setTimeout(() => {
    env.classList.add('opened');
    letter.classList.add('open');
  }, 700);
}

function closeLetterModal(e) {
  if (e && e.target !== document.getElementById('letterModal') && !e.target.classList.contains('modal-close')) {
    return;
  }
  const overlay = document.getElementById('letterModal');
  overlay.classList.remove('open');
  document.body.style.overflow = '';

  // Reset animations
  setTimeout(() => {
    document.getElementById('modalFlap').classList.remove('open');
    document.querySelector('.modal-env-heart').classList.remove('hidden');
    document.getElementById('modalLetter').classList.remove('open');
    document.querySelector('.modal-env-wrapper').classList.remove('opened');
  }, 300);
}

/* ============================================
   LIGHTBOX — FOTOS EM ROLO / POLAROIDS
   ============================================ */

function openLightbox(elementId) {
  const source = document.getElementById(elementId);
  const lightbox = document.getElementById('lightbox');
  const content  = document.getElementById('lightboxContent');

  if (!source || !lightbox) return;

  // Clone the source content for the lightbox
  const img = source.querySelector('img');

  if (img) {
    // Has a real image — show it large
    const bigImg = document.createElement('img');
    bigImg.src = img.src;
    bigImg.alt = img.alt || '';
    content.innerHTML = '';
    content.appendChild(bigImg);
  } else {
    // Placeholder — show empty state
    content.innerHTML = `
      <div class="lightbox-empty">
        <span style="font-size:40px">📷</span>
        <span>Adicione uma foto aqui!</span>
        <small style="font-size:11px; color:#666;">Substitua o .photo-placeholder por &lt;img src="foto.jpg" /&gt;</small>
      </div>
    `;
  }

  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox(e) {
  if (e && e.target !== document.getElementById('lightbox') && !e.target.classList.contains('lightbox-close')) {
    return;
  }
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}

/* ============================================
   ROLO DE FILME — SCROLL
   ============================================ */

function filmScroll(direction) {
  const strip = document.getElementById('filmStrip');
  if (!strip) return;
  strip.scrollBy({ left: direction * 220, behavior: 'smooth' });
}

// Click on film frame to mark as active
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.film-frame').forEach(frame => {
    frame.addEventListener('click', () => {
      document.querySelectorAll('.film-frame').forEach(f => f.classList.remove('active'));
      frame.classList.add('active');
    });
  });
});

/* ============================================
   NAVEGAÇÃO — MEMÓRIAS / CARTAS
   ============================================ */

function showSection(section) {
  const btns = document.querySelectorAll('.nav-btn');

  // Destaque visual no botão clicado
  btns.forEach(btn => { btn.style.background = ''; btn.style.color = ''; });
  if (section === 'memorias' && btns[0]) {
    btns[0].style.background = '#c0392b';
    btns[0].style.color = 'white';
  } else if (section === 'cartas' && btns[1]) {
    btns[1].style.background = '#c0392b';
    btns[1].style.color = 'white';
  }
  setTimeout(() => {
    btns.forEach(btn => { btn.style.background = ''; btn.style.color = ''; });
  }, 1200);

  if (section === 'memorias') {
    // Esconde cartas, mostra rolo de fotos em destaque
    document.querySelector('.film-strip-container').style.display = 'flex';
    document.querySelector('.film-strip-container').scrollIntoView({ behavior: 'smooth', block: 'center' });
    // Pisca o rolo para chamar atenção
    const strip = document.querySelector('.film-strip-container');
    strip.style.outline = '3px solid #c0392b';
    strip.style.borderRadius = '6px';
    setTimeout(() => { strip.style.outline = ''; strip.style.borderRadius = ''; }, 1500);
  } else if (section === 'cartas') {
    // Rola para a página de cartas
    document.querySelector('.page-right').scrollIntoView({ behavior: 'smooth', block: 'start' });
    // Pisca o painel de cartas
    const letters = document.querySelector('.letters-list');
    letters.style.outline = '3px solid #fdf0e0';
    letters.style.borderRadius = '8px';
    setTimeout(() => { letters.style.outline = ''; letters.style.borderRadius = ''; }, 1500);
  }
}

/* ============================================
   SENHA DE ACESSO
   ============================================ */

const SENHA_CORRETA = 'cirice';

function checkPassword() {
  const input = document.getElementById('pwdInput');
  const erro  = document.getElementById('pwdError');
  const valor = input.value.trim().toLowerCase();

  if (valor === SENHA_CORRETA) {
    erro.textContent = '';
    const screen = document.getElementById('passwordScreen');
    screen.classList.add('hidden');
    setTimeout(() => { screen.style.display = 'none'; }, 700);
  } else {
    erro.textContent = 'Senha incorreta, tente novamente ♥';
    input.value = '';
    input.focus();
    // Re-trigger shake animation
    erro.style.animation = 'none';
    void erro.offsetWidth;
    erro.style.animation = '';
  }
}

/* ============================================
   FECHAR COM ESC
   ============================================ */

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeLightbox({ target: document.getElementById('lightbox') });
    closeLetterModal({ target: document.getElementById('letterModal') });
    document.getElementById('playlistPanel')?.classList.remove('open');
  }
});

/* ============================================
   TOQUES SUAVES — MICRO-INTERAÇÕES
   ============================================ */

// Sparkle / floating hearts on load
document.addEventListener('DOMContentLoaded', () => {
  createFloatingHearts();
});

function createFloatingHearts() {
  const count = 8;
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const heart = document.createElement('div');
      heart.textContent = i % 2 === 0 ? '♥' : '♡';
      heart.style.cssText = `
        position: fixed;
        left: ${Math.random() * 100}vw;
        bottom: -30px;
        font-size: ${10 + Math.random() * 14}px;
        color: rgba(192,57,43,${0.3 + Math.random() * 0.4});
        pointer-events: none;
        z-index: 0;
        animation: floatUp ${3 + Math.random() * 4}s ease-in forwards;
      `;
      document.body.appendChild(heart);
      setTimeout(() => heart.remove(), 8000);
    }, i * 700);
  }
}

// CSS for floating hearts injected via JS
const style = document.createElement('style');
style.textContent = `
  @keyframes floatUp {
    0%   { transform: translateY(0) rotate(0deg); opacity: 1; }
    100% { transform: translateY(-110vh) rotate(${Math.random() > 0.5 ? '' : '-'}${20 + Math.random() * 30}deg); opacity: 0; }
  }
`;
document.head.appendChild(style);

// Repeat hearts every 12 seconds
setInterval(createFloatingHearts, 12000);
