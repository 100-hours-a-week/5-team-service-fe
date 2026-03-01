import BookSelectField from "@/shared/ui/form/BookSelectField";
import TextField from "@/shared/ui/form/TextField";

export default function CreateChatStep1() {
  return (
    <>
      <BookSelectField
        name="isbn"
        label="토론 도서"
        returnTo="/chat/create/1"
        emptyText="탭하여 도서 검색하기"
      />
      <TextField
        name="topic"
        label="토론 주제"
        helperText="토론 주제는 찬반 입장이 나뉠 수 있는 주제여야 해요."
        placeholder="토론 주제를 입력해주세요."
        maxLength={50}
      />
      <TextField
        name="description"
        label="토론 설명"
        helperText="토론 주제에 대한 부가 설명을 해주세요."
        placeholder="토론 설명을 입력해주세요."
        maxLength={50}
      />
    </>
  );
}
