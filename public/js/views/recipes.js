import { listRecipes, saveRecipe, deleteRecipe, addEntry, rememberFood, state } from '../store.js';
import { filterIdeas, ideaToFood, coverForRecipe } from '../ideas.js';
import { MEAL_SLOTS, slotForNow } from '../config.js';
import { openSheet, confirmSheet, statHTML, PLUS_SVG } from '../ui.js';
import { openFoodPicker } from './meals.js';
import { invalidateLocalIndex } from '../foodsearch.js';
import {
  esc,
  fmt,
  num,
  round,
  debounce,
  scaleMacros,
  recipeTotals,
  recipePer100,
  formatDateLong,
  toast
} from '../utils.js';
import { render } from '../router.js';

// Stato del pannello Idee, conservato fra un render e l'altro.
let panelOpen = 'idee'; // idee | mie — le idee sono il punto di partenza naturale
let ideaFilters = { text: '', ingredient: '', tag: '' };

/** Riga ingrediente dentro l'editor. */
function ingredientHTML(item, index) {
  const m = scaleMacros(item.per100, item.grams);
  return `
    <li class="food">
      <div class="food__row food__row--x">
        <span class="food__name">${esc(item.name)}</span>
        <span class="food__qty">${fmt(item.grams)} g</span>
        <span class="food__kcal">${fmt(m.kcal)}<small> kcal</small></span>
        <button class="food__x" type="button" data-drop="${index}" aria-label="Togli ${esc(item.name)}">✕</button>
      </div>
    </li>`;
}

