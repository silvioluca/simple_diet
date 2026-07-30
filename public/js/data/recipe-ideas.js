// ---------------------------------------------------------------------------
// Idee ricette: collezione curata di piatti dietetici italiani.
//
// Perché locale e non da un sito: nessuna API di ricette pubblica offre
// contemporaneamente CORS aperto, quantità in grammi e dati nutrizionali.
// TheMealDB non ha macro e usa misure in testo libero ("1 cup"); Spoonacular
// ed Edamam richiedono una chiave che nel JS sarebbe pubblica; i siti di
// ricette normali non abilitano CORS e il browser non può leggerli.
//
// Gli ingredienti citano i nomi ESATTI di foods-base.js: le macro non sono
// duplicate qui, vengono calcolate da quella tabella. Una sola fonte di verità.
// Un test verifica che ogni ingrediente sia risolvibile.
// ---------------------------------------------------------------------------

/** ingredienti: [nomeInTabella, grammiPerLaRicettaIntera] */
export const RECIPE_IDEAS = [
  // ---------------- Colazioni ----------------
  {
    id: 'porridge-mirtilli',
    name: 'Porridge d’avena con mirtilli',
    tags: ['colazione', 'vegetariana', 'veloce'],
    minutes: 10,
    servings: 1,
    ingredients: [
      ['Fiocchi d’avena', 60],
      ['Latte parzialmente scremato', 200],
      ['Mirtilli', 80],
      ['Mandorle', 15],
      ['Cannella', 1]
    ],
    steps: 'Scalda il latte con l’avena a fuoco basso per 5 minuti mescolando. Togli dal fuoco, aggiungi mirtilli, mandorle a lamelle e cannella.'
  },
  {
    id: 'yogurt-bowl-proteica',
    name: 'Bowl di yogurt greco e frutta',
    tags: ['colazione', 'proteica', 'veloce', 'senza cottura'],
    minutes: 5,
    servings: 1,
    ingredients: [
      ['Yogurt greco 0%', 200],
      ['Fragole', 100],
      ['Semi di chia', 10],
      ['Noci', 15],
      ['Miele', 10]
    ],
    steps: 'Versa lo yogurt in una ciotola. Completa con fragole a fette, semi di chia, noci spezzettate e un filo di miele.'
  },
  {
    id: 'pancake-proteici-banana',
    name: 'Pancake proteici alla banana',
    tags: ['colazione', 'proteica'],
    minutes: 15,
    servings: 1,
    ingredients: [
      ['Banana', 100],
      ['Uovo intero', 55],
      ['Albume', 60],
      ['Fiocchi d’avena', 40],
      ['Proteine whey in polvere', 15]
    ],
    steps: 'Frulla tutto fino a ottenere una pastella liscia. Cuoci piccoli pancake in padella antiaderente, 2 minuti per lato.'
  },
  {
    id: 'toast-avocado-uovo',
    name: 'Toast con avocado e uovo',
    tags: ['colazione', 'vegetariana', 'veloce'],
    minutes: 10,
    servings: 1,
    ingredients: [
      ['Pane integrale', 70],
      ['Avocado', 60],
      ['Uovo intero', 55],
      ['Limone', 5],
      ['Pepe nero', 1]
    ],
    steps: 'Tosta il pane. Schiaccia l’avocado con limone e pepe, spalmalo sul pane e adagia sopra l’uovo in camicia.'
  },
  {
    id: 'overnight-oats',
    name: 'Overnight oats alle mele',
    tags: ['colazione', 'vegetariana', 'senza cottura', 'meal prep'],
    minutes: 5,
    servings: 1,
    ingredients: [
      ['Fiocchi d’avena', 50],
      ['Yogurt greco 0%', 125],
      ['Latte parzialmente scremato', 80],
      ['Mela', 100],
      ['Cannella', 1]
    ],
    steps: 'Mescola avena, yogurt e latte in un barattolo. Aggiungi mela a cubetti e cannella, lascia in frigo tutta la notte.'
  },

  // ---------------- Primi leggeri ----------------
  {
    id: 'pasta-integrale-zucchine-gamberi',
    name: 'Pasta integrale zucchine e gamberi',
    tags: ['pranzo', 'proteica', 'veloce'],
    minutes: 20,
    servings: 2,
    ingredients: [
      ['Pasta integrale (c)', 160],
      ['Gamberi (c)', 200],
      ['Zucchine', 250],
      ['Aglio', 5],
      ['Olio extravergine d’oliva', 20],
      ['Prezzemolo', 5]
    ],
    steps: 'Salta zucchine a rondelle con aglio e olio, aggiungi i gamberi 3 minuti. Manteca la pasta scolata al dente con un mestolo di acqua di cottura e il prezzemolo.'
  },
  {
    id: 'pasta-pomodorini-ricotta',
    name: 'Pasta con pomodorini e ricotta',
    tags: ['pranzo', 'vegetariana', 'veloce'],
    minutes: 15,
    servings: 2,
    ingredients: [
      ['Pasta di semola (c)', 160],
      ['Pomodorini', 250],
      ['Ricotta vaccina', 120],
      ['Basilico fresco', 8],
      ['Olio extravergine d’oliva', 15]
    ],
    steps: 'Fai appassire i pomodorini in padella con l’olio. Stempera la ricotta con acqua di cottura e manteca la pasta fuori dal fuoco con il basilico.'
  },
  {
    id: 'farro-verdure',
    name: 'Insalata di farro e verdure',
    tags: ['pranzo', 'vegetariana', 'meal prep', 'fredda'],
    minutes: 30,
    servings: 2,
    ingredients: [
      ['Farro perlato (c)', 140],
      ['Pomodorini', 150],
      ['Zucchine', 150],
      ['Feta', 80],
      ['Olive nere', 40],
      ['Olio extravergine d’oliva', 20],
      ['Origano secco', 2]
    ],
    steps: 'Lessa il farro e raffreddalo. Griglia le zucchine a dadini. Unisci tutto con pomodorini, feta sbriciolata, olive, olio e origano.'
  },
  {
    id: 'quinoa-ceci-curry',
    name: 'Quinoa con ceci al curry',
    tags: ['pranzo', 'vegana', 'proteica', 'meal prep'],
    minutes: 25,
    servings: 2,
    ingredients: [
      ['Quinoa (c)', 140],
      ['Ceci in scatola', 240],
      ['Spinaci', 150],
      ['Cipolla', 60],
      ['Curry in polvere', 5],
      ['Olio extravergine d’oliva', 15]
    ],
    steps: 'Lessa la quinoa. Soffriggi la cipolla, unisci ceci e curry, poi gli spinaci fino ad appassire. Mescola con la quinoa.'
  },
  {
    id: 'zuppa-lenticchie',
    name: 'Zuppa di lenticchie e verdure',
    tags: ['cena', 'vegana', 'one-pot', 'inverno'],
    minutes: 40,
    servings: 3,
    ingredients: [
      ['Lenticchie (c)', 180],
      ['Carote', 150],
      ['Sedano', 100],
      ['Cipolla', 80],
      ['Passata di pomodoro', 200],
      ['Olio extravergine d’oliva', 25],
      ['Rosmarino', 3]
    ],
    steps: 'Soffriggi il trito di carote, sedano e cipolla. Aggiungi lenticchie, passata e acqua a coprire. Cuoci 30 minuti con il rosmarino.'
  },
  {
    id: 'risotto-zucca-leggero',
    name: 'Risotto alla zucca leggero',
    tags: ['pranzo', 'vegetariana', 'autunno'],
    minutes: 35,
    servings: 2,
    ingredients: [
      ['Riso bianco (c)', 160],
      ['Zucca', 300],
      ['Cipolla', 50],
      ['Parmigiano Reggiano', 30],
      ['Olio extravergine d’oliva', 15],
      ['Brodo vegetale', 500]
    ],
    steps: 'Rosola cipolla e zucca a cubetti, tosta il riso e porta a cottura con il brodo. Manteca fuori dal fuoco con il parmigiano.'
  },
  {
    id: 'pasta-legumi-pomodoro',
    name: 'Pasta di legumi al pomodoro',
    tags: ['pranzo', 'vegana', 'proteica', 'veloce'],
    minutes: 15,
    servings: 2,
    ingredients: [
      ['Pasta di legumi (c)', 160],
      ['Passata di pomodoro', 250],
      ['Aglio', 5],
      ['Basilico fresco', 8],
      ['Olio extravergine d’oliva', 15]
    ],
    steps: 'Scalda la passata con aglio e olio per 10 minuti. Scola la pasta e mantecala nel sugo con il basilico.'
  },

  // ---------------- Secondi di pesce ----------------
  {
    id: 'merluzzo-forno-patate',
    name: 'Merluzzo al forno con patate',
    tags: ['cena', 'proteica', 'one-pot'],
    minutes: 40,
    servings: 2,
    ingredients: [
      ['Merluzzo (c)', 400],
      ['Patate', 400],
      ['Pomodorini', 150],
      ['Olive nere', 40],
      ['Olio extravergine d’oliva', 20],
      ['Rosmarino', 3]
    ],
    steps: 'Disponi le patate a fette in teglia, inforna 15 minuti a 200°C. Aggiungi merluzzo, pomodorini, olive e rosmarino, cuoci altri 15 minuti.'
  },
  {
    id: 'salmone-asparagi',
    name: 'Salmone e asparagi al forno',
    tags: ['cena', 'proteica', 'low carb', 'veloce'],
    minutes: 25,
    servings: 2,
    ingredients: [
      ['Salmone (c)', 300],
      ['Asparagi', 300],
      ['Limone', 30],
      ['Olio extravergine d’oliva', 15],
      ['Pepe nero', 1]
    ],
    steps: 'Adagia salmone e asparagi su carta forno, condisci con olio, limone e pepe. Cuoci 18 minuti a 200°C.'
  },
  {
    id: 'insalata-tonno-fagioli',
    name: 'Insalata di tonno e fagioli',
    tags: ['pranzo', 'proteica', 'senza cottura', 'veloce'],
    minutes: 10,
    servings: 2,
    ingredients: [
      ['Tonno in scatola al naturale', 160],
      ['Fagioli in scatola', 300],
      ['Cipolla', 50],
      ['Pomodorini', 150],
      ['Olio extravergine d’oliva', 20],
      ['Prezzemolo', 5]
    ],
    steps: 'Sciacqua i fagioli, uniscili al tonno sgocciolato, alla cipolla affettata sottile e ai pomodorini. Condisci con olio e prezzemolo.'
  },
  {
    id: 'orata-verdure',
    name: 'Orata al cartoccio con verdure',
    tags: ['cena', 'proteica', 'low carb'],
    minutes: 35,
    servings: 2,
    ingredients: [
      ['Orata (c)', 400],
      ['Zucchine', 200],
      ['Carote', 150],
      ['Limone', 30],
      ['Olio extravergine d’oliva', 15],
      ['Timo', 2]
    ],
    steps: 'Taglia le verdure a julienne, disponile con l’orata nel cartoccio con limone, olio e timo. Cuoci 25 minuti a 190°C.'
  },
  {
    id: 'polpette-tonno-forno',
    name: 'Polpette di tonno al forno',
    tags: ['cena', 'proteica', 'meal prep'],
    minutes: 30,
    servings: 2,
    ingredients: [
      ['Tonno in scatola al naturale', 240],
      ['Ricotta vaccina', 80],
      ['Uovo intero', 55],
      ['Pangrattato', 40],
      ['Parmigiano Reggiano', 20],
      ['Prezzemolo', 5]
    ],
    steps: 'Impasta tutti gli ingredienti, forma le polpette e disponile su carta forno. Cuoci 20 minuti a 190°C girandole a metà.'
  },

  // ---------------- Secondi di carne ----------------
  {
    id: 'pollo-limone-rosmarino',
    name: 'Pollo al limone e rosmarino',
    tags: ['cena', 'proteica', 'low carb', 'veloce'],
    minutes: 20,
    servings: 2,
    ingredients: [
      ['Petto di pollo (c)', 400],
      ['Limone', 50],
      ['Rosmarino', 3],
      ['Olio extravergine d’oliva', 15],
      ['Aglio', 5]
    ],
    steps: 'Scotta il pollo a fette in padella calda. Sfuma con succo di limone, aggiungi aglio e rosmarino e completa la cottura 5 minuti.'
  },
  {
    id: 'pollo-verdure-wok',
    name: 'Pollo e verdure saltate al wok',
    tags: ['cena', 'proteica', 'veloce', 'one-pot'],
    minutes: 20,
    servings: 2,
    ingredients: [
      ['Petto di pollo (c)', 350],
      ['Peperoni', 200],
      ['Zucchine', 200],
      ['Carote', 100],
      ['Salsa di soia', 25],
      ['Olio di semi', 15],
      ['Zenzero fresco', 8]
    ],
    steps: 'Salta il pollo a strisce a fuoco vivo, mettilo da parte. Cuoci le verdure 5 minuti, rimetti il pollo e sfuma con soia e zenzero.'
  },
  {
    id: 'tacchino-insalata',
    name: 'Insalatona con tacchino e avocado',
    tags: ['pranzo', 'proteica', 'senza cottura', 'low carb'],
    minutes: 10,
    servings: 1,
    ingredients: [
      ['Fesa di tacchino a fette', 120],
      ['Insalata mista', 100],
      ['Avocado', 70],
      ['Pomodorini', 100],
      ['Semi di zucca', 15],
      ['Olio extravergine d’oliva', 10]
    ],
    steps: 'Componi l’insalata con tacchino a striscioline, avocado a fette, pomodorini e semi di zucca. Condisci con olio.'
  },
  {
    id: 'polpette-manzo-sugo',
    name: 'Polpette magre al sugo',
    tags: ['cena', 'proteica', 'meal prep'],
    minutes: 40,
    servings: 3,
    ingredients: [
      ['Macinato di manzo 5% grassi', 450],
      ['Uovo intero', 55],
      ['Pangrattato', 50],
      ['Parmigiano Reggiano', 30],
      ['Passata di pomodoro', 400],
      ['Olio extravergine d’oliva', 20],
      ['Basilico fresco', 8]
    ],
    steps: 'Impasta carne, uovo, pangrattato e parmigiano. Forma le polpette, rosolale e cuocile 25 minuti nella passata con il basilico.'
  },
  {
    id: 'bresaola-rucola-grana',
    name: 'Bresaola, rucola e grana',
    tags: ['pranzo', 'proteica', 'senza cottura', 'veloce', 'low carb'],
    minutes: 5,
    servings: 1,
    ingredients: [
      ['Bresaola', 80],
      ['Rucola', 40],
      ['Grana Padano', 20],
      ['Limone', 15],
      ['Olio extravergine d’oliva', 10]
    ],
    steps: 'Disponi la bresaola a raggiera, copri con rucola e scaglie di grana. Condisci con olio e limone.'
  },

  // ---------------- Vegetariane e vegane ----------------
  {
    id: 'frittata-zucchine-forno',
    name: 'Frittata di zucchine al forno',
    tags: ['cena', 'vegetariana', 'proteica', 'meal prep'],
    minutes: 30,
    servings: 2,
    ingredients: [
      ['Uovo intero', 165],
      ['Albume', 100],
      ['Zucchine', 300],
      ['Parmigiano Reggiano', 30],
      ['Cipolla', 50],
      ['Olio extravergine d’oliva', 10]
    ],
    steps: 'Fai appassire zucchine e cipolla. Unisci uova, albumi e parmigiano, versa in teglia e cuoci 20 minuti a 180°C.'
  },
  {
    id: 'tofu-verdure',
    name: 'Tofu saltato con broccoli',
    tags: ['cena', 'vegana', 'proteica', 'low carb'],
    minutes: 20,
    servings: 2,
    ingredients: [
      ['Tofu', 300],
      ['Broccoli', 300],
      ['Salsa di soia', 25],
      ['Aglio', 5],
      ['Semi di sesamo', 10],
      ['Olio di semi', 15]
    ],
    steps: 'Rosola il tofu a cubetti finché dorato. Aggiungi broccoli sbollentati e aglio, sfuma con la soia e finisci col sesamo.'
  },
  {
    id: 'burger-lenticchie',
    name: 'Burger di lenticchie',
    tags: ['cena', 'vegana', 'proteica', 'meal prep'],
    minutes: 35,
    servings: 3,
    ingredients: [
      ['Lenticchie (c)', 200],
      ['Carote', 100],
      ['Cipolla', 60],
      ['Pangrattato', 60],
      ['Paprika', 3],
      ['Olio extravergine d’oliva', 20]
    ],
    steps: 'Lessa le lenticchie e frullale grossolanamente con carote e cipolla. Aggiungi pangrattato e paprika, forma i burger e cuoci in padella 4 minuti per lato.'
  },
  {
    id: 'parmigiana-leggera',
    name: 'Parmigiana di melanzane al forno',
    tags: ['cena', 'vegetariana', 'domenica'],
    minutes: 60,
    servings: 3,
    ingredients: [
      ['Melanzane', 600],
      ['Passata di pomodoro', 400],
      ['Mozzarella light', 200],
      ['Parmigiano Reggiano', 60],
      ['Olio extravergine d’oliva', 25],
      ['Basilico fresco', 10]
    ],
    steps: 'Griglia le melanzane invece di friggerle. Alterna in teglia con passata, mozzarella e parmigiano. Cuoci 35 minuti a 180°C.'
  },
  {
    id: 'ceci-spinaci',
    name: 'Ceci e spinaci in umido',
    tags: ['cena', 'vegana', 'one-pot', 'veloce'],
    minutes: 20,
    servings: 2,
    ingredients: [
      ['Ceci in scatola', 300],
      ['Spinaci', 250],
      ['Passata di pomodoro', 150],
      ['Aglio', 5],
      ['Curcuma', 3],
      ['Olio extravergine d’oliva', 20]
    ],
    steps: 'Soffriggi l’aglio, unisci ceci, passata e curcuma. Dopo 10 minuti aggiungi gli spinaci e cuoci finché appassiscono.'
  },
  {
    id: 'vellutata-zucca-zenzero',
    name: 'Vellutata di zucca e zenzero',
    tags: ['cena', 'vegana', 'inverno', 'leggera'],
    minutes: 35,
    servings: 2,
    ingredients: [
      ['Zucca', 600],
      ['Patate', 150],
      ['Cipolla', 60],
      ['Zenzero fresco', 10],
      ['Olio extravergine d’oliva', 15],
      ['Brodo vegetale', 400]
    ],
    steps: 'Cuoci zucca, patate e cipolla nel brodo per 25 minuti. Frulla con lo zenzero e completa con un filo di olio a crudo.'
  },
  {
    id: 'insalata-quinoa-avocado',
    name: 'Insalata di quinoa e avocado',
    tags: ['pranzo', 'vegana', 'fredda', 'meal prep'],
    minutes: 25,
    servings: 2,
    ingredients: [
      ['Quinoa (c)', 120],
      ['Avocado', 120],
      ['Pomodorini', 150],
      ['Mais dolce', 80],
      ['Limone', 20],
      ['Olio extravergine d’oliva', 15],
      ['Prezzemolo', 5]
    ],
    steps: 'Lessa la quinoa e falla raffreddare. Unisci avocado a cubetti, pomodorini, mais e condisci con limone, olio e prezzemolo.'
  },
  {
    id: 'peperoni-ripieni-riso',
    name: 'Peperoni ripieni di riso',
    tags: ['cena', 'vegetariana', 'estate'],
    minutes: 50,
    servings: 2,
    ingredients: [
      ['Peperoni', 400],
      ['Riso bianco (c)', 100],
      ['Pomodorini', 150],
      ['Parmigiano Reggiano', 30],
      ['Olio extravergine d’oliva', 20],
      ['Basilico fresco', 8]
    ],
    steps: 'Lessa il riso a metà cottura e condiscilo con pomodorini, parmigiano e basilico. Riempi i peperoni e inforna 35 minuti a 180°C.'
  },

  // ---------------- Contorni e piatti freddi ----------------
  {
    id: 'insalata-finocchi-arance',
    name: 'Insalata di finocchi e arance',
    tags: ['contorno', 'vegana', 'senza cottura', 'inverno'],
    minutes: 10,
    servings: 2,
    ingredients: [
      ['Finocchio', 300],
      ['Arancia', 200],
      ['Olive nere', 40],
      ['Olio extravergine d’oliva', 15],
      ['Pepe nero', 1]
    ],
    steps: 'Affetta i finocchi sottilissimi, pela le arance a vivo. Unisci le olive e condisci con olio e pepe.'
  },
  {
    id: 'verdure-grigliate',
    name: 'Verdure grigliate miste',
    tags: ['contorno', 'vegana', 'estate', 'meal prep'],
    minutes: 25,
    servings: 2,
    ingredients: [
      ['Zucchine', 250],
      ['Melanzane', 250],
      ['Peperoni', 200],
      ['Olio extravergine d’oliva', 20],
      ['Origano secco', 2],
      ['Aglio', 5]
    ],
    steps: 'Taglia le verdure a fette spesse e grigliale. Condisci a caldo con olio, aglio tritato e origano.'
  },
  {
    id: 'patate-forno-rosmarino',
    name: 'Patate al forno al rosmarino',
    tags: ['contorno', 'vegana'],
    minutes: 45,
    servings: 2,
    ingredients: [
      ['Patate', 500],
      ['Olio extravergine d’oliva', 20],
      ['Rosmarino', 4],
      ['Sale', 2],
      ['Paprika', 2]
    ],
    steps: 'Taglia le patate a spicchi, condiscile con olio, rosmarino e paprika. Cuoci 35 minuti a 200°C girando a metà.'
  },
  {
    id: 'caponata-leggera',
    name: 'Caponata leggera',
    tags: ['contorno', 'vegana', 'estate', 'meal prep'],
    minutes: 40,
    servings: 3,
    ingredients: [
      ['Melanzane', 500],
      ['Sedano', 120],
      ['Cipolla', 100],
      ['Passata di pomodoro', 200],
      ['Olive verdi', 50],
      ['Aceto di vino', 20],
      ['Olio extravergine d’oliva', 30]
    ],
    steps: 'Cuoci le melanzane al forno invece che fritte. Stufa sedano e cipolla, unisci passata, olive e melanzane, sfuma con l’aceto.'
  },
  {
    id: 'hummus-casalingo',
    name: 'Hummus di ceci',
    tags: ['contorno', 'vegana', 'senza cottura', 'meal prep'],
    minutes: 10,
    servings: 4,
    ingredients: [
      ['Ceci in scatola', 400],
      ['Tahina', 50],
      ['Limone', 40],
      ['Aglio', 5],
      ['Olio extravergine d’oliva', 30],
      ['Cumino', 0]
    ],
    steps: 'Frulla i ceci sciacquati con tahina, limone e aglio. Aggiungi acqua fredda fino alla consistenza voluta e completa con olio.'
  },

  // ---------------- Piatti unici ----------------
  {
    id: 'poke-salmone',
    name: 'Poke bowl con salmone',
    tags: ['pranzo', 'proteica', 'fredda'],
    minutes: 30,
    servings: 2,
    ingredients: [
      ['Riso basmati (c)', 140],
      ['Salmone (c)', 250],
      ['Avocado', 120],
      ['Edamame', 100],
      ['Carote', 80],
      ['Salsa di soia', 25],
      ['Semi di sesamo', 10]
    ],
    steps: 'Lessa il riso e raffreddalo. Disponi in ciotola con salmone a cubetti, avocado, edamame e carote julienne. Condisci con soia e sesamo.'
  },
  {
    id: 'buddha-bowl',
    name: 'Buddha bowl vegetariana',
    tags: ['pranzo', 'vegetariana', 'meal prep'],
    minutes: 35,
    servings: 2,
    ingredients: [
      ['Cous cous (c)', 120],
      ['Ceci in scatola', 240],
      ['Patate dolci', 250],
      ['Spinaci', 100],
      ['Feta', 60],
      ['Olio extravergine d’oliva', 20],
      ['Paprika', 3]
    ],
    steps: 'Arrostisci le patate dolci a cubetti con paprika. Idrata il cous cous. Componi la ciotola con ceci, spinaci crudi e feta.'
  },
  {
    id: 'chili-vegetariano',
    name: 'Chili vegetariano',
    tags: ['cena', 'vegana', 'one-pot', 'meal prep'],
    minutes: 40,
    servings: 3,
    ingredients: [
      ['Fagioli in scatola', 400],
      ['Mais dolce', 150],
      ['Peperoni', 200],
      ['Cipolla', 100],
      ['Passata di pomodoro', 400],
      ['Peperoncino in polvere', 3],
      ['Olio extravergine d’oliva', 20]
    ],
    steps: 'Stufa cipolla e peperoni, aggiungi passata, fagioli, mais e peperoncino. Cuoci a fuoco basso 25 minuti.'
  },
  {
    id: 'cous-cous-pollo-verdure',
    name: 'Cous cous con pollo e verdure',
    tags: ['pranzo', 'proteica', 'meal prep'],
    minutes: 30,
    servings: 2,
    ingredients: [
      ['Cous cous (c)', 140],
      ['Petto di pollo (c)', 300],
      ['Zucchine', 200],
      ['Carote', 120],
      ['Curry in polvere', 4],
      ['Olio extravergine d’oliva', 20]
    ],
    steps: 'Idrata il cous cous con acqua bollente. Salta il pollo a dadini con le verdure e il curry, poi unisci al cous cous sgranato.'
  },
  {
    id: 'uova-pomodoro-shakshuka',
    name: 'Uova al pomodoro in padella',
    tags: ['cena', 'vegetariana', 'veloce', 'one-pot'],
    minutes: 20,
    servings: 2,
    ingredients: [
      ['Uovo intero', 220],
      ['Passata di pomodoro', 350],
      ['Peperoni', 150],
      ['Cipolla', 60],
      ['Paprika', 3],
      ['Olio extravergine d’oliva', 20]
    ],
    steps: 'Stufa cipolla e peperoni, aggiungi passata e paprika. Crea degli incavi, rompici le uova e cuoci coperto 8 minuti.'
  },
  {
    id: 'insalata-riso-integrale',
    name: 'Insalata di riso integrale e tonno',
    tags: ['pranzo', 'proteica', 'fredda', 'meal prep'],
    minutes: 35,
    servings: 2,
    ingredients: [
      ['Riso integrale (c)', 140],
      ['Tonno in scatola al naturale', 160],
      ['Pomodorini', 150],
      ['Mais dolce', 100],
      ['Olive verdi', 40],
      ['Olio extravergine d’oliva', 20]
    ],
    steps: 'Lessa il riso integrale e raffreddalo sotto acqua corrente. Unisci tonno, pomodorini, mais e olive, condisci con olio.'
  },
  {
    id: 'zuppa-ceci-rosmarino',
    name: 'Zuppa di ceci al rosmarino',
    tags: ['cena', 'vegana', 'one-pot', 'inverno'],
    minutes: 35,
    servings: 2,
    ingredients: [
      ['Ceci in scatola', 400],
      ['Passata di pomodoro', 150],
      ['Cipolla', 80],
      ['Rosmarino', 4],
      ['Aglio', 5],
      ['Olio extravergine d’oliva', 25],
      ['Brodo vegetale', 400]
    ],
    steps: 'Soffriggi cipolla e aglio, unisci ceci, passata e brodo. Cuoci 20 minuti, frulla un terzo della zuppa per addensarla.'
  },
  {
    id: 'omelette-spinaci-feta',
    name: 'Omelette spinaci e feta',
    tags: ['cena', 'vegetariana', 'veloce', 'low carb', 'proteica'],
    minutes: 15,
    servings: 1,
    ingredients: [
      ['Uovo intero', 110],
      ['Albume', 60],
      ['Spinaci', 120],
      ['Feta', 40],
      ['Olio extravergine d’oliva', 8]
    ],
    steps: 'Appassisci gli spinaci in padella. Versa le uova sbattute, aggiungi la feta a cubetti e piega l’omelette a metà.'
  },
  {
    id: 'seitan-peperoni',
    name: 'Seitan ai peperoni',
    tags: ['cena', 'vegana', 'proteica', 'veloce'],
    minutes: 20,
    servings: 2,
    ingredients: [
      ['Seitan', 300],
      ['Peperoni', 300],
      ['Cipolla', 80],
      ['Passata di pomodoro', 150],
      ['Olio extravergine d’oliva', 20],
      ['Origano secco', 2]
    ],
    steps: 'Rosola il seitan a fette. Aggiungi peperoni e cipolla, poi la passata e l’origano. Cuoci 12 minuti.'
  },
  {
    id: 'frittata-albumi-verdure',
    name: 'Frittata di albumi e verdure',
    tags: ['cena', 'proteica', 'low carb', 'veloce'],
    minutes: 15,
    servings: 1,
    ingredients: [
      ['Albume', 200],
      ['Uovo intero', 55],
      ['Zucchine', 150],
      ['Pomodorini', 100],
      ['Parmigiano Reggiano', 15],
      ['Olio extravergine d’oliva', 8]
    ],
    steps: 'Salta zucchine e pomodorini. Versa albumi e uovo sbattuti col parmigiano e cuoci a fuoco basso coperto 6 minuti.'
  },
  {
    id: 'pollo-patate-dolci',
    name: 'Pollo e patate dolci al forno',
    tags: ['cena', 'proteica', 'one-pot', 'meal prep'],
    minutes: 45,
    servings: 2,
    ingredients: [
      ['Petto di pollo (c)', 400],
      ['Patate dolci', 400],
      ['Broccoli', 200],
      ['Paprika', 4],
      ['Olio extravergine d’oliva', 20],
      ['Rosmarino', 3]
    ],
    steps: 'Informa patate dolci e broccoli conditi 20 minuti a 200°C. Aggiungi il pollo con paprika e rosmarino e cuoci altri 18 minuti.'
  },
  {
    id: 'insalata-greca',
    name: 'Insalata greca',
    tags: ['pranzo', 'vegetariana', 'senza cottura', 'estate', 'low carb'],
    minutes: 10,
    servings: 2,
    ingredients: [
      ['Cetriolo', 250],
      ['Pomodoro', 250],
      ['Feta', 120],
      ['Olive nere', 60],
      ['Cipolla', 50],
      ['Olio extravergine d’oliva', 25],
      ['Origano secco', 2]
    ],
    steps: 'Taglia cetriolo e pomodori a pezzi grossi, unisci cipolla, olive e feta a cubi. Condisci con olio e origano.'
  },
  {
    id: 'crema-funghi-orzo',
    name: 'Orzotto ai funghi',
    tags: ['cena', 'vegetariana', 'autunno'],
    minutes: 40,
    servings: 2,
    ingredients: [
      ['Orzo perlato (c)', 140],
      ['Funghi champignon', 300],
      ['Cipolla', 60],
      ['Parmigiano Reggiano', 30],
      ['Olio extravergine d’oliva', 20],
      ['Prezzemolo', 5],
      ['Brodo vegetale', 500]
    ],
    steps: 'Rosola i funghi con la cipolla, tosta l’orzo e porta a cottura con il brodo. Manteca con parmigiano e prezzemolo.'
  },
  {
    id: 'gamberi-zucchine-limone',
    name: 'Gamberi, zucchine e limone',
    tags: ['cena', 'proteica', 'low carb', 'veloce'],
    minutes: 15,
    servings: 2,
    ingredients: [
      ['Gamberi (c)', 350],
      ['Zucchine', 300],
      ['Limone', 40],
      ['Aglio', 5],
      ['Olio extravergine d’oliva', 18],
      ['Prezzemolo', 5]
    ],
    steps: 'Salta le zucchine a julienne con aglio e olio. Unisci i gamberi 4 minuti, sfuma con il limone e completa col prezzemolo.'
  },
  {
    id: 'sformato-broccoli',
    name: 'Sformato di broccoli e ricotta',
    tags: ['cena', 'vegetariana', 'low carb', 'meal prep'],
    minutes: 45,
    servings: 3,
    ingredients: [
      ['Broccoli', 500],
      ['Ricotta vaccina', 250],
      ['Uovo intero', 110],
      ['Parmigiano Reggiano', 40],
      ['Pangrattato', 30],
      ['Olio extravergine d’oliva', 15]
    ],
    steps: 'Lessa i broccoli e schiacciali. Mescola con ricotta, uova e parmigiano, versa in teglia, spolvera di pangrattato e cuoci 30 minuti a 180°C.'
  },
  {
    id: 'tempeh-verdure',
    name: 'Tempeh con verdure croccanti',
    tags: ['cena', 'vegana', 'proteica'],
    minutes: 25,
    servings: 2,
    ingredients: [
      ['Tempeh', 250],
      ['Cavolo cappuccio', 200],
      ['Carote', 120],
      ['Salsa di soia', 25],
      ['Zenzero fresco', 8],
      ['Olio di semi', 15]
    ],
    steps: 'Rosola il tempeh a fette. Salta cavolo e carote a julienne 5 minuti, unisci il tempeh, la soia e lo zenzero.'
  },

  // ---------------- Aggiunte ----------------
  {
    id: 'yogurt-cacao-banana',
    name: 'Yogurt proteico al cacao',
    tags: ['colazione', 'proteica', 'veloce', 'senza cottura'],
    minutes: 5,
    servings: 1,
    ingredients: [
      ['Yogurt greco 0%', 200],
      ['Cacao amaro in polvere', 8],
      ['Banana', 100],
      ['Burro di arachidi', 15],
      ['Miele', 8]
    ],
    steps: 'Mescola yogurt e cacao fino a colore uniforme. Completa con banana a rondelle, burro di arachidi e miele.'
  },
  {
    id: 'pane-ricotta-miele',
    name: 'Pane, ricotta e miele',
    tags: ['colazione', 'vegetariana', 'veloce'],
    minutes: 5,
    servings: 1,
    ingredients: [
      ['Pane integrale', 80],
      ['Ricotta vaccina', 100],
      ['Miele', 15],
      ['Noci', 15],
      ['Cannella', 1]
    ],
    steps: 'Tosta il pane, spalma la ricotta, completa con miele, noci spezzettate e una spolverata di cannella.'
  },
  {
    id: 'crema-zucchine-menta',
    name: 'Vellutata di zucchine e menta',
    tags: ['cena', 'vegetariana', 'leggera', 'veloce'],
    minutes: 25,
    servings: 2,
    ingredients: [
      ['Zucchine', 600],
      ['Patate', 150],
      ['Cipolla', 60],
      ['Menta fresca', 8],
      ['Olio extravergine d’oliva', 15],
      ['Brodo vegetale', 400]
    ],
    steps: 'Cuoci zucchine, patate e cipolla nel brodo per 18 minuti. Frulla con la menta e completa con olio a crudo.'
  },
  {
    id: 'pollo-broccoli-riso',
    name: 'Pollo, broccoli e riso',
    tags: ['pranzo', 'proteica', 'meal prep', 'one-pot'],
    minutes: 30,
    servings: 2,
    ingredients: [
      ['Petto di pollo (c)', 350],
      ['Riso basmati (c)', 140],
      ['Broccoli', 300],
      ['Aglio', 5],
      ['Olio extravergine d’oliva', 18],
      ['Salsa di soia', 20]
    ],
    steps: 'Lessa il riso e sbollenta i broccoli. Salta il pollo a dadini con aglio e olio, unisci tutto e sfuma con la soia.'
  },
  {
    id: 'insalata-farro-tonno',
    name: 'Insalata di farro e tonno',
    tags: ['pranzo', 'proteica', 'fredda', 'meal prep'],
    minutes: 30,
    servings: 2,
    ingredients: [
      ['Farro perlato (c)', 140],
      ['Tonno in scatola al naturale', 160],
      ['Pomodorini', 150],
      ['Rucola', 50],
      ['Olive nere', 40],
      ['Olio extravergine d’oliva', 20]
    ],
    steps: 'Lessa il farro e raffreddalo. Uniscilo a tonno, pomodorini, rucola e olive, condisci con olio.'
  },
  {
    id: 'uova-avocado-pomodorini',
    name: 'Uova strapazzate con avocado',
    tags: ['colazione', 'proteica', 'veloce', 'low carb'],
    minutes: 10,
    servings: 1,
    ingredients: [
      ['Uovo intero', 165],
      ['Avocado', 70],
      ['Pomodorini', 100],
      ['Pane integrale', 60],
      ['Olio extravergine d’oliva', 8]
    ],
    steps: 'Strapazza le uova a fuoco basso. Servi con avocado a fette, pomodorini e pane tostato.'
  },
  {
    id: 'salmone-quinoa-asparagi',
    name: 'Salmone, quinoa e asparagi',
    tags: ['cena', 'proteica', 'meal prep'],
    minutes: 30,
    servings: 2,
    ingredients: [
      ['Salmone (c)', 300],
      ['Quinoa (c)', 120],
      ['Asparagi', 250],
      ['Limone', 30],
      ['Olio extravergine d’oliva', 15],
      ['Aneto', 3]
    ],
    steps: 'Lessa la quinoa. Cuoci salmone e asparagi in forno 18 minuti a 190°C, completa con limone e aneto.'
  },
  {
    id: 'zuppa-orzo-verdure',
    name: 'Zuppa di orzo e verdure',
    tags: ['cena', 'vegana', 'one-pot', 'inverno'],
    minutes: 40,
    servings: 3,
    ingredients: [
      ['Orzo perlato (c)', 150],
      ['Carote', 150],
      ['Sedano', 100],
      ['Zucca', 250],
      ['Cipolla', 80],
      ['Olio extravergine d’oliva', 25],
      ['Brodo vegetale', 600]
    ],
    steps: 'Stufa il trito di verdure, unisci orzo e zucca a cubetti, copri col brodo e cuoci 30 minuti.'
  },
  {
    id: 'spiedini-pollo-peperoni',
    name: 'Spiedini di pollo e peperoni',
    tags: ['cena', 'proteica', 'low carb', 'estate'],
    minutes: 25,
    servings: 2,
    ingredients: [
      ['Petto di pollo (c)', 400],
      ['Peperoni', 250],
      ['Cipolla', 100],
      ['Paprika', 4],
      ['Olio extravergine d’oliva', 18],
      ['Limone', 30]
    ],
    steps: 'Alterna pollo, peperoni e cipolla sugli spiedini. Condisci con olio, paprika e limone e cuoci alla piastra 12 minuti.'
  },
  {
    id: 'melanzane-ripiene-quinoa',
    name: 'Melanzane ripiene di quinoa',
    tags: ['cena', 'vegetariana', 'estate'],
    minutes: 50,
    servings: 2,
    ingredients: [
      ['Melanzane', 500],
      ['Quinoa (c)', 100],
      ['Pomodorini', 150],
      ['Parmigiano Reggiano', 30],
      ['Basilico fresco', 8],
      ['Olio extravergine d’oliva', 20]
    ],
    steps: 'Svuota le melanzane e infornale 15 minuti. Riempi con quinoa lessa, pomodorini e parmigiano, cuoci altri 20 minuti.'
  },
  {
    id: 'pasta-fredda-mozzarella',
    name: 'Pasta fredda con mozzarella',
    tags: ['pranzo', 'vegetariana', 'fredda', 'estate', 'veloce'],
    minutes: 20,
    servings: 2,
    ingredients: [
      ['Pasta di semola (c)', 160],
      ['Mozzarella light', 150],
      ['Pomodorini', 200],
      ['Basilico fresco', 10],
      ['Olive nere', 40],
      ['Olio extravergine d’oliva', 20]
    ],
    steps: 'Lessa la pasta e raffreddala sotto acqua corrente. Unisci mozzarella a cubetti, pomodorini, olive e basilico.'
  },
  {
    id: 'frittata-spinaci-patate',
    name: 'Frittata di spinaci e patate',
    tags: ['cena', 'vegetariana', 'proteica', 'meal prep'],
    minutes: 30,
    servings: 2,
    ingredients: [
      ['Uovo intero', 220],
      ['Spinaci', 250],
      ['Patate', 200],
      ['Cipolla', 50],
      ['Parmigiano Reggiano', 25],
      ['Olio extravergine d’oliva', 12]
    ],
    steps: 'Lessa le patate a cubetti e appassisci gli spinaci. Unisci alle uova sbattute col parmigiano e cuoci in padella coperta.'
  },
  {
    id: 'bowl-ceci-tahina',
    name: 'Bowl di ceci e tahina',
    tags: ['pranzo', 'vegana', 'senza cottura', 'veloce'],
    minutes: 10,
    servings: 2,
    ingredients: [
      ['Ceci in scatola', 300],
      ['Cetriolo', 200],
      ['Pomodorini', 150],
      ['Tahina', 30],
      ['Limone', 30],
      ['Prezzemolo', 8]
    ],
    steps: 'Sciacqua i ceci e uniscili a cetriolo e pomodorini a cubetti. Condisci con tahina stemperata nel limone e prezzemolo.'
  },
  {
    id: 'merluzzo-zucchine-limone',
    name: 'Merluzzo con zucchine al limone',
    tags: ['cena', 'proteica', 'low carb', 'veloce'],
    minutes: 20,
    servings: 2,
    ingredients: [
      ['Merluzzo (c)', 400],
      ['Zucchine', 300],
      ['Limone', 40],
      ['Aglio', 5],
      ['Olio extravergine d’oliva', 15],
      ['Prezzemolo', 5]
    ],
    steps: 'Salta le zucchine a rondelle con aglio e olio. Adagia il merluzzo, copri e cuoci 8 minuti, sfuma col limone.'
  },
  {
    id: 'riso-venere-gamberi',
    name: 'Riso venere con gamberi',
    tags: ['pranzo', 'proteica', 'fredda'],
    minutes: 35,
    servings: 2,
    ingredients: [
      ['Riso venere (c)', 140],
      ['Gamberi (c)', 250],
      ['Zucchine', 200],
      ['Limone', 30],
      ['Olio extravergine d’oliva', 18],
      ['Prezzemolo', 5]
    ],
    steps: 'Lessa il riso venere. Salta gamberi e zucchine a dadini, unisci al riso e condisci con limone e prezzemolo.'
  },
  {
    id: 'tacos-fagioli',
    name: 'Tacos di fagioli',
    tags: ['cena', 'vegana', 'veloce'],
    minutes: 20,
    servings: 2,
    ingredients: [
      ['Tortilla di grano', 120],
      ['Fagioli in scatola', 250],
      ['Mais dolce', 100],
      ['Pomodoro', 150],
      ['Avocado', 80],
      ['Peperoncino in polvere', 3]
    ],
    steps: 'Scalda i fagioli col peperoncino e schiacciali grossolanamente. Farcisci le tortilla con fagioli, mais, pomodoro e avocado.'
  },
  {
    id: 'crema-piselli-menta',
    name: 'Vellutata di piselli e menta',
    tags: ['cena', 'vegana', 'leggera', 'veloce'],
    minutes: 20,
    servings: 2,
    ingredients: [
      ['Piselli freschi', 400],
      ['Patate', 120],
      ['Cipollotto', 60],
      ['Menta fresca', 6],
      ['Olio extravergine d’oliva', 15],
      ['Brodo vegetale', 350]
    ],
    steps: 'Cuoci piselli, patate e cipollotto nel brodo 15 minuti. Frulla con la menta e completa con olio a crudo.'
  },
  {
    id: 'tacchino-funghi',
    name: 'Tacchino ai funghi',
    tags: ['cena', 'proteica', 'low carb', 'veloce'],
    minutes: 20,
    servings: 2,
    ingredients: [
      ['Petto di tacchino (c)', 400],
      ['Funghi champignon', 300],
      ['Aglio', 5],
      ['Prezzemolo', 6],
      ['Olio extravergine d’oliva', 18],
      ['Vino bianco', 40]
    ],
    steps: 'Rosola il tacchino a fette, mettilo da parte. Salta i funghi con aglio, sfuma col vino, rimetti la carne e completa col prezzemolo.'
  },
  {
    id: 'insalata-polpo-patate',
    name: 'Insalata di polpo e patate',
    tags: ['pranzo', 'proteica', 'fredda'],
    minutes: 45,
    servings: 2,
    ingredients: [
      ['Polpo', 350],
      ['Patate', 300],
      ['Sedano', 80],
      ['Olive nere', 40],
      ['Limone', 30],
      ['Olio extravergine d’oliva', 20],
      ['Prezzemolo', 6]
    ],
    steps: 'Lessa polpo e patate, taglia entrambi a pezzi e falli raffreddare. Condisci con sedano, olive, limone, olio e prezzemolo.'
  },
  {
    id: 'lenticchie-riso-curry',
    name: 'Lenticchie e riso al curry',
    tags: ['cena', 'vegana', 'proteica', 'one-pot', 'meal prep'],
    minutes: 35,
    servings: 3,
    ingredients: [
      ['Lenticchie rosse decorticate (c)', 160],
      ['Riso integrale (c)', 120],
      ['Cipolla', 80],
      ['Curry in polvere', 6],
      ['Latte di cocco da bere', 200],
      ['Olio di semi', 15],
      ['Zenzero fresco', 8]
    ],
    steps: 'Soffriggi cipolla e zenzero, unisci lenticchie, curry e latte di cocco con acqua a coprire. Cuoci 20 minuti e servi col riso.'
  }
];

