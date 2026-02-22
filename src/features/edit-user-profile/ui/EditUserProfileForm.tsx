import ImageField from "@/shared/ui/form/ImageField";
import TextAreaField from "@/shared/ui/form/TextAreaField";
import TextField from "@/shared/ui/form/TextField";

export default function EditUserProfileForm() {
  return (
    <div className="flex flex-col gap-7">
      <ImageField urlName="profileImagePath" fileName="profileImageFile" label="프로필 이미지" />
      <TextField
        name="nickname"
        label="닉네임"
        placeholder="닉네임을 작성해주세요. (최대 20자)"
        helperText="공백 포함 최대 20자의 닉네임을 만들어주세요."
        maxLength={20}
      />
      <TextAreaField
        name="leaderIntro"
        label="모임장 소개글"
        placeholder={`예) 안녕하세요! 토론을 좋아하는 모임장 토리입니다.\n매주 1회, 부담 없이 읽고 핵심 질문 3개로 깊게 이야기해요.`}
        helperText="모임 운영 스타일과 분위기를 간단히 소개해요."
        maxLength={300}
      />
      <TextAreaField
        name="memberIntro"
        label="모임원 소개글"
        placeholder={`예) 책은 천천히 읽지만 끝까지 읽는 편이에요.\n의견을 말할 땐 근거를 들어 설명하려고 하고, 다른 관점도 환영해요.`}
        helperText="참여 방식과 토론 성향을 간단히 소개해요."
        maxLength={300}
      />
    </div>
  );
}
