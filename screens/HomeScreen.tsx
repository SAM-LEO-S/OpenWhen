import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { emotionConfig, emotionCategories } from '../emotionConfig';
import { EmotionCategory } from '../types';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // 2 columns with margins

interface EmotionCardProps {
  emotion: EmotionCategory;
  onPress: (emotion: EmotionCategory) => void;
}

const EmotionCard: React.FC<EmotionCardProps> = ({ emotion, onPress }) => {
  const config = emotionConfig[emotion];
  
  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: config.gradient[0] }]}
      onPress={() => onPress(emotion)}
      activeOpacity={0.8}
    >
      <Text style={styles.cardIcon}>{config.icon}</Text>
      <Text style={styles.cardTitle}>{config.title}</Text>
    </TouchableOpacity>
  );
};

const HomeScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const handleEmotionPress = (emotion: EmotionCategory) => {
    navigation.navigate('Verse', { emotion });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>OpenWhenVerse</Text>
        <Text style={styles.subtitle}>Personalized Bible verses for every moment</Text>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.grid}>
          {emotionCategories.map((emotion) => (
            <EmotionCard
              key={emotion}
              emotion={emotion}
              onPress={handleEmotionPress}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: cardWidth,
    height: 120,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default HomeScreen; 