/** Editor ricetta: nome, porzioni, ingredienti. Ritorna al salvataggio. */
function recipeEditor(recipe, onSaved) {
  // Copia di lavoro: si annulla senza toccare quella salvata.
  let draft = {
    name: recipe?.name || '',
    servings: num(recipe?.servings, 1),
    photoUrl: recipe?.photo?.url || '',
    ingredients: (recipe?.ingredients || []).map((i) => ({ ...i }))
  };

  const body = () => {
    const { totals, totalGrams } = recipeTotals(draft.ingredients);
    const servings = Math.max(1, num(draft.servings, 1));
    const perServing = {
      kcal: totals.kcal / servings,
      protein: totals.protein / servings,
      carbs: totals.carbs / servings,
      fat: totals.fat / servings
    };
    return `
      <div class="formgrid">
        <label class="field"><span>Nome della ricetta</span>
          <input id="r-name" type="text" value="${esc(draft.name)}" placeholder="Es. Pasta al tonno" /></label>
        <label class="field"><span>Porzioni</span>
          <input id="r-serv" type="number" inputmode="numeric" min="1" step="1" value="${servings}" /></label>
        <label class="field" style="grid-column:1/-1"><span>Foto (indirizzo immagine, facoltativo)</span>
          <input id="r-photo" type="url" inputmode="url" placeholder="https://…  lascia vuoto per la copertina automatica"
                 value="${esc(draft.photoUrl)}" /></label>
      </div>

      <div class="recipe__preview">
        ${coverHTML(
          coverForRecipe({ name: draft.name, ingredients: draft.ingredients,
                           photo: draft.photoUrl ? { url: draft.photoUrl } : null }),
          'cover--wide'
        )}
      </div>

      <div class="slot__head" style="padding-left:0">
        <span class="slot__name">Ingredienti</span>
        <span class="slot__sum">${draft.ingredients.length ? `${fmt(totalGrams)} g totali` : ''}</span>
        <button class="addbtn addbtn--sm" type="button" id="r-add" aria-label="Aggiungi ingrediente">${PLUS_SVG}</button>
      </div>
      ${
        draft.ingredients.length
          ? `<ul class="list list--compact" id="r-list">${draft.ingredients.map(ingredientHTML).join('')}</ul>`
          : '<p class="slot__empty">Nessun ingrediente. Premi + per aggiungerne uno.</p>'
      }

      <div class="preview" style="margin-top:16px">
        <span class="preview__k">${fmt(perServing.kcal)}<small> kcal/porzione</small></span>
        <span class="preview__m">P ${fmt(perServing.protein, 1)} · C ${fmt(perServing.carbs, 1)} · G ${fmt(perServing.fat, 1)} g</span>
      </div>
      <p class="stat__hint" style="margin:0 0 16px">
        Totale ricetta: ${fmt(totals.kcal)} kcal su ${fmt(totalGrams)} g.
        I valori si riferiscono al peso degli ingredienti crudi.
      </p>

      <button class="btn" id="r-save" type="button">${recipe ? 'Salva modifiche' : 'Crea ricetta'}</button>
      <button class="btn btn--ghost" data-close type="button">Annulla</button>`;
  };

  openSheet({
    size: 'lg',
    html: `<div class="picker">
      <header class="picker__head">
        <div><h2>${recipe ? 'Modifica ricetta' : 'Nuova ricetta'}</h2>
          <p class="picker__sub">Gli ingredienti diventano un alimento riutilizzabile</p></div>
        <button class="iconbtn" data-close type="button" aria-label="Chiudi">✕</button>
      </header>
      <div data-mode="edit" id="r-body">${body()}</div>
    </div>`,

    onMount: (panel, close) => {
      const box = panel.querySelector('#r-body');

      // Ridisegna conservando ciò che l'utente ha già digitato nei campi.
      const repaint = () => {
        readFields();
        box.innerHTML = body();
      };
      const readFields = () => {
        const n = box.querySelector('#r-name');
        const s = box.querySelector('#r-serv');
        const f = box.querySelector('#r-photo');
        if (n) draft.name = n.value;
        if (s) draft.servings = num(s.value, 1);
        if (f) draft.photoUrl = f.value.trim();
      };

      // Aggiorna solo l'anteprima della copertina, senza ridisegnare il form:
      // ridisegnare mentre si scrive farebbe perdere il focus.
      const repaintCover = () => {
        const box2 = box.querySelector('.recipe__preview');
        if (!box2) return;
        box2.innerHTML = coverHTML(
          coverForRecipe({
            name: draft.name,
            ingredients: draft.ingredients,
            photo: draft.photoUrl ? { url: draft.photoUrl } : null
          }),
          'cover--wide'
        );
      };

      box.addEventListener('input', (e) => {
        if (e.target.id === 'r-name') { draft.name = e.target.value; repaintCover(); }
        if (e.target.id === 'r-photo') { draft.photoUrl = e.target.value.trim(); repaintCover(); }
        if (e.target.id === 'r-serv') {
          draft.servings = num(e.target.value, 1);
          repaint();
        }
      });

      box.addEventListener('click', async (e) => {
        if (e.target.closest('#r-add')) {
          readFields();
          // Il picker sostituisce questa sheet: la riapro dopo la scelta.
          return openFoodPicker('pranzo', {
            lockSlot: true,
            onPick: (food) => askGrams(food)
          });
        }

        const drop = e.target.closest('[data-drop]');
        if (drop) {
          draft.ingredients.splice(Number(drop.dataset.drop), 1);
          return repaint();
        }

        if (e.target.closest('#r-save')) {
          readFields();
          if (!draft.name.trim()) return toast('Dai un nome alla ricetta', 'error');
          if (!draft.ingredients.length) return toast('Serve almeno un ingrediente', 'error');

          const { totals, totalGrams } = recipeTotals(draft.ingredients);
          const payload = {
            name: draft.name.trim(),
            servings: Math.max(1, Math.round(num(draft.servings, 1))),
            photo: draft.photoUrl ? { url: draft.photoUrl, credit: '' } : null,
            ingredients: draft.ingredients,
            totalGrams,
            totals,
            per100: recipePer100(draft.ingredients)
          };
          try {
            await saveRecipe(payload, recipe?.id || null);
            invalidateLocalIndex(); // la ricetta entra fra i suggerimenti
            close();
            toast(recipe ? 'Ricetta aggiornata' : 'Ricetta creata', 'ok');
            onSaved?.();
          } catch (err) {
            toast(`Salvataggio fallito: ${err.message}`, 'error');
          }
        }
      });

      /** Quantità dell'ingrediente, poi si riapre l'editor con lo stato attuale. */
      function askGrams(food) {
        openSheet({
          size: 'sm',
          html: `
            <h2>${esc(food.name)}</h2>
            <p>${fmt(food.per100.kcal)} kcal per 100 g</p>
            <label class="field"><span>Grammi</span>
              <input id="ig-g" type="number" inputmode="decimal" min="1" step="1" value="${food.servingG || 100}" /></label>
            <button class="btn" id="ig-ok" type="button">Aggiungi alla ricetta</button>
            <button class="btn btn--ghost" data-close type="button">Annulla</button>`,
          onMount: (p2, close2) => {
            const done = () => {
              const g = num(p2.querySelector('#ig-g').value);
              if (g <= 0) return toast('Quantità non valida', 'error');
              draft.ingredients.push({
                name: food.name,
                brand: food.brand || '',
                code: food.code || '',
                grams: round(g, 1),
                per100: food.per100
              });
              close2();
              recipeEditor({ ...draft, id: recipe?.id }, onSaved);
            };
            p2.querySelector('#ig-ok').addEventListener('click', done);
          },
          onClose: () => {
            // Chiusa senza aggiungere: torno comunque all'editor.
            if (!document.querySelector('#r-body')) recipeEditor({ ...draft, id: recipe?.id }, onSaved);
          }
        });
      }
    }
  });
}

