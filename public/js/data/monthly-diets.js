// ---------------------------------------------------------------------------
// Diete mensili: tre impostazioni alimentari complete.
//
// Ognuna definisce una settimana tipo che si ripete per il mese, più la
// ripartizione dei macronutrienti consigliata. Gli alimenti citano i nomi
// ESATTI di foods-base.js: le macro non sono duplicate, si calcolano da lì.
// Un test verifica che ogni riferimento sia risolvibile.
//
// Applicandola, la dieta scrive il piano settimanale e, se vuoi, i target.
// ---------------------------------------------------------------------------

/** pasti: { giorno 1-7: [[slot, nomeAlimento, grammi], ...] } */
export const MONTHLY_DIETS = [
  {
    id: 'mediterranea',
    name: 'Mediterranea',
    claim: 'Verdura, cereali integrali, pesce e olio d’oliva',
    description:
      'L’impostazione più studiata al mondo. Carboidrati integrali come base, pesce ' +
      'due o tre volte a settimana, legumi al posto della carne rossa, olio ' +
      'extravergine come unico grasso da condimento e verdura a ogni pasto.',
    color: ['#3d8bcd', '#2b5f91'],
    icon: '🫒',
    // Ripartizione calorica indicativa: 50% carboidrati, 20% proteine, 30% grassi
    split: { carbs: 50, protein: 20, fat: 30 },
    highlights: ['Pesce 3 volte a settimana', 'Legumi 3 volte', 'Carne rossa una volta'],
    meals: {
      1: [
        ['colazione', 'Fiocchi d’avena', 60], ['colazione', 'Latte parzialmente scremato', 200],
        ['colazione', 'Mela', 150],
        ['pranzo', 'Pasta integrale (c)', 80], ['pranzo', 'Passata di pomodoro', 120],
        ['pranzo', 'Olio extravergine d’oliva', 15], ['pranzo', 'Insalata mista', 100],
        ['cena', 'Merluzzo (c)', 200], ['cena', 'Patate', 200], ['cena', 'Broccoli', 200],
        ['cena', 'Olio extravergine d’oliva', 10], ['spuntino2', 'Mandorle', 25]
      ],
      2: [
        ['colazione', 'Pane integrale', 80], ['colazione', 'Ricotta vaccina', 80],
        ['colazione', 'Miele', 15],
        ['pranzo', 'Farro perlato (c)', 80], ['pranzo', 'Ceci in scatola', 150],
        ['pranzo', 'Pomodorini', 150], ['pranzo', 'Olio extravergine d’oliva', 15],
        ['cena', 'Petto di pollo (c)', 180], ['cena', 'Zucchine', 250],
        ['cena', 'Pane integrale', 50], ['spuntino2', 'Yogurt bianco intero', 125]
      ],
      3: [
        ['colazione', 'Fiocchi d’avena', 60], ['colazione', 'Yogurt greco 0%', 150],
        ['colazione', 'Mirtilli', 80],
        ['pranzo', 'Riso integrale (c)', 80], ['pranzo', 'Gamberi (c)', 150],
        ['pranzo', 'Zucchine', 200], ['pranzo', 'Olio extravergine d’oliva', 15],
        ['cena', 'Lenticchie (c)', 80], ['cena', 'Carote', 150], ['cena', 'Pane integrale', 50],
        ['spuntino2', 'Noci', 25]
      ],
      4: [
        ['colazione', 'Pane integrale', 80], ['colazione', 'Uovo intero', 110],
        ['colazione', 'Arancia', 180],
        ['pranzo', 'Pasta di semola (c)', 80], ['pranzo', 'Pesto', 25],
        ['pranzo', 'Fagiolini', 150],
        ['cena', 'Orata (c)', 220], ['cena', 'Patate', 200], ['cena', 'Spinaci', 200],
        ['cena', 'Olio extravergine d’oliva', 12], ['spuntino2', 'Mela', 150]
      ],
      5: [
        ['colazione', 'Fiocchi d’avena', 60], ['colazione', 'Latte parzialmente scremato', 200],
        ['colazione', 'Banana', 120],
        ['pranzo', 'Cous cous (c)', 80], ['pranzo', 'Tonno in scatola al naturale', 120],
        ['pranzo', 'Peperoni', 150], ['pranzo', 'Olio extravergine d’oliva', 15],
        ['cena', 'Fagioli in scatola', 200], ['cena', 'Verza', 200], ['cena', 'Pane integrale', 60],
        ['spuntino2', 'Yogurt greco 0%', 150]
      ],
      6: [
        ['colazione', 'Pane integrale', 80], ['colazione', 'Ricotta vaccina', 80],
        ['colazione', 'Marmellata', 20],
        ['pranzo', 'Riso bianco (c)', 80], ['pranzo', 'Cozze (c)', 200],
        ['pranzo', 'Pomodorini', 150], ['pranzo', 'Olio extravergine d’oliva', 15],
        ['cena', 'Manzo magro (c)', 150], ['cena', 'Insalata mista', 150],
        ['cena', 'Patate', 200], ['spuntino2', 'Nocciole', 25]
      ],
      7: [
        ['colazione', 'Cornetto', 60], ['colazione', 'Caffè con latte', 150],
        ['pranzo', 'Pasta al ragù', 300], ['pranzo', 'Insalata mista', 100],
        ['cena', 'Frittata di zucchine', 200], ['cena', 'Pane integrale', 60],
        ['spuntino2', 'Uva', 150]
      ]
    }
  },

  {
    id: 'vegetariana',
    name: 'Vegetariana',
    claim: 'Legumi, uova e latticini al posto di carne e pesce',
    description:
      'Nessuna carne né pesce. Le proteine arrivano da legumi, uova, latticini, ' +
      'tofu e tempeh, abbinati a cereali per completare gli aminoacidi. Attenzione ' +
      'a ferro e vitamina B12: la vitamina C dei vegetali aiuta ad assorbire il ferro.',
    color: ['#4faa63', '#2f7845'],
    split: { carbs: 50, protein: 20, fat: 30 },
    icon: '🥬',
    highlights: ['Legumi ogni giorno', 'Uova 4 a settimana', 'Cereali integrali'],
    meals: {
      1: [
        ['colazione', 'Fiocchi d’avena', 60], ['colazione', 'Latte parzialmente scremato', 200],
        ['colazione', 'Banana', 120],
        ['pranzo', 'Pasta di legumi (c)', 80], ['pranzo', 'Passata di pomodoro', 120],
        ['pranzo', 'Olio extravergine d’oliva', 15], ['pranzo', 'Rucola', 50],
        ['cena', 'Tofu', 200], ['cena', 'Broccoli', 250], ['cena', 'Pane integrale', 60],
        ['spuntino2', 'Mandorle', 25]
      ],
      2: [
        ['colazione', 'Yogurt greco 0%', 200], ['colazione', 'Fiocchi d’avena', 40],
        ['colazione', 'Fragole', 120],
        ['pranzo', 'Quinoa (c)', 80], ['pranzo', 'Ceci in scatola', 200],
        ['pranzo', 'Spinaci', 150], ['pranzo', 'Olio extravergine d’oliva', 15],
        ['cena', 'Uovo intero', 165], ['cena', 'Patate', 200], ['cena', 'Asparagi', 150],
        ['spuntino2', 'Noci', 25]
      ],
      3: [
        ['colazione', 'Pane integrale', 80], ['colazione', 'Formaggio spalmabile', 40],
        ['colazione', 'Kiwi', 90],
        ['pranzo', 'Riso integrale (c)', 80], ['pranzo', 'Lenticchie (c)', 60],
        ['pranzo', 'Carote', 150], ['pranzo', 'Olio extravergine d’oliva', 15],
        ['cena', 'Mozzarella light', 125], ['cena', 'Pomodoro', 200],
        ['cena', 'Pane integrale', 60], ['spuntino2', 'Yogurt bianco intero', 125]
      ],
      4: [
        ['colazione', 'Fiocchi d’avena', 60], ['colazione', 'Latte di soia non zuccherato', 200],
        ['colazione', 'Mela', 150],
        ['pranzo', 'Farro perlato (c)', 80], ['pranzo', 'Fagioli in scatola', 200],
        ['pranzo', 'Zucchine', 200], ['pranzo', 'Olio extravergine d’oliva', 15],
        ['cena', 'Tempeh', 150], ['cena', 'Cavolfiore', 250], ['cena', 'Patate dolci', 150],
        ['spuntino2', 'Semi di zucca', 25]
      ],
      5: [
        ['colazione', 'Pane integrale', 80], ['colazione', 'Ricotta vaccina', 100],
        ['colazione', 'Miele', 15],
        ['pranzo', 'Pasta integrale (c)', 80], ['pranzo', 'Piselli freschi', 150],
        ['pranzo', 'Parmigiano Reggiano', 20], ['pranzo', 'Olio extravergine d’oliva', 15],
        ['cena', 'Uovo intero', 110], ['cena', 'Spinaci', 250], ['cena', 'Pane integrale', 60],
        ['spuntino2', 'Mandorle', 25]
      ],
      6: [
        ['colazione', 'Yogurt greco 0%', 200], ['colazione', 'Muesli', 50],
        ['colazione', 'Mirtilli', 80],
        ['pranzo', 'Riso bianco (c)', 80], ['pranzo', 'Edamame', 150],
        ['pranzo', 'Carote', 150], ['pranzo', 'Olio di semi', 12],
        ['cena', 'Parmigiana di melanzane', 250], ['cena', 'Insalata mista', 100],
        ['spuntino2', 'Nocciole', 25]
      ],
      7: [
        ['colazione', 'Pancake classici', 150], ['colazione', 'Caffè con latte', 150],
        ['pranzo', 'Risotto ai funghi', 300], ['pranzo', 'Insalata mista', 100],
        ['cena', 'Sformato di verdure', 250], ['cena', 'Ricotta vaccina', 60],
        ['cena', 'Pane integrale', 60],
        ['spuntino2', 'Pera', 150]
      ]
    }
  },

  {
    id: 'proteica',
    name: 'Proteica',
    claim: 'Proteine alte per mantenere la massa magra in deficit',
    description:
      'Pensata per chi si allena o è in deficit calorico: circa 2 g di proteine per ' +
      'chilo di peso, carboidrati concentrati attorno all’allenamento, grassi ' +
      'moderati. In deficit le proteine alte proteggono la massa magra e saziano di più.',
    color: ['#c9543f', '#9a3a2a'],
    split: { carbs: 35, protein: 35, fat: 30 },
    icon: '🍗',
    highlights: ['~2 g proteine per kg', 'Fonti magre', 'Carboidrati sui pasti principali'],
    meals: {
      1: [
        ['colazione', 'Albume', 200], ['colazione', 'Uovo intero', 55],
        ['colazione', 'Fiocchi d’avena', 60], ['colazione', 'Mirtilli', 80],
        ['pranzo', 'Petto di pollo (c)', 200], ['pranzo', 'Riso basmati (c)', 80],
        ['pranzo', 'Broccoli', 200], ['pranzo', 'Olio extravergine d’oliva', 12],
        ['cena', 'Merluzzo (c)', 250], ['cena', 'Patate dolci', 200], ['cena', 'Spinaci', 200],
        ['spuntino2', 'Yogurt greco 0%', 200]
      ],
      2: [
        ['colazione', 'Yogurt greco 0%', 250], ['colazione', 'Proteine whey in polvere', 20],
        ['colazione', 'Fiocchi d’avena', 50],
        ['pranzo', 'Manzo magro (c)', 180], ['pranzo', 'Pasta integrale (c)', 80],
        ['pranzo', 'Zucchine', 200], ['pranzo', 'Olio extravergine d’oliva', 12],
        ['cena', 'Salmone (c)', 180], ['cena', 'Quinoa (c)', 60], ['cena', 'Asparagi', 200],
        ['spuntino2', 'Fiocchi di latte', 150]
      ],
      3: [
        ['colazione', 'Uovo intero', 165], ['colazione', 'Pane integrale', 80],
        ['colazione', 'Avocado', 50],
        ['pranzo', 'Petto di tacchino (c)', 200], ['pranzo', 'Riso integrale (c)', 80],
        ['pranzo', 'Peperoni', 200],
        ['cena', 'Gamberi (c)', 250], ['cena', 'Patate', 200], ['cena', 'Insalata mista', 150],
        ['cena', 'Olio extravergine d’oliva', 12], ['spuntino2', 'Skyr', 150]
      ],
      4: [
        ['colazione', 'Albume', 200], ['colazione', 'Fiocchi d’avena', 60],
        ['colazione', 'Banana', 120],
        ['pranzo', 'Petto di pollo (c)', 200], ['pranzo', 'Cous cous (c)', 80],
        ['pranzo', 'Verdure grigliate miste', 200],
        ['cena', 'Tonno fresco (c)', 200], ['cena', 'Fagioli in scatola', 150],
        ['cena', 'Rucola', 60], ['cena', 'Olio extravergine d’oliva', 12],
        ['spuntino2', 'Yogurt greco 0%', 200]
      ],
      5: [
        ['colazione', 'Yogurt greco 0%', 250], ['colazione', 'Semi di chia', 15],
        ['colazione', 'Fragole', 120],
        ['pranzo', 'Manzo magro (c)', 180], ['pranzo', 'Patate', 300],
        ['pranzo', 'Fagiolini', 200], ['pranzo', 'Olio extravergine d’oliva', 12],
        ['cena', 'Merluzzo (c)', 250], ['cena', 'Riso basmati (c)', 60],
        ['cena', 'Broccoli', 200], ['spuntino2', 'Proteine whey in polvere', 30]
      ],
      6: [
        ['colazione', 'Uovo intero', 165], ['colazione', 'Bresaola', 50],
        ['colazione', 'Pane integrale', 80],
        ['pranzo', 'Petto di pollo (c)', 200], ['pranzo', 'Pasta di legumi (c)', 80],
        ['pranzo', 'Pomodorini', 150], ['pranzo', 'Olio extravergine d’oliva', 12],
        ['cena', 'Salmone (c)', 180], ['cena', 'Patate dolci', 200], ['cena', 'Spinaci', 200],
        ['spuntino2', 'Fiocchi di latte', 150]
      ],
      7: [
        ['colazione', 'Pancake proteici', 150], ['colazione', 'Caffè espresso', 30],
        ['pranzo', 'Tagliata di manzo', 200], ['pranzo', 'Patate al forno', 200],
        ['pranzo', 'Insalata mista', 150],
        ['cena', 'Omelette al formaggio', 200], ['cena', 'Pane integrale', 60],
        ['spuntino2', 'Yogurt greco 0%', 200]
      ]
    }
  }
];

/**
 * Foto delle diete: risolte con scripts/fetch-pexels.mjs, come per le idee.
 *   { id: { url, credit } }
 */
export const DIET_PHOTOS = {
  'mediterranea': { url: 'https://images.pexels.com/photos/27177296/pexels-photo-27177296.jpeg?auto=compress&cs=tinysrgb&h=350', credit: "Helena Lopes / Pexels" },
  'proteica': { url: 'https://images.pexels.com/photos/4488336/pexels-photo-4488336.jpeg?auto=compress&cs=tinysrgb&h=350', credit: "Mateusz Dach / Pexels" },
  'vegetariana': { url: 'https://images.pexels.com/photos/37787857/pexels-photo-37787857.jpeg?auto=compress&cs=tinysrgb&h=350', credit: "Valentin Ivantsov / Pexels" }
};

export const DIET_COUNT = MONTHLY_DIETS.length;