// ---------------------------------------------------------------------------
// Copertine.
//
// Niente foto: nessuna fonte utilizzabile. Wikimedia Commons non trova nulla sui
// nomi di piatti specifici ("Pollo al limone e rosmarino" → zero risultati) e
// cercare per parola singola darebbe immagini a caso; source.unsplash e foodish
// rispondono 503; Unsplash e le banche foto richiedono chiave e licenza.
// Un'immagine sbagliata è peggio di nessuna immagine.
//
// Quindi copertina generata: emoji scelta a mano per ogni ricetta + gradiente
// per momento del pasto. Offline, immediata, nessuna licenza, sempre coerente.
// ---------------------------------------------------------------------------

export const IDEA_ICONS = {
  'porridge-mirtilli': '🫐',
  'yogurt-bowl-proteica': '🍓',
  'pancake-proteici-banana': '🥞',
  'toast-avocado-uovo': '🥑',
  'overnight-oats': '🥣',
  'pasta-integrale-zucchine-gamberi': '🍤',
  'pasta-pomodorini-ricotta': '🍅',
  'farro-verdure': '🥗',
  'quinoa-ceci-curry': '🍛',
  'zuppa-lenticchie': '🍲',
  'risotto-zucca-leggero': '🎃',
  'pasta-legumi-pomodoro': '🍝',
  'merluzzo-forno-patate': '🐟',
  'salmone-asparagi': '🍣',
  'insalata-tonno-fagioli': '🥫',
  'orata-verdure': '🐠',
  'polpette-tonno-forno': '🍡',
  'pollo-limone-rosmarino': '🍋',
  'pollo-verdure-wok': '🥘',
  'tacchino-insalata': '🥙',
  'polpette-manzo-sugo': '🧆',
  'bresaola-rucola-grana': '🥩',
  'frittata-zucchine-forno': '🍳',
  'tofu-verdure': '🥦',
  'burger-lenticchie': '🍔',
  'parmigiana-leggera': '🍆',
  'ceci-spinaci': '🌿',
  'vellutata-zucca-zenzero': '🥕',
  'insalata-quinoa-avocado': '🥑',
  'peperoni-ripieni-riso': '🫑',
  'insalata-finocchi-arance': '🍊',
  'verdure-grigliate': '🔥',
  'patate-forno-rosmarino': '🥔',
  'caponata-leggera': '🍆',
  'hummus-casalingo': '🫓',
  'poke-salmone': '🍱',
  'buddha-bowl': '🫕',
  'chili-vegetariano': '🌶️',
  'cous-cous-pollo-verdure': '🍗',
  'uova-pomodoro-shakshuka': '🍳',
  'insalata-riso-integrale': '🍚',
  'zuppa-ceci-rosmarino': '🥣',
  'omelette-spinaci-feta': '🧀',
  'seitan-peperoni': '🫑',
  'frittata-albumi-verdure': '🥚',
  'pollo-patate-dolci': '🍠',
  'insalata-greca': '🫒',
  'crema-funghi-orzo': '🍄',
  'gamberi-zucchine-limone': '🦐',
  'sformato-broccoli': '🥦',
  'tempeh-verdure': '🥬',
  'yogurt-cacao-banana': '🍫',
  'pane-ricotta-miele': '🍯',
  'crema-zucchine-menta': '🌱',
  'pollo-broccoli-riso': '🍚',
  'insalata-farro-tonno': '🐟',
  'uova-avocado-pomodorini': '🍳',
  'salmone-quinoa-asparagi': '🐠',
  'zuppa-orzo-verdure': '🍲',
  'spiedini-pollo-peperoni': '🍢',
  'melanzane-ripiene-quinoa': '🍆',
  'pasta-fredda-mozzarella': '🧀',
  'frittata-spinaci-patate': '🥔',
  'bowl-ceci-tahina': '🥣',
  'merluzzo-zucchine-limone': '🍋',
  'riso-venere-gamberi': '🦐',
  'tacos-fagioli': '🌮',
  'crema-piselli-menta': '🫛',
  'tacchino-funghi': '🍄',
  'insalata-polpo-patate': '🐙',
  'lenticchie-riso-curry': '🍛'
};

