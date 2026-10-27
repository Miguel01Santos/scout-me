export interface PickedPhoto {
  id: string;
  blob: Blob;
  previewUrl: string;
}

export interface PostPhotoPickerProps {
  photos: PickedPhoto[];
  isDisabled: boolean;
  onChange: (photos: PickedPhoto[]) => void;
}
