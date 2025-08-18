import GreenSmile from "../../assets/images/green_smile.png";
import RedSmile from "../../assets/images/red_smile.png";
import YellowSmile from "../../assets/images/yellow_smile.png";
import {  mobileViewCard_four, mobileViewCard_Last_even, mobileViewCard_Last_odd, mobileViewCard_one, mobileViewCard_three, mobileViewCard_two } from "./mobileCards";
import {
  FifthPosCard,
  FirstPosCard_gold,
  ForthPosCard,
  SecondPosCard,
  ThirdPos_Gold,
  ThirdPosCard,
} from "./team1Cards/positionedCards";
import {
  FifthPosCard_Opp,
  FirstPosCard_Opp_gold,
  ForthPosCard_Opp,
  SecondPosCard_Opp,
  ThirdPos_OppGold,
  ThirdPosCard_Opp,
} from "./team2Cards/positionedCards";

export function getCards(position, isOpponent = false) {
  // Choose card sets based on isOpponent
  const goldCards = isOpponent
    ? [FirstPosCard_Opp_gold, ThirdPos_OppGold]
    : [FirstPosCard_gold, ThirdPos_Gold];

  const cards = isOpponent
    ? [
        undefined,
        SecondPosCard_Opp,
        ThirdPosCard_Opp, 
        ForthPosCard_Opp,
        FifthPosCard_Opp,
      ]
    : [undefined, SecondPosCard, ThirdPosCard, ForthPosCard, FifthPosCard];

  if (position > 5) {
    // For more than 5, fill with the normal 5 cards, then repeat the last card as needed
    const baseCards = [goldCards[0], cards[1], cards[2], cards[3], cards[4]];
    const extraCount = position - 5;
    // Add the last card for each extra position (e.g. for 7, add 2 more)
    const extraCards = Array(extraCount).fill(cards[4]);
    return [...baseCards, ...extraCards];
  }

  switch (position) {
    case 5:
      return [goldCards[0], cards[1], cards[2], cards[3], cards[4]];
    case 4:
      return [goldCards[0], cards[1], cards[2], cards[3]];
    case 3:
      return [goldCards[1], cards[2], cards[3]];
    case 2:
      return [goldCards[1], cards[2]];
    case 1:
      return [cards[2]];
    default:
      return [];
  }
}


export function getMobileCards(position) {
  // Determine first and last card types
  let firstCard = position === 1 ? mobileViewCard_three : mobileViewCard_one;
  let lastCard = position % 2 === 0 ? mobileViewCard_Last_even : mobileViewCard_Last_odd;
  let cards = [mobileViewCard_two, mobileViewCard_three];

  if (position <= 0) return [];

  // For position 1, just return the first card
  if (position === 1) return [firstCard];

  // For position 2, return first and last
  if (position === 2) return [firstCard, lastCard];

  // For position >= 3, build dynamically
  let result = [firstCard];
  // Fill the middle cards
  for (let i = 0; i < position - 2; i++) {
    // Alternate between cards[0] and cards[1]
    result.push(cards[i % cards.length]);
  }
  // Add the last card
  result.push(lastCard);

  return result;
}
/**
 * Returns the appropriate smile image based on the reputation percentage.
 * @param {number} rep - The reputation percentage (0-100).
 * @returns {string} - The path to the smile image.
 */
export function getSmile(rep) {
  if (rep >= 70) {
    // 70% – 100% Positive
    return GreenSmile;
  } else if (rep >= 40) {
    // 40% – 69% Neutral
    return YellowSmile;
  } else {
    // 0% – 39% Needs Improve
    return RedSmile;
  }
}

export function getColor(rep) {
  if (rep >= 70) {
    // 70% – 100% Positive
    return "#09D75F";
  } else if (rep >= 40) {
    // 40% – 69% Neutral
    return "#D7BF09";
  } else {
    // 0% – 39% Needs Improve
    return "#FA4768";
  }
}