/**
 * Scheda di un'idea: ingredienti, procedimento e aggiunta al diario con
 * la grammatura regolabile (di default una porzione).
 */
function ideaSheet(idea) {
  const start = idea.servingG;

  openSheet({
    size: 'lg',
    html: `<div class="picker">
      <header class="picker__head picker__head--cover">
        ${coverHTML(idea, 'cover--sm')}
        <div><h2>${esc(idea.name)}</h2>
          <p class="picker__sub">${idea.minutes} min · ${idea.servings} porzioni · ${fmt(idea.totalGrams)} g totali</p></div>
        <button class="iconbtn" data-close type="button" aria-label="Chiudi">✕</button>
      </header>

      <div data-mode="idea">
        <div class="chips" style="margin-bottom:14px">
          ${idea.tags.map((t) => `<span class="chip chip--static">${esc(t)}</span>`).join('')}
        </div>

        <p class="picker__label">Ingredienti</p>
        <ul class="list list--compact">
          ${idea.ingredients
            .map((i) => {
              const m = scaleMacros(i.per100, i.grams);
              return `<li class="food"><div class="food__row food__row--static">
                <span class="food__name">${esc(i.name)}</span>
                <span class="food__qty">${i.grams > 0 ? `${fmt(i.grams)} g` : 'q.b.'}</span>
                <span class="food__kcal">${fmt(m.kcal)}<small> kcal</small></span>
              </div></li>`;
            })
            .join('')}
        </ul>

        <p class="picker__label" style="margin-top:16px">Procedimento</p>
        <p class="idea__steps">${esc(idea.steps)}</p>
        ${
          idea.photo?.credit
            ? `<p class="idea__credit">Foto: ${esc(idea.photo.credit)}</p>`
            : ''
        }

        <p class="picker__label" style="margin-top:16px">Aggiungi al diario</p>
        <div class="formgrid">
          <label class="field"><span>Quantità in grammi</span>
            <input id="id-g" type="number" inputmode="decimal" min="1" step="5" value="${start}" /></label>
          <label class="field"><span>Pasto</span>
            <select id="id-slot">
              ${MEAL_SLOTS.map(
                (s) =>
                  `<option value="${s.id}" ${s.id === slotForNow() ? 'selected' : ''}>${s.icon} ${s.label}</option>`
              ).join('')}
            </select></label>
        </div>

        <div class="chips" id="id-quick">
          ${[
            ['½ porzione', Math.round(start / 2)],
            ['1 porzione', start],
            ['1½ porzioni', Math.round(start * 1.5)],
            ['2 porzioni', start * 2]
          ]
            .map(([label, g]) => `<button class="chip" type="button" data-g="${g}">${label}</button>`)
            .join('')}
        </div>

        <div class="preview" id="id-preview"></div>
      </div>

      <footer class="picker__foot">
        <button class="btn btn--sm" type="button" id="id-add" style="width:auto">Aggiungi a ${esc(formatDateLong(state.selectedDate).toLowerCase())}</button>
      </footer>
    </div>`,

    onMount: (panel, close) => {
      const gInput = panel.querySelector('#id-g');
      const preview = panel.querySelector('#id-preview');

      const paint = () => {
        const g = num(gInput.value);
        const m = scaleMacros(idea.per100, g);
        const porzioni = idea.servingG > 0 ? g / idea.servingG : 0;
        preview.innerHTML = `
          <span class="preview__k">${fmt(m.kcal)}<small> kcal</small></span>
          <span class="preview__m">P ${fmt(m.protein, 1)} · C ${fmt(m.carbs, 1)} · G ${fmt(m.fat, 1)} g
            &nbsp;·&nbsp; ${fmt(porzioni, 1)} porzioni</span>`;
        panel
          .querySelectorAll('#id-quick .chip')
          .forEach((c) => c.setAttribute('aria-pressed', String(num(c.dataset.g) === g)));
      };
      paint();

      gInput.addEventListener('input', paint);
      panel.querySelector('#id-quick').addEventListener('click', (e) => {
        const b = e.target.closest('[data-g]');
        if (!b) return;
        gInput.value = b.dataset.g;
        paint();
      });

      panel.querySelector('#id-add').addEventListener('click', async () => {
        const g = num(gInput.value);
        if (g <= 0) return toast('Quantità non valida', 'error');
        const food = ideaToFood(idea);
        try {
          await addEntry({
            date: state.selectedDate,
            slot: panel.querySelector('#id-slot').value,
            name: idea.name,
            brand: 'Idea ricetta',
            code: '',
            image: '',
            grams: round(g, 1),
            per100: idea.per100,
            totals: scaleMacros(idea.per100, g)
          });
          await rememberFood({
            name: food.name,
            brand: food.brand,
            code: '',
            image: '',
            servingG: food.servingG,
            per100: food.per100,
            source: 'recipe'
          });
          invalidateLocalIndex();
          close();
          toast(`"${idea.name}" aggiunto al diario`, 'ok');
        } catch (err) {
          toast(`Aggiunta fallita: ${err.message}`, 'error');
        }
      });
    }
  });
}

