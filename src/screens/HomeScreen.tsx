import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Dimensions, ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { Card, Badge, PlaylistCover, SectionHeader, SubscriptionModal } from '../components/UI';
import { AppHeader } from '../components/Header';
import { MOCK_DATA } from '../api/thematic';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Alert } from 'react-native';
import { Image } from 'react-native';
const { width: W } = Dimensions.get('window');

const MOODS = [
  { label: 'Chill', icon: 'moon', color: COLORS.primary },
  { label: 'Energetic', icon: 'flash', color: COLORS.accent },
  { label: 'Happy', icon: 'sunny', color: COLORS.yellow },
  { label: 'Dark', icon: 'cloudy-night', color: '#5B3FD4' },
  { label: 'Romantic', icon: 'heart', color: '#FF6B9D' },
  { label: 'Focus', icon: 'eye', color: COLORS.neon },
];

export function HomeScreen() {
  const navigation = useNavigation<any>();
  const [showSub, setShowSub] = useState(false);

  return (
  <SafeAreaView style={styles.container}>
      <AppHeader />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Hero Banner */}
        <View style={styles.hero}>
          <View style={styles.heroGlow} />
          <Text style={styles.heroLabel}>✨ NEW THIS WEEK</Text>
          <Text style={styles.heroTitle}>Discover Music{'\n'}Made for Creators</Text>
          <Text style={styles.heroSub}>100% royalty-free · Copyright safe · Commercial use</Text>
          <View style={styles.heroButtons}>
            <TouchableOpacity style={styles.heroBtnPrimary} onPress={() => navigation.navigate('Playlists')}>
              <Ionicons name="musical-notes" size={18} color="#fff" />
              <Text style={styles.heroBtnText}>Browse Playlists</Text>
            </TouchableOpacity>
            <TouchableOpacity
  style={styles.heroBtnOutline}
  onPress={() => {
    Alert.alert("Pro Plan", "Start free trial?", [
      { text: "Cancel", style: "cancel" },
      { text: "OK", onPress: () => setShowSub(true) }
    ]);
  }}
>
              <Text style={[styles.heroBtnText, { color: COLORS.primaryLight }]}>Try Pro Free</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Mood filters */}
        <SectionHeader title="Browse by Mood" action="See All" onAction={() => navigation.navigate('NotFound')} />
        <ScrollView
  horizontal
  showsHorizontalScrollIndicator={false}
  style={{ marginBottom: SPACING.lg }}
  contentContainerStyle={{ paddingRight: SPACING.md, paddingVertical: 4 }}
