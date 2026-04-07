import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { AppHeader } from '../components/Header';
import { Badge, Card } from '../components/UI';
import { MOCK_DATA } from '../api/thematic';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: W } = Dimensions.get('window');

const GENRES = [
  'All',
  'Chill',
  'Electronic',
  'Lo-Fi',
  'Cinematic',
  'Pop',
  'Hip Hop',
  'Acoustic',
  'Ambient',
];

const FILTERS = [
  { label: 'BPM: 60–90', active: false },
  { label: 'Duration: 2–4 min', active: false },
  { label: 'Mood: Calm', active: true },
  { label: 'Vocals', active: false },
];

export function ExploreScreen() {
  const navigation = useNavigation<any>();
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState(FILTERS);

  const toggleFilter = (i: number) => {
    setFilters((prev) =>
      prev.map((f, idx) => (idx === i ? { ...f, active: !f.active } : f))
    );
  };

  const songs = MOCK_DATA.songs.filter(
    (s) =>
      (selectedGenre === 'All' || s.genre === selectedGenre) &&
      (!query ||
        s.title.toLowerCase().includes(query.toLowerCase()) ||
        s.artist.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader />

      <View style={styles.searchRow}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={17} color={COLORS.textTertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search songs, artists..."
            placeholderTextColor={COLORS.textMuted}
            value={query}
            onChangeText={setQuery}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Ionicons
                name="close-circle"
                size={17}
                color={COLORS.textMuted}
              />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity style={styles.filterIconBtn}>
          <Ionicons name="options" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Genre chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.genreScroll}
        contentContainerStyle={styles.genreContent}
      >
        {GENRES.map((g) => (
          <TouchableOpacity
            key={g}
            onPress={() => setSelectedGenre(g)}
            activeOpacity={0.8}
            style={[
              styles.genreChip,
              selectedGenre === g && styles.genreChipActive,
            ]}
          >
            <Text
              style={[
                styles.genreText,
                selectedGenre === g && styles.genreTextActive,
              ]}
            >
              {g}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Active filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersRow}
        contentContainerStyle={styles.filtersContent}
      >
        {filters.map((f, i) => (
          <TouchableOpacity
            key={f.label}
            onPress={() => toggleFilter(i)}
            activeOpacity={0.8}
            style={[
              styles.filterChip,
              f.active && styles.filterChipActive,
            ]}
          >
            {f.active && (
              <Ionicons name="checkmark" size={12} color={COLORS.primary} />
            )}

            <Text
              style={[
                styles.filterText,
                f.active && styles.filterTextActive,
              ]}
            >
              {f.label}
            </Text>

            <Ionicons
              name={f.active ? 'close' : 'add'}
              size={14}
              color={f.active ? COLORS.primary : COLORS.textMuted}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Results count */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>{songs.length} songs found</Text>
        <TouchableOpacity style={styles.sortBtn}>
          <Ionicons
            name="swap-vertical"
            size={16}
            color={COLORS.textSecondary}
          />
          <Text style={styles.sortText}>Sort: Trending</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={songs}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingHorizontal: SPACING.md,
          paddingBottom: 120,
        }}
        renderItem={({ item, index }) => (
          <Card style={styles.songCard}>
            <View style={styles.songRow}>
              <View
                style={[
                  styles.songNumBox,
                  { backgroundColor: item.color + '20' },
                ]}
              >
                <Text style={[styles.songNum, { color: item.color }]}>
                  {index + 1}
                </Text>
              </View>

              <View style={styles.songMid}>
                <Text style={styles.songTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <View style={styles.songMeta}>
                  <Text style={styles.songArtist}>{item.artist}</Text>
                  <Text style={styles.songBullet}>·</Text>
                  <Text style={styles.songDuration}>{item.duration}</Text>
                  <Text style={styles.songBullet}>·</Text>
                  <Text style={styles.songBpm}>{item.bpm} BPM</Text>
                </View>
              </View>

              <View style={styles.songActions}>
                <Badge label={item.genre} color={item.color} />
                <TouchableOpacity
                  style={[styles.playCircle, { backgroundColor: item.color }]}
                >
                  <Ionicons name="play" size={13} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </Card>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Ionicons
              name="musical-notes"
              size={48}
              color={COLORS.textMuted}
            />
            <Text style={styles.emptyText}>No songs match your filters</Text>
            <TouchableOpacity
              onPress={() => {
                setQuery('');
                setSelectedGenre('All');
              }}
            >
              <Text style={styles.emptyAction}>Clear filters</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
  },
  searchInput: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 14,
    paddingVertical: 11,
  },
  filterIconBtn: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primaryGlow,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary + '40',
  },

  genreScroll: {
    marginBottom: 8,
  },
  genreContent: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 4,
  },
  genreChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 8,
    minHeight: 40,
    justifyContent: 'center',
  },
  genreChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  genreText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  genreTextActive: {
    color: '#fff',
  },

  filtersRow: {
    marginBottom: SPACING.sm,
  },
  filtersContent: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 4,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 8,
    minHeight: 38,
  },
  filterChipActive: {
    backgroundColor: COLORS.primaryGlow,
    borderColor: COLORS.primary + '60',
  },
  filterText: {
    color: COLORS.textMuted,
    fontSize: 12,
    lineHeight: 16,
    marginLeft: 4,
    marginRight: 4,
  },
  filterTextActive: {
    color: COLORS.primaryLight,
  },

  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  resultsCount: {
    color: COLORS.textMuted,
    fontSize: 13,
  },
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sortText: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },

  songCard: {
    padding: SPACING.sm,
  },
  songRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  songNumBox: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  songNum: {
    fontWeight: '800',
    fontSize: 14,
  },
  songMid: {
    flex: 1,
  },
  songTitle: {
    color: COLORS.textPrimary,
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 2,
  },
  songMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  songArtist: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  songBullet: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  songDuration: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  songBpm: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  songActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  playCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 12,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 16,
  },
  emptyAction: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 14,
  },
});