/**
 * Copertina: gradiente + emoji sempre presenti, foto sovrapposta se c'è.
 * Se la foto non carica l'immagine resta invisibile e riaffiora il gradiente:
 * nessun riquadro rotto, nessun handler onerror.
 */
function coverHTML(idea, extraClass = '') {
  const photo = idea.photo?.url
    ? `<img class="cover__img" src="${esc(idea.photo.url)}" alt="" loading="lazy" decoding="async" />`
    : '';
  return `<span class="cover ${extraClass}" style="background:${idea.cover}" aria-hidden="true">
            <span class="cover__icon">${idea.icon}</span>${photo}
          </span>`;
}

function ideaCardHTML(idea, index) {
  return `
    <button class="ideacard" type="button" data-idea="${index}">
      ${coverHTML(idea)}
      <span class="ideacard__body">
        <span class="ideacard__top">
          <span class="ideacard__name">${esc(idea.name)}</span>
          <span class="ideacard__kcal">${fmt(idea.perServing.kcal)}<small>kcal</small></span>
        </span>
        <span class="ideacard__macro">P ${fmt(idea.perServing.protein)} · C ${fmt(
          idea.perServing.carbs
        )} · G ${fmt(idea.perServing.fat)} g a porzione · ${idea.minutes} min</span>
        <span class="ideacard__ing">${esc(idea.ingredients.map((i) => i.name).join(', '))}</span>
      </span>
    </button>`;
}

// Pochi filtri: la ricerca copre già nome, ingredienti e tag. Restano solo i
// tagli che un input di testo non esprime bene.
const QUICK_TAGS = ['proteica', 'vegetariana', 'vegana', 'low carb', 'veloce', 'meal prep'];

