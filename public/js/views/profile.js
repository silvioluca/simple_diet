import { state, saveProfile, saveTargets, refreshState, latestMeasure } from '../store.js';
import { ACTIVITY_LEVELS, GOALS } from '../config.js';
import { statHTML, confirmSheet } from '../ui.js';
import { logout } from '../auth.js';
import { esc, fmt, num, bmr, tdee, age, suggestTargets, toast } from '../utils.js';
import { render } from '../router.js';

function formHTML(p) {
  return `
    <div class="formgrid">
      <label class="field"><span>Sesso</span>
        <select id="f-sex">
          <option value="m" ${p.sex === 'm' ? 'selected' : ''}>Uomo</option>
          <option value="f" ${p.sex === 'f' ? 'selected' : ''}>Donna</option>
        </select>
      </label>
      <label class="field"><span>Data di nascita</span>
        <input id="f-birth" type="date" value="${esc(p.birthDate)}" /></label>
      <label class="field"><span>Altezza (cm)</span>
        <input id="f-height" type="number" inputmode="decimal" min="100" max="230" step="1" value="${num(p.heightCm)}" /></label>
      <label class="field"><span>Peso (kg)</span>
        <input id="f-weight" type="number" inputmode="decimal" min="30" max="300" step="0.1" value="${num(p.weightKg)}" /></label>
      <label class="field"><span>Livello di attività</span>
        <select id="f-activity">
          ${ACTIVITY_LEVELS.map(
            (a) => `<option value="${a.id}" ${num(p.activity) === a.id ? 'selected' : ''}>${a.label}</option>`
          ).join('')}
        </select>
      </label>
      <label class="field"><span>Obiettivo</span>
        <select id="f-goal">
          ${GOALS.map(
            (g) => `<option value="${g.id}" ${p.goal === g.id ? 'selected' : ''}>${g.label}</option>`
          ).join('')}
        </select>
      </label>
      <label class="field"><span>Proteine (g per kg)</span>
        <input id="f-ppk" type="number" inputmode="decimal" min="0.8" max="3.5" step="0.1" value="${num(p.proteinPerKg, 2)}" /></label>
      <label class="field"><span>Grassi (% delle calorie)</span>
        <input id="f-fatpct" type="number" inputmode="decimal" min="15" max="45" step="1" value="${num(p.fatPercent, 25)}" /></label>
    </div>`;
}

export async function renderProfile(view) {
  const p = state.profile;
  const user = state.user || {};

  view.innerHTML = `
    <section class="card account">
      ${user.photoURL ? `<img class="account__pic" src="${esc(user.photoURL)}" alt="" />` : '<span class="account__pic account__pic--none">👤</span>'}
      <div class="account__who">
        <p class="account__name">${esc(user.displayName || 'Account')}</p>
        <p class="account__mail">${esc(user.email || '')}</p>
      </div>
      <div class="account__acts">
        <button class="btn btn--ghost btn--sm" id="reload-btn" type="button">Ricarica dati</button>
        <button class="btn btn--ghost btn--sm" id="logout-btn" type="button">Esci</button>
      </div>
    </section>

    <h2 class="sectiontitle">Dati personali</h2>
    <div class="grid grid--stats">
      ${statHTML({ label: 'Età', value: fmt(age(p.birthDate)), unit: 'anni' })}
      ${statHTML({ label: 'Metabolismo basale', value: fmt(bmr(p)), unit: 'kcal', hint: 'Mifflin-St Jeor' })}
      ${statHTML({ label: 'Fabbisogno (TDEE)', value: fmt(tdee(p)), unit: 'kcal', hint: 'Basale × attività' })}
      ${statHTML({
        label: 'Target consigliato',
        value: fmt(suggestTargets(p).kcal),
        unit: 'kcal',
        hint: GOALS.find((g) => g.id === p.goal)?.label || ''
      })}
    </div>

    <section class="card section">
      <div class="card__head">
        <h2>Misure e obiettivo</h2>
        <button class="btn btn--ghost btn--sm" type="button" id="sync-weight">Usa ultimo peso</button>
      </div>
      ${formHTML(p)}
      <p class="stat__hint" style="margin:0 0 14px">
        Questi valori alimentano il calcolo del fabbisogno. Gli obiettivi giornalieri
        si impostano nella sezione <a href="#/dieta">Dieta</a>.
      </p>
      <button class="btn" id="save-profile" type="button">Salva profilo</button>
    </section>`;

  const read = () => ({
    ...p,
    sex: view.querySelector('#f-sex').value,
    birthDate: view.querySelector('#f-birth').value,
    heightCm: num(view.querySelector('#f-height').value),
    weightKg: num(view.querySelector('#f-weight').value),
    activity: num(view.querySelector('#f-activity').value),
    goal: view.querySelector('#f-goal').value,
    proteinPerKg: num(view.querySelector('#f-ppk').value, 2),
    fatPercent: num(view.querySelector('#f-fatpct').value, 25)
  });

  view.querySelector('#save-profile').addEventListener('click', async () => {
    const next = read();
    await saveProfile(next);
    // Con i target automatici il nuovo profilo li ricalcola subito.
    if (state.targets.auto) await saveTargets({ ...suggestTargets(next), auto: true });
    await refreshState();
    toast('Profilo salvato', 'ok');
    render();
  });

  view.querySelector('#sync-weight').addEventListener('click', async () => {
    const m = await latestMeasure();
    if (!m?.weight) return toast('Nessuna pesata registrata nelle Misure', 'error');
    view.querySelector('#f-weight').value = m.weight;
    toast(`Peso aggiornato a ${fmt(m.weight, 1)} kg — ricorda di salvare`);
  });

  view.querySelector('#reload-btn').addEventListener('click', async () => {
    await refreshState();
    render();
    toast('Dati ricaricati', 'ok');
  });

  view.querySelector('#logout-btn').addEventListener('click', async () => {
    const ok = await confirmSheet({
      title: 'Uscire dall’account?',
      text: 'Dovrai accedere di nuovo con Google alla prossima apertura.',
      confirmLabel: 'Esci'
    });
    if (ok) await logout();
  });
}
