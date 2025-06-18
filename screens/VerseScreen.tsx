import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Share,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { fetchVerseByEmotion } from '../api';
import { EmotionCategory } from '../types';
import { emotionConfig } from '../emotionConfig';

const VerseScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();
  const { emotion } = route.params as { emotion: EmotionCategory };
  const config = emotionConfig[emotion];

  const {
    data: verse,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['verse', emotion],
    queryFn: () => fetchVerseByEmotion(emotion),
    staleTime: 0,
  });

  const handleShare = async () => {
    if (!verse) return;

    try {
      await Share.share({
        message: `${verse.text}\n\n${verse.reference}\n\n${verse.personalMessage}`,
        title: 'Bible Verse from OpenWhenVerse',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share verse');
    }
  };

  const handleNewVerse = () => {
    refetch();
  };

  const handleBack = () => {
    navigation.goBack();
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#1e293b" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{config.title}</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={config.gradient[0]} />
          <Text style={styles.loadingText}>Loading your verse...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#1e293b" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{config.title}</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load verse</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{config.title}</Text>
        <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
          <Ionicons name="share-outline" size={24} color="#1e293b" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={[styles.verseCard, { backgroundColor: config.gradient[0] }]}>
          <Text style={styles.verseText}>{verse?.text}</Text>
          <Text style={styles.verseReference}>{verse?.reference}</Text>
        </View>

        <View style={styles.personalMessageContainer}>
          <Text style={styles.personalMessageLabel}>Personal Message</Text>
          <Text style={styles.personalMessage}>{verse?.personalMessage}</Text>
        </View>

        <TouchableOpacity
          style={[styles.newVerseButton, { backgroundColor: config.gradient[0] }]}
          onPress={handleNewVerse}
        >
          <Ionicons name="refresh" size={20} color="#ffffff" />
          <Text style={styles.newVerseButtonText}>New Verse</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    flex: 1,
    textAlign: 'center',
  },
  shareButton: {
    padding: 8,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  verseCard: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  verseText: {
    fontSize: 18,
    color: '#ffffff',
    lineHeight: 26,
    marginBottom: 16,
    textAlign: 'center',
  },
  verseReference: {
    fontSize: 14,
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: '600',
  },
  personalMessageContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  personalMessageLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 8,
  },
  personalMessage: {
    fontSize: 16,
    color: '#1e293b',
    lineHeight: 24,
  },
  newVerseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  newVerseButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748b',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default VerseScreen; 