'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ApiError } from '@/src/core/api';
import { useSession } from '@/src/core/auth/use-session';
import { TextAreaField } from '@/src/core/components/textarea-field';
import { TextField } from '@/src/core/components/text-field';
import { AvatarColor, toAvatarColor } from '@/src/core/enums/avatar-color';
import { useThemeClasses } from '@/src/core/hooks/use-theme-classes';
import { useAccount } from '@/src/core/providers/account';
import { BIO_MAX_LENGTH, validateBio } from '@/src/core/utils/validate-bio';
import { validateDisplayName } from '@/src/core/utils/validate-name';
import { resolveAvatarUrl } from '@/src/core/utils/resolve-avatar-url';
import { normalizeUsername, validateUsername } from '@/src/core/utils/validate-username';
import { AvatarColorPicker } from '../avatar-color-picker';
import { AvatarEditor } from '../avatar-editor';
import { DisplayNameSwitch } from '../display-name-switch';
import { EditProfileSkeleton } from '../edit-profile-skeleton';

function EditProfileFields({ userName, avatarUrl }: { userName: string; avatarUrl?: string | null }) {
  const router = useRouter();
  const { account, updateProfile } = useAccount();
  const themeClasses = useThemeClasses();
  const savedProfile = account?.profile;
  const savedUsername = account?.username ?? '';
  const [username, setUsername] = useState(savedUsername);
  const [usernameIssue, setUsernameIssue] = useState<string>();
  const [displayName, setDisplayName] = useState(savedProfile?.displayName ?? '');
  const [showDisplayName, setShowDisplayName] = useState(savedProfile?.showDisplayName ?? true);
  const [bio, setBio] = useState(savedProfile?.bio ?? '');
  const [color, setColor] = useState<AvatarColor | null>(toAvatarColor(savedProfile?.avatarColor));
  const [feedback, setFeedback] = useState<{ message: string; isError: boolean } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentAvatarUrl = resolveAvatarUrl(savedProfile, avatarUrl);
  const nameError = validateDisplayName(displayName);
  const bioError = validateBio(bio);
  const normalizedUsername = normalizeUsername(username);
  const usernameError = usernameIssue ?? validateUsername(username);
  const hasChanges =
    normalizedUsername !== savedUsername ||
    displayName !== (savedProfile?.displayName ?? '') ||
    showDisplayName !== (savedProfile?.showDisplayName ?? true) ||
    bio !== (savedProfile?.bio ?? '') ||
    color !== toAvatarColor(savedProfile?.avatarColor);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (nameError || bioError || usernameError || !hasChanges) return;

    setFeedback(null);
    setIsSubmitting(true);

    try {
      await updateProfile({
        ...(normalizedUsername !== savedUsername && { username: normalizedUsername }),
        displayName: displayName.length > 0 ? displayName : null,
        showDisplayName,
        bio: bio.trim().length > 0 ? bio : null,
        avatarColor: color,
      });
      // O botão continua em "Salvando..." até a home abrir.
      router.replace('/home');
    } catch (error) {
      const issue =
        error instanceof ApiError
          ? error.issues.find((apiIssue) => apiIssue.field === 'username')
          : undefined;

      if (issue) {
        setUsernameIssue(issue.message);
      } else {
        setFeedback({
          message: error instanceof Error ? error.message : 'Erro inesperado. Tente novamente.',
          isError: true,
        });
      }
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`p-4 border rounded-2xl space-y-4 ${themeClasses.card}`}>
      <AvatarEditor
        name={displayName && showDisplayName ? displayName : userName}
        avatarUrl={currentAvatarUrl}
        color={color}
        onResult={setFeedback}
      />

      {feedback && (
        <p
          className={`rounded-xl border p-3 text-[11px] font-semibold ${
            feedback.isError
              ? 'border-rose-500/20 bg-rose-500/10 text-rose-400'
              : 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
          }`}
        >
          {feedback.message}
        </p>
      )}

      <div className="space-y-3">
        <TextField
          label="Nome de usuário"
          inputClassName={themeClasses.input}
          value={username}
          onChange={(value) => {
            setUsername(value);
            setUsernameIssue(undefined);
          }}
          error={usernameError}
          placeholder="ex.: andre.lima"
          autoComplete="off"
        />
        <TextField
          label="Nome do perfil"
          inputClassName={themeClasses.input}
          value={displayName}
          onChange={setDisplayName}
          error={nameError}
          placeholder={userName}
          autoComplete="off"
        />
        {displayName.length > 0 && (
          <DisplayNameSwitch
            isSelected={showDisplayName}
            displayName={displayName}
            userName={userName}
            onChange={setShowDisplayName}
          />
        )}
        <TextAreaField
          label="Descrição"
          inputClassName={themeClasses.input}
          value={bio}
          onChange={setBio}
          error={bioError}
          counter={`${bio.length}/${BIO_MAX_LENGTH}`}
          rows={4}
        />
        {!currentAvatarUrl && <AvatarColorPicker value={color} onChange={setColor} />}
      </div>

      <button
        type="submit"
        disabled={
          isSubmitting || Boolean(nameError) || Boolean(bioError) || Boolean(usernameError) || !hasChanges
        }
        className="w-full py-2.5 bg-indigo-600 enabled:hover:bg-indigo-500 text-white rounded-xl font-bold text-xs transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Salvando...' : 'Salvar'}
      </button>
    </form>
  );
}

export function EditProfileForm() {
  const { user } = useSession();
  const { isLoading } = useAccount();

  if (!user || isLoading) return <EditProfileSkeleton />;

  return <EditProfileFields userName={user.name} avatarUrl={user.avatarUrl} />;
}
