import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Alert, ActivityIndicator, ScrollView, RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { AppHeader } from '../components/Header';
import { Button, Badge, Card, EditModal, SectionHeader, useToast } from '../components/UI';
import { ThematicAPI, MOCK_DATA } from '../api/thematic';
import { useNavigation, useRoute } from '@react-navigation/native';

const PAGE_SIZE = 15;

export function PlaylistDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { playlistId = '1' } = route.params || {};

  const [playlist, setPlaylist] = useState<any>({
    id: playlistId,
    name: 'My Awesome Playlist',
    description: 'A curated collection of the best royalty-free music for your content',
    songCount: 20,
    color: COLORS.primary,
  });
  const [songs, setSongs] = useState<any[]>([]);
  const [pickups, setPickups] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalSongs, setTotalSongs] = useState(20);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState<string | null>(null);
  const [showEditName, setShowEditName] = useState(false);
  const [showEditDesc, setShowEditDesc] = useState(false);
  const [saving, setSaving] = useState(false);
  const [nowPlaying, setNowPlaying] = useState<string | null>(null);
  const { show, ToastComponent } = useToast();

  useEffect(() => {
    loadInitial();
  }, []);

  const loadInitial = async () => {
    try {
      const [proj, songData, pickupData] = await Promise.all([
        ThematicAPI.getProject(playlistId),
        ThematicAPI.getSongs(playlistId, 1, PAGE_SIZE),
        ThematicAPI.getPickups(playlistId),
      ]);

      debugger
      setPlaylist(proj);
      setSongs(songData.songs || []);
      setTotalSongs(songData.total || 0);
      setPickups(pickupData.pickups || []);
    } catch {
      setSongs(MOCK_DATA.songs.slice(0, PAGE_SIZE));
      setTotalSongs(MOCK_DATA.songs.length);
      setPickups(MOCK_DATA.pickups);
    }
  };

  const loadMore = async () => {
    if (loadingMore || songs.length >= totalSongs) return;
    setLoadingMore(true);
    try {
      const next = page + 1;
      const data = await ThematicAPI.getSongs(playlistId, next, PAGE_SIZE);
      setSongs(prev => [...prev, ...(data.songs || [])]);
      setPage(next);
    } catch {
      // const nextBatch = MOCK_DATA.songs.slice(songs.length, songs.length + PAGE_SIZE);
      // setSongs(prev => [...prev, ...nextBatch]);
      // setPage(p => p + 1);
    }
    setLoadingMore(false);
  };

  const handleDelete = (song: any) => {
    Alert.alert('Remove Song', `Remove "${song.title}" from this playlist?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove', style: 'destructive',
        onPress: async () => {
          setLoadingDelete(song.id);
          try {
            await ThematicAPI.deleteSong(playlistId, song.id);
          } catch {}
          setSongs(prev => prev.filter(s => s.id !== song.id));
          setTotalSongs(t => t - 1);
          setLoadingDelete(null);
          show('Song removed from playlist', 'success');
        }
      }
    ]);
  };

  const handleSaveName = async (values: any) => {
    setSaving(true);
    try {
      await ThematicAPI.updateProject(playlistId, { name: values.name });
    } catch {}
    setPlaylist((p: any) => ({ ...p, name: values.name }));
    setSaving(false);
    setShowEditName(false);
    show('Playlist name updated!');
  };

  const handleSaveDesc = async (values: any) => {
    setSaving(true);
    try {
      await ThematicAPI.updateProject(playlistId, { description: values.description });
    } catch {}
    setPlaylist((p: any) => ({ ...p, description: values.description }));
    setSaving(false);
    setShowEditDesc(false);
    show('Description updated!');
  };

  const allLoaded = songs.length >= totalSongs;
  const showLoadMore = !allLoaded && totalSongs > PAGE_SIZE;

  const renderSong = ({ item, index }: any) => (
    <View style={styles.songRow}>
      <View style={styles.songLeft}>
        <Text style={styles.songIndex}>{index + 1}</Text>
        <View style={[styles.songDot, { backgroundColor: item.color }]} />
        <View style={styles.songInfo}>
          <Text style={styles.songTitle} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.songArtist}>{item.artist}</Text>
        </View>
      </View>
      <View style={styles.songRight}>
        <Badge label={item.genre} color={item.color} />
        <Text style={styles.songDuration}>{item.duration}</Text>
        <TouchableOpacity
          style={[styles.playBtn, nowPlaying === item.id && styles.playBtnActive]}
          onPress={() => setNowPlaying(nowPlaying === item.id ? null : item.id)}
        >
          <Ionicons name={nowPlaying === item.id ? 'pause' : 'play'} size={14} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDelete(item)}
          disabled={loadingDelete === item.id}
          style={styles.deleteBtn}
        >
          {loadingDelete === item.id
            ? <ActivityIndicator size="small" color={COLORS.accent} />
            : <Ionicons name="trash-outline" size={16} color={COLORS.textMuted} />}
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <AppHeader />

      <FlatList
        data={songs}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 120 }}
        refreshControl={<RefreshControl refreshing={false} onRefresh={loadInitial} tintColor={COLORS.primary} />}
        ListHeaderComponent={() => (
          <View>
            {/* Playlist Header */}
            <View style={styles.playlistHeader}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                <Ionicons name="chevron-back" size={22} color={COLORS.textSecondary} />
              </TouchableOpacity>

              <View style={[styles.bigCover, { backgroundColor: playlist.color + '20', borderColor: playlist.color + '40' }]}>
                <Ionicons name="musical-notes" size={44} color={playlist.color} />
              </View>

              <View style={styles.playlistMeta}>
                <View style={styles.nameRow}>
                  <Text style={styles.playlistName}>{playlist.name}</Text>
                  <TouchableOpacity onPress={() => setShowEditName(true)} style={styles.editIconBtn}>
                    <Ionicons name="pencil" size={15} color={COLORS.primary} />
                  </TouchableOpacity>
                </View>

                <View style={styles.descRow}>
                  <Text style={styles.playlistDesc} numberOfLines={2}>{playlist.description}</Text>
                  <TouchableOpacity onPress={() => setShowEditDesc(true)} style={styles.editIconBtn}>
                    <Ionicons name="pencil" size={15} color={COLORS.primary} />
                  </TouchableOpacity>
                </View>

                <View style={styles.statsRow}>
                  <View style={styles.statChip}>
                    <Ionicons name="musical-note" size={13} color={COLORS.textMuted} />
                    <Text style={styles.statText}>{totalSongs} songs</Text>
                  </View>
                  <TouchableOpacity style={styles.shareBtn} onPress={() => show('Share link copied!', 'info')}>
                    <Ionicons name="share-social" size={14} color={COLORS.textSecondary} />
                    <Text style={styles.shareBtnText}>Share</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Recent Pickups */}
            {pickups.length > 0 && (
              <View style={styles.section}>
                <SectionHeader title="Recent Pickups" />
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
                  {pickups.map(p => (
                    <View key={p.id} style={[styles.pickupCard, { borderColor: p.color + '40', backgroundColor: p.color + '10' }]}>
                      <View style={[styles.pickupDot, { backgroundColor: p.color }]} />
                      <Text style={styles.pickupTitle} numberOfLines={1}>{p.title}</Text>
                      <Text style={styles.pickupArtist}>{p.artist}</Text>
                      <Text style={styles.pickupTime}>{new Date(p.pickedAt).toLocaleDateString()}</Text>
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}

            <View style={styles.songListHeader}>
              <Text style={styles.songListTitle}>Songs</Text>
              <Text style={styles.songListCount}>{songs.length} of {totalSongs}</Text>
            </View>
          </View>
        )}
        renderItem={renderSong}
        ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: COLORS.border, marginLeft: 16 }} />}
        ListFooterComponent={() => (
          <View>
            {showLoadMore && (
              <TouchableOpacity style={styles.loadMoreBtn} onPress={loadMore} disabled={loadingMore}>
                {loadingMore
                  ? <ActivityIndicator size="small" color={COLORS.primary} />
                  : <>
                    <Ionicons name="arrow-down-circle" size={18} color={COLORS.primary} />
                    <Text style={styles.loadMoreText}>Load More Songs ({totalSongs - songs.length} remaining)</Text>
                  </>}
              </TouchableOpacity>
            )}
            {allLoaded && songs.length > 0 && (
              <Text style={styles.allLoadedText}>✓ All {totalSongs} songs loaded</Text>
            )}
          </View>
        )}
      />

      {/* Now Playing Mini Bar */}
      {nowPlaying && (
        <View style={styles.nowPlayingBar}>
          <View style={styles.npDot} />
          <Text style={styles.npTitle} numberOfLines={1}>
            {songs.find(s => s.id === nowPlaying)?.title} — {songs.find(s => s.id === nowPlaying)?.artist}
          </Text>
          <TouchableOpacity onPress={() => setNowPlaying(null)}>
            <Ionicons name="close" size={18} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>
      )}

      {ToastComponent}

      {/* Edit Name Modal */}
      <EditModal
        visible={showEditName}
        title="Edit Playlist Name"
        fields={[{ key: 'name', label: 'Playlist Name', value: playlist.name, placeholder: 'Enter playlist name' }]}
        onSave={handleSaveName}
        onClose={() => setShowEditName(false)}
        loading={saving}
      />

      {/* Edit Description Modal */}
      <EditModal
        visible={showEditDesc}
        title="Edit Description"
        fields={[{ key: 'description', label: 'Description', value: playlist.description, placeholder: 'Describe your playlist...', multiline: true }]}
        onSave={handleSaveDesc}
        onClose={() => setShowEditDesc(false)}
        loading={saving}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  playlistHeader: { padding: SPACING.md, paddingTop: SPACING.sm },
  backBtn: { marginBottom: SPACING.md },
  bigCover: { width: 120, height: 120, borderRadius: RADIUS.xl, alignItems: 'center', justifyContent: 'center', borderWidth: 1, marginBottom: SPACING.md, alignSelf: 'center' },

  playlistMeta: {},
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  playlistName: { color: COLORS.textPrimary, fontSize: 22, fontWeight: '800', flex: 1 },
  editIconBtn: { width: 30, height: 30, borderRadius: 15, backgroundColor: COLORS.primaryGlow, alignItems: 'center', justifyContent: 'center' },
  descRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: SPACING.sm },
  playlistDesc: { color: COLORS.textSecondary, fontSize: 14, lineHeight: 20, flex: 1 },
  statsRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  statChip: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statText: { color: COLORS.textMuted, fontSize: 13 },
  shareBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 6, borderRadius: RADIUS.full, borderWidth: 1, borderColor: COLORS.border },
  shareBtnText: { color: COLORS.textSecondary, fontSize: 12, fontWeight: '600' },

  section: { paddingHorizontal: SPACING.md, marginBottom: SPACING.md },

  pickupCard: { width: 130, borderRadius: RADIUS.md, padding: SPACING.sm, borderWidth: 1 },
  pickupDot: { width: 8, height: 8, borderRadius: 4, marginBottom: 4 },
  pickupTitle: { color: COLORS.textPrimary, fontWeight: '600', fontSize: 13 },
  pickupArtist: { color: COLORS.textSecondary, fontSize: 11, marginTop: 2 },
  pickupTime: { color: COLORS.textMuted, fontSize: 10, marginTop: 4 },

  songListHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderTopWidth: 1, borderColor: COLORS.border },
  songListTitle: { color: COLORS.textPrimary, fontWeight: '700', fontSize: 16 },
  songListCount: { color: COLORS.textMuted, fontSize: 13 },

  songRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.md, paddingVertical: 12, backgroundColor: COLORS.background },
  songLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  songIndex: { color: COLORS.textMuted, fontSize: 13, width: 22, textAlign: 'center' },
  songDot: { width: 6, height: 6, borderRadius: 3 },
  songInfo: { flex: 1 },
  songTitle: { color: COLORS.textPrimary, fontWeight: '600', fontSize: 14 },
  songArtist: { color: COLORS.textSecondary, fontSize: 12, marginTop: 1 },
  songRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  songDuration: { color: COLORS.textMuted, fontSize: 12 },
  playBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
  playBtnActive: { backgroundColor: COLORS.accent },
  deleteBtn: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },

  loadMoreBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: SPACING.md, margin: SPACING.md, backgroundColor: COLORS.primaryGlow, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.primary + '40' },
  loadMoreText: { color: COLORS.primaryLight, fontWeight: '600', fontSize: 14 },
  allLoadedText: { color: COLORS.textMuted, textAlign: 'center', fontSize: 13, padding: SPACING.md },

  nowPlayingBar: { position: 'absolute', bottom: 80, left: SPACING.md, right: SPACING.md, backgroundColor: COLORS.card, borderRadius: RADIUS.lg, flexDirection: 'row', alignItems: 'center', gap: 10, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.primary + '50', shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 10 },
  npDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.neon },
  npTitle: { flex: 1, color: COLORS.textPrimary, fontSize: 13, fontWeight: '600' },
});