/**
 * Foto dei piatti, risolte una volta sola e incorporate qui: nessuna chiave API
 * nell'app, nessuna chiamata a runtime, nessun rate limit. Le copertine generate
 * restano sotto come rete di sicurezza se un URL smette di rispondere.
 * Rigenerabile con scripts/fetch-pexels.mjs.
 *   { id: { url, credit } }
 */
export const IDEA_PHOTOS = {
  'bowl-ceci-tahina': { url: 'https://images.pexels.com/photos/6252680/pexels-photo-6252680.jpeg?auto=compress&cs=tinysrgb&h=350', credit: "Nataliya Vaitkevich / Pexels" },
  'bresaola-rucola-grana': { url: 'https://images.pexels.com/photos/35476004/pexels-photo-35476004.jpeg?auto=compress&cs=tinysrgb&h=350', credit: "Burak Eroglu 🇹🇷 / Pexels" },
  'buddha-bowl': { url: 'https://images.pexels.com/photos/19150338/pexels-photo-19150338.jpeg?auto=compress&cs=tinysrgb&h=350', credit: "Nadja M / Pexels" },
  'burger-lenticchie': { url: 'https://images.pexels.com/photos/5639459/pexels-photo-5639459.jpeg?auto=compress&cs=tinysrgb&h=350', credit: "Shameel mukkath / Pexels" },
  'caponata-leggera': { url: 'https://images.pexels.com/photos/36040965/pexels-photo-36040965.jpeg?auto=compress&cs=tinysrgb&h=350', credit: "Edita Brus / Pexels" },
  'ceci-spinaci': { url: 'https://images.pexels.com/photos/12896844/pexels-photo-12896844.jpeg?auto=compress&cs=tinysrgb&h=350', credit: "Denis Liendo ✅ / Pexels" },
  'chili-vegetariano': { url: 'https://images.pexels.com/photos/32667184/pexels-photo-32667184.jpeg?auto=compress&cs=tinysrgb&h=350', credit: "Magda Ehlers / Pexels" },
  'cous-cous-pollo-verdure': { url: 'https://images.pexels.com/photos/1618952/pexels-photo-1618952.jpeg?auto=compress&cs=tinysrgb&h=350', credit: "Zak Chapman / Pexels" },
  'crema-funghi-orzo': { url: 'https://images.pexels.com/photos/11190138/pexels-photo-11190138.jpeg?auto=compress&cs=tinysrgb&h=350', credit: "Jana Ohajdova / Pexels" },
  'crema-piselli-menta': { url: 'https://images.pexels.com/photos/24186408/pexels-photo-24186408.jpeg?auto=compress&cs=tinysrgb&h=350', credit: "Change C.C / Pexels" },
  'crema-zucchine-menta': { url: 'https://images.pexels.com/photos/20004982/pexels-photo-20004982.jpeg?auto=compress&cs=tinysrgb&h=350', credit: "Rahul Sonawane / Pexels" },
  'farro-verdure': { url: 'https://images.pexels.com/photos/9219081/pexels-photo-9219081.jpeg?auto=compress&cs=tinysrgb&h=350', credit: "Loren Castillo / Pexels" },
  'frittata-albumi-verdure': { url: 'https://images.pexels.com/photos/20422125/pexels-photo-20422125.jpeg?auto=compress&cs=tinysrgb&h=350', credit: "Jack Baghel / Pexels" },
  'frittata-spinaci-patate': { url: 'https://images.pexels.com/photos/38544360/pexels-photo-38544360.jpeg?auto=compress&cs=tinysrgb&h=350', credit: "Eddie O. / Pexels" },
  'frittata-zucchine-forno': { url: 'https://images.pexels.com/photos/5639282/pexels-photo-5639282.jpeg?auto=compress&cs=tinysrgb&h=350', credit: "Shameel mukkath / Pexels" },
  'gamberi-zucchine-limone': { url: 'https://images.pexels.com/photos/23180805/pexels-photo-23180805.jpeg?auto=compress&cs=tinysrgb&h=350', credit: "Orest Lenja / Pexels" },
  'hummus-casalingo': { url: 'https://images.pexels.com/photos/6252675/pexels-photo-6252675.jpeg?auto=compress&cs=tinysrgb&h=350', credit: "Nataliya Vaitkevich / Pexels" },
  'insalata-farro-tonno': { url: 'https://images.pexels.com/photos/19051901/pexels-photo-19051901.jpeg?auto=compress&cs=tinysrgb&h=350', credit: "Nadin Sh / Pexels" },
  'insalata-finocchi-arance': { url: 'https://images.pexels.com/photos/6836096/pexels-photo-6836096.jpeg?auto=compress&cs=tinysrgb&h=350', credit: "eat kubba / Pexels" },
  'insalata-greca': { url: 'https://images.pexels.com/photos/3026013/pexels-photo-3026013.jpeg?auto=compress&cs=tinysrgb&h=350', credit: "TUBARONES PHOTOGRAPHY / Pexels" },
  'insalata-polpo-patate': { url: 'https://images.pexels.com/photos/38407736/pexels-photo-38407736.jpeg?auto=compress&cs=tinysrgb&h=350', credit: "Image Hunter / Pexels" },
  'insalata-quinoa-avocado': { url: 'https://images.pexels.com/photos/5639363/pexels-photo-5639363.jpeg?auto=compress&cs=tinysrgb&h=350', credit: "Shameel mukkath / Pexels" },
  'insalata-riso-integrale': { url: 'https://images.pexels.com/photos/6978146/pexels-photo-6978146.jpeg?auto=compress&cs=tinysrgb&h=350', credit: "Heather Brock / Pexels" },
  'insalata-tonno-fagioli': { url: 'https://images.pexels.com/photos/6544260/pexels-photo-6544260.jpeg?auto=compress&cs=tinysrgb&h=350', credit: "Alesia  Kozik / Pexels" },
  'lenticchie-riso-curry': { url: 'https://images.pexels.com/photos/28286241/pexels-photo-28286241.jpeg?auto=compress&cs=tinysrgb&h=350', credit: "Nic Wood / Pexels" },
  'melanzane-ripiene-quinoa': { url: 'https://images.pexels.com/photos/29040190/pexels-photo-29040190.jpeg?auto=compress&cs=tinysrgb&h=350', credit: "Yesim  G. Ozdemir / Pexels" },
  'merluzzo-forno-patate': { url: 'https://images.pexels.com/photos/19748960/pexels-photo-19748960.jpeg?auto=compress&cs=tinysrgb&h=350', credit: "Nicu Cobasnean / Pexels" },
  'merluzzo-zucchine-limone': { url: 'https://images.pexels.com/photos/14537684/pexels-photo-14537684.jpeg?auto=compress&cs=tinysrgb&h=350', credit: "Cristian Mihaila / Pexels" },
  'omelette-spinaci-feta': { url: 'https://images.pexels.com/photos/5840304/pexels-photo-5840304.jpeg?auto=compress&cs=tinysrgb&h=350', credit: "ROMAN ODINTSOV / Pexels" },
  'orata-verdure': { url: 'https://images.pexels.com/photos/15735639/pexels-photo-15735639.jpeg?auto=compress&cs=tinysrgb&h=350', credit: "Ana Palade / Pexels" },
  'overnight-oats': { url: 'https://images.pexels.com/photos/5150202/pexels-photo-5150202.jpeg?auto=compress&cs=tinysrgb&h=350', credit: "ROMAN ODINTSOV / Pexels" },
  'pancake-proteici-banana': { url: 'https://images.pexels.com/photos/7144976/pexels-photo-7144976.jpeg?auto=compress&cs=tinysrgb&h=350', credit: "Monstera Production / Pexels" },
  'pane-ricotta-miele': { url: 'https://images.pexels.com/photos/7167848/pexels-photo-7167848.jpeg?auto=compress&cs=tinysrgb&h=350', credit: "eat kubba / Pexels" },
  'parmigiana-leggera': { url: 'https://images.pexels.com/photos/1707917/pexels-photo-1707917.jpeg?auto=compress&cs=tinysrgb&h=350', credit: "Melanie Dompierre / Pexels" },
  'pasta-fredda-mozzarella': { url: 'https://images.pexels.com/photos/34636452/pexels-photo-34636452.jpeg?auto=compress&cs=tinysrgb&h=350', credit: "Novkov Visuals / Pexels" },
  'pasta-integrale-zucchine-gamberi': { url: 'https://images.pexels.com/photos/11654218/pexels-photo-11654218.jpeg?auto=compress&cs=tinysrgb&h=350', credit: "adrian vieriu / Pexels" },
  'pasta-legumi-pomodoro': { url: 'https://images.pexels.com/photos/28936956/pexels-photo-28936956.jpeg?auto=compress&cs=tinysrgb&h=350', credit: "nikki awal / Pexels" },
  'pasta-pomodorini-ricotta': { url: 'https://images.pexels.com/photos/36430172/pexels-photo-36430172.jpeg?auto=compress&cs=tinysrgb&h=350', credit: "Willians Huerta / Pexels" },
  'patate-forno-rosmarino': { url: 'https://images.pexels.com/photos/162763/delicious-garnish-potatoes-fried-162763.jpeg?auto=compress&cs=tinysrgb&h=350', credit: "Pixabay / Pexels" },
  'peperoni-ripieni-riso': { url: 'https://images.pexels.com/photos/31953512/pexels-photo-31953512.jpeg?auto=compress&cs=tinysrgb&h=350', credit: "Nur Tok / Pexels" },
  'poke-salmone': { url: 'https://images.pexels.com/photos/12814860/pexels-photo-12814860.jpeg?auto=compress&cs=tinysrgb&h=350', credit: "Nadin Sh / Pexels" },
  'pollo-broccoli-riso': { url: 'https://images.pexels.com/photos/19938618/pexels-photo-19938618.jpeg?auto=compress&cs=tinysrgb&h=350', credit: "wutthichai charoenburi / Pexels" },
  'pollo-limone-rosmarino': { url: 'https://images.pexels.com/photos/16510619/pexels-photo-16510619.jpeg?auto=compress&cs=tinysrgb&h=350', credit: "Sternsteiger Stahlwaren / Pexels" },
  'pollo-patate-dolci': { url: 'https://images.pexels.com/photos/16845749/pexels-photo-16845749.jpeg?auto=compress&cs=tinysrgb&h=350', credit: "Huzaifa Bukhari / Pexels" },
  'pollo-verdure-wok': { url: 'https://images.pexels.com/photos/35873820/pexels-photo-35873820.jpeg?auto=compress&cs=tinysrgb&h=350', credit: "atelierbyvineeth . . . / Pexels" },
  'polpette-manzo-sugo': { url: 'https://images.pexels.com/photos/17989471/pexels-photo-17989471.jpeg?auto=compress&cs=tinysrgb&h=350', credit: "Wijs (Wise) / Pexels" },
  'polpette-tonno-forno': { url: 'https://images.pexels.com/photos/37859853/pexels-photo-37859853.jpeg?auto=compress&cs=tinysrgb&h=350', credit: "Ball CooleR / Pexels" },
  'porridge-mirtilli': { url: 'https://images.pexels.com/photos/12955496/pexels-photo-12955496.jpeg?auto=compress&cs=tinysrgb&h=350', credit: "Atlantic Ambience / Pexels" },
  'quinoa-ceci-curry': { url: 'https://images.pexels.com/photos/9287035/pexels-photo-9287035.jpeg?auto=compress&cs=tinysrgb&h=350', credit: "Muhammad  Khawar Nazir / Pexels" },
  'riso-venere-gamberi': { url: 'https://images.pexels.com/photos/13806700/pexels-photo-13806700.jpeg?auto=compress&cs=tinysrgb&h=350', credit: "Nadin Sh / Pexels" },
  'risotto-zucca-leggero': { url: 'https://images.pexels.com/photos/33988119/pexels-photo-33988119.jpeg?auto=compress&cs=tinysrgb&h=350', credit: "Jana Ohajdova / Pexels" },
  'salmone-asparagi': { url: 'https://images.pexels.com/photos/16845479/pexels-photo-16845479.jpeg?auto=compress&cs=tinysrgb&h=350', credit: "Huzaifa Bukhari / Pexels" },
  'salmone-quinoa-asparagi': { url: 'https://images.pexels.com/photos/4663250/pexels-photo-4663250.jpeg?auto=compress&cs=tinysrgb&h=350', credit: "Denys Gromov / Pexels" },
  'seitan-peperoni': { url: 'https://images.pexels.com/photos/10338629/pexels-photo-10338629.jpeg?auto=compress&cs=tinysrgb&h=350', credit: "Istvan Szabo / Pexels" },
  'sformato-broccoli': { url: 'https://images.pexels.com/photos/4768954/pexels-photo-4768954.jpeg?auto=compress&cs=tinysrgb&h=350', credit: "Denys Gromov / Pexels" },
  'spiedini-pollo-peperoni': { url: 'https://images.pexels.com/photos/12716039/pexels-photo-12716039.jpeg?auto=compress&cs=tinysrgb&h=350', credit: "BOOM 💥 Photography / Pexels" },
  'tacchino-funghi': { url: 'https://images.pexels.com/photos/31960616/pexels-photo-31960616.jpeg?auto=compress&cs=tinysrgb&h=350', credit: "Zola PALMER / Pexels" },
  'tacchino-insalata': { url: 'https://images.pexels.com/photos/1182511/pexels-photo-1182511.jpeg?auto=compress&cs=tinysrgb&h=350', credit: "Jenna Hamra / Pexels" },
  'tacos-fagioli': { url: 'https://images.pexels.com/photos/9214000/pexels-photo-9214000.jpeg?auto=compress&cs=tinysrgb&h=350', credit: "Loren Castillo / Pexels" },
  'tempeh-verdure': { url: 'https://images.pexels.com/photos/37113556/pexels-photo-37113556.jpeg?auto=compress&cs=tinysrgb&h=350', credit: "Man Fong Wong / Pexels" },
  'toast-avocado-uovo': { url: 'https://images.pexels.com/photos/793785/pexels-photo-793785.jpeg?auto=compress&cs=tinysrgb&h=350', credit: "Jane  T D. / Pexels" },
  'tofu-verdure': { url: 'https://images.pexels.com/photos/9213853/pexels-photo-9213853.jpeg?auto=compress&cs=tinysrgb&h=350', credit: "Loren Castillo / Pexels" },
  'uova-avocado-pomodorini': { url: 'https://images.pexels.com/photos/29893443/pexels-photo-29893443.jpeg?auto=compress&cs=tinysrgb&h=350', credit: "Eugenia Sol / Pexels" },
  'uova-pomodoro-shakshuka': { url: 'https://images.pexels.com/photos/29177374/pexels-photo-29177374.jpeg?auto=compress&cs=tinysrgb&h=350', credit: "The Castlebar / Pexels" },
  'vellutata-zucca-zenzero': { url: 'https://images.pexels.com/photos/5662190/pexels-photo-5662190.jpeg?auto=compress&cs=tinysrgb&h=350', credit: "KATRIN  BOLOVTSOVA / Pexels" },
  'verdure-grigliate': { url: 'https://images.pexels.com/photos/5637759/pexels-photo-5637759.jpeg?auto=compress&cs=tinysrgb&h=350', credit: "Askar Abayev / Pexels" },
  'yogurt-bowl-proteica': { url: 'https://images.pexels.com/photos/4006347/pexels-photo-4006347.jpeg?auto=compress&cs=tinysrgb&h=350', credit: "Jenna Hamra / Pexels" },
  'yogurt-cacao-banana': { url: 'https://images.pexels.com/photos/6771602/pexels-photo-6771602.jpeg?auto=compress&cs=tinysrgb&h=350', credit: "Piotr Arnoldes / Pexels" },
  'zuppa-ceci-rosmarino': { url: 'https://images.pexels.com/photos/33597401/pexels-photo-33597401.jpeg?auto=compress&cs=tinysrgb&h=350', credit: "Brad Hines / Pexels" },
  'zuppa-lenticchie': { url: 'https://images.pexels.com/photos/20004800/pexels-photo-20004800.jpeg?auto=compress&cs=tinysrgb&h=350', credit: "Rahul Sonawane / Pexels" },
  'zuppa-orzo-verdure': { url: 'https://images.pexels.com/photos/17312402/pexels-photo-17312402.jpeg?auto=compress&cs=tinysrgb&h=350', credit: "Victor Cayke / Pexels" }
};

/** Gradiente per momento del pasto: dà un colpo d'occhio alla griglia. */
export const IDEA_TONES = {
  colazione: ['#f0a94b', '#dd7a2e'],
  pranzo: ['#4a9fd8', '#2f6aa8'],
  cena: ['#7a6cd6', '#524aad'],
  contorno: ['#5ec27a', '#358a55'],
  default: ['#5aa9a0', '#37776f']
};

export const IDEA_COUNT = RECIPE_IDEAS.length;

/** Tutti i tag disponibili, ordinati per frequenza. */
export function allTags() {
  const count = new Map();
  RECIPE_IDEAS.forEach((r) => r.tags.forEach((t) => count.set(t, (count.get(t) || 0) + 1)));
  return [...count.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}

/** Tutti gli ingredienti citati, ordinati per frequenza. */
export function allIngredients() {
  const count = new Map();
  RECIPE_IDEAS.forEach((r) =>
    r.ingredients.forEach(([name]) => count.set(name, (count.get(name) || 0) + 1))
  );
  return [...count.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}