function ideasPanelHTML() {
  const shown = filterIdeas(ideaFilters);

  return `
    <div class="search" style="margin-bottom:12px">
      <input id="idea-q" type="search" value="${esc(ideaFilters.text)}" autocomplete="off"
             placeholder="Cerca per nome o ingrediente: pollo, ceci, avena…" />
    </div>

    <div class="chips" id="idea-tag" style="margin-bottom:16px">
      <button class="chip" type="button" data-tag="" aria-pressed="${!ideaFilters.tag}">Tutte</button>
      ${QUICK_TAGS.map(
        (t) =>
          `<button class="chip" type="button" data-tag="${esc(t)}" aria-pressed="${
            ideaFilters.tag === t
          }">${esc(t)}</button>`
      ).join('')}
    </div>

    <p class="picker__label">${shown.length} idee</p>
    ${
      shown.length
        ? `<div class="ideagrid">${shown.map(ideaCardHTML).join('')}</div>`
        : '<p class="empty">Nessuna idea corrisponde. Prova con un ingrediente, per esempio “tonno”.</p>'
    }`;
}

function recipeCardHTML(recipe) {
  const servings = Math.max(1, num(recipe.servings, 1));
  const t = recipe.totals || { kcal: 0, protein: 0, carbs: 0, fat: 0 };
  const per = {
    kcal: num(t.kcal) / servings,
    protein: num(t.protein) / servings,
    carbs: num(t.carbs) / servings,
    fat: num(t.fat) / servings
  };
  return `
    <section class="card card--flush recipe">
      ${coverHTML(coverForRecipe(recipe), 'cover--wide')}
      <div class="card__head" style="margin-top:14px">
        <h2>${esc(recipe.name)}</h2>
        <strong class="bigkcal">${fmt(per.kcal)}<span>kcal/porz.</span></strong>
      </div>
      <p class="stat__hint" style="margin:0 0 12px">
        ${fmt(servings)} porzioni · ${fmt(recipe.totalGrams)} g · ${recipe.ingredients?.length || 0} ingredienti<br />
        P ${fmt(per.protein, 1)} · C ${fmt(per.carbs, 1)} · G ${fmt(per.fat, 1)} g a porzione
      </p>
      <p class="recipe__ing">${esc((recipe.ingredients || []).map((i) => i.name).join(', '))}</p>
      <div class="recipe__acts">
        <button class="btn btn--ghost btn--sm" type="button" data-edit="${esc(recipe.id)}">Modifica</button>
        <button class="btn btn--ghost btn--sm" type="button" data-del="${esc(recipe.id)}">Elimina</button>
      </div>
    </section>`;
}

function mineePanelHTML(recipes) {
  return recipes.length
    ? `<div class="grid">${recipes.map(recipeCardHTML).join('')}</div>`
    : `<p class="empty">Nessuna ricetta tua. Creane una con il pulsante +, oppure parti
         dal pannello Idee. Le ricette diventano alimenti riutilizzabili nei pasti.</p>`;
}

export async function renderRecipes(view) {
  const recipes = await listRecipes();

  const avg = recipes.length
    ? recipes.reduce((a, r) => a + num(r.totals?.kcal) / Math.max(1, num(r.servings, 1)), 0) /
      recipes.length
    : 0;

  view.innerHTML = `<div id="recipes-root">
    <div class="grid grid--stats">
      ${statHTML({ label: 'Ricette tue', value: fmt(recipes.length), tone: 'grape' })}
      ${statHTML({ label: 'Media per porzione', value: fmt(avg), unit: 'kcal', tone: 'kcal' })}
      ${statHTML({
        label: 'Idee pronte',
        tone: 'protein',
        value: fmt(filterIdeas({}).length),
        hint: 'Cercabili per nome o ingrediente'
      })}
    </div>

    <div class="chips" style="margin:22px 0 14px" id="rec-tabs" role="tablist">
      <button class="chip" type="button" data-panel="idee" aria-pressed="${panelOpen === 'idee'}">💡 Idee</button>
      <button class="chip" type="button" data-panel="mie" aria-pressed="${panelOpen === 'mie'}">📒 Le mie ricette</button>
    </div>

    <div id="rec-panel">${
      panelOpen === 'idee' ? ideasPanelHTML() : mineePanelHTML(recipes)
    }</div>

    <button class="addbtn addbtn--fab" type="button" id="new-recipe" aria-label="Nuova ricetta">${PLUS_SVG}</button>
  </div>`;

  const panelBox = view.querySelector('#rec-panel');
  const repaint = () => {
    panelBox.innerHTML = panelOpen === 'idee' ? ideasPanelHTML() : mineePanelHTML(recipes);
  };

  view.querySelector('#rec-tabs').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-panel]');
    if (!btn) return;
    panelOpen = btn.dataset.panel;
    view
      .querySelectorAll('[data-panel]')
      .forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
    repaint();
  });

  // Ricerca fra le idee: ridisegno solo la parte sotto per non perdere il focus.
  const onIdeaInput = debounce((value) => {
    ideaFilters.text = value;
    repaint();
    const q = panelBox.querySelector('#idea-q');
    if (q) {
      q.focus();
      q.setSelectionRange(q.value.length, q.value.length);
    }
  }, 250);

  panelBox.addEventListener('input', (e) => {
    if (e.target.id === 'idea-q') onIdeaInput(e.target.value);
  });

  panelBox.addEventListener('click', async (e) => {
    const tag = e.target.closest('[data-tag]');
    if (tag) {
      ideaFilters.tag = tag.dataset.tag;
      return repaint();
    }
    const card = e.target.closest('[data-idea]');
    if (card) {
      const shown = filterIdeas(ideaFilters);
      return ideaSheet(shown[Number(card.dataset.idea)]);
    }

    const edit = e.target.closest('[data-edit]');
    if (edit) {
      const r = recipes.find((x) => x.id === edit.dataset.edit);
      if (r) recipeEditor(r, render);
      return;
    }

    const del = e.target.closest('[data-del]');
    if (del) {
      const r = recipes.find((x) => x.id === del.dataset.del);
      const ok = await confirmSheet({
        title: 'Eliminare la ricetta?',
        text: `"${r?.name || ''}" sparirà anche dai suggerimenti. I pasti già registrati restano.`
      });
      if (!ok) return;
      await deleteRecipe(del.dataset.del);
      invalidateLocalIndex();
      toast('Ricetta eliminata', 'ok');
      render();
    }
  });

  view.querySelector('#new-recipe').addEventListener('click', () => recipeEditor(null, render));
}
