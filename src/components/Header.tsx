import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Modal,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { Session } from '../utils/session';
import { Avatar } from './UI';
import { useNavigation } from '@react-navigation/native';

const { height: SCREEN_H } = Dimensions.get('window');

const SEARCH_SUGGESTIONS = [
  'Lo-fi beats',
  'Cinematic',
  'Upbeat Pop',
  'Dark Ambient',
  'Electronic',
  'Acoustic Guitar',
  'Emotional Piano',
  'Hip Hop',
  'Trap',
  'Indie Folk',
];

const CHANNELS = [
  { id: 'channel_001', name: 'Main Channel', subscribers: '128K' },
  { id: 'channel_002', name: 'Vlogs Channel', subscribers: '42K' },
  { id: 'channel_003', name: 'Gaming Channel', subscribers: '89K' },
];

export function AppHeader() {
  const navigation = useNavigation<any>();
  const [searchText, setSearchText] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showFlyout, setShowFlyout] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [activeChannel, setActiveChannel] = useState(CHANNELS[0]);

  useEffect(() => {
    Session.getUserInfo().then(setUser);
    Session.getChannelId().then((id) => {
      const ch = CHANNELS.find((c) => c.id === id);
      if (ch) setActiveChannel(ch);
    });
  }, []);

  const handleSearch = () => {
    if (searchText.trim()) {
      setShowSearch(false);
      setShowDropdown(false);
      navigation.navigate('NotFound', { query: searchText });
    }
  };

  const handleSwitchChannel = async (ch: any) => {
    await Session.setChannelId(ch.id);
    setActiveChannel(ch);
    setShowFlyout(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* Logo */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Main', { screen: 'Home' })}
          style={styles.logo}
        >
          <Ionicons name="musical-notes" size={22} color={COLORS.primary} />
          <Text style={styles.logoText}>thematic</Text>
        </TouchableOpacity>

        {/* Nav links */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.navScroll}
          contentContainerStyle={styles.navContent}
        >
          {['Discover', 'Playlists', 'Artists', 'SFX'].map((link) => (
            <TouchableOpacity
              key={link}
              onPress={() => navigation.navigate('NotFound')}
              style={styles.navLink}
            >
              <Text style={styles.navLinkText}>{link}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Right icons */}
        <View style={styles.rightIcons}>
          <TouchableOpacity
            onPress={() => setShowSearch(true)}
            style={styles.iconBtn}
          >
            <Ionicons name="search" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowFlyout(true)}
            style={styles.avatarBtn}
            activeOpacity={0.8}
          >
            <Avatar name={user?.name || 'User'} size={32} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Modal */}
      <Modal
        visible={showSearch}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSearch(false)}
      >
        <TouchableOpacity
          style={styles.searchBackdrop}
          activeOpacity={1}
          onPress={() => {
            setShowSearch(false);
            setShowDropdown(false);
          }}
        >
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Ionicons name="search" size={18} color={COLORS.textTertiary} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search songs, artists, playlists..."
                placeholderTextColor={COLORS.textMuted}
                value={searchText}
                onChangeText={(v) => {
                  setSearchText(v);
                  setShowDropdown(true);
                }}
                autoFocus
                onSubmitEditing={handleSearch}
                returnKeyType="search"
              />
              {searchText.length > 0 && (
                <TouchableOpacity onPress={() => setSearchText('')}>
                  <Ionicons
                    name="close-circle"
                    size={18}
                    color={COLORS.textMuted}
                  />
                </TouchableOpacity>
              )}
            </View>

            {showDropdown && (
              <View style={styles.dropdown}>
                <Text style={styles.dropdownLabel}>
                  {searchText ? 'Suggestions' : 'Popular Searches'}
                </Text>

                {SEARCH_SUGGESTIONS.filter(
                  (s) =>
                    !searchText ||
                    s.toLowerCase().includes(searchText.toLowerCase())
                )
                  .slice(0, 6)
                  .map((s) => (
                    <TouchableOpacity
                      key={s}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setSearchText(s);
                        navigation.navigate('NotFound', { query: s });
                        setShowSearch(false);
                        setShowDropdown(false);
                      }}
                    >
                      <Ionicons
                        name={searchText ? 'search' : 'trending-up'}
                        size={16}
                        color={COLORS.textTertiary}
                      />
                      <Text style={styles.dropdownText}>{s}</Text>
                      <Ionicons
                        name="arrow-back"
                        size={14}
                        color={COLORS.textMuted}
                      />
                    </TouchableOpacity>
                  ))}
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* User Flyout */}
      <Modal
        visible={showFlyout}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFlyout(false)}
      >
        <TouchableOpacity
          style={styles.flyoutBackdrop}
          activeOpacity={1}
          onPress={() => setShowFlyout(false)}
        >
          <View style={styles.flyout} onStartShouldSetResponder={() => true}>
            <View style={styles.flyoutUser}>
              <Avatar name={user?.name || 'User'} size={52} color={COLORS.primary} />
              <View style={{ marginLeft: SPACING.md, flex: 1 }}>
                <Text style={styles.flyoutName}>{user?.name || 'Alex Rivera'}</Text>
                <Text style={styles.flyoutHandle}>
                  {user?.username || '@alexrivera'}
                </Text>
                <View style={styles.flyoutBadge}>
                  <Text style={styles.flyoutBadgeText}>
                    {user?.plan || 'Pro'}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.channelRow}>
              <Ionicons name="tv" size={16} color={COLORS.textSecondary} />
              <Text style={styles.channelName}>{activeChannel.name}</Text>
              <Text style={styles.channelSubs}>
                {activeChannel.subscribers} subscribers
              </Text>
            </View>

            <View style={styles.flyoutDivider} />

            <Text style={styles.flyoutSectionLabel}>Switch Channel</Text>
            {CHANNELS.map((ch) => (
              <TouchableOpacity
                key={ch.id}
                onPress={() => handleSwitchChannel(ch)}
                style={[
                  styles.channelOption,
                  activeChannel.id === ch.id && styles.channelOptionActive,
                ]}
              >
                <View
                  style={[
                    styles.channelDot,
                    {
                      backgroundColor:
                        activeChannel.id === ch.id
                          ? COLORS.primary
                          : COLORS.border,
                    },
                  ]}
                />
                <Text
                  style={[
                    styles.channelOptionText,
                    activeChannel.id === ch.id && { color: COLORS.primary },
                  ]}
                >
                  {ch.name}
                </Text>
                <Text style={styles.channelOptionSubs}>{ch.subscribers}</Text>
              </TouchableOpacity>
            ))}

            <View style={styles.flyoutDivider} />

            {[
              { label: 'My Profile', icon: 'person-outline' },
              { label: 'My Playlists', icon: 'musical-notes-outline' },
              { label: 'Settings', icon: 'settings-outline' },
              { label: 'Billing', icon: 'card-outline' },
              { label: 'Help & Support', icon: 'help-circle-outline' },
            ].map((item) => (
              <TouchableOpacity
                key={item.label}
                onPress={() => {
                  setShowFlyout(false);
                  navigation.navigate('NotFound');
                }}
                style={styles.flyoutItem}
              >
                <Ionicons
                  name={item.icon as any}
                  size={18}
                  color={COLORS.textSecondary}
                />
                <Text style={styles.flyoutItemText}>{item.label}</Text>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={COLORS.textMuted}
                />
              </TouchableOpacity>
            ))}

            <View style={styles.flyoutDivider} />

            <TouchableOpacity
              style={[styles.flyoutItem, { marginTop: 0 }]}
              onPress={() => setShowFlyout(false)}
            >
              <Ionicons
                name="log-out-outline"
                size={18}
                color={COLORS.accent}
              />
              <Text style={[styles.flyoutItemText, { color: COLORS.accent }]}>
                Sign Out
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    paddingTop: 14,
    gap: SPACING.sm,
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  logoText: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  navScroll: {
    flex: 1,
  },
  navContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  navLink: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  navLinkText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '500',
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    padding: 6,
  },
  avatarBtn: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  searchBackdrop: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    paddingTop: 80,
  },
  searchContainer: {
    marginHorizontal: SPACING.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.primary + '60',
    paddingHorizontal: SPACING.md,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 15,
    paddingVertical: 14,
  },
  dropdown: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    marginTop: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  dropdownLabel: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
    paddingBottom: 4,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: SPACING.md,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  dropdownText: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 14,
  },

  flyoutBackdrop: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'flex-end',
  },
  flyout: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: SPACING.lg,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderColor: COLORS.border,
  },
  flyoutUser: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  flyoutName: {
    color: COLORS.textPrimary,
    fontSize: 17,
    fontWeight: '700',
  },
  flyoutHandle: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
  flyoutBadge: {
    marginTop: 4,
    backgroundColor: COLORS.primaryGlow,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: COLORS.primary + '50',
  },
  flyoutBadgeText: {
    color: COLORS.primaryLight,
    fontSize: 11,
    fontWeight: '700',
  },
  channelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.surfaceAlt,
    padding: SPACING.sm,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.md,
  },
  channelName: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  channelSubs: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  flyoutDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.md,
  },
  flyoutSectionLabel: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  channelOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  channelOptionActive: {},
  channelDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  channelOptionText: {
    flex: 1,
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  channelOptionSubs: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  flyoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 12,
  },
  flyoutItemText: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 15,
  },
});