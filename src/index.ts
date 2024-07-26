import promptSync from 'prompt-sync';

const prompt = promptSync();

// Definicion de  todo el mazo que se va a utilizar
const suits = ['Corazones', 'Diamantes', 'Tréboles', 'Picas'];
const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

function createDeck(): string[] {
    const deck: string[] = [];
    for (const suit of suits) {
        for (const rank of ranks) {
            deck.push(`${rank} de ${suit}`);
        }
    }
    // Barajar la baraja
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}

function dealCard(deck: string[], hand: string[]): void {
    const card = deck.pop();
    if (card) {
        hand.push(card);
    }
}

function calculateScore(hand: string[]): number {
    let score = 0;
    let aceCount = 0;

    for (const card of hand) {
        const rank = card.split(' ')[0];
        if (rank === 'A') {
            aceCount += 1;
            score += 11;
        } else if (['K', 'Q', 'J'].includes(rank)) {
            score += 10;
        } else {
            score += parseInt(rank, 10);
        }
    }

    while (score > 21 && aceCount > 0) {
        score -= 10;
        aceCount -= 1;
    }

    return score;
}

function displayHands(playerHand: string[], dealerHand: string[]): void {
    console.log(`Jugador: ${playerHand.join(', ')} (Puntaje: ${calculateScore(playerHand)})`);
    console.log(`Crupier: ${dealerHand.join(', ')} (Puntaje: ${calculateScore(dealerHand)})`);
}

function playGame(): void {
    const deck = createDeck(); //creacion de un nuevo mazo para cada juego
    let playerHand: string[] = [];
    let dealerHand: string[] = [];

    // Inicializar el juego
    dealCard(deck, playerHand);
    dealCard(deck, dealerHand);
    dealCard(deck, playerHand);
    dealCard(deck, dealerHand);

    // Juego principal
    while (true) {
        displayHands(playerHand, dealerHand);
        const action: string = prompt('¿Quieres "pedir" o "plantarse"? ');
        if (action === 'pedir') {
            dealCard(deck, playerHand);
            if (calculateScore(playerHand) > 21) {
                displayHands(playerHand, dealerHand);
                console.log('Te pasaste de 21, Perdiste.');
                break;
            }
        } else {
            while (calculateScore(dealerHand) < 17) {
                dealCard(deck, dealerHand);
            }
            displayHands(playerHand, dealerHand);
            const playerScore = calculateScore(playerHand);
            const dealerScore = calculateScore(dealerHand);
            if (dealerScore > 21 || playerScore > dealerScore) {
                console.log('¡Ganaste!');
            } else if (playerScore < dealerScore) {
                console.log('Perdiste.');
            } else {
                console.log('Empataste.');
            }
            break;
        }
    }
}

function main(): void {
    let playAgain = 'si';
    while (playAgain === 'si') {
        playGame();
        playAgain = prompt('¿Quieres jugar de nuevo? (si/no) ').toLowerCase();
    }
    console.log('Gracias por jugar!');
}

main();
