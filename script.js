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

// ---------- Fenêtre (lightbox) projet ----------
function openModal(data){
  document.getElementById('modalTitle').textContent = data.title;
  document.getElementById('modalDesc').textContent = data.desc;
  document.getElementById('modalEyebrow').textContent = data.category || '';

  const videoLink = document.getElementById('modalVideoLink');
  const note = document.getElementById('modalVideoNote');

  if(data.link){
    videoLink.href = data.link;
    videoLink.classList.remove('is-photo');
    note.textContent = data.linkLabel || 'clic = ouvre la vidéo source';
  } else {
    videoLink.removeAttribute('href');
    videoLink.classList.add('is-photo');
    note.textContent = 'photo à ajouter';
  }

  document.getElementById('modalOverlay').classList.add('active');
}
function closeModal(){
  document.getElementById('modalOverlay').classList.remove('active');
}
document.addEventListener('DOMContentLoaded', function(){
  const overlay = document.getElementById('modalOverlay');
  if(!overlay) return;
  overlay.addEventListener('click', function(e){
    if(e.target === this) closeModal();
  });
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape') closeModal();
  });
});
