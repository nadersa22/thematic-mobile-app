import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  AUTH_TOKEN: 'thematic_auth_token',
  TEAM_ID: 'thematic_team_id',
  CHANNEL_ID: 'thematic_channel_id',
  USER_INFO: 'thematic_user_info',
};

export const Session = {
  async setAuthToken(token: string) {
    await AsyncStorage.setItem(KEYS.AUTH_TOKEN, token);
  },
  async getAuthToken(): Promise<string | null> {
    return AsyncStorage.getItem(KEYS.AUTH_TOKEN);
  },
  async setTeamId(id: string) {
    await AsyncStorage.setItem(KEYS.TEAM_ID, id);
  },
  async getTeamId(): Promise<string | null> {
    return AsyncStorage.getItem(KEYS.TEAM_ID);
  },
  async setChannelId(id: string) {
    await AsyncStorage.setItem(KEYS.CHANNEL_ID, id);
  },
  async getChannelId(): Promise<string | null> {
    return AsyncStorage.getItem(KEYS.CHANNEL_ID);
  },
  async setUserInfo(user: any) {
    await AsyncStorage.setItem(KEYS.USER_INFO, JSON.stringify(user));
  },
  async getUserInfo(): Promise<any | null> {
    const raw = await AsyncStorage.getItem(KEYS.USER_INFO);
    return raw ? JSON.parse(raw) : null;
  },
  async clearAll() {
    await Promise.all(Object.values(KEYS).map(k => AsyncStorage.removeItem(k)));
  },
};

const CURRENT_AUTH_TOKEN = 'c95e90bcda5c440f2c364fe7f3370a43';


export async function initDefaultSession() {

  await Session.setAuthToken(CURRENT_AUTH_TOKEN);

  const teamId = await Session.getTeamId();
  if (!teamId) {
    await Session.setTeamId('team_001');
    await Session.setChannelId('channel_001');
    await Session.setUserInfo({
      id: 'user_001',
      name: 'Alex Rivera',
      username: '@alexrivera',
      email: 'alex@example.com',
      avatar: null,
      plan: 'Pro',
      subscribers: '128K',
    });
  }
}
