// ---------- Timecode décoratif (uniquement présent sur le hero de l'accueil) ----------
(function(){
  const tc = document.getElementById('tc');
  if(!tc) return;
  let f = 0;
  function pad(n){ return n.toString().padStart(2,'0'); }
  setInterval(()=>{
    f++;
    let frames = f % 25;
    let totalSec = Math.floor(f/25);
    let s = totalSec % 60;
    let m = Math.floor(totalSec/60) % 60;
    let h = Math.floor(totalSec/3600);
    tc.textContent = pad(h)+':'+pad(m)+':'+pad(s)+':'+pad(frames);
  }, 40);
})();

// ---------- Navigation intelligente des projets ----------
// - 0 lien   -> petite fenêtre d'info (photo / lien à venir)
// - 1 lien   -> accès direct au contenu, aucune page intermédiaire
// - 2+ liens -> page galerie (vignettes) listant tous les contenus
function openModal(data){
  const links = data.links && data.links.length ? data.links : (data.link ? [data.link] : []);

  if(links.length === 1){
    // un seul contenu : navigation directe, pas d'étape inutile
    window.open(links[0], '_blank', 'noopener');
    return;
  }

  if(links.length > 1){
    openGallery(data, links);
    return;
  }

  // aucun lien disponible pour l'instant : petite fenêtre d'info
  openInfoModal(data);
}

// ---------- Petite fenêtre d'info (projet sans lien / photo à venir) ----------
function openInfoModal(data){
  const overlay = document.getElementById('modalOverlay');
  if(!overlay) return;

  document.getElementById('modalTitle').textContent = data.title;
  document.getElementById('modalDesc').textContent = data.desc;
  document.getElementById('modalEyebrow').textContent = data.category || '';

  const videoLink = document.getElementById('modalVideoLink');
  const note = document.getElementById('modalVideoNote');
  const multiWrap = document.getElementById('modalMultiLinks');

  multiWrap.innerHTML = '';
  multiWrap.style.display = 'none';

  videoLink.removeAttribute('href');
  videoLink.classList.add('is-photo');
  videoLink.style.display = 'flex';
  note.textContent = data.pending ? 'lien à venir' : 'photo à ajouter';

  overlay.classList.add('active');
}
function closeModal(){
  const overlay = document.getElementById('modalOverlay');
  if(overlay) overlay.classList.remove('active');
}

// ---------- Page galerie (plusieurs contenus dans un même projet) ----------
function getGalleryOverlay(){
  let overlay = document.getElementById('galleryOverlay');
  if(overlay) return overlay;

  overlay = document.createElement('div');
  overlay.id = 'galleryOverlay';
  overlay.className = 'gallery-overlay';
  overlay.innerHTML = `
    <button class="gallery-close" onclick="closeGallery()">✕</button>
    <div class="gallery-page">
      <a href="javascript:void(0)" class="gallery-back" onclick="closeGallery()">← Retour</a>
      <div class="gallery-head">
        <div class="eyebrow" id="galleryEyebrow"></div>
        <h2 id="galleryTitle"></h2>
        <p id="galleryDesc"></p>
      </div>
      <div class="gallery-grid" id="galleryGrid"></div>
    </div>
  `;
  document.body.appendChild(overlay);

  overlay.addEventListener('click', function(e){
    if(e.target === this) closeGallery();
  });

  return overlay;
}

function openGallery(data, links){
  const overlay = getGalleryOverlay();

  overlay.querySelector('#galleryEyebrow').textContent = data.category || '';
  overlay.querySelector('#galleryTitle').textContent = data.title;
  overlay.querySelector('#galleryDesc').textContent = data.desc;

  const grid = overlay.querySelector('#galleryGrid');
  grid.innerHTML = '';

  links.forEach((url, i) => {
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener';
    a.className = 'gallery-item';
    a.innerHTML = `
      <div class="gallery-thumb-note">miniature à ajouter</div>
      <div class="proj-play"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></div>
      <div class="gallery-item-title">Vidéo ${i+1}</div>
    `;
    grid.appendChild(a);
  });

  document.body.classList.add('gallery-open');
  overlay.classList.add('active');
}
function closeGallery(){
  const overlay = document.getElementById('galleryOverlay');
  if(overlay) overlay.classList.remove('active');
  document.body.classList.remove('gallery-open');
}

document.addEventListener('DOMContentLoaded', function(){
  const overlay = document.getElementById('modalOverlay');
  if(overlay){
    overlay.addEventListener('click', function(e){
      if(e.target === this) closeModal();
    });
  }
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape'){
      closeModal();
      closeGallery();
    }
  });
});