>
          {MOODS.map(m => (
  <TouchableOpacity
    key={m.label}
    activeOpacity={0.8}
    onPress={() => Alert.alert('Mood', m.label)}
    style={[
      styles.moodChip,
      {
        borderColor: m.color + '50',
        backgroundColor: m.color + '15',
        marginRight: 8,
      },
    ]}
  >
    <Ionicons name={m.icon as any} size={16} color={m.color} />
    <Text style={[styles.moodText, { color: m.color, marginLeft: 6 }]}>
      {m.label}
    </Text>
  </TouchableOpacity>
))}
        </ScrollView>

        {/* Featured Playlists */}
        <SectionHeader title="Featured Playlists" action="View All" onAction={() => navigation.navigate('Playlists')} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: SPACING.xl }} contentContainerStyle={{ gap: 12, paddingRight: SPACING.md }}>
          {MOCK_DATA.playlists.slice(0, 4).map((p) => (
  <TouchableOpacity
    key={p.id}
    style={styles.featuredCard}
    onPress={() => navigation.navigate('PlaylistDetail', { playlistId: p.id })}
    activeOpacity={0.85}
  >
    <Image
      source={{ uri: (p as any).image || "https://picsum.photos/300" }}
      style={styles.featuredCover}
    />

    <Text style={styles.featuredName} numberOfLines={1}>
      {p.name}
    </Text>

    <Text style={styles.featuredCount}>
      {p.songCount} songs
    </Text>
  </TouchableOpacity>
))}
        </ScrollView>

        {/* Recent Pickups */}
        <SectionHeader title="Recent Pickups" action="See All" onAction={() => navigation.navigate('NotFound')} />
        <View style={styles.pickupList}>
          {MOCK_DATA.pickups.slice(0, 3).map((p, i) => (
            <Card key={p.id} style={{ marginBottom: SPACING.sm }}>
              <View style={styles.pickupRow}>
                <View style={[styles.pickupNum, { backgroundColor: p.color + '20' }]}>
                  <Text style={[styles.pickupNumText, { color: p.color }]}>{i + 1}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.pickupTitle}>{p.title}</Text>
                  <Text style={styles.pickupArtist}>{p.artist}</Text>
                </View>
                <TouchableOpacity style={styles.playBtn}>
                  <Ionicons name="play" size={14} color={COLORS.textPrimary} />
                </TouchableOpacity>
              </View>
            </Card>
          ))}
        </View>

        {/* Pro Promo */}
        <TouchableOpacity style={styles.promoBanner} onPress={() => setShowSub(true)} activeOpacity={0.9}>
          <View style={styles.promoGlow} />
          <Ionicons name="diamond" size={28} color={COLORS.primary} />
          <View style={{ flex: 1, marginLeft: SPACING.md }}>
            <Text style={styles.promoTitle}>Upgrade to Pro</Text>
            <Text style={styles.promoSub}>Unlock unlimited downloads & exclusive playlists</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </ScrollView>

      <SubscriptionModal visible={showSub} onClose={() => setShowSub(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md, paddingBottom: 100 },

  hero: { backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, padding: SPACING.lg, marginBottom: SPACING.xl, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden', position: 'relative' },
  heroGlow: { position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: 80, backgroundColor: COLORS.primaryGlow },
  heroLabel: { color: COLORS.primaryLight, fontSize: 11, fontWeight: '800', letterSpacing: 1.5, marginBottom: 8 },
  heroTitle: { color: COLORS.textPrimary, fontSize: 26, fontWeight: '900', lineHeight: 32, marginBottom: 8 },
  heroSub: { color: COLORS.textSecondary, fontSize: 13, marginBottom: SPACING.lg },
  heroButtons: { flexDirection: 'row', gap: 10 },
  heroBtnPrimary: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: COLORS.primary, paddingHorizontal: 18, paddingVertical: 11, borderRadius: RADIUS.md },
  heroBtnOutline: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 11, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.primary },
  heroBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },

moodChip: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 14,
  paddingVertical: 9,
  borderRadius: RADIUS.full,
  borderWidth: 1,
  marginRight: 8,
},  moodText: { fontSize: 13, fontWeight: '600' },

  featuredCard: { width: 140 },
  featuredCover: { width: 140, height: 140, borderRadius: RADIUS.lg, alignItems: 'center', justifyContent: 'center', marginBottom: 8, borderWidth: 1 },
  featuredName: { color: COLORS.textPrimary, fontWeight: '700', fontSize: 14, marginBottom: 2 },
  featuredCount: { color: COLORS.textMuted, fontSize: 12 },

  pickupList: {},
  pickupRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  pickupNum: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  pickupNumText: { fontWeight: '800', fontSize: 14 },
  pickupTitle: { color: COLORS.textPrimary, fontWeight: '600', fontSize: 14 },
  pickupArtist: { color: COLORS.textSecondary, fontSize: 12, marginTop: 2 },
  playBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },

  promoBanner: { backgroundColor: COLORS.card, borderRadius: RADIUS.lg, padding: SPACING.md, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: COLORS.primary + '40', marginTop: SPACING.md, overflow: 'hidden' },
  promoGlow: { position: 'absolute', left: -20, top: -20, width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.primaryGlow },
  promoTitle: { color: COLORS.textPrimary, fontWeight: '700', fontSize: 15 },
  promoSub: { color: COLORS.textSecondary, fontSize: 12, marginTop: 2 },
});
