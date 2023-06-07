import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';

interface Card {
  id: number;
  value: string;
  isFlipped: boolean;
}

const generateCards = (): Card[] => {
  const values = ['apple', 'banana', 'kiwi', 'melon', 'orange', 'pear', 'strawberry'];
  const cards = [];

  for (let i = 0; i < values.length; i++) {
    cards.push({ id: i * 2, value: `${values[i]}.jpg`, isFlipped: false });
    cards.push({ id: i * 2 + 1, value: `${values[i]}.jpg`, isFlipped: false });
  }

  return cards;
};

//komponenta Card - props id, value, isFlipped a funkce onPress, typ Card, a funkce onPress (prop)
//isFlipped? -> style
const Card = ({ id, value, isFlipped, onPress }: Card & { onPress: () => void }) => {
  return (
    <TouchableOpacity style={[styles.card, isFlipped && styles.cardFlipped]} onPress={onPress}>
      {isFlipped ? (
        <Image source={{ uri: `./images/${value}` }} style={styles.cardImage} />    //require, objekt
      ) : (
        <Image source={require('./images/blank.jpg')} style={styles.cardBackImage} />
      )}
    </TouchableOpacity>
  );
};

const App = () => {
  const [cards, setCards] = useState<Card[]>(generateCards());
  const [flippedCardIds, setFlippedCardIds] = useState<number[]>([]);   //flippedCardIds keeps track of cards that are currently flipped
  const [score, setScore] = useState<number>(0);

  useEffect(() => {
    //new array flippedCards -> loops (filter) array cards -> checks card.id is included in flippedCards
    const flippedCards = cards.filter((card) => flippedCardIds.includes(card.id));

    //user flips two cards
    if (flippedCards.length === 2) {
      //match of cards
      if (flippedCards[0].value === flippedCards[1].value) {
         //previous state of cards, map = newArray, je jejich ID v array flippedCardIds? ->isMatched=true
        setCards((prevCards) =>
          prevCards.map((card) => (flippedCardIds.includes(card.id) ? { ...card, isMatched: true } : card))
        );
        //increase score by 2
        setScore((prevScore) => prevScore + 2);
      } else {
        //no match
        setTimeout(() => {
          setCards((prevCards) =>
            prevCards.map((card) =>
            //change props isFlipped to false
              flippedCardIds.includes(card.id) ? { ...card, isFlipped: false } : card
            )
          );
          //score is decresed by 1 with min of 0
          setScore((prevScore) => Math.max(prevScore - 1, 0));
        }, 1000);
      }
      //set to an empty array
      setFlippedCardIds([]);
    }
  }, [cards, flippedCardIds]);


  const handleCardPress = (id: number) => {
    setCards((prevCards) =>
    //if the ids match then they remain flipped
      prevCards.map((card) => (card.id === id ? { ...card, isFlipped: true } : card))
    );
    setFlippedCardIds((prevFlippedCardIds) => [...prevFlippedCardIds, id]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Memory Game</Text>
        <Text style={styles.scoreText}>Score: {score}</Text>
      </View>
      <View style={styles.cards}>
        {cards.map((card) => (
          <Card
            key={card.id}
            id={card.id}
            value={card.value}
            isFlipped={card.isFlipped}
            onPress={() => handleCardPress(card.id)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 20,
  },
  scoreText: {
    fontSize: 18,
  },
  cards: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  card: {
    width: 80,
    height: 80,
    backgroundColor: 'lightblue',
    borderRadius: 8,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardFlipped: {
    backgroundColor: 'lightgreen',
  },
  cardImage: {
    height: 80,
    width: 80,
  },
  cardBackImage: {
    height: 80,
    width: 80,
  }
});

export default App;