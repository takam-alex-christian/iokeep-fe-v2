//gobal types accessible accross features only

type LiveDataState = {
  selectedFolderId: string | null;
  selectedNoteId: string | null;
};

type LiveDataDispatchAction =
  | { type: "changedSelectedFolder"; payload: { folderId: string } }
  | { type: "changedSelectedNote"; payload: { noteId: string } };

type FolderDataType = {
  _id: string;
  folderName: string;
  creationDate: string;
  size?: number;
};

type AuthJsonResponse = {
  // all auth requests
  success: boolean;
  info: string;
  error: null | { message: string };
  timeStamp: number;
};

interface NoteItemDataType {
  _id: string;
  description: Array<string>; // of size 2
  creationDate: string;
  lastModified: string;
}

export type {
  LiveDataState,
  LiveDataDispatchAction,
  AuthJsonResponse,
  FolderDataType,
  NoteItemDataType,
};
