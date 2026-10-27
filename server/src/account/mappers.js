export function toPublicConfiguration(configuration) {
  return {
    theme: configuration.theme,
    language: configuration.language,
    notifications: configuration.notifications,
  };
}

export function toPublicProfile(profile, avatarUrl) {
  return {
    avatarUrl: avatarUrl ?? null,
    displayName: profile?.displayName ?? null,
    showDisplayName: profile?.showDisplayName ?? true,
    bio: profile?.bio ?? null,
    avatarColor: profile?.avatarColor ?? null,
  };
}

export function toPublicPlayerAttributes(attributes) {
  return {
    preferredFoot: attributes?.preferredFoot ?? null,
    position: attributes?.position ?? null,
    category: attributes?.category ?? null,
  };
}

export function toProfileCard(account) {
  return {
    username: account.username,
    type: account.type,
    name: account.user.name,
    displayName: account.profile?.displayName ?? null,
    showDisplayName: account.profile?.showDisplayName ?? true,
    avatarUrl: account.user.avatarUrl ?? null,
    avatarColor: account.profile?.avatarColor ?? null,
  };
}

export function toDisplayName(account) {
  const profile = account.profile;

  return profile?.displayName && profile.showDisplayName ? profile.displayName : account.user.name;
}
