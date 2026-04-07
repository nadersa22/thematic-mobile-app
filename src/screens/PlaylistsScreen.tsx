import React, { useState, useCallback, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  FlatList, Animated, PanResponder, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { AppHeader } from '../components/Header';
import { Badge, SectionHeader, PlaylistCover } from '../components/UI';
import { MOCK_DATA } from '../api/thematic';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Playlist = typeof MOCK_DATA.playlists[0];

function DraggablePlaylistItem({ item, index, onDragStart, isActive, onPress }: any) {
  const scale = useRef(new Animated.Value(1)).current;

  return (
    <Animated.View style={[styles.playlistItem, isActive && styles.playlistItemActive, { transform: [{ scale }] }]}>
      <TouchableOpacity
        style={styles.dragHandle}
        onLongPress={() => onDragStart(index)}
      >
        <Ionicons name="reorder-two" size={22} color={COLORS.textMuted} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.playlistContent}
        activeOpacity={0.8}
        onPress={onPress}
      >
        <View style={[styles.cover, { backgroundColor: item.color + '20', borderColor: item.color + '40' }]}>
          <Ionicons name="musical-notes" size={24} color={item.color} />
        </View>
        <View style={styles.playlistInfo}>
          <Text style={styles.playlistName}>{item.name}</Text>
          <Text style={styles.playlistDesc} numberOfLines={1}>{item.description}</Text>
          <View style={styles.playlistMeta}>
            <Ionicons name="musical-note" size={12} color={COLORS.textMuted} />
            <Text style={styles.metaText}>{item.songCount} songs</Text>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.moreBtn}>
        <Ionicons name="ellipsis-horizontal" size={18} color={COLORS.textMuted} />
      </TouchableOpacity>
    </Animated.View>
  );
}

export function PlaylistsScreen() {
  const navigation = useNavigation<any>();
  const [playlists, setPlaylists] = useState(MOCK_DATA.playlists);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragIndex = useRef<number | null>(null);
  const dragY = useRef(new Animated.Value(0)).current;
  const ITEM_HEIGHT = 84;

  const moveItem = (from: number, to: number) => {
    const updated = [...playlists];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    setPlaylists(updated);
  };

  const handleDragStart = (index: number) => {
    dragIndex.current = index;
    setActiveIndex(index);
    setIsDragging(true);
    Alert.alert(
      'Reorder Playlist',
      `Move "${playlists[index].name}" to:`,
      [
        ...playlists.map((p, i) => i !== index ? {
          text: `${i + 1}. ${p.name}`,
          onPress: () => {
            moveItem(index, i);
            setActiveIndex(null);
            setIsDragging(false);
          }
        } : null).filter(Boolean) as any,
        { text: 'Cancel', style: 'cancel', onPress: () => { setActiveIndex(null); setIsDragging(false); } }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader />
      <View style={styles.pageHeader}>
        <View>
          <Text style={styles.pageTitle}>My Playlists</Text>
          <Text style={styles.pageSubtitle}>{playlists.length} playlists · Hold & drag to reorder</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('NotFound')}>
          <Ionicons name="add" size={20} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>

      <View style={styles.hint}>
        <Ionicons name="information-circle" size={15} color={COLORS.primary} />
        <Text style={styles.hintText}>Long-press the ≡ icon to drag and reorder your playlists</Text>
      </View>

      <FlatList
        data={playlists}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 120 }}
        renderItem={({ item, index }) => (
          <DraggablePlaylistItem
            item={item}
            index={index}
            onDragStart={handleDragStart}
            isActive={activeIndex === index}
            onPress={() => navigation.navigate('PlaylistDetail', { playlistId: item.id })}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: COLORS.border, marginHorizontal: SPACING.md }} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  pageHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.md, paddingTop: SPACING.md, paddingBottom: 4 },
  pageTitle: { color: COLORS.textPrimary, fontSize: 22, fontWeight: '800' },
  pageSubtitle: { color: COLORS.textMuted, fontSize: 13, marginTop: 2 },
  addBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },

  hint: { flexDirection: 'row', alignItems: 'center', gap: 6, marginHorizontal: SPACING.md, marginBottom: SPACING.md, backgroundColor: COLORS.primaryGlow, padding: SPACING.sm, borderRadius: RADIUS.sm },
  hintText: { color: COLORS.primaryLight, fontSize: 12, flex: 1 },

  playlistItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, backgroundColor: COLORS.background },
  playlistItemActive: { backgroundColor: COLORS.card, shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 8, borderRadius: RADIUS.md },
  dragHandle: { padding: 8, marginRight: 4 },
  playlistContent: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  cover: { width: 56, height: 56, borderRadius: RADIUS.md, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  playlistInfo: { flex: 1 },
  playlistName: { color: COLORS.textPrimary, fontSize: 15, fontWeight: '700' },
  playlistDesc: { color: COLORS.textSecondary, fontSize: 13, marginTop: 2 },
  playlistMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  metaText: { color: COLORS.textMuted, fontSize: 12 },
  moreBtn: { padding: 8 },
});
